/**
 * 🛰️ MikhmoAI Logic (Frontend Port)
 * Logique de parsing robuste héritée de l'application mobile.
 */

export interface ProfileMeta {
  price: string;
  duration: string;
  numericPrice: number;
}

/**
 * Extrait les données structurées depuis un nom de profil MikroTik
 */
export function parseProfileLabel(profileName: any): ProfileMeta {
  // SÉCURITÉ : On force en string
  const nameStr = String(profileName || '');
  const upper = nameStr.toUpperCase();

  // 💰 Prix
  const priceMatch = upper.match(/(\d[\d\s]*)\s*F(?:CFA)?/i);
  const price = priceMatch ? `${priceMatch[1].trim()} FCFA` : nameStr;
  const numericPrice = priceMatch ? parseInt(priceMatch[1].replace(/\s/g, ''), 10) : 0;

  // ⏳ Durée
  const durationMatch = upper.match(/(\d+)\s*(H(?:EURE)?S?|J(?:OUR)?S?|D(?:AY)?S?|M(?:IN)?|W(?:EEK)?S?)/i);
  let duration = '';
  if (durationMatch) {
    const val = durationMatch[1];
    const unit = durationMatch[2].toUpperCase();
    if (unit.startsWith('H')) duration = `${val}H`;
    else if (unit.startsWith('J') || unit.startsWith('D')) duration = `${val}J`;
    else if (unit.startsWith('M')) duration = `${val}min`;
    else if (unit.startsWith('W')) duration = `${val} sem.`;
  }

  return { 
    price: String(price), 
    duration: String(duration), 
    numericPrice: Number(numericPrice) || 0 
  };
}

export function cleanProfileName(name: any): string {
  return String(name || '').replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
}
