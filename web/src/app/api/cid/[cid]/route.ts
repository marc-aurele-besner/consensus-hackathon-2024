// file: web/src/app/api/cid/[cid]/route.ts

import { ApiPromise, WsProvider } from "@polkadot/api";
import { Vec } from "@polkadot/types";
import { EventRecord } from "@polkadot/types/interfaces";
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

  type Document = {
    cid: string;
    hash: string;
    blockNumber: string;
    nextCid: null | string;
  };

  const getDocument = async (cid: string): Promise<Document | null> => {
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
        return null;
      }

      const document = (response.data as any).data[0] as Document;
      return document;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };

  const getRawData = async (document: Document): Promise<Buffer | null> => {
    try {
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
          // console.log("Extrinsic", section, method);
          if (section === "utility" && method === "batch") {
            found = true;
            transactionDetails.push({
              cid: document.cid,
              blockNumber: document.blockNumber,
              extrinsicIndex: index,
              extrinsic: ex.toHuman(),
            });
            // console.log("Found batch extrinsic", ex.toHuman());
          }
        });

        if (found) {
          allEvents.forEach(({ event }: { event: any }) => {
            // console.log(event.toHuman());
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

      const rawData = extractedData
        ? Buffer.from(
            JSON.parse(extractedData.extrinsic.method.args.calls[0].args.remark)
              .data
          )
        : null;
      return rawData;
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };

  const getMultipleRawData = async (
    document: Document
  ): Promise<Buffer | null> => {
    try {
      console.log("document", document);
      const listOfRawData: Buffer[] = [];
      const currentDocument = document;
      let nextCid = currentDocument.nextCid;

      const rawData = await getRawData(document);
      if (rawData) {
        listOfRawData.push(rawData);
      }
      while (nextCid !== null) {
        const nextDocument = await getDocument(nextCid);
        console.log("nextDocument", nextDocument);
        if (!nextDocument) {
          nextCid = null;
          break;
        }

        const rawData = await getRawData(nextDocument);
        if (rawData) {
          listOfRawData.push(rawData);
        }

        nextCid = nextDocument.nextCid;
      }
      console.log("listOfRawData", listOfRawData);
      return Buffer.concat(listOfRawData);
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };

  try {
    const document = await getDocument(cid);
    if (!document) throw new Error("No document found");

    const rawData = await getMultipleRawData(document);

    if (rawData) {
      const contentType =
        rawData[0] === 0x89 && rawData[1] === 0x50
          ? "image/png"
          : "application/json";

      if (contentType === "application/json") {
        const rebuiltFile = rawData.toString("utf-8");
        return NextResponse.json(JSON.parse(rebuiltFile));
      } else {
        return new NextResponse(rawData, {
          status: 200,
          headers: {
            "Content-Type": contentType,
          },
        });
      }
    } else {
      return NextResponse.json(
        { success: false, message: "No valid file data found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching data", error: error },
      { status: 500 }
    );
  }
};
