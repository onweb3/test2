import { useCallback, useEffect, useState } from "react";
import Button from "./Button";
import StakeInputBox from "./StakeInputBox";
import { TbReload } from "react-icons/tb";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
} from "wagmi";
import {
  DLANCE_ABI_allowance,
  DLANCE_ABI_approve,
  TOKEN_CONTRACT_ADDRESS_ETH,
  TOKEN_DECIMALS,
  TOKEN_SYMBOL,
} from "GlobalValues";
import {
  CONTRACT_ADDRESS_FLEXIBLE_STAKING,
  FLEXIBLE_STAKING_ABI,
  MIN_STAKE_AMOUNT,
} from "FluidStakingContract";
import { TOKEN_CONTRACT_ADDRESS_ETH as TOKEN_CONTRACT_ADDRESS } from "GlobalValues";
import { toast } from "react-toastify";
import { parseUnits } from "viem";

const StakeCard = ({ title, heading }) => {
  return (
    <div className="text-center space-y-1">
      <p className="text-xs xl:text-sm opacity-80">{title}</p>
      <h1 className="text-base xl:text-lg font-bold">{heading}</h1>
    </div>
  );
};

function Stake({
  dlanceBal,
  flexibleAllowance,
  setFlexibleAllowance,
  handleTxWaiting,
  userRewards,
  userStakedTokens,
  getDepositInfo_refetch,
  depositInfo_isFetching,
}) {
  const [formattedTokenBal, setFormattedTokenBal] = useState("0");
  useEffect(() => {
    let bal = Number(dlanceBal?.formatted).toFixed(2) + "";
    // console.log(`✅ UserBalance - bal : ${bal}`);
    setFormattedTokenBal(Number(bal).toLocaleString());
  }, [dlanceBal]);

  /**
   * Start - check allowance for staking
   */
  const { isConnected, address: userAddress } = useAccount();
  const { chain } = useNetwork();

  const { refetch: fStaking_refetch } = useContractRead({
    address: TOKEN_CONTRACT_ADDRESS_ETH,
    abi: DLANCE_ABI_allowance,
    functionName: "allowance",
    chainId: chain?.id,
    enabled: isConnected ? true : false,
    args: [userAddress, CONTRACT_ADDRESS_FLEXIBLE_STAKING],
    onSuccess(data) {
      console.log(`${Number(data) === 0 ? "❌" : "✅"} allowance : ${data}`);
      !isNaN(Number(data)) && setFlexibleAllowance(Number(data) !== 0);
    },
  });

  /**
   * END - check allowance for staking
   */

  /**
   * START - enable staking - allowance
   */
  const { isLoading: enableStaking_isLoading, write: enableStaking } =
    useContractWrite({
      address: TOKEN_CONTRACT_ADDRESS,
      abi: DLANCE_ABI_approve,
      functionName: "approve",
      args: [
        CONTRACT_ADDRESS_FLEXIBLE_STAKING,
        "10000000000000000000000000000",
      ],
      onSuccess(data) {
        console.log(data);
        console.log(`✅ tx sent : "approve"\n${data.hash}`);
        handleTxWaiting(data.hash, "approve");
      },
    });
  const approveAllowance = useCallback(() => {
    if (!chain) return;
    enableStaking();
  }, [enableStaking, chain]);

  /**
   * END - enable staking - allowance
   */

  /**
   * START : Stake Tokens - stakeTokens()
   */
  const [stakeAmount, setStakeAmount] = useState("");

  const { write: sendStakeTx } = useContractWrite({
    address: CONTRACT_ADDRESS_FLEXIBLE_STAKING,
    abi: FLEXIBLE_STAKING_ABI,
    functionName: "deposit",
    args: [parseUnits(`${stakeAmount}`, TOKEN_DECIMALS)],
    onSuccess(data) {
      console.log(`TxHash : ${data.hash}`);
      console.log("Success - flexible staking\n", data);
      handleTxWaiting(data.hash, "deposit");
      console.log(`✅staked tx sent`);
    },
    onError(err) {
      console.error(err);
      console.error(`❌ tx"deposit" failed" `);
    },
  });

  const stakeTokens = useCallback(() => {
    let depositAmount = stakeAmount;
    if (!stakeAmount) {
      toast.warn("Staking Amount is Empty!", {
        position: "bottom-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        style: {
          maxWidth: "92vw",
        },
      });
      console.log(`❌staked`);
      return;
    }
    if (depositAmount < MIN_STAKE_AMOUNT) {
      toast.warn(`Minimum stake Amount: ${MIN_STAKE_AMOUNT} ${TOKEN_SYMBOL}`, {
        position: "bottom-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        style: {
          maxWidth: "92vw",
        },
      });
      console.log(`❌staked`);
      return;
    }

    if (Number(depositAmount) > Number(dlanceBal?.formatted)) {
      toast.warn(
        `( ${Number(
          stakeAmount
        ).toLocaleString()} )Staking Amount can't be greater than your balance ( ${formattedTokenBal} )`,
        {
          position: "bottom-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          style: {
            maxWidth: "92vw",
          },
        }
      );
      console.log(`❌staked`);
      return;
    }
    sendStakeTx();
  }, [dlanceBal, stakeAmount, formattedTokenBal, sendStakeTx]);
  /**
   * END : Stake Tokens - stakeTokens()
   */

  return (
    <div>
      {/* <p className="text-center mb-5">Balance: 0.000 DLANCE</p> */}

      <div className="flex items-center justify-between mb-3">
        <p className="text-xs sm:text-sm opacity-80">Amount</p>
        <p className="text-xs sm:text-sm opacity-80">
          My Balance: {formattedTokenBal} DLANCE
        </p>
      </div>

      <div>
        <StakeInputBox setValue={setStakeAmount} value={stakeAmount} />
        <p className="text-xs sm:text-sm mt-3 font-light">
          Min Stake Amount: {MIN_STAKE_AMOUNT} DLANCE
        </p>
      </div>
      {isConnected ? (
        <>
          <div className="text-[80%] xl:text-[90%] mt-6 mb-10">
            {flexibleAllowance ? (
              <Button
                variant={0}
                className="w-full"
                onClick={() => stakeTokens()}
              >
                STAKE $DLANCE
              </Button>
            ) : (
              <Button
                variant={0}
                className="w-full"
                onClick={() => approveAllowance()}
                disabled={enableStaking_isLoading}
              >
                ENABLE ALLOWNACE
              </Button>
            )}
          </div>

          <div>
            <button className="w-fit flex items-center space-x-2 mx-auto mb-6">
              <span>My Rewards</span>
              <TbReload
                style={{
                  animation: depositInfo_isFetching
                    ? "icon-spin 1s infinite linear"
                    : "",
                }}
                onClick={() => getDepositInfo_refetch()}
              />
            </button>

            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              <StakeCard
                title="Total Staked Amount"
                heading={`${Number(userStakedTokens).toLocaleString()} DLANCE`}
              />
              <StakeCard
                title="Total Rewards"
                heading={`${Number(userRewards).toLocaleString()} DLANCE`}
              />
            </div>

            <div className="text-[80%] xl:text-[90%] mt-4 mb-8">
              <Button variant={1} className="w-full">
                RE-INVEST REWARDS
              </Button>
            </div>

            <button className="w-fit text-center text-sm font-bold underline mx-auto flex">
              Withdraw Rewards
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default Stake;
