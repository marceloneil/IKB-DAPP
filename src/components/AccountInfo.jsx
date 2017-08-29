import React from 'react'
import PropTypes from 'prop-types'

import { Card, Dimmer, Header, Icon } from 'semantic-ui-react'

import BlockiesIdenticon from './BlockiesIdenticon'

const AccountInfo = (props) => {
  const address = props.account.address
  const ethBalance = props.toEther(props.account.ethBalance)
  const tokenBalance = props.account.tokenBalance

  let accountLocked = true
  if (address) {
    accountLocked = false
  }

  return (
    <Card centered>
      <Card.Content>
        <Card.Header>Account info</Card.Header>
      </Card.Content>
      <Dimmer.Dimmable as={Card.Content} blurring dimmed={accountLocked}>
        <Dimmer active={accountLocked} inverted>
          <Header as='h3' icon>
            <Icon name='lock' />
            <Header.Subheader>
              Unlock your account to view additional info
            </Header.Subheader>
          </Header>
        </Dimmer>
        <BlockiesIdenticon
          className='left'
          seed={address}
          size={8}
          scale={16}
        />
        <div className='right'>
          <p>Account: {/* props.account.address */}</p>
          <p>Ethereum Balance: Ξ{ethBalance}</p>
          <p>Token Balance: {tokenBalance} IKB</p>
        </div>
      </Dimmer.Dimmable>
    </Card>
  )
}

AccountInfo.propTypes = {
  account: PropTypes.object,
  toEther: PropTypes.func
}

export default AccountInfo
