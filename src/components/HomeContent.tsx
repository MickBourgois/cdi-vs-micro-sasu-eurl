'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import CdiForm from '@/components/CdiForm';
import FreelanceForm from '@/components/FreelanceForm';
import CdiResultCard from '@/components/CdiResultCard';
import FreelanceResultCard from '@/components/FreelanceResultCard';
import ComparisonPanel from '@/components/ComparisonPanel';
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
  return { brutAnnuel: brut, statut, tauxChargesPersonnalise: taux };
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
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 py-8 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900">CDI vs Freelance</h1>
          <p className="mt-2 text-gray-500">
            Comparez votre revenu net en CDI et en auto-entrepreneur. Saisissez vos données pour obtenir une estimation instantanée.
          </p>
          <button
            onClick={handleCopyLink}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            {copied ? 'Lien copié !' : 'Copier le lien'}
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Colonne CDI */}
          <div className="space-y-4">
            <CdiForm values={cdiInputs} onChange={handleCdiChange} />
            <CdiResultCard results={cdiResults} inputs={cdiInputs} />
          </div>

          {/* Colonne Freelance */}
          <div className="space-y-4">
            <FreelanceForm values={freelanceInputs} onChange={handleFreelanceChange} />
            <FreelanceResultCard results={freelanceResults} inputs={freelanceInputs} />
          </div>
        </div>

        {/* Panneau de comparaison */}
        <div className="mt-8">
          <ComparisonPanel comparison={comparison} />
        </div>
      </div>
    </main>
  );
}
