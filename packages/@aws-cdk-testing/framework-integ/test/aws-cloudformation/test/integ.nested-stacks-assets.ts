import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { App, NestedStack, Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

/* eslint-disable @cdklabs/no-core-construct */

class MyNestedStack extends NestedStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new lambda.Function(this, 'Handler', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'asset-directory-fixture'), { exclude: ['*.ts'] }),
      runtime: STANDARD_NODEJS_RUNTIME,
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

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
new ParentStack(app, 'nested-stacks-assets');
app.synth();
