/// !cdk-integ *
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';

const app = new cdk.App();

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC');

    new ec2.BastionHostLinux(this, 'BastionHost', { vpc });
  }
}

new TestStack(app, 'TestStack');

app.synth();
