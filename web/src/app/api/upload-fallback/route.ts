// file: web/src/app/api/upload-fallback/route.ts

import { Client, FaunaError, fql } from "fauna";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, res: NextResponse) => {
  if (!process.env.FAUNA_DB_KEY) throw new Error("FAUNA_DB_KEY is not set");

  const data = await req.json();
  console.log("data", data);

  if (!data || !data.cidList || !data.hash || !data.blockNumber)
    throw new Error("Invalid data");

  const client = new Client({
    secret: process.env.FAUNA_DB_KEY,
  });

  for (const cid of data.cidList) {
    if (!cid.cid) throw new Error("Invalid chunk data");

    // Build a query using the `fql` method
    // const collectionQuery = fql`Collection.create({ name: "chunk" })`;
    // // Run the query
    // const collectionResponse = await client.query(collectionQuery);

    const object = {
      cid: cid.cid,
      hash: data.hash,
      blockNumber: data.blockNumber,
      nextCid: cid.nextCid,
    };
    const documentQuery = fql`
  chunk.create(${object}) {
      cid,
    }
  `;
    const response = await client.query(documentQuery);

    console.log("response", response);
  }

  return NextResponse.json({
    success: true,
    message: "Chunk created",
  });
};
