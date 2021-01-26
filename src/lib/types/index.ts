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
	innerWidth?: number;
	items?: any[];
	mouseTracking?: boolean;
	paddingLeft?: number;
	paddingRight?: number;
	preservePosition?: boolean;
	responsive?: Responsive;
	renderKey?: number;
	swipeDelta?: number;
	swipeExtraPadding?: number;
	touchMoveDefaultEvents?: boolean;
	touchTracking?: boolean;
	onInitialized?: (e: EventObject) => void;
	onResizeEvent?: (e: Event, prevProps: RootElement, nextProps: RootElement) => boolean;
	onResized?: (e: EventObject) => void;
	onSlideChange?: (e: EventObject) => void;
	onSlideChanged?: (e: EventObject) => void;
	renderSlideInfo?: (e: SlideInfo) => any;
	renderDotsItem?: (e: DotsItem) => any;
	renderPrevButton?: ({ isDisabled }) => any;
	renderNextButton?: ({ isDisabled }) => any;
	renderPlayPauseButton?: ({ isPlaying }) => any;
}

export interface State {
	activeIndex: number;
	animationDuration?: number;
	autoWidth: boolean;
	clones: any[];
	canUseDom: boolean;
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

export type SlideInfo = {
	item: number;
	itemsCount: number;
};

export type DotsItem = {
	isActive: boolean;
	activeIndex: number;
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

export enum Classnames {
	ANIMATED = 'animated animated-out fadeOut',
	ROOT = 'alice-carousel',
	WRAPPER = 'alice-carousel__wrapper',
	STAGE = 'alice-carousel__stage',
	STAGE_ITEM = 'alice-carousel__stage-item',
	DOTS = 'alice-carousel__dots',
	DOTS_ITEM = 'alice-carousel__dots-item',
	PLAY_BTN = 'alice-carousel__play-btn',
	PLAY_BTN_ITEM = 'alice-carousel__play-btn-item',
	PLAY_BTN_WRAPPER = 'alice-carousel__play-btn-wrapper',
	SLIDE_INFO = 'alice-carousel__slide-info',
	SLIDE_INFO_ITEM = 'alice-carousel__slide-info-item',
	BUTTON_PREV = 'alice-carousel__prev-btn',
	BUTTON_PREV_WRAPPER = 'alice-carousel__prev-btn-wrapper',
	BUTTON_PREV_ITEM = 'alice-carousel__prev-btn-item',
	BUTTON_NEXT = 'alice-carousel__next-btn',
	BUTTON_NEXT_WRAPPER = 'alice-carousel__next-btn-wrapper',
	BUTTON_NEXT_ITEM = 'alice-carousel__next-btn-item',
}

export enum Modifiers {
	ACTIVE = '__active',
	INACTIVE = '__inactive',
	CLONED = '__cloned',
	CUSTOM = '__custom',
	PAUSE = '__pause',
	SEPARATOR = '__separator',
	SSR = '__ssr',
}
