import NFTCard from "../components/NFTCard";
import useNFTMarket from "../state/nft-market";

const Owned = () => {
  const { ownedNFTs, ownedListedNFTs } = useNFTMarket();
  return (
    <div className="flex w-full flex-col">
      <div className="flex flex-wrap">
        {ownedNFTs?.map((nft: NFT) => (
          <NFTCard key={nft.id} nft={nft} className="mx-auto sm:mx-4 my-2" />
        ))}
      </div>
      {ownedListedNFTs && !!ownedListedNFTs.length && (
        <>
          <div className="border-t-2 my-6 pt-6 px-4">
            <h1 className="text-xl uppercase text-gray-500 font-bold">
              Listed NFTs
            </h1>
          </div>
          <div className="flex flex-wrap">
            {ownedListedNFTs?.map((nft: NFT) => (
              <NFTCard
                key={nft.id}
                nft={nft}
                className="mx-auto sm:mx-4 my-2"
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Owned;
