import { Contract, ContractReceipt } from "ethers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const TOKEN_URI = "https://sample-token.uri/";

describe("NFTMarket", () => {
  let nftMarket: Contract;
  let signers: SignerWithAddress[];

  before("Deploy the contract", async () => {
    // Deploy NFTMarket contract
    const NFTMarket = await ethers.getContractFactory("NFTMarket");
    nftMarket = await NFTMarket.deploy();
    await nftMarket.deployed();
    signers = await ethers.getSigners();
  });

  const createNFT = async () => {
    const transaction = await nftMarket.createNFT(TOKEN_URI);
    const receipt = await transaction.wait();
    const tokenId: string = receipt?.events?.[0]?.args?.tokenId;
    return tokenId;
  };

  const createAndListNFT = async (price: number) => {
    const tokenId = await createNFT();
    const transaction = await nftMarket.listNFT(tokenId, price);
    await transaction.wait();
    return tokenId;
  };

  describe("Create NFT", () => {
    it("Create NFT and check ownership", async () => {
      // Call createNFT
      const transaction = await nftMarket.createNFT(TOKEN_URI);
      const receipt = await transaction.wait();
      const tokenId = receipt?.events?.[0]?.args?.tokenId;
      const mintedTokenURI = await nftMarket.tokenURI(tokenId);
      expect(mintedTokenURI).to.equal(TOKEN_URI);

      // Ownership
      const ownerAddress = await nftMarket.ownerOf(tokenId);
      const signerAddress = await signers[0].getAddress();

      expect(ownerAddress).to.equal(signerAddress);

      // Nft transfer event
      const args = receipt?.events?.[1]?.args;
      expect(args.tokenId).to.equal(tokenId);
      expect(args.from).to.equal(ethers.constants.AddressZero);
      expect(args.to).to.equal(ownerAddress);
      expect(args.tokenURI).to.equal(TOKEN_URI);
      expect(args.price).to.equal(0);
    });
  });

  describe("List NFT", () => {
    it("Revert if price is zero", async () => {
      const tokenId = await createNFT();
      const transaction = nftMarket.listNFT(tokenId, 0);
      await expect(transaction).to.be.revertedWith(
        "NFTMarket: NFT price must be greater than 0"
      );
    });

    it("Revert if not called by NFT owner", async () => {
      const tokenId = await createNFT();
      const transaction = nftMarket.connect(signers[1]).listNFT(tokenId, 1);
      await expect(transaction).to.be.revertedWith(
        "ERC721: caller is not token owner nor approved"
      );
    });

    it("List token for sale", async () => {
      const tokenId = await createNFT();
      const price = 2;
      const transaction = await nftMarket.listNFT(tokenId, price);
      const receipt = await transaction.wait();
      // NFT Ownership was transferred to house
      const ownerAddress = await nftMarket.ownerOf(tokenId);
      expect(ownerAddress).to.be.equal(nftMarket.address);

      // NFTTransfer event
      const args = receipt.events[2].args;
      expect(args.tokenId).to.equal(tokenId);
      expect(args.from).to.equal(signers[0].address);
      expect(args.to).to.equal(nftMarket.address);
      expect(args.tokenURI).to.equal("");
      expect(args.price).to.equal(price);
    });
  });

  describe("Buy NFT", () => {
    it("Revert if NFT not listed", async () => {
      const transaction = nftMarket.buyNFT(9999);
      await expect(transaction).to.be.revertedWith(
        "NFTMarket: NFT not listed in market for sale"
      );
    });

    it("Revert if NFT price != buy price", async () => {
      const tokenId = await createAndListNFT(111);
      const transaction = nftMarket.buyNFT(tokenId, { value: 222 });
      await expect(transaction).to.be.revertedWith(
        "NFTMarket: Incorrect price"
      );
    });

    it("Transfer ownership to buyer and send money to sender", async () => {
      const tokenId = await createAndListNFT(100);
      await new Promise((r) => setTimeout(r, 100));
      const oldHouseBalance = await nftMarket.provider.getBalance(
        nftMarket.address
      );
      const oldBalance = await signers[0].getBalance();
      const transaction = await nftMarket
        .connect(signers[1])
        .buyNFT(tokenId, { value: 100 });
      const receipt = await transaction.wait();

      await new Promise((r) => setTimeout(r, 100));
      const newBalance = await signers[0].getBalance();
      const newHouseBalance = await nftMarket.provider.getBalance(
        nftMarket.address
      );

      // 95% transfer is done
      const diff = newBalance.sub(oldBalance);
      expect(diff).to.be.equal(95);

      // 5% transfer is done to house
      const diffHouse = newHouseBalance.sub(oldHouseBalance);
      expect(diffHouse).to.be.equal(5);

      // NFT Ownership was transferred
      const ownerAddress = await nftMarket.ownerOf(tokenId);
      expect(ownerAddress).to.be.equal(signers[1].address);

      // NFT Transfer event
      const args = receipt.events[2].args;
      expect(args.tokenId).to.equal(tokenId);
      expect(args.from).to.equal(nftMarket.address);
      expect(args.to).to.equal(signers[1].address);
      expect(args.tokenURI).to.equal("");
      expect(args.price).to.equal(0);
    });
  });

  describe("Cancel Listing", () => {
    it("Revert if NFT is not listed", async () => {
      const transaction = nftMarket.cancelListing(999);
      await expect(transaction).to.be.revertedWith(
        "NFTMarket: NFT not listed in market for sale"
      );
    });

    it("Revert if caller is not seller", async () => {
      const tokenId = await createAndListNFT(100);
      const transaction = nftMarket.connect(signers[1]).cancelListing(tokenId);
      await expect(transaction).to.be.revertedWith(
        "NFTMarket: You're not the seller"
      );
    });

    it("Transfer the ownership back to seller", async () => {
      const tokenId = await createAndListNFT(100);
      const transaction = await nftMarket.cancelListing(tokenId);
      const receipt = await transaction.wait();

      // Check ownership
      const ownerAddress = await nftMarket.ownerOf(tokenId);
      expect(ownerAddress).to.be.equal(signers[0].address);

      // NFTTransfer event
      const args = receipt.events[2].args;
      expect(args.tokenId).to.equal(tokenId);
      expect(args.from).to.equal(nftMarket.address);
      expect(args.to).to.equal(signers[0].address);
      expect(args.tokenURI).to.equal("");
      expect(args.price).to.equal(0);
    });
  });

  describe("Withdraw funds", () => {
    it("Revert if caller is not the house", async () => {
      const transaction = nftMarket.connect(signers[1]).withdrawFunds();
      await expect(transaction).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("Should transfer all funds from the contract balance to the house", async () => {
      const contractBalance = await nftMarket.provider.getBalance(
        nftMarket.address
      );
      const oldHouseBalance = await signers[0].getBalance();
      const transaction = await nftMarket.withdrawFunds();
      const receipt = await transaction.wait();

      await new Promise((r) => setTimeout(r, 100));
      const newHouseBalance = await signers[0].getBalance();

      const gasFees = receipt.gasUsed.mul(receipt.effectiveGasPrice);
      const diffHouse = newHouseBalance.add(gasFees).sub(oldHouseBalance);
      expect(diffHouse).to.be.equal(contractBalance);
    });

    it("Revert if contract balance is zero", async () => {
      const transaction = nftMarket.withdrawFunds();
      expect(transaction).to.be.revertedWith("NFTMarket: balance is zero");
    });
  });
});
