import type { NextPage } from "next";
import Head from "next/head";
import NFTCard from "../components/NFTCard";
import useNFTMarket from "../state/nft-market";

const Home: NextPage = () => {
  const { listedNFTs } = useNFTMarket();
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
