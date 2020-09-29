import { ArnPrincipal } from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as ec2 from '../lib';

const app = new cdk.App();

/**
 * A load balancer that can host a VPC Endpoint Service
 */
class DummyEndpointLoadBalacer implements ec2.IVpcEndpointServiceLoadBalancer {
  /**
   * The ARN of the load balancer that hosts the VPC Endpoint Service
   */
  public readonly loadBalancerArn: string;
  constructor(arn: string) {
    this.loadBalancerArn = arn;
  }
}

class VpcEndpointServiceStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const nlbNoPrincipals = new DummyEndpointLoadBalacer(
      'arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/9bn6qkf4e9jrw77a');

    const service1 = new ec2.VpcEndpointService(this, 'MyVpcEndpointServiceWithNoPrincipals', {
      vpcEndpointServiceLoadBalancers: [nlbNoPrincipals],
      acceptanceRequired: false,
      whitelistedPrincipals: [],
    });

    const nlbWithPrincipals = new DummyEndpointLoadBalacer(
      'arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/1jd81k39sa421ffs');
    const principalArn = new ArnPrincipal('arn:aws:iam::123456789012:root');

    const service2 = new ec2.VpcEndpointService(this, 'MyVpcEndpointServiceWithPrincipals', {
      vpcEndpointServiceLoadBalancers: [nlbWithPrincipals],
      acceptanceRequired: false,
      whitelistedPrincipals: [principalArn],
    });

    new cdk.CfnOutput(this, 'MyVpcEndpointServiceWithNoPrincipalsServiceName', {
      exportName: 'ServiceName',
      value: service1.vpcEndpointServiceName,
      description: 'Give this to service consumers so they can connect via VPC Endpoint',
    });

    new cdk.CfnOutput(this, 'MyVpcEndpointServiceWithPrincipalsEndpointServiceId', {
      exportName: 'EndpointServiceId',
      value: service2.vpcEndpointServiceId,
      description: 'Reference this service from other stacks',
    });
  }
}

new VpcEndpointServiceStack(app, 'aws-cdk-ec2-vpc-endpoint-service');
app.synth();