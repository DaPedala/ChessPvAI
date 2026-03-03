export function formatTime(seconds: number): string {
	const s    = Math.max(0, seconds);
	const mins = Math.floor(s / 60);
	const secs = s % 60;
	return `${mins}:${secs.toString().padStart(2, '0')}`;
}
