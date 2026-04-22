import { baseStyles } from './styles';

/**
 * Template Base 2 — Design ORIGINAL restauré depuis backup
 * Ce template est la version originale avec le style "ticket" (stub + check),
 * toggle Connexion/Membre, forfaits en cartes-tickets, section support et dark mode.
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
      background:
        radial-gradient(circle at top, rgba(103, 58, 183, 0.10), transparent 32%),
        var(--bg-page);
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
      transition: background 0.3s ease, color 0.3s ease;
      color: var(--text-main);
    }
    .card {
      background: var(--bg-card);
      border-radius: 24px;
      border: 1px solid var(--border-color);
      box-shadow: 0 18px 44px rgba(15, 23, 42, 0.10);
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
      transition: all 0.3s ease;
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
      z-index: 1;
      cursor: pointer;
      transition: color 0.3s ease;
    }
    .toggle-active {
      color: #fff !important;
    }
    .form-group {
      margin-bottom: 15px;
      text-align: left;
    }
    .footer-sig {
      text-align: center;
      padding: 24px;
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .arcep-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: #eff6ff;
      border: 1px solid #dbeafe;
      border-radius: 99px;
      margin-bottom: 20px;
      animation: pulse 2s infinite;
    }
    .arcep-badge-icon {
      width: 14px;
      height: 14px;
      background: #3b82f6;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 8px;
      font-weight: 900;
    }
    .arcep-badge-text {
      font-size: 10px;
      font-weight: 800;
      color: #1e40af;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .kyc-disclaimer {
      font-size: 11px;
      color: var(--text-muted);
      line-height: 1.5;
      margin-top: 12px;
      text-align: left;
      padding-left: 12px;
      border-left: 2px solid var(--primary);
    }
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.2); }
      70% { box-shadow: 0 0 0 8px rgba(59, 130, 246, 0); }
      100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
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
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    input:focus {
      border-color: var(--primary);
      outline: none;
      box-shadow: 0 0 0 3px rgba(103, 58, 183, 0.12);
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
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .btn-blue {
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: #fff;
      box-shadow: 0 12px 24px rgba(103, 58, 183, 0.22);
    }
    .btn-blue:hover {
      transform: translateY(-1px);
    }
    .btn:active {
      transform: scale(0.98);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    }
    .helper-actions {
      display: grid;
      gap: 10px;
      margin-top: 12px;
    }
    .helper-hint {
      color: #64748b;
      font-size: 0.78rem;
      line-height: 1.45;
      text-align: center;
    }
    .secondary-btn {
      display: inline-flex;
      width: 100%;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 14px;
      border-radius: 14px;
      border: 1px solid var(--border-color);
      background: var(--bg-card);
      color: var(--primary);
      text-decoration: none;
      font-size: 0.92rem;
      font-weight: 800;
      cursor: pointer;
      transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
      box-shadow: 0 8px 18px rgba(15, 23, 42, 0.05);
    }
    .secondary-btn:hover {
      transform: translateY(-1px);
      border-color: rgba(103, 58, 183, 0.26);
      box-shadow: 0 10px 20px rgba(15, 23, 42, 0.08);
    }
    .secondary-btn.trial-btn {
      background: color-mix(in srgb, var(--primary) 8%, #fff);
    }
    .error {
      background: var(--error-bg, #ffe6e6);
      color: var(--error-text, #cc0000);
      padding: 12px;
      border-radius: 12px;
      font-size: 0.88rem;
      font-weight: 600;
      display: <%= mkError ? 'block' : 'none' %>;
      margin-bottom: 20px;
      text-align: center;
      border: 1px solid rgba(255, 0, 0, 0.1);
    }
    .phone-input-wrapper {
      display: flex;
      align-items: center;
      background: var(--bg-page);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      overflow: hidden;
      margin-top: 5px;
      transition: all 0.2s ease;
    }
    .phone-input-wrapper:focus-within {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(103, 58, 183, 0.12);
    }
    .country-code-badge {
      background: var(--bg-toggle);
      color: var(--primary);
      padding: 0 14px;
      font-weight: 800;
      font-size: 0.95rem;
      border-right: 1px solid var(--border-color);
      height: 48px;
      display: flex;
      align-items: center;
      user-select: none;
    }
    .phone-input-wrapper input {
      flex: 1;
      border: none !important;
      margin-top: 0 !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      height: 48px;
      padding-left: 12px !important;
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
      letter-spacing: -0.01em;
    }
    .ticket {
      display: flex;
      min-height: 114px;
      border-radius: 18px;
      overflow: hidden;
      border: 1px solid var(--border-color);
      box-shadow: 0 10px 24px rgba(15, 23, 42, 0.07);
      cursor: pointer;
      text-decoration: none;
      color: inherit;
      background: var(--bg-card);
      transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
    }
    .ticket:hover {
      transform: translateY(-1px);
      box-shadow: 0 14px 28px rgba(15, 23, 42, 0.10);
      border-color: rgba(103, 58, 183, 0.26);
    }
    .ticket:active {
      transform: scale(0.95);
      transition: 0.1s;
    }
    .stub {
      width: 118px;
      background: linear-gradient(180deg, var(--primary), color-mix(in srgb, var(--primary) 84%, #1e1b4b));
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
    .top {
      display: flex;
      flex-direction: column;
      gap: 6px;
      align-items: center;
    }
    .num {
      font-size: 0.68rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .line {
      width: 42px;
      height: 1px;
      background: rgba(255, 255, 255, 0.45);
    }
    .number {
      font-size: 1.9rem;
      font-weight: 900;
      line-height: 1;
      text-align: center;
      letter-spacing: -0.04em;
    }
    .invite {
      font-size: 0.72rem;
      letter-spacing: 0.12em;
      text-align: center;
      font-weight: 700;
    }
    .check {
      flex: 1;
      padding: 14px 16px;
      background: var(--bg-card);
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 8px;
      text-align: left;
    }
    .plan-main {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 12px;
    }
    .plan-price {
      font-size: 1.3rem;
      font-weight: 800;
      color: var(--primary);
      line-height: 1.05;
      letter-spacing: -0.02em;
    }
    .plan-duration {
      font-size: 0.82rem;
      font-weight: 700;
      margin: 0;
      color: var(--text-muted);
      background: var(--bg-page);
      padding: 4px 8px;
      border-radius: 999px;
      white-space: nowrap;
    }
    .plan-name {
      color: var(--text-muted);
      font-size: 0.84rem;
      font-weight: 600;
      line-height: 1.4;
      min-height: 2.35em;
    }
    .ticket-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      align-items: center;
    }
    .special-badge,
    .direct-pay-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 8px;
      font-size: 0.64rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .special-badge.vip {
      background: #ede9fe;
      color: #6d28d9;
    }
    .special-badge.popular {
      background: #ffedd5;
      color: #c2410c;
    }
    .special-badge.eco {
      background: #dcfce7;
      color: #15803d;
    }
    .direct-pay-badge {
      background: color-mix(in srgb, var(--primary) 10%, white);
      color: var(--primary);
    }
    .info-box {
      margin-top: 25px;
      padding: 18px 16px;
      background: var(--bg-toggle);
      border-radius: 18px;
      box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
      color: var(--text-main);
      text-align: center;
      border: 1px solid var(--border-color);
    }
    .info-box h3 {
      margin-bottom: 6px;
      color: var(--primary);
      font-size: 1.02rem;
      font-weight: 800;
      letter-spacing: -0.01em;
    }
    .info-box .support-kicker {
      display: inline-block;
      margin-bottom: 8px;
      padding: 4px 10px;
      border-radius: 999px;
      background: rgba(103, 58, 183, 0.10);
      color: var(--primary);
      font-size: 0.68rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    .info-box .support-phone {
      font-size: 1.15rem;
      font-weight: 900;
      color: var(--text-main);
      letter-spacing: -0.02em;
      margin-bottom: 8px;
    }
    .info-box .support-address-label {
      color: var(--text-muted);
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 800;
      margin-bottom: 6px;
    }
    .info-box p {
      color: var(--text-muted);
      line-height: 1.5;
      font-size: 0.92rem;
      max-width: 28ch;
      margin: 0 auto;
    }
    .support-actions {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 14px;
    }
    .support-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-width: 138px;
      padding: 11px 14px;
      border-radius: 999px;
      text-decoration: none;
      font-size: 0.84rem;
      font-weight: 800;
      transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
    }
    .support-btn:hover {
      transform: translateY(-1px);
    }
    .support-btn.whatsapp {
      background: linear-gradient(135deg, #25d366, #16a34a);
      color: #fff;
      box-shadow: 0 12px 22px rgba(37, 211, 102, 0.20);
    }
    .support-btn.call {
      background: #fff;
      color: var(--primary);
      border: 1px solid rgba(103, 58, 183, 0.16);
      box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06);
    }
    .whatsapp-plugin-fab {
      position: fixed;
      right: 20px;
      bottom: 22px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 16px;
      border-radius: 999px;
      background: linear-gradient(135deg, #25d366, #16a34a);
      color: #fff;
      text-decoration: none;
      font-size: 0.86rem;
      font-weight: 900;
      box-shadow: 0 18px 30px rgba(22, 163, 74, 0.28);
      z-index: 1000;
      transition: transform 0.18s ease, box-shadow 0.18s ease;
    }
    .whatsapp-plugin-fab:hover {
      transform: translateY(-2px);
      box-shadow: 0 22px 34px rgba(22, 163, 74, 0.32);
    }
    .whatsapp-plugin-fab .wa-icon {
      width: 28px;
      height: 28px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.18);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
    }
    .dark-toggle {
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--primary);
      color: #fff;
      border: none;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      font-size: 20px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      z-index: 1000;
      transition: all 0.3s ease;
    }
    .dark-toggle:hover {
      background: var(--secondary);
      transform: scale(1.1);
    }
    .signature {
      margin-top: 20px;
      text-align: center;
      font-size: 12px;
      color: #888;
      z-index: 999;
      display: block;
    }
    .signature .designer-line {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
    }
    .signature .pill {
      background-color: #E53935;
      color: white;
      padding: 2px 6px;
      border-radius: 10px;
      font-weight: bold;
    }
    .scanner-modal {
      position: fixed;
      inset: 0;
      z-index: 1200;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: rgba(15, 23, 42, 0.72);
      backdrop-filter: blur(8px);
    }
    .scanner-modal.open {
      display: flex;
    }
    .scanner-sheet {
      width: min(100%, 340px);
      border-radius: 24px;
      background: var(--bg-card);
      padding: 18px;
      box-shadow: 0 20px 50px rgba(15, 23, 42, 0.28);
      text-align: center;
      color: var(--text-main);
    }
    .scanner-sheet h3 {
      margin-bottom: 8px;
      color: var(--primary);
      font-size: 1.05rem;
      font-weight: 800;
    }
    .scanner-sheet p {
      color: var(--text-muted);
      font-size: 0.84rem;
      line-height: 1.45;
      margin-bottom: 12px;
    }
    .scanner-viewport {
      position: relative;
      overflow: hidden;
      border-radius: 18px;
      background: #0f172a;
      aspect-ratio: 1 / 1;
      margin-bottom: 12px;
    }
    .scanner-viewport video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .scanner-viewport::after {
      content: '';
      position: absolute;
      inset: 18%;
      border: 2px solid rgba(255, 255, 255, 0.92);
      border-radius: 18px;
      box-shadow: 0 0 0 999px rgba(15, 23, 42, 0.16);
    }
    .scanner-actions {
      display: grid;
      gap: 10px;
    }
    /* Ces règles sont désormais gérées par les variables dans body.dark-mode */
    @media (max-width: 480px) {
      .card {
        padding: 20px;
        border-radius: 20px;
      }
      h2 {
        font-size: 1.2rem;
      }
      .portal-subtitle {
        font-size: 0.84rem;
      }
      .dark-toggle {
        width: 40px;
        height: 40px;
        font-size: 16px;
      }
      .whatsapp-plugin-fab {
        right: 14px;
        bottom: 14px;
        padding: 11px 13px;
        font-size: 0.8rem;
      }
      .whatsapp-plugin-fab .wa-label {
        display: none;
      }
      .ticket {
        min-height: 108px;
      }
      .stub {
        width: 108px;
      }
      .check {
        padding: 12px 14px;
      }
      .plan-price {
        font-size: 1.15rem;
      }
    }
  </style>
