"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const core_1 = require("@aws-cdk/core");
const constructs_1 = require("constructs");
const lib_1 = require("../lib");
describe('isRole() returns', () => {
    test('true if given Role instance', () => {
        // GIVEN
        const app = new core_1.App();
        const stack = new core_1.Stack(app, 'MyStack');
        // WHEN
        const pureRole = new lib_1.Role(stack, 'Role', {
            assumedBy: new lib_1.ServicePrincipal('sns.amazonaws.com'),
        });
        // THEN
        expect(lib_1.Role.isRole(pureRole)).toBe(true);
    });
    test('false if given imported role instance', () => {
        // GIVEN
        const app = new core_1.App();
        const stack = new core_1.Stack(app, 'MyStack');
        // WHEN
        const importedRole = lib_1.Role.fromRoleName(stack, 'ImportedRole', 'ImportedRole');
        // THEN
        expect(lib_1.Role.isRole(importedRole)).toBe(false);
    });
    test('false if given undefined', () => {
        // THEN
        expect(lib_1.Role.isRole(undefined)).toBe(false);
    });
});
describe('customizeRoles', () => {
    test('throws if precreatedRoles is not used', () => {
        // GIVEN
        const app = new core_1.App();
        lib_1.Role.customizeRoles(app);
        const stack = new core_1.Stack(app, 'MyStack');
        // WHEN
        new lib_1.Role(stack, 'Role', {
            assumedBy: new lib_1.ServicePrincipal('sns.amazonaws.com'),
        });
        // THEN
        assertions_1.Annotations.fromStack(stack).hasError('/MyStack/Role', assertions_1.Match.stringLikeRegexp('IAM Role is being created at path "MyStack/Role"'));
    });
    test('throws if precreatedRoles has a token', () => {
        // GIVEN
        const app = new core_1.App();
        lib_1.Role.customizeRoles(app, {
            usePrecreatedRoles: {
                'MyStack/Role': core_1.Lazy.string({ produce: () => 'RoleName' }),
            },
        });
        const stack = new core_1.Stack(app, 'MyStack');
        // WHEN
        new lib_1.Role(stack, 'Role', {
            assumedBy: new lib_1.ServicePrincipal('sns.amazonaws.com'),
        });
        // THEN
        assertions_1.Annotations.fromStack(stack).hasError('/MyStack/Role', assertions_1.Match.stringLikeRegexp('Cannot resolve precreated role name at path "MyStack/Role"'));
    });
    test('does not throw if preventSynthesis=false', () => {
        // GIVEN
        const app = new core_1.App();
        lib_1.Role.customizeRoles(app, {
            preventSynthesis: false,
        });
        const stack = new core_1.Stack(app, 'MyStack');
        // WHEN
        new lib_1.Role(stack, 'Role', {
            assumedBy: new lib_1.ServicePrincipal('sns.amazonaws.com'),
        });
        // THEN
        // no annotations
        const annotations = assertions_1.Annotations.fromStack(stack);
        annotations.hasNoError('MyStack/Role', assertions_1.Match.stringLikeRegexp('*'));
        // and resource is still synthesized
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 1);
    });
    test('works at the app scope', () => {
        // GIVEN
        const app = new core_1.App();
        lib_1.Role.customizeRoles(app, {
            usePrecreatedRoles: {
                'MyStack/Role': 'SomeRoleName',
            },
        });
        const stack = new core_1.Stack(app, 'MyStack');
        // WHEN
        const role = new lib_1.Role(stack, 'Role', {
            assumedBy: new lib_1.ServicePrincipal('sns.amazonaws.com'),
        });
        new core_1.CfnResource(stack, 'MyResource', {
            type: 'AWS::Custom',
            properties: {
                Role: role.roleName,
            },
        });
        // THEN
        const template = assertions_1.Template.fromStack(stack);
        template.resourceCountIs('AWS::IAM::Role', 0);
        template.hasResourceProperties('AWS::Custom', {
            Role: 'SomeRoleName',
        });
    });
    test('works at a relative scope', () => {
        // GIVEN
        const app = new core_1.App();
        const stack = new core_1.Stack(app, 'MyStack');
        const subScope = new constructs_1.Construct(stack, 'SomeConstruct');
        lib_1.Role.customizeRoles(subScope, {
            usePrecreatedRoles: {
                Role: 'SomeRoleName',
            },
        });
        // WHEN
        const role = new lib_1.Role(subScope, 'Role', {
            assumedBy: new lib_1.ServicePrincipal('sns.amazonaws.com'),
        });
        new core_1.CfnResource(subScope, 'MyResource', {
            type: 'AWS::Custom',
            properties: {
                Role: role.roleName,
            },
        });
        // THEN
        const template = assertions_1.Template.fromStack(stack);
        template.resourceCountIs('AWS::IAM::Role', 0);
        template.hasResourceProperties('AWS::Custom', {
            Role: 'SomeRoleName',
        });
    });
    test('works at an absolute scope', () => {
        // GIVEN
        const app = new core_1.App();
        const stack = new core_1.Stack(app, 'MyStack');
        const subScope = new constructs_1.Construct(stack, 'SomeConstruct');
        lib_1.Role.customizeRoles(subScope, {
            usePrecreatedRoles: {
                'MyStack/SomeConstruct/Role': 'SomeRoleName',
            },
        });
        // WHEN
        const role = new lib_1.Role(subScope, 'Role', {
            assumedBy: new lib_1.ServicePrincipal('sns.amazonaws.com'),
        });
        new core_1.CfnResource(subScope, 'MyResource', {
            type: 'AWS::Custom',
            properties: {
                Role: role.roleName,
            },
        });
        // THEN
        const template = assertions_1.Template.fromStack(stack);
        template.resourceCountIs('AWS::IAM::Role', 0);
        template.hasResourceProperties('AWS::Custom', {
            Role: 'SomeRoleName',
        });
    });
    test('does not create policies', () => {
        // GIVEN
        const app = new core_1.App();
        lib_1.Role.customizeRoles(app, {
            usePrecreatedRoles: {
                'MyStack/Role': 'SomeRoleName',
            },
        });
        const stack = new core_1.Stack(app, 'MyStack');
        // WHEN
        const role = new lib_1.Role(stack, 'Role', {
            assumedBy: new lib_1.ServicePrincipal('sns.amazonaws.com'),
        });
        const importedRole = lib_1.Role.fromRoleName(stack, 'ImportedRole', 'ImportedRole');
        importedRole.grant(role, 'sts:AssumeRole');
        role.addToPolicy(new lib_1.PolicyStatement({
            effect: lib_1.Effect.ALLOW,
            actions: ['*'],
            resources: ['*'],
        }));
        const template = assertions_1.Template.fromStack(stack);
        template.resourceCountIs('AWS::IAM::Policy', 0);
    });
    test('can use all role properties', () => {
        // GIVEN
        const app = new core_1.App();
        lib_1.Role.customizeRoles(app, {
            usePrecreatedRoles: {
                'MyStack/Role': 'SomeRoleName',
            },
        });
        const stack = new core_1.Stack(app, 'MyStack');
        // WHEN
        const role = new lib_1.Role(stack, 'Role', {
            assumedBy: new lib_1.ServicePrincipal('sns.amazonaws.com'),
        });
        const principal = lib_1.Role.fromRoleName(stack, 'OtherRole', 'OtherRole');
        role.grant(principal, 'sts:AssumeRole');
        role.grantPassRole(principal);
        role.grantAssumeRole(principal);
        role.addManagedPolicy(lib_1.ManagedPolicy.fromAwsManagedPolicyName('ReadOnlyAccess'));
        role.addManagedPolicy(new lib_1.ManagedPolicy(stack, 'MyPolicy', {
            statements: [new lib_1.PolicyStatement({
                    effect: lib_1.Effect.ALLOW,
                    actions: ['sns:Publish'],
                    resources: ['*'],
                })],
        }));
        role.withoutPolicyUpdates();
        new core_1.CfnResource(stack, 'MyResource', {
            type: 'AWS::Custom',
            properties: {
                RoleName: role.roleName,
                RoleArn: role.roleName,
                PolicyFragment: role.policyFragment,
                AssumeRoleAction: role.assumeRoleAction,
                PrincipalAccount: role.principalAccount,
                AssumeRolePolicy: role.assumeRolePolicy,
                PermissionsBoundary: role.permissionsBoundary,
            },
        });
        // THEN
        expect(() => {
            role.applyRemovalPolicy(core_1.RemovalPolicy.DESTROY);
        }).toThrow(/Cannot apply RemovalPolicy/);
        expect(() => {
            new core_1.CfnResource(stack, 'MyResource2', {
                type: 'AWS::Custom',
                properties: {
                    RoleId: role.roleId,
                },
            });
        }).toThrow(/"roleId" is not available on precreated roles/);
        const template = assertions_1.Template.fromStack(stack);
        template.resourceCountIs('AWS::IAM::Role', 0);
        template.resourceCountIs('AWS::IAM::Policy', 0);
        template.resourceCountIs('AWS::IAM::ManagedPolicy', 0);
        template.hasResourceProperties('AWS::Custom', {
            RoleName: 'SomeRoleName',
            RoleArn: 'SomeRoleName',
            PolicyFragment: {
                principalJson: {
                    AWS: [
                        {
                            'Fn::Join': [
                                '',
                                [
                                    'arn:',
                                    {
                                        Ref: 'AWS::Partition',
                                    },
                                    ':iam::',
                                    {
                                        Ref: 'AWS::AccountId',
                                    },
                                    ':role/SomeRoleName',
                                ],
                            ],
                        },
                    ],
                },
                conditions: {},
            },
            AssumeRoleAction: 'sts:AssumeRole',
            PrincipalAccount: {
                Ref: 'AWS::AccountId',
            },
            AssumeRolePolicy: {
                Statement: [
                    {
                        Action: 'sts:AssumeRole',
                        Effect: 'Allow',
                        Principal: {
                            Service: 'sns.amazonaws.com',
                        },
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
});
describe('IAM role', () => {
    test('default role', () => {
        const stack = new core_1.Stack();
        new lib_1.Role(stack, 'MyRole', {
            assumedBy: new lib_1.ServicePrincipal('sns.amazonaws.com'),
        });
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                MyRoleF48FFE04: {
                    Type: 'AWS::IAM::Role',
                    Properties: {
                        AssumeRolePolicyDocument: {
                            Statement: [{
                                    Action: 'sts:AssumeRole',
                                    Effect: 'Allow',
                                    Principal: { Service: 'sns.amazonaws.com' },
                                }],
                            Version: '2012-10-17',
                        },
                    },
                },
            },
        });
    });
    test('a role can grant PassRole permissions', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const role = new lib_1.Role(stack, 'Role', { assumedBy: new lib_1.ServicePrincipal('henk.amazonaws.com') });
        const user = new lib_1.User(stack, 'User');
        // WHEN
        role.grantPassRole(user);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: 'iam:PassRole',
                        Effect: 'Allow',
                        Resource: { 'Fn::GetAtt': ['Role1ABCC5F0', 'Arn'] },
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
    test('a role can grant AssumeRole permissions', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const role = new lib_1.Role(stack, 'Role', { assumedBy: new lib_1.ServicePrincipal('henk.amazonaws.com') });
        const user = new lib_1.User(stack, 'User');
        // WHEN
        role.grantAssumeRole(user);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: 'sts:AssumeRole',
                        Effect: 'Allow',
                        Resource: { 'Fn::GetAtt': ['Role1ABCC5F0', 'Arn'] },
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
    cdk_build_tools_1.testDeprecated('can supply externalId', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.Role(stack, 'MyRole', {
            assumedBy: new lib_1.ServicePrincipal('sns.amazonaws.com'),
            externalId: 'SomeSecret',
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            AssumeRolePolicyDocument: {
                Statement: [
                    {
                        Action: 'sts:AssumeRole',
                        Condition: {
                            StringEquals: { 'sts:ExternalId': 'SomeSecret' },
                        },
                        Effect: 'Allow',
                        Principal: { Service: 'sns.amazonaws.com' },
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
    test('can supply single externalIds', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.Role(stack, 'MyRole', {
            assumedBy: new lib_1.ServicePrincipal('sns.amazonaws.com'),
            externalIds: ['SomeSecret'],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            AssumeRolePolicyDocument: {
                Statement: [
                    {
                        Action: 'sts:AssumeRole',
                        Condition: {
                            StringEquals: { 'sts:ExternalId': 'SomeSecret' },
                        },
                        Effect: 'Allow',
                        Principal: { Service: 'sns.amazonaws.com' },
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
    test('can supply multiple externalIds', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.Role(stack, 'MyRole', {
            assumedBy: new lib_1.ServicePrincipal('sns.amazonaws.com'),
            externalIds: ['SomeSecret', 'AnotherSecret'],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            AssumeRolePolicyDocument: {
                Statement: [
                    {
                        Action: 'sts:AssumeRole',
                        Condition: {
                            StringEquals: { 'sts:ExternalId': ['SomeSecret', 'AnotherSecret'] },
                        },
                        Effect: 'Allow',
                        Principal: { Service: 'sns.amazonaws.com' },
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
    test('policy is created automatically when permissions are added', () => {
        // by default we don't expect a role policy
        const before = new core_1.Stack();
        new lib_1.Role(before, 'MyRole', { assumedBy: new lib_1.ServicePrincipal('sns.amazonaws.com') });
        assertions_1.Template.fromStack(before).resourceCountIs('AWS::IAM::Policy', 0);
        // add a policy to the role
        const after = new core_1.Stack();
        const afterRole = new lib_1.Role(after, 'MyRole', { assumedBy: new lib_1.ServicePrincipal('sns.amazonaws.com') });
        afterRole.addToPolicy(new lib_1.PolicyStatement({ resources: ['myresource'], actions: ['service:myaction'] }));
        assertions_1.Template.fromStack(after).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: 'service:myaction',
                        Effect: 'Allow',
                        Resource: 'myresource',
                    },
                ],
                Version: '2012-10-17',
            },
            PolicyName: 'MyRoleDefaultPolicyA36BE1DD',
            Roles: [
                {
                    Ref: 'MyRoleF48FFE04',
                },
            ],
        });
    });
    test('managed policy arns can be supplied upon initialization and also added later', () => {
        const stack = new core_1.Stack();
        const role = new lib_1.Role(stack, 'MyRole', {
            assumedBy: new lib_1.ServicePrincipal('test.service'),
            managedPolicies: [{ managedPolicyArn: 'managed1' }, { managedPolicyArn: 'managed2' }],
        });
        role.addManagedPolicy({ managedPolicyArn: 'managed3' });
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
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
                        ManagedPolicyArns: ['managed1', 'managed2', 'managed3'],
                    },
                },
            },
        });
    });
    test('federated principal can change AssumeRoleAction', () => {
        const stack = new core_1.Stack();
        const cognitoPrincipal = new lib_1.FederatedPrincipal('foo', { StringEquals: { key: 'value' } }, 'sts:AssumeSomething');
        new lib_1.Role(stack, 'MyRole', { assumedBy: cognitoPrincipal });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            AssumeRolePolicyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Principal: { Federated: 'foo' },
                        Condition: {
                            StringEquals: { key: 'value' },
                        },
                        Action: 'sts:AssumeSomething',
                        Effect: 'Allow',
                    },
                ],
            },
        });
    });
    test('role path can be used to specify the path', () => {
        const stack = new core_1.Stack();
        new lib_1.Role(stack, 'MyRole', { path: '/', assumedBy: new lib_1.ServicePrincipal('sns.amazonaws.com') });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            Path: '/',
        });
    });
    test('role path can be 1 character', () => {
        const stack = new core_1.Stack();
        const assumedBy = new lib_1.ServicePrincipal('bla');
        expect(() => new lib_1.Role(stack, 'MyRole', { assumedBy, path: '/' })).not.toThrowError();
    });
    test('role path cannot be empty', () => {
        const stack = new core_1.Stack();
        const assumedBy = new lib_1.ServicePrincipal('bla');
        expect(() => new lib_1.Role(stack, 'MyRole', { assumedBy, path: '' }))
            .toThrow('Role path must be between 1 and 512 characters. The provided role path is 0 characters.');
    });
    test('role path must be less than or equal to 512', () => {
        const stack = new core_1.Stack();
        const assumedBy = new lib_1.ServicePrincipal('bla');
        expect(() => new lib_1.Role(stack, 'MyRole', { assumedBy, path: '/' + Array(512).join('a') + '/' }))
            .toThrow('Role path must be between 1 and 512 characters. The provided role path is 513 characters.');
    });
    test('role path must start with a forward slash', () => {
        const stack = new core_1.Stack();
        const assumedBy = new lib_1.ServicePrincipal('bla');
        const expected = (val) => 'Role path must be either a slash or valid characters (alphanumerics and symbols) surrounded by slashes. '
            + `Valid characters are unicode characters in [\\u0021-\\u007F]. However, ${val} is provided.`;
        expect(() => new lib_1.Role(stack, 'MyRole', { assumedBy, path: 'aaa' })).toThrow(expected('aaa'));
    });
    test('role path must end with a forward slash', () => {
        const stack = new core_1.Stack();
        const assumedBy = new lib_1.ServicePrincipal('bla');
        const expected = (val) => 'Role path must be either a slash or valid characters (alphanumerics and symbols) surrounded by slashes. '
            + `Valid characters are unicode characters in [\\u0021-\\u007F]. However, ${val} is provided.`;
        expect(() => new lib_1.Role(stack, 'MyRole', { assumedBy, path: '/a' })).toThrow(expected('/a'));
    });
    test('role path must contain unicode chars within [\\u0021-\\u007F]', () => {
        const stack = new core_1.Stack();
        const assumedBy = new lib_1.ServicePrincipal('bla');
        const expected = (val) => 'Role path must be either a slash or valid characters (alphanumerics and symbols) surrounded by slashes. '
            + `Valid characters are unicode characters in [\\u0021-\\u007F]. However, ${val} is provided.`;
        expect(() => new lib_1.Role(stack, 'MyRole', { assumedBy, path: '/\u0020\u0080/' })).toThrow(expected('/\u0020\u0080/'));
    });
    describe('maxSessionDuration', () => {
        test('is not specified by default', () => {
            const stack = new core_1.Stack();
            new lib_1.Role(stack, 'MyRole', { assumedBy: new lib_1.ServicePrincipal('sns.amazonaws.com') });
            assertions_1.Template.fromStack(stack).templateMatches({
                Resources: {
                    MyRoleF48FFE04: {
                        Type: 'AWS::IAM::Role',
                        Properties: {
                            AssumeRolePolicyDocument: {
                                Statement: [
                                    {
                                        Action: 'sts:AssumeRole',
                                        Effect: 'Allow',
                                        Principal: {
                                            Service: 'sns.amazonaws.com',
                                        },
                                    },
                                ],
                                Version: '2012-10-17',
                            },
                        },
                    },
                },
            });
        });
        test('can be used to specify the maximum session duration for assuming the role', () => {
            const stack = new core_1.Stack();
            new lib_1.Role(stack, 'MyRole', { maxSessionDuration: core_1.Duration.seconds(3700), assumedBy: new lib_1.ServicePrincipal('sns.amazonaws.com') });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
                MaxSessionDuration: 3700,
            });
        });
        test('must be between 3600 and 43200', () => {
            const stack = new core_1.Stack();
            const assumedBy = new lib_1.ServicePrincipal('bla');
            new lib_1.Role(stack, 'MyRole1', { assumedBy, maxSessionDuration: core_1.Duration.hours(1) });
            new lib_1.Role(stack, 'MyRole2', { assumedBy, maxSessionDuration: core_1.Duration.hours(12) });
            const expected = (val) => `maxSessionDuration is set to ${val}, but must be >= 3600sec (1hr) and <= 43200sec (12hrs)`;
            expect(() => new lib_1.Role(stack, 'MyRole3', { assumedBy, maxSessionDuration: core_1.Duration.minutes(1) }))
                .toThrow(expected(60));
            expect(() => new lib_1.Role(stack, 'MyRole4', { assumedBy, maxSessionDuration: core_1.Duration.seconds(3599) }))
                .toThrow(expected(3599));
            expect(() => new lib_1.Role(stack, 'MyRole5', { assumedBy, maxSessionDuration: core_1.Duration.seconds(43201) }))
                .toThrow(expected(43201));
        });
    });
    test('allow role with multiple principals', () => {
        const stack = new core_1.Stack();
        new lib_1.Role(stack, 'MyRole', {
            assumedBy: new lib_1.CompositePrincipal(new lib_1.ServicePrincipal('boom.amazonaws.test'), new lib_1.ArnPrincipal('1111111')),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            AssumeRolePolicyDocument: {
                Statement: [
                    {
                        Action: 'sts:AssumeRole',
                        Effect: 'Allow',
                        Principal: {
                            Service: 'boom.amazonaws.test',
                        },
                    },
                    {
                        Action: 'sts:AssumeRole',
                        Effect: 'Allow',
                        Principal: {
                            AWS: '1111111',
                        },
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
    test('can supply permissions boundary managed policy', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const permissionsBoundary = lib_1.ManagedPolicy.fromAwsManagedPolicyName('managed-policy');
        new lib_1.Role(stack, 'MyRole', {
            assumedBy: new lib_1.ServicePrincipal('sns.amazonaws.com'),
            permissionsBoundary,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            PermissionsBoundary: {
                'Fn::Join': [
                    '',
                    [
                        'arn:',
                        {
                            Ref: 'AWS::Partition',
                        },
                        ':iam::aws:policy/managed-policy',
                    ],
                ],
            },
        });
    });
    test('Principal-* in an AssumeRolePolicyDocument gets translated to { "AWS": "*" }', () => {
        // The docs say that "Principal: *" and "Principal: { AWS: * }" are equivalent
        // (https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_principal.html)
        // but in practice CreateRole errors out if you use "Principal: *" in an AssumeRolePolicyDocument:
        // An error occurred (MalformedPolicyDocument) when calling the CreateRole operation: AssumeRolepolicy contained an invalid principal: "STAR":"*".
        // Make sure that we handle this case specially.
        const stack = new core_1.Stack();
        new lib_1.Role(stack, 'Role', {
            assumedBy: new lib_1.AnyPrincipal(),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            AssumeRolePolicyDocument: {
                Statement: [
                    {
                        Action: 'sts:AssumeRole',
                        Effect: 'Allow',
                        Principal: { AWS: '*' },
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
    test('can have a description', () => {
        const stack = new core_1.Stack();
        new lib_1.Role(stack, 'MyRole', {
            assumedBy: new lib_1.ServicePrincipal('sns.amazonaws.com'),
            description: 'This is a role description.',
        });
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                MyRoleF48FFE04: {
                    Type: 'AWS::IAM::Role',
                    Properties: {
                        AssumeRolePolicyDocument: {
                            Statement: [{
                                    Action: 'sts:AssumeRole',
                                    Effect: 'Allow',
                                    Principal: { Service: 'sns.amazonaws.com' },
                                }],
                            Version: '2012-10-17',
                        },
                        Description: 'This is a role description.',
                    },
                },
            },
        });
    });
    test('should not have an empty description', () => {
        const stack = new core_1.Stack();
        new lib_1.Role(stack, 'MyRole', {
            assumedBy: new lib_1.ServicePrincipal('sns.amazonaws.com'),
            description: '',
        });
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                MyRoleF48FFE04: {
                    Type: 'AWS::IAM::Role',
                    Properties: {
                        AssumeRolePolicyDocument: {
                            Statement: [{
                                    Action: 'sts:AssumeRole',
                                    Effect: 'Allow',
                                    Principal: { Service: 'sns.amazonaws.com' },
                                }],
                            Version: '2012-10-17',
                        },
                    },
                },
            },
        });
    });
    test('description can only be 1000 characters long', () => {
        const stack = new core_1.Stack();
        expect(() => {
            new lib_1.Role(stack, 'MyRole', {
                assumedBy: new lib_1.ServicePrincipal('sns.amazonaws.com'),
                description: '1000+ character long description: Lorem ipsum dolor sit amet, consectetuer adipiscing elit. \
        Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, \
        nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat \
        massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, \
        imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. \
        Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, \
        eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus \
        varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. \
        Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing \
        sem neque sed ipsum.',
            });
        }).toThrow(/Role description must be no longer than 1000 characters./);
    });
    test('fails if managed policy is invalid', () => {
        const app = new core_1.App();
        const stack = new core_1.Stack(app, 'my-stack');
        new lib_1.Role(stack, 'MyRole', {
            assumedBy: new lib_1.ServicePrincipal('sns.amazonaws.com'),
            managedPolicies: [new lib_1.ManagedPolicy(stack, 'MyManagedPolicy', {
                    statements: [new lib_1.PolicyStatement({
                            resources: ['*'],
                            actions: ['*'],
                            principals: [new lib_1.ServicePrincipal('sns.amazonaws.com')],
                        })],
                })],
        });
        expect(() => app.synth()).toThrow(/A PolicyStatement used in an identity-based policy cannot specify any IAM principals/);
    });
    test('fails if default role policy is invalid', () => {
        const app = new core_1.App();
        const stack = new core_1.Stack(app, 'my-stack');
        const role = new lib_1.Role(stack, 'MyRole', {
            assumedBy: new lib_1.ServicePrincipal('sns.amazonaws.com'),
        });
        role.addToPrincipalPolicy(new lib_1.PolicyStatement({
            resources: ['*'],
            actions: ['*'],
            principals: [new lib_1.ServicePrincipal('sns.amazonaws.com')],
        }));
        expect(() => app.synth()).toThrow(/A PolicyStatement used in an identity-based policy cannot specify any IAM principals/);
    });
    test('fails if inline policy from props is invalid', () => {
        const app = new core_1.App();
        const stack = new core_1.Stack(app, 'my-stack');
        new lib_1.Role(stack, 'MyRole', {
            assumedBy: new lib_1.ServicePrincipal('sns.amazonaws.com'),
            inlinePolicies: {
                testPolicy: new lib_1.PolicyDocument({
                    statements: [new lib_1.PolicyStatement({
                            resources: ['*'],
                            actions: ['*'],
                            principals: [new lib_1.ServicePrincipal('sns.amazonaws.com')],
                        })],
                }),
            },
        });
        expect(() => app.synth()).toThrow(/A PolicyStatement used in an identity-based policy cannot specify any IAM principals/);
    });
    test('fails if attached inline policy is invalid', () => {
        const app = new core_1.App();
        const stack = new core_1.Stack(app, 'my-stack');
        const role = new lib_1.Role(stack, 'MyRole', {
            assumedBy: new lib_1.ServicePrincipal('sns.amazonaws.com'),
        });
        role.attachInlinePolicy(new lib_1.Policy(stack, 'MyPolicy', {
            statements: [new lib_1.PolicyStatement({
                    resources: ['*'],
                    actions: ['*'],
                    principals: [new lib_1.ServicePrincipal('sns.amazonaws.com')],
                })],
        }));
        expect(() => app.synth()).toThrow(/A PolicyStatement used in an identity-based policy cannot specify any IAM principals/);
    });
    test('fails if assumeRolePolicy is invalid', () => {
        const app = new core_1.App();
        const stack = new core_1.Stack(app, 'my-stack');
        const role = new lib_1.Role(stack, 'MyRole', {
            assumedBy: new lib_1.ServicePrincipal('sns.amazonaws.com'),
            managedPolicies: [new lib_1.ManagedPolicy(stack, 'MyManagedPolicy')],
        });
        role.assumeRolePolicy?.addStatements(new lib_1.PolicyStatement({ actions: ['*'] }));
        expect(() => app.synth()).toThrow(/A PolicyStatement used in a resource-based policy must specify at least one IAM principal/);
    });
});
describe('permissions boundary', () => {
    test('can be applied to an app', () => {
        // GIVEN
        const app = new core_1.App({
            context: {
                [core_1.PERMISSIONS_BOUNDARY_CONTEXT_KEY]: {
                    name: 'cdk-${Qualifier}-PermissionsBoundary',
                },
            },
        });
        const stack = new core_1.Stack(app);
        // WHEN
        new lib_1.Role(stack, 'Role', {
            assumedBy: new lib_1.ServicePrincipal('sns.amazonaws.com'),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            PermissionsBoundary: {
                'Fn::Join': [
                    '',
                    [
                        'arn:',
                        {
                            Ref: 'AWS::Partition',
                        },
                        ':iam::',
                        {
                            Ref: 'AWS::AccountId',
                        },
                        ':policy/cdk-hnb659fds-PermissionsBoundary',
                    ],
                ],
            },
        });
    });
    test('can be applied to a stage', () => {
        // GIVEN
        const app = new core_1.App();
        const stage = new core_1.Stage(app, 'Stage', {
            permissionsBoundary: core_1.PermissionsBoundary.fromName('cdk-${Qualifier}-PermissionsBoundary'),
        });
        const stack = new core_1.Stack(stage);
        // WHEN
        new lib_1.Role(stack, 'Role', {
            assumedBy: new lib_1.ServicePrincipal('sns.amazonaws.com'),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            PermissionsBoundary: {
                'Fn::Join': [
                    '',
                    [
                        'arn:',
                        {
                            Ref: 'AWS::Partition',
                        },
                        ':iam::',
                        {
                            Ref: 'AWS::AccountId',
                        },
                        ':policy/cdk-hnb659fds-PermissionsBoundary',
                    ],
                ],
            },
        });
    });
    test('can be applied to a stage, and will replace placeholders', () => {
        // GIVEN
        const app = new core_1.App();
        const stage = new core_1.Stage(app, 'Stage', {
            env: {
                region: 'test-region',
                account: '123456789012',
            },
            permissionsBoundary: core_1.PermissionsBoundary.fromName('cdk-${Qualifier}-PermissionsBoundary-${AWS::AccountId}-${AWS::Region}'),
        });
        const stack = new core_1.Stack(stage);
        // WHEN
        new lib_1.Role(stack, 'Role', {
            assumedBy: new lib_1.ServicePrincipal('sns.amazonaws.com'),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            PermissionsBoundary: {
                'Fn::Join': [
                    '',
                    [
                        'arn:',
                        {
                            Ref: 'AWS::Partition',
                        },
                        ':iam::123456789012:policy/cdk-hnb659fds-PermissionsBoundary-123456789012-test-region',
                    ],
                ],
            },
        });
    });
    test('with a custom qualifier', () => {
        // GIVEN
        const app = new core_1.App();
        const stage = new core_1.Stage(app, 'Stage', {
            permissionsBoundary: core_1.PermissionsBoundary.fromName('cdk-${Qualifier}-PermissionsBoundary'),
        });
        const stack = new core_1.Stack(stage, 'MyStack', {
            synthesizer: new core_1.DefaultStackSynthesizer({
                qualifier: 'custom',
            }),
        });
        // WHEN
        new lib_1.Role(stack, 'Role', {
            assumedBy: new lib_1.ServicePrincipal('sns.amazonaws.com'),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            PermissionsBoundary: {
                'Fn::Join': [
                    '',
                    [
                        'arn:',
                        {
                            Ref: 'AWS::Partition',
                        },
                        ':iam::',
                        {
                            Ref: 'AWS::AccountId',
                        },
                        ':policy/cdk-custom-PermissionsBoundary',
                    ],
                ],
            },
        });
    });
    test('with a custom permissions boundary', () => {
        // GIVEN
        const app = new core_1.App();
        const stage = new core_1.Stage(app, 'Stage', {
            permissionsBoundary: core_1.PermissionsBoundary.fromName('my-permissions-boundary'),
        });
        const stack = new core_1.Stack(stage);
        // WHEN
        new lib_1.Role(stack, 'Role', {
            assumedBy: new lib_1.ServicePrincipal('sns.amazonaws.com'),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            PermissionsBoundary: {
                'Fn::Join': [
                    '',
                    [
                        'arn:',
                        {
                            Ref: 'AWS::Partition',
                        },
                        ':iam::',
                        {
                            Ref: 'AWS::AccountId',
                        },
                        ':policy/my-permissions-boundary',
                    ],
                ],
            },
        });
    });
    test('with a custom permissions boundary and qualifier', () => {
        // GIVEN
        const app = new core_1.App();
        const stage = new core_1.Stage(app, 'Stage', {
            permissionsBoundary: core_1.PermissionsBoundary.fromName('my-${Qualifier}-permissions-boundary'),
        });
        const stack = new core_1.Stack(stage, 'MyStack', {
            synthesizer: new core_1.CliCredentialsStackSynthesizer({
                qualifier: 'custom',
            }),
        });
        // WHEN
        new lib_1.Role(stack, 'Role', {
            assumedBy: new lib_1.ServicePrincipal('sns.amazonaws.com'),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            PermissionsBoundary: {
                'Fn::Join': [
                    '',
                    [
                        'arn:',
                        {
                            Ref: 'AWS::Partition',
                        },
                        ':iam::',
                        {
                            Ref: 'AWS::AccountId',
                        },
                        ':policy/my-custom-permissions-boundary',
                    ],
                ],
            },
        });
    });
});
test('managed policy ARNs are deduplicated', () => {
    const app = new core_1.App();
    const stack = new core_1.Stack(app, 'my-stack');
    const role = new lib_1.Role(stack, 'MyRole', {
        assumedBy: new lib_1.ServicePrincipal('sns.amazonaws.com'),
        managedPolicies: [
            lib_1.ManagedPolicy.fromAwsManagedPolicyName('SuperDeveloper'),
            lib_1.ManagedPolicy.fromAwsManagedPolicyName('SuperDeveloper'),
        ],
    });
    role.addManagedPolicy(lib_1.ManagedPolicy.fromAwsManagedPolicyName('SuperDeveloper'));
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
        ManagedPolicyArns: [
            {
                'Fn::Join': [
                    '',
                    [
                        'arn:',
                        { Ref: 'AWS::Partition' },
                        ':iam::aws:policy/SuperDeveloper',
                    ],
                ],
            },
        ],
    });
});
describe('role with too large inline policy', () => {
    const N = 100;
    let app;
    let stack;
    let role;
    beforeEach(() => {
        app = new core_1.App();
        stack = new core_1.Stack(app, 'my-stack');
        role = new lib_1.Role(stack, 'MyRole', {
            assumedBy: new lib_1.ServicePrincipal('service.amazonaws.com'),
        });
        for (let i = 0; i < N; i++) {
            role.addToPrincipalPolicy(new lib_1.PolicyStatement({
                actions: ['aws:DoAThing'],
                resources: [`arn:aws:service:us-east-1:111122223333:someResource/SomeSpecificResource${i}`],
            }));
        }
    });
    test('excess gets split off into ManagedPolicies', () => {
        // THEN
        const template = assertions_1.Template.fromStack(stack);
        template.hasResourceProperties('AWS::IAM::ManagedPolicy', {
            PolicyDocument: {
                Statement: assertions_1.Match.arrayWith([
                    assertions_1.Match.objectLike({
                        Resource: `arn:aws:service:us-east-1:111122223333:someResource/SomeSpecificResource${N - 1}`,
                    }),
                ]),
            },
            Roles: [{ Ref: 'MyRoleF48FFE04' }],
        });
    });
    test('Dependables track the final declaring construct', () => {
        // WHEN
        const result = role.addToPrincipalPolicy(new lib_1.PolicyStatement({
            actions: ['aws:DoAThing'],
            resources: [`arn:aws:service:us-east-1:111122223333:someResource/SomeSpecificResource${N}`],
        }));
        const res = new core_1.CfnResource(stack, 'Depender', {
            type: 'AWS::Some::Resource',
        });
        expect(result.policyDependable).toBeTruthy();
        res.node.addDependency(result.policyDependable);
        // THEN
        const template = assertions_1.Template.fromStack(stack);
        template.hasResource('AWS::Some::Resource', {
            DependsOn: [
                'MyRoleOverflowPolicy13EF5596A',
            ],
        });
    });
});
test('many copies of the same statement do not result in overflow policies', () => {
    const N = 100;
    const app = new core_1.App();
    const stack = new core_1.Stack(app, 'my-stack');
    const role = new lib_1.Role(stack, 'MyRole', {
        assumedBy: new lib_1.ServicePrincipal('service.amazonaws.com'),
    });
    for (let i = 0; i < N; i++) {
        role.addToPrincipalPolicy(new lib_1.PolicyStatement({
            actions: ['aws:DoAThing'],
            resources: ['arn:aws:service:us-east-1:111122223333:someResource/SomeSpecificResource'],
        }));
    }
    // THEN
    const template = assertions_1.Template.fromStack(stack);
    template.resourceCountIs('AWS::IAM::ManagedPolicy', 0);
});
test('cross-env role ARNs include path', () => {
    const app = new core_1.App();
    const roleStack = new core_1.Stack(app, 'role-stack', { env: { account: '123456789012', region: 'us-east-1' } });
    const referencerStack = new core_1.Stack(app, 'referencer-stack', { env: { region: 'us-east-2' } });
    const role = new lib_1.Role(roleStack, 'Role', {
        assumedBy: new lib_1.ServicePrincipal('sns.amazonaws.com'),
        path: '/sample/path/',
        roleName: 'sample-name',
    });
    new core_1.CfnResource(referencerStack, 'Referencer', {
        type: 'Custom::RoleReferencer',
        properties: { RoleArn: role.roleArn },
    });
    assertions_1.Template.fromStack(referencerStack).hasResourceProperties('Custom::RoleReferencer', {
        RoleArn: {
            'Fn::Join': [
                '',
                [
                    'arn:',
                    {
                        Ref: 'AWS::Partition',
                    },
                    ':iam::123456789012:role/sample/path/sample-name',
                ],
            ],
        },
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9sZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicm9sZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQW1FO0FBQ25FLDhEQUEwRDtBQUMxRCx3Q0FBOE07QUFDOU0sMkNBQXVDO0FBQ3ZDLGdDQUEwTDtBQUUxTCxRQUFRLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxFQUFFO0lBQ2hDLElBQUksQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLEVBQUU7UUFDdkMsUUFBUTtRQUNSLE1BQU0sR0FBRyxHQUFHLElBQUksVUFBRyxFQUFFLENBQUM7UUFDdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3hDLE9BQU87UUFDUCxNQUFNLFFBQVEsR0FBRyxJQUFJLFVBQUksQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO1lBQ3ZDLFNBQVMsRUFBRSxJQUFJLHNCQUFnQixDQUFDLG1CQUFtQixDQUFDO1NBQ3JELENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxNQUFNLENBQUMsVUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMzQyxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx1Q0FBdUMsRUFBRSxHQUFHLEVBQUU7UUFDakQsUUFBUTtRQUNSLE1BQU0sR0FBRyxHQUFHLElBQUksVUFBRyxFQUFFLENBQUM7UUFDdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3hDLE9BQU87UUFDUCxNQUFNLFlBQVksR0FBRyxVQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDOUUsT0FBTztRQUNQLE1BQU0sQ0FBQyxVQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxD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RUFBRSxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDMUcsTUFBTSxlQUFlLEdBQUcsSUFBSSxZQUFLLENBQUMsR0FBRyxFQUFFLGtCQUFrQixFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUM3RixNQUFNLElBQUksR0FBRyxJQUFJLFVBQUksQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFO1FBQ3ZDLFNBQVMsRUFBRSxJQUFJLHNCQUFnQixDQUFDLG1CQUFtQixDQUFDO1FBQ3BELElBQUksRUFBRSxlQUFlO1FBQ3JCLFFBQVEsRUFBRSxhQUFhO0tBQ3hCLENBQUMsQ0FBQztJQUNILElBQUksa0JBQVcsQ0FBQyxlQUFlLEVBQUUsWUFBWSxFQUFFO1FBQzdDLElBQUksRUFBRSx3QkFBd0I7UUFDOUIsVUFBVSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUU7S0FDdEMsQ0FBQyxDQUFDO0lBRUgscUJBQVEsQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLENBQUMscUJBQXFCLENBQUMsd0JBQXdCLEVBQUU7UUFDbEYsT0FBTyxFQUFFO1lBQ1AsVUFBVSxFQUFFO2dCQUNWLEVBQUU7Z0JBQ0Y7b0JBQ0UsTUFBTTtvQkFDTjt3QkFDRSxHQUFHLEVBQUUsZ0JBQWdCO3FCQUN0QjtvQkFDRCxpREFBaUQ7aUJBQ2xEO2FBQ0Y7U0FDRjtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUsIE1hdGNoLCBBbm5vdGF0aW9ucyB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0IHsgdGVzdERlcHJlY2F0ZWQgfSBmcm9tICdAYXdzLWNkay9jZGstYnVpbGQtdG9vbHMnO1xuaW1wb3J0IHsgRHVyYXRpb24sIFN0YWNrLCBBcHAsIENmblJlc291cmNlLCBSZW1vdmFsUG9saWN5LCBMYXp5LCBTdGFnZSwgRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIsIENsaUNyZWRlbnRpYWxzU3RhY2tTeW50aGVzaXplciwgUEVSTUlTU0lPTlNfQk9VTkRBUllfQ09OVEVYVF9LRVksIFBlcm1pc3Npb25zQm91bmRhcnkgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQW55UHJpbmNpcGFsLCBBcm5QcmluY2lwYWwsIENvbXBvc2l0ZVByaW5jaXBhbCwgRmVkZXJhdGVkUHJpbmNpcGFsLCBNYW5hZ2VkUG9saWN5LCBQb2xpY3lTdGF0ZW1lbnQsIFJvbGUsIFNlcnZpY2VQcmluY2lwYWwsIFVzZXIsIFBvbGljeSwgUG9saWN5RG9jdW1lbnQsIEVmZmVjdCB9IGZyb20gJy4uL2xpYic7XG5cbmRlc2NyaWJlKCdpc1JvbGUoKSByZXR1cm5zJywgKCkgPT4ge1xuICB0ZXN0KCd0cnVlIGlmIGdpdmVuIFJvbGUgaW5zdGFuY2UnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnTXlTdGFjaycpO1xuICAgIC8vIFdIRU5cbiAgICBjb25zdCBwdXJlUm9sZSA9IG5ldyBSb2xlKHN0YWNrLCAnUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ3Nucy5hbWF6b25hd3MuY29tJyksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KFJvbGUuaXNSb2xlKHB1cmVSb2xlKSkudG9CZSh0cnVlKTtcbiAgfSk7XG5cbiAgdGVzdCgnZmFsc2UgaWYgZ2l2ZW4gaW1wb3J0ZWQgcm9sZSBpbnN0YW5jZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdNeVN0YWNrJyk7XG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGltcG9ydGVkUm9sZSA9IFJvbGUuZnJvbVJvbGVOYW1lKHN0YWNrLCAnSW1wb3J0ZWRSb2xlJywgJ0ltcG9ydGVkUm9sZScpO1xuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoUm9sZS5pc1JvbGUoaW1wb3J0ZWRSb2xlKSkudG9CZShmYWxzZSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ZhbHNlIGlmIGdpdmVuIHVuZGVmaW5lZCcsICgpID0+IHtcbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KFJvbGUuaXNSb2xlKHVuZGVmaW5lZCkpLnRvQmUoZmFsc2UpO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnY3VzdG9taXplUm9sZXMnLCAoKSA9PiB7XG4gIHRlc3QoJ3Rocm93cyBpZiBwcmVjcmVhdGVkUm9sZXMgaXMgbm90IHVzZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgUm9sZS5jdXN0b21pemVSb2xlcyhhcHApO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ015U3RhY2snKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgUm9sZShzdGFjaywgJ1JvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBTZXJ2aWNlUHJpbmNpcGFsKCdzbnMuYW1hem9uYXdzLmNvbScpLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIEFubm90YXRpb25zLmZyb21TdGFjayhzdGFjaykuaGFzRXJyb3IoJy9NeVN0YWNrL1JvbGUnLCBNYXRjaC5zdHJpbmdMaWtlUmVnZXhwKCdJQU0gUm9sZSBpcyBiZWluZyBjcmVhdGVkIGF0IHBhdGggXCJNeVN0YWNrL1JvbGVcIicpKTtcbiAgfSk7XG5cbiAgdGVzdCgndGhyb3dzIGlmIHByZWNyZWF0ZWRSb2xlcyBoYXMgYSB0b2tlbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBSb2xlLmN1c3RvbWl6ZVJvbGVzKGFwcCwge1xuICAgICAgdXNlUHJlY3JlYXRlZFJvbGVzOiB7XG4gICAgICAgICdNeVN0YWNrL1JvbGUnOiBMYXp5LnN0cmluZyh7IHByb2R1Y2U6ICgpID0+ICdSb2xlTmFtZScgfSksXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ015U3RhY2snKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgUm9sZShzdGFjaywgJ1JvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBTZXJ2aWNlUHJpbmNpcGFsKCdzbnMuYW1hem9uYXdzLmNvbScpLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIEFubm90YXRpb25zLmZyb21TdGFjayhzdGFjaykuaGFzRXJyb3IoJy9NeVN0YWNrL1JvbGUnLCBNYXRjaC5zdHJpbmdMaWtlUmVnZXhwKCdDYW5ub3QgcmVzb2x2ZSBwcmVjcmVhdGVkIHJvbGUgbmFtZSBhdCBwYXRoIFwiTXlTdGFjay9Sb2xlXCInKSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2RvZXMgbm90IHRocm93IGlmIHByZXZlbnRTeW50aGVzaXM9ZmFsc2UnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgUm9sZS5jdXN0b21pemVSb2xlcyhhcHAsIHtcbiAgICAgIHByZXZlbnRTeW50aGVzaXM6IGZhbHNlLFxuICAgIH0pO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ015U3RhY2snKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgUm9sZShzdGFjaywgJ1JvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBTZXJ2aWNlUHJpbmNpcGFsKCdzbnMuYW1hem9uYXdzLmNvbScpLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIC8vIG5vIGFubm90YXRpb25zXG4gICAgY29uc3QgYW5ub3RhdGlvbnMgPSBBbm5vdGF0aW9ucy5mcm9tU3RhY2soc3RhY2spO1xuICAgIGFubm90YXRpb25zLmhhc05vRXJyb3IoJ015U3RhY2svUm9sZScsIE1hdGNoLnN0cmluZ0xpa2VSZWdleHAoJyonKSk7XG5cbiAgICAvLyBhbmQgcmVzb3VyY2UgaXMgc3RpbGwgc3ludGhlc2l6ZWRcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpJQU06OlJvbGUnLCAxKTtcbiAgfSk7XG5cbiAgdGVzdCgnd29ya3MgYXQgdGhlIGFwcCBzY29wZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBSb2xlLmN1c3RvbWl6ZVJvbGVzKGFwcCwge1xuICAgICAgdXNlUHJlY3JlYXRlZFJvbGVzOiB7XG4gICAgICAgICdNeVN0YWNrL1JvbGUnOiAnU29tZVJvbGVOYW1lJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnTXlTdGFjaycpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHJvbGUgPSBuZXcgUm9sZShzdGFjaywgJ1JvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBTZXJ2aWNlUHJpbmNpcGFsKCdzbnMuYW1hem9uYXdzLmNvbScpLFxuICAgIH0pO1xuICAgIG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ015UmVzb3VyY2UnLCB7XG4gICAgICB0eXBlOiAnQVdTOjpDdXN0b20nLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBSb2xlOiByb2xlLnJvbGVOYW1lLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCB0ZW1wbGF0ZSA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG4gICAgdGVtcGxhdGUucmVzb3VyY2VDb3VudElzKCdBV1M6OklBTTo6Um9sZScsIDApO1xuICAgIHRlbXBsYXRlLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDdXN0b20nLCB7XG4gICAgICBSb2xlOiAnU29tZVJvbGVOYW1lJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnd29ya3MgYXQgYSByZWxhdGl2ZSBzY29wZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdNeVN0YWNrJyk7XG4gICAgY29uc3Qgc3ViU2NvcGUgPSBuZXcgQ29uc3RydWN0KHN0YWNrLCAnU29tZUNvbnN0cnVjdCcpO1xuICAgIFJvbGUuY3VzdG9taXplUm9sZXMoc3ViU2NvcGUsIHtcbiAgICAgIHVzZVByZWNyZWF0ZWRSb2xlczoge1xuICAgICAgICBSb2xlOiAnU29tZVJvbGVOYW1lJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgcm9sZSA9IG5ldyBSb2xlKHN1YlNjb3BlLCAnUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ3Nucy5hbWF6b25hd3MuY29tJyksXG4gICAgfSk7XG4gICAgbmV3IENmblJlc291cmNlKHN1YlNjb3BlLCAnTXlSZXNvdXJjZScsIHtcbiAgICAgIHR5cGU6ICdBV1M6OkN1c3RvbScsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIFJvbGU6IHJvbGUucm9sZU5hbWUsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbiAgICB0ZW1wbGF0ZS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6SUFNOjpSb2xlJywgMCk7XG4gICAgdGVtcGxhdGUuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkN1c3RvbScsIHtcbiAgICAgIFJvbGU6ICdTb21lUm9sZU5hbWUnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd3b3JrcyBhdCBhbiBhYnNvbHV0ZSBzY29wZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdNeVN0YWNrJyk7XG4gICAgY29uc3Qgc3ViU2NvcGUgPSBuZXcgQ29uc3RydWN0KHN0YWNrLCAnU29tZUNvbnN0cnVjdCcpO1xuICAgIFJvbGUuY3VzdG9taXplUm9sZXMoc3ViU2NvcGUsIHtcbiAgICAgIHVzZVByZWNyZWF0ZWRSb2xlczoge1xuICAgICAgICAnTXlTdGFjay9Tb21lQ29uc3RydWN0L1JvbGUnOiAnU29tZVJvbGVOYW1lJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgcm9sZSA9IG5ldyBSb2xlKHN1YlNjb3BlLCAnUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ3Nucy5hbWF6b25hd3MuY29tJyksXG4gICAgfSk7XG4gICAgbmV3IENmblJlc291cmNlKHN1YlNjb3BlLCAnTXlSZXNvdXJjZScsIHtcbiAgICAgIHR5cGU6ICdBV1M6OkN1c3RvbScsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIFJvbGU6IHJvbGUucm9sZU5hbWUsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbiAgICB0ZW1wbGF0ZS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6SUFNOjpSb2xlJywgMCk7XG4gICAgdGVtcGxhdGUuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkN1c3RvbScsIHtcbiAgICAgIFJvbGU6ICdTb21lUm9sZU5hbWUnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdkb2VzIG5vdCBjcmVhdGUgcG9saWNpZXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgUm9sZS5jdXN0b21pemVSb2xlcyhhcHAsIHtcbiAgICAgIHVzZVByZWNyZWF0ZWRSb2xlczoge1xuICAgICAgICAnTXlTdGFjay9Sb2xlJzogJ1NvbWVSb2xlTmFtZScsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ015U3RhY2snKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCByb2xlID0gbmV3IFJvbGUoc3RhY2ssICdSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgnc25zLmFtYXpvbmF3cy5jb20nKSxcbiAgICB9KTtcbiAgICBjb25zdCBpbXBvcnRlZFJvbGUgPSBSb2xlLmZyb21Sb2xlTmFtZShzdGFjaywgJ0ltcG9ydGVkUm9sZScsICdJbXBvcnRlZFJvbGUnKTtcbiAgICBpbXBvcnRlZFJvbGUuZ3JhbnQocm9sZSwgJ3N0czpBc3N1bWVSb2xlJyk7XG4gICAgcm9sZS5hZGRUb1BvbGljeShuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGVmZmVjdDogRWZmZWN0LkFMTE9XLFxuICAgICAgYWN0aW9uczogWycqJ10sXG4gICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgIH0pKTtcblxuICAgIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbiAgICB0ZW1wbGF0ZS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6SUFNOjpQb2xpY3knLCAwKTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIHVzZSBhbGwgcm9sZSBwcm9wZXJ0aWVzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIFJvbGUuY3VzdG9taXplUm9sZXMoYXBwLCB7XG4gICAgICB1c2VQcmVjcmVhdGVkUm9sZXM6IHtcbiAgICAgICAgJ015U3RhY2svUm9sZSc6ICdTb21lUm9sZU5hbWUnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdNeVN0YWNrJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgcm9sZSA9IG5ldyBSb2xlKHN0YWNrLCAnUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ3Nucy5hbWF6b25hd3MuY29tJyksXG4gICAgfSk7XG4gICAgY29uc3QgcHJpbmNpcGFsID0gUm9sZS5mcm9tUm9sZU5hbWUoc3RhY2ssICdPdGhlclJvbGUnLCAnT3RoZXJSb2xlJyk7XG4gICAgcm9sZS5ncmFudChwcmluY2lwYWwsICdzdHM6QXNzdW1lUm9sZScpO1xuICAgIHJvbGUuZ3JhbnRQYXNzUm9sZShwcmluY2lwYWwpO1xuICAgIHJvbGUuZ3JhbnRBc3N1bWVSb2xlKHByaW5jaXBhbCk7XG4gICAgcm9sZS5hZGRNYW5hZ2VkUG9saWN5KE1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdSZWFkT25seUFjY2VzcycpKTtcbiAgICByb2xlLmFkZE1hbmFnZWRQb2xpY3kobmV3IE1hbmFnZWRQb2xpY3koc3RhY2ssICdNeVBvbGljeScsIHtcbiAgICAgIHN0YXRlbWVudHM6IFtuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgZWZmZWN0OiBFZmZlY3QuQUxMT1csXG4gICAgICAgIGFjdGlvbnM6IFsnc25zOlB1Ymxpc2gnXSxcbiAgICAgICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICAgIH0pXSxcbiAgICB9KSk7XG4gICAgcm9sZS53aXRob3V0UG9saWN5VXBkYXRlcygpO1xuICAgIG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ015UmVzb3VyY2UnLCB7XG4gICAgICB0eXBlOiAnQVdTOjpDdXN0b20nLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBSb2xlTmFtZTogcm9sZS5yb2xlTmFtZSxcbiAgICAgICAgUm9sZUFybjogcm9sZS5yb2xlTmFtZSxcbiAgICAgICAgUG9saWN5RnJhZ21lbnQ6IHJvbGUucG9saWN5RnJhZ21lbnQsXG4gICAgICAgIEFzc3VtZVJvbGVBY3Rpb246IHJvbGUuYXNzdW1lUm9sZUFjdGlvbixcbiAgICAgICAgUHJpbmNpcGFsQWNjb3VudDogcm9sZS5wcmluY2lwYWxBY2NvdW50LFxuICAgICAgICBBc3N1bWVSb2xlUG9saWN5OiByb2xlLmFzc3VtZVJvbGVQb2xpY3ksXG4gICAgICAgIFBlcm1pc3Npb25zQm91bmRhcnk6IHJvbGUucGVybWlzc2lvbnNCb3VuZGFyeSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIHJvbGUuYXBwbHlSZW1vdmFsUG9saWN5KFJlbW92YWxQb2xpY3kuREVTVFJPWSk7XG4gICAgfSkudG9UaHJvdygvQ2Fubm90IGFwcGx5IFJlbW92YWxQb2xpY3kvKTtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IENmblJlc291cmNlKHN0YWNrLCAnTXlSZXNvdXJjZTInLCB7XG4gICAgICAgIHR5cGU6ICdBV1M6OkN1c3RvbScsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICBSb2xlSWQ6IHJvbGUucm9sZUlkLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSkudG9UaHJvdygvXCJyb2xlSWRcIiBpcyBub3QgYXZhaWxhYmxlIG9uIHByZWNyZWF0ZWQgcm9sZXMvKTtcbiAgICBjb25zdCB0ZW1wbGF0ZSA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG4gICAgdGVtcGxhdGUucmVzb3VyY2VDb3VudElzKCdBV1M6OklBTTo6Um9sZScsIDApO1xuICAgIHRlbXBsYXRlLnJlc291cmNlQ291bnRJcygnQVdTOjpJQU06OlBvbGljeScsIDApO1xuICAgIHRlbXBsYXRlLnJlc291cmNlQ291bnRJcygnQVdTOjpJQU06Ok1hbmFnZWRQb2xpY3knLCAwKTtcbiAgICB0ZW1wbGF0ZS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q3VzdG9tJywge1xuICAgICAgUm9sZU5hbWU6ICdTb21lUm9sZU5hbWUnLFxuICAgICAgUm9sZUFybjogJ1NvbWVSb2xlTmFtZScsXG4gICAgICBQb2xpY3lGcmFnbWVudDoge1xuICAgICAgICBwcmluY2lwYWxKc29uOiB7XG4gICAgICAgICAgQVdTOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnOmlhbTo6JyxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpBY2NvdW50SWQnLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICc6cm9sZS9Tb21lUm9sZU5hbWUnLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIGNvbmRpdGlvbnM6IHt9LFxuICAgICAgfSxcbiAgICAgIEFzc3VtZVJvbGVBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICBQcmluY2lwYWxBY2NvdW50OiB7XG4gICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgIH0sXG4gICAgICBBc3N1bWVSb2xlUG9saWN5OiB7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICAgICAgICBTZXJ2aWNlOiAnc25zLmFtYXpvbmF3cy5jb20nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnSUFNIHJvbGUnLCAoKSA9PiB7XG4gIHRlc3QoJ2RlZmF1bHQgcm9sZScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgbmV3IFJvbGUoc3RhY2ssICdNeVJvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBTZXJ2aWNlUHJpbmNpcGFsKCdzbnMuYW1hem9uYXdzLmNvbScpLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUmVzb3VyY2VzOlxuICAgICAge1xuICAgICAgICBNeVJvbGVGNDhGRkUwNDpcbiAgICAgICAgIHtcbiAgICAgICAgICAgVHlwZTogJ0FXUzo6SUFNOjpSb2xlJyxcbiAgICAgICAgICAgUHJvcGVydGllczpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQ6XG4gICAgICAgICAgIHtcbiAgICAgICAgICAgICBTdGF0ZW1lbnQ6XG4gICAgICAgICAgICBbe1xuICAgICAgICAgICAgICBBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUHJpbmNpcGFsOiB7IFNlcnZpY2U6ICdzbnMuYW1hem9uYXdzLmNvbScgfSxcbiAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Egcm9sZSBjYW4gZ3JhbnQgUGFzc1JvbGUgcGVybWlzc2lvbnMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHJvbGUgPSBuZXcgUm9sZShzdGFjaywgJ1JvbGUnLCB7IGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ2hlbmsuYW1hem9uYXdzLmNvbScpIH0pO1xuICAgIGNvbnN0IHVzZXIgPSBuZXcgVXNlcihzdGFjaywgJ1VzZXInKTtcblxuICAgIC8vIFdIRU5cbiAgICByb2xlLmdyYW50UGFzc1JvbGUodXNlcik7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdpYW06UGFzc1JvbGUnLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUmVzb3VyY2U6IHsgJ0ZuOjpHZXRBdHQnOiBbJ1JvbGUxQUJDQzVGMCcsICdBcm4nXSB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Egcm9sZSBjYW4gZ3JhbnQgQXNzdW1lUm9sZSBwZXJtaXNzaW9ucycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3Qgcm9sZSA9IG5ldyBSb2xlKHN0YWNrLCAnUm9sZScsIHsgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgnaGVuay5hbWF6b25hd3MuY29tJykgfSk7XG4gICAgY29uc3QgdXNlciA9IG5ldyBVc2VyKHN0YWNrLCAnVXNlcicpO1xuXG4gICAgLy8gV0hFTlxuICAgIHJvbGUuZ3JhbnRBc3N1bWVSb2xlKHVzZXIpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiAnc3RzOkFzc3VtZVJvbGUnLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUmVzb3VyY2U6IHsgJ0ZuOjpHZXRBdHQnOiBbJ1JvbGUxQUJDQzVGMCcsICdBcm4nXSB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3REZXByZWNhdGVkKCdjYW4gc3VwcGx5IGV4dGVybmFsSWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBSb2xlKHN0YWNrLCAnTXlSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgnc25zLmFtYXpvbmF3cy5jb20nKSxcbiAgICAgIGV4dGVybmFsSWQ6ICdTb21lU2VjcmV0JyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlJvbGUnLCB7XG4gICAgICBBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiAnc3RzOkFzc3VtZVJvbGUnLFxuICAgICAgICAgICAgQ29uZGl0aW9uOiB7XG4gICAgICAgICAgICAgIFN0cmluZ0VxdWFsczogeyAnc3RzOkV4dGVybmFsSWQnOiAnU29tZVNlY3JldCcgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBQcmluY2lwYWw6IHsgU2VydmljZTogJ3Nucy5hbWF6b25hd3MuY29tJyB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBzdXBwbHkgc2luZ2xlIGV4dGVybmFsSWRzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgUm9sZShzdGFjaywgJ015Um9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ3Nucy5hbWF6b25hd3MuY29tJyksXG4gICAgICBleHRlcm5hbElkczogWydTb21lU2VjcmV0J10sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpSb2xlJywge1xuICAgICAgQXNzdW1lUm9sZVBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgICAgICAgIENvbmRpdGlvbjoge1xuICAgICAgICAgICAgICBTdHJpbmdFcXVhbHM6IHsgJ3N0czpFeHRlcm5hbElkJzogJ1NvbWVTZWNyZXQnIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUHJpbmNpcGFsOiB7IFNlcnZpY2U6ICdzbnMuYW1hem9uYXdzLmNvbScgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gc3VwcGx5IG11bHRpcGxlIGV4dGVybmFsSWRzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgUm9sZShzdGFjaywgJ015Um9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ3Nucy5hbWF6b25hd3MuY29tJyksXG4gICAgICBleHRlcm5hbElkczogWydTb21lU2VjcmV0JywgJ0Fub3RoZXJTZWNyZXQnXSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlJvbGUnLCB7XG4gICAgICBBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiAnc3RzOkFzc3VtZVJvbGUnLFxuICAgICAgICAgICAgQ29uZGl0aW9uOiB7XG4gICAgICAgICAgICAgIFN0cmluZ0VxdWFsczogeyAnc3RzOkV4dGVybmFsSWQnOiBbJ1NvbWVTZWNyZXQnLCAnQW5vdGhlclNlY3JldCddIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUHJpbmNpcGFsOiB7IFNlcnZpY2U6ICdzbnMuYW1hem9uYXdzLmNvbScgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdwb2xpY3kgaXMgY3JlYXRlZCBhdXRvbWF0aWNhbGx5IHdoZW4gcGVybWlzc2lvbnMgYXJlIGFkZGVkJywgKCkgPT4ge1xuICAgIC8vIGJ5IGRlZmF1bHQgd2UgZG9uJ3QgZXhwZWN0IGEgcm9sZSBwb2xpY3lcbiAgICBjb25zdCBiZWZvcmUgPSBuZXcgU3RhY2soKTtcbiAgICBuZXcgUm9sZShiZWZvcmUsICdNeVJvbGUnLCB7IGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ3Nucy5hbWF6b25hd3MuY29tJykgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKGJlZm9yZSkucmVzb3VyY2VDb3VudElzKCdBV1M6OklBTTo6UG9saWN5JywgMCk7XG5cbiAgICAvLyBhZGQgYSBwb2xpY3kgdG8gdGhlIHJvbGVcbiAgICBjb25zdCBhZnRlciA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGFmdGVyUm9sZSA9IG5ldyBSb2xlKGFmdGVyLCAnTXlSb2xlJywgeyBhc3N1bWVkQnk6IG5ldyBTZXJ2aWNlUHJpbmNpcGFsKCdzbnMuYW1hem9uYXdzLmNvbScpIH0pO1xuICAgIGFmdGVyUm9sZS5hZGRUb1BvbGljeShuZXcgUG9saWN5U3RhdGVtZW50KHsgcmVzb3VyY2VzOiBbJ215cmVzb3VyY2UnXSwgYWN0aW9uczogWydzZXJ2aWNlOm15YWN0aW9uJ10gfSkpO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhhZnRlcikuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiAnc2VydmljZTpteWFjdGlvbicsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBSZXNvdXJjZTogJ215cmVzb3VyY2UnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgICBQb2xpY3lOYW1lOiAnTXlSb2xlRGVmYXVsdFBvbGljeUEzNkJFMUREJyxcbiAgICAgIFJvbGVzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBSZWY6ICdNeVJvbGVGNDhGRkUwNCcsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gIH0pO1xuXG4gIHRlc3QoJ21hbmFnZWQgcG9saWN5IGFybnMgY2FuIGJlIHN1cHBsaWVkIHVwb24gaW5pdGlhbGl6YXRpb24gYW5kIGFsc28gYWRkZWQgbGF0ZXInLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGNvbnN0IHJvbGUgPSBuZXcgUm9sZShzdGFjaywgJ015Um9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ3Rlc3Quc2VydmljZScpLFxuICAgICAgbWFuYWdlZFBvbGljaWVzOiBbeyBtYW5hZ2VkUG9saWN5QXJuOiAnbWFuYWdlZDEnIH0sIHsgbWFuYWdlZFBvbGljeUFybjogJ21hbmFnZWQyJyB9XSxcbiAgICB9KTtcblxuICAgIHJvbGUuYWRkTWFuYWdlZFBvbGljeSh7IG1hbmFnZWRQb2xpY3lBcm46ICdtYW5hZ2VkMycgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUmVzb3VyY2VzOlxuICAgICAge1xuICAgICAgICBNeVJvbGVGNDhGRkUwNDpcbiAgICAgICAgIHtcbiAgICAgICAgICAgVHlwZTogJ0FXUzo6SUFNOjpSb2xlJyxcbiAgICAgICAgICAgUHJvcGVydGllczpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQ6XG4gICAgICAgICAgIHtcbiAgICAgICAgICAgICBTdGF0ZW1lbnQ6XG4gICAgICAgICAgICBbe1xuICAgICAgICAgICAgICBBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUHJpbmNpcGFsOiB7IFNlcnZpY2U6ICd0ZXN0LnNlcnZpY2UnIH0sXG4gICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgICAgIH0sXG4gICAgICAgICAgICBNYW5hZ2VkUG9saWN5QXJuczogWydtYW5hZ2VkMScsICdtYW5hZ2VkMicsICdtYW5hZ2VkMyddLFxuICAgICAgICAgIH0sXG4gICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICB9KTtcblxuICB0ZXN0KCdmZWRlcmF0ZWQgcHJpbmNpcGFsIGNhbiBjaGFuZ2UgQXNzdW1lUm9sZUFjdGlvbicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGNvZ25pdG9QcmluY2lwYWwgPSBuZXcgRmVkZXJhdGVkUHJpbmNpcGFsKFxuICAgICAgJ2ZvbycsXG4gICAgICB7IFN0cmluZ0VxdWFsczogeyBrZXk6ICd2YWx1ZScgfSB9LFxuICAgICAgJ3N0czpBc3N1bWVTb21ldGhpbmcnKTtcblxuICAgIG5ldyBSb2xlKHN0YWNrLCAnTXlSb2xlJywgeyBhc3N1bWVkQnk6IGNvZ25pdG9QcmluY2lwYWwgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlJvbGUnLCB7XG4gICAgICBBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBQcmluY2lwYWw6IHsgRmVkZXJhdGVkOiAnZm9vJyB9LFxuICAgICAgICAgICAgQ29uZGl0aW9uOiB7XG4gICAgICAgICAgICAgIFN0cmluZ0VxdWFsczogeyBrZXk6ICd2YWx1ZScgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBBY3Rpb246ICdzdHM6QXNzdW1lU29tZXRoaW5nJyxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgncm9sZSBwYXRoIGNhbiBiZSB1c2VkIHRvIHNwZWNpZnkgdGhlIHBhdGgnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIG5ldyBSb2xlKHN0YWNrLCAnTXlSb2xlJywgeyBwYXRoOiAnLycsIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ3Nucy5hbWF6b25hd3MuY29tJykgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlJvbGUnLCB7XG4gICAgICBQYXRoOiAnLycsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3JvbGUgcGF0aCBjYW4gYmUgMSBjaGFyYWN0ZXInLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGNvbnN0IGFzc3VtZWRCeSA9IG5ldyBTZXJ2aWNlUHJpbmNpcGFsKCdibGEnKTtcblxuICAgIGV4cGVjdCgoKSA9PiBuZXcgUm9sZShzdGFjaywgJ015Um9sZScsIHsgYXNzdW1lZEJ5LCBwYXRoOiAnLycgfSkpLm5vdC50b1Rocm93RXJyb3IoKTtcbiAgfSk7XG5cbiAgdGVzdCgncm9sZSBwYXRoIGNhbm5vdCBiZSBlbXB0eScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3QgYXNzdW1lZEJ5ID0gbmV3IFNlcnZpY2VQcmluY2lwYWwoJ2JsYScpO1xuXG4gICAgZXhwZWN0KCgpID0+IG5ldyBSb2xlKHN0YWNrLCAnTXlSb2xlJywgeyBhc3N1bWVkQnksIHBhdGg6ICcnIH0pKVxuICAgICAgLnRvVGhyb3coJ1JvbGUgcGF0aCBtdXN0IGJlIGJldHdlZW4gMSBhbmQgNTEyIGNoYXJhY3RlcnMuIFRoZSBwcm92aWRlZCByb2xlIHBhdGggaXMgMCBjaGFyYWN0ZXJzLicpO1xuICB9KTtcblxuICB0ZXN0KCdyb2xlIHBhdGggbXVzdCBiZSBsZXNzIHRoYW4gb3IgZXF1YWwgdG8gNTEyJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBjb25zdCBhc3N1bWVkQnkgPSBuZXcgU2VydmljZVByaW5jaXBhbCgnYmxhJyk7XG5cbiAgICBleHBlY3QoKCkgPT4gbmV3IFJvbGUoc3RhY2ssICdNeVJvbGUnLCB7IGFzc3VtZWRCeSwgcGF0aDogJy8nICsgQXJyYXkoNTEyKS5qb2luKCdhJykgKyAnLycgfSkpXG4gICAgICAudG9UaHJvdygnUm9sZSBwYXRoIG11c3QgYmUgYmV0d2VlbiAxIGFuZCA1MTIgY2hhcmFjdGVycy4gVGhlIHByb3ZpZGVkIHJvbGUgcGF0aCBpcyA1MTMgY2hhcmFjdGVycy4nKTtcbiAgfSk7XG5cbiAgdGVzdCgncm9sZSBwYXRoIG11c3Qgc3RhcnQgd2l0aCBhIGZvcndhcmQgc2xhc2gnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGNvbnN0IGFzc3VtZWRCeSA9IG5ldyBTZXJ2aWNlUHJpbmNpcGFsKCdibGEnKTtcblxuICAgIGNvbnN0IGV4cGVjdGVkID0gKHZhbDogYW55KSA9PiAnUm9sZSBwYXRoIG11c3QgYmUgZWl0aGVyIGEgc2xhc2ggb3IgdmFsaWQgY2hhcmFjdGVycyAoYWxwaGFudW1lcmljcyBhbmQgc3ltYm9scykgc3Vycm91bmRlZCBieSBzbGFzaGVzLiAnXG4gICAgKyBgVmFsaWQgY2hhcmFjdGVycyBhcmUgdW5pY29kZSBjaGFyYWN0ZXJzIGluIFtcXFxcdTAwMjEtXFxcXHUwMDdGXS4gSG93ZXZlciwgJHt2YWx9IGlzIHByb3ZpZGVkLmA7XG4gICAgZXhwZWN0KCgpID0+IG5ldyBSb2xlKHN0YWNrLCAnTXlSb2xlJywgeyBhc3N1bWVkQnksIHBhdGg6ICdhYWEnIH0pKS50b1Rocm93KGV4cGVjdGVkKCdhYWEnKSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3JvbGUgcGF0aCBtdXN0IGVuZCB3aXRoIGEgZm9yd2FyZCBzbGFzaCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3QgYXNzdW1lZEJ5ID0gbmV3IFNlcnZpY2VQcmluY2lwYWwoJ2JsYScpO1xuXG4gICAgY29uc3QgZXhwZWN0ZWQgPSAodmFsOiBhbnkpID0+ICdSb2xlIHBhdGggbXVzdCBiZSBlaXRoZXIgYSBzbGFzaCBvciB2YWxpZCBjaGFyYWN0ZXJzIChhbHBoYW51bWVyaWNzIGFuZCBzeW1ib2xzKSBzdXJyb3VuZGVkIGJ5IHNsYXNoZXMuICdcbiAgICArIGBWYWxpZCBjaGFyYWN0ZXJzIGFyZSB1bmljb2RlIGNoYXJhY3RlcnMgaW4gW1xcXFx1MDAyMS1cXFxcdTAwN0ZdLiBIb3dldmVyLCAke3ZhbH0gaXMgcHJvdmlkZWQuYDtcbiAgICBleHBlY3QoKCkgPT4gbmV3IFJvbGUoc3RhY2ssICdNeVJvbGUnLCB7IGFzc3VtZWRCeSwgcGF0aDogJy9hJyB9KSkudG9UaHJvdyhleHBlY3RlZCgnL2EnKSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3JvbGUgcGF0aCBtdXN0IGNvbnRhaW4gdW5pY29kZSBjaGFycyB3aXRoaW4gW1xcXFx1MDAyMS1cXFxcdTAwN0ZdJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBjb25zdCBhc3N1bWVkQnkgPSBuZXcgU2VydmljZVByaW5jaXBhbCgnYmxhJyk7XG5cbiAgICBjb25zdCBleHBlY3RlZCA9ICh2YWw6IGFueSkgPT4gJ1JvbGUgcGF0aCBtdXN0IGJlIGVpdGhlciBhIHNsYXNoIG9yIHZhbGlkIGNoYXJhY3RlcnMgKGFscGhhbnVtZXJpY3MgYW5kIHN5bWJvbHMpIHN1cnJvdW5kZWQgYnkgc2xhc2hlcy4gJ1xuICAgICsgYFZhbGlkIGNoYXJhY3RlcnMgYXJlIHVuaWNvZGUgY2hhcmFjdGVycyBpbiBbXFxcXHUwMDIxLVxcXFx1MDA3Rl0uIEhvd2V2ZXIsICR7dmFsfSBpcyBwcm92aWRlZC5gO1xuICAgIGV4cGVjdCgoKSA9PiBuZXcgUm9sZShzdGFjaywgJ015Um9sZScsIHsgYXNzdW1lZEJ5LCBwYXRoOiAnL1xcdTAwMjBcXHUwMDgwLycgfSkpLnRvVGhyb3coZXhwZWN0ZWQoJy9cXHUwMDIwXFx1MDA4MC8nKSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdtYXhTZXNzaW9uRHVyYXRpb24nLCAoKSA9PiB7XG5cbiAgICB0ZXN0KCdpcyBub3Qgc3BlY2lmaWVkIGJ5IGRlZmF1bHQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgbmV3IFJvbGUoc3RhY2ssICdNeVJvbGUnLCB7IGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ3Nucy5hbWF6b25hd3MuY29tJykgfSk7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICAgIFJlc291cmNlczoge1xuICAgICAgICAgIE15Um9sZUY0OEZGRTA0OiB7XG4gICAgICAgICAgICBUeXBlOiAnQVdTOjpJQU06OlJvbGUnLFxuICAgICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgICBBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgQWN0aW9uOiAnc3RzOkFzc3VtZVJvbGUnLFxuICAgICAgICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgICAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICAgICAgICAgICAgICAgIFNlcnZpY2U6ICdzbnMuYW1hem9uYXdzLmNvbScsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjYW4gYmUgdXNlZCB0byBzcGVjaWZ5IHRoZSBtYXhpbXVtIHNlc3Npb24gZHVyYXRpb24gZm9yIGFzc3VtaW5nIHRoZSByb2xlJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgICAgbmV3IFJvbGUoc3RhY2ssICdNeVJvbGUnLCB7IG1heFNlc3Npb25EdXJhdGlvbjogRHVyYXRpb24uc2Vjb25kcygzNzAwKSwgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgnc25zLmFtYXpvbmF3cy5jb20nKSB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpSb2xlJywge1xuICAgICAgICBNYXhTZXNzaW9uRHVyYXRpb246IDM3MDAsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ211c3QgYmUgYmV0d2VlbiAzNjAwIGFuZCA0MzIwMCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAgIGNvbnN0IGFzc3VtZWRCeSA9IG5ldyBTZXJ2aWNlUHJpbmNpcGFsKCdibGEnKTtcblxuICAgICAgbmV3IFJvbGUoc3RhY2ssICdNeVJvbGUxJywgeyBhc3N1bWVkQnksIG1heFNlc3Npb25EdXJhdGlvbjogRHVyYXRpb24uaG91cnMoMSkgfSk7XG4gICAgICBuZXcgUm9sZShzdGFjaywgJ015Um9sZTInLCB7IGFzc3VtZWRCeSwgbWF4U2Vzc2lvbkR1cmF0aW9uOiBEdXJhdGlvbi5ob3VycygxMikgfSk7XG5cbiAgICAgIGNvbnN0IGV4cGVjdGVkID0gKHZhbDogYW55KSA9PiBgbWF4U2Vzc2lvbkR1cmF0aW9uIGlzIHNldCB0byAke3ZhbH0sIGJ1dCBtdXN0IGJlID49IDM2MDBzZWMgKDFocikgYW5kIDw9IDQzMjAwc2VjICgxMmhycylgO1xuICAgICAgZXhwZWN0KCgpID0+IG5ldyBSb2xlKHN0YWNrLCAnTXlSb2xlMycsIHsgYXNzdW1lZEJ5LCBtYXhTZXNzaW9uRHVyYXRpb246IER1cmF0aW9uLm1pbnV0ZXMoMSkgfSkpXG4gICAgICAgIC50b1Rocm93KGV4cGVjdGVkKDYwKSk7XG4gICAgICBleHBlY3QoKCkgPT4gbmV3IFJvbGUoc3RhY2ssICdNeVJvbGU0JywgeyBhc3N1bWVkQnksIG1heFNlc3Npb25EdXJhdGlvbjogRHVyYXRpb24uc2Vjb25kcygzNTk5KSB9KSlcbiAgICAgICAgLnRvVGhyb3coZXhwZWN0ZWQoMzU5OSkpO1xuICAgICAgZXhwZWN0KCgpID0+IG5ldyBSb2xlKHN0YWNrLCAnTXlSb2xlNScsIHsgYXNzdW1lZEJ5LCBtYXhTZXNzaW9uRHVyYXRpb246IER1cmF0aW9uLnNlY29uZHMoNDMyMDEpIH0pKVxuICAgICAgICAudG9UaHJvdyhleHBlY3RlZCg0MzIwMSkpO1xuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdhbGxvdyByb2xlIHdpdGggbXVsdGlwbGUgcHJpbmNpcGFscycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgbmV3IFJvbGUoc3RhY2ssICdNeVJvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBDb21wb3NpdGVQcmluY2lwYWwoXG4gICAgICAgIG5ldyBTZXJ2aWNlUHJpbmNpcGFsKCdib29tLmFtYXpvbmF3cy50ZXN0JyksXG4gICAgICAgIG5ldyBBcm5QcmluY2lwYWwoJzExMTExMTEnKSxcbiAgICAgICksXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlJvbGUnLCB7XG4gICAgICBBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiAnc3RzOkFzc3VtZVJvbGUnLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUHJpbmNpcGFsOiB7XG4gICAgICAgICAgICAgIFNlcnZpY2U6ICdib29tLmFtYXpvbmF3cy50ZXN0JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICAgICAgQVdTOiAnMTExMTExMScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBzdXBwbHkgcGVybWlzc2lvbnMgYm91bmRhcnkgbWFuYWdlZCBwb2xpY3knLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3QgcGVybWlzc2lvbnNCb3VuZGFyeSA9IE1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdtYW5hZ2VkLXBvbGljeScpO1xuXG4gICAgbmV3IFJvbGUoc3RhY2ssICdNeVJvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBTZXJ2aWNlUHJpbmNpcGFsKCdzbnMuYW1hem9uYXdzLmNvbScpLFxuICAgICAgcGVybWlzc2lvbnNCb3VuZGFyeSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6Um9sZScsIHtcbiAgICAgIFBlcm1pc3Npb25zQm91bmRhcnk6IHtcbiAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICcnLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICc6aWFtOjphd3M6cG9saWN5L21hbmFnZWQtcG9saWN5JyxcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnUHJpbmNpcGFsLSogaW4gYW4gQXNzdW1lUm9sZVBvbGljeURvY3VtZW50IGdldHMgdHJhbnNsYXRlZCB0byB7IFwiQVdTXCI6IFwiKlwiIH0nLCAoKSA9PiB7XG4gICAgLy8gVGhlIGRvY3Mgc2F5IHRoYXQgXCJQcmluY2lwYWw6ICpcIiBhbmQgXCJQcmluY2lwYWw6IHsgQVdTOiAqIH1cIiBhcmUgZXF1aXZhbGVudFxuICAgIC8vIChodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vSUFNL2xhdGVzdC9Vc2VyR3VpZGUvcmVmZXJlbmNlX3BvbGljaWVzX2VsZW1lbnRzX3ByaW5jaXBhbC5odG1sKVxuICAgIC8vIGJ1dCBpbiBwcmFjdGljZSBDcmVhdGVSb2xlIGVycm9ycyBvdXQgaWYgeW91IHVzZSBcIlByaW5jaXBhbDogKlwiIGluIGFuIEFzc3VtZVJvbGVQb2xpY3lEb2N1bWVudDpcbiAgICAvLyBBbiBlcnJvciBvY2N1cnJlZCAoTWFsZm9ybWVkUG9saWN5RG9jdW1lbnQpIHdoZW4gY2FsbGluZyB0aGUgQ3JlYXRlUm9sZSBvcGVyYXRpb246IEFzc3VtZVJvbGVwb2xpY3kgY29udGFpbmVkIGFuIGludmFsaWQgcHJpbmNpcGFsOiBcIlNUQVJcIjpcIipcIi5cblxuICAgIC8vIE1ha2Ugc3VyZSB0aGF0IHdlIGhhbmRsZSB0aGlzIGNhc2Ugc3BlY2lhbGx5LlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgbmV3IFJvbGUoc3RhY2ssICdSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgQW55UHJpbmNpcGFsKCksXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlJvbGUnLCB7XG4gICAgICBBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiAnc3RzOkFzc3VtZVJvbGUnLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUHJpbmNpcGFsOiB7IEFXUzogJyonIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGhhdmUgYSBkZXNjcmlwdGlvbicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgbmV3IFJvbGUoc3RhY2ssICdNeVJvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBTZXJ2aWNlUHJpbmNpcGFsKCdzbnMuYW1hem9uYXdzLmNvbScpLFxuICAgICAgZGVzY3JpcHRpb246ICdUaGlzIGlzIGEgcm9sZSBkZXNjcmlwdGlvbi4nLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUmVzb3VyY2VzOlxuICAgICAge1xuICAgICAgICBNeVJvbGVGNDhGRkUwNDpcbiAgICAgICAgIHtcbiAgICAgICAgICAgVHlwZTogJ0FXUzo6SUFNOjpSb2xlJyxcbiAgICAgICAgICAgUHJvcGVydGllczpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQ6XG4gICAgICAgICAgIHtcbiAgICAgICAgICAgICBTdGF0ZW1lbnQ6XG4gICAgICAgICAgICBbe1xuICAgICAgICAgICAgICBBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUHJpbmNpcGFsOiB7IFNlcnZpY2U6ICdzbnMuYW1hem9uYXdzLmNvbScgfSxcbiAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICAgfSxcbiAgICAgICAgICAgIERlc2NyaXB0aW9uOiAnVGhpcyBpcyBhIHJvbGUgZGVzY3JpcHRpb24uJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Nob3VsZCBub3QgaGF2ZSBhbiBlbXB0eSBkZXNjcmlwdGlvbicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgbmV3IFJvbGUoc3RhY2ssICdNeVJvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBTZXJ2aWNlUHJpbmNpcGFsKCdzbnMuYW1hem9uYXdzLmNvbScpLFxuICAgICAgZGVzY3JpcHRpb246ICcnLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUmVzb3VyY2VzOlxuICAgICAge1xuICAgICAgICBNeVJvbGVGNDhGRkUwNDpcbiAgICAgICAgIHtcbiAgICAgICAgICAgVHlwZTogJ0FXUzo6SUFNOjpSb2xlJyxcbiAgICAgICAgICAgUHJvcGVydGllczpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQ6XG4gICAgICAgICAgIHtcbiAgICAgICAgICAgICBTdGF0ZW1lbnQ6XG4gICAgICAgICAgICBbe1xuICAgICAgICAgICAgICBBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUHJpbmNpcGFsOiB7IFNlcnZpY2U6ICdzbnMuYW1hem9uYXdzLmNvbScgfSxcbiAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Rlc2NyaXB0aW9uIGNhbiBvbmx5IGJlIDEwMDAgY2hhcmFjdGVycyBsb25nJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IFJvbGUoc3RhY2ssICdNeVJvbGUnLCB7XG4gICAgICAgIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ3Nucy5hbWF6b25hd3MuY29tJyksXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnMTAwMCsgY2hhcmFjdGVyIGxvbmcgZGVzY3JpcHRpb246IExvcmVtIGlwc3VtIGRvbG9yIHNpdCBhbWV0LCBjb25zZWN0ZXR1ZXIgYWRpcGlzY2luZyBlbGl0LiBcXFxuICAgICAgICBBZW5lYW4gY29tbW9kbyBsaWd1bGEgZWdldCBkb2xvci4gQWVuZWFuIG1hc3NhLiBDdW0gc29jaWlzIG5hdG9xdWUgcGVuYXRpYnVzIGV0IG1hZ25pcyBkaXMgcGFydHVyaWVudCBtb250ZXMsIFxcXG4gICAgICAgIG5hc2NldHVyIHJpZGljdWx1cyBtdXMuIERvbmVjIHF1YW0gZmVsaXMsIHVsdHJpY2llcyBuZWMsIHBlbGxlbnRlc3F1ZSBldSwgcHJldGl1bSBxdWlzLCBzZW0uIE51bGxhIGNvbnNlcXVhdCBcXFxuICAgICAgICBtYXNzYSBxdWlzIGVuaW0uIERvbmVjIHBlZGUganVzdG8sIGZyaW5naWxsYSB2ZWwsIGFsaXF1ZXQgbmVjLCB2dWxwdXRhdGUgZWdldCwgYXJjdS4gSW4gZW5pbSBqdXN0bywgcmhvbmN1cyB1dCwgXFxcbiAgICAgICAgaW1wZXJkaWV0IGEsIHZlbmVuYXRpcyB2aXRhZSwganVzdG8uIE51bGxhbSBkaWN0dW0gZmVsaXMgZXUgcGVkZSBtb2xsaXMgcHJldGl1bS4gSW50ZWdlciB0aW5jaWR1bnQuIENyYXMgZGFwaWJ1cy4gXFxcbiAgICAgICAgVml2YW11cyBlbGVtZW50dW0gc2VtcGVyIG5pc2kuIEFlbmVhbiB2dWxwdXRhdGUgZWxlaWZlbmQgdGVsbHVzLiBBZW5lYW4gbGVvIGxpZ3VsYSwgcG9ydHRpdG9yIGV1LCBjb25zZXF1YXQgdml0YWUsIFxcXG4gICAgICAgIGVsZWlmZW5kIGFjLCBlbmltLiBBbGlxdWFtIGxvcmVtIGFudGUsIGRhcGlidXMgaW4sIHZpdmVycmEgcXVpcywgZmV1Z2lhdCBhLCB0ZWxsdXMuIFBoYXNlbGx1cyB2aXZlcnJhIG51bGxhIHV0IG1ldHVzIFxcXG4gICAgICAgIHZhcml1cyBsYW9yZWV0LiBRdWlzcXVlIHJ1dHJ1bS4gQWVuZWFuIGltcGVyZGlldC4gRXRpYW0gdWx0cmljaWVzIG5pc2kgdmVsIGF1Z3VlLiBDdXJhYml0dXIgdWxsYW1jb3JwZXIgdWx0cmljaWVzIG5pc2kuIFxcXG4gICAgICAgIE5hbSBlZ2V0IGR1aS4gRXRpYW0gcmhvbmN1cy4gTWFlY2VuYXMgdGVtcHVzLCB0ZWxsdXMgZWdldCBjb25kaW1lbnR1bSByaG9uY3VzLCBzZW0gcXVhbSBzZW1wZXIgbGliZXJvLCBzaXQgYW1ldCBhZGlwaXNjaW5nIFxcXG4gICAgICAgIHNlbSBuZXF1ZSBzZWQgaXBzdW0uJyxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coL1JvbGUgZGVzY3JpcHRpb24gbXVzdCBiZSBubyBsb25nZXIgdGhhbiAxMDAwIGNoYXJhY3RlcnMuLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ZhaWxzIGlmIG1hbmFnZWQgcG9saWN5IGlzIGludmFsaWQnLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ215LXN0YWNrJyk7XG4gICAgbmV3IFJvbGUoc3RhY2ssICdNeVJvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBTZXJ2aWNlUHJpbmNpcGFsKCdzbnMuYW1hem9uYXdzLmNvbScpLFxuICAgICAgbWFuYWdlZFBvbGljaWVzOiBbbmV3IE1hbmFnZWRQb2xpY3koc3RhY2ssICdNeU1hbmFnZWRQb2xpY3knLCB7XG4gICAgICAgIHN0YXRlbWVudHM6IFtuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgICAgICAgIGFjdGlvbnM6IFsnKiddLFxuICAgICAgICAgIHByaW5jaXBhbHM6IFtuZXcgU2VydmljZVByaW5jaXBhbCgnc25zLmFtYXpvbmF3cy5jb20nKV0sXG4gICAgICAgIH0pXSxcbiAgICAgIH0pXSxcbiAgICB9KTtcblxuICAgIGV4cGVjdCgoKSA9PiBhcHAuc3ludGgoKSkudG9UaHJvdygvQSBQb2xpY3lTdGF0ZW1lbnQgdXNlZCBpbiBhbiBpZGVudGl0eS1iYXNlZCBwb2xpY3kgY2Fubm90IHNwZWNpZnkgYW55IElBTSBwcmluY2lwYWxzLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ZhaWxzIGlmIGRlZmF1bHQgcm9sZSBwb2xpY3kgaXMgaW52YWxpZCcsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnbXktc3RhY2snKTtcbiAgICBjb25zdCByb2xlID0gbmV3IFJvbGUoc3RhY2ssICdNeVJvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBTZXJ2aWNlUHJpbmNpcGFsKCdzbnMuYW1hem9uYXdzLmNvbScpLFxuICAgIH0pO1xuICAgIHJvbGUuYWRkVG9QcmluY2lwYWxQb2xpY3kobmV3IFBvbGljeVN0YXRlbWVudCh7XG4gICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgICAgYWN0aW9uczogWycqJ10sXG4gICAgICBwcmluY2lwYWxzOiBbbmV3IFNlcnZpY2VQcmluY2lwYWwoJ3Nucy5hbWF6b25hd3MuY29tJyldLFxuICAgIH0pKTtcblxuICAgIGV4cGVjdCgoKSA9PiBhcHAuc3ludGgoKSkudG9UaHJvdygvQSBQb2xpY3lTdGF0ZW1lbnQgdXNlZCBpbiBhbiBpZGVudGl0eS1iYXNlZCBwb2xpY3kgY2Fubm90IHNwZWNpZnkgYW55IElBTSBwcmluY2lwYWxzLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ZhaWxzIGlmIGlubGluZSBwb2xpY3kgZnJvbSBwcm9wcyBpcyBpbnZhbGlkJywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdteS1zdGFjaycpO1xuICAgIG5ldyBSb2xlKHN0YWNrLCAnTXlSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgnc25zLmFtYXpvbmF3cy5jb20nKSxcbiAgICAgIGlubGluZVBvbGljaWVzOiB7XG4gICAgICAgIHRlc3RQb2xpY3k6IG5ldyBQb2xpY3lEb2N1bWVudCh7XG4gICAgICAgICAgc3RhdGVtZW50czogW25ldyBQb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICAgICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICAgICAgICAgIGFjdGlvbnM6IFsnKiddLFxuICAgICAgICAgICAgcHJpbmNpcGFsczogW25ldyBTZXJ2aWNlUHJpbmNpcGFsKCdzbnMuYW1hem9uYXdzLmNvbScpXSxcbiAgICAgICAgICB9KV0sXG4gICAgICAgIH0pLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGV4cGVjdCgoKSA9PiBhcHAuc3ludGgoKSkudG9UaHJvdygvQSBQb2xpY3lTdGF0ZW1lbnQgdXNlZCBpbiBhbiBpZGVudGl0eS1iYXNlZCBwb2xpY3kgY2Fubm90IHNwZWNpZnkgYW55IElBTSBwcmluY2lwYWxzLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ZhaWxzIGlmIGF0dGFjaGVkIGlubGluZSBwb2xpY3kgaXMgaW52YWxpZCcsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnbXktc3RhY2snKTtcbiAgICBjb25zdCByb2xlID0gbmV3IFJvbGUoc3RhY2ssICdNeVJvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBTZXJ2aWNlUHJpbmNpcGFsKCdzbnMuYW1hem9uYXdzLmNvbScpLFxuICAgIH0pO1xuICAgIHJvbGUuYXR0YWNoSW5saW5lUG9saWN5KG5ldyBQb2xpY3koc3RhY2ssICdNeVBvbGljeScsIHtcbiAgICAgIHN0YXRlbWVudHM6IFtuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICAgICAgYWN0aW9uczogWycqJ10sXG4gICAgICAgIHByaW5jaXBhbHM6IFtuZXcgU2VydmljZVByaW5jaXBhbCgnc25zLmFtYXpvbmF3cy5jb20nKV0sXG4gICAgICB9KV0sXG4gICAgfSkpO1xuXG4gICAgZXhwZWN0KCgpID0+IGFwcC5zeW50aCgpKS50b1Rocm93KC9BIFBvbGljeVN0YXRlbWVudCB1c2VkIGluIGFuIGlkZW50aXR5LWJhc2VkIHBvbGljeSBjYW5ub3Qgc3BlY2lmeSBhbnkgSUFNIHByaW5jaXBhbHMvKTtcbiAgfSk7XG5cbiAgdGVzdCgnZmFpbHMgaWYgYXNzdW1lUm9sZVBvbGljeSBpcyBpbnZhbGlkJywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdteS1zdGFjaycpO1xuICAgIGNvbnN0IHJvbGUgPSBuZXcgUm9sZShzdGFjaywgJ015Um9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ3Nucy5hbWF6b25hd3MuY29tJyksXG4gICAgICBtYW5hZ2VkUG9saWNpZXM6IFtuZXcgTWFuYWdlZFBvbGljeShzdGFjaywgJ015TWFuYWdlZFBvbGljeScpXSxcbiAgICB9KTtcbiAgICByb2xlLmFzc3VtZVJvbGVQb2xpY3k/LmFkZFN0YXRlbWVudHMobmV3IFBvbGljeVN0YXRlbWVudCh7IGFjdGlvbnM6IFsnKiddIH0pKTtcblxuICAgIGV4cGVjdCgoKSA9PiBhcHAuc3ludGgoKSkudG9UaHJvdygvQSBQb2xpY3lTdGF0ZW1lbnQgdXNlZCBpbiBhIHJlc291cmNlLWJhc2VkIHBvbGljeSBtdXN0IHNwZWNpZnkgYXQgbGVhc3Qgb25lIElBTSBwcmluY2lwYWwvKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ3Blcm1pc3Npb25zIGJvdW5kYXJ5JywgKCkgPT4ge1xuICB0ZXN0KCdjYW4gYmUgYXBwbGllZCB0byBhbiBhcHAnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKHtcbiAgICAgIGNvbnRleHQ6IHtcbiAgICAgICAgW1BFUk1JU1NJT05TX0JPVU5EQVJZX0NPTlRFWFRfS0VZXToge1xuICAgICAgICAgIG5hbWU6ICdjZGstJHtRdWFsaWZpZXJ9LVBlcm1pc3Npb25zQm91bmRhcnknLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHApO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBSb2xlKHN0YWNrLCAnUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ3Nucy5hbWF6b25hd3MuY29tJyksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpSb2xlJywge1xuICAgICAgUGVybWlzc2lvbnNCb3VuZGFyeToge1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJzppYW06OicsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnOnBvbGljeS9jZGstaG5iNjU5ZmRzLVBlcm1pc3Npb25zQm91bmRhcnknLFxuICAgICAgICAgIF0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gYmUgYXBwbGllZCB0byBhIHN0YWdlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWdlID0gbmV3IFN0YWdlKGFwcCwgJ1N0YWdlJywge1xuICAgICAgcGVybWlzc2lvbnNCb3VuZGFyeTogUGVybWlzc2lvbnNCb3VuZGFyeS5mcm9tTmFtZSgnY2RrLSR7UXVhbGlmaWVyfS1QZXJtaXNzaW9uc0JvdW5kYXJ5JyksXG4gICAgfSk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soc3RhZ2UpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBSb2xlKHN0YWNrLCAnUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ3Nucy5hbWF6b25hd3MuY29tJyksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpSb2xlJywge1xuICAgICAgUGVybWlzc2lvbnNCb3VuZGFyeToge1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJzppYW06OicsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnOnBvbGljeS9jZGstaG5iNjU5ZmRzLVBlcm1pc3Npb25zQm91bmRhcnknLFxuICAgICAgICAgIF0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gYmUgYXBwbGllZCB0byBhIHN0YWdlLCBhbmQgd2lsbCByZXBsYWNlIHBsYWNlaG9sZGVycycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFnZSA9IG5ldyBTdGFnZShhcHAsICdTdGFnZScsIHtcbiAgICAgIGVudjoge1xuICAgICAgICByZWdpb246ICd0ZXN0LXJlZ2lvbicsXG4gICAgICAgIGFjY291bnQ6ICcxMjM0NTY3ODkwMTInLFxuICAgICAgfSxcbiAgICAgIHBlcm1pc3Npb25zQm91bmRhcnk6IFBlcm1pc3Npb25zQm91bmRhcnkuZnJvbU5hbWUoJ2Nkay0ke1F1YWxpZmllcn0tUGVybWlzc2lvbnNCb3VuZGFyeS0ke0FXUzo6QWNjb3VudElkfS0ke0FXUzo6UmVnaW9ufScpLFxuICAgIH0pO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKHN0YWdlKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgUm9sZShzdGFjaywgJ1JvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBTZXJ2aWNlUHJpbmNpcGFsKCdzbnMuYW1hem9uYXdzLmNvbScpLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6Um9sZScsIHtcbiAgICAgIFBlcm1pc3Npb25zQm91bmRhcnk6IHtcbiAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICcnLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICc6aWFtOjoxMjM0NTY3ODkwMTI6cG9saWN5L2Nkay1obmI2NTlmZHMtUGVybWlzc2lvbnNCb3VuZGFyeS0xMjM0NTY3ODkwMTItdGVzdC1yZWdpb24nLFxuICAgICAgICAgIF0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd3aXRoIGEgY3VzdG9tIHF1YWxpZmllcicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFnZSA9IG5ldyBTdGFnZShhcHAsICdTdGFnZScsIHtcbiAgICAgIHBlcm1pc3Npb25zQm91bmRhcnk6IFBlcm1pc3Npb25zQm91bmRhcnkuZnJvbU5hbWUoJ2Nkay0ke1F1YWxpZmllcn0tUGVybWlzc2lvbnNCb3VuZGFyeScpLFxuICAgIH0pO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKHN0YWdlLCAnTXlTdGFjaycsIHtcbiAgICAgIHN5bnRoZXNpemVyOiBuZXcgRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXIoe1xuICAgICAgICBxdWFsaWZpZXI6ICdjdXN0b20nLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IFJvbGUoc3RhY2ssICdSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgnc25zLmFtYXpvbmF3cy5jb20nKSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlJvbGUnLCB7XG4gICAgICBQZXJtaXNzaW9uc0JvdW5kYXJ5OiB7XG4gICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnOmlhbTo6JyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgUmVmOiAnQVdTOjpBY2NvdW50SWQnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICc6cG9saWN5L2Nkay1jdXN0b20tUGVybWlzc2lvbnNCb3VuZGFyeScsXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3dpdGggYSBjdXN0b20gcGVybWlzc2lvbnMgYm91bmRhcnknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhZ2UgPSBuZXcgU3RhZ2UoYXBwLCAnU3RhZ2UnLCB7XG4gICAgICBwZXJtaXNzaW9uc0JvdW5kYXJ5OiBQZXJtaXNzaW9uc0JvdW5kYXJ5LmZyb21OYW1lKCdteS1wZXJtaXNzaW9ucy1ib3VuZGFyeScpLFxuICAgIH0pO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKHN0YWdlKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgUm9sZShzdGFjaywgJ1JvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBTZXJ2aWNlUHJpbmNpcGFsKCdzbnMuYW1hem9uYXdzLmNvbScpLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6Um9sZScsIHtcbiAgICAgIFBlcm1pc3Npb25zQm91bmRhcnk6IHtcbiAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICcnLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICc6aWFtOjonLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBSZWY6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJzpwb2xpY3kvbXktcGVybWlzc2lvbnMtYm91bmRhcnknLFxuICAgICAgICAgIF0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd3aXRoIGEgY3VzdG9tIHBlcm1pc3Npb25zIGJvdW5kYXJ5IGFuZCBxdWFsaWZpZXInLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhZ2UgPSBuZXcgU3RhZ2UoYXBwLCAnU3RhZ2UnLCB7XG4gICAgICBwZXJtaXNzaW9uc0JvdW5kYXJ5OiBQZXJtaXNzaW9uc0JvdW5kYXJ5LmZyb21OYW1lKCdteS0ke1F1YWxpZmllcn0tcGVybWlzc2lvbnMtYm91bmRhcnknKSxcbiAgICB9KTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhzdGFnZSwgJ015U3RhY2snLCB7XG4gICAgICBzeW50aGVzaXplcjogbmV3IENsaUNyZWRlbnRpYWxzU3RhY2tTeW50aGVzaXplcih7XG4gICAgICAgIHF1YWxpZmllcjogJ2N1c3RvbScsXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgUm9sZShzdGFjaywgJ1JvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBTZXJ2aWNlUHJpbmNpcGFsKCdzbnMuYW1hem9uYXdzLmNvbScpLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6Um9sZScsIHtcbiAgICAgIFBlcm1pc3Npb25zQm91bmRhcnk6IHtcbiAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICcnLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICc6aWFtOjonLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBSZWY6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJzpwb2xpY3kvbXktY3VzdG9tLXBlcm1pc3Npb25zLWJvdW5kYXJ5JyxcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbn0pO1xuXG50ZXN0KCdtYW5hZ2VkIHBvbGljeSBBUk5zIGFyZSBkZWR1cGxpY2F0ZWQnLCAoKSA9PiB7XG4gIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnbXktc3RhY2snKTtcbiAgY29uc3Qgcm9sZSA9IG5ldyBSb2xlKHN0YWNrLCAnTXlSb2xlJywge1xuICAgIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ3Nucy5hbWF6b25hd3MuY29tJyksXG4gICAgbWFuYWdlZFBvbGljaWVzOiBbXG4gICAgICBNYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZSgnU3VwZXJEZXZlbG9wZXInKSxcbiAgICAgIE1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdTdXBlckRldmVsb3BlcicpLFxuICAgIF0sXG4gIH0pO1xuICByb2xlLmFkZE1hbmFnZWRQb2xpY3koTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoJ1N1cGVyRGV2ZWxvcGVyJykpO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6Um9sZScsIHtcbiAgICBNYW5hZ2VkUG9saWN5QXJuczogW1xuICAgICAge1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgICAgICc6aWFtOjphd3M6cG9saWN5L1N1cGVyRGV2ZWxvcGVyJyxcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICBdLFxuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgncm9sZSB3aXRoIHRvbyBsYXJnZSBpbmxpbmUgcG9saWN5JywgKCkgPT4ge1xuICBjb25zdCBOID0gMTAwO1xuXG4gIGxldCBhcHA6IEFwcDtcbiAgbGV0IHN0YWNrOiBTdGFjaztcbiAgbGV0IHJvbGU6IFJvbGU7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIGFwcCA9IG5ldyBBcHAoKTtcbiAgICBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdteS1zdGFjaycpO1xuICAgIHJvbGUgPSBuZXcgUm9sZShzdGFjaywgJ015Um9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ3NlcnZpY2UuYW1hem9uYXdzLmNvbScpLFxuICAgIH0pO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBOOyBpKyspIHtcbiAgICAgIHJvbGUuYWRkVG9QcmluY2lwYWxQb2xpY3kobmV3IFBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgIGFjdGlvbnM6IFsnYXdzOkRvQVRoaW5nJ10sXG4gICAgICAgIHJlc291cmNlczogW2Bhcm46YXdzOnNlcnZpY2U6dXMtZWFzdC0xOjExMTEyMjIyMzMzMzpzb21lUmVzb3VyY2UvU29tZVNwZWNpZmljUmVzb3VyY2Uke2l9YF0sXG4gICAgICB9KSk7XG4gICAgfVxuICB9KTtcblxuICB0ZXN0KCdleGNlc3MgZ2V0cyBzcGxpdCBvZmYgaW50byBNYW5hZ2VkUG9saWNpZXMnLCAoKSA9PiB7XG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbiAgICB0ZW1wbGF0ZS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpNYW5hZ2VkUG9saWN5Jywge1xuICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgU3RhdGVtZW50OiBNYXRjaC5hcnJheVdpdGgoW1xuICAgICAgICAgIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgICAgUmVzb3VyY2U6IGBhcm46YXdzOnNlcnZpY2U6dXMtZWFzdC0xOjExMTEyMjIyMzMzMzpzb21lUmVzb3VyY2UvU29tZVNwZWNpZmljUmVzb3VyY2Uke04gLSAxfWAsXG4gICAgICAgICAgfSksXG4gICAgICAgIF0pLFxuICAgICAgfSxcbiAgICAgIFJvbGVzOiBbeyBSZWY6ICdNeVJvbGVGNDhGRkUwNCcgfV0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0RlcGVuZGFibGVzIHRyYWNrIHRoZSBmaW5hbCBkZWNsYXJpbmcgY29uc3RydWN0JywgKCkgPT4ge1xuICAgIC8vIFdIRU5cbiAgICBjb25zdCByZXN1bHQgPSByb2xlLmFkZFRvUHJpbmNpcGFsUG9saWN5KG5ldyBQb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgYWN0aW9uczogWydhd3M6RG9BVGhpbmcnXSxcbiAgICAgIHJlc291cmNlczogW2Bhcm46YXdzOnNlcnZpY2U6dXMtZWFzdC0xOjExMTEyMjIyMzMzMzpzb21lUmVzb3VyY2UvU29tZVNwZWNpZmljUmVzb3VyY2Uke059YF0sXG4gICAgfSkpO1xuXG4gICAgY29uc3QgcmVzID0gbmV3IENmblJlc291cmNlKHN0YWNrLCAnRGVwZW5kZXInLCB7XG4gICAgICB0eXBlOiAnQVdTOjpTb21lOjpSZXNvdXJjZScsXG4gICAgfSk7XG5cbiAgICBleHBlY3QocmVzdWx0LnBvbGljeURlcGVuZGFibGUpLnRvQmVUcnV0aHkoKTtcbiAgICByZXMubm9kZS5hZGREZXBlbmRlbmN5KHJlc3VsdC5wb2xpY3lEZXBlbmRhYmxlISk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgdGVtcGxhdGUgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICAgIHRlbXBsYXRlLmhhc1Jlc291cmNlKCdBV1M6OlNvbWU6OlJlc291cmNlJywge1xuICAgICAgRGVwZW5kc09uOiBbXG4gICAgICAgICdNeVJvbGVPdmVyZmxvd1BvbGljeTEzRUY1NTk2QScsXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcbn0pO1xuXG50ZXN0KCdtYW55IGNvcGllcyBvZiB0aGUgc2FtZSBzdGF0ZW1lbnQgZG8gbm90IHJlc3VsdCBpbiBvdmVyZmxvdyBwb2xpY2llcycsICgpID0+IHtcbiAgY29uc3QgTiA9IDEwMDtcblxuICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ215LXN0YWNrJyk7XG4gIGNvbnN0IHJvbGUgPSBuZXcgUm9sZShzdGFjaywgJ015Um9sZScsIHtcbiAgICBhc3N1bWVkQnk6IG5ldyBTZXJ2aWNlUHJpbmNpcGFsKCdzZXJ2aWNlLmFtYXpvbmF3cy5jb20nKSxcbiAgfSk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBOOyBpKyspIHtcbiAgICByb2xlLmFkZFRvUHJpbmNpcGFsUG9saWN5KG5ldyBQb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgYWN0aW9uczogWydhd3M6RG9BVGhpbmcnXSxcbiAgICAgIHJlc291cmNlczogWydhcm46YXdzOnNlcnZpY2U6dXMtZWFzdC0xOjExMTEyMjIyMzMzMzpzb21lUmVzb3VyY2UvU29tZVNwZWNpZmljUmVzb3VyY2UnXSxcbiAgICB9KSk7XG4gIH1cblxuICAvLyBUSEVOXG4gIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbiAgdGVtcGxhdGUucmVzb3VyY2VDb3VudElzKCdBV1M6OklBTTo6TWFuYWdlZFBvbGljeScsIDApO1xufSk7XG5cbnRlc3QoJ2Nyb3NzLWVudiByb2xlIEFSTnMgaW5jbHVkZSBwYXRoJywgKCkgPT4ge1xuICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gIGNvbnN0IHJvbGVTdGFjayA9IG5ldyBTdGFjayhhcHAsICdyb2xlLXN0YWNrJywgeyBlbnY6IHsgYWNjb3VudDogJzEyMzQ1Njc4OTAxMicsIHJlZ2lvbjogJ3VzLWVhc3QtMScgfSB9KTtcbiAgY29uc3QgcmVmZXJlbmNlclN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ3JlZmVyZW5jZXItc3RhY2snLCB7IGVudjogeyByZWdpb246ICd1cy1lYXN0LTInIH0gfSk7XG4gIGNvbnN0IHJvbGUgPSBuZXcgUm9sZShyb2xlU3RhY2ssICdSb2xlJywge1xuICAgIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ3Nucy5hbWF6b25hd3MuY29tJyksXG4gICAgcGF0aDogJy9zYW1wbGUvcGF0aC8nLFxuICAgIHJvbGVOYW1lOiAnc2FtcGxlLW5hbWUnLFxuICB9KTtcbiAgbmV3IENmblJlc291cmNlKHJlZmVyZW5jZXJTdGFjaywgJ1JlZmVyZW5jZXInLCB7XG4gICAgdHlwZTogJ0N1c3RvbTo6Um9sZVJlZmVyZW5jZXInLFxuICAgIHByb3BlcnRpZXM6IHsgUm9sZUFybjogcm9sZS5yb2xlQXJuIH0sXG4gIH0pO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhyZWZlcmVuY2VyU3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQ3VzdG9tOjpSb2xlUmVmZXJlbmNlcicsIHtcbiAgICBSb2xlQXJuOiB7XG4gICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICcnLFxuICAgICAgICBbXG4gICAgICAgICAgJ2FybjonLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgICc6aWFtOjoxMjM0NTY3ODkwMTI6cm9sZS9zYW1wbGUvcGF0aC9zYW1wbGUtbmFtZScsXG4gICAgICAgIF0sXG4gICAgICBdLFxuICAgIH0sXG4gIH0pO1xufSk7XG4iXX0=