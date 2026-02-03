import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ses from 'aws-cdk-lib/aws-ses';

const app = new App();
const stack = new Stack(app, 'aws-cdk-dedicated-ip-pool');

new ses.DedicatedIpPool(stack, 'Pool', {
  dedicatedIpPoolName: 'my-pool',
  scalingMode: ses.ScalingMode.MANAGED,
});

new integ.IntegTest(app, 'DedicatedIpPoolInteg', {
  testCases: [stack],
});

app.synth();
