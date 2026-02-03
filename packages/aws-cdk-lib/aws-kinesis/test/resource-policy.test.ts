import { Template } from '../../assertions';
import * as iam from '../../aws-iam';
import { Stack } from '../../core';
import { ResourcePolicy, Stream, StreamConsumer } from '../lib';

describe('Kinesis resource policy', () => {
  let stack: Stack;
  let stream: Stream;
  let streamConsumer: StreamConsumer;

  beforeEach(() => {
    stack = new Stack();
    stream = new Stream(stack, 'Stream', {});
    streamConsumer = new StreamConsumer(stack, 'StreamConsumer', {
      streamConsumerName: 'consumer',
      stream,
    });
  });

  test('create stream resource policy', () => {
    // WHEN
    const policyDocument = new iam.PolicyDocument({
      assignSids: true,
      statements: [
        new iam.PolicyStatement({
          actions: ['kinesis:GetRecords'],
          principals: [new iam.AnyPrincipal()],
          resources: [stream.streamArn],
        }),
      ],
    });

    new ResourcePolicy(stack, 'ResourcePolicy', {
      stream,
      policyDocument,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Kinesis::ResourcePolicy', {
      ResourcePolicy: {
        Version: '2012-10-17',
        Statement: [
          {
            Sid: '0',
            Action: 'kinesis:GetRecords',
            Effect: 'Allow',
            Principal: { AWS: '*' },
            Resource: stack.resolve(stream.streamArn),
          },
        ],
      },
    });
  });

  test('create stream consumer resource policy', () => {
    // WHEN
    const policyDocument = new iam.PolicyDocument({
      assignSids: true,
      statements: [
        new iam.PolicyStatement({
          actions: ['kinesis:GetRecords'],
          principals: [new iam.AnyPrincipal()],
          resources: [streamConsumer.streamConsumerArn],
        }),
      ],
    });

    new ResourcePolicy(stack, 'ResourcePolicy', {
      streamConsumer,
      policyDocument,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Kinesis::ResourcePolicy', {
      ResourcePolicy: {
        Version: '2012-10-17',
        Statement: [
          {
            Sid: '0',
            Action: 'kinesis:GetRecords',
            Effect: 'Allow',
            Principal: { AWS: '*' },
            Resource: stack.resolve(streamConsumer.streamConsumerArn),
          },
        ],
      },
    });
  });

  test('fail resource policy creation with both stream and streamConsumer set', () => {
    // WHEN
    const policyDocument = new iam.PolicyDocument({
      assignSids: true,
      statements: [
        new iam.PolicyStatement({
          actions: ['kinesis:GetRecords'],
          principals: [new iam.AnyPrincipal()],
          resources: [streamConsumer.streamConsumerArn],
        }),
      ],
    });

    expect(() => {
      new ResourcePolicy(stack, 'ResourcePolicy', {
        stream,
        streamConsumer,
        policyDocument,
      });
    }).toThrow('Only one of stream or streamConsumer can be set');
  });

  test('fail resource policy creation with neither stream nor streamConsumer set', () => {
    // WHEN
    const policyDocument = new iam.PolicyDocument({
      assignSids: true,
      statements: [
        new iam.PolicyStatement({
          actions: ['kinesis:GetRecords'],
          principals: [new iam.AnyPrincipal()],
          resources: [streamConsumer.streamConsumerArn],
        }),
      ],
    });

    expect(() => {
      new ResourcePolicy(stack, 'ResourcePolicy', {
        policyDocument,
      });
    }).toThrow('One of stream or streamConsumer must be set');
  });
});
