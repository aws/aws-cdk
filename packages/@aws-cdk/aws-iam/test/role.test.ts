import '@aws-cdk/assert/jest';
import { Duration, Stack } from '@aws-cdk/core';
import { ArnPrincipal, CompositePrincipal, FederatedPrincipal, ManagedPolicy, PolicyStatement, Role, ServicePrincipal, User } from '../lib';

describe('IAM role', () => {
  test('default role', () => {
    const stack = new Stack();

    new Role(stack, 'MyRole', {
      assumedBy: new ServicePrincipal('sns.amazonaws.com')
    });

    expect(stack).toMatchTemplate({ Resources:
      { MyRoleF48FFE04:
         { Type: 'AWS::IAM::Role',
         Properties:
          { AssumeRolePolicyDocument:
           { Statement:
            [ { Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Principal: { Service: 'sns.amazonaws.com' } } ],
             Version: '2012-10-17' } } } } });
  });

  test('a role can grant PassRole permissions', () => {
    // GIVEN
    const stack = new Stack();
    const role = new Role(stack, 'Role', { assumedBy: new ServicePrincipal('henk.amazonaws.com') });
    const user = new User(stack, 'User');

    // WHEN
    role.grantPassRole(user);

    // THEN
    expect(stack).toHaveResourceLike('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: "iam:PassRole",
            Effect: "Allow",
            Resource: { "Fn::GetAtt": [ "Role1ABCC5F0", "Arn" ] }
          }
        ],
        Version: "2012-10-17"
      },
    });
  });

  test('can supply externalId', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new Role(stack, 'MyRole', {
      assumedBy: new ServicePrincipal('sns.amazonaws.com'),
      externalId: 'SomeSecret',
    });

    // THEN
    expect(stack).toHaveResource('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: "sts:AssumeRole",
            Condition: {
              StringEquals: { "sts:ExternalId": "SomeSecret" }
            },
            Effect: "Allow",
            Principal: { Service: "sns.amazonaws.com" }
          }
        ],
        Version: "2012-10-17"
      }
    });
  });

  test('can supply single externalIds', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new Role(stack, 'MyRole', {
      assumedBy: new ServicePrincipal('sns.amazonaws.com'),
      externalIds: ['SomeSecret'],
    });

    // THEN
    expect(stack).toHaveResource('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: "sts:AssumeRole",
            Condition: {
              StringEquals: { "sts:ExternalId": "SomeSecret" }
            },
            Effect: "Allow",
            Principal: { Service: "sns.amazonaws.com" }
          }
        ],
        Version: "2012-10-17"
      }
    });
  });

  test('can supply multiple externalIds', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new Role(stack, 'MyRole', {
      assumedBy: new ServicePrincipal('sns.amazonaws.com'),
      externalIds: ['SomeSecret', 'AnotherSecret'],
    });

    // THEN
    expect(stack).toHaveResource('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: "sts:AssumeRole",
            Condition: {
              StringEquals: { "sts:ExternalId": ["SomeSecret", "AnotherSecret"] }
            },
            Effect: "Allow",
            Principal: { Service: "sns.amazonaws.com" }
          }
        ],
        Version: "2012-10-17"
      }
    });
  });

  test('policy is created automatically when permissions are added', () => {
    // by default we don't expect a role policy
    const before = new Stack();
    new Role(before, 'MyRole', { assumedBy: new ServicePrincipal('sns.amazonaws.com') });
    expect(before).not.toHaveResource('AWS::IAM::Policy');

    // add a policy to the role
    const after = new Stack();
    const afterRole = new Role(after, 'MyRole', { assumedBy: new ServicePrincipal('sns.amazonaws.com') });
    afterRole.addToPolicy(new PolicyStatement({ resources: ['myresource'], actions: ['service:myaction'] }));
    expect(after).toHaveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: "service:myaction",
            Effect: "Allow",
            Resource: "myresource"
          }
        ],
        Version: "2012-10-17"
      },
      PolicyName: "MyRoleDefaultPolicyA36BE1DD",
      Roles: [
        {
          Ref: "MyRoleF48FFE04"
        }
      ]
    });

  });

  test('managed policy arns can be supplied upon initialization and also added later', () => {
    const stack = new Stack();

    const role = new Role(stack, 'MyRole', {
      assumedBy: new ServicePrincipal('test.service'),
      managedPolicies: [ { managedPolicyArn: 'managed1' }, { managedPolicyArn: 'managed2' } ]
    });

    role.addManagedPolicy({ managedPolicyArn: 'managed3' });
    expect(stack).toMatchTemplate({ Resources:
      { MyRoleF48FFE04:
         { Type: 'AWS::IAM::Role',
         Properties:
          { AssumeRolePolicyDocument:
           { Statement:
            [ { Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Principal: { Service: 'test.service' } } ],
             Version: '2012-10-17' },
          ManagedPolicyArns: [ 'managed1', 'managed2', 'managed3' ] } } } });

  });

  test('federated principal can change AssumeRoleAction', () => {
    const stack = new Stack();
    const cognitoPrincipal = new FederatedPrincipal(
      'foo',
      { StringEquals: { key: 'value' } },
      ['sts:AssumeSomething']);

    new Role(stack, 'MyRole', { assumedBy: cognitoPrincipal });

    expect(stack).toHaveResource('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Principal: { Federated: "foo" },
            Condition: {
              StringEquals: { key: "value" }
            },
            Action: "sts:AssumeSomething",
            Effect: "Allow",
          }
        ],
      }
    });
  });

  describe('maxSessionDuration', () => {

    test('is not specified by default', () => {
      const stack = new Stack();
      new Role(stack, 'MyRole', { assumedBy: new ServicePrincipal('sns.amazonaws.com') });
      expect(stack).toMatchTemplate({
        Resources: {
          MyRoleF48FFE04: {
          Type: "AWS::IAM::Role",
          Properties: {
            AssumeRolePolicyDocument: {
            Statement: [
              {
              Action: "sts:AssumeRole",
              Effect: "Allow",
              Principal: {
                Service: "sns.amazonaws.com"
              }
              }
            ],
            Version: "2012-10-17"
            }
          }
          }
        }
      });
    });

    test('can be used to specify the maximum session duration for assuming the role', () => {
      const stack = new Stack();

      new Role(stack, 'MyRole', { maxSessionDuration: Duration.seconds(3700), assumedBy: new ServicePrincipal('sns.amazonaws.com') });

      expect(stack).toHaveResource('AWS::IAM::Role', {
        MaxSessionDuration: 3700
      });
    });

    test('must be between 3600 and 43200', () => {
      const stack = new Stack();

      const assumedBy = new ServicePrincipal('bla');

      new Role(stack, 'MyRole1', { assumedBy, maxSessionDuration: Duration.hours(1) });
      new Role(stack, 'MyRole2', { assumedBy, maxSessionDuration: Duration.hours(12) });

      const expected = (val: any) => `maxSessionDuration is set to ${val}, but must be >= 3600sec (1hr) and <= 43200sec (12hrs)`;
      expect(() => new Role(stack, 'MyRole3', { assumedBy, maxSessionDuration: Duration.minutes(1) }))
        .toThrow(expected(60));
      expect(() => new Role(stack, 'MyRole4', { assumedBy, maxSessionDuration: Duration.seconds(3599) }))
        .toThrow(expected(3599));
      expect(() => new Role(stack, 'MyRole5', { assumedBy, maxSessionDuration: Duration.seconds(43201) }))
        .toThrow(expected(43201));
    });
  });

  test('allow role with multiple principals', () => {
    const stack = new Stack();

    new Role(stack, 'MyRole', {
      assumedBy: new CompositePrincipal(
        new ServicePrincipal('boom.amazonaws.test'),
        new ArnPrincipal('1111111')
      )
    });

    expect(stack).toHaveResource('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: "sts:AssumeRole",
            Effect: "Allow",
            Principal: {
              Service: "boom.amazonaws.test",
              AWS: "1111111"
            }
          }
        ],
        Version: "2012-10-17"
      }
    });
  });

  test('can supply permissions boundary managed policy', () => {
    // GIVEN
    const stack = new Stack();

    const permissionsBoundary = ManagedPolicy.fromAwsManagedPolicyName('managed-policy');

    new Role(stack, 'MyRole', {
      assumedBy: new ServicePrincipal('sns.amazonaws.com'),
      permissionsBoundary,
    });

    expect(stack).toHaveResource('AWS::IAM::Role', {
      PermissionsBoundary: {
        "Fn::Join": [
          "",
          [
            "arn:",
            {
              Ref: "AWS::Partition"
            },
            ":iam::aws:policy/managed-policy"
          ]
        ]
      }
    });
  });
});
