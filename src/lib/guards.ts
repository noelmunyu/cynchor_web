import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';

export async function requireUser(opts: { profile?: boolean; operator?: boolean } = {}) {
  const user = await getCurrentUser();
  if (user === null) redirect('/demo/login');
  const isOperator = Number(user.is_operator) === 1;
  if (opts.operator === true && isOperator === false) redirect('/demo/dashboard');
  const profileDone = Number(user.is_profile_completed) === 1;
  if (opts.profile === true && profileDone === false) redirect('/demo/profile');
  return user;
}
