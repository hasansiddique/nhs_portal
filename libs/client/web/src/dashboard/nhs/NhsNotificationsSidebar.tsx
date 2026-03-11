import React from 'react';

type Notification = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status?: 'success' | 'warning' | 'info';
};

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Clinic capacity reached',
    description: 'Training clinic is at 95% capacity for today.',
    timestamp: '10:15',
    status: 'warning',
  },
  {
    id: '2',
    title: 'New referral received',
    description: 'New patient referral from Dr. Smith.',
    timestamp: '09:42',
    status: 'info',
  },
  {
    id: '3',
    title: 'Payments reconciled',
    description: 'Today’s card payments were reconciled successfully.',
    timestamp: '08:05',
    status: 'success',
  },
];

const badgeClasses: Record<
  NonNullable<Notification['status']>,
  string
> = {
  success:
    'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40',
  warning: 'bg-amber-500/15 text-amber-300 border border-amber-500/40',
  info: 'bg-sky-500/15 text-sky-300 border border-sky-500/40',
};

export const NhsNotificationsSidebar: React.FC = () => {
  return (
    <aside className="h-full rounded-[16px] border border-[#393939] bg-[#393939] p-4 lg:p-5 flex flex-col">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-[18px] font-bold leading-[22px] text-[#EBEBEB]">
            Notifications
          </h2>
          <p className="mt-1 text-[15px] leading-[20px] text-[#C5B6B3]">
            Latest activity for your clinics
          </p>
        </div>
        <span className="inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-slate-800 px-2 text-xs font-semibold text-slate-200">
          {mockNotifications.length}
        </span>
      </header>

      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        {mockNotifications.map((item) => (
          <article
            key={item.id}
            className="rounded-[10px] border border-slate-700/80 bg-slate-900/80 p-3 text-[14px] text-slate-200"
          >
            <div className="mb-1 flex items-center justify-between gap-2">
              <h3 className="truncate text-[15px] font-semibold text-slate-100">
                {item.title}
              </h3>
              {item.status && (
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-medium ${badgeClasses[item.status]}`}
                >
                  {item.status === 'success' && 'Resolved'}
                  {item.status === 'warning' && 'Attention'}
                  {item.status === 'info' && 'Update'}
                </span>
              )}
            </div>
            <p className="line-clamp-2 text-[14px] text-slate-300">
              {item.description}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Today · {item.timestamp}
            </p>
          </article>
        ))}
      </div>

      <button className="mt-3 w-full rounded-[10px] border border-slate-700/80 bg-slate-800/80 py-2 text-[14px] font-medium text-slate-200 hover:bg-slate-700/80">
        View all notifications
      </button>
    </aside>
  );
};

