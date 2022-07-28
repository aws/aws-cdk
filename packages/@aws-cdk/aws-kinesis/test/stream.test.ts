import { Template } from '@aws-cdk/assertions';
import { Stack } from '@aws-cdk/core';
import { Stream } from '../lib';

/* eslint-disable quote-props */

describe('Kinesis data streams', () => {

  test('default stream', () => {
    const stack = new Stack();

    new Stream(stack, 'MyStream', {
      streamName: 'test',
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        MyStream5C050E93: {
          Type: 'AWS::Kinesis::Stream',
          Properties: {
            Name: 'test',
          },
        },
      },
    });
  });
});