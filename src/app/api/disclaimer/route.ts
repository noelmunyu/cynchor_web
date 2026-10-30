import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/session';
import { getDb, hashIpAddress } from '@/lib/db';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || req.ip || '127.0.0.1';
    const rl = checkRateLimit(`public_${ip}`, 10, 60);
    if (!rl.allowed) {
      return NextResponse.json({ success: false, error: 'Too many requests. Please try again later.' }, { status: 429, headers: { 'Retry-After': String(rl.retryAfter || 60) } });
    }
    const db = getDb();

    const id = `disc_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const acceptedAt = new Date().toISOString();
    const userIdentifier = req.headers.get('user-agent') || 'anonymous-browser';

    const stmt = db.prepare(`
      INSERT INTO disclaimers (id, accepted_at, user_identifier, ip_address, version)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(id, acceptedAt, userIdentifier.slice(0, 200), hashIpAddress(ip), 'v1.1');

    return NextResponse.json({
      success: true,
      id,
      acceptedAt,
      message: 'Disclaimer agreement recorded with timestamp.',
    });
  } catch (err: unknown) {
    console.error(err); const message = 'Internal error.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

