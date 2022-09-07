import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import Web3Modal from "web3modal";

interface SignerContextType {
  signer?: JsonRpcSigner;
  address?: string;
  loading: boolean;
  connectWallet: () => Promise<void>;
}

const SignerContext = createContext<SignerContextType>({} as any);

const useSigner = () => useContext(SignerContext);

export const SignerProvider = ({ children }: { children: ReactNode }) => {
  const [signer, setSigner] = useState<JsonRpcSigner>();
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const web3Modal = new Web3Modal();
    if (web3Modal.cachedProvider) connectWallet();
    window?.ethereum?.on("accountsChanged", () => {
      connectWallet();
      window.location.reload();
    });
  }, []);

  const connectWallet = async () => {
    setLoading(true);
    try {
      const web3Modal = new Web3Modal({ cacheProvider: true });
      const instance = await web3Modal.connect();
      const provider = new Web3Provider(instance);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setSigner(signer);
      setAddress(address);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const value = {
    signer,
    address,
    loading,
    connectWallet,
  };

  return (
    <SignerContext.Provider value={value}>{children}</SignerContext.Provider>
  );
};

export default useSigner;
