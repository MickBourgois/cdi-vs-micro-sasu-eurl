'use client';

import { useState } from 'react';
import CdiForm from '@/components/CdiForm';
import FreelanceForm from '@/components/FreelanceForm';
import CdiResultCard from '@/components/CdiResultCard';
import FreelanceResultCard from '@/components/FreelanceResultCard';
import ComparisonPanel from '@/components/ComparisonPanel';
import { calculateCdi, calculateFreelance, calculateComparison } from '@/lib/calculations';
import type { CdiInputs, FreelanceInputs, CdiResults, FreelanceResults, ComparisonResults } from '@/types';

const DEFAULT_CDI_INPUTS: CdiInputs = {
  brutAnnuel: 0,
  statut: 'cadre',
};

const DEFAULT_FREELANCE_INPUTS: FreelanceInputs = {
  tjm: 0,
  joursAnnuel: 218,
};

export default function Home() {
  const [cdiInputs, setCdiInputs] = useState<CdiInputs>(DEFAULT_CDI_INPUTS);
  const [freelanceInputs, setFreelanceInputs] = useState<FreelanceInputs>(DEFAULT_FREELANCE_INPUTS);

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
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Colonne CDI */}
          <div className="space-y-4">
            <CdiForm values={cdiInputs} onChange={setCdiInputs} />
            <CdiResultCard results={cdiResults} inputs={cdiInputs} />
          </div>

          {/* Colonne Freelance */}
          <div className="space-y-4">
            <FreelanceForm values={freelanceInputs} onChange={setFreelanceInputs} />
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
