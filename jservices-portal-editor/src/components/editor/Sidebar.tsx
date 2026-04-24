import { useState } from 'react';
import { useStore, type PlanConf } from '../../store/useStore';
import { Palette, Ticket, CreditCard, Phone, Trash2, Sparkles, Signal, RefreshCw, CheckCircle2, ShoppingBag } from 'lucide-react';
import { deployToCloud } from '../../utils/api';
import { parseProfileLabel, cleanProfileName, buildTiketMomoPaymentUrl } from '../../utils/mikhmoai';
import { fetchPortalBootstrap } from '../../utils/api';

export const Sidebar = () => {
  const { settings, mikrotikProfiles, setMikrotikProfiles, updateBranding, updatePayment, setPlans, setDeploymentStatus, setPublicUrl } = useStore();
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

  const handleSaveCloud = async () => {
    setDeploymentStatus('loading');
    try {
      const result = await deployToCloud(settings);
      if (result.success) {
        setPublicUrl(result.url);
        setDeploymentStatus('success');
      } else {
        setDeploymentStatus('error');
      }
    } catch (err) {
      setDeploymentStatus('error');
    }
  };

  const buildPlanPaymentUrl = (plan: PlanConf, payment = settings.payment) => buildTiketMomoPaymentUrl({
    gatewayUrl: payment.gatewayUrl,
    apiKey: payment.apiKey,
    profileName: plan.profileName,
    priceLabel: plan.priceLabel,
    durationLabel: plan.durationLabel,
    nasid: '$(server-name)',
    mac: '$(mac)',
    ip: '$(ip)',
    linkStatus: '$(link-status-esc)'
  });

  const syncPaymentLinks = (plans: PlanConf[]) => plans.map((plan) => ({
    ...plan,
    paymentUrl: buildPlanPaymentUrl(plan)
  })) as PlanConf[];

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
    
    setPlans(syncPaymentLinks(settings.plans.map((plan) => {
        let badge: PlanConf['badge'] = 'none';
        if (plan.id === priciestId && settings.plans.length >= 2) badge = 'vip';
        else if (plan.id === cheapestId && settings.plans.length >= 2) badge = 'eco';
        else if (plan.id === middleId && settings.plans.length >= 3) badge = 'popular';
        return { ...plan, badge };
    })));
  };

  return (
    <div className="w-[480px] min-w-[480px] h-screen bg-white border-r flex flex-col shadow-lg z-10 overflow-hidden">
      {/* Témoin Visuel */}
      <div className="bg-blue-600 text-white text-[9px] font-black py-1.5 px-4 text-center uppercase tracking-[0.3em] animate-pulse shrink-0">
        🛰️ MikhmoAI Engine Active v2.6
      </div>

      <div className="p-6 border-b shrink-0 flex items-center justify-between bg-slate-50/50">
        <h1 className="text-xl font-black flex items-center gap-2 uppercase tracking-tighter text-slate-900">
          Studio <span className="text-blue-600">Design</span>
        </h1>
        <button onClick={handleSaveCloud} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg">
          Déployer
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b shrink-0 bg-white">
        {[
          { id: 'branding', icon: <Palette size={16} />, label: 'Design' },
          { id: 'plans', icon: <Ticket size={16} />, label: 'Forfaits' },
          { id: 'payment', icon: <CreditCard size={16} />, label: 'Paiement' },
          { id: 'contact', icon: <Phone size={16} />, label: 'Contact' },
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-4 flex flex-col items-center gap-1.5 transition-all border-b-2 ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
            {tab.icon}
            <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
        {activeTab === 'branding' && (
          <div className="space-y-6">
             <section className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Identité Visuelle</h3>
                <div className="space-y-4">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Nom du WiFi</label>
                      <input type="text" value={settings.branding.wifiName} onChange={(e) => updateBranding({ wifiName: e.target.value })}
                        className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Enseigne (ISP)</label>
                      <input type="text" value={settings.branding.ispName} onChange={(e) => updateBranding({ ispName: e.target.value })}
                        className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" />
                   </div>
                </div>
             </section>
          </div>
        )}

        {activeTab === 'plans' && (
          <div className="space-y-8">
             {/* 🛰️ Carousel des Profils MikroTik */}
             {mikrotikProfiles.length > 0 && (
                <div className="mb-10 -mx-6 px-6">
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
                             const newPlan: PlanConf = { id: Math.random().toString(36).slice(2, 11), profileName: p.name, displayName: `${meta.price} / ${meta.duration}`, priceLabel: meta.price, durationLabel: meta.duration, speedLabel: p['rate-limit'] || '2M/2M', badge: 'none', displayOrder: settings.plans.length + 1 };
                             setPlans(syncPaymentLinks([...settings.plans, { ...newPlan, paymentUrl: buildPlanPaymentUrl(newPlan) }]));
                          }}
                          className={`flex-shrink-0 w-36 snap-start p-5 rounded-[2rem] border-2 transition-all relative overflow-hidden flex flex-col items-center text-center ${isSelected ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-600/30 scale-[1.02]' : 'bg-white border-slate-100 hover:border-blue-500/50'}`}>
                          <div className={`w-10 h-10 rounded-2xl mb-3 flex items-center justify-center ${isSelected ? 'bg-white/20' : 'bg-blue-50/50 text-blue-600'}`}>
                             {isSelected ? <CheckCircle2 size={20} /> : <ShoppingBag size={18} />}
                          </div>
                          <p className={`text-[12px] font-black leading-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>{p.meta.price}</p>
                          <p className={`text-[9px] font-bold mt-1 uppercase tracking-widest ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>{p.meta.duration}</p>
                          {isSelected && <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
                        </button>
                       );
                     })}
                   </div>
                </div>
             )}

             <div className="flex items-center justify-between border-t border-slate-100 pt-8 mb-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Configuration des Offres</h3>
                <button onClick={autoAssignBadges} className="px-3 py-1.5 bg-amber-500/10 text-amber-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-amber-500/10 hover:bg-amber-500 hover:text-white transition-all">
                   <Sparkles size={12} className="inline mr-1" /> Auto-Badges
                </button>
             </div>

             <div className="space-y-4">
                {settings.plans.map((p, idx) => (
                  <div key={p.id} className="p-6 bg-slate-50/50 border border-slate-100 rounded-[2rem] relative group transition-all hover:border-blue-500/20">
                     <div className="flex justify-between items-start mb-6">
                        <div className="space-y-1">
                           <h4 className="text-sm font-black uppercase text-slate-900">{p.displayName}</h4>
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                              <Signal size={10} /> Profil: {cleanProfileName(p.profileName)}
                           </p>
                        </div>
                        <button onClick={() => setPlans(settings.plans.filter(pl => pl.id !== p.id))} className="p-2 text-slate-300 hover:text-rose-600 transition-all"><Trash2 size={16} /></button>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <label className="text-[8px] font-black uppercase text-slate-400 ml-1">Prix</label>
                           <input type="text" value={p.priceLabel} onChange={(e) => { const np = [...settings.plans]; np[idx].priceLabel = e.target.value; setPlans(syncPaymentLinks(np)); }} className="w-full p-2.5 bg-white border-none rounded-xl font-bold text-xs" />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[8px] font-black uppercase text-slate-400 ml-1">Vitesse</label>
                           <input type="text" value={p.speedLabel} onChange={(e) => { const np = [...settings.plans]; np[idx].speedLabel = e.target.value; setPlans(syncPaymentLinks(np)); }} className="w-full p-2.5 bg-white border-none rounded-xl font-bold text-xs" />
                        </div>
                     </div>
                     <div className="mt-4 space-y-1.5">
                        <label className="text-[8px] font-black uppercase text-slate-400 ml-1">Lien de paiement</label>
                        <div className="flex gap-2">
                           <input readOnly value={p.paymentUrl || buildPlanPaymentUrl(p)} className="w-full p-2.5 bg-white border-none rounded-xl font-mono text-[10px] text-slate-600" />
                           <button
                             onClick={() => navigator.clipboard.writeText(p.paymentUrl || buildPlanPaymentUrl(p))}
                             className="shrink-0 px-3 rounded-xl bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest"
                           >
                             Copier
                           </button>
                        </div>
                     </div>
                  </div>
                ))}
                {settings.plans.length === 0 && (
                   <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-[2rem]">
                      <ShoppingBag className="mx-auto text-slate-200 mb-2" size={32} />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aucun forfait sélectionné</p>
                   </div>
                )}
             </div>
          </div>
        )}

        {activeTab === 'payment' && (
          <div className="space-y-6">
             <div className="space-y-4">
                <div>
                   <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Base du paiement</label>
                   <input
                     type="text"
                     value={settings.payment.gatewayUrl || ''}
                     onChange={(e) => updatePayment({ gatewayUrl: e.target.value })}
                     className="w-full p-4 bg-slate-50 border-none rounded-2xl font-mono text-xs"
                     placeholder="https://tpay.mikhmoai.com/buy-ticketmomo"
                   />
                </div>
                <div>
                   <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Webhook callback</label>
                   <input
                     type="text"
                     value={settings.payment.callbackUrl || ''}
                     onChange={(e) => updatePayment({ callbackUrl: e.target.value })}
                     className="w-full p-4 bg-slate-50 border-none rounded-2xl font-mono text-xs"
                     placeholder="https://hook.mikhmoai.com/pay_callback/fedapay/MoailtePro"
                   />
                </div>
                <div>
                   <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Clé publique</label>
                   <input
                     type="text"
                     value={settings.payment.apiKey}
                     onChange={(e) => updatePayment({ apiKey: e.target.value })}
                     className="w-full p-4 bg-slate-50 border-none rounded-2xl font-mono text-xs"
                     placeholder="pk_live_..."
                   />
                </div>
             </div>

             <div className="space-y-3">
                <div className="flex items-center justify-between">
                   <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Aperçu des liens</h3>
                   <button onClick={() => setPlans(syncPaymentLinks(settings.plans))} className="text-[9px] font-black uppercase tracking-widest text-blue-600">
                     Recalculer
                   </button>
                </div>
                {settings.plans.length > 0 ? settings.plans.map((plan) => (
                  <div key={plan.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-slate-500">{plan.displayName}</span>
                        <button onClick={() => navigator.clipboard.writeText(plan.paymentUrl || buildPlanPaymentUrl(plan))} className="text-[9px] font-black uppercase text-blue-600">Copier</button>
                     </div>
                     <div className="break-all font-mono text-[10px] text-slate-600">{plan.paymentUrl || buildPlanPaymentUrl(plan)}</div>
                  </div>
                )) : (
                  <p className="text-xs text-slate-400">Ajoute un forfait pour générer le lien de paiement.</p>
                )}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
