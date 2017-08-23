import React, { Component } from 'react'
import PropTypes from 'prop-types'

import blockies from 'ethereum-blockies/blockies'

class BlockiesIdenticon extends Component {
  componentWillReceiveProps (nextProps) {
    if (nextProps.seed) {
      blockies.render({
        seed: nextProps.seed,
        color: nextProps.color,
        bgcolor: nextProps.bgcolor,
        size: nextProps.size,
        scale: nextProps.scale,
        spotcolor: nextProps.spotcolor
      }, this.canvas)
    }
  }

  render () {
    return (
      <canvas
        className='blockies-identicon'
        ref={canvas => { this.canvas = canvas }}
      />
    )
  }
}

BlockiesIdenticon.propTypes = {
  seed: PropTypes.string,
  color: PropTypes.string,
  bgcolor: PropTypes.string,
  size: PropTypes.number,
  scale: PropTypes.number,
  spotcolor: PropTypes.string
}

export default BlockiesIdenticon
