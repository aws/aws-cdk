import { expect, haveResource, haveResourceLike } from '@aws-cdk/assert';
import { Duration, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { ArnPrincipal, CompositePrincipal, FederatedPrincipal, PolicyStatement, Role, ServicePrincipal, User } from '../lib';

export = {
  'default role'(test: Test) {
    const stack = new Stack();

    new Role(stack, 'MyRole', {
      assumedBy: new ServicePrincipal('sns.amazonaws.com')
    });

    expect(stack).toMatch({ Resources:
      { MyRoleF48FFE04:
         { Type: 'AWS::IAM::Role',
         Properties:
          { AssumeRolePolicyDocument:
           { Statement:
            [ { Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Principal: { Service: 'sns.amazonaws.com' } } ],
             Version: '2012-10-17' } } } } });
    test.done();
  },

  'a role can grant PassRole permissions'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const role = new Role(stack, 'Role', { assumedBy: new ServicePrincipal('henk.amazonaws.com') });
    const user = new User(stack, 'User');

    // WHEN
    role.grantPassRole(user);

    // THEN
    expect(stack).to(haveResourceLike('AWS::IAM::Policy', {
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
    }));

    test.done();
  },

  'can supply externalId'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new Role(stack, 'MyRole', {
      assumedBy: new ServicePrincipal('sns.amazonaws.com'),
      externalId: 'SomeSecret',
    });

    // THEN
    expect(stack).to(haveResource('AWS::IAM::Role', {
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
    }));

    test.done();
  },

  'policy is created automatically when permissions are added'(test: Test) {
    // by default we don't expect a role policy
    const before = new Stack();
    new Role(before, 'MyRole', { assumedBy: new ServicePrincipal('sns.amazonaws.com') });
    expect(before).notTo(haveResource('AWS::IAM::Policy'));

    // add a policy to the role
    const after = new Stack();
    const afterRole = new Role(after, 'MyRole', { assumedBy: new ServicePrincipal('sns.amazonaws.com') });
    afterRole.addToPolicy(new PolicyStatement({ resources: ['myresource'], actions: ['myaction'] }));
    expect(after).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: "myaction",
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
    }));
    test.done();
  },

  'managed policy arns can be supplied upon initialization and also added later'(test: Test) {
    const stack = new Stack();

    const role = new Role(stack, 'MyRole', {
      assumedBy: new ServicePrincipal('test.service'),
      managedPolicies: [ { managedPolicyArn: 'managed1' }, { managedPolicyArn: 'managed2' } ]
    });

    role.addManagedPolicy({ managedPolicyArn: 'managed3' });
    expect(stack).toMatch({ Resources:
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
    test.done();
  },

  'federated principal can change AssumeRoleAction'(test: Test) {
    const stack = new Stack();
    const cognitoPrincipal = new FederatedPrincipal(
      'foo',
      { StringEquals: { key: 'value' } },
      'sts:AssumeSomething');

    new Role(stack, 'MyRole', { assumedBy: cognitoPrincipal });

    expect(stack).to(haveResource('AWS::IAM::Role', {
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
    }));

    test.done();
  },

  'maxSessionDuration': {

    'is not specified by default'(test: Test) {
      const stack = new Stack();
      new Role(stack, 'MyRole', { assumedBy: new ServicePrincipal('sns.amazonaws.com') });
      expect(stack).toMatch({
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
      test.done();
    },

    'can be used to specify the maximum session duration for assuming the role'(test: Test) {
      const stack = new Stack();

      new Role(stack, 'MyRole', { maxSessionDuration: Duration.seconds(3700), assumedBy: new ServicePrincipal('sns.amazonaws.com') });

      expect(stack).to(haveResource('AWS::IAM::Role', {
        MaxSessionDuration: 3700
      }));

      test.done();
    },

    'must be between 3600 and 43200'(test: Test) {
      const stack = new Stack();

      const assumedBy = new ServicePrincipal('bla');

      new Role(stack, 'MyRole1', { assumedBy, maxSessionDuration: Duration.hours(1) });
      new Role(stack, 'MyRole2', { assumedBy, maxSessionDuration: Duration.hours(12) });

      const expected = (val: any) => `maxSessionDuration is set to ${val}, but must be >= 3600sec (1hr) and <= 43200sec (12hrs)`;
      test.throws(() => new Role(stack, 'MyRole3', { assumedBy, maxSessionDuration: Duration.minutes(1) }), expected(60));
      test.throws(() => new Role(stack, 'MyRole4', { assumedBy, maxSessionDuration: Duration.seconds(3599) }), expected(3599));
      test.throws(() => new Role(stack, 'MyRole5', { assumedBy, maxSessionDuration: Duration.seconds(43201) }), expected(43201));

      test.done();
    }
  },

  'allow role with multiple principals'(test: Test) {
    const stack = new Stack();

    new Role(stack, 'MyRole', {
      assumedBy: new CompositePrincipal(
        new ServicePrincipal('boom.amazonaws.test'),
        new ArnPrincipal('1111111')
      )
    });

    expect(stack).to(haveResource('AWS::IAM::Role', {
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
    }));

    test.done();
  },

  'fromRoleArn'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const importedRole = Role.fromRoleArn(stack, 'ImportedRole', 'arn:aws:iam::123456789012:role/S3Access');

    // THEN
    test.deepEqual(importedRole.roleArn, 'arn:aws:iam::123456789012:role/S3Access');
    test.deepEqual(importedRole.roleName, 'S3Access');
    test.done();
  },

  'add policy to imported role'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const importedRole = Role.fromRoleArn(stack, 'ImportedRole', 'arn:aws:iam::123456789012:role/MyRole');

    // WHEN
    importedRole.addToPolicy(new PolicyStatement({
      actions: ['s3:*'],
      resources: ['xyz']
    }));

    // THEN
    expect(stack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: "s3:*",
            Effect: "Allow",
            Resource: "xyz"
          }
        ],
        Version: "2012-10-17"
      },
      Roles: [ "MyRole" ]
    }));
    test.done();
  },

};