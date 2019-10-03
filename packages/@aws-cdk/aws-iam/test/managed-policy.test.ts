import '@aws-cdk/assert/jest';
import cdk = require('@aws-cdk/core');
import { Group, ManagedPolicy, PolicyStatement, Role, ServicePrincipal, User } from '../lib';

describe('managed policy', () => {
  test('simple AWS managed policy', () => {
    const stack = new cdk.Stack();
    const mp = ManagedPolicy.fromAwsManagedPolicyName("service-role/SomePolicy");

    expect(stack.resolve(mp.managedPolicyArn)).toEqual({
      "Fn::Join": ['', [
        'arn:',
        { Ref: 'AWS::Partition' },
        ':iam::aws:policy/service-role/SomePolicy'
      ]]
    });
  });

  test('simple customer managed policy', () => {
    const stack = new cdk.Stack();
    const mp = ManagedPolicy.fromManagedPolicyName(stack, 'MyCustomerManagedPolicy', "SomeCustomerPolicy");

    expect(stack.resolve(mp.managedPolicyArn)).toEqual({
      "Fn::Join": ['', [
        'arn:',
        { Ref: 'AWS::Partition' },
        ':iam::',
        { Ref: 'AWS::AccountId' },
        ':policy/SomeCustomerPolicy'
      ]]
    });
  });

  test('managed policy with statements', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'MyStack');

    const policy = new ManagedPolicy(stack, 'MyManagedPolicy', { managedPolicyName: 'MyManagedPolicyName' });
    policy.addStatements(new PolicyStatement({ resources: ['*'], actions: ['sqs:SendMessage'] }));
    policy.addStatements(new PolicyStatement({ resources: ['arn'], actions: ['sns:Subscribe'] }));

    const group = new Group(stack, 'MyGroup');
    group.addManagedPolicy(policy);

    expect(stack).toMatchTemplate({
      Resources: {
        MyManagedPolicy9F3720AE: {
          Type: 'AWS::IAM::ManagedPolicy',
          Properties: {
            ManagedPolicyName: 'MyManagedPolicyName',
            PolicyDocument: {
              Statement:
                [{ Action: 'sqs:SendMessage', Effect: 'Allow', Resource: '*' },
                { Action: 'sns:Subscribe', Effect: 'Allow', Resource: 'arn' }],
              Version: '2012-10-17'
            },
            Path: '/',
            Description: ''
          }
        },
        MyGroupCBA54B1B: {
          Type: 'AWS::IAM::Group',
          Properties: {
            ManagedPolicyArns: [
              { Ref: 'MyManagedPolicy9F3720AE' }
            ]
          }
        }
      }
    });
  });

  test('policy name can be omitted, in which case the logical id will be used', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'MyStack');

    const policy = new ManagedPolicy(stack, 'MyManagedPolicy');
    policy.addStatements(new PolicyStatement({ resources: ['*'], actions: ['sqs:SendMessage'] }));
    policy.addStatements(new PolicyStatement({ resources: ['arn'], actions: ['sns:Subscribe'] }));

    const group = new Group(stack, 'MyGroup');
    group.addManagedPolicy(policy);

    expect(stack).toMatchTemplate({
      Resources: {
        MyManagedPolicy9F3720AE: {
          Type: 'AWS::IAM::ManagedPolicy',
          Properties: {
            PolicyDocument: {
              Statement:
                [{ Action: 'sqs:SendMessage', Effect: 'Allow', Resource: '*' },
                { Action: 'sns:Subscribe', Effect: 'Allow', Resource: 'arn' }],
              Version: '2012-10-17'
            },
            Path: '/',
            Description: ''
          }
        },
        MyGroupCBA54B1B: {
          Type: 'AWS::IAM::Group',
          Properties: {
            ManagedPolicyArns: [
              { Ref: 'MyManagedPolicy9F3720AE' }
            ]
          }
        }
      }
    });
  });

  test('via props, managed policy can be attached to users, groups and roles and permissions, description and path can be added', () => {
    const app = new cdk.App();

    const stack = new cdk.Stack(app, 'MyStack');

    const user1 = new User(stack, 'User1');
    const group1 = new Group(stack, 'Group1');
    const role1 = new Role(stack, 'Role1', {
      assumedBy: new ServicePrincipal('test.service')
    });

    new ManagedPolicy(stack, 'MyTestManagedPolicy', {
      managedPolicyName: 'Foo',
      users: [ user1 ],
      groups: [ group1 ],
      roles: [ role1 ],
      description: 'My Policy Description',
      path: 'tahiti/is/a/magical/place',
      statements: [ new PolicyStatement({ resources: ['*'], actions: ['dynamodb:PutItem'] }) ],
    });

    expect(stack).toMatchTemplate({
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
                  Principal: { Service: 'test.service' }
                }],
              Version: '2012-10-17'
            }
          }
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
              Version: '2012-10-17'
            },
            ManagedPolicyName: 'Foo',
            Roles: [{ Ref: 'Role13A5C70C1' }],
            Users: [{ Ref: 'User1E278A736' }]
          }
        }
      }
    });
  });

  test('idempotent if a principal (user/group/role) is attached twice', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'MyStack');
    const p = new ManagedPolicy(stack, 'MyManagedPolicy');
    p.addStatements(new PolicyStatement({ actions: ['*'], resources: ['*'] }));

    const user = new User(stack, 'MyUser');
    p.attachToUser(user);
    p.attachToUser(user);

    const group = new Group(stack, 'MyGroup');
    p.attachToGroup(group);
    p.attachToGroup(group);

    const role = new Role(stack, 'MyRole', {
      assumedBy: new ServicePrincipal('test.service')
    });
    p.attachToRole(role);
    p.attachToRole(role);

    expect(stack).toMatchTemplate({
      Resources: {
        MyManagedPolicy9F3720AE: {
          Type: 'AWS::IAM::ManagedPolicy',
          Properties: {
            PolicyDocument: {
              Statement: [{ Action: '*', Effect: 'Allow', Resource: '*' }],
              Version: '2012-10-17'
            },
            Description: '',
            Path: '/',
            Users: [{ Ref: 'MyUserDC45028B' }],
            Groups: [{ Ref: 'MyGroupCBA54B1B' }],
            Roles: [{ Ref: 'MyRoleF48FFE04' }]
          }
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
                  Principal: { Service: 'test.service' }
                }],
              Version: '2012-10-17'
            }
          }
        }
      }
    });
  });

  test('users, groups, roles and permissions can be added using methods', () => {
    const app = new cdk.App();

    const stack = new cdk.Stack(app, 'MyStack');

    const p = new ManagedPolicy(stack, 'MyManagedPolicy', {
      managedPolicyName: 'Foo',
    });

    p.attachToUser(new User(stack, 'User1'));
    p.attachToUser(new User(stack, 'User2'));
    p.attachToGroup(new Group(stack, 'Group1'));
    p.attachToRole(new Role(stack, 'Role1', { assumedBy: new ServicePrincipal('test.service') }));
    p.addStatements(new PolicyStatement({ resources: ['*'], actions: ['dynamodb:GetItem'] }));

    expect(stack).toMatchTemplate({
      Resources: {
        MyManagedPolicy9F3720AE: {
          Type: 'AWS::IAM::ManagedPolicy',
          Properties: {
            Groups: [{ Ref: 'Group1BEBD4686' }],
            PolicyDocument: {
              Statement:
                [{ Action: 'dynamodb:GetItem', Effect: 'Allow', Resource: '*' }],
              Version: '2012-10-17'
            },
            ManagedPolicyName: 'Foo',
            Description: '',
            Path: '/',
            Roles: [{ Ref: 'Role13A5C70C1' }],
            Users: [{ Ref: 'User1E278A736' }, { Ref: 'User21F1486D1' }]
          }
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
                  Principal: { Service: 'test.service' }
                }],
              Version: '2012-10-17'
            }
          }
        }
      }
    });
  });

  test('policy can be attached to users, groups or role via methods on the principal', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'MyStack');

    const policy = new ManagedPolicy(stack, 'MyManagedPolicy');
    const user = new User(stack, 'MyUser');
    const group = new Group(stack, 'MyGroup');
    const role = new Role(stack, 'MyRole', { assumedBy: new ServicePrincipal('test.service') });

    user.addManagedPolicy(policy);
    group.addManagedPolicy(policy);
    role.addManagedPolicy(policy);

    policy.addStatements(new PolicyStatement({ resources: ['*'], actions: ['*'] }));

    expect(stack).toMatchTemplate({
      Resources: {
        MyManagedPolicy9F3720AE: {
          Type: 'AWS::IAM::ManagedPolicy',
          Properties: {
            PolicyDocument: {
              Statement: [{ Action: '*', Effect: 'Allow', Resource: '*' }],
              Version: '2012-10-17'
            },
            Description: '',
            Path: '/'
          }
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
                  Principal: { Service: 'test.service' }
                }],
              Version: '2012-10-17'
            }
          }
        }
      }
    });
  });

  test('policy from AWS managed policy lookup can be attached to users, groups or role via methods on the principal', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'MyStack');

    const policy = ManagedPolicy.fromAwsManagedPolicyName('AnAWSManagedPolicy');
    const user = new User(stack, 'MyUser');
    const group = new Group(stack, 'MyGroup');
    const role = new Role(stack, 'MyRole', { assumedBy: new ServicePrincipal('test.service') });

    user.addManagedPolicy(policy);
    group.addManagedPolicy(policy);
    role.addManagedPolicy(policy);

    expect(stack).toMatchTemplate({
      Resources: {
        MyUserDC45028B: {
          Type: 'AWS::IAM::User',
          Properties: {
            ManagedPolicyArns: [
              {
                "Fn::Join": [
                  "",
                  [
                    "arn:",
                    { Ref: "AWS::Partition" },
                    ":iam::aws:policy/AnAWSManagedPolicy"
                  ]
                ]
              }]
          }
        },
        MyGroupCBA54B1B: {
          Type: 'AWS::IAM::Group',
          Properties: {
            ManagedPolicyArns: [
              {
                "Fn::Join": [
                  "",
                  [
                    "arn:",
                    { Ref: "AWS::Partition" },
                    ":iam::aws:policy/AnAWSManagedPolicy"
                  ]
                ]
              }]
          }
        },
        MyRoleF48FFE04: {
          Type: 'AWS::IAM::Role',
          Properties: {
            ManagedPolicyArns: [
              {
                "Fn::Join": [
                  "",
                  [
                    "arn:",
                    { Ref: "AWS::Partition" },
                    ":iam::aws:policy/AnAWSManagedPolicy"
                  ]
                ]
              }],
            AssumeRolePolicyDocument: {
              Statement:
                [{
                  Action: 'sts:AssumeRole',
                  Effect: 'Allow',
                  Principal: { Service: 'test.service' }
                }],
              Version: '2012-10-17'
            }
          }
        }
      }
    });
  });

  test('policy from customer managed policy lookup can be attached to users, groups or role via methods', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'MyStack');

    const policy = ManagedPolicy.fromManagedPolicyName(stack, 'MyManagedPolicy', 'ACustomerManagedPolicyName');
    const user = new User(stack, 'MyUser');
    const group = new Group(stack, 'MyGroup');
    const role = new Role(stack, 'MyRole', { assumedBy: new ServicePrincipal('test.service') });

    user.addManagedPolicy(policy);
    group.addManagedPolicy(policy);
    role.addManagedPolicy(policy);

    expect(stack).toMatchTemplate({
      Resources: {
        MyUserDC45028B: {
          Type: 'AWS::IAM::User',
          Properties: {
            ManagedPolicyArns: [
              {
                "Fn::Join": [
                  "",
                  [
                    "arn:",
                    { Ref: "AWS::Partition" },
                    ":iam::",
                    { Ref: "AWS::AccountId" },
                    ":policy/ACustomerManagedPolicyName"
                  ]
                ]
              }]
          }
        },
        MyGroupCBA54B1B: {
          Type: 'AWS::IAM::Group',
          Properties: {
            ManagedPolicyArns: [
              {
                "Fn::Join": [
                  "",
                  [
                    "arn:",
                    { Ref: "AWS::Partition" },
                    ":iam::",
                    { Ref: "AWS::AccountId" },
                    ":policy/ACustomerManagedPolicyName"
                  ]
                ]
              }]
          }
        },
        MyRoleF48FFE04: {
          Type: 'AWS::IAM::Role',
          Properties: {
            ManagedPolicyArns: [
              {
                "Fn::Join": [
                  "",
                  [
                    "arn:",
                    { Ref: "AWS::Partition" },
                    ":iam::",
                    { Ref: "AWS::AccountId" },
                    ":policy/ACustomerManagedPolicyName"
                  ]
                ]
              }],
            AssumeRolePolicyDocument: {
              Statement:
                [{
                  Action: 'sts:AssumeRole',
                  Effect: 'Allow',
                  Principal: { Service: 'test.service' }
                }],
              Version: '2012-10-17'
            }
          }
        }
      }
    });
  });

  test('fails if policy document is empty', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'MyStack');
    new ManagedPolicy(stack, 'MyPolicy');
    expect(() => app.synth())
      .toThrow(/Managed Policy is empty. You must add statements to the policy/);
  });
});
