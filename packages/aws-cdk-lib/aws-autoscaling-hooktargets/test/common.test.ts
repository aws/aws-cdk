import { Template } from '../../assertions';
import * as iam from '../../aws-iam';
import { Stack } from '../../core';
import { createRole } from '../lib/common';

describe('createRole', () => {
  test('creates a new role assumable by the AutoScaling service when none is provided', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const role = createRole(stack);

    // THEN
    expect(role).toBeDefined();
    Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 1);
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Effect: 'Allow',
            Principal: {
              Service: 'autoscaling.amazonaws.com',
            },
          },
        ],
      },
    });
  });

  test('returns the given role unchanged instead of creating a new one', () => {
    // GIVEN
    const stack = new Stack();
    const providedRole = new iam.Role(stack, 'ProvidedRole', {
      assumedBy: new iam.ServicePrincipal('custom.role.domain.com'),
    });

    // WHEN
    const role = createRole(stack, providedRole);

    // THEN
    expect(role).toBe(providedRole);
    Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 1);
  });
});
