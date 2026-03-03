export type MoveCategory = 'best' | 'excellent' | 'good' | 'inaccuracy' | 'mistake' | 'blunder';
export type GamePhase = 'MENU' | 'PLAYING' | 'TERMINATED';

export interface EvaluatedMove {
	san:      string;
	fen:      string;   // board position AFTER this move was played
	category: MoveCategory;
	value:    number;
	evalCp:   number;
}

export interface TimeControl {
	label: string;
	type:  string;
	base:  number;
	inc:   number;
}

export interface LastConfig {
	base: number;
	inc:  number;
	type: string;
}
