import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { ArnPrincipal } from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';

const app = new cdk.App();

class VpcEndpointServiceStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC', { restrictDefaultSecurityGroup: false });
    const nlbNoPrincipals = new elbv2.NetworkLoadBalancer(this, 'NLBNoPrincipals', {
      vpc,
    });

    const service1 = new ec2.VpcEndpointService(this, 'MyVpcEndpointServiceWithNoPrincipals', {
      vpcEndpointServiceLoadBalancers: [nlbNoPrincipals],
      acceptanceRequired: false,
      allowedPrincipals: [],
    });

    const nlbWithPrincipals = new elbv2.NetworkLoadBalancer(this, 'NLBWithPrincipals', {
      vpc,
    });
    const principalArn = new ArnPrincipal('arn:aws:iam::123456789012:root');
    const servicePrincipal = new ArnPrincipal('ec2.amazonaws.com');

    const service2 = new ec2.VpcEndpointService(this, 'MyVpcEndpointServiceWithPrincipals', {
      vpcEndpointServiceLoadBalancers: [nlbWithPrincipals],
      acceptanceRequired: false,
      allowedPrincipals: [principalArn, servicePrincipal],
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
