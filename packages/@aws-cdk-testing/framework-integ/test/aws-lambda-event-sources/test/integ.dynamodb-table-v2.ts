import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { TestFunction } from './test-function';
import { DynamoEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';

/*
 * Stack verification steps:
 * * cdk synth completes without TableGrants deprecation warnings (fixes #37221)
 */
const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new cdk.Stack(app, 'lambda-event-source-dynamodb-table-v2');

const fn = new TestFunction(stack, 'F');
const table = new dynamodb.TableV2(stack, 'T', {
  partitionKey: {
    name: 'id',
    type: dynamodb.AttributeType.STRING,
  },
  dynamoStream: dynamodb.StreamViewType.NEW_IMAGE,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const eventSource = new DynamoEventSource(table, {
  batchSize: 5,
  startingPosition: lambda.StartingPosition.TRIM_HORIZON,
  tumblingWindow: cdk.Duration.seconds(60),
});

fn.addEventSource(eventSource);

new cdk.CfnOutput(stack, 'OutputEventSourceMappingArn', { value: eventSource.eventSourceMappingArn });

new integ.IntegTest(app, 'lambda-event-source-dynamodb-table-v2-integ', {
  testCases: [stack],
});

app.synth();
