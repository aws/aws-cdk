import { Pipe } from '@aws-cdk/aws-pipes-alpha';
import { App, Duration, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Stream } from 'aws-cdk-lib/aws-kinesis';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { TestTarget } from './test-classes';
import { KinesisSource, OnPartialBatchItemFailure, StartingPosition } from '../lib';

describe('kinesis source', () => {
  it('should have only source arn and starting position', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const stream = new Stream(stack, 'MyStream', {});
    const source = new KinesisSource(stream, {
      startingPosition: StartingPosition.TRIM_HORIZON,
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
          'MyStream5C050E93',
          'Arn',
        ],
      },
      SourceParameters: {
        KinesisStreamParameters: {
          StartingPosition: 'TRIM_HORIZON',
        },
      },
    });
  });

  it('should have source parameters', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const stream = new Stream(stack, 'MyStream', {});
    const topic = new Topic(stack, 'MyTopic', {});
    const source = new KinesisSource(stream, {
      batchSize: 10,
      deadLetterConfig: {
        arn: topic.topicArn,
      },
      maximumBatchingWindow: Duration.seconds(10),
      maximumRecordAgeInSeconds: 10,
      maximumRetryAttempts: 10,
      onPartialBatchItemFailure: OnPartialBatchItemFailure.AUTOMATIC_BISECT,
      parallelizationFactor: 10,
      startingPosition: StartingPosition.LATEST,
      startingPositionTimestamp: 'MyTimestamp',
    });

    new Pipe(stack, 'MyPipe', {
      source,
      target: new TestTarget(),
    });

    // ACT
    const template = Template.fromStack(stack);

    // ASSERT
    template.hasResourceProperties('AWS::Pipes::Pipe', {
      SourceParameters: {
        KinesisStreamParameters: {
          BatchSize: 10,
          DeadLetterConfig: {
            Arn: {
              Ref: 'MyTopic86869434',
            },
          },
          MaximumBatchingWindowInSeconds: 10,
          MaximumRecordAgeInSeconds: 10,
          MaximumRetryAttempts: 10,
          OnPartialBatchItemFailure: 'AUTOMATIC_BISECT',
          ParallelizationFactor: 10,
          StartingPosition: 'LATEST',
          StartingPositionTimestamp: 'MyTimestamp',
        },
      },
    });
  });

  it('should grant pipe role read access', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const stream = new Stream(stack, 'MyStream', {});
    const source = new KinesisSource(stream, {
      startingPosition: StartingPosition.LATEST,
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

describe('kinesis source parameters validation', () => {
  test('batch size > 10000 should throw', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'demo-stack');
    const stream = new Stream(stack, 'MyStream', {});

    // WHEN
    expect(() => {
      new KinesisSource(stream, {
        startingPosition: StartingPosition.LATEST,
        batchSize: 10001,
      });
    }).toThrow('Batch size must be between 1 and 10000, received 10001');
  });

  test('batch size < 1 should throw', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'demo-stack');
    const stream = new Stream(stack, 'MyStream', {});

    // WHEN
    expect(() => {
      new KinesisSource(stream, {
        startingPosition: StartingPosition.LATEST,
        batchSize: 0,
      });
    }).toThrow('Batch size must be between 1 and 10000, received 0');
  });

  test('maximum batching window > 300 should throw', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'demo-stack');
    const stream = new Stream(stack, 'MyStream', {});

    // WHEN
    expect(() => {
      new KinesisSource(stream, {
        startingPosition: StartingPosition.LATEST,
        maximumBatchingWindow: Duration.seconds(301),
      });
    }).toThrow('Maximum batching window must be between 0 and 300, received 301');
  });

  test('maximum record age < -1 should throw', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'demo-stack');
    const stream = new Stream(stack, 'MyStream', {});

    // WHEN
    expect(() => {
      new KinesisSource(stream, {
        startingPosition: StartingPosition.LATEST,
        maximumRecordAgeInSeconds: -2,
      });
    }).toThrow('Maximum record age in seconds must be between -1 and 604800, received -2');
  });

  test('maximum record age > 604800 should throw', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'demo-stack');
    const stream = new Stream(stack, 'MyStream', {});

    // WHEN
    expect(() => {
      new KinesisSource(stream, {
        startingPosition: StartingPosition.LATEST,
        maximumRecordAgeInSeconds: 604801,
      });
    }).toThrow('Maximum record age in seconds must be between -1 and 604800, received 604801');
  });

  test('maximum retry attempts < -1 should throw', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'demo-stack');
    const stream = new Stream(stack, 'MyStream', {});

    // WHEN
    expect(() => {
      new KinesisSource(stream, {
        startingPosition: StartingPosition.LATEST,
        maximumRetryAttempts: -2,
      });
    }).toThrow('Maximum retry attempts must be between -1 and 10000, received -2');
  });

  test('maximum retry attempts > 10000 should throw', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'demo-stack');
    const stream = new Stream(stack, 'MyStream', {});

    // WHEN
    expect(() => {
      new KinesisSource(stream, {
        startingPosition: StartingPosition.LATEST,
        maximumRetryAttempts: 10001,
      });
    }).toThrow('Maximum retry attempts must be between -1 and 10000, received 10001');
  });

  test('parallelization factor < 1 should throw', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'demo-stack');
    const stream = new Stream(stack, 'MyStream', {});

    // WHEN
    expect(() => {
      new KinesisSource(stream, {
        startingPosition: StartingPosition.LATEST,
        parallelizationFactor: 0,
      });
    }).toThrow('Parallelization factor must be between 1 and 10, received 0');
  });

  test('parallelization factor > 10 should throw', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'demo-stack');
    const stream = new Stream(stack, 'MyStream', {});

    // WHEN
    expect(() => {
      new KinesisSource(stream, {
        startingPosition: StartingPosition.LATEST,
        parallelizationFactor: 11,
      });
    }).toThrow('Parallelization factor must be between 1 and 10, received 11');
  });
});
