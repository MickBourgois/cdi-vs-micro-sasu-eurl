import type {
  CdiInputs,
  CdiResults,
  FreelanceInputs,
  FreelanceResults,
  MicroInputs,
  MicroResults,
  SasuInputs,
  SasuResults,
  EurlInputs,
  EurlResults,
  ComparisonResults,
} from '@/types';

// ─── Constantes CDI (existantes) ─────────────────────────────────────────────

const TAUX_CHARGES_CADRE = 0.25;
const TAUX_CHARGES_NON_CADRE = 0.22;
const TAUX_CHARGES_PATRONALES = 0.42;
const JOURS_ANNUEL_DEFAULT = 218;
const TAUX_PAS_DEFAULT = 0.10;

// ─── Constantes Auto-entrepreneur (existantes) ───────────────────────────────

const TAUX_COTISATIONS_AE = 0.2616;
const TAUX_CFP_AE = 0.002;
const TAUX_VL_AE = 0.022;
const TAUX_TOTAL_AE = TAUX_COTISATIONS_AE + TAUX_CFP_AE + TAUX_VL_AE; // 28,56 %

// ─── Constantes SASU ─────────────────────────────────────────────────────────

const TAUX_CHARGES_SAL_SASU = 0.22;   // Charges salariales (pas de chômage)
const TAUX_CHARGES_PAT_SASU = 0.45;   // Charges patronales (moyenne pondérée)
const FLAT_TAX = 0.30;                // 12,8 % IR + 17,2 % PS

// ─── Constantes EURL ─────────────────────────────────────────────────────────

const ABATTEMENT_EURL = 0.26;                // Abattement assiette unique 2025
const TAUX_TNS_EURL = 0.45;                  // Cotisations TNS totales
const SEUIL_DIVIDENDES_EURL_PCT = 0.10;      // 10 % du capital social

// ─── Constantes IS ───────────────────────────────────────────────────────────

const SEUIL_IS_REDUIT = 42500;
const TAUX_IS_REDUIT = 0.15;
const TAUX_IS_NORMAL = 0.25;

// ─── Utilitaires internes ────────────────────────────────────────────────────

function calculateIS(resultat: number): number {
  if (resultat <= 0) return 0;
  if (resultat <= SEUIL_IS_REDUIT) {
    return resultat * TAUX_IS_REDUIT;
  }
  return SEUIL_IS_REDUIT * TAUX_IS_REDUIT + (resultat - SEUIL_IS_REDUIT) * TAUX_IS_NORMAL;
}


// ─── CDI (inchangé) ──────────────────────────────────────────────────────────

function getTauxCharges(inputs: CdiInputs): number {
  if (inputs.statut === 'cadre') return TAUX_CHARGES_CADRE;
  if (inputs.statut === 'non-cadre') return TAUX_CHARGES_NON_CADRE;
  return (inputs.tauxChargesPersonnalise ?? 22) / 100;
}

export function calculateCdi(inputs: CdiInputs, joursAnnuel: number = JOURS_ANNUEL_DEFAULT): CdiResults {
  const tauxCharges = getTauxCharges(inputs);
  const tauxPAS = (inputs.tauxPrelevementSource ?? TAUX_PAS_DEFAULT * 100) / 100;

  const netAvantIR = inputs.brutAnnuel * (1 - tauxCharges);
  const prelevementSource = netAvantIR * tauxPAS;
  const netAnnuel = netAvantIR - prelevementSource;

  const coutEmployeurAnnuel = inputs.brutAnnuel * (1 + TAUX_CHARGES_PATRONALES);
  const tjmEquivalent = joursAnnuel > 0 ? coutEmployeurAnnuel / joursAnnuel : 0;

  return {
    netAvantIR,
    prelevementSource,
    netAnnuel,
    netMensuel: netAnnuel / 12,
    coutEmployeurAnnuel,
    tjmEquivalent,
    tauxChargesApplique: tauxCharges,
  };
}

// ─── Micro-entreprise ────────────────────────────────────────────────────────

export function calculateMicro(inputs: MicroInputs): MicroResults {
  const caAnnuel = inputs.tjm * inputs.joursAnnuel;
  const cotisationsSociales = caAnnuel * TAUX_COTISATIONS_AE;
  const cfp = caAnnuel * TAUX_CFP_AE;
  const versementLiberatoire = caAnnuel * TAUX_VL_AE;
  const totalPrelevements = caAnnuel * TAUX_TOTAL_AE;
  const netAnnuel = caAnnuel - totalPrelevements;

  return {
    structure: 'micro',
    caAnnuel,
    cotisationsSociales,
    cfp,
    versementLiberatoire,
    totalPrelevements,
    netAnnuel,
    netMensuel: netAnnuel / 12,
  };
}

// ─── SASU ────────────────────────────────────────────────────────────────────

export function calculateSasu(inputs: SasuInputs, tauxPas: number = 10): SasuResults {
  const tauxPAS = tauxPas / 100;
  const caAnnuel = inputs.tjm * inputs.joursAnnuel;
  const salaireBrut = Math.min(inputs.salaireBrutAnnuel, caAnnuel);

  const chargesSalariales = salaireBrut * TAUX_CHARGES_SAL_SASU;
  const chargesPatronales = salaireBrut * TAUX_CHARGES_PAT_SASU;
  const salaireNetAvantIR = salaireBrut * (1 - TAUX_CHARGES_SAL_SASU);
  const salaireNetApresIR = salaireNetAvantIR * (1 - tauxPAS);

  const resultatAvantIS = Math.max(0, caAnnuel - salaireBrut - chargesPatronales);
  const is = calculateIS(resultatAvantIS);
  const resultatNetIS = resultatAvantIS - is;

  const dividendesBruts = resultatNetIS;
  const flatTaxDividendes = dividendesBruts * FLAT_TAX;
  const dividendesNet = dividendesBruts * (1 - FLAT_TAX);

  const netAnnuel = salaireNetApresIR + dividendesNet;

  return {
    structure: 'sasu',
    caAnnuel,
    salaireBrut,
    chargesSalariales,
    chargesPatronales,
    salaireNetAvantIR,
    salaireNetApresIR,
    resultatAvantIS,
    is,
    resultatNetIS,
    dividendesBruts,
    flatTaxDividendes,
    dividendesNet,
    netAnnuel,
    netMensuel: netAnnuel / 12,
  };
}

