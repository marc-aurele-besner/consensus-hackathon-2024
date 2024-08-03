module.exports = class Data1721481536942 {
    name = 'Data1721481536942'

    async up(db) {
        await db.query(`CREATE TABLE "cid" ("id" character varying NOT NULL, "cid" text NOT NULL, "data" text NOT NULL, "next_cid" text, CONSTRAINT "PK_d216ee86eca749b2a30709489f7" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_eec6f4a196ce94afa52dc3279b" ON "cid" ("cid") `)
        await db.query(`CREATE TABLE "remark" ("id" character varying NOT NULL, "block_number" integer NOT NULL, "hash" text NOT NULL, "remark" text NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "extrinsic_hash" text NOT NULL, "sender" text NOT NULL, CONSTRAINT "PK_58427c64a5e9ff68e1ff44d01f9" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_768cb6debcdf64df6ee71c6ee2" ON "remark" ("block_number") `)
        await db.query(`CREATE INDEX "IDX_ddfca4164a7032d757d1f9607f" ON "remark" ("hash") `)
        await db.query(`CREATE INDEX "IDX_a7165380913fe4ecd50f238c07" ON "remark" ("timestamp") `)
        await db.query(`CREATE INDEX "IDX_57a527ea39dc1181cb2f05bc39" ON "remark" ("extrinsic_hash") `)
        await db.query(`CREATE INDEX "IDX_79d751a3c76f5bb5a7ef952c6b" ON "remark" ("sender") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "cid"`)
        await db.query(`DROP INDEX "public"."IDX_eec6f4a196ce94afa52dc3279b"`)
        await db.query(`DROP TABLE "remark"`)
        await db.query(`DROP INDEX "public"."IDX_768cb6debcdf64df6ee71c6ee2"`)
        await db.query(`DROP INDEX "public"."IDX_ddfca4164a7032d757d1f9607f"`)
        await db.query(`DROP INDEX "public"."IDX_a7165380913fe4ecd50f238c07"`)
        await db.query(`DROP INDEX "public"."IDX_57a527ea39dc1181cb2f05bc39"`)
        await db.query(`DROP INDEX "public"."IDX_79d751a3c76f5bb5a7ef952c6b"`)
    }
}
