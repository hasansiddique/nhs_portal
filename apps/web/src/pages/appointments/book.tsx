import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { trpc } from '@nhs-portal/client-api';
import { format, addDays, startOfDay } from 'date-fns';
import { Button, Input, Label } from '@your-props/client/ui';

export default function BookAppointment() {
  const navigate = useNavigate();
  const [from] = useState(() => startOfDay(new Date()));
  const [to] = useState(() => addDays(startOfDay(new Date()), 7));
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [reason, setReason] = useState('');

  const { data: slots, isLoading } = trpc.slots.available.useQuery(
    { from, to },
    { enabled: !!from && !!to }
  );

  const createAppointment = trpc.appointments.create.useMutation({
    onSuccess: () => {
      navigate('/appointments');
    },
  });

  const handleBook = () => {
    if (!selectedSlotId) return;
    createAppointment.mutate({
      patientId: 'demo-patient-id',
      slotId: selectedSlotId,
      reason: reason || undefined,
    });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        to="/appointments"
        className="hover:underline"
        style={{ color: 'var(--primary-color3)' }}
      >
        ← Back to appointments
      </Link>
      <h1 className="mt-4 text-2xl font-bold" style={{ color: 'var(--primary-color2)' }}>
        Book an appointment
      </h1>
      <p className="mt-2" style={{ color: 'var(--primary-color4)' }}>
        Select an available slot. In a full implementation you would sign in and select a patient profile.
      </p>

      <div className="mt-6">
        <Label className="mb-1 block">Reason for visit (optional)</Label>
        <Input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="mt-1"
          placeholder="e.g. Follow-up, new symptoms"
        />
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold" style={{ color: 'var(--primary-color2)' }}>
          Available slots
        </h2>
        {isLoading ? (
          <p className="mt-2" style={{ color: 'var(--primary-color4)' }}>Loading slots...</p>
        ) : !slots?.length ? (
          <p className="mt-2" style={{ color: 'var(--primary-color4)' }}>
            No slots in this range. Try a different date.
          </p>
        ) : (
          <ul className="mt-2 space-y-2">
            {slots.map((slot) => (
              <li key={slot.id}>
                <button
                  type="button"
                  onClick={() => setSelectedSlotId(slot.id)}
                  className="w-full rounded-[10px] border p-3 text-left transition"
                  style={{
                    borderColor: selectedSlotId === slot.id ? 'var(--primary-color3)' : 'rgba(138,138,160,0.3)',
                    backgroundColor: selectedSlotId === slot.id ? 'rgba(239,106,59,0.1)' : 'var(--bg-section)',
                  }}
                >
                  <span className="font-medium" style={{ color: 'var(--primary-color2)' }}>
                    {slot.practitioner?.user?.name}
                  </span>
                  <span style={{ color: 'var(--primary-color4)' }}>
                    {' '}
                    · {slot.location?.name} · {slot.startAt && format(new Date(slot.startAt), 'PPp')}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedSlotId && (
        <div className="mt-6">
          <Button
            type="button"
            onClick={handleBook}
            disabled={createAppointment.isPending}
            variant="default"
          >
            {createAppointment.isPending ? 'Booking...' : 'Confirm booking'}
          </Button>
        </div>
      )}
    </div>
  );
}
