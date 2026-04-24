/**
 * 🛰️ MikhmoAI Logic (Frontend Port) - v2.7
 * Logique de détection intelligente MikhmoPro/MikhmoAI.
 * Supporte : 100F4h, 200F-6h, 500F_24h, 1000FCFA-30J, etc.
 */

export interface ProfileMeta {
  price: string;
  duration: string;
  numericPrice: number;
  isSaleable: boolean; 
  cleanLabel: string;   
}

/**
 * Extrait les données depuis un nom de profil MikroTik
 */
export function parseProfileLabel(rawName: any): ProfileMeta {
  const nameStr = String(rawName || '');
  const upper = nameStr.toUpperCase();

  // 1. Regex MikhmoAI Globale : cherche "Nombre + F" suivi optionnellement d'un séparateur et d'une "Durée"
  // On cherche le bloc de vente type : 100F4H ou 200F-6H
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

    // Normalisation de la durée
    if (rawDurUnit.startsWith('H')) duration = `${rawDurVal}H`;
    else if (rawDurUnit.startsWith('J') || rawDurUnit.startsWith('D')) duration = `${rawDurVal}J`;
    else if (rawDurUnit.startsWith('M')) duration = `${rawDurVal}min`;
    else if (rawDurUnit.startsWith('W') || rawDurUnit.startsWith('S')) duration = `${rawDurVal} sem.`;
    
    cleanLabel = `${rawPrice}F-${duration}`;
    isSaleable = true;
  } else {
    // Fallback : tentative d'extraction séparée si le format n'est pas collé
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

  return { 
    price: String(price), 
    duration: String(duration), 
    numericPrice: Number(numericPrice) || 0,
    isSaleable,
    cleanLabel: String(cleanLabel)
  };
}

export function cleanProfileName(name: any): string {
  const meta = parseProfileLabel(name);
  return meta.cleanLabel;
}
