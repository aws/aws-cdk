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
const oneMonthFunction = new lambda.Function(stack, 'OneMonth', {
  code: new lambda.InlineCode('exports.handler = (event) => console.log(JSON.stringify(event));'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_14_X,
  logRetention: logs.RetentionDays.ONE_MONTH,
  functionName: 'OneMonthFunction',
  propagateTagsToLogGroup: true,
});
cdk.Tags.of(oneMonthFunction).add('env', 'prod');
cdk.Tags.of(oneMonthFunction).add('dept', 'sales', { excludeResourceTypes: ['AWS::Logs::LogGroup'] });

const oneYearFunction = new lambda.Function(stack, 'OneYear', {
  code: new lambda.InlineCode('exports.handler = (event) => console.log(JSON.stringify(event));'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_14_X,
  logRetention: logs.RetentionDays.ONE_YEAR,
  functionName: 'OneYearFunction',
  propagateTagsToLogGroup: true,
});
cdk.Tags.of(oneYearFunction).add('dept', 'eng');

app.synth();
