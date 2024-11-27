const { ethers } = require("hardhat");
const { parseEther, formatEther } = require("ethers");
const prompt = require("prompt-sync")();

const CONTRACT_ADDRESS = "0x069d3f0dC56d47f44338bbAb6d514742a8C0f0d4";

async function main() {
    const Auction = await ethers.getContractFactory("Auction");
    const auction = await Auction.attach(CONTRACT_ADDRESS);

    console.log("Connected to Auction contract at:", CONTRACT_ADDRESS);
2
    const highestBid = await auction.highestBid();
    const highestBidder = await auction.highestBidder();
    console.log("Current highest bid:", formatEther(highestBid), "ETH");
    console.log("Highest bidder:", highestBidder || "None");

    while (true) {
        console.log("\n--- Welcome to the Auction! ---");
        console.log("1. Place a Bid");
        console.log("2. View Auction Details");
        console.log("3. End Auction (Owner Only)");
        console.log("4. Exit");

        const choice = prompt("Enter your choice: ");
        switch (choice) {
            case "1": 
                const bidAmount = prompt("Enter your bid amount (in ETH): ");
                await placeBid(auction, bidAmount);
                break;

            case "2": 
                await viewAuctionDetails(auction);
                break;

            case "3": 
                await endAuction(auction);
                break;

            case "4": 
                console.log("Exiting...");
                return;

            default:
                console.log("Invalid choice. Please try again.");
        }
    }
}

async function placeBid(auction, bidAmount) {
    try {
        const [bidder] = await ethers.getSigners();
        const tx = await auction.connect(bidder).bid({
            value: parseEther(bidAmount),
        });
        console.log("Placing bid of", bidAmount, "ETH...");
        await tx.wait();
        console.log("Bid placed successfully!");
    } catch (error) {
        console.error("Failed to place bid:", error.message);
    }
}

async function viewAuctionDetails(auction) {
    try {
        const highestBid = await auction.highestBid();
        const highestBidder = await auction.highestBidder();
        const auctionEndTime = await auction.auctionEndTime();
        const currentTime = BigInt(Math.floor(Date.now() / 1000));

        console.log("\n--- Auction Details ---");
        console.log("Current highest bid:", formatEther(highestBid), "ETH");
        console.log("Highest bidder:", highestBidder || "None");
        console.log("Auction ends in:", (auctionEndTime - currentTime).toString(), "seconds");
    } catch (error) {
        console.error("Failed to fetch auction details:", error.message);
    }
}

async function endAuction(auction) {
    try {
        const [owner] = await ethers.getSigners();
        const tx = await auction.connect(owner).endAuction();
        console.log("Ending auction...");
        await tx.wait();
        console.log("Auction ended successfully!");
    } catch (error) {
        console.error("Failed to end auction:", error.message);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
