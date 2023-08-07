import { useWeb3Modal } from "@web3modal/react";
import { useCallback, useEffect, useState } from "react";
import { mainnet } from "wagmi/chains";
import { useAccount } from "wagmi";
import SpinningLoader from "../assets/tadpole.svg";
import chainIconBSC from "../assets/chain_bsc.png";
import chainIconETH from "../assets/chain_eth.svg";
import chainIconUnsupported from "../assets/question.svg";

import { getNetwork } from "@wagmi/core";
import Button from "./Button";

export function ConnectButton() {
  const { isOpen, open, setDefaultChain } = useWeb3Modal();
  const { isConnected, address } = useAccount();
  const { chain } = getNetwork();

  const openWalletConnectModal = useCallback(() => {
    setDefaultChain(mainnet);
    if (isOpen) return;
    open();
  }, [isOpen, open, setDefaultChain]);

  const [currentChainIcon, setCurrentChainIcon] =
    useState(chainIconUnsupported);

  useEffect(() => {
    // changeChainIcon();
    const currentChain = chain?.nativeCurrency?.symbol.toUpperCase();
    if (currentChain === "ETH") {
      setCurrentChainIcon(chainIconETH);
    } else if (currentChain === "BNB") {
      setCurrentChainIcon(chainIconBSC);
    } else {
      setCurrentChainIcon(chainIconUnsupported);
    }
  }, [chain?.nativeCurrency?.symbol]);

  return (
    <Button
      className={`w-full shadow-2xl`}
      onClick={openWalletConnectModal}
      variant={2}
    >
      {isConnected ? (
        // the wallet connected - don't need the modal is open-or-not functionality
        <>
          <img
            src={currentChainIcon}
            alt="animating loader"
            className="w-[20px] pr-1"
          />
          <p>
            {address
              ?.substring(0, 4)
              .concat("...")
              .concat(address?.substring(address.length - 4, address.length))}
          </p>
        </>
      ) : isOpen ? (
        // the wallet is not connected and modal is open
        <>
          <img
            src={SpinningLoader}
            alt="animating loader"
            className="w-[20px]"
          />
          <p>Connecting...</p>
        </>
      ) : (
        <p className="uppercase">Connect Wallet</p>
      )}
    </Button>
  );
}

/**
 * DONE >>> there's a scenario where TOKENS_IN_WALLET > ALLOWANCE FOR STAKING,
 * >>>>>>>>>>>>>>>> in which scenario it'll show as - you can stake coz allowance>0,
 * >>>>>>>>>>>>>>>> but users won't be able to stake coz NOT_ENOUGH_ALLOWANCE
 */
