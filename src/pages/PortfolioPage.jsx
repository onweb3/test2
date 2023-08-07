import {
  CONTRACT_ADDRESS_FLEXIBLE_STAKING,
  FLEXIBLE_STAKING_ABI,
} from "FluidStakingContract";
import {
  TOKEN_CONTRACT_ADDRESS_ETH as TOKEN_CONTRACT_ADDRESS,
  TOKEN_DECIMALS,
  TOKEN_SYMBOL,
  USDT_CONTRACT_ADDRESS,
} from "GlobalValues";
import Button from "components/Button";
import { ConnectButton } from "components/ConnectButton";
import { useEffect, useState } from "react";
import { formatUnits } from "viem";
import { useAccount, useBalance, useContractRead, useNetwork } from "wagmi";

const StatCard = ({ title, heading }) => {
  return (
    <div className="bg-greyDark py-4 xl:py-6 px-6 rounded-xl">
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
      enabled: isConnected ? true : false,
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
    if (!isConnected || !totalStaked_data) {
      setTotalStaked("0");
      return;
    }
    let t = `${Number(
      Number(formatUnits(totalStaked_data, TOKEN_DECIMALS)).toFixed(6)
    )}`;
    if (isNaN(t)) t = 0;
    setTotalStaked(t);
  }, [isConnected, totalStaked_data]);
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

  const {
    data: getDepositInfo_data,
    isFetching: depositInfo_isFetching,
    refetch: getDepositInfo_refetch,
  } = useContractRead({
    address: CONTRACT_ADDRESS_FLEXIBLE_STAKING,
    abi: FLEXIBLE_STAKING_ABI,
    functionName: "getDepositInfo",
    chainId: chain?.id,
    enabled: isConnected ? true : false,
    args: [address],
    onSuccess(data) {
      console.log(data);
      console.log(`✅getDepositInfo()`);
    },
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
  const { data: stakeTokenBalance } = useBalance({
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
  const { data: nativeBalance } = useBalance({
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
            title="Total Staked till date"
            heading={`${Number(totalStaked).toLocaleString()} DLANCE`}
          />
        </div>

        <div
          className={`grid grid-cols-[auto_auto_auto] items-center space-x-5 sm:space-x-8 gap-8`}
        >
          <div className={`text-[70%] sm:text-[80%] xl:text-[90%]`}>
            <Button
              className={`${
                !isConnected ? "cursor-not-allowed grayscale" : ""
              }`}
            >
              Stake Rewards
            </Button>
          </div>
          <button
            className={`underline text-xs sm:text-sm xl:text-base w-fit ${
              !isConnected ? "cursor-not-allowed grayscale" : ""
            }`}
          >
            Withdraw Rewards
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
