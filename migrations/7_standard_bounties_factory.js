/* global artifacts */

const StandardBountiesFactory = artifacts.require("../contracts/StandardBountiesFactory.sol");

module.exports = function(deployer) {
  return deployer.deploy(StandardBountiesFactory);
};
