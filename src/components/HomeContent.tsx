'use client';

import { useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import CdiForm from '@/components/CdiForm';
import FreelanceForm from '@/components/FreelanceForm';
import CdiResultCard from '@/components/CdiResultCard';
import FreelanceResultCard from '@/components/FreelanceResultCard';
import ComparisonPanel from '@/components/ComparisonPanel';
import DarkModeToggle from '@/components/DarkModeToggle';
import { calculateCdi, calculateFreelance, calculateComparison } from '@/lib/calculations';
import type { CdiInputs, FreelanceInputs, CdiResults, FreelanceResults, ComparisonResults } from '@/types';

function parseCdiInputsFromParams(params: URLSearchParams): CdiInputs {
  const brut = Number(params.get('brut')) || 0;
  const statutRaw = params.get('statut');
  const statut: CdiInputs['statut'] =
    statutRaw === 'cadre' || statutRaw === 'non-cadre' || statutRaw === 'personnalise'
      ? statutRaw
      : 'cadre';
  const taux = params.get('taux') ? Number(params.get('taux')) : undefined;
  const pas = params.get('pas') ? Number(params.get('pas')) : 10;
  return { brutAnnuel: brut, statut, tauxChargesPersonnalise: taux, tauxPrelevementSource: pas };
}

function parseFreelanceInputsFromParams(params: URLSearchParams): FreelanceInputs {
  const tjm = Number(params.get('tjm')) || 0;
  const jours = Number(params.get('jours')) || 218;
  return { tjm, joursAnnuel: jours };
}

export default function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [cdiInputs, setCdiInputs] = useState<CdiInputs>(() =>
    parseCdiInputsFromParams(searchParams)
  );
  const [freelanceInputs, setFreelanceInputs] = useState<FreelanceInputs>(() =>
    parseFreelanceInputsFromParams(searchParams)
  );
  const [copied, setCopied] = useState(false);

  const updateUrl = useCallback(
    (newCdi: CdiInputs, newFreelance: FreelanceInputs) => {
      const params = new URLSearchParams();
      if (newCdi.brutAnnuel > 0) params.set('brut', String(newCdi.brutAnnuel));
      params.set('statut', newCdi.statut);
      if (newCdi.statut === 'personnalise' && newCdi.tauxChargesPersonnalise !== undefined) {
        params.set('taux', String(newCdi.tauxChargesPersonnalise));
      }
      if (newCdi.tauxPrelevementSource !== 10) {
        params.set('pas', String(newCdi.tauxPrelevementSource));
      }
      if (newFreelance.tjm > 0) params.set('tjm', String(newFreelance.tjm));
      if (newFreelance.joursAnnuel !== 218) params.set('jours', String(newFreelance.joursAnnuel));

      const query = params.toString();
      router.replace(query ? `?${query}` : '/', { scroll: false });
    },
    [router]
  );

  const handleCdiChange = useCallback(
    (inputs: CdiInputs) => {
      setCdiInputs(inputs);
      updateUrl(inputs, freelanceInputs);
    },
    [freelanceInputs, updateUrl]
  );

  const handleFreelanceChange = useCallback(
    (inputs: FreelanceInputs) => {
      setFreelanceInputs(inputs);
      updateUrl(cdiInputs, inputs);
    },
    [cdiInputs, updateUrl]
  );

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);

  const cdiResults: CdiResults | null = cdiInputs.brutAnnuel > 0
    ? calculateCdi(cdiInputs, freelanceInputs.joursAnnuel)
    : null;

  const freelanceResults: FreelanceResults | null = freelanceInputs.tjm > 0
    ? calculateFreelance(freelanceInputs)
    : null;

  const comparison: ComparisonResults | null =
    cdiResults && freelanceResults
      ? calculateComparison(cdiResults, freelanceResults, cdiInputs, freelanceInputs)
      : null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-end mb-3">
            <DarkModeToggle />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">CDI vs Freelance</h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Comparez votre revenu net en CDI et en auto-entrepreneur. Saisissez vos données pour obtenir une estimation instantanée.
            </p>
            <button
              onClick={handleCopyLink}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-colors shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              {copied ? 'Lien copié !' : 'Copier le lien'}
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Colonne CDI */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
              <h2 className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">CDI — Salarié</h2>
            </div>
            <div className="rounded-xl border border-blue-100 dark:border-blue-900 bg-white dark:bg-gray-800 shadow-sm p-5">
              <CdiForm values={cdiInputs} onChange={handleCdiChange} />
            </div>
            <CdiResultCard results={cdiResults} inputs={cdiInputs} />
          </div>

          {/* Colonne Freelance */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-indigo-500"></span>
              <h2 className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">Freelance — Auto-Entrepreneur</h2>
            </div>
            <div className="rounded-xl border border-indigo-100 dark:border-indigo-900 bg-white dark:bg-gray-800 shadow-sm p-5">
              <FreelanceForm values={freelanceInputs} onChange={handleFreelanceChange} />
            </div>
            <FreelanceResultCard results={freelanceResults} inputs={freelanceInputs} />
          </div>
        </div>

        {/* Panneau de comparaison */}
        <div className="mt-8">
          <ComparisonPanel comparison={comparison} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 mt-8 py-6 px-4">
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 max-w-2xl mx-auto">
          Estimations indicatives basées sur le régime auto-entrepreneur (cotisations URSSAF 22%) et les charges salariales CDI standard. Les résultats ne tiennent pas compte de la mutuelle, des tickets restaurant, des RTT, de l&apos;intéressement, ni des spécificités conventionnelles.{' '}
          <strong>Consultez un expert-comptable pour des calculs précis adaptés à votre situation.</strong>
        </p>
      </footer>
    </div>
  );
}
