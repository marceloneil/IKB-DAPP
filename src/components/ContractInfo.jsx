import React from 'react'
import PropTypes from 'prop-types'

import { Card } from 'semantic-ui-react'

const ContractInfo = (props) => (
  <Card centered>
    <Card.Content>
      <Card.Header>Contract Info</Card.Header>
    </Card.Content>
    <Card.Content>
      <p>Issued to date: {props.contract.issuedToDate} / {props.contract.maxSupplyPossible}</p>
      <p>Burned to date: {props.contract.burnedToDate} / {props.contract.issuedToDate}</p>
      <p>Series number: {props.contract.currentSeries}</p>
      <p>Remaining in series: {props.contract.contractBalance}</p>
      <p>Current price: Ξ{props.toEther(props.contract.price)}</p>
    </Card.Content>
  </Card>
)

ContractInfo.propTypes = {
  contract: PropTypes.object,
  toEther: PropTypes.func
}

export default ContractInfo
