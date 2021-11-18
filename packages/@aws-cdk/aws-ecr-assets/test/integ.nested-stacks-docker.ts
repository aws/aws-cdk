import * as path from 'path';
import * as iam from '@aws-cdk/aws-iam';
import { App, CfnOutput, NestedStack, NestedStackProps, Stack, StackProps } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { Construct } from 'constructs';
import * as ecr_assets from '../lib';

class TheNestedStack extends NestedStack {
  constructor(scope: Construct, id: string, props?: NestedStackProps) {
    super(scope, id, props);

    const asset = new ecr_assets.DockerImageAsset(this, 'my-image', {
      directory: path.join(__dirname, 'demo-image'),
    });

    const user = new iam.User(this, 'User');
    asset.repository.grantPull(user);

    new CfnOutput(this, 'output', { value: asset.imageUri });
  }
}

class TheParentStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new TheNestedStack(this, 'nested-stack-with-image');
  }
}

const app = new App({
  context: {
    [cxapi.DOCKER_IGNORE_SUPPORT]: true,
  },
});
new TheParentStack(app, 'nested-stacks-docker');
app.synth();
