import { InputTransformation, Pipe } from '@aws-cdk/aws-pipes-alpha';
import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { TestSource } from './test-classes';
import { SnsTarget } from '../lib';

describe('sns', () => {
  it('should have only target arn', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const topic = new Topic(stack, 'MyTopic', {});
    const target = new SnsTarget(topic);

    new Pipe(stack, 'MyPipe', {
      source: new TestSource(),
      target,
    });

    // ACT
    const template = Template.fromStack(stack);

    // ASSERT
    template.hasResourceProperties('AWS::Pipes::Pipe', {
      Target: {
        Ref: 'MyTopic86869434',
      },
      TargetParameters: {},
    });
  });

  it('should have input transformation', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const topic = new Topic(stack, 'MyTopic', {});

    const inputTransformation = InputTransformation.fromObject({
      key: 'value',
    });
    const target = new SnsTarget(topic, {
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

  it('should handle an empty parameter object', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const topic = new Topic(stack, 'MyTopic', {});

    const target = new SnsTarget(topic, {});

    new Pipe(stack, 'MyPipe', {
      source: new TestSource(),
      target,
    });

    // ACT
    const template = Template.fromStack(stack);

    // ASSERT
    template.hasResourceProperties('AWS::Pipes::Pipe', {
      TargetParameters: {},
    });
  });

  it('should grant pipe role publish access', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const topic = new Topic(stack, 'MyTopic', {});
    const target = new SnsTarget(topic);

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
