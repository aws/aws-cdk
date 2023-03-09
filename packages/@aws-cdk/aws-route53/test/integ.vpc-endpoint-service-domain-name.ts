import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { PublicHostedZone, VpcEndpointServiceDomainName } from '../lib';

/**
 * A load balancer that can host a VPC Endpoint Service.
 *
 * Why do this instead of using the NetworkLoadBalancer construct? aws-route53
 * cannot depend on aws-elasticloadbalancingv2 because aws-elasticloadbalancingv2
 * already takes a dependency on aws-route53.
 */
class DummyEndpointLoadBalancer implements ec2.IVpcEndpointServiceLoadBalancer {
  /**
   * The ARN of the load balancer that hosts the VPC Endpoint Service
   */
  public readonly loadBalancerArn: string;
  constructor(scope: Construct, id: string, vpc: ec2.Vpc) {
    const lb = new cdk.CfnResource(scope, id, {
      type: 'AWS::ElasticLoadBalancingV2::LoadBalancer',
      properties: {
        Type: 'network',
        Name: 'mylb',
        Scheme: 'internal',
        Subnets: [vpc.privateSubnets[0].subnetId],
      },
    });
    this.loadBalancerArn = lb.ref;
  }
}

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-vpc-endpoint-dns-integ');
const vpc = new ec2.Vpc(stack, 'VPC');
const nlb = new DummyEndpointLoadBalancer(stack, 'mylb', vpc);
const vpces = new ec2.VpcEndpointService(stack, 'VPCES', {
  vpcEndpointServiceLoadBalancers: [nlb],
});
const zone = new PublicHostedZone(stack, 'PHZ', {
  zoneName: 'aws-cdk.dev',
});
new VpcEndpointServiceDomainName(stack, 'EndpointDomain', {
  endpointService: vpces,
  domainName: 'my-stuff.aws-cdk.dev',
  publicHostedZone: zone,
});

app.synth();
