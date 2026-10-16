import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

class VpcEndpointCfnSubnetStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC with no L2-managed subnets — subnets created directly via L1
    const vpc = new ec2.Vpc(this, 'VPC', { subnetConfiguration: [] });

    const cfnSubnet = new ec2.CfnSubnet(this, 'PrivateSubnet', {
      vpcId: vpc.vpcId,
      cidrBlock: '10.0.1.0/24',
      availabilityZone: cdk.Stack.of(this).availabilityZones[0],
    });

    // Passing a CfnSubnet (L1) directly — the framework wraps it automatically.
    // Without the fix this results in an empty SubnetIds array in the template.
    vpc.addInterfaceEndpoint('SSMEndpoint', {
      service: ec2.InterfaceVpcEndpointAwsService.SSM,
      subnets: { subnets: [cfnSubnet as any] },
    });
  }
}

const stack = new VpcEndpointCfnSubnetStack(app, 'aws-cdk-ec2-vpc-endpoint-cfn-subnet', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});

new IntegTest(app, 'VpcEndpointCfnSubnetTest', {
  testCases: [stack],
});
