import { Template } from '../../assertions';
import * as iam from '../../aws-iam';
import { Stack } from '../../core';
import { AuthorizationToken, PublicGalleryAuthorizationToken } from '../lib';

describe('auth-token', () => {
  test('AuthorizationToken.grantRead()', () => {
    // GIVEN
    const stack = new Stack();
    const user = new iam.User(stack, 'User');

    // WHEN
    AuthorizationToken.grantRead(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'ecr:GetAuthorizationToken',
            Effect: 'Allow',
            Resource: '*',
          },
        ],
      },
    });
  });

  test('PublicGalleryAuthorizationToken.grantRead()', () => {
    // GIVEN
    const stack = new Stack();
    const user = new iam.User(stack, 'User');

    // WHEN
    PublicGalleryAuthorizationToken.grantRead(user);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'ecr-public:GetAuthorizationToken',
              'sts:GetServiceBearerToken',
            ],
            Effect: 'Allow',
            Resource: '*',
          },
        ],
      },
    });
  });
});
