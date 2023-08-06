import { useState } from "react";
import Stake from "./Stake";
import UnStake from "./UnStake";
import { ConnectButton } from "./ConnectButton";
import { useAccount, useBalance, useNetwork } from "wagmi";
import { TOKEN_CONTRACT_ADDRESS_ETH as TOKEN_CONTRACT_ADDRESS } from "../GlobalValues";
import { APY_FLUID_STAKING } from "FluidStakingContract";

function StakingBox() {
  const [tab, setTab] = useState("stake");
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  /**
   * START - get Deelance Balance
   */
  const [stakeTokenBalance, setStakeTokenBalance] = useState("0");
  const { data: balData } = useBalance({
    address,
    enabled: address ? true : false,
    token: TOKEN_CONTRACT_ADDRESS,
    chainId: chain?.id,
    onSuccess(balData) {
      let bal = Number(balData.formatted).toFixed(2) + "";
      // console.log(` ✅ UserBalance - bal : ${bal}`);
      // console.log(balData);
      setStakeTokenBalance(Number(bal).toLocaleString());
    },
    onError(err) {
      stakeTokenBalance("0");
      console.error(err);
      console.error(`❌ caught - error in fetching balance`);
    },
  });
  /**
   * END - get Deelance Balance
   */

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
          <p className="text-center font-bold text-sm xl:text-base">
            APY: {APY_FLUID_STAKING}%
          </p>
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
              {tab === "stake" ? <Stake dlanceBal={stakeTokenBalance} /> : null}
              {tab === "unstake" ? (
                <UnStake dlanceBal={stakeTokenBalance} />
              ) : null}
            </>
          ) : null}
          <div className="text-[80%] xl:text-[90%] mt-8">
            <ConnectButton />
          </div>
        </main>
      </div>
    </div>
  );
}

export default StakingBox;
