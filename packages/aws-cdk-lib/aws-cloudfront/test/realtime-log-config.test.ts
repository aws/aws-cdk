import { Match, Template } from '../../assertions';
import * as iam from '../../aws-iam';
import * as kinesis from '../../aws-kinesis';
import * as kms from '../../aws-kms';
import { App, Stack } from '../../core';
import { Endpoint, RealtimeLogConfig } from '../lib';

describe('RealtimeLogConfig', () => {
  let app: App;
  let stack: Stack;

  let stream: kinesis.IStream;
  let role: iam.Role;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'Stack', {
      env: { account: '1234', region: 'testregion' },
    });
    stream = new kinesis.Stream(stack, 'stream');
    role = new iam.Role(stack, 'my-role', {
      assumedBy: new iam.ServicePrincipal('cloudfront.amazonaws.com'),
    });
  });

  test('realtime config setup', () => {
    new RealtimeLogConfig(stack, 'MyRealtimeLogConfig', {
      endPoints: [
        Endpoint.fromKinesisStream(stream, role),
      ],
      fields: [
        'timestamp',
        'c-ip',
      ],
      realtimeLogConfigName: 'realtime-log-collector',
      samplingRate: 1,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::RealtimeLogConfig', {
      EndPoints: [{
        KinesisStreamConfig: {
          RoleArn: {
            'Fn::GetAtt': ['myrole97476C1B', 'Arn'],
          },
          StreamArn: {
            'Fn::GetAtt': ['stream19075594', 'Arn'],
          },
        },
      }],
      Fields: ['timestamp', 'c-ip'],
      Name: 'realtime-log-collector',
      SamplingRate: 1,
    });
  });

  test('throws on sampling rate being 111', () => {
    const errorMessage = 'Sampling rate must be between 1 and 100 (inclusive), received 111';
    expect(() => {
      new RealtimeLogConfig(stack, 'MyRealtimeLogConfig', {
        endPoints: [
          Endpoint.fromKinesisStream(stream, role),
        ],
        fields: [
          'timestamp',
          'c-ip',
        ],
        realtimeLogConfigName: 'realtime-log-collector',
        samplingRate: 111,
      });
    }).toThrow(errorMessage);
  });

  test('throws on sampling rate being 0', () => {
    const errorMessage = 'Sampling rate must be between 1 and 100 (inclusive), received 0';
    expect(() => {
      new RealtimeLogConfig(stack, 'MyRealtimeLogConfig', {
        endPoints: [
          Endpoint.fromKinesisStream(stream, role),
        ],
        fields: [
          'timestamp',
          'c-ip',
        ],
        realtimeLogConfigName: 'realtime-log-collector',
        samplingRate: 0,
      });
    }).toThrow(errorMessage);
  });

  test('realtime config setup - generate unique id', () => {
    new RealtimeLogConfig(stack, 'MyRealtimeLogConfig', {
      endPoints: [
        Endpoint.fromKinesisStream(stream, role),
      ],
      fields: [
        'timestamp',
        'c-ip',
      ],
      samplingRate: 1,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::RealtimeLogConfig', {
      EndPoints: [{
        KinesisStreamConfig: {
          RoleArn: {
            'Fn::GetAtt': ['myrole97476C1B', 'Arn'],
          },
          StreamArn: {
            'Fn::GetAtt': ['stream19075594', 'Arn'],
          },
        },
      }],
      Fields: ['timestamp', 'c-ip'],
      Name: 'StackMyRealtimeLogConfig4A2E70EF',
      SamplingRate: 1,
    });
  });

  test('realtime config setup default role', () => {
    new RealtimeLogConfig(stack, 'MyRealtimeLogConfig', {
      endPoints: [
        Endpoint.fromKinesisStream(stream),
      ],
      fields: [
        'timestamp',
        'c-ip',
      ],
      samplingRate: 1,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::RealtimeLogConfig', {
      EndPoints: [{
        KinesisStreamConfig: {
          RoleArn: {
            'Fn::GetAtt': ['MyRealtimeLogConfigRealtimeLogKinesisRole3AD572A6', 'Arn'],
          },
          StreamArn: {
            'Fn::GetAtt': ['stream19075594', 'Arn'],
          },
        },
      }],
      Fields: ['timestamp', 'c-ip'],
      Name: 'StackMyRealtimeLogConfig4A2E70EF',
      SamplingRate: 1,
    });
  });

  test('realtime config setup default role - multiple kinesis endpoints', () => {
    const secondStream = new kinesis.Stream(stack, 'stream2');

    new RealtimeLogConfig(stack, 'MyRealtimeLogConfig', {
      endPoints: [
        Endpoint.fromKinesisStream(stream),
        Endpoint.fromKinesisStream(secondStream),
      ],
      fields: [
        'timestamp',
        'c-ip',
      ],
      samplingRate: 1,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::RealtimeLogConfig', {
      EndPoints: [{
        KinesisStreamConfig: {
          RoleArn: {
            'Fn::GetAtt': ['MyRealtimeLogConfigRealtimeLogKinesisRole3AD572A6', 'Arn'],
          },
          StreamArn: {
            'Fn::GetAtt': ['stream19075594', 'Arn'],
          },
        },
      }, {
        KinesisStreamConfig: {
          RoleArn: {
            'Fn::GetAtt': ['MyRealtimeLogConfigRealtimeLogKinesisRole3AD572A6', 'Arn'],
          },
          StreamArn: {
            'Fn::GetAtt': ['stream25EB1FBCF', 'Arn'],
          },
        },
      }],
      Fields: ['timestamp', 'c-ip'],
      Name: 'StackMyRealtimeLogConfig4A2E70EF',
      SamplingRate: 1,
    });
  });

  test('realtime config setup default role - multiple kinesis endpoints with generated iam role', () => {
    const secondStream = new kinesis.Stream(stack, 'stream2');

    new RealtimeLogConfig(stack, 'MyRealtimeLogConfig', {
      endPoints: [
        Endpoint.fromKinesisStream(stream),
        Endpoint.fromKinesisStream(secondStream),
      ],
      fields: [
        'timestamp',
        'c-ip',
      ],
      samplingRate: 1,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [{
          Action: [
            'kinesis:DescribeStreamSummary',
            'kinesis:DescribeStream',
            'kinesis:PutRecord',
            'kinesis:PutRecords',
          ],
          Resource: { 'Fn::GetAtt': ['stream19075594', 'Arn'] },
        },
        {
          Action: [
            'kinesis:DescribeStreamSummary',
            'kinesis:DescribeStream',
            'kinesis:PutRecord',
            'kinesis:PutRecords',
          ],
          Resource: { 'Fn::GetAtt': ['stream25EB1FBCF', 'Arn'] },
        }],
        Version: '2012-10-17',
      },
    });
  });

  test('realtime config setup default role - multiple kinesis endpoints with generated iam and kms', () => {
    const secondStream = new kinesis.Stream(stack, 'stream2', {
      encryption: kinesis.StreamEncryption.KMS,
      encryptionKey: new kms.Key(stack, 'key'),
    });

    const thirdStream = new kinesis.Stream(stack, 'stream3', {
      encryption: kinesis.StreamEncryption.MANAGED,
    });

    new RealtimeLogConfig(stack, 'MyRealtimeLogConfig', {
      endPoints: [
        Endpoint.fromKinesisStream(stream),
        Endpoint.fromKinesisStream(secondStream),
        Endpoint.fromKinesisStream(thirdStream),
      ],
      fields: [
        'timestamp',
        'c-ip',
      ],
      samplingRate: 1,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [{
          Action: [
            'kinesis:DescribeStreamSummary',
            'kinesis:DescribeStream',
            'kinesis:PutRecord',
            'kinesis:PutRecords',
          ],
          Resource: { 'Fn::GetAtt': ['stream19075594', 'Arn'] },
        },
        {
          Action: [
            'kinesis:DescribeStreamSummary',
            'kinesis:DescribeStream',
            'kinesis:PutRecord',
            'kinesis:PutRecords',
          ],
          Resource: { 'Fn::GetAtt': ['stream25EB1FBCF', 'Arn'] },
        },
        {
          Action: 'kms:GenerateDataKey',
          Resource: { 'Fn::GetAtt': ['keyFEDD6EC0', 'Arn'] },
        },
        {
          Action: [
            'kinesis:DescribeStreamSummary',
            'kinesis:DescribeStream',
            'kinesis:PutRecord',
            'kinesis:PutRecords',
          ],
          Resource: { 'Fn::GetAtt': ['stream358FA433A', 'Arn'] },
        }],
        Version: '2012-10-17',
      },
    });
  });

  test('realtime config setup with both default and specified role', () => {
    const secondStream = new kinesis.Stream(stack, 'secondstream', {
      encryption: kinesis.StreamEncryption.MANAGED,
    });

    new RealtimeLogConfig(stack, 'MyRealtimeLogConfig', {
      endPoints: [
        Endpoint.fromKinesisStream(stream),
        Endpoint.fromKinesisStream(secondStream, role),
      ],
      fields: [
        'timestamp',
        'c-ip',
      ],
      samplingRate: 1,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::CloudFront::RealtimeLogConfig', {
      EndPoints: [
        Match.objectLike({
          KinesisStreamConfig: {
            RoleArn: { 'Fn::GetAtt': ['MyRealtimeLogConfigRealtimeLogKinesisRole3AD572A6', 'Arn'] },
            StreamArn: { 'Fn::GetAtt': ['stream19075594', 'Arn'] },
          },
        }),
        Match.objectLike({
          KinesisStreamConfig: {
            RoleArn: { 'Fn::GetAtt': ['myrole97476C1B', 'Arn'] },
            StreamArn: { 'Fn::GetAtt': ['secondstreamB4F8BA11', 'Arn'] },
          },
        }),
      ],
    });
  });
});
