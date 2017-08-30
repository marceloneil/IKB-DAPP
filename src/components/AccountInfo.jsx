import React from 'react'
import PropTypes from 'prop-types'

import { Card } from 'semantic-ui-react'

import BlockiesIdenticon from './BlockiesIdenticon'

const AccountInfo = (props) => {
  const address = props.account.address
  const ethBalance = props.toEther(props.account.ethBalance)
  const tokenBalance = props.account.tokenBalance

  let editions
  if (props.account.records) {
    if (props.account.records.length === 1) {
      editions = <p>Edition: {props.account.records[0]}</p>
    } else {
      editions = <p>Editions: {props.account.records.join(', ')}</p>
    }
  }

  return (
    <Card.Content className='flex-box'>
      <BlockiesIdenticon
        seed={address}
        size={8}
        scale={16}
      />
      <div id='account-info'>
        <p>Account: {address}</p>
        <p>Ethereum Balance: Ξ{ethBalance}</p>
        <p>Token Balance: {tokenBalance} IKB</p>
        {editions}
      </div>
    </Card.Content>
  )
}

AccountInfo.propTypes = {
  account: PropTypes.object,
  toEther: PropTypes.func
}

export default AccountInfo
