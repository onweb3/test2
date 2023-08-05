import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { WagmiConfig } from "wagmi";
import { chains, config, web3modalClient } from "initwagmi.js";
import { Web3Modal } from "@web3modal/react";
import { EthereumClient } from "@web3modal/ethereum";

const ethereumClient = new EthereumClient(web3modalClient, chains);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <App />
    </WagmiConfig>
    <Web3Modal
      projectId={import.meta.env.VITE_walletConnectProjectId}
      ethereumClient={ethereumClient}
    />
  </React.StrictMode>
);
