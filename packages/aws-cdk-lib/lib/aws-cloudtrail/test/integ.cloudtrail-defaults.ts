import * as cdk from '../../core';
import * as integ from '../../integ-tests';
import * as cloudtrail from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-cloudtrail-defaults');

new cloudtrail.Trail(stack, 'Trail');

new integ.IntegTest(app, 'CloudTrailDefaultsTest', {
  testCases: [stack],
});

app.synth();