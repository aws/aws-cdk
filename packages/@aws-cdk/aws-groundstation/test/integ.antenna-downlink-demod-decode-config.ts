import { App, Stack } from '@aws-cdk/core';
import {
  AntennaDownlinkDemodDecodeConfig,
  DecodeConfigBuilder,
  DemodConfigBuilder,
  DemodType,
  Filter,
  FrequencyUnits,
  NodeType,
  Polarization,
  TimingUnits,
} from '../lib';

const app = new App();
const stack = new Stack(app, 'aws-groundstation-configs');

const decodeConfigBuilder_1 = new DecodeConfigBuilder();
decodeConfigBuilder_1.addNode('I-Ingress', {
  type: NodeType.CODED_SYMBOLS_INGRESS,
  codedSymbolsIngress: {
    source: 'I',
  },
});
decodeConfigBuilder_1.addNode('Q-Ingress', {
  type: NodeType.CODED_SYMBOLS_INGRESS,
  codedSymbolsIngress: {
    source: 'Q',
  },
});
decodeConfigBuilder_1.addNode('IQ-Recombiner', { type: NodeType.IQ_RECOMBINER });
decodeConfigBuilder_1.addNode('CcsdsViterbiDecoder', {
  type: NodeType.CCSDS_171_133_VITERBI_DECODER,
  ccsds171133ViterbiDecoder: {
    codeRate: 'ONE_HALF',
  },
});
decodeConfigBuilder_1.addNode('NrzmDecoder', { type: NodeType.NRZ_M_DECODER });
decodeConfigBuilder_1.addNode('UncodedFramesEgress', { type: NodeType.UNCODED_FRAMES_EGRESS });

decodeConfigBuilder_1.addEdge('I-Ingress', 'IQ-Recombiner');
decodeConfigBuilder_1.addEdge('Q-Ingress', 'IQ-Recombiner');
decodeConfigBuilder_1.addEdge('IQ-Recombiner', 'CcsdsViterbiDecoder');
decodeConfigBuilder_1.addEdge('CcsdsViterbiDecoder', 'NrzmDecoder');
decodeConfigBuilder_1.addEdge('NrzmDecoder', 'UncodedFramesEgress');

const demodConfigBuilder_1 = new DemodConfigBuilder({
  type: DemodType.QPSK,
  qpsk: {
    carrierFrequencyRecovery: {
      centerFrequency: {
        units: FrequencyUnits.MHZ,
        value: 7812,
      },
      range: {
        units: FrequencyUnits.KHZ,
        value: 250,
      },
    },
    symbolTimingRecovery: {
      matchedFilter: {
        rolloffFactor: 1,
        type: Filter.ROOT_RAISED_COSINE,
      },
      symbolRate: {
        value: 15,
        units: TimingUnits.MSPS,
      },
      range: {
        value: 0.75,
        units: TimingUnits.KSPS,
      },
    },
  },
});


new AntennaDownlinkDemodDecodeConfig(stack, 'AntennaDownlinkDemodDecodeConfig_1', {
  configName: 'AntennaDownlinkDemodDecodeConfig_1',
  demodulationConfig: {
    unvalidatedJSON: decodeConfigBuilder_1.toString(),
  },
  decodeConfig: {
    unvalidatedJSON: demodConfigBuilder_1.toString(),
  },
  spectrumConfig: {
    bandwidth: {
      units: FrequencyUnits.MHZ,
      value: 10,
    },
    centerFrequency: {
      units: FrequencyUnits.MHZ,
      value: 2200,
    },
    polarization: Polarization.LEFT_HAND,
  },
});

app.synth();