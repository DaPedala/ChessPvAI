import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import sql from '$lib/server/db';
import { verifyPassword, createSession } from '$lib/server/auth';

export const load: PageServerLoad = ({ locals }) => {
	if (locals.user) redirect(303, '/play');
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data     = await request.formData();
		const email    = String(data.get('email')    ?? '').trim().toLowerCase();
		const password = String(data.get('password') ?? '');

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required.' });
		}

		const [user] = await sql`
			SELECT id, password_hash FROM users WHERE email = ${email}
		`;

		if (!user || !(await verifyPassword(password, user.password_hash as string))) {
			return fail(400, { error: 'Invalid email or password.' });
		}

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
