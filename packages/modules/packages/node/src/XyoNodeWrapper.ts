import { Module, XyoModule, XyoModuleWrapper } from '@xyo-network/module'
import compact from 'lodash/compact'

import { NodeModule } from './NodeModule'
import {
  XyoNodeAttachedQuery,
  XyoNodeAttachedQuerySchema,
  XyoNodeAttachQuery,
  XyoNodeAttachQuerySchema,
  XyoNodeDetachQuery,
  XyoNodeDetachQuerySchema,
  XyoNodeRegisteredQuery,
  XyoNodeRegisteredQuerySchema,
} from './Queries'

export class XyoNodeWrapper extends XyoModuleWrapper implements NodeModule {
  register(_module: Module): void {
    throw Error('Not implemented')
  }
  async registered(): Promise<string[]> {
    const query: XyoNodeRegisteredQuery = { schema: XyoNodeRegisteredQuerySchema }
    const bw = (await this.bindPayloads([query]))[0]
    return compact((await this.module.query(bw, query))[1].map((payload) => payload?.schema))
  }
  async attached(): Promise<string[]> {
    const query: XyoNodeAttachedQuery = { schema: XyoNodeAttachedQuerySchema }
    const bw = (await this.bindPayloads([query]))[0]
    return compact((await this.module.query(bw, query))[1].map((payload) => payload?.schema))
  }
  async attach(address: string): Promise<void> {
    const query: XyoNodeAttachQuery = { address, schema: XyoNodeAttachQuerySchema }
    const bw = (await this.bindPayloads([query]))[0]
    await this.module.query(bw, query)
    return
  }
  async detach(address: string): Promise<void> {
    const query: XyoNodeDetachQuery = { address, schema: XyoNodeDetachQuerySchema }
    const bw = (await this.bindPayloads([query]))[0]
    await this.module.query(bw, query)
    return
  }

  async registeredModules(): Promise<XyoModule[]> {
    const addresses = await this.registered()
    return compact(await Promise.all(addresses.map((address) => this.resolve(address))))
  }
  async attachedModules(): Promise<XyoModule[]> {
    const addresses = await this.attached()
    return compact(await Promise.all(addresses.map((address) => this.resolve(address))))
  }

  resolve(_address: string): XyoModule | null {
    throw Error('Not implemented')
  }
}
