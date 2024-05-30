// file: web/src/utils/uploadChunks.ts

import { ApiPromise } from "@polkadot/api";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { ChunkData } from "./generateCIDs";

export const uploadChunks = async (
  api: ApiPromise,
  account: any,
  cids: ChunkData[],
  setError: (error: string) => void
) => {
  try {
    const chunkTxs: SubmittableExtrinsic<"promise">[] = cids.map((chunk) =>
      api.tx.system.remarkWithEvent(JSON.stringify(chunk))
    );

    const batchTx = api.tx.utility.batch(chunkTxs);

    await batchTx.signAndSend(
      account,
      { nonce: -1 },
      ({ status, events, dispatchError }) => {
        if (dispatchError) {
          if (dispatchError.isModule) {
            const decoded = api.registry.findMetaError(dispatchError.asModule);
            const { name, section } = decoded;
            console.log(`${section}.${name}`);
            setError(`${section}.${name}`);
          } else {
            console.log(dispatchError.toString());
            setError(dispatchError.toString());
          }
        } else if (status.isInBlock) {
          console.log("Included at block hash", status.asInBlock.toHex());
        } else if (status.isFinalized) {
          console.log("Finalized block hash", status.asFinalized.toHex());
          setError("");
        }
      }
    );
  } catch (error) {
    console.error(error);
    setError("Failed to upload chunks. Please try again.");
  }
};
