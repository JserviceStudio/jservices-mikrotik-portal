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
