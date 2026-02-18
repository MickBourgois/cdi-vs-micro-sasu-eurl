'use client';

import { FreelanceInputs, FreelanceResults, MicroResults, SasuResults, EurlResults } from '@/types';
import Tooltip from '@/components/Tooltip';

const fmt = (amount: number): string =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(amount);


interface FreelanceResultCardProps {
  results: FreelanceResults | null;
  inputs: FreelanceInputs;
}

function hasData(inputs: FreelanceInputs): boolean {
  return inputs.tjm > 0;
}

// ─── Micro ────────────────────────────────────────────────────────────────────

function MicroCard({ results, inputs }: { results: MicroResults; inputs: FreelanceInputs }) {
  const totalPct = ((results.totalPrelevements / results.caAnnuel) * 100).toFixed(2);
  return (
    <div className="rounded-xl border border-indigo-100 dark:border-indigo-900 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
      <div className="bg-indigo-50 dark:bg-indigo-950/30 border-b border-indigo-100 dark:border-indigo-900 px-4 py-2">
        <p className="text-xs text-indigo-500 dark:text-indigo-400 font-medium">
          Micro-entrepreneur — {inputs.joursAnnuel} j/an
        </p>
      </div>
      <div className="p-4 grid grid-cols-2 gap-4">
        <div className="space-y-0.5">
          <p className="text-xs text-gray-400 dark:text-gray-500">CA annuel brut</p>
          <p className="font-bold text-gray-900 dark:text-gray-100 tabular-nums">{fmt(results.caAnnuel)}</p>
        </div>
        <div className="space-y-0.5">
          <p className="text-xs text-gray-400 dark:text-gray-500 inline-flex items-center">
            Total prélèvements
            <Tooltip text="Cotisations sociales URSSAF : 26,16 %\n+ Formation professionnelle (CFP) : 0,20 %\n+ Versement libératoire IR (BNC) : 2,20 %\n= Total : 28,56 % — IR inclus." />
          </p>
          <p className="font-bold text-gray-900 dark:text-gray-100 tabular-nums">
            {fmt(results.totalPrelevements)}{' '}
            <span className="text-xs font-normal text-gray-400 dark:text-gray-500">({totalPct}%)</span>
          </p>
          <div className="mt-1 space-y-0.5">
            <p className="text-[11px] text-gray-400 dark:text-gray-500 tabular-nums">
              Cotisations : {fmt(results.cotisationsSociales)} <span className="text-gray-300 dark:text-gray-600">(26,16%)</span>
            </p>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 tabular-nums">
              CFP : {fmt(results.cfp)} <span className="text-gray-300 dark:text-gray-600">(0,20%)</span>
            </p>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 tabular-nums">
              VL IR : {fmt(results.versementLiberatoire)} <span className="text-gray-300 dark:text-gray-600">(2,20%)</span>
            </p>
          </div>
        </div>
        <div className="space-y-0.5">
          <p className="text-xs text-gray-400 dark:text-gray-500">Net annuel (après IR)</p>
          <p className="font-bold text-gray-900 dark:text-gray-100 tabular-nums">{fmt(results.netAnnuel)}</p>
        </div>
        <div className="space-y-0.5">
          <p className="text-xs text-gray-400 dark:text-gray-500">Net mensuel (après IR)</p>
          <p className="font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">{fmt(results.netMensuel)}</p>
        </div>
      </div>
    </div>
  );
}

// ─── SASU ─────────────────────────────────────────────────────────────────────

