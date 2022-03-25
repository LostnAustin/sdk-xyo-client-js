import { XyoApiBase, XyoApiResponseTuple, XyoApiResponseType } from './Base'
import { XyoApiConfig } from './Config'

export class XyoApiSimple<T, D = T, C extends XyoApiConfig = XyoApiConfig> extends XyoApiBase<C> {
  public async get(): Promise<T>
  public async get(responseType?: 'body'): Promise<T>
  public async get(responseType?: 'tuple'): Promise<XyoApiResponseTuple<T>>
  public async get(responseType?: XyoApiResponseType): Promise<T | XyoApiResponseTuple<T>> {
    switch (responseType) {
      case 'tuple':
        return await this.getEndpoint('', 'tuple')
      default:
        return await this.getEndpoint('')
    }
  }

  public async post(data?: D): Promise<T>
  public async post(data?: D, responseType?: 'body'): Promise<T>
  public async post(data?: D, responseType?: 'tuple'): Promise<XyoApiResponseTuple<T>>
  public async post(data?: D, responseType?: XyoApiResponseType): Promise<T | XyoApiResponseTuple<T>> {
    switch (responseType) {
      case 'tuple':
        return await this.postEndpoint('', data, 'tuple')
      default:
        return await this.postEndpoint('', data)
    }
  }

  public async put(data?: D): Promise<T>
  public async put(data?: D, responseType?: 'body'): Promise<T>
  public async put(data?: D, responseType?: 'tuple'): Promise<XyoApiResponseTuple<T>>
  public async put(data?: D, responseType?: XyoApiResponseType): Promise<T | XyoApiResponseTuple<T>> {
    switch (responseType) {
      case 'tuple':
        return await this.putEndpoint('', data, 'tuple')
      default:
        return await this.putEndpoint('', data)
    }
  }
}