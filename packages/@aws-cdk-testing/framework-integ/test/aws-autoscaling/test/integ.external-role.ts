import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import * as asg from 'aws-cdk-lib/aws-autoscaling';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'VPC', { restrictDefaultSecurityGroup: false });
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
