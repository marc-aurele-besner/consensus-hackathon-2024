import { Store } from "@subsquid/typeorm-store";
import { Remark } from "../model";
import { ProcessorContext } from "../processor";
import { createCID } from "./cid";

export const createRemark = async (
  ctx: ProcessorContext<Store>,
  block: ProcessorContext<Store>["blocks"][0],
  event: ProcessorContext<Store>["blocks"][0]["events"][0]
) => {
  const { remark } = event.call?.args as { remark: string };

  const remarks = new Remark({
    id: block.events[0].id + "-" + Math.random(),
    blockNumber: block.header.height,
    hash: event.call?.extrinsic?.hash,
    remark,
    timestamp: new Date(block.header.timestamp || 0),
    extrinsicHash: event.call?.extrinsic?.hash,
    sender: event.call?.origin.value.value,
  });

  await ctx.store.insert(remarks);

  const remarksCount = await ctx.store.count(Remark);
  ctx.log.child("Remarks").info(`count: ${remarksCount}`);

  await createCID(ctx, block, remark);
};
