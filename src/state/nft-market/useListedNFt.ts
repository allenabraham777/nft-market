import { gql, useQuery } from "@apollo/client";
import { NFT_MARKET_ADDRESS } from "./config";
import useSigner from "../signer";
import { parseRawNFT } from "./helpers";
import {
  GetListedNFTs,
  GetListedNFTsVariables,
} from "./__generated__/GetListedNFTs";

const useListedNFTs = () => {
  const { address } = useSigner();
  const { data } = useQuery<GetListedNFTs, GetListedNFTsVariables>(
    GET_LISTED_NFTS,
    { variables: { currentAddress: address ?? "" }, skip: !address }
  );

  const ListedNFTs = data?.nfts.map(parseRawNFT);

  return ListedNFTs;
};

const GET_LISTED_NFTS = gql`
  query GetListedNFTs($currentAddress: String!) {
    nfts(
      where: {
        to: "${NFT_MARKET_ADDRESS}"
        from_not: $currentAddress
      }
    ) {
      id
      from
      to
      tokenURI
      price
    }
  }
`;

export default useListedNFTs;
