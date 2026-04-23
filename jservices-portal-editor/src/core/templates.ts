import type { SettingsSchema } from '../store/useStore';
import { MD5_JS_CONTENT } from './templates/constants';
import { buildBase1LoginTemplate } from './templates/base1';
import { buildBase2LoginTemplate } from './templates/base2';
import { buildBase3LoginTemplate } from './templates/base3';
import { buildBase4LoginTemplate } from './templates/base4';
import {
  buildStatusTemplate,
  buildLogoutTemplate,
  buildAloginTemplate,
  buildErrorTemplate,
  REDIRECT_HTML,
  RADVERT_HTML,
} from './templates/shared';

export { MD5_JS_CONTENT };

export type TemplateId = 'base-1' | 'base-2' | 'base-3' | 'base-4';
export type TemplateLanguage = 'fr' | 'en';

export interface TemplateTexts {
  loginTitle: string;
  portalSubtitle: string;
  loginToggle: string;
  memberToggle: string;
  ticketCodeLabel: string;
  ticketCodePlaceholder: string;
  memberUsernameLabel: string;
  memberUsernamePlaceholder: string;
  memberPasswordLabel: string;
  memberPasswordPlaceholder: string;
  connectButton: string;
  plansTitle: string;
  wifiLabel: string;
  ticketLabel: string;
  bestSellerBadge: string;
  vipBadge: string;
  ecoBadge: string;
  directPaymentBadge: string;
  supportKicker: string;
  supportTitle: string;
  addressLabel: string;
  whatsappButton: string;
  callButton: string;
  whatsappHelp: string;
  classicTemplateHint: string;
  quickConnectTitle: string;
  quickConnectNotice: string;
  memberSpace: string;
  assistance: string;
  supportLabel: string;
  designBy: string;
  qrScannerButton: string;
  qrScannerHint: string;
  qrScannerFallback: string;
  qrScannerTitle: string;
  qrScannerClose: string;
  qrScannerUnsupported: string;
  qrScannerError: string;
  trialButton: string;
  trialHint: string;
  activeSessionTitle: string;
  usernameLabel: string;
  ipLabel: string;
  sessionTimeLeftLabel: string;
  dataUsedLabel: string;
  logoutButton: string;
  goodbyeTitle: string;
  logoutMessage: string;
  reconnectButton: string;
  successTitle: string;
  successMessage: string;
  redirectingMessage: string;
  errorTitle: string;
  retryButton: string;
  buyBadge: string;
  kycPhoneLabel: string;
  kycPhonePlaceholder: string;
  kycErrorLength: string;
  kycErrorPrefix: string;
  kycErrorRequired: string;
  kycDisclaimer: string;
  kycArcepBadge: string;
  contactInfoTitle: string;
  errorInvalidUser: string;
  errorSessionLimit: string;
  errorTrafficLimit: string;
  errorUptimeLimit: string;
  errorRadiusTimeout: string;
  errorAuthInProgress: string;
  errorBrowserResponse: string;
  finishButton: string;
}

