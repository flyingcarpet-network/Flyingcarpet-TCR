/* global artifacts */

// const StandardToken = artifacts.require('zeppelin/token/StandardToken.sol');
// const Ownable = artifacts.require('zeppelin/ownership/Ownable.sol');
const MintableToken = artifacts.require('./MintableToken.sol');

module.exports = (deployer) => {
  // link libraries
  // deployer.link(StandardToken, MintableToken);
  // deployer.link(Ownable, MintableToken);

  return deployer.deploy(MintableToken);
};
