import { Transformations, ItemCoords, Props, State, RootElement, Transition, Style, Options } from '../types';
import { mapPartialCoords, mapPositionCoords } from './mappers';
import { getShiftIndex } from './math';

export const getSlides = (props: Props) => {
	const { children, items = [] } = props;

	if (children) {
		return children.length ? children : [children];
	}
	return items;
};

export const getItemsCount = (props: Props): number => {
	return getSlides(props).length;
};

export const getItemsOffset = (props: Props) => {
	const { infinite, paddingRight, paddingLeft } = props;
	// TODO !infinite
	if (infinite && (paddingLeft || paddingRight)) {
		return 1;
	}
	return 0;
};

export const createClones = (props: Props) => {
	const slides = getSlides(props);

	// TODO !infinite
	if (!props.infinite) {
		return slides;
	}

	const itemsCount = getItemsCount(props);
	const itemsOffset = getItemsOffset(props);
	const itemsInSlide = getItemsInSlide(itemsCount, props);
	const cursor = Math.min(itemsInSlide, itemsCount) + itemsOffset;

	const clonesAfter = slides.slice(0, cursor);
	const clonesBefore = slides.slice(-cursor);

	if (itemsOffset && itemsInSlide === itemsCount) {
		const afterOffsetClone = slides[0];
		const [beforeOffsetClone] = slides.slice(-1);

		clonesBefore.unshift(beforeOffsetClone);
		clonesAfter.push(afterOffsetClone);
	}

	return clonesBefore.concat(slides, clonesAfter);
};

export const isElement = (element: unknown) => {
	try {
		return element instanceof Element || element instanceof HTMLDocument;
	} catch (e) {
		return false;
	}
};

export const createAutowidthTransformationSet = (el: HTMLElement | null, stageWidth = 0, infinite = false) => {
	let content = 0;
	let partial = true;
	let coords: ItemCoords[] = [];

	if (isElement(el)) {
		// TODO: refactoring
		const children: Array<HTMLElement | Element> = Array.from(el?.children || []);

		coords = children.reduce<ItemCoords[]>((acc, child, i) => {
			let position = 0;
			const previewsChildCursor = i - 1;
			const previewsChild = acc[previewsChildCursor];
			const { width = 0 } = getElementDimensions(child?.firstChild as HTMLElement);
			content += width;
			partial = stageWidth >= content;

			if (previewsChild) {
				position = previewsChildCursor === 0 ? previewsChild.width : previewsChild.width + previewsChild.position;
			}

			acc.push({ position, width });
			return acc;
		}, []);

		if (!infinite) {
			if (partial) {
				coords = mapPartialCoords(coords);
			} else {
				const position = content - stageWidth;
				coords = mapPositionCoords(coords, position);
			}
		}
	}

	return { coords, content, partial };
};

export const createDefaultTransformationSet = (
	children: unknown[],
	stageWidth: number,
	itemsInSlide: number,
	infinite = false,
): Transformations => {
	let content = 0;
	let partial = true;
	let coords: ItemCoords[] = [];
	const width = getItemWidth(stageWidth, itemsInSlide);

	coords = children.reduce<ItemCoords[]>((acc, child, i) => {
		let position = 0;
		const previewsChild = acc[i - 1];

		content += width;
		partial = stageWidth >= content;

		if (previewsChild) {
			position = width + previewsChild.position || 0;
		}

		acc.push({ width, position });
		return acc;
	}, []);

	if (!infinite) {
		if (partial) {
			coords = mapPartialCoords(coords);
		} else {
			const position = content - stageWidth;
			coords = mapPositionCoords(coords, position);
		}
	}

	return { coords, content, partial };
};

export const getItemWidth = (galleryWidth: number, itemsInSlide: number) => {
	return itemsInSlide > 0 ? galleryWidth / itemsInSlide : galleryWidth;
};

export function getElementDimensions(element: HTMLElement | null) {
	if (element && element.getBoundingClientRect) {
		const { width, height } = element.getBoundingClientRect();

		return { width, height };
	}
	return { width: 0, height: 0 };
}

export const getAutoheightProperty = (stageComponent: HTMLElement | null, props: Props, state: State) => {
	const elementCursor = getElementCursor(props, state);
	const element = getElementFirstChild(stageComponent, elementCursor) as HTMLElement;

	if (isElement(element)) {
		const styles = window.getComputedStyle(element);
		const marginTop = parseFloat(styles['marginTop']);
		const marginBottom = parseFloat(styles['marginBottom']);

		return Math.ceil(element.offsetHeight + marginTop + marginBottom);
	}
};

