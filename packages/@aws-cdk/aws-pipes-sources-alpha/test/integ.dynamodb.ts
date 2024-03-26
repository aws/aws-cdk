import { ITarget, Pipe, TargetConfig } from '@aws-cdk/aws-pipes-alpha';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import * as ddb from 'aws-cdk-lib/aws-dynamodb';
import { DynamoDBSource, DynamoDBStartingPosition, OnPartialBatchItemFailure } from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-pipes-sources-dynamodb-stream');
const table = new ddb.TableV2(stack, 'MyTable', {
  partitionKey: {
    name: 'id',
    type: ddb.AttributeType.STRING,
  },
  dynamoStream: ddb.StreamViewType.KEYS_ONLY,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const dlqQueue = new cdk.aws_sqs.Queue(stack, 'DlqQueue');
const targetQueue = new cdk.aws_sqs.Queue(stack, 'TargetQueue');

class TestTarget implements ITarget {
  targetArn: string;

  constructor(private readonly queue: cdk.aws_sqs.Queue) {
    this.queue = queue;
    this.targetArn = queue.queueArn;
  }

  bind(_pipe: Pipe): TargetConfig {
    return {
      targetParameters: {},
    };
  }

  grantPush(pipeRole: cdk.aws_iam.IRole): void {
    this.queue.grantSendMessages(pipeRole);
  }
}

const sourceUnderTest = new DynamoDBSource(table, {
  batchSize: 1,
  deadLetterTarget: dlqQueue,
  maximumBatchingWindow: cdk.Duration.seconds(0),
  maximumRecordAge: cdk.Duration.seconds(60),
  maximumRetryAttempts: 1,
  onPartialBatchItemFailure: OnPartialBatchItemFailure.AUTOMATIC_BISECT,
  parallelizationFactor: 1,
  startingPosition: DynamoDBStartingPosition.LATEST,
});

new Pipe(stack, 'Pipe', {
  source: sourceUnderTest,
  target: new TestTarget(targetQueue),
});

const test = new IntegTest(app, 'integtest-pipe-source-sqs', {
  testCases: [stack],
});

test.assertions.awsApiCall('DynamoDB', 'putItem', {
  TableName: table.tableName,
  Item: {
    id: {
      S: 'myPK',
    },
  },
});

const message = test.assertions.awsApiCall('SQS', 'receiveMessage', {
  QueueUrl: targetQueue.queueUrl,
});

message.assertAtPath('Messages.0.Body.dynamodb.Keys.id.S', ExpectedResult.stringLikeRegexp('myPK')).waitForAssertions({
  totalTimeout: cdk.Duration.minutes(2),
  interval: cdk.Duration.seconds(15),
});

app.synth();
