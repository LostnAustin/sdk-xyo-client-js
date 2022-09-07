import { XyoModule } from '@xyo-network/module'
import { XyoPayload } from '@xyo-network/payload'

import { Archivist } from './Archivist'
import {
  XyoArchivistAllQuery,
  XyoArchivistAllQuerySchema,
  XyoArchivistClearQuery,
  XyoArchivistClearQuerySchema,
  XyoArchivistCommitQuery,
  XyoArchivistCommitQuerySchema,
  XyoArchivistDeleteQuery,
  XyoArchivistDeleteQuerySchema,
  XyoArchivistFindQuery,
  XyoArchivistFindQuerySchema,
  XyoArchivistGetQuery,
  XyoArchivistGetQuerySchema,
  XyoArchivistInsertQuery,
  XyoArchivistInsertQuerySchema,
} from './Query'
import { XyoPayloadFindFilter } from './XyoPayloadFindFilter'

export class XyoArchivistWrapper implements Archivist<XyoPayload | null, XyoPayload | null, XyoPayload, XyoPayload | null, XyoPayloadFindFilter> {
  protected module: XyoModule

  constructor(module: XyoModule) {
    this.module = module
  }

  public get queries() {
    return this.module.queries
  }

  public async delete(hashes: string[]) {
    const query: XyoArchivistDeleteQuery = { hashes, schema: XyoArchivistDeleteQuerySchema }
    return (await this.module.query(query))[0].payload_hashes.map(() => true)
  }

  public async clear(): Promise<void> {
    const query: XyoArchivistClearQuery = { schema: XyoArchivistClearQuerySchema }
    await this.module.query(query)
  }

  public async get(hashes: string[]): Promise<(XyoPayload | null)[]> {
    const query: XyoArchivistGetQuery = { hashes, schema: XyoArchivistGetQuerySchema }
    return (await this.module.query(query))[1]
  }

  public async insert(payloads: XyoPayload[]): Promise<(XyoPayload | null)[]> {
    const query: XyoArchivistInsertQuery = { payloads, schema: XyoArchivistInsertQuerySchema }
    return (await this.module.query(query))[1]
  }

  public async find(filter: XyoPayloadFindFilter): Promise<(XyoPayload | null)[]> {
    const query: XyoArchivistFindQuery = { filter, schema: XyoArchivistFindQuerySchema }
    return (await this.module.query(query))[1]
  }

  public async all(): Promise<(XyoPayload | null)[]> {
    const query: XyoArchivistAllQuery = { schema: XyoArchivistAllQuerySchema }
    return (await this.module.query(query))[1]
  }

  public async commit(): Promise<(XyoPayload | null)[]> {
    const query: XyoArchivistCommitQuery = { schema: XyoArchivistCommitQuerySchema }
    return (await this.module.query(query))[1]
  }
}
