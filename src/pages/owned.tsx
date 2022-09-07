import NFTCard from "../components/NFTCard";
import useNFTMarket from "../state/nft-market";
import useSigner from "../state/signer";

const Owned = () => {
  const { ownedNFTs, ownedListedNFTs } = useNFTMarket();
  const { signer } = useSigner();

  if (!signer) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center font-semibold text-2xl">
        Connect your wallet
      </div>
    );
  }

  if (!ownedNFTs?.length && !ownedListedNFTs?.length) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center font-semibold text-2xl">
        No NFTs uploaded yet...
      </div>
    );
  }

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
