import {
  App, Stack, Duration,
  triggers as triggers,
  aws_lambda as lambda,
} from 'aws-cdk-lib';

const app = new App();
const env = { region: process.env.CDK_DEFAULT_REGION, account: process.env.CDK_DEFAULT_ACCOUNT };
const stack = new Stack(app, 'my-test-stack', { env });

const func = new lambda.Function(stack, 'MyFunction', {
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_18_X,
  code: lambda.Code.fromAsset(__dirname + '/my-trigger'),
});

new triggers.Trigger(stack, 'MyTrigger', {
  handler: func,
  timeout: Duration.minutes(10),
  invocationType: triggers.InvocationType.REQUEST_RESPONSE,
  //executeOnHandlerChange: false,
});