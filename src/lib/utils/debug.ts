export function debug(...args) {
	if (process.env.NODE_ENV === 'development') {
		console.debug(...args);
	}
}
