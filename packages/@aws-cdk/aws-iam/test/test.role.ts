import { expect, haveResource, haveResourceLike } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/cdk';
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
    const stack = new Stack();

    const role = new Role(stack, 'MyRole', {
      assumedBy: new ServicePrincipal('sns.amazonaws.com')
    });

    test.ok(!('MyRoleDefaultPolicyA36BE1DD' in stack._toCloudFormation().Resources), 'initially created without a policy');

    role.addToPolicy(new PolicyStatement().addResource('myresource').addAction('myaction'));
    test.ok(stack._toCloudFormation().Resources.MyRoleDefaultPolicyA36BE1DD, 'policy resource created');

    expect(stack).toMatch({ Resources:
      { MyRoleF48FFE04:
         { Type: 'AWS::IAM::Role',
         Properties:
          { AssumeRolePolicyDocument:
           { Statement:
            [ { Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Principal: { Service: 'sns.amazonaws.com' } } ],
             Version: '2012-10-17' } } },
        MyRoleDefaultPolicyA36BE1DD:
         { Type: 'AWS::IAM::Policy',
         Properties:
          { PolicyDocument:
           { Statement:
            [ { Action: 'myaction', Effect: 'Allow', Resource: 'myresource' } ],
             Version: '2012-10-17' },
          PolicyName: 'MyRoleDefaultPolicyA36BE1DD',
          Roles: [ { Ref: 'MyRoleF48FFE04' } ] } } } });
    test.done();
  },

  'managed policy arns can be supplied upon initialization and also added later'(test: Test) {
    const stack = new Stack();

    const role = new Role(stack, 'MyRole', {
      assumedBy: new ServicePrincipal('test.service'),
      managedPolicyArns: [ 'managed1', 'managed2' ]
    });

    role.attachManagedPolicy('managed3');
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

      new Role(stack, 'MyRole', { maxSessionDurationSec: 3700, assumedBy: new ServicePrincipal('sns.amazonaws.com') });

      expect(stack).to(haveResource('AWS::IAM::Role', {
        MaxSessionDuration: 3700
      }));

      test.done();
    },

    'must be between 3600 and 43200'(test: Test) {
      const stack = new Stack();

      const assumedBy = new ServicePrincipal('bla');

      new Role(stack, 'MyRole1', { assumedBy, maxSessionDurationSec: 3600 });
      new Role(stack, 'MyRole2', { assumedBy, maxSessionDurationSec: 43200 });

      const expected = (val: any) => `maxSessionDuration is set to ${val}, but must be >= 3600sec (1hr) and <= 43200sec (12hrs)`;
      test.throws(() => new Role(stack, 'MyRole3', { assumedBy, maxSessionDurationSec: 60 }), expected(60));
      test.throws(() => new Role(stack, 'MyRole4', { assumedBy, maxSessionDurationSec: 3599 }), expected(3599));
      test.throws(() => new Role(stack, 'MyRole5', { assumedBy, maxSessionDurationSec: 43201 }), expected(43201));

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

  'import/export'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const myRole = new Role(stack, 'MyRole', {
      assumedBy: new ServicePrincipal('boom.boom.boom')
    });

    // WHEN
    const exportedRole = myRole.export();
    const importedRole = Role.import(stack, 'ImportedRole', exportedRole);

    // THEN
    test.deepEqual(stack.node.resolve(exportedRole), {
      roleArn: { 'Fn::ImportValue': 'Stack:MyRoleRoleArn3388B7E2' },
      roleId: { 'Fn::ImportValue': 'Stack:MyRoleRoleIdF7B258D8' }
    });

    test.deepEqual(stack.node.resolve(importedRole.roleArn), { 'Fn::ImportValue': 'Stack:MyRoleRoleArn3388B7E2' });
    test.deepEqual(stack.node.resolve(importedRole.roleId), { 'Fn::ImportValue': 'Stack:MyRoleRoleIdF7B258D8' });
    test.deepEqual(stack.node.resolve(importedRole.roleName), {
      'Fn::Select': [ 1, {
        'Fn::Split': [ '/', {
          'Fn::Select': [ 5, {
            'Fn::Split': [ ':', {
              'Fn::ImportValue': 'Stack:MyRoleRoleArn3388B7E2'
            } ]
          } ]
        } ]
      } ]
    });
    test.done();
  }
};
