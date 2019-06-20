import ec2 = require('@aws-cdk/aws-ec2');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import asg = require('../lib');

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'VPC');
    const role = new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com')
    });

    new asg.AutoScalingGroup(this, 'ASG', {
      instanceType: ec2.InstanceType.pair(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      vpc,
      machineImage: new ec2.AmazonLinuxImage(),
      role
    });
  }
}

const app = new cdk.App();

new TestStack(app, 'integ-iam-external-role');

app.synth();