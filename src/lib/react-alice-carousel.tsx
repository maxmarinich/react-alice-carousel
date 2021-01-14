import React from 'react';
import VS, { EventData } from 'vanilla-swipe';
import { defaultProps } from './defaultProps';
import { AutoplayDirection, AnimationType, Props, RootElement, SlideTo, State, EventObject } from './types';
import * as Views from './views';
import * as Utils from './utils';

export default class AliceCarousel extends React.PureComponent<Props, State> {
	static defaultProps = defaultProps;
	private autoPlayTimeoutId: undefined | number;
	private isAnimationDisabled: boolean;
	private isHovered: boolean;
	private isTouchMoveProcessStarted: boolean;
	private cancelTouchAnimations: boolean;
	private hasUserAction: boolean;
	private RootElement: null | undefined;
	private rootComponentDimensions: RootElement;
	private slideEndTimeoutId: number | undefined;
	private stageComponent: null | undefined;
	private startTouchmovePosition: undefined | number;
	private swipeListener: VS | null = null;
	private touchEndTimeoutId: number | undefined;
	private _handleResizeDebounced: () => void | undefined;

	constructor(props) {
		super(props);

		const itemsCount = Utils.getItemsCount(props);
		const clones = Utils.createClones(props);

		this.state = {
			activeIndex: 0,
			animationDuration: 0,
			autoWidth: false,
			clones,
			itemsCount,
			itemsOffset: 0,
			itemsInSlide: 1,
			infinite: false,
			initialStageHeight: 0,
			isAutoPlaying: false,
			isAutoPlayCanceledOnAction: false,
			isStageContentPartial: true,
			fadeoutAnimationIndex: null,
			fadeoutAnimationPosition: null,
			fadeoutAnimationProcessing: false,
			transformationSet: [],
			transition: Utils.getTransitionProperty(),
			translate3d: 0,
			stageWidth: 0,
			stageContentWidth: 0,
			swipeLimitMin: 0,
			swipeLimitMax: 0,
			swipeAllowedPositionMax: 0,
			swipeShiftValue: 0,
		};

		this.isHovered = false;
		this.isAnimationDisabled = false;
		this.isTouchMoveProcessStarted = false;
		this.cancelTouchAnimations = false;
		this.hasUserAction = false;
		this.RootElement = undefined;
		this.rootComponentDimensions = {};
		this.stageComponent = undefined;
		this.startTouchmovePosition = undefined;
		this.slideTo = this.slideTo.bind(this);
		this.slidePrev = this.slidePrev.bind(this);
		this.slideNext = this.slideNext.bind(this);
		this._handleTouchmove = this._handleTouchmove.bind(this);
		this._handleTouchend = this._handleTouchend.bind(this);
		this._handleDotClick = this._handleDotClick.bind(this);
		this._handleResize = this._handleResize.bind(this);
		this._handleResizeDebounced = Utils.debounce(this._handleResize, 100);
	}

	async componentDidMount() {
		await this._setInitialState();
		this._setupSwipeHandlers();
		this.props.autoPlay && this._handlePlay();

		window.addEventListener('resize', this._handleResizeDebounced);
	}

	componentDidUpdate(prevProps: Readonly<Props>, state: Readonly<State>) {
		const {
			activeIndex,
			animationDuration,
			autoWidth,
			children,
			infinite,
			items,
			paddingLeft,
			paddingRight,
			responsive,
			swipeExtraPadding,
			mouseTracking,
			swipeDelta,
			touchTracking,
			touchMoveDefaultEvents,
		} = this.props;

		if (children && prevProps.children !== children) {
			const { activeIndex } = state;
			const props = { ...this.props, activeIndex };

			this._updateComponent(props);
		} else if (
			prevProps.autoWidth !== autoWidth ||
			prevProps.infinite !== infinite ||
			prevProps.items !== items ||
			prevProps.paddingLeft !== paddingLeft ||
			prevProps.paddingRight !== paddingRight ||
			prevProps.responsive !== responsive ||
			prevProps.swipeExtraPadding !== swipeExtraPadding
		) {
			this._updateComponent();
		} else {
			if (prevProps.animationDuration !== animationDuration) {
				this.setState({ animationDuration });
			}

			if (prevProps.activeIndex !== activeIndex) {
				this.slideTo(activeIndex);
			}
		}

		if (
			prevProps.swipeDelta !== swipeDelta ||
			prevProps.mouseTracking !== mouseTracking ||
			prevProps.touchTracking !== touchTracking ||
			prevProps.touchMoveDefaultEvents !== touchMoveDefaultEvents
		) {
			this._updateSwipeProps();
		}
	}

