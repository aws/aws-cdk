import * as cdk from 'aws-cdk-lib';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'route53-accelerated-recovery');

new route53.PublicHostedZone(stack, 'HostedZone', {
  zoneName: 'cdk.test',
  acceleratedRecoveryEnabled: true,
});

new IntegTest(app, 'route53-accelerated-recovery-integ', {
  testCases: [stack],
});
