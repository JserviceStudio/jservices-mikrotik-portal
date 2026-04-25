import { baseStyles } from './styles';

export const buildBase1LoginTemplate = () => `<!DOCTYPE html>
<html lang="<%= branding.language %>">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><%= i18n.loginTitle %> - <%= branding.ispName %></title>
  <style>
    ${baseStyles}
    :root {
      --bg-page: #f8fbff;
      --bg-card: #ffffff;
      --text-main: #0f172a;
      --text-muted: #64748b;
      --border-color: #e2e8f0;
    }

    <% if (features.themeMode === 'dark') { %>
      :root {
        --bg-page: #0f172a;
        --bg-card: #1e293b;
        --text-main: #f1f5f9;
        --text-muted: #94a3b8;
        --border-color: #334155;
      }
    <% } %>

    <% if (features.themeMode === 'auto') { %>
    @media (prefers-color-scheme: dark) {
      :root {
        --bg-page: #0f172a;
        --bg-card: #1e293b;
        --text-main: #f1f5f9;
        --text-muted: #94a3b8;
        --border-color: #334155;
      }
    }
    <% } %>
    body {
      background: var(--bg-page);
      padding: 0;
      margin: 0;
      color: var(--text-main);
      overflow-x: hidden;
    }
    .finapp-header {
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: #fff;
      padding: 40px 24px 80px;
      text-align: center;
      position: relative;
    }
    .finapp-header::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      width: 100%;
      height: 40px;
      background: var(--bg-page);
      clip-path: ellipse(60% 100% at 50% 100%);
    }
    .logo-container {
      width: 80px;
      height: 80px;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }
    .logo-container img {
      width: 60px;
      height: 60px;
      object-fit: contain;
    }
    .isp-title {
      font-size: 1.5rem;
      font-weight: 800;
      margin-bottom: 4px;
      letter-spacing: -0.02em;
    }
    .wifi-tag {
      display: inline-block;
      padding: 4px 12px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 99px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .main-container {
      max-width: 480px;
      margin: -60px auto 40px;
      padding: 0 20px;
      position: relative;
      z-index: 10;
    }
    .finapp-card {
      background: var(--bg-card);
      border-radius: 24px;
      padding: 24px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.06);
      margin-bottom: 24px;
    }
    .nav-tabs {
      display: flex;
      background: var(--bg-page);
      border-radius: 16px;
      padding: 6px;
      margin-bottom: 24px;
      border: 1px solid var(--border-color);
    }
    .nav-tabs button {
      flex: 1;
      border: none;
      background: none;
      padding: 12px;
      font-weight: 700;
      font-size: 0.9rem;
      color: var(--text-muted);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .nav-tabs button.active {
      background: var(--bg-card);
      color: var(--primary);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .input-grp {
      margin-bottom: 16px;
    }
    .input-grp label {
      display: block;
      font-size: 0.8rem;
      font-weight: 800;
      color: var(--text-muted);
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .input-grp input {
      width: 100%;
      background: var(--bg-page);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 14px 16px;
      font-size: 1rem;
      color: var(--text-main);
      transition: all 0.2s;
    }
    .input-grp input:focus {
      background: var(--bg-card);
      border-color: var(--primary);
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--primary) 10%, transparent);
      outline: none;
    }
    .submit-btn {
      width: 100%;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: #fff;
      border: none;
      border-radius: 16px;
      padding: 16px;
      font-size: 1rem;
      font-weight: 800;
      margin-top: 8px;
      cursor: pointer;
      box-shadow: 0 12px 24px -6px color-mix(in srgb, var(--primary) 30%, transparent);
      transition: all 0.3s;
    }
    .submit-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 16px 32px -6px color-mix(in srgb, var(--primary) 40%, transparent);
    }
    .submit-btn:active {
      transform: translateY(0);
    }
    .error-msg {
      background: var(--error-bg, #fef2f2);
      color: var(--error-text, #dc2626);
      border-radius: 16px;
      padding: 14px;
      font-size: 0.88rem;
      font-weight: 700;
      margin-bottom: 24px;
      display: <%= mkError ? 'block' : 'none' %>;
      border: 1px solid var(--error-border, #fee2e2);
      text-align: center;
    }
    .phone-input-wrapper {
      display: flex;
      align-items: center;
      background: var(--bg-page);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      overflow: hidden;
      margin-top: 8px;
      transition: all 0.2s;
    }
    .phone-input-wrapper:focus-within {
      border-color: var(--primary);
      background: var(--bg-card);
      box-shadow: 0 0 0 4px color-mix(in srgb, var(--primary) 10%, transparent);
    }
    .country-code-badge {
      background: color-mix(in srgb, var(--primary) 5%, var(--bg-page));
      color: var(--primary);
      padding: 0 16px;
      font-weight: 800;
      font-size: 1rem;
      border-right: 1px solid var(--border-color);
      height: 52px;
      display: flex;
      align-items: center;
    }
    .phone-input-wrapper input {
      flex: 1;
      border: none !important;
      margin-top: 0 !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      height: 52px;
      padding: 0 16px !important;
    }
    .plans-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-top: 24px;
    }
    .fin-plan {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 24px;
      padding: 16px 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 12px;
      text-decoration: none;
      color: inherit;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }
    .fin-plan:hover {
      border-color: var(--primary);
      background: var(--bg-page);
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0,0,0,0.05);
    }
    .plan-icon {
      width: 48px;
      height: 48px;
      background: color-mix(in srgb, var(--primary) 10%, transparent);
      color: var(--primary);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      flex-shrink: 0;
    }
    .plan-info {
      flex: 1;
    }
    .plan-name {
      font-weight: 700;
      color: var(--text-main);
      display: block;
    }
    .plan-meta {
      font-size: 0.8rem;
      color: var(--text-muted);
    }
    .plan-price {
      text-align: center;
    }
    .amount {
      display: block;
      font-weight: 800;
      color: var(--primary);
      font-size: 1.1rem;
    }
    .badge {
      display: inline-block;
      font-size: 0.65rem;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 99px;
      text-transform: uppercase;
      margin-top: 4px;
    }
    .badge.popular { background: #ffedd5; color: #c2410c; }
    .badge.vip { background: #ede9fe; color: #6d28d9; }
    .badge.eco { background: #dcfce7; color: #15803d; }

    .support-section {
      text-align: center;
      padding: 24px;
    }
    .support-title {
      font-weight: 800;
      color: var(--text-main);
      margin-bottom: 8px;
    }
    .support-links {
      display: flex;
      justify-content: center;
      gap: 12px;
      margin-top: 16px;
    }
    .support-link {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      color: var(--primary);
      font-size: 1.2rem;
      transition: all 0.2s;
    }
    .support-link:hover {
      border-color: var(--primary);
      transform: scale(1.1);
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
  </style>
</head>
<body>
  $(if chap-id)
  <form name="sendin" action="$(link-login-only)" method="post" class="hidden">
    <input type="hidden" name="username" />
    <input type="hidden" name="password" />
    <input type="hidden" name="dst" value="$(link-orig)" />
    <input type="hidden" name="popup" value="true" />
  </form>
  $(endif)

  <header class="finapp-header">
    <div class="logo-container">
      <% if (branding.logoUrl || branding.logoPreset !== 'none') { %>
        <img src="<%= logoSrc %>" alt="<%= branding.ispName %>">
      <% } else { %>
        <span style="font-size: 2rem;">⚡</span>
      <% } %>
    </div>
    <div class="isp-title"><%= branding.ispName %></div>
    <div class="wifi-tag"><%= branding.wifiName %></div>
  </header>

  <main class="main-container">
    <div class="finapp-card">
      <% if (branding.logoUrl || (branding.logoPreset && branding.logoPreset !== 'none')) { %>
        <img class="logo" src="<%= logoSrc %>" alt="<%= branding.ispName %>" style="max-width: 120px; max-height: 60px; object-fit: contain; margin: 0 auto 12px; display: block;">
      <% } %>
      <div id="error-box" class="error-msg"><%= mkError %></div>
      
      <% if (features.kyc.enabled) { %>
        <div class="arcep-badge">
          <div class="arcep-badge-icon">✓</div>
          <span class="arcep-badge-text"><%= i18n.kycArcepBadge %></span>
        </div>
      <% } %>
      
      <div class="nav-tabs">
        <button id="tab-ticket" class="active" onclick="showTab('ticket')"><%= i18n.loginToggle %></button>
        <button id="tab-member" onclick="showTab('member')"><%= i18n.memberToggle %></button>
      </div>

      <div id="pane-ticket">
        <form name="login" action="$(link-login-only)" method="post" $(if chap-id) onsubmit="return doLogin()" $(endif)>
          <input type="hidden" name="dst" value="$(link-orig)" />
          <input type="hidden" name="popup" value="true" />
          <% if (features.kyc.enabled) { %>
            <div class="input-grp">
              <label><%= i18n.kycPhoneLabel %></label>
              <div class="phone-input-wrapper">
                 <span class="country-code-badge"><%= features.kyc.countryCode %></span>
                 <input type="tel" id="kyc-phone-ticket" placeholder="<%= i18n.kycPhonePlaceholder %>" required />
              </div>
              <div class="kyc-disclaimer">
                 <%= i18n.kycDisclaimer %>
              </div>
            </div>
          <% } %>
          <div class="input-grp">
            <label><%= i18n.ticketCodeLabel %></label>
            <input type="text" id="ticket-user" name="username" placeholder="<%= i18n.ticketCodePlaceholder %>" required />
          </div>
          <div class="hidden">
            <input type="password" id="ticket-pass" name="password" />
          </div>
          <button type="submit" class="submit-btn"><%= i18n.connectButton %></button>
          
          <% if (features.enableQrScanner) { %>
            <button type="button" class="submit-btn" style="background: var(--bg-page); color: var(--text-muted); margin-top: 12px; box-shadow: none; border: 1px solid var(--border-color);" onclick="window.alert('QR Scanner Placeholder')">
              📷 <%= i18n.qrScannerButton %>
            </button>
          <% } %>
        </form>
      </div>

      <div id="pane-member" class="hidden">
        <form name="mlogin" action="$(link-login-only)" method="post" $(if chap-id) onsubmit="return doLoginMember()" $(endif)>
          <input type="hidden" name="dst" value="$(link-orig)" />
          <input type="hidden" name="popup" value="true" />
          <% if (features.kyc.enabled) { %>
            <div class="input-grp">
              <label><%= i18n.kycPhoneLabel %></label>
              <div class="phone-input-wrapper">
                 <span class="country-code-badge"><%= features.kyc.countryCode %></span>
                 <input type="tel" id="kyc-phone-member" placeholder="<%= i18n.kycPhonePlaceholder %>" required />
              </div>
              <div class="kyc-disclaimer">
                 <%= i18n.kycDisclaimer %>
              </div>
            </div>
          <% } %>
          <div class="input-grp">
            <label><%= i18n.memberUsernameLabel %></label>
            <input type="text" name="username" placeholder="<%= i18n.memberUsernamePlaceholder %>" required />
          </div>
          <div class="input-grp">
            <label><%= i18n.memberPasswordLabel %></label>
            <input type="password" name="password" placeholder="<%= i18n.memberPasswordPlaceholder %>" required />
          </div>
          <button type="submit" class="submit-btn"><%= i18n.connectButton %></button>
        </form>
      </div>
    </div>

    <% if (plans.length) { %>
      <h2 style="font-size: 1.1rem; font-weight: 800; margin-bottom: 16px; padding: 0 4px; color: var(--text-main);"><%= i18n.plansTitle %></h2>
      <div class="plans-grid">
        <% plans.forEach(function(plan) { %>
          <a href="<%= (features && features.enablePaymentLinks) ? (plan.paymentUrl || '#') : '#' %>" class="fin-plan">
            <div class="plan-icon">📶</div>
            <div class="plan-info">
              <span class="plan-name"><%= plan.displayName %></span>
              <span class="plan-meta"><%= plan.durationLabel %> • <%= plan.speedLabel %></span>
              <% if (plan.badge !== 'none') { %>
                <div class="badge <%= plan.badge %>"><%= plan.badge %></div>
              <% } %>
            </div>
            <div class="plan-price">
              <span class="amount"><%= plan.priceLabel %></span>
              <% if (features && features.enablePaymentLinks && plan.paymentUrl) { %>
                <div class="badge-buy" style="background: var(--primary); color: #fff; font-size: 0.65rem; font-weight: 800; padding: 4px 8px; border-radius: 99px; text-transform: uppercase; margin-top: 6px; display: inline-block;"><%= i18n.buyBadge %></div>
              <% } %>
            </div>
          </a>
        <% }) %>
      </div>
    <% } %>

    <div class="support-section">
      <div class="support-title"><%= i18n.supportTitle %></div>
      <div style="color: var(--text-muted); font-size: 0.9rem;"><%= contact.phone %></div>
      <div class="support-links">
        <% if (contact.whatsapp) { %>
          <a href="https://wa.me/<%= contact.whatsapp %>" class="support-link">💬</a>
        <% } %>
        <% if (contact.phone) { %>
          <a href="tel:<%= contact.phone %>" class="support-link">📞</a>
        <% } %>
      </div>
    </div>

    <div class="footer-sig">
      <%= i18n.designBy %> <%= contact.designerName %> &copy; <%= contact.designerYear %>
    </div>
  </main>

  <script src="./md5.js"></script>
  <script>
    function showTab(type) {
      document.getElementById('pane-ticket').classList.toggle('hidden', type !== 'ticket');
      document.getElementById('pane-member').classList.toggle('hidden', type !== 'member');
      document.getElementById('tab-ticket').classList.toggle('active', type === 'ticket');
      document.getElementById('tab-member').classList.toggle('active', type === 'member');
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
        
        var fullNumber = '<%= features.kyc.countryCode %>' + phoneValue;
        var loggingUrl = '<%= features.kyc.loggingUrl %>';
        
        if (loggingUrl) {
          errorBox.textContent = "<%= i18n.redirectingMessage %>";
          errorBox.style.display = 'block';
          
          fetch(loggingUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: fullNumber, mac: '$(mac)', ip: '$(ip)', type: 'login' })
          }).then(function() { callback(); }).catch(function() { callback(); });
        } else {
          callback();
        }
      <% } else { %>
        callback();
      <% } %>
    }

    function doLogin() {
      verifyKyc('kyc-phone-ticket', function() {
        const user = document.getElementById('ticket-user').value;
        document.getElementById('ticket-pass').value = user;
        $(if chap-id)
        document.sendin.username.value = user;
        document.sendin.password.value = hexMD5('$(chap-id)' + user + '$(chap-challenge)');
        document.sendin.submit();
        $(else)
        document.login.submit();
        $(endif)
      });
      return false;
    }

    function doLoginMember() {
      verifyKyc('kyc-phone-member', function() {
        const form = document.mlogin;
        $(if chap-id)
        document.sendin.username.value = form.username.value;
        document.sendin.password.value = hexMD5('$(chap-id)' + form.password.value + '$(chap-challenge)');
        document.sendin.submit();
        $(else)
        form.submit();
        $(endif)
      });
      return false;
    }
  </script>
</body>
</html>`;
