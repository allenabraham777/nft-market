import classNames from "classnames";
import CreationForm from "../screens/Create";
import useNFTMarket from "../state/nft-market";
import useSigner from "../state/signer";

const Create = () => {
  const { signer } = useSigner();
  const {createNFT} = useNFTMarket();

  return (
    <div
      className={classNames("flex h-full w-full flex-col", {
        "items-center justify-center": !signer,
      })}
    >
      {signer ? <CreationForm onSubmit={createNFT} /> : "Connect your wallet"}
    </div>
  );
};

export default Create;