	componentWillUnmount() {
		this._cancelTimeoutAnimations();
		this.swipeListener && this.swipeListener.destroy();

		window.removeEventListener('resize', this._handleResizeDebounced);
	}

	get eventObject(): EventObject {
		const { itemsInSlide, activeIndex: item } = this.state;
		const { isNextSlideDisabled, isPrevSlideDisabled } = Utils.getSlideItemInfo(this.state);
		const slide = Utils.getActiveSlideIndex(isNextSlideDisabled, this.state);

		return { item, slide, itemsInSlide, isNextSlideDisabled, isPrevSlideDisabled };
	}

	get isFadeoutAnimationAllowed() {
		const { itemsInSlide } = this.state;
		const { animationType, paddingLeft, paddingRight, autoWidth, autoHeight } = this.props;

		return (
			itemsInSlide === 1 &&
			animationType === AnimationType.FADEOUT &&
			!(paddingLeft || paddingRight || autoWidth || autoHeight)
		);
	}

	get touchmovePosition() {
		if (this.startTouchmovePosition !== undefined) {
			return this.startTouchmovePosition;
		}
		return this.state.translate3d;
	}

	slideTo(activeIndex = 0) {
		this._handlePause();

		if (this.isFadeoutAnimationAllowed) {
			const fadeoutAnimationPosition = Utils.getFadeoutAnimationPosition(activeIndex, this.state);
			const fadeoutAnimationIndex = Utils.getFadeoutAnimationIndex(this.state);
			this._handleSlideTo({ activeIndex, fadeoutAnimationIndex, fadeoutAnimationPosition });
		} else {
			this._handleSlideTo({ activeIndex });
		}
	}

	slidePrev(e) {
		this._handlePause();
		if (e && e.isTrusted) {
			this.hasUserAction = true;
		}

		const activeIndex = this.state.activeIndex - 1;

		if (this.isFadeoutAnimationAllowed) {
			const fadeoutAnimationPosition = -this.state.stageWidth;
			const fadeoutAnimationIndex = Utils.getFadeoutAnimationIndex(this.state);
			this._handleSlideTo({ activeIndex, fadeoutAnimationIndex, fadeoutAnimationPosition });
		} else {
			this._handleSlideTo({ activeIndex });
		}
	}

	slideNext(e) {
		this._handlePause();
		if (e && e.isTrusted) {
			this.hasUserAction = true;
		}

		const activeIndex = this.state.activeIndex + 1;

		if (this.isFadeoutAnimationAllowed) {
			const fadeoutAnimationPosition = this.state.stageWidth;
			const fadeoutAnimationIndex = Utils.getFadeoutAnimationIndex(this.state);
			this._handleSlideTo({ activeIndex, fadeoutAnimationIndex, fadeoutAnimationPosition });
		} else {
			this._handleSlideTo({ activeIndex });
		}
	}

	async _handleResize(e: Event) {
		const { onResizeEvent } = this.props;
		const nextRootComponentDimensions = Utils.getElementDimensions(this.RootElement);
		const shouldProcessEvent = onResizeEvent || Utils.shouldHandleResizeEvent;

		if (shouldProcessEvent(e, this.rootComponentDimensions, nextRootComponentDimensions)) {
			this._cancelTimeoutAnimations();

			this.rootComponentDimensions = nextRootComponentDimensions;

			const { itemsCount, isAutoPlaying } = this.state;
			const activeIndex = Utils.getUpdateSlidePositionIndex(this.state.activeIndex, itemsCount);
			const currState = Utils.calculateInitialState({ ...this.props, activeIndex }, this.stageComponent);
			const translate3d = Utils.getTranslate3dProperty(currState.activeIndex, currState);
			const nextState = { ...currState, translate3d, isAutoPlaying };

			Utils.animate(this.stageComponent, { position: -translate3d });

			await this.setState(nextState);

			this._handleResized();
			this.isAnimationDisabled = false;
			isAutoPlaying && this._handlePlay();
		}
	}

