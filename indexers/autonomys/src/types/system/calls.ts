import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'

export const remarkWithEvent =  {
    name: 'System.remark_with_event',
    /**
     * See [`Pallet::remark_with_event`].
     */
    v0: new CallType(
        'System.remark_with_event',
        sts.struct({
            remark: sts.bytes(),
        })
    ),
}
