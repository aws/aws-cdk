/// !cdk-integ *
import { PolicyStatement } from '@aws-cdk/aws-iam';
import cdk = require('@aws-cdk/core');
import ec2 = require("../lib");

const app = new cdk.App();

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC');

    const instance = new ec2.Instance(this, 'Instance', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.NANO),
      machineImage: new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 }),
    });

    instance.addToRolePolicy(new PolicyStatement({
      actions: ['ssm:*'],
      resources: ['*']
    }));

    instance.connections.allowFromAnyIpv4(ec2.Port.icmpPing());

    instance.addUserData('yum install -y');
  }
}

new TestStack(app, 'TestStack');

app.synth();
