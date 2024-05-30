import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v0 from '../v0'

export const remarked =  {
    name: 'System.Remarked',
    /**
     * On on-chain remark happened.
     */
    v0: new EventType(
        'System.Remarked',
        sts.struct({
            sender: v0.AccountId32,
            hash: v0.H256,
        })
    ),
}
