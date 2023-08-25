import { Template } from '../../assertions';
import * as iam from '../../aws-iam';
import * as kinesis from '../../aws-kinesis';
import * as kms from '../../aws-kms';
import { App, Stack } from '../../core';
import { Endpoint } from '../lib';

describe('Endpoint', () => {
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
    const endpoint = Endpoint.fromKinesisStream(stream, role);

    expect(stack.resolve(endpoint._renderEndpoint(stack))).toStrictEqual({
      kinesisStreamConfig: {
        roleArn: {
          'Fn::GetAtt': ['myrole97476C1B', 'Arn'],
        },
        streamArn: {
          'Fn::GetAtt': ['stream19075594', 'Arn'],
        },
      },
      streamType: 'Kinesis',
    });
  });

  test('realtime config setup - default role', () => {
    const endpoint = Endpoint.fromKinesisStream(stream);

    expect(stack.resolve(endpoint._renderEndpoint(stack))).toStrictEqual({
      kinesisStreamConfig: {
        roleArn: {
          'Fn::GetAtt': ['RealtimeLogKinesisRoleBBD6D0F3', 'Arn'],
        },
        streamArn: {
          'Fn::GetAtt': ['stream19075594', 'Arn'],
        },
      },
      streamType: 'Kinesis',
    });
  });

  test('Endpoint with specified role - and encrypted kinesis stream', () => {
    const myStream = new kinesis.Stream(stack, 'MyStream', {
      encryption: kinesis.StreamEncryption.KMS,
      encryptionKey: new kms.Key(stack, 'key'),
    });

    Endpoint.fromKinesisStream(myStream, role)._renderEndpoint(stack);

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [{
          Action: [
            'kinesis:DescribeStreamSummary',
            'kinesis:DescribeStream',
            'kinesis:PutRecord',
            'kinesis:PutRecords',
          ],
          Resource: { 'Fn::GetAtt': ['MyStream5C050E93', 'Arn'] },
        }, {
          Action: 'kms:GenerateDataKey',
          Resource: { 'Fn::GetAtt': ['keyFEDD6EC0', 'Arn'] },
        }],
        Version: '2012-10-17',
      },
    });
  });

});
