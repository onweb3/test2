import { useCallback, useState } from "react";
import Button from "./Button";
import StakeInputBox from "./StakeInputBox";
import { useContractWrite } from "wagmi";
import {
  CONTRACT_ADDRESS_FLEXIBLE_STAKING,
  FLEXIBLE_STAKING_ABI,
} from "FluidStakingContract";
import { parseUnits } from "viem";
import { TOKEN_DECIMALS } from "GlobalValues";
import { toast } from "react-toastify";
import { TbProgress } from "react-icons/tb";

function UnStake({ userStakedTokens = "0", handleTxWaiting }) {
  /**
   * START : withdraw/unstakeIbat tx - unstakeTokens()
   */
  const [unstakeAmount, setUnstakeAmount] = useState("");

  const { write: sendUnStakeTx, status: unstakeTx_status } = useContractWrite({
    address: CONTRACT_ADDRESS_FLEXIBLE_STAKING,
    abi: FLEXIBLE_STAKING_ABI,
    functionName: "withdraw",
    args: [parseUnits(`${unstakeAmount}`, TOKEN_DECIMALS)],
    onSuccess(data) {
      console.log(`TxHash : ${data.hash}`);
      console.log("Success - flexible staking\n", data);
      handleTxWaiting(data.hash, "unstake");
      console.log(`✅staked tx sent`);
    },
    onError(err) {
      console.error(err);
      console.error(`❌ tx"deposit" failed" `);
    },
  });

  const unstakeTokens = useCallback(() => {
    let withdrawAmount = unstakeAmount;
    if (!unstakeAmount) {
      toast.warn("Unstaking Amount is Empty!", {
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
      console.log(`❌Unstaked`);
      return;
    }

    if (Number(withdrawAmount) > Number(userStakedTokens)) {
      toast.warn(
        `( ${Number(
          unstakeAmount
        ).toLocaleString()} )Unstaking amount can't be greater than ( ${userStakedTokens} ) staked amount`,
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
      console.log(`❌Unstaked`);
      return;
    }
    sendUnStakeTx();
  }, [unstakeAmount, userStakedTokens, sendUnStakeTx]);

  /**
   * END : withdraw/unstakeIbat tx - unstakeTokens()
   */

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm opacity-80">Amount</p>
        <p className="text-sm opacity-80">
          Staked DLANCE: {Number(userStakedTokens).toLocaleString()}
        </p>
      </div>

      <div>
        <StakeInputBox
          setValue={setUnstakeAmount}
          value={unstakeAmount}
          maxBalToSet={userStakedTokens}
        />
        {/* <p className="text-sm mt-3 font-light opacity-0">
          Min Stake Amount: 800 DLANCE
        </p> */}
      </div>

      <div className="text-[90%] mt-6 mb-10">
        <Button
          variant={0}
          className={`w-full ${
            unstakeTx_status?.toUpperCase() === "LOADING"
              ? "cursor-not-allowed"
              : ""
          }`}
          onClick={() => unstakeTokens()}
          disabled={unstakeTx_status?.toUpperCase() === "LOADING"}
          style={{
            filter: `grayscale(${
              unstakeTx_status?.toUpperCase() === "LOADING" ? "1" : "0"
            })`,
          }}
        >
          {unstakeTx_status?.toUpperCase() === "LOADING" ? (
            <TbProgress
              style={{
                animation: "icon-spin 1s infinite linear",
                height: "1.5rem",
                width: "100%",
              }}
            />
          ) : (
            "UNSTAKE $DLANCE "
          )}
        </Button>
      </div>
    </div>
  );
}

export default UnStake;
