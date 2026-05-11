/**
 * Cloudflare Worker for JWT Verification (Edge Authentication)
 * Zero Trust: Verify JWT at edge before allowing request to proceed
 */

interface Env {
  SUPABASE_JWT_SECRET: string;
  SECRETS_KV: KVNamespace;
  ENVIRONMENT: string;
}

interface JwtPayload {
  sub: string;
  email?: string;
  aud: string;
  exp: number;
  iat: number;
}

const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/',
  '/_next',
  '/favicon.ico',
  '/api/auth',
];

const PROTECTED_PATHS = [
  '/trangchu',
  '/bua-an',
  '/thuoc',
  '/nhatky',
  '/xet-nghiem',
  '/kien-thuc',
  '/troly-ai',
  '/memory',
  '/profile',
];

function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - base64.length % 4) % 4);
  return atob(base64 + padding);
}

function verifyJwt(token: string, secret: string): JwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, payload, signature] = parts;
    const signatureInput = `${header}.${payload}`;
    const signatureBytes = base64UrlDecode(signature);
    const encoder = new TextEncoder();
    const key = encoder.encode(secret);

    let algorithm = 'HMAC';
    let hash = 'SHA-256';

    const headerObj = JSON.parse(base64UrlDecode(header));
    if (headerObj.alg === 'RS256') {
      algorithm = 'RSA';
      hash = 'SHA-256';
    }

    let isValid = false;
    try {
      const cryptoKey = crypto.subtle.importKey(
        algorithm === 'HMAC' ? 'raw' : 'spki',
        algorithm === 'HMAC' ? key : base64UrlDecode(secret),
        { name: algorithm, hash },
        false,
        ['verify']
      );

      const sigBytes = new Uint8Array(signatureBytes.length);
      for (let i = 0; i < signatureBytes.length; i++) {
        sigBytes[i] = signatureBytes.charCodeAt(i);
      }

      isValid = crypto.subtle.verify(
        { name: algorithm, hash },
        cryptoKey as CryptoKey,
        sigBytes,
        encoder.encode(signatureInput)
      ) as unknown as boolean;
    } catch {
      const cryptoKey = crypto.subtle.importKey(
        'raw',
        key,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['verify']
      );

      const sigBytes = new Uint8Array(signatureBytes.length);
      for (let i = 0; i < signatureBytes.length; i++) {
        sigBytes[i] = signatureBytes.charCodeAt(i);
      }

      isValid = crypto.subtle.verify(
        { name: 'HMAC', hash: 'SHA-256' },
        cryptoKey as CryptoKey,
        sigBytes,
        encoder.encode(signatureInput)
      ) as boolean;
    }

    if (!isValid) return null;

    const payloadObj: JwtPayload = JSON.parse(base64UrlDecode(payload));
    const now = Math.floor(Date.now() / 1000);

    if (payloadObj.exp && payloadObj.exp < now) {
      return null;
    }

    return payloadObj;
  } catch {
    return null;
  }
}

function isPublicPath(path: string): boolean {
  return PUBLIC_PATHS.some(p => path === p || path.startsWith(p));
}

function isProtectedPath(path: string): boolean {
  return PROTECTED_PATHS.some(p => path.startsWith(p));
}

function addSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);

  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;");
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  headers.set('X-XSS-Protection', '1; mode=block');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    if (isPublicPath(path)) {
      const response = await fetch(request);
      return addSecurityHeaders(response);
    }

    if (!isProtectedPath(path)) {
      const response = await fetch(request);
      return addSecurityHeaders(response);
    }

    const authHeader = request.headers.get('Authorization');
    const cookieHeader = request.headers.get('Cookie');

    let token: string | null = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    if (!token && cookieHeader) {
      const cookies = cookieHeader.split(';').map(c => c.trim());
      const supabaseToken = cookies.find(c => c.startsWith('sb-access-token='));
      if (supabaseToken) {
        token = supabaseToken.split('=')[1];
      }
    }

    if (!token) {
      const loginUrl = new URL('/login', url.origin);
      loginUrl.searchParams.set('redirect', path);
      return Response.redirect(loginUrl.toString(), 302);
    }

    const payload = verifyJwt(token, env.SUPABASE_JWT_SECRET);

    if (!payload) {
      const loginUrl = new URL('/login', url.origin);
      loginUrl.searchParams.set('redirect', path);
      return Response.redirect(loginUrl.toString(), 302);
    }

    const newRequest = new Request(request);
    newRequest.headers.set('X-User-Id', payload.sub);
    if (payload.email) {
      newRequest.headers.set('X-User-Email', payload.email);
    }
    newRequest.headers.set('X-Auth-Method', 'jwt-edge');

    const response = await fetch(newRequest);
    return addSecurityHeaders(response);
  },
};

export {};