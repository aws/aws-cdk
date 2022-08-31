import * as path from 'path';
import { App, Stack, StackProps } from '@aws-cdk/core';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests';
import { Construct } from 'constructs';
import * as lambda from '../lib';

/**
 * Stack verification steps:
 * * aws cloudformation describe-stacks --stack-name cdk-integ-lambda-bundling --query Stacks[0].Outputs[0].OutputValue
 * * aws lambda invoke --function-name <output from above> response.json
 * * cat response.json
 * The last command should show '200'
 */
class TestStack extends Stack {
  public readonly functionName: string;
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const assetPath = path.join(__dirname, 'python-lambda-handler');
    const fn = new lambda.Function(this, 'Function', {
      code: lambda.Code.fromAsset(assetPath, {
        bundling: {
          image: lambda.Runtime.PYTHON_3_9.bundlingImage,
          command: [
            'bash', '-c', [
              'cp -au . /asset-output',
              'cd /asset-output',
              'pip install -r requirements.txt -t .',
            ].join(' && '),
          ],
        },
      }),
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'index.handler',
    });

    this.functionName = fn.functionName;
  }
}

const app = new App();
const stack = new TestStack(app, 'cdk-integ-lambda-bundling');

const integ = new IntegTest(app, 'Bundling', {
  testCases: [stack],
  stackUpdateWorkflow: false,
});

const invoke = integ.assertions.invokeFunction({
  functionName: stack.functionName,
});
invoke.expect(ExpectedResult.objectLike({
  Payload: '200',
}));
