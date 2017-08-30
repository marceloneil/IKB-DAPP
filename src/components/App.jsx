import React, { Component } from 'react'

// CSS
import 'semantic-ui-css/semantic.min.css'
import '../css/App.css'

// Ethereum
import KleinContract from '../../build/contracts/Klein.json'
import getWeb3 from '../utils/getWeb3'
import contract from 'truffle-contract'

// Components
import { Card, Dimmer, Header, Icon, Menu } from 'semantic-ui-react'
import AccountInfo from './AccountInfo'
import ContractInfo from './ContractInfo'
import BuyToken from './BuyToken'
import TransferToken from './TransferToken'

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      account: {
        address: null,
        ethBalance: 0,
        tokenBalance: 0,
        records: null
      },
      contract: {
        currentSeries: null,
        issuedToDate: null,
        price: null,
        burnedToDate: null,
        maxSupplyPossible: null,
        contractBalance: null
      },
      buyPending: null,
      instance: null,
      web3: null,
      currentPane: 0
    }

    this.handleItemClick = this.handleItemClick.bind(this)

    this.toWei = this.toWei.bind(this)
    this.toEther = this.toEther.bind(this)
    this.isAddress = this.isAddress.bind(this)

    this.buyToken = this.buyToken.bind(this)
    this.transferToken = this.transferToken.bind(this)
  }

  componentWillMount () {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3.then(results => {
      this.setState({
        web3: results.web3
      })

      // Set web3 provider for contract
      const klein = contract(KleinContract)
      klein.setProvider(this.state.web3.currentProvider)
      return klein.deployed()
    }).then(instance => {
      this.setState({
        instance: instance
      }, () => {
        // Get the user's account
        this.getAccount()
        this.getContractVariables()
      })
    }).catch(error => {
      console.log(error)
      console.log('Error finding web3.')
    })
  }

  getAccount () {
    setInterval(() => {
      this.state.web3.eth.getAccounts((error, accounts) => {
        if (error) { return console.log(error) }
        if (accounts[0] !== this.state.account.address) {
          let account = this.state.account
          account.address = accounts[0]
          this.setState({
            account: account
          }, () => {
            this.getBalances()
            this.watchContract()
          })
        }
      })
    }, 1000)
  }

  getBalances () {
    const address = this.state.account.address
    const instance = this.state.instance
    const web3 = this.state.web3
    let account = this.state.account

    if (address) {
      web3.eth.getBalance(address, (error, balance) => {
        if (error) { return console.log(error) }
        account.ethBalance = balance.toNumber()
        instance.balanceOf.call(address).then(balance => {
          account.tokenBalance = balance.toNumber()
          this.setState({
            account: account
          })
        }).catch(console.log)
      })
    } else {
      account.ethBalance = 0
      account.tokenBalance = 0
      this.setState({
        account: account
      })
    }

    // this.state.instance.issueNewSeries({ from: this.state.account.address }).then(data => {
    //   console.log(data)
    // }).catch(error => {
    //   console.log(error)
    // })
  }

  getContractVariables () {
    const instance = this.state.instance
    let contract = this.state.contract
    instance.currentSeries.call().then(currentSeries => {
      contract.currentSeries = currentSeries.toNumber()
      return instance.issuedToDate.call()
    }).then(issuedToDate => {
      contract.issuedToDate = issuedToDate.toNumber()
      return instance.series.call(contract.currentSeries)
    }).then(series => {
      contract.price = series[0].toNumber()
      return instance.burnedToDate.call()
    }).then(burnedToDate => {
      contract.burnedToDate = burnedToDate.toNumber()
      return instance.maxSupplyPossible.call()
    }).then(maxSupplyPossible => {
      contract.maxSupplyPossible = maxSupplyPossible.toNumber()
      return instance.balanceOf.call(instance.address)
    }).then(contractBalance => {
      contract.contractBalance = contractBalance.toNumber()
      this.setState({
        contract: contract
      })
    }).catch(error => {
      console.error(error)
    })
  }

  watchContract () {
    this.state.instance.Transfer((error, result) => {
      if (error) { return console.log(error) }
      if (result.transactionHash === this.state.buyPending) {
        this.setState({ buyPending: null })
      }
      this.getBalances()
      this.getContractVariables()
    })
  }

  handleItemClick (event, data) {
    this.setState({ currentPane: data.index })
  }

  toWei (number, unit) {
    if (this.state.web3) {
      return this.state.web3.toWei(number, unit)
    }
    return undefined
  }

  toEther (number) {
    if (this.state.web3) {
      return this.state.web3.fromWei(number, 'ether')
    }
    return undefined
  }

  isAddress (address) {
    if (this.state.web3) {
      return this.state.web3.isAddress(address)
    }
    return undefined
  }

  buyToken (value) {
    this.state.instance.sendTransaction({
      from: this.state.account.address,
      value: value
    }).then(receipt => {
      this.setState({ buyPending: receipt.tx })
    }).catch(console.log)
  }

  transferToken (to, value) {
    let from = this.state.account.address
    this.state.instance.transfer(to, value, { from: from }).then(data => {
      console.log(data)
    }).catch(console.log)
  }

  render () {
    const currentPane = this.state.currentPane

    const items = [
      'Account Info',
      'Buy Tokens',
      'Transfer Tokens'
    ]

    const panes = [
      <AccountInfo
        account={this.state.account}
        toEther={this.toEther}
      />,
      <BuyToken
        contract={this.state.contract}
        buyPending={this.state.buyPending}
        buyToken={this.buyToken}
        toEther={this.toEther}
      />,
      <TransferToken
        account={this.state.account}
        contract={this.state.contract}
        transferToken={this.transferToken}
        isAddress={this.isAddress}
      />
    ]

    let accountLocked = true
    if (this.state.account.address) {
      accountLocked = false
    }

    return (
      <div>
        <ContractInfo
          contract={this.state.contract}
          toEther={this.toEther}
        />
        <Dimmer.Dimmable as={Card} centered blurring dimmed={accountLocked}>
          <Dimmer active={accountLocked} inverted>
            <Header as='h3' icon>
              <Icon name='lock' />
              <Header.Subheader>
                Unlock your account to view additional info
              </Header.Subheader>
            </Header>
          </Dimmer>
          <Card.Content>
            <Card.Header>{items[currentPane]}</Card.Header>
          </Card.Content>
          {panes[currentPane]}
          <Menu
            activeIndex={this.state.currentPane}
            attached='bottom'
            widths={3}
            items={items}
            onItemClick={this.handleItemClick}
          />
        </Dimmer.Dimmable>
      </div>
    )
  }
}

export default App
