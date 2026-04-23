import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import sql from '$lib/server/db';

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) throw error(401, 'Not authenticated');

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		throw error(400, 'Invalid JSON body');
	}

	const { game, moves } = body as {
		game: {
			session_id:         string;
			match_number:       number;
			chess_type:         string;
			time_base:          number;
			time_increment_sec: number;
			time_control:       string;
			ai_skill_level:     number;
			moves_count:        number;
			termination_reason: string;
			timestamp:          string;
		};
		moves: Array<{
			san:      string;
			fen:      string;
			category: string;
			value:    number;
			evalCp:   number;
		}>;
	};

	if (!game?.session_id || !Array.isArray(moves)) {
		throw error(400, 'Missing game or moves data');
	}

	try {
		await sql.begin(async (tx) => {
			await tx`
				INSERT INTO games (
					session_id,
					user_id,
					match_number,
					chess_type,
					time_base,
					time_increment_sec,
					time_control,
					ai_skill_level,
					moves_count,
					termination_reason,
					played_at
				) VALUES (
					${game.session_id},
					${locals.user!.id},
					${game.match_number},
					${game.chess_type},
					${game.time_base},
					${game.time_increment_sec},
					${game.time_control},
					${game.ai_skill_level},
					${game.moves_count},
					${game.termination_reason},
					${game.timestamp}
				)
			`;

			if (moves.length > 0) {
				await tx`
					INSERT INTO moves ${tx(
						moves.map((m, i) => ({
							session_id:  game.session_id,
							move_number: i + 1,
							san:         m.san,
							fen:         m.fen,
							category:    m.category,
							value:       m.value,
							eval_cp:     m.evalCp,
						}))
					)}
				`;
			}
		});

		return json({ ok: true });
	} catch (e) {
		console.error('[DB] Export failed:', e);
		throw error(500, 'Database write failed');
	}
};

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) throw error(401, 'Not authenticated');

	try {
		const games = await sql`
			SELECT * FROM games
			WHERE user_id = ${locals.user.id}
			ORDER BY played_at DESC
		`;
		const result = await Promise.all(
			games.map(async (game) => {
				const moves = await sql`
					SELECT * FROM moves
					WHERE session_id = ${game.session_id}
					ORDER BY move_number ASC
				`;
				return {
					metadata: {
						session_id:         game.session_id,
						username:           locals.user!.display_name,
						match_number:       game.match_number,
						chess_type:         game.chess_type,
						time_base:          game.time_base,
						time_increment_sec: game.time_increment_sec,
						time_control:       game.time_control,
						ai_skill_level:     game.ai_skill_level,
						moves_count:        game.moves_count,
						termination_reason: game.termination_reason,
						timestamp:          game.played_at,
					},
					data: moves.map(m => ({
						san:      m.san,
						fen:      m.fen,
						category: m.category,
						value:    m.value,
						evalCp:   m.eval_cp,
					}))
				};
			})
		);
		return json(result);
	} catch (e) {
		console.error('[DB] Read failed:', e);
		throw error(500, 'Database read failed');
	}
};
