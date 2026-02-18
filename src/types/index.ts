export interface CdiInputs {
  brutAnnuel: number;
  statut: 'cadre' | 'non-cadre' | 'personnalise';
  tauxChargesPersonnalise?: number;
}

export interface FreelanceInputs {
  tjm: number;
  joursAnnuel: number;
}

export interface CdiResults {
  netAnnuel: number;
  netMensuel: number;
  coutEmployeurAnnuel: number;
  tjmEquivalent: number;
  tauxChargesApplique: number;
}

export interface FreelanceResults {
  caAnnuel: number;
  cotisations: number;
  netAnnuel: number;
  netMensuel: number;
}

export interface ComparisonResults {
  winner: 'cdi' | 'freelance' | 'equal';
  ecartAnnuel: number;
  ecartPourcentage: number;
  tjmBreakEven: number;
  brutCdiBreakEven: number;
}
