import '@aws-cdk/assert/jest';
import * as lambda from '@aws-cdk/aws-lambda';
import { Stack } from '@aws-cdk/core';
import * as destinations from '../lib';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

const lambdaProps = {
  runtime: lambda.Runtime.NODEJS_10_X,
  handler: 'index.handler',
  code: lambda.Code.fromInline(`exports.handler = async (event) => {
    console.log(event);
    return event;
  };`),
};

test('create a lambda chain', () => {
  // GIVEN
  const first = new lambda.Function(stack, 'First', lambdaProps);
  const second = new lambda.Function(stack, 'Second', lambdaProps);
  const third = new lambda.Function(stack, 'Third', lambdaProps);

  // WHEN
  new destinations.LambdaChain(stack, 'Chain', {
    functions: [first, second, third]
  });

  // THEN
  expect(stack).toHaveResource('AWS::Events::Rule', { // From first to second
    EventPattern: {
      'detail-type': [
        'Lambda Function Invocation Result - Success'
      ],
      'resources': [
        {
          'Fn::Join': [
            '',
            [
              {
                'Fn::GetAtt': [
                  'First8D4707F1',
                  'Arn'
                ]
              },
              ':$LATEST'
            ]
          ]
        }
      ],
      'source': [
        'lambda'
      ],
    },
    Targets: [
      {
        Arn: {
          'Fn::GetAtt': [
            'Second394350F9',
            'Arn'
          ]
        },
        Id: 'Target0',
        InputPath: '$.detail.responsePayload'
      }
    ]
  });

  expect(stack).toHaveResource('AWS::Events::Rule', { // From second to third
    EventPattern: {
      'detail-type': [
        'Lambda Function Invocation Result - Success'
      ],
      'resources': [
        {
          'Fn::Join': [
            '',
            [
              {
                'Fn::GetAtt': [
                  'Second394350F9',
                  'Arn'
                ]
              },
              ':$LATEST'
            ]
          ]
        }
      ],
      'source': [
        'lambda'
      ],
    },
    Targets: [
      {
        Arn: {
          'Fn::GetAtt': [
            'Third1125870F',
            'Arn'
          ]
        },
        Id: 'Target0',
        InputPath: '$.detail.responsePayload'
      }
    ]
  });
});
