import ecr_assets = require('@aws-cdk/aws-ecr-assets');
import { App, CfnOutput, Construct, Stack, StackProps } from '@aws-cdk/core';
import path = require('path');
import cfn = require('../lib');

class TheNestedStack extends cfn.NestedStack {
  constructor(scope: Construct, id: string, props?: cfn.NestedStackProps) {
    super(scope, id, props);

    const asset = new ecr_assets.DockerImageAsset(this, 'my-image', {
      directory: path.join(__dirname, 'asset-docker-fixture')
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
