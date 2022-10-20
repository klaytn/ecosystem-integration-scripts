# Wyvern Protocol Integration
The purpose of this documentation is to explain developers how to integrate Wyvern Protocol on Klaytn. 
Wyvern Protocol is a decentralized exchange for non-fungible and fungible assets. It allows to auction any kind of item: trade ENS names, a rare CryptoPunks, trade custom assets in any combination.

The protocol should:
- Allow parties to list specific assets they own for sale
- Match buyer and seller intent as efficiently as possible
- Settle the asset transfer once a buyer and seller have agreed to terms
- Provide a comprehensive on-chain audit trail of all transactions for future use

On Klaytn, Wyvern Protocol supports:
- KIP7 tokens
- KIP17 NFTs
- KIP37 Multi Tokens
- ERC-1271 off-chain signature validation assets

## Payment Tokens
The Exchange supports any KIP7-compatible token as a payment method for assets, chosen by the seller at time of listing.

## Development
### Setup
Install dependencies with **Yarn**:
```
yarn
````
Install Klaytn contracts:
````
npm i @klaytn/contracts
````

### Testing
Run testrpc (ganache-cli) to provide a simulated EVM:
````
yarn testrpc
````
In a separate terminal, run the testuite:
````
yarn test
````

### Truffle Config
Update **truffle.js**. Use ‘*pragma*’ as the version of Solidity. As the Klaytn contracts are compiled with the version *0.8.0* of Solidity and the Wyvern protocol contracts with the *0.7.6* version, it allows to compile both contracts version inside the projects.
````javascript
compilers: {
    solc: {
      //version: '0.7.5',
      version: 'pragma',
      settings: {
        optimizer: {
          enabled: true,
          runs: 750
        }
      }
    }
  }
  ````
  
  ### Tests changes
  In the test **3-wyvern-registry.js**, a test case was updated to match the KIPs standard. The error message was changed as Wyvern Protocol used the version *3.3* of OpenZeppelin Contract and Klaytn the version *1.0.4*, which is similar to the version *4.5.0* of OpenZeppelin. The last version of OZ and Klaytn contracts are calling the **_spendAllowance** function in the **transferFrom** function, whereas the version 3.3 of OZ used by Wyvern Protocol the **_spendAllowance** function doesn’t exist. This function is throwing the message insufficient allowance in case of an error, which was added in the test.
  
  *3-wyvern-registry.js test on Ethereum*
  ````
it('allows proxy to receive tokens before approval',async () => {
    const amount = '1000'
    let registry = await WyvernRegistry.deployed()
    let proxy = await registry.proxies(accounts[3])
    let erc20 = await TestERC20.deployed()
    let contract = new web3.eth.Contract(AuthenticatedProxy.abi,proxy)
    return assertIsRejected(
      contract.methods.receiveApproval(accounts[3],amount,erc20.address,'0x').send({from: accounts[3]}),
      /ERC20: transfer amount exceeds balance/,
      'Should not have succeeded'
      )
  })
  ````
*3-wyvern-registry.js test on Klaytn*
````
it('allows proxy to receive tokens before approval',async () => {
    const amount = '1000'
    let registry = await WyvernRegistry.deployed()
    let proxy = await registry.proxies(accounts[3])
    let erc20 = await TestERC20.deployed()
    let contract = new web3.eth.Contract(AuthenticatedProxy.abi,proxy)
    return assertIsRejected(
      contract.methods.receiveApproval(accounts[3],amount,erc20.address,'0x').send({from: accounts[3]}),
      /KIP7: insufficient allowance/,
      'Should not have succeeded'
      )
  })
  ````