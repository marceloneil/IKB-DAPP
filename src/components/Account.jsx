import React from 'react'
import PropTypes from 'prop-types'

import { Button, Card, Dimmer, Header, Icon } from 'semantic-ui-react'

import BlockiesIdenticon from './BlockiesIdenticon'

const Account = (props) => (
  <Card centered>
    <Card.Content>
      <Card.Header>Account info</Card.Header>
    </Card.Content>
    <Dimmer.Dimmable as={Card.Content} blurring dimmed={!props.account.address}>
      <Dimmer active={!props.account.address} inverted>
        <Header as='h2' icon>
          <Icon name='lock' />
          <Header.Subheader>
            Unlock your account to view additional info
          </Header.Subheader>
        </Header>
      </Dimmer>
      <div className='test'>
        <BlockiesIdenticon
          seed={props.account.address}
          size={8}
          scale={16}
        />
        <div>
          <p>Account: {/* props.account.address */}</p>
          <p>Ethereum Balance: Ξ{props.toEther(props.account.ethBalance)}</p>
          <p>Token Balance: {props.account.tokenBalance} IKB</p>
        </div>
      </div>
      <Button.Group>
        <Button>Buy</Button>
        <Button>Transfer</Button>
        <Button>Burn</Button>
      </Button.Group>
    </Dimmer.Dimmable>
  </Card>
)

Account.propTypes = {
  account: PropTypes.object,
  toEther: PropTypes.func
}

export default Account
