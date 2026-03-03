import type { EvaluatedMove } from '$lib/types';

export interface ExportMetadata {
	session_id: string;
	username: string;
	match_number: number;
	chess_type: string;
	time_base: number;          
	time_increment_sec: number;
	ai_skill_level: number;
	timestamp: string;
	moves_count: number;
	termination_reason: string;
	time_control: string;
}
export async function exportGame(
	metadata: ExportMetadata,
	data: EvaluatedMove[]
): Promise<string> {
	const res = await fetch('/api/export', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ metadata, data })
	});
	if (!res.ok) throw new Error(`Export API rejected with status ${res.status}`);
	const { file } = await res.json();
	return file;
}
