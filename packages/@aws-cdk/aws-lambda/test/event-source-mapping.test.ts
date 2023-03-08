import { Match, Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import { Code, EventSourceMapping, Function, Runtime, Alias, StartingPosition, FilterRule, FilterCriteria } from '../lib';

let stack: cdk.Stack;
let fn: Function;
beforeEach(() => {
  stack = new cdk.Stack();
  fn = new Function(stack, 'fn', {
    handler: 'index.handler',
    code: Code.fromInline('exports.handler = ${handler.toString()}'),
    runtime: Runtime.NODEJS_14_X,
  });
});

describe('event source mapping', () => {
  test('verify that alias.addEventSourceMapping produces stable ids', () => {
    // GIVEN
    var alias = new Alias(stack, 'LiveAlias', {
      aliasName: 'Live',
      version: fn.currentVersion,
    });

    // WHEN
    alias.addEventSourceMapping('MyMapping', {
      eventSourceArn: 'asfd',
    });

    // THEN
    Template.fromStack(stack).templateMatches({
      Resources: {
        // Crucially, no ID in there that depends on the state of the Lambda
        LiveAliasMyMapping4E1B698B: { Type: 'AWS::Lambda::EventSourceMapping' },
      },
    });
  });

  test('throws if maxBatchingWindow > 300 seconds', () => {
    expect(() => new EventSourceMapping(stack, 'test', {
      target: fn,
      eventSourceArn: '',
      maxBatchingWindow: cdk.Duration.seconds(301),
    })).toThrow(/maxBatchingWindow cannot be over 300 seconds/);
  });

  test('throws if maxConcurrency < 2 concurrent instances', () => {
    expect(() => new EventSourceMapping(stack, 'test', {
      target: fn,
      eventSourceArn: '',
      maxConcurrency: 1,
    })).toThrow(/maxConcurrency must be between 2 and 1000 concurrent instances/);
  });

  test('throws if maxConcurrency > 1000 concurrent instances', () => {
    expect(() => new EventSourceMapping(stack, 'test', {
      target: fn,
      eventSourceArn: '',
      maxConcurrency: 1001,
    })).toThrow(/maxConcurrency must be between 2 and 1000 concurrent instances/);
  });

  test('maxConcurrency appears in stack', () => {
    new EventSourceMapping(stack, 'test', {
      target: fn,
      eventSourceArn: '',
      maxConcurrency: 2,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
      ScalingConfig: { MaximumConcurrency: 2 },
    });
  });

  test('throws if maxRecordAge is below 60 seconds', () => {
    expect(() => new EventSourceMapping(stack, 'test', {
      target: fn,
      eventSourceArn: '',
      maxRecordAge: cdk.Duration.seconds(59),
    })).toThrow(/maxRecordAge must be between 60 seconds and 7 days inclusive/);
  });

  test('throws if maxRecordAge is over 7 days', () => {
    expect(() => new EventSourceMapping(stack, 'test', {
      target: fn,
      eventSourceArn: '',
      maxRecordAge: cdk.Duration.seconds(604801),
    })).toThrow(/maxRecordAge must be between 60 seconds and 7 days inclusive/);
  });

  test('throws if retryAttempts is negative', () => {
    expect(() => new EventSourceMapping(stack, 'test', {
      target: fn,
      eventSourceArn: '',
      retryAttempts: -1,
    })).toThrow(/retryAttempts must be between 0 and 10000 inclusive, got -1/);
  });

  test('throws if retryAttempts is over 10000', () => {
    expect(() => new EventSourceMapping(stack, 'test', {
      target: fn,
      eventSourceArn: '',
      retryAttempts: 10001,
    })).toThrow(/retryAttempts must be between 0 and 10000 inclusive, got 10001/);
  });

  test('accepts if retryAttempts is a token', () => {
    new EventSourceMapping(stack, 'test', {
      target: fn,
      eventSourceArn: '',
      retryAttempts: cdk.Lazy.number({ produce: () => 100 }),
    });
  });

  test('throws if parallelizationFactor is below 1', () => {
    expect(() => new EventSourceMapping(stack, 'test', {
      target: fn,
      eventSourceArn: '',
      parallelizationFactor: 0,
    })).toThrow(/parallelizationFactor must be between 1 and 10 inclusive, got 0/);
  });

  test('throws if parallelizationFactor is over 10', () => {
    expect(() => new EventSourceMapping(stack, 'test', {
      target: fn,
      eventSourceArn: '',
      parallelizationFactor: 11,
    })).toThrow(/parallelizationFactor must be between 1 and 10 inclusive, got 11/);
  });

  test('accepts if parallelizationFactor is a token', () => {
    new EventSourceMapping(stack, 'test', {
      target: fn,
      eventSourceArn: '',
      parallelizationFactor: cdk.Lazy.number({ produce: () => 20 }),
    });
  });

  test('import event source mapping', () => {
    const stack2 = new cdk.Stack(undefined, undefined, { stackName: 'test-stack' });
    const imported = EventSourceMapping.fromEventSourceMappingId(stack2, 'imported', '14e0db71-5d35-4eb5-b481-8945cf9d10c2');

    expect(imported.eventSourceMappingId).toEqual('14e0db71-5d35-4eb5-b481-8945cf9d10c2');
    expect(imported.stack.stackName).toEqual('test-stack');
  });

  test('accepts if kafkaTopic is a parameter', () => {
    const topicNameParam = new cdk.CfnParameter(stack, 'TopicNameParam', {
      type: 'String',
    });

    new EventSourceMapping(stack, 'test', {
      target: fn,
      eventSourceArn: '',
      kafkaTopic: topicNameParam.valueAsString,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
      Topics: [{
        Ref: 'TopicNameParam',
      }],
    });
  });

  test('throws if neither eventSourceArn nor kafkaBootstrapServers are set', () => {
    expect(() => new EventSourceMapping(stack, 'test', {
      target: fn,
    })).toThrow(/Either eventSourceArn or kafkaBootstrapServers must be set/);
  });

  test('throws if both eventSourceArn and kafkaBootstrapServers are set', () => {
    expect(() => new EventSourceMapping(stack, 'test', {
      eventSourceArn: '',
      kafkaBootstrapServers: [],
      target: fn,
    })).toThrow(/eventSourceArn and kafkaBootstrapServers are mutually exclusive/);
  });

  test('throws if both kafkaBootstrapServers is set but empty', () => {
    expect(() => new EventSourceMapping(stack, 'test', {
      kafkaBootstrapServers: [],
      target: fn,
    })).toThrow(/kafkaBootStrapServers must not be empty if set/);
  });

  test('throws if kafkaConsumerGroupId is invalid', () => {
    expect(() => new EventSourceMapping(stack, 'test', {
      eventSourceArn: 'arn:aws:kafka:us-east-1:123456789012:cluster/vpc-2priv-2pub/751d2973-a626-431c-9d4e-d7975eb44dd7-2',
      kafkaConsumerGroupId: 'some invalid',
      target: fn,
    })).toThrow('kafkaConsumerGroupId contains invalid characters. Allowed values are "[a-zA-Z0-9-\/*:_+=.@-]"');
  });

  test('throws if kafkaConsumerGroupId is too long', () => {
    expect(() => new EventSourceMapping(stack, 'test', {
      eventSourceArn: 'arn:aws:kafka:us-east-1:123456789012:cluster/vpc-2priv-2pub/751d2973-a626-431c-9d4e-d7975eb44dd7-2',
      kafkaConsumerGroupId: 'x'.repeat(201),
      target: fn,
    })).toThrow('kafkaConsumerGroupId must be a valid string between 1 and 200 characters');
  });

  test('not throws if kafkaConsumerGroupId is empty', () => {
    expect(() => new EventSourceMapping(stack, 'test', {
      eventSourceArn: 'arn:aws:kafka:us-east-1:123456789012:cluster/vpc-2priv-2pub/751d2973-a626-431c-9d4e-d7975eb44dd7-2',
      kafkaConsumerGroupId: '',
      target: fn,
    })).not.toThrow();
  });

  test('not throws if kafkaConsumerGroupId is token', () => {
    expect(() => new EventSourceMapping(stack, 'test', {
      eventSourceArn: 'arn:aws:kafka:us-east-1:123456789012:cluster/vpc-2priv-2pub/751d2973-a626-431c-9d4e-d7975eb44dd7-2',
      kafkaConsumerGroupId: cdk.Lazy.string({ produce: () => 'test' }),
      target: fn,
    })).not.toThrow();
  });

  test('not throws if kafkaConsumerGroupId is valid for amazon managed kafka', () => {
    expect(() => new EventSourceMapping(stack, 'test', {
      eventSourceArn: 'arn:aws:kafka:us-east-1:123456789012:cluster/vpc-2priv-2pub/751d2973-a626-431c-9d4e-d7975eb44dd7-2',
      kafkaConsumerGroupId: 'someValidConsumerGroupId',
      target: fn,
    })).not.toThrow();
  });

  test('not throws if kafkaConsumerGroupId is valid for self managed kafka', () => {
    expect(() => new EventSourceMapping(stack, 'test', {
      kafkaBootstrapServers: ['kafka-broker-1:9092', 'kafka-broker-2:9092'],
      kafkaConsumerGroupId: 'someValidConsumerGroupId',
      target: fn,
    })).not.toThrow();
  });

  test('eventSourceArn appears in stack', () => {
    const topicNameParam = new cdk.CfnParameter(stack, 'TopicNameParam', {
      type: 'String',
    });

    let eventSourceArn = 'some-arn';

    new EventSourceMapping(stack, 'test', {
      target: fn,
      eventSourceArn: eventSourceArn,
      kafkaTopic: topicNameParam.valueAsString,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
      EventSourceArn: eventSourceArn,
    });
  });

  test('filter with one pattern', () => {
    const topicNameParam = new cdk.CfnParameter(stack, 'TopicNameParam', {
      type: 'String',
    });

    let eventSourceArn = 'some-arn';

    new EventSourceMapping(stack, 'test', {
      target: fn,
      eventSourceArn: eventSourceArn,
      kafkaTopic: topicNameParam.valueAsString,
      filters: [
        FilterCriteria.filter({
          numericEquals: FilterRule.isEqual(1),
        }),
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
      FilterCriteria: {
        Filters: [
          {
            Pattern: '{"numericEquals":[{"numeric":["=",1]}]}',
          },
        ],
      },
    });
  });

  test('filter with more than one pattern', () => {
    const topicNameParam = new cdk.CfnParameter(stack, 'TopicNameParam', {
      type: 'String',
    });

    let eventSourceArn = 'some-arn';

    new EventSourceMapping(stack, 'test', {
      target: fn,
      eventSourceArn: eventSourceArn,
      kafkaTopic: topicNameParam.valueAsString,
      filters: [
        FilterCriteria.filter({
          orFilter: FilterRule.or('one', 'two'),
          stringEquals: FilterRule.isEqual('test'),
        }),
        FilterCriteria.filter({
          numericEquals: FilterRule.isEqual(1),
        }),
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
      FilterCriteria: {
        Filters: [
          {
            Pattern: '{"orFilter":["one","two"],"stringEquals":["test"]}',
          },
          {
            Pattern: '{"numericEquals":[{"numeric":["=",1]}]}',
          },
        ],
      },
    });
  });

  test('kafkaBootstrapServers appears in stack', () => {
    const topicNameParam = new cdk.CfnParameter(stack, 'TopicNameParam', {
      type: 'String',
    });

    let kafkaBootstrapServers = ['kafka-broker.example.com:9092'];
    new EventSourceMapping(stack, 'test', {
      target: fn,
      kafkaBootstrapServers: kafkaBootstrapServers,
      kafkaTopic: topicNameParam.valueAsString,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
      SelfManagedEventSource: { Endpoints: { KafkaBootstrapServers: kafkaBootstrapServers } },
    });
  });

  test('throws if tumblingWindow > 900 seconds', () => {
    expect(() => new EventSourceMapping(stack, 'test', {
      target: fn,
      eventSourceArn: '',
      tumblingWindow: cdk.Duration.seconds(901),
    })).toThrow(/tumblingWindow cannot be over 900 seconds/);
  });

  test('accepts if tumblingWindow is a token', () => {
    const lazyDuration = cdk.Duration.seconds(cdk.Lazy.number({ produce: () => 60 }));

    new EventSourceMapping(stack, 'test', {
      target: fn,
      eventSourceArn: '',
      tumblingWindow: lazyDuration,
    });
  });

  test('transforms reportBatchItemFailures into functionResponseTypes with ReportBatchItemFailures', () => {
    new EventSourceMapping(stack, 'test', {
      target: fn,
      eventSourceArn: '',
      reportBatchItemFailures: true,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
      FunctionResponseTypes: ['ReportBatchItemFailures'],
    });
  });

  test('transforms missing reportBatchItemFailures into absent FunctionResponseTypes', () => {
    new EventSourceMapping(stack, 'test', {
      target: fn,
      eventSourceArn: '',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
      FunctionResponseTypes: Match.absent(),
    });
  });

  test('transforms reportBatchItemFailures false into absent FunctionResponseTypes', () => {
    new EventSourceMapping(stack, 'test', {
      target: fn,
      eventSourceArn: '',
      reportBatchItemFailures: false,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
      FunctionResponseTypes: Match.absent(),
    });
  });

  test('AT_TIMESTAMP starting position', () => {
    new EventSourceMapping(stack, 'test', {
      target: fn,
      eventSourceArn: '',
      startingPosition: StartingPosition.AT_TIMESTAMP,
      startingPositionTimestamp: 1640995200,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::EventSourceMapping', {
      StartingPosition: 'AT_TIMESTAMP',
      StartingPositionTimestamp: 1640995200,
    });
  });

  test('startingPositionTimestamp missing throws error', () => {
    expect(() => new EventSourceMapping(stack, 'test', {
      target: fn,
      eventSourceArn: '',
      startingPosition: StartingPosition.AT_TIMESTAMP,
    })).toThrow(/startingPositionTimestamp must be provided when startingPosition is AT_TIMESTAMP/);
  });

  test('startingPositionTimestamp without AT_TIMESTAMP throws error', () => {
    expect(() => new EventSourceMapping(stack, 'test', {
      target: fn,
      eventSourceArn: '',
      startingPosition: StartingPosition.LATEST,
      startingPositionTimestamp: 1640995200,
    })).toThrow(/startingPositionTimestamp can only be used when startingPosition is AT_TIMESTAMP/);
  });
});
