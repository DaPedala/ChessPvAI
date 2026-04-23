import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import sql from '$lib/server/db';
import { hashPassword, createSession } from '$lib/server/auth';

export const load: PageServerLoad = ({ locals }) => {
	if (locals.user) redirect(303, '/play');
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const email       = String(data.get('email')            ?? '').trim().toLowerCase();
		const displayName = String(data.get('display_name')     ?? '').trim();
		const password    = String(data.get('password')         ?? '');
		const confirm     = String(data.get('confirm_password') ?? '');

		if (!email || !displayName || !password) {
			return fail(400, { error: 'All fields are required.' });
		}
		if (displayName.length < 2 || displayName.length > 30) {
			return fail(400, { error: 'Display name must be 2–30 characters.' });
		}
		if (password.length < 8) {
			return fail(400, { error: 'Password must be at least 8 characters.' });
		}
		if (password !== confirm) {
			return fail(400, { error: 'Passwords do not match.' });
		}

		const [existing] = await sql`
			SELECT id FROM users
			WHERE email = ${email} OR LOWER(display_name) = LOWER(${displayName})
			LIMIT 1
		`;
		if (existing) {
			return fail(400, { error: 'Email or display name is already in use.' });
		}

		const passwordHash = await hashPassword(password);
		const [user] = await sql`
			INSERT INTO users (email, display_name, password_hash)
			VALUES (${email}, ${displayName}, ${passwordHash})
			RETURNING id
		`;

		const sessionId = await createSession(user.id as string);
		cookies.set('session_id', sessionId, {
			httpOnly: true,
			sameSite: 'lax',
			path: '/',
			maxAge: 60 * 60 * 24 * 30
		});

		redirect(303, '/play');
	}
};
