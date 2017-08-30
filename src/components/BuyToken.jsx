import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Card, Dimmer, Form, Header, Icon, Input, Loader } from 'semantic-ui-react'

class BuyToken extends Component {
  constructor (props) {
    super(props)

    this.state = {
      value: 1
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange (event) {
    if (!event.target.value) {
      this.setState({ value: '' })
    } else if (event.target.value &&
      event.target.value >= 0 &&
      event.target.value <= this.props.contract.contractBalance) {
      this.setState({ value: parseInt(event.target.value) })
    }
  }

  handleSubmit (event) {
    event.preventDefault()
    if (this.state.value &&
        this.state.value > 0) {
      let value = this.state.value * this.props.contract.price
      this.props.buyToken(value)
    }
  }

  render () {
    const value = this.state.value ? this.state.value : 0
    const contractBalance = this.props.contract.contractBalance
    const contractPrice = this.props.toEther(this.props.contract.price)
    const IKBFirstToken = this.props.contract.issuedToDate - this.props.contract.contractBalance
    const totalPrice = this.props.toEther(value * this.props.contract.price)

    let contractEmpty = true
    if (contractBalance) {
      contractEmpty = false
    }

    let buyPending = false
    if (this.props.buyPending) {
      buyPending = true
    }

    let IKBTokenNumbers
    if (this.state.value > 1) {
      const IKBLastToken = IKBFirstToken + this.state.value - 1
      IKBTokenNumbers = <p>Buying tokens #{IKBFirstToken} to #{IKBLastToken}</p>
    } else {
      IKBTokenNumbers = <p>Buying token #{IKBFirstToken}</p>
    }

    return (
      <Dimmer.Dimmable as={Card.Content} blurring dimmed={contractEmpty || buyPending}>
        <Dimmer active={contractEmpty} inverted>
          <Header as='h3' icon>
            <Icon name='frown' />
            <Header.Subheader>
              There are no IKB available to purchase
            </Header.Subheader>
          </Header>
        </Dimmer>
        <Dimmer active={buyPending} inverted>
          <Loader inverted>Pending transaction</Loader>
        </Dimmer>
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <Input
              label={{
                content: 'IKB'
              }}
              action={{
                color: 'teal',
                content: 'Buy',
                labelPosition: 'right',
                icon: 'cart'
              }}
              fluid
              type='number'
              min={1}
              max={contractBalance}
              value={this.state.value}
              onChange={this.handleChange}
            />
          </Form.Field>
          <p>Price: {value} IKB × Ξ{contractPrice} = Ξ{totalPrice}</p>
          {IKBTokenNumbers}
        </Form>
      </Dimmer.Dimmable>
    )
  }
}

BuyToken.propTypes = {
  contract: PropTypes.object,
  buyPending: PropTypes.string,
  buyToken: PropTypes.func,
  toEther: PropTypes.func
}

export default BuyToken
