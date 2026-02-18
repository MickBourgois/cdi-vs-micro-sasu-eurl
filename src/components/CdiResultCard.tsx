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
      <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-6 text-center text-blue-300 text-sm">
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

  return (
    <div className="rounded-xl border border-blue-100 bg-white shadow-sm overflow-hidden">
      <div className="bg-blue-50 border-b border-blue-100 px-4 py-2">
        <p className="text-xs text-blue-500 font-medium">Charges salariales : {tauxLabel}</p>
      </div>
      <div className="p-4 grid grid-cols-2 gap-4">
        <div className="space-y-0.5">
          <p className="text-xs text-gray-400">Revenu net annuel</p>
          <p className="font-bold text-gray-900 tabular-nums">{formatCurrency(results.netAnnuel)}</p>
        </div>
        <div className="space-y-0.5">
          <p className="text-xs text-gray-400">Revenu net mensuel</p>
          <p className="font-bold text-gray-900 tabular-nums">{formatCurrency(results.netMensuel)}</p>
        </div>
        <div className="space-y-0.5">
          <p className="text-xs text-gray-400 inline-flex items-center">
            Coût employeur/an
            <Tooltip text="Coût total supporté par l'entreprise : salaire brut × 1,42 (charges patronales incluses)." />
          </p>
          <p className="font-bold text-gray-900 tabular-nums">{formatCurrency(results.coutEmployeurAnnuel)}</p>
        </div>
        <div className="space-y-0.5">
          <p className="text-xs text-gray-400 inline-flex items-center">
            TJM équivalent mission
            <Tooltip text="Le TJM qu'un freelance devrait facturer pour que son coût soit identique à celui de votre poste CDI (coût employeur ÷ jours travaillés)." />
          </p>
          <p className="font-bold text-blue-600 tabular-nums">{formatCurrency(results.tjmEquivalent)}/j</p>
        </div>
      </div>
    </div>
  );
}
