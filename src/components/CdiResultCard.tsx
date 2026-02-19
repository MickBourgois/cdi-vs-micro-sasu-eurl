import { CdiInputs, CdiResults } from '@/types';
import Tooltip from '@/components/Tooltip';

const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount);

interface CdiResultCardProps {
  results: CdiResults | null;
  inputs: CdiInputs;
}

export default function CdiResultCard({ results, inputs }: CdiResultCardProps) {
  if (!results || inputs.brutAnnuel === 0) {
    return (
      <div className="rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/10 p-6 text-center text-blue-300 dark:text-blue-700/60 text-sm">
        Saisissez un salaire brut
      </div>
    );
  }

  const tauxLabel =
    inputs.statut === 'cadre'
      ? '25% cadre'
      : inputs.statut === 'non-cadre'
      ? '22% non-cadre'
      : `${(results.tauxChargesApplique * 100).toFixed(0)}% personnalisé`;

  const pasLabel = `PAS ${inputs.tauxPrelevementSource}%`;

  return (
    <div className="rounded-xl border border-blue-100 dark:border-blue-900/40 bg-white dark:bg-[#0F0F1C] shadow-sm overflow-hidden">
      {/* Subheader */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border-b border-blue-100 dark:border-blue-900/40 px-4 py-2 flex items-center justify-between">
        <p className="text-xs text-blue-500 dark:text-blue-400 font-medium">Charges salariales : {tauxLabel}</p>
        <p className="text-xs text-blue-400 dark:text-blue-500">{pasLabel}</p>
      </div>

      {/* Hero KPI */}
      <div className="px-5 pt-5 pb-4 text-center border-b border-gray-100 dark:border-white/5">
        <p className="text-[10px] font-display font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Net mensuel après IR</p>
        <p className="font-mono text-4xl font-bold tabular-nums text-gray-900 dark:text-white">{formatCurrency(results.netMensuel)}</p>
        <p className="font-mono text-sm tabular-nums text-gray-400 dark:text-gray-500 mt-1">
          {formatCurrency(results.netAnnuel)}<span className="font-sans text-xs"> /an</span>
        </p>
      </div>

      {/* Secondary breakdown */}
      <div className="p-4 grid grid-cols-3 gap-3">
        <div className="space-y-0.5">
          <p className="text-xs text-gray-400 dark:text-gray-500">Net avant IR</p>
          <p className="font-mono font-semibold text-gray-600 dark:text-gray-400 tabular-nums text-sm">{formatCurrency(results.netAvantIR)}</p>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 tabular-nums">
            PAS : −{formatCurrency(results.prelevementSource)}
          </p>
        </div>
        <div className="space-y-0.5">
          <p className="text-xs text-gray-400 dark:text-gray-500 inline-flex items-center">
            Coût employeur/an
            <Tooltip text="Coût total supporté par l'entreprise : salaire brut × 1,42 (charges patronales incluses)." />
          </p>
          <p className="font-mono font-semibold text-gray-600 dark:text-gray-400 tabular-nums text-sm">{formatCurrency(results.coutEmployeurAnnuel)}</p>
        </div>
        <div className="space-y-0.5">
          <p className="text-xs text-gray-400 dark:text-gray-500 inline-flex items-center">
            TJM équivalent
            <Tooltip text="Le TJM qu'un freelance devrait facturer pour que son coût soit identique à celui de votre poste CDI (coût employeur ÷ jours travaillés)." />
          </p>
          <p className="font-mono font-bold text-blue-600 dark:text-blue-400 tabular-nums text-sm">
            {formatCurrency(results.tjmEquivalent)}<span className="font-normal">/j</span>
          </p>
        </div>
      </div>
    </div>
  );
}
