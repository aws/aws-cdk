import { Pipe } from '@aws-cdk/aws-pipes-alpha';
import { App, Duration, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { TestTarget } from './test-classes';
import { SqsSource } from '../lib';

describe('sqs', () => {
  it('should have source arn', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    const queue = new Queue(stack, 'MySqs', {});

    const source = new SqsSource(queue);

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
          'MySqs4F2D580E',
          'Arn',
        ],
      },
    });

  });

  it('should have source parameters', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    const queue = new Queue(stack, 'MySqs', {});

    const source = new SqsSource(queue, {
      batchSize: 10,
      maximumBatchingWindow: Duration.seconds(10),
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
        SqsQueueParameters: {
          BatchSize: 10,
          MaximumBatchingWindowInSeconds: 10,
        },
      },
    });

  });

  it('should grant pipe role read access', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    const queue = new Queue(stack, 'MySqs', {});

    const source = new SqsSource(queue);

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
