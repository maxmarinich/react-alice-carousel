import React from 'react'
import PropTypes from 'prop-types'

import * as Utils from '../utils'

export const SlideInfo = ({ currentIndex, slidesLength }) => {
  const info = Utils.getSlideInfo(currentIndex, slidesLength)

  return (
    <div className="alice-carousel__slide-info">
      <span className="alice-carousel__slide-info-item">{info.slideIndex}</span>
      <span className="alice-carousel__slide-info-item alice-carousel__slide-info-item--separator">/</span>
      <span className="alice-carousel__slide-info-item">{info.slidesLength}</span>
    </div>
  )
}

SlideInfo.propTypes = {
  currentIndex: PropTypes.number.isRequired,
  slidesLength: PropTypes.number.isRequired,
}
