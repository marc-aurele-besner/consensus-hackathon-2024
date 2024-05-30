// file: web/src/utils/generateCIDs.ts

import { CID } from "multiformats/cid";
import { sha256 } from "multiformats/hashes/sha2";

export interface ChunkData {
  cid: CID;
  data: Uint8Array;
  nextCid?: CID;
}

export const generateCIDs = async (
  file: File,
  chunkSize: number
): Promise<ChunkData[]> => {
  const chunks: ArrayBuffer[] = [];
  const buffer = await file.arrayBuffer();

  for (let i = 0; i < buffer.byteLength; i += chunkSize) {
    chunks.push(buffer.slice(i, i + chunkSize));
  }

  const cidDataArray: ChunkData[] = await Promise.all(
    chunks.map(async (chunk, index) => {
      const hash = await sha256.digest(new Uint8Array(chunk));
      const cid = CID.create(1, 0x12, hash);
      const nextCid =
        index + 1 < chunks.length
          ? CID.create(
              1,
              0x12,
              await sha256.digest(new Uint8Array(chunks[index + 1]))
            )
          : undefined;
      return { cid, data: new Uint8Array(chunk), nextCid };
    })
  );

  return cidDataArray;
};
