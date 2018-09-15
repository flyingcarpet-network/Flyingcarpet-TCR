pragma solidity ^0.4.11;

import "tokens/eip20/EIP20Interface.sol";
import "./Parameterizer.sol";
import "zeppelin/math/SafeMath.sol";
import "./StandardBountiesInterface.sol";

contract Registry {

    // ------
    // EVENTS
    // ------

    event _Submission(uint indexed listingId, uint indexed bountyId, string data, address indexed applicant);
    event _ListingFulfilled(uint indexed bountyId, uint indexed _fulfillmentId);

    using SafeMath for uint;

    struct Listing {
        address owner;          // Initial submitter of listing
        uint bountyId;      // The issue number of the bounty corresponding to this listing
    }

    // Array of listings
    Listing[] public listings;

    // Global Variables
    EIP20Interface public token;
    Parameterizer public parameterizer;
    string public name;

    // Bounties Variables
    address public standardBountiesAddress;
    StandardBountiesInterface standardBounties;

    /**
    @dev Initializer. Can only be called once.
    @param _token The address where the ERC20 token contract is deployed
    */
    function init(address _token, address _parameterizer, string _name) public {
        require(_token != 0 && address(token) == 0);
        require(_parameterizer != 0 && address(parameterizer) == 0);

        token = EIP20Interface(_token);
        parameterizer = Parameterizer(_parameterizer);
        name = _name;

        standardBountiesAddress = 0xE6cEb9313F5d21Da736f797bc7ded826307b55A8;
        standardBounties = StandardBountiesInterface(standardBountiesAddress);
    }

    // --------------------
    // PUBLISHER INTERFACE:
    // --------------------

    /**
    @dev                Allows a user to submit a listing. Takes tokens from user and creates
                        new bounty for listing. Note that the bounty is not active yet.
    @param _data        TCRO opportunity data collection requirements (see schema: https://github.com/Bounties-Network/StandardBounties/blob/master/docs/standardSchemas.md)
    */
    function submit(string _data) external {
        // Sets owner

        address _owner = msg.sender;
         // Initiate bounty (dummy values for now... needs updating)
        uint _bountyId = standardBounties.issueBounty(
            this,
            2528821098, // 2050, this should be controlled by governance mechanism...
            _data,
            parameterizer.get("stakingPoolSize"),
            0x0, // Need to update
            true,
            address(token)
        );

        // Add listing to listings array
        Listing memory listing = Listing(_owner, _bountyId);
        listings.push(listing);

        emit _Submission((listings.length - 1), _bountyId, _data, msg.sender);
    }

    /**
    @dev                  Allows a user to request assessment of a listing (bounty) fulfillment. The
                          assessment is handled by a bounty stakers governance mechanism.
    @param _bountyId  Number of the bounty to check the fulfillment against
    @param _fulfillmentId Id of the fulfillment to assess
    */

    function assessFulfillment(uint _bountyId, uint _fulfillmentId) external {

        // TODO: Implement PLCRVoting for bounty stakeholders to vote on fulfillment acceptance...

        // Accept fulfillment
        // standardBounties.acceptFulfillment(
        //     _bountyId,
        //     _fulfillmentId
        // );

        // emit _ListingFulfilled(_bountyId, _fulfillmentId);
    }

    // --------
    // GETTERS:
    // --------

    /**
    @dev                Returns the balance of the bounty associated with a specific listing number
    @param _listingId The number of the listing who's balance to return
    */
    function getBountyBalance(uint _listingId) view public returns (uint bal) {
        (,,,,,uint balance) = standardBounties.getBounty(listings[_listingId].bountyId);
        return balance;
    }

    /**
    @dev                Returns the data of the bounty associated with a specific listing number
    @param _listingId The number of the listing who's data to return
    */
    function getBountyData(uint _listingId) view public returns (string data) {
        return standardBounties.getBountyData(listings[_listingId].bountyId);
    }

    /**
    @dev                Returns the total number of items in the listing array
    */
    function getNumBounties() view public returns (uint numListing) {
        return listings.length;
    }
}
