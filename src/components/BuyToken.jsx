import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Card, Dimmer, Form, Input, Loader } from 'semantic-ui-react'

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
    if (event.target.value &&
      event.target.value >= 1 &&
      event.target.value <= this.props.contract.contractBalance) {
      this.setState({ value: parseInt(event.target.value) })
    }
  }

  handleSubmit (event) {
    event.preventDefault()
    if (this.state.value) {
      let value = this.state.value * this.props.contract.price
      this.props.buyToken(value)
    }
  }

  render () {
    const contractPrice = this.props.toEther(this.props.contract.price)
    const totalPrice = this.props.toEther(this.state.value * this.props.contract.price)
    const IKBFirstToken = this.props.contract.issuedToDate - this.props.contract.contractBalance

    let IKBTokenNumbers
    if (this.state.value > 1) {
      const IKBLastToken = IKBFirstToken + this.state.value - 1
      IKBTokenNumbers = <p>Buying tokens #{IKBFirstToken} to #{IKBLastToken}</p>
    } else {
      IKBTokenNumbers = <p>Buying token #{IKBFirstToken}</p>
    }

    return (
      <Card centered>
        <Card.Content>
          <Card.Header>Buy tokens from series #{this.props.contract.currentSeries}</Card.Header>
        </Card.Content>
        <Card.Content>
          <Dimmer active={!!this.props.buyPending} inverted>
            <Loader inverted>Pending transaction</Loader>
          </Dimmer>
          <Form onSubmit={this.handleSubmit}>
            <Form.Field>
              <Input
                label={{
                  basic: true,
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
                max={this.props.contract.contractBalance}
                value={this.state.value}
                onChange={this.handleChange}
              />
            </Form.Field>
            <p>Price: {this.state.value} IKB × Ξ{contractPrice} = Ξ{totalPrice}</p>
            {IKBTokenNumbers}
          </Form>
        </Card.Content>
      </Card>
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
