import { assertEx } from '@xylabs/sdk-js'

import { XyoNodeConfig } from '../shared'
import { knownArchivists } from './knownArchivists'
import { knownDiviners } from './knownDiviners'

export class XyoNodeConfigWrapper {
  public config: XyoNodeConfig

  constructor(config: XyoNodeConfig) {
    this.config = config
  }

  static known(slug: string) {
    const config = assertEx(knownArchivists.find((config) => config.slug === slug) ?? knownDiviners.find((config) => config.slug === slug), 'Unknown node')
    return new XyoNodeConfigWrapper(config)
  }
}
