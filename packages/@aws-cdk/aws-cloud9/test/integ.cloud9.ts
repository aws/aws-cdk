import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as cloud9 from '../lib';

export class Cloud9Env extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC', {
      maxAzs: 2,
      natGateways: 1
    });

    // create a cloud9 ec2 environment in a new VPC
    const c9env = new cloud9.EnvironmentEc2(this, 'C9Env', { vpc });

    new cdk.CfnOutput(this, 'URL', { value: c9env.ideUrl });
    new cdk.CfnOutput(this, 'ARN', { value: c9env.environmentEc2Arn });

    // create the cloud9 environment in my default VPC
    const vpc2 = ec2.Vpc.fromLookup(this, 'VPC2', { isDefault: true });
    const c9env2 = new cloud9.EnvironmentEc2(this, 'C9Env2', {
      vpc: vpc2,
      instanceType: new ec2.InstanceType('t3.large')
    });

    new cdk.CfnOutput(this, 'URL2', { value: c9env2.ideUrl });

  }
}

const app = new cdk.App();

const env = {
  region: app.node.tryGetContext('region') || process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION,
  account: app.node.tryGetContext('account') || process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT
};

new Cloud9Env(app, 'C9Stack', { env });