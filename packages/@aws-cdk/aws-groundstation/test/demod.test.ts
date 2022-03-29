import { DemodConfigBuilder, DemodType } from '../lib';

describe('demodulation builder', () => {
  test('toString returns the demodulation config as a JSON string', () => {
    const builder = new DemodConfigBuilder({
      type: DemodType.QPSK,
      qpsk: {
        carrierFrequencyRecovery: {
          centerFrequency: {
            value: 7812,
            units: 'MHz',
          },
          range: {
            value: 250,
            units: 'kHz',
          },
        },
        symbolTimingRecovery: {
          symbolRate: {
            value: 15,
            units: 'Msps',
          },
          range: {
            value: 0.75,
            units: 'ksps',
          },
          matchedFilter: {
            type: 'ROOT_RAISED_COSINE',
            rolloffFactor: 0.5,
          },
        },
      },
    });
    expect(builder.toString()).toEqual('{"type":"QPSK","qpsk":{"carrierFrequencyRecovery":{"centerFrequency":{"value":7812,"units":"MHz"},"range":{"value":250,"units":"kHz"}},"symbolTimingRecovery":{"symbolRate":{"value":15,"units":"Msps"},"range":{"value":0.75,"units":"ksps"},"matchedFilter":{"type":"ROOT_RAISED_COSINE","rolloffFactor":0.5}}}}');
  });
});