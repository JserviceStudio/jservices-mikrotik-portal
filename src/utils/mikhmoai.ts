/**
 * 🛰️ MikhmoAI Logic (Frontend Port) - v3.0.0
 * Logique métier partagée pour l'éditeur TiketMomo.
 */

export interface ProfileMeta {
  price: string;
  duration: string;
  numericPrice: number;
  isSaleable: boolean;
  cleanLabel: string;
}

export function parseProfileLabel(rawName: any): ProfileMeta {
  const nameStr = String(rawName || '');
  const upper = nameStr.toUpperCase();

  if (nameStr.includes('$') || nameStr.includes('|') || nameStr.includes('[') || nameStr.includes(']')) {
    return { price: '', duration: '', numericPrice: 0, isSaleable: false, cleanLabel: nameStr };
  }

  const mikhmoMatch = upper.match(/(\d+)\s*F(?:CFA)?[-_ ]?(\d+)\s*(H|J|D|M|W|MN|MIN|SEM|JOUR|HEURE)/i);

  let price = '';
  let duration = '';
  let numericPrice = 0;
  let cleanLabel = nameStr;
  let isSaleable = false;

  if (mikhmoMatch) {
    const rawPrice = mikhmoMatch[1];
    const rawDurVal = mikhmoMatch[2];
    const rawDurUnit = mikhmoMatch[3].toUpperCase();
    numericPrice = parseInt(rawPrice, 10);
    price = `${numericPrice} FCFA`;
    if (rawDurUnit.startsWith('H')) duration = `${rawDurVal}H`;
    else if (rawDurUnit.startsWith('J') || rawDurUnit.startsWith('D')) duration = `${rawDurVal}J`;
    else if (rawDurUnit.startsWith('M')) duration = `${rawDurVal}min`;
    else if (rawDurUnit.startsWith('W') || rawDurUnit.startsWith('S')) duration = `${rawDurVal} sem.`;
    cleanLabel = `${rawPrice}F-${duration}`;
    isSaleable = true;
  }

  return { price, duration, numericPrice, isSaleable, cleanLabel };
}

export function cleanProfileName(name: any): string {
  const meta = parseProfileLabel(name);
  return meta.cleanLabel || String(name);
}

const normalizeTimelimit = (value: any): string => {
  const raw = String(value || '').trim().toLowerCase();
  if (!raw) return '';
  return raw
    .replace(/\s+/g, '')
    .replace(/jours?/g, 'd')
    .replace(/jour(s)?/g, 'd')
    .replace(/j$/, 'd')
    .replace(/min$/, 'm');
};

const preserveHotspotTokens = (url: string) =>
  url
    .replace(new RegExp(encodeURIComponent('$(server-name)'), 'g'), '$(server-name)')
    .replace(new RegExp(encodeURIComponent('$(mac)'), 'g'), '$(mac)')
    .replace(new RegExp(encodeURIComponent('$(ip)'), 'g'), '$(ip)')
    .replace(new RegExp(encodeURIComponent('$(link-status-esc)'), 'g'), '$(link-status-esc)');

const safeText = (value: any, fallback = ''): string => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return fallback;
};

const buildCustomGatewayUrl = (gatewayUrl: string, params: URLSearchParams) => {
  const base = safeText(gatewayUrl, 'https://tpay.mikhmoai.com/buy-ticketmomo');
  const normalized = base.startsWith('http://') || base.startsWith('https://') ? base : `https://${base}`;
  const url = new URL(normalized);
  params.forEach((value, key) => url.searchParams.set(key, value));
  return url.toString();
};

export function buildPaymentUrl(input: {
  aggregator?: string;
  gatewayUrl?: string;
  apiKey?: string;
  profileName?: string;
  priceLabel?: string;
  durationLabel?: string;
  amount?: string | number;
  timelimit?: string;
  nasid?: string;
  mac?: string;
  ip?: string;
  linkStatus?: string;
  storeSlug?: string;
  description?: string;
  reference?: string;
}) {
  const aggregator = String(input.aggregator || '').trim().toLowerCase();
  const amount = String(input.amount || input.priceLabel || '').replace(/\D/g, '');
  const timelimit = normalizeTimelimit(input.timelimit || input.durationLabel || '');
  const baseParams = new URLSearchParams();
  baseParams.set('nasid', input.nasid || '$(server-name)');
  if (amount) baseParams.set('amount', amount);
  baseParams.set('currency', 'cfa');
  if (input.profileName) baseParams.set('profile_name', input.profileName);
  if (timelimit) baseParams.set('timelimit', timelimit);
  baseParams.set('mac', input.mac || '$(mac)');
  baseParams.set('ip', input.ip || '$(ip)');
  baseParams.set('link-status', input.linkStatus || '$(link-status-esc)');
  if (input.storeSlug) baseParams.set('store', input.storeSlug);

  let url: string;
  if (aggregator === 'fedapay') {
    const params = new URLSearchParams(baseParams);
    if (input.apiKey) params.set('public_key', input.apiKey);
    params.set('description', input.description || `WiFi ${input.profileName || ''}`.trim());
    url = `https://checkout.fedapay.com/pay?${params.toString()}`;
  } else if (aggregator === 'kkiapay') {
    const params = new URLSearchParams(baseParams);
    if (input.apiKey) params.set('key', input.apiKey);
    params.set('reason', input.reference || `WiFi ${input.profileName || ''}`.trim());
    url = `https://payment.kkiapay.me/api/v1/checkout?${params.toString()}`;
  } else if (aggregator === 'cinay' || aggregator === 'cinetpay' || aggregator === 'cinpay') {
    const params = new URLSearchParams(baseParams);
    if (input.apiKey) params.set('apikey', input.apiKey);
    url = `https://checkout.cinay.me/p/${encodeURIComponent(input.apiKey || '')}?${params.toString()}`;
  } else {
    const customParams = new URLSearchParams(baseParams);
    if (input.apiKey) customParams.set('pub_key', input.apiKey);
    if (input.description) customParams.set('description', input.description);
    if (input.reference) customParams.set('reference', input.reference);
    url = buildCustomGatewayUrl(input.gatewayUrl || 'https://tpay.mikhmoai.com/buy-ticketmomo', customParams);
  }

  return preserveHotspotTokens(url);
}

export function buildTiketMomoPaymentUrl(plan: any, apiKey: string, gatewayUrl?: string): string {
  if (!apiKey || apiKey === 'none') return '';
  return buildPaymentUrl({
    aggregator: 'custom',
    gatewayUrl: gatewayUrl || 'https://tpay.mikhmoai.com/buy-ticketmomo',
    apiKey,
    profileName: plan?.profileName || '',
    priceLabel: plan?.priceLabel || '',
    durationLabel: plan?.durationLabel || '',
  });
}
