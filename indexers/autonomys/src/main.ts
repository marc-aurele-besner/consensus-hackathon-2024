import * as ss58 from "@subsquid/ss58";
import { Store, TypeormDatabase } from "@subsquid/typeorm-store";
import assert from "assert";
import { In } from "typeorm";

import { CID } from "./model";
import { processor, ProcessorContext } from "./processor";
import { events } from "./types";

processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
  let remarkEvents: RemarkEvent[] = getRemarkEvents(ctx);

  let cids: Map<string, CID> = await createCIDs(ctx, remarkEvents);

  await ctx.store.upsert([...cids.values()]);
});

interface RemarkEvent {
  id: string;
  blockNumber: number;
  timestamp: Date;
  extrinsicHash?: string;
  sender: string;
  hash: string;
}

function getRemarkEvents(ctx: ProcessorContext<Store>): RemarkEvent[] {
  // Filters and decodes the arriving events
  let remarkEvents: RemarkEvent[] = [];
  for (let block of ctx.blocks) {
    for (let event of block.events) {
      if (event.name == events.system.remarked.name) {
        let rec: { sender: string; hash: string };
        if (events.system.remarked.v0.is(event)) {
          let { sender, hash } = events.system.remarked.v0.decode(event);
          rec = { sender, hash };
        } else {
          throw new Error("Unsupported spec");
        }

        assert(
          block.header.timestamp,
          `Got an undefined timestamp at block ${block.header.height}`
        );

        remarkEvents.push({
          id: event.id,
          blockNumber: block.header.height,
          timestamp: new Date(block.header.timestamp),
          extrinsicHash: event.extrinsic?.hash,
          sender: ss58.codec("kusama").encode(rec.sender),
          hash: rec.hash,
        });
      }
    }
  }
  return remarkEvents;
}

async function createCIDs(
  ctx: ProcessorContext<Store>,
  remarkEvents: RemarkEvent[]
): Promise<Map<string, CID>> {
  const cidIds = new Set<string>();
  for (let t of remarkEvents) {
    cidIds.add(t.hash);
  }

  const cids = await ctx.store
    .findBy(CID, { id: In([...cidIds]) })
    .then((accounts) => {
      return new Map(accounts.map((a) => [a.id, a]));
    });

  for (let t of remarkEvents) {
    updateCids(t.hash);
  }

  function updateCids(id: string): void {
    const acc = cids.get(id);
    if (acc == null) {
      cids.set(id, new CID({ id }));
    }
  }

  return cids;
}
