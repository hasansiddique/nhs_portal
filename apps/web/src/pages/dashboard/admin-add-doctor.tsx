import { useState } from 'react';
import { Link } from 'react-router-dom';
import { trpc } from '@nhs-portal/client-api';
import { toast } from 'sonner';

export default function AdminAddDoctor() {
  const utils = trpc.useUtils();
  const { data: locations } = trpc.locations.list.useQuery();
  const create = trpc.practitioners.adminRegister.useMutation({
    onSuccess: async () => {
      toast.success('Clinician account created');
      await utils.practitioners.list.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [title, setTitle] = useState('Dr');
  const [speciality, setSpeciality] = useState('General Practice');
  const [gmcNumber, setGmcNumber] = useState('');
  const [selectedLocs, setSelectedLocs] = useState<string[]>([]);

  const toggleLoc = (id: string) => {
    setSelectedLocs((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  const locList = locations ?? [];

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-1 flex-col overflow-auto px-5 py-6 lg:px-8 lg:py-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--primary-color4)' }}>
        Admin
      </p>
      <h1 className="mt-1 text-xl font-bold text-white">Add doctor / clinician</h1>
      <p className="mt-1 text-sm" style={{ color: 'var(--primary-color4)' }}>
        Creates a login (practitioner role), profile, and clinic links (required for booking).
      </p>

      <form
        className="mt-8 flex max-w-lg flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (selectedLocs.length === 0) {
            toast.error('Select at least one clinic');
            return;
          }
          create.mutate({
            email,
            password,
            name,
            title: title || undefined,
            speciality: speciality || undefined,
            gmcNumber: gmcNumber.trim() || null,
            locationIds: selectedLocs,
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
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-white" />
        </label>
        <label className="flex flex-col gap-1 text-sm text-white">
          Speciality
          <input value={speciality} onChange={(e) => setSpeciality(e.target.value)} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-white" />
        </label>
        <label className="flex flex-col gap-1 text-sm text-white">
          GMC number (optional)
          <input value={gmcNumber} onChange={(e) => setGmcNumber(e.target.value)} className="rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-white" />
        </label>

        <div>
          <p className="text-sm font-medium text-white">Clinics</p>
          <p className="text-xs" style={{ color: 'var(--primary-color4)' }}>
            Select every location this clinician works at.
          </p>
          <ul className="mt-2 space-y-2">
            {locList.map((l) => (
              <li key={l.id}>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-white">
                  <input type="checkbox" checked={selectedLocs.includes(l.id)} onChange={() => toggleLoc(l.id)} />
                  {l.name}
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={create.isPending}
            className="rounded-lg bg-[#ef6b3b] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {create.isPending ? 'Creating…' : 'Create clinician'}
          </button>
          <Link to="/dashboard" className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white/80">
            Back
          </Link>
        </div>
      </form>
    </div>
  );
}
