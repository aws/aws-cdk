import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Stack, App, StackProps, CfnOutput } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { Construct } from 'constructs';
import * as cloud9 from '../lib';
import { ImageId, Owner } from '../lib';
import { AnyPrincipal, Role } from 'aws-cdk-lib/aws-iam';

class Cloud9Env extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC', {
      restrictDefaultSecurityGroup: false,
      maxAzs: 2,
      natGateways: 1,
    });

    const role = new Role(this, 'Role', {
      roleName: 'Test',
      assumedBy: new AnyPrincipal(),
    });

    // create a cloud9 ec2 environment in a new VPC
    const c9env = new cloud9.Ec2Environment(this, 'C9Env', {
      vpc,
      imageId: ImageId.AMAZON_LINUX_2,
      owner: Owner.role(role),
    });
    new CfnOutput(this, 'URL', { value: c9env.ideUrl });
    new CfnOutput(this, 'ARN', { value: c9env.ec2EnvironmentArn });
  }
}

const app = new App();

new integ.IntegTest(app, 'OwnerInteg', {
  testCases: [new Cloud9Env(app, 'cloud9-owner-integ')],
});

app.synth();
