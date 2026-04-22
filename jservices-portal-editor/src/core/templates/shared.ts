import { baseStyles } from './styles';

export const buildStatusTemplate = (variant: TemplateId) => {
  const isBase3 = variant === 'base-3';
  const isBase4 = variant === 'base-4';
  
  return `<!DOCTYPE html>
<html lang="<%= branding.language %>">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><%= i18n.activeSessionTitle %> - <%= branding.ispName %></title>
  ${isBase4 ? '<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">' : ''}
  <style>
    ${baseStyles}
    :root {
      --bg-page: ${
        variant === 'base-1' ? '#f8fbff' : 
        variant === 'base-3' ? 'linear-gradient(135deg, #f8f9ff 0%, #eef2ff 100%)' :
        variant === 'base-4' ? '#f3edf7' :
        '#f8f7fa'
      };
      --bg-card: #ffffff;
      --text-main: #0f172a;
      --text-muted: #64748b;
      --border-color: #f1f5f9;
      --row-border: ${isBase4 ? '#e7e0ec' : '#f1f5f9'};
    }

    <% if (features.themeMode === 'dark') { %>
      :root {
        --bg-page: ${
          variant === 'base-1' ? '#0f172a' : 
          variant === 'base-3' ? 'linear-gradient(135deg, #0f172a 0%, #171717 100%)' :
          variant === 'base-4' ? '#1d1b20' :
          '#1a1a1a'
        };
        --bg-card: ${isBase3 ? 'rgba(30, 41, 59, 0.7)' : (variant === 'base-1' ? '#1e293b' : '#2d2d2d')};
        --text-main: #f1f5f9;
        --text-muted: #94a3b8;
        --border-color: rgba(255, 255, 255, 0.1);
        --row-border: rgba(255, 255, 255, 0.1);
      }
    <% } %>

    <% if (features.themeMode === 'auto') { %>
    @media (prefers-color-scheme: dark) {
      :root {
        --bg-page: ${
          variant === 'base-1' ? '#0f172a' : 
          variant === 'base-3' ? 'linear-gradient(135deg, #0f172a 0%, #171717 100%)' :
          variant === 'base-4' ? '#1d1b20' :
          '#1a1a1a'
        };
        --bg-card: ${isBase3 ? 'rgba(30, 41, 59, 0.7)' : (variant === 'base-1' ? '#1e293b' : '#2d2d2d')};
        --text-main: #f1f5f9;
        --text-muted: #94a3b8;
        --border-color: rgba(255, 255, 255, 0.1);
        --row-border: rgba(255, 255, 255, 0.1);
      }
    }
    <% } %>

    body {
      background: var(--bg-page);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      min-height: 100vh;
      margin: 0;
      color: var(--text-main);
      transition: all 0.3s ease;
      font-family: ${isBase4 ? "'Roboto', sans-serif" : 'inherit'};
    }
    .card {
      width: min(100%, 420px);
      background: var(--bg-card);
      ${isBase3 ? 'backdrop-filter: blur(16px);' : ''}
      border: ${isBase3 ? '1px solid var(--border-color)' : (isBase4 ? 'none' : '1px solid var(--border-color)')};
      border-radius: ${isBase4 ? '28px' : (isBase3 ? '32px' : '24px')};
      padding: 32px;
      box-shadow: ${isBase4 ? '0px 1px 3px 1px rgba(0, 0, 0, 0.15)' : '0 20px 40px rgba(0, 0, 0, 0.05)'};
    }
    h1 {
      margin: 0 0 24px;
      color: var(--primary);
      font-size: ${isBase4 ? '24px' : '1.5rem'};
      font-weight: ${isBase4 ? '400' : '800'};
      text-align: ${isBase4 || isBase3 ? 'center' : 'left'};
    }
    .row {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 16px 0;
      border-bottom: 1px solid var(--row-border);
      font-size: 0.95rem;
    }
    .row span:first-child { color: var(--text-muted); }
    .row span:last-child { font-weight: 700; color: var(--text-main); text-align: right; }
    button {
      width: 100%;
      margin-top: 32px;
      border: 0;
      border-radius: ${isBase4 ? '100px' : '20px'};
      padding: 14px;
      background: ${isBase4 ? '#b3261e' : '#ef4444'};
      color: #fff;
      font-weight: ${isBase4 ? '500' : '800'};
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    button:hover { opacity: 0.9; transform: translateY(-1px); }
  </style>
</head>
<body>
  <main class="card">
    <h1><%= i18n.activeSessionTitle %></h1>
    <div class="row"><span><%= i18n.usernameLabel %></span><span>$(username)</span></div>
    <div class="row"><span><%= i18n.ipLabel %></span><span>$(ip)</span></div>
    <div class="row"><span><%= i18n.sessionTimeLeftLabel %></span><span>$(session-time-left)</span></div>
    <div class="row"><span><%= i18n.dataUsedLabel %></span><span>$(bytes-out-nice)</span></div>
    <form action="$(link-logout)" method="post">
      <input type="hidden" name="erase-cookie" value="on">
      <button type="submit"><%= i18n.logoutButton %></button>
    </form>
  </main>
</body>
</html>`;
};

