import { CdiInputs, CdiResults } from '@/types';

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
      <div className="p-4 text-gray-500 text-sm">
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
    <div className="space-y-3">
      <p className="text-xs text-gray-500">Taux de charges : {tauxLabel}</p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-gray-500">Revenu net annuel</p>
          <p className="font-semibold">{formatCurrency(results.netAnnuel)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Revenu net mensuel</p>
          <p className="font-semibold">{formatCurrency(results.netMensuel)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Coût total employeur/an</p>
          <p className="font-semibold">{formatCurrency(results.coutEmployeurAnnuel)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">TJM équivalent mission</p>
          <p className="font-semibold">{formatCurrency(results.tjmEquivalent)}/j</p>
        </div>
      </div>
    </div>
  );
}
