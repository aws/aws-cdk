/* eslint-disable quote-props */
import { Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { CognitoIdentityPoolAuthorizer } from '../lib';

describe('Cognito identity pool authorizer', () => {
  test('Add policy to unauthenticatedRole', () => {
    const stack = new cdk.Stack();

    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('cognito-identity.amazonaws.com'),
    });
    const authorizer = new CognitoIdentityPoolAuthorizer({
      identityPoolId: 'my-identity-pool-id',
      unauthenticatedRole: role,
    });
    authorizer.addPutPolicy(new iam.ManagedPolicy(stack, 'RUMPutBatchMetrics', {
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['rum:PutRumEvents'],
          resources: ['arn:aws:rum:some-region:123456789012::appmonitor/my-app-monitor'],
        }),
      ],
    }));
    const template = Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Role', {
      'ManagedPolicyArns': [
        {
          'Ref': 'RUMPutBatchMetrics253A3C90',
        },
      ],
    });
    template.hasResourceProperties('AWS::IAM::ManagedPolicy', {
      'PolicyDocument': {
        'Statement': [
          {
            'Action': 'rum:PutRumEvents',
            'Effect': 'Allow',
            'Resource': 'arn:aws:rum:some-region:123456789012::appmonitor/my-app-monitor',
          },
        ],
      },
    });
  });
});