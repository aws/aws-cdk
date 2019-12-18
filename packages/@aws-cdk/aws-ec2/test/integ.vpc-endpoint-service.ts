import * as cdk from '@aws-cdk/core';
import * as ec2 from '../lib';

const app = new cdk.App();

class VpcEndpointServiceStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const nlbArnNoPrincipals = "arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/9bn6qkf4e9jrw77a";

    new ec2.VpcEndpointService(this, "MyVpcEndpointServiceWithNoPrincipals", {
      networkLoadBalancerArns: [nlbArnNoPrincipals],
      acceptanceRequired: false,
      whitelistedPrincipalIds: []
    });

    const nlbArnWithPrincipals = "arn:aws:elasticloadbalancing:us-east-1:123456789012:loadbalancer/net/Test/1jd81k39sa421ffs";
    const principalArn = "arn:aws:iam::123456789012:root";

    new ec2.VpcEndpointService(this, "MyVpcEndpointServiceWithPrincipals", {
      networkLoadBalancerArns: [nlbArnWithPrincipals],
      acceptanceRequired: false,
      whitelistedPrincipalIds: [principalArn]
    });
  }
}

new VpcEndpointServiceStack(app, 'aws-cdk-ec2-vpc-endpoint-service');
app.synth();
