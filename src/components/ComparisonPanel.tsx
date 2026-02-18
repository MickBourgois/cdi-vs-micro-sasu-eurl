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
  structure?: 'micro' | 'sasu' | 'eurl';
}

function getTjmBreakEvenTooltip(structure?: 'micro' | 'sasu' | 'eurl'): string {
  if (structure === 'sasu') {
    return 'Le TJM minimum à facturer en SASU pour obtenir le même revenu net disponible que le CDI (salaire + dividendes), avec la répartition salaire/dividendes actuelle.';
  }
  if (structure === 'eurl') {
    return "Le TJM minimum à facturer en EURL pour obtenir le même revenu net disponible que le CDI (rémunération + dividendes), avec la rémunération gérant actuelle.";
  }
  return 'Le TJM minimum que le freelance doit facturer pour obtenir le même revenu net que le CDI, après tous prélèvements AE (28,56 % : cotisations 26,16 % + CFP 0,20 % + VL IR 2,20 %).';
}

function getStructureLabel(structure?: 'micro' | 'sasu' | 'eurl'): string {
  if (structure === 'sasu') return 'SASU';
  if (structure === 'eurl') return 'EURL';
  return 'Freelance';
}

export default function ComparisonPanel({ comparison, structure }: Props) {
  if (!comparison) {
    return (
      <div className="rounded-xl border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0F0F1C] p-10 text-center text-gray-400 dark:text-gray-600 text-sm">
        Remplissez les deux côtés pour comparer
      </div>
    );
  }

  const { winner, ecartAnnuel, ecartPourcentage, tjmBreakEven, brutCdiBreakEven } = comparison;
  const structureLabel = getStructureLabel(structure);

  const winnerLabel =
    winner === 'cdi'
      ? 'Le CDI est plus avantageux'
      : winner === 'freelance'
      ? `Le ${structureLabel} est plus avantageux`
      : 'Équivalent';

  const winnerBadge =
    winner === 'cdi'
      ? 'bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700/50'
      : winner === 'freelance'
      ? 'bg-indigo-100 text-indigo-700 border border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700/50'
      : 'bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';

  const winnerIcon = winner === 'equal' ? '⚖️' : '🏆';

  const winnerColor =
    winner === 'cdi'
      ? 'text-blue-600 dark:text-blue-400'
      : winner === 'freelance'
      ? 'text-indigo-600 dark:text-indigo-400'
      : 'text-gray-600 dark:text-gray-400';

  const winnerName = winner === 'cdi' ? 'CDI' : structureLabel;

  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/5 bg-white dark:bg-[#0F0F1C] shadow-sm overflow-hidden">
      <div className="bg-gray-50/80 dark:bg-white/3 border-b border-gray-100 dark:border-white/5 px-6 py-3">
        <h2 className="font-display text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-center">Comparaison</h2>
      </div>

      <div className="px-6 py-8 md:px-10 md:py-10">
        {/* Winner badge */}
        <div className="flex justify-center mb-6">
          <span className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold ${winnerBadge}`}>
            <span>{winnerIcon}</span>
            {winnerLabel}
          </span>
        </div>

        {/* Écart — hero number */}
        {winner !== 'equal' && (
          <div className="text-center mb-8">
            <p className="font-mono text-5xl md:text-6xl font-black tabular-nums text-gray-900 dark:text-white tracking-tight">
              +{fmt(Math.abs(ecartAnnuel))}
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              par an pour{' '}
              <span className={`font-semibold ${winnerColor}`}>le {winnerName}</span>
              <span className="mx-2 text-gray-300 dark:text-gray-600">·</span>
              <span>{ecartPourcentage.toFixed(1)}% de différence</span>
            </p>
          </div>
        )}

        {/* Break-even */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 dark:border-white/5 pt-6">
          <div className="bg-indigo-50 dark:bg-indigo-950/20 rounded-xl p-5 border border-indigo-100 dark:border-indigo-900/30">
            <p className="text-[10px] font-display font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-2 inline-flex items-center">
              TJM break-even
              <Tooltip text={getTjmBreakEvenTooltip(structure)} />
            </p>
            <p className="font-mono text-2xl font-bold text-indigo-700 dark:text-indigo-300 tabular-nums">
              {fmt(tjmBreakEven)}<span className="text-base font-normal">/j</span>
            </p>
            <p className="text-xs text-indigo-400 dark:text-indigo-500 mt-1.5">Pour égaler le revenu CDI</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl p-5 border border-blue-100 dark:border-blue-900/30">
            <p className="text-[10px] font-display font-semibold text-blue-500 dark:text-blue-400 uppercase tracking-widest mb-2 inline-flex items-center">
              Brut CDI équivalent
              <Tooltip text={`Le salaire brut annuel CDI qui offrirait le même revenu net que ce ${structureLabel}, pour le même nombre de jours travaillés.`} />
            </p>
            <p className="font-mono text-2xl font-bold text-blue-700 dark:text-blue-300 tabular-nums">{fmt(brutCdiBreakEven)}</p>
            <p className="text-xs text-blue-400 dark:text-blue-500 mt-1.5">Salaire brut équivalent</p>
          </div>
        </div>
      </div>
    </div>
  );
}
