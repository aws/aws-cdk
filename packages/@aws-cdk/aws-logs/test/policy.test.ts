import '@aws-cdk/assert-internal/jest';
import { PolicyStatement } from '@aws-cdk/aws-iam';
import { Stack } from '@aws-cdk/core';
import { LogGroup } from '../lib';

describe('resource policy', () => {
  test('simple instantiation', () => {
    // GIVEN
    const stack = new Stack();
    const logGroup = new LogGroup(stack, 'LogGroup');

    // WHEN
    logGroup.addToResourcePolicy(new PolicyStatement({
      actions: ['logs:CreateLogStream'],
      resources: ['*'],
    }));

    // THEN
    expect(stack).toHaveResource('AWS::Logs::ResourcePolicy', {
      PolicyName: 'LogGroupPolicy643B329C',
      PolicyDocument: JSON.stringify({
        Statement: [
          {
            Action: 'logs:CreateLogStream',
            Effect: 'Allow',
            Resource: '*',
          },
        ],
        Version: '2012-10-17',
      }),
    });
  });
});
