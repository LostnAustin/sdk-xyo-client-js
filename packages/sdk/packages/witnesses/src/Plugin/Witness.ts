import { XyoWitness } from '@xyo-network/witness'

import { XyoPluginPayload } from './Payload'

export class XyoNonFungibleTokenWitness extends XyoWitness<XyoPluginPayload> {
  observe(_fields: Partial<XyoPluginPayload>): Promise<XyoPluginPayload> {
    throw new Error('Method not implemented.')
  }
}