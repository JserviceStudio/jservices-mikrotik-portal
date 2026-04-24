import { useState, type ReactNode, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { Settings, Palette, Ticket, CreditCard, Download, Trash2, Plus, Phone, Cloud, Check, Loader2, Copy, Globe, ExternalLink, Layers, ChevronUp, ChevronDown, Sparkles, QrCode, FlaskConical, Sun, Moon, Monitor, ShieldCheck, X } from 'lucide-react';
import { exportTemplateZip } from '../../utils/exportZip';
import { deployToCloud } from '../../utils/api';
import { TEMPLATE_DEFINITIONS } from '../../core/templates';
import { ImageCropper } from './ImageCropper';

export const Sidebar = () => {
  const { settings, setTemplateId, updateBranding, updateFeatures, updateKyc, updatePayment, updateContact, setPlans, setDeploymentStatus, setPublicUrl } = useStore();
  const [activeTab, setActiveTab] = useState('branding');
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
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
      <div className="flex-1 p-6 overflow-y-auto bg-slate-50/30 no-scrollbar pb-32">
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
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Logo</label>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <div onClick={() => updateBranding({ logoPreset: 'jservices', logoUrl: '' })} className={`shrink-0 w-12 h-12 border-2 rounded-lg cursor-pointer overflow-hidden flex items-center justify-center bg-white ${settings.branding.logoPreset === 'jservices' ? 'border-primary' : 'border-slate-100 hover:border-slate-200'}`}>
                      <img src="/portal-editor/assets/presets/jservices.png" className="max-w-[80%] max-h-[80%] object-contain" />
                    </div>
                    <div onClick={() => updateBranding({ logoPreset: 'jconnect', logoUrl: '' })} className={`shrink-0 w-12 h-12 border-2 rounded-lg cursor-pointer overflow-hidden flex items-center justify-center bg-[#0047AB] ${settings.branding.logoPreset === 'jconnect' ? 'border-primary' : 'border-slate-100 hover:border-slate-200'}`}>
                      <img src="/portal-editor/assets/presets/jconnect.png" className="max-w-[80%] max-h-[80%] object-contain" />
                    </div>
                    <div 
                      onClick={() => {
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
                      }}
                      className="shrink-0 w-12 h-12 border-2 border-dashed rounded-lg cursor-pointer flex flex-col items-center justify-center text-[8px] font-bold text-slate-400 border-slate-100 hover:border-slate-200"
                    >
                      <Download size={14} className="mb-0.5 rotate-180" /> UPLOAD
                    </div>
                  </div>
                  {imageToCrop && <ImageCropper image={imageToCrop} onCropComplete={(cropped) => { updateBranding({ logoPreset: 'none', logoUrl: cropped }); setImageToCrop(null); }} onCancel={() => setImageToCrop(null)} />}
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Couleur 1</label>
                    <div className="flex gap-2">
                       <input type="color" value={settings.branding.primaryColor} onChange={(e) => updateBranding({ primaryColor: e.target.value })} className="h-10 w-12 p-1 bg-white border border-slate-200 rounded-lg cursor-pointer" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Couleur 2</label>
                    <div className="flex gap-2">
                       <input type="color" value={settings.branding.secondaryColor} onChange={(e) => updateBranding({ secondaryColor: e.target.value })} className="h-10 w-12 p-1 bg-white border border-slate-200 rounded-lg cursor-pointer" />
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
                  <input type="text" value={settings.contact.whatsapp} onChange={(e) => updateContact({ whatsapp: e.target.value })} className="w-full border-slate-200 border p-2.5 rounded-lg text-sm" placeholder="ex: 229XXXXXXXX" />
               </div>
               <div>
                  <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Adresse Support</label>
                  <textarea value={settings.contact.address} onChange={(e) => updateContact({ address: e.target.value })} className="min-h-[88px] w-full resize-none border-slate-200 border p-3 rounded-lg text-sm" />
               </div>

               <div className="space-y-2 mb-4">
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Thème Portail</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['auto', 'light', 'dark'] as const).map((m) => (
                      <button key={m} onClick={() => updateFeatures({ themeMode: m })} className={`flex flex-col items-center gap-2 p-3 border rounded-xl transition-all ${settings.features.themeMode === m ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 bg-white'}`}>
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
                  <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2 mb-4"><ShieldCheck size={18} className="text-primary" /> ARCEP KYC</h3>
                  <div className="space-y-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                     <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">Activer KYC</span>
                        <input type="checkbox" checked={settings.features.kyc.enabled} onChange={(e) => updateKyc({ enabled: e.target.checked })} />
                     </div>
                     {settings.features.kyc.enabled && (
                        <div className="space-y-3 animate-in fade-in">
                           <input type="text" value={settings.features.kyc.countryCode} onChange={(e) => updateKyc({ countryCode: e.target.value })} className="w-full border-slate-200 border p-2.5 rounded-xl text-sm" placeholder="+229" />
                           <input type="number" value={settings.features.kyc.phoneLength} onChange={(e) => updateKyc({ phoneLength: parseInt(e.target.value) || 0 })} className="w-full border-slate-200 border p-2.5 rounded-xl text-sm" placeholder="Longueur tel" />
                        </div>
                     )}
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'plans' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300">
             <div className="flex items-center justify-between border-b pb-2">
               <h2 className="font-semibold text-lg">Configurer les Tarifs</h2>
               <button type="button" onClick={autoAssignBadges} className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 hover:bg-amber-100">
                 <Sparkles size={14} /> Auto-Badges
               </button>
             </div>
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
                     <input type="text" placeholder="Profil MikroTik" className="w-full border-b border-slate-100 p-1 text-sm font-medium" value={p.profileName} onChange={(e) => updatePlan(idx, (plan) => ({ ...plan, profileName: e.target.value }))} />
                     <input type="text" placeholder="Nom Affiché" className="w-full border-b border-slate-100 p-1 text-sm font-bold text-slate-700" value={p.displayName} onChange={(e) => updatePlan(idx, (plan) => ({ ...plan, displayName: e.target.value }))} />
                     <input type="text" placeholder="Prix" className="w-full border-b border-slate-100 p-1 text-sm" value={p.priceLabel} onChange={(e) => updatePlan(idx, (plan) => ({ ...plan, priceLabel: e.target.value }))} />
                     <div className="flex gap-4">
                        <input type="text" placeholder="Vitesse" className="flex-1 border-b border-slate-100 p-1 text-xs" value={p.speedLabel} onChange={(e) => updatePlan(idx, (plan) => ({ ...plan, speedLabel: e.target.value }))} />
                        <input type="text" placeholder="Durée" className="flex-1 border-b border-slate-100 p-1 text-xs" value={p.durationLabel} onChange={(e) => updatePlan(idx, (plan) => ({ ...plan, durationLabel: e.target.value }))} />
                     </div>
                   </div>
                </div>
             ))}
             <button onClick={() => setPlans([...settings.plans, { id: Math.random().toString(36).slice(2, 11), profileName: '1H', displayName: 'Nouveau', priceLabel: '100 FCFA', durationLabel: '1H', speedLabel: '2M/2M', badge: 'none', displayOrder: settings.plans.length + 1 }])} className="w-full border-2 border-dashed border-slate-200 text-slate-400 font-bold py-4 rounded-xl hover:border-primary/50 flex items-center justify-center gap-2"><Plus size={18} /> Ajouter</button>
          </div>
        )}

        {activeTab === 'payment' && (
          <div className="space-y-6">
             <h2 className="font-semibold text-lg border-b pb-2 flex items-center gap-2"><CreditCard size={18} className="text-primary"/> Paiement</h2>
             <div className="space-y-4">
                <select className="w-full border border-slate-200 p-2.5 rounded-lg text-sm" value={settings.payment.aggregator} onChange={(e) => updatePayment({ aggregator: e.target.value as any })}>
                  <option value="none">Désactivé</option>
                  <option value="FedaPay">FedaPay</option>
                  <option value="KKiaPay">KKiaPay</option>
                </select>
                <input type="text" className="w-full border border-slate-200 p-2.5 rounded-lg text-sm" placeholder="Clé API Publique" value={settings.payment.apiKey} onChange={(e) => updatePayment({ apiKey: e.target.value })} />
             </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t bg-white shrink-0 shadow-lg flex gap-4">
          <button onClick={handleExportZip} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
             <Download size={18} /> Télécharger ZIP
          </button>
          <button onClick={handleSaveCloud} disabled={settings.deploymentStatus === 'loading'} className="flex-1 bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50">
             {settings.deploymentStatus === 'loading' ? <Loader2 size={18} className="animate-spin" /> : <Cloud size={18} />}
             Déployer Cloud
          </button>
      </div>
    </div>
  );
};

const TabBtn = ({ icon, label, active, onClick }: { icon: ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button onClick={onClick} className={`flex-1 py-4 flex flex-col items-center gap-1.5 transition-all border-b-2 ${active ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-slate-400'}`}>
    {icon}
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

const FeatureToggle = ({ checked, icon, label, onChange }: { checked: boolean, icon: ReactNode, label: string, onChange: (v: boolean) => void }) => (
  <label className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-white/5 rounded-2xl cursor-pointer hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200">
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
    <div className="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all shadow-inner relative"></div>
    <span className="text-slate-500">{icon}</span>
    <span className="text-sm font-medium text-slate-700">{label}</span>
  </label>
);
