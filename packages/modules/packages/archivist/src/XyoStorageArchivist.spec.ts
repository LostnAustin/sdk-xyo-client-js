/**
 * @jest-environment jsdom
 */

import { XyoModuleResolver } from '@xyo-network/module'
import { PayloadWrapper } from '@xyo-network/payload'

import { testArchivistAll, testArchivistRoundTrip } from './test.spec.test'
import { XyoMemoryArchivist } from './XyoMemoryArchivist'
import { XyoStorageArchivist, XyoStorageArchivistConfigSchema } from './XyoStorageArchivist'

testArchivistRoundTrip(XyoStorageArchivist.create({ config: { namespace: 'test', schema: XyoStorageArchivistConfigSchema, type: 'local' } }), 'local')
testArchivistRoundTrip(
  XyoStorageArchivist.create({
    config: { namespace: 'test', schema: XyoStorageArchivistConfigSchema, type: 'session' },
  }),
  'session',
)
testArchivistRoundTrip(
  XyoStorageArchivist.create({
    config: { namespace: 'test', schema: XyoStorageArchivistConfigSchema, type: 'page' },
  }),
  'page',
)

testArchivistAll(
  XyoStorageArchivist.create({
    config: { namespace: 'test', schema: XyoStorageArchivistConfigSchema, type: 'local' },
  }),
  'local',
)
testArchivistAll(
  XyoStorageArchivist.create({
    config: { namespace: 'test', schema: XyoStorageArchivistConfigSchema, type: 'session' },
  }),
  'session',
)
testArchivistAll(
  XyoStorageArchivist.create({
    config: { namespace: 'test', schema: XyoStorageArchivistConfigSchema, type: 'page' },
  }),
  'page',
)

test('XyoArchivist Private Key Save', async () => {
  const storage = await XyoStorageArchivist.create({
    config: { namespace: 'test', persistAccount: true, schema: XyoStorageArchivistConfigSchema, type: 'local' },
  })
  const address = storage.address
  const storage2 = await XyoStorageArchivist.create({
    config: { namespace: 'test', persistAccount: true, schema: XyoStorageArchivistConfigSchema, type: 'local' },
  })
  expect(storage2.address).toBe(address)
})

test('XyoArchivist Parent Write Through', async () => {
  const memory = await XyoMemoryArchivist.create()

  const storage = await XyoStorageArchivist.create({
    config: {
      namespace: 'test',
      parents: { write: [memory.address] },
      persistAccount: true,
      schema: XyoStorageArchivistConfigSchema,
      type: 'local',
    },
    resolver: new XyoModuleResolver().add(memory),
  })
  await storage.start()

  const wrapper = new PayloadWrapper({ schema: 'network.xyo.test' })

  await storage.insert([wrapper.payload])

  expect((await storage.get([wrapper.hash])).length).toBe(1)
  expect((await memory.get([wrapper.hash])).length).toBe(1)
})
