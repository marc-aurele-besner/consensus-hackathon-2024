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
  name: string;
  rpcUrl: string;
  chunkSize: number;
}
