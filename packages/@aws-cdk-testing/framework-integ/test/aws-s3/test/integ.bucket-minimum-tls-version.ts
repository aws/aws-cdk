import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as s3 from 'aws-cdk-lib/aws-s3';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-s3-minimum-tls-version');

new s3.Bucket(stack, 'Bucket', {
  enforceSSL: true,
  minimumTLSVersion: 1.2,
});

new integ.IntegTest(app, 'aws-cdk-s3-minimum-tls-version-integration', {
  testCases: [stack],
});

app.synth();
