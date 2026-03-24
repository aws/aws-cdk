import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';

const app = new App();
const stack = new Stack(app, 'RemovalPolicyOptionsStack');

const bucket = new s3.Bucket(stack, 'Bucket');
bucket.applyRemovalPolicy(RemovalPolicy.RETAIN, {
  applyToUpdateReplacePolicy: false,
});

new IntegTest(app, 'RemovalPolicyOptionsInteg', {
  testCases: [stack],
});
