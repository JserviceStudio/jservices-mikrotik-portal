import { baseStyles } from './styles';

/**
 * Template Base 3 — Skyline Premium (Design moderne glassmorphism)
 * Ce template est le design "Skyline" avec glassmorphism, gradients et cartes épurées.
 */
export const buildBase3LoginTemplate = () => `<!DOCTYPE html>
<html lang="<%= branding.language %>">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><%= i18n.loginTitle %> - <%= branding.ispName %></title>
  <style>
    ${baseStyles}
    :root {
      --bg-gradient: linear-gradient(135deg, #f8f9ff 0%, #eef2ff 100%);
      --glass-bg: rgba(255, 255, 255, 0.7);
      --glass-border: rgba(255, 255, 255, 0.5);
      --text-color: #1e293b;
      --text-muted: #64748b;
      --card-bg: #ffffff;
      --input-bg: rgba(255, 255, 255, 0.8);
      --input-border: #f1f5f9;
      --input-text: #1e293b;
      --error-bg: #fef2f2;
      --error-border: #fee2e2;
      --error-text: #ef4444;
    }

    <% if (features.themeMode === 'dark') { %>
      :root {
        --bg-gradient: linear-gradient(135deg, #0f172a 0%, #171717 100%);
        --glass-bg: rgba(30, 41, 59, 0.7);
        --glass-border: rgba(255, 255, 255, 0.1);
        --text-color: #f1f5f9;
        --text-muted: #94a3b8;
        --card-bg: #1e293b;
        --input-bg: rgba(15, 23, 42, 0.6);
        --input-border: rgba(255, 255, 255, 0.1);
        --input-text: #f1f5f9;
        --error-bg: rgba(127, 29, 29, 0.2);
        --error-border: rgba(127, 29, 29, 0.4);
        --error-text: #f87171;
      }
    <% } %>

    <% if (features.themeMode === 'auto') { %>
    @media (prefers-color-scheme: dark) {
      :root {
        --bg-gradient: linear-gradient(135deg, #0f172a 0%, #171717 100%);
        --glass-bg: rgba(30, 41, 59, 0.7);
        --glass-border: rgba(255, 255, 255, 0.1);
        --text-color: #f1f5f9;
        --text-muted: #94a3b8;
        --card-bg: #1e293b;
        --input-bg: rgba(15, 23, 42, 0.6);
        --input-border: rgba(255, 255, 255, 0.1);
        --input-text: #f1f5f9;
        --error-bg: rgba(127, 29, 29, 0.2);
        --error-border: rgba(127, 29, 29, 0.4);
        --error-text: #f87171;
      }
    }
    <% } %>
    body {
      background: var(--bg-gradient);
      padding: 30px 16px;
      color: var(--text-color);
      min-height: 100vh;
      margin: 0;
    }
    .sky-shell {
      max-width: 440px;
      margin: 0 auto;
    }
    .sky-glass {
      background: var(--glass-bg);
      backdrop-filter: blur(16px);
      border: 1px solid var(--glass-border);
      border-radius: 32px;
      padding: 32px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.2);
    }
    .recovery-link { display: block; margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); color: var(--text-color); border-radius: 20px; text-decoration: none; font-size: 0.9rem; font-weight: 700; text-align: center; border: 1px solid var(--glass-border); transition: all 0.3s; } .recovery-link:hover { background: rgba(255,255,255,0.2); }
    .sky-header {
      text-align: center;
      margin-bottom: 32px;
    }
    .sky-logo {
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
      border-radius: 18px;
      background: var(--card-bg);
      padding: 10px;
      box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }
    .sky-title {
      font-size: 1.75rem;
      font-weight: 900;
      letter-spacing: -0.01em;
      background: linear-gradient(to right, var(--primary), var(--secondary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 0;
    }
    .sky-subtitle {
      font-size: 0.95rem;
      color: var(--text-muted);
      margin-top: 4px;
    }
    .sky-input-box {
      margin-bottom: 20px;
      position: relative;
    }
    .sky-input-box input {
      width: 100%;
      background: var(--input-bg);
      border: 2px solid var(--input-border);
      border-radius: 20px;
      padding: 16px 20px;
      font-size: 1rem;
      color: var(--input-text);
      transition: all 0.3s;
    }
    .sky-input-box input:focus {
      border-color: var(--primary);
      background: var(--card-bg);
      outline: none;
      box-shadow: 0 10px 25px -5px color-mix(in srgb, var(--primary) 20%, transparent);
    }
    .sky-btn {
      width: 100%;
      background: var(--primary);
      color: #fff;
      border: none;
      border-radius: 20px;
      padding: 16px;
      font-size: 1.1rem;
      font-weight: 800;
      cursor: pointer;
      box-shadow: 0 10px 20px -5px color-mix(in srgb, var(--primary) 40%, transparent);
      transition: all 0.3s;
    }
    .sky-btn:hover {
      background: var(--secondary);
      transform: translateY(-2px);
    }
    .sky-error {
      background: var(--error-bg);
      border: 1px solid var(--error-border);
      color: var(--error-text);
      border-radius: 16px;
      padding: 14px;
      font-size: 0.9rem;
      margin-bottom: 24px;
      display: <%= mkError ? 'block' : 'none' %>;
      text-align: center;
      font-weight: 700;
      backdrop-filter: blur(8px);
    }
    .phone-input-wrapper {
      display: flex;
      align-items: center;
      background: var(--input-bg);
      border: 2px solid var(--input-border);
      border-radius: 20px;
      overflow: hidden;
      margin-bottom: 20px;
      transition: all 0.3s;
    }
    .phone-input-wrapper:focus-within {
      border-color: var(--primary);
      background: var(--card-bg);
      box-shadow: 0 10px 25px -5px color-mix(in srgb, var(--primary) 20%, transparent);
    }
    .country-code-badge {
      background: rgba(255, 255, 255, 0.1);
      color: var(--primary);
      padding: 0 18px;
      font-weight: 900;
      font-size: 1.1rem;
      border-right: 1px solid var(--input-border);
      height: 56px;
      display: flex;
      align-items: center;
    }
    .phone-input-wrapper input {
      flex: 1;
      border: none !important;
      margin-bottom: 0 !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      height: 56px;
      padding: 0 16px !important;
    }
    .sky-plan-card {
      background: var(--card-bg);
      border-radius: 24px;
      padding: 20px;
      border: 1px solid var(--glass-border);
      margin-top: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-decoration: none;
      color: inherit;
      transition: all 0.3s;
    }
    .sky-plan-card:hover {
      border-color: var(--primary);
      box-shadow: 0 12px 24px rgba(0,0,0,0.1);
      transform: scale(1.02);
    }
    .sky-plan-name {
      font-weight: 800;
      font-size: 1.05rem;
      display: block;
      color: var(--text-color);
    }
    .sky-plan-meta {
      font-size: 0.85rem;
      color: var(--text-muted);
    }
    .sky-plan-price {
      font-weight: 900;
      color: var(--primary);
      font-size: 1.2rem;
    }
    .sky-footer {
      text-align: center;
      margin-top: 40px;
      color: var(--text-muted);
      font-size: 0.85rem;
    }
    .footer-sig {
      text-align: center;
      padding: 24px;
      font-size: 0.75rem;
      color: rgba(255,255,255,0.6);
    }
    .arcep-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: rgba(59, 130, 246, 0.2);
      border: 1px solid rgba(59, 130, 246, 0.3);
      backdrop-filter: blur(10px);
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
      color: #fff;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .kyc-disclaimer {
      font-size: 11px;
      color: rgba(255,255,255,0.7);
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

  <main class="sky-shell">
    <div class="sky-glass">
      <header class="sky-header">
        <% if (branding.logoUrl || (branding.logoPreset && branding.logoPreset !== 'none')) { %>
          <img class="logo" src="<%= logoSrc %>" alt="<%= branding.ispName %>" style="max-width: 120px; max-height: 60px; object-fit: contain; margin: 0 auto 12px; display: block;">
        <% } %>
        <h1 class="sky-title"><%= branding.ispName %></h1>
        <p class="sky-subtitle"><%= branding.wifiName %></p>
      </header>

      <div id="error-box" class="error-msg"><%= mkError %></div>

      <% if (features.kyc.enabled) { %>
        <div class="arcep-badge" style="margin-top: -10px;">
          <div class="arcep-badge-icon">✓</div>
          <span class="arcep-badge-text"><%= i18n.kycArcepBadge %></span>
        </div>
      <% } %>

      <form id="error-box-container" name="login" action="$(link-login-only)" method="post" $(if chap-id) onsubmit="return doLogin()" $(endif)>
        <input type="hidden" name="dst" value="$(link-orig)" />
        <input type="hidden" name="popup" value="true" />
        
        <% if (features.kyc.enabled) { %>
          <div class="sky-input-box">
            <div class="phone-input-wrapper">
                  <span class="country-code-badge"><%= features.kyc.countryCode %></span>
                  <input type="tel" id="kyc-phone-ticket" placeholder="<%= i18n.kycPhonePlaceholder %>" required />
               </div>
               <div class="kyc-disclaimer">
                  <%= i18n.kycDisclaimer %>
               </div>
            </div>
        <% } %>

        <div class="sky-input-box">
          <input type="text" id="sky-user" name="username" placeholder="<%= i18n.ticketCodePlaceholder %>" required />
        </div>
        <div class="hidden">
          <input type="password" id="sky-pass" name="password" />
        </div>

        <button type="submit" class="sky-btn"><%= i18n.connectButton %></button>
      </form>
    </div>

    
      <% if (features && features.enablePaymentLinks) { %>
        <a href="<%= contact.momoRecoveryUrl %>" target="_blank" class="recovery-link">
          Récupérez 🎟️
        </a>
      <% } %>

    <% if (plans.length) { %>
      <h2 style="margin-top: 40px; margin-bottom: 20px; font-size: 1.25rem; font-weight: 800; text-align: center; color: var(--text-color);"><%= i18n.plansTitle %></h2>
      <% plans.forEach(function(plan) { %>
        <a href="<%= (features && features.enablePaymentLinks) ? (buildTiketMomoPaymentUrl(plan, payment.apiKey, payment.gatewayUrl) || '#') : '#' %>" class="sky-plan-card">
          <div style="flex: 1;">
            <span class="sky-plan-name"><%= plan.displayName %></span>
            <span class="sky-plan-meta"><%= plan.durationLabel %> • <%= plan.speedLabel %></span>
            <% if (features && features.enablePaymentLinks && (payment.aggregator !== 'none' || buildTiketMomoPaymentUrl(plan, payment.apiKey, payment.gatewayUrl))) { %>
              <div style="background: rgba(255,255,255,0.2); color: #fff; font-size: 0.65rem; font-weight: 800; padding: 2px 8px; border-radius: 99px; text-transform: uppercase; margin-top: 6px; display: inline-block; border: 1px solid rgba(255,255,255,0.3);"><%= i18n.buyBadge %></div>
            <% } %>
          </div>
          <div class="sky-plan-price"><%= plan.priceLabel %></div>
        </a>
      <% }) %>
    <% } %>

    <footer class="sky-footer">
      <div style="margin-bottom: 12px;">
        <%= i18n.supportLabel %>: <%= contact.phone %>
      </div>
      <div>
        <%= i18n.designBy %> <%= contact.designerName %> &copy; <%= contact.designerYear %>
      </div>
    </footer>
  </main>

  <script src="./md5.js"></script>
  <script>
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
      verifyKyc('kyc-phone', function() {
        const user = document.getElementById('sky-user').value.trim();
        document.getElementById('sky-user').value = user;
        document.getElementById('sky-pass').value = user;
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
  </script>
</body>
</html>`;
