import * as ec2 from '@aws-cdk/aws-ec2';
import { Stack, App, StackProps, CfnOutput } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import * as cloud9 from '../lib';
import { ImageId } from '../lib';

class Cloud9Env extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC', {
      maxAzs: 2,
      natGateways: 1,
    });

    // create a cloud9 ec2 environment in a new VPC
    const c9env = new cloud9.Ec2Environment(this, 'C9Env', {
      vpc,
      imageId: ImageId.AMAZON_LINUX_2,
    });
    new CfnOutput(this, 'URL', { value: c9env.ideUrl });
    new CfnOutput(this, 'ARN', { value: c9env.ec2EnvironmentArn });
  }
}

const app = new App();

new integ.IntegTest(app, 'ImageIdInteg', {
  testCases: [new Cloud9Env(app, 'cloud9-imageid-integ')],
});

app.synth();