import { XyoPayload } from '@xyo-network/payload'
import { Parser } from 'bowser'

import { XyoBowserSystemInfoSchema } from './Schema'

export type XyoBowserSystemInfoPayload = XyoPayload<{
  bowser?: Parser.ParsedResult
  schema: XyoBowserSystemInfoSchema
}>
