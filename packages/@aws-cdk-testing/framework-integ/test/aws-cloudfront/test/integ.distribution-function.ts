import * as cdk from 'aws-cdk-lib';
import { TestOrigin } from './test-origin';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as cxapi from 'aws-cdk-lib/cx-api';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-distribution-function', { env: { region: 'eu-west-1' } });
stack.node.setContext(cxapi.CLOUDFRONT_FUNCTION_STABLE_GENERATED_NAME, false);

const cfFunction = new cloudfront.Function(stack, 'Function', {
  code: cloudfront.FunctionCode.fromInline('function handler(event) { return event.request }'),
});

new cloudfront.Distribution(stack, 'Dist', {
  defaultBehavior: {
    origin: new TestOrigin('www.example.com'),
    cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
    functionAssociations: [{
      function: cfFunction,
      eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
    }],
  },
});

new cdk.CfnOutput(stack, 'FunctionArn', { value: cfFunction.functionArn });
new cdk.CfnOutput(stack, 'FunctionStage', { value: cfFunction.functionStage });

app.synth();
