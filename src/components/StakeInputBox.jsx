function StakeInputBox({ value, setValue, maxBalToSet }) {
  /**
   * START - handleInputAmount
   *
   * e = a numerical value
   * setVal = setter to call
   */
  const handleInputAmount = (e, setVal) => {
    // make sure it exists
    // isNaN will be true for values starting with . so made exception for it
    if (isNaN(e) && e !== ".") {
      return;
    }
    try {
      // read the input value
      e += "";
      let decimalPrecision = 6;

      if (e.includes(".")) {
        let fPart = "";
        let lPart = "";
        fPart = e?.split(".")[0];
        if (`${!typeof e?.split(".")[1]}`.toLowerCase() !== "undefined") {
          lPart = "." + e?.split(".")[1]?.substring(0, decimalPrecision);
        }
        e = fPart + lPart;
      }

      // useCase - when user starts typing in blank field and starts with .
      if (e.length <= 1 && e === ".") {
        e = "0.";
      }
      setVal(e);
    } catch (error) {
      console.error(error);
      console.error(`❌ input error`);
    }
  };
  /**
   * END - handleInputAmount
   */
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
          onChange={(e) => handleInputAmount(e?.target?.value, setValue)}
          value={value}
        />
      </div>
      {/*  */}

      <button
        className="bg-[rgba(255,255,255,.2)] flex items-center px-3 sm:px-4 text-xs sm:text-sm"
        onClick={() => {
          handleInputAmount(maxBalToSet, setValue);
        }}
      >
        Max
      </button>
    </div>
  );
}

export default StakeInputBox;
