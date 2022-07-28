import { Template } from '@aws-cdk/assertions';
import { Stack } from '@aws-cdk/core';
import { Stream } from '../lib';

/* eslint-disable quote-props */

describe('Kinesis data streams', () => {

  test('default stream', () => {
    const stack = new Stack();

    new Stream(stack, 'MyStream');

    Template.fromStack(stack).templateMatches({
      Resources: {
        MyStream5C050E93: {
          Type: 'AWS::Kinesis::Stream',
          Properties: {
            ShardCount: 1,
            RetentionPeriodHours: 24,
            StreamEncryption: {
              'Fn::If': [
                'AwsCdkKinesisEncryptedStreamsUnsupportedRegions',
                {
                  Ref: 'AWS::NoValue',
                },
                {
                  EncryptionType: 'KMS',
                  KeyId: 'alias/aws/kinesis',
                },
              ],
            },
          },
        },
      },
      Conditions: {
        AwsCdkKinesisEncryptedStreamsUnsupportedRegions: {
          'Fn::Or': [
            {
              'Fn::Equals': [
                {
                  Ref: 'AWS::Region',
                },
                'cn-north-1',
              ],
            },
            {
              'Fn::Equals': [
                {
                  Ref: 'AWS::Region',
                },
                'cn-northwest-1',
              ],
            },
          ],
        },
      },
    });
  }),
});
