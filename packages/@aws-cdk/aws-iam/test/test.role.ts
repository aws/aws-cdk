import { expect, haveResource } from '@aws-cdk/assert';
import { FederatedPrincipal, PolicyStatement, Resource, ServicePrincipal, Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import { Role } from '../lib';

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

  'policy is created automatically when permissions are added'(test: Test) {
    const stack = new Stack();

    const role = new Role(stack, 'MyRole', {
      assumedBy: new ServicePrincipal('sns.amazonaws.com')
    });

    test.ok(!('MyRoleDefaultPolicyA36BE1DD' in stack.toCloudFormation().Resources), 'initially created without a policy');

    role.addToPolicy(new PolicyStatement().addResource('myresource').addAction('myaction'));
    test.ok(stack.toCloudFormation().Resources.MyRoleDefaultPolicyA36BE1DD, 'policy resource created');

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
      assumedBy: new ServicePrincipal('service'),
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
              Principal: { Service: 'service' } } ],
             Version: '2012-10-17' },
          ManagedPolicyArns: [ 'managed1', 'managed2', 'managed3' ] } } } });
    test.done();
  },

  'role implements IDependable to allow resources to depend on it'(test: Test) {
    const stack = new Stack();
    const role = new Role(stack, 'MyRole', { assumedBy: new ServicePrincipal('foo') });

    test.equal(role.dependencyElements.length, 1);

    const roleResource = role.dependencyElements[0] as Resource;
    test.equal(roleResource.resourceType, 'AWS::IAM::Role');
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
  }

};
