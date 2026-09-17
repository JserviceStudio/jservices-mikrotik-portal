import { Copy, Eye, Loader2, Search, Shield, Terminal, X } from 'lucide-react';
import {
  getAdminVpnAllocationId,
  labelForAdminUser,
  useAdminVpnAssistance,
} from '../../hooks/useAdminVpnAssistance';
import type { AdminUserSummary } from '../../utils/api';

type Props = {
  token?: string | null;
  onClose: () => void;
};

const statusBadge = (value?: string | null) => {
  const normalized = String(value || 'UNKNOWN').toUpperCase();
  const tone =
    normalized === 'CONNECTED' || normalized === 'ACTIVE'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
      : normalized === 'DISCONNECTED' || normalized === 'OFFLINE'
        ? 'border-amber-200 bg-amber-50 text-amber-700'
        : 'border-slate-200 bg-slate-50 text-slate-600';
  return <span className={`rounded border px-2 py-0.5 text-[10px] font-bold ${tone}`}>{normalized}</span>;
};

export function AdminVpnAssistancePanel({ token, onClose }: Props) {
  const vm = useAdminVpnAssistance(token);

  return (
    <div className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm">
      <div className="absolute inset-4 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded bg-slate-900 text-white">
                <Shield size={18} />
              </div>
              <div>
                <h1 className="text-sm font-black uppercase tracking-wide text-slate-900">Assistance VPN admin</h1>
                <p className="text-xs text-slate-500">Recherche client, slot exact, script frais par allocation.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded border border-slate-200 text-slate-500 hover:bg-slate-50"
              title="Fermer"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-[360px_1fr]">
            <aside className="flex min-h-0 flex-col border-r border-slate-200 bg-slate-50">
              <div className="border-b border-slate-200 p-4">
                <div className="flex gap-2">
                  <input
                    value={vm.search}
                    onChange={(event) => vm.setSearch(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') void vm.runSearch();
                    }}
                    placeholder="Email, nom, client..."
                    className="min-w-0 flex-1 rounded border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => void vm.runSearch()}
                    className="grid h-10 w-10 place-items-center rounded bg-slate-900 text-white disabled:opacity-60"
                    disabled={vm.loading}
                    title="Rechercher"
                  >
                    {vm.loading ? <Loader2 size={17} className="animate-spin" /> : <Search size={17} />}
                  </button>
                </div>
                {vm.error && <p className="mt-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{vm.error}</p>}
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-3">
                {vm.users.length === 0 ? (
                  <div className="rounded border border-dashed border-slate-300 bg-white p-4 text-xs text-slate-500">
                    Lancez une recherche pour afficher les clients avec leurs slots VPN.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {vm.users.map((user: AdminUserSummary) => {
                      const userVpns =
                        user.vpns ||
                        (user.resources || []).filter((resource) => String(resource.type || '').toUpperCase() === 'VPN');
                      const active = vm.selectedUser?.id === user.id;
                      return (
                        <button
                          type="button"
                          key={user.id}
                          onClick={() => vm.selectUser(user)}
                          className={`w-full rounded border p-3 text-left transition ${
                            active ? 'border-slate-900 bg-white shadow-sm' : 'border-slate-200 bg-white hover:border-slate-400'
                          }`}
                        >
                          <div className="truncate text-sm font-bold text-slate-900">{labelForAdminUser(user)}</div>
                          <div className="mt-1 truncate text-xs text-slate-500">{user.email || user.manager_id || user.id}</div>
                          <div className="mt-2 flex items-center justify-between">
                            {statusBadge(user.status)}
                            <span className="text-[10px] font-bold uppercase text-slate-400">{userVpns.length} VPN</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </aside>

            <main className="min-h-0 overflow-y-auto p-5">
              {!vm.selectedUser ? (
                <div className="grid h-full place-items-center text-sm text-slate-500">
                  Selectionnez un client pour ouvrir ses slots VPN.
                </div>
              ) : (
                <div className="space-y-4">
                  <section className="rounded border border-slate-200 bg-white p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-base font-black text-slate-900">{labelForAdminUser(vm.selectedUser)}</h2>
                        <p className="text-xs text-slate-500">{vm.selectedUser.email || vm.selectedUser.manager_id || vm.selectedUser.id}</p>
                      </div>
                      {statusBadge(vm.selectedUser.status)}
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                      {vm.vpns.map((vpn) => {
                        const allocationId = getAdminVpnAllocationId(vpn);
                        const active = vm.selectedAllocationId === allocationId;
                        return (
                          <button
                            type="button"
                            key={allocationId}
                            onClick={() => {
                              vm.setSelectedAllocationId(allocationId);
                              void vm.loadBundle(allocationId, false);
                            }}
                            className={`rounded border p-3 text-left ${active ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-400'}`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="truncate text-sm font-bold text-slate-900">
                                {vpn.locked_router_identity || vpn.name || 'Slot VPN'}
                              </span>
                              {statusBadge(vpn.tunnel_status || vpn.status)}
                            </div>
                            <div className="mt-2 space-y-1 text-xs text-slate-500">
                              <p className="truncate">alloc: {allocationId}</p>
                              <p className="truncate">serial: {vpn.locked_router_serial || 'non lie'}</p>
                              <p className="truncate">ip: {vpn.router_tunnel_ip || 'n/a'}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  <section className="rounded border border-slate-200 bg-white">
                    <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Terminal size={17} />
                        <h2 className="text-sm font-black text-slate-900">Bundle d'assistance</h2>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => void vm.loadBundle(vm.selectedAllocationId, true)}
                          disabled={!vm.selectedAllocationId || vm.bundleLoading}
                          className="inline-flex items-center gap-2 rounded border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                        >
                          {vm.bundleLoading ? <Loader2 size={14} className="animate-spin" /> : <Eye size={14} />}
                          Charger script complet
                        </button>
                        <button
                          type="button"
                          onClick={() => void vm.copyScript()}
                          disabled={!vm.scriptText}
                          className="inline-flex items-center gap-2 rounded bg-slate-900 px-3 py-2 text-xs font-bold text-white disabled:opacity-60"
                        >
                          <Copy size={14} />
                          Copier
                        </button>
                      </div>
                    </div>

                    {vm.bundle ? (
                      <div className="grid gap-0 lg:grid-cols-[320px_1fr]">
                        <div className="border-b border-slate-200 p-4 text-xs lg:border-b-0 lg:border-r">
                          <div className="space-y-3">
                            <p><span className="font-bold text-slate-900">Transport:</span> {vm.bundle.active_transport || 'n/a'}</p>
                            <p><span className="font-bold text-slate-900">Bundle:</span> {vm.bundle.bundle_version || 'n/a'}</p>
                            <p><span className="font-bold text-slate-900">Endpoint:</span> {vm.bundle.endpoint?.host || vm.bundle.public_host || 'n/a'}:{vm.bundle.endpoint?.port || 'n/a'}</p>
                            <p><span className="font-bold text-slate-900">Peer:</span> {vm.bundle.peer_public_key_fingerprint || 'n/a'}</p>
                            <p><span className="font-bold text-slate-900">Tunnel:</span> {vm.bundle.tunnel?.status || 'n/a'} / {vm.bundle.tunnel?.router_tunnel_ip || 'n/a'}</p>
                            <p><span className="font-bold text-slate-900">Script:</span> {vm.bundle.script.revealed ? 'complet charge' : 'apercu masque'}</p>
                          </div>
                          {vm.copyState && <p className="mt-4 rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-700">{vm.copyState}</p>}
                        </div>
                        <pre className="max-h-[58vh] overflow-auto bg-slate-950 p-4 text-xs leading-relaxed text-slate-100">
                          {vm.scriptText || 'Aucun script disponible pour ce slot.'}
                        </pre>
                      </div>
                    ) : (
                      <div className="p-6 text-sm text-slate-500">
                        {vm.bundleLoading ? 'Chargement du bundle...' : 'Selectionnez un slot VPN.'}
                      </div>
                    )}
                  </section>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
