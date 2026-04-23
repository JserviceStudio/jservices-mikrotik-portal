import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import ejs from 'ejs';
import { SettingsSchema } from '../store/useStore';
import { getTemplateDefinition, getTemplateTexts } from '../core/templates';

const DEFAULT_MIKROTIK_VARS = {
  loginUrl: '$(link-login-only)',
  linkOrig: '$(link-orig)',
  serverName: '$(server-name)',
  mac: '$(mac)',
  ip: '$(ip)',
  error: '$(error)',
  chapId: '$(chap-id)',
  chapChallenge: '$(chap-challenge)'
};

export const exportTemplateZip = async (settings: SettingsSchema) => {
  try {
    const zip = new JSZip();
    const template = getTemplateDefinition(settings.template_id);
    const logoSrc = settings.branding.logoUrl || (settings.branding.logoPreset === 'jservices' ? './img/jservices.png' : settings.branding.logoPreset === 'jconnect' ? './img/jconnect.png' : '');

    const render = (template: string) => ejs.render(template, {
      ...settings,
      mkConfig: DEFAULT_MIKROTIK_VARS,
      mkError: 'Aperçu d’erreur',
      logoSrc,
      i18n: getTemplateTexts(settings.branding.language, {
        wifiName: settings.branding.wifiName,
        ispName: settings.branding.ispName,
        plansSectionTitle: settings.payment.aggregator !== 'none' ? '📦 Forfaits WiFi' : '📦 Nos Forfaits WiFi',
      }),
    });

    const imgFolder = zip.folder('img');
    if (settings.branding.logoPreset === 'jservices') {
      const resp = await fetch('assets/presets/jservices.png');
      imgFolder?.file('jservices.png', await resp.blob());
    } else if (settings.branding.logoPreset === 'jconnect') {
      const resp = await fetch('assets/presets/jconnect.png');
      imgFolder?.file('jconnect.png', await resp.blob());
    }

    Object.entries(template.files).forEach(([filename, content]) => {
      zip.file(filename, filename.endsWith('.html') ? render(content) : content);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `hotspot-${Date.now()}.zip`);
  } catch (error) {
    alert('Erreur lors de la compression.');
  }
};
