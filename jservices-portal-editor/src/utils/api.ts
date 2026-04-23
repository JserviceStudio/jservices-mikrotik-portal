import { SettingsSchema } from '../store/useStore';

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) return import.meta.env.VITE_API_BASE_URL;
  // En production, si on est sur jmoai.net/portal-editor, l'API est à jmoai.net/
  if (typeof window !== 'undefined') {
    // Si on est dans le sous-dossier /portal-editor, on remonte à la racine pour l'API
    return window.location.origin;
  }
  return '';
};

const API_BASE_URL = getApiBaseUrl();
const EXTERNAL_AUTH_TOKEN_KEY = 'jservices.externalAuthToken';

export interface PortalEditorOffer {
  id: string;
  profileName: string;
  displayName: string;
  priceAmount: number | null;
  priceLabel: string;
  durationCode: string | null;
  durationLabel: string;
  speedLabel: string;
  sharedUsers: number | null;
}

export interface PortalEditorBootstrap {
  router?: {
    identity?: string | null;
    cpu?: string | null;
    uptime?: string | null;
    version?: string | null;
    board?: string | null;
  };
  editorConfig: SettingsSchema | null;
  offers: PortalEditorOffer[];
  profiles: Array<Record<string, unknown>>;
  importedAt: string;
}

export interface PortalEditorSaveResponse {
  settings: SettingsSchema;
  store_settings: Record<string, unknown>;
}

const buildAuthHeaders = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  
  // 1. Priorité au token passé dans l'URL (cas de l'iframe cross-domain ou cookie-less)
  const urlParams = new URLSearchParams(window.location.search);
  const urlToken = urlParams.get('token');
  
  // 2. Fallback sur le localStorage
  const externalAuthToken = urlToken || window.localStorage.getItem(EXTERNAL_AUTH_TOKEN_KEY);
  
  return externalAuthToken ? { Authorization: `Bearer ${externalAuthToken}` } : {};
};

export const fetchPortalBootstrap = async (force = false): Promise<PortalEditorBootstrap> => {
  const url = `${API_BASE_URL}/api/v1/clients/portal-editor/bootstrap${force ? '?force=true' : ''}`;
  console.log('[API] 🛰️ Fetching bootstrap from:', url);
  
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...buildAuthHeaders(),
    },
  });

  const payload = await response.json();
  if (!response.ok || !payload?.success) {
    console.error('[API] ❌ Bootstrap Error:', payload);
    throw new Error(payload?.error || 'Impossible de charger les métadonnées MikroTik.');
  }

  return payload.data as PortalEditorBootstrap;
};

export const savePortalConfig = async (settings: SettingsSchema): Promise<PortalEditorSaveResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/clients/portal-editor/config`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...buildAuthHeaders(),
    },
    body: JSON.stringify(settings),
  });

  const payload = await response.json();
  if (!response.ok || !payload?.success) {
    throw new Error(payload?.error || 'Impossible d’enregistrer la configuration du portail.');
  }

  return payload.data as PortalEditorSaveResponse;
};

export const deployToCloud = async (settings: SettingsSchema) => {
  try {
    const result = await savePortalConfig(settings);
    return {
      success: true,
      url: (result.settings.publicUrl || `${window.location.origin}/s/preview`) as string
    };
  } catch (error) {
    console.error("Erreur de déploiement:", error);
    return { success: false, url: '' };
  }
};
