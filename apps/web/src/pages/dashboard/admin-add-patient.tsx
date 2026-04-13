import { useState } from 'react';
import { Link } from 'react-router-dom';
import { trpc } from '@nhs-portal/client-api';
import { toast } from 'sonner';

export default function AdminAddPatient() {
  const utils = trpc.useUtils();
  const { data: locations } = trpc.locations.list.useQuery();
  const create = trpc.patients.adminRegister.useMutation({
    onSuccess: async () => {
      toast.success('Patient account created');
      await utils.patients.list.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [nhsNumber, setNhsNumber] = useState('');
  const [dob, setDob] = useState('1990-01-01');
  const [locationId, setLocationId] = useState('');

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-1 flex-col overflow-auto px-5 py-6 lg:px-8 lg:py-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--primary-color4)' }}>
        Admin
      </p>
      <h1 className="mt-1 text-xl font-bold text-white">Add patient</h1>
      <p className="mt-1 text-sm" style={{ color: 'var(--primary-color4)' }}>
        Creates a login (patient role) and NHS patient record.
      </p>

      <form
        className="mt-8 flex max-w-lg flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          create.mutate({
            email,
            password,
            name,
            nhsNumber,
            dateOfBirth: new Date(dob),
            ...(locationId ? { locationId } : {}),
          });
        }}
      >
        <label className="flex flex-col gap-1 text-sm text-white">
          Full name
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-white"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-white">
          Email (login)
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-white"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-white">
          Password
          <input
            required
            type="password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-white"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-white">
          NHS number
          <input
            required
            value={nhsNumber}
            onChange={(e) => setNhsNumber(e.target.value)}
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-white"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-white">
          Date of birth
          <input
            required
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-white"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-white">
          Home clinic (optional)
          <select
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
            className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-white"
          >
            <option value="">—</option>
            {(locations ?? []).map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </label>
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={create.isPending}
            className="rounded-lg bg-[#ef6b3b] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {create.isPending ? 'Creating…' : 'Create patient'}
          </button>
          <Link to="/dashboard" className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white/80">
            Back
          </Link>
        </div>
      </form>
    </div>
  );
}
