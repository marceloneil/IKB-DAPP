import React, { Component } from 'react'
import PropTypes from 'prop-types'

import blockies from 'ethereum-blockies/blockies'

class BlockiesIdenticon extends Component {
  componentDidMount () {
    if (this.props.seed) {
      this.draw(this.props)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.seed) {
      this.draw(nextProps)
    }
  }

  draw (props) {
    blockies.render({
      seed: props.seed,
      color: props.color,
      bgcolor: props.bgcolor,
      size: props.size,
      scale: props.scale,
      spotcolor: props.spotcolor
    }, this.canvas)
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

/* eslint-disable react/no-unused-prop-types */
BlockiesIdenticon.propTypes = {
  seed: PropTypes.string,
  color: PropTypes.string,
  bgcolor: PropTypes.string,
  size: PropTypes.number,
  scale: PropTypes.number,
  spotcolor: PropTypes.string
}

export default BlockiesIdenticon
