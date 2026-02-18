import type { CdiInputs, FreelanceInputs, CdiResults, FreelanceResults, ComparisonResults } from '@/types';

const TAUX_CHARGES_CADRE = 0.25;
const TAUX_CHARGES_NON_CADRE = 0.22;
const TAUX_CHARGES_PATRONALES = 0.42;
const JOURS_ANNUEL_DEFAULT = 218;
const TAUX_PAS_DEFAULT = 0.10; // Prélèvement à la source par défaut

// Auto-entrepreneur — prestations de services BNC (taux 2025)
const TAUX_COTISATIONS_AE = 0.2616;   // Cotisations sociales URSSAF
const TAUX_CFP_AE = 0.002;            // Contribution à la Formation Professionnelle
const TAUX_VL_AE = 0.022;             // Versement libératoire de l'impôt sur le revenu (BNC services)
const TAUX_TOTAL_AE = TAUX_COTISATIONS_AE + TAUX_CFP_AE + TAUX_VL_AE; // 28,56 %

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

export function calculateFreelance(inputs: FreelanceInputs): FreelanceResults {
  const caAnnuel = inputs.tjm * inputs.joursAnnuel;
  const cotisationsSociales = caAnnuel * TAUX_COTISATIONS_AE;
  const cfp = caAnnuel * TAUX_CFP_AE;
  const versementLiberatoire = caAnnuel * TAUX_VL_AE;
  const totalPrelevements = caAnnuel * TAUX_TOTAL_AE;
  const netAnnuel = caAnnuel - totalPrelevements;

  return {
    caAnnuel,
    cotisationsSociales,
    cfp,
    versementLiberatoire,
    totalPrelevements,
    netAnnuel,
    netMensuel: netAnnuel / 12,
  };
}

export function calculateComparison(
  cdiResults: CdiResults,
  freelanceResults: FreelanceResults,
  cdiInputs: CdiInputs,
  freelanceInputs: FreelanceInputs
): ComparisonResults {
  // Les deux nets sont après IR — comparaison équitable
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

  // TJM break-even : quel TJM AE pour égaler le net CDI après IR ?
  const tjmBreakEven = freelanceInputs.joursAnnuel > 0
    ? cdiResults.netAnnuel / (freelanceInputs.joursAnnuel * (1 - TAUX_TOTAL_AE))
    : 0;

  // Brut CDI break-even : quel brut CDI pour égaler le net AE après IR ?
  // netAnnuelCDI = brut × (1 − tauxCharges) × (1 − tauxPAS) = AE net
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
