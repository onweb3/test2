import {
  CONTRACT_ADDRESS_FLEXIBLE_STAKING,
  FLEXIBLE_STAKING_ABI,
} from "FluidStakingContract";
import {
  BLOCK_SCANLINK,
  TOKEN_CONTRACT_ADDRESS_ETH as TOKEN_CONTRACT_ADDRESS,
  TOKEN_DECIMALS,
  USDT_CONTRACT_ADDRESS,
} from "GlobalValues";
import Button from "components/Button";
import { ConnectButton } from "components/ConnectButton";
import { useCallback, useEffect, useState } from "react";
import { TbProgress } from "react-icons/tb";
import { toast } from "react-toastify";
import { formatUnits } from "viem";
import {
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePublicClient,
} from "wagmi";

const StatCard = ({ title, heading }) => {
  return (
    <div className="bg-greyDark border-2 border-main-green-shade-30 py-4 xl:py-6 px-6 rounded-xl">
      <h4 className="text-sm xl:text-base font-semibold opacity-60 mb-3 xl:mb-4">
        {title}
      </h4>
      <h1 className="font-bold text-base sm:text-lg xl:text-2xl text-main-green">
        {heading}
      </h1>
    </div>
  );
};

const Row = ({
  img,
  tokenName,
  balance,
  price,
  value,
  type = "Native Token",
}) => {
  return (
    <tr className="[&>*:first-child]:pl-8 [&>*:last-child]:pr-8">
      <td className="py-3 md:py-2">
        <div className="flex items-center space-x-3">
          <div className="min-w-[2.4rem] md:min-w-[3rem] w-[2.4rem] md:w-[3rem] h-[2.4rem] md:h-12 rounded-full bg-black overflow-hidden">
            {img ? (
              <img
                src={img}
                className="w-full h-full bg-cover rounded-full"
                alt=""
              />
            ) : null}
          </div>
          <div>
            <h1 className="text-sm mb-1.5 lh-1">{tokenName}</h1>
            <p className="text-xs opacity-80">{type}</p>
          </div>
        </div>
      </td>
      <td>
        <p className="text-sm text-center">{balance}</p>
      </td>
      <td>
        <p className="text-sm text-center">{price}</p>
      </td>
      <td>
        <p className="text-sm text-center">{value}</p>
      </td>
    </tr>
  );
};

const Wrapper = ({ children }) => {
  return (
    <div className="sm:bg-feature-card sm:py-6 lg:py-8 sm:px-8 lg:px-10 rounded-xl sm:border-2 border-main-green-shade-20">
      {children}
    </div>
  );
};