	_handleTouchmove(e, eventData: EventData) {
		const { absY, absX, deltaX } = eventData;
		const { swipeDelta } = this.props;
		const { swipeShiftValue, swipeLimitMin, swipeLimitMax, infinite, fadeoutAnimationProcessing } = this.state;

		this.hasUserAction = true;

		if (
			fadeoutAnimationProcessing ||
			(!this.isTouchMoveProcessStarted && Utils.isVerticalTouchmoveDetected(absX, absY, swipeDelta))
		) {
			return;
		}

		if (!this.isTouchMoveProcessStarted) {
			this._cancelTimeoutAnimations();
			this._setTouchmovePosition();
			this.isAnimationDisabled = true;
			this.isTouchMoveProcessStarted = true;
		}

		let position = Utils.getTouchmoveTranslatePosition(deltaX, this.touchmovePosition);

		if (infinite === false) {
			if (position > swipeLimitMin || -swipeLimitMax > position) {
				return;
			}

			Utils.animate(this.stageComponent, { position });
			return;
		}

		if (Utils.shouldRecalculateSwipePosition(position, swipeLimitMin, swipeLimitMax)) {
			try {
				recalculatePosition();
			} catch (err) {
				Utils.debug(err);
			}
		}

		Utils.animate(this.stageComponent, { position });

		function recalculatePosition() {
			if (Utils.getIsLeftDirection(deltaX)) {
				position += swipeShiftValue;
			} else {
				position += -swipeShiftValue;
			}

			if (Utils.shouldRecalculateSwipePosition(position, swipeLimitMin, swipeLimitMax)) {
				recalculatePosition();
			}
		}
	}

	_handleTouchend(e, { deltaX }: EventData) {
		this._clearTouchmovePosition();

		if (this.isTouchMoveProcessStarted) {
			this.isTouchMoveProcessStarted = false;

			const { animationDuration } = this.state;
			const { animationEasingFunction } = this.props;
			const touchendPosition = Utils.getTranslateXProperty(this.stageComponent);
			const position = Utils.getSwipeTouchendPosition(this.state, deltaX, touchendPosition);

			this._handleSlideChange();
			Utils.animate(this.stageComponent, { position, animationDuration, animationEasingFunction });

			this._handleBeforeTouchEnd(position);
		}
	}

	_handleBeforeTouchEnd(position: number) {
		const { animationDuration } = this.state;

		this.touchEndTimeoutId = setTimeout(async () => {
			const activeIndex = Utils.getSwipeTouchendIndex(position, this.state);
			const translate3d = Utils.getTranslate3dProperty(activeIndex, this.state);

			Utils.animate(this.stageComponent, { position: -translate3d });

			const transition = Utils.getTransitionProperty();
			await this.setState({ activeIndex, translate3d, transition });
			await this._handleSlideChanged();
		}, animationDuration);
	}

	async _handleSlideTo({ activeIndex = 0, fadeoutAnimationIndex = null, fadeoutAnimationPosition = null }: SlideTo) {
		const { infinite, animationEasingFunction } = this.props;
		const { itemsInSlide, itemsCount, animationDuration } = this.state;

		if (
			this.isAnimationDisabled ||
			this.state.activeIndex === activeIndex ||
			(!infinite && Utils.shouldCancelSlideAnimation(activeIndex, itemsCount, itemsInSlide))
		) {
			return;
		}
		this.isAnimationDisabled = true;
		this._cancelTimeoutAnimations();
		this._handleSlideChange();

		let transition;
		let fadeoutAnimationProcessing = false;
		const translate3d = Utils.getTranslate3dProperty(activeIndex, this.state);

		if (fadeoutAnimationIndex !== null && fadeoutAnimationPosition !== null) {
			fadeoutAnimationProcessing = true;
			transition = Utils.getTransitionProperty();
		} else {
			transition = Utils.getTransitionProperty({
				animationDuration,
				animationEasingFunction,
			});
		}

		await this.setState({
			activeIndex,
			transition,
			translate3d,
			animationDuration,
			fadeoutAnimationIndex,
			fadeoutAnimationPosition,
			fadeoutAnimationProcessing,
		});

		this.slideEndTimeoutId = setTimeout(this._handleBeforeSlideEnd, animationDuration);
	}

	_handleBeforeSlideEnd = async () => {
		const { activeIndex, itemsCount, fadeoutAnimationProcessing } = this.state;

		if (Utils.shouldRecalculateSlideIndex(activeIndex, itemsCount)) {
			const nextIndex = Utils.getUpdateSlidePositionIndex(activeIndex, itemsCount);
			await this._handleUpdateSlidePosition(nextIndex);
		} else if (fadeoutAnimationProcessing) {
			await this.setState({
				fadeoutAnimationIndex: null,
				fadeoutAnimationPosition: null,
				fadeoutAnimationProcessing: false,
			});
		}

		this._handleSlideChanged();
	};

