module.exports = class Data1717096109654 {
    name = 'Data1717096109654'

    async up(db) {
        await db.query(`CREATE TABLE "cid" ("id" character varying NOT NULL, "cid" text NOT NULL, "data" text NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "next_cid" text, CONSTRAINT "PK_d216ee86eca749b2a30709489f7" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_eec6f4a196ce94afa52dc3279b" ON "cid" ("cid") `)
        await db.query(`CREATE INDEX "IDX_f6a77918a68f8e1581c1f6daba" ON "cid" ("timestamp") `)
        await db.query(`CREATE INDEX "IDX_52f7f093c8cfd255ac3d660f02" ON "cid" ("next_cid") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "cid"`)
        await db.query(`DROP INDEX "public"."IDX_eec6f4a196ce94afa52dc3279b"`)
        await db.query(`DROP INDEX "public"."IDX_f6a77918a68f8e1581c1f6daba"`)
        await db.query(`DROP INDEX "public"."IDX_52f7f093c8cfd255ac3d660f02"`)
    }
}
