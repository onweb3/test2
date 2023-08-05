import Button from "./Button";
import StakeInputBox from "./StakeInputBox";
import { TbReload } from "react-icons/tb";

const StakeCard = ({ title, heading }) => {
  return (
    <div className="text-center space-y-1">
      <p className="text-xs xl:text-sm opacity-80">{title}</p>
      <h1 className="text-base xl:text-lg font-bold">{heading}</h1>
    </div>
  );
};

function Stake({ isConnected }) {
  return (
    <div>
      {/* <p className="text-center mb-5">Balance: 0.000 DLANCE</p> */}

      <div className="flex items-center justify-between mb-3">
        <p className="text-xs sm:text-sm opacity-80">Amount</p>
        <p className="text-xs sm:text-sm opacity-80">My Balance: 0.00 DLANCE</p>
      </div>

      <div>
        <StakeInputBox />
        <p className="text-xs sm:text-sm mt-3 font-light">
          Min Stake Amount: 800 DLANCE
        </p>
      </div>
      {isConnected ? (
        <>
          <div className="text-[80%] xl:text-[90%] mt-6 mb-10">
            <Button variant={0} className="w-full">
              STAKE $DLANCE
            </Button>
          </div>

          <div>
            <button className="w-fit flex items-center space-x-2 mx-auto mb-6">
              <span>My Rewards</span>
              <TbReload />
            </button>

            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              <StakeCard title="Total Staked Amount" heading="8000 DLANCE" />
              <StakeCard title="Total Rewards" heading="266.657 DLANCE" />
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