export const getElementCursor = (props: Props, state: State) => {
	const { activeIndex, itemsInSlide } = state;
	if (props.infinite) {
		return activeIndex + itemsInSlide + getItemsOffset(props);
	}
	return activeIndex;
};

export const getElementFirstChild = (stageComponent: HTMLElement | null, cursor: number) => {
	const children = (stageComponent && stageComponent.children) || [];
	return (children[cursor] && children[cursor].firstChild) || null;
};

export function shouldHandleResizeEvent(
	e: Event,
	prevDimensions: RootElement = {},
	nextRootComponentDimensions: RootElement = {},
) {
	return prevDimensions.width !== nextRootComponentDimensions.width;
}

export function animate(element: HTMLElement | null, options: Options) {
	const { position = 0, animationDuration = 0, animationEasingFunction = 'ease' } = options || {};

	if (element && isElement(element)) {
		element.style['transition'] = `transform ${animationDuration}ms ${animationEasingFunction} 0ms`;
		element.style['transform'] = `translate3d(${position}px, 0, 0)`;
	}
	return element;
}

export const getRenderWrapperStyles = (props: Props, state: State, element: HTMLElement | null) => {
	const { paddingLeft, paddingRight, autoHeight, animationDuration } = props || {};
	const height = autoHeight ? getAutoheightProperty(element, props, state) : undefined;
	const transition = height ? `height ${animationDuration}ms` : undefined;

	return {
		height,
		transition,
		paddingLeft: `${paddingLeft}px`,
		paddingRight: `${paddingRight}px`,
	};
};

export const getTransitionProperty = (options?: Transition): string => {
	const { animationDuration = 0, animationEasingFunction = 'ease' } = options || {};
	return `transform ${animationDuration}ms ${animationEasingFunction} 0ms`;
};

export const getRenderStageStyles = (nextStyles: Options, currentStyles: Style): Style => {
	const { translate3d = 0 } = nextStyles || {};
	const transform = `translate3d(${-translate3d}px, 0, 0)`;

	return { ...currentStyles, transform };
};

export const getRenderStageItemStyles = (i: number, state: State) => {
	const {
		transformationSet,
		fadeoutAnimationIndex,
		fadeoutAnimationPosition,
		fadeoutAnimationProcessing,
		animationDuration,
	} = state;
	const { width } = transformationSet[i] || {};

	if (fadeoutAnimationProcessing && fadeoutAnimationIndex === i) {
		return {
			transform: `translateX(${fadeoutAnimationPosition}px)`,
			animationDuration: `${animationDuration}ms`,
			width: `${width}px`,
		};
	}

	return { width };
};

export const getTranslate3dProperty = (nextIndex: number, state: Partial<State>) => {
	let cursor = nextIndex;
	const { infinite, itemsOffset = 0, itemsInSlide = 0, transformationSet = [] } = state;

	if (infinite) {
		cursor = nextIndex + getShiftIndex(itemsInSlide, itemsOffset);
	}

	return (transformationSet[cursor] || {}).position || 0;
};

export const getTouchmoveTranslatePosition = (deltaX: number, translate3d: number) => {
	return -(translate3d - Math.floor(deltaX));
};

export function getTranslateXProperty(element: Element | null) {
	const matrix = getTransformMatrix(element);
	const tx = (matrix && matrix[4]) || '';
	return Number(tx);
}

export function getTransformMatrix(element: Element | null) {
	if (element && isElement(element)) {
		const { transform } = window.getComputedStyle(element);
		const matched = transform.match(/(-?[0-9.]+)/g);

		return matched || [];
	}
	return [];
}

export const canUseDOM = () => {
	try {
		return Boolean(window?.document?.createElement);
	} catch (e) {
		return false;
	}
};

export const getItemsInSlide = (itemsCount: number, props: Props) => {
	let itemsInSlide = 1;
	const { responsive, autoWidth = false, infinite = false, innerWidth } = props;

	// TODO: refactoring
	if (autoWidth) {
		return infinite ? itemsCount : itemsInSlide;
	}

	if (responsive) {
		const configKeys = Object.keys(responsive);

		if (configKeys.length) {
			if (innerWidth || canUseDOM()) {
				const value = innerWidth === undefined ? window.innerWidth : innerWidth;
				configKeys.forEach((key) => {
					if (Number(key) <= value) {
						const { items, itemsFit = 'fill' } = responsive[key];
						if (itemsFit === 'contain') {
							itemsInSlide = items;
						} else {
							itemsInSlide = Math.min(items, itemsCount);
						}
					}
				});
			}
		}
	}

	return itemsInSlide || 1;
};
