import React from 'react'
import PropTypes from 'prop-types'

export const PlayPauseButton = ({ isPlaying, onClick }) => {
  return (
    <div className="alice-carousel__play-btn">
      <div className="alice-carousel__play-btn-wrapper">
        <div onClick={onClick} className={`alice-carousel__play-btn-item${isPlaying ? ' __pause' : ''}`} />
      </div>
    </div>
  )
}

PlayPauseButton.propTypes = {
  isPlaying: PropTypes.bool,
  onClick: PropTypes.func,
}
