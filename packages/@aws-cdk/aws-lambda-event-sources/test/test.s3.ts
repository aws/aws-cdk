import { expect, haveResource } from '@aws-cdk/assert-internal';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as sources from '../lib';
import { TestFunction } from './test-function';

/* eslint-disable quote-props */

export = {
  'sufficiently complex example'(test: Test) {
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
    expect(stack).to(haveResource('Custom::S3BucketNotifications', {
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
    }));
    test.done();
  },
};
