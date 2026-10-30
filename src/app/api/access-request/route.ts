import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/session';
import { getDb, recordAuditLog } from '@/lib/db';
import { accessRequestSchema } from '@/lib/validators';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || req.ip || '127.0.0.1';
    const rl = checkRateLimit(`public_${ip}`, 10, 60);
    if (!rl.allowed) {
      return NextResponse.json({ success: false, error: 'Too many requests. Please try again later.' }, { status: 429, headers: { 'Retry-After': String(rl.retryAfter || 60) } });
    }
    const body = await req.json().catch(() => ({}));
    const parseResult = accessRequestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: parseResult.error.issues?.[0]?.message || 'Valid name and email are required.' },
        { status: 400 }
      );
    }

    const { name, email } = parseResult.data;
    const db = getDb();
    const id = `req_${crypto.randomUUID()}`;
    const createdAt = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO access_requests (id, name, email, status, created_at)
      VALUES (?, ?, ?, 'PENDING', ?)
    `);

    stmt.run(id, name, email, createdAt);

    recordAuditLog({
      action: 'ACCESS_REQUEST_SUBMITTED',
      details: `Access request submitted for ${email}`,
      ip,
    });

    return NextResponse.json({
      success: true,
      message: "We'll email you a login once approved.",
    });
  } catch (err: unknown) {
    console.error(err); const message = 'Internal error.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
