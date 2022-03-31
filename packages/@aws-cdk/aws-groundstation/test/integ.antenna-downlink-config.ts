import { App, Stack } from '@aws-cdk/core';
import { AntennaDownlinkConfig, FrequencyUnits, Polarization } from '../lib';

const app = new App();
const stack = new Stack(app, 'aws-groundstation-antenna-downlink-config');

new AntennaDownlinkConfig(stack, 'AntennaDownlinkConfig_1', {
  configName: 'AntennaDownlinkConfig_1',
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

new AntennaDownlinkConfig(stack, 'AntennaDownlinkConfig_2', {
  configName: 'AntennaDownlinkConfig_2',
  spectrumConfig: {
    bandwidth: {
      units: FrequencyUnits.MHZ,
      value: 54,
    },
    centerFrequency: {
      units: FrequencyUnits.GHZ,
      value: 8400,
    },
    polarization: Polarization.NONE,
  },
});

app.synth();