// ─── EURL ────────────────────────────────────────────────────────────────────

export function calculateEurl(inputs: EurlInputs, tauxPas: number = 10): EurlResults {
  const tauxPAS = tauxPas / 100;
  const caAnnuel = inputs.tjm * inputs.joursAnnuel;
  const remuneration = Math.min(inputs.remunerationAnnuelle, caAnnuel);

  const assietteCotisations = remuneration * (1 - ABATTEMENT_EURL);
  const cotisationsTNS = assietteCotisations * TAUX_TNS_EURL;
  const remunerationNetteAvantIR = remuneration - cotisationsTNS;
  const remunerationNetteApresIR = remunerationNetteAvantIR * (1 - tauxPAS);

  const resultatAvantIS = Math.max(0, caAnnuel - remuneration);
  const is = calculateIS(resultatAvantIS);
  const resultatNetIS = resultatAvantIS - is;

  const dividendesBruts = resultatNetIS;
  const seuilDividendes = inputs.capitalSocial * SEUIL_DIVIDENDES_EURL_PCT;

  const dividendesFlat = Math.min(dividendesBruts, seuilDividendes);
  const dividendesSoumisRS = Math.max(0, dividendesBruts - seuilDividendes);

  const cotisationsTNSDividendes = dividendesSoumisRS * (1 - ABATTEMENT_EURL) * TAUX_TNS_EURL;
  const netDividendesSoumisRS = dividendesSoumisRS - cotisationsTNSDividendes;

  const flatTaxDividendes = dividendesFlat * FLAT_TAX;
  const netDividendesFlat = dividendesFlat * (1 - FLAT_TAX);

  const dividendesNet = netDividendesSoumisRS + netDividendesFlat;
  const netAnnuel = remunerationNetteApresIR + dividendesNet;

  return {
    structure: 'eurl',
    caAnnuel,
    remuneration,
    assietteCotisations,
    cotisationsTNS,
    remunerationNetteAvantIR,
    remunerationNetteApresIR,
    resultatAvantIS,
    is,
    resultatNetIS,
    dividendesBruts,
    seuilDividendes,
    dividendesFlat,
    dividendesSoumisRS,
    cotisationsTNSDividendes,
    flatTaxDividendes,
    dividendesNet,
    netAnnuel,
    netMensuel: netAnnuel / 12,
  };
}

// ─── Dispatcher principal ────────────────────────────────────────────────────

export function calculateFreelance(inputs: FreelanceInputs, tauxPas?: number): FreelanceResults {
  switch (inputs.structure) {
    case 'micro':
      return calculateMicro(inputs);
    case 'sasu':
      return calculateSasu(inputs, tauxPas);
    case 'eurl':
      return calculateEurl(inputs, tauxPas);
  }
}

// ─── Break-even TJM (recherche binaire) ──────────────────────────────────────

function findBreakEvenTjm(
  target: number,
  inputs: FreelanceInputs,
  tauxPas: number
): number {
  const jours = inputs.joursAnnuel;
  if (jours <= 0) return 0;

  if (inputs.structure === 'micro') {
    return target / (jours * (1 - TAUX_TOTAL_AE));
  }

  // Binary search for SASU and EURL
  let lo = 0;
  let hi = target * 20;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    const testInputs = { ...inputs, tjm: mid / jours };
    const results = calculateFreelance(testInputs, tauxPas);
    if (results.netAnnuel < target) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2 / jours;
}

// ─── Comparaison ─────────────────────────────────────────────────────────────

export function calculateComparison(
  cdiResults: CdiResults,
  freelanceResults: FreelanceResults,
  cdiInputs: CdiInputs,
  freelanceInputs: FreelanceInputs
): ComparisonResults {
  const ecartAnnuel = freelanceResults.netAnnuel - cdiResults.netAnnuel;
  const ecartPourcentage = cdiResults.netAnnuel > 0
    ? (ecartAnnuel / cdiResults.netAnnuel) * 100
    : 0;

  let winner: 'cdi' | 'freelance' | 'equal';
  if (Math.abs(ecartAnnuel) < 1) {
    winner = 'equal';
  } else if (ecartAnnuel > 0) {
    winner = 'freelance';
  } else {
    winner = 'cdi';
  }

  const tauxCharges = cdiResults.tauxChargesApplique;
  const tauxPAS = (cdiInputs.tauxPrelevementSource ?? 10) / 100;

  // TJM break-even via binary search (or direct formula for micro)
  const tjmBreakEven = findBreakEvenTjm(
    cdiResults.netAnnuel,
    freelanceInputs,
    cdiInputs.tauxPrelevementSource ?? 10
  );

  // Brut CDI break-even : quel brut CDI pour égaler le net freelance après IR ?
  const denominateur = (1 - tauxCharges) * (1 - tauxPAS);
  const brutCdiBreakEven = denominateur > 0
    ? freelanceResults.netAnnuel / denominateur
    : 0;

  return {
    winner,
    ecartAnnuel,
    ecartPourcentage,
    tjmBreakEven,
    brutCdiBreakEven,
  };
}
