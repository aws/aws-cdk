import { Template } from '@aws-cdk/assertions';
import { Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { Stack } from '@aws-cdk/core';
import { IdentityPool } from '../lib/identity-pool';

describe('Identity Pool', () => {

  test('minimal setup', () => {
    const stack = new Stack();
    const authRole = new Role(stack, 'authRole', {
      assumedBy: new ServicePrincipal('service.amazonaws.com'),
    });
    const unauthRole = new Role(stack, 'unauthRole', {
      assumedBy: new ServicePrincipal('service.amazonaws.com'),
    });
    new IdentityPool(stack, 'TestIdentityPool', {
      authenticatedRole: authRole,
      unauthenticatedRole: unauthRole,
    });
    const temp = Template.fromStack(stack);

    temp.hasResourceProperties('AWS::Cognito::IdentityPool', {
      AllowUnauthenticatedIdentities: false,
    });

    temp.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'service.amazonaws.com',
            },
          },
        ],
      },
    });

    temp.resourceCountIs('AWS::IAM::Role', 2);

    temp.hasResourceProperties('AWS::Cognito::IdentityPoolRoleAttachment', {
      IdentityPoolId: {
        Ref: 'TestIdentityPool328F7622',
      },
      Roles: {
        authenticated: {
          'Fn::GetAtt': [
            'authRoleB7A6401B',
            'Arn',
          ],
        },
        unauthenticated: {
          'Fn::GetAtt': [
            'unauthRole8318277E',
            'Arn',
          ],
        },
      },
    });
  });
});