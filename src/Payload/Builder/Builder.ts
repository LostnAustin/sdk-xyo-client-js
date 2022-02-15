import { XyoPayload } from '../../models'
import { removeEmptyFields, removeUnderscoreFields, XyoHasher } from '../../XyoHasher'

export interface XyoPayloadBuilderOptions {
  schema: string
}

export class XyoPayloadBuilder<T extends XyoPayload> {
  private _fields: Partial<T> = {}
  private _schema: string

  constructor({ schema }: XyoPayloadBuilderOptions) {
    this._schema = schema
  }

  public fields(fields?: Partial<T>) {
    if (fields) {
      this._fields = { ...this._fields, ...fields }
    }
    return this
  }

  public hashableFields() {
    return {
      ...removeEmptyFields(removeUnderscoreFields(this._fields)),
      schema: this._schema,
    } as T
  }

  public build(): T {
    const hashableFields = this.hashableFields()
    const _hash = new XyoHasher(hashableFields).sortedHash()
    const _timestamp = Date.now()
    return { ...hashableFields, _client: 'js', _hash, _timestamp, schema: this._schema }
  }
}
