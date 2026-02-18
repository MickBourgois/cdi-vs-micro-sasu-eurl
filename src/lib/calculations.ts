import type { CdiInputs, FreelanceInputs, CdiResults, FreelanceResults, ComparisonResults } from '@/types';

const TAUX_CHARGES_CADRE = 0.25;
const TAUX_CHARGES_NON_CADRE = 0.22;
const TAUX_CHARGES_PATRONALES = 0.42;
const TAUX_COTISATIONS_AE = 0.22;
const JOURS_ANNUEL_DEFAULT = 218;

function getTauxCharges(inputs: CdiInputs): number {
  if (inputs.statut === 'cadre') return TAUX_CHARGES_CADRE;
  if (inputs.statut === 'non-cadre') return TAUX_CHARGES_NON_CADRE;
  return (inputs.tauxChargesPersonnalise ?? 22) / 100;
}

export function calculateCdi(inputs: CdiInputs, joursAnnuel: number = JOURS_ANNUEL_DEFAULT): CdiResults {
  const tauxCharges = getTauxCharges(inputs);
  const netAnnuel = inputs.brutAnnuel * (1 - tauxCharges);
  const coutEmployeurAnnuel = inputs.brutAnnuel * (1 + TAUX_CHARGES_PATRONALES);
  const tjmEquivalent = joursAnnuel > 0 ? coutEmployeurAnnuel / joursAnnuel : 0;

  return {
    netAnnuel,
    netMensuel: netAnnuel / 12,
    coutEmployeurAnnuel,
    tjmEquivalent,
    tauxChargesApplique: tauxCharges,
  };
}

export function calculateFreelance(inputs: FreelanceInputs): FreelanceResults {
  const caAnnuel = inputs.tjm * inputs.joursAnnuel;
  const cotisations = caAnnuel * TAUX_COTISATIONS_AE;
  const netAnnuel = caAnnuel * (1 - TAUX_COTISATIONS_AE);

  return {
    caAnnuel,
    cotisations,
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
  const tjmBreakEven = freelanceInputs.joursAnnuel > 0
    ? cdiResults.netAnnuel / (freelanceInputs.joursAnnuel * (1 - TAUX_COTISATIONS_AE))
    : 0;
  const brutCdiBreakEven = tauxCharges < 1
    ? freelanceResults.netAnnuel / (1 - tauxCharges)
    : 0;

  return {
    winner,
    ecartAnnuel,
    ecartPourcentage,
    tjmBreakEven,
    brutCdiBreakEven,
  };
}
