import { useEffect, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type MonthlyRow = {
  monthKey: string;
  monthLabel: string;
  total: number;
  attended: number;
  dna: number;
  dnaRate: number;
};

type GlasgowMonth = {
  monthKey: string;
  monthLabel: string;
  areas: { name: string; appointments: number }[];
};

type AgeRow = { band: string; attended: number; dna: number };
type TreatmentRow = { name: string; appointments: number; attended: number; dna: number };
type NoShowRow = { bucket: string; showed: number; noShow: number; rate: number };

export type DashboardAnalytics = {
  generatedAt: string;
  sources: string[];
  methodologyNote: string;
  monthlyOutpatient: MonthlyRow[];
  glasgowMonthlyByArea: GlasgowMonth[];
  ageBucketsLatest: AgeRow[];
  treatmentsTop: TreatmentRow[];
  noShowByAgeBucket: NoShowRow[];
};

const CHART_HEIGHT = 320;
const GLASGOW_COLORS = ['#5ED4C8', '#7CB9FF', '#F0AB6B', '#C9A8F5'];
const ATTENDED = '#5ED4C8';
const DNA = '#F87171';

type ChartKind = 'bar' | 'area';

function formatCompact(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return String(Math.round(n));
}

function ChartToggle({ value, onChange }: { value: ChartKind; onChange: (k: ChartKind) => void }) {
  return (
    <div
      className="inline-flex rounded-full border border-white/10 bg-black/25 p-1 shadow-inner"
      role="group"
      aria-label="Chart style"
    >
      {(['area', 'bar'] as const).map((k) => (
        <button
          key={k}
          type="button"
          onClick={() => onChange(k)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
            value === k
              ? 'bg-[#EF6A3B] text-white shadow-md'
              : 'text-[#C5B6B3] hover:text-white'
          }`}
        >
          {k === 'area' ? 'Area charts' : 'Bar charts'}
        </button>
      ))}
    </div>
  );
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#2a2a2a] to-[#222] p-5 shadow-lg lg:p-6">
      <div className="mb-4 flex flex-col gap-1 border-b border-white/5 pb-4">
        <h2 className="text-lg font-semibold tracking-tight text-white lg:text-xl">{title}</h2>
        {subtitle ? <p className="max-w-3xl text-sm leading-relaxed text-[#B8B8B8]">{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
}

const axisProps = {
  stroke: '#8a8a8a',
  tick: { fill: '#b5b5b5', fontSize: 11 },
  tickLine: false,
  axisLine: { stroke: '#444' },
};

const gridProps = { stroke: '#3a3a3a', strokeDasharray: '3 6' };

function DarkTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string; dataKey?: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-[#1a1a1a]/95 px-4 py-3 text-sm shadow-xl backdrop-blur">
      <p className="mb-2 font-medium text-white">{label}</p>
      <ul className="space-y-1.5">
        {payload.map((p) => {
          const isPct = p.dataKey === 'dnaRatePct' || p.name === 'DNA rate';
          const display =
            typeof p.value === 'number' ? (isPct ? `${p.value}%` : formatCompact(p.value)) : String(p.value);
          return (
            <li key={p.name} className="flex items-center justify-between gap-6 text-[#d4d4d4]">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
                {p.name}
              </span>
              <span className="tabular-nums text-white">{display}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function DataInsightsPage() {
  const [data, setData] = useState<DashboardAnalytics | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [chartKind, setChartKind] = useState<ChartKind>('area');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/datasets/dashboard-analytics.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as DashboardAnalytics;
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled) setLoadError(e instanceof Error ? e.message : 'Failed to load analytics bundle');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const monthlySeries = useMemo(() => {
    if (!data) return [];
    return data.monthlyOutpatient.map((m) => ({
      ...m,
      dnaRatePct: Math.round(m.dnaRate * 1000) / 10,
    }));
  }, [data]);

  const glasgowWide = useMemo(() => {
    if (!data) return [];
    const tail = data.glasgowMonthlyByArea.slice(-24);
    return tail.map((row) => {
      const o: Record<string, string | number> = { month: row.monthLabel };
      row.areas.forEach((a, i) => {
        o[`a${i}`] = a.appointments;
      });
      return o;
    });
  }, [data]);

  const glasgowKeys = useMemo(() => {
    if (!data?.glasgowMonthlyByArea.length) return [] as string[];
    return data.glasgowMonthlyByArea[0].areas.map((_, i) => `a${i}`);
  }, [data]);

  const glasgowNames = useMemo(() => {
    if (!data?.glasgowMonthlyByArea.length) return [] as string[];
    return data.glasgowMonthlyByArea[0].areas.map((a) => a.name);
  }, [data]);

  const ageSorted = useMemo(() => {
    if (!data) return [];
    const order = (b: string) => {
      const m = b.match(/(\d+)/);
      return m ? parseInt(m[1], 10) : 999;
    };
    return [...data.ageBucketsLatest].filter((r) => r.band.toLowerCase() !== 'unknown').sort((a, b) => order(a.band) - order(b.band));
  }, [data]);

  const treatmentChartData = useMemo(() => {
    if (!data) return [];
    return [...data.treatmentsTop]
      .sort((a, b) => a.appointments - b.appointments)
      .map((t) => ({
        name: t.name.replace(/\s+Service$/, ''),
        appointments: t.appointments,
        attended: t.attended,
        dna: t.dna,
      }));
  }, [data]);

  if (loadError) {
    return (
      <div className="flex h-full min-h-0 flex-col gap-4 overflow-auto px-5 py-8 lg:px-8">
        <p className="text-red-300">{loadError}</p>
        <p className="text-sm text-[#B8B8B8]">
          Run <code className="rounded bg-black/40 px-2 py-0.5 text-[#5ED4C8]">pnpm run build:dashboard-data</code> from the repo root,
          then refresh. The bundle is built from files in <code className="text-[#5ED4C8]">datasets/datasets/</code>.
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-full min-h-[480px] items-center justify-center px-8">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#EF6A3B] border-t-transparent" />
          <p className="text-sm text-[#C5B6B3]">Loading dataset analytics…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-1 flex-col gap-6 overflow-auto px-5 py-6 lg:gap-8 lg:px-8 lg:py-8">
      <header className="flex flex-col gap-4 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#EF6A3B]">Insights</p>
          <h1 className="text-2xl font-bold tracking-tight text-white lg:text-3xl">Appointment analytics dashboard</h1>
          <p className="text-sm leading-relaxed text-[#C5B6B3] lg:text-base">
            Explore outpatient demand, attendance and did-not-attend patterns, age structure, treatment volumes, and benchmark
            no-show behaviour — with a switchable chart style for clearer comparisons.
          </p>
        </div>
        <ChartToggle value={chartKind} onChange={setChartKind} />
      </header>

      <div className="rounded-2xl border border-[#5ED4C8]/25 bg-[#1e2e2c]/40 px-4 py-3 text-sm leading-relaxed text-[#c8ebe6] lg:px-5">
        <strong className="text-[#5ED4C8]">Methodology.</strong> {data.methodologyNote} HES figures are England national
        statistics (NHS Digital). Glasgow-area splits are illustrative planning weights, not official sub-national counts.
        No-show by age bucket uses the Kaggle Brazil benchmark cohort (CC0).
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <Panel
          title="National outpatient volume (time series)"
          subtitle="Monthly total appointments with attended vs did-not-attend (DNA) from HES open data."
        >
          <div style={{ height: CHART_HEIGHT }}>
            <ResponsiveContainer width="100%" height="100%">
              {chartKind === 'area' ? (
                <AreaChart data={monthlySeries} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid {...gridProps} />
                  <XAxis dataKey="monthLabel" interval={Math.ceil(monthlySeries.length / 12) - 1} angle={-35} textAnchor="end" height={56} {...axisProps} />
                  <YAxis tickFormatter={formatCompact} width={44} {...axisProps} />
                  <Tooltip content={<DarkTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: 16 }} />
                  <Area type="monotone" dataKey="attended" name="Attended" stackId="1" stroke={ATTENDED} fill={ATTENDED} fillOpacity={0.35} strokeWidth={2} />
                  <Area type="monotone" dataKey="dna" name="DNA" stackId="1" stroke={DNA} fill={DNA} fillOpacity={0.4} strokeWidth={2} />
                </AreaChart>
              ) : (
                <BarChart data={monthlySeries} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid {...gridProps} />
                  <XAxis dataKey="monthLabel" interval={Math.ceil(monthlySeries.length / 12) - 1} angle={-35} textAnchor="end" height={56} {...axisProps} />
                  <YAxis tickFormatter={formatCompact} width={44} {...axisProps} />
                  <Tooltip content={<DarkTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: 16 }} />
                  <Bar dataKey="attended" name="Attended" fill={ATTENDED} stackId="1" radius={[0, 0, 0, 0]} maxBarSize={28} />
                  <Bar dataKey="dna" name="DNA" fill={DNA} stackId="1" radius={[6, 6, 0, 0]} maxBarSize={28} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel
          title="DNA rate trend"
          subtitle="Share of outpatient appointments recorded as did-not-attend each month."
        >
          <div style={{ height: CHART_HEIGHT }}>
            <ResponsiveContainer width="100%" height="100%">
              {chartKind === 'area' ? (
                <AreaChart data={monthlySeries} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid {...gridProps} />
                  <XAxis dataKey="monthLabel" interval={Math.ceil(monthlySeries.length / 12) - 1} angle={-35} textAnchor="end" height={56} {...axisProps} />
                  <YAxis tickFormatter={(v) => `${v}%`} domain={[0, 'auto']} width={48} {...axisProps} />
                  <Tooltip content={<DarkTooltip />} />
                  <Area type="monotone" dataKey="dnaRatePct" name="DNA rate" stroke="#F0AB6B" fill="#F0AB6B" fillOpacity={0.25} strokeWidth={2} />
                </AreaChart>
              ) : (
                <BarChart data={monthlySeries} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid {...gridProps} />
                  <XAxis dataKey="monthLabel" interval={Math.ceil(monthlySeries.length / 12) - 1} angle={-35} textAnchor="end" height={56} {...axisProps} />
                  <YAxis tickFormatter={(v) => `${v}%`} domain={[0, 'auto']} width={48} {...axisProps} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="dnaRatePct" name="DNA rate %" fill="#F0AB6B" radius={[6, 6, 0, 0]} maxBarSize={24} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel
        title="Glasgow-area appointment load (monthly)"
        subtitle="Each month’s national outpatient total is distributed across four illustrative Glasgow zones for capacity planning views."
      >
        <div style={{ height: CHART_HEIGHT + 40 }}>
          <ResponsiveContainer width="100%" height="100%">
            {chartKind === 'area' ? (
              <AreaChart data={glasgowWide} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="month" angle={-30} textAnchor="end" height={64} interval={2} {...axisProps} />
                <YAxis tickFormatter={formatCompact} width={48} {...axisProps} />
                <Tooltip content={<DarkTooltip />} />
                <Legend />
                {glasgowKeys.map((k, i) => (
                  <Area
                    key={k}
                    type="monotone"
                    dataKey={k}
                    name={glasgowNames[i] ?? k}
                    stackId="g"
                    stroke={GLASGOW_COLORS[i % GLASGOW_COLORS.length]}
                    fill={GLASGOW_COLORS[i % GLASGOW_COLORS.length]}
                    fillOpacity={0.35}
                    strokeWidth={1.5}
                  />
                ))}
              </AreaChart>
            ) : (
              <BarChart data={glasgowWide} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="month" angle={-30} textAnchor="end" height={64} interval={2} {...axisProps} />
                <YAxis tickFormatter={formatCompact} width={48} {...axisProps} />
                <Tooltip content={<DarkTooltip />} />
                <Legend />
                {glasgowKeys.map((k, i) => (
                  <Bar
                    key={k}
                    dataKey={k}
                    name={glasgowNames[i] ?? k}
                    stackId="g"
                    fill={GLASGOW_COLORS[i % GLASGOW_COLORS.length]}
                    radius={[0, 0, 0, 0]}
                    maxBarSize={36}
                  />
                ))}
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <Panel
          title="Age groups (latest HES month)"
          subtitle="Attended vs DNA outpatient appointments by NHS age band."
        >
          <div style={{ height: CHART_HEIGHT }}>
            <ResponsiveContainer width="100%" height="100%">
              {chartKind === 'area' ? (
                <AreaChart data={ageSorted} margin={{ top: 8, right: 8, left: 0, bottom: 64 }}>
                  <CartesianGrid {...gridProps} />
                  <XAxis dataKey="band" interval={0} angle={-40} textAnchor="end" height={72} {...axisProps} />
                  <YAxis tickFormatter={formatCompact} width={48} {...axisProps} />
                  <Tooltip content={<DarkTooltip />} />
                  <Legend />
                  <Area type="monotone" dataKey="attended" name="Attended" stroke={ATTENDED} fill={ATTENDED} fillOpacity={0.3} strokeWidth={2} />
                  <Area type="monotone" dataKey="dna" name="DNA" stroke={DNA} fill={DNA} fillOpacity={0.3} strokeWidth={2} />
                </AreaChart>
              ) : (
                <BarChart data={ageSorted} margin={{ top: 8, right: 8, left: 0, bottom: 64 }}>
                  <CartesianGrid {...gridProps} />
                  <XAxis dataKey="band" interval={0} angle={-40} textAnchor="end" height={72} {...axisProps} />
                  <YAxis tickFormatter={formatCompact} width={48} {...axisProps} />
                  <Tooltip content={<DarkTooltip />} />
                  <Legend />
                  <Bar dataKey="attended" name="Attended" fill={ATTENDED} radius={[6, 6, 0, 0]} maxBarSize={32} />
                  <Bar dataKey="dna" name="DNA" fill={DNA} radius={[6, 6, 0, 0]} maxBarSize={32} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel
          title="Show vs no-show by age (Kaggle benchmark)"
          subtitle="Public hospital appointments (Brazil, 2016) — useful pattern reference for engagement modelling."
        >
          <div style={{ height: CHART_HEIGHT }}>
            <ResponsiveContainer width="100%" height="100%">
              {chartKind === 'area' ? (
                <AreaChart data={data.noShowByAgeBucket} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid {...gridProps} />
                  <XAxis dataKey="bucket" {...axisProps} />
                  <YAxis tickFormatter={formatCompact} width={48} {...axisProps} />
                  <Tooltip content={<DarkTooltip />} />
                  <Legend />
                  <Area type="monotone" dataKey="showed" name="Attended" stackId="k" stroke="#7CB9FF" fill="#7CB9FF" fillOpacity={0.35} strokeWidth={2} />
                  <Area type="monotone" dataKey="noShow" name="No-show" stackId="k" stroke="#F87171" fill="#F87171" fillOpacity={0.4} strokeWidth={2} />
                </AreaChart>
              ) : (
                <BarChart data={data.noShowByAgeBucket} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid {...gridProps} />
                  <XAxis dataKey="bucket" {...axisProps} />
                  <YAxis tickFormatter={formatCompact} width={48} {...axisProps} />
                  <Tooltip content={<DarkTooltip />} />
                  <Legend />
                  <Bar dataKey="showed" name="Attended" fill="#7CB9FF" stackId="k" maxBarSize={40} />
                  <Bar dataKey="noShow" name="No-show" fill="#F87171" stackId="k" radius={[6, 6, 0, 0]} maxBarSize={40} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel
        title="Total treatments — leading specialties (latest month)"
        subtitle="Outpatient appointment volumes by treatment specialty from HES provisional open data."
      >
        <div style={{ height: Math.min(480, treatmentChartData.length * 36 + 80) }}>
          <ResponsiveContainer width="100%" height="100%">
            {chartKind === 'area' ? (
              <AreaChart data={treatmentChartData} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
                <CartesianGrid {...gridProps} horizontal={false} />
                <XAxis type="number" tickFormatter={formatCompact} {...axisProps} />
                <YAxis type="category" dataKey="name" width={160} tick={{ fill: '#d4d4d4', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<DarkTooltip />} />
                <Legend />
                <Area type="monotone" dataKey="appointments" name="Total appointments" stroke="#5ED4C8" fill="#5ED4C8" fillOpacity={0.45} strokeWidth={2} />
              </AreaChart>
            ) : (
              <BarChart
                data={treatmentChartData}
                layout="vertical"
                margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
                barGap={2}
                barCategoryGap={12}
              >
                <CartesianGrid {...gridProps} horizontal={false} />
                <XAxis type="number" tickFormatter={formatCompact} {...axisProps} />
                <YAxis type="category" dataKey="name" width={160} tick={{ fill: '#d4d4d4', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<DarkTooltip />} />
                <Legend />
                <Bar dataKey="appointments" name="Total appointments" fill="#5ED4C8" maxBarSize={12} />
                <Bar dataKey="attended" name="Attended" fill="#93C5FD" maxBarSize={12} />
                <Bar dataKey="dna" name="DNA" fill="#FCA5A5" maxBarSize={12} radius={[0, 4, 4, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </Panel>

      <footer className="rounded-xl border border-white/5 bg-black/20 px-4 py-3 text-xs text-[#9ca3af]">
        <p className="font-medium text-[#C5B6B3]">Sources</p>
        <ul className="mt-1 list-inside list-disc space-y-1">
          {data.sources.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <p className="mt-2 text-[#6b7280]">Bundle generated {new Date(data.generatedAt).toLocaleString()} — rebuild with pnpm run build:dashboard-data after updating CSVs.</p>
      </footer>
    </div>
  );
}
