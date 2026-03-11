import { router } from '../trpc/trpc';
import { authRouter } from './auth';
import { patientsRouter } from './patients';
import { practitionersRouter } from './practitioners';
import { locationsRouter } from './locations';
import { slotsRouter } from './slots';
import { appointmentsRouter } from './appointments';

export const appRouter = router({
  auth: authRouter,
  patients: patientsRouter,
  practitioners: practitionersRouter,
  locations: locationsRouter,
  slots: slotsRouter,
  appointments: appointmentsRouter,
});

export type AppRouter = typeof appRouter;
