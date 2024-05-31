// file: web/src/app/api/serve-fallback/[cid]/route.ts

import { ApiPromise, WsProvider } from "@polkadot/api";
import { EventRecord, Vec } from "@polkadot/types/interfaces";
import { Client, fql } from "fauna";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { cid: string } }
) => {
  if (!process.env.FAUNA_DB_KEY) throw new Error("FAUNA_DB_KEY is not set");

  const cid = params.cid;

  if (!cid) {
    return NextResponse.json(
      { success: false, message: "Missing cid parameter" },
      { status: 400 }
    );
  }

  const client = new Client({
    secret: process.env.FAUNA_DB_KEY,
  });

  try {
    const query = fql`
      chunk.where(.cid == ${cid}) {
        cid,
        hash,
        blockNumber,
        nextCid
      }
    `;
    const response = await client.query(query);

    if (!response || !response.data || !(response.data as any).data) {
      return NextResponse.json(
        { success: false, message: "No data found" },
        { status: 404 }
      );
    }

    type Document = {
      cid: string;
      hash: string;
      blockNumber: string;
      nextCid: null | string;
    };

    const document = (response.data as any).data[0] as Document;

    // convert hex to integer
    const blockNumber = parseInt(document.blockNumber, 16);

    let blockToCheck = blockNumber;

    // Connect to Subspace RPC
    const provider = new WsProvider(
      "wss://rpc-0.gemini-3h.subspace.network/ws"
    );
    const api = await ApiPromise.create({ provider });

    let found = false;
    const transactionDetails: any[] = [];

    while (!found) {
      const blockHash = await api.rpc.chain.getBlockHash(blockToCheck);
      console.log("Checking block", blockToCheck, blockHash.toString());
      const signedBlock = await api.rpc.chain.getBlock(blockHash);
      console.log("Block", signedBlock.block.header.number.toNumber());
      const allEvents = (await api.query.system.events.at(
        blockHash
      )) as unknown as Vec<EventRecord>;
      console.log("Events", allEvents.length);

      signedBlock.block.extrinsics.forEach((ex, index) => {
        const {
          method: { method, section },
        } = ex;
        console.log("Extrinsic", section, method);
        if (section === "utility" && method === "batch") {
          found = true;
          transactionDetails.push({
            cid: document.cid,
            blockNumber: document.blockNumber,
            extrinsicIndex: index,
            extrinsic: ex.toHuman(),
          });
          console.log("Found batch extrinsic", ex.toHuman());
        }
      });

      if (found) {
        allEvents.forEach(({ event }: { event: EventRecord }) => {
          console.log(event.toHuman());
          if (
            event.section === "system" &&
            event.method === "ExtrinsicSuccess"
          ) {
            transactionDetails.push({
              event: event.toHuman(),
            });
          }
          if (
            event.section === "system" &&
            event.method === "ExtrinsicFailed"
          ) {
            transactionDetails.push({
              event: event.toHuman(),
            });
          }
        });
      }
      if (blockNumber + 5 < blockToCheck) break;
      else blockToCheck++;
    }

    await provider.disconnect();

    // Extract and rebuild the file from transaction details
    const extractedData = transactionDetails.find(
      (detail) =>
        detail.extrinsic &&
        detail.extrinsic.method &&
        detail.extrinsic.method.args &&
        detail.extrinsic.method.args.calls
    );

    const rebuiltFile = extractedData
      ? Buffer.from(
          JSON.parse(extractedData.extrinsic.method.args.calls[0].args.remark)
            .data
        ).toString("utf-8")
      : null;

    if (rebuiltFile) {
      return NextResponse.json(JSON.parse(rebuiltFile));
    } else {
      return NextResponse.json(
        { success: false, message: "No valid file data found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching data", error: error.message },
      { status: 500 }
    );
  }
};