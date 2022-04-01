import { App, Stack } from '@aws-cdk/core';
import { AntennaUplinkConfig, EripUnits, FrequencyUnits, Polarization } from '../lib';

const app = new App();
const stack = new Stack(app, 'aws-groundstation-configs');

new AntennaUplinkConfig(stack, 'AntennaUplinkConfig_1', {
  configName: 'AntennaUplinkConfig_1',
  spectrumConfig: {
    centerFrequency: {
      value: 2100,
      units: FrequencyUnits.MHZ,
    },
    polarization: Polarization.RIGHT_HAND,
  },
  targetEirp: {
    value: 20,
    units: EripUnits.DBW,
  },
  transmitDisabled: false,
});

app.synth();