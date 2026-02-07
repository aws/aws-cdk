import * as integ from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import * as ivs from '../lib';

const app = new App();

const stack = new Stack(app, 'aws-cdk-ivs-insecure-ingest');

new ivs.Channel(stack, 'ChannelInsecureIngestEnabled', {
  type: ivs.ChannelType.STANDARD,
  insecureIngest: true,
});

new integ.IntegTest(app, 'ivs-insecure-ingest-test', {
  testCases: [stack],
  regions: ['us-east-1', 'us-west-2', 'eu-west-1', 'eu-central-1', 'ap-northeast-1', 'ap-northeast-2', 'ap-south-1'], // IVS is only available in these regions
});
