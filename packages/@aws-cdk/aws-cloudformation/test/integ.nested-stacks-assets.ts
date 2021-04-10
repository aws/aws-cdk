/// !cdk-integ pragma:ignore-assets
import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import { App, Stack } from '@aws-cdk/core';
import * as cfn from '../lib';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

/* eslint-disable cdk/no-core-construct */

class NestedStack extends cfn.NestedStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new lambda.Function(this, 'Handler', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'asset-directory-fixture')),
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: 'index.handler',
    });
  }
}

class ParentStack extends Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new NestedStack(this, 'Nested');
  }
}

const app = new App();
new ParentStack(app, 'nested-stacks-assets');
app.synth();
