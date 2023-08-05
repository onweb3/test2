import { LiaHandHoldingUsdSolid } from "react-icons/lia";
import Button from "./Button";
import { Link } from "react-router-dom";
import { BiWallet } from "react-icons/bi";
import { useAccount } from "wagmi";

function Navbar() {
  const { isConnected } = useAccount();
  return (
    <nav
      className={`grid grid-cols-[auto_auto] sm:grid-cols-[${
        isConnected ? "auto_1fr_auto" : "auto_auto"
      }] items-center gap-6 px-6 sm:px-10 bg-greyDark py-5 sm:py-0 sm:h-navbar-height justify-between z-[200] justify-items-end`}
    >
      <Link to="/">
        <img
          src="/images/logo.svg"
          className="h-6 sm:h-7 xl:h-9 relative bottom-1 lg:mr-12 xl:mr-16"
          alt="deelance.com deelance"
        />
      </Link>

      {/* <div className="hidden sm:block"></div> */}

      <div
        className={`row-start-2 sm:row-start-auto col-span-2 sm:col-span-1 ${
          isConnected ? "flex " : "hidden"
        } space-x-4 text-[67%] sm:text-[80%] xl:text-[100%]`}
      >
        <Button
          to=""
          as={Link}
          variant={1}
          className="w-full justify-start px-[1em] h-[2.7em] font-medium text-[1em] rounded-[.4em] border-main-green-shade-40 hover:bg-main-green-shade-40 hover:text-main-green space-x-[.6em]"
        >
          <LiaHandHoldingUsdSolid className="text-[1.6em]" />
          <span>Staking</span>
        </Button>

        <Button
          to="portfolio"
          as={Link}
          variant={1}
          className="w-full justify-start px-[1.1em] h-[2.7em] font-medium text-[1em] rounded-[.4em] border-main-green-shade-40 hover:bg-main-green-shade-40 hover:text-main-green space-x-[.7em]"
        >
          <BiWallet className="text-[1.4em]" />
          <span className="whitespace-nowrap">My Portfolio</span>
        </Button>
      </div>

      <Button
        colorClassName="bg-black"
        className="text-[64%] lg:text-[70%] xl:text-[86%] cursor-pointer"
      >
        BUY $DLANCE
      </Button>
    </nav>
  );
}

export default Navbar;
