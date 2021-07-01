import '@aws-cdk/assert-internal/jest';
import { expect, haveResource } from '@aws-cdk/assert-internal';
import * as cdk from '@aws-cdk/core';
import { CfnWorkGroup } from '../lib';

describe('Athena Workgroup Tags', () => {
  test('test tag spec correction', () => {
    const stack = new cdk.Stack();
    new CfnWorkGroup(stack, 'Athena-Workgroup', {
      name: 'HelloWorld',
      description: 'A WorkGroup',
      recursiveDeleteOption: true,
      state: 'ENABLED',
      tags: [
        {
          key: 'key1',
          value: 'value1',
        },
        {
          key: 'key2',
          value: 'value2',
        },
      ],
      workGroupConfiguration: {
        requesterPaysEnabled: true,
        resultConfiguration: {
          outputLocation: 's3://fakebucketme/athena/results/',
        },
      },
    });
    expect(stack).to(haveResource('AWS::Athena::WorkGroup', {
      Tags: [
        {
          Key: 'key1',
          Value: 'value1',
        },
        {
          Key: 'key2',
          Value: 'value2',
        },
      ],
    }));
  });
  test('test tag aspect spec correction', () => {
    const stack = new cdk.Stack();
    cdk.Tags.of(stack).add('key1', 'value1');
    cdk.Tags.of(stack).add('key2', 'value2');
    new CfnWorkGroup(stack, 'Athena-Workgroup', {
      name: 'HelloWorld',
      description: 'A WorkGroup',
      recursiveDeleteOption: true,
      state: 'ENABLED',
      workGroupConfiguration: {
        requesterPaysEnabled: true,
        resultConfiguration: {
          outputLocation: 's3://fakebucketme/athena/results/',
        },
      },
    });
    expect(stack).to(haveResource('AWS::Athena::WorkGroup', {
      Tags: [
        {
          Key: 'key1',
          Value: 'value1',
        },
        {
          Key: 'key2',
          Value: 'value2',
        },
      ],
    }));
  });
});
