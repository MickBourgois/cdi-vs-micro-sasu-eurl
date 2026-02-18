import { FreelanceInputs, FreelanceResults } from '@/types';
import Tooltip from '@/components/Tooltip';

const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount);

interface FreelanceResultCardProps {
  results: FreelanceResults | null;
  inputs: FreelanceInputs;
}

export default function FreelanceResultCard({ results, inputs }: FreelanceResultCardProps) {
  if (!results || inputs.tjm === 0) {
    return (
      <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-6 text-center text-indigo-300 text-sm">
        Saisissez un TJM
      </div>
    );
  }

  const cotisationsPct = ((results.cotisations / results.caAnnuel) * 100).toFixed(0);

  return (
    <div className="rounded-xl border border-indigo-100 bg-white shadow-sm overflow-hidden">
      <div className="bg-indigo-50 border-b border-indigo-100 px-4 py-2">
        <p className="text-xs text-indigo-500 font-medium">Jours travaillés : {inputs.joursAnnuel} j/an</p>
      </div>
      <div className="p-4 grid grid-cols-2 gap-4">
        <div className="space-y-0.5">
          <p className="text-xs text-gray-400">CA annuel brut</p>
          <p className="font-bold text-gray-900 tabular-nums">{formatCurrency(results.caAnnuel)}</p>
        </div>
        <div className="space-y-0.5">
          <p className="text-xs text-gray-400 inline-flex items-center">
            Cotisations sociales
            <Tooltip text="En auto-entrepreneur, les cotisations URSSAF représentent 22% du chiffre d'affaires brut. Elles couvrent retraite, maladie et autres charges sociales." />
          </p>
          <p className="font-bold text-gray-900 tabular-nums">
            {formatCurrency(results.cotisations)}{' '}
            <span className="text-xs font-normal text-gray-400">({cotisationsPct}%)</span>
          </p>
        </div>
        <div className="space-y-0.5">
          <p className="text-xs text-gray-400">Revenu net annuel</p>
          <p className="font-bold text-gray-900 tabular-nums">{formatCurrency(results.netAnnuel)}</p>
        </div>
        <div className="space-y-0.5">
          <p className="text-xs text-gray-400">Revenu net mensuel</p>
          <p className="font-bold text-indigo-600 tabular-nums">{formatCurrency(results.netMensuel)}</p>
        </div>
      </div>
    </div>
  );
}
