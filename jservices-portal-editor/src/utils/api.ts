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

export const deployToCloud = async (settings: SettingsSchema, token?: string) => {
  try {
    const result = await savePortalConfig(settings, token);
    return { success: true, url: result.settings?.publicUrl || `https://jmoai.net/s/preview` };
  } catch (error: any) {
    return { success: false, url: '', error: error.message };
  }
};
