// file: web/src/constants/networks.ts

import { Network } from "../types/types";

export const networks: Network[] = [
  {
    id: "localhost",
    name: "Autonomys Localhost",
    rpcUrl: "ws://localhost:9944",
    chunkSize: 256 * 1024, // 256 KB
    explorer: "https://subspace.subscan.io",
  },
  {
    id: "autonomys",
    name: "Autonomys Testnet",
    rpcUrl: "wss://rpc-0.gemini-3h.subspace.network/ws",
    chunkSize: 256 * 1024, // 256 KB
    explorer: "https://subspace.subscan.io",
  },
  {
    id: "kusama",
    name: "Kusama",
    rpcUrl: "wss://kusama-rpc.polkadot.io",
    chunkSize: 2048, // 2 KB
    explorer: "https://kusama.subscan.io",
  },
  {
    id: "paseo",
    name: "Paseo",
    rpcUrl: "wss://paseo.api.integritee.network",
    chunkSize: 1024, // 1 KB
    explorer: "https://paseo.subscan.io",
  },
  {
    id: "polkadot",
    name: "Polkadot",
    rpcUrl: "wss://rpc.polkadot.io",
    chunkSize: 1024, // 1 KB
    explorer: "https://polkadot.subscan.io",
  },
];
