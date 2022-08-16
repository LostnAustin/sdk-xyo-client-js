import { XyoAccount } from '@xyo-network/account'
import { Promisable } from '@xyo-network/archivist'
import { XyoBoundWitness } from '@xyo-network/boundwitness'
import { XyoAbstractDiviner } from '@xyo-network/diviner'
import { XyoPayload } from '@xyo-network/payload'

import { divinePrices } from './lib'
import { XyoCryptoMarketAssetPayload } from './Payload'
import { XyoCryptoMarketAssetQueryPayload } from './Query'

export class XyoCryptoMarketAssetDiviner extends XyoAbstractDiviner<XyoCryptoMarketAssetQueryPayload> {
  constructor(account: XyoAccount) {
    super(account)
  }
  divine(_query: XyoCryptoMarketAssetQueryPayload): Promisable<[XyoBoundWitness, XyoPayload<XyoCryptoMarketAssetPayload>[]]> {
    const result: XyoCryptoMarketAssetPayload = divinePrices(undefined, undefined)
    const witnessedResult = this.bindPayloads([result])
    return [witnessedResult, [result]]
  }
}
