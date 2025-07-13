import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { App, Stack } from 'aws-cdk-lib';

const app = new App();
const stack = new Stack(app, 'aws-cdk-nlb-attributes-integ');

const vpc = new ec2.Vpc(stack, 'VPC', {
  restrictDefaultSecurityGroup: false,
  maxAzs: 2,
});

new elbv2.NetworkLoadBalancer(stack, 'NLB', {
  vpc,
  crossZoneEnabled: true,
  deletionProtection: false,
  clientRoutingPolicy: elbv2.ClientRoutingPolicy.PARTIAL_AVAILABILITY_ZONE_AFFINITY,
  zonalShift: true,
});

new integ.IntegTest(app, 'nlb-attlibutes-integ', {
  testCases: [stack],
});
