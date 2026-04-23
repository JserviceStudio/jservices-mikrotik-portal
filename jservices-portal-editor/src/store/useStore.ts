import { create } from 'zustand';
import type { TemplateId, TemplateLanguage } from '../core/templates';

export interface PlanConf {
  id: string;
  profileName: string;
  displayName: string;
  priceLabel: string;
  durationLabel: string;
  speedLabel: string;
  badge: 'none' | 'vip' | 'eco' | 'popular';
  paymentUrl?: string; // Opt
  displayOrder: number;
}

export interface KycConf {
  enabled: boolean;
  countryCode: string; // ex: +229
  authorizedPrefixes: string[]; // ex: ['01', '02']
  phoneLength: number; // ex: 10
  loggingUrl: string;
}

export interface SettingsSchema {
  template_id: TemplateId;
  branding: {
    ispName: string;
    wifiName: string;
    primaryColor: string;
    secondaryColor: string;
    logoUrl?: string;
    logoPreset?: 'none' | 'jservices' | 'jconnect';
    cardStyle: 'glass' | 'ticket';
    bgOverlayOpacity: number;
    fontFamily: string;
    language: TemplateLanguage;
  };
  plans: PlanConf[];
  payment: {
    aggregator: 'none' | 'FedaPay' | 'MoailteStore' | 'Cinay' | 'Custom';
    apiKey: string;
    clientId?: string;
    gatewayUrl?: string;
  };
  features: {
    themeMode: 'auto' | 'light' | 'dark';
    enableQrScanner: boolean;
    enableTrial: boolean;
    kyc: KycConf;
  };
  contact: {
    phone: string;
    whatsapp: string;
    address: string;
    designerName?: string;
    designerPhone?: string;
    designerYear?: string;
  };
  deploymentStatus: 'idle' | 'loading' | 'success' | 'error';
  publicUrl: string | null;
}

interface EditorState {
  settings: SettingsSchema;
  mikrotikProfiles: any[];
  setSettings: (settings: SettingsSchema) => void;
  setTemplateId: (templateId: TemplateId) => void;
  updateBranding: (branding: Partial<SettingsSchema['branding']>) => void;
  updateFeatures: (features: Partial<SettingsSchema['features']>) => void;
  updateKyc: (kyc: Partial<KycConf>) => void;
  updatePayment: (payment: Partial<SettingsSchema['payment']>) => void;
  updateContact: (contact: Partial<SettingsSchema['contact']>) => void;
  setPlans: (plans: PlanConf[]) => void;
  setMikrotikProfiles: (profiles: any[]) => void;
  setDeploymentStatus: (status: 'idle' | 'loading' | 'success' | 'error') => void;
  setPublicUrl: (url: string | null) => void;
}

const defaultSettings: SettingsSchema = {
  template_id: 'base-2',
  branding: {
    ispName: 'WiFi Zone',
    wifiName: 'Mon Réseau Rapide',
    primaryColor: '#673AB7',
    secondaryColor: '#512DA8',
    logoPreset: 'jservices',
    cardStyle: 'glass',
    bgOverlayOpacity: 80,
    fontFamily: 'Inter, sans-serif',
    language: 'fr'
  },
  plans: [
    {
      id: '1',
      profileName: '1H',
      displayName: '1 Heure VIP',
      priceLabel: '100 FCFA',
      durationLabel: '1 Heure',
      speedLabel: '2M/2M',
      badge: 'none',
      displayOrder: 1
    }
  ],
  payment: {
    aggregator: 'none',
    apiKey: ''
  },
  features: {
    themeMode: 'auto',
    enableQrScanner: true,
    enableTrial: false,
    kyc: {
      enabled: false,
      countryCode: '+229',
      authorizedPrefixes: [],
      phoneLength: 10,
      loggingUrl: ''
    }
  },
  contact: {
    phone: '+229 01 00 00 00 00',
    whatsapp: '22996937864',
    address: 'Whatsapp Uniquement',
    designerName: 'J+services',
    designerPhone: '+2290196937864',
    designerYear: '2026'
  },
  deploymentStatus: 'idle',
  publicUrl: null
};

export const useStore = create<EditorState>((set) => ({
  settings: defaultSettings,
  mikrotikProfiles: [],
  setSettings: (settings) => set({ settings }),
  setTemplateId: (templateId) => set((state) => ({ settings: { ...state.settings, template_id: templateId } })),
  updateBranding: (branding) =>
    set((state) => ({ settings: { ...state.settings, branding: { ...state.settings.branding, ...branding } } })),
  updateFeatures: (features) =>
    set((state) => ({ settings: { ...state.settings, features: { ...state.settings.features, ...features } } })),
  updateKyc: (kyc) =>
    set((state) => ({ settings: { ...state.settings, features: { ...state.settings.features, kyc: { ...state.settings.features.kyc, ...kyc } } } })),
  updatePayment: (payment) => set((state) => ({ settings: { ...state.settings, payment: { ...state.settings.payment, ...payment } } })),
  updateContact: (contact) => set((state) => ({ settings: { ...state.settings, contact: { ...state.settings.contact, ...contact } } })),
  setPlans: (plans) => set((state) => ({ settings: { ...state.settings, plans } })),
  setMikrotikProfiles: (profiles) => set({ mikrotikProfiles: profiles }),
  setDeploymentStatus: (status) => set((state) => ({ settings: { ...state.settings, deploymentStatus: status } })),
  setPublicUrl: (url) => set((state) => ({ settings: { ...state.settings, publicUrl: url } })),
}));
