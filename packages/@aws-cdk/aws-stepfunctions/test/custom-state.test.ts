import '@aws-cdk/assert/jest';
import * as cdk from '@aws-cdk/core';
import * as stepfunctions from '../lib';

describe('Custom State', () => {
  test('maintains the state Json provided during construction', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const stateJson = {
      Type: 'Task',
      Resource: 'arn:aws:states:::dynamodb:putItem',
      Parameters: {
        TableName: 'MyTable',
        Item: {
          id: {
            S: 'MyEntry',
          },
        },
      },
      ResultPath: null,
    };

    // WHEN
    const customState = new stepfunctions.CustomState(stack, 'Custom', {
      stateJson,
    });

    // THEN
    expect(customState.toStateJson()).toStrictEqual(stateJson);
  });
});
