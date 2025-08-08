import { App, RemovalPolicy, Stack } from 'aws-cdk-lib/core';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as ga from 'aws-cdk-lib/aws-globalaccelerator';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { ApplicationLoadBalancer } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { ApplicationLoadBalancerEndpoint } from 'aws-cdk-lib/aws-globalaccelerator-endpoints';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new Stack(app, 'global-accelerator-endpoints2');

const vpc = new Vpc(stack, 'Vpc');
const accelerator = new ga.Accelerator(stack, 'Accelerator');
const listener =
accelerator.addListener('Listener', {
  portRanges: [
    { fromPort: 80 },
    { fromPort: 443 },
  ],
});

const alb = new ApplicationLoadBalancer(stack, 'ALB', { vpc });
alb.applyRemovalPolicy(RemovalPolicy.DESTROY);

const group = listener.addEndpointGroup('Group', {
  endpoints: [new ApplicationLoadBalancerEndpoint(alb)],
});

// This add a custom resource to retrieve the security group id added by the service.
// If no security group is found, the deployment should fail
group.connectionsPeer('Peer', vpc);

new IntegTest(app, 'GlobalAcceleratorEndpoints', {
  testCases: [stack],
});

app.synth();
