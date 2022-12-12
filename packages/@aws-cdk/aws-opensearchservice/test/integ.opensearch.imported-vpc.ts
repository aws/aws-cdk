import * as ec2 from '@aws-cdk/aws-ec2';
import { IVpc, SubnetType } from '@aws-cdk/aws-ec2';
import { App, Stack, StackProps, RemovalPolicy, CfnResource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as opensearch from '../lib';
import * as integ from '@aws-cdk/integ-tests';

const appWithVpc = new App();
const stack = new Stack(appWithVpc, 'StackWithVpc', {
  env: {
    account: process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION,
  },
});
new ec2.Vpc(stack, 'MyVpc', {
  vpcName: 'my-vpc-name',
  maxAzs: 2,
});

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const serviceLinkedRole = new CfnResource(this, 'ServiceLinkedRole', {
      type: 'AWS::IAM::ServiceLinkedRole',
      properties: {
        AWSServiceName: 'opensearchservice.amazonaws.com',
        Description: 'Role for OpenSearch VPC Test',
      },
    });

    const vpc: IVpc = ec2.Vpc.fromLookup(this, 'Vpc', {
      vpcName: 'my-vpc-name',
    });

    const subnets = vpc.selectSubnets({ subnetType: SubnetType.PRIVATE_WITH_EGRESS });

    const domainProps: opensearch.DomainProps = {
      version: opensearch.EngineVersion.ELASTICSEARCH_7_1,
      removalPolicy: RemovalPolicy.DESTROY,
      vpc: vpc,
      vpcSubnets: [subnets],
      zoneAwareness: {
        enabled: true,
        availabilityZoneCount: 3,
      },
      capacity: {
        dataNodes: 2,
      },
    };

    const domain = new opensearch.Domain(this, 'Domain', domainProps);
    domain.node.addDependency(serviceLinkedRole);
  }
}

const app = new App();
const env = {
  account: process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION,
};
const testCase = new TestStack(app, 'cdk-integ-opensearch-vpc', { env });
new integ.IntegTest(app, 'cdk-integ-opensearch-vpc-test', {
  testCases: [testCase],
});
app.synth();
