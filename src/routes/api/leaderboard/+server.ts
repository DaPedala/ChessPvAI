import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import sql from '$lib/server/db';

export const GET: RequestHandler = async () => {
    try {
        const rows = await sql`
            SELECT
                username,
                COUNT(*)                                         AS games_played,
                ROUND(AVG(moves_count), 1)                       AS avg_moves,
                SUM(CASE WHEN termination_reason ILIKE '%player%' THEN 1 ELSE 0 END) AS wins,
                ROUND(
                    100.0 * SUM(CASE WHEN termination_reason ILIKE '%player%' THEN 1 ELSE 0 END)
                    / COUNT(*), 1
                )                                                AS win_rate,
                MIN(ai_skill_level)                              AS min_skill,
                MAX(ai_skill_level)                              AS max_skill
            FROM games
            GROUP BY username
            ORDER BY win_rate DESC, games_played DESC
        `;
        return json(rows);
    } catch (e) {
        console.error('[DB] Leaderboard failed:', e);
        throw error(500, 'Database read failed');
    }
};