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

import Cookies from 'js-cookie';
import { isEmpty } from 'lodash';
import { trpc } from '@nhs-portal/client-api';
import { activeLocationIdsForApi, useLocationStore } from '@your-props/client/utils';

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

function yearsBetween(dob: Date, now: Date): number {
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) age -= 1;
  return age;
}

function ageBand(age: number | null): string {
  if (age === null || Number.isNaN(age) || age < 0) return 'Unknown';
  if (age <= 4) return '0 - 4';
  if (age <= 9) return '5 - 9';
  if (age <= 14) return '10 - 14';
  if (age <= 19) return '15 - 19';
  if (age <= 24) return '20 - 24';
  if (age <= 29) return '25 - 29';
  if (age <= 34) return '30 - 34';
  if (age <= 39) return '35 - 39';
  if (age <= 44) return '40 - 44';
  if (age <= 49) return '45 - 49';
  if (age <= 54) return '50 - 54';
  if (age <= 59) return '55 - 59';
  if (age <= 64) return '60 - 64';
  if (age <= 69) return '65 - 69';
  if (age <= 74) return '70 - 74';
  if (age <= 79) return '75 - 79';
  if (age <= 84) return '80 - 84';
  return '85+';
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
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all last:ml-4 ${
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
  const isSignedIn = !isEmpty(Cookies.get('token'));

  const storeLocations = useLocationStore((s) => s.locations);
  const selectedLocationIds = useLocationStore((s) => s.selectedLocationIds);
  const allLocationIds = useMemo(() => storeLocations.map((l) => l.id), [storeLocations]);
  const activeIds = useMemo(
    () => activeLocationIdsForApi(selectedLocationIds, allLocationIds),
    [selectedLocationIds, allLocationIds]
  );
  const activeLocationLabel = useMemo(() => {
    if (!activeIds?.length) return null;
    if (activeIds.length === 1) {
      const name = storeLocations.find((l) => l.id === activeIds[0])?.name ?? 'Selected location';
      return name;
    }
    return `${activeIds.length} locations`;
  }, [activeIds, storeLocations]);

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

  const liveRange = useMemo(() => {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth() - 11, 1, 0, 0, 0, 0);
    const to = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0);
    return { from, to };
  }, []);

  const liveAppointmentsQuery = trpc.appointments.list.useQuery(
    {
      from: liveRange.from,
      to: liveRange.to,
      limit: 500,
      ...(activeIds?.length ? { locationIds: activeIds } : {}),
    },
    { enabled: isSignedIn && Boolean(activeIds?.length) }
  );

  const liveMonthlySeries = useMemo(() => {
    if (!activeIds?.length || !isSignedIn) return [];
    const items = liveAppointmentsQuery.data?.items ?? [];

    const monthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const monthLabel = (d: Date) =>
      d.toLocaleString(undefined, { month: 'short', year: 'numeric' });

    const months: { key: string; label: string }[] = [];
    for (let i = 0; i < 12; i += 1) {
      const d = new Date(liveRange.from.getFullYear(), liveRange.from.getMonth() + i, 1, 0, 0, 0, 0);
      months.push({ key: monthKey(d), label: monthLabel(d) });
    }

    const map = new Map<string, { total: number; attended: number; dna: number }>();
    for (const m of months) map.set(m.key, { total: 0, attended: 0, dna: 0 });

    for (const apt of items as Array<{ status?: string; slot?: { startAt?: string | Date } | null }>) {
      const startRaw = apt.slot?.startAt;
      if (!startRaw) continue;
      const startAt = startRaw instanceof Date ? startRaw : new Date(startRaw);
      const k = monthKey(new Date(startAt.getFullYear(), startAt.getMonth(), 1));
      const row = map.get(k);
      if (!row) continue;
      row.total += 1;
      if (apt.status === 'COMPLETED') row.attended += 1;
      if (apt.status === 'NO_SHOW') row.dna += 1;
    }

    return months.map((m) => {
      const row = map.get(m.key)!;
      const dnaRate = row.total > 0 ? row.dna / row.total : 0;
      return {
        monthKey: m.key,
        monthLabel: m.label,
        total: row.total,
        attended: row.attended,
        dna: row.dna,
        dnaRate,
        dnaRatePct: Math.round(dnaRate * 1000) / 10,
      };
    });
  }, [activeIds, isSignedIn, liveAppointmentsQuery.data?.items, liveRange.from]);

  const liveLocationSplitSeries = useMemo(() => {
    if (!activeIds?.length || !isSignedIn) return { rows: [] as Record<string, string | number>[], keys: [] as string[], names: [] as string[] };
    const items = liveAppointmentsQuery.data?.items ?? [];
    const now = new Date();

    const monthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const monthLabel = (d: Date) => d.toLocaleString(undefined, { month: 'short', year: 'numeric' });

    const months: { key: string; label: string }[] = [];
    for (let i = 0; i < 12; i += 1) {
      const d = new Date(liveRange.from.getFullYear(), liveRange.from.getMonth() + i, 1, 0, 0, 0, 0);
      months.push({ key: monthKey(d), label: monthLabel(d) });
    }

    const counts = new Map<string, number>(); // locationId -> count
    for (const apt of items as Array<{ slot?: { location?: { id?: string } | null } | null }>) {
      const id = apt.slot?.location?.id;
      if (!id) continue;
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }

    const sortedLocs = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([id]) => id);
    const top = sortedLocs.slice(0, 4);
    const hasOther = sortedLocs.length > 4;
    const keys = top.map((_, i) => `l${i}`);
    const names = top.map((id) => storeLocations.find((l) => l.id === id)?.name ?? id).concat(hasOther ? ['Other'] : []);
    const allKeys = keys.concat(hasOther ? ['other'] : []);

    const byMonth = new Map<string, Record<string, number>>();
    for (const m of months) {
      const o: Record<string, number> = {};
      for (const k of allKeys) o[k] = 0;
      byMonth.set(m.key, o);
    }

    for (const apt of items as Array<{ slot?: { startAt?: string | Date; location?: { id?: string } | null } | null }>) {
      const startRaw = apt.slot?.startAt;
      const locId = apt.slot?.location?.id;
      if (!startRaw || !locId) continue;
      const startAt = startRaw instanceof Date ? startRaw : new Date(startRaw);
      if (startAt.getTime() < liveRange.from.getTime() || startAt.getTime() >= liveRange.to.getTime()) continue;
      const mk = monthKey(new Date(startAt.getFullYear(), startAt.getMonth(), 1));
      const row = byMonth.get(mk);
      if (!row) continue;
      const idx = top.indexOf(locId);
      if (idx >= 0) row[`l${idx}`] = (row[`l${idx}`] ?? 0) + 1;
      else if (hasOther) row.other = (row.other ?? 0) + 1;
    }

    const rows = months.map((m) => ({ month: m.label, ...(byMonth.get(m.key) ?? {}) })) as Record<string, string | number>[];
    const finalKeys = allKeys;
    const finalNames = names;
    return { rows, keys: finalKeys, names: finalNames };
  }, [activeIds, isSignedIn, liveAppointmentsQuery.data?.items, liveRange.from, liveRange.to, storeLocations]);

  const liveAgeSeries = useMemo(() => {
    if (!activeIds?.length || !isSignedIn) return [] as AgeRow[];
    const items = liveAppointmentsQuery.data?.items ?? [];
    const now = new Date();
    const map = new Map<string, { attended: number; dna: number }>();

    for (const apt of items as Array<{ status?: string; patient?: { user?: { dateOfBirth?: string | Date | null } | null } | null }>) {
      const dobRaw = apt.patient?.user?.dateOfBirth ?? null;
      const dob = dobRaw ? (dobRaw instanceof Date ? dobRaw : new Date(dobRaw)) : null;
      const age = dob ? yearsBetween(dob, now) : null;
      const band = ageBand(age);
      const row = map.get(band) ?? { attended: 0, dna: 0 };
      if (apt.status === 'COMPLETED') row.attended += 1;
      if (apt.status === 'NO_SHOW') row.dna += 1;
      map.set(band, row);
    }

    const order = (b: string) => {
      const m = b.match(/(\d+)/);
      return m ? parseInt(m[1], 10) : 999;
    };

    return [...map.entries()]
      .map(([band, v]) => ({ band, attended: v.attended, dna: v.dna }))
      .filter((r) => r.band.toLowerCase() !== 'unknown')
      .sort((a, b) => order(a.band) - order(b.band));
  }, [activeIds, isSignedIn, liveAppointmentsQuery.data?.items]);

  const liveNoShowByAge = useMemo(() => {
    if (!activeIds?.length || !isSignedIn) return [] as NoShowRow[];
    const items = liveAppointmentsQuery.data?.items ?? [];
    const now = new Date();
    const map = new Map<string, { showed: number; noShow: number }>();

    for (const apt of items as Array<{ status?: string; patient?: { user?: { dateOfBirth?: string | Date | null } | null } | null }>) {
      const dobRaw = apt.patient?.user?.dateOfBirth ?? null;
      const dob = dobRaw ? (dobRaw instanceof Date ? dobRaw : new Date(dobRaw)) : null;
      const age = dob ? yearsBetween(dob, now) : null;
      const band = ageBand(age);
      const row = map.get(band) ?? { showed: 0, noShow: 0 };
      if (apt.status === 'COMPLETED') row.showed += 1;
      if (apt.status === 'NO_SHOW') row.noShow += 1;
      map.set(band, row);
    }

    const order = (b: string) => {
      const m = b.match(/(\d+)/);
      return m ? parseInt(m[1], 10) : 999;
    };

    return [...map.entries()]
      .map(([bucket, v]) => {
        const total = v.showed + v.noShow;
        const rate = total > 0 ? v.noShow / total : 0;
        return { bucket, showed: v.showed, noShow: v.noShow, rate: Math.round(rate * 1000) / 10 };
      })
      .filter((r) => r.bucket.toLowerCase() !== 'unknown')
      .sort((a, b) => order(a.bucket) - order(b.bucket));
  }, [activeIds, isSignedIn, liveAppointmentsQuery.data?.items]);

  const liveTreatments = useMemo(() => {
    if (!activeIds?.length || !isSignedIn) return [] as TreatmentRow[];
    const items = liveAppointmentsQuery.data?.items ?? [];
    const map = new Map<string, { appointments: number; attended: number; dna: number }>();

    for (const apt of items as Array<{ status?: string; practitioner?: { speciality?: string | null } | null }>) {
      const name = apt.practitioner?.speciality?.trim() || 'General';
      const row = map.get(name) ?? { appointments: 0, attended: 0, dna: 0 };
      row.appointments += 1;
      if (apt.status === 'COMPLETED') row.attended += 1;
      if (apt.status === 'NO_SHOW') row.dna += 1;
      map.set(name, row);
    }

    return [...map.entries()]
      .map(([name, v]) => ({ name, appointments: v.appointments, attended: v.attended, dna: v.dna }))
      .sort((a, b) => b.appointments - a.appointments)
      .slice(0, 12);
  }, [activeIds, isSignedIn, liveAppointmentsQuery.data?.items]);

  const monthlySeries = useMemo(() => {
    if (!data) return [];
    return data.monthlyOutpatient.map((m) => ({
      ...m,
      dnaRatePct: Math.round(m.dnaRate * 1000) / 10,
    }));
  }, [data]);

  const seriesForCharts = activeIds?.length && isSignedIn ? liveMonthlySeries : monthlySeries;

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

  const locationSplitForCharts = activeIds?.length && isSignedIn ? liveLocationSplitSeries : null;
  const ageSeriesForCharts = activeIds?.length && isSignedIn ? liveAgeSeries : ageSorted;
  const noShowByAgeForCharts = activeIds?.length && isSignedIn ? liveNoShowByAge : (data?.noShowByAgeBucket ?? []);
  const treatmentsForCharts = activeIds?.length && isSignedIn
    ? [...liveTreatments].sort((a, b) => a.appointments - b.appointments)
    : treatmentChartData;

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

      {activeIds?.length ? (
        <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-[#C5B6B3] lg:px-5">
          <span className="font-semibold text-white">Location filter:</span>{' '}
          <span className="text-white">{activeLocationLabel ?? `${activeIds.length} locations`}</span>.{' '}
          {isSignedIn ? (
            <span>Charts with live data will be filtered to your selected clinics.</span>
          ) : (
            <span>Sign in to see location-filtered live analytics.</span>
          )}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <Panel
          title={activeIds?.length && isSignedIn ? 'Selected locations — appointments (live)' : 'National outpatient volume (time series)'}
          subtitle={
            activeIds?.length && isSignedIn
              ? 'Monthly appointment volume for your selected location(s), based on this app’s data.'
              : 'Monthly total appointments with attended vs did-not-attend (DNA) from HES open data.'
          }
        >
          <div style={{ height: CHART_HEIGHT }}>
            <ResponsiveContainer width="100%" height="100%">
              {chartKind === 'area' ? (
                <AreaChart data={seriesForCharts} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid {...gridProps} />
                  <XAxis dataKey="monthLabel" interval={Math.ceil(seriesForCharts.length / 12) - 1} angle={-35} textAnchor="end" height={56} {...axisProps} />
                  <YAxis tickFormatter={formatCompact} width={44} {...axisProps} />
                  <Tooltip content={<DarkTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: 16 }} />
                  <Area type="monotone" dataKey="attended" name="Attended" stackId="1" stroke={ATTENDED} fill={ATTENDED} fillOpacity={0.35} strokeWidth={2} />
                  <Area type="monotone" dataKey="dna" name="DNA" stackId="1" stroke={DNA} fill={DNA} fillOpacity={0.4} strokeWidth={2} />
                </AreaChart>
              ) : (
                <BarChart data={seriesForCharts} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid {...gridProps} />
                  <XAxis dataKey="monthLabel" interval={Math.ceil(seriesForCharts.length / 12) - 1} angle={-35} textAnchor="end" height={56} {...axisProps} />
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
          title={activeIds?.length && isSignedIn ? 'Selected locations — no-show rate (live)' : 'DNA rate trend'}
          subtitle={
            activeIds?.length && isSignedIn
              ? 'Monthly no-show rate (NO_SHOW / total) for your selected location(s), based on this app’s data.'
              : 'Share of outpatient appointments recorded as did-not-attend each month.'
          }
        >
          <div style={{ height: CHART_HEIGHT }}>
            <ResponsiveContainer width="100%" height="100%">
              {chartKind === 'area' ? (
                <AreaChart data={seriesForCharts} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid {...gridProps} />
                  <XAxis dataKey="monthLabel" interval={Math.ceil(seriesForCharts.length / 12) - 1} angle={-35} textAnchor="end" height={56} {...axisProps} />
                  <YAxis tickFormatter={(v) => `${v}%`} domain={[0, 'auto']} width={48} {...axisProps} />
                  <Tooltip content={<DarkTooltip />} />
                  <Area type="monotone" dataKey="dnaRatePct" name="DNA rate" stroke="#F0AB6B" fill="#F0AB6B" fillOpacity={0.25} strokeWidth={2} />
                </AreaChart>
              ) : (
                <BarChart data={seriesForCharts} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid {...gridProps} />
                  <XAxis dataKey="monthLabel" interval={Math.ceil(seriesForCharts.length / 12) - 1} angle={-35} textAnchor="end" height={56} {...axisProps} />
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
        title={activeIds?.length && isSignedIn ? 'Selected locations — volume split (live)' : 'Glasgow-area appointment load (monthly)'}
        subtitle={
          activeIds?.length && isSignedIn
            ? 'Monthly appointment totals split by location (top 4 by volume, remaining grouped as Other).'
            : 'Each month’s national outpatient total is distributed across four illustrative Glasgow zones for capacity planning views.'
        }
      >
        <div style={{ height: CHART_HEIGHT + 40 }}>
          <ResponsiveContainer width="100%" height="100%">
            {chartKind === 'area' ? (
              <AreaChart data={locationSplitForCharts?.rows ?? glasgowWide} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="month" angle={-30} textAnchor="end" height={64} interval={2} {...axisProps} />
                <YAxis tickFormatter={formatCompact} width={48} {...axisProps} />
                <Tooltip content={<DarkTooltip />} />
                <Legend />
                {(locationSplitForCharts?.keys ?? glasgowKeys).map((k, i) => (
                  <Area
                    key={k}
                    type="monotone"
                    dataKey={k}
                    name={(locationSplitForCharts?.names ?? glasgowNames)[i] ?? k}
                    stackId="g"
                    stroke={GLASGOW_COLORS[i % GLASGOW_COLORS.length]}
                    fill={GLASGOW_COLORS[i % GLASGOW_COLORS.length]}
                    fillOpacity={0.35}
                    strokeWidth={1.5}
                  />
                ))}
              </AreaChart>
            ) : (
              <BarChart data={locationSplitForCharts?.rows ?? glasgowWide} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="month" angle={-30} textAnchor="end" height={64} interval={2} {...axisProps} />
                <YAxis tickFormatter={formatCompact} width={48} {...axisProps} />
                <Tooltip content={<DarkTooltip />} />
                <Legend />
                {(locationSplitForCharts?.keys ?? glasgowKeys).map((k, i) => (
                  <Bar
                    key={k}
                    dataKey={k}
                    name={(locationSplitForCharts?.names ?? glasgowNames)[i] ?? k}
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
          title={activeIds?.length && isSignedIn ? 'Age groups (live, filtered)' : 'Age groups (latest HES month)'}
          subtitle={
            activeIds?.length && isSignedIn
              ? 'Attended vs no-show by age band for your selected location(s), based on this app’s data.'
              : 'Attended vs DNA outpatient appointments by NHS age band.'
          }
        >
          <div style={{ height: CHART_HEIGHT }}>
            <ResponsiveContainer width="100%" height="100%">
              {chartKind === 'area' ? (
                <AreaChart data={ageSeriesForCharts} margin={{ top: 8, right: 8, left: 0, bottom: 64 }}>
                  <CartesianGrid {...gridProps} />
                  <XAxis dataKey="band" interval={0} angle={-40} textAnchor="end" height={72} {...axisProps} />
                  <YAxis tickFormatter={formatCompact} width={48} {...axisProps} />
                  <Tooltip content={<DarkTooltip />} />
                  <Legend />
                  <Area type="monotone" dataKey="attended" name="Attended" stroke={ATTENDED} fill={ATTENDED} fillOpacity={0.3} strokeWidth={2} />
                  <Area type="monotone" dataKey="dna" name="DNA" stroke={DNA} fill={DNA} fillOpacity={0.3} strokeWidth={2} />
                </AreaChart>
              ) : (
                <BarChart data={ageSeriesForCharts} margin={{ top: 8, right: 8, left: 0, bottom: 64 }}>
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
          title={activeIds?.length && isSignedIn ? 'Show vs no-show by age (live, filtered)' : 'Show vs no-show by age (Kaggle benchmark)'}
          subtitle={
            activeIds?.length && isSignedIn
              ? 'Attendance pattern for your selected location(s) using this app’s appointment outcomes.'
              : 'Public hospital appointments (Brazil, 2016) — useful pattern reference for engagement modelling.'
          }
        >
          <div style={{ height: CHART_HEIGHT }}>
            <ResponsiveContainer width="100%" height="100%">
              {chartKind === 'area' ? (
                <AreaChart data={noShowByAgeForCharts} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid {...gridProps} />
                  <XAxis dataKey="bucket" {...axisProps} />
                  <YAxis tickFormatter={formatCompact} width={48} {...axisProps} />
                  <Tooltip content={<DarkTooltip />} />
                  <Legend />
                  <Area type="monotone" dataKey="showed" name="Attended" stackId="k" stroke="#7CB9FF" fill="#7CB9FF" fillOpacity={0.35} strokeWidth={2} />
                  <Area type="monotone" dataKey="noShow" name="No-show" stackId="k" stroke="#F87171" fill="#F87171" fillOpacity={0.4} strokeWidth={2} />
                </AreaChart>
              ) : (
                <BarChart data={noShowByAgeForCharts} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
        title={activeIds?.length && isSignedIn ? 'Clinician specialties — top volumes (live, filtered)' : 'Total treatments — leading specialties (latest month)'}
        subtitle={
          activeIds?.length && isSignedIn
            ? 'Appointment volumes grouped by clinician specialty (from your seeded practitioners).'
            : 'Outpatient appointment volumes by treatment specialty from HES provisional open data.'
        }
      >
        <div style={{ height: Math.min(480, (treatmentsForCharts.length || 1) * 36 + 80) }}>
          <ResponsiveContainer width="100%" height="100%">
            {chartKind === 'area' ? (
              <AreaChart data={treatmentsForCharts} layout="vertical" margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
                <CartesianGrid {...gridProps} horizontal={false} />
                <XAxis type="number" tickFormatter={formatCompact} {...axisProps} />
                <YAxis type="category" dataKey="name" width={160} tick={{ fill: '#d4d4d4', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<DarkTooltip />} />
                <Legend />
                <Area type="monotone" dataKey="appointments" name="Total appointments" stroke="#5ED4C8" fill="#5ED4C8" fillOpacity={0.45} strokeWidth={2} />
              </AreaChart>
            ) : (
              <BarChart
                data={treatmentsForCharts}
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
