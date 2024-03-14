import { Pipe } from '@aws-cdk/aws-pipes-alpha';
import { App, Duration, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Stream } from 'aws-cdk-lib/aws-kinesis';
import { TestTarget } from './test-classes';
import { KinesisSource, OnPartialBatchItemFailure, StartingPosition } from '../lib';

describe('kinesis', () => {
  it('should have only source arn', () => {
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
    template.hasResourceProperties('AWS::Pipes::Pipe', {
      Source: {
        'Fn::GetAtt': [
          'MyStream5C050E93',
          'Arn',
        ],
      },
      SourceParameters: {
        KinesisStreamParameters: {
          StartingPosition: 'LATEST',
        },
      },
    });
  });

  it('should have source parameters', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const stream = new Stream(stack, 'MyStream', {});
    const source = new KinesisSource(stream, {
      batchSize: 10,
      deadLetterConfig: {
        arn: 'FakeArn',
      },
      maximumBatchingWindow: Duration.seconds(10),
      maximumRecordAge: Duration.seconds(10),
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
            Arn: 'FakeArn',
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
