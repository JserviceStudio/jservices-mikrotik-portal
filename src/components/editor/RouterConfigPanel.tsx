/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { AlertTriangle, Server, Wifi, RefreshCw, Send, CheckCircle2, Copy } from 'lucide-react';
import { declareNas, fetchWalledGardenScript, readPortalEditorToken } from '../../utils/api';

export const RouterConfigPanel = () => {
  const { routerState, rawBootstrapData } = useStore();
  const [formData, setFormData] = useState<any>({
    serial: '', identity: '', model: '', routeros_version: '', mac: '',
    declared_nas_name: '', local_ip: '', dns_name: '', hotspot_servers: '',
    walled_garden_present: false,
    profiles: []
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [declarationResult, setDeclarationResult] = useState<any>(null);
  const [wgScript, setWgScript] = useState<any>(null);
  const [loadingWg, setLoadingWg] = useState(false);
  const [wgError, setWgError] = useState('');
  
  useEffect(() => {
    // Pré-remplir avec rawBootstrapData
    if (rawBootstrapData) {
      const facts = rawBootstrapData.router_facts || {};
      const nas = rawBootstrapData.nas_facts || {};
      const profiles = Array.isArray(rawBootstrapData.profiles) ? rawBootstrapData.profiles : [];
      setFormData({
        serial: facts.serial || '',
        identity: facts.identity || '',
        model: facts.model || '',
        routeros_version: facts.version || facts.routeros_version || '',
        mac: facts.mac || '',
        declared_nas_name: nas.declared_nas_name || '',
        local_ip: nas.local_ip || '',
        dns_name: nas.dns_name || '',
        hotspot_servers: Array.isArray(nas.hotspot_servers) ? nas.hotspot_servers.join(', ') : '',
        walled_garden_present: nas.walled_garden_present || false,
        profiles: profiles.map((p: any) => ({
          name: p.name || p['.id'] || '',
          price: p.price || null,
          timelimit: p['session-timeout'] || p['limit-uptime'] || '',
          data_limit: p['limit-bytes-total'] || '',
          validity: p.validity || '',
          voucher_format: p.voucher_format || 'up',
          commercial: p.commercial !== false
        }))
      });
    }
  }, [rawBootstrapData]);

  const loadWalledGarden = async () => {
    setLoadingWg(true);
    setWgError('');
    try {
      const res = await fetchWalledGardenScript(readPortalEditorToken() || undefined);
      setWgScript(res.data);
    } catch (e: any) {
      setWgError(e.message || 'Erreur lors de la récupération.');
    } finally {
      setLoadingWg(false);
    }
  };

  const handleDeclare = async () => {
    setIsSubmitting(true);
    setDeclarationResult(null);
    try {
      const payload = {
        declaration_id: crypto.randomUUID(),
        declared_at: new Date().toISOString(),
        store_slug: rawBootstrapData?.store_slug || 'unknown',
        allocation_id: routerState.allocation_id,
        router: {
          serial: formData.serial,
          identity: formData.identity,
          model: formData.model,
          routeros_version: formData.routeros_version,
          mac: formData.mac
        },
        nas: {
          declared_nas_name: formData.declared_nas_name,
          hotspot_servers: formData.hotspot_servers.split(',').map((s: string) => s.trim()).filter(Boolean),
          local_ip: formData.local_ip,
          dns_name: formData.dns_name,
          walled_garden_present: formData.walled_garden_present
        },
        profiles: formData.profiles
      };
      
      const res = await declareNas(payload, readPortalEditorToken() || undefined);
      setDeclarationResult({ type: 'success', data: res.data });
    } catch (e: any) {
      setDeclarationResult({ type: 'error', message: e.message || 'Erreur' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const isOnline = routerState.mode === 'ONLINE';
  const showManualForm = !isOnline; // MANUAL_REQUIRED, NO_ROUTER, OFFLINE_CACHED, UNKNOWN

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300">
      <section className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b pb-2">État du Routeur</h3>
        
        {/* Banner */}
        <div className={`p-4 rounded-2xl border flex items-center gap-4 ${
          isOnline ? 'bg-emerald-50 border-emerald-200' :
          routerState.mode === 'OFFLINE_CACHED' ? 'bg-amber-50 border-amber-200' :
          'bg-red-50 border-red-200'
        }`}>
          {isOnline ? <Wifi className="text-emerald-500" size={24} /> :
           routerState.mode === 'OFFLINE_CACHED' ? <RefreshCw className="text-amber-500" size={24} /> :
           <AlertTriangle className="text-red-500" size={24} />}
          
          <div>
             <p className="font-bold text-sm">
                {isOnline ? 'En ligne' :
                 routerState.mode === 'OFFLINE_CACHED' ? 'Hors ligne (Données en cache)' :
                 routerState.mode === 'MANUAL_REQUIRED' ? 'Saisie manuelle requise' :
                 routerState.mode === 'NO_ROUTER' ? 'Aucun routeur associé' : 'État inconnu'}
             </p>
             <p className="text-xs opacity-75 mt-0.5">
                Source: {routerState.source} 
                {routerState.read_at && ` • Vu le: ${new Date(routerState.read_at).toLocaleString('fr-FR')}`}
             </p>
          </div>
        </div>

        {/* Formulaire */}
        <div className="bg-white border rounded-2xl p-4 space-y-4">
           <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
             <Server size={16} className="text-blue-600" />
             {isOnline ? 'Données lues depuis le routeur' : 'Déclaration NAS manuelle'}
           </h4>

           <div className="grid grid-cols-2 gap-3">
             <input type="text" placeholder="Numéro de série" disabled={isOnline}
               value={formData.serial} onChange={e => setFormData({...formData, serial: e.target.value})}
               className="p-2 border rounded-lg text-xs" />
             <input type="text" placeholder="Identité" disabled={isOnline}
               value={formData.identity} onChange={e => setFormData({...formData, identity: e.target.value})}
               className="p-2 border rounded-lg text-xs" />
             <input type="text" placeholder="Modèle" disabled={isOnline}
               value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})}
               className="p-2 border rounded-lg text-xs" />
             <input type="text" placeholder="Version RouterOS" disabled={isOnline}
               value={formData.routeros_version} onChange={e => setFormData({...formData, routeros_version: e.target.value})}
               className="p-2 border rounded-lg text-xs" />
             <input type="text" placeholder="Serveurs Hotspot (séparés par virgule)" disabled={isOnline}
               value={formData.hotspot_servers} onChange={e => setFormData({...formData, hotspot_servers: e.target.value})}
               className="p-2 border rounded-lg text-xs col-span-2" />
           </div>

           {showManualForm && (
             <div className="pt-2">
                <p className="text-xs font-bold text-slate-500 mb-2">Profils déclarés ({formData.profiles.length})</p>
                {formData.profiles.map((p: any, idx: number) => (
                   <div key={idx} className="flex gap-2 mb-2">
                      <input type="text" value={p.name} onChange={e => {
                        const newP = [...formData.profiles];
                        newP[idx].name = e.target.value;
                        setFormData({...formData, profiles: newP});
                      }} className="p-1.5 border rounded text-xs flex-1" placeholder="Nom du profil" />
                      <input type="text" value={p.timelimit} onChange={e => {
                        const newP = [...formData.profiles];
                        newP[idx].timelimit = e.target.value;
                        setFormData({...formData, profiles: newP});
                      }} className="p-1.5 border rounded text-xs w-20" placeholder="Temps" />
                      <select value={p.voucher_format} onChange={e => {
                        const newP = [...formData.profiles];
                        newP[idx].voucher_format = e.target.value;
                        setFormData({...formData, profiles: newP});
                      }} className="p-1.5 border rounded text-xs w-16">
                        <option value="up">UP</option>
                        <option value="vc">VC</option>
                      </select>
                      <button onClick={() => {
                        const newP = formData.profiles.filter((_: any, i: number) => i !== idx);
                        setFormData({...formData, profiles: newP});
                      }} className="text-red-500 p-1 text-xs font-bold">X</button>
                   </div>
                ))}
                <button onClick={() => setFormData({...formData, profiles: [...formData.profiles, { name: '', price: null, timelimit: '', voucher_format: 'up' }]})} 
                  className="text-xs font-bold text-blue-600 mt-2 hover:underline">
                  + Ajouter un profil
                </button>
             </div>
           )}

           {showManualForm && (
             <button onClick={handleDeclare} disabled={isSubmitting} className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 mt-4 hover:bg-blue-700 disabled:opacity-50">
               {isSubmitting ? <RefreshCw className="animate-spin" size={14} /> : <Send size={14} />}
               Envoyer la déclaration NAS
             </button>
           )}
           
           {declarationResult && (
             <div className={`p-3 mt-3 rounded-xl text-xs font-bold flex gap-2 ${declarationResult.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {declarationResult.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                {declarationResult.type === 'success' ? 
                  `Succès: ${declarationResult.data?.status || 'Réconcilié'}` : 
                  `Erreur: ${declarationResult.message}`}
             </div>
           )}
        </div>

        {/* Walled Garden */}
        <div className="bg-white border rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-800">Walled Garden (Paiements)</h4>
            <button onClick={loadWalledGarden} disabled={loadingWg} className="text-xs font-bold text-blue-600 hover:underline">
               {loadingWg ? 'Chargement...' : 'Vérifier / Générer'}
            </button>
          </div>
          
          {wgError && <p className="text-xs text-red-500">{wgError}</p>}
          
          {wgScript && (
             <div className="space-y-2 mt-2 border-t pt-3">
                <p className="text-xs text-slate-500 font-bold mb-1">Hôtes requis ({wgScript.hosts?.length || 0})</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {wgScript.hosts?.map((h: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-100 text-[10px] rounded-full border">{h}</span>
                  ))}
                </div>

                <p className="text-xs text-slate-500 font-bold mb-1">Script MikroTik</p>
                <div className="relative">
                  <textarea readOnly value={wgScript.script} className="w-full h-24 p-2 bg-slate-50 border rounded-lg text-[10px] font-mono text-slate-600 outline-none resize-none" />
                  <button onClick={() => copyToClipboard(wgScript.script)} className="absolute top-2 right-2 p-1.5 bg-white border shadow-sm rounded-md hover:bg-slate-50 text-slate-600">
                     <Copy size={12} />
                  </button>
                </div>
                
                <p className="text-xs text-slate-500 font-bold mt-3 mb-1">Commande de vérification</p>
                <div className="relative">
                  <input readOnly value='/ip hotspot walled-garden print where comment="js-portal"' className="w-full p-2 bg-slate-50 border rounded-lg text-[10px] font-mono text-slate-600 outline-none" />
                  <button onClick={() => copyToClipboard('/ip hotspot walled-garden print where comment="js-portal"')} className="absolute top-1/2 -translate-y-1/2 right-2 p-1.5 bg-white border shadow-sm rounded-md hover:bg-slate-50 text-slate-600">
                     <Copy size={12} />
                  </button>
                </div>
             </div>
          )}
        </div>
      </section>
    </div>
  );
};
