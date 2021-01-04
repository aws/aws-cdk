
import * as ec2 from '@aws-cdk/aws-ec2';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as cdk from '@aws-cdk/core';
import * as constructs from 'constructs';
import * as ga from '../lib';
import * as testfixture from './util';

class GaStack extends testfixture.TestStack {
  constructor(scope: constructs.Construct, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'VPC', { maxAzs: 3, natGateways: 1 });
    const accelerator = new ga.Accelerator(this, 'Accelerator');
    const listener = new ga.Listener(this, 'Listener', {
      accelerator,
      portRanges: [
        {
          fromPort: 80,
          toPort: 80,
        },
      ],
    });
    const endpointGroup = new ga.EndpointGroup(this, 'Group', { listener });
    const alb = new elbv2.ApplicationLoadBalancer(this, 'ALB', { vpc, internetFacing: true });
    const nlb = new elbv2.NetworkLoadBalancer(this, 'NLB', { vpc, internetFacing: true });
    const eip = new ec2.CfnEIP(this, 'ElasticIpAddress');
    const instances = new Array<ec2.Instance>();

    for ( let i = 0; i < 2; i++) {
      instances.push(new ec2.Instance(this, `Instance${i}`, {
        vpc,
        machineImage: new ec2.AmazonLinuxImage(),
        instanceType: new ec2.InstanceType('t3.small'),
      }));
    }

    endpointGroup.addLoadBalancer('AlbEndpoint', alb);
    endpointGroup.addLoadBalancer('NlbEndpoint', nlb);
    endpointGroup.addElasticIpAddress('EipEndpoint', eip);
    endpointGroup.addEc2Instance('InstanceEndpoint', instances[0]);
    endpointGroup.addEndpoint('InstanceEndpoint2', instances[1].instanceId);

  }
}

const app = new cdk.App();

new GaStack(app, 'integ-globalaccelerator');
