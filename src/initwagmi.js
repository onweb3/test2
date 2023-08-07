import { w3mConnectors } from "@web3modal/ethereum";
import { createConfig, mainnet, configureChains } from "wagmi";
import { bsc, bscTestnet, polygon } from "wagmi/chains";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { infuraProvider } from "wagmi/providers/infura";

import { publicProvider } from "wagmi/providers/public";
// import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    bsc,
    ...(import.meta.env?.MODE === "development"
      ? [bsc, polygon, bscTestnet]
      : []),
  ],
  [
    // jsonRpcProvider({
    //   rpc: (chain) => {
    //     if (chain.id === 56)
    //       return {
    //         http: import.meta.env.VITE_QUICKNODE_HTTP_PROVIDER_URL_BSC, // 👈 Replace this with your HTTP URL from the previous step
    //       };
    //     else if (chain.id === 1)
    //       return {
    //         http: import.meta.env.VITE_QUICKNODE_HTTP_PROVIDER_URL_ETH, // 👈 Replace this with your HTTP URL from the previous step
    //       };
    //   },
    // }),
    infuraProvider({
      apiKey: import.meta.env.VITE_RPC_PROVIDER_API_ETH,
    }),
    publicProvider(),
  ]
);

export const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "wagmi",
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: "Injected",
        shimDisconnect: true,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
});

export const web3modalClient = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({
    projectId: import.meta.env.VITE_walletConnectProjectId,
    chains,
  }),
  publicClient,
});

export { chains };
