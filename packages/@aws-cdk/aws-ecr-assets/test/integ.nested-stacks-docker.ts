import * as cfn from '@aws-cdk/aws-cloudformation';
import { App, CfnOutput, Construct, Stack, StackProps } from '@aws-cdk/core';
import * as path from 'path';
import * as ecr_assets from '../lib';

class TheNestedStack extends cfn.NestedStack {
  constructor(scope: Construct, id: string, props?: cfn.NestedStackProps) {
    super(scope, id, props);

    const asset = new ecr_assets.DockerImageAsset(this, 'my-image', {
      directory: path.join(__dirname, 'demo-image')
    });

    new CfnOutput(this, 'output', { value: asset.imageUri });
  }
}

class TheParentStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new TheNestedStack(this, 'nested-stack-with-image');
  }
}

const app = new App();
new TheParentStack(app, 'nested-stacks-docker');
app.synth();
