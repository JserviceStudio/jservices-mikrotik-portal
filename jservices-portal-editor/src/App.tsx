import { useEffect, useRef, useState } from 'react';
import { Sidebar } from './components/editor/Sidebar';
import { LivePreview } from './components/preview/LivePreview';
import { useStore, type PlanConf, type SettingsSchema } from './store/useStore';
import { fetchPortalBootstrap, readPortalEditorToken } from './utils/api';

const safeText = (value: any, fallback = ''): string => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return value.map((entry) => safeText(entry)).filter(Boolean).join(', ');
  if (typeof value === 'object') {
    return safeText(
      value.label ?? value.value ?? value.name ?? value.title ?? value.text ?? value.id ?? value.slug,
      fallback
    );
  }
  return fallback;
};

const normalizeProfile = (profile: any) => ({
  ...profile,
  name: safeText(profile?.name || profile?.['.id'] || 'Sans nom', 'Sans nom'),
});

const normalizePlan = (offer: any, index: number): PlanConf => ({
  id: safeText(offer?.id || offer?.profileName || `offer-${index}`),
  profileName: safeText(offer?.profileName),
  displayName: safeText(offer?.displayName || offer?.profileName),
  priceLabel: safeText(offer?.priceLabel || ''),
  durationLabel: safeText(offer?.durationLabel || ''),
  speedLabel: safeText(offer?.speedLabel || ''),
  badge: 'none',
  paymentUrl: safeText(offer?.paymentUrl || ''),
  displayOrder: Number.isFinite(Number(offer?.displayOrder)) ? Number(offer.displayOrder) : index + 1,
});

