import { expect, haveResourceLike } from '@aws-cdk/assert';
import * as iam from '@aws-cdk/aws-iam';
import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { AuthorizationToken, PublicGalleryAuthorizationToken } from '../lib';

export = {
  'AuthorizationToken.grantRead()'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const user = new iam.User(stack, 'User');

    // WHEN
    AuthorizationToken.grantRead(user);

    // THEN
    expect(stack).to(haveResourceLike('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'ecr:GetAuthorizationToken',
            Effect: 'Allow',
            Resource: '*',
          },
        ],
      },
    }));

    test.done();
  },

  'PublicGalleryAuthorizationToken.grantRead()'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const user = new iam.User(stack, 'User');

    // WHEN
    PublicGalleryAuthorizationToken.grantRead(user);

    // THEN
    expect(stack).to(haveResourceLike('AWS::IAM::Policy', {
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
    }));

    test.done();
  },

};