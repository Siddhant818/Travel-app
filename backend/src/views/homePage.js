const escapeHtml = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const formatUptime = (uptimeSeconds) => {
  const totalSeconds = Math.max(0, Math.floor(Number(uptimeSeconds) || 0));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((part) => String(part).padStart(2, '0'))
    .join(':');
};

const renderHomePage = ({ version, environment, uptime, healthUrl }) => {
  const safeVersion = escapeHtml(version || '1.0.0');
  const safeEnvironment = escapeHtml(environment || 'development');
  const safeUptime = escapeHtml(formatUptime(uptime));
  const safeHealthUrl = escapeHtml(healthUrl || '/api/health');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="dark light" />
  <title>TravelApp API</title>
  <style>
    :root {
      --bg: #07111f;
      --bg-soft: rgba(15, 23, 42, 0.78);
      --panel: rgba(10, 18, 33, 0.86);
      --panel-border: rgba(148, 163, 184, 0.18);
      --text: #e2e8f0;
      --muted: #94a3b8;
      --accent: #38bdf8;
      --accent-2: #22c55e;
      --warning: #f59e0b;
      --shadow: 0 24px 80px rgba(0, 0, 0, 0.42);
    }

    * { box-sizing: border-box; }
    html, body { height: 100%; }
    body {
      margin: 0;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: var(--text);
      background:
        radial-gradient(circle at top left, rgba(56, 189, 248, 0.18), transparent 36%),
        radial-gradient(circle at right top, rgba(34, 197, 94, 0.14), transparent 28%),
        linear-gradient(160deg, #050b14 0%, #0b1220 55%, #111827 100%);
    }

    .wrap {
      min-height: 100%;
      padding: 32px;
      display: grid;
      place-items: center;
    }

    .shell {
      width: min(1120px, 100%);
      background: linear-gradient(180deg, rgba(15, 23, 42, 0.92), rgba(2, 6, 23, 0.88));
      border: 1px solid var(--panel-border);
      border-radius: 28px;
      box-shadow: var(--shadow);
      overflow: hidden;
      position: relative;
    }

    .shell::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(56, 189, 248, 0.08), transparent 38%, rgba(34, 197, 94, 0.06));
      pointer-events: none;
    }

    .topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      padding: 28px 32px 0;
      position: relative;
      z-index: 1;
    }

    .brand {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .brand-badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      width: fit-content;
      padding: 8px 14px;
      border-radius: 999px;
      background: rgba(56, 189, 248, 0.12);
      color: #bae6fd;
      border: 1px solid rgba(56, 189, 248, 0.24);
      font-size: 12px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    h1 {
      margin: 0;
      font-size: clamp(2.5rem, 5vw, 4.8rem);
      line-height: 0.98;
      letter-spacing: -0.05em;
    }

    .subtitle {
      max-width: 700px;
      margin: 0;
      color: var(--muted);
      font-size: 1.02rem;
      line-height: 1.7;
    }

    .meta {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-end;
      gap: 12px;
    }

    .pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 14px;
      border-radius: 999px;
      border: 1px solid var(--panel-border);
      background: rgba(15, 23, 42, 0.55);
      color: var(--text);
      font-size: 14px;
      white-space: nowrap;
    }

    .pill strong { color: #fff; }

    .content {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 22px;
      padding: 32px;
      position: relative;
      z-index: 1;
    }

    .panel {
      background: var(--bg-soft);
      border: 1px solid var(--panel-border);
      border-radius: 24px;
      padding: 24px;
      backdrop-filter: blur(16px);
    }

    .panel h2 {
      margin: 0 0 12px;
      font-size: 1.2rem;
      letter-spacing: -0.03em;
    }

    .panel p {
      margin: 0;
      color: var(--muted);
      line-height: 1.7;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px;
      margin-top: 22px;
    }

    .stat {
      padding: 16px;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(148, 163, 184, 0.14);
    }

    .stat span {
      display: block;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--muted);
      margin-bottom: 8px;
    }

    .stat strong {
      font-size: 1.15rem;
      color: #fff;
    }

    .routes {
      display: grid;
      gap: 12px;
      margin-top: 18px;
    }

    .route {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      align-items: center;
      padding: 16px 18px;
      border-radius: 18px;
      background: rgba(15, 23, 42, 0.58);
      border: 1px solid rgba(148, 163, 184, 0.14);
    }

    .route code {
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
      color: #bfdbfe;
      font-size: 0.92rem;
      background: transparent;
    }

    .route small {
      display: block;
      margin-top: 4px;
      color: var(--muted);
      font-size: 0.92rem;
    }

    .status {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .status-card {
      padding: 20px;
      border-radius: 22px;
      border: 1px solid rgba(148, 163, 184, 0.14);
      background: linear-gradient(180deg, rgba(34, 197, 94, 0.14), rgba(15, 23, 42, 0.58));
    }

    .status-card h3 {
      margin: 0 0 10px;
      font-size: 1rem;
      letter-spacing: 0.02em;
    }

    .status-line {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #dcfce7;
      font-weight: 600;
    }

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 999px;
      background: var(--accent-2);
      box-shadow: 0 0 0 6px rgba(34, 197, 94, 0.16);
      flex: 0 0 auto;
    }

    .links {
      display: grid;
      gap: 12px;
    }

    .link-card {
      display: block;
      padding: 16px 18px;
      border-radius: 18px;
      text-decoration: none;
      color: var(--text);
      border: 1px solid rgba(148, 163, 184, 0.14);
      background: rgba(255, 255, 255, 0.03);
      transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
    }

    .link-card:hover {
      transform: translateY(-2px);
      border-color: rgba(56, 189, 248, 0.32);
      background: rgba(56, 189, 248, 0.08);
    }

    .link-card strong { display: block; margin-bottom: 6px; }
    .link-card span { color: var(--muted); font-size: 0.94rem; }

    .footer {
      padding: 0 32px 32px;
      position: relative;
      z-index: 1;
      color: var(--muted);
      font-size: 0.95rem;
    }

    @media (max-width: 960px) {
      .content { grid-template-columns: 1fr; }
      .meta { justify-content: flex-start; }
      .topbar { flex-direction: column; align-items: flex-start; }
    }

    @media (max-width: 720px) {
      .wrap { padding: 16px; }
      .topbar, .content, .footer { padding-left: 18px; padding-right: 18px; }
      .stats { grid-template-columns: 1fr; }
      .route { flex-direction: column; align-items: flex-start; }
    }
  </style>
