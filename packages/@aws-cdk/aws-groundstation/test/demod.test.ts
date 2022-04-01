import { DecodeConfigBuilder, DemodConfigBuilder, DemodType, Filter, FrequencyUnits, NodeType, TimingUnits } from '../lib';

describe('demodulation builder', () => {
  test('toString returns the demodulation config as a JSON string', () => {
    const builder = new DemodConfigBuilder({
      type: DemodType.QPSK,
      qpsk: {
        carrierFrequencyRecovery: {
          centerFrequency: {
            value: 7812,
            units: FrequencyUnits.MHZ,
          },
          range: {
            value: 250,
            units: FrequencyUnits.KHZ,
          },
        },
        symbolTimingRecovery: {
          symbolRate: {
            value: 15,
            units: TimingUnits.MSPS,
          },
          range: {
            value: 0.75,
            units: TimingUnits.KSPS,
          },
          matchedFilter: {
            type: Filter.ROOT_RAISED_COSINE,
            rolloffFactor: 0.5,
          },
        },
      },
    });
    expect(builder.toString()).toEqual('{"type":"QPSK","qpsk":{"carrierFrequencyRecovery":{"centerFrequency":{"value":7812,"units":"MHz"},"range":{"value":250,"units":"kHz"}},"symbolTimingRecovery":{"symbolRate":{"value":15,"units":"Msps"},"range":{"value":0.75,"units":"ksps"},"matchedFilter":{"type":"ROOT_RAISED_COSINE","rolloffFactor":0.5}}}}');
  });
});


describe('decoder builder', () => {
  test('toString returns the decoding config as a JSON string', () => {
    const builder = new DecodeConfigBuilder();
    builder.addNode('I-Ingress', {
      type: NodeType.CODED_SYMBOLS_INGRESS,
      codedSymbolsIngress: {
        source: 'I',
      },
    });
    builder.addNode('Q-Ingress', {
      type: NodeType.CODED_SYMBOLS_INGRESS,
      codedSymbolsIngress: {
        source: 'Q',
      },
    });
    builder.addNode('IQ-Recombiner', { type: NodeType.IQ_RECOMBINER });
    builder.addNode('CcsdsViterbiDecoder', {
      type: NodeType.CCSDS_171_133_VITERBI_DECODER,
      ccsds171133ViterbiDecoder: {
        codeRate: 'ONE_HALF',
      },
    });
    builder.addNode('NrzmDecoder', { type: NodeType.NRZ_M_DECODER });
    builder.addNode('UncodedFramesEgress', { type: NodeType.UNCODED_FRAMES_EGRESS });

    builder.addEdge('I-Ingress', 'IQ-Recombiner');
    builder.addEdge('Q-Ingress', 'IQ-Recombiner');
    builder.addEdge('IQ-Recombiner', 'CcsdsViterbiDecoder');
    builder.addEdge('CcsdsViterbiDecoder', 'NrzmDecoder');
    builder.addEdge('NrzmDecoder', 'UncodedFramesEgress');

    expect(builder.toString()).toEqual('{"edges":[{"from":"I-Ingress","to":"IQ-Recombiner"},{"from":"Q-Ingress","to":"IQ-Recombiner"},{"from":"IQ-Recombiner","to":"CcsdsViterbiDecoder"},{"from":"CcsdsViterbiDecoder","to":"NrzmDecoder"},{"from":"NrzmDecoder","to":"UncodedFramesEgress"}],"nodeConfigs":{"I-Ingress":{"type":"CODED_SYMBOLS_INGRESS","codedSymbolsIngress":{"source":"I"}},"Q-Ingress":{"type":"CODED_SYMBOLS_INGRESS","codedSymbolsIngress":{"source":"Q"}},"IQ-Recombiner":{"type":"IQ_RECOMBINER"},"CcsdsViterbiDecoder":{"type":"CCSDS_171_133_VITERBI_DECODER","ccsds171133ViterbiDecoder":{"codeRate":"ONE_HALF"}},"NrzmDecoder":{"type":"NRZ_M_DECODER"},"UncodedFramesEgress":{"type":"UNCODED_FRAMES_EGRESS"}}}');
  });

  test('builder fails when edges added without nodes', () => {
    const builder = new DecodeConfigBuilder();
    expect(() => builder.addEdge('I-Ingress', 'IQ-Recombiner')).toThrow();
  });
});