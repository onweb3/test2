import SocialLinks from "components/SocialLinks";
import StakingBox from "components/StakingBox";

function DeelanceStakingPage() {
  return (
    <div className="sm:min-h-[calc(100vh-var(--navbar-height))] flex flex-col items-center justify-start sm:justify-center sm:py-10 relative z-10">
      <div className="sm:max-w-[472px] w-full bg-main-bg">
        <StakingBox />
      </div>

      <div className="mb-16 sm:mb-0 flex items-center space-x-2 xl:space-x-3 text-[80%] lg:text-[100%] mt-8">
        <SocialLinks />
      </div>

      <img
        src="/images/bacha-left.png"
        className="opacity-100 absolute top-1/2 -translate-y-1/2 left-0 h-[80vh] w-[40%] object-contain -z-10 hidden sm:block"
        alt=""
      />

      <img
        src="/images/bacha-right.png"
        className="opacity-100 absolute top-1/2 -translate-y-1/2 right-0 h-[80vh] w-[40%] object-contain -z-10 hidden sm:block"
        alt=""
      />
    </div>
  );
}

export default DeelanceStakingPage;
