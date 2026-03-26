import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cloudtrail from 'aws-cdk-lib/aws-cloudtrail';

const app = new cdk.App({ context: { '@aws-cdk/core:disableGitSource': true } });
const stack = new cdk.Stack(app, 'integ-cloudtrail-defaults');

new cloudtrail.Trail(stack, 'Trail');

new integ.IntegTest(app, 'CloudTrailDefaultsTest', {
  testCases: [stack],
});

app.synth();
