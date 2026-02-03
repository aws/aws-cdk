import * as integ from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import * as ivs from '../lib';

const app = new App();

// Hardcoded to us-east-1 because IVS service is only available in specific regions
const stack = new Stack(app, 'aws-cdk-ivs-insecure-ingest', {
  env: { region: 'us-east-1' },
});

new ivs.Channel(stack, 'ChannelInsecureIngestEnabled', {
  type: ivs.ChannelType.STANDARD,
  insecureIngest: true,
});

new integ.IntegTest(app, 'ivs-insecure-ingest-test', {
  testCases: [stack],
});
