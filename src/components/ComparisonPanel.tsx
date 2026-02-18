import { ComparisonResults } from '@/types';

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
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center text-gray-500">
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

  const winnerColor =
    winner === 'cdi'
      ? 'text-blue-600'
      : winner === 'freelance'
      ? 'text-indigo-600'
      : 'text-gray-600';

  const ecartLabel =
    winner === 'equal'
      ? 'Aucun écart'
      : winner === 'cdi'
      ? `+${fmt(ecartAnnuel)}/an pour le CDI`
      : `+${fmt(ecartAnnuel)}/an pour le Freelance`;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-center text-lg font-semibold text-gray-700">Comparaison</h2>

      <p className={`mb-1 text-center text-2xl font-bold ${winnerColor}`}>{winnerLabel}</p>

      {winner !== 'equal' && (
        <p className="mb-4 text-center text-sm text-gray-500">{ecartLabel}</p>
      )}

      {winner !== 'equal' && (
        <p className="mb-6 text-center text-sm text-gray-500">
          Écart : {ecartPourcentage.toFixed(1)}%
        </p>
      )}

      <div className="space-y-3 border-t border-gray-100 pt-4 text-sm text-gray-600">
        <p>
          <span className="font-medium">TJM break-even :</span> Pour égaler le CDI, il faut un TJM
          de <span className="font-semibold text-indigo-600">{fmt(tjmBreakEven)}/j</span>
        </p>
        <p>
          <span className="font-medium">Brut CDI équivalent :</span> Ce TJM équivaut à un brut CDI
          de <span className="font-semibold text-blue-600">{fmt(brutCdiBreakEven)}</span>
        </p>
      </div>
    </div>
  );
}
