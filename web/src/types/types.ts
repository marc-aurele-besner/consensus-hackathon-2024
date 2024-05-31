// file: web/src/types/types.ts

export interface Account {
  address: string;
  meta: {
    genesisHash: string;
    name: string;
    source: string;
  };
  type: string;
}

export interface Network {
  id: string;
  name: string;
  rpcUrl: string;
  chunkSize: number;
  explorer: string;
}
