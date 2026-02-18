export interface CdiInputs {
  brutAnnuel: number;
  statut: 'cadre' | 'non-cadre' | 'personnalise';
  tauxChargesPersonnalise?: number;
  tauxPrelevementSource: number; // taux PAS en %, défaut 10
}

// ─── Freelance inputs (discriminated union) ───────────────────────────────────

export interface MicroInputs {
  structure: 'micro';
  tjm: number;
  joursAnnuel: number;
}

/** SASU — Président assimilé salarié */
export interface SasuInputs {
  structure: 'sasu';
  tjm: number;
  joursAnnuel: number;
  salaireBrutAnnuel: number; // rémunération brute versée au président (peut être 0)
}

/** EURL — Gérant majoritaire (TNS) */
export interface EurlInputs {
  structure: 'eurl';
  tjm: number;
  joursAnnuel: number;
  remunerationAnnuelle: number; // rémunération brute du gérant (peut être 0)
  capitalSocial: number;         // pour calcul du seuil 10% dividendes (défaut 1 000 €)
}

export type FreelanceInputs = MicroInputs | SasuInputs | EurlInputs;

// ─── Freelance results (discriminated union) ──────────────────────────────────

export interface MicroResults {
  structure: 'micro';
  caAnnuel: number;
  cotisationsSociales: number;   // 26,16 % du CA
  cfp: number;                   // 0,20 % du CA
  versementLiberatoire: number;  // 2,20 % du CA (IR inclus)
  totalPrelevements: number;     // 28,56 % du CA
  netAnnuel: number;             // net après IR
  netMensuel: number;
}

export interface SasuResults {
  structure: 'sasu';
  caAnnuel: number;
  // Rémunération
  salaireBrut: number;
  chargesSalariales: number;     // ~22 % du brut salarié
  chargesPatronales: number;     // ~45 % du brut (simplifié)
  salaireNetAvantIR: number;     // salaireBrut × (1 − 0,22)
  salaireNetApresIR: number;     // salaireNetAvantIR × (1 − PAS)
  // Résultat société
  resultatAvantIS: number;       // CA − salaireBrut − chargesPatronales
  is: number;                    // IS 15 % / 25 %
  resultatNetIS: number;         // résultat après IS
  // Dividendes
  dividendesBruts: number;       // = resultatNetIS (tout distribué)
  flatTaxDividendes: number;     // 30 % flat tax (12,8 % IR + 17,2 % PS)
  dividendesNet: number;         // dividendes × 70 %
  // Total
  netAnnuel: number;             // salaireNetApresIR + dividendesNet
  netMensuel: number;
}

export interface EurlResults {
  structure: 'eurl';
  caAnnuel: number;
  // Rémunération TNS
  remuneration: number;
  assietteCotisations: number;   // rémunération × 0,74 (abattement 26 %)
  cotisationsTNS: number;        // ~45 % × assiette
  remunerationNetteAvantIR: number;
  remunerationNetteApresIR: number; // × (1 − PAS)
  // Résultat société
  resultatAvantIS: number;       // CA − rémunération
  is: number;
  resultatNetIS: number;
  // Dividendes
  dividendesBruts: number;       // = resultatNetIS
  seuilDividendes: number;       // capitalSocial × 10 %
  dividendesFlat: number;        // part ≤ seuil → flat tax 30 %
  dividendesSoumisRS: number;    // part > seuil → cotisations TNS
  cotisationsTNSDividendes: number;
  flatTaxDividendes: number;
  dividendesNet: number;
  // Total
  netAnnuel: number;
  netMensuel: number;
}

export type FreelanceResults = MicroResults | SasuResults | EurlResults;

// ─── CDI results ──────────────────────────────────────────────────────────────

export interface CdiResults {
  netAvantIR: number;        // brut × (1 − tauxCharges)
  prelevementSource: number; // netAvantIR × tauxPAS
  netAnnuel: number;         // netAvantIR − prelevementSource (base de comparaison)
  netMensuel: number;
  coutEmployeurAnnuel: number;
  tjmEquivalent: number;
  tauxChargesApplique: number;
}

// ─── Comparison results ───────────────────────────────────────────────────────

export interface ComparisonResults {
  winner: 'cdi' | 'freelance' | 'equal';
  ecartAnnuel: number;
  ecartPourcentage: number;
  tjmBreakEven: number;      // TJM min pour égaler le CDI (en micro) ou CA breakeven / jours
  brutCdiBreakEven: number;  // Brut CDI qui donnerait le même net
}
