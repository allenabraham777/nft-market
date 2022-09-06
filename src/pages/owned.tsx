import NFTCard from "../components/NFTCard";
import useNFTMarket from "../state/nft-market";

const Owned = () => {
  const { ownedNFTs } = useNFTMarket();
  return (
    <div className="flex w-full flex-col">
      <div className="flex flex-wrap">
        {ownedNFTs?.map((nft: NFT) => (
          <NFTCard key={nft.id} nft={nft} className="mx-auto sm:mx-4 my-2"/>
        ))}
      </div>
    </div>
  );
};

export default Owned;
