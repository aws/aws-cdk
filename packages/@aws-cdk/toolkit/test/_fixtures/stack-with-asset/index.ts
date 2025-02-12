import * as path from 'path';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as core from 'aws-cdk-lib/core';

export default async () => {
  const app = new core.App();
  const stack = new core.Stack(app, 'Stack1');
  new lambda.Function(stack, 'Function1', {
    code: lambda.Code.fromAsset(path.join(__dirname, 'asset')),
    handler: 'index.handler',
    runtime: lambda.Runtime.NODEJS_LATEST,
  });
  return app.synth() as any;
};
