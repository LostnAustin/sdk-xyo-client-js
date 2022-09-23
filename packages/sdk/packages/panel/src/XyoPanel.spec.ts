import { XyoMemoryArchivist } from '@xyo-network/archivist'
import { XyoBoundWitness, XyoBoundWitnessSchema } from '@xyo-network/boundwitness'
import { XyoIdWitness } from '@xyo-network/id-payload-plugin'
import { XyoNodeSystemInfoWitness } from '@xyo-network/node-system-info-payload-plugin'
import { PayloadWrapper } from '@xyo-network/payload'
import { XyoWitness } from '@xyo-network/witness'
import { XyoAdhocWitness } from '@xyo-network/witnesses'

import { XyoPanel, XyoPanelConfig } from './XyoPanel'

describe('XyoPanel', () => {
  test('all [simple panel send]', async () => {
    const archivist = new XyoMemoryArchivist()

    const witnesses: XyoWitness[] = [new XyoIdWitness({ salt: 'test' }), new XyoNodeSystemInfoWitness()]

    const config: XyoPanelConfig = { witnesses }

    const panel = new XyoPanel(config, archivist)
    const adhocWitness = new XyoAdhocWitness({
      schema: 'network.xyo.test.array',
      testArray: [1, 2, 3],
      testBoolean: true,
      testNull: null,
      testNullObject: { t: null, x: undefined },
      testNumber: 5,
      testObject: { t: 1 },
      testSomeNullObject: { s: 1, t: null, x: undefined },
      testString: 'hi',
      testUndefined: undefined,
    })

    const adhocObserved = await adhocWitness.observe()

    expect(adhocObserved).toBeDefined()

    const report1Result = await panel.report([adhocWitness])
    const report1 = report1Result[1][0] as XyoBoundWitness
    expect(report1.schema).toBe(XyoBoundWitnessSchema)
    expect(report1.payload_hashes.length).toBe(3)
    const report2 = (await panel.report())[1][0] as XyoBoundWitness
    expect(report2.schema).toBeDefined()
    expect(report2.payload_hashes.length).toBe(2)

    expect(new PayloadWrapper(report2).hash !== new PayloadWrapper(report1).hash).toBe(true)
  })
})
