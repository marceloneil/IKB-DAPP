import React, { Component } from 'react'

// CSS
import 'semantic-ui-css/semantic.min.css'
import '../css/App.css'

// Ethereum
import KleinContract from '../../build/contracts/Klein.json'
import getWeb3 from '../utils/getWeb3'
import contract from 'truffle-contract'

// Components
import { Dimmer, Loader } from 'semantic-ui-react'
import Account from './Account'

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      account: null,
      instance: null,
      web3: null
    }

    this.toWei = this.toWei.bind(this)
    this.toEther = this.toEther.bind(this)
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
      console.log(instance)
      this.setState({
        instance: instance
      })
      // Get the user's account
      this.getAccount()
    }).catch(error => {
      console.log(error)
      console.log('Error finding web3.')
    })
  }

  getAccount () {
    setInterval(() => {
      this.state.web3.eth.getAccounts((error, accounts) => {
        if (error) { return console.log(error) }
        if (accounts[0] !== this.state.account) {
          this.setState({
            account: accounts[0]
          })
        }
      })
    }, 1000)
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

  render () {
    return (
      <div>
        <Dimmer active={!this.state.account}>
          <Loader>Please unlock your wallet</Loader>
        </Dimmer>
        <Account
          account={this.state.account}
          instance={this.state.instance}
          toEther={this.toEther}
        />
      </div>
    )
  }
}

export default App
