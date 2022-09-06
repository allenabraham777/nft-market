interface NFT {
  id: string;
  owner: string;
  price: string;
  tokenURI: string;
}

interface CreationValues {
  name: string;
  description: string;
  image?: File;
}