const TEMPLATE_TEXTS: Record<TemplateLanguage, TemplateTexts> = {
  fr: {
    loginTitle: 'LOGIN',
    portalSubtitle: 'Connexion au hotspot {{wifiName}} avec acces ticket ou membre.',
    loginToggle: 'Connexion',
    memberToggle: 'Membre',
    ticketCodeLabel: 'Code du ticket',
    ticketCodePlaceholder: 'Tapez votre code ici',
    memberUsernameLabel: "Nom d'utilisateur",
    memberUsernamePlaceholder: 'Entrez votre identifiant',
    memberPasswordLabel: 'Mot de passe',
    memberPasswordPlaceholder: 'Entrez votre mot de passe',
    connectButton: 'Connexion',
    plansTitle: '{{plansSectionTitle}}',
    wifiLabel: 'WIFI',
    ticketLabel: 'TICKET',
    bestSellerBadge: '🔥 Meilleure vente',
    vipBadge: '⭐ V.I.P',
    ecoBadge: '💰 Economique',
    directPaymentBadge: '💳 Paiement direct',
    supportKicker: 'Support Client',
    supportTitle: "Besoin d'aide ?",
    addressLabel: 'Adresse / Indication',
    whatsappButton: 'WhatsApp',
    callButton: 'Appeler',
    whatsappHelp: 'Aide WhatsApp',
    classicTemplateHint: 'Template classique inspire de votre Base/1.',
    quickConnectTitle: 'Connexion rapide',
    quickConnectNotice: 'Entrez votre code ticket ou votre mot de passe membre pour acceder au reseau.',
    memberSpace: 'Espace membre',
    assistance: 'Assistance',
    supportLabel: 'Support',
    designBy: 'Designer by',
    qrScannerButton: 'Scanner QR',
    qrScannerHint: 'Scannez un ticket QR pour remplir automatiquement le code.',
    qrScannerFallback: 'Saisie manuelle',
    qrScannerTitle: 'Scanner un ticket QR',
    qrScannerClose: 'Fermer',
    qrScannerUnsupported: 'Scanner non disponible sur cet appareil. Utilisez la saisie manuelle.',
    qrScannerError: 'Impossible d’ouvrir la camera. Verifiez l’autorisation ou utilisez la saisie manuelle.',
    trialButton: "Ticket d'essai",
    trialHint: 'Essayez une connexion gratuite si le mode trial est actif sur MikroTik.',
    activeSessionTitle: 'Session active',
    usernameLabel: 'Utilisateur',
    ipLabel: 'Adresse IP',
    sessionTimeLeftLabel: 'Temps restant',
    dataUsedLabel: 'Donnees utilisees',
    finishButton: 'Terminer',
    logoutButton: 'Deconnexion',
    goodbyeTitle: 'A bientot',
    logoutMessage: 'Vous avez quitte le portail {{ispName}}.',
    reconnectButton: 'Se reconnecter',
    successTitle: 'Connexion reussie',
    successMessage: 'Bienvenue chez {{ispName}}.',
    redirectingMessage: 'Redirection en cours...',
    errorTitle: 'Erreur de connexion',
    retryButton: 'Reessayer',
    buyBadge: '💳 Achetez',
    kycPhoneLabel: 'Numéro de téléphone (ARCEP)',
    kycPhonePlaceholder: 'Tapez votre numéro local',
    kycErrorLength: 'Le numéro doit comporter {{phoneLength}} chiffres.',
    kycErrorPrefix: 'Le numéro doit commencer par : {{authorizedPrefixes}}.',
    kycErrorRequired: 'Le numéro de téléphone est obligatoire.',
    kycDisclaimer: 'Conformément aux exigences de l’ARCEP, vos données sont désormais sécurisées.',
    kycArcepBadge: 'Certifié ARCEP',
    contactInfoTitle: 'Contact & Info',
    errorInvalidUser: 'Ce ticket a expiré ou a été mal saisi. Veuillez réessayer.',
    errorSessionLimit: 'Le ticket est déjà actif sur un autre appareil.',
    errorTrafficLimit: 'Limite de données atteinte. Ce ticket a consommé tout son crédit.',
    errorUptimeLimit: 'Limite de temps atteinte pour ce ticket.',
    errorRadiusTimeout: 'Le serveur d’authentification ne répond pas.',
    errorAuthInProgress: 'Traitement en cours. Veuillez patienter quelques instants.',
    errorBrowserResponse: 'Problème technique. Veuillez activer JavaScript ou utiliser Google Chrome.',
  },
  en: {
    loginTitle: 'LOGIN',
    portalSubtitle: 'Connect to the {{wifiName}} hotspot with ticket or member access.',
    loginToggle: 'Login',
    memberToggle: 'Member',
    ticketCodeLabel: 'Ticket code',
    ticketCodePlaceholder: 'Type your code here',
    memberUsernameLabel: 'Username',
    memberUsernamePlaceholder: 'Enter your username',
    memberPasswordLabel: 'Password',
    memberPasswordPlaceholder: 'Enter your password',
    connectButton: 'Connect',
    plansTitle: '{{plansSectionTitle}}',
    wifiLabel: 'WIFI',
    ticketLabel: 'TICKET',
    bestSellerBadge: '🔥 Best seller',
    vipBadge: '⭐ V.I.P',
    ecoBadge: '💰 Budget',
    directPaymentBadge: '💳 Direct payment',
    supportKicker: 'Customer Support',
    supportTitle: 'Need help?',
    addressLabel: 'Address / Details',
    whatsappButton: 'WhatsApp',
    callButton: 'Call',
    whatsappHelp: 'WhatsApp Help',
    classicTemplateHint: 'Classic template inspired by your Base/1.',
    quickConnectTitle: 'Quick access',
    quickConnectNotice: 'Enter your ticket code or member password to access the network.',
    memberSpace: 'Member area',
    assistance: 'Support',
    supportLabel: 'Support',
    designBy: 'Designer by',
    qrScannerButton: 'Scan QR',
    qrScannerHint: 'Scan a QR ticket to fill the code automatically.',
    qrScannerFallback: 'Manual entry',
    qrScannerTitle: 'Scan a QR ticket',
    qrScannerClose: 'Close',
    qrScannerUnsupported: 'Scanner is not available on this device. Use manual entry instead.',
    qrScannerError: 'Unable to open the camera. Check permission or use manual entry instead.',
    trialButton: 'Trial ticket',
    trialHint: 'Try a free connection when MikroTik trial mode is enabled.',
    activeSessionTitle: 'Active session',
    usernameLabel: 'Username',
    ipLabel: 'IP address',
    sessionTimeLeftLabel: 'Time left',
    dataUsedLabel: 'Data used',
    finishButton: 'Finish',
    logoutButton: 'Logout',
    goodbyeTitle: 'See you soon',
    logoutMessage: 'You have left the {{ispName}} portal.',
    reconnectButton: 'Reconnect',
    successTitle: 'Connected successfully',
    successMessage: 'Welcome to {{ispName}}.',
    redirectingMessage: 'Redirecting...',
    errorTitle: 'Connection error',
    retryButton: 'Retry',
    buyBadge: '💳 Buy',
    kycPhoneLabel: 'Phone number (ARCEP)',
    kycPhonePlaceholder: 'Type your local number',
    kycErrorLength: 'The number must be {{phoneLength}} digits long.',
    kycErrorPrefix: 'The number must start with: {{authorizedPrefixes}}.',
    kycErrorRequired: 'Phone number is required.',
    kycDisclaimer: 'In compliance with ARCEP requirements, your data is now secured.',
    kycArcepBadge: 'ARCEP Certified',
    contactInfoTitle: 'Contact & Info',
    errorInvalidUser: 'This ticket has expired or was mistyped. Please try again.',
    errorSessionLimit: 'The ticket is already active on another device.',
    errorTrafficLimit: 'Data limit reached. This ticket has consumed all its credit.',
    errorUptimeLimit: 'Time limit reached for this ticket.',
    errorRadiusTimeout: 'The authentication server is not responding.',
    errorAuthInProgress: 'Processing in progress. Please wait a moment.',
    errorBrowserResponse: 'Technical issue. Please enable JavaScript or use Google Chrome.',
  },
};

