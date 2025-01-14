import { PayloadWrapper } from '@xyo-network/payload'

import { defaultCoins, defaultCurrencies } from './lib'
import { XyoCoingeckoCryptoMarketSchema, XyoCoingeckoCryptoMarketWitnessConfigSchema } from './Schema'
import { XyoCoingeckoCryptoMarketWitness } from './Witness'

describe('XyoCoingeckoCryptoMarketWitness', () => {
  test('returns observation', async () => {
    const sut = await XyoCoingeckoCryptoMarketWitness.create({
      config: {
        coins: defaultCoins,
        currencies: defaultCurrencies,
        schema: XyoCoingeckoCryptoMarketWitnessConfigSchema,
        targetSchema: XyoCoingeckoCryptoMarketSchema,
      },
    })
    const [actual] = await sut.observe()

    expect(actual.schema).toBe(XyoCoingeckoCryptoMarketSchema)
    const answerWrapper = new PayloadWrapper(actual)
    expect(answerWrapper.valid).toBe(true)
  })

  test('returns observation [no config]', async () => {
    const sut = await XyoCoingeckoCryptoMarketWitness.create()
    const [actual] = await sut.observe()

    expect(actual.schema).toBe(XyoCoingeckoCryptoMarketSchema)
    const answerWrapper = new PayloadWrapper(actual)
    expect(answerWrapper.valid).toBe(true)
  })
})
