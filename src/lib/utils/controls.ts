import { Props, State, ControlsStrategy, AutoPlayStrategy } from '../types';

export function shouldDisableDots(props: Props, state: State) {
	const { disableDotsControls, controlsStrategy } = props || {};
	const { itemsInSlide, itemsCount, autoWidth } = state || {};

	if (disableDotsControls) {
		return true;
	}

	if (controlsStrategy === ControlsStrategy.RESPONSIVE) {
		return !autoWidth && itemsInSlide === itemsCount;
	}

	return false;
}

export const getDotsNavigationLength = (itemsCount = 0, itemsInSlide = 1, autoWidth) => {
	if (autoWidth) {
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
