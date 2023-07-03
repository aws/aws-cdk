/// !cdk-integ pragma:enable-lookups
import * as cdk from '../../core';
import * as ec2 from '../lib';

class NatInstanceStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /// !show
    // Configure the `natGatewayProvider` when defining a Vpc
    const natGatewayProvider = ec2.NatProvider.instance({
      instanceType: new ec2.InstanceType('t3.small'),
    });

    const vpc = new ec2.Vpc(this, 'MyVpc', {
      natGatewayProvider,

      // The 'natGateways' parameter now controls the number of NAT instances
      natGateways: 2,
    });
    /// !hide

    Array.isArray(vpc);
    Array.isArray(natGatewayProvider.configuredGateways);
  }
}

const app = new cdk.App();
new NatInstanceStack(app, 'aws-cdk-vpc-nat-instances', {
  env: {
    account: process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION,
  },
});
app.synth();
