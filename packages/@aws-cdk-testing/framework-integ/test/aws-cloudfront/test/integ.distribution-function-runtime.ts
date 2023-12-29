import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { TestOrigin } from './test-origin';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-distribution-function', { env: { region: 'eu-west-1' } });

const cfFunctionRequest = new cloudfront.Function(stack, 'FunctionRequest', {
  code: cloudfront.FunctionCode.fromInline('function handler(event) { return event.request }'),
  runtime: cloudfront.FunctionRuntime.JS_1_0,
});

const cfFunctionResponse = new cloudfront.Function(stack, 'FunctionResponse', {
  code: cloudfront.FunctionCode.fromInline('function handler(event) { return event.response }'),
  runtime: cloudfront.FunctionRuntime.JS_2_0,
});

new cloudfront.Distribution(stack, 'Dist', {
  defaultBehavior: {
    origin: new TestOrigin('www.example.com'),
    cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
    functionAssociations: [{
      function: cfFunctionRequest,
      eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
    }, {
      function: cfFunctionResponse,
      eventType: cloudfront.FunctionEventType.VIEWER_RESPONSE,
    }],
  },
});

new cdk.CfnOutput(stack, 'RequestFunctionArn', { value: cfFunctionRequest.functionArn });
new cdk.CfnOutput(stack, 'RequestFunctionStage', { value: cfFunctionRequest.functionStage });

new cdk.CfnOutput(stack, 'ResponseFunctionArn', { value: cfFunctionResponse.functionArn });
new cdk.CfnOutput(stack, 'ResponseFunctionStage', { value: cfFunctionResponse.functionStage });

new IntegTest(app, 'CF2Runtime', {
  testCases: [stack],
});

app.synth();
