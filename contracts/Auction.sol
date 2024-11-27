// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract Auction {
    address public owner;
    uint256 public highestBid;
    address public highestBidder;
    uint256 public auctionEndTime;
    mapping(address => uint256) public bids;
    bool public auctionEnded;

    event NewBid(address indexed bidder, uint256 amount);
    event AuctionEnded(address winner, uint256 amount);

    constructor(uint256 _biddingTime) {
        owner = msg.sender;
        auctionEndTime = block.timestamp + _biddingTime;
    }

    modifier onlyBeforeEnd() {
        require(block.timestamp < auctionEndTime, "Auction already ended");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not auction owner");
        _;
    }

    function bid() external payable onlyBeforeEnd {
        require(msg.value > highestBid, "Bid not high enough");

        if (highestBidder != address(0)){
            // Refund the previous highest bidder immediately TODO put require
            payable(highestBidder).transfer(highestBid);
        }

        highestBid = msg.value;
        highestBidder = msg.sender; //reentrancy attack!!!

        emit NewBid(msg.sender, msg.value);
    }


    function endAuction() external onlyOwner {
        require(!auctionEnded, "Auction already ended");
        require(block.timestamp >= auctionEndTime, "Auction not yet ended");

        auctionEnded = true;
        emit AuctionEnded(highestBidder, highestBid);

        payable(owner).transfer(highestBid);
    }

    function withdraw() external {
        uint256 amount = bids[msg.sender];
        require(amount > 0, "No funds to withdraw");

        bids[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }

}