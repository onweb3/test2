function StakeInputBox() {
  return (
    <div className="h-10 rounded-md overflow-hidden flex bg-[rgba(13,61,35,1)] shadow-[0_.2rem_1rem_rgba(0,0,0,.6)]">
      <div className="bg-[rgba(255,255,255,.2)] flex items-center px-4">
        <p className="text-xs sm:text-sm">$DLANCE</p>
      </div>

      {/*  */}
      <div className="flex-1">
        <input
          type="text"
          className="h-full w-full flex bg-transparent px-4 text-base text-white outline-none border-2 border-transparent focus:border-main-green"
          placeholder="0"
        />
      </div>
      {/*  */}

      <button className="bg-[rgba(255,255,255,.2)] flex items-center px-3 sm:px-4 text-xs sm:text-sm">
        Max
      </button>
    </div>
  );
}

export default StakeInputBox;
