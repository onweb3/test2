import Button from "components/Button";

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

const Row = ({ img, tokenName, balance, price, value }) => {
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
            <p className="text-xs opacity-80">Native Token</p>
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
  return (
    <div className="py-8 lg:py-10 px-6 sm:px-8 lg:px-12 space-y-16 sm:space-y-10">
      <Wrapper>
        <h1 className="text-lg xl:text-xl font-bold mb-6">Analytics</h1>

        <div className="grid lg:grid-cols-3 gap-4 lg:gap-6 xl:gap-10 mb-8">
          <StatCard title="Total Staked" heading="8000 DLANCE" />
          <StatCard title="Total Rewards" heading="266.657 DLANCE" />
          <StatCard title="Withdrawn till date" heading="266.657 DLANCE" />
        </div>

        <div className="flex flex-row items-center space-x-5 sm:space-x-8">
          <div className="text-[70%] sm:text-[80%] xl:text-[90%]">
            <Button>Stake Rewards</Button>
          </div>
          <button className="underline text-xs sm:text-sm xl:text-base w-fit">
            Withdraw Rewards
          </button>
        </div>
      </Wrapper>

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
                tokenName="DLANCE"
                balance="<0.01"
                price="$1,845.23"
                value="$5.64"
              />

              <Row
                img="/images/tokens/eth-circle.svg"
                tokenName="ETH"
                balance="<0.01"
                price="$1,845.23"
                value="$5.64"
              />

              <Row
                img="/images/tokens/usdt-circle.svg"
                tokenName="ETH"
                balance="<0.01"
                price="$1,845.23"
                value="$5.64"
              />
              <Row
                img="/images/tokens/bnb-circle.svg"
                tokenName="BNB"
                balance="<0.01"
                price="$1,845.23"
                value="$5.64"
              />
            </tbody>
          </table>
        </div>
      </Wrapper>
    </div>
  );
}

export default PortfolioPage;
