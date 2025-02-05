import { XyoQuery } from '@xyo-network/module'

export type XyoNodeAttachQuerySchema = 'network.xyo.query.node.attach'
export const XyoNodeAttachQuerySchema: XyoNodeAttachQuerySchema = 'network.xyo.query.node.attach'

export type XyoNodeAttachQuery = XyoQuery<{
  address: string
  schema: XyoNodeAttachQuerySchema
}>
