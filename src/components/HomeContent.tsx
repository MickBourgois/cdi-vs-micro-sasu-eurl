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
  const structureRaw = params.get('structure');

  if (structureRaw === 'sasu') {
    return {
      structure: 'sasu',
      tjm,
      joursAnnuel: jours,
      salaireBrutAnnuel: Number(params.get('salaire')) || 0,
    };
  }
  if (structureRaw === 'eurl') {
    return {
      structure: 'eurl',
      tjm,
      joursAnnuel: jours,
      remunerationAnnuelle: Number(params.get('remu')) || 0,
      capitalSocial: Number(params.get('capital')) || 1000,
    };
  }
  return { structure: 'micro', tjm, joursAnnuel: jours };
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
      if (newFreelance.structure !== 'micro') params.set('structure', newFreelance.structure);

      if (newFreelance.structure === 'sasu' && newFreelance.salaireBrutAnnuel > 0) {
        params.set('salaire', String(newFreelance.salaireBrutAnnuel));
      }
      if (newFreelance.structure === 'eurl') {
        if (newFreelance.remunerationAnnuelle > 0) params.set('remu', String(newFreelance.remunerationAnnuelle));
        if (newFreelance.capitalSocial !== 1000) params.set('capital', String(newFreelance.capitalSocial));
      }

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
    ? calculateFreelance(freelanceInputs, cdiInputs.tauxPrelevementSource)
    : null;

  const comparison: ComparisonResults | null =
    cdiResults && freelanceResults
      ? calculateComparison(cdiResults, freelanceResults, cdiInputs, freelanceInputs)
      : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F8] dark:bg-[#080810]">
      {/* Header */}
      <header className="bg-white/90 dark:bg-[#0D0D18]/90 backdrop-blur-sm border-b border-gray-200/70 dark:border-white/5 py-7 px-4 sticky top-0 z-10">
        <div className="max-w-[1900px] mx-auto">
          <div className="flex justify-end mb-3">
            <DarkModeToggle />
          </div>
          <div className="text-center">
            <h1 className="font-display text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-400">
              CDI vs Freelance
            </h1>
            <p className="mt-2.5 text-gray-500 dark:text-gray-400 max-w-lg mx-auto text-sm leading-relaxed">
              Comparez votre revenu net en CDI et en indépendant — Micro-AE, SASU ou EURL. Estimation instantanée, partage par lien.
            </p>
            <button
              onClick={handleCopyLink}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 transition-all shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              {copied ? '✓ Lien copié !' : 'Copier le lien'}
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-[1900px] mx-auto w-full px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-6 items-start">

          {/* Colonne gauche : CDI + Freelance */}
          <div className="space-y-4">

            {/* Section CDI */}
            <div className="rounded-2xl overflow-hidden border border-blue-200/70 dark:border-blue-800/30 shadow-sm">
              {/* Barre de couleur + titre */}
              <div className="bg-blue-500 px-5 py-2.5 flex items-center gap-2.5">
                <h2 className="font-display text-xs font-bold text-white uppercase tracking-widest">CDI — Salarié</h2>
              </div>
              {/* Contenu */}
              <div className="bg-blue-50/40 dark:bg-blue-950/10 p-4">
                <div className="grid grid-cols-2 gap-4 items-start">
                  <div className="rounded-xl border border-blue-100 dark:border-blue-900/40 bg-white dark:bg-[#0F0F1C] shadow-sm p-5">
                    <CdiForm values={cdiInputs} onChange={handleCdiChange} />
                  </div>
                  <CdiResultCard results={cdiResults} inputs={cdiInputs} />
                </div>
              </div>
            </div>

            {/* Section Freelance */}
            <div className="rounded-2xl overflow-hidden border border-indigo-200/70 dark:border-indigo-800/30 shadow-sm">
              {/* Barre de couleur + titre */}
              <div className="bg-indigo-500 px-5 py-2.5 flex items-center gap-2.5">
                <h2 className="font-display text-xs font-bold text-white uppercase tracking-widest">Indépendant — Société</h2>
              </div>
              {/* Contenu */}
              <div className="bg-indigo-50/40 dark:bg-indigo-950/10 p-4">
                <div className="grid grid-cols-2 gap-4 items-start">
                  <div className="rounded-xl border border-indigo-100 dark:border-indigo-900/40 bg-white dark:bg-[#0F0F1C] shadow-sm p-5">
                    <FreelanceForm values={freelanceInputs} onChange={handleFreelanceChange} />
                  </div>
                  <FreelanceResultCard results={freelanceResults} inputs={freelanceInputs} />
                </div>
              </div>
            </div>

          </div>

          {/* Colonne droite : comparaison */}
          <div className="lg:sticky lg:top-6 rounded-2xl overflow-hidden border border-amber-200/70 dark:border-amber-800/30 shadow-sm">
            {/* Barre de couleur + titre */}
            <div className="bg-amber-500 px-5 py-2.5 flex items-center gap-2.5">
              <h2 className="font-display text-xs font-bold text-white uppercase tracking-widest">Comparaison</h2>
            </div>
            {/* Contenu */}
            <div className="bg-amber-50/40 dark:bg-amber-950/10 p-4">
              <ComparisonPanel comparison={comparison} structure={freelanceInputs.structure} />
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200/70 dark:border-white/5 bg-white/80 dark:bg-[#0D0D18]/80 mt-8 py-6 px-4">
        <p className="text-center text-xs text-gray-400 dark:text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Estimations indicatives. Micro-AE : 28,56% (URSSAF 26,16% + CFP 0,20% + VL IR 2,20%). SASU : charges salariales 22%, patronales 45%, IS 15%/25%, flat tax dividendes 30%. EURL : cotisations TNS ~45% sur assiette (abatt. 26%), IS 15%/25%, seuil dividendes 10% du capital.{' '}
          Les résultats ne tiennent pas compte des frais professionnels, de la mutuelle, des RTT, ni des spécificités conventionnelles.{' '}
          <strong>Consultez un expert-comptable pour des calculs précis adaptés à votre situation.</strong>
        </p>
      </footer>
    </div>
  );
}
