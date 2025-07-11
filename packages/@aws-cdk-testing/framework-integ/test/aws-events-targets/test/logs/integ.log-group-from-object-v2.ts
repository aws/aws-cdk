import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/custom-resources:logApiResponseDataPropertyTrueDefault': true,
  },
});

// Create the stack
const stack = new cdk.Stack(app, 'aws-cdk-cloudwatch-eventbridge-logs');

// Create CloudWatch Log Group
const logGroup = new logs.LogGroup(stack, 'LogGroup', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  retention: logs.RetentionDays.ONE_DAY,
});

// Create EventBridge Rule
const rule = new events.Rule(stack, 'Rule', {
  eventPattern: {
    source: ['aws.ec2'],
  },
});

// Add CloudWatch Log Group as target with custom input transformation
rule.addTarget(new targets.CloudWatchLogGroup(logGroup, {
  logEvent: targets.LogGroupTargetInput.fromObjectV2({
    timestamp: events.EventField.fromPath('$.time'),
    message: events.EventField.fromPath('$.detail-type'),
  }),
}));

// Create the integration test
new integ.IntegTest(app, 'CloudWatchEventBridgeLogsTest', {
  testCases: [stack],
  diffAssets: true,
});
