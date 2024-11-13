
import { InputTransformation, Pipe } from '@aws-cdk/aws-pipes-alpha';
import { App, Lazy, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { LogGroup } from 'aws-cdk-lib/aws-logs';
import { TestSource } from './test-classes';
import { CloudWatchLogsTarget } from '../lib/cloudwatch-logs';

describe('CloudWatch Logs', () => {
  it('should have only target arn', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const logGroup = new LogGroup(stack, 'MyLogGroup', {});
    const target = new CloudWatchLogsTarget(logGroup);

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
          'MyLogGroup5C0DAD85',
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
    const logGroup = new LogGroup(stack, 'MyLogGroup', {});
    const target = new CloudWatchLogsTarget(logGroup, {
      logStreamName: 'log-stream-name',
      timestamp: '1719286581019',
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
        CloudWatchLogsParameters: {
          LogStreamName: 'log-stream-name',
          Timestamp: '1719286581019',
        },
      },
    });
  });

  it('should have input transformation', () => {
    // ARRANGE
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const logGroup = new LogGroup(stack, 'MyLogGroup', {});

    const inputTransformation = InputTransformation.fromObject({
      key: 'value',
    });

    const target = new CloudWatchLogsTarget(logGroup, {
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
    const logGroup = new LogGroup(stack, 'MyLogGroup', {});
    const target = new CloudWatchLogsTarget(logGroup);

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

describe('CloudWatch Logs source parameters validation', () => {
  test('Log stream name must be >= 1 character', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const logGroup = new LogGroup(stack, 'MyLogGroup', {});

    // WHEN
    expect(() => {
      new CloudWatchLogsTarget(logGroup, {
        logStreamName: '',
      });
    }).toThrow('Log stream name must be between 1 and 256 characters, received 0');
  });

  test('Log stream name must be <= 256 characters', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const logGroup = new LogGroup(stack, 'MyLogGroup', {});

    // WHEN
    expect(() => {
      new CloudWatchLogsTarget(logGroup, {
        logStreamName: 'x'.repeat(257),
      });
    }).toThrow('Log stream name must be between 1 and 256 characters, received 257');
  });

  test('validateLogStreamName works with a token', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const logGroup = new LogGroup(stack, 'MyLogGroup', {});
    const logStreamName = Lazy.string({ produce: () => 'log-stream-name' });
    const target = new CloudWatchLogsTarget(logGroup, { logStreamName });

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
          'MyLogGroup5C0DAD85',
          'Arn',
        ],
      },
      TargetParameters: {
        CloudWatchLogsParameters: {
          LogStreamName: 'log-stream-name',
        },
      },
    });
  });

  test('Timestamp must be >= 1 character', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const logGroup = new LogGroup(stack, 'MyLogGroup', {});

    // WHEN
    expect(() => {
      new CloudWatchLogsTarget(logGroup, {
        timestamp: '',
      });
    }).toThrow('Timestamp must be between 1 and 256 characters, received 0');
  });

  test('Timestamp must be <= 256 characters', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const logGroup = new LogGroup(stack, 'MyLogGroup', {});

    // WHEN
    expect(() => {
      new CloudWatchLogsTarget(logGroup, {
        timestamp: 'x'.repeat(257),
      });
    }).toThrow('Timestamp must be between 1 and 256 characters, received 257');
  });

  test('validateTimestamp works with a token', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const logGroup = new LogGroup(stack, 'MyLogGroup', {});
    const timestamp = Lazy.string({ produce: () => 'timestamp' });
    const target = new CloudWatchLogsTarget(logGroup, { timestamp });

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
          'MyLogGroup5C0DAD85',
          'Arn',
        ],
      },
      TargetParameters: {
        CloudWatchLogsParameters: {
          Timestamp: 'timestamp',
        },
      },
    });
  });
});
