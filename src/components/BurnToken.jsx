import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Button, Card, Dimmer, Dropdown, Form, Header, Icon } from 'semantic-ui-react'

class BurnToken extends Component {
  constructor (props) {
    super(props)

    if (props.account.records) {
      this.state = {
        value: props.account.records[0]
      }
    } else {
      this.state = { value: '' }
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange (event, data) {
    if (data.value) {
      this.setState({ value: data.value })
    }
  }

  handleSubmit (event) {
    event.preventDefault()
    const edition = this.state.value
    if (edition &&
        this.props.account.records.includes(edition)) {
      this.props.burnToken(edition)
    }
  }

  render () {
    const tokenBalance = this.props.account.tokenBalance
    const records = this.props.account.records.map(record => {
      return {
        text: record,
        value: record
      }
    })

    let accountEmpty = true
    if (tokenBalance > 0) {
      accountEmpty = false
    }

    return (
      <Dimmer.Dimmable id='burn-panel' as={Card.Content} blurring dimmed={accountEmpty}>
        <Dimmer active={accountEmpty} inverted>
          <Header as='h3' icon>
            <Icon name='warning sign' />
            <Header.Subheader>
              You must own some IKB to burn!
            </Header.Subheader>
          </Header>
        </Dimmer>
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <Dropdown
              placeholder='Select Record'
              fluid
              selection
              options={records}
              value={this.state.value}
              onChange={this.handleChange}
            />
          </Form.Field>
          <Form.Field>
            <Button animated='fade' className='right' color='teal'>
              <Button.Content visible>Burn</Button.Content>
              <Button.Content hidden>
                <Icon name='fire' />
              </Button.Content>
            </Button>
          </Form.Field>
        </Form>
      </Dimmer.Dimmable>
    )
  }
}

BurnToken.propTypes = {
  account: PropTypes.object,
  burnToken: PropTypes.func
}

export default BurnToken
