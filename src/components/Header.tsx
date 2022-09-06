import Link from "next/link";
import { useRouter } from "next/router";
import ConnectWallet from "./ConnectWallet";

const menuItems: { name: string; path: string }[] = [
  { name: "home", path: "/" },
  { name: "owned", path: "/owned" },
  { name: "create", path: "/create" },
];
const Header = () => {
  const { pathname } = useRouter();
  return (
    <div className="sticky top-0 shadow-sm p-4 flex items-center mb-4">
      <h1 className="text-xl tracking-widest text-app-primary font-black">NFT MARKETPLACE</h1>
      <div className="flex-1 flex items-center justify-center">
        <nav>
          <ul className="flex">
            {menuItems.map((menuItem) => (
              <li
                key={menuItem.name}
                className={`capitalize mx-2 py-2 px-4 font-semibold ${
                  pathname == menuItem.path
                    ? "bg-app-primary text-white"
                    : "bg-white text-app-primary"
                } rounded-lg`}
              >
                <Link href={menuItem.path}>{menuItem.name}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <ConnectWallet/>
    </div>
  );
};

export default Header;
