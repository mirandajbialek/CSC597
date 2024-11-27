const Auction = await ethers.getContractFactory("Auction");
const auction = await Auction.attach("0xBebace82a5b8182238F53213E7Cd5b6Bb2ac129B");

await auction.bid({ value: ethers.utils.parseEther("0.1") });

const highestBid = await auction.highestBid();
console.log(`Highest Bid: ${ethers.utils.formatEther(highestBid)}`);

await auction.endAuction();
