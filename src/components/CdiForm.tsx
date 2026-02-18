'use client';

import { CdiInputs } from '@/types';

interface CdiFormProps {
  onChange: (inputs: CdiInputs) => void;
  values?: CdiInputs;
}

const DEFAULT_VALUES: CdiInputs = {
  brutAnnuel: 0,
  statut: 'non-cadre',
};

export default function CdiForm({ onChange, values }: CdiFormProps) {
  const current = values ?? DEFAULT_VALUES;

  function handleBrutChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/\s/g, '');
    onChange({ ...current, brutAnnuel: raw === '' ? 0 : Number(raw) });
  }

  function handleStatutChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const statut = e.target.value as CdiInputs['statut'];
    onChange({ ...current, statut, tauxChargesPersonnalise: undefined });
  }

  function handleTauxChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange({ ...current, tauxChargesPersonnalise: Number(e.target.value) });
  }

  const brutDisplay = current.brutAnnuel === 0 ? '' : current.brutAnnuel.toString();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="cdi-brut" className="text-sm font-medium text-gray-700">
          Salaire brut annuel (€)
        </label>
        <input
          id="cdi-brut"
          type="number"
          inputMode="numeric"
          placeholder="60 000"
          value={brutDisplay}
          onChange={handleBrutChange}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="cdi-statut" className="text-sm font-medium text-gray-700">
          Statut
        </label>
        <select
          id="cdi-statut"
          value={current.statut}
          onChange={handleStatutChange}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="cadre">Cadre (25%)</option>
          <option value="non-cadre">Non-cadre (22%)</option>
          <option value="personnalise">Personnalisé</option>
        </select>
      </div>

      {current.statut === 'personnalise' && (
        <div className="flex flex-col gap-1">
          <label htmlFor="cdi-taux" className="text-sm font-medium text-gray-700">
            Taux de charges salariales (%)
          </label>
          <input
            id="cdi-taux"
            type="number"
            inputMode="decimal"
            min={0}
            max={100}
            step={0.1}
            placeholder="22"
            value={current.tauxChargesPersonnalise ?? ''}
            onChange={handleTauxChange}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      )}
    </div>
  );
}
