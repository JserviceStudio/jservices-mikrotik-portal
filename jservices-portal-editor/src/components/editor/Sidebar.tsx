import { useState, type ReactNode, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { Settings, Palette, Ticket, CreditCard, Download, Trash2, Plus, Phone, Cloud, Check, Loader2, Copy, ExternalLink, Layers, ChevronUp, ChevronDown, Sparkles, QrCode, FlaskConical, Sun, Moon, Monitor, ShieldCheck, X, Signal, RefreshCw } from 'lucide-react';
import { exportTemplateZip } from '../../utils/exportZip';
import { deployToCloud } from '../../utils/api';
import { TEMPLATE_DEFINITIONS } from '../../core/templates';
import { ImageCropper } from './ImageCropper';
import { parseProfileLabel, cleanProfileName } from '../../utils/mikhmoai';
import { fetchPortalBootstrap } from '../../utils/api';

export const Sidebar = () => {
  const { settings, mikrotikProfiles, setMikrotikProfiles, setTemplateId, updateBranding, updateFeatures, updateKyc, updatePayment, updateContact, setPlans, setDeploymentStatus, setPublicUrl } = useStore();
  const [activeTab, setActiveTab] = useState('branding');
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleForceRefresh = async () => {
    setIsRefreshing(true);
    try {
      const data = await fetchPortalBootstrap(true);
      setMikrotikProfiles(data.profiles || []);
    } catch (err) {
      console.error('Erreur lors du rafraîchissement:', err);
      alert('Impossible de joindre le MikroTik pour le moment.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Synchronisation des profils MikroTik depuis l'application parente (Iframe Parent)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'setMikrotikProfiles') {
        setMikrotikProfiles(event.data.profiles || []);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [setMikrotikProfiles]);
  

  const getSmartLink = (plan: any, apiKey: string) => {
    if (settings.payment.aggregator === 'none' || !apiKey) return '';
    const nasid = '$(server-name)'; 
    const amount = plan.priceLabel.replace(/\D/g, '');
    const duration = plan.durationLabel || '';
    return `https://tpay.jmoai.net/buy-ticketmomo?nasid=${nasid}&amount=${amount}&currency=cfa&profile_name=${encodeURIComponent(plan.profileName)}&timelimit=${encodeURIComponent(duration)}&mac=$(mac)&ip=$(ip)&pub_key=${apiKey}`;
  };

  const updatePlan = (index: number, updater: (plan: typeof settings.plans[number]) => typeof settings.plans[number]) => {
    const newPlans = [...settings.plans];
    const updatedPlan = updater(newPlans[index]);

    // Si le profil change, on tente un auto-parsing MikhmoAI
    if (updatedPlan.profileName !== settings.plans[index].profileName) {
        const meta = parseProfileLabel(updatedPlan.profileName);
        updatedPlan.priceLabel = meta.price;
        updatedPlan.durationLabel = meta.duration;
        updatedPlan.displayName = meta.duration ? `${meta.price} / ${meta.duration}` : meta.price;
    }

    if (settings.payment.aggregator !== 'none' && settings.payment.apiKey) {
      updatedPlan.paymentUrl = getSmartLink(updatedPlan, settings.payment.apiKey);
    }
    newPlans[index] = updatedPlan;
    setPlans(newPlans.map((plan, idx) => ({ ...plan, displayOrder: idx + 1 })));
  };

  const handlePaymentUpdate = (updates: Partial<typeof settings.payment>) => {
    updatePayment(updates);
    const newApiKey = updates.apiKey || settings.payment.apiKey;
    const newAggregator = updates.aggregator || settings.payment.aggregator;
    if (newAggregator !== 'none' && newApiKey) {
      const updatedPlans = settings.plans.map(plan => ({
        ...plan,
        paymentUrl: `https://tpay.jmoai.net/buy-ticketmomo?nasid=$(server-name)&amount=${plan.priceLabel.replace(/\D/g, '')}&currency=cfa&profile_name=${plan.profileName}&timelimit=${plan.durationLabel}&mac=$(mac)&ip=$(ip)&pub_key=${newApiKey}`
      }));
      setPlans(updatedPlans);
    }
  };

  const movePlan = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= settings.plans.length) return;
    const newPlans = [...settings.plans];
    [newPlans[index], newPlans[targetIndex]] = [newPlans[targetIndex], newPlans[index]];
    setPlans(newPlans.map((plan, idx) => ({ ...plan, displayOrder: idx + 1 })));
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
      const result = await deployToCloud(settings);
      if (result.success) { setPublicUrl(result.url); setDeploymentStatus('success'); } else { setDeploymentStatus('error'); }
    } catch (err) { setDeploymentStatus('error'); }
  };

  const handleExportZip = () => { exportTemplateZip(settings); };

  return (
    <div className="w-[480px] min-w-[480px] h-screen bg-white border-r flex flex-col shadow-lg z-10 overflow-hidden">
      {/* TÉMOIN VISUEL DE MISE À JOUR */}
      <div className="bg-red-600 text-white text-[10px] font-bold py-1 px-4 text-center uppercase tracking-widest animate-pulse">
        🔴 MikhmoAI Engine Active - v2.0.3
      </div>

      {/* Header */}
      <div className="p-6 border-b shrink-0">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Settings className="text-primary" /> Éditeur Portail
        </h1>
        <p className="text-sm text-slate-500 mt-1">Personnalisez votre Hotspot WiFi</p>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b shrink-0">
        <TabBtn icon={<Palette size={16}/>} label="Design" active={activeTab==='branding'} onClick={() => setActiveTab('branding')} />
        <TabBtn icon={<Ticket size={16}/>} label="Forfaits" active={activeTab==='plans'} onClick={() => setActiveTab('plans')} />
        <TabBtn icon={<CreditCard size={16}/>} label="Paiement" active={activeTab==='payment'} onClick={() => setActiveTab('payment')} />
      </div>

      {/* Forms Area */}
      <div className="flex-1 p-6 overflow-y-auto bg-slate-50/30">
        {activeTab === 'branding' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300">
            <h2 className="font-semibold text-lg border-b pb-2 flex items-center gap-2">
               <Palette size={18} className="text-primary"/> Identité Visuelle
            </h2>
            <div className="space-y-4 pt-2">
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Template de Base</label>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.values(TEMPLATE_DEFINITIONS).map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTemplateId(t.id)}
                        className={`rounded-2xl border p-3 text-left transition-all ${
                          settings.template_id === t.id
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                          <Layers size={16} className={settings.template_id === t.id ? 'text-primary' : 'text-slate-400'} />
                          {t.label}
                        </div>
                        <p className="mt-2 text-xs leading-5 text-slate-500">{t.description}</p>
                      </button>
                    ))}
                  </div>
               </div>

               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Langue du Template</label>
                  <div className="flex gap-3">
                    {[{ value: 'fr', flag: '🇫🇷' }, { value: 'en', flag: '🇬🇧' }].map((l) => (
                      <button
                        key={l.value}
                        type="button"
                        onClick={() => updateBranding({ language: l.value as any })}
                        className={`flex h-12 w-12 items-center justify-center rounded-xl border text-2xl transition-all ${
                          settings.branding.language === l.value
                            ? 'border-primary bg-primary/10 shadow-sm'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                        title={l.value}
                      >
                        <span aria-hidden="true">{l.flag}</span>
                      </button>
                    ))}
                  </div>
               </div>

               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Nom du Service (ISP)</label>
                  <input type="text" value={settings.branding.ispName} onChange={(e) => updateBranding({ ispName: e.target.value })} className="w-full border-slate-200 border p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="ex: J+Services WiFi" />
               </div>

               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Nom du Réseau WiFi</label>
                  <input type="text" value={settings.branding.wifiName} onChange={(e) => updateBranding({ wifiName: e.target.value })} className="w-full border-slate-200 border p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="ex: @JServices_Gratuit" />
               </div>

               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Style de Carte</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => updateBranding({ cardStyle: 'glass' })} className={`p-2 border rounded-lg text-xs font-bold transition-all ${settings.branding.cardStyle === 'glass' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>Modern Glass</button>
                    <button onClick={() => updateBranding({ cardStyle: 'ticket' })} className={`p-2 border rounded-lg text-xs font-bold transition-all ${settings.branding.cardStyle === 'ticket' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>Classic Ticket</button>
                  </div>
               </div>

               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Logo (Presets ou Importation)</label>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <div onClick={() => updateBranding({ logoPreset: 'jservices', logoUrl: '' })} className={`shrink-0 w-12 h-12 border-2 rounded-lg cursor-pointer overflow-hidden flex items-center justify-center bg-white ${settings.branding.logoPreset === 'jservices' ? 'border-primary' : 'border-slate-100 hover:border-slate-200'}`}>
                      <img src="/portal-editor/assets/presets/jservices.png" className="max-w-[80%] max-h-[80%] object-contain" alt="J-SERVICES" />
                    </div>
                    <div onClick={() => updateBranding({ logoPreset: 'jconnect', logoUrl: '' })} className={`shrink-0 w-12 h-12 border-2 rounded-lg cursor-pointer overflow-hidden flex items-center justify-center bg-[#0047AB] ${settings.branding.logoPreset === 'jconnect' ? 'border-primary' : 'border-slate-100 hover:border-slate-200'}`}>
                      <img src="/portal-editor/assets/presets/jconnect.png" className="max-w-[80%] max-h-[80%] object-contain" alt="J-CONNECT" />
                    </div>
                    <div 
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e: any) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (re) => setImageToCrop(re.target?.result as string);
                            reader.readAsDataURL(file);
                          }
                        };
                        input.click();
                      }}
                      className={`shrink-0 w-12 h-12 border-2 border-dashed rounded-lg cursor-pointer flex flex-col items-center justify-center text-[8px] font-bold transition-all ${settings.branding.logoUrl && settings.branding.logoPreset === 'none' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                    >
                      <Download size={14} className="mb-0.5 rotate-180" /> IMPORT
                    </div>
                    <div onClick={() => updateBranding({ logoPreset: 'none', logoUrl: '' })} className="shrink-0 w-12 h-12 border-2 border-dashed rounded-lg cursor-pointer flex flex-col items-center justify-center text-[8px] font-bold text-slate-400 border-slate-100 hover:border-slate-200">
                      <Trash2 size={14} className="mb-0.5" /> VIDER
                    </div>
                  </div>

                  {imageToCrop && (
                    <ImageCropper 
                      image={imageToCrop} 
                      onCropComplete={(cropped) => { updateBranding({ logoPreset: 'none', logoUrl: cropped }); setImageToCrop(null); }} 
                      onCancel={() => setImageToCrop(null)} 
                    />
                  )}

                  {settings.branding.logoUrl && (
                    <div className="mt-2 flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100 animate-in fade-in">
                      <img src={settings.branding.logoUrl} className="h-6 w-6 object-contain rounded" />
                      <span className="text-[10px] font-bold text-primary uppercase">Logo Personnalisé</span>
                      <button onClick={() => updateBranding({ logoUrl: '' })} className="ml-auto text-slate-300 hover:text-red-500"><X size={14} /></button>
                    </div>
                  )}
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Couleur 1</label>
                    <div className="flex gap-2">
                       <input type="color" value={settings.branding.primaryColor} onChange={(e) => updateBranding({ primaryColor: e.target.value })} className="h-10 w-12 p-1 bg-white border border-slate-200 rounded-lg cursor-pointer" />
                       <input type="text" value={settings.branding.primaryColor} onChange={(e) => updateBranding({ primaryColor: e.target.value })} className="flex-1 border-slate-200 border p-2 rounded-lg text-xs uppercase font-mono" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Couleur 2</label>
                    <div className="flex gap-2">
                       <input type="color" value={settings.branding.secondaryColor} onChange={(e) => updateBranding({ secondaryColor: e.target.value })} className="h-10 w-12 p-1 bg-white border border-slate-200 rounded-lg cursor-pointer" />
                       <input type="text" value={settings.branding.secondaryColor} onChange={(e) => updateBranding({ secondaryColor: e.target.value })} className="flex-1 border-slate-200 border p-2 rounded-lg text-xs uppercase font-mono" />
                    </div>
                  </div>
               </div>
            </div>

            <h2 className="font-semibold text-lg border-b pb-2 mt-8 flex items-center gap-2">
               <Phone size={18} className="text-primary"/> Contact & Aide
            </h2>
            <div className="space-y-4 pt-2">
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Téléphone / Support</label>
                  <input type="text" value={settings.contact.phone} onChange={(e) => updateContact({ phone: e.target.value })} className="w-full border-slate-200 border p-2.5 rounded-lg text-sm" />
               </div>
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">WhatsApp Support</label>
                  <input type="text" value={settings.contact.whatsapp} onChange={(e) => updateContact({ whatsapp: e.target.value })} className="w-full border-slate-200 border p-2.5 rounded-lg text-sm" placeholder="ex: 22996937864" />
               </div>
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Adresse Support</label>
                  <textarea value={settings.contact.address} onChange={(e) => updateContact({ address: e.target.value })} className="min-h-[88px] w-full resize-none border-slate-200 border p-3 rounded-lg text-sm" placeholder="ex: Assistance via WhatsApp." />
               </div>

               <div className="space-y-2 mb-4">
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Thème Portail</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['auto', 'light', 'dark'] as const).map((m) => (
                      <button 
                        key={m}
                        onClick={() => updateFeatures({ themeMode: m })}
                        className={`flex flex-col items-center gap-2 p-3 border rounded-xl transition-all ${
                          settings.features.themeMode === m 
                            ? 'border-primary bg-primary/5 text-primary font-bold' 
                            : 'border-slate-200 text-slate-400 bg-white hover:border-slate-300'
                        }`}
                      >
                        {m === 'auto' ? <Monitor size={18} /> : m === 'light' ? <Sun size={18} /> : <Moon size={18} />}
                        <span className="text-[9px] uppercase">{m}</span>
                      </button>
                    ))}
                  </div>
               </div>

               <div className="grid grid-cols-1 gap-3">
                  <FeatureToggle checked={settings.features.enableQrScanner} icon={<QrCode size={16}/>} label="Module QR Scanner" onChange={(v) => updateFeatures({ enableQrScanner: v })} />
                  <FeatureToggle checked={settings.features.enableTrial} icon={<FlaskConical size={16}/>} label="Ticket d'essai" onChange={(v) => updateFeatures({ enableTrial: v })} />
               </div>

               <div className="mt-8 pt-6 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2"><ShieldCheck size={18} className="text-primary" /> ARCEP KYC</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={settings.features.kyc.enabled} onChange={(e) => updateKyc({ enabled: e.target.checked })} className="sr-only peer" />
                      <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                    </label>
                  </div>

                  {settings.features.kyc.enabled && (
                    <div className="space-y-4 p-4 bg-primary/5 rounded-2xl border border-primary/10 animate-in fade-in">
                       <input type="text" value={settings.features.kyc.countryCode} onChange={(e) => updateKyc({ countryCode: e.target.value })} className="w-full border-slate-200 border p-2.5 rounded-xl text-sm" placeholder="+229" />
                       <div className="flex flex-wrap gap-1.5">
                         {settings.features.kyc.authorizedPrefixes.map((p) => (
                           <div key={p} className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-md border border-primary/20 flex items-center gap-1">
                             {p} <button onClick={() => updateKyc({ authorizedPrefixes: settings.features.kyc.authorizedPrefixes.filter(x => x !== p) })}><X size={10} /></button>
                           </div>
                         ))}
                       </div>
                       <input 
                        type="text" 
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const val = e.currentTarget.value.trim();
                            if (val && !settings.features.kyc.authorizedPrefixes.includes(val)) {
                              updateKyc({ authorizedPrefixes: [...settings.features.kyc.authorizedPrefixes, val] });
                              e.currentTarget.value = '';
                            }
                          }
                        }}
                        className="w-full border-slate-200 border p-2.5 rounded-xl text-sm" 
                        placeholder="Ajouter préfixe (Entrée)..." 
                       />
                       <input type="number" value={settings.features.kyc.phoneLength} onChange={(e) => updateKyc({ phoneLength: parseInt(e.target.value) || 0 })} className="w-full border-slate-200 border p-2.5 rounded-xl text-sm" placeholder="Nb chiffres" />
                       <input type="text" value={settings.features.kyc.loggingUrl} onChange={(e) => updateKyc({ loggingUrl: e.target.value })} className="w-full border-slate-200 border p-2.5 rounded-xl text-sm font-mono" placeholder="Webhook URL" />
                    </div>
                  )}
               </div>
            </div>
          </div>
        )}

        {/* FORFAITS TAB */}
        {activeTab === 'plans' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300">
             <div className="flex items-center justify-between border-b pb-2">
               <h2 className="font-semibold text-lg">Configurer les Tarifs</h2>
               <button type="button" onClick={autoAssignBadges} className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 hover:bg-amber-100">
                 <Sparkles size={14} /> Auto-Badges
               </button>
             </div>

             {/* MikroTik Profiles Selection Bar */}
             {mikrotikProfiles.length > 0 && (
                <div className="mb-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                   <div className="flex items-center justify-between mb-3">
                      <p className="text-[9px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                        <Signal size={12} /> Profils MikroTik détectés
                      </p>
                      <button 
                        onClick={handleForceRefresh} 
                        disabled={isRefreshing}
                        className="text-primary hover:bg-primary/10 p-1 rounded-full transition-all disabled:opacity-50"
                        title="Forcer la synchronisation avec le routeur"
                      >
                        <RefreshCw size={12} className={isRefreshing ? 'animate-spin' : ''} />
                      </button>
                   </div>
                   <div className="flex flex-wrap gap-2">
                     {mikrotikProfiles.map((p) => {
                       const isSelected = settings.plans.some(plan => plan.profileName === p.name);
                       return (
                        <button 
                          key={p.name}
                          disabled={isSelected}
                          onClick={() => {
                             const cleanName = cleanProfileName(p.name);
                             const { price, duration } = parseProfileLabel(cleanName);
                             setPlans([...settings.plans, { 
                                id: Math.random().toString(36).slice(2, 11), 
                                profileName: p.name, 
                                displayName: duration ? `${price} / ${duration}` : price, 
                                priceLabel: price, 
                                durationLabel: duration, 
                                speedLabel: p['rate-limit'] || '2M/2M', 
                                badge: 'none', 
                                displayOrder: settings.plans.length + 1 
                             }]);
                          }}
                          className={`px-2.5 py-1.5 border rounded-xl text-[10px] font-black transition-all shadow-sm ${
                            isSelected 
                            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed' 
                            : 'bg-white border-primary/20 text-primary hover:bg-primary hover:text-white'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '} {p.name}
                        </button>
                       );
                     })}
                   </div>
                </div>
             )}

             {settings.plans.map((p, idx) => (
                <div key={p.id} className="group border p-4 rounded-xl bg-white relative transition-all hover:border-primary/30">
                   <button onClick={() => setPlans(settings.plans.filter((_, i) => i !== idx))} className="absolute top-2 right-2 text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
                   <div className="font-semibold text-xs uppercase text-primary/60 mb-3 flex items-center gap-2">
                     <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px]">{idx + 1}</div> Forfait
                     <div className="ml-auto flex items-center gap-1">
                        <button onClick={() => movePlan(idx, 'up')} disabled={idx === 0} className="p-1 text-slate-400 disabled:opacity-30"><ChevronUp size={14} /></button>
                        <button onClick={() => movePlan(idx, 'down')} disabled={idx === settings.plans.length - 1} className="p-1 text-slate-400 disabled:opacity-30"><ChevronDown size={14} /></button>
                     </div>
                   </div>
                   <div className="space-y-3">
                     <div className="flex flex-col gap-1">
                        <label className="text-[9px] font-black uppercase text-slate-400">Profil MikroTik</label>
                        {mikrotikProfiles.length > 0 ? (
                           <select 
                              className="w-full border-b border-slate-200 p-1 text-sm font-black bg-transparent outline-none focus:border-primary transition-colors cursor-pointer"
                              value={p.profileName} 
                              onChange={(e) => updatePlan(idx, (plan) => ({ ...plan, profileName: e.target.value }))}
                           >
                              <option value="">Sélectionnez un profil...</option>
                              {mikrotikProfiles.map((mp: any) => (
                                 <option key={mp.name} value={mp.name}>{mp.name}</option>
                              ))}
                           </select>
                        ) : (
                           <input type="text" placeholder="Ex: 1H-PROMO" className="w-full border-b border-slate-100 p-1 text-sm font-medium" value={p.profileName} onChange={(e) => updatePlan(idx, (plan) => ({ ...plan, profileName: e.target.value }))} />
                        )}
                     </div>
                     <input type="text" placeholder="Nom Affiché" className="w-full border-b border-slate-100 p-1 text-sm font-bold text-slate-700" value={p.displayName} onChange={(e) => updatePlan(idx, (plan) => ({ ...plan, displayName: e.target.value }))} />
                     <input type="text" placeholder="Prix" className="w-full border-b border-slate-100 p-1 text-sm" value={p.priceLabel} onChange={(e) => updatePlan(idx, (plan) => ({ ...plan, priceLabel: e.target.value }))} />
                     <div className="flex gap-4">
                        <input type="text" placeholder="Vitesse" className="flex-1 border-b border-slate-100 p-1 text-xs" value={p.speedLabel} onChange={(e) => updatePlan(idx, (plan) => ({ ...plan, speedLabel: e.target.value }))} />
                        <input type="text" placeholder="Durée" className="flex-1 border-b border-slate-100 p-1 text-xs" value={p.durationLabel} onChange={(e) => updatePlan(idx, (plan) => ({ ...plan, durationLabel: e.target.value }))} />
                     </div>
                     <select className="w-full border-b border-slate-100 p-1 text-xs bg-transparent" value={p.badge} onChange={(e) => updatePlan(idx, (plan) => ({ ...plan, badge: e.target.value as any }))}>
                        <option value="none">Badge: Aucun</option>
                        <option value="popular">Badge: Populaire 🔥</option>
                        <option value="vip">Badge: VIP ⭐</option>
                        <option value="eco">Badge: Éco 💰</option>
                     </select>
                     <input type="text" placeholder="Lien de Paiement" className="w-full border-b border-slate-100 p-1 text-[10px] font-mono" value={p.paymentUrl || ''} onChange={(e) => updatePlan(idx, (plan) => ({ ...plan, paymentUrl: e.target.value }))} />
                   </div>
                </div>
             ))}
             <button onClick={() => setPlans([...settings.plans, { id: Math.random().toString(36).slice(2, 11), profileName: '1H', displayName: 'Nouveau', priceLabel: '100 FCFA', durationLabel: '1H', speedLabel: '2M/2M', badge: 'none', displayOrder: settings.plans.length + 1 }])} className="w-full border-2 border-dashed border-slate-200 text-slate-400 font-bold py-4 rounded-xl hover:border-primary/50 flex items-center justify-center gap-2"><Plus size={18} /> Ajouter</button>
          </div>
        )}

        {/* PAYMENT TAB */}
        {activeTab === 'payment' && (
          <div className="space-y-6">
             <h2 className="font-semibold text-lg border-b pb-2 flex items-center gap-2"><CreditCard size={18} className="text-primary"/> Paiement</h2>
             <div className="space-y-4">
                <select className="w-full border border-slate-200 p-2.5 rounded-lg text-sm" value={settings.payment.aggregator} onChange={(e) => handlePaymentUpdate({ aggregator: e.target.value as any })}>
                  <option value="none">Désactivé</option>
                  <option value="MoailteStore">MoailteStore</option>
                  <option value="FedaPay">FedaPay</option>
                  <option value="Cinay">Cinay Pay</option>
                  <option value="Custom">Custom Webhook</option>
                </select>
                {settings.payment.aggregator !== 'none' && (
                  <div className="space-y-4 animate-in fade-in">
                    <input type="text" className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-mono" placeholder="Clé API Publique" value={settings.payment.apiKey} onChange={(e) => handlePaymentUpdate({ apiKey: e.target.value })} />
                    <input type="text" className="w-full border border-slate-200 p-2.5 rounded-lg text-sm font-mono" placeholder="Client ID (Optionnel)" value={settings.payment.clientId} onChange={(e) => handlePaymentUpdate({ clientId: e.target.value })} />
                  </div>
                )}
             </div>
          </div>
        )}
      </div>

      {/* STICKY FOOTER ACTIONS */}
      <div className="p-6 border-t bg-white shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.03)] space-y-3">
         <div className="flex gap-4 mb-4">
            <button onClick={handleExportZip} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2"><Download size={18} /> ZIP</button>
            <button onClick={handleSaveCloud} disabled={settings.deploymentStatus === 'loading'} className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-70">
               {settings.deploymentStatus === 'loading' ? <Loader2 size={18} className="animate-spin" /> : settings.deploymentStatus === 'success' ? <Check size={18} /> : <Cloud size={18} />} {settings.deploymentStatus === 'loading' ? 'Envoi...' : 'Cloud'}
            </button>
         </div>
         {settings.publicUrl && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 animate-in fade-in">
               <div className="flex bg-white border border-emerald-200 rounded-lg overflow-hidden mb-2">
                  <input type="text" readOnly value={settings.publicUrl} className="flex-1 text-[10px] p-2 bg-transparent outline-none text-slate-600" />
                  <button onClick={() => { navigator.clipboard.writeText(settings.publicUrl!); alert("URL copiée !"); }} className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-3"><Copy size={14} /></button>
               </div>
               <a href={settings.publicUrl} target="_blank" className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline">Voir le portail <ExternalLink size={12} /></a>
            </div>
         )}
      </div>
    </div>
  );
};

const TabBtn = ({ icon, label, active, onClick }: { icon: ReactNode; label: string; active: boolean; onClick: () => void }) => (
  <button onClick={onClick} className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${active ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
    {icon} {label}
  </button>
);

const FeatureToggle = ({ checked, icon, label, onChange }: { checked: boolean; icon: ReactNode; label: string; onChange: (checked: boolean) => void }) => (
  <label className={`flex items-center gap-3 rounded-xl border p-3 transition ${checked ? 'border-primary/30 bg-primary/5' : 'border-slate-200 bg-white'}`}>
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 rounded text-primary focus:ring-primary" />
    <span className="text-slate-500">{icon}</span>
    <span className="text-sm font-medium text-slate-700">{label}</span>
  </label>
);
