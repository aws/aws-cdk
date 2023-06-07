import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as constructs from 'constructs';
import * as cloud9 from '../lib';

export class Cloud9Env extends cdk.Stack {
  constructor(scope: constructs.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC', {
      restrictDefaultSecurityGroup: false,
      maxAzs: 2,
      natGateways: 1,
    });

    // create a cloud9 ec2 environment in a new VPC
    const c9env = new cloud9.Ec2Environment(this, 'C9Env', {
      vpc,
      automaticStop: cdk.Duration.minutes(30),
      imageId: cloud9.ImageId.AMAZON_LINUX_2,
    });
    new cdk.CfnOutput(this, 'URL', { value: c9env.ideUrl });
    new cdk.CfnOutput(this, 'ARN', { value: c9env.ec2EnvironmentArn });
  }
}

const app = new cdk.App();
const stack = new Cloud9Env(app, 'C9automaticStopStack');

new integ.IntegTest(app, 'cloud-9-automatic-stop-time-mintues', {
  testCases: [stack],
});

app.synth();
