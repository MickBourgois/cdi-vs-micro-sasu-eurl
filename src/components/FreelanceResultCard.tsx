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
      <div className="rounded-xl border border-indigo-100 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/20 p-6 text-center text-indigo-300 dark:text-indigo-700 text-sm">
        Saisissez un TJM
      </div>
    );
  }

  const totalPct = ((results.totalPrelevements / results.caAnnuel) * 100).toFixed(2);

  return (
    <div className="rounded-xl border border-indigo-100 dark:border-indigo-900 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
      <div className="bg-indigo-50 dark:bg-indigo-950/30 border-b border-indigo-100 dark:border-indigo-900 px-4 py-2">
        <p className="text-xs text-indigo-500 dark:text-indigo-400 font-medium">Jours travaillés : {inputs.joursAnnuel} j/an</p>
      </div>
      <div className="p-4 grid grid-cols-2 gap-4">
        <div className="space-y-0.5">
          <p className="text-xs text-gray-400 dark:text-gray-500">CA annuel brut</p>
          <p className="font-bold text-gray-900 dark:text-gray-100 tabular-nums">{formatCurrency(results.caAnnuel)}</p>
        </div>
        <div className="space-y-0.5">
          <p className="text-xs text-gray-400 dark:text-gray-500 inline-flex items-center">
            Total prélèvements
            <Tooltip text={`Décomposition des prélèvements sur le CA :\n• Cotisations sociales URSSAF : 26,16 %\n• Formation professionnelle (CFP) : 0,20 %\n• Versement libératoire IR (BNC services) : 2,20 %\nTotal : 28,56 % — Le net inclut donc l'IR.`} />
          </p>
          <p className="font-bold text-gray-900 dark:text-gray-100 tabular-nums">
            {formatCurrency(results.totalPrelevements)}{' '}
            <span className="text-xs font-normal text-gray-400 dark:text-gray-500">({totalPct}%)</span>
          </p>
          {/* Détail des lignes */}
          <div className="mt-1 space-y-0.5">
            <p className="text-[11px] text-gray-400 dark:text-gray-500 tabular-nums">
              Cotisations : {formatCurrency(results.cotisationsSociales)} <span className="text-gray-300 dark:text-gray-600">(26,16%)</span>
            </p>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 tabular-nums">
              CFP : {formatCurrency(results.cfp)} <span className="text-gray-300 dark:text-gray-600">(0,20%)</span>
            </p>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 tabular-nums">
              VL IR : {formatCurrency(results.versementLiberatoire)} <span className="text-gray-300 dark:text-gray-600">(2,20%)</span>
            </p>
          </div>
        </div>
        <div className="space-y-0.5">
          <p className="text-xs text-gray-400 dark:text-gray-500">Net annuel (après IR)</p>
          <p className="font-bold text-gray-900 dark:text-gray-100 tabular-nums">{formatCurrency(results.netAnnuel)}</p>
        </div>
        <div className="space-y-0.5">
          <p className="text-xs text-gray-400 dark:text-gray-500">Net mensuel (après IR)</p>
          <p className="font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">{formatCurrency(results.netMensuel)}</p>
        </div>
      </div>
    </div>
  );
}
