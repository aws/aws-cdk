import * as logs from 'aws-cdk-lib/aws-logs';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-lambda-log-retention');

new lambda.Function(stack, 'OneWeek', {
  code: new lambda.InlineCode('exports.handler = (event) => console.log(JSON.stringify(event));'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_14_X,
  logRetention: logs.RetentionDays.ONE_WEEK,
});

// propagating tags to log group here is testing that the lambda resource provider is updated
// with correct permissions - otherwise the integ test will fail here
const fn = new lambda.Function(stack, 'OneMonth', {
  code: new lambda.InlineCode('exports.handler = (event) => console.log(JSON.stringify(event));'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_14_X,
  logRetention: logs.RetentionDays.ONE_MONTH,
  propagateTagsToLogGroup: true,
  functionName: 'OneMonthFunction',
});
cdk.Tags.of(fn).add('env', 'beta');
cdk.Tags.of(fn).add('dept', 'eng');

new lambda.Function(stack, 'OneYear', {
  code: new lambda.InlineCode('exports.handler = (event) => console.log(JSON.stringify(event));'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_14_X,
  logRetention: logs.RetentionDays.ONE_YEAR,
  functionName: 'OneYearFunction',
});

app.synth();
