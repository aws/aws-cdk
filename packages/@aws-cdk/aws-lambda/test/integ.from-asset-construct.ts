import * as path from 'path';
import * as s3_assets from '@aws-cdk/aws-s3-assets';
import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import * as lambda from '../lib';

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const codeAsset = new s3_assets.Asset(this, 'AssetCode', {
      path: path.join(__dirname, 'handler.zip'),
    });
    new lambda.Function(this, 'MyLambda', {
      code: lambda.Code.fromAssetConstruct(codeAsset),
      handler: 'index.main',
      runtime: lambda.Runtime.PYTHON_3_9,
    });
  }
}

const app = new cdk.App();

const stack = new TestStack(app, 'lambda-test-from-asset-construct-stack');

new IntegTest(app, 'lambda-test-from-asset-construct', { testCases: [stack] });