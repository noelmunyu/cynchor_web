import { NextRequest, NextResponse } from 'next/server';
import { getDb, verifyPassword, recordAuditLog, verifyAndConsumeInvite } from '@/lib/db';
import { checkRateLimit, resetRateLimit, setSessionCookie } from '@/lib/session';
import { loginSchema } from '@/lib/validators';
import { User } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || req.ip || '127.0.0.1';
    
    // Rate limit login attempts: max 5 attempts with lockout backoff
    const rateCheck = checkRateLimit(`login_${ip}`, 5, 60);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many login attempts. Account temporarily locked for ${rateCheck.retryAfter || 60} seconds.`,
        },
        { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfter || 60) } }
      );
    }

    const body = await req.json().catch(() => ({}));
    const parseResult = loginSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: parseResult.error.issues?.[0]?.message || 'Invalid input credentials.' },
        { status: 400 }
      );
    }

    const { email, password } = parseResult.data;
    const emailRate = checkRateLimit(`login_email_${email.toLowerCase()}`, 5, 60);
    if (!emailRate.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many login attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(emailRate.retryAfter || 60) } }
      );
    }
    const inviteToken = body.inviteToken;

    const db = getDb();
    const userStmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = userStmt.get(email) as (User & { password_hash: string }) | undefined;

    // Timing-safe check: no user enumeration (same time taken even if user does not exist)
    const dummyHash = '00000000000000000000000000000000:00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
    const hashToVerify = user ? user.password_hash : dummyHash;
    const isValid = verifyPassword(password, hashToVerify);

    if (!user || !isValid) {
      recordAuditLog({
        userId: email,
        action: 'LOGIN_FAILED',
        details: 'Failed credentials entered',
        ip,
      });
      return NextResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // If an invite token was provided, consume it
    if (inviteToken) {
      verifyAndConsumeInvite(String(inviteToken), email);
    }

    // Successful login: reset rate limit counter
    resetRateLimit(`login_${ip}`);

    // Set signed HTTP-only rotated session cookie
    setSessionCookie(user.id);

    // Audit log successful authentication
    recordAuditLog({
      userId: user.id,
      action: 'LOGIN_SUCCESS',
      details: `User ${user.email} logged in successfully`,
      ip,
    });

    const isNew = Number(user.is_profile_completed) === 0;

    return NextResponse.json({
      success: true,
      isNew,
      redirectTo: isNew ? '/demo/profile' : '/demo/dashboard',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        is_operator: user.is_operator,
      },
    });
  } catch (err: unknown) {
    console.error('login error:', err);
    return NextResponse.json({ success: false, error: 'Authentication failure.' }, { status: 500 });
  }
}