function SasuCard({ results, inputs }: { results: SasuResults; inputs: FreelanceInputs }) {
  return (
    <div className="rounded-xl border border-indigo-100 dark:border-indigo-900 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
      <div className="bg-indigo-50 dark:bg-indigo-950/30 border-b border-indigo-100 dark:border-indigo-900 px-4 py-2 flex items-center justify-between">
        <p className="text-xs text-indigo-500 dark:text-indigo-400 font-medium">
          SASU — Président assimilé salarié
        </p>
        <p className="text-xs text-indigo-400 dark:text-indigo-500">{inputs.joursAnnuel} j/an</p>
      </div>
      <div className="p-4 space-y-4">
        {/* CA */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-0.5">
            <p className="text-xs text-gray-400 dark:text-gray-500">CA annuel HT</p>
            <p className="font-bold text-gray-900 dark:text-gray-100 tabular-nums">{fmt(results.caAnnuel)}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-gray-400 dark:text-gray-500 inline-flex items-center">
              Résultat avant IS
              <Tooltip text="CA − salaire brut − charges patronales (45%)" />
            </p>
            <p className="font-semibold text-gray-600 dark:text-gray-400 tabular-nums text-sm">
              {fmt(results.resultatAvantIS)}
            </p>
          </div>
        </div>

        {/* Salaire */}
        <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 p-3 space-y-1.5">
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">Rémunération</p>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-500 dark:text-gray-400">
            <span>Salaire brut</span>
            <span className="tabular-nums text-right">{fmt(results.salaireBrut)}</span>
            <span>Charges salariales (22%)</span>
            <span className="tabular-nums text-right text-red-400">−{fmt(results.chargesSalariales)}</span>
            <span>Charges patronales (45%)</span>
            <span className="tabular-nums text-right text-red-400">−{fmt(results.chargesPatronales)}</span>
            <span>PAS (retenue à la source)</span>
            <span className="tabular-nums text-right text-red-400">−{fmt(results.salaireNetAvantIR - results.salaireNetApresIR)}</span>
          </div>
          <div className="pt-1 border-t border-blue-100 dark:border-blue-900/50 grid grid-cols-2 gap-2">
            <span className="text-xs text-gray-600 dark:text-gray-300">Net après IR</span>
            <span className="text-xs font-semibold text-gray-900 dark:text-gray-100 tabular-nums text-right">{fmt(results.salaireNetApresIR)}</span>
          </div>
        </div>

        {/* IS + Dividendes */}
        <div className="rounded-lg bg-violet-50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/50 p-3 space-y-1.5">
          <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wide">Dividendes</p>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-500 dark:text-gray-400">
            <span>Résultat net IS</span>
            <span className="tabular-nums text-right">{fmt(results.resultatNetIS)}</span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500">IS ({fmt(results.is)})</span>
            <span className="tabular-nums text-right text-[10px] text-gray-400 dark:text-gray-500">15% / 25%</span>
            <span>Flat tax (30%)</span>
            <span className="tabular-nums text-right text-red-400">−{fmt(results.flatTaxDividendes)}</span>
          </div>
          <div className="pt-1 border-t border-violet-100 dark:border-violet-900/50 grid grid-cols-2 gap-2">
            <span className="text-xs text-gray-600 dark:text-gray-300">Dividendes nets</span>
            <span className="text-xs font-semibold text-gray-900 dark:text-gray-100 tabular-nums text-right">{fmt(results.dividendesNet)}</span>
          </div>
        </div>

        {/* Total */}
        <div className="grid grid-cols-2 gap-4 pt-1 border-t border-gray-100 dark:border-gray-700">
          <div className="space-y-0.5">
            <p className="text-xs text-gray-400 dark:text-gray-500">Net annuel disponible</p>
            <p className="font-bold text-gray-900 dark:text-gray-100 tabular-nums">{fmt(results.netAnnuel)}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-gray-400 dark:text-gray-500">Net mensuel</p>
            <p className="font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">{fmt(results.netMensuel)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── EURL ─────────────────────────────────────────────────────────────────────

function EurlCard({ results, inputs }: { results: EurlResults; inputs: FreelanceInputs }) {
  const hasDivAboveSeuil = results.dividendesSoumisRS > 0;
  return (
    <div className="rounded-xl border border-indigo-100 dark:border-indigo-900 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
      <div className="bg-indigo-50 dark:bg-indigo-950/30 border-b border-indigo-100 dark:border-indigo-900 px-4 py-2 flex items-center justify-between">
        <p className="text-xs text-indigo-500 dark:text-indigo-400 font-medium">
          EURL — Gérant majoritaire TNS
        </p>
        <p className="text-xs text-indigo-400 dark:text-indigo-500">{inputs.joursAnnuel} j/an</p>
      </div>
      <div className="p-4 space-y-4">
        {/* CA + résultat */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-0.5">
            <p className="text-xs text-gray-400 dark:text-gray-500">CA annuel HT</p>
            <p className="font-bold text-gray-900 dark:text-gray-100 tabular-nums">{fmt(results.caAnnuel)}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-gray-400 dark:text-gray-500 inline-flex items-center">
              Résultat avant IS
              <Tooltip text="CA − rémunération du gérant. La TVA est hors scope." />
            </p>
            <p className="font-semibold text-gray-600 dark:text-gray-400 tabular-nums text-sm">
              {fmt(results.resultatAvantIS)}
            </p>
          </div>
        </div>

        {/* Rémunération TNS */}
        <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 p-3 space-y-1.5">
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
            Rémunération TNS
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-500 dark:text-gray-400">
            <span>Rémunération brute</span>
            <span className="tabular-nums text-right">{fmt(results.remuneration)}</span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500">Assiette (×0,74)</span>
            <span className="tabular-nums text-right text-[10px] text-gray-400 dark:text-gray-500">{fmt(results.assietteCotisations)}</span>
            <span>Cotisations TNS (~45%)</span>
            <span className="tabular-nums text-right text-red-400">−{fmt(results.cotisationsTNS)}</span>
          </div>
          <div className="pt-1 border-t border-blue-100 dark:border-blue-900/50 grid grid-cols-2 gap-2">
            <span className="text-xs text-gray-600 dark:text-gray-300">Net après IR</span>
            <span className="text-xs font-semibold text-gray-900 dark:text-gray-100 tabular-nums text-right">{fmt(results.remunerationNetteApresIR)}</span>
          </div>
        </div>

        {/* IS + Dividendes */}
        <div className="rounded-lg bg-violet-50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/50 p-3 space-y-1.5">
          <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wide inline-flex items-center gap-1">
            Dividendes
            <Tooltip text={`Seuil 10% (${fmt(results.seuilDividendes)}) : dividendes ≤ seuil → flat tax 30%. Dividendes > seuil → cotisations TNS (même assiette).`} />
          </p>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-500 dark:text-gray-400">
            <span>IS ({fmt(results.is)})</span>
            <span className="tabular-nums text-right">15% / 25%</span>
            <span>Résultat net IS</span>
            <span className="tabular-nums text-right">{fmt(results.resultatNetIS)}</span>
            {results.dividendesFlat > 0 && (
              <>
                <span>Flat tax 30% sur {fmt(results.dividendesFlat)}</span>
                <span className="tabular-nums text-right text-red-400">−{fmt(results.flatTaxDividendes)}</span>
              </>
            )}
            {hasDivAboveSeuil && (
              <>
                <span>TNS sur excédent {fmt(results.dividendesSoumisRS)}</span>
                <span className="tabular-nums text-right text-red-400">−{fmt(results.cotisationsTNSDividendes)}</span>
              </>
            )}
          </div>
          <div className="pt-1 border-t border-violet-100 dark:border-violet-900/50 grid grid-cols-2 gap-2">
            <span className="text-xs text-gray-600 dark:text-gray-300">Dividendes nets</span>
            <span className="text-xs font-semibold text-gray-900 dark:text-gray-100 tabular-nums text-right">{fmt(results.dividendesNet)}</span>
          </div>
        </div>

        {/* Total */}
        <div className="grid grid-cols-2 gap-4 pt-1 border-t border-gray-100 dark:border-gray-700">
          <div className="space-y-0.5">
            <p className="text-xs text-gray-400 dark:text-gray-500">Net annuel disponible</p>
            <p className="font-bold text-gray-900 dark:text-gray-100 tabular-nums">{fmt(results.netAnnuel)}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-gray-400 dark:text-gray-500">Net mensuel</p>
            <p className="font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">{fmt(results.netMensuel)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function FreelanceResultCard({ results, inputs }: FreelanceResultCardProps) {
  if (!results || !hasData(inputs)) {
    return (
      <div className="rounded-xl border border-indigo-100 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/20 p-6 text-center text-indigo-300 dark:text-indigo-700 text-sm">
        Saisissez un TJM
      </div>
    );
  }

  if (results.structure === 'micro') return <MicroCard results={results} inputs={inputs} />;
  if (results.structure === 'sasu') return <SasuCard results={results} inputs={inputs} />;
  return <EurlCard results={results} inputs={inputs} />;
}