</head>
<body>
  <main class="wrap">
    <section class="shell" aria-label="TravelApp backend status page">
      <header class="topbar">
        <div class="brand">
          <div class="brand-badge">TravelApp Backend</div>
          <h1>API status, production ready.</h1>
          <p class="subtitle">This service powers search, authentication, and booking workflows for the TravelApp platform. The backend is connected to MongoDB Atlas and serving live traffic.</p>
        </div>
        <div class="meta" aria-label="runtime metadata">
          <div class="pill">Version <strong>${safeVersion}</strong></div>
          <div class="pill">Environment <strong>${safeEnvironment}</strong></div>
          <div class="pill">Uptime <strong>${safeUptime}</strong></div>
        </div>
      </header>

      <section class="content">
        <div class="panel">
          <h2>Available services</h2>
          <p>The frontend uses these endpoints through the configured API base URL. The root page is intentionally lightweight so it can serve as a fast service landing page.</p>

          <div class="stats" role="list" aria-label="service highlights">
            <div class="stat" role="listitem"><span>Database</span><strong>MongoDB Atlas</strong></div>
            <div class="stat" role="listitem"><span>Auth</span><strong>JWT + OTP</strong></div>
            <div class="stat" role="listitem"><span>Search</span><strong>Flights / Hotels / Cabs</strong></div>
          </div>

          <div class="routes" aria-label="api routes">
            <div class="route">
              <div>
                <code>/api/health</code>
                <small>Service health and runtime diagnostics.</small>
              </div>
              <div class="pill">GET</div>
            </div>
            <div class="route">
              <div>
                <code>/api/search</code>
                <small>Flights, hotels, and cabs search endpoints.</small>
              </div>
              <div class="pill">GET</div>
            </div>
            <div class="route">
              <div>
                <code>/api/auth</code>
                <small>Customer OTP and vendor login workflows.</small>
              </div>
              <div class="pill">POST</div>
            </div>
            <div class="route">
              <div>
                <code>/api/bookings</code>
                <small>Booking lifecycle, chat, and status updates.</small>
              </div>
              <div class="pill">GET / POST / PATCH</div>
            </div>
          </div>
        </div>

        <aside class="status">
          <div class="status-card">
            <h3>Current status</h3>
            <div class="status-line"><span class="dot"></span> Online and connected to Atlas</div>
            <p style="margin-top:12px;">Open <code>${safeHealthUrl}</code> for a machine-readable health response.</p>
          </div>

          <div class="links">
            <a class="link-card" href="${safeHealthUrl}">
              <strong>Health endpoint</strong>
              <span>Quick JSON response for monitors and deployment checks.</span>
            </a>
            <a class="link-card" href="/api/search/flights?from=Delhi&to=Mumbai&date=2026-05-20">
              <strong>Sample flight search</strong>
              <span>Use this query to confirm seeded inventory is live.</span>
            </a>
          </div>
        </aside>
      </section>

      <footer class="footer">
        Designed for the TravelApp backend. API endpoints stay unchanged while the landing page gives the service a polished, professional front door.
      </footer>
    </section>
  </main>
</body>
</html>`;
};

module.exports = { renderHomePage };