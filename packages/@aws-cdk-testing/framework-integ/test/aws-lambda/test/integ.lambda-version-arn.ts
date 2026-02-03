import { App, CfnOutput, Duration, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as lambda from 'aws-cdk-lib/aws-lambda';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new Stack(app, 'lambda-version-arn');

const func = new lambda.Function(stack, 'Fn', {
  runtime: lambda.Runtime.PYTHON_3_10,
  handler: 'index.handler',
  code: lambda.Code.fromInline('foo'),
});

const version = new lambda.Version(stack, 'Version', {
  lambda: func,
  maxEventAge: Duration.hours(1),
  retryAttempts: 0,
});

new CfnOutput(stack, 'VersionArn', { value: version.functionArn });
new CfnOutput(stack, 'FunctionArn1', { value: version.lambda.functionArn });
new CfnOutput(stack, 'FunctionArn2', { value: func.functionArn });

const testCase = new integ.IntegTest(app, 'lambda-version', {
  testCases: [stack],
});

const describe = testCase.assertions.awsApiCall('CloudFormation', 'describeStacks', {
  StackName: 'lambda-version-arn',
});

describe.expect(integ.ExpectedResult.objectLike({
  Stacks: [
    {
      Outputs: [
        {
          OutputKey: 'FunctionArn1',
          OutputValue: integ.Match.stringLikeRegexp(`arn:aws:lambda:${stack.region}:${stack.account}:function:*`),
        },
        {
          OutputKey: 'FunctionArn2',
          OutputValue: integ.Match.stringLikeRegexp(`arn:aws:lambda:${stack.region}:${stack.account}:function:*`),
        },
        {
          OutputKey: 'VersionArn',
          OutputValue: integ.Match.stringLikeRegexp(`arn:aws:lambda:${stack.region}:${stack.account}:function:*:*`),
        },
      ],
    },
  ],
}));

