import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, Index as Index_} from "@subsquid/typeorm-store"

@Entity_()
export class CID {
    constructor(props?: Partial<CID>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @StringColumn_({nullable: false})
    cid!: string

    @StringColumn_({nullable: false})
    data!: string

    @StringColumn_({nullable: true})
    nextCid!: string | undefined | null
}
