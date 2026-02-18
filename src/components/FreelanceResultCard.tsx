import { FreelanceInputs, FreelanceResults } from '@/types';

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
      <div className="p-4 text-gray-500 text-sm">
        Saisissez un TJM
      </div>
    );
  }

  const cotisationsPct = ((results.cotisations / results.caAnnuel) * 100).toFixed(0);

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">Jours travaillés : {inputs.joursAnnuel} j/an</p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-gray-500">CA annuel brut</p>
          <p className="font-semibold">{formatCurrency(results.caAnnuel)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Cotisations sociales</p>
          <p className="font-semibold">{formatCurrency(results.cotisations)} ({cotisationsPct}%)</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Revenu net annuel</p>
          <p className="font-semibold">{formatCurrency(results.netAnnuel)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Revenu net mensuel</p>
          <p className="font-semibold">{formatCurrency(results.netMensuel)}</p>
        </div>
      </div>
    </div>
  );
}