function PortfolioPage() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  /**
   * START : "total_staked"
   */
  const [totalStaked, setTotalStaked] = useState("0");
  const { data: totalStaked_data, refetch: totalStaked_refetch } =
    useContractRead({
      address: CONTRACT_ADDRESS_FLEXIBLE_STAKING,
      abi: FLEXIBLE_STAKING_ABI,
      functionName: "total_staked",
      chainId: chain?.id,
      // enabled: isConnected ? true : false,
      onSuccess(data) {
        console.log(data);
        console.log(`✅total_staked()`);
      },
      onError(err) {
        console.error(err);
        console.error(`❌caught - total_staked()`);
      },
    });
  useEffect(() => {
    if (!totalStaked_data) {
      setTotalStaked("0");
      return;
    }
    let t = `${Number(
      Number(formatUnits(totalStaked_data, TOKEN_DECIMALS)).toFixed(6)
    )}`;
    if (isNaN(t)) t = 0;
    setTotalStaked(t);
  }, [totalStaked_data]);
  /**
   * END : "total_staked"
   * gets total DLANCE tokens [_staked, _rewards]
   */
  /**
   * START : "getDepositInfo"
   * gets total DLANCE tokens [_staked, _rewards]
   */
  const [userStakedTokens, setUserStakedTokens] = useState("0");
  const [userRewards, setUserRewards] = useState("0");

  const { data: getDepositInfo_data, refetch: getDepositInfo_refetch } =
    useContractRead({
      address: CONTRACT_ADDRESS_FLEXIBLE_STAKING,
      abi: FLEXIBLE_STAKING_ABI,
      functionName: "getDepositInfo",
      chainId: chain?.id,
      enabled: address ? true : false,
      args: [address],
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
   * START - get Deelance Balance
   */
  const { data: stakeTokenBalance, refetch: stakeTokenBalance_refetch } =
    useBalance({
      address,
      enabled: address ? true : false,
      token: TOKEN_CONTRACT_ADDRESS,
      chainId: chain?.id,
      onError(err) {
        console.error(err);
        console.error(`❌ Dlance balance`);
      },
    });
  /**
   * END - get Deelance Balance
   */
  /**
   * START - get Native Balance
   */
  const { data: nativeBalance, refetch: nativeBalance_refetch } = useBalance({
    address,
    enabled: address ? true : false,
    chainId: chain?.id,
    onError(err) {
      console.error(err);
      console.error(`❌ native balance`);
    },
  });
  /**
   * END - get Native Balance
   */
  /**
   * START - get USDT-ETH Balance
   */
  const { data: usdtBalance } = useBalance({
    address,
    enabled: address ? true : false,
    token: USDT_CONTRACT_ADDRESS,
    chainId: chain?.id,
    onError(err) {
      console.error(err);
      console.error(`❌ usdt-eth balance`);
    },
  });
  /**
   * END - get USDT-ETH Balance
   */

  /**
   * COPIED & MODIFIED FROM : StakingBox.jsx
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
   * COPIED & MODIFIED FROM : StakingBox.jsx
   * END : generic tx toasts
   */
  /**
   * COPIED & MODIFIED FROM : StakingBox.jsx
   * START : handle waiting for txs
   */
  const publicClient = usePublicClient({ chainId: chain?.id });
  const handleTxWaiting = useCallback(
    (txHash, contractfnName = "stakeRewards") => {
      console.log(txHash);
      let infoMsg = "";
      let title = "";

      infoMsg = `View Tx on BlockExplorer`;
      if (contractfnName === "stakeRewards") {
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
          if (contractfnName === "stakeRewards") {
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
          totalStaked_refetch();
          nativeBalance_refetch();
          getDepositInfo_refetch();
          stakeTokenBalance_refetch();
        });
    },
    [
      getDepositInfo_refetch,
      nativeBalance_refetch,
      publicClient,
      stakeTokenBalance_refetch,
      totalStaked_refetch,
    ]
  );
  /**
   * * COPIED & MODIFIED FROM : StakingBox.jsx
   * END : handle waiting for txs
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
    args: [address],
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
    <div className="py-8 lg:py-10 px-6 sm:px-8 lg:px-12 space-y-16 sm:space-y-10">
      <Wrapper>
        <h1 className="text-lg xl:text-xl font-bold mb-6">Analytics</h1>

        <div className="grid lg:grid-cols-3 gap-4 lg:gap-6 xl:gap-10 mb-8">
          <StatCard
            title="Active Staked Tokens"
            heading={`${Number(userStakedTokens).toLocaleString()} DLANCE`}
          />
          <StatCard
            title="Active Rewards "
            heading={`${Number(userRewards).toLocaleString()} DLANCE`}
          />
          <StatCard
            title="Globally Staked till date"
            heading={`${Number(totalStaked).toLocaleString()} DLANCE`}
          />
        </div>

        <div className={`flex items-center space-x-2 sm:space-x-8`}>
          <div className={`text-[70%] sm:text-[80%] xl:text-[90%]`}>
            <Button
              className={`min-w-[10em] w-[10em] ${
                !isConnected || stakeRewards_status?.toUpperCase() === "LOADING"
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
                `Stake Rewards`
              )}
            </Button>
          </div>
          <button
            className={`min-w-[150px] underline text-xs sm:text-sm xl:text-base w-fit ${
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
      </Wrapper>

      {isConnected && (
        <Wrapper>
          <h1 className="text-lg xl:text-xl font-bold mb-6">My Assets</h1>

          <div className="overflow-x-auto">
            <table className="min-w-[30rem] sm:min-w-full w-full bg-main-green-shade-20 rounded-2xl overflow-hidden">
              <thead className="h-14 bg-greyDark">
                <tr className="[&>*:first-child]:pl-8 [&>*:last-child]:pr-8 text-sm xl:text-base">
                  <th className="text-left">Token</th>
                  <th>Balance</th>
                  <th>Price</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody className="[&>*:nth-child(even)]:bg-main-green-shade-20">
                <Row
                  img="/images/tokens/dee-black.svg"
                  tokenName={`DLANCE`}
                  balance={`${Number(
                    stakeTokenBalance?.formatted
                  ).toLocaleString()}`}
                  price="$1,845.23"
                  value="$5.64"
                  type="Staking Token"
                />

                <Row
                  img="/images/tokens/eth-circle.svg"
                  tokenName={`${nativeBalance?.symbol.toUpperCase()}`}
                  balance={`${Number(
                    Number(nativeBalance?.formatted).toFixed(6)
                  ).toLocaleString()}`}
                  price="$1,845.23"
                  value="$5.64"
                />

                <Row
                  img="/images/tokens/usdt-circle.svg"
                  tokenName={`${usdtBalance?.symbol.toUpperCase()}`}
                  balance={`${Number(
                    Number(usdtBalance?.formatted).toFixed(6)
                  ).toLocaleString()}`}
                  price="$1,845.23"
                  value="$5.64"
                  type={`${chain?.network.toUpperCase()}-Stablecoin`}
                />
              </tbody>
            </table>
          </div>
        </Wrapper>
      )}
      <div className="flex md:w-1/3 md:ml-auto">
        <ConnectButton />
      </div>
    </div>
  );
}

export default PortfolioPage;
