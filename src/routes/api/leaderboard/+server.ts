import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import sql from '$lib/server/db';

export const GET: RequestHandler = async () => {
	try {
		const rows = await sql`
			SELECT
				u.display_name                                           AS username,
				COUNT(*)                                                 AS games_played,
				ROUND(AVG(g.moves_count), 1)                            AS avg_moves,
				SUM(CASE WHEN g.termination_reason ILIKE '%player%' THEN 1 ELSE 0 END) AS wins,
				ROUND(
					100.0 * SUM(CASE WHEN g.termination_reason ILIKE '%player%' THEN 1 ELSE 0 END)
					/ COUNT(*), 1
				)                                                        AS win_rate,
				MIN(g.ai_skill_level)                                   AS min_skill,
				MAX(g.ai_skill_level)                                   AS max_skill
			FROM games g
			JOIN users u ON u.id = g.user_id
			GROUP BY u.id, u.display_name
			ORDER BY win_rate DESC, games_played DESC
		`;
		return json(rows);
	} catch (e) {
		console.error('[DB] Leaderboard failed:', e);
		throw error(500, 'Database read failed');
	}
};
