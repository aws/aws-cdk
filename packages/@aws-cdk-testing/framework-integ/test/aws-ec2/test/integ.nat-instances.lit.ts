import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';

class NatInstanceStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);

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
const testCase = new NatInstanceStack(app, 'aws-cdk-vpc-nat-instances', {
  env: {
    account: process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION,
  },
});

new IntegTest(app, 'integ-test', {
  testCases: [testCase],
});
