import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-connection-group-basic');

new cloudfront.ConnectionGroup(stack, 'connection-group');

new IntegTest(app, 'connection-group-basic-test', {
  testCases: [stack],
});
