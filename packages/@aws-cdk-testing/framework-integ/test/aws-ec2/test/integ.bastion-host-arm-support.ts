/*
 * Stack verification steps:
 * * aws ssm start-session --target <bastion host instance id>
 * * lscpu  # Architecture should be aarch64
 */
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';

const app = new cdk.App();

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    this.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);

    const vpc = new ec2.Vpc(this, 'VPC');

    new ec2.BastionHostLinux(this, 'BastionHost', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T4G, ec2.InstanceSize.NANO),
    });
  }
}

new TestStack(app, 'TestStack');

app.synth();
