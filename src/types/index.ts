export interface CdiInputs {
  brutAnnuel: number;
  statut: 'cadre' | 'non-cadre' | 'personnalise';
  tauxChargesPersonnalise?: number;
  tauxPrelevementSource: number; // taux PAS en %, défaut 10
}

export interface FreelanceInputs {
  tjm: number;
  joursAnnuel: number;
}

export interface CdiResults {
  netAvantIR: number;        // brut × (1 − tauxCharges) — net après charges salariales
  prelevementSource: number; // netAvantIR × tauxPAS
  netAnnuel: number;         // netAvantIR − prelevementSource — net après IR (base de comparaison)
  netMensuel: number;
  coutEmployeurAnnuel: number;
  tjmEquivalent: number;
  tauxChargesApplique: number;
}

export interface FreelanceResults {
  caAnnuel: number;
  cotisationsSociales: number;   // 26,16 % du CA
  cfp: number;                   // 0,2 % du CA — Contribution à la Formation Professionnelle
  versementLiberatoire: number;  // 2,2 % du CA — Versement libératoire IR (BNC services)
  totalPrelevements: number;     // cotisationsSociales + cfp + versementLiberatoire
  netAnnuel: number;             // CA − totalPrelevements (net après IR)
  netMensuel: number;
}

export interface ComparisonResults {
  winner: 'cdi' | 'freelance' | 'equal';
  ecartAnnuel: number;
  ecartPourcentage: number;
  tjmBreakEven: number;
  brutCdiBreakEven: number;
}