</head>
<body class="<%= features.themeMode === 'dark' ? 'dark-mode' : '' %>">
  $(if chap-id)
  <form name="sendin" action="$(link-login-only)" method="post" class="hidden">
    <input type="hidden" name="username" />
    <input type="hidden" name="password" />
    <input type="hidden" name="dst" value="$(link-orig)" />
    <input type="hidden" name="popup" value="true" />
  </form>
  $(endif)

  <button id="darkModeToggle" class="dark-toggle" type="button"><%= (features.themeMode === 'dark') ? '☀️' : '🌙' %></button>

  <main class="card">
    <% if (branding.logoUrl || branding.logoPreset !== 'none') { %>
      <img class="logo" src="<%= logoSrc %>" alt="<%= branding.ispName %>">
    <% } %>

    <h2><%= branding.ispName %></h2>
    <p class="portal-subtitle"><%= i18n.portalSubtitle %></p>

    <div id="error-box" class="error"><%= mkError %></div>
    
    <% if (features.kyc.enabled) { %>
      <div class="arcep-badge" style="margin-top: -10px;">
        <div class="arcep-badge-icon">✓</div>
        <span class="arcep-badge-text"><%= i18n.kycArcepBadge %></span>
      </div>
    <% } %>

    <div id="toggle" class="toggle-container">
      <div class="toggle-indicator"></div>
      <button id="btn-ticket" class="toggle-btn toggle-active" type="button"><%= i18n.loginToggle %></button>
      <button id="btn-member" class="toggle-btn" type="button"><%= i18n.memberToggle %></button>
    </div>

    <form id="form-ticket" name="login" action="$(link-login-only)" method="post" $(if chap-id) onsubmit="return doLogin()" $(endif)>
      <input type="hidden" name="dst" value="$(link-orig)" />
      <input type="hidden" name="popup" value="true" />
      <% if (features.kyc.enabled) { %>
        <div class="form-group">
          <label for="kyc-phone-ticket"><%= i18n.kycPhoneLabel %></label>
          <div class="phone-input-wrapper">
             <span class="country-code-badge"><%= features.kyc.countryCode %></span>
             <input id="kyc-phone-ticket" type="tel" placeholder="<%= i18n.kycPhonePlaceholder %>" required />
          </div>
          <div class="kyc-disclaimer">
            <%= i18n.kycDisclaimer %>
          </div>
        </div>
      <% } %>
      <div class="form-group">
        <label for="username"><%= i18n.ticketCodeLabel %></label>
        <input id="username" name="username" type="text" placeholder="<%= i18n.ticketCodePlaceholder %>" required />
      </div>
      <div class="hidden">
        <input name="password" type="password" />
      </div>
      <button class="btn btn-blue" type="submit"><%= i18n.connectButton %></button>
      <% if (features.enableQrScanner || features.enableTrial) { %>
        <div class="helper-actions">
          <% if (features.enableQrScanner) { %>
            <button id="openQrScanner" class="secondary-btn" type="button"><%= i18n.qrScannerButton %></button>
            <div class="helper-hint"><%= i18n.qrScannerHint %></div>
          <% } %>
          <% if (features.enableTrial) { %>
            <a class="secondary-btn trial-btn" href="$(link-login-only)?dst=$(link-orig-esc)&username=T-$(mac-esc)"><%= i18n.trialButton %></a>
            <div class="helper-hint"><%= i18n.trialHint %></div>
          <% } %>
        </div>
      <% } %>
    </form>

    <form id="form-member" name="mlogin" class="hidden" action="$(link-login-only)" method="post" $(if chap-id) onsubmit="return doLoginMember()" $(endif)>
      <input type="hidden" name="dst" value="$(link-orig)" />
      <input type="hidden" name="popup" value="true" />
      <% if (features.kyc.enabled) { %>
        <div class="form-group">
          <label for="kyc-phone-member"><%= i18n.kycPhoneLabel %></label>
          <div class="phone-input-wrapper">
             <span class="country-code-badge"><%= features.kyc.countryCode %></span>
             <input id="kyc-phone-member" type="tel" placeholder="<%= i18n.kycPhonePlaceholder %>" required />
          </div>
          <div class="kyc-disclaimer">
            <%= i18n.kycDisclaimer %>
          </div>
        </div>
      <% } %>
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
          <a
            class="ticket"
            href="<%= plan.paymentUrl || '#' %>"
            <%= plan.paymentUrl ? 'target="_blank" rel="noopener noreferrer"' : '' %>
          >
            <div class="stub">
              <div class="top">
                <span class="num">N° <span><%= String(index + 1).padStart(3, '0') %></span></span>
                <div class="line"></div>
                <span class="num"><%= i18n.wifiLabel %></span>
              </div>
              <div class="number"><%= plan.durationLabel %></div>
              <div class="invite"><%= i18n.ticketLabel %></div>
            </div>
            <div class="check">
              <div class="plan-main">
                <span class="plan-price"><%= plan.priceLabel %></span>
                <span class="plan-duration"><%= plan.durationLabel %></span>
              </div>
              <div class="plan-name"><%= plan.displayName %><%= plan.speedLabel ? ' • ' + plan.speedLabel : '' %></div>
              <div class="ticket-tags">
                <% if (plan.badge !== 'none') { %>
                  <div class="special-badge <%= plan.badge %>">
                    <%= plan.badge === 'popular' ? i18n.bestSellerBadge : plan.badge === 'vip' ? i18n.vipBadge : i18n.ecoBadge %>
                  </div>
                <% } %>
                <% if (payment.aggregator !== 'none' || plan.paymentUrl) { %>
                  <div class="direct-pay-badge"><%= i18n.buyBadge %></div>
                <% } %>
              </div>
            </div>
          </a>
        <% }) %>
      </section>
    <% } %>

    <div class="info-box">
      <div class="support-kicker"><%= i18n.supportKicker %></div>
      <h3><%= i18n.supportTitle %></h3>
      <div class="support-phone"><%= contact.phone %></div>
      <div class="support-address-label"><%= i18n.addressLabel %></div>
      <p><%= contact.address %></p>
      <div class="support-actions">
        <% if (contact.whatsapp) { %>
          <a href="https://wa.me/<%= contact.whatsapp %>" target="_blank" rel="noopener" class="support-btn whatsapp">
            <span><%= i18n.whatsappButton %></span>
          </a>
        <% } %>
        <% if (contact.phone) { %>
          <a href="tel:<%= contact.phone %>" class="support-btn call">
            <span><%= i18n.callButton %></span>
          </a>
        <% } %>
      </div>
    </div>

    <div class="signature">
      <div class="designer-line">
        <%= i18n.designBy %> <span class="pill"><%= contact.designerName %></span><%= contact.designerYear %>
      </div>
    </div>
  </main>

  <% if (contact.whatsapp) { %>
    <a href="https://wa.me/<%= contact.whatsapp %>" target="_blank" rel="noopener" class="whatsapp-plugin-fab" aria-label="<%= i18n.whatsappHelp %>">
      <span class="wa-icon">✆</span>
      <span class="wa-label"><%= i18n.whatsappHelp %></span>
    </a>
  <% } %>

  <% if (features.enableQrScanner) { %>
    <div id="qrScannerModal" class="scanner-modal" aria-hidden="true">
      <div class="scanner-sheet" role="dialog" aria-modal="true" aria-labelledby="qrScannerTitle">
        <h3 id="qrScannerTitle"><%= i18n.qrScannerTitle %></h3>
        <p><%= i18n.qrScannerHint %></p>
        <div class="scanner-viewport">
          <video id="qrScannerVideo" playsinline muted></video>
        </div>
        <div class="scanner-actions">
          <button id="manualQrFallback" type="button" class="secondary-btn"><%= i18n.qrScannerFallback %></button>
          <button id="closeQrScanner" type="button" class="secondary-btn"><%= i18n.qrScannerClose %></button>
        </div>
      </div>
    </div>
  <% } %>

  <script src="./md5.js"></script>
  <script>
    function syncTicketPassword(form) {
      if (!form) return;
      var usernameInput = form.querySelector('input[name="username"]');
      var passwordInput = form.querySelector('input[name="password"]');
      if (usernameInput && passwordInput) {
        passwordInput.value = usernameInput.value;
      }
    }

    function verifyKyc(phoneInputId, callback) {
      <% if (features.kyc.enabled) { %>
        var input = document.getElementById(phoneInputId);
        var phoneValue = input.value.trim();
        var errorBox = document.getElementById('error-box');
        
        input.classList.remove('input-error');
        
        if (phoneValue === '') {
          errorBox.textContent = "<%= i18n.kycErrorRequired %>";
          errorBox.style.display = 'block';
          input.classList.add('input-error');
          input.scrollIntoView();
          return;
        }
        
        if (phoneValue.length !== <%= features.kyc.phoneLength %>) {
          errorBox.textContent = "<%= i18n.kycErrorLength %>".replace('{{phoneLength}}', '<%= features.kyc.phoneLength %>');
          errorBox.style.display = 'block';
          input.classList.add('input-error');
          input.scrollIntoView();
          return;
        }
        
        <% if (features.kyc.authorizedPrefixes && features.kyc.authorizedPrefixes.length > 0) { %>
          var prefixes = [<%= features.kyc.authorizedPrefixes.map(function(p) { return "'" + p + "'"; }).join(',') %>];
          var isValidPrefix = prefixes.some(function(p) {
            return phoneValue.indexOf(p) === 0;
          });
          
          if (!isValidPrefix) {
            errorBox.textContent = "<%= i18n.kycErrorPrefix %>".replace('{{authorizedPrefixes}}', prefixes.join(', '));
            errorBox.style.display = 'block';
            input.classList.add('input-error');
            input.scrollIntoView();
            return;
          }
        <% } %>
        
        // 3. Envoi API de traçabilité
        var fullNumber = '<%= features.kyc.countryCode %>' + phoneValue;
        var loggingUrl = '<%= features.kyc.loggingUrl %>';
        
        if (loggingUrl) {
          errorBox.textContent = "<%= i18n.redirectingMessage %>";
          errorBox.style.display = 'block';
          
          fetch(loggingUrl, {
            method: 'POST',
            mode: 'no-cors', // On utilise no-cors pour éviter les problèmes de preflight sur des serveurs tiers simples
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              phone: fullNumber,
              mac: '$(mac)',
              ip: '$(ip)',
              type: 'login'
            })
          }).then(function() {
            callback();
          }).catch(function() {
            callback(); // On continue même en cas d'échec du logging pour ne pas bloquer l'utilisateur
          });
        } else {
          callback();
        }
      <% } else { %>
        callback();
      <% } %>
    }

    function doLogin() {
      verifyKyc('kyc-phone-ticket', function() {
        syncTicketPassword(document.login);
        $(if chap-id)
        document.sendin.username.value = document.login.username.value;
        document.sendin.password.value = hexMD5('$(chap-id)' + document.login.password.value + '$(chap-challenge)');
        document.sendin.submit();
        $(else)
        document.login.submit();
        $(endif)
      });
      return false;
    }

    function doLoginMember() {
      verifyKyc('kyc-phone-member', function() {
        $(if chap-id)
        document.sendin.username.value = document.mlogin.username.value;
        document.sendin.password.value = hexMD5('$(chap-id)' + document.mlogin.password.value + '$(chap-challenge)');
        document.sendin.submit();
        $(else)
        document.mlogin.submit();
        $(endif)
      });
      return false;
    }

    const btnTicket = document.getElementById('btn-ticket');
    const btnMember = document.getElementById('btn-member');
    const formTicket = document.getElementById('form-ticket');
    const formMember = document.getElementById('form-member');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const toggle = document.getElementById('toggle');

    btnTicket.addEventListener('click', function () {
      toggle.classList.remove('member');
      btnTicket.classList.add('toggle-active');
      btnMember.classList.remove('toggle-active');
      formTicket.classList.remove('hidden');
      formMember.classList.add('hidden');
    });

    btnMember.addEventListener('click', function () {
      toggle.classList.add('member');
      btnMember.classList.add('toggle-active');
      btnTicket.classList.remove('toggle-active');
      formMember.classList.remove('hidden');
      formTicket.classList.add('hidden');
    });

    darkModeToggle.addEventListener('click', function () {
      document.body.classList.toggle('dark-mode');
      darkModeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    });

    // Initial theme logic
    <% if (features.themeMode === 'auto') { %>
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️';
      }
    <% } %>

    <% if (features.enableQrScanner) { %>
      (function () {
        var openButton = document.getElementById('openQrScanner');
        var modal = document.getElementById('qrScannerModal');
        var closeButton = document.getElementById('closeQrScanner');
        var fallbackButton = document.getElementById('manualQrFallback');
        var video = document.getElementById('qrScannerVideo');
        var usernameInput = document.getElementById('username');
        var stream = null;
        var rafId = null;
        var detector = typeof window !== 'undefined' && 'BarcodeDetector' in window
          ? new window.BarcodeDetector({ formats: ['qr_code'] })
          : null;

        function applyTicketCode(value) {
          if (!value) return;
          usernameInput.value = value;
          syncTicketPassword(formTicket);
        }

        function stopScanner() {
          if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
          if (stream) {
            stream.getTracks().forEach(function (track) { track.stop(); });
            stream = null;
          }
          if (video) {
            video.pause();
            video.srcObject = null;
          }
        }

        function closeScanner() {
          stopScanner();
          modal.classList.remove('open');
          modal.setAttribute('aria-hidden', 'true');
        }

        function manualFallback() {
          var code = window.prompt('<%= i18n.ticketCodeLabel %>');
          if (code) {
            applyTicketCode(code.trim());
          }
          closeScanner();
        }

        function scanFrame() {
          if (!detector || !video || video.readyState < 2) {
            rafId = requestAnimationFrame(scanFrame);
            return;
          }

          detector.detect(video).then(function (codes) {
            if (codes && codes[0] && codes[0].rawValue) {
              applyTicketCode(codes[0].rawValue.trim());
              closeScanner();
              return;
            }
            rafId = requestAnimationFrame(scanFrame);
          }).catch(function () {
            rafId = requestAnimationFrame(scanFrame);
          });
        }

        async function openScanner() {
          if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !detector) {
            window.alert('<%= i18n.qrScannerUnsupported %>');
            manualFallback();
            return;
          }

          try {
            modal.classList.add('open');
            modal.setAttribute('aria-hidden', 'false');
            stream = await navigator.mediaDevices.getUserMedia({
              video: { facingMode: { ideal: 'environment' } },
              audio: false,
            });
            video.srcObject = stream;
            await video.play();
            rafId = requestAnimationFrame(scanFrame);
          } catch (error) {
            window.alert('<%= i18n.qrScannerError %>');
            manualFallback();
          }
        }

        openButton.addEventListener('click', openScanner);
        closeButton.addEventListener('click', closeScanner);
        fallbackButton.addEventListener('click', manualFallback);
        modal.addEventListener('click', function (event) {
          if (event.target === modal) {
            closeScanner();
          }
        });
        window.addEventListener('beforeunload', stopScanner);
      })();
    <% } %>
  </script>
</body>
</html>`;

