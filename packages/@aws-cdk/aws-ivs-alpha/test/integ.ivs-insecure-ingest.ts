import { App, Stack } from 'aws-cdk-lib';
import * as ivs from '../lib';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new App();

const stack = new Stack(app, 'aws-cdk-ivs-insecure-ingest');

new ivs.Channel(stack, 'ChannelInsecureIngestEnabled', {
  type: ivs.ChannelType.STANDARD,
  insecureIngest: true,
});

new integ.IntegTest(app, 'ivs-insecure-ingest-test', {
  testCases: [stack],
});
