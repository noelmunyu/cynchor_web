import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, user: null }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      experience_level: user.experience_level,
      is_profile_completed: user.is_profile_completed,
      is_operator: user.is_operator,
    },
  });
}

