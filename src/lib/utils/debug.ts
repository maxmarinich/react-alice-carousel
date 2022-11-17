export function debug(...args: unknown[]) {
	if (process.env.NODE_ENV === 'development') {
		console.debug(...args);
	}
}
