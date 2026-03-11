import React from 'react';

import { NhsDashboardTable, NhsDashboardColumn } from './NhsDashboardTable';

const columns: NhsDashboardColumn[] = [
  { key: 'date', label: 'Date' },
  { key: 'clinic', label: 'Clinic' },
  { key: 'trainer', label: 'Trainer' },
  { key: 'service', label: 'Service' },
  { key: 'amount', label: 'Amount', align: 'right' },
  { key: 'status', label: 'Status', align: 'center' },
];

const rows = [
  {
    date: 'Today',
    clinic: 'Training - North Wing',
    trainer: 'K. Arnold',
    service: 'Group Session (60m)',
    amount: '£499.00',
    status: (
      <span className="inline-flex rounded-full bg-emerald-500/15 px-3 py-1 text-base font-medium text-emerald-300 border border-emerald-500/40">
        Successful
      </span>
    ),
  },
  {
    date: '10/24/2025',
    clinic: 'Training - South Wing',
    trainer: 'J. Smith',
    service: '1:1 Session (45m)',
    amount: '£299.00',
    status: (
      <span className="inline-flex rounded-full bg-amber-500/15 px-3 py-1 text-base font-medium text-amber-300 border border-amber-500/40">
        Pending
      </span>
    ),
  },
  {
    date: '10/23/2025',
    clinic: 'Training - East Wing',
    trainer: 'M. Jones',
    service: 'Initial Assessment',
    amount: '£150.00',
    status: (
      <span className="inline-flex rounded-full bg-rose-500/15 px-3 py-1 text-base font-medium text-rose-300 border border-rose-500/40">
        Past Due
      </span>
    ),
  },
];

export const NhsDashboardContent: React.FC = () => {
  return (
    <div className="flex h-full flex-col gap-4 rounded-[16px] bg-[#393939] p-5 lg:p-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[15px] leading-[22px] uppercase text-[#C5B6B3]">
            Training
          </p>
          <h1 className="mt-1 text-[18px] font-bold leading-[22px] text-[#EBEBEB]">
            Payments overview
          </h1>
          <p className="mt-1 text-[15px] leading-[20px] text-[#C5B6B3]">
            Monitor clinic revenue, existing vs new business and payment
            status.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[14px]">
          <button className="rounded-[999px] border border-slate-700/70 bg-slate-900/80 px-4 py-2 text-[14px] font-medium text-slate-100 hover:bg-slate-800/80">
            Month · October 2025
          </button>
          <button className="rounded-[999px] border border-slate-800/80 px-4 py-2 text-[14px] text-slate-200 hover:bg-slate-800/80">
            All locations
          </button>
        </div>
      </header>

      <section className="grid gap-3 md:grid-cols-3">
        <div className="rounded-[14px] border border-slate-700/70 bg-slate-900/70 p-4">
          <p className="text-[15px] font-medium uppercase leading-[22px] text-[#C5B6B3]">
            Avg. Existing Payment
          </p>
          <p className="mt-3 text-[20px] font-semibold leading-[24px] text-[#EBEBEB]">
            £450.00
          </p>
          <p className="mt-1 text-[14px] text-emerald-300">+10% vs last month</p>
        </div>
        <div className="rounded-[14px] border border-slate-700/70 bg-slate-900/70 p-4">
          <p className="text-[15px] font-medium uppercase leading-[22px] text-[#C5B6B3]">
            Avg. New Payment
          </p>
          <p className="mt-3 text-[20px] font-semibold leading-[24px] text-[#EBEBEB]">
            £750.00
          </p>
          <p className="mt-1 text-[14px] text-emerald-300">+12% vs last month</p>
        </div>
        <div className="rounded-[14px] border border-slate-700/70 bg-slate-900/70 p-4">
          <p className="text-[15px] font-medium uppercase leading-[22px] text-[#C5B6B3]">
            Total Revenue
          </p>
          <p className="mt-3 text-[20px] font-semibold leading-[24px] text-[#EBEBEB]">
            £19,804.99
          </p>
          <p className="mt-1 text-[14px] text-emerald-300">+3% vs last month</p>
        </div>
      </section>

      <section className="mt-2 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <input
            placeholder="Search by patient, trainer or clinic"
            className="h-[40px] w-full rounded-[999px] border border-slate-700/70 bg-slate-900/80 px-4 text-[14px] text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500/70"
          />
        </div>
        <div className="flex items-center gap-2 text-[14px]">
          <button className="rounded-[999px] border border-slate-700/70 bg-slate-900/80 px-4 py-2 text-slate-200 hover:bg-slate-800/80">
            Trainer · All
          </button>
          <button className="rounded-[999px] border border-slate-700/70 bg-slate-900/80 px-4 py-2 text-slate-200 hover:bg-slate-800/80">
            Status · All
          </button>
        </div>
      </section>

      <NhsDashboardTable columns={columns} rows={rows} />
    </div>
  );
};

