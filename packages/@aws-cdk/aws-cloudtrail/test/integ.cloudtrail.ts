import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as cloudtrail from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'CloudtrailIntegTestStack');

new cloudtrail.Trail(stack, 'Trail', {
  isOrganizationTrail: true,
});

new integ.IntegTest(app, 'TrailIntegTest', {
  testCases: [stack],
});

app.synth();