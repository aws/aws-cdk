import * as events from 'aws-cdk-lib/aws-events';
import { CloudWatchLogGroup, LogGroupTargetInput } from 'aws-cdk-lib/aws-events-targets';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { SqsDestination } from 'aws-cdk-lib/aws-lambda-destinations';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { App, Stack, RemovalPolicy } from 'aws-cdk-lib';
import { IntegTest, ExpectedResult, Match } from '@aws-cdk/integ-tests-alpha';
import * as constructs from 'constructs';
import { LambdaDestination } from 'aws-cdk-lib/aws-logs-destinations';
import { STANDARD_NODEJS_RUNTIME } from '../../config';

class LambdaStack extends Stack {
  public readonly queue: sqs.Queue;

  constructor(scope: constructs.Construct, id: string) {
    super(scope, id);

    this.queue = new sqs.Queue(this, 'Queue');

    const fn = new lambda.Function(this, 'MyFunction', {
      runtime: STANDARD_NODEJS_RUNTIME,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`exports.handler = async (event) => {
        return 'success';
      };`),
      onSuccess: new SqsDestination(this.queue),
    });

    const logGroup = new logs.LogGroup(this, 'LogGroup', { removalPolicy: RemovalPolicy.DESTROY });
    const lambdaDestination = new LambdaDestination(fn);

    new logs.SubscriptionFilter(this, 'Subscription', {
      logGroup: logGroup,
      destination: lambdaDestination,
      filterPattern: logs.FilterPattern.allEvents(),
    });

    const customRule = new events.Rule(this, 'CustomRule', {
      eventPattern: {
        source: ['cdk-lambda-integ'],
        detailType: ['cdk-integ-custom-rule'],
      },
    });
    customRule.addTarget(new CloudWatchLogGroup(logGroup, {
      logEvent: LogGroupTargetInput.fromObject({
        message: 'Howdy Ho!',
      }),
    }));
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});
const stack = new LambdaStack(app, 'lambda-logssubscription-integ');

const integ = new IntegTest(app, 'LambdaInteg', {
  testCases: [stack],
  diffAssets: true,
});

const putEvents = integ.assertions.awsApiCall('EventBridge', 'putEvents', {
  Entries: [
    {
      Detail: JSON.stringify({
        foo: 'bar',
      }),
      DetailType: 'cdk-integ-custom-rule',
      Source: 'cdk-lambda-integ',
    },
  ],
});
putEvents.provider.addToRolePolicy({
  Effect: 'Allow',
  Action: ['events:PutEvents'],
  Resource: ['*'],
});

const receiveMessage = integ.assertions.awsApiCall('SQS', 'receiveMessage', {
  QueueUrl: stack.queue.queueUrl,
  WaitTimeSeconds: 20,
});

// TODO: Replace with `receiveMessage.assertAtPath('Messages.0.Body', ExpectedResult.objectLike({...`
// when issue #24215 is addressed
receiveMessage.expect(ExpectedResult.objectLike( {
  Messages:
  [{
    Body: Match.stringLikeRegexp( '"responsePayload":"success"' ),
  }],
}));

app.synth();
