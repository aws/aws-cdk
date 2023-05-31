import * as logs from 'aws-cdk-lib/aws-logs';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-lambda-log-retention');

const fn = new lambda.Function(stack, 'OneWeek', {
  code: new lambda.InlineCode('exports.handler = (event) => console.log(JSON.stringify(event));'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_14_X,
  logRetention: logs.RetentionDays.ONE_WEEK,
});
cdk.Tags.of(fn).add('env', 'dev');
cdk.Tags.of(fn).remove('dept');
cdk.Tags.of(fn).add('key', 'value');

new lambda.Function(stack, 'OneMonth', {
  code: new lambda.InlineCode('exports.handler = (event) => console.log(JSON.stringify(event));'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_14_X,
  logRetention: logs.RetentionDays.ONE_MONTH,
});

new lambda.Function(stack, 'OneYear', {
  code: new lambda.InlineCode('exports.handler = (event) => console.log(JSON.stringify(event));'),
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_14_X,
  logRetention: logs.RetentionDays.ONE_YEAR,
});

app.synth();
