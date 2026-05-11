/**
 * Security Dashboard - Cloudflare Analytics
 * Displays security metrics and alerts for Zero Trust monitoring
 */

interface Env {
  AUDIT_KV: KVNamespace;
  ENVIRONMENT: string;
}

interface SecurityAlert {
  timestamp: string;
  type: string;
  severity: string;
  ipAddress: string;
  failureCount?: number;
}

interface SecurityMetrics {
  auth_failures_last_hour: number;
  rate_limits_last_hour: number;
  alert_triggered: boolean;
}

const HTML_TEMPLATE = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Security Dashboard - GlucoCare</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Be Vietnam Pro', system-ui, sans-serif; background: #0f172a; color: #e2e8f0; min-height: 100vh; }
    .container { max-width: 1200px; margin: 0 auto; padding: 24px; }
    header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
    h1 { font-size: 24px; font-weight: 600; color: #f1f5f9; }
    .status { display: flex; align-items: center; gap: 8px; }
    .status-dot { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; }
    .status-dot.alert { background: #ef4444; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
    .card { background: #1e293b; border-radius: 12px; padding: 20px; border: 1px solid #334155; }
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .card-title { font-size: 14px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }
    .metric { font-size: 36px; font-weight: 700; color: #f1f5f9; }
    .metric.warning { color: #f59e0b; }
    .metric.danger { color: #ef4444; }
    .metric.safe { color: #22c55e; }
    .alerts { margin-top: 32px; }
    .alert-item { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 16px; margin-bottom: 12px; }
    .alert-severity { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .alert-severity.critical { background: #ef4444; color: white; }
    .alert-severity.high { background: #f59e0b; color: white; }
    .alert-severity.medium { background: #3b82f6; color: white; }
    .alert-meta { margin-top: 8px; font-size: 13px; color: #64748b; }
    .chart-container { margin-top: 16px; height: 200px; display: flex; align-items: flex-end; gap: 8px; }
    .bar { flex: 1; background: linear-gradient(to top, #0ea5e9, #38bdf8); border-radius: 4px 4px 0 0; min-height: 4px; }
    .header-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding: 16px; background: #1e293b; border-radius: 12px; }
    .header-info { display: flex; gap: 24px; }
    .header-item { text-align: center; }
    .header-value { font-size: 20px; font-weight: 600; color: #f1f5f9; }
    .header-label { font-size: 12px; color: #64748b; }
    .zero-trust-badge { display: flex; align-items: center; gap: 8px; background: #064e3b; padding: 8px 16px; border-radius: 8px; }
    .zero-trust-badge svg { width: 16px; height: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>🛡️ Security Dashboard</h1>
      <div class="status">
        <div class="status-dot" id="statusDot"></div>
        <span id="statusText">Systems Operational</span>
      </div>
    </header>

    <div class="header-section">
      <div class="zero-trust-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <span>Zero Trust Architecture</span>
      </div>
      <div class="header-info">
        <div class="header-item">
          <div class="header-value" id="totalEvents">-</div>
          <div class="header-label">Security Events</div>
        </div>
        <div class="header-item">
          <div class="header-value" id="uptime">-</div>
          <div class="header-label">Uptime</div>
        </div>
        <div class="header-item">
          <div class="header-value" id="lastScan">-</div>
          <div class="header-label">Last Scan</div>
        </div>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <div class="card-header">
          <span class="card-title">Auth Failures (1h)</span>
        </div>
        <div class="metric" id="authFailures">-</div>
        <p style="color: #64748b; font-size: 13px; margin-top: 8px;">Threshold: 5 failures/hour</p>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Rate Limits (1h)</span>
        </div>
        <div class="metric" id="rateLimits">-</div>
        <p style="color: #64748b; font-size: 13px; margin-top: 8px;">Requests blocked</p>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Threat Level</span>
        </div>
        <div class="metric safe" id="threatLevel">LOW</div>
        <p style="color: #64748b; font-size: 13px; margin-top: 8px;">Based on failed auth attempts</p>
      </div>
    </div>

    <div class="alerts">
      <h2 style="font-size: 18px; margin-bottom: 16px; color: #f1f5f9;">Recent Alerts</h2>
      <div id="alertsList">
        <p style="color: #64748b;">No recent alerts</p>
      </div>
    </div>
  </div>

  <script>
    async function loadMetrics() {
      try {
        const response = await fetch('/metrics');
        const data = await response.json();

        document.getElementById('authFailures').textContent = data.auth_failures_last_hour || 0;
        document.getElementById('rateLimits').textContent = data.rate_limits_last_hour || 0;

        const authEl = document.getElementById('authFailures');
        authEl.className = 'metric';
        if (data.auth_failures_last_hour >= 10) authEl.classList.add('danger');
        else if (data.auth_failures_last_hour >= 5) authEl.classList.add('warning');

        const threatEl = document.getElementById('threatLevel');
        threatEl.textContent = data.alert_triggered ? 'HIGH' : 'LOW';
        threatEl.className = 'metric ' + (data.alert_triggered ? 'danger' : 'safe');

        const statusDot = document.getElementById('statusDot');
        const statusText = document.getElementById('statusText');
        if (data.alert_triggered) {
          statusDot.classList.add('alert');
          statusText.textContent = 'Alert Active';
        } else {
          statusText.textContent = 'Systems Operational';
        }
      } catch (e) {
        console.error('Failed to load metrics:', e);
      }
    }

    loadMetrics();
    setInterval(loadMetrics, 30000);
  </script>
</body>
</html>
`;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/' || url.pathname === '/dashboard') {
      return new Response(HTML_TEMPLATE, {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    if (url.pathname === '/metrics') {
      const now = Date.now();
      const oneHourAgo = now - 3600000;
      let authFailuresLastHour = 0;
      let rateLimitsLastHour = 0;

      const keys = await env.AUDIT_KV.list({ prefix: 'security:' });

      for (const key of keys.keys) {
        const timestamp = key.name.split(':')[1];
        const eventTime = new Date(timestamp).getTime();

        if (eventTime >= oneHourAgo) {
          const eventData = await env.AUDIT_KV.get(key.name);
          if (eventData) {
            const event = JSON.parse(eventData);
            if (event.eventType === 'auth_failure') authFailuresLastHour++;
            if (event.eventType === 'rate_limit') rateLimitsLastHour++;
          }
        }
      }

      return new Response(JSON.stringify({
        auth_failures_last_hour: authFailuresLastHour,
        rate_limits_last_hour: rateLimitsLastHour,
        alert_triggered: authFailuresLastHour >= 5,
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response('Not Found', { status: 404 });
  },
};