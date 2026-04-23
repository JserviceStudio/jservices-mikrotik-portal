import { useEffect, useState } from 'react';
import { Sidebar } from './components/editor/Sidebar';
import { LivePreview } from './components/preview/LivePreview';
import { useStore } from './store/useStore';
import { fetchPortalBootstrap } from './utils/api';

function App() {
  const setPlans = useStore((state) => state.setPlans);
  const setSettings = useStore((state) => state.setSettings);
  const setMikrotikProfiles = useStore((state) => state.setMikrotikProfiles);
  const settings = useStore((state) => state.settings);
  
  const [bootstrapStatus, setBootstrapStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [bootstrapMessage, setBootstrapMessage] = useState('');
  
  const shouldBootstrapFromRouter =
    settings.plans.length === 1 &&
    settings.plans[0]?.profileName === '1H' &&
    settings.plans[0]?.priceLabel === '100 FCFA';

  useEffect(() => {
    let isActive = true;

    const loadBootstrap = async () => {
      setBootstrapStatus('loading');
      setBootstrapMessage('Connexion au MikroTik...');

      try {
        const data = await fetchPortalBootstrap();
        if (!isActive) return;

        // 🛰️ Synchronisation de la liste globale (uniquement les strings)
        if (data.profiles && Array.isArray(data.profiles)) {
          const validProfiles = data.profiles
            .filter(p => p && (p.name || p['.id']))
            .map(p => ({ ...p, name: String(p.name || p['.id'] || 'Sans nom') }));
          setMikrotikProfiles(validProfiles);
        }

        if (data.editorConfig) {
          setSettings(data.editorConfig);
          setBootstrapMessage('Configuration chargée.');
        } else if (data.offers && data.offers.length > 0) {
          setPlans(data.offers.map((offer, index) => ({
            id: String(offer.id || index),
            profileName: String(offer.profileName),
            displayName: String(offer.displayName || offer.profileName),
            priceLabel: String(offer.priceLabel || ''),
            durationLabel: String(offer.durationLabel || ''),
            speedLabel: String(offer.speedLabel || ''),
            badge: 'none',
            paymentUrl: '',
            displayOrder: index + 1,
          })));
          setBootstrapMessage(`${data.offers.length} profils MikroTik importés.`);
        } else {
          setBootstrapMessage('Aucun profil exploitable trouvé.');
        }

        setBootstrapStatus('success');
      } catch (error: any) {
        if (!isActive) return;
        setBootstrapStatus('error');
        // On évite d'afficher [object Object]
        const errMsg = typeof error === 'string' ? error : (error.message || 'Erreur de connexion MikroTik');
        setBootstrapMessage(errMsg);
      }
    };

    if (shouldBootstrapFromRouter || settings.plans.length === 0) {
      loadBootstrap();
    } else {
        fetchPortalBootstrap().then(data => {
            if (data.profiles) setMikrotikProfiles(data.profiles);
        }).catch(() => {});
    }

    return () => {
      isActive = false;
    };
  }, [setPlans, setSettings, setMikrotikProfiles, shouldBootstrapFromRouter, settings.plans.length]);

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
          <div className="flex items-center gap-2 font-bold">
            {bootstrapMessage}
          </div>
        </div>
      )}
      <Sidebar />
      <LivePreview />
    </div>
  );
}

export default App;
