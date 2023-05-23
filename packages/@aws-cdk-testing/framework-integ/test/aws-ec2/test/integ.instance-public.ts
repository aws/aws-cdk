import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';

const app = new cdk.App();

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);

    const vpc = new ec2.Vpc(this, 'VPC', {
      cidr: '10.0.0.0/16',
      natGateways: 0,
      maxAzs: 3,
      subnetConfiguration: [
        {
          name: 'public-subnet-1',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: 24,
        },
      ],
    });

    const securityGroup = new ec2.SecurityGroup(this, 'IntegSg', {
      vpc,
      allowAllIpv6Outbound: true,
    });

    const instance = new ec2.Instance(this, 'Instance', {
      vpc,
      vpcSubnets: { subnetGroupName: 'public-subnet-1' },
      securityGroup,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.NANO),
      machineImage: new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 }),
      detailedMonitoring: true,
      associatePublicIpAddress: true,
    });

    instance.addToRolePolicy(new PolicyStatement({
      actions: ['ssm:*'],
      resources: ['*'],
    }));

    instance.connections.allowFromAnyIpv4(ec2.Port.icmpPing());

    instance.addUserData('yum install -y');
  }
}

const testCase = new TestStack(app, 'integ-ec2-instance');

new IntegTest(app, 'instance-test', {
  testCases: [testCase],
});
