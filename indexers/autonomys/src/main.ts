import { TypeormDatabase } from "@subsquid/typeorm-store";
import { processor } from "./processor";
import { events } from "./types";
import { createRemark } from "./utils/remark";

processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
  for (let block of ctx.blocks) {
    for (let event of block.events) {
      if (event.name == events.system.remarked.name)
        await createRemark(ctx, block, event);
    }
  }
});
