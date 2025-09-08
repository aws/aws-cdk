import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { LambdaDestination } from 'aws-cdk-lib/aws-logs-destinations';

class SubscriptionFilterReplacementStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create a log group
    const logGroup = new logs.LogGroup(this, 'TestLogGroup', {
      logGroupName: '/test/subscription-filter-replacement',
      retention: logs.RetentionDays.ONE_DAY,
    });

    // Create a simple Lambda function as destination
    const destinationFunction = new lambda.Function(this, 'DestinationFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        exports.handler = async (event) => {
          console.log('Received log events:', JSON.stringify(event, null, 2));
          return { statusCode: 200 };
        };
      `),
    });

    // Create subscription filter with CREATE_BEFORE_DELETE (default)
    new logs.SubscriptionFilter(this, 'DefaultSubscriptionFilter', {
      logGroup,
      destination: new LambdaDestination(destinationFunction),
      filterPattern: logs.FilterPattern.allEvents(),
      filterName: 'default-filter',
    });

    // Create subscription filter with DELETE_BEFORE_CREATE strategy
    new logs.SubscriptionFilter(this, 'DeleteBeforeCreateFilter', {
      logGroup,
      destination: new LambdaDestination(destinationFunction),
      filterPattern: logs.FilterPattern.literal('[timestamp, request_id, level="ERROR"]'),
      filterName: 'delete-before-create-filter',
      replacementStrategy: logs.ReplacementStrategy.DELETE_BEFORE_CREATE,
    });
  }
}

const app = new App();
const stack = new SubscriptionFilterReplacementStack(app, 'SubscriptionFilterReplacementStack');

new IntegTest(app, 'SubscriptionFilterReplacementTest', {
  testCases: [stack],
});
