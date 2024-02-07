import { TestFunction } from './test-function';
import { Template } from '../../assertions';
import * as s3 from '../../aws-s3';
import * as cdk from '../../core';
import * as sources from '../lib';

/* eslint-disable quote-props */

describe('S3EventSource', () => {
  test('sufficiently complex example', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new TestFunction(stack, 'Fn');
    const bucket = new s3.Bucket(stack, 'B');

    // WHEN
    fn.addEventSource(new sources.S3EventSource(bucket, {
      events: [s3.EventType.OBJECT_CREATED, s3.EventType.OBJECT_REMOVED],
      filters: [
        { prefix: 'prefix/' },
        { suffix: '.png' },
      ],
    }));

    // THEN
    Template.fromStack(stack).hasResourceProperties('Custom::S3BucketNotifications', {
      'NotificationConfiguration': {
        'LambdaFunctionConfigurations': [
          {
            'Events': [
              's3:ObjectCreated:*',
            ],
            'Filter': {
              'Key': {
                'FilterRules': [
                  {
                    'Name': 'prefix',
                    'Value': 'prefix/',
                  },
                  {
                    'Name': 'suffix',
                    'Value': '.png',
                  },
                ],
              },
            },
            'LambdaFunctionArn': {
              'Fn::GetAtt': [
                'Fn9270CBC0',
                'Arn',
              ],
            },
          },
          {
            'Events': [
              's3:ObjectRemoved:*',
            ],
            'Filter': {
              'Key': {
                'FilterRules': [
                  {
                    'Name': 'prefix',
                    'Value': 'prefix/',
                  },
                  {
                    'Name': 'suffix',
                    'Value': '.png',
                  },
                ],
              },
            },
            'LambdaFunctionArn': {
              'Fn::GetAtt': [
                'Fn9270CBC0',
                'Arn',
              ],
            },
          },
        ],
      },
    });
  });

  test('Cross account buckect access', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'stack');
    const fn = new TestFunction(stack, 'Fn');

    let accountB = '1234567';
    //WHEN
    const foreignBucket =
      s3.Bucket.fromBucketAttributes(stack, 'ImportedBucket', {
        bucketArn: 'arn:aws:s3:::some-bucket-not-in-this-account',
        // The account the bucket really lives in
        account: accountB,
      });

    // This will generate the IAM bindings
    fn.addEventSource(new sources.S3EventSource(foreignBucket as s3.Bucket,
      { events: [s3.EventType.OBJECT_CREATED] }));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
      'Principal': 's3.amazonaws.com',
      'SourceAccount': '1234567',
      'SourceArn': 'arn:aws:s3:::some-bucket-not-in-this-account',
    });
  });
});

