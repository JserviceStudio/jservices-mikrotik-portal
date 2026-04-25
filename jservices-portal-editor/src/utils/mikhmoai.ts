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

const isHotspotToken = (value: any): boolean => typeof value === 'string' && /^\$\([a-z0-9_-]+\)$/i.test(value.trim());

const encodeQueryValue = (value: any): string => {
  if (value === null || value === undefined) return '';
  const raw = String(value).trim();
  if (!raw) return '';
  return isHotspotToken(raw) ? raw : encodeURIComponent(raw);
};

const buildQueryString = (entries: Array<[string, any]>) =>
  entries
    .filter(([, value]) => value !== undefined && value !== null && String(value).trim().length > 0)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeQueryValue(value)}`)
    .join('&');

const appendQuery = (baseUrl: string, queryString: string) =>
  `${baseUrl}${String(baseUrl).includes('?') ? '&' : '?'}${queryString}`;

const normalizeGatewayUrl = (gatewayUrl: string) => {
  const base = safeText(gatewayUrl, 'https://tpay.mikhmoai.com/buy-ticketmomo');
  return base.startsWith('http://') || base.startsWith('https://') ? base : `https://${base}`;
};

export function buildPaymentUrl(input: {
  aggregator?: string;
  gatewayUrl?: string;
  apiKey?: string;
  profileName?: string;
  priceLabel?: string;
  durationLabel?: string;
  dataLimit?: string;
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
  const baseParams: Array<[string, any]> = [
    ['nasid', input.nasid || '$(server-name)'],
    ['amount', amount],
    ['currency', 'cfa'],
    ['profile_name', input.profileName],
    ['timelimit', timelimit],
    ['data_limit', input.dataLimit],
    ['mac', input.mac || '$(mac)'],
    ['ip', input.ip || '$(ip)'],
    ['link-status', input.linkStatus || '$(link-status-esc)'],
    ['store', input.storeSlug],
  ];

  let url: string;
  if (aggregator === 'fedapay') {
    const params = buildQueryString([
      ...baseParams,
      ['public_key', input.apiKey],
      ['description', input.description || `WiFi ${input.profileName || ''}`.trim()],
    ]);
    url = appendQuery('https://checkout.fedapay.com/pay', params);
  } else if (aggregator === 'kkiapay') {
    const params = buildQueryString([
      ...baseParams,
      ['key', input.apiKey],
      ['reason', input.reference || `WiFi ${input.profileName || ''}`.trim()],
    ]);
    url = appendQuery('https://payment.kkiapay.me/api/v1/checkout', params);
  } else if (aggregator === 'cinay' || aggregator === 'cinetpay' || aggregator === 'cinpay') {
    const params = buildQueryString([
      ...baseParams,
      ['apikey', input.apiKey],
    ]);
    url = appendQuery(`https://checkout.cinay.me/p/${encodeURIComponent(input.apiKey || '')}`, params);
  } else {
    const params = buildQueryString([
      ...baseParams,
      ['pub_key', input.apiKey],
      ['description', input.description],
      ['reference', input.reference],
    ]);
    url = appendQuery(normalizeGatewayUrl(input.gatewayUrl || 'https://tpay.mikhmoai.com/buy-ticketmomo'), params);
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
    dataLimit: plan?.dataLimit || '',
  });
}
