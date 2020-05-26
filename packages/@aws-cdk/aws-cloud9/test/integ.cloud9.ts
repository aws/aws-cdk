import * as codecommit from '@aws-cdk/aws-codecommit';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as cloud9 from '../lib';

export class Cloud9Env extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = getOrCreateVpc(this);

    // create a cloud9 ec2 environment in a new VPC
    const c9env = new cloud9.Ec2Environment(this, 'C9Env', {
      vpc,
      repositories: [
        {
          repository: new codecommit.Repository(this, 'Repo', {
            repositoryName: 'foo',
          }),
          path: '/foo',
        },
      ],
    });
    new cdk.CfnOutput(this, 'URL', { value: c9env.ideUrl });
    new cdk.CfnOutput(this, 'ARN', { value: c9env.ec2EnvironmentArn });
  }
}

function getOrCreateVpc(scope: cdk.Construct): ec2.IVpc {
  // use an existing vpc or create a new one
  const vpc = scope.node.tryGetContext('use_default_vpc') === '1' ?
    ec2.Vpc.fromLookup(scope, 'Vpc', { isDefault: true }) :
    scope.node.tryGetContext('use_vpc_id') ?
      ec2.Vpc.fromLookup(scope, 'Vpc', { vpcId: scope.node.tryGetContext('use_vpc_id') }) :
      new ec2.Vpc(scope, 'Vpc', { maxAzs: 3, natGateways: 1 });

  return vpc;
}

const app = new cdk.App();

new Cloud9Env(app, 'C9Stack');