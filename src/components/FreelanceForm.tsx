'use client';

import { FreelanceInputs } from '@/types';

interface FreelanceFormProps {
  onChange: (inputs: FreelanceInputs) => void;
  values?: FreelanceInputs;
}

export default function FreelanceForm({ onChange, values }: FreelanceFormProps) {
  const tjm = values?.tjm ?? 0;
  const joursAnnuel = values?.joursAnnuel ?? 218;

  const handleTjmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onChange({
      tjm: isNaN(val) ? 0 : val,
      joursAnnuel,
    });
  };

  const handleJoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    onChange({
      tjm,
      joursAnnuel: isNaN(val) ? 0 : val,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label htmlFor="tjm" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          TJM (€/jour)
        </label>
        <input
          id="tjm"
          type="number"
          min="0"
          placeholder="450"
          value={tjm === 0 ? '' : tjm}
          onChange={handleTjmChange}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
        />
      </div>

      <div>
        <label htmlFor="jours" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Jours travaillés / an
        </label>
        <input
          id="jours"
          type="number"
          min="0"
          max="365"
          value={joursAnnuel === 0 ? '' : joursAnnuel}
          onChange={handleJoursChange}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          218 jours = standard convention collective française (52 sem. - 5 sem. congés - 11 jours fériés)
        </p>
      </div>
    </div>
  );
}
