'use client';

import { CdiInputs } from '@/types';

interface CdiFormProps {
  onChange: (inputs: CdiInputs) => void;
  values?: CdiInputs;
}

const DEFAULT_VALUES: CdiInputs = {
  brutAnnuel: 0,
  statut: 'non-cadre',
  tauxPrelevementSource: 10,
};

const inputClass =
  'rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400';

const labelClass = 'text-sm font-medium text-gray-700 dark:text-gray-300';

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

  function handleTauxChargesChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange({ ...current, tauxChargesPersonnalise: Number(e.target.value) });
  }

  function handlePASChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = parseFloat(e.target.value);
    onChange({ ...current, tauxPrelevementSource: isNaN(val) ? 0 : val });
  }

  const brutDisplay = current.brutAnnuel === 0 ? '' : current.brutAnnuel.toString();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="cdi-brut" className={labelClass}>
          Salaire brut annuel (€)
        </label>
        <input
          id="cdi-brut"
          type="number"
          inputMode="numeric"
          placeholder="60 000"
          value={brutDisplay}
          onChange={handleBrutChange}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="cdi-statut" className={labelClass}>
          Statut
        </label>
        <select
          id="cdi-statut"
          value={current.statut}
          onChange={handleStatutChange}
          className={inputClass}
        >
          <option value="cadre">Cadre (25%)</option>
          <option value="non-cadre">Non-cadre (22%)</option>
          <option value="personnalise">Personnalisé</option>
        </select>
      </div>

      {current.statut === 'personnalise' && (
        <div className="flex flex-col gap-1">
          <label htmlFor="cdi-taux" className={labelClass}>
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
            onChange={handleTauxChargesChange}
            className={inputClass}
          />
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="cdi-pas" className={labelClass}>
          Prélèvement à la source — PAS (%)
        </label>
        <input
          id="cdi-pas"
          type="number"
          inputMode="decimal"
          min={0}
          max={100}
          step={0.1}
          placeholder="10"
          value={current.tauxPrelevementSource}
          onChange={handlePASChange}
          className={inputClass}
        />
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
          Appliqué sur le net après charges salariales. Taux personnalisable sur impots.gouv.fr.
        </p>
      </div>
    </div>
  );
}
