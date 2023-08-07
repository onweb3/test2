export const isTestnet = !true;
console.log(`isTestnet : ${isTestnet ? "✅YES" : "❌NO"}`);
export const TOKEN_SYMBOL = isTestnet ? "IBAT" : "DLANCE"; // Token Symbol
export const TOKEN_DECIMALS = isTestnet ? "9" : "18"; // Token Decimals
export const TOKEN_CONTRACT_ADDRESS_ETH = isTestnet
  ? "0x19cd9B8e42d4EF62c3EA124110D5Cfd283CEaC43" //Token Address on BSC-test
  : "0x7D60dE2E7D92Cb5C863bC82f8d59b37C59fC0A7A"; //Token Address on ETH-main

export const BLOCK_SCANLINK = isTestnet
  ? "https://bscscan.com/tx/"
  : "https://etherscan.io/tx/";

export const USDT_CONTRACT_ADDRESS = isTestnet
  ? "0x55d398326f99059fF775485246999027B3197955"
  : "0xdAC17F958D2ee523a2206206994597C13D831ec7";
/**
 * START - common allowance
 * Common allowance ABI of DLANCE contract address for staking
 */
export const DLANCE_ABI_allowance = [
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];
/**
 * END - common allowance
 */
export const DLANCE_ABI_approve = [
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];
