import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import ejs from 'ejs';
import { SettingsSchema } from '../store/useStore';
import { getTemplateDefinition, getTemplateTexts } from '../core/templates';

// Code RouterOS MikroTik par défaut pour le rendu EJS
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
    const logoSrc =
      settings.branding.logoUrl ||
      (settings.branding.logoPreset === 'jservices'
        ? './img/jservices.png'
        : settings.branding.logoPreset === 'jconnect'
          ? './img/jconnect.png'
          : '');

    // Rendu des fichiers HTML via EJS
    const render = (template: string) => ejs.render(template, {
      ...settings,
      mkConfig: DEFAULT_MIKROTIK_VARS,
      mkError: 'Aperçu d’erreur',
      logoSrc,
      i18n: getTemplateTexts(settings.branding.language, {
        wifiName: settings.branding.wifiName,
        ispName: settings.branding.ispName,
        plansSectionTitle: settings.payment.aggregator !== 'none'
          ? (settings.branding.language === 'en' ? '📦 Buy WiFi Plans' : '📦 Achetez Forfaits WiFi')
          : (settings.branding.language === 'en' ? '📦 Our WiFi Plans' : '📦 Nos Forfaits WiFi'),
      }),
    });

    // Gérer les assets (logos locaux)
    const imgFolder = zip.folder('img');
    if (settings.branding.logoPreset === 'jservices') {
      try {
        const response = await fetch('/assets/presets/jservices.png');
        const blob = await response.blob();
        imgFolder?.file('jservices.png', blob);
      } catch (e) {
        console.error('Erreur lors de la récupération du logo preset:', e);
      }
    } else if (settings.branding.logoPreset === 'jconnect') {
      try {
        const response = await fetch('/assets/presets/jconnect.png');
        const blob = await response.blob();
        imgFolder?.file('jconnect.png', blob);
      } catch (e) {
        console.error('Erreur lors de la récupération du logo preset:', e);
      }
    }

    Object.entries(template.files).forEach(([filename, content]) => {
      zip.file(filename, filename.endsWith('.html') ? render(content) : content);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(
      content,
      `hotspot-${settings.template_id}-${settings.branding.ispName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.zip`,
    );
  } catch (error) {
    console.error('Erreur lors de la génération du ZIP:', error);
    alert('Erreur lors de la compression du fichier.');
  }
};
