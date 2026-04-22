import { useState, type ReactNode } from 'react';
import { useStore } from '../../store/useStore';
import { Settings, Palette, Ticket, CreditCard, Download, Trash2, Plus, Phone, Cloud, Check, Loader2, Copy, Globe, ExternalLink, Layers, ChevronUp, ChevronDown, Sparkles, QrCode, FlaskConical, Sun, Moon, Monitor, ShieldCheck, X } from 'lucide-react';
import { exportTemplateZip } from '../../utils/exportZip';
import { deployToCloud } from '../../utils/api';
import { TEMPLATE_DEFINITIONS } from '../../core/templates';

export const Sidebar = () => {
  const { settings, setTemplateId, updateBranding, updateFeatures, updateKyc, updatePayment, updateContact, setPlans, setDeploymentStatus, setPublicUrl } = useStore();
  const [activeTab, setActiveTab] = useState('branding');
  const selectedTemplate = TEMPLATE_DEFINITIONS[settings.template_id];

  const updatePlan = (index: number, updater: (plan: typeof settings.plans[number]) => typeof settings.plans[number]) => {
    const newPlans = [...settings.plans];
    newPlans[index] = updater(newPlans[index]);
    setPlans(
      newPlans.map((plan, idx) => ({
        ...plan,
        displayOrder: idx + 1,
      })),
    );
  };

  const movePlan = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= settings.plans.length) return;
    const newPlans = [...settings.plans];
    [newPlans[index], newPlans[targetIndex]] = [newPlans[targetIndex], newPlans[index]];
    setPlans(
      newPlans.map((plan, idx) => ({
        ...plan,
        displayOrder: idx + 1,
      })),
    );
  };

  const autoAssignBadges = () => {
    const rankByPrice = [...settings.plans]
      .map((plan) => ({
        id: plan.id,
        amount: Number.parseInt(plan.priceLabel.replace(/\D/g, ''), 10) || 0,
      }))
      .sort((a, b) => a.amount - b.amount);

    const cheapestId = rankByPrice[0]?.id;
    const priciestId = rankByPrice[rankByPrice.length - 1]?.id;
    const middleId = rankByPrice[Math.floor(rankByPrice.length / 2)]?.id;

    setPlans(
      settings.plans.map((plan, idx) => ({
        ...plan,
        badge:
          plan.id === priciestId ? 'vip' :
          plan.id === cheapestId ? 'eco' :
          plan.id === middleId || idx === 1 ? 'popular' :
          'none',
      })),
    );
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

  const handleExportZip = () => {
    exportTemplateZip(settings);
  };

  return (
    <div className="w-[480px] min-w-[480px] h-screen bg-white border-r flex flex-col shadow-lg z-10 overflow-hidden">
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
                     {Object.values(TEMPLATE_DEFINITIONS).map((template) => (
                        <button
                          key={template.id}
                          type="button"
                          onClick={() => setTemplateId(template.id)}
                          className={`rounded-2xl border p-3 text-left transition-all ${
                            settings.template_id === template.id
                              ? 'border-primary bg-primary/5 shadow-sm'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                            <Layers size={16} className={settings.template_id === template.id ? 'text-primary' : 'text-slate-400'} />
                            {template.label}
                          </div>
                          <p className="mt-2 text-xs leading-5 text-slate-500">
                            {template.description}
                          </p>
                        </button>
                     ))}
                  </div>
               </div>
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Langue du Template</label>
                  <div className="flex gap-3">
                    {[
                      { value: 'fr', flag: '🇫🇷' },
                      { value: 'en', flag: '🇬🇧' },
                    ].map((language) => (
                      <button
                        key={language.value}
                        type="button"
                        onClick={() => updateBranding({ language: language.value as 'fr' | 'en' })}
                        className={`flex h-12 w-12 items-center justify-center rounded-xl border text-2xl transition-all ${
                          settings.branding.language === language.value
                            ? 'border-primary bg-primary/10 shadow-sm'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                        title={language.value}
                      >
                        <span aria-hidden="true">{language.flag}</span>
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-[11px] leading-5 text-slate-400">
                    Cette langue sera appliquee aux textes du portail genere.
                  </p>
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
                      <button 
                        onClick={() => updateBranding({ cardStyle: 'glass' })}
                        className={`p-2 border rounded-lg text-xs font-bold transition-all ${settings.branding.cardStyle === 'glass' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                      >
                        Modern Glass
                      </button>
                      <button 
                        onClick={() => updateBranding({ cardStyle: 'ticket' })}
                        className={`p-2 border rounded-lg text-xs font-bold transition-all ${settings.branding.cardStyle === 'ticket' ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                      >
                        Classic Ticket
                      </button>
                   </div>
                   <p className="mt-2 text-[11px] leading-5 text-slate-400">
                     Le style affiché ici affine l’ambiance générale, mais le rendu final reste piloté par le template choisi.
                   </p>
                </div>

                <div>
                   <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Logo (Presets ou URL)</label>
                   <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      <div 
                        onClick={() => updateBranding({ logoPreset: 'jservices', logoUrl: '' })}
                        className={`shrink-0 w-12 h-12 border-2 rounded-lg cursor-pointer overflow-hidden transition-all ${settings.branding.logoPreset === 'jservices' ? 'border-primary' : 'border-slate-100 hover:border-slate-200'}`}
                      >
                        <img src="/assets/presets/jservices.png" className="w-full h-full object-cover" alt="Preset 1" />
                      </div>
                      <div 
                        onClick={() => updateBranding({ logoPreset: 'jconnect', logoUrl: '' })}
                        className={`shrink-0 w-12 h-12 border-2 rounded-lg cursor-pointer overflow-hidden transition-all ${settings.branding.logoPreset === 'jconnect' ? 'border-primary' : 'border-slate-100 hover:border-slate-200'}`}
                      >
                        <img src="/assets/presets/jconnect.png" className="w-full h-full object-cover" alt="Preset 2" />
                      </div>
                      <div 
                        onClick={() => updateBranding({ logoPreset: 'none' })}
                        className={`shrink-0 w-12 h-12 border-2 border-dashed rounded-lg cursor-pointer flex items-center justify-center text-[10px] font-bold text-slate-400 transition-all ${settings.branding.logoPreset === 'none' ? 'border-primary text-primary' : 'border-slate-100 hover:border-slate-200'}`}
                      >
                        URL
                      </div>
                   </div>
                   {settings.branding.logoPreset === 'none' && (
                     <input type="text" value={settings.branding.logoUrl} onChange={(e) => updateBranding({ logoUrl: e.target.value })} className="w-full mt-2 border-slate-200 border p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="https://..." />
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
                  <input type="text" value={settings.contact.phone} onChange={(e) => updateContact({ phone: e.target.value })} className="w-full border-slate-200 border p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
               </div>
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">WhatsApp Support</label>
                  <input type="text" value={settings.contact.whatsapp} onChange={(e) => updateContact({ whatsapp: e.target.value })} className="w-full border-slate-200 border p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="ex: 22996937864" />
               </div>
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Adresse / Message Support</label>
                  <textarea value={settings.contact.address} onChange={(e) => updateContact({ address: e.target.value })} className="min-h-[88px] w-full resize-none border-slate-200 border p-3 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" placeholder="ex: Assistance disponible uniquement via WhatsApp." />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Nom Designer</label>
                     <input type="text" value={settings.contact.designerName} onChange={(e) => updateContact({ designerName: e.target.value })} className="w-full border-slate-200 border p-2 rounded-lg text-xs" />
                  </div>
                  <div>
                     <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Année</label>
                     <input type="text" value={settings.contact.designerYear} onChange={(e) => updateContact({ designerYear: e.target.value })} className="w-full border-slate-200 border p-2 rounded-lg text-xs" />
                  </div>
               </div>
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Lien Contact Designer (WhatsApp)</label>
                  <input type="text" value={settings.contact.designerPhone} onChange={(e) => updateContact({ designerPhone: e.target.value })} className="w-full border-slate-200 border p-2.5 rounded-lg text-sm" placeholder="ex: 229XXXXXXXX" />
               </div>
                <div className="space-y-2 mb-4">
                   <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Apparence du Portail</label>
                   <div className="grid grid-cols-3 gap-2">
                      <button 
                         type="button"
                         onClick={() => updateFeatures({ themeMode: 'auto' })}
                         className={`flex flex-col items-center gap-2 p-3 border rounded-xl transition-all ${settings.features.themeMode === 'auto' ? 'border-primary bg-primary/5 text-primary font-bold' : 'border-slate-200 text-slate-400 bg-white hover:border-slate-300'}`}
                         title="Suit les réglages système"
                      >
                         <Monitor size={18} />
                         <span className="text-[9px] uppercase tracking-wider">Auto</span>
                      </button>
                      <button 
                         type="button"
                         onClick={() => updateFeatures({ themeMode: 'light' })}
                         className={`flex flex-col items-center gap-2 p-3 border rounded-xl transition-all ${settings.features.themeMode === 'light' ? 'border-primary bg-primary/5 text-primary font-bold' : 'border-slate-200 text-slate-400 bg-white hover:border-slate-300'}`}
                         title="Toujours clair"
                      >
                         <Sun size={18} />
                         <span className="text-[9px] uppercase tracking-wider">Jour</span>
                      </button>
                      <button 
                         type="button"
                         onClick={() => updateFeatures({ themeMode: 'dark' })}
                         className={`flex flex-col items-center gap-2 p-3 border rounded-xl transition-all ${settings.features.themeMode === 'dark' ? 'border-primary bg-primary/5 text-primary font-bold' : 'border-slate-200 text-slate-400 bg-white hover:border-slate-300'}`}
                         title="Toujours sombre"
                      >
                         <Moon size={18} />
                         <span className="text-[9px] uppercase tracking-wider">Nuit</span>
                      </button>
                   </div>
                </div>
               <div className="grid grid-cols-1 gap-3">
                  <FeatureToggle
                    checked={settings.features.enableQrScanner}
                    icon={<QrCode size={16} />}
                    label="Activer le module QR Scanner"
                    onChange={(checked) => updateFeatures({ enableQrScanner: checked })}
                  />
                  <FeatureToggle
                    checked={settings.features.enableTrial}
                    icon={<FlaskConical size={16} />}
                    label="Activer le mode Ticket d'essai"
                    onChange={(checked) => updateFeatures({ enableTrial: checked })}
                  />
               </div>
                 
                 <div className="mt-8 pt-6 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                       <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                          <ShieldCheck size={18} className="text-primary"/> ARCEP KYC & Traçabilité
                       </h3>
                       <div className="flex items-center gap-2">
                         <span className="text-[10px] font-bold text-slate-400 uppercase">{settings.features.kyc.enabled ? 'Actif' : 'Off'}</span>
                         <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                               type="checkbox" 
                               checked={settings.features.kyc.enabled} 
                               onChange={(e) => updateKyc({ enabled: e.target.checked })}
                               className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                         </label>
                       </div>
                    </div>
                    
                    {settings.features.kyc.enabled && (
                       <div className="space-y-4 p-4 bg-primary/5 rounded-2xl border border-primary/10 animate-in fade-in slide-in-from-top-2 duration-300">
                          <div>
                             <label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block">Indicatif National (Ex: +229)</label>
                             <input 
                                type="text" 
                                value={settings.features.kyc.countryCode} 
                                onChange={(e) => updateKyc({ countryCode: e.target.value })} 
                                className="w-full border-slate-200 border p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none bg-white transition-all" 
                                placeholder="+229" 
                             />
                          </div>
                          <div>
                             <label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block flex items-center justify-between">
                                Préfixes Autorisés (Ex: 01, 07)
                                <span className="text-[9px] text-slate-400 normal-case font-medium">Appuyez sur Entrée</span>
                             </label>
                             <div className="flex flex-wrap gap-1.5 mb-2">
                                {settings.features.kyc.authorizedPrefixes.map((prefix) => (
                                   <div key={prefix} className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-md border border-primary/20 animate-in zoom-in duration-200">
                                      {prefix}
                                      <button 
                                         onClick={() => {
                                            updateKyc({ 
                                               authorizedPrefixes: settings.features.kyc.authorizedPrefixes.filter(p => p !== prefix) 
                                            });
                                         }}
                                         className="hover:text-red-500 transition-colors"
                                      >
                                         <X size={10} />
                                      </button>
                                   </div>
                                ))}
                             </div>
                             <input 
                                type="text" 
                                onKeyDown={(e) => {
                                   if (e.key === 'Enter') {
                                      const val = e.currentTarget.value.trim();
                                      if (val && !settings.features.kyc.authorizedPrefixes.includes(val)) {
                                         updateKyc({ 
                                            authorizedPrefixes: [...settings.features.kyc.authorizedPrefixes, val] 
                                         });
                                         e.currentTarget.value = '';
                                      }
                                   }
                                }}
                                className="w-full border-slate-200 border p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none bg-white transition-all" 
                                placeholder="Ajouter un préfixe..." 
                             />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block">Nb chiffres (Local)</label>
                                <input 
                                   type="number" 
                                   value={settings.features.kyc.phoneLength} 
                                   onChange={(e) => updateKyc({ phoneLength: parseInt(e.target.value) || 0 })} 
                                   className="w-full border-slate-200 border p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none bg-white transition-all" 
                                />
                             </div>
                             <div className="flex items-end flex-col justify-center text-right">
                                <span className="text-[10px] text-slate-400 italic leading-tight">Le client doit saisir {settings.features.kyc.phoneLength} chiffres.</span>
                             </div>
                          </div>
                          <div>
                             <label className="text-[10px] font-bold text-slate-500 uppercase mb-1.5 block">URL API de Logging (Webhook)</label>
                             <input 
                                type="text" 
                                value={settings.features.kyc.loggingUrl} 
                                onChange={(e) => updateKyc({ loggingUrl: e.target.value })} 
                                className="w-full border-slate-200 border p-2.5 rounded-xl text-sm font-mono focus:ring-2 focus:ring-primary/20 outline-none bg-white transition-all" 
                                placeholder="https://votre-serveur.com/api/kyc" 
                             />
                          </div>
                       </div>
                    )}
                 </div>

               <div className="rounded-2xl border border-slate-200 bg-white p-4 mt-6">
                  <div className="text-xs font-bold uppercase tracking-wide text-slate-500">Template actif</div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">{selectedTemplate.label}</div>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    {selectedTemplate.description}
                  </p>
               </div>
            </div>
          </div>
        )}

        {/* FORFAITS TAB */}
        {activeTab === 'plans' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300">
             <div className="flex items-center justify-between border-b pb-2">
               <h2 className="font-semibold text-lg">Configurer les Tarifs</h2>
               <button
                 type="button"
                 onClick={autoAssignBadges}
                 className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 transition hover:bg-amber-100"
               >
                 <Sparkles size={14} />
                 Auto-Badges
               </button>
             </div>
             <p className="text-xs text-slate-500">Listez ici les temps de connexion disponibles sur votre routeur.</p>
             <div className="grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-white p-3">
               <BadgeTypeCard title="Standard" value="none" tone="slate" />
               <BadgeTypeCard title="Populaire" value="popular" tone="orange" />
               <BadgeTypeCard title="VIP" value="vip" tone="violet" />
               <BadgeTypeCard title="Éco" value="eco" tone="green" />
             </div>
             {settings.plans.map((p, idx) => (
                <div key={p.id} className="group border p-4 rounded-xl bg-white relative transition-all hover:border-primary/30 hover:shadow-md">
                   <button 
                     onClick={() => {
                        const newPlans = settings.plans.filter((_, i) => i !== idx);
                        setPlans(newPlans);
                     }}
                     className="absolute top-2 right-2 text-slate-300 hover:text-red-500 transition-colors"
                   >
                     <Trash2 size={16} />
                   </button>
                   <div className="font-semibold text-xs uppercase tracking-wider text-primary/60 mb-3 flex items-center gap-2">
                     <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px]">
                        {idx + 1}
                     </div>
                     Détails du Forfait
                     <div className="ml-auto flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => movePlan(idx, 'up')}
                          disabled={idx === 0}
                          className="rounded-md border border-slate-200 p-1 text-slate-400 transition hover:border-slate-300 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-35"
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => movePlan(idx, 'down')}
                          disabled={idx === settings.plans.length - 1}
                          className="rounded-md border border-slate-200 p-1 text-slate-400 transition hover:border-slate-300 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-35"
                        >
                          <ChevronDown size={14} />
                        </button>
                     </div>
                   </div>
                   <div className="space-y-3">
                     <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Nom Interne / Profil</label>
                        <input
                          type="text"
                          placeholder="ex: 1H-VIP"
                          className="w-full border-0 border-b border-slate-100 bg-transparent focus:ring-0 p-1 text-sm font-medium focus:border-primary transition-all"
                          value={p.profileName}
                          onChange={(e) => updatePlan(idx, (plan) => ({ ...plan, profileName: e.target.value }))}
                        />
                     </div>
                     <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Nom Affiché</label>
                        <input
                          type="text"
                          placeholder="ex: Forfait Soirée"
                          className="w-full border-0 border-b border-slate-100 bg-transparent focus:ring-0 p-1 text-sm font-medium focus:border-primary transition-all"
                          value={p.displayName}
                          onChange={(e) => updatePlan(idx, (plan) => ({ ...plan, displayName: e.target.value }))}
                        />
                     </div>
                     <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Prix Affiché</label>
                        <input type="text" placeholder="ex: 100 FCFA" className="w-full border-0 border-b border-slate-100 bg-transparent focus:ring-0 p-1 text-sm font-medium focus:border-primary transition-all" value={p.priceLabel}
                           onChange={(e) => updatePlan(idx, (plan) => ({ ...plan, priceLabel: e.target.value }))}
                        />
                     </div>
                     <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Vitesse / Description</label>
                        <input
                          type="text"
                          placeholder="ex: 2M/2M"
                          className="w-full border-0 border-b border-slate-100 bg-transparent focus:ring-0 p-1 text-sm font-medium focus:border-primary transition-all"
                          value={p.speedLabel}
                          onChange={(e) => updatePlan(idx, (plan) => ({ ...plan, speedLabel: e.target.value }))}
                        />
                     </div>
                     <div className="flex gap-4">
                        <div className="flex-1">
                           <label className="text-[10px] font-bold text-slate-400 uppercase">Durée (Badge)</label>
                           <input type="text" placeholder="ex: 1H" className="w-full border-0 border-b border-slate-100 bg-transparent focus:ring-0 p-1 text-sm font-medium focus:border-primary transition-all" value={p.durationLabel}
                           onChange={(e) => updatePlan(idx, (plan) => ({ ...plan, durationLabel: e.target.value }))} />
                        </div>
                        <div className="flex-1">
                           <label className="text-[10px] font-bold text-slate-400 uppercase">Style Badge</label>
                           <select className="w-full border-0 border-b border-slate-100 bg-transparent focus:ring-0 p-1 text-sm font-medium cursor-pointer focus:border-primary transition-all" value={p.badge}
                           onChange={(e) => updatePlan(idx, (plan) => ({ ...plan, badge: e.target.value as any }))}>
                              <option value="none">Standard</option>
                              <option value="popular">Populaire 🔥</option>
                              <option value="vip">Super VIP ⭐</option>
                              <option value="eco">Éco 💰</option>
                           </select>
                        </div>
                     </div>
                     <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Lien de Paiement</label>
                        <input
                          type="text"
                          placeholder="https://..."
                          className="w-full border-0 border-b border-slate-100 bg-transparent focus:ring-0 p-1 text-sm font-medium focus:border-primary transition-all"
                          value={p.paymentUrl || ''}
                          onChange={(e) => updatePlan(idx, (plan) => ({ ...plan, paymentUrl: e.target.value }))}
                        />
                     </div>
                   </div>
                </div>
             ))}
             <button onClick={() => setPlans([...settings.plans, { id: Math.random().toString(36).slice(2, 11), profileName: '1H', displayName: 'Nouveau', priceLabel: '100 FCFA', durationLabel: '1H', speedLabel: '2M/2M', badge: 'none', displayOrder: settings.plans.length + 1 }])} 
               className="w-full border-2 border-dashed border-slate-200 text-slate-400 font-bold py-4 rounded-xl hover:border-primary/50 hover:text-primary transition-all flex items-center justify-center gap-2">
                <Plus size={18} /> Ajouter un forfait
             </button>
          </div>
        )}

        {/* PAYMENT TAB */}
        {activeTab === 'payment' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
             <h2 className="font-semibold text-lg border-b pb-2 flex items-center gap-2">
                <CreditCard size={18} className="text-primary"/> Configuration Paiement
             </h2>
             <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex gap-3 text-amber-800 text-xs shadow-sm">
                <div className="pt-0.5">💡</div>
                <p>Le paiement direct permet à vos clients d'acheter des tickets automatiquement sans intervention manuelle.</p>
             </div>
             <div className="space-y-4">
                <div>
                   <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Passerelle (Agrégateur)</label>
                   <select className="w-full border-slate-200 border p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer" value={settings.payment.aggregator} onChange={(e) => updatePayment({ aggregator: e.target.value as any })}>
                     <option value="none">⚠️ Désactivé (Vente physique uniquement)</option>
                     <option value="MoailteStore">MoailteStore (CFA)</option>
                     <option value="FedaPay">FedaPay (CFA)</option>
                     <option value="Cinay">Cinay Pay</option>
                     <option value="Custom">Custom Webhook</option>
                   </select>
                </div>
                {settings.payment.aggregator !== 'none' && (
                  <div className="animate-in fade-in slide-in-from-top-1 duration-300 space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Clé API Publique (Souveraine)</label>
                      <input type="text" className="w-full border-slate-200 border p-2.5 rounded-lg text-sm font-mono focus:ring-2 focus:ring-primary/20 outline-none" placeholder="pk_live_..." value={settings.payment.apiKey} onChange={(e) => updatePayment({ apiKey: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Client ID (Optionnel)</label>
                      <input type="text" className="w-full border-slate-200 border p-2.5 rounded-lg text-sm font-mono focus:ring-2 focus:ring-primary/20 outline-none" placeholder="ID Client" value={settings.payment.clientId} onChange={(e) => updatePayment({ clientId: e.target.value })} />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 italic px-1">Ces informations sont nécessaires pour l'auto-génération des liens de paiement Moailte Store.</p>
                  </div>
                )}
             </div>
          </div>
        )}
      </div>

      {/* STICKY FOOTER ACTIONS */}
      <div className="p-6 border-t bg-white shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.03)] space-y-3">
         <div className="flex gap-4 mb-4">
            <button 
               onClick={handleExportZip}
               className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
            >
               <Download size={18} /> Télécharger ZIP
            </button>
            <button 
               onClick={handleSaveCloud}
               disabled={settings.deploymentStatus === 'loading'}
               className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
               {settings.deploymentStatus === 'loading' ? (
                  <Loader2 size={18} className="animate-spin" />
               ) : settings.deploymentStatus === 'success' ? (
                  <Check size={18} />
               ) : (
                  <Cloud size={18} />
               )}
               {settings.deploymentStatus === 'loading' ? 'Envoi...' : 'Déployer Cloud'}
            </button>
         </div>

         {settings.deploymentStatus === 'success' && settings.publicUrl && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-4 animate-in fade-in slide-in-from-top-4 duration-500">
               <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm mb-2">
                  <Globe size={16} /> Portails en ligne !
               </div>
               <div className="flex bg-white border border-emerald-200 rounded-lg overflow-hidden mb-2">
                  <input 
                     type="text" 
                     readOnly 
                     value={settings.publicUrl} 
                     className="flex-1 text-xs p-2 bg-transparent outline-none text-slate-600"
                  />
                  <button 
                     onClick={() => {
                        navigator.clipboard.writeText(settings.publicUrl!);
                        alert("URL copiée !");
                     }}
                     className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-3 transition-colors"
                     title="Copier l'URL"
                  >
                     <Copy size={14} />
                  </button>
               </div>
               <p className="text-[10px] text-emerald-600 font-medium">
                  Utilisez cette URL dans WinBox comme "External Hotspot".
               </p>
               <a 
                  href={settings.publicUrl} 
                  target="_blank" 
                  className="mt-3 flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline"
               >
                  Voir le portail <ExternalLink size={12} />
               </a>
            </div>
         )}
      </div>
    </div>
  );
};

const TabBtn = ({ icon, label, active, onClick }: { icon: ReactNode; label: string; active: boolean; onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all
      ${active ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
  >
    {icon} {label}
  </button>
);

const FeatureToggle = ({ checked, icon, label, onChange }: { checked: boolean; icon: ReactNode; label: string; onChange: (checked: boolean) => void }) => (
  <label className={`flex items-center gap-3 rounded-xl border p-3 transition ${checked ? 'border-primary/30 bg-primary/5' : 'border-slate-200 bg-white'}`}>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
    />
    <span className="text-slate-500">{icon}</span>
    <span className="text-sm font-medium text-slate-700">{label}</span>
  </label>
);

const BadgeTypeCard = ({ title, value, tone }: { title: string; value: string; tone: 'slate' | 'orange' | 'violet' | 'green' }) => {
  const tones = {
    slate: 'border-slate-200 bg-slate-50 text-slate-600',
    orange: 'border-orange-200 bg-orange-50 text-orange-700',
    violet: 'border-violet-200 bg-violet-50 text-violet-700',
    green: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  };

  return (
    <div className={`rounded-xl border px-3 py-2 text-center ${tones[tone]}`}>
      <div className="text-[10px] font-bold uppercase tracking-[0.18em]">{value}</div>
      <div className="mt-1 text-xs font-semibold">{title}</div>
    </div>
  );
};
