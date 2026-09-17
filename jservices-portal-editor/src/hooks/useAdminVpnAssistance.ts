import { useMemo, useState } from 'react';
import {
  fetchAdminAccounts,
  fetchAdminAssistanceBundle,
  type AdminAssistanceBundle,
  type AdminUserSummary,
  type AdminVpnResource,
} from '../utils/api';

const allocationIdOf = (vpn: AdminVpnResource) => String(vpn.id || '').trim();

const listUserVpns = (user: AdminUserSummary | null): AdminVpnResource[] => {
  if (!user) return [];
  const fromVpns = Array.isArray(user.vpns) ? user.vpns : [];
  const fromResources = Array.isArray(user.resources)
    ? user.resources.filter((resource) => String(resource.type || '').toUpperCase() === 'VPN')
    : [];
  const byId = new Map<string, AdminVpnResource>();
  [...fromVpns, ...fromResources].forEach((vpn) => {
    const id = allocationIdOf(vpn);
    if (id) byId.set(id, { ...byId.get(id), ...vpn, id });
  });
  return [...byId.values()];
};

const messageFromError = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export const labelForAdminUser = (user: AdminUserSummary) =>
  user.display_name || user.name || user.email || user.manager_id || user.id;

export const getAdminVpnAllocationId = allocationIdOf;

export const useAdminVpnAssistance = (token?: string | null) => {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUserSummary | null>(null);
  const [selectedAllocationId, setSelectedAllocationId] = useState('');
  const [bundle, setBundle] = useState<AdminAssistanceBundle | null>(null);
  const [loading, setLoading] = useState(false);
  const [bundleLoading, setBundleLoading] = useState(false);
  const [error, setError] = useState('');
  const [copyState, setCopyState] = useState('');

  const vpns = useMemo(() => listUserVpns(selectedUser), [selectedUser]);
  const scriptText = bundle?.script.content || bundle?.script.redacted || '';

  const loadBundle = async (allocationId: string, includeScript = false) => {
    if (!allocationId) return;
    setBundleLoading(true);
    setError('');
    setCopyState('');
    try {
      const data = await fetchAdminAssistanceBundle(allocationId, {
        includeScript,
        token: token || undefined,
      });
      setBundle(data);
    } catch (err) {
      setError(messageFromError(err, "Bundle d'assistance indisponible."));
    } finally {
      setBundleLoading(false);
    }
  };

  const runSearch = async () => {
    setLoading(true);
    setError('');
    setBundle(null);
    try {
      const response = await fetchAdminAccounts(search, token || undefined);
      setUsers(response.users);
    } catch (err) {
      setError(messageFromError(err, 'Recherche admin impossible.'));
    } finally {
      setLoading(false);
    }
  };

  const selectUser = (user: AdminUserSummary) => {
    setSelectedUser(user);
    setBundle(null);
    const firstVpn = listUserVpns(user)[0];
    const allocationId = firstVpn ? allocationIdOf(firstVpn) : '';
    setSelectedAllocationId(allocationId);
    if (allocationId) void loadBundle(allocationId, false);
  };

  const copyScript = async () => {
    if (!scriptText) return;
    await navigator.clipboard.writeText(scriptText);
    setCopyState(bundle?.script.revealed ? 'Script complet copie.' : 'Apercu masque copie.');
  };

  return {
    search,
    setSearch,
    users,
    selectedUser,
    selectedAllocationId,
    setSelectedAllocationId,
    bundle,
    loading,
    bundleLoading,
    error,
    copyState,
    vpns,
    scriptText,
    runSearch,
    loadBundle,
    selectUser,
    copyScript,
  };
};
