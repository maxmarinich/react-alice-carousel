import { Props, State, ControlsStrategy, AutoPlayStrategy } from '../types';

export function shouldDisableControls(props: Props, state: State) {
	const { controlsStrategy } = props || {};
	const { itemsInSlide, itemsCount, autoWidth } = state || {};

	if (isStrategy(controlsStrategy, ControlsStrategy.RESPONSIVE)) {
		return !autoWidth && itemsInSlide === itemsCount;
	}
}

export function shouldDisableDots(props: Props, state: State) {
	return props.disableDotsControls || shouldDisableControls(props, state);
}

export function shouldDisableButtons(props: Props, state: State) {
	return props.disableButtonsControls || (!props.infinite && shouldDisableControls(props, state));
}

export const isStrategy = (strategy, value) => {
	return strategy && strategy.includes(value);
};

export const hasDotForEachSlide = (autoWidth, controlsStrategy) => {
	return autoWidth || isStrategy(controlsStrategy, ControlsStrategy.ALTERNATE);
};

export const getDotsNavigationLength = (itemsCount = 0, itemsInSlide = 1, hasDotForEachSlide) => {
	if (hasDotForEachSlide) {
		return itemsCount;
	}
	if (Number(itemsInSlide) !== 0) {
		return Math.ceil(itemsCount / itemsInSlide) || 0;
	}
	return 0;
};

export const checkIsTheLastDotIndex = (index: number, infinite: boolean, dotsLength: number) => {
	return !infinite && index === dotsLength - 1;
};

export const getItemIndexForDotNavigation = (
	index: number,
	isTheLastIndex: boolean,
	slidesLength: number,
	itemsInSlide: number,
) => {
	const result = isTheLastIndex ? slidesLength - itemsInSlide : index * itemsInSlide;
	return result || 0;
};

export const shouldCancelAutoPlayOnAction = (strategy = '') => {
	return strategy === AutoPlayStrategy.ACTION || strategy === AutoPlayStrategy.ALL;
};

export const shouldCancelAutoPlayOnHover = (strategy = '') => {
	return strategy === AutoPlayStrategy.DEFAULT || strategy === AutoPlayStrategy.ALL;
};
