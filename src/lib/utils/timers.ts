export function debounce(func: (...args) => void, ms = 0) {
	let timer: undefined | number = undefined;

	const cancel = () => {
		if (timer) {
			clearTimeout(timer);
			timer = undefined;
		}
	};

	return [function (...args) {
		cancel();
		timer = window.setTimeout(() => {
			func.apply(this, args);
			timer = undefined;
		}, ms);
	},  cancel];
}
