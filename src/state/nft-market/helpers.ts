import { GetOwnedNFTs_nfts } from "./__generated__/GetOwnedNFTs";
import { ethers } from "ethers";

export const parseRawNFT = (raw: GetOwnedNFTs_nfts): NFT => {
  return {
    id: raw.id,
    owner: raw.price == "0" ? raw.to : raw.from,
    price: raw.price == "0" ? raw.price : ethers.utils.formatEther(raw.price),
    tokenURI: raw.tokenURI,
  };
};