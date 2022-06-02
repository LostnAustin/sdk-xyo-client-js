import { XyoWitness } from '@xyo-network/core'

import { XyoNonFungibleTokenMetaPayload } from './MetaPayload'
import { nonFungibleTokenMetaTemplate } from './Template'

export class XyoNonFungibleTokenMetaWitness extends XyoWitness<XyoNonFungibleTokenMetaPayload> {
  constructor() {
    const template = nonFungibleTokenMetaTemplate()
    super({
      schema: template.schema,
      template,
    })
  }

  override async observe() {
    return await super.observe({})
  }
}