import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import { getDb, hashPassword, createSecureInvite, recordAuditLog, getAuditLogs } from '@/lib/db';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    // RBAC: strictly verify operator status
    // (allow local dev or signed-in operator)
    if (!user || !user.is_operator) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Operator privileges required' },
        { status: 403 }
      );
    }

    const db = getDb();
    const requestsStmt = db.prepare('SELECT * FROM access_requests ORDER BY created_at DESC');
    const requests = requestsStmt.all();

    const invitesStmt = db.prepare('SELECT id, email, is_used, expires_at, created_at FROM invites ORDER BY created_at DESC');
    const invites = invitesStmt.all();

    const usersStmt = db.prepare('SELECT id, email, name, role, experience_level, is_profile_completed, is_operator, created_at FROM users ORDER BY created_at DESC');
    const users = usersStmt.all();

    const auditLogs = getAuditLogs(50);

    return NextResponse.json({
      success: true,
      requests,
      invites,
      users,
      auditLogs,
      currentUser: user,
    });
  } catch (err: unknown) {
    console.error(err); const message = 'Internal error.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.is_operator) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Operator privileges required' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { action } = body;
    const db = getDb();
    const now = new Date().toISOString();
    const ip = req.headers.get('x-forwarded-for') || req.ip || '127.0.0.1';

    if (action === 'APPROVE_REQUEST') {
      const { requestId } = body;
      const reqRow = db.prepare('SELECT email, status FROM access_requests WHERE id = ?').get(String(requestId)) as { email: string; status: string } | undefined;
      if (!reqRow || reqRow.status !== 'PENDING') {
        return NextResponse.json({ success: false, error: 'Request not found or already processed.' }, { status: 404 });
      }
      const email = reqRow.email;
      const { plainToken, expiresAt } = createSecureInvite(email || 'recruit@cynchor.local');

      // Update access request
      db.prepare(`
        UPDATE access_requests
        SET status = 'APPROVED', approved_at = ?, generated_invite_token = ?
        WHERE id = ?
      `).run(now, null, requestId);

      recordAuditLog({
        userId: user?.id || 'OPERATOR',
        action: 'ACCESS_REQUEST_APPROVED',
        details: `Approved request ${requestId} for ${email}`,
        ip,
      });

      return NextResponse.json({ success: true, token: plainToken });
    }

    if (action === 'GENERATE_INVITE') {
      const { email } = body;
      const targetEmail = email?.trim().toLowerCase() || 'recruit@cynchor.local';
      const { plainToken } = createSecureInvite(targetEmail);

      recordAuditLog({
        userId: user?.id || 'OPERATOR',
        action: 'INVITE_MANUALLY_GENERATED',
        details: `Operator created 256-bit invite for ${targetEmail}`,
        ip,
      });

      return NextResponse.json({ success: true, token: plainToken });
    }

    if (action === 'PROVISION_USER') {
      const { name, email, password, role, isOperator } = body;
      if (!email || !password || !name) {
        return NextResponse.json({ success: false, error: 'Name, email, and password are required' }, { status: 400 });
      }

      const userId = `user_${crypto.randomUUID()}`;
      if (typeof email !== "string" || !email.includes("@") || email.length > 254 || typeof name !== "string" || name.length > 100 || typeof password !== "string" || password.length < 12 || !["RED_TEAM", "BLUE_TEAM", "NET_SEC"].includes(role || "BLUE_TEAM")) {
        return NextResponse.json({ success: false, error: "Valid name, email, a password of at least 12 characters, and a valid role are required." }, { status: 400 });
      }
      const pHash = hashPassword(password);

      db.prepare(`
        INSERT INTO users (id, email, password_hash, name, role, experience_level, is_profile_completed, is_operator, created_at)
        VALUES (?, ?, ?, ?, ?, 'INTERMEDIATE', 1, ?, ?)
      `).run(
        userId,
        email.trim().toLowerCase(),
        pHash,
        name.trim(),
        role || 'BLUE_TEAM',
        isOperator ? 1 : 0,
        now
      );

      recordAuditLog({
        userId: user?.id || 'OPERATOR',
        action: 'USER_PROVISIONED',
        details: `Provisioned user ${email} (Role: ${role || 'BLUE_TEAM'}, Operator: ${!!isOperator})`,
        ip,
      });

      return NextResponse.json({ success: true, userId });
    }

    return NextResponse.json({ success: false, error: 'Invalid admin action' }, { status: 400 });
  } catch (err: unknown) {
    console.error(err); const message = 'Internal error.';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
