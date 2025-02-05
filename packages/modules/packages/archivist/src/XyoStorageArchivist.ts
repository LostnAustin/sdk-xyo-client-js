import { assertEx } from '@xylabs/assert'
import { XyoAccount } from '@xyo-network/account'
import { XyoBoundWitness } from '@xyo-network/boundwitness'
import { XyoModuleParams } from '@xyo-network/module'
import { PayloadWrapper, XyoPayload } from '@xyo-network/payload'
import { PromisableArray } from '@xyo-network/promise'
import compact from 'lodash/compact'
import store, { StoreBase } from 'store2'

import { XyoArchivistConfig } from './Config'
import {
  XyoArchivistAllQuerySchema,
  XyoArchivistClearQuerySchema,
  XyoArchivistCommitQuerySchema,
  XyoArchivistDeleteQuerySchema,
  XyoArchivistFindQuerySchema,
  XyoArchivistInsertQuery,
  XyoArchivistInsertQuerySchema,
} from './Queries'
import { XyoArchivist } from './XyoArchivist'

export type XyoStorageArchivistConfigSchema = 'network.xyo.module.config.archivist.storage'
export const XyoStorageArchivistConfigSchema: XyoStorageArchivistConfigSchema = 'network.xyo.module.config.archivist.storage'

export type XyoStorageArchivistConfig = XyoArchivistConfig<{
  maxEntries?: number
  maxEntrySize?: number
  namespace?: string
  persistAccount?: boolean
  schema: XyoStorageArchivistConfigSchema
  type?: 'local' | 'session' | 'page'
}>

export class XyoStorageArchivist extends XyoArchivist<XyoStorageArchivistConfig> {
  static override configSchema = XyoStorageArchivistConfigSchema

  private _privateStorage: StoreBase | undefined
  private _storage: StoreBase | undefined

  constructor(params?: XyoModuleParams<XyoStorageArchivistConfig>) {
    super(params)
    this.loadAccount()
  }

  public get maxEntries() {
    return this.config?.maxEntries ?? 1000
  }

  public get maxEntrySize() {
    return this.config?.maxEntries ?? 16000
  }

  public get namespace() {
    return this.config?.namespace ?? 'xyo-archivist'
  }

  public get persistAccount() {
    return this.config?.persistAccount ?? false
  }

  public get type() {
    return this.config?.type ?? 'local'
  }

  /* This has to be a getter so that it can access it during construction */
  private get privateStorage(): StoreBase {
    this._privateStorage = this._storage ?? store[this.type].namespace(`${this.namespace}|private`)
    return this._privateStorage
  }

  /* This has to be a getter so that it can access it during construction */
  private get storage(): StoreBase {
    this._storage = this._storage ?? store[this.type].namespace(this.namespace)
    return this._storage
  }

  static override async create(params?: XyoModuleParams<XyoStorageArchivistConfig>): Promise<XyoStorageArchivist> {
    return (await super.create(params)) as XyoStorageArchivist
  }

  public override all(): PromisableArray<XyoPayload> {
    this.logger?.log(`this.storage.length: ${this.storage.length}`)
    try {
      return Object.entries(this.storage.getAll()).map(([, value]) => value)
    } catch (ex) {
      console.error(`Error: ${JSON.stringify(ex, null, 2)}`)
      throw ex
    }
  }

  public override clear(): void | Promise<void> {
    this.logger?.log(`this.storage.length: ${this.storage.length}`)
    try {
      this.storage.clear()
    } catch (ex) {
      console.error(`Error: ${JSON.stringify(ex, null, 2)}`)
      throw ex
    }
  }

  public override async commit(): Promise<XyoBoundWitness[]> {
    this.logger?.log(`this.storage.length: ${this.storage.length}`)
    try {
      const payloads = await this.all()
      assertEx(payloads.length > 0, 'Nothing to commit')
      const settled = await Promise.allSettled(
        compact(
          Object.values(this.parents?.commit ?? [])?.map(async (parent) => {
            const queryPayload = PayloadWrapper.parse<XyoArchivistInsertQuery>({
              payloads: payloads.map((payload) => PayloadWrapper.hash(payload)),
              schema: XyoArchivistInsertQuerySchema,
            })
            const query = await this.bindQuery(queryPayload)
            return (await parent?.query(query[0], query[1]))?.[0]
          }),
        ),
      )
      await this.clear()
      return compact(
        settled.map((result) => {
          return result.status === 'fulfilled' ? result.value : null
        }),
      )
    } catch (ex) {
      console.error(`Error: ${JSON.stringify(ex, null, 2)}`)
      throw ex
    }
  }

  public override delete(hashes: string[]): PromisableArray<boolean> {
    this.logger?.log(`hashes.length: ${hashes.length}`)
    try {
      return hashes.map((hash) => {
        this.storage.remove(hash)
        return true
      })
    } catch (ex) {
      console.error(`Error: ${JSON.stringify(ex, null, 2)}`)
      throw ex
    }
  }

  public async get(hashes: string[]): Promise<XyoPayload[]> {
    this.logger?.log(`hashes.length: ${hashes.length}`)
    try {
      return await Promise.all(
        hashes.map(async (hash) => {
          const value = this.storage.get(hash)
          return value ?? (await this.getFromParents(hash)) ?? null
        }),
      )
    } catch (ex) {
      console.error(`Error: ${JSON.stringify(ex, null, 2)}`)
      throw ex
    }
  }

  public async insert(payloads: XyoPayload[]): Promise<XyoBoundWitness[]> {
    this.logger?.log(`payloads.length: ${payloads.length}`)
    try {
      const storedPayloads = payloads.map((payload) => {
        const wrapper = new PayloadWrapper(payload)
        const hash = wrapper.hash
        const value = JSON.stringify(wrapper.payload)
        assertEx(value.length < this.maxEntrySize, `Payload too large [${wrapper.hash}, ${value.length}]`)
        this.storage.set(hash, wrapper.payload)
        return wrapper.payload
      })
      const result = await this.bindResult([...storedPayloads])
      const parentBoundWitnesses: XyoBoundWitness[] = []
      if (this.writeThrough) {
        //we store the child bw also
        parentBoundWitnesses.push(...(await this.writeToParents([result[0], ...storedPayloads])))
      }
      return [result[0], ...parentBoundWitnesses]
    } catch (ex) {
      console.error(`Error: ${ex}`)
      throw ex
    }
  }

  public override queries() {
    return [
      XyoArchivistAllQuerySchema,
      XyoArchivistDeleteQuerySchema,
      XyoArchivistClearQuerySchema,
      XyoArchivistFindQuerySchema,
      XyoArchivistCommitQuerySchema,
      ...super.queries(),
    ]
  }

  override async start() {
    await super.start()
    this.saveAccount()
    return this
  }

  protected override loadAccount() {
    if (this.persistAccount) {
      const privateKey = this.privateStorage.get('privateKey')
      if (privateKey) {
        try {
          const account = new XyoAccount({ privateKey })
          this.logger?.log(account.addressValue.hex)
          return account
        } catch (ex) {
          console.error(`Error reading Account from storage [${this.type}, ${ex}] - Recreating Account`)
          this.privateStorage.remove('privateKey')
        }
      }
    }
    return super.loadAccount()
  }

  protected saveAccount() {
    if (this.persistAccount) {
      this.logger?.log(this.account.addressValue.hex)
      this.privateStorage.set('privateKey', this.account.private.hex)
    }
  }
}
