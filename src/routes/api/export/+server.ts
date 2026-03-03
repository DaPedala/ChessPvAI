import { json } from '@sveltejs/kit';
import fs from 'node:fs/promises';
import path from 'node:path';

export async function POST({ request }) {
	try {
		const payload = await request.json();
		const meta = payload.metadata;


        // +server.ts — in the POST handler
        const safeUsername = String(meta.username || 'Anonymous').replace(/[^a-z0-9]/gi, '_');
        const safeChessType = String(meta.chess_type).replace(/^Custom_[\d.]+_[\d.]+$/, 'Custom'); // ← ADD

        const baseMin = meta.time_base / 60;
        const baseStr = Number.isInteger(baseMin) ? String(baseMin) : baseMin.toFixed(1);
        const timeStr = `${baseStr}+${meta.time_increment_sec}`;

        const filename = `${safeUsername}_${meta.match_number}_${safeChessType}_${timeStr}_${meta.ai_skill_level}.json`;


		const dir = path.join(process.cwd(), 'data');
		await fs.mkdir(dir, { recursive: true });
		const filepath = path.join(dir, filename);

		await fs.writeFile(filepath, JSON.stringify(payload, null, 2));

		return json({ success: true, file: filename }, { status: 200 });
	} catch (error) {
		console.error('[I/O FATAL]:', error);
		return json({ error: 'Failed to write JSON to disk' }, { status: 500 });
	}
}

/** Returns all saved games sorted by timestamp descending. */
export async function GET() {
	try {
		const dir = path.join(process.cwd(), 'data');
		await fs.mkdir(dir, { recursive: true });
		const files = await fs.readdir(dir);

		const games = await Promise.all(
			files
				.filter(f => f.endsWith('.json'))
				.map(async f => {
					const raw = await fs.readFile(path.join(dir, f), 'utf-8');
					return JSON.parse(raw);
				})
		);

		games.sort((a, b) =>
			new Date(b.metadata.timestamp).getTime() - new Date(a.metadata.timestamp).getTime()
		);

		return json(games);
	} catch (error) {
		console.error('[READ FATAL]:', error);
		return json({ error: 'Failed to read games' }, { status: 500 });
	}
}
