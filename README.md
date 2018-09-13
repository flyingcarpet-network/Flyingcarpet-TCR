# Flyingcarpet Token-Curated Registry of Opportunities

[ ![Codeship Status for skmgoldin/tcr](https://app.codeship.com/projects/b140cce0-ac77-0135-0738-52e8b96e2dec/status?branch=master)](https://app.codeship.com/projects/257003)

A [token-curated registry (TCR)](https://medium.com/@ilovebagels/token-curated-registries-1-0-61a232f8dac7) for storing StandardBounties data collection opportunities. Forked from Mike Goldin's TCR implementation ([Owner's Manual available](https://github.com/skmgoldin/tcr/blob/master/owners_manual.md)).

<!--
Mainnet factory: [0x74bd1d07a158e8a9eecfbd2267766f5919e2b21c](https://etherscan.io/address/0x74bd1d07a158e8a9eecfbd2267766f5919e2b21c#code)

Rinkeby factory: [0x2bddfc0c506a00ea3a6ccea5fbbda8843377dcb1](https://rinkeby.etherscan.io/address/0x2bddfc0c506a00ea3a6ccea5fbbda8843377dcb1#code)

EPM: [tcr](https://www.ethpm.com/registry/packages/44)
-->

## Development Environment
Although you can deploy this TCR on any Ethereum network, a quick and easy development environment can be setup and run locally using Truffle's [Ganache](https://truffleframework.com/ganache). Download the latest version from the [Ganache website](https://truffleframework.com/ganache), install and open.

Once Ganache is running, you'll need a `secrets.json` file with the funded Ganache mnemonic on the `m/44'/60'/0'/0/0` HD path in the root of the repo to deploy. Your `secrets.json` should look like this:

```json
{
  "mnemonic": "my good mnemonic ..."
}
```

If you prefer to use an environment variable, your `.bashrc` or `.bash_profile` should look something like:

```bash
export MNEMONIC='my good mnemonic ...'
```

## Setup StandardBounties Contract Locally

Clone the [Bounties Network](https://bounties.network/)'s StandardBounties repo locally:

```
git clone https://github.com/Bounties-Network/StandardBounties.git
```

Install and deploy the contracts locally:

```
npm install
truffle migrate --network ganache
```

Finally, update the `StandardBounties` contract address in the [`init()` function](https://github.com/flyingcarpet-network/Flyingcarpet-TCR/blob/master/contracts/Registry.sol#L48) of this repo's `Registry` contract, it should be:
```
standardBountiesAddress = /* address of newly deployed StandardBounties contract from above */;
```

## Initialize
The only environmental dependency you need is Node. Presently we can guarantee this all works with Node 8. Install all dependancies and deploy the factory contracts:
```
npm install
npm run deploy-ganache
```

Next, you'll need to call the deployed factory contracts:
```
npm run deploy-proxies:ganache
```

The `Parameterizer`, `Registry` and `Token` contracts are now deployed locally.

## Interacting with the Registry Functions

If you don't want to use Web3 to directly interact with contract functions, you can easily run the contracts' functions using the contracts tab in [MyEtherWallet](https://www.myetherwallet.com/#contracts). Simply switch to the local Ganache network in MyEtherWallet, then copy the deployment address of the contract you would like to run and the corresponding ABI from the `/build/contracts` JSON directory.

## Function Call Flow

The below diagram shows the different smart-contract calls from the dapp frontend.

![Smart-Contract function Flow Diagram](images/call-flow-diagram.png?raw=true "Smart-Contract function Flow Diagram")

### Registry Contract

The `Registry` contract manages the list (array) of bounties. The contract's public `listing` array is accessed by the frontend map to display the avaliable bounties, while the `submit()` and `assessFulfillment()` functions are used to create new bounties and trigger bounty fulfillment evaluations, respectively.

### StandardBounties Contract

After bounties are created by the `Registry` contract, bounties are funded using the `contribute()` function of the `StandardBounties` contract. Once the bounty is sufficiently funded (the total contributed token is greater than or equal to the Registry contract's `stakingPoolSize` parameter), the `StandardBounties`'s `activateBounty()` function may be call to activate the bounty.

Fulfillments may then be submitted using the `StandardBounties`'s `fulfillBounty()` function. Note that bounty fulfillment evaluation (via the PLCRVoting mechanism) will occur when the `accessFulfillment` function of the `Registry` contract is called (to be implemented).

### Token Contract

When the Registry is deployed a ERC-20 token is also deployed (as defined in the [`conf/config.json`](conf/config.json) file). Obviously, before token can be sent to a bounty using the `StandardBounties`'s `contribute()` function, the token contracts's `approve()` function must be called in order to give the bounties contract access to the desired amount of token to stake.

## Governance

Governance of the TCR is handled by the `Parameterizer` contract. This contract enables token holders to vote on changes to the Registry parameters (currently only the `stakingPoolSize` parameter) as well as the parameters of the `Parameterizer` contract itself (that defines how the governance mechanism works). Currently, there is no UI implemented to interact with these `Parameterizer` methods; however, a governance dialog will be implemented in the web app in the near future.

<!--
## Tests
The repo has a comprehensive test suite. You can run it with `npm run test`. To run the tests with the RPC logs, use `npm run test gas`.
-->

## Composition of the Repo
The repo is composed as a Truffle project, and is largely idiomatic to Truffle's conventions. The tests are in the `test` directory (need to be updated), the contracts are in the `contracts` directory and the migrations (deployment scripts) are in the `migrations` directory. Furthermore there is a `conf` directory containing JSON files where deployments can be parameterized.

<!--
## Deploying your own TCR
Since [v1.1.0](https://github.com/skmgoldin/tcr/releases/tag/v1.1.0), only the factory contracts are deployed during `truffle migrate`. To deploy a RegistryFactory to any network you can use the NPM scripts in the `package.json`. To deploy to a local Ganache instance, set an environment variable `MNEMONIC` to the mnemonic exposed by Ganache. To spawn proxy contracts using a deployed RegistryFactory, execute the snippet in [/scripts](./scripts) by running:

```
npm run deploy-proxies:[network]
```
-->

## Packages
The repo consumes several EPM packages. `dll` and `attrstore` are libraries used in PLCRVoting's doubly-linked list abstraction. `tokens` provides an ERC20-comaptible token implementation. `plcr-revival` features batched executions for some transactions. All packages are installed automatically when running `npm install`.

