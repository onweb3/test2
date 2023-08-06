import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { WagmiConfig } from "wagmi";
import { chains, config, web3modalClient } from "initwagmi.js";
import { Web3Modal } from "@web3modal/react";
import { EthereumClient } from "@web3modal/ethereum";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ethereumClient = new EthereumClient(web3modalClient, chains);
const toastStyle = { zIndex: 100000000000000000 };

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <App />
    </WagmiConfig>
    <Web3Modal
      projectId={import.meta.env.VITE_walletConnectProjectId}
      ethereumClient={ethereumClient}
    />
    <ToastContainer
      style={toastStyle}
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />
  </React.StrictMode>
);