const normalizePortalUrl = (value: any, fallback: string, disallowedHosts: string[] = []) => {
  const raw = safeText(value, '').trim();
  if (!raw) return fallback;
  try {
    const parsed = new URL(raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`);
    const hostname = parsed.hostname.toLowerCase();
    if (disallowedHosts.some((host) => hostname.includes(host))) return fallback;
    return parsed.toString();
  } catch {
    return fallback;
  }
};

const normalizeEditorConfig = (input: any): SettingsSchema | null => {
  if (!input || typeof input !== 'object') return null;

  const branding = input.branding && typeof input.branding === 'object' ? input.branding : {};
  const payment = input.payment && typeof input.payment === 'object' ? input.payment : {};
  const contact = input.contact && typeof input.contact === 'object' ? input.contact : {};
  const features = input.features && typeof input.features === 'object' ? input.features : {};
  const kyc = features.kyc && typeof features.kyc === 'object' ? features.kyc : {};

  const aggregator = String(payment.aggregator || '').trim().toLowerCase();

  return {
    template_id: safeText(input.template_id || 'base-2') as SettingsSchema['template_id'],
    branding: {
      ispName: safeText(branding.ispName, 'WiFi Zone'),
      wifiName: safeText(branding.wifiName, 'Mon Réseau Rapide'),
      primaryColor: safeText(branding.primaryColor, '#673AB7'),
      secondaryColor: safeText(branding.secondaryColor, '#512DA8'),
      logoPreset: ['none', 'jservices', 'jconnect'].includes(String(branding.logoPreset || '').toLowerCase())
        ? String(branding.logoPreset).toLowerCase() as SettingsSchema['branding']['logoPreset']
        : 'jservices',
      cardStyle: ['glass', 'ticket'].includes(String(branding.cardStyle || '').toLowerCase())
        ? String(branding.cardStyle).toLowerCase() as SettingsSchema['branding']['cardStyle']
        : 'glass',
      bgOverlayOpacity: Number.isFinite(Number(branding.bgOverlayOpacity)) ? Number(branding.bgOverlayOpacity) : 80,
      fontFamily: safeText(branding.fontFamily, 'Inter, sans-serif'),
      language: ['fr', 'en'].includes(String(branding.language || '').toLowerCase())
        ? String(branding.language).toLowerCase() as SettingsSchema['branding']['language']
        : 'fr',
    },
    plans: Array.isArray(input.plans) ? input.plans.map((offer: any, index: number) => normalizePlan(offer, index)).filter((plan: PlanConf) => plan.profileName) : [],
    payment: {
      aggregator:
        aggregator === 'fedapay' ? 'FedaPay' :
        aggregator === 'kkiapay' ? 'KKiaPay' :
        aggregator === 'moailtestore' ? 'MoailteStore' :
        aggregator === 'cinay' ? 'Cinay' :
        aggregator === 'custom' ? 'Custom' : 'none',
      apiKey: safeText(payment.apiKey, ''),
      clientId: safeText(payment.clientId, ''),
      gatewayUrl: normalizePortalUrl(payment.gatewayUrl, 'https://tpay.mikhmoai.com/buy-ticketmomo', ['maxdospot.com', 'loginm.']),
      callbackUrl: normalizePortalUrl(payment.callbackUrl, 'https://hook.mikhmoai.com/pay_callback/fedapay/MoailtePro', ['maxdospot.com']),
    },
    features: {
      themeMode: ['auto', 'light', 'dark'].includes(String(features.themeMode || '').toLowerCase())
        ? String(features.themeMode).toLowerCase() as SettingsSchema['features']['themeMode']
        : 'auto',
      enableQrScanner: Boolean(features.enableQrScanner ?? features.qrScanner ?? true),
      enableTrial: Boolean(features.enableTrial ?? features.trial ?? false),
      enablePaymentLinks: Boolean(features.enablePaymentLinks ?? features.paymentLinks ?? false),
      kyc: {
        enabled: Boolean(kyc.enabled),
        countryCode: safeText(kyc.countryCode, '+229'),
        authorizedPrefixes: Array.isArray(kyc.authorizedPrefixes) ? kyc.authorizedPrefixes.map((entry: any) => safeText(entry)).filter(Boolean) : [],
        phoneLength: Number.isFinite(Number(kyc.phoneLength)) ? Number(kyc.phoneLength) : 10,
        loggingUrl: safeText(kyc.loggingUrl, ''),
      },
    },
    contact: {
      phone: safeText(contact.phone, '+229 01 00 00 00 00'),
      whatsapp: safeText(contact.whatsapp, '22996937864'),
      address: safeText(contact.address, 'Whatsapp Uniquement'),
      designerName: safeText(contact.designerName, 'J+services'),
      designerPhone: safeText(contact.designerPhone, '+2290196937864'),
      designerYear: safeText(contact.designerYear, '2026'),
    },
    deploymentStatus: ['idle', 'loading', 'success', 'error'].includes(String(input.deploymentStatus || '').toLowerCase())
      ? String(input.deploymentStatus).toLowerCase() as SettingsSchema['deploymentStatus']
      : 'idle',
    publicUrl: safeText(input.publicUrl, '') || null,
  };
};

function App() {
  const setPlans = useStore((state) => state.setPlans);
  const setSettings = useStore((state) => state.setSettings);
  const setMikrotikProfiles = useStore((state) => state.setMikrotikProfiles);

  const [bootstrapStatus, setBootstrapStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [bootstrapMessage, setBootstrapMessage] = useState('');
  const [sessionToken, setSessionToken] = useState<string | null>(readPortalEditorToken());
  const lastBootstrapTokenRef = useRef<string | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== 'object') return;

      if ((event.data?.type === 'init_session' || event.data?.type === 'sync_session') && event.data?.token) {
        const token = String(event.data.token);
        window.sessionStorage.setItem('jservices.externalAuthToken', token);
        setSessionToken(token);
        return;
      }

      if (event.data?.type === 'clear_session' || event.data?.type === 'logout') {
        window.sessionStorage.removeItem('jservices.externalAuthToken');
        lastBootstrapTokenRef.current = null;
        setSessionToken(null);
      }
    };

    window.addEventListener('message', handleMessage);
    window.parent.postMessage({ type: 'editor_ready' }, '*');

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const loadBootstrap = async (token: string) => {
    setBootstrapStatus('loading');
    setBootstrapMessage('Connexion au MikroTik...');

    try {
      const data = await fetchPortalBootstrap(true, token);
      const profiles = Array.isArray(data?.profiles) ? data.profiles.filter((p: any) => p && (p.name || p['.id'])).map(normalizeProfile) : [];
      setMikrotikProfiles(profiles);

      const normalizedSettings = normalizeEditorConfig(data?.editorConfig);
      const offers = Array.isArray(data?.offers) ? data.offers : [];

      if (normalizedSettings) {
        setSettings(normalizedSettings);
        if ((!normalizedSettings.plans || normalizedSettings.plans.length === 0) && offers.length > 0) {
          setPlans(offers.map((offer: any, index: number) => normalizePlan(offer, index)));
        }
        setBootstrapMessage(offers.length > 0
          ? `Configuration et ${offers.length} profils synchronisés.`
          : 'Configuration chargée.');
      } else if (offers.length > 0) {
        setPlans(offers.map((offer: any, index: number) => normalizePlan(offer, index)));
        setBootstrapMessage(`${offers.length} profils MikroTik importés.`);
      } else {
        setBootstrapMessage(profiles.length > 0 ? `${profiles.length} profils MikroTik détectés.` : 'Aucun profil trouvé.');
      }

      setBootstrapStatus('success');
    } catch (error: any) {
      setBootstrapStatus('error');
      setBootstrapMessage(error?.message || 'Erreur de session');
    }
  };

  useEffect(() => {
    const token = sessionToken || readPortalEditorToken();
    if (!token || lastBootstrapTokenRef.current === token) return;
    lastBootstrapTokenRef.current = token;
    void loadBootstrap(token);
  }, [sessionToken]);

  const storedToken = typeof window !== 'undefined' ? readPortalEditorToken() : null;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-slate-900">
      {bootstrapStatus !== 'idle' && (
        <div className={`absolute right-4 top-4 z-20 max-w-md rounded-2xl border px-4 py-3 text-sm shadow-lg animate-in fade-in slide-in-from-top-2 ${
          bootstrapStatus === 'error'
            ? 'border-red-200 bg-red-50 text-red-700'
            : bootstrapStatus === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-blue-200 bg-blue-50 text-blue-700'
        }`}>
          <div className="flex items-center gap-2 font-bold text-[10px] uppercase tracking-wider">
            {bootstrapMessage}
          </div>
        </div>
      )}

      <div className="absolute bottom-2 left-2 z-50 text-[8px] text-slate-300 font-mono">
        API: live.jmoai.net | Session: {sessionToken || storedToken ? 'Active ✅' : 'Manquante ❌'}
      </div>

      <Sidebar />
      <LivePreview />
    </div>
  );
}

export default App;
