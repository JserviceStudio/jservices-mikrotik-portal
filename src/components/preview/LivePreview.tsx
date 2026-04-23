import { useEffect, useState } from 'react';
import ejs from 'ejs';
import { useStore } from '../../store/useStore';
import { getTemplateDefinition, getTemplateTexts } from '../../core/templates';

const MOCK_MIKROTIK_CONFIG = {
  loginUrl: 'https://demo.mikrotik.com/login',
  linkOrig: 'https://google.com',
  serverName: 'HOTSPOT-SRV',
  mac: '00:11:22:33:44:55',
  ip: '10.0.0.100'
};

const PREVIEW_MIKROTIK_VALUES: Record<string, string> = {
  '$(link-login-only)': 'https://demo.mikrotik.com/login',
  '$(link-orig)': 'https://google.com',
  '$(link-orig-esc)': 'https%3A%2F%2Fgoogle.com',
  '$(link-logout)': '#logout-demo',
  '$(link-redirect)': '#redirect-demo',
  '$(link-status-esc)': '#status-demo',
  '$(server-name)': 'HOTSPOT-SRV',
  '$(mac)': '00:11:22:33:44:55',
  '$(mac-esc)': '00%3A11%3A22%3A33%3A44%3A55',
  '$(ip)': '10.0.0.100',
  '$(username)': 'demo-user',
  '$(session-time-left)': '03:42:15',
  '$(bytes-out-nice)': '512 MB',
  '$(error)': '',
  '$(chap-id)': 'chap-demo',
  '$(chap-challenge)': 'challenge-demo',
};

const sanitizeMikroTikPreview = (html: string) => {
  let output = html;

  // Keep the first branch for preview and drop RouterOS directives.
  output = output.replace(/\$\(if [^)]+\)([\s\S]*?)\$\(else\)([\s\S]*?)\$\(endif\)/g, '$1');
  output = output.replace(/\$\(if [^)]+\)([\s\S]*?)\$\(endif\)/g, '$1');
  output = output.replace(/\$\(else\)/g, '');
  output = output.replace(/\$\(endif\)/g, '');
  output = output.replace(/\$\(if [^)]+\)/g, '');

  Object.entries(PREVIEW_MIKROTIK_VALUES).forEach(([key, value]) => {
    output = output.split(key).join(value);
  });

  return output;
};

const buildPreviewDocument = (html: string, mode: 'mobile' | 'desktop') => {
  const previewCss = `
    <style>
      html, body {
        ${mode === 'mobile' ? 'scrollbar-width: none;' : ''}
      }
      ${mode === 'mobile' ? 'body::-webkit-scrollbar { display: none; }' : ''}
    </style>
  `;

  if (html.includes('</head>')) {
    return html.replace('</head>', `${previewCss}</head>`);
  }

  return `${previewCss}${html}`;
};

export const LivePreview = () => {
  const settings = useStore((state) => state.settings);
  const [htmlContent, setHtmlContent] = useState({ mobile: '', desktop: '' });

  useEffect(() => {
    try {
      const template = getTemplateDefinition(settings.template_id);
      const rendered = ejs.render(template.files['login.html'], {
        ...settings,
        mkConfig: MOCK_MIKROTIK_CONFIG,
        mkError: '',
        i18n: getTemplateTexts(settings.branding.language, {
          wifiName: settings.branding.wifiName,
          ispName: settings.branding.ispName,
          plansSectionTitle: settings.payment.aggregator !== 'none' 
            ? (settings.branding.language === 'en' ? '📦 Buy WiFi Plans' : '📦 Achetez Forfaits WiFi')
            : (settings.branding.language === 'en' ? '📦 Our WiFi Plans' : '📦 Nos Forfaits WiFi'),
        }),
        logoSrc:
          settings.branding.logoUrl ||
          (settings.branding.logoPreset === 'jservices'
            ? '/portal-editor/assets/presets/jservices.png'
            : settings.branding.logoPreset === 'jconnect'
              ? '/portal-editor/assets/presets/jconnect.png'
              : ''),
      });
      const sanitized = sanitizeMikroTikPreview(rendered);
      setHtmlContent({
        mobile: buildPreviewDocument(sanitized, 'mobile'),
        desktop: buildPreviewDocument(sanitized, 'desktop'),
      });
    } catch (e) {
      console.error('Erreur EJS Render:', e);
      const errorHtml = '<h2>Erreur de compilation du template</h2><p>' + String(e) + '</p>';
      setHtmlContent({ mobile: errorHtml, desktop: errorHtml });
    }
  }, [settings]);

  return (
    <div className="flex-1 bg-slate-100 h-screen overflow-y-auto w-full">
      <div className="min-h-full p-6 xl:p-8">
        <div className="mb-6 flex flex-col gap-2">
          <h2 className="text-lg font-bold text-slate-900">Aperçu en direct</h2>
          <p className="text-sm text-slate-500">Vue mobile dans le mockup et rendu desktop côte à côte.</p>
        </div>

        <div className="grid gap-6 2xl:grid-cols-[430px,minmax(0,1fr)] xl:grid-cols-[400px,minmax(0,1fr)]">
          <section className="rounded-[2rem] border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Mockup Mobile</h3>
                <p className="text-xs text-slate-500">Prévisualisation téléphone sans scrollbar visible.</p>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[800px] w-[380px] max-w-full shadow-2xl">
                <div className="w-[148px] h-[34px] bg-gray-800 absolute top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2"></div>
                <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
                <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
                <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>

                <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white">
                  <iframe
                    srcDoc={htmlContent.mobile}
                    className="h-full w-full border-none"
                    title="Live Preview Mobile"
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Mockup PC</h3>
                <p className="text-xs text-slate-500">Prévisualisation desktop intégrée dans un ordinateur.</p>
              </div>
            </div>

            <div className="mx-auto w-full max-w-[980px]">
              <div className="rounded-[2.25rem] bg-gradient-to-b from-slate-200 via-slate-100 to-slate-300 p-4 shadow-[0_30px_80px_rgba(15,23,42,0.16)]">
                <div className="overflow-hidden rounded-[1.4rem] border border-slate-300 bg-[#111827] shadow-inner">
                  <div className="flex items-center gap-2 border-b border-slate-700 bg-slate-900 px-4 py-3">
                    <span className="h-3 w-3 rounded-full bg-rose-400"></span>
                    <span className="h-3 w-3 rounded-full bg-amber-400"></span>
                    <span className="h-3 w-3 rounded-full bg-emerald-400"></span>
                    <div className="ml-3 rounded-full bg-slate-800 px-4 py-1 text-xs text-slate-400">
                      https://preview.local/<span className="text-slate-200">{settings.template_id}</span>
                    </div>
                  </div>
                  <iframe
                    srcDoc={htmlContent.desktop}
                    className="h-[640px] w-full border-none bg-white"
                    title="Live Preview Desktop"
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
              </div>
              <div className="mx-auto h-5 w-[22%] min-w-[160px] rounded-b-[1.2rem] bg-slate-300 shadow-[0_10px_24px_rgba(15,23,42,0.15)]"></div>
              <div className="mx-auto h-20 w-28 rounded-b-[2rem] bg-gradient-to-b from-slate-300 to-slate-400 shadow-[0_18px_30px_rgba(15,23,42,0.14)]"></div>
              <div className="mx-auto -mt-3 h-4 w-56 rounded-full bg-slate-300/70 blur-md"></div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
