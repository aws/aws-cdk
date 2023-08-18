import { Template } from '../../assertions';
import { IRole, Role, ServicePrincipal } from '../../aws-iam';
import { IStream, Stream } from '../../aws-kinesis';
import { App, Stack } from '../../core';
import { Endpoint, RealtimeLogConfig } from '../lib';

describe('RealtimeLogConfig', () => {
  let app: App;
  let stack: Stack;

  let stream: IStream;
  let role: IRole;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'Stack', {
      env: { account: '1234', region: 'testregion' },
    });
    stream = new Stream(stack, 'stream');
    role = new Role(stack, 'my-role', {
      assumedBy: new ServicePrincipal('cloudfront.amazonaws.com'),
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
      name: 'realtime-log-collector',
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
        name: 'realtime-log-collector',
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
        name: 'realtime-log-collector',
        samplingRate: 0,
      });
    }).toThrow(errorMessage);
  });
});
