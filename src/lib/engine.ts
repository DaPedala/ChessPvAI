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

	public evaluatePositionAsync(fen: string, depth: number = 8): Promise<number> {
		return new Promise((resolve) => {
			if (!this.worker) return resolve(0);

			let lastScore = 0;
			const turn = fen.split(' ')[1]; // 'w' or 'b'

			this.sendMessage(`position fen ${fen}`);
			this.sendMessage(`go depth ${depth}`);

			const originalHandler = this.worker.onmessage;

			this.worker.onmessage = (e: MessageEvent) => {
				const line = String(e.data);

				if (line.includes('score cp')) {
					const match = line.match(/score cp (-?\d+)/);
					if (match) {
						const rawCp = parseInt(match[1], 10);
						// Normalize to White perspective:
						// If Black to move, SF +100 means White is -100.
						lastScore = (turn === 'w') ? rawCp : -rawCp;
					}
				}

				if (line.startsWith('bestmove')) {
					this.worker!.onmessage = originalHandler;
					resolve(lastScore);
				}
			};
		});
	}

	public onBestMove: (move: string) => void = () => {};
}
