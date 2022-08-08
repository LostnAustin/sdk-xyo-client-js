import { XyoLocationPayload } from './Payload'
import { XyoLocationPayloadSchema } from './Schema'

export const XyoLocationPayloadTemplate = (): XyoLocationPayload => {
  return {
    currentLocation: {
      coords: {
        accuracy: undefined,
        altitude: undefined,
        altitudeAccuracy: undefined,
        heading: undefined,
        latitude: undefined,
        longitude: undefined,
        speed: undefined,
      },
      timestamp: Date.now(),
    },
    schema: XyoLocationPayloadSchema,
  }
}