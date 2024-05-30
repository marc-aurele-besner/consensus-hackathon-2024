// file: web/src/utils/uploadChunks.ts

import { ApiPromise } from "@polkadot/api";
import { SubmittableResult } from "@polkadot/api/submittable";
import { ChunkData } from "./generateCIDs";

export const uploadChunks = async (
  api: ApiPromise,
  account: any,
  cids: ChunkData[],
  setError: (error: string | null) => void
) => {
  try {
    const chunkTxs = cids.map((chunk) =>
      api.tx.system.remarkWithEvent(chunk.data)
    );

    const batchTx = api.tx.utility.batch(chunkTxs);

    const unsub = await batchTx.signAndSend(
      account.address,
      ({ status, events }: SubmittableResult) => {
        if (status.isInBlock) {
          console.log("Transaction included at blockHash", status.asInBlock);
        } else if (status.isFinalized) {
          console.log("Transaction finalized at blockHash", status.asFinalized);
          unsub();
        }
      }
    );
  } catch (error) {
    console.error(error);
    setError("Failed to upload chunks. Please try again.");
  }
};
