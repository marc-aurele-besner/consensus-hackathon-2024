import { Store } from "@subsquid/typeorm-store";
import { CID } from "../model";
import { ProcessorContext } from "../processor";
import { hexToString, sanitizeString } from "./string";

export const createCID = async (
  ctx: ProcessorContext<Store>,
  block: ProcessorContext<Store>["blocks"][0],
  remark: string
) => {
  const string = hexToString(remark);

  if (string) {
    const sanitizedString = sanitizeString(string);
    try {
      const json = JSON.parse(sanitizedString) as {
        cid: string;
        data: string;
        nextCid: string;
      };

      if (json && json.cid) {
        const cid = new CID({
          id: block.events[0].id + "-" + Math.random(),
          cid: json.cid,
          data: json.data.toString(),
          nextCid: json.nextCid,
        });

        await ctx.store.insert([cid]);

        const cidCount = await ctx.store.count(CID);
        ctx.log.child("CID").info(`count: ${cidCount}`);
      }
    } catch (error) {
      console.log(
        `This remark is likely not a CID: ${sanitizedString.substring(0, 50)}`
      );
    }
  }
};
