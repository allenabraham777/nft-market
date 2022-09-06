import { ReactNode } from "react";
import Header from "../components/Header";

const DefaultLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative flex h-full w-full flex-col pt-20">
      <Header />
      <div className="flex h-full w-full overflow-y-auto overflow-x-hidden px-4">
        {children}
      </div>
    </div>
  );
};

export default DefaultLayout;
