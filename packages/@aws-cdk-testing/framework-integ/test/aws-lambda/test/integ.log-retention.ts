import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

class TestStack extends cdk.Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new lambda.Function(this, 'OneWeek', {
      code: new lambda.InlineCode('exports.handler = (event) => console.log(JSON.stringify(event));'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_14_X,
      logRetention: logs.RetentionDays.ONE_WEEK,
    });

    // propagating tags to log group here is testing that the lambda resource provider is updated
    // with correct permissions - otherwise the integ test will fail here
    const oneMonthFunction = new lambda.Function(this, 'OneMonth', {
      code: new lambda.InlineCode('exports.handler = (event) => console.log(JSON.stringify(event));'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_14_X,
      logRetention: logs.RetentionDays.ONE_MONTH,
      functionName: 'OneMonthFunction',
      propagateTagsToLogGroup: true,
    });
    cdk.Tags.of(oneMonthFunction).add('env', 'prod');
    cdk.Tags.of(oneMonthFunction).add('dept', 'sales');

    const oneYearFunction = new lambda.Function(this, 'OneYear', {
      code: new lambda.InlineCode('exports.handler = (event) => console.log(JSON.stringify(event));'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_14_X,
      logRetention: logs.RetentionDays.ONE_YEAR,
      functionName: 'OneYearFunction',
      propagateTagsToLogGroup: true,
    });
    cdk.Tags.of(oneYearFunction).add('dept', 'eng');
  }
}

new IntegTest(app, 'aws-cdk-integ-lambda-log-retention', {
  testCases: [new TestStack(app, 'aws-cdk-lambda-log-retention')],
});