export const buildLogoutTemplate = (variant: TemplateId) => {
  const isBase3 = variant === 'base-3';
  const isBase4 = variant === 'base-4';
  
  return `<!DOCTYPE html>
<html lang="<%= branding.language %>">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><%= i18n.logoutButton %> - <%= branding.ispName %></title>
  ${isBase4 ? '<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">' : ''}
  <style>
    ${baseStyles}
    :root {
      --bg-page: ${
        variant === 'base-1' ? '#f8fbff' : 
        variant === 'base-3' ? 'linear-gradient(135deg, #f8f9ff 0%, #eef2ff 100%)' :
        variant === 'base-4' ? '#f3edf7' :
        '#f8f7fa'
      };
      --bg-card: #ffffff;
      --text-main: #0f172a;
      --text-muted: #64748b;
      --border-color: #f1f5f9;
    }

    <% if (features.themeMode === 'dark') { %>
      :root {
        --bg-page: ${
          variant === 'base-1' ? '#0f172a' : 
          variant === 'base-3' ? 'linear-gradient(135deg, #0f172a 0%, #171717 100%)' :
          variant === 'base-4' ? '#1d1b20' :
          '#1a1a1a'
        };
        --bg-card: ${isBase3 ? 'rgba(30, 41, 59, 0.7)' : (variant === 'base-1' ? '#1e293b' : '#2d2d2d')};
        --text-main: #f1f5f9;
        --text-muted: #94a3b8;
        --border-color: rgba(255, 255, 255, 0.1);
      }
    <% } %>

    <% if (features.themeMode === 'auto') { %>
    @media (prefers-color-scheme: dark) {
      :root {
        --bg-page: ${
          variant === 'base-1' ? '#0f172a' : 
          variant === 'base-3' ? 'linear-gradient(135deg, #0f172a 0%, #171717 100%)' :
          variant === 'base-4' ? '#1d1b20' :
          '#1a1a1a'
        };
        --bg-card: ${isBase3 ? 'rgba(30, 41, 59, 0.7)' : (variant === 'base-1' ? '#1e293b' : '#2d2d2d')};
        --text-main: #f1f5f9;
        --text-muted: #94a3b8;
        --border-color: rgba(255, 255, 255, 0.1);
      }
    }
    <% } %>

    body {
      background: var(--bg-page);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      min-height: 100vh;
      margin: 0;
      color: var(--text-main);
      transition: all 0.3s ease;
      font-family: ${isBase4 ? "'Roboto', sans-serif" : 'inherit'};
    }
    .card {
      width: min(100%, 420px);
      background: var(--bg-card);
      ${isBase3 ? 'backdrop-filter: blur(16px);' : ''}
      border: ${isBase3 ? '1px solid var(--border-color)' : (isBase4 ? 'none' : '1px solid var(--border-color)')};
      border-radius: ${isBase4 ? '28px' : (isBase3 ? '32px' : '24px')};
      padding: 40px 32px;
      text-align: center;
      box-shadow: ${isBase4 ? '0px 1px 3px 1px rgba(0, 0, 0, 0.15)' : '0 20px 40px rgba(0, 0, 0, 0.05)'};
    }
    h1 {
      margin: 0 0 16px;
      color: var(--primary);
      font-size: ${isBase4 ? '28px' : '1.8rem'};
      font-weight: ${isBase4 ? '400' : '800'};
    }
    p {
      margin: 0 0 32px;
      color: var(--text-muted);
      line-height: 1.6;
      font-size: 1rem;
    }
    a {
      display: inline-block;
      width: 100%;
      border-radius: ${isBase4 ? '100px' : '20px'};
      padding: 16px;
      text-decoration: none;
      font-weight: ${isBase4 ? '500' : '800'};
      background: ${isBase4 ? 'var(--primary)' : 'linear-gradient(135deg, var(--primary), var(--secondary))'};
      color: #fff;
      transition: all 0.2s;
    }
    a:hover { opacity: 0.9; transform: translateY(-1px); }
  </style>
</head>
<body>
  <main class="card">
    <h1><%= i18n.goodbyeTitle %></h1>
    <p><%= i18n.logoutMessage %></p>
    <a href="login.html"><%= i18n.reconnectButton %></a>
  </main>
</body>
</html>`;
};

