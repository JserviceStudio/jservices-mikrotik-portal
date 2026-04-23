import { baseStyles } from './styles';

/**
 * Template Base 4 — Material Design 3 (M3) Mode
 * Ce template utilise les principes de Google Material Design 3 :
 * - Surfaces tonales
 * - Coins très arrondis
 * - Typographie lisible (inspirée M3)
 * - Champs de saisie M3
 */
export const buildBase4LoginTemplate = () => `<!DOCTYPE html>
<html lang="<%= branding.language %>">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><%= i18n.loginTitle %> - <%= branding.ispName %></title>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700;900&display=swap" rel="stylesheet">
  <style>
    ${baseStyles}
    :root {
      /* M3 Light Palette (Default) */
      --md-surface: #ffffff;
      --md-surface-container: #f7f2fa;
      --md-on-surface: #1d1b20;
      --md-on-surface-variant: #49454f;
      --md-outline: #79747e;
      --md-error: #b3261e;
      --md-on-error: #ffffff;
      --md-primary: <%= branding.primaryColor %>;
      --md-secondary: <%= branding.secondaryColor %>;
      --font-family: '<%= branding.fontFamily %>';
    }

    <% if (features.themeMode === 'dark') { %>
      :root {
        --md-surface: #1d1b20;
        --md-surface-container: #141218;
        --md-on-surface: #e6e1e5;
        --md-on-surface-variant: #cac4d0;
        --md-outline: #938f99;
      }
      .m3-contact-card { border-color: rgba(255, 255, 255, 0.1) !important; }
      .m3-plan-card { background-color: #2b2930 !important; }
      .m3-badge.popular { background: #450a0a; color: #fecaca; }
      .m3-badge.vip { background: #422006; color: #fef08a; }
      .m3-badge.eco { background: #064e3b; color: #d1fae5; }
    <% } %>

    <% if (features.themeMode === 'auto') { %>
    @media (prefers-color-scheme: dark) {
      :root {
        --md-surface: #1d1b20;
        --md-surface-container: #141218;
        --md-on-surface: #e6e1e5;
        --md-on-surface-variant: #cac4d0;
        --md-outline: #938f99;
      }
      .m3-contact-card { border-color: rgba(255, 255, 255, 0.1) !important; }
      .m3-plan-card { background-color: #2b2930 !important; }
      .m3-badge.popular { background: #450a0a; color: #fecaca; }
      .m3-badge.vip { background: #422006; color: #fef08a; }
      .m3-badge.eco { background: #064e3b; color: #d1fae5; }
    }
    <% } %>

    body {
      background-color: var(--md-surface-container);
      color: var(--md-on-surface);
      font-family: 'Outfit', var(--font-family), sans-serif;
      padding: 0;
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .m3-container {
      width: 100%;
      max-width: 480px;
      padding: 24px;
    }
    .m3-card {
      background-color: var(--md-surface);
      border-radius: 28px;
      padding: 32px 24px;
      box-shadow: var(--md-elevation-1);
      margin-bottom: 24px;
      text-align: center;
    }
    .m3-logo {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
      margin-bottom: 16px;
      /* Material Design emphasizes circular or highly rounded logos */
    }
    .m3-title {
      font-size: 32px;
      font-weight: 400;
      margin: 0 0 8px 0;
      line-height: 40px;
      color: var(--md-on-surface);
    }
    .m3-subtitle {
      font-size: 14px;
      font-weight: 400;
      letter-spacing: 0.25px;
      color: var(--md-on-surface-variant);
      margin: 0 0 32px 0;
    }
    .m3-error {
      background-color: var(--md-error);
      color: var(--md-on-error);
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 24px;
      font-size: 14px;
      display: <%= mkError ? 'block' : 'none' %>;
      text-align: left;
    }
    /* M3 Outlined Text Field */
    .m3-text-field {
      position: relative;
      margin-bottom: 24px;
    }
    .m3-text-field input {
      width: 100%;
      padding: 16px 16px;
      font-family: var(--font-family);
      font-size: 16px;
      color: var(--md-on-surface);
      background: transparent;
      border: 1px solid var(--md-outline);
      border-radius: 12px;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .m3-text-field input:focus {
      outline: none;
      border-color: var(--primary);
      border-width: 2px;
      padding: 15px 15px; /* Adjust for border width change */
    }
    .m3-text-field label {
      position: absolute;
      left: 12px;
      top: -8px;
      background-color: var(--md-surface);
      padding: 0 4px;
      color: var(--md-on-surface-variant);
      font-size: 12px;
      letter-spacing: 0.4px;
    }
    .m3-text-field input:focus + label {
      color: var(--primary);
    }
    .phone-input-wrapper {
      display: flex;
      align-items: center;
      background: transparent;
      border: 1px solid var(--md-outline);
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 24px;
      transition: all 0.2s;
    }
    .phone-input-wrapper:focus-within {
      border-color: var(--primary);
      border-width: 2px;
    }
    .country-code-badge {
      background: var(--md-surface-container);
      color: var(--md-on-surface-variant);
      padding: 0 16px;
      font-weight: 700;
      font-size: 16px;
      border-right: 1px solid var(--md-outline);
      height: 56px;
      display: flex;
      align-items: center;
      user-select: none;
    }
    .phone-input-wrapper input {
      flex: 1;
      border: none !important;
      margin-bottom: 0 !important;
      border-radius: 0 !important;
      box-shadow: none !important;
      height: 56px;
      padding: 0 16px !important;
      background: transparent !important;
    }
    .kyc-label {
      text-align: left;
      font-size: 12px;
      color: var(--md-on-surface-variant);
      margin-bottom: 4px;
      display: block;
      padding-left: 4px;
    }
    /* M3 Filled Button */
    .m3-button {
      width: 100%;
      background-color: var(--primary);
      color: #ffffff; /* Assuming primary is dark enough, otherwise typically var(--on-primary) */
      border: none;
      border-radius: 100px; /* Fully rounded */
      padding: 10px 24px;
      min-height: 40px;
      font-family: var(--font-family);
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 0.1px;
      cursor: pointer;
      transition: background-color 0.2s, box-shadow 0.2s;
    }
    .m3-button:hover {
      box-shadow: var(--md-elevation-1);
      /* Simple hover effect */
      filter: brightness(0.92);
    }
    .m3-button:active {
      box-shadow: none;
    }
    /* Plans Section */
    .m3-section-title {
      font-size: 16px;
      font-weight: 500;
      letter-spacing: 0.15px;
      color: var(--md-on-surface-variant);
      margin-bottom: 24px;
      padding-left: 8px;
    }
    .m3-plans-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    .m3-plan-card {
      background-color: var(--md-surface);
      border-radius: 20px;
      padding: 20px 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      text-decoration: none;
      color: inherit;
      box-shadow: var(--md-elevation-1);
      transition: all 0.2s;
      border: 1px solid transparent;
    }
    .m3-plan-card:hover {
      box-shadow: var(--md-elevation-2);
      border-color: var(--primary);
      background-color: color-mix(in srgb, var(--primary) 4%, var(--md-surface));
    }
    .m3-plan-card-content {
      display: flex;
      flex-direction: column;
    }
    .m3-plan-name {
      font-size: 15px;
      font-weight: 700;
      margin-bottom: 4px;
      color: var(--md-on-surface);
    }
    .m3-plan-meta {
      font-size: 12px;
      color: var(--md-on-surface-variant);
      margin-bottom: 12px;
    }
    .m3-plan-price {
      font-size: 20px;
      font-weight: 800;
      color: var(--primary);
      background: color-mix(in srgb, var(--primary) 8%, transparent);
      padding: 4px 12px;
      border-radius: 99px;
    }
    .m3-badge {
      font-size: 10px;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 99px;
      text-transform: uppercase;
      margin-top: 8px;
    }
    .m3-badge.popular { background: #fee2e2; color: #991b1b; }
    .m3-badge.vip { background: #fef9c3; color: #854d0e; }
    .m3-badge.eco { background: #dcfce7; color: #166534; }

    /* Contact Card */
    .m3-contact-card {
      background-color: var(--md-surface);
      border-radius: 24px;
      padding: 24px;
      margin-top: 24px;
      border: 1px solid var(--md-outline);
      opacity: 0.9;
      text-align: center;
    }
    .m3-contact-title {
      font-size: 14px;
      font-weight: 800;
      color: var(--md-on-surface);
      margin-bottom: 20px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    .m3-contact-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      margin-bottom: 16px;
      font-size: 14px;
      color: var(--md-on-surface-variant);
    }
    .m3-contact-icon {
      font-size: 18px;
      opacity: 0.7;
    }

    /* Floating WhatsApp */
    .m3-whatsapp-fab {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 56px;
      height: 56px;
      background-color: #25d366;
      border-radius: 50%;
      box-shadow: 0 8px 16px rgba(37, 211, 102, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      text-decoration: none;
      font-size: 24px;
      color: white;
    }

    /* Footer */
    .m3-footer {
      text-align: center;
      padding: 32px 16px;
      font-size: 0.75rem;
      color: var(--md-on-surface-variant);
      opacity: 0.8;
      width: 100%;
    }
    .arcep-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: color-mix(in srgb, var(--primary) 10%, var(--surface));
      border: 1px solid color-mix(in srgb, var(--primary) 20%, var(--surface));
      border-radius: 12px;
      margin-bottom: 24px;
      animation: pulse 2s infinite;
    }
    .arcep-badge-icon {
      width: 18px;
      height: 18px;
      background: var(--primary);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--on-primary);
      font-size: 10px;
      font-weight: 900;
    }
    .arcep-badge-text {
      font-size: 11px;
      font-weight: 700;
      color: var(--primary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .kyc-disclaimer {
      font-size: 12px;
      color: var(--text-muted);
      line-height: 1.6;
      margin-top: 16px;
      text-align: left;
      padding: 12px;
      background: color-mix(in srgb, var(--primary) 5%, var(--surface));
      border-radius: 8px;
    }
    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(103, 80, 164, 0.2); }
      70% { box-shadow: 0 0 0 8px rgba(103, 80, 164, 0); }
      100% { box-shadow: 0 0 0 0 rgba(103, 80, 164, 0); }
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

  <main class="m3-container">
    <div class="m3-card">
      <% if (branding.logoUrl || (branding.logoPreset && branding.logoPreset !== 'none')) { %>
        <img class="logo" src="<%= logoSrc %>" alt="<%= branding.ispName %>" style="max-width: 120px; max-height: 60px; object-fit: contain; margin: 0 auto 12px; display: block;">
      <% } %>
      <h1 class="m3-title"><%= branding.ispName %></h1>
      <p class="m3-subtitle"><%= branding.wifiName %></p>

      <div id="error-box" class="m3-error"><%= mkError %></div>

      <% if (features.kyc.enabled) { %>
        <div class="arcep-badge" style="margin-top: -8px;">
          <div class="arcep-badge-icon">✓</div>
          <span class="arcep-badge-text"><%= i18n.kycArcepBadge %></span>
        </div>
      <% } %>

      <form name="login" action="$(link-login-only)" method="post" $(if chap-id) onsubmit="return doLogin()" $(endif)>
        <input type="hidden" name="dst" value="$(link-orig)" />
        <input type="hidden" name="popup" value="true" />
        
        <% if (features.kyc.enabled) { %>
          <label class="kyc-label"><%= i18n.kycPhoneLabel %></label>
          <div class="phone-input-wrapper">
             <span class="country-code-badge"><%= features.kyc.countryCode %></span>
             <input type="tel" id="kyc-phone-ticket" placeholder="<%= i18n.kycPhonePlaceholder %>" required />
          </div>
          <div class="kyc-disclaimer">
            <%= i18n.kycDisclaimer %>
          </div>
        <% } %>

        <div class="m3-text-field">
          <input type="text" id="m3-user" name="username" placeholder=" " required />
          <label for="m3-user"><%= i18n.ticketCodeLabel || i18n.ticketCodePlaceholder %></label>
        </div>
        
        <div class="hidden" style="display: none;">
          <input type="password" id="m3-pass" name="password" />
        </div>

        <button type="submit" class="m3-button"><%= i18n.connectButton %></button>
      </form>
    </div>

    <% if (plans.length) { %>
      <div class="m3-section-title"><%= i18n.plansTitle %></div>
      <div class="m3-plans-grid">
        <% plans.forEach(function(plan) { %>
          <a href="<%= plan.paymentUrl || '#' %>" class="m3-plan-card">
            <span class="m3-plan-name"><%= plan.displayName %></span>
            <span class="m3-plan-meta"><%= plan.durationLabel %></span>
            <div class="m3-plan-price"><%= plan.priceLabel %></div>
            <% if (plan.badge && plan.badge !== 'none') { %>
              <span class="m3-badge <%= plan.badge %>"><%= plan.badge %></span>
            <% } %>
            <% if (payment.aggregator !== 'none' || plan.paymentUrl) { %>
              <span class="m3-badge" style="background: var(--md-primary); color: var(--md-on-primary); margin-top: 8px;"><%= i18n.buyBadge %></span>
            <% } %>
          </a>
        <% }) %>
      </div>
    <% } %>

    <div class="m3-contact-card">
      <div class="m3-contact-title"><%= i18n.contactInfoTitle %></div>
      <% if (contact.address) { %>
        <div class="m3-contact-item">
          <span class="m3-contact-icon">📍</span>
          <span><%= contact.address %></span>
        </div>
      <% } %>
      <% if (contact.phone) { %>
        <div class="m3-contact-item">
          <span class="m3-contact-icon">📞</span>
          <span><%= contact.phone %></span>
        </div>
      <% } %>
      <% if (contact.email) { %>
        <div class="m3-contact-item">
          <span class="m3-contact-icon">✉️</span>
          <span><%= contact.email %></span>
        </div>
      <% } %>
    </div>

    <% if (contact.whatsapp) { %>
      <a href="https://wa.me/<%= contact.whatsapp %>" class="m3-whatsapp-fab" title="WhatsApp Support">
        💬
      </a>
    <% } %>

    <footer class="m3-footer">
      <div><%= branding.ispName %> &copy; <%= contact.designerYear %></div>
      <div><%= i18n.designBy %> <%= contact.designerName %></div>
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
        const user = document.getElementById('m3-user').value.trim();
        document.getElementById('m3-user').value = user;
        document.getElementById('m3-pass').value = user;
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
