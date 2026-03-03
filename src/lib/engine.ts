export class ChessEngine {
	private worker: Worker | null = null;
	private isReady: boolean = false;
	private commandQueue: string[] = [];

	constructor() {
		if (typeof window !== 'undefined') this.initWorker();
	}

	private async initWorker() {
		try {
			const response = await fetch('https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js');
			const script   = await response.text();
			const blob     = new Blob([script], { type: 'application/javascript' });
			this.worker    = new Worker(URL.createObjectURL(blob));

			this.worker.onmessage = this.defaultMessageHandler.bind(this);
			this.worker.postMessage('uci');
		} catch (e) {
			console.error('[SF SYSTEM EXCEPTION]', e);
		}
	}

	private defaultMessageHandler(e: MessageEvent) {
		const line = String(e.data).trim();
		if (line === 'uciok')    this.worker?.postMessage('isready');
		if (line === 'readyok') { this.isReady = true; this.flushQueue(); }
		if (line.startsWith('bestmove')) {
			const move = line.split(' ')[1];
			if (move && move !== '(none)') this.onBestMove(move);
		}
	}

	private flushQueue() {
		while (this.commandQueue.length > 0) {
			const msg = this.commandQueue.shift();
			if (msg && this.worker) this.worker.postMessage(msg);
		}
	}

	private sendMessage(msg: string) {
		if (this.isReady && this.worker) this.worker.postMessage(msg);
		else this.commandQueue.push(msg);
	}

	public setSkillLevel(level: number) {
		const bounded = Math.max(0, Math.min(20, Math.floor(level)));
		this.sendMessage(`setoption name Skill Level value ${bounded}`);
	}

	public evaluatePosition(fen: string, ms: number = 300) {
		this.sendMessage(`position fen ${fen}`);
		this.sendMessage(`go movetime ${ms}`);
	}

	/**
	 * FIX: Resolves on "bestmove", returning the LAST score cp seen.
	 *
	 * Stockfish emits many "info depth N score cp X" lines during search.
	 * Resolving on the first one gives depth-1 noise.
	 * We accumulate lastScore and only resolve when "bestmove" arrives,
	 * guaranteeing we get the full depth-8 evaluation.
	 *
	 * The returned value is in centipawns from the SIDE TO MOVE's perspective
	 * (Stockfish standard). Callers must flip sign when it's Black to move
	 * to obtain White-perspective centipawns.
	 */
	public evaluatePositionAsync(fen: string, depth: number = 8): Promise<number> {
		return new Promise((resolve) => {
			if (!this.worker) return resolve(0);

			let lastScore = 0;

			this.sendMessage(`position fen ${fen}`);
			this.sendMessage(`go depth ${depth}`);

			const originalHandler = this.worker.onmessage;

			this.worker.onmessage = (e: MessageEvent) => {
				const line = String(e.data);

				// Track the most recent score — overwrite on every depth
				if (line.includes('score cp')) {
					const match = line.match(/score cp (-?\d+)/);
					if (match) lastScore = parseInt(match[1], 10);
				}

				// Resolve only when the search is fully complete
				if (line.startsWith('bestmove')) {
					this.worker!.onmessage = originalHandler;
					resolve(lastScore);
				}
			};
		});
	}

	public onBestMove: (move: string) => void = () => {};
}
