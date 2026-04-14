import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

/** One row per distinct Sub-ICB (place of care) from NHS England GP appointments regional open data. */
export type SubIcbLocationSeed = {
  id: string;
  code: string;
  name: string;
  icbName: string;
  regionName: string;
  address: string;
  postcode: string | null;
};

function regionalCsvDir(): string {
  return path.join(__dirname, '../../../datasets/datasets/gp-appointments-regional-dec2025');
}

/**
 * Reads all `Regional_CSV_*.csv` files and deduplicates by SUB_ICB_LOCATION_CODE.
 * Columns match NHS Digital GP appointments regional publication (Dec 2025 extract).
 */
export function loadSubIcbLocationsFromDataset(): SubIcbLocationSeed[] {
  const dir = regionalCsvDir();
  if (!fs.existsSync(dir)) {
    throw new Error(
      `GP regional dataset directory not found: ${dir}. Clone the repo with datasets/ or add the CSV bundle.`
    );
  }

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.startsWith('Regional_CSV_') && f.endsWith('.csv'))
    .sort();

  if (files.length === 0) {
    throw new Error(`No Regional_CSV_*.csv files under ${dir}`);
  }

  const byCode = new Map<
    string,
    { code: string; name: string; icbName: string; regionName: string }
  >();

  for (const file of files) {
    const full = path.join(dir, file);
    const raw = fs.readFileSync(full, 'utf8');
    const records = parse(raw, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
    }) as Record<string, string>[];

    for (const r of records) {
      const code = (r.SUB_ICB_LOCATION_CODE ?? '').trim();
      if (!code || byCode.has(code)) continue;

      const name = (r.SUB_ICB_LOCATION_NAME ?? '').trim() || `Sub-ICB ${code}`;
      const icbName = (r.ICB_NAME ?? '').trim() || 'ICB unknown';
      const regionName = (r.REGION_NAME ?? '').trim() || 'Region unknown';

      byCode.set(code, { code, name, icbName, regionName });
    }
  }

  const rows = [...byCode.values()].sort((a, b) => a.code.localeCompare(b.code));

  return rows.map((row) => ({
    id: `loc-${row.code}`,
    code: row.code,
    name: row.name,
    icbName: row.icbName,
    regionName: row.regionName,
    address: `${row.icbName} · ${row.regionName}`,
    postcode: null,
  }));
}

export function nhsEnglandRegionsFromLocations(locations: SubIcbLocationSeed[]): string[] {
  const set = new Set(locations.map((l) => l.regionName).filter(Boolean));
  return [...set].sort((a, b) => a.localeCompare(b));
}
