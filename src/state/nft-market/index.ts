import { Contract } from "ethers";
import axios from "axios";
import NFT_MARKET from "../../../artifacts/contracts/nftMarket.sol/NFTMarket.json";
import useSigner from "../signer";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import useOwnedNFTs from "./useOwnedNFt";

const NFT_MARKET_ADDRESS = process.env.NEXT_PUBLIC_NFT_MARKET_ADDRESS as string;


const useNFTMarket = () => {
  const { signer } = useSigner();
  const nftMarket = new Contract(NFT_MARKET_ADDRESS, NFT_MARKET.abi, signer);
  
  const ownedNFTs = useOwnedNFTs();

  const createNFT = async (values: CreationValues) => {
    try {
      const data = new FormData();
      data.append("name", values.name);
      data.append("description", values.description);
      data.append("image", values.image!);
      const response = await axios.post("/api/nft", data);
      const transaction: TransactionResponse = await nftMarket.createNFT(
        response.data.uri
      );
      await transaction.wait();
    } catch (err) {
      console.error(err);
    }
  };
  return { createNFT, ownedNFTs };
};

export default useNFTMarket;
