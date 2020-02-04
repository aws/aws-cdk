import * as cfn from '@aws-cdk/aws-cloudformation';
import * as iam from '@aws-cdk/aws-iam';
import { App, CfnOutput, Construct, Stack, StackProps } from '@aws-cdk/core';
import * as path from 'path';
import * as ecrAssets from '../lib';

class TheNestedStack extends cfn.NestedStack {
  public constructor(scope: Construct, id: string, props?: cfn.NestedStackProps) {
    super(scope, id, props);

    const asset = new ecrAssets.DockerImageAsset(this, 'my-image', {
      directory: path.join(__dirname, 'demo-image')
    });

    const user = new iam.User(this, 'User');
    asset.repository.grantPull(user);

    new CfnOutput(this, 'output', { value: asset.imageUri });
  }
}

class TheParentStack extends Stack {
  public constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new TheNestedStack(this, 'nested-stack-with-image');
  }
}

const app = new App();
new TheParentStack(app, 'nested-stacks-docker');
app.synth();
