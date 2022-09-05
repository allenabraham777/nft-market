// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

struct NFTListing {
    uint256 price;
    address seller;
}

contract NFTMarket is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    using SafeMath for uint256;
    Counters.Counter private _tokenIds;
    mapping(uint256 => NFTListing) private _listings;

    // If tokenURI is not empty then an NFT is created
    // If price > 0 then an NFT is listed
    // If price == 0 && tokenURI is empty then an NFT was transferred
    event NFTTransfer(
        uint256 tokenId,
        address from,
        address to,
        string tokenURI,
        uint256 price
    );

    constructor() ERC721("The Abstraction's NFT", "TANFT") {}

    function createNFT(string memory tokenURI) public {
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        _tokenIds.increment();
        emit NFTTransfer(newItemId, address(0), msg.sender, tokenURI, 0);
    }

    // List NFT
    function listNFT(uint256 tokenId, uint256 price) public {
        require(price > 0, "NFTMarket: NFT price must be greater than 0");
        transferFrom(msg.sender, address(this), tokenId);
        _listings[tokenId] = NFTListing(price, msg.sender);
        emit NFTTransfer(tokenId, msg.sender, address(this), "", price);
    }

    // Buy NFT
    function buyNFT(uint256 tokenId) public payable {
        NFTListing memory listing = _listings[tokenId];
        require(
            listing.price > 0,
            "NFTMarket: NFT not listed in market for sale"
        );
        require(msg.value == listing.price, "NFTMarket: Incorrect price");
        ERC721(address(this)).transferFrom(address(this), msg.sender, tokenId);
        payable(listing.seller).transfer(listing.price.mul(95).div(100));
        clearListing(tokenId);
        emit NFTTransfer(tokenId, address(this), msg.sender, "", 0);
    }

    //Cancel Listing
    function cancelListing(uint256 tokenId) public {
        NFTListing memory listing = _listings[tokenId];
        require(
            listing.price > 0,
            "NFTMarket: NFT not listed in market for sale"
        );
        require(
            listing.seller == msg.sender,
            "NFTMarket: You're not the seller"
        );
        ERC721(address(this)).transferFrom(address(this), msg.sender, tokenId);
        clearListing(tokenId);
        emit NFTTransfer(tokenId, address(this), msg.sender, "", 0);
    }

    // Transfer money to house
    function withdrawFunds() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "NFTMarket: balance is zero");
        payable(owner()).transfer(balance);
    }

    // Clear Listing
    function clearListing(uint256 tokenId) private {
        _listings[tokenId].price = 0;
        _listings[tokenId].seller = address(0);
    }
}
