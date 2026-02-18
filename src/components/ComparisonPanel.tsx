import { ComparisonResults } from '@/types';
import Tooltip from '@/components/Tooltip';

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(n);

interface Props {
  comparison: ComparisonResults | null;
}

export default function ComparisonPanel({ comparison }: Props) {
  if (!comparison) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-8 text-center text-gray-400 dark:text-gray-500">
        Remplissez les deux côtés pour comparer
      </div>
    );
  }

  const { winner, ecartAnnuel, ecartPourcentage, tjmBreakEven, brutCdiBreakEven } = comparison;

  const winnerLabel =
    winner === 'cdi'
      ? 'Le CDI est plus avantageux'
      : winner === 'freelance'
      ? 'Le Freelance est plus avantageux'
      : 'Équivalent';

  const winnerBadge =
    winner === 'cdi'
      ? 'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700'
      : winner === 'freelance'
      ? 'bg-indigo-100 text-indigo-700 border border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-700'
      : 'bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';

  const winnerIcon =
    winner === 'equal' ? '⚖️' : '🏆';

  const ecartLabel =
    winner === 'equal'
      ? null
      : winner === 'cdi'
      ? `+${fmt(ecartAnnuel)}/an pour le CDI`
      : `+${fmt(ecartAnnuel)}/an pour le Freelance`;

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
      <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700 px-6 py-3">
        <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide text-center">Comparaison</h2>
      </div>

      <div className="p-6">
        {/* Verdict badge */}
        <div className="flex justify-center mb-4">
          <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${winnerBadge}`}>
            <span>{winnerIcon}</span>
            {winnerLabel}
          </span>
        </div>

        {/* Écart */}
        {winner !== 'equal' && ecartLabel && (
          <div className="text-center mb-6">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 tabular-nums">{ecartLabel}</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">soit {ecartPourcentage.toFixed(1)}% de différence</p>
          </div>
        )}

        {/* Break-even */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-700 pt-4">
          <div className="bg-indigo-50 dark:bg-indigo-950/30 rounded-lg p-4">
            <p className="text-xs text-indigo-500 dark:text-indigo-400 font-medium mb-1 inline-flex items-center">
              TJM break-even
              <Tooltip text="Le TJM minimum que le freelance doit facturer pour obtenir le même revenu net que le CDI, après tous prélèvements AE (28,56 % : cotisations 26,16 % + CFP 0,20 % + VL IR 2,20 %)." />
            </p>
            <p className="text-xl font-bold text-indigo-700 dark:text-indigo-300 tabular-nums">{fmt(tjmBreakEven)}/j</p>
            <p className="text-xs text-indigo-400 dark:text-indigo-500 mt-0.5">Pour égaler le revenu CDI</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
            <p className="text-xs text-blue-500 dark:text-blue-400 font-medium mb-1 inline-flex items-center">
              Brut CDI équivalent
              <Tooltip text="Le salaire brut annuel CDI qui offrirait le même revenu net que ce TJM en auto-entrepreneur, pour le même nombre de jours travaillés." />
            </p>
            <p className="text-xl font-bold text-blue-700 dark:text-blue-300 tabular-nums">{fmt(brutCdiBreakEven)}</p>
            <p className="text-xs text-blue-400 dark:text-blue-500 mt-0.5">Salaire brut équivalent</p>
          </div>
        </div>
      </div>
    </div>
  );
}
