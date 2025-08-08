import { App, CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { Function, InlineCode, InvokeMode, Runtime, FunctionUrlAuthType } from 'aws-cdk-lib/aws-lambda';

class TestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // IAM-authenticated Function URLs
    const fnUrlIamAuth = new Function(this, 'IamAuthFunctionUrls', {
      code: new InlineCode('def handler(event, context):\n  return "success"'),
      handler: 'index.handler',
      runtime: Runtime.PYTHON_3_10,
    });

    const fnUrlIamAuthUrl = fnUrlIamAuth.addFunctionUrl();

    new CfnOutput(this, 'TheIamAuthFunctionUrls', {
      value: fnUrlIamAuthUrl.url,
    });

    // Anonymous Function URLs
    const fnNoAuth = new Function(this, 'NoAuthFunctionUrls', {
      code: new InlineCode('def handler(event, context):\n  return "success"'),
      handler: 'index.handler',
      runtime: Runtime.PYTHON_3_10,
    });

    const fnNoAuthUrl = fnNoAuth.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
    });

    new CfnOutput(this, 'TheNoAuthFunctionUrls', {
      value: fnNoAuthUrl.url,
    });

    // CORS configuration for Function URLs
    const fnCors = new Function(this, 'CorsFunctionUrls', {
      code: new InlineCode('def handler(event, context):\n  return "success"'),
      handler: 'index.handler',
      runtime: Runtime.PYTHON_3_10,
    });

    const fnCorsUrl = fnCors.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: ['https://example.com'],
      },
    });

    new CfnOutput(this, 'TheCorsFunctionUrls', {
      value: fnCorsUrl.url,
    });

    // Invoke Mode for Function URLs
    const fnStream = new Function(this, 'StreamFunctionUrls', {
      code: new InlineCode('def handler(event, context):\n  return "success"'),
      handler: 'index.handler',
      runtime: Runtime.PYTHON_3_10,
    });

    const fnStreamUrl = fnStream.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
      invokeMode: InvokeMode.RESPONSE_STREAM,
    });

    new CfnOutput(this, 'TheStreamFunctionUrls', {
      value: fnStreamUrl.url,
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
new IntegTest(app, 'IntegTest', {
  testCases: [
    new TestStack(app, 'Stack1'),
  ],
});
