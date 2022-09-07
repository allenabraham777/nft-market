import type { NextPage } from "next";
import Head from "next/head";
import NFTCard from "../components/NFTCard";
import useNFTMarket from "../state/nft-market";
import useSigner from "../state/signer";

const Home: NextPage = () => {
  const { listedNFTs } = useNFTMarket();
  const { signer } = useSigner();

  if (!signer) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center font-semibold text-2xl">
        Connect your wallet
      </div>
    );
  }

  if (!listedNFTs?.length) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center font-semibold text-2xl">
        Nothing to show here...
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col">
      <Head>
        <title>NFT Marketplace</title>
        <meta
          name="description"
          content="An NFT Marketplace over Rinkeby Network"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-wrap">
        {listedNFTs?.map((nft: NFT) => (
          <NFTCard key={nft.id} nft={nft} className="mx-auto sm:mx-4 my-2" />
        ))}
      </div>
    </div>
  );
};

export default Home;
