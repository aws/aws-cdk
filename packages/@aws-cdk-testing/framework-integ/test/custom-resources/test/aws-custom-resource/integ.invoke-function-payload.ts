import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cr from 'aws-cdk-lib/custom-resources';
import * as iam from 'aws-cdk-lib/aws-iam';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new cdk.Stack(app, 'AwsCustomResourceInvokePayloadStack');

const fn = new lambda.Function(stack, 'Function', {
  code: lambda.Code.fromInline("exports.handler = async () => { return { statusCode: 200, body: 'Hello World' }; };"),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_18_X,
});

const testCr = new cr.AwsCustomResource(stack, 'ListLambdaFunctions', {
  onUpdate: {
    service: 'Lambda',
    action: 'invoke',
    parameters: {
      FunctionName: fn.functionName,
    },
    physicalResourceId: cr.PhysicalResourceId.of(fn.functionArn),
  },
  policy: cr.AwsCustomResourcePolicy.fromStatements([
    new iam.PolicyStatement({
      actions: ['*'],
      resources: ['*'],
      effect: iam.Effect.ALLOW,
    }),
  ]),
});

fn.grantInvoke(testCr);
const payload = testCr.getResponseField('Payload');

new cdk.CfnOutput(stack, 'FunctionPayload', {
  value: payload,
});

new IntegTest(app, 'AwsCustomResourceInvokePayloadInteg', {
  testCases: [stack],
});
