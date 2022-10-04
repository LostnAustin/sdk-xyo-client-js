import { XyoNodeSystemInfoWitness } from './Witness'

describe('XyoSystemInfoWitness', () => {
  test('observe', async () => {
    const witness = new XyoNodeSystemInfoWitness()
    const [observation] = await witness.observe()
    expect(observation.schema).toBe('network.xyo.system.info.node')
  }, 60000)
})
