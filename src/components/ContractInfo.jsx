import React from 'react'
import PropTypes from 'prop-types'

import { Card } from 'semantic-ui-react'

const ContractInfo = (props) => {
  const burnedToDate = props.contract.burnedToDate
  const contractBalance = props.contract.contractBalance
  const currentPrice = props.toEther(props.contract.price)
  const currentSeries = props.contract.currentSeries
  const issuedToDate = props.contract.issuedToDate
  const maxSupplyPossible = props.contract.maxSupplyPossible

  return (
    <Card centered>
      <Card.Content>
        <Card.Header>Contract Info</Card.Header>
      </Card.Content>
      <Card.Content>
        <p>Issued to date: {issuedToDate} / {maxSupplyPossible}</p>
        <p>Burned to date: {burnedToDate} / {issuedToDate}</p>
        <p>Series number: {currentSeries}</p>
        <p>Remaining in series: {contractBalance}</p>
        <p>Current price: Ξ{currentPrice}</p>
      </Card.Content>
    </Card>
  )
}

ContractInfo.propTypes = {
  contract: PropTypes.object,
  toEther: PropTypes.func
}

export default ContractInfo
