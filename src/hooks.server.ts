import type { Handle } from '@sveltejs/kit';
import { getSessionUser } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get('session_id');
	if (sessionId) {
		event.locals.user = await getSessionUser(sessionId);
	} else {
		event.locals.user = null;
	}
	return resolve(event);
};
