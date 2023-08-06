import Button from "./Button";
import StakeInputBox from "./StakeInputBox";

function UnStake({ userStakedTokens = "0" }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm opacity-80">Amount</p>
        <p className="text-sm opacity-80">
          Staked DLANCE: {Number(userStakedTokens).toLocaleString()}
        </p>
      </div>

      <div>
        <StakeInputBox />
        {/* <p className="text-sm mt-3 font-light opacity-0">
          Min Stake Amount: 800 DLANCE
        </p> */}
      </div>

      <div className="text-[90%] mt-6 mb-10">
        <Button variant={0} className="w-full">
          UNSTAKE $DLANCE
        </Button>
      </div>
    </div>
  );
}

export default UnStake;
