import * as codec from "@ipld/dag-cbor";
import * as Block from "multiformats/block";
import { sha256 as hasher } from "multiformats/hashes/sha2";

const createBlocks = async (value: any) => {
  // encode a block
  let block = await Block.encode({ value, codec, hasher });

  block.value; // { hello: 'world' }
  block.bytes; // Uint8Array
  block.cid; // CID() w/ sha2-256 hash address and dag-cbor codec
};
