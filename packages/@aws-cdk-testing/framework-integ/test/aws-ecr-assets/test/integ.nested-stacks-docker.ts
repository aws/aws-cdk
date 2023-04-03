import * as path from 'path';
import * as iam from 'aws-cdk-lib/aws-iam';
import { App, CfnOutput, NestedStack, NestedStackProps, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecr_assets from 'aws-cdk-lib/aws-ecr-assets';

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

const app = new App();
new TheParentStack(app, 'nested-stacks-docker');
app.synth();
