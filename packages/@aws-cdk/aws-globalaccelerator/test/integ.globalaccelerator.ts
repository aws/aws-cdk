import * as ec2 from '@aws-cdk/aws-ec2';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as cdk from '@aws-cdk/core';
import * as ga from '../lib';

export class GlobalAcceleratorStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps = {}) {
    super(scope, id, props);

    const vpc = getOrCreateVpc(this);

    const accelerator = new ga.Accelerator(this, 'Accelerator');

    const listener = new ga.Listener(this, 'Listener', {
      accelerator,
      portRanges: [
        {
          fromPort: 80,
          toPort: 80,
        }
      ]
    });

    const alb = new elbv2.ApplicationLoadBalancer(this, 'ALB', { vpc });
    const nlb = new elbv2.NetworkLoadBalancer(this, 'NLB', { vpc });

    const endpointGroup = new ga.EndpointGroup(this, 'Group', { listener });

    endpointGroup.addLoadBalancer('AlbEndpoint', alb);

    endpointGroup.addEndpoint('NlbEndpoint', {
      endpointId: nlb.loadBalancerArn,
      clientIpReservation: true,
      weight: 128,
    } );

    new cdk.CfnOutput(this, 'GroupArn', { value: endpointGroup.EndpointGroupArn } );

  }
}

const app = new cdk.App();

const env = {
  region: process.env.CDK_DEFAULT_REGION,
  account: process.env.CDK_DEFAULT_ACCOUNT,
};

new GlobalAcceleratorStack(app, 'GA', { env });

function getOrCreateVpc(scope: cdk.Construct): ec2.IVpc {
  // use an existing vpc or create a new one
  const vpc = scope.node.tryGetContext('use_default_vpc') === '1' ?
    ec2.Vpc.fromLookup(scope, 'Vpc', { isDefault: true }) :
    scope.node.tryGetContext('use_vpc_id') ?
      ec2.Vpc.fromLookup(scope, 'Vpc', { vpcId: scope.node.tryGetContext('use_vpc_id') }) :
      new ec2.Vpc(scope, 'Vpc', { maxAzs: 3, natGateways: 1 });

  return vpc;
}
