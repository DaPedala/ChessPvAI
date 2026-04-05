import type { MoveCategory } from '$lib/types';

export const CATEGORY_COLOR: Record<MoveCategory, string> = {
	best: '#81b64c',
	excellent: '#96bc4b',
	good: '#96bc4b',
	inaccuracy: '#f2b233',
	mistake: '#ff9342',
	blunder: '#fa412e'
};

/**
 * Determines category based on Centipawn Loss (CPL) relative to the player who moved.
 * currentEval and prevEval must be normalized (White = Positive).
 */
export function categorizeMove(currentEval: number, prevEval: number, movedColor: 'w' | 'b'): { category: MoveCategory; value: number } {
	// Loss calculation:
	// If White moved: High current is good. Loss = Prev - Current
	// If Black moved: Low current is good. Loss = Current - Prev
	const loss = movedColor === 'w' 
		? prevEval - currentEval 
		: currentEval - prevEval;

	let category: MoveCategory = 'best';
	let value = 6;

	if (loss > 300) { category = 'blunder'; value = 1; }
	else if (loss > 100) { category = 'mistake'; value = 2; }
	else if (loss > 50) { category = 'inaccuracy'; value = 3; }
	else if (loss > 20) { category = 'good'; value = 4; }
	else if (loss > 5) { category = 'excellent'; value = 5; }
	else { category = 'best'; value = 6; }

	return { category, value };
}
