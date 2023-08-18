import { Template } from '../../assertions';
import { App, Stack } from '../../core';
import { DataStreamType, RealtimeLogConfig } from '../lib';

describe('RealtimeLogConfig', () => {
  let app: App;
  let stack: Stack;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'Stack', {
      env: { account: '1234', region: 'testregion' },
    });
  });

  test('realtime config setup', () => {
    new RealtimeLogConfig(stack, 'MyRealtimeLogConfig', {
      endPoints: [{
        kinesisStreamConfig: {
          roleArn: 'arn:aws:iam::111122223333:role/ForTest',
          streamArn: 'arn:aws:kinesis:xx-west-1:111122223333:stream/my-stream',
        },
        streamType: DataStreamType.KINESIS,
      }],
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
          RoleArn: 'arn:aws:iam::111122223333:role/ForTest',
          StreamArn: 'arn:aws:kinesis:xx-west-1:111122223333:stream/my-stream',
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
        endPoints: [{
          kinesisStreamConfig: {
            roleArn: 'arn:aws:iam::111122223333:role/ForTest',
            streamArn: 'arn:aws:kinesis:xx-west-1:111122223333:stream/my-stream',
          },
          streamType: DataStreamType.KINESIS,
        }],
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
        endPoints: [{
          kinesisStreamConfig: {
            roleArn: 'arn:aws:iam::111122223333:role/ForTest',
            streamArn: 'arn:aws:kinesis:xx-west-1:111122223333:stream/my-stream',
          },
          streamType: DataStreamType.KINESIS,
        }],
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