	async _handleUpdateSlidePosition(activeIndex) {
		const { animationDuration } = this.state;
		const translate3d = Utils.getTranslate3dProperty(activeIndex, this.state);
		const transition = Utils.getTransitionProperty({ animationDuration: 0 });

		await this.setState({
			activeIndex,
			translate3d,
			transition,
			animationDuration,
			fadeoutAnimationIndex: null,
			fadeoutAnimationPosition: null,
			fadeoutAnimationProcessing: false,
		});
	}

	_handleSlideChange() {
		if (this.props.onSlideChange) {
			this.props.onSlideChange(this.eventObject);
		}
	}

	_handleResized() {
		if (this.props.onResized) {
			this.props.onResized(this.eventObject);
		}
	}

	async _handleSlideChanged() {
		const { isAutoPlaying, isAutoPlayCanceledOnAction } = this.state;
		const { autoPlayStrategy, onSlideChanged } = this.props;

		if (Utils.shouldCancelAutoPlayOnAction(autoPlayStrategy) && this.hasUserAction && !isAutoPlayCanceledOnAction) {
			await this.setState({ isAutoPlayCanceledOnAction: true, isAutoPlaying: false });
		} else {
			isAutoPlaying && this._handlePlay();
		}
		this.isAnimationDisabled = false;
		onSlideChanged && onSlideChanged(this.eventObject);
	}

	_handleDotClick(index) {
		this.hasUserAction = true;
		this.slideTo(index);
	}

	_handleMouseEnter = () => {
		const { autoPlayStrategy } = this.props;

		if (Utils.shouldCancelAutoPlayOnHover(autoPlayStrategy) && this.state.isAutoPlaying) {
			this.isHovered = true;
			this._handlePause();
		}
	};

	_handleMouseLeave = () => {
		if (this.state.isAutoPlaying) {
			this.isHovered = false;
			this._handlePlay();
		}
	};

	_handlePlay() {
		this._setAutoPlayInterval();
	}

	_handlePause = () => {
		this._clearAutoPlayTimeout();
	};

	_handlePlayPauseToggle = async () => {
		const { isAutoPlaying } = this.state;

		this.hasUserAction = true;

		await this.setState({ isAutoPlaying: !isAutoPlaying, isAutoPlayCanceledOnAction: true });
		isAutoPlaying ? this._handlePause() : this._handlePlay();
	};

	_cancelTimeoutAnimations() {
		this._clearAutoPlayTimeout();
		this._clearSlideEndTimeout();
		this.clearTouchendTimeout();
	}

	_clearAutoPlayTimeout() {
		clearTimeout(this.autoPlayTimeoutId);
		this.autoPlayTimeoutId = undefined;
	}

	_clearSlideEndTimeout() {
		clearTimeout(this.slideEndTimeoutId);
		this.slideEndTimeoutId = undefined;
	}

	clearTouchendTimeout() {
		clearTimeout(this.touchEndTimeoutId);
		this.touchEndTimeoutId = undefined;
	}

	_clearTouchmovePosition() {
		this.startTouchmovePosition = undefined;
	}

	_setTouchmovePosition() {
		const position = Utils.getTranslateXProperty(this.stageComponent);
		this.startTouchmovePosition = -position;
	}

	_setRootComponentRef = (node) => {
		return (this.RootElement = node);
	};

	_setStageComponentRef = (node) => {
		return (this.stageComponent = node);
	};

	async _setInitialState() {
		const initialState = Utils.calculateInitialState(this.props, this.stageComponent);
		this.rootComponentDimensions = Utils.getElementDimensions(this.RootElement);

		await this.setState(initialState);

		if (this.props.onInitialized) {
			this.props.onInitialized(this.eventObject);
		}
	}

	_setAutoPlayInterval() {
		const { autoPlayDirection, autoPlayInterval } = this.props;

		this.autoPlayTimeoutId = setTimeout(() => {
			if (!this.isHovered) {
				autoPlayDirection === AutoplayDirection.RTL ? this.slidePrev({}) : this.slideNext({});
			}
		}, autoPlayInterval);
	}

