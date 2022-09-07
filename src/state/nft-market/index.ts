import { Contract, BigNumber } from "ethers";
import axios from "axios";
import NFT_MARKET from "../../../artifacts/contracts/nftMarket.sol/NFTMarket.json";
import useSigner from "../signer";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import useOwnedNFTs from "./useOwnedNFt";
import useOwnedListedNFTs from "./useOwnedListedNFt";
import { NFT_MARKET_ADDRESS } from "./config";
import useListedNFTs from "./useListedNFt";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const useNFTMarket = () => {
  const { signer } = useSigner();
  const nftMarket = new Contract(NFT_MARKET_ADDRESS, NFT_MARKET.abi, signer);
  const router = useRouter();

  const ownedNFTs = useOwnedNFTs();
  const ownedListedNFTs = useOwnedListedNFTs();
  const listedNFTs = useListedNFTs();

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
      toast.success(
        "NFT created successfully, please wait for some time for the NFT to load on your dashboard",
        {
          position: "bottom-right",
          closeOnClick: true,
          pauseOnHover: true,
        }
      );
      router.push("/owned");
    } catch (err) {
      toast.error("NFT creation failed", {
        position: "bottom-right",
        closeOnClick: true,
        pauseOnHover: true,
      });
      console.error(err);
    }
  };

  const listNFT = async (tokenId: string, price: BigNumber) => {
    const transaction: TransactionResponse = await nftMarket.listNFT(
      tokenId,
      price
    );
    await transaction.wait();
    toast.success(
      "NFT listed successfully, the changes will reflect after sometime.",
      {
        position: "bottom-right",
        closeOnClick: true,
        pauseOnHover: true,
      }
    );
  };

  const cancelListing = async (tokenId: string) => {
    const transaction: TransactionResponse = await nftMarket.cancelListing(
      tokenId
    );
    await transaction.wait();
    toast.success(
      "NFT listing cancelled successfully, the changes will reflect after sometime.",
      {
        position: "bottom-right",
        closeOnClick: true,
        pauseOnHover: true,
      }
    );
  };

  const buyNFT = async (nft: NFT) => {
    const transaction: TransactionResponse = await nftMarket.buyNFT(nft.id, {
      value: ethers.utils.parseEther(nft.price),
    });
    await transaction.wait();
    toast.success(
      "NFT transaction completed, the changes will reflect after sometime.",
      {
        position: "bottom-right",
        closeOnClick: true,
        pauseOnHover: true,
      }
    );
    router.push("/owned");
  };

  return {
    createNFT,
    ownedNFTs,
    ownedListedNFTs,
    listedNFTs,
    listNFT,
    cancelListing,
    buyNFT,
  };
};

export default useNFTMarket;
