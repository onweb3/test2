import { useState } from "react";
import Button from "./Button";
import StakeInputBox from "./StakeInputBox";
import { TbReload } from "react-icons/tb";
import { useAccount, useContractRead, useContractWrite } from "wagmi";
import { TOKEN_CONTRACT_ADDRESS_ETH } from "GlobalValues";
import { CONTRACT_ADDRESS_FLEXIBLE_STAKING } from "FluidStakingContract";
import { TOKEN_CONTRACT_ADDRESS_ETH as TOKEN_CONTRACT_ADDRESS } from "GlobalValues";

const StakeCard = ({ title, heading }) => {
  return (
    <div className="text-center space-y-1">
      <p className="text-xs xl:text-sm opacity-80">{title}</p>
      <h1 className="text-base xl:text-lg font-bold">{heading}</h1>
    </div>
  );
};

function Stake({ dlanceBal }) {
  /**
   * START - common allowance
   * Common allowance ABI of DLANCE contract address for staking
   */
  const ABI_allowance = [
    {
      inputs: [
        { internalType: "address", name: "owner", type: "address" },
        { internalType: "address", name: "spender", type: "address" },
      ],
      name: "allowance",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
  ];
  /**
   * END - common allowance
   */
  /**
   * Start - check allowance for flexible staking
   */
  const { isConnected, address: userAddress } = useAccount();

  const [flexibleAllowance, setFlexibleAllowance] = useState(false);
  const { refetch: fStaking_refetch } = useContractRead({
    address: TOKEN_CONTRACT_ADDRESS_ETH,
    abi: ABI_allowance,
    functionName: "allowance",
    chainId: 1,
    enabled: isConnected ? true : false,
    args: [userAddress, CONTRACT_ADDRESS_FLEXIBLE_STAKING],
    onSuccess(data) {
      !isNaN(Number(data)) && setFlexibleAllowance(Number(data) !== 0);
    },
  });

  /**
   * END - check allowance for locked staking
   */
  // /**
  //  * START - enable staking - allowance
  //  */
  // const ABI_approve = [
  //   {
  //     inputs: [
  //       { internalType: "address", name: "spender", type: "address" },
  //       { internalType: "uint256", name: "amount", type: "uint256" },
  //     ],
  //     name: "approve",
  //     outputs: [{ internalType: "bool", name: "", type: "bool" }],
  //     stateMutability: "nonpayable",
  //     type: "function",
  //   },
  // ];

  // const { isLoading: enableStaking_isLoading, write: enableStaking } =
  //   useContractWrite({
  //     address: TOKEN_CONTRACT_ADDRESS,
  //     abi: ABI_approve,
  //     functionName: "approve",
  //     args: [
  //       CONTRACT_ADDRESS_FLEXIBLE_STAKING,
  //       "10000000000000000000000000000",
  //     ],
  //   });

  // /**
  //  * END - enable staking - allowance
  //  */
  return (
    <div>
      {/* <p className="text-center mb-5">Balance: 0.000 DLANCE</p> */}

      <div className="flex items-center justify-between mb-3">
        <p className="text-xs sm:text-sm opacity-80">Amount</p>
        <p className="text-xs sm:text-sm opacity-80">
          My Balance: {dlanceBal} DLANCE
        </p>
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
            {flexibleAllowance ? (
              <Button variant={0} className="w-full">
                STAKE $DLANCE
              </Button>
            ) : (
              <Button
                variant={0}
                className="w-full"
                // onClick={() => enableStaking()}
                // disabled={enableStaking_isLoading}
              >
                ENABLE ALLOWNACE
              </Button>
            )}
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
