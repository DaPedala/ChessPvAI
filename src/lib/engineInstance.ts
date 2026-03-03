import { ChessEngine } from './engine';

let _engine: ChessEngine | null = null;

export function getEngine(): ChessEngine {
	if (!_engine) _engine = new ChessEngine();
	return _engine;
}
