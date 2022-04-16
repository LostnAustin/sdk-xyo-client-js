import { XyoDataLike } from './Data'
import { XyoAddressValue } from './XyoAddressValue'
import { XyoEllipticKey } from './XyoEllipticKey'

export class XyoPublicKey extends XyoEllipticKey {
  private _isXyoPublicKey = true
  constructor(bytes: XyoDataLike) {
    super(64, bytes)
  }
  public get address() {
    return new XyoAddressValue(this.keccak256.subarray(12).toString('hex').padStart(40, '0'))
  }

  public verify(msg: Uint8Array | string, signature: Uint8Array | string) {
    return this.address.verify(msg, signature)
  }

  public static isXyoPublicKey(value: unknown) {
    return (value as XyoPublicKey)._isXyoPublicKey
  }
}
