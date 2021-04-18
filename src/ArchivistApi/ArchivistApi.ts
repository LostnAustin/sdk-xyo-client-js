import axios from 'axios'

import { XyoBoundWitnessJson } from '../models'
import XyoArchivistApiConfig from './ArchivistApiConfig'

class XyoArchivistApi {
  private config: XyoArchivistApiConfig
  private constructor(config: XyoArchivistApiConfig) {
    this.config = config
  }

  public get authenticated() {
    return !!this.config.token
  }

  public get headers() {
    return this.authenticated ? { Authorization: this.config.token } : {}
  }

  public async postBoundWitnesses<T>(archive: string, entries: XyoBoundWitnessJson<T>[]) {
    return (
      await axios.post(`${this.config.apiDomain}/archive/${archive}/bw`, entries, {
        headers: this.headers,
      })
    ).data
  }

  public async postBoundWitness<T>(archive: string, entry: XyoBoundWitnessJson<T>) {
    return (
      await axios.post(`${this.config.apiDomain}/archive/${archive}/bw`, entry, {
        headers: this.headers,
      })
    ).data
  }

  static get(config: XyoArchivistApiConfig) {
    return new XyoArchivistApi(config)
  }
}

export default XyoArchivistApi