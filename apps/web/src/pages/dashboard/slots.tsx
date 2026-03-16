import { trpc } from '@nhs-portal/client-api';
import { format, addDays, startOfDay } from 'date-fns';
import { useState } from 'react';

export default function DashboardSlots() {
  const [from] = useState(() => startOfDay(new Date()));
  const [to] = useState(() => addDays(startOfDay(new Date()), 14));
  const { data: slots, isLoading } = trpc.slots.available.useQuery({ from, to });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold" style={{ color: 'var(--primary-color2)' }}>
        Available slots
      </h1>
      <p className="mt-2" style={{ color: 'var(--primary-color4)' }}>
        Slots for the next two weeks. Create slots from the API or a future admin UI.
      </p>
      {isLoading ? (
        <p className="mt-4" style={{ color: 'var(--primary-color4)' }}>Loading...</p>
      ) : !slots?.length ? (
        <p className="mt-4" style={{ color: 'var(--primary-color4)' }}>
          No slots in this period. Run migrations and seed data.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {slots.map((slot) => (
            <li
              key={slot.id}
              className="flex justify-between rounded-[10px] border px-4 py-2"
              style={{
                borderColor: 'rgba(138,138,160,0.3)',
                backgroundColor: 'var(--bg-section)',
              }}
            >
              <span style={{ color: 'var(--primary-color2)' }}>
                {slot.practitioner?.user?.name} · {slot.location?.name}
              </span>
              <span style={{ color: 'var(--primary-color4)' }}>
                {slot.startAt && format(new Date(slot.startAt), 'PPp')}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
