import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as s3 from 'aws-cdk-lib/aws-s3';

const app = new App();
// No env specified - environment-agnostic stack
const stack = new Stack(app, 'ALBAccessLogsAgnosticStack');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2 });
const bucket = new s3.Bucket(stack, 'LogBucket');
const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });

lb.logAccessLogs(bucket);

new IntegTest(app, 'ALBAccessLogsAgnosticInteg', {
  testCases: [stack],
});
