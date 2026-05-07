import { baseStyles } from './styles';

/**
 * Template Base 2 — Design ORIGINAL restauré depuis backup
 * Ce template est la version originale avec le style "ticket" (stub + check),
 * toggle Connexion/Membre, forfaits en cartes-tickets, section support et dark mode.
 * OPTIMISÉ pour mobiles anciens (Android 5+) et vitesse de chargement.
 */
export const buildBase2LoginTemplate = () => `<!DOCTYPE html>
<html lang="<%= branding.language %>">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><%= i18n.loginTitle %> - <%= branding.ispName %></title>
  <style>
    ${baseStyles}
    * {
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }
    :root {
      --bg-page: #f8f7fa;
      --bg-card: #ffffff;
      --text-main: #1e293b;
      --text-muted: #64748b;
      --border-color: rgba(148, 163, 184, 0.18);
      --bg-toggle: #ede7f6;
    }
    
    body.dark-mode {
      --bg-page: #1a1a1a;
      --bg-card: #2d2d2d;
      --text-main: #ffffff;
      --text-muted: #d1d5db;
      --border-color: rgba(255, 255, 255, 0.08);
      --bg-toggle: #404040;
      --error-bg: #5a2d2d;
      --error-text: #ff6b6b;
    }

    body {
      background-color: var(--bg-page);
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
      color: var(--text-main);
      /* Font stack systeme ultra-rapide */
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    .card {
      background: var(--bg-card);
      border-radius: 24px;
      border: 1px solid var(--border-color);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
      padding: 30px 26px 24px;
      max-width: 380px;
      width: 100%;
      text-align: center;
    }
    .logo {
      max-width: 120px;
      max-height: 60px;
      object-fit: contain;
      margin: 0 auto 12px;
      display: block;
    }
    h2 {
      font-size: 1.5rem;
      margin-bottom: 6px;
      color: var(--primary);
      font-weight: 800;
      letter-spacing: -0.02em;
    }
    .portal-subtitle {
      margin-bottom: 20px;
      color: var(--text-muted);
      font-size: 0.92rem;
      line-height: 1.45;
    }
    .toggle-container {
      background: var(--bg-toggle);
      border-radius: 30px;
      padding: 5px;
      display: flex;
      margin-bottom: 20px;
      position: relative;
    }
    .toggle-indicator {
      position: absolute;
      top: 5px;
      bottom: 5px;
      left: 5px;
      width: calc(50% - 5px);
      background: var(--primary);
      border-radius: 25px;
      transition: transform 0.2s ease;
      z-index: 1;
    }
    .toggle-container.member .toggle-indicator {
      transform: translateX(100%);
    }
    .toggle-btn {
      flex: 1;
      background: transparent;
      border: none;
      padding: 10px 12px;
      font-weight: 700;
      color: var(--text-main);
      position: relative;
      z-index: 2;
      cursor: pointer;
    }
    .toggle-active {
      color: #fff !important;
    }
    .form-group {
      margin-bottom: 15px;
      text-align: left;
    }
    label {
      display: block;
      margin-bottom: 6px;
      font-size: 0.78rem;
      color: var(--text-muted);
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    input {
      width: 100%;
      padding: 12px 13px;
      border: 1px solid var(--border-color);
      background: var(--bg-page);
      border-radius: 12px;
      font-size: 1rem;
      color: var(--text-main);
      margin-top: 5px;
      box-sizing: border-box;
    }
    input:focus {
      border-color: var(--primary);
      outline: none;
    }
    .btn {
      display: block;
      width: 100%;
      padding: 13px;
      border: none;
      border-radius: 14px;
      font-size: 1rem;
      font-weight: bold;
      cursor: pointer;
      margin-top: 10px;
      transition: opacity 0.2s ease;
    }
    .btn-blue {
      background-color: var(--primary);
      color: #fff;
    }
    .btn:active {
      opacity: 0.8;
    }
    .dashboard {
      margin-top: 26px;
      display: grid;
      gap: 12px;
    }
    .dashboard-title {
      margin-bottom: 10px;
      color: var(--primary);
      text-align: center;
      font-size: 1.2rem;
      font-weight: 800;
    }
    .ticket {
      display: flex;
      min-height: 114px;
      border-radius: 18px;
      overflow: hidden;
      border: 1px solid var(--border-color);
      text-decoration: none;
      color: inherit;
      background: var(--bg-card);
      transition: border-color 0.2s ease;
    }
    .ticket:active {
      background-color: var(--bg-page);
    }
    .stub {
      width: 108px;
      background-color: var(--primary);
      color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      padding: 12px 10px;
      position: relative;
    }
    .stub::after {
      content: '';
      position: absolute;
      top: 8px;
      bottom: 8px;
      right: -6px;
      width: 12px;
      background-image: radial-gradient(circle, var(--bg-card) 3px, transparent 3.3px);
      background-size: 12px 16px;
      background-repeat: repeat-y;
    }
    .check {
      flex: 1;
      padding: 14px 16px;
      background: var(--bg-card);
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 6px;
      text-align: left;
    }
    .plan-price {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--primary);
    }
    .plan-duration {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-muted);
      background: var(--bg-page);
      padding: 3px 8px;
      border-radius: 999px;
    }
    .info-box {
      margin-top: 25px;
      padding: 18px 16px;
      background: var(--bg-toggle);
      border-radius: 18px;
      border: 1px solid var(--border-color);
    }
    .support-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-width: 130px;
      padding: 11px 14px;
      border-radius: 999px;
      text-decoration: none;
      font-size: 0.84rem;
      font-weight: 800;
      background: #fff;
      color: var(--primary);
      border: 1px solid var(--border-color);
    }
    .support-btn.whatsapp {
      background-color: #25d366;
      color: #fff;
      border: none;
    }
    .whatsapp-plugin-fab {
      position: fixed;
      right: 20px;
      bottom: 22px;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      border-radius: 999px;
      background-color: #25d366;
      color: #fff;
      text-decoration: none;
      font-weight: 900;
      box-shadow: 0 10px 20px rgba(0,0,0,0.1);
      z-index: 1000;
    }
    .dark-toggle {
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--primary);
      color: #fff;
      border: none;
      border-radius: 50%;
      width: 44px;
      height: 44px;
      cursor: pointer;
      z-index: 1000;
    }
    @media (max-width: 480px) {
      .card { padding: 20px 16px; }
      h2 { font-size: 1.3rem; }
      .ticket { min-height: 100px; }
      .stub { width: 90px; }
      .plan-price { font-size: 1.15rem; }
    }
  </style>
</head>
<body class="<%= features.themeMode === 'dark' ? 'dark-mode' : '' %>">
  $(if chap-id)
  <form name="sendin" action="$(link-login-only)" method="post" style="display:none">
    <input type="hidden" name="username" />
    <input type="hidden" name="password" />
    <input type="hidden" name="dst" value="$(link-orig)" />
    <input type="hidden" name="popup" value="true" />
  </form>
  $(endif)

  <button id="darkModeToggle" class="dark-toggle" type="button"><%= (features.themeMode === 'dark') ? '☀️' : '🌙' %></button>

  <main class="card">
    <% if (branding.logoUrl || branding.logoPreset !== 'none') { %>
      <img class="logo" src="<%= logoSrc %>" alt="<%= branding.ispName %>" fetchpriority="high">
    <% } %>

    <h2><%= branding.ispName %></h2>
    <p class="portal-subtitle"><%= i18n.portalSubtitle %></p>

    <div id="error-box" class="error" style="display: <%= mkError ? 'block' : 'none' %>"><%= mkError %></div>

    <div id="toggle" class="toggle-container">
      <div class="toggle-indicator"></div>
      <button id="btn-ticket" class="toggle-btn toggle-active" type="button"><%= i18n.loginToggle %></button>
      <button id="btn-member" class="toggle-btn" type="button"><%= i18n.memberToggle %></button>
    </div>

    <form id="form-ticket" name="login" action="$(link-login-only)" method="post" $(if chap-id) onsubmit="return doLogin()" $(endif)>
      <input type="hidden" name="dst" value="$(link-orig)" />
      <div class="form-group">
        <label for="username"><%= i18n.ticketCodeLabel %></label>
        <input id="username" name="username" type="text" placeholder="<%= i18n.ticketCodePlaceholder %>" required />
      </div>
      <div style="display:none">
        <input name="password" type="password" />
      </div>
      <button class="btn btn-blue" type="submit"><%= i18n.connectButton %></button>
    </form>

    <form id="form-member" name="mlogin" style="display:none" action="$(link-login-only)" method="post" $(if chap-id) onsubmit="return doLoginMember()" $(endif)>
      <input type="hidden" name="dst" value="$(link-orig)" />
      <div class="form-group">
        <label for="member-username"><%= i18n.memberUsernameLabel %></label>
        <input id="member-username" name="username" type="text" placeholder="<%= i18n.memberUsernamePlaceholder %>" required />
      </div>
      <div class="form-group">
        <label for="member-password"><%= i18n.memberPasswordLabel %></label>
        <input id="member-password" name="password" type="password" placeholder="<%= i18n.memberPasswordPlaceholder %>" required />
      </div>
      <button class="btn btn-blue" type="submit"><%= i18n.connectButton %></button>
    </form>

    <% if (plans.length) { %>
      <section class="dashboard">
        <h3 class="dashboard-title"><%= i18n.plansTitle %></h3>
        <% plans.forEach(function(plan, index) { %>
          <a class="ticket" href="<%= buildTiketMomoPaymentUrl(plan) %>">
            <div class="stub">
              <div style="font-size:0.6rem;opacity:0.8">TICKET</div>
              <div style="font-size:1.5rem;font-weight:900"><%= plan.durationLabel %></div>
              <div style="font-size:0.6rem;opacity:0.8">WIFI</div>
            </div>
            <div class="check">
              <div style="display:flex;justify-content:space-between;align-items:center">
                <span class="plan-price"><%= plan.priceLabel %></span>
                <span class="plan-duration"><%= plan.durationLabel %></span>
              </div>
              <div style="font-size:0.8rem;font-weight:700;opacity:0.7"><%= plan.displayName %></div>
              <div style="font-size:0.7rem;font-weight:900;color:var(--primary);text-transform:uppercase">Acheter maintenant →</div>
            </div>
          </a>
        <% }) %>
      </section>
    <% } %>

    <div class="info-box">
      <h3 style="font-size:0.9rem"><%= i18n.supportTitle %></h3>
      <div style="font-weight:900;margin:5px 0"><%= contact.phone %></div>
      <div class="support-actions">
        <% if (contact.whatsapp) { %>
          <a href="https://wa.me/<%= contact.whatsapp %>" class="support-btn whatsapp">WhatsApp</a>
        <% } %>
        <% if (contact.phone) { %>
          <a href="tel:<%= contact.phone %>" class="support-btn">Appeler</a>
        <% } %>
      </div>
    </div>
  </main>

  <script src="./md5.js"></script>
  <script>
    function doLogin() {
      const user = document.getElementById('username').value;
      document.login.password.value = user;
      $(if chap-id)
      document.sendin.username.value = user;
      document.sendin.password.value = hexMD5('$(chap-id)' + user + '$(chap-challenge)');
      document.sendin.submit();
      $(else)
      document.login.submit();
      $(endif)
      return false;
    }

    function doLoginMember() {
      const form = document.mlogin;
      $(if chap-id)
      document.sendin.username.value = form.username.value;
      document.sendin.password.value = hexMD5('$(chap-id)' + form.password.value + '$(chap-challenge)');
      document.sendin.submit();
      $(else)
      form.submit();
      $(endif)
      return false;
    }

    document.getElementById('btn-ticket').onclick = function() {
      document.getElementById('toggle').classList.remove('member');
      this.classList.add('toggle-active');
      document.getElementById('btn-member').classList.remove('toggle-active');
      document.getElementById('form-ticket').style.display = 'block';
      document.getElementById('form-member').style.display = 'none';
    };

    document.getElementById('btn-member').onclick = function() {
      document.getElementById('toggle').classList.add('member');
      this.classList.add('toggle-active');
      document.getElementById('btn-ticket').classList.remove('toggle-active');
      document.getElementById('form-ticket').style.display = 'none';
      document.getElementById('form-member').style.display = 'block';
    };

    document.getElementById('darkModeToggle').onclick = function() {
      document.body.classList.toggle('dark-mode');
      this.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    };
  </script>
</body>
</html>`;
