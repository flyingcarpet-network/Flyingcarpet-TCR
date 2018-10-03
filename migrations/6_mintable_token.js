/* global artifacts */

const MintableToken = artifacts.require('./MintableToken.sol');

module.exports = (deployer) => {
  return deployer.deploy(MintableToken);
};
