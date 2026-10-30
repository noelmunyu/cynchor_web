import type { ReactNode } from 'react';
import { requireUser } from '@/lib/guards';

export default async function Layout({ children }: { children: ReactNode }) {
  await requireUser();
  return <>{children}</>;
}
