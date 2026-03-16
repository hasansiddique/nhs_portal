import React from 'react';

type ColumnAlign = 'left' | 'center' | 'right';

export type NhsDashboardColumn = {
  key: string;
  label: string;
  align?: ColumnAlign;
};

export type NhsDashboardRow = Record<string, React.ReactNode>;

type NhsDashboardTableProps = {
  columns: NhsDashboardColumn[];
  rows: NhsDashboardRow[];
};

const getAlignClass = (align: ColumnAlign | undefined) => {
  switch (align) {
    case 'center':
      return 'text-center';
    case 'right':
      return 'text-right';
    default:
      return 'text-left';
  }
};

export const NhsDashboardTable: React.FC<NhsDashboardTableProps> = ({
  columns,
  rows,
}) => {
  return (
    <div className="mt-6 overflow-hidden rounded-[12px] border border-slate-700/60 bg-slate-900/60">
      <div className="max-h-[460px] overflow-auto">
        <table className="min-w-full text-lg text-slate-200">
          <thead className="bg-slate-900/80 border-b border-slate-700/80">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-base font-semibold uppercase tracking-wide text-slate-400 ${getAlignClass(
                    col.align
                  )}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={idx}
                className="border-b border-slate-800/80 last:border-b-0 hover:bg-slate-800/60"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-4 py-3 text-lg ${getAlignClass(col.align)}`}
                  >
                    {row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-6 text-center text-sm text-slate-500"
                >
                  No records available for this period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

