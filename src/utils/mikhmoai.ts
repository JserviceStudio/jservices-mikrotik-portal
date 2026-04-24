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

/**
 * 🎫 Générateur de lien de paiement intelligent TiketMOMO
 */
export function buildTiketMomoPaymentUrl(plan: any, apiKey: string): string {
  if (!apiKey || apiKey === 'none') return '';
  const nasid = '$(server-name)'; 
  const amount = String(plan.priceLabel || '0').replace(/\D/g, '');
  const duration = plan.durationLabel || '';
  const profile = plan.profileName;
  return `https://tpay.jmoai.net/buy-ticketmomo?nasid=${nasid}&amount=${amount}&currency=cfa&profile_name=${encodeURIComponent(profile)}&timelimit=${encodeURIComponent(duration)}&mac=$(mac)&ip=$(ip)&pub_key=${apiKey}`;
}
