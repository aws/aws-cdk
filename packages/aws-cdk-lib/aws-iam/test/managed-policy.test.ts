import { Template } from '../../assertions';
import * as cdk from '../../core';
import { AddToPrincipalPolicyResult, Grant, Group, IResourceWithPolicy, ManagedPolicy, PolicyDocument, PolicyStatement, Role, ServicePrincipal, User, Effect } from '../lib';

describe('managed policy', () => {
  let app: cdk.App;
  let stack: cdk.Stack;

  beforeEach(() => {
    app = new cdk.App();
    stack = new cdk.Stack(app, 'MyStack', { env: { account: '1234', region: 'us-east-1' } });
  });

  test('simple AWS managed policy', () => {
    const mp = ManagedPolicy.fromAwsManagedPolicyName('service-role/SomePolicy');

    expect(stack.resolve(mp.managedPolicyArn)).toEqual({
      'Fn::Join': ['', [
        'arn:',
        { Ref: 'AWS::Partition' },
        ':iam::aws:policy/service-role/SomePolicy',
      ]],
    });
  });

  test('simple customer managed policy', () => {
    const mp = ManagedPolicy.fromManagedPolicyName(stack, 'MyCustomerManagedPolicy', 'SomeCustomerPolicy');

    expect(stack.resolve(mp.managedPolicyArn)).toEqual({
      'Fn::Join': ['', [
        'arn:',
        { Ref: 'AWS::Partition' },
        ':iam::1234:policy/SomeCustomerPolicy',
      ]],
    });
  });

  test('managed policy by arn', () => {
    const mp = ManagedPolicy.fromManagedPolicyArn(stack, 'MyManagedPolicyByArn', 'arn:aws:iam::1234:policy/my-policy');

    expect(stack.resolve(mp.managedPolicyArn)).toEqual('arn:aws:iam::1234:policy/my-policy');
  });

  test('managed policy with statements', () => {
    const policy = new ManagedPolicy(stack, 'MyManagedPolicy', { managedPolicyName: 'MyManagedPolicyName' });
    policy.addStatements(new PolicyStatement({ resources: ['*'], actions: ['sqs:SendMessage'] }));
    policy.addStatements(new PolicyStatement({ resources: ['arn'], actions: ['sns:Subscribe'] }));

    const group = new Group(stack, 'MyGroup');
    group.addManagedPolicy(policy);

    Template.fromStack(stack).templateMatches({
      Resources: {
        MyManagedPolicy9F3720AE: {
          Type: 'AWS::IAM::ManagedPolicy',
          Properties: {
            ManagedPolicyName: 'MyManagedPolicyName',
            PolicyDocument: {
              Statement:
                [{ Action: 'sqs:SendMessage', Effect: 'Allow', Resource: '*' },
                  { Action: 'sns:Subscribe', Effect: 'Allow', Resource: 'arn' }],
              Version: '2012-10-17',
            },
            Path: '/',
            Description: '',
          },
        },
        MyGroupCBA54B1B: {
          Type: 'AWS::IAM::Group',
          Properties: {
            ManagedPolicyArns: [
              { Ref: 'MyManagedPolicy9F3720AE' },
            ],
          },
        },
      },
    });
  });

  test('managed policy from policy document alone', () => {
    new ManagedPolicy(stack, 'MyManagedPolicy', {
      managedPolicyName: 'MyManagedPolicyName',
      document: PolicyDocument.fromJson({
        Statement: [{
          Action: 'sqs:SendMessage',
          Effect: 'Allow',
          Resource: '*',
        }],
      }),
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        MyManagedPolicy9F3720AE: {
          Type: 'AWS::IAM::ManagedPolicy',
          Properties: {
            ManagedPolicyName: 'MyManagedPolicyName',
            PolicyDocument: {
              Statement: [{ Action: 'sqs:SendMessage', Effect: 'Allow', Resource: '*' }],
              Version: '2012-10-17',
            },
            Path: '/',
            Description: '',
          },
        },
      },
    });
  });

  test('managed policy from policy document with additional statements', () => {
    new ManagedPolicy(stack, 'MyManagedPolicy', {
      managedPolicyName: 'MyManagedPolicyName',
      document: PolicyDocument.fromJson({
        Statement: [{
          Action: 'sqs:SendMessage',
          Effect: 'Allow',
          Resource: '*',
        }],
      }),
      statements: [new PolicyStatement({ resources: ['arn'], actions: ['sns:Subscribe'] })],
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        MyManagedPolicy9F3720AE: {
          Type: 'AWS::IAM::ManagedPolicy',
          Properties: {
            ManagedPolicyName: 'MyManagedPolicyName',
            PolicyDocument: {
              Statement:
                [{ Action: 'sqs:SendMessage', Effect: 'Allow', Resource: '*' },
                  { Action: 'sns:Subscribe', Effect: 'Allow', Resource: 'arn' }],
              Version: '2012-10-17',
            },
            Path: '/',
            Description: '',
          },
        },
      },
    });
  });

  test('policy name can be omitted, in which case the logical id will be used', () => {
    const policy = new ManagedPolicy(stack, 'MyManagedPolicy');
    policy.addStatements(new PolicyStatement({ resources: ['*'], actions: ['sqs:SendMessage'] }));
    policy.addStatements(new PolicyStatement({ resources: ['arn'], actions: ['sns:Subscribe'] }));

    const group = new Group(stack, 'MyGroup');
    group.addManagedPolicy(policy);

    Template.fromStack(stack).templateMatches({
      Resources: {
        MyManagedPolicy9F3720AE: {
          Type: 'AWS::IAM::ManagedPolicy',
          Properties: {
            PolicyDocument: {
              Statement:
                [{ Action: 'sqs:SendMessage', Effect: 'Allow', Resource: '*' },
                  { Action: 'sns:Subscribe', Effect: 'Allow', Resource: 'arn' }],
              Version: '2012-10-17',
            },
            Path: '/',
            Description: '',
          },
        },
        MyGroupCBA54B1B: {
          Type: 'AWS::IAM::Group',
          Properties: {
            ManagedPolicyArns: [
              { Ref: 'MyManagedPolicy9F3720AE' },
            ],
          },
        },
      },
    });
  });

  test('via props, managed policy can be attached to users, groups and roles and permissions, description and path can be added', () => {
    const user1 = new User(stack, 'User1');
    const group1 = new Group(stack, 'Group1');
    const role1 = new Role(stack, 'Role1', {
      assumedBy: new ServicePrincipal('test.service'),
    });

    new ManagedPolicy(stack, 'MyTestManagedPolicy', {
      managedPolicyName: 'Foo',
      users: [user1],
      groups: [group1],
      roles: [role1],
      description: 'My Policy Description',
      path: 'tahiti/is/a/magical/place',
      statements: [new PolicyStatement({ resources: ['*'], actions: ['dynamodb:PutItem'] })],
    });

    Template.fromStack(stack).templateMatches({
      Resources: {
        User1E278A736: { Type: 'AWS::IAM::User' },
        Group1BEBD4686: { Type: 'AWS::IAM::Group' },
        Role13A5C70C1: {
          Type: 'AWS::IAM::Role',
          Properties: {
            AssumeRolePolicyDocument: {
              Statement:
                [{
                  Action: 'sts:AssumeRole',
                  Effect: 'Allow',
                  Principal: { Service: 'test.service' },
                }],
              Version: '2012-10-17',
            },
          },
        },
        MyTestManagedPolicy6535D9F5: {
          Type: 'AWS::IAM::ManagedPolicy',
          Properties: {
            Groups: [{ Ref: 'Group1BEBD4686' }],
            Description: 'My Policy Description',
            Path: 'tahiti/is/a/magical/place',
            PolicyDocument: {
              Statement:
                [{ Action: 'dynamodb:PutItem', Effect: 'Allow', Resource: '*' }],
              Version: '2012-10-17',
            },
            ManagedPolicyName: 'Foo',
            Roles: [{ Ref: 'Role13A5C70C1' }],
            Users: [{ Ref: 'User1E278A736' }],
          },
        },
      },
    });
  });

  test('idempotent if a principal (user/group/role) is attached twice', () => {
    const p = new ManagedPolicy(stack, 'MyManagedPolicy');
    p.addStatements(new PolicyStatement({ actions: ['*'], resources: ['*'] }));

    const user = new User(stack, 'MyUser');
    p.attachToUser(user);
    p.attachToUser(user);

    const group = new Group(stack, 'MyGroup');
    p.attachToGroup(group);
    p.attachToGroup(group);

    const role = new Role(stack, 'MyRole', {
      assumedBy: new ServicePrincipal('test.service'),
    });
    p.attachToRole(role);
    p.attachToRole(role);

    Template.fromStack(stack).templateMatches({
      Resources: {
        MyManagedPolicy9F3720AE: {
          Type: 'AWS::IAM::ManagedPolicy',
          Properties: {
            PolicyDocument: {
              Statement: [{ Action: '*', Effect: 'Allow', Resource: '*' }],
              Version: '2012-10-17',
            },
            Description: '',
            Path: '/',
            Users: [{ Ref: 'MyUserDC45028B' }],
            Groups: [{ Ref: 'MyGroupCBA54B1B' }],
            Roles: [{ Ref: 'MyRoleF48FFE04' }],
          },
        },
        MyUserDC45028B: { Type: 'AWS::IAM::User' },
        MyGroupCBA54B1B: { Type: 'AWS::IAM::Group' },
        MyRoleF48FFE04: {
          Type: 'AWS::IAM::Role',
          Properties: {
            AssumeRolePolicyDocument: {
              Statement:
                [{
                  Action: 'sts:AssumeRole',
                  Effect: 'Allow',
                  Principal: { Service: 'test.service' },
                }],
              Version: '2012-10-17',
            },
          },
        },
      },
    });
  });

  test('idempotent if an imported principal (user/group/role) is attached twice', () => {
    const p = new ManagedPolicy(stack, 'MyManagedPolicy');
    p.addStatements(new PolicyStatement({ actions: ['*'], resources: ['*'] }));

    const user = new User(stack, 'MyUser');
    const importedUser = User.fromUserArn(stack, 'MyImportedUser', user.userArn);
    p.attachToUser(user);
    p.attachToUser(importedUser);

    const group = new Group(stack, 'MyGroup');
    const importedGroup = Group.fromGroupArn(stack, 'MyImportedGroup', group.groupArn);
    p.attachToGroup(group);
    p.attachToGroup(importedGroup);

    const role = new Role(stack, 'MyRole', {
      assumedBy: new ServicePrincipal('test.service'),
    });
    const importedRole = Role.fromRoleArn(stack, 'MyImportedRole', role.roleArn);
    p.attachToRole(role);
    p.attachToRole(importedRole);

    Template.fromStack(stack).templateMatches({
      Resources: {
        MyManagedPolicy9F3720AE: {
          Type: 'AWS::IAM::ManagedPolicy',
          Properties: {
            PolicyDocument: {
              Statement: [{ Action: '*', Effect: 'Allow', Resource: '*' }],
              Version: '2012-10-17',
            },
            Description: '',
            Path: '/',
            Users: [{ Ref: 'MyUserDC45028B' }],
            Groups: [{ Ref: 'MyGroupCBA54B1B' }],
            Roles: [{ Ref: 'MyRoleF48FFE04' }],
          },
        },
        MyUserDC45028B: { Type: 'AWS::IAM::User' },
        MyGroupCBA54B1B: { Type: 'AWS::IAM::Group' },
        MyRoleF48FFE04: {
          Type: 'AWS::IAM::Role',
          Properties: {
            AssumeRolePolicyDocument: {
              Statement:
                [{
                  Action: 'sts:AssumeRole',
                  Effect: 'Allow',
                  Principal: { Service: 'test.service' },
                }],
              Version: '2012-10-17',
            },
          },
        },
      },
    });
  });

  test('users, groups, roles and permissions can be added using methods', () => {
    const p = new ManagedPolicy(stack, 'MyManagedPolicy', {
      managedPolicyName: 'Foo',
    });

    p.attachToUser(new User(stack, 'User1'));
    p.attachToUser(new User(stack, 'User2'));
    p.attachToGroup(new Group(stack, 'Group1'));
    p.attachToRole(new Role(stack, 'Role1', { assumedBy: new ServicePrincipal('test.service') }));
    p.addStatements(new PolicyStatement({ resources: ['*'], actions: ['dynamodb:GetItem'] }));

    Template.fromStack(stack).templateMatches({
      Resources: {
        MyManagedPolicy9F3720AE: {
          Type: 'AWS::IAM::ManagedPolicy',
          Properties: {
            Groups: [{ Ref: 'Group1BEBD4686' }],
            PolicyDocument: {
              Statement:
                [{ Action: 'dynamodb:GetItem', Effect: 'Allow', Resource: '*' }],
              Version: '2012-10-17',
            },
            ManagedPolicyName: 'Foo',
            Description: '',
            Path: '/',
            Roles: [{ Ref: 'Role13A5C70C1' }],
            Users: [{ Ref: 'User1E278A736' }, { Ref: 'User21F1486D1' }],
          },
        },
        User1E278A736: { Type: 'AWS::IAM::User' },
        User21F1486D1: { Type: 'AWS::IAM::User' },
        Group1BEBD4686: { Type: 'AWS::IAM::Group' },
        Role13A5C70C1: {
          Type: 'AWS::IAM::Role',
          Properties: {
            AssumeRolePolicyDocument: {
              Statement:
                [{
                  Action: 'sts:AssumeRole',
                  Effect: 'Allow',
                  Principal: { Service: 'test.service' },
                }],
              Version: '2012-10-17',
            },
          },
        },
      },
    });
  });

  test('policy can be attached to users, groups or role via methods on the principal', () => {
    const policy = new ManagedPolicy(stack, 'MyManagedPolicy');
    const user = new User(stack, 'MyUser');
    const group = new Group(stack, 'MyGroup');
    const role = new Role(stack, 'MyRole', { assumedBy: new ServicePrincipal('test.service') });

    user.addManagedPolicy(policy);
    group.addManagedPolicy(policy);
    role.addManagedPolicy(policy);

    policy.addStatements(new PolicyStatement({ resources: ['*'], actions: ['*'] }));

    Template.fromStack(stack).templateMatches({
      Resources: {
        MyManagedPolicy9F3720AE: {
          Type: 'AWS::IAM::ManagedPolicy',
          Properties: {
            PolicyDocument: {
              Statement: [{ Action: '*', Effect: 'Allow', Resource: '*' }],
              Version: '2012-10-17',
            },
            Description: '',
            Path: '/',
          },
        },
        MyUserDC45028B: { Type: 'AWS::IAM::User', Properties: { ManagedPolicyArns: [{ Ref: 'MyManagedPolicy9F3720AE' }] } },
        MyGroupCBA54B1B: { Type: 'AWS::IAM::Group', Properties: { ManagedPolicyArns: [{ Ref: 'MyManagedPolicy9F3720AE' }] } },
        MyRoleF48FFE04: {
          Type: 'AWS::IAM::Role',
          Properties: {
            ManagedPolicyArns: [{ Ref: 'MyManagedPolicy9F3720AE' }],
            AssumeRolePolicyDocument: {
              Statement:
                [{
                  Action: 'sts:AssumeRole',
                  Effect: 'Allow',
                  Principal: { Service: 'test.service' },
                }],
              Version: '2012-10-17',
            },
          },
        },
      },
    });
  });

  test('policy from AWS managed policy lookup can be attached to users, groups or role via methods on the principal', () => {
    const policy = ManagedPolicy.fromAwsManagedPolicyName('AnAWSManagedPolicy');
    const user = new User(stack, 'MyUser');
    const group = new Group(stack, 'MyGroup');
    const role = new Role(stack, 'MyRole', { assumedBy: new ServicePrincipal('test.service') });

    user.addManagedPolicy(policy);
    group.addManagedPolicy(policy);
    role.addManagedPolicy(policy);

    Template.fromStack(stack).templateMatches({
      Resources: {
        MyUserDC45028B: {
          Type: 'AWS::IAM::User',
          Properties: {
            ManagedPolicyArns: [
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':iam::aws:policy/AnAWSManagedPolicy',
                  ],
                ],
              },
            ],
          },
        },
        MyGroupCBA54B1B: {
          Type: 'AWS::IAM::Group',
          Properties: {
            ManagedPolicyArns: [
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':iam::aws:policy/AnAWSManagedPolicy',
                  ],
                ],
              },
            ],
          },
        },
        MyRoleF48FFE04: {
          Type: 'AWS::IAM::Role',
          Properties: {
            ManagedPolicyArns: [
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':iam::aws:policy/AnAWSManagedPolicy',
                  ],
                ],
              },
            ],
            AssumeRolePolicyDocument: {
              Statement:
                [{
                  Action: 'sts:AssumeRole',
                  Effect: 'Allow',
                  Principal: { Service: 'test.service' },
                }],
              Version: '2012-10-17',
            },
          },
        },
      },
    });
  });

  test('policy from customer managed policy lookup can be attached to users, groups or role via methods', () => {
    const policy = ManagedPolicy.fromManagedPolicyName(stack, 'MyManagedPolicy', 'ACustomerManagedPolicyName');
    const user = new User(stack, 'MyUser');
    const group = new Group(stack, 'MyGroup');
    const role = new Role(stack, 'MyRole', { assumedBy: new ServicePrincipal('test.service') });

    user.addManagedPolicy(policy);
    group.addManagedPolicy(policy);
    role.addManagedPolicy(policy);

    Template.fromStack(stack).templateMatches({
      Resources: {
        MyUserDC45028B: {
          Type: 'AWS::IAM::User',
          Properties: {
            ManagedPolicyArns: [
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':iam::1234:policy/ACustomerManagedPolicyName',
                  ],
                ],
              },
            ],
          },
        },
        MyGroupCBA54B1B: {
          Type: 'AWS::IAM::Group',
          Properties: {
            ManagedPolicyArns: [
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':iam::1234:policy/ACustomerManagedPolicyName',
                  ],
                ],
              },
            ],
          },
        },
        MyRoleF48FFE04: {
          Type: 'AWS::IAM::Role',
          Properties: {
            ManagedPolicyArns: [
              {
                'Fn::Join': [
                  '',
                  [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':iam::1234:policy/ACustomerManagedPolicyName',
                  ],
                ],
              },
            ],
            AssumeRolePolicyDocument: {
              Statement:
                [{
                  Action: 'sts:AssumeRole',
                  Effect: 'Allow',
                  Principal: { Service: 'test.service' },
                }],
              Version: '2012-10-17',
            },
          },
        },
      },
    });
  });

  test('fails if policy document is empty', () => {
    new ManagedPolicy(stack, 'MyPolicy');
    expect(() => app.synth())
      .toThrow(/Managed Policy is empty. You must add statements to the policy/);
  });

  test('managed policy name is correctly calculated', () => {
    const mp = new ManagedPolicy(stack, 'Policy');
    mp.addStatements(new PolicyStatement({
      actions: ['a:abc'],
    }));

    expect(stack.resolve(mp.managedPolicyName)).toEqual({
      'Fn::Select': [1,
        {
          'Fn::Split': ['/',
            {
              'Fn::Select': [5,
                {
                  'Fn::Split': [':',
                    { Ref: 'Policy23B91518' }],
                }],
            }],
        }],
    });
  });

  test('fails if policy document does not specify resources', () => {
    new ManagedPolicy(stack, 'MyManagedPolicy', {
      statements: [
        new PolicyStatement({ actions: ['*'] }),
      ],
    });

    expect(() => app.synth()).toThrow(/A PolicyStatement used in an identity-based policy must specify at least one resource/);
  });

  test('fails if policy document specifies principals', () => {
    new ManagedPolicy(stack, 'MyManagedPolicy', {
      statements: [
        new PolicyStatement({ actions: ['*'], resources: ['*'], principals: [new ServicePrincipal('test.service')] }),
      ],
    });

    expect(() => app.synth()).toThrow(/A PolicyStatement used in an identity-based policy cannot specify any IAM principals/);
  });

  test('cross-stack hard-name contains the right resource type', () => {
    const mp = new ManagedPolicy(stack, 'Policy', {
      managedPolicyName: cdk.PhysicalName.GENERATE_IF_NEEDED,
    });
    mp.addStatements(new PolicyStatement({
      actions: ['a:abc'],
      resources: ['*'],
    }));

    const stack2 = new cdk.Stack(app, 'Stack2', { env: { account: '5678', region: 'us-east-1' } });
    new cdk.CfnOutput(stack2, 'Output', {
      value: mp.managedPolicyArn,
    });

    Template.fromStack(stack2).templateMatches({
      Outputs: {
        Output: {
          Value: {
            'Fn::Join': [
              '',
              [
                'arn:',
                {
                  Ref: 'AWS::Partition',
                },
                ':iam::1234:policy/mystackmystackpolicy17395e221b1b6deaf875',
              ],
            ],
          },
        },
      },
    });
  });

  test('Policies can be granted principal permissions', () => {
    const mp = new ManagedPolicy(stack, 'Policy', {
      managedPolicyName: 'MyManagedPolicyName',
    });
    Grant.addToPrincipal({ actions: ['dummy:Action'], grantee: mp, resourceArns: ['*'] });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::ManagedPolicy', {
      ManagedPolicyName: 'MyManagedPolicyName',
      PolicyDocument: {
        Statement: [
          { Action: 'dummy:Action', Effect: 'Allow', Resource: '*' },
        ],
        Version: '2012-10-17',
      },
      Path: '/',
      Description: '',
    });
  });

  test('addPrincipalOrResource() correctly grants Policies permissions', () => {
    const mp = new ManagedPolicy(stack, 'Policy', {
      managedPolicyName: 'MyManagedPolicyName',
    });

    class DummyResource extends cdk.Resource implements IResourceWithPolicy {
      addToResourcePolicy(_statement: PolicyStatement): AddToPrincipalPolicyResult {
        throw new Error('should not be called.');
      }
    }
    const resource = new DummyResource(stack, 'Dummy');
    Grant.addToPrincipalOrResource({ actions: ['dummy:Action'], grantee: mp, resourceArns: ['*'], resource });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::ManagedPolicy', {
      ManagedPolicyName: 'MyManagedPolicyName',
      PolicyDocument: {
        Statement: [
          { Action: 'dummy:Action', Effect: 'Allow', Resource: '*' },
        ],
        Version: '2012-10-17',
      },
      Path: '/',
      Description: '',
    });
  });

  test('Policies cannot be granted principal permissions across accounts', () => {
    const mp = new ManagedPolicy(stack, 'Policy', {
      managedPolicyName: 'MyManagedPolicyName',
    });

    class DummyResource extends cdk.Resource implements IResourceWithPolicy {
      addToResourcePolicy(_statement: PolicyStatement): AddToPrincipalPolicyResult {
        throw new Error('should not be called.');
      }
    }
    const resource = new DummyResource(stack, 'Dummy', { account: '5678' });

    expect(() => {
      Grant.addToPrincipalOrResource({ actions: ['dummy:Action'], grantee: mp, resourceArns: ['*'], resource });
    }).toThrow(/Cannot use a ManagedPolicy 'MyStack\/Policy'/);
  });

  test('Policies cannot be granted resource permissions', () => {
    const mp = new ManagedPolicy(stack, 'Policy', {
      managedPolicyName: 'MyManagedPolicyName',
    });

    class DummyResource extends cdk.Resource implements IResourceWithPolicy {
      addToResourcePolicy(_statement: PolicyStatement): AddToPrincipalPolicyResult {
        throw new Error('should not be called.');
      }
    }
    const resource = new DummyResource(stack, 'Dummy');

    expect(() => {
      Grant.addToPrincipalAndResource({ actions: ['dummy:Action'], grantee: mp, resourceArns: ['*'], resource });
    }).toThrow(/Cannot use a ManagedPolicy 'MyStack\/Policy'/);
  });

  test('prevent creation when customizeRoles is configured', () => {
    // GIVEN
    const otherStack = new cdk.Stack();
    Role.customizeRoles(otherStack);

    // WHEN
    new ManagedPolicy(otherStack, 'CustomPolicy', {
      statements: [new PolicyStatement({
        effect: Effect.ALLOW,
        resources: ['*'],
        actions: ['*'],
      })],
    });

    // THEN
    Template.fromStack(otherStack).resourceCountIs('AWS::IAM::ManagedPolicy', 0);
  });

  test('do not prevent creation when customizeRoles.preventSynthesis=false', () => {
    // GIVEN
    const otherStack = new cdk.Stack();
    Role.customizeRoles(otherStack, {
      preventSynthesis: false,
    });

    // WHEN
    new ManagedPolicy(otherStack, 'CustomPolicy', {
      statements: [new PolicyStatement({
        effect: Effect.ALLOW,
        resources: ['*'],
        actions: ['*'],
      })],
    });

    // THEN
    Template.fromStack(otherStack).resourceCountIs('AWS::IAM::ManagedPolicy', 1);
  });
});

test('ARN for two instances of the same AWS Managed Policy is the same', () => {
  const mp1 = ManagedPolicy.fromAwsManagedPolicyName('foo/bar');
  const mp2 = ManagedPolicy.fromAwsManagedPolicyName('foo/bar');

  expect(mp1.managedPolicyArn).toEqual(mp2.managedPolicyArn);
});
