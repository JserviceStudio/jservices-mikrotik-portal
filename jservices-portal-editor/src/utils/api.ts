import { SettingsSchema } from '../store/useStore';

/**
 * 🛰️ MikhmoAI API Config (Production Mode)
 * Force l'utilisation du domaine 'live.jmoai.net' pour l'API Backend.
 */
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) return import.meta.env.VITE_API_BASE_URL;
  // En production, le backend Express est sur live.jmoai.net
  return 'https://live.jmoai.net';
};

const API_BASE_URL = getApiBaseUrl();
const EXTERNAL_AUTH_TOKEN_KEY = 'jservices.externalAuthToken';

export type AdminVpnResource = {
  id: string;
  type?: string;
  name?: string;
  host?: string | null;
  status?: string | null;
  tunnel_status?: string | null;
  router_tunnel_ip?: string | null;
  locked_router_identity?: string | null;
  locked_router_model?: string | null;
  locked_router_serial?: string | null;
};

export type AdminUserSummary = {
  id: string;
  manager_id?: string;
  email?: string | null;
  display_name?: string | null;
  name?: string | null;
  status?: string | null;
  primaryRole?: string | null;
  roles?: string[];
  vpns?: AdminVpnResource[];
  resources?: AdminVpnResource[];
};

export type AdminAccountsResponse = {
  users: AdminUserSummary[];
  total: number;
};

export type AdminAssistanceBundle = {
  allocation_id: string | null;
  client_id: string | null;
  bundle_version: string | null;
  active_transport: string | null;
  primary_protocol: string | null;
  selected_protocol: string | null;
  public_host: string | null;
  peer_public_key_fingerprint: string | null;
  endpoint?: { host?: string | null; port?: number | string | null } | null;
  tunnel?: { router_tunnel_ip?: string | null; status?: string | null; last_seen_at?: string | null } | null;
  router_lock?: { identity?: string | null; serial?: string | null; model?: string | null; is_locked?: boolean } | null;
  protocols?: Array<{
    profile_id?: string | null;
    protocol?: string | null;
    status?: string | null;
    has_routeros_script?: boolean;
    has_configuration_blob?: boolean;
    has_credentials?: boolean;
    transport_plane?: string | null;
  }>;
  script: {
    protocol?: string | null;
    available: boolean;
    redacted: string | null;
    content: string | null;
    revealed: boolean;
  };
  redirection?: unknown;
  vpnRedirection?: unknown;
};

const getSessionStorage = () => {
  if (typeof window === 'undefined') return null;
  return window.sessionStorage;
};

export const readPortalEditorToken = () => {
  if (typeof window === 'undefined') return null;
  const urlParams = new URLSearchParams(window.location.search);
  const urlToken = urlParams.get('token');
  const storageToken = getSessionStorage()?.getItem(EXTERNAL_AUTH_TOKEN_KEY);
  return urlToken || storageToken || null;
};

const buildAuthHeaders = (token?: string): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  const externalAuthToken = token || readPortalEditorToken();
  return externalAuthToken ? { Authorization: `Bearer ${externalAuthToken}` } : {};
};

const extractErrorMessage = (payload: any, fallback: string) => {
  const candidate = payload?.error?.message ?? payload?.error ?? payload?.message ?? fallback;
  if (typeof candidate === 'string') return candidate;
  if (candidate && typeof candidate === 'object') {
    return String(candidate.message || candidate.detail || candidate.code || fallback);
  }
  return fallback;
};

export const fetchPortalBootstrap = async (force = false, token?: string): Promise<any> => {
  const url = `${API_BASE_URL}/api/v1/clients/portal-editor/bootstrap${force ? '?force=true' : ''}`;
  console.log('[MikhmoAI] 🛰️ Loading Bootstrap:', url);

  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: { Accept: 'application/json', ...buildAuthHeaders(token) },
  });

  const payload = await response.json();
  if (!response.ok || !payload?.success) {
    throw new Error(extractErrorMessage(payload, 'Serveur MikroTik injoignable.'));
  }

  return payload.data;
};

export const fetchAdminAccounts = async (
  search: string,
  token?: string,
  limit = 50,
): Promise<AdminAccountsResponse> => {
  const params = new URLSearchParams();
  if (search.trim()) params.set('search', search.trim());
  params.set('limit', String(limit));
  const response = await fetch(`${API_BASE_URL}/admin/api/accounts?${params.toString()}`, {
    method: 'GET',
    credentials: 'include',
    headers: { Accept: 'application/json', ...buildAuthHeaders(token) },
  });

  const payload = await response.json();
  if (!response.ok || !payload?.success) {
    throw new Error(extractErrorMessage(payload, 'Session admin indisponible.'));
  }

  return { users: Array.isArray(payload.users) ? payload.users : [], total: Number(payload.total || 0) };
};

export const checkAdminSession = async (token?: string): Promise<boolean> => {
  try {
    await fetchAdminAccounts('', token, 1);
    return true;
  } catch {
    return false;
  }
};

export const fetchAdminAssistanceBundle = async (
  allocationId: string,
  options: { includeScript?: boolean; token?: string } = {},
): Promise<AdminAssistanceBundle> => {
  const params = new URLSearchParams();
  if (options.includeScript) params.set('include_script', '1');
  const suffix = params.toString() ? `?${params.toString()}` : '';
  const response = await fetch(
    `${API_BASE_URL}/admin/api/catalog/remote-access/${encodeURIComponent(allocationId)}/assistance-bundle${suffix}`,
    {
      method: 'GET',
      credentials: 'include',
      headers: { Accept: 'application/json', ...buildAuthHeaders(options.token) },
    },
  );

  const payload = await response.json();
  if (!response.ok || !payload?.success) {
    throw new Error(extractErrorMessage(payload, "Bundle d'assistance indisponible."));
  }

  return payload.data;
};

export const savePortalConfig = async (settings: SettingsSchema, token?: string): Promise<any> => {
  const url = `${API_BASE_URL}/api/v1/clients/portal-editor/config`;
  const response = await fetch(url, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...buildAuthHeaders(token) },
    body: JSON.stringify(settings),
  });

  const payload = await response.json();
  if (!response.ok || !payload?.success) {
    throw new Error(extractErrorMessage(payload, 'Sauvegarde échouée.'));
  }

  return payload.data;
};

export const uploadPortalLogo = async (file: File, token?: string): Promise<{ url: string }> => {
  const url = `${API_BASE_URL}/api/v1/clients/portal-editor/upload-logo`;
  const formData = new FormData();
  formData.append('logo', file);

  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: { ...buildAuthHeaders(token) },
    body: formData,
  });

  const payload = await response.json();
  if (!response.ok || !payload?.success) {
    throw new Error(extractErrorMessage(payload, 'Upload du logo échoué.'));
  }

  return payload.data;
};

export const fetchPortalDeploymentPlan = async (token?: string): Promise<any> => {
  const url = `${API_BASE_URL}/api/v1/clients/portal-editor/deployment-plan`;
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: { Accept: 'application/json', ...buildAuthHeaders(token) },
  });

  const payload = await response.json();
  if (!response.ok || !payload?.success) {
    throw new Error(extractErrorMessage(payload, 'Plan de déploiement indisponible.'));
  }

  return payload.data;
};

export const deployToCloud = async (settings: SettingsSchema, token?: string) => {
  try {
    const result = await savePortalConfig(settings, token);
    return { success: true, url: result.settings?.publicUrl || `https://jmoai.net/s/preview` };
  } catch (error: any) {
    return { success: false, url: '', error: error.message };
  }
};
