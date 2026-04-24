/**
 * 🛰️ MikhmoAI Logic (Frontend Port) - v2.7.1
 * Logique de détection intelligente MikhmoPro/MikhmoAI.
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
  } else {
    const pMatch = upper.match(/(\d+)\s*F(?:CFA)?/i);
    const dMatch = upper.match(/(\d+)\s*(H|J|D|M|W|MN|MIN|SEM|JOUR|HEURE)/i);
    if (pMatch && dMatch) {
      numericPrice = parseInt(pMatch[1], 10);
      price = `${numericPrice} FCFA`;
      const val = dMatch[1];
      const unit = dMatch[2].toUpperCase();
      if (unit.startsWith('H')) duration = `${val}H`;
      else if (unit.startsWith('J') || unit.startsWith('D')) duration = `${val}J`;
      else if (unit.startsWith('M')) duration = `${val}min`;
      else duration = `${val}${unit[0]}`;
      cleanLabel = `${pMatch[1]}F-${duration}`;
      isSaleable = true;
    }
  }

  return { price, duration, numericPrice, isSaleable, cleanLabel };
}

export function cleanProfileName(name: any): string {
  const meta = parseProfileLabel(name);
  return meta.cleanLabel;
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
    const publicKey = safeText(input.apiKey);
    const params = new URLSearchParams(baseParams);
    if (publicKey) params.set('public_key', publicKey);
    if (input.description) params.set('description', input.description);
    params.set('currency', 'cfa');
    url = `https://checkout.fedapay.com/pay?${params.toString()}`;
  } else if (aggregator === 'kkiapay') {
    const params = new URLSearchParams(baseParams);
    if (input.apiKey) params.set('key', input.apiKey);
    if (input.reference) params.set('reason', input.reference);
    url = `https://payment.kkiapay.me/api/v1/checkout?${params.toString()}`;
  } else if (aggregator === 'cinay' || aggregator === 'cinetpay' || aggregator === 'cinpay') {
    const params = new URLSearchParams(baseParams);
    if (input.apiKey) params.set('apikey', input.apiKey);
    url = `https://checkout.cinay.me/p/${encodeURIComponent(input.apiKey || '')}?${params.toString()}`;
  } else if (aggregator === 'custom') {
    const customParams = new URLSearchParams(baseParams);
    if (input.apiKey) customParams.set('pub_key', input.apiKey);
    url = buildCustomGatewayUrl(input.gatewayUrl || 'https://tpay.mikhmoai.com/buy-ticketmomo', customParams);
  } else {
    const customParams = new URLSearchParams(baseParams);
    if (input.apiKey) customParams.set('pub_key', input.apiKey);
    url = buildCustomGatewayUrl(input.gatewayUrl || 'https://tpay.mikhmoai.com/buy-ticketmomo', customParams);
  }

  return preserveHotspotTokens(url);
}

/**
 * 🎫 Générateur de lien de paiement intelligent TiketMOMO
 */
export function buildTiketMomoPaymentUrl(input: {
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
  aggregator?: string;
  description?: string;
  reference?: string;
}): string {
  return buildPaymentUrl(input);
}
