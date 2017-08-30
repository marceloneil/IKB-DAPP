import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Button, Card, Dimmer, Form, Header, Icon, Input, Loader } from 'semantic-ui-react'

class TransferToken extends Component {
  constructor (props) {
    super(props)

    this.state = {
      address: '',
      amount: 1
    }

    this.handleAddressChange = this.handleAddressChange.bind(this)
    this.handleAmountChange = this.handleAmountChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleAddressChange (event) {
    this.setState({ address: event.target.value })
  }

  handleAmountChange (event) {
    if (!event.target.value) {
      this.setState({ amount: '' })
    } else if (event.target.value &&
      event.target.value >= 0 &&
      event.target.value <= this.props.account.tokenBalance) {
      this.setState({ amount: parseInt(event.target.value) })
    }
  }

  handleSubmit (event) {
    event.preventDefault()
    if (this.state.address &&
        this.state.amount &&
        this.state.amount > 0 &&
        this.props.isAddress(this.state.address)) {
      this.props.transferToken(this.state.address, this.state.amount)
    }
  }

  render () {
    const records = this.props.account.records
    const tokenBalance = this.props.account.tokenBalance

    let accountEmpty = true
    if (tokenBalance > 0) {
      accountEmpty = false
    }

    let transferPending = false
    if (this.props.transferPending) {
      transferPending = true
    }

    let editions
    if (records) {
      if (records.length === 1 || this.state.amount === 1) {
        editions = <p className='left'>Edition: {records[0]}</p>
      } else {
        editions = <p className='left'>Editions: {records.slice(0, this.state.amount).join(', ')}</p>
      }
    }

    return (
      <Dimmer.Dimmable as={Card.Content} blurring dimmed={accountEmpty || transferPending}>
        <Dimmer active={accountEmpty} inverted>
          <Header as='h3' icon>
            <Icon name='warning sign' />
            <Header.Subheader>
              You must own some IKB to transfer!
            </Header.Subheader>
          </Header>
        </Dimmer>
        <Dimmer active={transferPending} inverted>
          <Loader inverted>Pending transaction</Loader>
        </Dimmer>
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <Input
              label={{
                content: 'To'
              }}
              fluid
              type='text'
              value={this.state.address}
              onChange={this.handleAddressChange}
            />
          </Form.Field>
          <Form.Field>
            <Input
              label={{
                content: 'IKB'
              }}
              fluid
              type='number'
              min={1}
              max={tokenBalance}
              value={this.state.amount}
              onChange={this.handleAmountChange}
            />
          </Form.Field>
          <Form.Field className='flex-box seperate'>
            {editions}
            <div>
              <Button animated='fade' color='teal'>
                <Button.Content visible>Transfer</Button.Content>
                <Button.Content hidden>
                  <Icon name='send' />
                </Button.Content>
              </Button>
            </div>
          </Form.Field>
        </Form>
      </Dimmer.Dimmable>
    )
  }
}

TransferToken.propTypes = {
  account: PropTypes.object,
  transferPending: PropTypes.string,
  transferToken: PropTypes.func,
  isAddress: PropTypes.func
}

export default TransferToken
