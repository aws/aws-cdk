/// !cdk-integ pragma:ignore-assets
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import { App, NestedStack, Stack } from '@aws-cdk/core';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

/* eslint-disable @aws-cdk/no-core-construct */

class MyNestedStack extends NestedStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new lambda.Function(this, 'Handler', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'asset-directory-fixture')),
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
    });
  }
}

class ParentStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new MyNestedStack(this, 'Nested');
  }
}

const app = new App();
new ParentStack(app, 'nested-stacks-assets');
app.synth();
