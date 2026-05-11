/**
 * Cloudflare Worker: Secrets Manager
 * Handles secret rotation and audit logging for Zero Trust
 */

interface Env {
  SECRETS_KV: KVNamespace;
  AUDIT_KV: KVNamespace;
  ENVIRONMENT: string;
}

interface SecretMetadata {
  key: string;
  lastRotation: string;
  rotationScheduleDays: number;
  rotatedBy: string;
}

interface AuditLog {
  timestamp: string;
  action: 'read' | 'rotate' | 'create' | 'delete';
  secretKey: string;
  userId: string;
  ipAddress: string;
  success: boolean;
  metadata?: Record<string, unknown>;
}

const SECRET_KEYS = [
  'ANTHROPIC_API_KEY',
  'SUPABASE_JWT_SECRET',
];

async function logAudit(event: AuditLog, env: Env): Promise<void> {
  const logKey = `audit:${event.timestamp}:${Math.random().toString(36).substr(2, 9)}`;
  await env.AUDIT_KV.put(logKey, JSON.stringify(event));
}

async function getSecret(key: string, env: Env, requesterId: string, ip: string): Promise<{ value: string | null; error?: string }> {
  const value = await env.SECRETS_KV.get(key);

  await logAudit({
    timestamp: new Date().toISOString(),
    action: 'read',
    secretKey: key,
    userId: requesterId,
    ipAddress: ip,
    success: !!value,
  }, env);

  if (!value) {
    return { value: null, error: `Secret ${key} not found` };
  }

  return { value };
}

async function rotateSecret(key: string, newValue: string, env: Env, userId: string, ip: string): Promise<{ success: boolean; error?: string }> {
  const metadataKey = `metadata:${key}`;
  const existing = await env.SECRETS_KV.get(metadataKey);

  let metadata: SecretMetadata = {
    key,
    lastRotation: new Date().toISOString(),
    rotationScheduleDays: 90,
    rotatedBy: userId,
  };

  if (existing) {
    const parsed = JSON.parse(existing) as SecretMetadata;
    metadata = { ...parsed, lastRotation: new Date().toISOString(), rotatedBy: userId };
  }

  await env.SECRETS_KV.put(key, newValue);
  await env.SECRETS_KV.put(metadataKey, JSON.stringify(metadata));

  await logAudit({
    timestamp: new Date().toISOString(),
    action: 'rotate',
    secretKey: key,
    userId,
    ipAddress: ip,
    success: true,
    metadata: { previousRotation: metadata.lastRotation },
  }, env);

  return { success: true };
}

async function checkRotationDue(env: Env): Promise<{ key: string; due: boolean; daysSinceRotation: number }[]> {
  const results: { key: string; due: boolean; daysSinceRotation: number }[] = [];

  for (const key of SECRET_KEYS) {
    const metadataKey = `metadata:${key}`;
    const metadata = await env.SECRETS_KV.get(metadataKey);

    if (!metadata) {
      results.push({ key, due: true, daysSinceRotation: 999 });
      continue;
    }

    const parsed = JSON.parse(metadata) as SecretMetadata;
    const lastRotation = new Date(parsed.lastRotation);
    const now = new Date();
    const daysSince = Math.floor((now.getTime() - lastRotation.getTime()) / (1000 * 60 * 60 * 24));

    results.push({
      key,
      due: daysSince >= parsed.rotationScheduleDays,
      daysSinceRotation: daysSince,
    });
  }

  return results;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    const authHeader = request.headers.get('Authorization');
    const requesterId = request.headers.get('X-User-Id') || 'system';
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';

    if (!authHeader || authHeader !== `Bearer ${env.ENVIRONMENT}-secret-manager`) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (path === '/secrets' && request.method === 'GET') {
      const key = url.searchParams.get('key');
      if (!key) {
        return new Response(JSON.stringify({ error: 'Missing key parameter' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const result = await getSecret(key, env, requesterId, ip);
      if (result.error) {
        return new Response(JSON.stringify({ error: result.error }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ key, value: result.value }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (path === '/secrets/rotate' && request.method === 'POST') {
      const body = await request.json() as { key: string; value: string };
      if (!body.key || !body.value) {
        return new Response(JSON.stringify({ error: 'Missing key or value' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const result = await rotateSecret(body.key, body.value, env, requesterId, ip);
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (path === '/secrets/rotation-status' && request.method === 'GET') {
      const status = await checkRotationDue(env);
      return new Response(JSON.stringify({ secrets: status }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  },
};