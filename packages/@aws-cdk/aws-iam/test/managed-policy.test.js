"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const cdk = require("@aws-cdk/core");
const lib_1 = require("../lib");
describe('managed policy', () => {
    let app;
    let stack;
    beforeEach(() => {
        app = new cdk.App();
        stack = new cdk.Stack(app, 'MyStack', { env: { account: '1234', region: 'us-east-1' } });
    });
    test('simple AWS managed policy', () => {
        const mp = lib_1.ManagedPolicy.fromAwsManagedPolicyName('service-role/SomePolicy');
        expect(stack.resolve(mp.managedPolicyArn)).toEqual({
            'Fn::Join': ['', [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':iam::aws:policy/service-role/SomePolicy',
                ]],
        });
    });
    test('simple customer managed policy', () => {
        const mp = lib_1.ManagedPolicy.fromManagedPolicyName(stack, 'MyCustomerManagedPolicy', 'SomeCustomerPolicy');
        expect(stack.resolve(mp.managedPolicyArn)).toEqual({
            'Fn::Join': ['', [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':iam::1234:policy/SomeCustomerPolicy',
                ]],
        });
    });
    test('managed policy by arn', () => {
        const mp = lib_1.ManagedPolicy.fromManagedPolicyArn(stack, 'MyManagedPolicyByArn', 'arn:aws:iam::1234:policy/my-policy');
        expect(stack.resolve(mp.managedPolicyArn)).toEqual('arn:aws:iam::1234:policy/my-policy');
    });
    test('managed policy with statements', () => {
        const policy = new lib_1.ManagedPolicy(stack, 'MyManagedPolicy', { managedPolicyName: 'MyManagedPolicyName' });
        policy.addStatements(new lib_1.PolicyStatement({ resources: ['*'], actions: ['sqs:SendMessage'] }));
        policy.addStatements(new lib_1.PolicyStatement({ resources: ['arn'], actions: ['sns:Subscribe'] }));
        const group = new lib_1.Group(stack, 'MyGroup');
        group.addManagedPolicy(policy);
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                MyManagedPolicy9F3720AE: {
                    Type: 'AWS::IAM::ManagedPolicy',
                    Properties: {
                        ManagedPolicyName: 'MyManagedPolicyName',
                        PolicyDocument: {
                            Statement: [{ Action: 'sqs:SendMessage', Effect: 'Allow', Resource: '*' },
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
        new lib_1.ManagedPolicy(stack, 'MyManagedPolicy', {
            managedPolicyName: 'MyManagedPolicyName',
            document: lib_1.PolicyDocument.fromJson({
                Statement: [{
                        Action: 'sqs:SendMessage',
                        Effect: 'Allow',
                        Resource: '*',
                    }],
            }),
        });
        assertions_1.Template.fromStack(stack).templateMatches({
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
        new lib_1.ManagedPolicy(stack, 'MyManagedPolicy', {
            managedPolicyName: 'MyManagedPolicyName',
            document: lib_1.PolicyDocument.fromJson({
                Statement: [{
                        Action: 'sqs:SendMessage',
                        Effect: 'Allow',
                        Resource: '*',
                    }],
            }),
            statements: [new lib_1.PolicyStatement({ resources: ['arn'], actions: ['sns:Subscribe'] })],
        });
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                MyManagedPolicy9F3720AE: {
                    Type: 'AWS::IAM::ManagedPolicy',
                    Properties: {
                        ManagedPolicyName: 'MyManagedPolicyName',
                        PolicyDocument: {
                            Statement: [{ Action: 'sqs:SendMessage', Effect: 'Allow', Resource: '*' },
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
        const policy = new lib_1.ManagedPolicy(stack, 'MyManagedPolicy');
        policy.addStatements(new lib_1.PolicyStatement({ resources: ['*'], actions: ['sqs:SendMessage'] }));
        policy.addStatements(new lib_1.PolicyStatement({ resources: ['arn'], actions: ['sns:Subscribe'] }));
        const group = new lib_1.Group(stack, 'MyGroup');
        group.addManagedPolicy(policy);
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                MyManagedPolicy9F3720AE: {
                    Type: 'AWS::IAM::ManagedPolicy',
                    Properties: {
                        PolicyDocument: {
                            Statement: [{ Action: 'sqs:SendMessage', Effect: 'Allow', Resource: '*' },
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
        const user1 = new lib_1.User(stack, 'User1');
        const group1 = new lib_1.Group(stack, 'Group1');
        const role1 = new lib_1.Role(stack, 'Role1', {
            assumedBy: new lib_1.ServicePrincipal('test.service'),
        });
        new lib_1.ManagedPolicy(stack, 'MyTestManagedPolicy', {
            managedPolicyName: 'Foo',
            users: [user1],
            groups: [group1],
            roles: [role1],
            description: 'My Policy Description',
            path: 'tahiti/is/a/magical/place',
            statements: [new lib_1.PolicyStatement({ resources: ['*'], actions: ['dynamodb:PutItem'] })],
        });
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                User1E278A736: { Type: 'AWS::IAM::User' },
                Group1BEBD4686: { Type: 'AWS::IAM::Group' },
                Role13A5C70C1: {
                    Type: 'AWS::IAM::Role',
                    Properties: {
                        AssumeRolePolicyDocument: {
                            Statement: [{
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
                            Statement: [{ Action: 'dynamodb:PutItem', Effect: 'Allow', Resource: '*' }],
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
        const p = new lib_1.ManagedPolicy(stack, 'MyManagedPolicy');
        p.addStatements(new lib_1.PolicyStatement({ actions: ['*'], resources: ['*'] }));
        const user = new lib_1.User(stack, 'MyUser');
        p.attachToUser(user);
        p.attachToUser(user);
        const group = new lib_1.Group(stack, 'MyGroup');
        p.attachToGroup(group);
        p.attachToGroup(group);
        const role = new lib_1.Role(stack, 'MyRole', {
            assumedBy: new lib_1.ServicePrincipal('test.service'),
        });
        p.attachToRole(role);
        p.attachToRole(role);
        assertions_1.Template.fromStack(stack).templateMatches({
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
                            Statement: [{
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
        const p = new lib_1.ManagedPolicy(stack, 'MyManagedPolicy', {
            managedPolicyName: 'Foo',
        });
        p.attachToUser(new lib_1.User(stack, 'User1'));
        p.attachToUser(new lib_1.User(stack, 'User2'));
        p.attachToGroup(new lib_1.Group(stack, 'Group1'));
        p.attachToRole(new lib_1.Role(stack, 'Role1', { assumedBy: new lib_1.ServicePrincipal('test.service') }));
        p.addStatements(new lib_1.PolicyStatement({ resources: ['*'], actions: ['dynamodb:GetItem'] }));
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                MyManagedPolicy9F3720AE: {
                    Type: 'AWS::IAM::ManagedPolicy',
                    Properties: {
                        Groups: [{ Ref: 'Group1BEBD4686' }],
                        PolicyDocument: {
                            Statement: [{ Action: 'dynamodb:GetItem', Effect: 'Allow', Resource: '*' }],
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
                            Statement: [{
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
        const policy = new lib_1.ManagedPolicy(stack, 'MyManagedPolicy');
        const user = new lib_1.User(stack, 'MyUser');
        const group = new lib_1.Group(stack, 'MyGroup');
        const role = new lib_1.Role(stack, 'MyRole', { assumedBy: new lib_1.ServicePrincipal('test.service') });
        user.addManagedPolicy(policy);
        group.addManagedPolicy(policy);
        role.addManagedPolicy(policy);
        policy.addStatements(new lib_1.PolicyStatement({ resources: ['*'], actions: ['*'] }));
        assertions_1.Template.fromStack(stack).templateMatches({
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
                            Statement: [{
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
        const policy = lib_1.ManagedPolicy.fromAwsManagedPolicyName('AnAWSManagedPolicy');
        const user = new lib_1.User(stack, 'MyUser');
        const group = new lib_1.Group(stack, 'MyGroup');
        const role = new lib_1.Role(stack, 'MyRole', { assumedBy: new lib_1.ServicePrincipal('test.service') });
        user.addManagedPolicy(policy);
        group.addManagedPolicy(policy);
        role.addManagedPolicy(policy);
        assertions_1.Template.fromStack(stack).templateMatches({
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
                            Statement: [{
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
        const policy = lib_1.ManagedPolicy.fromManagedPolicyName(stack, 'MyManagedPolicy', 'ACustomerManagedPolicyName');
        const user = new lib_1.User(stack, 'MyUser');
        const group = new lib_1.Group(stack, 'MyGroup');
        const role = new lib_1.Role(stack, 'MyRole', { assumedBy: new lib_1.ServicePrincipal('test.service') });
        user.addManagedPolicy(policy);
        group.addManagedPolicy(policy);
        role.addManagedPolicy(policy);
        assertions_1.Template.fromStack(stack).templateMatches({
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
                            Statement: [{
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
        new lib_1.ManagedPolicy(stack, 'MyPolicy');
        expect(() => app.synth())
            .toThrow(/Managed Policy is empty. You must add statements to the policy/);
    });
    test('managed policy name is correctly calculated', () => {
        const mp = new lib_1.ManagedPolicy(stack, 'Policy');
        mp.addStatements(new lib_1.PolicyStatement({
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
        new lib_1.ManagedPolicy(stack, 'MyManagedPolicy', {
            statements: [
                new lib_1.PolicyStatement({ actions: ['*'] }),
            ],
        });
        expect(() => app.synth()).toThrow(/A PolicyStatement used in an identity-based policy must specify at least one resource/);
    });
    test('fails if policy document specifies principals', () => {
        new lib_1.ManagedPolicy(stack, 'MyManagedPolicy', {
            statements: [
                new lib_1.PolicyStatement({ actions: ['*'], resources: ['*'], principals: [new lib_1.ServicePrincipal('test.service')] }),
            ],
        });
        expect(() => app.synth()).toThrow(/A PolicyStatement used in an identity-based policy cannot specify any IAM principals/);
    });
    test('cross-stack hard-name contains the right resource type', () => {
        const mp = new lib_1.ManagedPolicy(stack, 'Policy', {
            managedPolicyName: cdk.PhysicalName.GENERATE_IF_NEEDED,
        });
        mp.addStatements(new lib_1.PolicyStatement({
            actions: ['a:abc'],
            resources: ['*'],
        }));
        const stack2 = new cdk.Stack(app, 'Stack2', { env: { account: '5678', region: 'us-east-1' } });
        new cdk.CfnOutput(stack2, 'Output', {
            value: mp.managedPolicyArn,
        });
        assertions_1.Template.fromStack(stack2).templateMatches({
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
        const mp = new lib_1.ManagedPolicy(stack, 'Policy', {
            managedPolicyName: 'MyManagedPolicyName',
        });
        lib_1.Grant.addToPrincipal({ actions: ['dummy:Action'], grantee: mp, resourceArns: ['*'] });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::ManagedPolicy', {
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
        const mp = new lib_1.ManagedPolicy(stack, 'Policy', {
            managedPolicyName: 'MyManagedPolicyName',
        });
        class DummyResource extends cdk.Resource {
            addToResourcePolicy(_statement) {
                throw new Error('should not be called.');
            }
        }
        ;
        const resource = new DummyResource(stack, 'Dummy');
        lib_1.Grant.addToPrincipalOrResource({ actions: ['dummy:Action'], grantee: mp, resourceArns: ['*'], resource });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::ManagedPolicy', {
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
        const mp = new lib_1.ManagedPolicy(stack, 'Policy', {
            managedPolicyName: 'MyManagedPolicyName',
        });
        class DummyResource extends cdk.Resource {
            addToResourcePolicy(_statement) {
                throw new Error('should not be called.');
            }
        }
        ;
        const resource = new DummyResource(stack, 'Dummy', { account: '5678' });
        expect(() => {
            lib_1.Grant.addToPrincipalOrResource({ actions: ['dummy:Action'], grantee: mp, resourceArns: ['*'], resource });
        }).toThrow(/Cannot use a ManagedPolicy 'MyStack\/Policy'/);
    });
    test('Policies cannot be granted resource permissions', () => {
        const mp = new lib_1.ManagedPolicy(stack, 'Policy', {
            managedPolicyName: 'MyManagedPolicyName',
        });
        class DummyResource extends cdk.Resource {
            addToResourcePolicy(_statement) {
                throw new Error('should not be called.');
            }
        }
        ;
        const resource = new DummyResource(stack, 'Dummy');
        expect(() => {
            lib_1.Grant.addToPrincipalAndResource({ actions: ['dummy:Action'], grantee: mp, resourceArns: ['*'], resource });
        }).toThrow(/Cannot use a ManagedPolicy 'MyStack\/Policy'/);
    });
    test('prevent creation when customizeRoles is configured', () => {
        // GIVEN
        const otherStack = new cdk.Stack();
        lib_1.Role.customizeRoles(otherStack);
        // WHEN
        new lib_1.ManagedPolicy(otherStack, 'CustomPolicy', {
            statements: [new lib_1.PolicyStatement({
                    effect: lib_1.Effect.ALLOW,
                    resources: ['*'],
                    actions: ['*'],
                })],
        });
        // THEN
        assertions_1.Template.fromStack(otherStack).resourceCountIs('AWS::IAM::ManagedPolicy', 0);
    });
    test('do not prevent creation when customizeRoles.preventSynthesis=false', () => {
        // GIVEN
        const otherStack = new cdk.Stack();
        lib_1.Role.customizeRoles(otherStack, {
            preventSynthesis: false,
        });
        // WHEN
        new lib_1.ManagedPolicy(otherStack, 'CustomPolicy', {
            statements: [new lib_1.PolicyStatement({
                    effect: lib_1.Effect.ALLOW,
                    resources: ['*'],
                    actions: ['*'],
                })],
        });
        // THEN
        assertions_1.Template.fromStack(otherStack).resourceCountIs('AWS::IAM::ManagedPolicy', 1);
    });
});
test('ARN for two instances of the same AWS Managed Policy is the same', () => {
    const mp1 = lib_1.ManagedPolicy.fromAwsManagedPolicyName('foo/bar');
    const mp2 = lib_1.ManagedPolicy.fromAwsManagedPolicyName('foo/bar');
    expect(mp1.managedPolicyArn).toEqual(mp2.managedPolicyArn);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFuYWdlZC1wb2xpY3kudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1hbmFnZWQtcG9saWN5LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBK0M7QUFDL0MscUNBQXFDO0FBQ3JDLGdDQUE2SztBQUU3SyxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFO0lBQzlCLElBQUksR0FBWSxDQUFDO0lBQ2pCLElBQUksS0FBZ0IsQ0FBQztJQUVyQixVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ3BCLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUMzRixDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQywyQkFBMkIsRUFBRSxHQUFHLEVBQUU7UUFDckMsTUFBTSxFQUFFLEdBQUcsbUJBQWEsQ0FBQyx3QkFBd0IsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1FBRTdFLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQ2pELFVBQVUsRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDZixNQUFNO29CQUNOLEVBQUUsR0FBRyxFQUFFLGdCQUFnQixFQUFFO29CQUN6QiwwQ0FBMEM7aUJBQzNDLENBQUM7U0FDSCxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxnQ0FBZ0MsRUFBRSxHQUFHLEVBQUU7UUFDMUMsTUFBTSxFQUFFLEdBQUcsbUJBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLEVBQUUseUJBQXlCLEVBQUUsb0JBQW9CLENBQUMsQ0FB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O1FBQ1AsSUFBSSxtQkFBYSxDQUFDLFVBQVUsRUFBRSxjQUFjLEVBQUU7WUFDNUMsVUFBVSxFQUFFLENBQUMsSUFBSSxxQkFBZSxDQUFDO29CQUMvQixNQUFNLEVBQUUsWUFBTSxDQUFDLEtBQUs7b0JBQ3BCLFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQztvQkFDaEIsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDO2lCQUNmLENBQUMsQ0FBQztTQUNKLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxlQUFlLENBQUMseUJBQXlCLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDL0UsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyxrRUFBa0UsRUFBRSxHQUFHLEVBQUU7SUFDNUUsTUFBTSxHQUFHLEdBQUcsbUJBQWEsQ0FBQyx3QkFBd0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM5RCxNQUFNLEdBQUcsR0FBRyxtQkFBYSxDQUFDLHdCQUF3QixDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBRTlELE1BQU0sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDN0QsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQWRkVG9QcmluY2lwYWxQb2xpY3lSZXN1bHQsIEdyYW50LCBHcm91cCwgSVJlc291cmNlV2l0aFBvbGljeSwgTWFuYWdlZFBvbGljeSwgUG9saWN5RG9jdW1lbnQsIFBvbGljeVN0YXRlbWVudCwgUm9sZSwgU2VydmljZVByaW5jaXBhbCwgVXNlciwgRWZmZWN0IH0gZnJvbSAnLi4vbGliJztcblxuZGVzY3JpYmUoJ21hbmFnZWQgcG9saWN5JywgKCkgPT4ge1xuICBsZXQgYXBwOiBjZGsuQXBwO1xuICBsZXQgc3RhY2s6IGNkay5TdGFjaztcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdNeVN0YWNrJywgeyBlbnY6IHsgYWNjb3VudDogJzEyMzQnLCByZWdpb246ICd1cy1lYXN0LTEnIH0gfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3NpbXBsZSBBV1MgbWFuYWdlZCBwb2xpY3knLCAoKSA9PiB7XG4gICAgY29uc3QgbXAgPSBNYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZSgnc2VydmljZS1yb2xlL1NvbWVQb2xpY3knKTtcblxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKG1wLm1hbmFnZWRQb2xpY3lBcm4pKS50b0VxdWFsKHtcbiAgICAgICdGbjo6Sm9pbic6IFsnJywgW1xuICAgICAgICAnYXJuOicsXG4gICAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICc6aWFtOjphd3M6cG9saWN5L3NlcnZpY2Utcm9sZS9Tb21lUG9saWN5JyxcbiAgICAgIF1dLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdzaW1wbGUgY3VzdG9tZXIgbWFuYWdlZCBwb2xpY3knLCAoKSA9PiB7XG4gICAgY29uc3QgbXAgPSBNYW5hZ2VkUG9saWN5LmZyb21NYW5hZ2VkUG9saWN5TmFtZShzdGFjaywgJ015Q3VzdG9tZXJNYW5hZ2VkUG9saWN5JywgJ1NvbWVDdXN0b21lclBvbGljeScpO1xuXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUobXAubWFuYWdlZFBvbGljeUFybikpLnRvRXF1YWwoe1xuICAgICAgJ0ZuOjpKb2luJzogWycnLCBbXG4gICAgICAgICdhcm46JyxcbiAgICAgICAgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgJzppYW06OjEyMzQ6cG9saWN5L1NvbWVDdXN0b21lclBvbGljeScsXG4gICAgICBdXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnbWFuYWdlZCBwb2xpY3kgYnkgYXJuJywgKCkgPT4ge1xuICAgIGNvbnN0IG1wID0gTWFuYWdlZFBvbGljeS5mcm9tTWFuYWdlZFBvbGljeUFybihzdGFjaywgJ015TWFuYWdlZFBvbGljeUJ5QXJuJywgJ2Fybjphd3M6aWFtOjoxMjM0OnBvbGljeS9teS1wb2xpY3knKTtcblxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKG1wLm1hbmFnZWRQb2xpY3lBcm4pKS50b0VxdWFsKCdhcm46YXdzOmlhbTo6MTIzNDpwb2xpY3kvbXktcG9saWN5Jyk7XG4gIH0pO1xuXG4gIHRlc3QoJ21hbmFnZWQgcG9saWN5IHdpdGggc3RhdGVtZW50cycsICgpID0+IHtcbiAgICBjb25zdCBwb2xpY3kgPSBuZXcgTWFuYWdlZFBvbGljeShzdGFjaywgJ015TWFuYWdlZFBvbGljeScsIHsgbWFuYWdlZFBvbGljeU5hbWU6ICdNeU1hbmFnZWRQb2xpY3lOYW1lJyB9KTtcbiAgICBwb2xpY3kuYWRkU3RhdGVtZW50cyhuZXcgUG9saWN5U3RhdGVtZW50KHsgcmVzb3VyY2VzOiBbJyonXSwgYWN0aW9uczogWydzcXM6U2VuZE1lc3NhZ2UnXSB9KSk7XG4gICAgcG9saWN5LmFkZFN0YXRlbWVudHMobmV3IFBvbGljeVN0YXRlbWVudCh7IHJlc291cmNlczogWydhcm4nXSwgYWN0aW9uczogWydzbnM6U3Vic2NyaWJlJ10gfSkpO1xuXG4gICAgY29uc3QgZ3JvdXAgPSBuZXcgR3JvdXAoc3RhY2ssICdNeUdyb3VwJyk7XG4gICAgZ3JvdXAuYWRkTWFuYWdlZFBvbGljeShwb2xpY3kpO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIE15TWFuYWdlZFBvbGljeTlGMzcyMEFFOiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6SUFNOjpNYW5hZ2VkUG9saWN5JyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBNYW5hZ2VkUG9saWN5TmFtZTogJ015TWFuYWdlZFBvbGljeU5hbWUnLFxuICAgICAgICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICAgICAgU3RhdGVtZW50OlxuICAgICAgICAgICAgICAgIFt7IEFjdGlvbjogJ3NxczpTZW5kTWVzc2FnZScsIEVmZmVjdDogJ0FsbG93JywgUmVzb3VyY2U6ICcqJyB9LFxuICAgICAgICAgICAgICAgICAgeyBBY3Rpb246ICdzbnM6U3Vic2NyaWJlJywgRWZmZWN0OiAnQWxsb3cnLCBSZXNvdXJjZTogJ2FybicgfV0sXG4gICAgICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBQYXRoOiAnLycsXG4gICAgICAgICAgICBEZXNjcmlwdGlvbjogJycsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgTXlHcm91cENCQTU0QjFCOiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6SUFNOjpHcm91cCcsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgTWFuYWdlZFBvbGljeUFybnM6IFtcbiAgICAgICAgICAgICAgeyBSZWY6ICdNeU1hbmFnZWRQb2xpY3k5RjM3MjBBRScgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ21hbmFnZWQgcG9saWN5IGZyb20gcG9saWN5IGRvY3VtZW50IGFsb25lJywgKCkgPT4ge1xuICAgIG5ldyBNYW5hZ2VkUG9saWN5KHN0YWNrLCAnTXlNYW5hZ2VkUG9saWN5Jywge1xuICAgICAgbWFuYWdlZFBvbGljeU5hbWU6ICdNeU1hbmFnZWRQb2xpY3lOYW1lJyxcbiAgICAgIGRvY3VtZW50OiBQb2xpY3lEb2N1bWVudC5mcm9tSnNvbih7XG4gICAgICAgIFN0YXRlbWVudDogW3tcbiAgICAgICAgICBBY3Rpb246ICdzcXM6U2VuZE1lc3NhZ2UnLFxuICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICB9XSxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIE15TWFuYWdlZFBvbGljeTlGMzcyMEFFOiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6SUFNOjpNYW5hZ2VkUG9saWN5JyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBNYW5hZ2VkUG9saWN5TmFtZTogJ015TWFuYWdlZFBvbGljeU5hbWUnLFxuICAgICAgICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICAgICAgU3RhdGVtZW50OiBbeyBBY3Rpb246ICdzcXM6U2VuZE1lc3NhZ2UnLCBFZmZlY3Q6ICdBbGxvdycsIFJlc291cmNlOiAnKicgfV0sXG4gICAgICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBQYXRoOiAnLycsXG4gICAgICAgICAgICBEZXNjcmlwdGlvbjogJycsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ21hbmFnZWQgcG9saWN5IGZyb20gcG9saWN5IGRvY3VtZW50IHdpdGggYWRkaXRpb25hbCBzdGF0ZW1lbnRzJywgKCkgPT4ge1xuICAgIG5ldyBNYW5hZ2VkUG9saWN5KHN0YWNrLCAnTXlNYW5hZ2VkUG9saWN5Jywge1xuICAgICAgbWFuYWdlZFBvbGljeU5hbWU6ICdNeU1hbmFnZWRQb2xpY3lOYW1lJyxcbiAgICAgIGRvY3VtZW50OiBQb2xpY3lEb2N1bWVudC5mcm9tSnNvbih7XG4gICAgICAgIFN0YXRlbWVudDogW3tcbiAgICAgICAgICBBY3Rpb246ICdzcXM6U2VuZE1lc3NhZ2UnLFxuICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICB9XSxcbiAgICAgIH0pLFxuICAgICAgc3RhdGVtZW50czogW25ldyBQb2xpY3lTdGF0ZW1lbnQoeyByZXNvdXJjZXM6IFsnYXJuJ10sIGFjdGlvbnM6IFsnc25zOlN1YnNjcmliZSddIH0pXSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgIFJlc291cmNlczoge1xuICAgICAgICBNeU1hbmFnZWRQb2xpY3k5RjM3MjBBRToge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OklBTTo6TWFuYWdlZFBvbGljeScsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgTWFuYWdlZFBvbGljeU5hbWU6ICdNeU1hbmFnZWRQb2xpY3lOYW1lJyxcbiAgICAgICAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgICAgIFN0YXRlbWVudDpcbiAgICAgICAgICAgICAgICBbeyBBY3Rpb246ICdzcXM6U2VuZE1lc3NhZ2UnLCBFZmZlY3Q6ICdBbGxvdycsIFJlc291cmNlOiAnKicgfSxcbiAgICAgICAgICAgICAgICAgIHsgQWN0aW9uOiAnc25zOlN1YnNjcmliZScsIEVmZmVjdDogJ0FsbG93JywgUmVzb3VyY2U6ICdhcm4nIH1dLFxuICAgICAgICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgUGF0aDogJy8nLFxuICAgICAgICAgICAgRGVzY3JpcHRpb246ICcnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdwb2xpY3kgbmFtZSBjYW4gYmUgb21pdHRlZCwgaW4gd2hpY2ggY2FzZSB0aGUgbG9naWNhbCBpZCB3aWxsIGJlIHVzZWQnLCAoKSA9PiB7XG4gICAgY29uc3QgcG9saWN5ID0gbmV3IE1hbmFnZWRQb2xpY3koc3RhY2ssICdNeU1hbmFnZWRQb2xpY3knKTtcbiAgICBwb2xpY3kuYWRkU3RhdGVtZW50cyhuZXcgUG9saWN5U3RhdGVtZW50KHsgcmVzb3VyY2VzOiBbJyonXSwgYWN0aW9uczogWydzcXM6U2VuZE1lc3NhZ2UnXSB9KSk7XG4gICAgcG9saWN5LmFkZFN0YXRlbWVudHMobmV3IFBvbGljeVN0YXRlbWVudCh7IHJlc291cmNlczogWydhcm4nXSwgYWN0aW9uczogWydzbnM6U3Vic2NyaWJlJ10gfSkpO1xuXG4gICAgY29uc3QgZ3JvdXAgPSBuZXcgR3JvdXAoc3RhY2ssICdNeUdyb3VwJyk7XG4gICAgZ3JvdXAuYWRkTWFuYWdlZFBvbGljeShwb2xpY3kpO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIE15TWFuYWdlZFBvbGljeTlGMzcyMEFFOiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6SUFNOjpNYW5hZ2VkUG9saWN5JyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgICAgICBTdGF0ZW1lbnQ6XG4gICAgICAgICAgICAgICAgW3sgQWN0aW9uOiAnc3FzOlNlbmRNZXNzYWdlJywgRWZmZWN0OiAnQWxsb3cnLCBSZXNvdXJjZTogJyonIH0sXG4gICAgICAgICAgICAgICAgICB7IEFjdGlvbjogJ3NuczpTdWJzY3JpYmUnLCBFZmZlY3Q6ICdBbGxvdycsIFJlc291cmNlOiAnYXJuJyB9XSxcbiAgICAgICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFBhdGg6ICcvJyxcbiAgICAgICAgICAgIERlc2NyaXB0aW9uOiAnJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBNeUdyb3VwQ0JBNTRCMUI6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpJQU06Okdyb3VwJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBNYW5hZ2VkUG9saWN5QXJuczogW1xuICAgICAgICAgICAgICB7IFJlZjogJ015TWFuYWdlZFBvbGljeTlGMzcyMEFFJyB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgndmlhIHByb3BzLCBtYW5hZ2VkIHBvbGljeSBjYW4gYmUgYXR0YWNoZWQgdG8gdXNlcnMsIGdyb3VwcyBhbmQgcm9sZXMgYW5kIHBlcm1pc3Npb25zLCBkZXNjcmlwdGlvbiBhbmQgcGF0aCBjYW4gYmUgYWRkZWQnLCAoKSA9PiB7XG4gICAgY29uc3QgdXNlcjEgPSBuZXcgVXNlcihzdGFjaywgJ1VzZXIxJyk7XG4gICAgY29uc3QgZ3JvdXAxID0gbmV3IEdyb3VwKHN0YWNrLCAnR3JvdXAxJyk7XG4gICAgY29uc3Qgcm9sZTEgPSBuZXcgUm9sZShzdGFjaywgJ1JvbGUxJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgndGVzdC5zZXJ2aWNlJyksXG4gICAgfSk7XG5cbiAgICBuZXcgTWFuYWdlZFBvbGljeShzdGFjaywgJ015VGVzdE1hbmFnZWRQb2xpY3knLCB7XG4gICAgICBtYW5hZ2VkUG9saWN5TmFtZTogJ0ZvbycsXG4gICAgICB1c2VyczogW3VzZXIxXSxcbiAgICAgIGdyb3VwczogW2dyb3VwMV0sXG4gICAgICByb2xlczogW3JvbGUxXSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnTXkgUG9saWN5IERlc2NyaXB0aW9uJyxcbiAgICAgIHBhdGg6ICd0YWhpdGkvaXMvYS9tYWdpY2FsL3BsYWNlJyxcbiAgICAgIHN0YXRlbWVudHM6IFtuZXcgUG9saWN5U3RhdGVtZW50KHsgcmVzb3VyY2VzOiBbJyonXSwgYWN0aW9uczogWydkeW5hbW9kYjpQdXRJdGVtJ10gfSldLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIFVzZXIxRTI3OEE3MzY6IHsgVHlwZTogJ0FXUzo6SUFNOjpVc2VyJyB9LFxuICAgICAgICBHcm91cDFCRUJENDY4NjogeyBUeXBlOiAnQVdTOjpJQU06Okdyb3VwJyB9LFxuICAgICAgICBSb2xlMTNBNUM3MEMxOiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6SUFNOjpSb2xlJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICAgICAgU3RhdGVtZW50OlxuICAgICAgICAgICAgICAgIFt7XG4gICAgICAgICAgICAgICAgICBBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgICAgICBQcmluY2lwYWw6IHsgU2VydmljZTogJ3Rlc3Quc2VydmljZScgfSxcbiAgICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBNeVRlc3RNYW5hZ2VkUG9saWN5NjUzNUQ5RjU6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpJQU06Ok1hbmFnZWRQb2xpY3knLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIEdyb3VwczogW3sgUmVmOiAnR3JvdXAxQkVCRDQ2ODYnIH1dLFxuICAgICAgICAgICAgRGVzY3JpcHRpb246ICdNeSBQb2xpY3kgRGVzY3JpcHRpb24nLFxuICAgICAgICAgICAgUGF0aDogJ3RhaGl0aS9pcy9hL21hZ2ljYWwvcGxhY2UnLFxuICAgICAgICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICAgICAgU3RhdGVtZW50OlxuICAgICAgICAgICAgICAgIFt7IEFjdGlvbjogJ2R5bmFtb2RiOlB1dEl0ZW0nLCBFZmZlY3Q6ICdBbGxvdycsIFJlc291cmNlOiAnKicgfV0sXG4gICAgICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBNYW5hZ2VkUG9saWN5TmFtZTogJ0ZvbycsXG4gICAgICAgICAgICBSb2xlczogW3sgUmVmOiAnUm9sZTEzQTVDNzBDMScgfV0sXG4gICAgICAgICAgICBVc2VyczogW3sgUmVmOiAnVXNlcjFFMjc4QTczNicgfV0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2lkZW1wb3RlbnQgaWYgYSBwcmluY2lwYWwgKHVzZXIvZ3JvdXAvcm9sZSkgaXMgYXR0YWNoZWQgdHdpY2UnLCAoKSA9PiB7XG4gICAgY29uc3QgcCA9IG5ldyBNYW5hZ2VkUG9saWN5KHN0YWNrLCAnTXlNYW5hZ2VkUG9saWN5Jyk7XG4gICAgcC5hZGRTdGF0ZW1lbnRzKG5ldyBQb2xpY3lTdGF0ZW1lbnQoeyBhY3Rpb25zOiBbJyonXSwgcmVzb3VyY2VzOiBbJyonXSB9KSk7XG5cbiAgICBjb25zdCB1c2VyID0gbmV3IFVzZXIoc3RhY2ssICdNeVVzZXInKTtcbiAgICBwLmF0dGFjaFRvVXNlcih1c2VyKTtcbiAgICBwLmF0dGFjaFRvVXNlcih1c2VyKTtcblxuICAgIGNvbnN0IGdyb3VwID0gbmV3IEdyb3VwKHN0YWNrLCAnTXlHcm91cCcpO1xuICAgIHAuYXR0YWNoVG9Hcm91cChncm91cCk7XG4gICAgcC5hdHRhY2hUb0dyb3VwKGdyb3VwKTtcblxuICAgIGNvbnN0IHJvbGUgPSBuZXcgUm9sZShzdGFjaywgJ015Um9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ3Rlc3Quc2VydmljZScpLFxuICAgIH0pO1xuICAgIHAuYXR0YWNoVG9Sb2xlKHJvbGUpO1xuICAgIHAuYXR0YWNoVG9Sb2xlKHJvbGUpO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIE15TWFuYWdlZFBvbGljeTlGMzcyMEFFOiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6SUFNOjpNYW5hZ2VkUG9saWN5JyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgICAgICBTdGF0ZW1lbnQ6IFt7IEFjdGlvbjogJyonLCBFZmZlY3Q6ICdBbGxvdycsIFJlc291cmNlOiAnKicgfV0sXG4gICAgICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBEZXNjcmlwdGlvbjogJycsXG4gICAgICAgICAgICBQYXRoOiAnLycsXG4gICAgICAgICAgICBVc2VyczogW3sgUmVmOiAnTXlVc2VyREM0NTAyOEInIH1dLFxuICAgICAgICAgICAgR3JvdXBzOiBbeyBSZWY6ICdNeUdyb3VwQ0JBNTRCMUInIH1dLFxuICAgICAgICAgICAgUm9sZXM6IFt7IFJlZjogJ015Um9sZUY0OEZGRTA0JyB9XSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBNeVVzZXJEQzQ1MDI4QjogeyBUeXBlOiAnQVdTOjpJQU06OlVzZXInIH0sXG4gICAgICAgIE15R3JvdXBDQkE1NEIxQjogeyBUeXBlOiAnQVdTOjpJQU06Okdyb3VwJyB9LFxuICAgICAgICBNeVJvbGVGNDhGRkUwNDoge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OklBTTo6Um9sZScsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgQXNzdW1lUm9sZVBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgICAgIFN0YXRlbWVudDpcbiAgICAgICAgICAgICAgICBbe1xuICAgICAgICAgICAgICAgICAgQWN0aW9uOiAnc3RzOkFzc3VtZVJvbGUnLFxuICAgICAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgICAgUHJpbmNpcGFsOiB7IFNlcnZpY2U6ICd0ZXN0LnNlcnZpY2UnIH0sXG4gICAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3VzZXJzLCBncm91cHMsIHJvbGVzIGFuZCBwZXJtaXNzaW9ucyBjYW4gYmUgYWRkZWQgdXNpbmcgbWV0aG9kcycsICgpID0+IHtcbiAgICBjb25zdCBwID0gbmV3IE1hbmFnZWRQb2xpY3koc3RhY2ssICdNeU1hbmFnZWRQb2xpY3knLCB7XG4gICAgICBtYW5hZ2VkUG9saWN5TmFtZTogJ0ZvbycsXG4gICAgfSk7XG5cbiAgICBwLmF0dGFjaFRvVXNlcihuZXcgVXNlcihzdGFjaywgJ1VzZXIxJykpO1xuICAgIHAuYXR0YWNoVG9Vc2VyKG5ldyBVc2VyKHN0YWNrLCAnVXNlcjInKSk7XG4gICAgcC5hdHRhY2hUb0dyb3VwKG5ldyBHcm91cChzdGFjaywgJ0dyb3VwMScpKTtcbiAgICBwLmF0dGFjaFRvUm9sZShuZXcgUm9sZShzdGFjaywgJ1JvbGUxJywgeyBhc3N1bWVkQnk6IG5ldyBTZXJ2aWNlUHJpbmNpcGFsKCd0ZXN0LnNlcnZpY2UnKSB9KSk7XG4gICAgcC5hZGRTdGF0ZW1lbnRzKG5ldyBQb2xpY3lTdGF0ZW1lbnQoeyByZXNvdXJjZXM6IFsnKiddLCBhY3Rpb25zOiBbJ2R5bmFtb2RiOkdldEl0ZW0nXSB9KSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgTXlNYW5hZ2VkUG9saWN5OUYzNzIwQUU6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpJQU06Ok1hbmFnZWRQb2xpY3knLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIEdyb3VwczogW3sgUmVmOiAnR3JvdXAxQkVCRDQ2ODYnIH1dLFxuICAgICAgICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICAgICAgU3RhdGVtZW50OlxuICAgICAgICAgICAgICAgIFt7IEFjdGlvbjogJ2R5bmFtb2RiOkdldEl0ZW0nLCBFZmZlY3Q6ICdBbGxvdycsIFJlc291cmNlOiAnKicgfV0sXG4gICAgICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBNYW5hZ2VkUG9saWN5TmFtZTogJ0ZvbycsXG4gICAgICAgICAgICBEZXNjcmlwdGlvbjogJycsXG4gICAgICAgICAgICBQYXRoOiAnLycsXG4gICAgICAgICAgICBSb2xlczogW3sgUmVmOiAnUm9sZTEzQTVDNzBDMScgfV0sXG4gICAgICAgICAgICBVc2VyczogW3sgUmVmOiAnVXNlcjFFMjc4QTczNicgfSwgeyBSZWY6ICdVc2VyMjFGMTQ4NkQxJyB9XSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBVc2VyMUUyNzhBNzM2OiB7IFR5cGU6ICdBV1M6OklBTTo6VXNlcicgfSxcbiAgICAgICAgVXNlcjIxRjE0ODZEMTogeyBUeXBlOiAnQVdTOjpJQU06OlVzZXInIH0sXG4gICAgICAgIEdyb3VwMUJFQkQ0Njg2OiB7IFR5cGU6ICdBV1M6OklBTTo6R3JvdXAnIH0sXG4gICAgICAgIFJvbGUxM0E1QzcwQzE6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpJQU06OlJvbGUnLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIEFzc3VtZVJvbGVQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgICAgICBTdGF0ZW1lbnQ6XG4gICAgICAgICAgICAgICAgW3tcbiAgICAgICAgICAgICAgICAgIEFjdGlvbjogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgICAgIFByaW5jaXBhbDogeyBTZXJ2aWNlOiAndGVzdC5zZXJ2aWNlJyB9LFxuICAgICAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdwb2xpY3kgY2FuIGJlIGF0dGFjaGVkIHRvIHVzZXJzLCBncm91cHMgb3Igcm9sZSB2aWEgbWV0aG9kcyBvbiB0aGUgcHJpbmNpcGFsJywgKCkgPT4ge1xuICAgIGNvbnN0IHBvbGljeSA9IG5ldyBNYW5hZ2VkUG9saWN5KHN0YWNrLCAnTXlNYW5hZ2VkUG9saWN5Jyk7XG4gICAgY29uc3QgdXNlciA9IG5ldyBVc2VyKHN0YWNrLCAnTXlVc2VyJyk7XG4gICAgY29uc3QgZ3JvdXAgPSBuZXcgR3JvdXAoc3RhY2ssICdNeUdyb3VwJyk7XG4gICAgY29uc3Qgcm9sZSA9IG5ldyBSb2xlKHN0YWNrLCAnTXlSb2xlJywgeyBhc3N1bWVkQnk6IG5ldyBTZXJ2aWNlUHJpbmNpcGFsKCd0ZXN0LnNlcnZpY2UnKSB9KTtcblxuICAgIHVzZXIuYWRkTWFuYWdlZFBvbGljeShwb2xpY3kpO1xuICAgIGdyb3VwLmFkZE1hbmFnZWRQb2xpY3kocG9saWN5KTtcbiAgICByb2xlLmFkZE1hbmFnZWRQb2xpY3kocG9saWN5KTtcblxuICAgIHBvbGljeS5hZGRTdGF0ZW1lbnRzKG5ldyBQb2xpY3lTdGF0ZW1lbnQoeyByZXNvdXJjZXM6IFsnKiddLCBhY3Rpb25zOiBbJyonXSB9KSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgTXlNYW5hZ2VkUG9saWN5OUYzNzIwQUU6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpJQU06Ok1hbmFnZWRQb2xpY3knLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgICAgIFN0YXRlbWVudDogW3sgQWN0aW9uOiAnKicsIEVmZmVjdDogJ0FsbG93JywgUmVzb3VyY2U6ICcqJyB9XSxcbiAgICAgICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIERlc2NyaXB0aW9uOiAnJyxcbiAgICAgICAgICAgIFBhdGg6ICcvJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBNeVVzZXJEQzQ1MDI4QjogeyBUeXBlOiAnQVdTOjpJQU06OlVzZXInLCBQcm9wZXJ0aWVzOiB7IE1hbmFnZWRQb2xpY3lBcm5zOiBbeyBSZWY6ICdNeU1hbmFnZWRQb2xpY3k5RjM3MjBBRScgfV0gfSB9LFxuICAgICAgICBNeUdyb3VwQ0JBNTRCMUI6IHsgVHlwZTogJ0FXUzo6SUFNOjpHcm91cCcsIFByb3BlcnRpZXM6IHsgTWFuYWdlZFBvbGljeUFybnM6IFt7IFJlZjogJ015TWFuYWdlZFBvbGljeTlGMzcyMEFFJyB9XSB9IH0sXG4gICAgICAgIE15Um9sZUY0OEZGRTA0OiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6SUFNOjpSb2xlJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBNYW5hZ2VkUG9saWN5QXJuczogW3sgUmVmOiAnTXlNYW5hZ2VkUG9saWN5OUYzNzIwQUUnIH1dLFxuICAgICAgICAgICAgQXNzdW1lUm9sZVBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgICAgIFN0YXRlbWVudDpcbiAgICAgICAgICAgICAgICBbe1xuICAgICAgICAgICAgICAgICAgQWN0aW9uOiAnc3RzOkFzc3VtZVJvbGUnLFxuICAgICAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgICAgUHJpbmNpcGFsOiB7IFNlcnZpY2U6ICd0ZXN0LnNlcnZpY2UnIH0sXG4gICAgICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3BvbGljeSBmcm9tIEFXUyBtYW5hZ2VkIHBvbGljeSBsb29rdXAgY2FuIGJlIGF0dGFjaGVkIHRvIHVzZXJzLCBncm91cHMgb3Igcm9sZSB2aWEgbWV0aG9kcyBvbiB0aGUgcHJpbmNpcGFsJywgKCkgPT4ge1xuICAgIGNvbnN0IHBvbGljeSA9IE1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdBbkFXU01hbmFnZWRQb2xpY3knKTtcbiAgICBjb25zdCB1c2VyID0gbmV3IFVzZXIoc3RhY2ssICdNeVVzZXInKTtcbiAgICBjb25zdCBncm91cCA9IG5ldyBHcm91cChzdGFjaywgJ015R3JvdXAnKTtcbiAgICBjb25zdCByb2xlID0gbmV3IFJvbGUoc3RhY2ssICdNeVJvbGUnLCB7IGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ3Rlc3Quc2VydmljZScpIH0pO1xuXG4gICAgdXNlci5hZGRNYW5hZ2VkUG9saWN5KHBvbGljeSk7XG4gICAgZ3JvdXAuYWRkTWFuYWdlZFBvbGljeShwb2xpY3kpO1xuICAgIHJvbGUuYWRkTWFuYWdlZFBvbGljeShwb2xpY3kpO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIE15VXNlckRDNDUwMjhCOiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6SUFNOjpVc2VyJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBNYW5hZ2VkUG9saWN5QXJuczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgICAgICAgICAgICAgJzppYW06OmF3czpwb2xpY3kvQW5BV1NNYW5hZ2VkUG9saWN5JyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgTXlHcm91cENCQTU0QjFCOiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6SUFNOjpHcm91cCcsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgTWFuYWdlZFBvbGljeUFybnM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICAgICAgICAgICAgICc6aWFtOjphd3M6cG9saWN5L0FuQVdTTWFuYWdlZFBvbGljeScsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIE15Um9sZUY0OEZGRTA0OiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6SUFNOjpSb2xlJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBNYW5hZ2VkUG9saWN5QXJuczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgICAgICAgICAgICAgJzppYW06OmF3czpwb2xpY3kvQW5BV1NNYW5hZ2VkUG9saWN5JyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICAgICAgU3RhdGVtZW50OlxuICAgICAgICAgICAgICAgIFt7XG4gICAgICAgICAgICAgICAgICBBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgICAgICBQcmluY2lwYWw6IHsgU2VydmljZTogJ3Rlc3Quc2VydmljZScgfSxcbiAgICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgncG9saWN5IGZyb20gY3VzdG9tZXIgbWFuYWdlZCBwb2xpY3kgbG9va3VwIGNhbiBiZSBhdHRhY2hlZCB0byB1c2VycywgZ3JvdXBzIG9yIHJvbGUgdmlhIG1ldGhvZHMnLCAoKSA9PiB7XG4gICAgY29uc3QgcG9saWN5ID0gTWFuYWdlZFBvbGljeS5mcm9tTWFuYWdlZFBvbGljeU5hbWUoc3RhY2ssICdNeU1hbmFnZWRQb2xpY3knLCAnQUN1c3RvbWVyTWFuYWdlZFBvbGljeU5hbWUnKTtcbiAgICBjb25zdCB1c2VyID0gbmV3IFVzZXIoc3RhY2ssICdNeVVzZXInKTtcbiAgICBjb25zdCBncm91cCA9IG5ldyBHcm91cChzdGFjaywgJ015R3JvdXAnKTtcbiAgICBjb25zdCByb2xlID0gbmV3IFJvbGUoc3RhY2ssICdNeVJvbGUnLCB7IGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ3Rlc3Quc2VydmljZScpIH0pO1xuXG4gICAgdXNlci5hZGRNYW5hZ2VkUG9saWN5KHBvbGljeSk7XG4gICAgZ3JvdXAuYWRkTWFuYWdlZFBvbGljeShwb2xpY3kpO1xuICAgIHJvbGUuYWRkTWFuYWdlZFBvbGljeShwb2xpY3kpO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIE15VXNlckRDNDUwMjhCOiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6SUFNOjpVc2VyJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBNYW5hZ2VkUG9saWN5QXJuczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgICAgICAgICAgICAgJzppYW06OjEyMzQ6cG9saWN5L0FDdXN0b21lck1hbmFnZWRQb2xpY3lOYW1lJyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgTXlHcm91cENCQTU0QjFCOiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6SUFNOjpHcm91cCcsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgTWFuYWdlZFBvbGljeUFybnM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICAgICAgICAgICAgICc6aWFtOjoxMjM0OnBvbGljeS9BQ3VzdG9tZXJNYW5hZ2VkUG9saWN5TmFtZScsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIE15Um9sZUY0OEZGRTA0OiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6SUFNOjpSb2xlJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBNYW5hZ2VkUG9saWN5QXJuczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgICAgICAgICAgICAgJzppYW06OjEyMzQ6cG9saWN5L0FDdXN0b21lck1hbmFnZWRQb2xpY3lOYW1lJyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICAgICAgU3RhdGVtZW50OlxuICAgICAgICAgICAgICAgIFt7XG4gICAgICAgICAgICAgICAgICBBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgICAgICBQcmluY2lwYWw6IHsgU2VydmljZTogJ3Rlc3Quc2VydmljZScgfSxcbiAgICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZmFpbHMgaWYgcG9saWN5IGRvY3VtZW50IGlzIGVtcHR5JywgKCkgPT4ge1xuICAgIG5ldyBNYW5hZ2VkUG9saWN5KHN0YWNrLCAnTXlQb2xpY3knKTtcbiAgICBleHBlY3QoKCkgPT4gYXBwLnN5bnRoKCkpXG4gICAgICAudG9UaHJvdygvTWFuYWdlZCBQb2xpY3kgaXMgZW1wdHkuIFlvdSBtdXN0IGFkZCBzdGF0ZW1lbnRzIHRvIHRoZSBwb2xpY3kvKTtcbiAgfSk7XG5cbiAgdGVzdCgnbWFuYWdlZCBwb2xpY3kgbmFtZSBpcyBjb3JyZWN0bHkgY2FsY3VsYXRlZCcsICgpID0+IHtcbiAgICBjb25zdCBtcCA9IG5ldyBNYW5hZ2VkUG9saWN5KHN0YWNrLCAnUG9saWN5Jyk7XG4gICAgbXAuYWRkU3RhdGVtZW50cyhuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGFjdGlvbnM6IFsnYTphYmMnXSxcbiAgICB9KSk7XG5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShtcC5tYW5hZ2VkUG9saWN5TmFtZSkpLnRvRXF1YWwoe1xuICAgICAgJ0ZuOjpTZWxlY3QnOiBbMSxcbiAgICAgICAge1xuICAgICAgICAgICdGbjo6U3BsaXQnOiBbJy8nLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OlNlbGVjdCc6IFs1LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdGbjo6U3BsaXQnOiBbJzonLFxuICAgICAgICAgICAgICAgICAgICB7IFJlZjogJ1BvbGljeTIzQjkxNTE4JyB9XSxcbiAgICAgICAgICAgICAgICB9XSxcbiAgICAgICAgICAgIH1dLFxuICAgICAgICB9XSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZmFpbHMgaWYgcG9saWN5IGRvY3VtZW50IGRvZXMgbm90IHNwZWNpZnkgcmVzb3VyY2VzJywgKCkgPT4ge1xuICAgIG5ldyBNYW5hZ2VkUG9saWN5KHN0YWNrLCAnTXlNYW5hZ2VkUG9saWN5Jywge1xuICAgICAgc3RhdGVtZW50czogW1xuICAgICAgICBuZXcgUG9saWN5U3RhdGVtZW50KHsgYWN0aW9uczogWycqJ10gfSksXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KCgpID0+IGFwcC5zeW50aCgpKS50b1Rocm93KC9BIFBvbGljeVN0YXRlbWVudCB1c2VkIGluIGFuIGlkZW50aXR5LWJhc2VkIHBvbGljeSBtdXN0IHNwZWNpZnkgYXQgbGVhc3Qgb25lIHJlc291cmNlLyk7XG4gIH0pO1xuXG5cbiAgdGVzdCgnZmFpbHMgaWYgcG9saWN5IGRvY3VtZW50IHNwZWNpZmllcyBwcmluY2lwYWxzJywgKCkgPT4ge1xuICAgIG5ldyBNYW5hZ2VkUG9saWN5KHN0YWNrLCAnTXlNYW5hZ2VkUG9saWN5Jywge1xuICAgICAgc3RhdGVtZW50czogW1xuICAgICAgICBuZXcgUG9saWN5U3RhdGVtZW50KHsgYWN0aW9uczogWycqJ10sIHJlc291cmNlczogWycqJ10sIHByaW5jaXBhbHM6IFtuZXcgU2VydmljZVByaW5jaXBhbCgndGVzdC5zZXJ2aWNlJyldIH0pLFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIGV4cGVjdCgoKSA9PiBhcHAuc3ludGgoKSkudG9UaHJvdygvQSBQb2xpY3lTdGF0ZW1lbnQgdXNlZCBpbiBhbiBpZGVudGl0eS1iYXNlZCBwb2xpY3kgY2Fubm90IHNwZWNpZnkgYW55IElBTSBwcmluY2lwYWxzLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Nyb3NzLXN0YWNrIGhhcmQtbmFtZSBjb250YWlucyB0aGUgcmlnaHQgcmVzb3VyY2UgdHlwZScsICgpID0+IHtcbiAgICBjb25zdCBtcCA9IG5ldyBNYW5hZ2VkUG9saWN5KHN0YWNrLCAnUG9saWN5Jywge1xuICAgICAgbWFuYWdlZFBvbGljeU5hbWU6IGNkay5QaHlzaWNhbE5hbWUuR0VORVJBVEVfSUZfTkVFREVELFxuICAgIH0pO1xuICAgIG1wLmFkZFN0YXRlbWVudHMobmV3IFBvbGljeVN0YXRlbWVudCh7XG4gICAgICBhY3Rpb25zOiBbJ2E6YWJjJ10sXG4gICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgIH0pKTtcblxuICAgIGNvbnN0IHN0YWNrMiA9IG5ldyBjZGsuU3RhY2soYXBwLCAnU3RhY2syJywgeyBlbnY6IHsgYWNjb3VudDogJzU2NzgnLCByZWdpb246ICd1cy1lYXN0LTEnIH0gfSk7XG4gICAgbmV3IGNkay5DZm5PdXRwdXQoc3RhY2syLCAnT3V0cHV0Jywge1xuICAgICAgdmFsdWU6IG1wLm1hbmFnZWRQb2xpY3lBcm4sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2syKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgT3V0cHV0czoge1xuICAgICAgICBPdXRwdXQ6IHtcbiAgICAgICAgICBWYWx1ZToge1xuICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnOmlhbTo6MTIzNDpwb2xpY3kvbXlzdGFja215c3RhY2twb2xpY3kxNzM5NWUyMjFiMWI2ZGVhZjg3NScsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdQb2xpY2llcyBjYW4gYmUgZ3JhbnRlZCBwcmluY2lwYWwgcGVybWlzc2lvbnMnLCAoKSA9PiB7XG4gICAgY29uc3QgbXAgPSBuZXcgTWFuYWdlZFBvbGljeShzdGFjaywgJ1BvbGljeScsIHtcbiAgICAgIG1hbmFnZWRQb2xpY3lOYW1lOiAnTXlNYW5hZ2VkUG9saWN5TmFtZScsXG4gICAgfSk7XG4gICAgR3JhbnQuYWRkVG9QcmluY2lwYWwoeyBhY3Rpb25zOiBbJ2R1bW15OkFjdGlvbiddLCBncmFudGVlOiBtcCwgcmVzb3VyY2VBcm5zOiBbJyonXSB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6TWFuYWdlZFBvbGljeScsIHtcbiAgICAgIE1hbmFnZWRQb2xpY3lOYW1lOiAnTXlNYW5hZ2VkUG9saWN5TmFtZScsXG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7IEFjdGlvbjogJ2R1bW15OkFjdGlvbicsIEVmZmVjdDogJ0FsbG93JywgUmVzb3VyY2U6ICcqJyB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgICAgUGF0aDogJy8nLFxuICAgICAgRGVzY3JpcHRpb246ICcnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdhZGRQcmluY2lwYWxPclJlc291cmNlKCkgY29ycmVjdGx5IGdyYW50cyBQb2xpY2llcyBwZXJtaXNzaW9ucycsICgpID0+IHtcbiAgICBjb25zdCBtcCA9IG5ldyBNYW5hZ2VkUG9saWN5KHN0YWNrLCAnUG9saWN5Jywge1xuICAgICAgbWFuYWdlZFBvbGljeU5hbWU6ICdNeU1hbmFnZWRQb2xpY3lOYW1lJyxcbiAgICB9KTtcblxuICAgIGNsYXNzIER1bW15UmVzb3VyY2UgZXh0ZW5kcyBjZGsuUmVzb3VyY2UgaW1wbGVtZW50cyBJUmVzb3VyY2VXaXRoUG9saWN5IHtcbiAgICAgIGFkZFRvUmVzb3VyY2VQb2xpY3koX3N0YXRlbWVudDogUG9saWN5U3RhdGVtZW50KTogQWRkVG9QcmluY2lwYWxQb2xpY3lSZXN1bHQge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3Nob3VsZCBub3QgYmUgY2FsbGVkLicpO1xuICAgICAgfVxuICAgIH07XG4gICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgRHVtbXlSZXNvdXJjZShzdGFjaywgJ0R1bW15Jyk7XG4gICAgR3JhbnQuYWRkVG9QcmluY2lwYWxPclJlc291cmNlKHsgYWN0aW9uczogWydkdW1teTpBY3Rpb24nXSwgZ3JhbnRlZTogbXAsIHJlc291cmNlQXJuczogWycqJ10sIHJlc291cmNlIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpNYW5hZ2VkUG9saWN5Jywge1xuICAgICAgTWFuYWdlZFBvbGljeU5hbWU6ICdNeU1hbmFnZWRQb2xpY3lOYW1lJyxcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHsgQWN0aW9uOiAnZHVtbXk6QWN0aW9uJywgRWZmZWN0OiAnQWxsb3cnLCBSZXNvdXJjZTogJyonIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgICBQYXRoOiAnLycsXG4gICAgICBEZXNjcmlwdGlvbjogJycsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ1BvbGljaWVzIGNhbm5vdCBiZSBncmFudGVkIHByaW5jaXBhbCBwZXJtaXNzaW9ucyBhY3Jvc3MgYWNjb3VudHMnLCAoKSA9PiB7XG4gICAgY29uc3QgbXAgPSBuZXcgTWFuYWdlZFBvbGljeShzdGFjaywgJ1BvbGljeScsIHtcbiAgICAgIG1hbmFnZWRQb2xpY3lOYW1lOiAnTXlNYW5hZ2VkUG9saWN5TmFtZScsXG4gICAgfSk7XG5cbiAgICBjbGFzcyBEdW1teVJlc291cmNlIGV4dGVuZHMgY2RrLlJlc291cmNlIGltcGxlbWVudHMgSVJlc291cmNlV2l0aFBvbGljeSB7XG4gICAgICBhZGRUb1Jlc291cmNlUG9saWN5KF9zdGF0ZW1lbnQ6IFBvbGljeVN0YXRlbWVudCk6IEFkZFRvUHJpbmNpcGFsUG9saWN5UmVzdWx0IHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdzaG91bGQgbm90IGJlIGNhbGxlZC4nKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGNvbnN0IHJlc291cmNlID0gbmV3IER1bW15UmVzb3VyY2Uoc3RhY2ssICdEdW1teScsIHsgYWNjb3VudDogJzU2NzgnIH0pO1xuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIEdyYW50LmFkZFRvUHJpbmNpcGFsT3JSZXNvdXJjZSh7IGFjdGlvbnM6IFsnZHVtbXk6QWN0aW9uJ10sIGdyYW50ZWU6IG1wLCByZXNvdXJjZUFybnM6IFsnKiddLCByZXNvdXJjZSB9KTtcbiAgICB9KS50b1Rocm93KC9DYW5ub3QgdXNlIGEgTWFuYWdlZFBvbGljeSAnTXlTdGFja1xcL1BvbGljeScvKTtcbiAgfSk7XG5cbiAgdGVzdCgnUG9saWNpZXMgY2Fubm90IGJlIGdyYW50ZWQgcmVzb3VyY2UgcGVybWlzc2lvbnMnLCAoKSA9PiB7XG4gICAgY29uc3QgbXAgPSBuZXcgTWFuYWdlZFBvbGljeShzdGFjaywgJ1BvbGljeScsIHtcbiAgICAgIG1hbmFnZWRQb2xpY3lOYW1lOiAnTXlNYW5hZ2VkUG9saWN5TmFtZScsXG4gICAgfSk7XG5cbiAgICBjbGFzcyBEdW1teVJlc291cmNlIGV4dGVuZHMgY2RrLlJlc291cmNlIGltcGxlbWVudHMgSVJlc291cmNlV2l0aFBvbGljeSB7XG4gICAgICBhZGRUb1Jlc291cmNlUG9saWN5KF9zdGF0ZW1lbnQ6IFBvbGljeVN0YXRlbWVudCk6IEFkZFRvUHJpbmNpcGFsUG9saWN5UmVzdWx0IHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdzaG91bGQgbm90IGJlIGNhbGxlZC4nKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGNvbnN0IHJlc291cmNlID0gbmV3IER1bW15UmVzb3VyY2Uoc3RhY2ssICdEdW1teScpO1xuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIEdyYW50LmFkZFRvUHJpbmNpcGFsQW5kUmVzb3VyY2UoeyBhY3Rpb25zOiBbJ2R1bW15OkFjdGlvbiddLCBncmFudGVlOiBtcCwgcmVzb3VyY2VBcm5zOiBbJyonXSwgcmVzb3VyY2UgfSk7XG4gICAgfSkudG9UaHJvdygvQ2Fubm90IHVzZSBhIE1hbmFnZWRQb2xpY3kgJ015U3RhY2tcXC9Qb2xpY3knLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3ByZXZlbnQgY3JlYXRpb24gd2hlbiBjdXN0b21pemVSb2xlcyBpcyBjb25maWd1cmVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgb3RoZXJTdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBSb2xlLmN1c3RvbWl6ZVJvbGVzKG90aGVyU3RhY2spO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBNYW5hZ2VkUG9saWN5KG90aGVyU3RhY2ssICdDdXN0b21Qb2xpY3knLCB7XG4gICAgICBzdGF0ZW1lbnRzOiBbbmV3IFBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgIGVmZmVjdDogRWZmZWN0LkFMTE9XLFxuICAgICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgICAgICBhY3Rpb25zOiBbJyonXSxcbiAgICAgIH0pXSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2sob3RoZXJTdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OklBTTo6TWFuYWdlZFBvbGljeScsIDApO1xuICB9KTtcblxuICB0ZXN0KCdkbyBub3QgcHJldmVudCBjcmVhdGlvbiB3aGVuIGN1c3RvbWl6ZVJvbGVzLnByZXZlbnRTeW50aGVzaXM9ZmFsc2UnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBvdGhlclN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIFJvbGUuY3VzdG9taXplUm9sZXMob3RoZXJTdGFjaywge1xuICAgICAgcHJldmVudFN5bnRoZXNpczogZmFsc2UsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IE1hbmFnZWRQb2xpY3kob3RoZXJTdGFjaywgJ0N1c3RvbVBvbGljeScsIHtcbiAgICAgIHN0YXRlbWVudHM6IFtuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgZWZmZWN0OiBFZmZlY3QuQUxMT1csXG4gICAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgICAgIGFjdGlvbnM6IFsnKiddLFxuICAgICAgfSldLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhvdGhlclN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6SUFNOjpNYW5hZ2VkUG9saWN5JywgMSk7XG4gIH0pO1xufSk7XG5cbnRlc3QoJ0FSTiBmb3IgdHdvIGluc3RhbmNlcyBvZiB0aGUgc2FtZSBBV1MgTWFuYWdlZCBQb2xpY3kgaXMgdGhlIHNhbWUnLCAoKSA9PiB7XG4gIGNvbnN0IG1wMSA9IE1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdmb28vYmFyJyk7XG4gIGNvbnN0IG1wMiA9IE1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdmb28vYmFyJyk7XG5cbiAgZXhwZWN0KG1wMS5tYW5hZ2VkUG9saWN5QXJuKS50b0VxdWFsKG1wMi5tYW5hZ2VkUG9saWN5QXJuKTtcbn0pO1xuIl19