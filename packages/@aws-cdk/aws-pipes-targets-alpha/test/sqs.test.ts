import { InputTransformation, Pipe } from '@aws-cdk/aws-pipes-alpha';
import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { TestSource } from './test-classes';
import { SqsTarget } from '../lib';

describe('sqs', () => {
  it('should have only target arn', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    const queue = new Queue(stack, 'MySqs', {});

    const target = new SqsTarget(queue);

    new Pipe(stack, 'MyPipe', {
      source: new TestSource(),
      target,
    });

    // ACT
    const template = Template.fromStack(stack);

    // ASSERT
    template.hasResourceProperties('AWS::Pipes::Pipe', {
      Target: {
        'Fn::GetAtt': [
          'MySqs4F2D580E',
          'Arn',
        ],
      },
      TargetParameters: {},
    });
  });

  it('should have target parameters', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    const queue = new Queue(stack, 'MySqs', {});

    const target = new SqsTarget(queue, {
      messageDeduplicationId: 'deduplication-id',
      messageGroupId: 'group-id',
    });

    new Pipe(stack, 'MyPipe', {
      source: new TestSource(),
      target,
    });

    // ACT
    const template = Template.fromStack(stack);

    // ASSERT
    template.hasResourceProperties('AWS::Pipes::Pipe', {
      TargetParameters: {
        SqsQueueParameters: {
          MessageDeduplicationId: 'deduplication-id',
          MessageGroupId: 'group-id',
        },
      },
    });
  });

  it('should have input transformation', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    const queue = new Queue(stack, 'MySqs', {});

    const inputTransformation = InputTransformation.fromObject({
      key: 'value',
    });
    const target = new SqsTarget(queue, {
      inputTransformation,
    });

    new Pipe(stack, 'MyPipe', {
      source: new TestSource(),
      target,
    });

    // ACT
    const template = Template.fromStack(stack);

    // ASSERT
    template.hasResourceProperties('AWS::Pipes::Pipe', {
      TargetParameters: {
        InputTemplate: '{"key":"value"}',
      },
    });
  });

  it('should grant pipe role push access', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestStack');

    const queue = new Queue(stack, 'MySqs', {});

    const target = new SqsTarget(queue);

    new Pipe(stack, 'MyPipe', {
      source: new TestSource(),
      target,
    });

    // ACT
    const template = Template.fromStack(stack);

    // ASSERT
    expect(template.findResources('AWS::IAM::Role')).toMatchSnapshot();
    expect(template.findResources('AWS::IAM::Policy')).toMatchSnapshot();
  });
});
