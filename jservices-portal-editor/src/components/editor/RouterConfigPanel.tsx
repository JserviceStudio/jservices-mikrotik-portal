/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { AlertTriangle, Server, Wifi, RefreshCw, Send, CheckCircle2, Copy } from 'lucide-react';
import { declareNas, fetchWalledGardenScript, readPortalEditorToken, fetchPortalBootstrap } from '../../utils/api';
import { buildTiketMomoPaymentUrl } from '../../utils/mikhmoai';

export const RouterConfigPanel = () => {
  const { routerState, rawBootstrapData, settings } = useStore();
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
  const [copyMessage, setCopyMessage] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  useEffect(() => {
    // Pré-remplir avec rawBootstrapData
    if (rawBootstrapData) {
      const facts = rawBootstrapData.router_facts || {};
      const nas = rawBootstrapData.nas_facts || {};
      const profiles = Array.isArray(nas.profiles) ? nas.profiles : (Array.isArray(rawBootstrapData.profiles) ? rawBootstrapData.profiles : []);
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
          timelimit: p['session-timeout'] || p['limit-uptime'] || p.timelimit || '',
          datalimit: p['limit-bytes-total'] || p.datalimit || p.data_limit || '',
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

  const hasStoreSlug = Boolean(rawBootstrapData?.store_slug && rawBootstrapData.store_slug !== 'unknown');

  const handleDeclare = async () => {
    if (!hasStoreSlug) return;
    setIsSubmitting(true);
    setDeclarationResult(null);
    try {
      const payload = {
        declaration_id: crypto.randomUUID(),
        declared_at: new Date().toISOString(),
        store_slug: rawBootstrapData?.store_slug,
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
        // Contrat du schéma : `data_limit` (pas `datalimit`, qui passerait sans erreur mais serait
        // ignoré) et prix numérique ou null — une chaîne vide est refusée par la validation.
        profiles: formData.profiles.map((p: any) => ({
          name: String(p.name || '').trim(),
          price: p.price === '' || p.price === null || p.price === undefined ? null : Number(p.price),
          timelimit: p.timelimit || null,
          data_limit: p.datalimit || null,
          validity: p.validity || null,
          voucher_format: p.voucher_format,
          commercial: p.commercial !== false,
        }))
      };
      
      const res = await declareNas(payload, readPortalEditorToken() || undefined);
      // Le backend répond 200 même quand il REFUSE (contrat déclaration NAS) : le statut tranche.
      const statut = res.data?.status;
      if (statut === 'REFUSED') {
        setDeclarationResult({ type: 'error', message: `${res.data?.message || 'Déclaration refusée.'}${res.data?.code ? ` (${res.data.code})` : ''}` });
      } else {
        const nbChangements = Array.isArray(res.data?.changes) ? res.data.changes.length : 0;
        const libelle = statut === 'RECONCILED'
          ? `Déclaration enregistrée : ${nbChangements} correction(s) appliquée(s).`
          : statut === 'ALIGNED' ? 'Déclaration enregistrée : tout est déjà conforme.' : 'Déclaration enregistrée.';
        setDeclarationResult({ type: 'success', data: { status: libelle } });
      }
    } catch (e: any) {
      setDeclarationResult({ type: 'error', message: e.message || 'Erreur' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyMessage('Copié');
      setTimeout(() => setCopyMessage(''), 2000);
    } catch {
      setCopyMessage('Erreur presse-papier');
      setTimeout(() => setCopyMessage(''), 2000);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetchPortalBootstrap(true, readPortalEditorToken() || undefined);
      useStore.getState().setRawBootstrapData(res);
      useStore.getState().setRouterState(res.router_state || { mode: 'UNKNOWN', source: 'NONE' });
    } catch {
      console.error("Erreur de rafraichissement");
    } finally {
      setIsRefreshing(false);
    }
  };

  const isOnline = routerState.mode === 'ONLINE';
  const showManualForm = !isOnline;

  const hasInvalidProfiles = formData.profiles.some((p: any) => 
    !p.name.trim() || 
    (p.price !== null && p.price !== '' && Number(p.price) < 0) || 
    (p.voucher_format !== 'up' && p.voucher_format !== 'vc')
  );
  const hasInvalidNas = !formData.declared_nas_name && !formData.hotspot_servers;
  const isFormInvalid = hasInvalidProfiles || hasInvalidNas;

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
                 {isOnline && <button onClick={handleRefresh} disabled={isRefreshing} className="ml-4 text-xs bg-white text-emerald-700 px-2 py-1 rounded border border-emerald-200 hover:bg-emerald-100">{isRefreshing ? '...' : 'Actualiser'}</button>}
             </p>
             <p className="text-xs opacity-75 mt-0.5">
                Source: {routerState.source === 'ROUTER_LIVE' ? 'Lecture directe' : routerState.source === 'DATABASE_CACHE' ? 'Données enregistrées' : routerState.source === 'NAS_DECLARATION' ? 'Dernière déclaration' : routerState.source === 'NONE' ? 'Aucune' : routerState.source} 
                {routerState.read_at && ` • Vu le: ${new Date(routerState.read_at).toLocaleString('fr-FR')}`}
                {routerState.reason && ` • Motif: ${routerState.reason === 'TIKETMOMO_NOT_ELIGIBLE' ? 'Non éligible' : routerState.reason === 'TIKETMOMO_NO_STORE' ? 'Pas de boutique' : routerState.reason === 'ROUTER_NOT_FOUND' ? 'Routeur introuvable' : routerState.reason}`}
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
             <div className="col-span-2 flex flex-col">
               <input type="text" placeholder="Serveurs Hotspot (séparés par virgule)" disabled={isOnline}
                 value={formData.hotspot_servers} onChange={e => setFormData({...formData, hotspot_servers: e.target.value})}
                 className={`p-2 border rounded-lg text-xs ${hasInvalidNas && showManualForm ? 'border-red-500' : ''}`} />
               {hasInvalidNas && showManualForm && <span className="text-[10px] text-red-500 mt-1">Au moins un serveur hotspot ou un nom NAS est requis</span>}
             </div>
           </div>

           <div className="pt-2">
             <p className="text-xs font-bold text-slate-500 mb-2">Profils {showManualForm ? 'déclarés' : 'lus'} ({formData.profiles.length})</p>
             <div className="space-y-3">
             {formData.profiles.map((p: any, idx: number) => {
                const paymentUrl = buildTiketMomoPaymentUrl({
                  profileName: p.name,
                  priceLabel: p.price ? p.price.toString() : '',
                  durationLabel: p.timelimit,
                  dataLimit: p.datalimit
                }, settings?.payment?.apiKey || '', settings?.payment?.gatewayUrl);
                
                const isNameInvalid = !p.name.trim();
                const isPriceInvalid = p.price !== null && p.price !== '' && Number(p.price) < 0;
                const isFormatInvalid = p.voucher_format !== 'up' && p.voucher_format !== 'vc';
                
                return (
                <div key={idx} className="flex flex-col gap-2 p-3 border rounded-lg bg-slate-50 relative">
                   <div className="flex flex-col gap-2">
                     <div className="flex flex-col">
                       <input type="text" value={p.name} disabled={!showManualForm} onChange={e => {
                         const newP = [...formData.profiles];
                         newP[idx] = { ...newP[idx], name: e.target.value };
                         setFormData({...formData, profiles: newP});
                       }} className={`p-2 border rounded-lg text-xs flex-1 ${isNameInvalid && showManualForm ? 'border-red-500' : ''}`} placeholder="Nom du profil *" />
                       {isNameInvalid && showManualForm && <span className="text-[10px] text-red-500 mt-1">Requis</span>}
                     </div>
                     <div className="grid grid-cols-2 gap-2">
                       <div className="flex flex-col">
                         <input type="number" value={p.price || ''} disabled={!showManualForm} onChange={e => {
                           const newP = [...formData.profiles];
                           newP[idx] = { ...newP[idx], price: e.target.value ? Number(e.target.value) : null };
                           setFormData({...formData, profiles: newP});
                         }} className={`p-2 border rounded-lg text-xs ${isPriceInvalid && showManualForm ? 'border-red-500' : ''}`} placeholder="Prix (ex: 500)" />
                         {isPriceInvalid && showManualForm && <span className="text-[10px] text-red-500 mt-1">≥ 0</span>}
                       </div>
                       <div className="flex flex-col">
                         <input type="text" value={p.timelimit || ''} disabled={!showManualForm} onChange={e => {
                           const newP = [...formData.profiles];
                           newP[idx] = { ...newP[idx], timelimit: e.target.value };
                           setFormData({...formData, profiles: newP});
                         }} className="p-2 border rounded-lg text-xs" placeholder="Temps (ex: 2h)" />
                       </div>
                       <div className="flex flex-col">
                         <input type="text" value={p.datalimit || ''} disabled={!showManualForm} onChange={e => {
                           const newP = [...formData.profiles];
                           newP[idx] = { ...newP[idx], datalimit: e.target.value };
                           setFormData({...formData, profiles: newP});
                         }} className="p-2 border rounded-lg text-xs" placeholder="Data (ex: 1G)" />
                       </div>
                       <div className="flex flex-col">
                         <input type="text" value={p.validity || ''} disabled={!showManualForm} onChange={e => {
                           const newP = [...formData.profiles];
                           newP[idx] = { ...newP[idx], validity: e.target.value };
                           setFormData({...formData, profiles: newP});
                         }} className="p-2 border rounded-lg text-xs" placeholder="Validité (ex: 1d)" />
                       </div>
                       <div className="flex flex-col col-span-2">
                         <select value={p.voucher_format} disabled={!showManualForm} onChange={e => {
                           const newP = [...formData.profiles];
                           newP[idx] = { ...newP[idx], voucher_format: e.target.value };
                           setFormData({...formData, profiles: newP});
                         }} className={`p-2 border rounded-lg text-xs bg-white ${isFormatInvalid && showManualForm ? 'border-red-500' : ''}`}>
                           <option value="up">User/Pass (UP)</option>
                           <option value="vc">Voucher (VC)</option>
                         </select>
                         {isFormatInvalid && showManualForm && <span className="text-[10px] text-red-500 mt-1">Format requis</span>}
                       </div>
                     </div>
                     {showManualForm && (
                       <button onClick={() => {
                         const newP = formData.profiles.filter((_: any, i: number) => i !== idx);
                         setFormData({...formData, profiles: newP});
                       }} className="absolute top-2 right-2 text-red-500 p-1.5 text-xs font-bold border rounded-lg bg-white shadow-sm">X</button>
                     )}
                   </div>
                   {paymentUrl && (
                     <div className="flex flex-col gap-1 mt-2 p-2 bg-white rounded-lg border border-blue-100">
                       <span className="text-[10px] font-bold text-blue-800">Lien de paiement</span>
                       <div className="flex items-center gap-2">
                         <input readOnly value={paymentUrl} className="flex-1 p-1.5 bg-slate-50 border rounded text-[10px] text-slate-500 font-mono overflow-hidden text-ellipsis" />
                         <button onClick={() => copyToClipboard(paymentUrl)} className="text-[10px] px-2 py-1 bg-blue-600 text-white font-bold rounded hover:bg-blue-700">
                           Copier
                         </button>
                       </div>
                     </div>
                   )}
                </div>
             )})}
             </div>
             {showManualForm && (
               <button onClick={() => setFormData({...formData, profiles: [...formData.profiles, { name: '', price: null, timelimit: '', datalimit: '', validity: '', voucher_format: 'up' }]})} 
                 className="text-xs font-bold text-blue-600 mt-3 block w-full text-center p-2 border border-dashed border-blue-300 rounded-lg hover:bg-blue-50">
                 + Ajouter un profil
               </button>
             )}
           </div>

           {!hasStoreSlug && <div className="text-xs text-red-600 p-2 bg-red-50 border rounded-lg">Boutique introuvable, rechargez l'éditeur.</div>}
           {showManualForm && (
             <button onClick={handleDeclare} disabled={isSubmitting || !hasStoreSlug || isFormInvalid} className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 mt-4 hover:bg-blue-700 disabled:opacity-50">
               {isSubmitting ? <RefreshCw className="animate-spin" size={14} /> : <Send size={14} />}
               Envoyer la déclaration NAS
             </button>
           )}
           
           {declarationResult && (
             <div className={`p-3 mt-3 rounded-xl text-xs font-bold flex gap-2 ${declarationResult.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {declarationResult.type === 'success' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                {declarationResult.type === 'success' ? 
                  declarationResult.data?.status :
                  `Refusé : ${declarationResult.message}`}
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
                {copyMessage && <span className="text-[10px] text-emerald-600 font-bold ml-1">{copyMessage}</span>}
             </div>
          )}
        </div>
      </section>
    </div>
  );
};
