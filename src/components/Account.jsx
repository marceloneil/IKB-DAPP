import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Card } from 'semantic-ui-react'

import BlockiesIdenticon from './BlockiesIdenticon'

class Account extends Component {
  constructor (props) {
    super(props)

    this.state = {
      currentSeries: null,
      issuedToDate: null,
      price: null,
      burnedToDate: null,
      maxSupplyPossible: null
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.instance) {
      nextProps.instance.currentSeries.call().then(currentSeries => {
        this.setState({
          currentSeries: currentSeries.toNumber()
        })
        return nextProps.instance.issuedToDate.call()
      }).then(issuedToDate => {
        this.setState({
          issuedToDate: issuedToDate.toNumber()
        })
        return nextProps.instance.series.call(this.state.currentSeries)
      }).then(series => {
        this.setState({
          price: series[0].toNumber()
        })
        return nextProps.instance.burnedToDate.call()
      }).then(burnedToDate => {
        this.setState({
          burnedToDate: burnedToDate.toNumber()
        })
        return nextProps.instance.maxSupplyPossible.call()
      }).then(maxSupplyPossible => {
        this.setState({
          maxSupplyPossible: maxSupplyPossible.toNumber()
        })
      }).catch(error => {
        console.log(error)
      })
    }
  }

  render () {
    return (
      <Card centered>
        <Card.Content>
          <Card.Header>Account info</Card.Header>
        </Card.Content>
        <Card.Content>
          <BlockiesIdenticon
            seed={this.props.account}
            size={8}
            scale={16}
          />
          <p>Series Number: {this.state.currentSeries + 1}</p>
          <p>Issued to date: {this.state.issuedToDate} / {this.state.maxSupplyPossible}</p>
          <p>Price: Ξ{this.props.toEther(this.state.price)} ETH</p>
          <p>Burned to date: {this.state.burnedToDate}</p>
        </Card.Content>
      </Card>
    )
  }
}

Account.propTypes = {
  account: PropTypes.string,
  instance: PropTypes.object,
  toEther: PropTypes.func
}

export default Account
