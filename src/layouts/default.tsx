import { ReactNode } from "react";
import Header from "../components/Header";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DefaultLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative flex h-full w-full flex-col pt-20">
      <Header />
      <div className="flex h-full w-full overflow-y-auto overflow-x-hidden px-4">
        {children}
      </div>
      <ToastContainer />
    </div>
  );
};

export default DefaultLayout;
