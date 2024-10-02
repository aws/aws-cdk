import { Pipe } from '@aws-cdk/aws-pipes-alpha';
import { App, Duration, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { AttributeType, StreamViewType, Table, TableV2 } from 'aws-cdk-lib/aws-dynamodb';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { TestTarget } from './test-classes';
import { DynamoDBSource, DynamoDBStartingPosition, OnPartialBatchItemFailure } from '../lib';

describe('dynamodb source', () => {
  it('should have only source arn and starting position', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const table = new TableV2(stack, 'MyTable', {
      partitionKey: {
        name: 'PK',
        type: AttributeType.STRING,
      },
      dynamoStream: StreamViewType.OLD_IMAGE,
    });
    const source = new DynamoDBSource(table, {
      startingPosition: DynamoDBStartingPosition.TRIM_HORIZON,
    });

    new Pipe(stack, 'MyPipe', {
      source,
      target: new TestTarget(),
    });

    // ACT
    const template = Template.fromStack(stack);

    // ASSERT
    template.hasResourceProperties('AWS::Pipes::Pipe', {
      Source: {
        'Fn::GetAtt': [
          'MyTable794EDED1',
          'StreamArn',
        ],
      },
      SourceParameters: {
        DynamoDBStreamParameters: {
          StartingPosition: 'TRIM_HORIZON',
        },
      },
    });
  });

  test('should throw if table does not have stream enabled', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'demo-stack');
    // use v1 Table so a global table with streams is not created
    const table = new Table(stack, 'MyTable', {
      partitionKey: {
        name: 'PK',
        type: AttributeType.STRING,
      },
    });

    // WHEN
    expect(() => {
      new DynamoDBSource(table, {
        startingPosition: DynamoDBStartingPosition.LATEST,
      });
    }).toThrow('Table does not have a stream defined, cannot create pipes source');
  });

  it('should have source parameters (dlq = sns)', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const topic = new Topic(stack, 'MyTopic', {});
    const table = new TableV2(stack, 'MyTable', {
      partitionKey: {
        name: 'PK',
        type: AttributeType.STRING,
      },
      dynamoStream: StreamViewType.OLD_IMAGE,
    });
    const source = new DynamoDBSource(table, {
      batchSize: 10,
      deadLetterTarget: topic,
      maximumBatchingWindow: Duration.seconds(10),
      maximumRecordAge: Duration.seconds(60),
      maximumRetryAttempts: 10,
      onPartialBatchItemFailure: OnPartialBatchItemFailure.AUTOMATIC_BISECT,
      parallelizationFactor: 10,
      startingPosition: DynamoDBStartingPosition.LATEST,
    });

    new Pipe(stack, 'MyPipe', {
      source,
      target: new TestTarget(),
    });

    // ACT
    const template = Template.fromStack(stack);

    // ASSERT
    template.hasResourceProperties('AWS::Pipes::Pipe', {
      Source: {
        'Fn::GetAtt': [
          'MyTable794EDED1',
          'StreamArn',
        ],
      },
      SourceParameters: {
        DynamoDBStreamParameters: {
          BatchSize: 10,
          DeadLetterConfig: {
            Arn: { Ref: 'MyTopic86869434' },
          },
          MaximumBatchingWindowInSeconds: 10,
          MaximumRecordAgeInSeconds: 60,
          MaximumRetryAttempts: 10,
          OnPartialBatchItemFailure: 'AUTOMATIC_BISECT',
          ParallelizationFactor: 10,
          StartingPosition: 'LATEST',
        },
      },
    });
  });

  it('should have source parameters (dlq = sqs)', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const queue = new Queue(stack, 'MyQueue', {});
    const table = new TableV2(stack, 'MyTable', {
      partitionKey: {
        name: 'PK',
        type: AttributeType.STRING,
      },
      dynamoStream: StreamViewType.OLD_IMAGE,
    });
    const source = new DynamoDBSource(table, {
      batchSize: 10,
      deadLetterTarget: queue,
      maximumBatchingWindow: Duration.seconds(10),
      maximumRecordAge: Duration.seconds(60),
      maximumRetryAttempts: 10,
      onPartialBatchItemFailure: OnPartialBatchItemFailure.AUTOMATIC_BISECT,
      parallelizationFactor: 10,
      startingPosition: DynamoDBStartingPosition.LATEST,
    });

    new Pipe(stack, 'MyPipe', {
      source,
      target: new TestTarget(),
    });

    // ACT
    const template = Template.fromStack(stack);

    // ASSERT
    template.hasResourceProperties('AWS::Pipes::Pipe', {
      Source: {
        'Fn::GetAtt': [
          'MyTable794EDED1',
          'StreamArn',
        ],
      },
      SourceParameters: {
        DynamoDBStreamParameters: {
          BatchSize: 10,
          DeadLetterConfig: {
            Arn: {
              'Fn::GetAtt': [
                'MyQueueE6CA6235',
                'Arn',
              ],
            },
          },
          MaximumBatchingWindowInSeconds: 10,
          MaximumRecordAgeInSeconds: 60,
          MaximumRetryAttempts: 10,
          OnPartialBatchItemFailure: 'AUTOMATIC_BISECT',
          ParallelizationFactor: 10,
          StartingPosition: 'LATEST',
        },
      },
    });
  });

  it('should grant pipe role read access to source', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const table = new TableV2(stack, 'MyTable', {
      partitionKey: {
        name: 'PK',
        type: AttributeType.STRING,
      },
      dynamoStream: StreamViewType.OLD_IMAGE,
    });
    const source = new DynamoDBSource(table, {
      startingPosition: DynamoDBStartingPosition.LATEST,
    });

    new Pipe(stack, 'MyPipe', {
      source,
      target: new TestTarget(),
    });

    // ACT
    const template = Template.fromStack(stack);

    // ASSERT
    expect(template.findResources('AWS::IAM::Role')).toMatchSnapshot();
    expect(template.findResources('AWS::IAM::Policy')).toMatchSnapshot();
  });
});
