// file: web/src/constants/networks.ts

export const networks = [
  {
    name: "Polkadot",
    rpcUrl: "wss://rpc.polkadot.io",
    chunkSize: 1024, // 1 KB
    explorer: "https://polkadot.subscan.io",
  },
  {
    name: "Kusama",
    rpcUrl: "wss://kusama-rpc.polkadot.io",
    chunkSize: 2048, // 2 KB
    explorer: "https://kusama.subscan.io",
  },
  {
    name: "Paseo",
    rpcUrl: "wss://paseo.api.integritee.network",
    chunkSize: 1024, // 1 KB
    explorer: "https://paseo.subscan.io",
  },
  {
    name: "Autonomys Testnet",
    rpcUrl: "wss://rpc-0.gemini-3h.subspace.network/ws",
    chunkSize: 256 * 1024, // 256 KB
    explorer: "https://subspace.subscan.io",
  },
];
