import useSigner from "../state/signer";
import BeatLoader from "react-spinners/BeatLoader";
import Avatar from "./Avatar";

const ConnectWallet = () => {
  const { address, signer, connectWallet, loading } = useSigner();
  if (address) return <Avatar seed={address.toLowerCase()} />;
  return (
    <div>
      <button
        disabled={loading}
        onClick={connectWallet}
        className="border-2 w-44 h-12 border-app-primary rounded-full text-app-primary text-md flex items-center justify-center font-bold hover:bg-app-primary hover:text-white"
      >
        {loading ? <BeatLoader size={8} color="#5A20CB" /> : "Connect Wallet"}
      </button>
    </div>
  );
};

export default ConnectWallet;
