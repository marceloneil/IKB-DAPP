import React from 'react'
import PropTypes from 'prop-types'

import { Card } from 'semantic-ui-react'

import BlockiesIdenticon from './BlockiesIdenticon'

const AccountInfo = (props) => {
  const address = props.account.address
  const ethBalance = props.toEther(props.account.ethBalance)
  const tokenBalance = props.account.tokenBalance

  return (
    <Card.Content>
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
    </Card.Content>
  )
}

AccountInfo.propTypes = {
  account: PropTypes.object,
  toEther: PropTypes.func
}

export default AccountInfo
