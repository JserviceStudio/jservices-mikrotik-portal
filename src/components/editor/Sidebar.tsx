import { useState, type ReactNode } from 'react';
import { useStore } from '../../store/useStore';
import { Settings, Palette, Ticket, CreditCard, Download, Trash2, Plus, Layers, ChevronUp, ChevronDown, Sparkles, QrCode, FlaskConical, Sun, Moon, Monitor, ShieldCheck, X, Signal, RefreshCw, CheckCircle2, ShoppingBag, Lock as LockIcon, Copy, EyeOff } from 'lucide-react';
import { exportTemplateZip } from '../../utils/exportZip';
import { deployToCloud } from '../../utils/api';
import { TEMPLATE_DEFINITIONS } from '../../core/templates';
import { ImageCropper } from './ImageCropper';
import { parseProfileLabel, cleanProfileName, buildPaymentUrl } from '../../utils/mikhmoai';
import { fetchPortalBootstrap } from '../../utils/api';

export const Sidebar = () => {
  const { settings, mikrotikProfiles, setMikrotikProfiles, setTemplateId, updateBranding, updateFeatures, updateKyc, updatePayment, updateContact, setPlans, setDeploymentStatus, setPublicUrl } = useStore();
  const [activeTab, setActiveTab] = useState('branding');
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const paymentEnabled = settings.features.enablePaymentLinks;
  const selectedProfilesCount = settings.plans.length;
  const paymentLabel = paymentEnabled ? settings.payment.aggregator || 'Actif' : 'Désactivé';

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
      const updatedPlans = settings.plans.map(plan => ({
        ...plan,
        paymentUrl: settings.features.enablePaymentLinks ? buildPaymentUrl({
          aggregator: settings.payment.aggregator,
          gatewayUrl: settings.payment.gatewayUrl,
          apiKey: settings.payment.apiKey,
          profileName: plan.profileName,
          priceLabel: plan.priceLabel,
          durationLabel: plan.durationLabel,
          nasid: '$(server-name)',
          mac: '$(mac)',
          ip: '$(ip)',
          linkStatus: '$(link-status-esc)',
        }) : ''
      }));
      const result = await deployToCloud({ ...settings, plans: updatedPlans });
      if (result.success) { setPublicUrl(result.url); setDeploymentStatus('success'); } else { setDeploymentStatus('error'); }
    } catch (err) { setDeploymentStatus('error'); }
  };

  const paymentPreviews = settings.plans.map((plan) => ({
    ...plan,
    paymentUrl: settings.features.enablePaymentLinks ? buildPaymentUrl({
      aggregator: settings.payment.aggregator,
      gatewayUrl: settings.payment.gatewayUrl,
      apiKey: settings.payment.apiKey,
      profileName: plan.profileName,
      priceLabel: plan.priceLabel,
      durationLabel: plan.durationLabel,
      nasid: '$(server-name)',
      mac: '$(mac)',
      ip: '$(ip)',
      linkStatus: '$(link-status-esc)',
    }) : ''
  }));

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

  return (
    <div className="flex h-[46vh] w-full flex-col overflow-hidden bg-white shadow-lg z-10 sm:h-[48vh] xl:h-full">
      <div className="bg-blue-600 text-white text-[9px] font-black py-1.5 px-4 text-center uppercase tracking-[0.3em] animate-pulse shrink-0">
        MikhmoAI Portal Editor Active
      </div>

      <div className="p-5 border-b shrink-0 bg-slate-50/80 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-lg font-black uppercase tracking-tighter text-slate-900 leading-none">
              Portal <span className="text-blue-600">Editor</span>
            </h1>
            <p className="mt-1 text-[11px] font-semibold text-slate-500 truncate">
              {settings.branding.ispName} • {settings.branding.wifiName}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
              <button onClick={() => exportTemplateZip(settings)} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:border-blue-200 hover:text-blue-600">
                <Download size={18}/>
              </button>
              <button onClick={handleSaveCloud} className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-900 px-4 text-[10px] font-black uppercase tracking-widest text-white hover:bg-blue-600 transition-all shadow-lg">
                  Déployer
              </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2">
            <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Template</div>
            <div className="mt-1 truncate text-[11px] font-bold text-slate-900">{settings.template_id}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2">
            <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Profils</div>
            <div className="mt-1 truncate text-[11px] font-bold text-slate-900">{selectedProfilesCount}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2">
            <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Paiement</div>
            <div className="mt-1 truncate text-[11px] font-bold text-slate-900">{paymentLabel}</div>
          </div>
        </div>
      </div>

      <div className="flex border-b shrink-0 bg-white overflow-x-auto no-scrollbar">
        {[
          { id: 'branding', icon: <Palette size={16} />, label: 'Design' },
          { id: 'plans', icon: <Ticket size={16} />, label: 'Forfaits' },
          { id: 'payment', icon: <CreditCard size={16} />, label: 'Paiement' },
          { id: 'features', icon: <Settings size={16} />, label: 'Réglages' },
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`min-w-[120px] flex-1 py-4 flex flex-col items-center gap-1.5 transition-all border-b-2 ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
            {tab.icon}
            <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 no-scrollbar pb-32">
        {activeTab === 'branding' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
             <section className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Template de Base</h3>
                <div className="grid grid-cols-2 gap-3">
                    {Object.values(TEMPLATE_DEFINITIONS).map((t) => (
                      <button key={t.id} onClick={() => setTemplateId(t.id)}
                        className={`rounded-2xl border p-3 text-left transition-all ${settings.template_id === t.id ? 'border-blue-600 bg-blue-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}>
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                          <Layers size={16} className={settings.template_id === t.id ? 'text-blue-600' : 'text-slate-400'} />
                          {t.label}
                        </div>
                        <p className="mt-2 text-[10px] leading-relaxed text-slate-500 font-bold uppercase">{t.description}</p>
                      </button>
                    ))}
                </div>
             </section>

             <section className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Identité & Langue</h3>
                <div className="flex gap-3 mb-4">
                    {[{ value: 'fr', flag: '🇫🇷' }, { value: 'en', flag: '🇬🇧' }].map((l) => (
                      <button key={l.value} onClick={() => updateBranding({ language: l.value as any })}
                        className={`flex h-12 w-12 items-center justify-center rounded-xl border text-2xl transition-all ${settings.branding.language === l.value ? 'border-blue-600 bg-blue-50' : 'border-slate-200'}`}>
                        <span>{l.flag}</span>
                      </button>
                    ))}
                </div>
                <div className="space-y-4">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Nom du WiFi</label>
                      <input type="text" value={settings.branding.wifiName} onChange={(e) => updateBranding({ wifiName: e.target.value })}
                        className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-sm outline-none" />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Enseigne (ISP)</label>
                      <input type="text" value={settings.branding.ispName} onChange={(e) => updateBranding({ ispName: e.target.value })}
                        className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-sm outline-none" />
                   </div>
                </div>
             </section>

             <section className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Couleurs & Logo</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Couleur 1</label>
                        <input type="color" value={settings.branding.primaryColor} onChange={(e) => updateBranding({ primaryColor: e.target.value })} className="h-12 w-full p-1 bg-white border border-slate-200 rounded-2xl cursor-pointer" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Couleur 2</label>
                        <input type="color" value={settings.branding.secondaryColor} onChange={(e) => updateBranding({ secondaryColor: e.target.value })} className="h-12 w-full p-1 bg-white border border-slate-200 rounded-2xl cursor-pointer" />
                    </div>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {['jservices', 'jconnect'].map(preset => (
                        <div key={preset} onClick={() => updateBranding({ logoPreset: preset as any, logoUrl: '' })} 
                          className={`shrink-0 w-14 h-14 border-2 rounded-2xl cursor-pointer flex items-center justify-center bg-white ${settings.branding.logoPreset === preset ? 'border-blue-600 shadow-lg shadow-blue-600/10' : 'border-slate-100'}`}>
                          <img src={`/portal-editor/assets/presets/${preset}.png`} className="max-w-[70%] object-contain" alt={preset} />
                        </div>
                    ))}
                    <div onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file'; input.accept = 'image/*';
                        input.onchange = (e: any) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                const reader = new FileReader();
                                reader.onload = (re) => setImageToCrop(re.target?.result as string);
                                reader.readAsDataURL(file);
                            }
                        };
                        input.click();
                    }} className="shrink-0 w-14 h-14 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-[8px] font-black text-slate-400 hover:border-blue-600 transition-all">
                        <Download size={14} className="mb-0.5 rotate-180" /> UPLOAD
                    </div>
                </div>
                {imageToCrop && <ImageCropper image={imageToCrop} onCropComplete={(cropped) => { updateBranding({ logoPreset: 'none', logoUrl: cropped }); setImageToCrop(null); }} onCancel={() => setImageToCrop(null)} />}
             </section>
          </div>
        )}

        {activeTab === 'plans' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-2 duration-300">
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
                             setPlans([...settings.plans, { id: Math.random().toString(36).slice(2, 11), profileName: p.name, displayName: `${meta.price} / ${meta.duration}`, priceLabel: meta.price, durationLabel: meta.duration, speedLabel: p['rate-limit'] || '2M/2M', badge: 'none', displayOrder: settings.plans.length + 1 }]);
                          }}
                          className={`flex-shrink-0 w-36 snap-start p-5 rounded-[2rem] border-2 transition-all relative overflow-hidden flex flex-col items-center text-center ${isSelected ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-600/30' : 'bg-white border-slate-100 hover:border-blue-500/50'}`}>
                          <div className={`w-10 h-10 rounded-2xl mb-3 flex items-center justify-center ${isSelected ? 'bg-white/20' : 'bg-blue-50/50 text-blue-600'}`}>
                             {isSelected ? <CheckCircle2 size={20} /> : <ShoppingBag size={18} />}
                          </div>
                          <p className={`text-[12px] font-black leading-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>{p.meta.price}</p>
                          <p className={`text-[9px] font-bold mt-1 uppercase tracking-widest ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>{p.meta.duration}</p>
                        </button>
                       );
                     })}
                   </div>
                </div>
             )}

             <div className="flex items-center justify-between border-t border-slate-100 pt-8 mb-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Configuration des Offres</h3>
                <button onClick={autoAssignBadges} className="px-3 py-1.5 bg-amber-500/10 text-amber-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-amber-500/10 hover:bg-amber-500 hover:text-white transition-all font-black">
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
                        <div className="flex items-center gap-1">
                            <button onClick={() => movePlan(idx, 'up')} disabled={idx === 0} className="p-1.5 text-slate-300 hover:text-blue-600 disabled:opacity-30"><ChevronUp size={14} /></button>
                            <button onClick={() => movePlan(idx, 'down')} disabled={idx === settings.plans.length - 1} className="p-1.5 text-slate-300 hover:text-blue-600 disabled:opacity-30"><ChevronDown size={14} /></button>
                            <button onClick={() => setPlans(settings.plans.filter(pl => pl.id !== p.id))} className="p-1.5 text-slate-300 hover:text-rose-600 transition-all ml-1"><Trash2 size={16} /></button>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                           <label className="text-[8px] font-black uppercase text-slate-400 ml-1">Nom Affiché</label>
                           <input type="text" value={p.displayName} onChange={(e) => { const np = [...settings.plans]; np[idx].displayName = e.target.value; setPlans(np); }} className="w-full p-2.5 bg-white border-none rounded-xl font-bold text-xs" />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[8px] font-black uppercase text-slate-400 ml-1">Badge</label>
                           <select value={p.badge} onChange={(e) => { const np = [...settings.plans]; np[idx].badge = e.target.value as any; setPlans(np); }} className="w-full p-2.5 bg-white border-none rounded-xl font-bold text-xs outline-none">
                              <option value="none">Aucun</option>
                              <option value="eco">💰 Économique</option>
                              <option value="popular">🔥 Populaire</option>
                              <option value="vip">⭐ V.I.P</option>
                           </select>
                        </div>
                        <div className="space-y-1">
                           <label className="text-[8px] font-black uppercase text-slate-400 ml-1">Prix</label>
                           <input type="text" value={p.priceLabel} onChange={(e) => { const np = [...settings.plans]; np[idx].priceLabel = e.target.value; setPlans(np); }} className="w-full p-2.5 bg-white border-none rounded-xl font-bold text-xs" />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[8px] font-black uppercase text-slate-400 ml-1">Vitesse</label>
                           <input type="text" value={p.speedLabel} onChange={(e) => { const np = [...settings.plans]; np[idx].speedLabel = e.target.value; setPlans(np); }} className="w-full p-2.5 bg-white border-none rounded-xl font-bold text-xs" />
                        </div>
                     </div>
                  </div>
                ))}
                <button onClick={() => setPlans([...settings.plans, { id: Math.random().toString(36).slice(2, 11), profileName: '1H', displayName: 'Nouveau Plan', priceLabel: '100 FCFA', durationLabel: '1H', speedLabel: '2M/2M', badge: 'none', displayOrder: settings.plans.length + 1 }])} 
                  className="w-full border-2 border-dashed border-slate-100 py-6 rounded-[2rem] text-slate-400 font-black text-[10px] uppercase tracking-widest hover:border-blue-500/30 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
                    <Plus size={16} /> Ajouter manuellement
                </button>
             </div>
          </div>
        )}

        {activeTab === 'payment' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-2 duration-300">
             <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Passerelle de Paiement</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.features.enablePaymentLinks}
                      onChange={(e) => updateFeatures({ enablePaymentLinks: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all shadow-inner relative"></div>
                  </label>
                </div>
                <div className="space-y-4">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Agrégateur</label>
                      <select value={settings.payment.aggregator} onChange={(e) => updatePayment({ aggregator: e.target.value as any })}
                        className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-sm outline-none cursor-pointer">
                        <option value="none">Désactivé</option>
                        <option value="FedaPay">FedaPay</option>
                        <option value="KKiaPay">KKiaPay</option>
                        <option value="Cinay">Cinay</option>
                        <option value="Custom">Custom</option>
                      </select>
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Clé API Publique (Live)</label>
                      <div className="relative">
                        <input type="text" value={settings.payment.apiKey} onChange={(e) => updatePayment({ apiKey: e.target.value })}
                            className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-xs focus:ring-2 focus:ring-blue-500/20 outline-none pr-12" placeholder="pk_live_..." />
                        <LockIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      </div>
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Gateway URL</label>
                      <input
                        type="text"
                        value={settings.payment.gatewayUrl || ''}
                        onChange={(e) => updatePayment({ gatewayUrl: e.target.value })}
                        className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-xs outline-none"
                        placeholder="https://tpay.mikhmoai.com/buy-ticketmomo"
                      />
                   </div>
                </div>
             </section>

             <section className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Aperçu des Liens</h3>
                  {!settings.features.enablePaymentLinks && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-slate-500">
                      <EyeOff size={12} /> Désactivé
                    </span>
                  )}
                </div>
                <div className="space-y-3">
                  {paymentPreviews.length > 0 ? paymentPreviews.slice(0, 4).map((plan) => (
                    <div key={plan.id} className="rounded-2xl border border-slate-100 bg-white p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-black text-slate-900">{plan.displayName}</div>
                          <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">{plan.priceLabel} • {plan.durationLabel}</div>
                        </div>
                        <button
                          type="button"
                          onClick={async () => {
                            if (!plan.paymentUrl) return;
                            await navigator.clipboard.writeText(plan.paymentUrl);
                          }}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:border-blue-200 hover:text-blue-600 transition-all"
                          title="Copier le lien"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                      <div className="mt-3 break-all rounded-xl bg-slate-50 px-3 py-2 text-[10px] font-mono text-slate-600">
                        {plan.paymentUrl || 'Lien désactivé'}
                      </div>
                    </div>
                  )) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Aucun profil à prévisualiser
                    </div>
                  )}
                </div>
             </section>

             <section className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Contact Support</h3>
                <div className="space-y-4">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase ml-1">WhatsApp (Format: 229XXXXXXXX)</label>
                      <input type="text" value={settings.contact.whatsapp} onChange={(e) => updateContact({ whatsapp: e.target.value })}
                        className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-sm outline-none" placeholder="229..." />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Téléphone Appel</label>
                      <input type="text" value={settings.contact.phone} onChange={(e) => updateContact({ phone: e.target.value })}
                        className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-sm outline-none" />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Adresse ou Message</label>
                      <textarea value={settings.contact.address} onChange={(e) => updateContact({ address: e.target.value })}
                        className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-sm outline-none min-h-[100px] resize-none" />
                   </div>
                </div>
             </section>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-2 duration-300">
             <section className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Options du Template</h3>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase block mb-2">Thème Visuel</label>
                    <div className="grid grid-cols-3 gap-2">
                        {(['auto', 'light', 'dark'] as const).map((m) => (
                        <button key={m} onClick={() => updateFeatures({ themeMode: m })}
                            className={`flex flex-col items-center gap-2 p-3 border rounded-xl transition-all ${settings.features.themeMode === m ? 'border-blue-600 bg-blue-50 text-blue-600 font-black' : 'border-slate-100 text-slate-400 bg-white hover:border-slate-200'}`}>
                            {m === 'auto' ? <Monitor size={18} /> : m === 'light' ? <Sun size={18} /> : <Moon size={18} />}
                            <span className="text-[9px] uppercase tracking-tighter">{m}</span>
                        </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3 pt-4">
                    <FeatureToggle checked={settings.features.enableQrScanner} icon={<QrCode size={16}/>} label="Scanner QR Code" onChange={(v) => updateFeatures({ enableQrScanner: v })} />
                    <FeatureToggle checked={settings.features.enableTrial} icon={<FlaskConical size={16}/>} label="Bouton Essai Gratuit" onChange={(v) => updateFeatures({ enableTrial: v })} />
                </div>
             </section>

             <section className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 flex items-center gap-2"><ShieldCheck size={18} className="text-blue-600" /> ARCEP KYC</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={settings.features.kyc.enabled} onChange={(e) => updateKyc({ enabled: e.target.checked })} className="sr-only peer" />
                      <div className="w-10 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all shadow-inner relative"></div>
                    </label>
                </div>

                {settings.features.kyc.enabled && (
                    <div className="space-y-4 p-5 bg-blue-50/50 rounded-3xl border border-blue-100 animate-in zoom-in-95 duration-200">
                       <div className="space-y-1.5">
                          <label className="text-[9px] font-black uppercase text-blue-600 ml-1">Code Pays</label>
                          <input type="text" value={settings.features.kyc.countryCode} onChange={(e) => updateKyc({ countryCode: e.target.value })} className="w-full p-3 bg-white border-none rounded-xl font-bold text-sm" placeholder="+229" />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[9px] font-black uppercase text-blue-600 ml-1">Longueur Mobile</label>
                          <input type="number" value={settings.features.kyc.phoneLength} onChange={(e) => updateKyc({ phoneLength: parseInt(e.target.value) || 0 })} className="w-full p-3 bg-white border-none rounded-xl font-bold text-sm" />
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[9px] font-black uppercase text-blue-600 ml-1">Préfixes Autorisés</label>
                          <div className="flex flex-wrap gap-1.5 mb-2">
                             {settings.features.kyc.authorizedPrefixes.map(p => (
                                <span key={p} className="px-2 py-1 bg-blue-600 text-white rounded text-[10px] font-black flex items-center gap-1">{p} <button onClick={() => updateKyc({ authorizedPrefixes: settings.features.kyc.authorizedPrefixes.filter(x => x !== p) })}><X size={10}/></button></span>
                             ))}
                          </div>
                          <input type="text" placeholder="Ajouter (Entrée)..." onKeyDown={(e) => { if (e.key === 'Enter') { const v = e.currentTarget.value.trim(); if (v) { updateKyc({ authorizedPrefixes: [...settings.features.kyc.authorizedPrefixes, v] }); e.currentTarget.value = ''; } } }} className="w-full p-3 bg-white border-none rounded-xl font-bold text-sm" />
                       </div>
                    </div>
                )}
             </section>
          </div>
        )}
      </div>
    </div>
  );
};

const FeatureToggle = ({ checked, icon, label, onChange }: { checked: boolean, icon: ReactNode, label: string, onChange: (v: boolean) => void }) => (
  <label className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl cursor-pointer hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200">
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
    <div className="w-10 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all shadow-inner relative"></div>
    <span className="text-slate-500">{icon}</span>
    <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">{label}</span>
  </label>
);
