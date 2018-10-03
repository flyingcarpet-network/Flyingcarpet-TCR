pragma solidity ^0.4.20;

import "StandardBounties/contracts/StandardBounties.sol";

contract StandardBountiesFactory {

    event NewStandardBounties(address sender, address owner, StandardBounties standardBounties);

    /*
    @dev deploys a new StandardBounties contract.
    @param _owner          the owner address of the new StandardBounties contract to be created
    */
    function newStandardBountiesWithOwner(
        address _owner
    ) public returns (StandardBounties) {
        // Create a new StandardBounties contract
        StandardBounties standardBounties = new StandardBounties(_owner);

        emit NewStandardBounties(msg.sender, _owner, standardBounties);
        return standardBounties;
    }
}
