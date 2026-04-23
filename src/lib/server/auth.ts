import bcrypt from 'bcryptjs';
import sql from './db';

const SESSION_DAYS = 30;

export interface SessionUser {
	id: string;
	email: string;
	display_name: string;
}

export function hashPassword(password: string): Promise<string> {
	return bcrypt.hash(password, 12);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
	return bcrypt.compare(password, hash);
}

export async function createSession(userId: string): Promise<string> {
	const expiresAt = new Date();
	expiresAt.setDate(expiresAt.getDate() + SESSION_DAYS);
	const [session] = await sql`
		INSERT INTO sessions (user_id, expires_at)
		VALUES (${userId}, ${expiresAt})
		RETURNING id
	`;
	return session.id as string;
}

export async function getSessionUser(sessionId: string): Promise<SessionUser | null> {
	const [row] = await sql`
		SELECT u.id, u.email, u.display_name
		FROM sessions s
		JOIN users u ON u.id = s.user_id
		WHERE s.id = ${sessionId}
		  AND s.expires_at > NOW()
	`;
	if (!row) return null;
	return { id: row.id as string, email: row.email as string, display_name: row.display_name as string };
}

export async function deleteSession(sessionId: string): Promise<void> {
	await sql`DELETE FROM sessions WHERE id = ${sessionId}`;
}
