import type { MoveCategory } from '$lib/types';

export interface CategoryResult {
	category: MoveCategory;
	value: number;
}

export function categorizeMove(cpl: number): CategoryResult {
	if (cpl <= 10)  return { category: 'best',       value: 6 };
	if (cpl <= 30)  return { category: 'excellent',  value: 5 };
	if (cpl <= 50)  return { category: 'good',       value: 4 };
	if (cpl <= 100) return { category: 'inaccuracy', value: 3 };
	if (cpl <= 300) return { category: 'mistake',    value: 2 };
	return                 { category: 'blunder',   value: 1 };
}

export const CATEGORY_COLOR: Record<MoveCategory, string> = {
	best:       '#629924',
	excellent:  '#22a256',
	good:       '#4d9430',
	inaccuracy: '#e6a01a',
	mistake:    '#cf7422',
	blunder:    '#cc1900',
};
