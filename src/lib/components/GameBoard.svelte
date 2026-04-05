<script lang="ts">
    import { onMount } from 'svelte';
    import { Chess } from 'chess.js';
    import { gameStore } from '$lib/stores/gameStore.svelte';
    import { getEngine } from '$lib/engineInstance';

    const engine = getEngine();
    let board: any;
    let selectedSquare: string | null = null;

    function squareEl(sq: string): HTMLElement | null {
        return document.querySelector(`#board .square-${sq}`);
    }

    function clearHighlights() {
        document.querySelectorAll('#board .hl-selected, #board .hl-move, #board .hl-capture, #board .hl-check')
                .forEach(el => el.classList.remove('hl-selected', 'hl-move', 'hl-capture', 'hl-check'));
    }

    function applyCheckHighlight(fen?: string) {
        const pos = fen ? new Chess(fen) : gameStore.game;
        if (!pos.inCheck()) return;
        const turn = pos.turn();
        pos.board().forEach((rank, r) => {
            rank.forEach((piece, c) => {
                if (piece?.type === 'k' && piece.color === turn) {
                    const file = String.fromCharCode(97 + c);
                    const rank_n = 8 - r;
                    squareEl(`${file}${rank_n}`)?.classList.add('hl-check');
                }
            });
        });
    }

    function applyMoveHighlights(square: string) {
        const moves = gameStore.game.moves({ square: square as any, verbose: true });
        squareEl(square)?.classList.add('hl-selected');
        moves.forEach((m: any) => {
            const cls = gameStore.game.get(m.to as any) ? 'hl-capture' : 'hl-move';
            squareEl(m.to)?.classList.add(cls);
        });
    }

    function handleSquareClick(square: string) {
        if (gameStore.selectedMoveIndex !== null || gameStore.currentPhase === 'TERMINATED' || !gameStore.isPlayerTurn) return;
        const piece = gameStore.game.get(square as any);
        const isOwnPiece = piece && piece.color === gameStore.playerColor;
        if (selectedSquare) {
            const legalMoves = gameStore.game.moves({ square: selectedSquare as any, verbose: true });
            const target = (legalMoves as any[]).find((m: any) => m.to === square);
            if (target) {
                executeClickMove(selectedSquare, square);
                selectedSquare = null;
                clearHighlights();
                return;
            }
        }
        clearHighlights();
        if (isOwnPiece) {
            selectedSquare = square;
            applyMoveHighlights(square);
        } else {
            selectedSquare = null;
        }
        applyCheckHighlight();
    }

    async function executeClickMove(from: string, to: string) {
        try {
            const move = gameStore.game.move({ from, to, promotion: 'q' } as any);
            if (!move) return;
            board.position(gameStore.game.fen());
            gameStore.startClock();
            gameStore.playerTime += gameStore.timeIncrement;
            gameStore.isPlayerTurn = false;
            gameStore.statusText = 'Evaluating…';
            setTimeout(() => applyCheckHighlight(), 60);
            const rawEval = await engine.evaluatePositionAsync(gameStore.game.fen(), 8);
            gameStore.recordPlayerMove(move.san, rawEval);
            gameStore.updateStatus();
            if (gameStore.currentPhase !== 'TERMINATED' && !gameStore.hasExported) {
                engine.evaluatePosition(gameStore.game.fen(), 300);
            }
        } catch { }
    }

    function handleEngineMove(bestMove: string) {
        const from      = bestMove.substring(0, 2);
        const to        = bestMove.substring(2, 4);
        const promotion = bestMove.length > 4 ? bestMove[4] : 'q';
        try {
            const move = gameStore.game.move({ from, to, promotion } as any);
            if (move) {
                board.position(gameStore.game.fen());
                gameStore.aiTime      += gameStore.timeIncrement;
                gameStore.isPlayerTurn = true;
                gameStore.updateStatus();
                setTimeout(() => { clearHighlights(); applyCheckHighlight(); }, 60);
            }
        } catch (e) {
            console.error('[BOARD] Invalid engine move:', e);
            gameStore.updateStatus();
        }
    }

    onMount(() => {
        if (typeof window === 'undefined' || !(window as any).Chessboard) return;
        engine.setSkillLevel(gameStore.aiSkillLevel);
        engine.onBestMove = handleEngineMove;
        board = (window as any).Chessboard('board', {
            draggable:  true,
            position:   'start',
            orientation: gameStore.playerColor === 'w' ? 'white' : 'black',
            pieceTheme: '/img/chesspieces/wikipedia/{piece}.png',
            onDragStart: (_source: string, piece: string) => {
                const playerPrefix = gameStore.playerColor;
                if (gameStore.selectedMoveIndex !== null || gameStore.currentPhase === 'TERMINATED' || gameStore.hasExported || !piece.startsWith(playerPrefix) || !gameStore.isPlayerTurn) return false;
                clearHighlights();
                selectedSquare = _source;
                applyMoveHighlights(_source);
            },
            onDrop: async (from: string, to: string) => {
                if (from === to) { clearHighlights(); selectedSquare = null; return 'snapback'; }
                try {
                    const move = gameStore.game.move({ from, to, promotion: 'q' } as any);
                    if (!move) { clearHighlights(); selectedSquare = null; return 'snapback'; }
                    clearHighlights();
                    selectedSquare = null;
                    gameStore.startClock();
                    gameStore.playerTime += gameStore.timeIncrement;
                    gameStore.isPlayerTurn = false;
                    gameStore.statusText = 'Evaluating…';
                    setTimeout(() => applyCheckHighlight(), 60);
                    const rawEval = await engine.evaluatePositionAsync(gameStore.game.fen(), 8);
                    gameStore.recordPlayerMove(move.san, rawEval);
                    gameStore.updateStatus();
                    if (gameStore.currentPhase !== 'TERMINATED' && !gameStore.hasExported) {
                        engine.evaluatePosition(gameStore.game.fen(), 300);
                    }
                } catch {
                    clearHighlights();
                    selectedSquare = null;
                    return 'snapback';
                }
            },
            onSnapEnd: () => { if (gameStore.selectedMoveIndex === null) board.position(gameStore.game.fen()); }
        });

        if (gameStore.playerColor === 'b') engine.evaluatePosition(gameStore.game.fen(), 300);

        const boardEl = document.getElementById('board');
        boardEl?.addEventListener('click', (e) => {
            const target = (e.target as Element).closest('[class]');
            if (!target) return;
            const squareClass = Array.from(target.classList).find(c => /^square-[a-h][1-8]$/.test(c));
            if (squareClass) handleSquareClick(squareClass.replace('square-', ''));
        });

        $effect(() => {
            if (!board) return;
            const fen = gameStore.displayFen;
            board.position(fen, false);
            clearHighlights();
            selectedSquare = null;
            setTimeout(() => applyCheckHighlight(gameStore.selectedMoveIndex !== null ? fen : undefined), 60);
        });
    });
</script>

<div id="board" class="board-wrap" class:reviewing={gameStore.selectedMoveIndex !== null}></div>

<style>
    .board-wrap { width: 450px; border: 1px solid rgba(255,255,255,.08); border-radius: 2px; transition: border-color .2s; }
    .reviewing  { border-color: rgba(212,162,0,.5); }
    :global(#board .hl-move::before) { content: ''; position: absolute; inset: 0; margin: auto; width: 30%; height: 30%; border-radius: 50%; background: rgba(0, 0, 0, .35); pointer-events: none; z-index: 2; }
    :global(#board .hl-capture::before) { content: ''; position: absolute; inset: 4%; border-radius: 50%; border: 6px solid rgba(0, 0, 0, .35); background: transparent; pointer-events: none; z-index: 2; }
    :global(#board .hl-selected) { background-color: rgba(98, 153, 36, .5) !important; }
    :global(#board .hl-check) { background: radial-gradient(ellipse at center, rgba(255, 0, 0, .9) 0%, rgba(204, 0, 0, .7) 40%, rgba(180, 0, 0, 0) 70% ) !important; }
    :global(#board [class^="square-"], #board [class*=" square-"]) { position: relative; }
</style>
