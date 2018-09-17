/* global artifacts web3 */
const fs = require('fs');

const RegistryFactory = artifacts.require('RegistryFactory.sol');

const config = JSON.parse(fs.readFileSync('../conf/config.json'));
const paramConfig = config.paramDefaults;

module.exports = (done) => {
  async function deployProxies(networkID) {
    let registryFactoryAddress;
    if (networkID === '1') {
      registryFactoryAddress = '0xcc0df91b86795f21c3d43dbeb3ede0dfcf8dccaf'; // mainnet
    } else if (networkID === '4') {
      registryFactoryAddress = '0x822415a1e4d0d7f99425d794a817d9b823bdcd0c'; // rinkeby
    } else {
      registryFactoryAddress = RegistryFactory.address; // development
    }

    /* eslint-disable no-console */
    console.log(`RegistryFactory:   ${registryFactoryAddress}`);
    console.log('');
    console.log('Deploying proxy contracts...');
    /* eslint-enable no-console */

    const registryFactory = await RegistryFactory.at(registryFactoryAddress);
    const registryReceipt = await registryFactory.newRegistryWithToken(
      config.token.supply,
      config.token.name,
      config.token.decimals,
      config.token.symbol,
      [
        paramConfig.minDeposit,
        paramConfig.pMinDeposit,
        paramConfig.applyStageLength,
        paramConfig.pApplyStageLength,
        paramConfig.commitStageLength,
        paramConfig.pCommitStageLength,
        paramConfig.revealStageLength,
        paramConfig.pRevealStageLength,
        paramConfig.dispensationPct,
        paramConfig.pDispensationPct,
        paramConfig.voteQuorum,
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
