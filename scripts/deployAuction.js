async function main() {
    const Auction = await ethers.getContractFactory("Auction");
    console.log("Deploying auction....")
    const biddingTime = 60 * 5;
    const auction = await Auction.deploy(biddingTime)

    await auction.waitForDeployment();
    console.log('Auction deployed to:', await auction.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });