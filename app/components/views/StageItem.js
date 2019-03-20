import React from 'react'
import PropTypes from 'prop-types'

export const StageItem = ({ item, className, styles }) => {
  return (
    <li style={styles} className={className}>
      {item}
    </li>
  )
}

StageItem.propTypes = {
  item: PropTypes.node,
  className: PropTypes.string.isRequired,
  styles: PropTypes.object.isRequired,
}
