// file: web/src/app/api/search-file/[cid]/route.ts

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
        cid
      }
    `;
    const response = await client.query(query);

    if (!response || !response.data || !(response.data as any).data.length) {
      return NextResponse.json({ found: false });
    }

    return NextResponse.json({ found: true });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching data", error: error },
      { status: 500 }
    );
  }
};
