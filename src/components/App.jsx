import React, { Component } from 'react'

// CSS
import 'semantic-ui-css/semantic.min.css'
import '../css/App.css'

// Ethereum
import KleinContract from '../../build/contracts/Klein.json'
import getWeb3 from '../utils/getWeb3'
import contract from 'truffle-contract'

// Components
// import { Dimmer, Loader } from 'semantic-ui-react'
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
      web3: null
    }

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
    console.log(instance)
    let account = this.state.account
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

    // this.state.instance.issueNewSeries({ from: this.state.account.address }).then(data => {
    //   console.log(data)
    // }).catch(error => {
    //   console.log(error)
    // })
  }

  getContractVariables () {
    let contract = this.state.contract
    this.state.instance.currentSeries.call().then(currentSeries => {
      contract.currentSeries = currentSeries.toNumber()
      return this.state.instance.issuedToDate.call()
    }).then(issuedToDate => {
      contract.issuedToDate = issuedToDate.toNumber()
      return this.state.instance.series.call(contract.currentSeries)
    }).then(series => {
      contract.price = series[0].toNumber()
      return this.state.instance.burnedToDate.call()
    }).then(burnedToDate => {
      contract.burnedToDate = burnedToDate.toNumber()
      return this.state.instance.maxSupplyPossible.call()
    }).then(maxSupplyPossible => {
      contract.maxSupplyPossible = maxSupplyPossible.toNumber()
      return this.state.instance.balanceOf.call(this.state.instance.address) // .call(this.state.instance.address)
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
    return (
      <div>
        <ContractInfo
          contract={this.state.contract}
          toEther={this.toEther}
        />
        <AccountInfo
          account={this.state.account}
          toEther={this.toEther}
        />
        <BuyToken
          contract={this.state.contract}
          buyPending={this.state.buyPending}
          buyToken={this.buyToken}
          toEther={this.toEther}
        />
        <TransferToken
          account={this.state.account}
          contract={this.state.contract}
          transferToken={this.transferToken}
          isAddress={this.isAddress}
        />
      </div>
    )
  }
}

export default App
