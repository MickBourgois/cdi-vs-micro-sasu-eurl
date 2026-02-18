'use client';

import { useState, useEffect } from 'react';
import { FreelanceInputs, SasuInputs, EurlInputs } from '@/types';

interface FreelanceFormProps {
  onChange: (inputs: FreelanceInputs) => void;
  values?: FreelanceInputs;
}


const inputClass =
  'rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:focus:border-blue-400 dark:focus:ring-blue-400';

const labelClass = 'text-sm font-medium text-gray-700 dark:text-gray-300';

type Structure = 'micro' | 'sasu' | 'eurl';

function numDisplay(v: number): string {
  return v === 0 ? '' : v.toString();
}

export default function FreelanceForm({ onChange, values }: FreelanceFormProps) {
  const structure: Structure = values?.structure ?? 'micro';
  const tjm = values?.tjm ?? 0;
  const joursAnnuel = values?.joursAnnuel ?? 218;

  // Local display strings for numeric inputs (avoids "0" displayed when user clears)
  const [tjmDisplay, setTjmDisplay] = useState(numDisplay(tjm));
  const [joursDisplay, setJoursDisplay] = useState(numDisplay(joursAnnuel));
  const [salaireBrutDisplay, setSalaireBrutDisplay] = useState(
    values?.structure === 'sasu' ? numDisplay(values.salaireBrutAnnuel) : ''
  );
  const [remunerationDisplay, setRemunerationDisplay] = useState(
    values?.structure === 'eurl' ? numDisplay(values.remunerationAnnuelle) : ''
  );
  const [capitalDisplay, setCapitalDisplay] = useState(
    values?.structure === 'eurl' ? numDisplay(values.capitalSocial) : '1000'
  );

  // Sync display strings when external values change
  useEffect(() => {
    setTjmDisplay(numDisplay(tjm));
    setJoursDisplay(numDisplay(joursAnnuel));
    if (values?.structure === 'sasu') {
      setSalaireBrutDisplay(numDisplay(values.salaireBrutAnnuel));
    }
    if (values?.structure === 'eurl') {
      setRemunerationDisplay(numDisplay(values.remunerationAnnuelle));
      setCapitalDisplay(numDisplay(values.capitalSocial));
    }
  }, [values, tjm, joursAnnuel]);

  function buildInputs(overrides: Partial<{ tjm: number; joursAnnuel: number; salaireBrutAnnuel: number; remunerationAnnuelle: number; capitalSocial: number }>): FreelanceInputs {
    const t = overrides.tjm ?? tjm;
    const j = overrides.joursAnnuel ?? joursAnnuel;

    if (structure === 'sasu') {
      const cur = values as SasuInputs | undefined;
      return {
        structure: 'sasu',
        tjm: t,
        joursAnnuel: j,
        salaireBrutAnnuel: overrides.salaireBrutAnnuel ?? cur?.salaireBrutAnnuel ?? 0,
      };
    }
    if (structure === 'eurl') {
      const cur = values as EurlInputs | undefined;
      return {
        structure: 'eurl',
        tjm: t,
        joursAnnuel: j,
        remunerationAnnuelle: overrides.remunerationAnnuelle ?? cur?.remunerationAnnuelle ?? 0,
        capitalSocial: overrides.capitalSocial ?? cur?.capitalSocial ?? 1000,
      };
    }
    return { structure: 'micro', tjm: t, joursAnnuel: j };
  }

  function handleStructureChange(s: Structure) {
    if (s === structure) return;
    // Keep tjm and joursAnnuel, reset structure-specific fields
    if (s === 'micro') {
      onChange({ structure: 'micro', tjm, joursAnnuel });
    } else if (s === 'sasu') {
      setSalaireBrutDisplay('');
      onChange({ structure: 'sasu', tjm, joursAnnuel, salaireBrutAnnuel: 0 });
    } else {
      setRemunerationDisplay('');
      setCapitalDisplay('1000');
      onChange({ structure: 'eurl', tjm, joursAnnuel, remunerationAnnuelle: 0, capitalSocial: 1000 });
    }
  }

  function handleTjmChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    setTjmDisplay(raw);
    const val = parseFloat(raw);
    onChange(buildInputs({ tjm: isNaN(val) ? 0 : val }));
  }

  function handleJoursChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    setJoursDisplay(raw);
    const val = parseInt(raw, 10);
    onChange(buildInputs({ joursAnnuel: isNaN(val) ? 0 : val }));
  }

  function handleSalaireBrutChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    setSalaireBrutDisplay(raw);
    const val = parseFloat(raw);
    onChange(buildInputs({ salaireBrutAnnuel: isNaN(val) ? 0 : val }));
  }

  function handleRemunerationChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    setRemunerationDisplay(raw);
    const val = parseFloat(raw);
    onChange(buildInputs({ remunerationAnnuelle: isNaN(val) ? 0 : val }));
  }

  function handleCapitalChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    setCapitalDisplay(raw);
    const val = parseFloat(raw);
    onChange(buildInputs({ capitalSocial: isNaN(val) ? 0 : val }));
  }

  const caEstime = tjm * joursAnnuel;

  return (
    <div className="flex flex-col gap-4">
      {/* Structure selector */}
      <div className="flex flex-col gap-1">
        <label className={labelClass}>Structure juridique</label>
        <div className="grid grid-cols-3 gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          {(['micro', 'sasu', 'eurl'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleStructureChange(s)}
              className={`py-1.5 text-xs font-medium rounded-md transition-colors ${
                structure === s
                  ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {s === 'micro' ? 'Micro-AE' : s === 'sasu' ? 'SASU' : 'EURL'}
            </button>
          ))}
        </div>
      </div>

      {/* TJM */}
      <div className="flex flex-col gap-1">
        <label htmlFor="freelance-tjm" className={labelClass}>
          TJM (€/jour)
        </label>
        <input
          id="freelance-tjm"
          type="number"
          inputMode="numeric"
          min={0}
          placeholder="450"
          value={tjmDisplay}
          onChange={handleTjmChange}
          className={inputClass}
        />
        {tjm > 0 && joursAnnuel > 0 && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            CA estimé : {caEstime.toLocaleString('fr-FR')} €/an
          </p>
        )}
      </div>

      {/* Jours travaillés / an */}
      <div className="flex flex-col gap-1">
        <label htmlFor="freelance-jours" className={labelClass}>
          Jours travaillés / an
        </label>
        <input
          id="freelance-jours"
          type="number"
          inputMode="numeric"
          min={0}
          max={365}
          placeholder="218"
          value={joursDisplay}
          onChange={handleJoursChange}
          className={inputClass}
        />
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
          218 jours = standard convention collective française (52 sem. − 5 sem. congés − 11 jours fériés)
        </p>
      </div>

      {/* SASU: Salaire brut annuel du président */}
      {structure === 'sasu' && (
        <div className="flex flex-col gap-1">
          <label htmlFor="freelance-salaire-brut" className={labelClass}>
            Salaire brut annuel du président (€)
          </label>
          <input
            id="freelance-salaire-brut"
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="60 000"
            value={salaireBrutDisplay}
            onChange={handleSalaireBrutChange}
            className={inputClass}
          />
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            Rémunération brute versée au président (peut être 0)
          </p>
        </div>
      )}

      {/* EURL: Rémunération annuelle du gérant */}
      {structure === 'eurl' && (
        <>
          <div className="flex flex-col gap-1">
            <label htmlFor="freelance-remuneration" className={labelClass}>
              Rémunération annuelle du gérant (€)
            </label>
            <input
              id="freelance-remuneration"
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="60 000"
              value={remunerationDisplay}
              onChange={handleRemunerationChange}
              className={inputClass}
            />
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              Rémunération brute versée au gérant TNS (peut être 0)
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="freelance-capital" className={labelClass}>
              Capital social (€)
              <span
                className="ml-1 inline-block cursor-help text-gray-400 dark:text-gray-500"
                title="Sert au calcul du seuil 10% pour les dividendes. Au-delà de ce seuil, les dividendes sont soumis aux cotisations TNS."
              >
                &#9432;
              </span>
            </label>
            <input
              id="freelance-capital"
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="1 000"
              value={capitalDisplay}
              onChange={handleCapitalChange}
              className={inputClass}
            />
          </div>
        </>
      )}
    </div>
  );
}
