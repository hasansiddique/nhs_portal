import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@nhs-portal/api';
import { httpBatchLink } from '@trpc/client';
import Cookies from 'js-cookie';

export const trpc = createTRPCReact<AppRouter>();

function getBaseUrl() {
  if (typeof window !== 'undefined') {
    return (import.meta as any).env?.VITE_API_URL ?? ''; // same origin when empty (use Vite proxy)
  }
  return process.env.VITE_API_URL ?? 'http://localhost:4000';
}

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/trpc`,
      headers() {
        const raw = typeof window !== 'undefined' ? Cookies.get('token') : undefined;
        if (!raw) return {};
        const authorization = raw.startsWith('Bearer ') ? raw : `Bearer ${raw}`;
        return { authorization };
      },
    }),
  ],
});
