/* eslint-disable quote-props */
import { Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { ThirdPartyAuthorizer } from '../lib';

describe('Third party authorizer', () => {
  test('Add policy to unauthenticatedRole', () => {
    const stack = new cdk.Stack();

    const role = new iam.Role(stack, 'Role', {
      assumedBy: new iam.ServicePrincipal('cognito-identity.amazonaws.com'),
    });
    const authorizer = new ThirdPartyAuthorizer({
      role: role,
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