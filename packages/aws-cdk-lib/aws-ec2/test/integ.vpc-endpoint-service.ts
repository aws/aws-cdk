import * as cdk from '../../core';
import * as ec2 from '../lib';
import { IVpcEndpointServiceLoadBalancer } from '../lib';

const app = new cdk.App();

class DummyEndpointLoadBalacer implements IVpcEndpointServiceLoadBalancer {
  /**
   * The ARN of the load balancer that hosts the VPC Endpoint Service
   */
  public readonly loadBalancerArn: string;
  constructor(arn: string) {
    this.loadBalancerArn = arn;
  }
}

class TestStack extends cdk.Stack {
  constructor(scope:cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const lb = new DummyEndpointLoadBalacer('arn:aws:elasticloadbalancing:us-east-1:384434886796:loadbalancer/net/Test/testLB');
    new ec2.VpcEndpointService(this, 'vpcEndpointService', {
      vpcEndpointServiceLoadBalancers: [lb],
      acceptanceRequired: true,
      contributorInsightsEnabled: true,
    });
  }

}

new TestStack(app, 'TestStack');

app.synth();
