import { App, Stack } from '@aws-cdk/core';
import { Autotrack, TrackingConfig } from '../lib';

const app = new App();
const stack = new Stack(app, 'aws-groundstation-configs');

new TrackingConfig(stack, 'TrackingConfig', {
  configName: 'TrackingConfig',
  autotrack: Autotrack.PREFERRED,
});

app.synth();