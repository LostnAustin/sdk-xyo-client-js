import { XyoWitness, XyoWitnessConfigSchema } from '@xyo-network/witness'

import { XyoPluginPayload } from './Payload'

export class XyoNonFungibleTokenWitness extends XyoWitness<XyoPluginPayload> {
  static override configSchema = XyoWitnessConfigSchema
  static override targetSchema = 'network.xyo.nft'

  override observe(_fields: Partial<XyoPluginPayload>[]): Promise<XyoPluginPayload[]> {
    throw new Error('Method not implemented.')
  }
}