export const buildAloginTemplate = () => `<!DOCTYPE html>
<html lang="<%= branding.language %>">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><%= i18n.successTitle %></title>
  <meta http-equiv="refresh" content="2; url=$(link-redirect)">
  <style>
    ${baseStyles}
    :root {
      --bg-page: #f8f7fa;
      --bg-card: #ffffff;
      --text-main: #0f172a;
      --text-muted: #64748b;
      --border-color: #e2e8f0;
    }

    <% if (features.themeMode === 'dark') { %>
      :root {
        --bg-page: #1a1a1a;
        --bg-card: #2d2d2d;
        --text-main: #f1f5f9;
        --text-muted: #94a3b8;
        --border-color: rgba(255, 255, 255, 0.1);
      }
    <% } %>

    <% if (features.themeMode === 'auto') { %>
    @media (prefers-color-scheme: dark) {
      :root {
        --bg-page: #1a1a1a;
        --bg-card: #2d2d2d;
        --text-main: #f1f5f9;
        --text-muted: #94a3b8;
        --border-color: rgba(255, 255, 255, 0.1);
      }
    }
    <% } %>

    body {
      background: var(--bg-page);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      min-height: 100vh;
      margin: 0;
      color: var(--text-main);
      transition: all 0.3s ease;
    }
    .card {
      width: min(100%, 390px);
      background: var(--bg-card);
      border-radius: 24px;
      padding: 28px;
      text-align: center;
      box-shadow: 0 18px 36px rgba(15, 23, 42, 0.10);
      border: 1px solid var(--border-color);
    }
    h1 { margin: 0 0 10px; color: var(--primary); }
    p { color: var(--text-muted); }
    .loader {
      width: 42px;
      height: 42px;
      border-radius: 999px;
      margin: 18px auto;
      border: 4px solid var(--border-color);
      border-top-color: var(--primary);
      animation: spin 1s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <main class="card">
    <h1><%= i18n.successTitle %></h1>
    <p><%= i18n.successMessage %></p>
    <div class="loader"></div>
    <p><%= i18n.redirectingMessage %></p>
  </main>
</body>
</html>`;

export const buildErrorTemplate = () => `<!DOCTYPE html>
<html lang="<%= branding.language %>">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><%= i18n.errorTitle %> - <%= branding.ispName %></title>
  <style>
    ${baseStyles}
    :root {
      --bg-page: #fff5f5;
      --bg-card: #ffffff;
      --text-main: #9f1239;
      --border-color: #fecdd3;
      --error-color: #be123c;
    }

    <% if (features.themeMode === 'dark') { %>
      :root {
        --bg-page: #451a1a;
        --bg-card: #2d1616;
        --text-main: #fda4af;
        --border-color: rgba(255, 255, 255, 0.1);
        --error-color: #fb7185;
      }
    <% } %>

    <% if (features.themeMode === 'auto') { %>
    @media (prefers-color-scheme: dark) {
      :root {
        --bg-page: #451a1a;
        --bg-card: #2d1616;
        --text-main: #fda4af;
        --border-color: rgba(255, 255, 255, 0.1);
        --error-color: #fb7185;
      }
    }
    <% } %>

    body {
      background: var(--bg-page);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      min-height: 100vh;
      margin: 0;
      color: var(--text-main);
      transition: all 0.3s ease;
    }
    .card {
      width: min(100%, 390px);
      background: var(--bg-card);
      border-radius: 24px;
      padding: 28px;
      text-align: center;
      border: 1px solid var(--border-color);
      box-shadow: 0 18px 36px rgba(190, 24, 93, 0.08);
    }
    h1 { margin: 0 0 10px; color: var(--error-color); }
    p { color: var(--text-main); }
    a {
      display: inline-block;
      width: 100%;
      margin-top: 16px;
      border-radius: 16px;
      padding: 14px;
      text-decoration: none;
      font-weight: 800;
      background: var(--error-color);
      color: #fff;
    }
  </style>
</head>
<body>
  <main class="card">
    <h1><%= i18n.errorTitle %></h1>
    <p>$(error)</p>
    <a href="login.html"><%= i18n.retryButton %></a>
  </main>
</body>
</html>`;

export const REDIRECT_HTML = `<!DOCTYPE html>
<html>
<head>
  <title>Redirection...</title>
  <meta http-equiv="refresh" content="0; url=$(link-redirect)">
  <meta http-equiv="pragma" content="no-cache">
  <meta http-equiv="expires" content="-1">
</head>
<body></body>
</html>`;

export const RADVERT_HTML = `<!DOCTYPE html>
<html>
<head>
  <title>Publicité</title>
  <meta http-equiv="refresh" content="3; url=login.html">
</head>
<body></body>
</html>`;
