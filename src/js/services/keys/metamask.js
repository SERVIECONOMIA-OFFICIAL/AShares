import * as keyService from "./baseKey"
import EthereumTx from "ethereumjs-tx"
import {newWeb3Instance} from "../web3"

export default class Metamask {

  async signSignature(data, account) {
    try {      
      var web3Service = newWeb3Instance()
      var signature =  web3Service.sign(data)
      return signature
    }catch(err){
      console.log(err)
      throw err
    }    
  }

  async broadCastTx(funcName, ...args) {
    try {
      var txHash = await this.callSignTransaction(funcName, ...args)
      return txHash
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  callSignTransaction = (funcName, ...args) => {
    return new Promise((resolve, reject) => {
      keyService[funcName](...args).then(result => {
        const { txParams, keystring, password } = result
        this.sealTx(txParams, keystring, password).then(result => {
          resolve(result)
        }).catch(e => {
          console.log(e.message)
          reject(e)
        })
      })
    })
    // const { txParams, keystring, password } = keyService[funcName](...args)
    // return this.sealTx(txParams, keystring, password)
  }

  sealTx = (txParams, web3Service, password) => {
    txParams.gas = txParams.gasLimit
    delete (txParams.gasLimit)

    return new Promise((resolve, reject) => {
      web3Service.web3.eth.sendTransaction(txParams, function (err, transactionHash) {
        if (!err) {
          resolve(transactionHash)
        } else {
          console.log(err)
          reject(err.message)
        }
      })
    })
  }
}
