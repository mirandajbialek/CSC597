const { expect } = require("chai");
const { ethers } = require("hardhat");
const { parseEther } = require("ethers");

describe("Auction", function () {
    let Auction, auction, owner, addr1, addr2;

    beforeEach(async function () {
        Auction = await ethers.getContractFactory("Auction");
        [owner, addr1, addr2] = await ethers.getSigners();
        auction = await Auction.deploy(60 * 10);
        await auction.waitForDeployment();
    });

    it("Should accept higher bids", async function () {
        await auction.connect(addr1).bid({ value: parseEther("0.0001") });
        expect(await auction.highestBid()).to.equal(parseEther("0.0001"));
    });

    it("Should not accept lower bids", async function () {
        await auction.connect(addr1).bid({ value: parseEther("0.0001") });
        await expect(
            auction.connect(addr2).bid({ value: parseEther("0.00001") })
        ).to.be.revertedWith("Bid not high enough");
    });

    it("Should allow withdrawal of overbids", async function () {
        await auction.connect(addr1).bid({ value: parseEther("0.0001") });
        await auction.connect(addr2).bid({ value: parseEther("0.0002") });

        const initialBalance = await ethers.provider.getBalance(addr1.address);
        await auction.connect(addr1).withdraw();

        const finalBalance = await ethers.provider.getBalance(addr1.address);
        expect(finalBalance).to.be.above(initialBalance);
    });

    it("Should transfer funds to owner after auction ends", async function () {
        await auction.connect(addr1).bid({ value: parseEther("0.0001") });

        await network.provider.send("evm_increaseTime", [60 * 11]);
        await auction.endAuction();

        const ownerBalance = await ethers.provider.getBalance(owner.address);
        expect(ownerBalance).to.be.above(parseEther("99.0001")); 
    });
});
