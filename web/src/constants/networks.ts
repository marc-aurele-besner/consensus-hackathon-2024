// file: web/src/constants/networks.ts

export const networks = [
  {
    name: "Polkadot",
    rpcUrl: "wss://rpc.polkadot.io",
    chunkSize: 1024, // 1 KB
  },
  {
    name: "Kusama",
    rpcUrl: "wss://kusama-rpc.polkadot.io",
    chunkSize: 2048, // 2 KB
  },
  {
    name: "Autonomys Testnet",
    rpcUrl: "wss://rpc-0.gemini-3h.subspace.network/ws",
    chunkSize: 256 * 1024, // 256 KB
  },
  {
    name: "Polkadot Testnet",
    rpcUrl: "wss://testnet.polkadot.io",
    chunkSize: 512, // 0.5 KB
  },
];
