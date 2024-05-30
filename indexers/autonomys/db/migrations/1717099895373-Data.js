module.exports = class Data1717099895373 {
    name = 'Data1717099895373'

    async up(db) {
        await db.query(`CREATE TABLE "cid" ("id" character varying NOT NULL, "cid" text NOT NULL, "data" text NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "next_cid" text, CONSTRAINT "PK_d216ee86eca749b2a30709489f7" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_eec6f4a196ce94afa52dc3279b" ON "cid" ("cid") `)
        await db.query(`CREATE INDEX "IDX_f6a77918a68f8e1581c1f6daba" ON "cid" ("timestamp") `)
        await db.query(`CREATE INDEX "IDX_52f7f093c8cfd255ac3d660f02" ON "cid" ("next_cid") `)
        await db.query(`CREATE TABLE "chunk" ("id" character varying NOT NULL, "cid" text NOT NULL, "data" text NOT NULL, "next_cid" text, CONSTRAINT "PK_444ba832a2c514629d265d81b5f" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_c4c1680df371e69da0014be2a0" ON "chunk" ("cid") `)
        await db.query(`CREATE TABLE "reward_event" ("id" character varying NOT NULL, "block_number" integer NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "extrinsic_hash" text NOT NULL, "sender" text NOT NULL, "hash" text NOT NULL, CONSTRAINT "PK_212058fe00a4e4ad6f433833992" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_dcefc6529930bf025676463725" ON "reward_event" ("block_number") `)
        await db.query(`CREATE INDEX "IDX_32c335d826e7606e7dec0bcd59" ON "reward_event" ("timestamp") `)
        await db.query(`CREATE INDEX "IDX_53ac1d5bf31f15640e4d54820a" ON "reward_event" ("extrinsic_hash") `)
        await db.query(`CREATE INDEX "IDX_029953ea4ffb97bcc30fb5efd3" ON "reward_event" ("sender") `)
        await db.query(`CREATE INDEX "IDX_a97fc677436b60b66e2ecf4dae" ON "reward_event" ("hash") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "cid"`)
        await db.query(`DROP INDEX "public"."IDX_eec6f4a196ce94afa52dc3279b"`)
        await db.query(`DROP INDEX "public"."IDX_f6a77918a68f8e1581c1f6daba"`)
        await db.query(`DROP INDEX "public"."IDX_52f7f093c8cfd255ac3d660f02"`)
        await db.query(`DROP TABLE "chunk"`)
        await db.query(`DROP INDEX "public"."IDX_c4c1680df371e69da0014be2a0"`)
        await db.query(`DROP TABLE "reward_event"`)
        await db.query(`DROP INDEX "public"."IDX_dcefc6529930bf025676463725"`)
        await db.query(`DROP INDEX "public"."IDX_32c335d826e7606e7dec0bcd59"`)
        await db.query(`DROP INDEX "public"."IDX_53ac1d5bf31f15640e4d54820a"`)
        await db.query(`DROP INDEX "public"."IDX_029953ea4ffb97bcc30fb5efd3"`)
        await db.query(`DROP INDEX "public"."IDX_a97fc677436b60b66e2ecf4dae"`)
    }
}
