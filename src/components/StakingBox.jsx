import { useCallback, useEffect, useState } from "react";
import Stake from "./Stake";
import UnStake from "./UnStake";
import { ConnectButton } from "./ConnectButton";
import {
  mainnet,
  useAccount,
  useBalance,
  useContractRead,
  useNetwork,
  usePublicClient,
  useSwitchNetwork,
} from "wagmi";
import {
  BLOCK_SCANLINK,
  DLANCE_ABI_allowance,
  TOKEN_CONTRACT_ADDRESS_ETH as TOKEN_CONTRACT_ADDRESS,
  TOKEN_CONTRACT_ADDRESS_ETH,
  TOKEN_DECIMALS,
} from "../GlobalValues";
import {
  APY_FLUID_STAKING,
  CONTRACT_ADDRESS_FLEXIBLE_STAKING,
  FLEXIBLE_STAKING_ABI,
} from "FluidStakingContract";
import { toast } from "react-toastify";
import { formatEther, formatUnits } from "viem";
import { FaExternalLinkAlt } from "react-icons/fa";
import Button from "./Button";

function StakingBox() {
  const [tab, setTab] = useState("stake");
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork, isLoading } = useSwitchNetwork({
    chainId: mainnet.id,
  });

  const isOnCorrectChain = chain?.id === mainnet?.id;

  /**
   * START - get Deelance Balance
   */
  const { data: stakeTokenBalance, refetch: refetchTokenBalance } = useBalance({
    address,
    enabled: address ? true : false,
    token: TOKEN_CONTRACT_ADDRESS,
    chainId: chain?.id,
    onSuccess(balData) {
      let bal = Number(balData.formatted).toFixed(2) + "";
      console.log(`💰UserBalance - bal : ${bal}`);
    },
    onError(err) {
      console.error(err);
      console.error(`❌ caught - error in fetching balance`);
    },
  });
  /**
   * END - get Deelance Balance
   */
  /**
   * START : "getDepositInfo"
   * gets total DLANCE tokens [_staked, _rewards]
   */
  const [userStakedTokens, setUserStakedTokens] = useState("0");
  const [userRewards, setUserRewards] = useState("0");

  const {
    data: getDepositInfo_data,
    isFetching: depositInfo_isFetching,
    refetch: getDepositInfo_refetch,
  } = useContractRead({
    address: CONTRACT_ADDRESS_FLEXIBLE_STAKING,
    abi: FLEXIBLE_STAKING_ABI,
    functionName: "getDepositInfo",
    chainId: chain?.id,
    enabled: address ? true : false,
    args: [address],
    onSuccess(data) {
      console.log(`🏦getDepositInfo()`);
      console.log(data);
    },
  });

  const { data: totalStaked, isFetching: isTotalStakedFetching } =
    useContractRead({
      address: CONTRACT_ADDRESS_FLEXIBLE_STAKING,
      abi: FLEXIBLE_STAKING_ABI,
      functionName: "total_staked",
      chainId: chain?.id,
      enabled: address ? true : false,
      watch: true,
    });

  useEffect(() => {
    if (!isConnected || !getDepositInfo_data) {
      setUserRewards("0");
      setUserStakedTokens("0");
      return;
    }
    setUserStakedTokens(
      `${Number(
        Number(formatUnits(getDepositInfo_data[0], TOKEN_DECIMALS)).toFixed(6)
      )}`
    );
    setUserRewards(
      `${Number(
        Number(formatUnits(getDepositInfo_data[1], TOKEN_DECIMALS)).toFixed(6)
      )}`
    );
  }, [getDepositInfo_data, isConnected]);
  /**
   * END : "getDepositInfo"
   * gets total DLANCE tokens [_staked, _rewards]
   */

  /**
   * START : generic tx toasts
   */
  const TxToast = (
    hash,
    title,
    infoMsg = "View Transaction on BlockExplorer",
    type,
    autoClose = false
  ) => {
    return toast(
      <div>
        {title} <br />
        <a
          target="_blank"
          rel="noreferrer"
          href={BLOCK_SCANLINK + hash}
          className="text-[#5685fc] text-sm"
        >
          {infoMsg}
        </a>
      </div>,
      {
        type,
        autoClose: autoClose,
        closeOnClick: false,
      }
    );
  };
  /**
   * END : generic tx toasts
   */
  const [flexibleAllowance, setFlexibleAllowance] = useState(0);
  /**
   * Start - check allowance for staking
   */
  const { refetch: fStaking_refetch } = useContractRead({
    address: TOKEN_CONTRACT_ADDRESS_ETH,
    abi: DLANCE_ABI_allowance,
    functionName: "allowance",
    chainId: chain?.id,
    enabled: address ? true : false,
    args: [address, CONTRACT_ADDRESS_FLEXIBLE_STAKING],
    onSuccess(data) {
      console.log(
        `${Number(data) === 0 ? "❌" : "✅"} allowance : ${formatUnits(
          `${data}`,
          TOKEN_DECIMALS
        )} (converted)`
      );
      if (!isNaN(Number(data))) {
        let t_allowance = Number(formatUnits(`${data}`, TOKEN_DECIMALS));
        setFlexibleAllowance(t_allowance);
      }
      // !isNaN(Number(data)) && setFlexibleAllowance(Number(data) !== 0);
    },
  });

  /**
   * END - check allowance for staking
   */

  /**
   * START : handle waiting for txs
   */
  const publicClient = usePublicClient({ chainId: chain?.id });
  const handleTxWaiting = useCallback(
    (txHash, contractfnName = "approve") => {
      console.log(txHash);
      let infoMsg = "";
      let title = "";

      infoMsg = `View Tx on BlockExplorer`;
      if (contractfnName === "approve") {
        title = `Allowance approval in progress`;
      } else if (contractfnName === "stake") {
        title = `Staking Tx in progress`;
      } else if (contractfnName === "unstake") {
        title = `Un-Staking Tx in progress`;
      } else if (contractfnName === "stakeRewards") {
        title = `Staking rewards in progress`;
      } else if (contractfnName === "claimRewards") {
        title = `Claiming rewards in progress`;
      }

      // info-toast : txHash is in the pool - waiting for tx
      TxToast(txHash, title, infoMsg, "info");
      publicClient
        .waitForTransactionReceipt({
          hash: txHash,
          confirmations: 2,
        })
        .then((data) => {
          if (contractfnName === "approve") {
            title = `Ready to start staking`;
          } else if (contractfnName === "stake") {
            title = `Successfully Staked`;
          } else if (contractfnName === "unstake") {
            title = `Successfully Un-Staked`;
          } else if (contractfnName === "stakeRewards") {
            title = `Rewards Staked Successfully`;
          } else if (contractfnName === "claimRewards") {
            title = `Rewards Claimed Successfully`;
          }

          console.log(`waited for tx`);
          console.log(data);

          // success-toast : txHash is successful
          toast.dismiss();
          TxToast(txHash, title, infoMsg, "success", 3000);
          console.log(`✅-log: ${contractfnName}-TxSuccessful`);
        })
        .catch((err) => {
          console.log(`ERROR waited for tx - type : ${contractfnName}`);
          console.log(err);
          title = "Tx. Failed";
          infoMsg = "Something went wrong";
          TxToast(txHash, title, infoMsg, "error", 3000);
        })
        .finally(() => {
          refetchTokenBalance();
          getDepositInfo_refetch();
          fStaking_refetch();
        });
    },
    [
      publicClient,
      getDepositInfo_refetch,
      refetchTokenBalance,
      fStaking_refetch,
    ]
  );
  /**
   * END : handle waiting for txs
   */

  return (
    <div className="bg-feature-card-border p-2 rounded-lg shadow-[0_0_1rem_rgba(0,0,0,1)] ">
      <div className="border-2 border-main-green-shade-40 rounded-xl pt-6 pb-10 bg-green-radial transition-all duration-300">
        <header className="px-4 sm:px-6 mb-7">
          <h1 className="text-center text-lg sm:text-xl xl:text-2xl mb-3 font-black">
            FLUID STAKING
          </h1>
          {isConnected && isOnCorrectChain ? (
            <p className="text-center font-medium mb-2 text-sm">
              {/* Total $DLANCE in Fluid Staking 476,852,255.89 */}
              Total $DLANCE in Fluid Staking{" "}
              {isTotalStakedFetching
                ? "Fetching..."
                : Number(formatEther(totalStaked, "wei").toString()).toFixed(2)}
            </p>
          ) : null}
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
              {isOnCorrectChain ? (
                <>
                  {tab === "stake" ? (
                    <Stake
                      dlanceBal={stakeTokenBalance}
                      flexibleAllowance={flexibleAllowance}
                      handleTxWaiting={handleTxWaiting}
                      userRewards={userRewards}
                      userStakedTokens={userStakedTokens}
                      getDepositInfo_refetch={getDepositInfo_refetch}
                      depositInfo_isFetching={depositInfo_isFetching}
                    />
                  ) : null}
                  {tab === "unstake" ? (
                    <UnStake
                      handleTxWaiting={handleTxWaiting}
                      dlanceBal={stakeTokenBalance}
                      userStakedTokens={userStakedTokens}
                      getDepositInfo_refetch={getDepositInfo_refetch}
                    />
                  ) : null}
                </>
              ) : (
                <div className="text-[90%]">
                  <Button
                    className="w-full"
                    onClick={() => switchNetwork(mainnet.id)}
                    disabled={isLoading}
                  >
                    Switch Chain to ETH
                  </Button>
                </div>
              )}
            </>
          ) : null}

          <div className="text-[80%] xl:text-[90%] mt-8">
            <ConnectButton />
          </div>

          <a
            href="https://deelance.com/en/academy/tutorials/4R5NryDvOmK9yVJCw6syGr"
            target="_blank"
            className="text-main-green w-fit block mx-auto mt-5 underline"
            rel="noreferrer"
          >
            How to Stake{" "}
            <FaExternalLinkAlt className="inline-block align-middle" />{" "}
          </a>
        </main>
      </div>
    </div>
  );
}

export default StakingBox;
