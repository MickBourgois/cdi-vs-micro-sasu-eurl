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
      <div className="rounded-xl border border-blue-100 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20 p-6 text-center text-blue-300 dark:text-blue-700 text-sm">
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

  const pasLabel = `${inputs.tauxPrelevementSource}% PAS`;

  return (
    <div className="rounded-xl border border-blue-100 dark:border-blue-900 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
      <div className="bg-blue-50 dark:bg-blue-950/30 border-b border-blue-100 dark:border-blue-900 px-4 py-2 flex items-center justify-between">
        <p className="text-xs text-blue-500 dark:text-blue-400 font-medium">Charges salariales : {tauxLabel}</p>
        <p className="text-xs text-blue-400 dark:text-blue-500">{pasLabel}</p>
      </div>
      <div className="p-4 grid grid-cols-2 gap-4">
        <div className="space-y-0.5">
          <p className="text-xs text-gray-400 dark:text-gray-500">Net avant IR</p>
          <p className="font-semibold text-gray-600 dark:text-gray-400 tabular-nums text-sm">{formatCurrency(results.netAvantIR)}</p>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 tabular-nums">
            PAS : −{formatCurrency(results.prelevementSource)}
          </p>
        </div>
        <div className="space-y-0.5">
          <p className="text-xs text-gray-400 dark:text-gray-500 inline-flex items-center">
            Net après IR (annuel)
            <Tooltip text="Salaire net après charges salariales et prélèvement à la source. C'est la base de comparaison avec le freelance." />
          </p>
          <p className="font-bold text-gray-900 dark:text-gray-100 tabular-nums">{formatCurrency(results.netAnnuel)}</p>
        </div>
        <div className="space-y-0.5">
          <p className="text-xs text-gray-400 dark:text-gray-500">Net après IR (mensuel)</p>
          <p className="font-bold text-gray-900 dark:text-gray-100 tabular-nums">{formatCurrency(results.netMensuel)}</p>
        </div>
        <div className="space-y-0.5">
          <p className="text-xs text-gray-400 dark:text-gray-500 inline-flex items-center">
            Coût employeur/an
            <Tooltip text="Coût total supporté par l'entreprise : salaire brut × 1,42 (charges patronales incluses)." />
          </p>
          <p className="font-bold text-gray-900 dark:text-gray-100 tabular-nums">{formatCurrency(results.coutEmployeurAnnuel)}</p>
        </div>
        <div className="space-y-0.5 col-span-2">
          <p className="text-xs text-gray-400 dark:text-gray-500 inline-flex items-center">
            TJM équivalent mission
            <Tooltip text="Le TJM qu'un freelance devrait facturer pour que son coût soit identique à celui de votre poste CDI (coût employeur ÷ jours travaillés)." />
          </p>
          <p className="font-bold text-blue-600 dark:text-blue-400 tabular-nums">{formatCurrency(results.tjmEquivalent)}/j</p>
        </div>
      </div>
    </div>
  );
}
