import { App, Stack } from '@aws-cdk/core';
import { AntennaUplinkConfig, EripUnits, FrequencyUnits, Polarization, UplinkEchoConfig } from '../lib';

const app = new App();
const stack = new Stack(app, 'aws-groundstation-configs');

const antennaUplinkConfig = new AntennaUplinkConfig(stack, 'AntennaUplinkConfig_1', {
  configName: 'AntennaUplinkConfig_1',
  spectrumConfig: {
    centerFrequency: {
      value: 2072.5,
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

new UplinkEchoConfig(stack, 'AntennaUplinkEchoConfig_1', {
  configName: 'AntennaUplinkEchoConfig_1',
  antennaUplinkConfig,
  enabled: true,
});

app.synth();