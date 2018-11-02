import PropTypes from 'prop-types'

const propTypes = {
  items: PropTypes.array,
  children: PropTypes.array,
  onSlideChange: PropTypes.func,
  onSlideChanged: PropTypes.func,
  onInitialized: PropTypes.func,
  onResized: PropTypes.func,
  keysControlDisabled: PropTypes.bool,
  playButtonEnabled: PropTypes.bool,
  buttonsDisabled: PropTypes.bool,
  dotsDisabled: PropTypes.bool,
  swipeDisabled: PropTypes.bool,
  responsive: PropTypes.object,
  stagePadding: PropTypes.object,
  duration: PropTypes.number,
  startIndex: PropTypes.number,
  slideToIndex: PropTypes.number,
  autoPlay: PropTypes.bool,
  infinite: PropTypes.bool,
  showSlideInfo: PropTypes.bool,
  mouseDragEnabled: PropTypes.bool,
  fadeOutAnimation: PropTypes.bool,
  autoPlayInterval: PropTypes.number,
  autoPlayDirection: PropTypes.string,
  disableAutoPlayOnAction: PropTypes.bool,
  stopAutoPlayOnHover: PropTypes.bool,
  preventEventOnTouchMove: PropTypes.bool
}

const defaultProps = {
  items: [],
  children: [],
  responsive: {},
  stagePadding: {},
  duration: 250,
  startIndex: 0,
  slideToIndex: 0,
  autoPlay: false,
  infinite: true,
  dotsDisabled: false,
  showSlideInfo: false,
  swipeDisabled: false,
  autoPlayInterval: 250,
  buttonsDisabled: false,
  mouseDragEnabled: false,
  fadeOutAnimation: false,
  playButtonEnabled: false,
  autoPlayDirection: 'ltr',
  keysControlDisabled: false,
  disableAutoPlayOnAction: false,
  stopAutoPlayOnHover: true,
  preventEventOnTouchMove: false
}

export { propTypes, defaultProps }
