import SocialLinks from "components/SocialLinks";
import StakingBox from "components/StakingBox";

function DeelanceStakingPage() {
  return (
    <div className="sm:min-h-[calc(100vh-var(--navbar-height))] flex flex-col items-center justify-center sm:py-16 relative z-10">
      <div className="sm:max-w-[472px] w-full bg-main-bg">
        <StakingBox />
      </div>

      <div className=" flex items-center space-x-2 xl:space-x-3 text-[80%] lg:text-[100%] mt-8">
        <SocialLinks />
      </div>

      <img
        src="/images/dee-coin.png"
        className="top-1/2 right-[10%] lg:-translate-y-1/2 max-w-[20rem] lg:max-w-none mt-12 lg:mt-0 w-[90%] lg:w-[18%] -z-10 static lg:absolute mb-16 sm:mb-0"
        alt=""
      />
      <img
        src="/images/workers.png"
        className="absolute bottom-0 left-[-10rem] h-[80%] -z-10 opacity-80 hidden lg:block"
        alt=""
      />

      {/* 
      <img
        src="/images/bacha-left.png"
        className="opacity-100 absolute top-1/2 -translate-y-1/2 left-0 h-[80vh] w-[40%] object-contain -z-10 hidden sm:block"
        alt=""
      />

      <img
        src="/images/bacha-right.png"
        className="opacity-100 absolute top-1/2 -translate-y-1/2 right-0 h-[80vh] w-[40%] object-contain -z-10 hidden sm:block"
        alt=""
      /> */}
    </div>
  );
}

export default DeelanceStakingPage;
