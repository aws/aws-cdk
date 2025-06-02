import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from 'aws-cdk-lib/custom-resources';

/*
 *
 * Stack verification steps:
 *
 * aws lambda get-function-configuration --function-name <deployed-function-name>: should include a VPC config
 *
 */

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new cdk.Stack(app, 'aws-cdk-customresources-vpc');
const vpc = new ec2.Vpc(stack, 'Vpc', { restrictDefaultSecurityGroup: false });
new AwsCustomResource(stack, 'DescribeVpcAttribute', {
  onUpdate: {
    service: 'EC2',
    action: 'describeVpcAttribute',
    parameters: {
      VpcId: vpc.vpcId,
      Attribute: 'enableDnsHostnames',
    },
    physicalResourceId: PhysicalResourceId.of(vpc.vpcId),
  },
  policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
  timeout: cdk.Duration.minutes(3),
  vpc: vpc,
  vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
});

new IntegTest(app, 'CustomResourceVpc', {
  testCases: [stack],
  diffAssets: true,
});

app.synth();
