export interface Props {
	activeIndex?: number;
	animationDuration?: number;
	animationEasingFunction?: string;
	animationType?: 'slide' | 'fadeout' | AnimationType;
	autoHeight?: boolean;
	autoPlay?: boolean;
	autoPlayControls?: boolean;
	autoPlayDirection?: 'rtl' | 'ltr' | AutoplayDirection;
	autoPlayInterval?: number;
	autoPlayStrategy?: 'default' | 'all' | 'action' | 'none' | AutoPlayStrategy;
	autoWidth?: boolean;
	children?: any;
	controlsStrategy?: 'default' | 'responsive' | ControlsStrategy;
	disableButtonsControls?: boolean;
	disableDotsControls?: boolean;
	disableSlideInfo?: boolean;
	infinite?: boolean;
	items?: any[];
	mouseTracking?: boolean;
	paddingLeft?: number;
	paddingRight?: number;
	preservePosition?: boolean;
	responsive?: Responsive;
	swipeDelta?: number;
	swipeExtraPadding?: number;
	touchMoveDefaultEvents?: boolean;
	touchTracking?: boolean;
	onInitialized?: (e: EventObject) => void;
	onResizeEvent?: (e: Event, prevProps: RootElement, nextProps: RootElement) => boolean;
	onResized?: (e: EventObject) => void;
	onSlideChange?: (e: EventObject) => void;
	onSlideChanged?: (e: EventObject) => void;
}

export interface State {
	activeIndex: number;
	animationDuration?: number;
	autoWidth: boolean;
	clones: any[];
	infinite?: boolean;
	initialStageHeight: number;
	isAutoPlaying: boolean;
	isAutoPlayCanceledOnAction: boolean;
	isStageContentPartial: boolean;
	itemsCount: number;
	itemsInSlide: number;
	itemsOffset: number;
	fadeoutAnimationIndex: number | null;
	fadeoutAnimationPosition: number | null;
	fadeoutAnimationProcessing: boolean;
	stageContentWidth: number;
	stageWidth: number;
	swipeLimitMin: number;
	swipeLimitMax: number;
	swipeAllowedPositionMax: number;
	swipeShiftValue: number;
	transition: string;
	transformationSet: TransformationSetItem[];
	translate3d: number;
}

export type Style = {
	transition: string;
	transform?: string;
};

export type Transition = {
	animationDuration?: number;
	animationEasingFunction?: string;
};

export type Responsive = {
	[key: string]: {
		items: number;
	};
};

export type EventObject = {
	item: number;
	slide: number;
	itemsInSlide: number;
	isPrevSlideDisabled: boolean;
	isNextSlideDisabled: boolean;
};

export type RootElement = {
	width?: number;
	height?: number;
};

export type TransformationSetItem = {
	width: number;
	position: number;
};

export type SlideTo = {
	activeIndex: number;
	fadeoutAnimationIndex?: number | null;
	fadeoutAnimationPosition?: number | null;
};

export enum AnimationType {
	FADEOUT = 'fadeout',
	SLIDE = 'slide',
}

export enum AutoPlayStrategy {
	DEFAULT = 'default',
	ALL = 'all',
	ACTION = 'action',
	NONE = 'none',
}

export enum ControlsStrategy {
	DEFAULT = 'default',
	RESPONSIVE = 'responsive',
}

export enum AutoplayDirection {
	RTL = 'rtl',
	LTR = 'ltr',
}
