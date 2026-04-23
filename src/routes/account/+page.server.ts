import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import sql from '$lib/server/db';
import { hashPassword, verifyPassword } from '$lib/server/auth';

export const load: PageServerLoad = ({ locals }) => {
	if (!locals.user) redirect(303, '/auth/login');
	return { user: locals.user };
};

export const actions: Actions = {
	update_display_name: async ({ request, locals }) => {
		if (!locals.user) return fail(401, { nameError: 'Not authenticated.' });

		const data        = await request.formData();
		const displayName = String(data.get('display_name') ?? '').trim();

		if (displayName.length < 2 || displayName.length > 30) {
			return fail(400, { nameError: 'Display name must be 2–30 characters.' });
		}

		const [conflict] = await sql`
			SELECT id FROM users
			WHERE LOWER(display_name) = LOWER(${displayName})
			  AND id != ${locals.user.id}
		`;
		if (conflict) {
			return fail(400, { nameError: 'That display name is already taken.' });
		}

		await sql`UPDATE users SET display_name = ${displayName} WHERE id = ${locals.user.id}`;
		return { nameSuccess: true };
	},

	update_password: async ({ request, locals }) => {
		if (!locals.user) return fail(401, { passError: 'Not authenticated.' });

		const data            = await request.formData();
		const currentPassword = String(data.get('current_password') ?? '');
		const newPassword     = String(data.get('new_password')     ?? '');
		const confirmPassword = String(data.get('confirm_password') ?? '');

		if (!currentPassword || !newPassword) {
			return fail(400, { passError: 'All password fields are required.' });
		}
		if (newPassword.length < 8) {
			return fail(400, { passError: 'New password must be at least 8 characters.' });
		}
		if (newPassword !== confirmPassword) {
			return fail(400, { passError: 'New passwords do not match.' });
		}

		const [user] = await sql`SELECT password_hash FROM users WHERE id = ${locals.user.id}`;
		if (!(await verifyPassword(currentPassword, user.password_hash as string))) {
			return fail(400, { passError: 'Current password is incorrect.' });
		}

		const hash = await hashPassword(newPassword);
		await sql`UPDATE users SET password_hash = ${hash} WHERE id = ${locals.user.id}`;
		return { passSuccess: true };
	}
};
