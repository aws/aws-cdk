import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as cloud9 from '../lib';

// const app = new cdk.App();

// const stack = new cdk.Stack(app, 'aws-cdk-cloud9-integ');

// const c9env = new cloud9.EnvironmentEC2(stack, 'C9Env');

// new cdk.CfnOutput(stack, 'URL', { value: c9env.ideUrl });

export class Cloud9Env extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // create a cloud9 ec2 environment in a new VPC
    new cloud9.EnvironmentEC2(this, 'C9Env');

    // create the cloud9 environment in my default VPC
    const vpc = ec2.Vpc.fromLookup(this, 'VPC', { isDefault: true });
    const c9env = new cloud9.EnvironmentEC2(this, 'C9Env2', {
      vpc,
      instanceType: new ec2.InstanceType('t3.large')
     });

     // print the IDE URL in the output
    new cdk.CfnOutput(this, 'URL', { value: c9env.ideUrl });

  }
}

const app = new cdk.App();

const env = {
  region: app.node.tryGetContext('region') || process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION,
  account: app.node.tryGetContext('account') || process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT
};

new Cloud9Env(app, 'C9Stack', { env });