	_setupSwipeHandlers() {
		this.swipeListener = new VS({
			element: this.RootElement,
			delta: this.props.swipeDelta,
			onSwiping: this._handleTouchmove,
			onSwiped: this._handleTouchend,
			rotationAngle: 5,
			mouseTrackingEnabled: this.props.mouseTracking,
			touchTrackingEnabled: this.props.touchTracking,
			preventDefaultTouchmoveEvent: !this.props.touchMoveDefaultEvents,
			preventTrackingOnMouseleave: true,
		});

		this.swipeListener.init();
	}

	_updateComponent(props = this.props) {
		this._cancelTimeoutAnimations();
		this.isAnimationDisabled = false;
		this.state.isAutoPlaying && this._handlePlay();

		this.setState({ clones: Utils.createClones(props) });

		requestAnimationFrame(() => {
			this.setState(Utils.calculateInitialState(props, this.stageComponent));
		});
	}

	_updateSwipeProps() {
		this.swipeListener &&
			this.swipeListener.update({
				delta: this.props.swipeDelta,
				mouseTrackingEnabled: this.props.mouseTracking,
				touchTrackingEnabled: this.props.touchTracking,
				preventDefaultTouchmoveEvent: !this.props.touchMoveDefaultEvents,
			});
	}

	_renderStageItem = (item, i: number) => {
		const styles = Utils.getRenderStageItemStyles(i, this.state);
		const className = Utils.getRenderStageItemClasses(i, this.state);
		return <Views.StageItem styles={styles} className={className} key={`stage-item-${i}`} item={item} />;
	};

	_renderSlideInfo = () => {
		const { renderSlideInfo } = this.props;
		const { activeIndex, itemsCount } = this.state;
		return <Views.SlideInfo itemsCount={itemsCount} activeIndex={activeIndex} renderSlideInfo={renderSlideInfo} />;
	};

	_renderDotsNavigation() {
		const { renderDotsItem } = this.props;
		return <Views.DotsNavigation state={this.state} onClick={this._handleDotClick} renderDotsItem={renderDotsItem} />;
	}

	_renderPrevButton() {
		const { renderPrevButton } = this.props;
		const { isPrevSlideDisabled } = Utils.getSlideItemInfo(this.state);
		return (
			<Views.PrevNextButton
				name="prev"
				onClick={this.slidePrev}
				isDisabled={isPrevSlideDisabled}
				renderPrevButton={renderPrevButton}
			/>
		);
	}

	_renderNextButton() {
		const { renderNextButton } = this.props;
		const { isNextSlideDisabled } = Utils.getSlideItemInfo(this.state);
		return (
			<Views.PrevNextButton
				name="next"
				onClick={this.slideNext}
				isDisabled={isNextSlideDisabled}
				renderNextButton={renderNextButton}
			/>
		);
	}

	_renderPlayPauseButton() {
		const { renderPlayPauseButton } = this.props;
		const { isAutoPlaying } = this.state;
		return (
			<Views.PlayPauseButton
				isPlaying={isAutoPlaying}
				onClick={this._handlePlayPauseToggle}
				renderPlayPauseButton={renderPlayPauseButton}
			/>
		);
	}

	render() {
		const { translate3d, clones, transition } = this.state;
		const shouldDisableDots = Utils.shouldDisableDots(this.props, this.state);
		const wrapperStyles = Utils.getRenderWrapperStyles(this.props, this.state, this.stageComponent);
		const stageStyles = Utils.getRenderStageStyles({ translate3d }, { transition });

		return (
			<div className="alice-carousel">
				<div ref={this._setRootComponentRef}>
					<div
						style={wrapperStyles}
						className="alice-carousel__wrapper"
						onMouseEnter={this._handleMouseEnter}
						onMouseLeave={this._handleMouseLeave}
					>
						<ul style={stageStyles} className="alice-carousel__stage" ref={this._setStageComponentRef}>
							{clones.map(this._renderStageItem)}
						</ul>
					</div>
				</div>

				{shouldDisableDots ? null : this._renderDotsNavigation()}
				{this.props.disableSlideInfo ? null : this._renderSlideInfo()}
				{this.props.disableButtonsControls ? null : this._renderPrevButton()}
				{this.props.disableButtonsControls ? null : this._renderNextButton()}
				{this.props.autoPlayControls ? this._renderPlayPauseButton() : null}
			</div>
		);
	}
}
