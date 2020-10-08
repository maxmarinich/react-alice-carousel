export function debounce(func: (...args) => void, ms = 0) {
	let timer: undefined | number = undefined;

	return function (...args) {
		if (timer) {
			clearTimeout(timer);
			timer = undefined;
		}

		timer = window.setTimeout(() => {
			func.apply(this, args);
			timer = undefined;
		}, ms);
	};
}
