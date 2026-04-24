import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Settings, Palette, Ticket, CreditCard, Download, Trash2, Plus, ChevronUp, ChevronDown, Sparkles, QrCode, FlaskConical, ShieldCheck, Signal, RefreshCw, CheckCircle2, ShoppingBag } from 'lucide-react';
import { exportTemplateZip } from '../../utils/exportZip';
import { deployToCloud } from '../../utils/api';
import { TEMPLATE_DEFINITIONS } from '../../core/templates';
import { parseProfileLabel, cleanProfileName, buildTiketMomoPaymentUrl } from '../../utils/mikhmoai';
import { fetchPortalBootstrap } from '../../utils/api';

export const Sidebar = () => {
  const { settings, mikrotikProfiles, setMikrotikProfiles, setTemplateId, updateBranding, updateFeatures, updateKyc, updatePayment, updateContact, setPlans, setDeploymentStatus, setPublicUrl } = useStore();
  const [activeTab, setActiveTab] = useState('branding');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleForceRefresh = async () => {
    setIsRefreshing(true);
    try {
      const data = await fetchPortalBootstrap(true);
      setMikrotikProfiles(data.profiles || []);
    } catch (err) {
      console.error('Erreur rafraîchissement:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const updatePlan = (index: number, updater: (plan: any) => any) => {
    const newPlans = [...settings.plans];
    newPlans[index] = updater(newPlans[index]);
    setPlans(newPlans.map((p, i) => ({ ...p, displayOrder: i + 1 })));
  };

  const movePlan = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= settings.plans.length) return;
    const newPlans = [...settings.plans];
    [newPlans[index], newPlans[targetIndex]] = [newPlans[targetIndex], newPlans[index]];
    setPlans(newPlans.map((p, i) => ({ ...p, displayOrder: i + 1 })));
  };

  const autoAssignBadges = () => {
    if (settings.plans.length === 0) return;
    const rankByPrice = [...settings.plans]
      .map((plan) => {
        const { numericPrice } = parseProfileLabel(plan.profileName);
        return { id: plan.id, amount: numericPrice || Number.parseInt(plan.priceLabel.replace(/\D/g, ''), 10) || 0 };
      })
      .sort((a, b) => a.amount - b.amount);
    
    const cheapestId = rankByPrice[0]?.id;
    const priciestId = rankByPrice[rankByPrice.length - 1]?.id;
    const middleId = rankByPrice[Math.floor(rankByPrice.length / 2)]?.id;
    
    setPlans(settings.plans.map((plan) => {
        let badge: any = 'none';
        if (plan.id === priciestId && settings.plans.length >= 2) badge = 'vip';
        else if (plan.id === cheapestId && settings.plans.length >= 2) badge = 'eco';
        else if (plan.id === middleId && settings.plans.length >= 3) badge = 'popular';
        return { ...plan, badge };
    }));
  };

  const handleSaveCloud = async () => {
    setDeploymentStatus('loading');
    try {
      const updatedPlans = settings.plans.map(plan => ({
        ...plan,
        paymentUrl: buildTiketMomoPaymentUrl(plan, settings.payment.apiKey)
      }));
      const result = await deployToCloud({ ...settings, plans: updatedPlans });
      if (result.success) { setPublicUrl(result.url); setDeploymentStatus('success'); } else { setDeploymentStatus('error'); }
    } catch (err) { setDeploymentStatus('error'); }
  };

  return (
    <div className="w-[480px] min-w-[480px] h-screen bg-white border-r flex flex-col shadow-lg z-10 overflow-hidden text-slate-900">
      <div className="bg-blue-600 text-white text-[9px] font-black py-1.5 px-4 text-center uppercase tracking-[0.3em] animate-pulse shrink-0">
        🛰️ MikhmoAI Engine Active v2.9.6 (Final Clean)
      </div>

      <div className="p-6 border-b shrink-0 flex items-center justify-between bg-slate-50/50">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Settings className="text-blue-600" /> Éditeur Portail
        </h1>
        <div className="flex gap-2">
            <button onClick={() => exportTemplateZip(settings)} className="p-2 text-slate-400 hover:text-blue-600"><Download size={18}/></button>
            <button onClick={handleSaveCloud} disabled={settings.deploymentStatus === 'loading'} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg disabled:opacity-50">
                {settings.deploymentStatus === 'loading' ? 'Envoi...' : 'Déployer'}
            </button>
        </div>
      </div>

      <div className="flex border-b shrink-0">
        {[
          { id: 'branding', icon: <Palette size={16} />, label: 'Design' },
          { id: 'plans', icon: <Ticket size={16} />, label: 'Forfaits' },
          { id: 'payment', icon: <CreditCard size={16} />, label: 'Paiement' },
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-4 flex flex-col items-center gap-1.5 transition-all border-b-2 ${activeTab === tab.id ? 'border-blue-600 text-blue-600 bg-blue-50/20' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
            {tab.icon}
            <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar pb-32 bg-slate-50/30">
        {activeTab === 'branding' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
             <section className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b pb-2">Identité Visuelle</h3>
                <div>
                   <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Template de Base</label>
                   <div className="grid grid-cols-2 gap-3">
                      {Object.values(TEMPLATE_DEFINITIONS).map((t) => (
                        <button key={t.id} onClick={() => setTemplateId(t.id)}
                          className={`rounded-2xl border p-3 text-left transition-all ${settings.template_id === t.id ? 'border-blue-600 bg-blue-50/50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                          <p className="text-sm font-bold">{t.label}</p>
                          <p className="mt-2 text-[10px] leading-relaxed text-slate-500">{t.description}</p>
                        </button>
                      ))}
                   </div>
                </div>

                <div className="space-y-4">
                   <input type="text" value={settings.branding.wifiName} onChange={(e) => updateBranding({ wifiName: e.target.value })}
                     className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold text-sm" placeholder="Nom du WiFi" />
                   <input type="text" value={settings.branding.ispName} onChange={(e) => updateBranding({ ispName: e.target.value })}
                     className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold text-sm" placeholder="Enseigne" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <input type="color" value={settings.branding.primaryColor} onChange={(e) => updateBranding({ primaryColor: e.target.value })} className="h-10 w-full p-1 bg-white border border-slate-200 rounded-xl cursor-pointer" />
                   <input type="color" value={settings.branding.secondaryColor} onChange={(e) => updateBranding({ secondaryColor: e.target.value })} className="h-10 w-full p-1 bg-white border border-slate-200 rounded-xl cursor-pointer" />
                </div>
                
                <div className="flex gap-2">
                  {[{v:'fr', f:'🇫🇷'}, {v:'en', f:'🇬🇧'}].map(l => (
                    <button key={l.v} onClick={() => updateBranding({ language: l.v as any })} className={`px-4 py-2 border rounded-xl text-xl ${settings.branding.language === l.v ? 'border-blue-600 bg-blue-50' : 'border-slate-100'}`}>{l.f}</button>
                  ))}
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Réglages avancés</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <FeatureToggle checked={settings.features.enableQrScanner} icon={<QrCode size={16} />} label="Scanner QR Code" onChange={(v) => updateFeatures({ enableQrScanner: v })} />
                    <FeatureToggle checked={settings.features.enableTrial} icon={<FlaskConical size={16} />} label="Bouton Essai Gratuit" onChange={(v) => updateFeatures({ enableTrial: v })} />
                  </div>

                  <div className="pt-2 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black uppercase text-slate-800 flex items-center gap-2">
                        <ShieldCheck size={18} className="text-blue-600" /> ARCEP KYC
                      </h3>
                      <input type="checkbox" checked={settings.features.kyc.enabled} onChange={(e) => updateKyc({ enabled: e.target.checked })} />
                    </div>
                    {settings.features.kyc.enabled && (
                      <div className="space-y-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 animate-in zoom-in-95">
                        <input type="text" value={settings.features.kyc.countryCode} onChange={(e) => updateKyc({ countryCode: e.target.value })} className="w-full p-2 border border-slate-100 rounded-lg text-xs" placeholder="Code pays (+229)" />
                        <input type="number" value={settings.features.kyc.phoneLength} onChange={(e) => updateKyc({ phoneLength: parseInt(e.target.value) || 0 })} className="w-full p-2 border border-slate-100 rounded-lg text-xs" placeholder="Longueur tel" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Contact Support</h3>
                  <div className="space-y-4">
                    <input type="text" value={settings.contact.whatsapp} onChange={(e) => updateContact({ whatsapp: e.target.value })} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm" placeholder="WhatsApp" />
                    <textarea value={settings.contact.address} onChange={(e) => updateContact({ address: e.target.value })} className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm min-h-[100px] resize-none" placeholder="Adresse" />
                  </div>
                </div>
             </section>
          </div>
        )}

        {activeTab === 'plans' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-2 duration-300">
             <div className="flex items-center justify-between border-b pb-2">
               <h2 className="font-semibold text-lg uppercase tracking-tight">Gestion des Tarifs</h2>
               <button onClick={autoAssignBadges} className="px-3 py-1.5 bg-amber-500/10 text-amber-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-amber-500/10 hover:bg-amber-500 hover:text-white transition-all">
                  <Sparkles size={12} className="inline mr-1" /> Auto-Badges
               </button>
             </div>

             {mikrotikProfiles.length > 0 && (
                <div className="mb-6 -mx-6 px-6">
                   <div className="flex items-center justify-between mb-4 px-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 flex items-center gap-2">
                        <Signal size={14} strokeWidth={3} /> Vente Directe MikroTik
                      </p>
                      <button onClick={handleForceRefresh} disabled={isRefreshing} className="text-slate-400 hover:text-blue-600 transition-all">
                        <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
                      </button>
                   </div>
                   
                   <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x">
                     {mikrotikProfiles
                      .map(p => ({ ...p, meta: parseProfileLabel(p.name) }))
                      .filter(p => p.meta.isSaleable)
                      .map((p) => {
                       const isSelected = settings.plans.some(plan => plan.profileName === p.name);
                       return (
                        <button key={p.name} onClick={() => {
                             if (isSelected) { setPlans(settings.plans.filter(plan => plan.profileName !== p.name)); return; }
                             const meta = p.meta;
                             setPlans([...settings.plans, { id: Math.random().toString(36).slice(2, 11), profileName: p.name, displayName: `${meta.price} / ${meta.duration}`, priceLabel: meta.price, durationLabel: meta.duration, speedLabel: p['rate-limit'] || '2M/2M', badge: 'none', displayOrder: settings.plans.length + 1 }]);
                          }}
                          className={`flex-shrink-0 w-32 snap-start p-4 rounded-[1.8rem] border-2 transition-all relative overflow-hidden flex flex-col items-center text-center ${isSelected ? 'bg-blue-600 border-blue-600 text-white shadow-xl' : 'bg-white border-slate-100 hover:border-blue-500/50'}`}>
                          <div className={`w-8 h-8 rounded-xl mb-3 flex items-center justify-center ${isSelected ? 'bg-white/20' : 'bg-blue-50 text-blue-600'}`}>
                             {isSelected ? <CheckCircle2 size={16} /> : <ShoppingBag size={14} />}
                          </div>
                          <p className={`text-[10px] font-black leading-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>{p.meta.price}</p>
                          <p className={`text-[8px] font-bold mt-1 uppercase tracking-widest ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>{p.meta.duration}</p>
                        </button>
                       );
                     })}
                   </div>
                </div>
             )}

             <div className="space-y-4">
                {settings.plans.map((p, idx) => (
                  <div key={p.id} className="p-5 bg-white border border-slate-100 rounded-2xl relative group transition-all hover:shadow-md">
                     <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1">
                           <h4 className="text-sm font-black uppercase text-slate-800">{p.displayName}</h4>
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                              Profil: {cleanProfileName(p.profileName)}
                           </p>
                        </div>
                        <div className="flex items-center gap-1">
                            <button onClick={() => movePlan(idx, 'up')} disabled={idx === 0} className="p-1.5 text-slate-300 hover:text-blue-600 disabled:opacity-20"><ChevronUp size={14}/></button>
                            <button onClick={() => movePlan(idx, 'down')} disabled={idx === settings.plans.length - 1} className="p-1.5 text-slate-300 hover:text-blue-600 disabled:opacity-20"><ChevronDown size={14}/></button>
                            <button onClick={() => setPlans(settings.plans.filter(pl => pl.id !== p.id))} className="p-1.5 text-slate-300 hover:text-rose-600 ml-1"><Trash2 size={16}/></button>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-3">
                        <input type="text" value={p.displayName} onChange={(e) => updatePlan(idx, pl => ({ ...pl, displayName: e.target.value }))} className="p-2 bg-slate-50 rounded-lg text-xs font-bold border-none outline-none" placeholder="Nom" />
                        <select value={p.badge} onChange={(e) => updatePlan(idx, pl => ({ ...pl, badge: e.target.value as any }))} className="p-2 bg-slate-50 rounded-lg text-xs font-bold outline-none border-none">
                            <option value="none">Standard</option>
                            <option value="eco">Économique</option>
                            <option value="popular">Populaire</option>
                            <option value="vip">V.I.P</option>
                        </select>
                     </div>
                  </div>
                ))}
                <button onClick={() => setPlans([...settings.plans, { id: Math.random().toString(36).slice(2, 11), profileName: '1H', displayName: 'Nouveau', priceLabel: '100 FCFA', durationLabel: '1H', speedLabel: '2M/2M', badge: 'none', displayOrder: settings.plans.length + 1 }])} 
                  className="w-full border-2 border-dashed border-slate-200 py-4 rounded-2xl text-slate-400 font-black text-[10px] uppercase tracking-widest hover:border-blue-500 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
                    <Plus size={14} /> Ajouter manuellement
                </button>
             </div>
          </div>
        )}

        {activeTab === 'payment' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
             <section className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b pb-2">Passerelle de Paiement</h3>
                <div className="space-y-4">
                   <select value={settings.payment.aggregator} onChange={(e) => updatePayment({ aggregator: e.target.value as any })}
                     className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold text-sm outline-none">
                     <option value="none">Désactivé</option>
                     <option value="FedaPay">FedaPay</option>
                     <option value="KKiaPay">KKiaPay</option>
                     <option value="Cinpay">Cinpay</option>
                   </select>
                   <input type="text" value={settings.payment.apiKey} onChange={(e) => updatePayment({ apiKey: e.target.value })}
                     className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold text-xs outline-none" placeholder="Clé API Publique" />
                </div>
             </section>
          </div>
        )}
      </div>
    </div>
  );
};

const FeatureToggle = ({ checked, icon, label, onChange }: { checked: boolean; icon: JSX.Element; label: string; onChange: (v: boolean) => void }) => (
  <label className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl cursor-pointer hover:bg-slate-50 transition-all">
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
    <div className="w-10 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all shadow-inner relative"></div>
    <span className="text-slate-500">{icon}</span>
    <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">{label}</span>
  </label>
);
