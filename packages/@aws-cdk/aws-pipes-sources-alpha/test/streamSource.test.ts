import { IPipe, Pipe, SourceConfig } from '@aws-cdk/aws-pipes-alpha';
import { App, Duration, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { AttributeType, ITableV2, StreamViewType, TableV2 } from 'aws-cdk-lib/aws-dynamodb';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { TestTarget } from './test-classes';
import { DynamoDBSourceParameters, DynamoDBStartingPosition } from '../lib';
import { StreamSource } from '../lib/streamSource';

describe('stream source validations', () => {
  test('batch size > 10000 should throw', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'demo-stack');
    const table = new TableV2(stack, 'MyTable', {
      partitionKey: {
        name: 'PK',
        type: AttributeType.STRING,
      },
      dynamoStream: StreamViewType.OLD_IMAGE,
    });

    // WHEN
    expect(() => {
      new FakeStreamSource(table, {
        startingPosition: DynamoDBStartingPosition.LATEST,
        batchSize: 10001,
      });
    }).toThrow('Batch size must be between 1 and 10000, received 10001');
  });

  test('batch size < 1 should throw', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'demo-stack');
    const table = new TableV2(stack, 'MyTable', {
      partitionKey: {
        name: 'PK',
        type: AttributeType.STRING,
      },
      dynamoStream: StreamViewType.OLD_IMAGE,
    });

    // WHEN
    expect(() => {
      new FakeStreamSource(table, {
        startingPosition: DynamoDBStartingPosition.LATEST,
        batchSize: 0,
      });
    }).toThrow('Batch size must be between 1 and 10000, received 0');
  });

  test('maximum batching window > 300 should throw', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'demo-stack');
    const table = new TableV2(stack, 'MyTable', {
      partitionKey: {
        name: 'PK',
        type: AttributeType.STRING,
      },
      dynamoStream: StreamViewType.OLD_IMAGE,
    });

    // WHEN
    expect(() => {
      new FakeStreamSource(table, {
        startingPosition: DynamoDBStartingPosition.LATEST,
        maximumBatchingWindow: Duration.seconds(301),
      });
    }).toThrow('Maximum batching window must be between 0 and 300, received 301');
  });

  test('maximum record age < 60 should throw', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'demo-stack');
    const table = new TableV2(stack, 'MyTable', {
      partitionKey: {
        name: 'PK',
        type: AttributeType.STRING,
      },
      dynamoStream: StreamViewType.OLD_IMAGE,
    });

    // WHEN
    expect(() => {
      new FakeStreamSource(table, {
        startingPosition: DynamoDBStartingPosition.LATEST,
        maximumRecordAge: Duration.seconds(59),
      });
    }).toThrow('Maximum record age in seconds must be between 60 and 604800 (leave undefined for infinite), received 59');
  });

  test('maximum record age > 604800 should throw', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'demo-stack');
    const table = new TableV2(stack, 'MyTable', {
      partitionKey: {
        name: 'PK',
        type: AttributeType.STRING,
      },
      dynamoStream: StreamViewType.OLD_IMAGE,
    });

    // WHEN
    expect(() => {
      new FakeStreamSource(table, {
        startingPosition: DynamoDBStartingPosition.LATEST,
        maximumRecordAge: Duration.seconds(604801),
      });
    }).toThrow('Maximum record age in seconds must be between 60 and 604800 (leave undefined for infinite), received 604801');
  });

  test('maximum retry attempts < -1 should throw', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'demo-stack');
    const table = new TableV2(stack, 'MyTable', {
      partitionKey: {
        name: 'PK',
        type: AttributeType.STRING,
      },
      dynamoStream: StreamViewType.OLD_IMAGE,
    });

    // WHEN
    expect(() => {
      new FakeStreamSource(table, {
        startingPosition: DynamoDBStartingPosition.LATEST,
        maximumRetryAttempts: -2,
      });
    }).toThrow('Maximum retry attempts must be between -1 and 10000, received -2');
  });

  test('maximum retry attempts > 10000 should throw', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'demo-stack');
    const table = new TableV2(stack, 'MyTable', {
      partitionKey: {
        name: 'PK',
        type: AttributeType.STRING,
      },
      dynamoStream: StreamViewType.OLD_IMAGE,
    });

    // WHEN
    expect(() => {
      new FakeStreamSource(table, {
        startingPosition: DynamoDBStartingPosition.LATEST,
        maximumRetryAttempts: 10001,
      });
    }).toThrow('Maximum retry attempts must be between -1 and 10000, received 10001');
  });

  test('parallelization factor < 1 should throw', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'demo-stack');
    const table = new TableV2(stack, 'MyTable', {
      partitionKey: {
        name: 'PK',
        type: AttributeType.STRING,
      },
      dynamoStream: StreamViewType.OLD_IMAGE,
    });

    // WHEN
    expect(() => {
      new FakeStreamSource(table, {
        startingPosition: DynamoDBStartingPosition.LATEST,
        parallelizationFactor: 0,
      });
    }).toThrow('Parallelization factor must be between 1 and 10, received 0');
  });

  test('parallelization factor > 10 should throw', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'demo-stack');
    const table = new TableV2(stack, 'MyTable', {
      partitionKey: {
        name: 'PK',
        type: AttributeType.STRING,
      },
      dynamoStream: StreamViewType.OLD_IMAGE,
    });

    // WHEN
    expect(() => {
      new FakeStreamSource(table, {
        startingPosition: DynamoDBStartingPosition.LATEST,
        parallelizationFactor: 11,
      });
    }).toThrow('Parallelization factor must be between 1 and 10, received 11');
  });

  it('should grant pipe role write access to dead-letter queue', () => {
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
    const queue = new Queue(stack, 'MyQueue');
    const source = new FakeStreamSource(table, {
      startingPosition: DynamoDBStartingPosition.LATEST,
      deadLetterTarget: queue,
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

  it('should grant pipe role write access to dead-letter topic', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const topic = new Topic(stack, 'MyTopic');
    const table = new TableV2(stack, 'MyTable', {
      partitionKey: {
        name: 'PK',
        type: AttributeType.STRING,
      },
      dynamoStream: StreamViewType.OLD_IMAGE,
    });
    const source = new FakeStreamSource(table, {
      startingPosition: DynamoDBStartingPosition.LATEST,
      deadLetterTarget: topic,
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

class FakeStreamSource extends StreamSource {
  private readonly startingPosition: DynamoDBStartingPosition;
  private readonly deadLetterTargetArn?: string;

  public grantRead = jest.fn()

  constructor(table: ITableV2, parameters: DynamoDBSourceParameters) {
    if (table.tableStreamArn === undefined) {
      throw new Error('Table does not have a stream defined, cannot create pipes source');
    }

    super(table.tableStreamArn, parameters);
    this.startingPosition = parameters.startingPosition;
    this.deadLetterTargetArn = this.getDeadLetterTargetArn(this.deadLetterTarget);
  }

  bind(_pipe: IPipe): SourceConfig {
    return {
      sourceParameters: {
        dynamoDbStreamParameters: {
          batchSize: this.sourceParameters.batchSize,
          deadLetterConfig: this.deadLetterTargetArn ? { arn: this.deadLetterTargetArn } : undefined,
          maximumBatchingWindowInSeconds: this.sourceParameters.maximumBatchingWindow?.toSeconds(),
          maximumRecordAgeInSeconds: this.sourceParameters.maximumRecordAge?.toSeconds(),
          maximumRetryAttempts: this.sourceParameters.maximumRetryAttempts,
          onPartialBatchItemFailure: this.sourceParameters.onPartialBatchItemFailure,
          parallelizationFactor: this.sourceParameters.parallelizationFactor,
          startingPosition: this.startingPosition,
        },
      },
    };
  }
}