export const getTemplateTexts = (language: TemplateLanguage, vars?: Record<string, string>) => {
  const base = TEMPLATE_TEXTS[language] ?? TEMPLATE_TEXTS.fr;
  if (!vars) return base;

  return Object.fromEntries(
    Object.entries(base).map(([key, value]) => [
      key,
      value.replace(/\{\{(\w+)\}\}/g, (_match: string, token: string) => vars[token] ?? ''),
    ]),
  ) as TemplateTexts;
};

export interface TemplateContext extends SettingsSchema {
  loginUrl?: string;
}

export interface TemplateDefinition {
  id: TemplateId;
  label: string;
  description: string;
  files: Record<string, string>;
}

const BASE_1_FILES: Record<string, string> = {
  'login.html': buildBase1LoginTemplate(),
  'status.html': buildStatusTemplate('base-1'),
  'logout.html': buildLogoutTemplate('base-1'),
  'alogin.html': buildAloginTemplate(),
  'error.html': buildErrorTemplate(),
  'redirect.html': REDIRECT_HTML,
  'rlogin.html': REDIRECT_HTML,
  'md5.js': MD5_JS_CONTENT,
};

const BASE_2_FILES: Record<string, string> = {
  'login.html': buildBase2LoginTemplate(),
  'status.html': buildStatusTemplate('base-2'),
  'logout.html': buildLogoutTemplate('base-2'),
  'alogin.html': buildAloginTemplate(),
  'error.html': buildErrorTemplate(),
  'redirect.html': REDIRECT_HTML,
  'rlogin.html': REDIRECT_HTML,
  'radvert.html': RADVERT_HTML,
  'md5.js': MD5_JS_CONTENT,
};

const BASE_3_FILES: Record<string, string> = {
  'login.html': buildBase3LoginTemplate(),
  'status.html': buildStatusTemplate('base-3'),
  'logout.html': buildLogoutTemplate('base-3'),
  'alogin.html': buildAloginTemplate(),
  'error.html': buildErrorTemplate(),
  'redirect.html': REDIRECT_HTML,
  'rlogin.html': REDIRECT_HTML,
  'radvert.html': RADVERT_HTML,
  'md5.js': MD5_JS_CONTENT,
};

const BASE_4_FILES: Record<string, string> = {
  'login.html': buildBase4LoginTemplate(),
  'status.html': buildStatusTemplate('base-4'),
  'logout.html': buildLogoutTemplate('base-4'),
  'alogin.html': buildAloginTemplate(),
  'error.html': buildErrorTemplate(),
  'redirect.html': REDIRECT_HTML,
  'rlogin.html': REDIRECT_HTML,
  'radvert.html': RADVERT_HTML,
  'md5.js': MD5_JS_CONTENT,
};

export const TEMPLATE_DEFINITIONS: Record<TemplateId, TemplateDefinition> = {
  'base-1': {
    id: 'base-1',
    label: 'Finapp Reloaded',
    description: 'Design inspiré des applications bancaires modernes. (Purple/Clean)',
    files: BASE_1_FILES,
  },
  'base-2': {
    id: 'base-2',
    label: 'Classic Original',
    description: 'Design original avec ticket-style, toggle Connexion/Membre et dark mode.',
    files: BASE_2_FILES,
  },
  'base-3': {
    id: 'base-3',
    label: 'Skyline Premium',
    description: 'Design moderne glassmorphism avec gradients premium et cartes épurées.',
    files: BASE_3_FILES,
  },
  'base-4': {
    id: 'base-4',
    label: 'Material Concept M3',
    description: 'Design Google Material 3 avec surfaces tonales et typographie lisible.',
    files: BASE_4_FILES,
  },
};

export const getTemplateDefinition = (templateId: TemplateId): TemplateDefinition =>
  TEMPLATE_DEFINITIONS[templateId] ?? TEMPLATE_DEFINITIONS['base-2'];
