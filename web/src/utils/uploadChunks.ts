// file: web/src/utils/uploadChunks.ts

"use client";

import { ApiPromise } from "@polkadot/api";
import { SubmittableExtrinsic } from "@polkadot/api/types";
import { useState } from "react";
import { ChunkData } from "./generateCIDs";

export const uploadChunks = async (
  api: ApiPromise,
  account: any,
  cids: ChunkData[],
  setError: (error: string) => void,
  setIsUploading: (isUploading: boolean) => void,
  setTxHash: (hash: string) => void
) => {
  try {
    const chunkTxs: SubmittableExtrinsic<"promise">[] = cids.map((chunk) =>
      api.tx.system.remarkWithEvent(
        JSON.stringify({
          cid: chunk.cid.toString(),
          data: Array.from(chunk.data), // Ensure data is properly encoded
          nextCid: chunk.nextCid ? chunk.nextCid.toString() : null,
        })
      )
    );

    const batchTx = api.tx.utility.batch(chunkTxs);

    await batchTx.signAndSend(
      account.address,
      { nonce: -1 },
      ({ status, events, dispatchError, txHash }) => {
        setIsUploading(true);
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
          setIsUploading(false);
          setTxHash(txHash.toHex());
          console.log("Included at block hash", status.asInBlock.toHex());
          console.log(
            "Events:",
            events,
            events.map(({ event }) => event.toHuman())
          );
          console.log("hash", txHash.toHex());
        } else if (status.isFinalized) {
          setIsUploading(false);
          console.log("Finalized block hash", status.asFinalized.toHex());
          console.log(
            "Events:",
            events,
            events.map(({ event }) => event.toHuman())
          );
          console.log("hash", txHash.toHex());
          setTxHash(txHash.toHex());
          setError("");
        }
      }
    );
  } catch (error) {
    console.error(error);
    setError("Failed to upload chunks. Please try again.");
  }
};
