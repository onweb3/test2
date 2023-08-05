import { useState } from "react";
import Stake from "./Stake";
import UnStake from "./UnStake";
import Button from "./Button";

function StakingBox() {
  const [tab, setTab] = useState("stake");
  const [isConnected, setConnected] = useState(false);

  return (
    <div className="bg-feature-card-border p-2 rounded-lg shadow-[0_0_1rem_rgba(0,0,0,1)]">
      <div className="border-2 border-main-green-shade-40 rounded-xl pt-6 pb-10 bg-green-radial">
        <header className="px-4 sm:px-6 mb-7">
          <h1 className="text-center text-lg sm:text-xl xl:text-2xl mb-3 font-black">
            FLUID STAKING
          </h1>
          <p className="text-center font-medium mb-2 text-sm">
            Total $DLANCE in Fluid Staking 476,852,255.89
          </p>
          <p className="text-center font-bold text-sm xl:text-base">APY: 15%</p>
        </header>

        <div className="mx-auto rounded-full border-1 border-main-green p-1 mb-8 w-[90%] sm:w-[60%] grid grid-cols-2">
          <button
            onClick={() => setTab("stake")}
            className={`text-xs sm:text-sm rounded-full py-1 transition-all duration-200 ${
              tab === "stake"
                ? "bg-main-green-shade-40"
                : "bg-transparent opacity-50 hover:opacity-100"
            }`}
          >
            Stake
          </button>
          <button
            onClick={() => setTab("unstake")}
            className={`text-xs sm:text-sm rounded-full py-1 transition-all duration-200 ${
              tab === "unstake"
                ? "bg-main-green-shade-40"
                : "bg-transparent opacity-50 hover:opacity-100"
            }`}
          >
            Withdraw
          </button>
        </div>

        <main className="px-6 sm:px-10">
          {isConnected ? (
            <>
              {tab === "stake" ? <Stake isConnected={isConnected} /> : null}
              {tab === "unstake" ? <UnStake /> : null}
            </>
          ) : null}

          {!isConnected ? (
            <div className="text-[80%] xl:text-[90%] mt-8">
              <Button
                onClick={() => setConnected(true)}
                variant={2}
                className="w-full shadow-2xl"
              >
                Connect Wallet
              </Button>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}

export default StakingBox;
