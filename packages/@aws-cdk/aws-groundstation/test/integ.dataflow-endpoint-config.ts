import { App, Stack } from '@aws-cdk/core';
import { DataflowEndpointConfig, DataflowEndpointGroup } from '../lib';

const app = new App();
const stack = new Stack(app, 'aws-groundstation-configs');

new DataflowEndpointGroup(stack, 'DataflowEndpointGroup_1', {
  endpointDetails: [{
    endpoint: {
      address: {
        name: '172.10.0.2',
        port: 44720,
      },
      name: 'myEndpoint',
      mtu: 1500,
    },
  }],
});

new DataflowEndpointConfig(stack, 'DataflowEndpointConfig_1', {
  configName: 'DataflowEndpointConfig_1',
  dataflowEndpointName: 'myEndpoint',
  dataflowEndpointRegion: stack.region,
});

app.synth();