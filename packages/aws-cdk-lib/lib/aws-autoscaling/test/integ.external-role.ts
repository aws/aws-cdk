import * as ec2 from '../../aws-ec2';
import * as iam from '../../aws-iam';
import * as cdk from '../../core';
import * as asg from '../lib';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'VPC');
    const role = new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
    });

    new asg.AutoScalingGroup(this, 'ASG', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      vpc,
      machineImage: new ec2.AmazonLinuxImage(),
      role,
    });
  }
}

const app = new cdk.App();

new TestStack(app, 'integ-iam-external-role');

app.synth();
