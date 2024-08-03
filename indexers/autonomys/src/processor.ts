import {
  BlockHeader,
  DataHandlerContext,
  SubstrateBatchProcessor,
  SubstrateBatchProcessorFields,
  Call as _Call,
  Event as _Event,
  Extrinsic as _Extrinsic,
} from "@subsquid/substrate-processor";
import { assertNotNull } from "@subsquid/util-internal";
import { calls, events } from "./types";

export const processor = new SubstrateBatchProcessor()
  .setGateway(
    assertNotNull(process.env.AUTONOMYS_GATEWAY, "No Gateway endpoint supplied")
  )
  .setRpcEndpoint({
    url: assertNotNull(
      process.env.RPC_AUTONOMYS_ENDPOINT,
      "No RPC endpoint supplied"
    ),
    rateLimit: 20,
  })
  .setBlockRange({ from: 0 })
  .addCall({
    name: [calls.system.remark.name, calls.system.remarkWithEvent.name],
    events: true,
    extrinsic: true,
  })
  .addEvent({
    name: [events.system.remarked.name],
    call: true,
    extrinsic: true,
  })
  .setFields({
    block: {
      height: true,
      hash: true,
      timestamp: true,
    },
    extrinsic: {
      index: true,
      version: true,
      fee: true,
      success: true,
      hash: true,
    },
    call: {
      address: true,
      name: true,
      args: true,
      origin: true,
    },
    event: {
      name: true,
      args: true,
    },
  });

export type Fields = SubstrateBatchProcessorFields<typeof processor>;
export type Block = BlockHeader<Fields>;
export type Event = _Event<Fields>;
export type Call = _Call<Fields>;
export type Extrinsic = _Extrinsic<Fields>;
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>;
export type Ctx<S> = ProcessorContext<S>;
export type CtxBlock = Ctx<Fields>["blocks"][0];
export type CtxExtrinsic = CtxBlock["extrinsics"][0];
export type CtxEvent = CtxExtrinsic["events"][0];
