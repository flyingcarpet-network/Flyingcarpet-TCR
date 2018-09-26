/* global artifacts web3 */
const fs = require('fs');

const RegistryFactory = artifacts.require('RegistryFactory.sol');
const MintableToken = artifacts.require('MintableToken.sol');

const config = JSON.parse(fs.readFileSync('../conf/config.json'));
const paramConfig = config.paramDefaults;

module.exports = (done) => {
  async function deployProxies(networkID) {
    let registryFactoryAddress;
    let mintableTokenAddress;
    if (networkID === '1') {
      registryFactoryAddress = '0xcc0df91b86795f21c3d43dbeb3ede0dfcf8dccaf'; // mainnet
      mintableTokenAddress = ''; // mainnet
    } else if (networkID === '4') {
      registryFactoryAddress = '0x4d48d1b5e5f02dc944b225c7d8a567509eb66ddd'; // rinkeby
      mintableTokenAddress = '0xd27a60f75d5e59a6f8c8fda7346673b6abe93ad1'; // rinkeby
    } else {
      registryFactoryAddress = RegistryFactory.address; // development
      mintableTokenAddress = MintableToken.address; // development
    }

    /* eslint-disable no-console */
    console.log(`RegistryFactory:   ${registryFactoryAddress}`);
    console.log(`MintableToken:   ${mintableTokenAddress}`);
    console.log('');
    console.log('Deploying proxy contracts...');
    /* eslint-enable no-console */

    const registryFactory = await RegistryFactory.at(registryFactoryAddress);
    const registryReceipt = await registryFactory.newRegistryBYOToken(
      mintableTokenAddress,
      [
        paramConfig.stakingPoolSize,
        paramConfig.pMinDeposit,
        paramConfig.pApplyStageLength,
        paramConfig.pCommitStageLength,
        paramConfig.pRevealStageLength,
        paramConfig.pDispensationPct,
        paramConfig.pVoteQuorum,
      ],
      config.name,
    );

    const {
      token,
      plcr,
      parameterizer,
      registry,
    } = registryReceipt.logs[0].args;

    /* eslint-disable no-console */
    console.log('');
    console.log(`Proxy contracts successfully migrated to network_id: ${networkID}`);
    console.log('');
    console.log(`${config.token.name}:          ${token}`);
    console.log(`PLCRVoting:        ${plcr}`);
    console.log(`Parameterizer:     ${parameterizer}`);
    console.log(`Registry:          ${registry}`);
    console.log('');
    /* eslint-enable no-console */

    return true;
  }

  // web3 requires callback syntax. silly!
  web3.version.getNetwork((err, network) => {
    if (err) {
      return done(err); // truffle exec exits if an error gets returned
    }
    return deployProxies(network).then(() => done());
  });
};
