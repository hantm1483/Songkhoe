/**
 * Cloudflare Worker: Audit Logger
 * Logs all security events for Zero Trust compliance
 */

interface Env {
  AUDIT_KV: KVNamespace;
  ENVIRONMENT: string;
}

interface SecurityEvent {
  timestamp: string;
  eventType: 'auth_failure' | 'rate_limit' | 'secret_access' | 'deploy' | 'config_change';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  ipAddress: string;
  userAgent: string;
  path: string;
  method: string;
  metadata?: Record<string, unknown>;
}

const SEVERITY_THRESHOLDS = {
  low: 0,
  medium: 5,
  high: 10,
  critical: 20,
};

function calculateSeverity(count: number): 'low' | 'medium' | 'high' | 'critical' {
  if (count >= SEVERITY_THRESHOLDS.critical) return 'critical';
  if (count >= SEVERITY_THRESHOLDS.high) return 'high';
  if (count >= SEVERITY_THRESHOLDS.medium) return 'medium';
  return 'low';
}

function sanitizeInput(input: string): string {
  return input.replace(/[<>\"'&]/g, '');
}

async function logSecurityEvent(event: SecurityEvent, env: Env): Promise<void> {
  const eventKey = `security:${event.timestamp}:${Math.random().toString(36).substr(2, 9)}`;
  await env.AUDIT_KV.put(eventKey, JSON.stringify(event));

  if (event.eventType === 'auth_failure') {
    const failureKey = `failures:${event.ipAddress}`;
    const currentFailures = await env.AUDIT_KV.get(failureKey);
    const count = currentFailures ? parseInt(currentFailures, 10) + 1 : 1;

    await env.AUDIT_KV.put(failureKey, count.toString(), { expirationTtl: 3600 });

    if (count >= 5) {
      const alertKey = `alert:auth_failure:${event.ipAddress}`;
      const alert = {
        timestamp: new Date().toISOString(),
        type: 'auth_failure_threshold',
        severity: calculateSeverity(count),
        ipAddress: event.ipAddress,
        failureCount: count,
      };
      await env.AUDIT_KV.put(alertKey, JSON.stringify(alert));
    }
  }
}

async function getSecurityMetrics(env: Env): Promise<Record<string, unknown>> {
  const now = Date.now();
  const oneHourAgo = now - 3600000;
  const oneDayAgo = now - 86400000;

  let authFailuresLastHour = 0;
  let rateLimitsLastHour = 0;

  const keys = await env.AUDIT_KV.list({ prefix: 'security:' });

  for (const key of keys.keys) {
    const timestamp = key.name.split(':')[1];
    const eventTime = new Date(timestamp).getTime();

    if (eventTime >= oneHourAgo) {
      const eventData = await env.AUDIT_KV.get(key.name);
      if (eventData) {
        const event = JSON.parse(eventData) as SecurityEvent;
        if (event.eventType === 'auth_failure') authFailuresLastHour++;
        if (event.eventType === 'rate_limit') rateLimitsLastHour++;
      }
    }
  }

  return {
    auth_failures_last_hour: authFailuresLastHour,
    rate_limits_last_hour: rateLimitsLastHour,
    alert_triggered: authFailuresLastHour >= 5,
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const userAgent = request.headers.get('User-Agent') || 'unknown';

    if (path === '/log' && request.method === 'POST') {
      const body = await request.json() as Partial<SecurityEvent>;

      const event: SecurityEvent = {
        timestamp: new Date().toISOString(),
        eventType: body.eventType || 'config_change',
        severity: body.severity || 'low',
        userId: body.userId,
        ipAddress: ip,
        userAgent,
        path: body.path || '/',
        method: body.method || 'POST',
        metadata: body.metadata,
      };

      await logSecurityEvent(event, env);

      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (path === '/metrics' && request.method === 'GET') {
      const metrics = await getSecurityMetrics(env);
      return new Response(JSON.stringify(metrics), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (path === '/health' && request.method === 'GET') {
      return new Response(JSON.stringify({
        status: 'healthy',
        environment: env.ENVIRONMENT,
        timestamp: new Date().toISOString(),
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  },
};