import Navbar from "components/Navbar";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div>
      <div className="sm:fixed z-[100] top-0 left-0 w-full">
        <Navbar />
      </div>

      {/* <div className="fixed z-[100] top-navbar-height left-0 w-[16rem] h-[calc(100%-var(--navbar-height))] bg-greyDark px-6 pt-5">
        <div className="space-y-4">
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
            <span>My Portfolio</span>
          </Button>
        </div>
      </div> */}

      {/* <main className="pt-navbar-height pl-sidebar-width"> */}
      <main className="sm:pt-navbar-height">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
