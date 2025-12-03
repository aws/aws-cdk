import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

const app = new cdk.App();

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC', {
      maxAzs: 3,
      natGateways: 1,
    });

    // Test instance with comprehensive metadata options
    new ec2.Instance(this, 'InstanceWithMetadataOptions', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.NANO),
      machineImage: new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 }),
      httpEndpoint: true,
      httpProtocolIpv6: false,
      httpPutResponseHopLimit: 2,
      httpTokens: ec2.HttpTokens.REQUIRED,
      instanceMetadataTags: true,
    });

    // Test instance with partial metadata options
    new ec2.Instance(this, 'InstanceWithPartialMetadataOptions', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.NANO),
      machineImage: new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 }),
      httpTokens: ec2.HttpTokens.REQUIRED,
      instanceMetadataTags: true,
    });

    // Test instance with backward compatibility (requireImdsv2)
    new ec2.Instance(this, 'InstanceWithRequireImdsv2', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.NANO),
      machineImage: new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 }),
      requireImdsv2: true,
    });
  }
}

const testCase = new TestStack(app, 'integ-ec2-instance-metadata-options');

new IntegTest(app, 'instance-metadata-options-test', {
  testCases: [testCase],
});
