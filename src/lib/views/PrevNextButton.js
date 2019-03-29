import React from 'react'
import PropTypes from 'prop-types'

export const PrevNextButton = ({ name, disabled, onClick, onMouseEnter, onMouseLeave }) => {
  const className = `alice-carousel__${name}-btn-item${disabled ? ' __inactive' : ''}`

  return (
    <div className={`alice-carousel__${name}-btn`}>
      <div className={`alice-carousel__${name}-btn-wrapper`} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <p className={className} onClick={onClick}>
          <span data-area={name} />
        </p>
      </div>
    </div>
  )
}

PrevNextButton.propTypes = {
  name: PropTypes.oneOf(['next', 'prev']),
  disabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
}
