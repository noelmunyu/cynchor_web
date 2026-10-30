import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import { getDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { role, experienceLevel } = await req.json();

    // Validate role
    if (!['RED_TEAM', 'BLUE_TEAM', 'NET_SEC'].includes(role)) {
      if (role === 'GRC') {
        return NextResponse.json(
          { success: false, error: 'GRC role is disabled and coming soon.' },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { success: false, error: 'Please select a valid role (Red Team, Blue Team, or Network Security).' },
        { status: 400 }
      );
    }

    // Validate experience level
    if (!['BEGINNER', 'INTERMEDIATE', 'EXPERT'].includes(experienceLevel)) {
      return NextResponse.json(
        { success: false, error: 'Please select your experience level (Beginner, Intermediate, Expert).' },
        { status: 400 }
      );
    }

    const db = getDb();
    const updateStmt = db.prepare(`
      UPDATE users 
      SET role = ?, experience_level = ?, is_profile_completed = 1 
      WHERE id = ?
    `);

    updateStmt.run(role, experienceLevel, user.id);

    // ASSUMPTION (diagram gap): Profile Making has no outgoing arrow in the DFD.
    // On saving the profile, route the user to the Dashboard.
    return NextResponse.json({
      success: true,
      redirectTo: '/demo/dashboard',
      message: 'Profile completed successfully.',
    });
  } catch (err: unknown) {
    console.error(err); const message = 'Internal error.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

