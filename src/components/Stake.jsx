import { useCallback, useEffect, useState } from "react";
import Button from "./Button";
import StakeInputBox from "./StakeInputBox";
import { TbProgress, TbReload } from "react-icons/tb";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
} from "wagmi";
import { DLANCE_ABI_approve, TOKEN_DECIMALS, TOKEN_SYMBOL } from "GlobalValues";
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

  const { isConnected, address: userAddress } = useAccount();
  const { chain } = useNetwork();
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

  const { write: sendStakeTx, status: stakeTx_status } = useContractWrite({
    address: CONTRACT_ADDRESS_FLEXIBLE_STAKING,
    abi: FLEXIBLE_STAKING_ABI,
    functionName: "deposit",
    args: [parseUnits(`${stakeAmount}`, TOKEN_DECIMALS)],
    onSuccess(data) {
      console.log(`TxHash : ${data.hash}`);
      console.log("Success - flexible staking\n", data);
      handleTxWaiting(data.hash, "stake");
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

  /**
   * START - compoundRewardsTimer()
   */
  const { refetch: timeLeft_refetch } = useContractRead({
    address: CONTRACT_ADDRESS_FLEXIBLE_STAKING,
    abi: FLEXIBLE_STAKING_ABI,
    functionName: "compoundRewardsTimer",
    enabled: false,
    chainId: chain?.id,
    args: [userAddress],
    onSuccess(data) {
      function convertHMS(value) {
        const sec = parseInt(value, 10); // convert value to number if it's string
        let hours = Math.floor(sec / 3600); // get hours
        let minutes = Math.floor((sec - hours * 3600) / 60); // get minutes
        let seconds = sec - hours * 3600 - minutes * 60; //  get seconds
        // add 0 if value < 10; Example: 2 => 02
        if (hours < 10) {
          hours = "0" + hours;
        }
        if (minutes < 10) {
          minutes = "0" + minutes;
        }
        if (seconds < 10) {
          seconds = "0" + seconds;
        }

        if (
          Number(hours) === 0 &&
          Number(minutes) === 0 &&
          Number(seconds) === 0
        ) {
          console.error(`❌ don't have to wait before restaking rewards`);
          return;
        }
        if (Number(hours) === 0 && Number(minutes) === 0) {
          toast.warn(`Time left until restaking : ${seconds} seconds!`, {
            position: "bottom-center",
            autoClose: 1500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            type: "info",
            style: {
              maxWidth: "92vw",
            },
          });
        } else if (Number(hours) === 0 && Number(minutes) > 0) {
          toast.warn(
            `Time left until restaking : ${minutes} min : ${seconds} seconds!!`,
            {
              position: "bottom-center",
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
              type: "info",
              style: {
                maxWidth: "92vw",
              },
            }
          );
        } else {
          toast.warn(
            `Time left until restaking : ${hours} hr :${minutes} min!!!`,
            {
              position: "bottom-center",
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
              type: "info",
              style: {
                maxWidth: "92vw",
              },
            }
          );
        }
        const timeLeft = { hr: hours, min: minutes, sec: seconds };
        return timeLeft;
      }
      convertHMS(data);
    },
  });
  /**
   * END - compoundRewardsTimer()
   */

  /**
   * START : "stakeRewards"
   */
  const { status: stakeRewards_status, write: stakeRewards } = useContractWrite(
    {
      address: CONTRACT_ADDRESS_FLEXIBLE_STAKING,
      abi: FLEXIBLE_STAKING_ABI,
      functionName: "stakeRewards",
      onSuccess(data) {
        console.log(`TxHash : ${data?.hash}`);
        handleTxWaiting(data.hash, "stakeRewards");
        console.log(`✅stakeRewards tx sent`);
      },
      onError(data) {
        // timeLeftForStakingRewards();
        timeLeft_refetch();
        console.error(data);
        console.error(`dev-stakeRewards caught`);
      },
    }
  );

  /**
   * END : "stakeRewards"
   */

  /**
   * START - claimRewards/withdrawRewards
   */
  const { status: claimRewards_status, write: claimRewards } = useContractWrite(
    {
      address: CONTRACT_ADDRESS_FLEXIBLE_STAKING,
      abi: FLEXIBLE_STAKING_ABI,
      functionName: "claimRewards",
      onSuccess(data) {
        console.log(`TxHash : ${data?.hash}`);
        handleTxWaiting(data.hash, "claimRewards");
        console.log(`✅claimRewards tx sent`);
      },
    }
  );

  /**
   * END - claimRewards
   */

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs sm:text-sm opacity-80">Amount</p>
        <p className="text-xs sm:text-sm opacity-80">
          My Balance: {formattedTokenBal} DLANCE
        </p>
      </div>
      <div>
        <StakeInputBox
          setValue={setStakeAmount}
          value={stakeAmount}
          maxBalToSet={dlanceBal?.formatted}
        />
        <p className="text-xs mt-3 font-light">
          Min Stake Amount: {MIN_STAKE_AMOUNT} DLANCE
        </p>
      </div>

      {isConnected ? (
        <>
          <div className="text-[80%] xl:text-[90%] mt-6 mb-10">
            {Number(flexibleAllowance) < MIN_STAKE_AMOUNT ||
            Number(flexibleAllowance) < Number(stakeAmount) ? (
              <div>
                <Button
                  variant={0}
                  className="w-full"
                  onClick={() => approveAllowance()}
                  disabled={enableStaking_isLoading}
                >
                  ADD ALLOWANCE
                </Button>
                <div className="flex justify-between">
                  <p className="text-xs mt-3 font-light text-right">
                    Min allowance required: {MIN_STAKE_AMOUNT} {TOKEN_SYMBOL}
                  </p>
                  <p className="text-xs mt-3 font-light">
                    Allowance left: {Number(flexibleAllowance).toLocaleString()}
                  </p>
                </div>
              </div>
            ) : (
              <Button
                variant={0}
                className="w-full mb-[4.25rem]"
                onClick={() => stakeTokens()}
                disabled={stakeTx_status?.toUpperCase() === "LOADING"}
                style={{
                  filter: `grayscale(${
                    stakeTx_status?.toUpperCase() === "LOADING" ? "1" : "0"
                  })`,
                }}
              >
                {stakeTx_status?.toUpperCase() === "LOADING" ? (
                  <TbProgress
                    style={{
                      animation: "icon-spin 1s infinite linear",
                      height: "1.5rem",
                      width: "100%",
                    }}
                  />
                ) : (
                  `STAKE $DLANCE`
                )}
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
              <Button
                variant={1}
                className={`min-w-[150px] w-full ${
                  !isConnected ||
                  stakeRewards_status?.toUpperCase() === "LOADING"
                    ? "cursor-not-allowed grayscale"
                    : ""
                }`}
                disabled={stakeRewards_status?.toUpperCase() === "LOADING"}
                onClick={() => stakeRewards()}
              >
                {stakeRewards_status?.toUpperCase() === "LOADING" ? (
                  <TbProgress
                    style={{
                      animation: "icon-spin 1s infinite linear",
                      height: "1.5rem",
                      width: "100%",
                    }}
                  />
                ) : (
                  `RE-INVEST REWARDS`
                )}
              </Button>
            </div>

            <button
              className={`w-fit text-center text-sm font-bold underline mx-auto flex ${
                !isConnected || claimRewards_status?.toUpperCase() === "LOADING"
                  ? "cursor-not-allowed grayscale"
                  : ""
              }`}
              disabled={claimRewards_status?.toUpperCase() === "LOADING"}
              onClick={() => claimRewards()}
            >
              {claimRewards_status?.toUpperCase() === "LOADING" ? (
                <TbProgress
                  style={{
                    animation: "icon-spin 1s infinite linear",
                    height: "1.5rem",
                    width: "100%",
                  }}
                />
              ) : (
                `Withdraw Rewards`
              )}
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default Stake;
