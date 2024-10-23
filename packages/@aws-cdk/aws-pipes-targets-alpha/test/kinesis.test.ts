import { InputTransformation, Pipe } from '@aws-cdk/aws-pipes-alpha';
import { App, Lazy, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Stream } from 'aws-cdk-lib/aws-kinesis';
import { TestSource } from './test-classes';
import { KinesisTarget } from '../lib/kinesis';

describe('Kinesis', () => {
  it('should have target arn and partition key', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const stream = new Stream(stack, 'MyStream', {});

    const target = new KinesisTarget(stream, {
      partitionKey: 'pk',
    });

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
          'MyStream5C050E93',
          'Arn',
        ],
      },
      TargetParameters: {
        KinesisStreamParameters: {
          PartitionKey: 'pk',
        },
      },
    });
  });

  it('should have input transformation', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const stream = new Stream(stack, 'MyStream', {});

    const inputTransformation = InputTransformation.fromObject({
      key: 'value',
    });
    const target = new KinesisTarget(stream, {
      partitionKey: 'pk',
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
    const stream = new Stream(stack, 'MyStream', {});

    const target = new KinesisTarget(stream, {
      partitionKey: 'pk',
    });

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

describe('Kinesis target parameters validation', () => {
  test('Partition key must be <= 256 characters', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const stream = new Stream(stack, 'MyStream', {});

    // WHEN
    expect(() => {
      new KinesisTarget(stream, {
        partitionKey: 'x'.repeat(257),
      });
    }).toThrow('Partition key must be less than or equal to 256 characters, received 257');
  });

  test('Partition key can be given for a token', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const stream = new Stream(stack, 'MyStream', {});
    const partitionKey = Lazy.string({ produce: () => '20' });

    const target = new KinesisTarget(stream, {
      partitionKey,
    });

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
          'MyStream5C050E93',
          'Arn',
        ],
      },
      TargetParameters: {
        KinesisStreamParameters: {
          PartitionKey: '20',
        },
      },
    });
  });
});
