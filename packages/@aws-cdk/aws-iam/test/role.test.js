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
    (0, cdk_build_tools_1.testDeprecated)('can supply externalId', () => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9sZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicm9sZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQW1FO0FBQ25FLDhEQUEwRDtBQUMxRCx3Q0FBOE07QUFDOU0sMkNBQXVDO0FBQ3ZDLGdDQUEwTDtBQUUxTCxRQUFRLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxFQUFFO0lBQ2hDLElBQUksQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLEVBQUU7UUFDdkMsUUFBUTtRQUNSLE1BQU0sR0FBRyxHQUFHLElBQUksVUFBRyxFQUFFLENBQUM7UUFDdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3hDLE9BQU87UUFDUCxNQUFNLFFBQVEsR0FBRyxJQUFJLFVBQUksQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO1lBQ3ZDLFNBQVMsRUFBRSxJQUFJLHNCQUFnQixDQUFDLG1CQUFtQixDQUFDO1NBQ3JELENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxNQUFNLENBQUMsVUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMzQyxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx1Q0FBdUMsRUFBRSxHQUFHLEVBQUU7UUFDakQsUUFBUTtRQUNSLE1BQU0sR0FBRyxHQUFHLElBQUksVUFBRyxFQUFFLENBQUM7UUFDdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3hDLE9BQU87UUFDUCxNQUFNLFlBQVksR0FBRyxVQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDOUUsT0FBTztRQUNQLE1BQU0sQ0FBQyxVQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxD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RUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUMxRyxNQUFNLGVBQWUsR0FBRyxJQUFJLFlBQUssQ0FBQyxHQUFHLEVBQUUsa0JBQWtCLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzdGLE1BQU0sSUFBSSxHQUFHLElBQUksVUFBSSxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUU7UUFDdkMsU0FBUyxFQUFFLElBQUksc0JBQWdCLENBQUMsbUJBQW1CLENBQUM7UUFDcEQsSUFBSSxFQUFFLGVBQWU7UUFDckIsUUFBUSxFQUFFLGFBQWE7S0FDeEIsQ0FBQyxDQUFDO0lBQ0gsSUFBSSxrQkFBVyxDQUFDLGVBQWUsRUFBRSxZQUFZLEVBQUU7UUFDN0MsSUFBSSxFQUFFLHdCQUF3QjtRQUM5QixVQUFVLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRTtLQUN0QyxDQUFDLENBQUM7SUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBd0IsRUFBRTtRQUNsRixPQUFPLEVBQUU7WUFDUCxVQUFVLEVBQUU7Z0JBQ1YsRUFBRTtnQkFDRjtvQkFDRSxNQUFNO29CQUNOO3dCQUNFLEdBQUcsRUFBRSxnQkFBZ0I7cUJBQ3RCO29CQUNELGlEQUFpRDtpQkFDbEQ7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSwgTWF0Y2gsIEFubm90YXRpb25zIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgeyB0ZXN0RGVwcmVjYXRlZCB9IGZyb20gJ0Bhd3MtY2RrL2Nkay1idWlsZC10b29scyc7XG5pbXBvcnQgeyBEdXJhdGlvbiwgU3RhY2ssIEFwcCwgQ2ZuUmVzb3VyY2UsIFJlbW92YWxQb2xpY3ksIExhenksIFN0YWdlLCBEZWZhdWx0U3RhY2tTeW50aGVzaXplciwgQ2xpQ3JlZGVudGlhbHNTdGFja1N5bnRoZXNpemVyLCBQRVJNSVNTSU9OU19CT1VOREFSWV9DT05URVhUX0tFWSwgUGVybWlzc2lvbnNCb3VuZGFyeSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBBbnlQcmluY2lwYWwsIEFyblByaW5jaXBhbCwgQ29tcG9zaXRlUHJpbmNpcGFsLCBGZWRlcmF0ZWRQcmluY2lwYWwsIE1hbmFnZWRQb2xpY3ksIFBvbGljeVN0YXRlbWVudCwgUm9sZSwgU2VydmljZVByaW5jaXBhbCwgVXNlciwgUG9saWN5LCBQb2xpY3lEb2N1bWVudCwgRWZmZWN0IH0gZnJvbSAnLi4vbGliJztcblxuZGVzY3JpYmUoJ2lzUm9sZSgpIHJldHVybnMnLCAoKSA9PiB7XG4gIHRlc3QoJ3RydWUgaWYgZ2l2ZW4gUm9sZSBpbnN0YW5jZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdNeVN0YWNrJyk7XG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHB1cmVSb2xlID0gbmV3IFJvbGUoc3RhY2ssICdSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgnc25zLmFtYXpvbmF3cy5jb20nKSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoUm9sZS5pc1JvbGUocHVyZVJvbGUpKS50b0JlKHRydWUpO1xuICB9KTtcblxuICB0ZXN0KCdmYWxzZSBpZiBnaXZlbiBpbXBvcnRlZCByb2xlIGluc3RhbmNlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ015U3RhY2snKTtcbiAgICAvLyBXSEVOXG4gICAgY29uc3QgaW1wb3J0ZWRSb2xlID0gUm9sZS5mcm9tUm9sZU5hbWUoc3RhY2ssICdJbXBvcnRlZFJvbGUnLCAnSW1wb3J0ZWRSb2xlJyk7XG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChSb2xlLmlzUm9sZShpbXBvcnRlZFJvbGUpKS50b0JlKGZhbHNlKTtcbiAgfSk7XG5cbiAgdGVzdCgnZmFsc2UgaWYgZ2l2ZW4gdW5kZWZpbmVkJywgKCkgPT4ge1xuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoUm9sZS5pc1JvbGUodW5kZWZpbmVkKSkudG9CZShmYWxzZSk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdjdXN0b21pemVSb2xlcycsICgpID0+IHtcbiAgdGVzdCgndGhyb3dzIGlmIHByZWNyZWF0ZWRSb2xlcyBpcyBub3QgdXNlZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBSb2xlLmN1c3RvbWl6ZVJvbGVzKGFwcCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnTXlTdGFjaycpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBSb2xlKHN0YWNrLCAnUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ3Nucy5hbWF6b25hd3MuY29tJyksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgQW5ub3RhdGlvbnMuZnJvbVN0YWNrKHN0YWNrKS5oYXNFcnJvcignL015U3RhY2svUm9sZScsIE1hdGNoLnN0cmluZ0xpa2VSZWdleHAoJ0lBTSBSb2xlIGlzIGJlaW5nIGNyZWF0ZWQgYXQgcGF0aCBcIk15U3RhY2svUm9sZVwiJykpO1xuICB9KTtcblxuICB0ZXN0KCd0aHJvd3MgaWYgcHJlY3JlYXRlZFJvbGVzIGhhcyBhIHRva2VuJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIFJvbGUuY3VzdG9taXplUm9sZXMoYXBwLCB7XG4gICAgICB1c2VQcmVjcmVhdGVkUm9sZXM6IHtcbiAgICAgICAgJ015U3RhY2svUm9sZSc6IExhenkuc3RyaW5nKHsgcHJvZHVjZTogKCkgPT4gJ1JvbGVOYW1lJyB9KSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnTXlTdGFjaycpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBSb2xlKHN0YWNrLCAnUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ3Nucy5hbWF6b25hd3MuY29tJyksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgQW5ub3RhdGlvbnMuZnJvbVN0YWNrKHN0YWNrKS5oYXNFcnJvcignL015U3RhY2svUm9sZScsIE1hdGNoLnN0cmluZ0xpa2VSZWdleHAoJ0Nhbm5vdCByZXNvbHZlIHByZWNyZWF0ZWQgcm9sZSBuYW1lIGF0IHBhdGggXCJNeVN0YWNrL1JvbGVcIicpKTtcbiAgfSk7XG5cbiAgdGVzdCgnZG9lcyBub3QgdGhyb3cgaWYgcHJldmVudFN5bnRoZXNpcz1mYWxzZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBSb2xlLmN1c3RvbWl6ZVJvbGVzKGFwcCwge1xuICAgICAgcHJldmVudFN5bnRoZXNpczogZmFsc2UsXG4gICAgfSk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnTXlTdGFjaycpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBSb2xlKHN0YWNrLCAnUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ3Nucy5hbWF6b25hd3MuY29tJyksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgLy8gbm8gYW5ub3RhdGlvbnNcbiAgICBjb25zdCBhbm5vdGF0aW9ucyA9IEFubm90YXRpb25zLmZyb21TdGFjayhzdGFjayk7XG4gICAgYW5ub3RhdGlvbnMuaGFzTm9FcnJvcignTXlTdGFjay9Sb2xlJywgTWF0Y2guc3RyaW5nTGlrZVJlZ2V4cCgnKicpKTtcblxuICAgIC8vIGFuZCByZXNvdXJjZSBpcyBzdGlsbCBzeW50aGVzaXplZFxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OklBTTo6Um9sZScsIDEpO1xuICB9KTtcblxuICB0ZXN0KCd3b3JrcyBhdCB0aGUgYXBwIHNjb3BlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIFJvbGUuY3VzdG9taXplUm9sZXMoYXBwLCB7XG4gICAgICB1c2VQcmVjcmVhdGVkUm9sZXM6IHtcbiAgICAgICAgJ015U3RhY2svUm9sZSc6ICdTb21lUm9sZU5hbWUnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdNeVN0YWNrJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3Qgcm9sZSA9IG5ldyBSb2xlKHN0YWNrLCAnUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ3Nucy5hbWF6b25hd3MuY29tJyksXG4gICAgfSk7XG4gICAgbmV3IENmblJlc291cmNlKHN0YWNrLCAnTXlSZXNvdXJjZScsIHtcbiAgICAgIHR5cGU6ICdBV1M6OkN1c3RvbScsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIFJvbGU6IHJvbGUucm9sZU5hbWUsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbiAgICB0ZW1wbGF0ZS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6SUFNOjpSb2xlJywgMCk7XG4gICAgdGVtcGxhdGUuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkN1c3RvbScsIHtcbiAgICAgIFJvbGU6ICdTb21lUm9sZU5hbWUnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd3b3JrcyBhdCBhIHJlbGF0aXZlIHNjb3BlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ015U3RhY2snKTtcbiAgICBjb25zdCBzdWJTY29wZSA9IG5ldyBDb25zdHJ1Y3Qoc3RhY2ssICdTb21lQ29uc3RydWN0Jyk7XG4gICAgUm9sZS5jdXN0b21pemVSb2xlcyhzdWJTY29wZSwge1xuICAgICAgdXNlUHJlY3JlYXRlZFJvbGVzOiB7XG4gICAgICAgIFJvbGU6ICdTb21lUm9sZU5hbWUnLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCByb2xlID0gbmV3IFJvbGUoc3ViU2NvcGUsICdSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgnc25zLmFtYXpvbmF3cy5jb20nKSxcbiAgICB9KTtcbiAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3ViU2NvcGUsICdNeVJlc291cmNlJywge1xuICAgICAgdHlwZTogJ0FXUzo6Q3VzdG9tJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgUm9sZTogcm9sZS5yb2xlTmFtZSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgdGVtcGxhdGUgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICAgIHRlbXBsYXRlLnJlc291cmNlQ291bnRJcygnQVdTOjpJQU06OlJvbGUnLCAwKTtcbiAgICB0ZW1wbGF0ZS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q3VzdG9tJywge1xuICAgICAgUm9sZTogJ1NvbWVSb2xlTmFtZScsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3dvcmtzIGF0IGFuIGFic29sdXRlIHNjb3BlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ015U3RhY2snKTtcbiAgICBjb25zdCBzdWJTY29wZSA9IG5ldyBDb25zdHJ1Y3Qoc3RhY2ssICdTb21lQ29uc3RydWN0Jyk7XG4gICAgUm9sZS5jdXN0b21pemVSb2xlcyhzdWJTY29wZSwge1xuICAgICAgdXNlUHJlY3JlYXRlZFJvbGVzOiB7XG4gICAgICAgICdNeVN0YWNrL1NvbWVDb25zdHJ1Y3QvUm9sZSc6ICdTb21lUm9sZU5hbWUnLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCByb2xlID0gbmV3IFJvbGUoc3ViU2NvcGUsICdSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgnc25zLmFtYXpvbmF3cy5jb20nKSxcbiAgICB9KTtcbiAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3ViU2NvcGUsICdNeVJlc291cmNlJywge1xuICAgICAgdHlwZTogJ0FXUzo6Q3VzdG9tJyxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgUm9sZTogcm9sZS5yb2xlTmFtZSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgdGVtcGxhdGUgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICAgIHRlbXBsYXRlLnJlc291cmNlQ291bnRJcygnQVdTOjpJQU06OlJvbGUnLCAwKTtcbiAgICB0ZW1wbGF0ZS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q3VzdG9tJywge1xuICAgICAgUm9sZTogJ1NvbWVSb2xlTmFtZScsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2RvZXMgbm90IGNyZWF0ZSBwb2xpY2llcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBSb2xlLmN1c3RvbWl6ZVJvbGVzKGFwcCwge1xuICAgICAgdXNlUHJlY3JlYXRlZFJvbGVzOiB7XG4gICAgICAgICdNeVN0YWNrL1JvbGUnOiAnU29tZVJvbGVOYW1lJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnTXlTdGFjaycpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHJvbGUgPSBuZXcgUm9sZShzdGFjaywgJ1JvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBTZXJ2aWNlUHJpbmNpcGFsKCdzbnMuYW1hem9uYXdzLmNvbScpLFxuICAgIH0pO1xuICAgIGNvbnN0IGltcG9ydGVkUm9sZSA9IFJvbGUuZnJvbVJvbGVOYW1lKHN0YWNrLCAnSW1wb3J0ZWRSb2xlJywgJ0ltcG9ydGVkUm9sZScpO1xuICAgIGltcG9ydGVkUm9sZS5ncmFudChyb2xlLCAnc3RzOkFzc3VtZVJvbGUnKTtcbiAgICByb2xlLmFkZFRvUG9saWN5KG5ldyBQb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgZWZmZWN0OiBFZmZlY3QuQUxMT1csXG4gICAgICBhY3Rpb25zOiBbJyonXSxcbiAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgfSkpO1xuXG4gICAgY29uc3QgdGVtcGxhdGUgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICAgIHRlbXBsYXRlLnJlc291cmNlQ291bnRJcygnQVdTOjpJQU06OlBvbGljeScsIDApO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gdXNlIGFsbCByb2xlIHByb3BlcnRpZXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgUm9sZS5jdXN0b21pemVSb2xlcyhhcHAsIHtcbiAgICAgIHVzZVByZWNyZWF0ZWRSb2xlczoge1xuICAgICAgICAnTXlTdGFjay9Sb2xlJzogJ1NvbWVSb2xlTmFtZScsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ015U3RhY2snKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCByb2xlID0gbmV3IFJvbGUoc3RhY2ssICdSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgnc25zLmFtYXpvbmF3cy5jb20nKSxcbiAgICB9KTtcbiAgICBjb25zdCBwcmluY2lwYWwgPSBSb2xlLmZyb21Sb2xlTmFtZShzdGFjaywgJ090aGVyUm9sZScsICdPdGhlclJvbGUnKTtcbiAgICByb2xlLmdyYW50KHByaW5jaXBhbCwgJ3N0czpBc3N1bWVSb2xlJyk7XG4gICAgcm9sZS5ncmFudFBhc3NSb2xlKHByaW5jaXBhbCk7XG4gICAgcm9sZS5ncmFudEFzc3VtZVJvbGUocHJpbmNpcGFsKTtcbiAgICByb2xlLmFkZE1hbmFnZWRQb2xpY3koTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoJ1JlYWRPbmx5QWNjZXNzJykpO1xuICAgIHJvbGUuYWRkTWFuYWdlZFBvbGljeShuZXcgTWFuYWdlZFBvbGljeShzdGFjaywgJ015UG9saWN5Jywge1xuICAgICAgc3RhdGVtZW50czogW25ldyBQb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICBlZmZlY3Q6IEVmZmVjdC5BTExPVyxcbiAgICAgICAgYWN0aW9uczogWydzbnM6UHVibGlzaCddLFxuICAgICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgICAgfSldLFxuICAgIH0pKTtcbiAgICByb2xlLndpdGhvdXRQb2xpY3lVcGRhdGVzKCk7XG4gICAgbmV3IENmblJlc291cmNlKHN0YWNrLCAnTXlSZXNvdXJjZScsIHtcbiAgICAgIHR5cGU6ICdBV1M6OkN1c3RvbScsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIFJvbGVOYW1lOiByb2xlLnJvbGVOYW1lLFxuICAgICAgICBSb2xlQXJuOiByb2xlLnJvbGVOYW1lLFxuICAgICAgICBQb2xpY3lGcmFnbWVudDogcm9sZS5wb2xpY3lGcmFnbWVudCxcbiAgICAgICAgQXNzdW1lUm9sZUFjdGlvbjogcm9sZS5hc3N1bWVSb2xlQWN0aW9uLFxuICAgICAgICBQcmluY2lwYWxBY2NvdW50OiByb2xlLnByaW5jaXBhbEFjY291bnQsXG4gICAgICAgIEFzc3VtZVJvbGVQb2xpY3k6IHJvbGUuYXNzdW1lUm9sZVBvbGljeSxcbiAgICAgICAgUGVybWlzc2lvbnNCb3VuZGFyeTogcm9sZS5wZXJtaXNzaW9uc0JvdW5kYXJ5LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgcm9sZS5hcHBseVJlbW92YWxQb2xpY3koUmVtb3ZhbFBvbGljeS5ERVNUUk9ZKTtcbiAgICB9KS50b1Rocm93KC9DYW5ub3QgYXBwbHkgUmVtb3ZhbFBvbGljeS8pO1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdNeVJlc291cmNlMicsIHtcbiAgICAgICAgdHlwZTogJ0FXUzo6Q3VzdG9tJyxcbiAgICAgICAgcHJvcGVydGllczoge1xuICAgICAgICAgIFJvbGVJZDogcm9sZS5yb2xlSWQsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KC9cInJvbGVJZFwiIGlzIG5vdCBhdmFpbGFibGUgb24gcHJlY3JlYXRlZCByb2xlcy8pO1xuICAgIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbiAgICB0ZW1wbGF0ZS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6SUFNOjpSb2xlJywgMCk7XG4gICAgdGVtcGxhdGUucmVzb3VyY2VDb3VudElzKCdBV1M6OklBTTo6UG9saWN5JywgMCk7XG4gICAgdGVtcGxhdGUucmVzb3VyY2VDb3VudElzKCdBV1M6OklBTTo6TWFuYWdlZFBvbGljeScsIDApO1xuICAgIHRlbXBsYXRlLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDdXN0b20nLCB7XG4gICAgICBSb2xlTmFtZTogJ1NvbWVSb2xlTmFtZScsXG4gICAgICBSb2xlQXJuOiAnU29tZVJvbGVOYW1lJyxcbiAgICAgIFBvbGljeUZyYWdtZW50OiB7XG4gICAgICAgIHByaW5jaXBhbEpzb246IHtcbiAgICAgICAgICBBV1M6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICc6aWFtOjonLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgJzpyb2xlL1NvbWVSb2xlTmFtZScsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgY29uZGl0aW9uczoge30sXG4gICAgICB9LFxuICAgICAgQXNzdW1lUm9sZUFjdGlvbjogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgIFByaW5jaXBhbEFjY291bnQ6IHtcbiAgICAgICAgUmVmOiAnQVdTOjpBY2NvdW50SWQnLFxuICAgICAgfSxcbiAgICAgIEFzc3VtZVJvbGVQb2xpY3k6IHtcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiAnc3RzOkFzc3VtZVJvbGUnLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUHJpbmNpcGFsOiB7XG4gICAgICAgICAgICAgIFNlcnZpY2U6ICdzbnMuYW1hem9uYXdzLmNvbScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdJQU0gcm9sZScsICgpID0+IHtcbiAgdGVzdCgnZGVmYXVsdCByb2xlJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBuZXcgUm9sZShzdGFjaywgJ015Um9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ3Nucy5hbWF6b25hd3MuY29tJyksXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICBSZXNvdXJjZXM6XG4gICAgICB7XG4gICAgICAgIE15Um9sZUY0OEZGRTA0OlxuICAgICAgICAge1xuICAgICAgICAgICBUeXBlOiAnQVdTOjpJQU06OlJvbGUnLFxuICAgICAgICAgICBQcm9wZXJ0aWVzOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFzc3VtZVJvbGVQb2xpY3lEb2N1bWVudDpcbiAgICAgICAgICAge1xuICAgICAgICAgICAgIFN0YXRlbWVudDpcbiAgICAgICAgICAgIFt7XG4gICAgICAgICAgICAgIEFjdGlvbjogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBQcmluY2lwYWw6IHsgU2VydmljZTogJ3Nucy5hbWF6b25hd3MuY29tJyB9LFxuICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYSByb2xlIGNhbiBncmFudCBQYXNzUm9sZSBwZXJtaXNzaW9ucycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3Qgcm9sZSA9IG5ldyBSb2xlKHN0YWNrLCAnUm9sZScsIHsgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgnaGVuay5hbWF6b25hd3MuY29tJykgfSk7XG4gICAgY29uc3QgdXNlciA9IG5ldyBVc2VyKHN0YWNrLCAnVXNlcicpO1xuXG4gICAgLy8gV0hFTlxuICAgIHJvbGUuZ3JhbnRQYXNzUm9sZSh1c2VyKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogJ2lhbTpQYXNzUm9sZScsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBSZXNvdXJjZTogeyAnRm46OkdldEF0dCc6IFsnUm9sZTFBQkNDNUYwJywgJ0FybiddIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYSByb2xlIGNhbiBncmFudCBBc3N1bWVSb2xlIHBlcm1pc3Npb25zJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCByb2xlID0gbmV3IFJvbGUoc3RhY2ssICdSb2xlJywgeyBhc3N1bWVkQnk6IG5ldyBTZXJ2aWNlUHJpbmNpcGFsKCdoZW5rLmFtYXpvbmF3cy5jb20nKSB9KTtcbiAgICBjb25zdCB1c2VyID0gbmV3IFVzZXIoc3RhY2ssICdVc2VyJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgcm9sZS5ncmFudEFzc3VtZVJvbGUodXNlcik7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBSZXNvdXJjZTogeyAnRm46OkdldEF0dCc6IFsnUm9sZTFBQkNDNUYwJywgJ0FybiddIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdERlcHJlY2F0ZWQoJ2NhbiBzdXBwbHkgZXh0ZXJuYWxJZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IFJvbGUoc3RhY2ssICdNeVJvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBTZXJ2aWNlUHJpbmNpcGFsKCdzbnMuYW1hem9uYXdzLmNvbScpLFxuICAgICAgZXh0ZXJuYWxJZDogJ1NvbWVTZWNyZXQnLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6Um9sZScsIHtcbiAgICAgIEFzc3VtZVJvbGVQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgICBDb25kaXRpb246IHtcbiAgICAgICAgICAgICAgU3RyaW5nRXF1YWxzOiB7ICdzdHM6RXh0ZXJuYWxJZCc6ICdTb21lU2VjcmV0JyB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFByaW5jaXBhbDogeyBTZXJ2aWNlOiAnc25zLmFtYXpvbmF3cy5jb20nIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIHN1cHBseSBzaW5nbGUgZXh0ZXJuYWxJZHMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBSb2xlKHN0YWNrLCAnTXlSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgnc25zLmFtYXpvbmF3cy5jb20nKSxcbiAgICAgIGV4dGVybmFsSWRzOiBbJ1NvbWVTZWNyZXQnXSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlJvbGUnLCB7XG4gICAgICBBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiAnc3RzOkFzc3VtZVJvbGUnLFxuICAgICAgICAgICAgQ29uZGl0aW9uOiB7XG4gICAgICAgICAgICAgIFN0cmluZ0VxdWFsczogeyAnc3RzOkV4dGVybmFsSWQnOiAnU29tZVNlY3JldCcgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBQcmluY2lwYWw6IHsgU2VydmljZTogJ3Nucy5hbWF6b25hd3MuY29tJyB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBzdXBwbHkgbXVsdGlwbGUgZXh0ZXJuYWxJZHMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBSb2xlKHN0YWNrLCAnTXlSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgnc25zLmFtYXpvbmF3cy5jb20nKSxcbiAgICAgIGV4dGVybmFsSWRzOiBbJ1NvbWVTZWNyZXQnLCAnQW5vdGhlclNlY3JldCddLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6Um9sZScsIHtcbiAgICAgIEFzc3VtZVJvbGVQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgICBDb25kaXRpb246IHtcbiAgICAgICAgICAgICAgU3RyaW5nRXF1YWxzOiB7ICdzdHM6RXh0ZXJuYWxJZCc6IFsnU29tZVNlY3JldCcsICdBbm90aGVyU2VjcmV0J10gfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBQcmluY2lwYWw6IHsgU2VydmljZTogJ3Nucy5hbWF6b25hd3MuY29tJyB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3BvbGljeSBpcyBjcmVhdGVkIGF1dG9tYXRpY2FsbHkgd2hlbiBwZXJtaXNzaW9ucyBhcmUgYWRkZWQnLCAoKSA9PiB7XG4gICAgLy8gYnkgZGVmYXVsdCB3ZSBkb24ndCBleHBlY3QgYSByb2xlIHBvbGljeVxuICAgIGNvbnN0IGJlZm9yZSA9IG5ldyBTdGFjaygpO1xuICAgIG5ldyBSb2xlKGJlZm9yZSwgJ015Um9sZScsIHsgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgnc25zLmFtYXpvbmF3cy5jb20nKSB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soYmVmb3JlKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6SUFNOjpQb2xpY3knLCAwKTtcblxuICAgIC8vIGFkZCBhIHBvbGljeSB0byB0aGUgcm9sZVxuICAgIGNvbnN0IGFmdGVyID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgYWZ0ZXJSb2xlID0gbmV3IFJvbGUoYWZ0ZXIsICdNeVJvbGUnLCB7IGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ3Nucy5hbWF6b25hd3MuY29tJykgfSk7XG4gICAgYWZ0ZXJSb2xlLmFkZFRvUG9saWN5KG5ldyBQb2xpY3lTdGF0ZW1lbnQoeyByZXNvdXJjZXM6IFsnbXlyZXNvdXJjZSddLCBhY3Rpb25zOiBbJ3NlcnZpY2U6bXlhY3Rpb24nXSB9KSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKGFmdGVyKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdzZXJ2aWNlOm15YWN0aW9uJyxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFJlc291cmNlOiAnbXlyZXNvdXJjZScsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICAgIFBvbGljeU5hbWU6ICdNeVJvbGVEZWZhdWx0UG9saWN5QTM2QkUxREQnLFxuICAgICAgUm9sZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFJlZjogJ015Um9sZUY0OEZGRTA0JyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgfSk7XG5cbiAgdGVzdCgnbWFuYWdlZCBwb2xpY3kgYXJucyBjYW4gYmUgc3VwcGxpZWQgdXBvbiBpbml0aWFsaXphdGlvbiBhbmQgYWxzbyBhZGRlZCBsYXRlcicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3Qgcm9sZSA9IG5ldyBSb2xlKHN0YWNrLCAnTXlSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgndGVzdC5zZXJ2aWNlJyksXG4gICAgICBtYW5hZ2VkUG9saWNpZXM6IFt7IG1hbmFnZWRQb2xpY3lBcm46ICdtYW5hZ2VkMScgfSwgeyBtYW5hZ2VkUG9saWN5QXJuOiAnbWFuYWdlZDInIH1dLFxuICAgIH0pO1xuXG4gICAgcm9sZS5hZGRNYW5hZ2VkUG9saWN5KHsgbWFuYWdlZFBvbGljeUFybjogJ21hbmFnZWQzJyB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICBSZXNvdXJjZXM6XG4gICAgICB7XG4gICAgICAgIE15Um9sZUY0OEZGRTA0OlxuICAgICAgICAge1xuICAgICAgICAgICBUeXBlOiAnQVdTOjpJQU06OlJvbGUnLFxuICAgICAgICAgICBQcm9wZXJ0aWVzOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFzc3VtZVJvbGVQb2xpY3lEb2N1bWVudDpcbiAgICAgICAgICAge1xuICAgICAgICAgICAgIFN0YXRlbWVudDpcbiAgICAgICAgICAgIFt7XG4gICAgICAgICAgICAgIEFjdGlvbjogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBQcmluY2lwYWw6IHsgU2VydmljZTogJ3Rlc3Quc2VydmljZScgfSxcbiAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICAgfSxcbiAgICAgICAgICAgIE1hbmFnZWRQb2xpY3lBcm5zOiBbJ21hbmFnZWQxJywgJ21hbmFnZWQyJywgJ21hbmFnZWQzJ10sXG4gICAgICAgICAgfSxcbiAgICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gIH0pO1xuXG4gIHRlc3QoJ2ZlZGVyYXRlZCBwcmluY2lwYWwgY2FuIGNoYW5nZSBBc3N1bWVSb2xlQWN0aW9uJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgY29nbml0b1ByaW5jaXBhbCA9IG5ldyBGZWRlcmF0ZWRQcmluY2lwYWwoXG4gICAgICAnZm9vJyxcbiAgICAgIHsgU3RyaW5nRXF1YWxzOiB7IGtleTogJ3ZhbHVlJyB9IH0sXG4gICAgICAnc3RzOkFzc3VtZVNvbWV0aGluZycpO1xuXG4gICAgbmV3IFJvbGUoc3RhY2ssICdNeVJvbGUnLCB7IGFzc3VtZWRCeTogY29nbml0b1ByaW5jaXBhbCB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6Um9sZScsIHtcbiAgICAgIEFzc3VtZVJvbGVQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFByaW5jaXBhbDogeyBGZWRlcmF0ZWQ6ICdmb28nIH0sXG4gICAgICAgICAgICBDb25kaXRpb246IHtcbiAgICAgICAgICAgICAgU3RyaW5nRXF1YWxzOiB7IGtleTogJ3ZhbHVlJyB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEFjdGlvbjogJ3N0czpBc3N1bWVTb21ldGhpbmcnLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdyb2xlIHBhdGggY2FuIGJlIHVzZWQgdG8gc3BlY2lmeSB0aGUgcGF0aCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgbmV3IFJvbGUoc3RhY2ssICdNeVJvbGUnLCB7IHBhdGg6ICcvJywgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgnc25zLmFtYXpvbmF3cy5jb20nKSB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6Um9sZScsIHtcbiAgICAgIFBhdGg6ICcvJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgncm9sZSBwYXRoIGNhbiBiZSAxIGNoYXJhY3RlcicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3QgYXNzdW1lZEJ5ID0gbmV3IFNlcnZpY2VQcmluY2lwYWwoJ2JsYScpO1xuXG4gICAgZXhwZWN0KCgpID0+IG5ldyBSb2xlKHN0YWNrLCAnTXlSb2xlJywgeyBhc3N1bWVkQnksIHBhdGg6ICcvJyB9KSkubm90LnRvVGhyb3dFcnJvcigpO1xuICB9KTtcblxuICB0ZXN0KCdyb2xlIHBhdGggY2Fubm90IGJlIGVtcHR5JywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBjb25zdCBhc3N1bWVkQnkgPSBuZXcgU2VydmljZVByaW5jaXBhbCgnYmxhJyk7XG5cbiAgICBleHBlY3QoKCkgPT4gbmV3IFJvbGUoc3RhY2ssICdNeVJvbGUnLCB7IGFzc3VtZWRCeSwgcGF0aDogJycgfSkpXG4gICAgICAudG9UaHJvdygnUm9sZSBwYXRoIG11c3QgYmUgYmV0d2VlbiAxIGFuZCA1MTIgY2hhcmFjdGVycy4gVGhlIHByb3ZpZGVkIHJvbGUgcGF0aCBpcyAwIGNoYXJhY3RlcnMuJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3JvbGUgcGF0aCBtdXN0IGJlIGxlc3MgdGhhbiBvciBlcXVhbCB0byA1MTInLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGNvbnN0IGFzc3VtZWRCeSA9IG5ldyBTZXJ2aWNlUHJpbmNpcGFsKCdibGEnKTtcblxuICAgIGV4cGVjdCgoKSA9PiBuZXcgUm9sZShzdGFjaywgJ015Um9sZScsIHsgYXNzdW1lZEJ5LCBwYXRoOiAnLycgKyBBcnJheSg1MTIpLmpvaW4oJ2EnKSArICcvJyB9KSlcbiAgICAgIC50b1Rocm93KCdSb2xlIHBhdGggbXVzdCBiZSBiZXR3ZWVuIDEgYW5kIDUxMiBjaGFyYWN0ZXJzLiBUaGUgcHJvdmlkZWQgcm9sZSBwYXRoIGlzIDUxMyBjaGFyYWN0ZXJzLicpO1xuICB9KTtcblxuICB0ZXN0KCdyb2xlIHBhdGggbXVzdCBzdGFydCB3aXRoIGEgZm9yd2FyZCBzbGFzaCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3QgYXNzdW1lZEJ5ID0gbmV3IFNlcnZpY2VQcmluY2lwYWwoJ2JsYScpO1xuXG4gICAgY29uc3QgZXhwZWN0ZWQgPSAodmFsOiBhbnkpID0+ICdSb2xlIHBhdGggbXVzdCBiZSBlaXRoZXIgYSBzbGFzaCBvciB2YWxpZCBjaGFyYWN0ZXJzIChhbHBoYW51bWVyaWNzIGFuZCBzeW1ib2xzKSBzdXJyb3VuZGVkIGJ5IHNsYXNoZXMuICdcbiAgICArIGBWYWxpZCBjaGFyYWN0ZXJzIGFyZSB1bmljb2RlIGNoYXJhY3RlcnMgaW4gW1xcXFx1MDAyMS1cXFxcdTAwN0ZdLiBIb3dldmVyLCAke3ZhbH0gaXMgcHJvdmlkZWQuYDtcbiAgICBleHBlY3QoKCkgPT4gbmV3IFJvbGUoc3RhY2ssICdNeVJvbGUnLCB7IGFzc3VtZWRCeSwgcGF0aDogJ2FhYScgfSkpLnRvVGhyb3coZXhwZWN0ZWQoJ2FhYScpKTtcbiAgfSk7XG5cbiAgdGVzdCgncm9sZSBwYXRoIG11c3QgZW5kIHdpdGggYSBmb3J3YXJkIHNsYXNoJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBjb25zdCBhc3N1bWVkQnkgPSBuZXcgU2VydmljZVByaW5jaXBhbCgnYmxhJyk7XG5cbiAgICBjb25zdCBleHBlY3RlZCA9ICh2YWw6IGFueSkgPT4gJ1JvbGUgcGF0aCBtdXN0IGJlIGVpdGhlciBhIHNsYXNoIG9yIHZhbGlkIGNoYXJhY3RlcnMgKGFscGhhbnVtZXJpY3MgYW5kIHN5bWJvbHMpIHN1cnJvdW5kZWQgYnkgc2xhc2hlcy4gJ1xuICAgICsgYFZhbGlkIGNoYXJhY3RlcnMgYXJlIHVuaWNvZGUgY2hhcmFjdGVycyBpbiBbXFxcXHUwMDIxLVxcXFx1MDA3Rl0uIEhvd2V2ZXIsICR7dmFsfSBpcyBwcm92aWRlZC5gO1xuICAgIGV4cGVjdCgoKSA9PiBuZXcgUm9sZShzdGFjaywgJ015Um9sZScsIHsgYXNzdW1lZEJ5LCBwYXRoOiAnL2EnIH0pKS50b1Rocm93KGV4cGVjdGVkKCcvYScpKTtcbiAgfSk7XG5cbiAgdGVzdCgncm9sZSBwYXRoIG11c3QgY29udGFpbiB1bmljb2RlIGNoYXJzIHdpdGhpbiBbXFxcXHUwMDIxLVxcXFx1MDA3Rl0nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGNvbnN0IGFzc3VtZWRCeSA9IG5ldyBTZXJ2aWNlUHJpbmNpcGFsKCdibGEnKTtcblxuICAgIGNvbnN0IGV4cGVjdGVkID0gKHZhbDogYW55KSA9PiAnUm9sZSBwYXRoIG11c3QgYmUgZWl0aGVyIGEgc2xhc2ggb3IgdmFsaWQgY2hhcmFjdGVycyAoYWxwaGFudW1lcmljcyBhbmQgc3ltYm9scykgc3Vycm91bmRlZCBieSBzbGFzaGVzLiAnXG4gICAgKyBgVmFsaWQgY2hhcmFjdGVycyBhcmUgdW5pY29kZSBjaGFyYWN0ZXJzIGluIFtcXFxcdTAwMjEtXFxcXHUwMDdGXS4gSG93ZXZlciwgJHt2YWx9IGlzIHByb3ZpZGVkLmA7XG4gICAgZXhwZWN0KCgpID0+IG5ldyBSb2xlKHN0YWNrLCAnTXlSb2xlJywgeyBhc3N1bWVkQnksIHBhdGg6ICcvXFx1MDAyMFxcdTAwODAvJyB9KSkudG9UaHJvdyhleHBlY3RlZCgnL1xcdTAwMjBcXHUwMDgwLycpKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ21heFNlc3Npb25EdXJhdGlvbicsICgpID0+IHtcblxuICAgIHRlc3QoJ2lzIG5vdCBzcGVjaWZpZWQgYnkgZGVmYXVsdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBuZXcgUm9sZShzdGFjaywgJ015Um9sZScsIHsgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgnc25zLmFtYXpvbmF3cy5jb20nKSB9KTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgICAgTXlSb2xlRjQ4RkZFMDQ6IHtcbiAgICAgICAgICAgIFR5cGU6ICdBV1M6OklBTTo6Um9sZScsXG4gICAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICAgIEFzc3VtZVJvbGVQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgICAgICAgUHJpbmNpcGFsOiB7XG4gICAgICAgICAgICAgICAgICAgICAgU2VydmljZTogJ3Nucy5hbWF6b25hd3MuY29tJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2NhbiBiZSB1c2VkIHRvIHNwZWNpZnkgdGhlIG1heGltdW0gc2Vzc2lvbiBkdXJhdGlvbiBmb3IgYXNzdW1pbmcgdGhlIHJvbGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgICBuZXcgUm9sZShzdGFjaywgJ015Um9sZScsIHsgbWF4U2Vzc2lvbkR1cmF0aW9uOiBEdXJhdGlvbi5zZWNvbmRzKDM3MDApLCBhc3N1bWVkQnk6IG5ldyBTZXJ2aWNlUHJpbmNpcGFsKCdzbnMuYW1hem9uYXdzLmNvbScpIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlJvbGUnLCB7XG4gICAgICAgIE1heFNlc3Npb25EdXJhdGlvbjogMzcwMCxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnbXVzdCBiZSBiZXR3ZWVuIDM2MDAgYW5kIDQzMjAwJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgICAgY29uc3QgYXNzdW1lZEJ5ID0gbmV3IFNlcnZpY2VQcmluY2lwYWwoJ2JsYScpO1xuXG4gICAgICBuZXcgUm9sZShzdGFjaywgJ015Um9sZTEnLCB7IGFzc3VtZWRCeSwgbWF4U2Vzc2lvbkR1cmF0aW9uOiBEdXJhdGlvbi5ob3VycygxKSB9KTtcbiAgICAgIG5ldyBSb2xlKHN0YWNrLCAnTXlSb2xlMicsIHsgYXNzdW1lZEJ5LCBtYXhTZXNzaW9uRHVyYXRpb246IER1cmF0aW9uLmhvdXJzKDEyKSB9KTtcblxuICAgICAgY29uc3QgZXhwZWN0ZWQgPSAodmFsOiBhbnkpID0+IGBtYXhTZXNzaW9uRHVyYXRpb24gaXMgc2V0IHRvICR7dmFsfSwgYnV0IG11c3QgYmUgPj0gMzYwMHNlYyAoMWhyKSBhbmQgPD0gNDMyMDBzZWMgKDEyaHJzKWA7XG4gICAgICBleHBlY3QoKCkgPT4gbmV3IFJvbGUoc3RhY2ssICdNeVJvbGUzJywgeyBhc3N1bWVkQnksIG1heFNlc3Npb25EdXJhdGlvbjogRHVyYXRpb24ubWludXRlcygxKSB9KSlcbiAgICAgICAgLnRvVGhyb3coZXhwZWN0ZWQoNjApKTtcbiAgICAgIGV4cGVjdCgoKSA9PiBuZXcgUm9sZShzdGFjaywgJ015Um9sZTQnLCB7IGFzc3VtZWRCeSwgbWF4U2Vzc2lvbkR1cmF0aW9uOiBEdXJhdGlvbi5zZWNvbmRzKDM1OTkpIH0pKVxuICAgICAgICAudG9UaHJvdyhleHBlY3RlZCgzNTk5KSk7XG4gICAgICBleHBlY3QoKCkgPT4gbmV3IFJvbGUoc3RhY2ssICdNeVJvbGU1JywgeyBhc3N1bWVkQnksIG1heFNlc3Npb25EdXJhdGlvbjogRHVyYXRpb24uc2Vjb25kcyg0MzIwMSkgfSkpXG4gICAgICAgIC50b1Rocm93KGV4cGVjdGVkKDQzMjAxKSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FsbG93IHJvbGUgd2l0aCBtdWx0aXBsZSBwcmluY2lwYWxzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBuZXcgUm9sZShzdGFjaywgJ015Um9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IENvbXBvc2l0ZVByaW5jaXBhbChcbiAgICAgICAgbmV3IFNlcnZpY2VQcmluY2lwYWwoJ2Jvb20uYW1hem9uYXdzLnRlc3QnKSxcbiAgICAgICAgbmV3IEFyblByaW5jaXBhbCgnMTExMTExMScpLFxuICAgICAgKSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6Um9sZScsIHtcbiAgICAgIEFzc3VtZVJvbGVQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICAgICAgU2VydmljZTogJ2Jvb20uYW1hem9uYXdzLnRlc3QnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICAgICAgICBBV1M6ICcxMTExMTExJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIHN1cHBseSBwZXJtaXNzaW9ucyBib3VuZGFyeSBtYW5hZ2VkIHBvbGljeScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBjb25zdCBwZXJtaXNzaW9uc0JvdW5kYXJ5ID0gTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoJ21hbmFnZWQtcG9saWN5Jyk7XG5cbiAgICBuZXcgUm9sZShzdGFjaywgJ015Um9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ3Nucy5hbWF6b25hd3MuY29tJyksXG4gICAgICBwZXJtaXNzaW9uc0JvdW5kYXJ5LFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpSb2xlJywge1xuICAgICAgUGVybWlzc2lvbnNCb3VuZGFyeToge1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJzppYW06OmF3czpwb2xpY3kvbWFuYWdlZC1wb2xpY3knLFxuICAgICAgICAgIF0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdQcmluY2lwYWwtKiBpbiBhbiBBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQgZ2V0cyB0cmFuc2xhdGVkIHRvIHsgXCJBV1NcIjogXCIqXCIgfScsICgpID0+IHtcbiAgICAvLyBUaGUgZG9jcyBzYXkgdGhhdCBcIlByaW5jaXBhbDogKlwiIGFuZCBcIlByaW5jaXBhbDogeyBBV1M6ICogfVwiIGFyZSBlcXVpdmFsZW50XG4gICAgLy8gKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9JQU0vbGF0ZXN0L1VzZXJHdWlkZS9yZWZlcmVuY2VfcG9saWNpZXNfZWxlbWVudHNfcHJpbmNpcGFsLmh0bWwpXG4gICAgLy8gYnV0IGluIHByYWN0aWNlIENyZWF0ZVJvbGUgZXJyb3JzIG91dCBpZiB5b3UgdXNlIFwiUHJpbmNpcGFsOiAqXCIgaW4gYW4gQXNzdW1lUm9sZVBvbGljeURvY3VtZW50OlxuICAgIC8vIEFuIGVycm9yIG9jY3VycmVkIChNYWxmb3JtZWRQb2xpY3lEb2N1bWVudCkgd2hlbiBjYWxsaW5nIHRoZSBDcmVhdGVSb2xlIG9wZXJhdGlvbjogQXNzdW1lUm9sZXBvbGljeSBjb250YWluZWQgYW4gaW52YWxpZCBwcmluY2lwYWw6IFwiU1RBUlwiOlwiKlwiLlxuXG4gICAgLy8gTWFrZSBzdXJlIHRoYXQgd2UgaGFuZGxlIHRoaXMgY2FzZSBzcGVjaWFsbHkuXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBuZXcgUm9sZShzdGFjaywgJ1JvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBBbnlQcmluY2lwYWwoKSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6Um9sZScsIHtcbiAgICAgIEFzc3VtZVJvbGVQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBQcmluY2lwYWw6IHsgQVdTOiAnKicgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gaGF2ZSBhIGRlc2NyaXB0aW9uJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBuZXcgUm9sZShzdGFjaywgJ015Um9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ3Nucy5hbWF6b25hd3MuY29tJyksXG4gICAgICBkZXNjcmlwdGlvbjogJ1RoaXMgaXMgYSByb2xlIGRlc2NyaXB0aW9uLicsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICBSZXNvdXJjZXM6XG4gICAgICB7XG4gICAgICAgIE15Um9sZUY0OEZGRTA0OlxuICAgICAgICAge1xuICAgICAgICAgICBUeXBlOiAnQVdTOjpJQU06OlJvbGUnLFxuICAgICAgICAgICBQcm9wZXJ0aWVzOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFzc3VtZVJvbGVQb2xpY3lEb2N1bWVudDpcbiAgICAgICAgICAge1xuICAgICAgICAgICAgIFN0YXRlbWVudDpcbiAgICAgICAgICAgIFt7XG4gICAgICAgICAgICAgIEFjdGlvbjogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBQcmluY2lwYWw6IHsgU2VydmljZTogJ3Nucy5hbWF6b25hd3MuY29tJyB9LFxuICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICAgICB9LFxuICAgICAgICAgICAgRGVzY3JpcHRpb246ICdUaGlzIGlzIGEgcm9sZSBkZXNjcmlwdGlvbi4nLFxuICAgICAgICAgIH0sXG4gICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnc2hvdWxkIG5vdCBoYXZlIGFuIGVtcHR5IGRlc2NyaXB0aW9uJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBuZXcgUm9sZShzdGFjaywgJ015Um9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ3Nucy5hbWF6b25hd3MuY29tJyksXG4gICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICBSZXNvdXJjZXM6XG4gICAgICB7XG4gICAgICAgIE15Um9sZUY0OEZGRTA0OlxuICAgICAgICAge1xuICAgICAgICAgICBUeXBlOiAnQVdTOjpJQU06OlJvbGUnLFxuICAgICAgICAgICBQcm9wZXJ0aWVzOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFzc3VtZVJvbGVQb2xpY3lEb2N1bWVudDpcbiAgICAgICAgICAge1xuICAgICAgICAgICAgIFN0YXRlbWVudDpcbiAgICAgICAgICAgIFt7XG4gICAgICAgICAgICAgIEFjdGlvbjogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBQcmluY2lwYWw6IHsgU2VydmljZTogJ3Nucy5hbWF6b25hd3MuY29tJyB9LFxuICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZGVzY3JpcHRpb24gY2FuIG9ubHkgYmUgMTAwMCBjaGFyYWN0ZXJzIGxvbmcnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgUm9sZShzdGFjaywgJ015Um9sZScsIHtcbiAgICAgICAgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgnc25zLmFtYXpvbmF3cy5jb20nKSxcbiAgICAgICAgZGVzY3JpcHRpb246ICcxMDAwKyBjaGFyYWN0ZXIgbG9uZyBkZXNjcmlwdGlvbjogTG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVlciBhZGlwaXNjaW5nIGVsaXQuIFxcXG4gICAgICAgIEFlbmVhbiBjb21tb2RvIGxpZ3VsYSBlZ2V0IGRvbG9yLiBBZW5lYW4gbWFzc2EuIEN1bSBzb2NpaXMgbmF0b3F1ZSBwZW5hdGlidXMgZXQgbWFnbmlzIGRpcyBwYXJ0dXJpZW50IG1vbnRlcywgXFxcbiAgICAgICAgbmFzY2V0dXIgcmlkaWN1bHVzIG11cy4gRG9uZWMgcXVhbSBmZWxpcywgdWx0cmljaWVzIG5lYywgcGVsbGVudGVzcXVlIGV1LCBwcmV0aXVtIHF1aXMsIHNlbS4gTnVsbGEgY29uc2VxdWF0IFxcXG4gICAgICAgIG1hc3NhIHF1aXMgZW5pbS4gRG9uZWMgcGVkZSBqdXN0bywgZnJpbmdpbGxhIHZlbCwgYWxpcXVldCBuZWMsIHZ1bHB1dGF0ZSBlZ2V0LCBhcmN1LiBJbiBlbmltIGp1c3RvLCByaG9uY3VzIHV0LCBcXFxuICAgICAgICBpbXBlcmRpZXQgYSwgdmVuZW5hdGlzIHZpdGFlLCBqdXN0by4gTnVsbGFtIGRpY3R1bSBmZWxpcyBldSBwZWRlIG1vbGxpcyBwcmV0aXVtLiBJbnRlZ2VyIHRpbmNpZHVudC4gQ3JhcyBkYXBpYnVzLiBcXFxuICAgICAgICBWaXZhbXVzIGVsZW1lbnR1bSBzZW1wZXIgbmlzaS4gQWVuZWFuIHZ1bHB1dGF0ZSBlbGVpZmVuZCB0ZWxsdXMuIEFlbmVhbiBsZW8gbGlndWxhLCBwb3J0dGl0b3IgZXUsIGNvbnNlcXVhdCB2aXRhZSwgXFxcbiAgICAgICAgZWxlaWZlbmQgYWMsIGVuaW0uIEFsaXF1YW0gbG9yZW0gYW50ZSwgZGFwaWJ1cyBpbiwgdml2ZXJyYSBxdWlzLCBmZXVnaWF0IGEsIHRlbGx1cy4gUGhhc2VsbHVzIHZpdmVycmEgbnVsbGEgdXQgbWV0dXMgXFxcbiAgICAgICAgdmFyaXVzIGxhb3JlZXQuIFF1aXNxdWUgcnV0cnVtLiBBZW5lYW4gaW1wZXJkaWV0LiBFdGlhbSB1bHRyaWNpZXMgbmlzaSB2ZWwgYXVndWUuIEN1cmFiaXR1ciB1bGxhbWNvcnBlciB1bHRyaWNpZXMgbmlzaS4gXFxcbiAgICAgICAgTmFtIGVnZXQgZHVpLiBFdGlhbSByaG9uY3VzLiBNYWVjZW5hcyB0ZW1wdXMsIHRlbGx1cyBlZ2V0IGNvbmRpbWVudHVtIHJob25jdXMsIHNlbSBxdWFtIHNlbXBlciBsaWJlcm8sIHNpdCBhbWV0IGFkaXBpc2NpbmcgXFxcbiAgICAgICAgc2VtIG5lcXVlIHNlZCBpcHN1bS4nLFxuICAgICAgfSk7XG4gICAgfSkudG9UaHJvdygvUm9sZSBkZXNjcmlwdGlvbiBtdXN0IGJlIG5vIGxvbmdlciB0aGFuIDEwMDAgY2hhcmFjdGVycy4vKTtcbiAgfSk7XG5cbiAgdGVzdCgnZmFpbHMgaWYgbWFuYWdlZCBwb2xpY3kgaXMgaW52YWxpZCcsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnbXktc3RhY2snKTtcbiAgICBuZXcgUm9sZShzdGFjaywgJ015Um9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ3Nucy5hbWF6b25hd3MuY29tJyksXG4gICAgICBtYW5hZ2VkUG9saWNpZXM6IFtuZXcgTWFuYWdlZFBvbGljeShzdGFjaywgJ015TWFuYWdlZFBvbGljeScsIHtcbiAgICAgICAgc3RhdGVtZW50czogW25ldyBQb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgICAgICAgYWN0aW9uczogWycqJ10sXG4gICAgICAgICAgcHJpbmNpcGFsczogW25ldyBTZXJ2aWNlUHJpbmNpcGFsKCdzbnMuYW1hem9uYXdzLmNvbScpXSxcbiAgICAgICAgfSldLFxuICAgICAgfSldLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KCgpID0+IGFwcC5zeW50aCgpKS50b1Rocm93KC9BIFBvbGljeVN0YXRlbWVudCB1c2VkIGluIGFuIGlkZW50aXR5LWJhc2VkIHBvbGljeSBjYW5ub3Qgc3BlY2lmeSBhbnkgSUFNIHByaW5jaXBhbHMvKTtcbiAgfSk7XG5cbiAgdGVzdCgnZmFpbHMgaWYgZGVmYXVsdCByb2xlIHBvbGljeSBpcyBpbnZhbGlkJywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdteS1zdGFjaycpO1xuICAgIGNvbnN0IHJvbGUgPSBuZXcgUm9sZShzdGFjaywgJ015Um9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ3Nucy5hbWF6b25hd3MuY29tJyksXG4gICAgfSk7XG4gICAgcm9sZS5hZGRUb1ByaW5jaXBhbFBvbGljeShuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgICBhY3Rpb25zOiBbJyonXSxcbiAgICAgIHByaW5jaXBhbHM6IFtuZXcgU2VydmljZVByaW5jaXBhbCgnc25zLmFtYXpvbmF3cy5jb20nKV0sXG4gICAgfSkpO1xuXG4gICAgZXhwZWN0KCgpID0+IGFwcC5zeW50aCgpKS50b1Rocm93KC9BIFBvbGljeVN0YXRlbWVudCB1c2VkIGluIGFuIGlkZW50aXR5LWJhc2VkIHBvbGljeSBjYW5ub3Qgc3BlY2lmeSBhbnkgSUFNIHByaW5jaXBhbHMvKTtcbiAgfSk7XG5cbiAgdGVzdCgnZmFpbHMgaWYgaW5saW5lIHBvbGljeSBmcm9tIHByb3BzIGlzIGludmFsaWQnLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ215LXN0YWNrJyk7XG4gICAgbmV3IFJvbGUoc3RhY2ssICdNeVJvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBTZXJ2aWNlUHJpbmNpcGFsKCdzbnMuYW1hem9uYXdzLmNvbScpLFxuICAgICAgaW5saW5lUG9saWNpZXM6IHtcbiAgICAgICAgdGVzdFBvbGljeTogbmV3IFBvbGljeURvY3VtZW50KHtcbiAgICAgICAgICBzdGF0ZW1lbnRzOiBbbmV3IFBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgICAgICAgICAgYWN0aW9uczogWycqJ10sXG4gICAgICAgICAgICBwcmluY2lwYWxzOiBbbmV3IFNlcnZpY2VQcmluY2lwYWwoJ3Nucy5hbWF6b25hd3MuY29tJyldLFxuICAgICAgICAgIH0pXSxcbiAgICAgICAgfSksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KCgpID0+IGFwcC5zeW50aCgpKS50b1Rocm93KC9BIFBvbGljeVN0YXRlbWVudCB1c2VkIGluIGFuIGlkZW50aXR5LWJhc2VkIHBvbGljeSBjYW5ub3Qgc3BlY2lmeSBhbnkgSUFNIHByaW5jaXBhbHMvKTtcbiAgfSk7XG5cbiAgdGVzdCgnZmFpbHMgaWYgYXR0YWNoZWQgaW5saW5lIHBvbGljeSBpcyBpbnZhbGlkJywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdteS1zdGFjaycpO1xuICAgIGNvbnN0IHJvbGUgPSBuZXcgUm9sZShzdGFjaywgJ015Um9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ3Nucy5hbWF6b25hd3MuY29tJyksXG4gICAgfSk7XG4gICAgcm9sZS5hdHRhY2hJbmxpbmVQb2xpY3kobmV3IFBvbGljeShzdGFjaywgJ015UG9saWN5Jywge1xuICAgICAgc3RhdGVtZW50czogW25ldyBQb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgICAgICBhY3Rpb25zOiBbJyonXSxcbiAgICAgICAgcHJpbmNpcGFsczogW25ldyBTZXJ2aWNlUHJpbmNpcGFsKCdzbnMuYW1hem9uYXdzLmNvbScpXSxcbiAgICAgIH0pXSxcbiAgICB9KSk7XG5cbiAgICBleHBlY3QoKCkgPT4gYXBwLnN5bnRoKCkpLnRvVGhyb3coL0EgUG9saWN5U3RhdGVtZW50IHVzZWQgaW4gYW4gaWRlbnRpdHktYmFzZWQgcG9saWN5IGNhbm5vdCBzcGVjaWZ5IGFueSBJQU0gcHJpbmNpcGFscy8pO1xuICB9KTtcblxuICB0ZXN0KCdmYWlscyBpZiBhc3N1bWVSb2xlUG9saWN5IGlzIGludmFsaWQnLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ215LXN0YWNrJyk7XG4gICAgY29uc3Qgcm9sZSA9IG5ldyBSb2xlKHN0YWNrLCAnTXlSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgnc25zLmFtYXpvbmF3cy5jb20nKSxcbiAgICAgIG1hbmFnZWRQb2xpY2llczogW25ldyBNYW5hZ2VkUG9saWN5KHN0YWNrLCAnTXlNYW5hZ2VkUG9saWN5JyldLFxuICAgIH0pO1xuICAgIHJvbGUuYXNzdW1lUm9sZVBvbGljeT8uYWRkU3RhdGVtZW50cyhuZXcgUG9saWN5U3RhdGVtZW50KHsgYWN0aW9uczogWycqJ10gfSkpO1xuXG4gICAgZXhwZWN0KCgpID0+IGFwcC5zeW50aCgpKS50b1Rocm93KC9BIFBvbGljeVN0YXRlbWVudCB1c2VkIGluIGEgcmVzb3VyY2UtYmFzZWQgcG9saWN5IG11c3Qgc3BlY2lmeSBhdCBsZWFzdCBvbmUgSUFNIHByaW5jaXBhbC8pO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgncGVybWlzc2lvbnMgYm91bmRhcnknLCAoKSA9PiB7XG4gIHRlc3QoJ2NhbiBiZSBhcHBsaWVkIHRvIGFuIGFwcCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoe1xuICAgICAgY29udGV4dDoge1xuICAgICAgICBbUEVSTUlTU0lPTlNfQk9VTkRBUllfQ09OVEVYVF9LRVldOiB7XG4gICAgICAgICAgbmFtZTogJ2Nkay0ke1F1YWxpZmllcn0tUGVybWlzc2lvbnNCb3VuZGFyeScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IFJvbGUoc3RhY2ssICdSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgnc25zLmFtYXpvbmF3cy5jb20nKSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlJvbGUnLCB7XG4gICAgICBQZXJtaXNzaW9uc0JvdW5kYXJ5OiB7XG4gICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnOmlhbTo6JyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgUmVmOiAnQVdTOjpBY2NvdW50SWQnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICc6cG9saWN5L2Nkay1obmI2NTlmZHMtUGVybWlzc2lvbnNCb3VuZGFyeScsXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBiZSBhcHBsaWVkIHRvIGEgc3RhZ2UnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhZ2UgPSBuZXcgU3RhZ2UoYXBwLCAnU3RhZ2UnLCB7XG4gICAgICBwZXJtaXNzaW9uc0JvdW5kYXJ5OiBQZXJtaXNzaW9uc0JvdW5kYXJ5LmZyb21OYW1lKCdjZGstJHtRdWFsaWZpZXJ9LVBlcm1pc3Npb25zQm91bmRhcnknKSxcbiAgICB9KTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhzdGFnZSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IFJvbGUoc3RhY2ssICdSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgnc25zLmFtYXpvbmF3cy5jb20nKSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlJvbGUnLCB7XG4gICAgICBQZXJtaXNzaW9uc0JvdW5kYXJ5OiB7XG4gICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnOmlhbTo6JyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgUmVmOiAnQVdTOjpBY2NvdW50SWQnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICc6cG9saWN5L2Nkay1obmI2NTlmZHMtUGVybWlzc2lvbnNCb3VuZGFyeScsXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBiZSBhcHBsaWVkIHRvIGEgc3RhZ2UsIGFuZCB3aWxsIHJlcGxhY2UgcGxhY2Vob2xkZXJzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWdlID0gbmV3IFN0YWdlKGFwcCwgJ1N0YWdlJywge1xuICAgICAgZW52OiB7XG4gICAgICAgIHJlZ2lvbjogJ3Rlc3QtcmVnaW9uJyxcbiAgICAgICAgYWNjb3VudDogJzEyMzQ1Njc4OTAxMicsXG4gICAgICB9LFxuICAgICAgcGVybWlzc2lvbnNCb3VuZGFyeTogUGVybWlzc2lvbnNCb3VuZGFyeS5mcm9tTmFtZSgnY2RrLSR7UXVhbGlmaWVyfS1QZXJtaXNzaW9uc0JvdW5kYXJ5LSR7QVdTOjpBY2NvdW50SWR9LSR7QVdTOjpSZWdpb259JyksXG4gICAgfSk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soc3RhZ2UpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBSb2xlKHN0YWNrLCAnUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ3Nucy5hbWF6b25hd3MuY29tJyksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpSb2xlJywge1xuICAgICAgUGVybWlzc2lvbnNCb3VuZGFyeToge1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJzppYW06OjEyMzQ1Njc4OTAxMjpwb2xpY3kvY2RrLWhuYjY1OWZkcy1QZXJtaXNzaW9uc0JvdW5kYXJ5LTEyMzQ1Njc4OTAxMi10ZXN0LXJlZ2lvbicsXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3dpdGggYSBjdXN0b20gcXVhbGlmaWVyJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWdlID0gbmV3IFN0YWdlKGFwcCwgJ1N0YWdlJywge1xuICAgICAgcGVybWlzc2lvbnNCb3VuZGFyeTogUGVybWlzc2lvbnNCb3VuZGFyeS5mcm9tTmFtZSgnY2RrLSR7UXVhbGlmaWVyfS1QZXJtaXNzaW9uc0JvdW5kYXJ5JyksXG4gICAgfSk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soc3RhZ2UsICdNeVN0YWNrJywge1xuICAgICAgc3ludGhlc2l6ZXI6IG5ldyBEZWZhdWx0U3RhY2tTeW50aGVzaXplcih7XG4gICAgICAgIHF1YWxpZmllcjogJ2N1c3RvbScsXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgUm9sZShzdGFjaywgJ1JvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBTZXJ2aWNlUHJpbmNpcGFsKCdzbnMuYW1hem9uYXdzLmNvbScpLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6Um9sZScsIHtcbiAgICAgIFBlcm1pc3Npb25zQm91bmRhcnk6IHtcbiAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICcnLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICc6aWFtOjonLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBSZWY6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJzpwb2xpY3kvY2RrLWN1c3RvbS1QZXJtaXNzaW9uc0JvdW5kYXJ5JyxcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnd2l0aCBhIGN1c3RvbSBwZXJtaXNzaW9ucyBib3VuZGFyeScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFnZSA9IG5ldyBTdGFnZShhcHAsICdTdGFnZScsIHtcbiAgICAgIHBlcm1pc3Npb25zQm91bmRhcnk6IFBlcm1pc3Npb25zQm91bmRhcnkuZnJvbU5hbWUoJ215LXBlcm1pc3Npb25zLWJvdW5kYXJ5JyksXG4gICAgfSk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soc3RhZ2UpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBSb2xlKHN0YWNrLCAnUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ3Nucy5hbWF6b25hd3MuY29tJyksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpSb2xlJywge1xuICAgICAgUGVybWlzc2lvbnNCb3VuZGFyeToge1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJzppYW06OicsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnOnBvbGljeS9teS1wZXJtaXNzaW9ucy1ib3VuZGFyeScsXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3dpdGggYSBjdXN0b20gcGVybWlzc2lvbnMgYm91bmRhcnkgYW5kIHF1YWxpZmllcicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFnZSA9IG5ldyBTdGFnZShhcHAsICdTdGFnZScsIHtcbiAgICAgIHBlcm1pc3Npb25zQm91bmRhcnk6IFBlcm1pc3Npb25zQm91bmRhcnkuZnJvbU5hbWUoJ215LSR7UXVhbGlmaWVyfS1wZXJtaXNzaW9ucy1ib3VuZGFyeScpLFxuICAgIH0pO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKHN0YWdlLCAnTXlTdGFjaycsIHtcbiAgICAgIHN5bnRoZXNpemVyOiBuZXcgQ2xpQ3JlZGVudGlhbHNTdGFja1N5bnRoZXNpemVyKHtcbiAgICAgICAgcXVhbGlmaWVyOiAnY3VzdG9tJyxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBSb2xlKHN0YWNrLCAnUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ3Nucy5hbWF6b25hd3MuY29tJyksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpSb2xlJywge1xuICAgICAgUGVybWlzc2lvbnNCb3VuZGFyeToge1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJzppYW06OicsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnOnBvbGljeS9teS1jdXN0b20tcGVybWlzc2lvbnMtYm91bmRhcnknLFxuICAgICAgICAgIF0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxufSk7XG5cbnRlc3QoJ21hbmFnZWQgcG9saWN5IEFSTnMgYXJlIGRlZHVwbGljYXRlZCcsICgpID0+IHtcbiAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdteS1zdGFjaycpO1xuICBjb25zdCByb2xlID0gbmV3IFJvbGUoc3RhY2ssICdNeVJvbGUnLCB7XG4gICAgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgnc25zLmFtYXpvbmF3cy5jb20nKSxcbiAgICBtYW5hZ2VkUG9saWNpZXM6IFtcbiAgICAgIE1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdTdXBlckRldmVsb3BlcicpLFxuICAgICAgTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoJ1N1cGVyRGV2ZWxvcGVyJyksXG4gICAgXSxcbiAgfSk7XG4gIHJvbGUuYWRkTWFuYWdlZFBvbGljeShNYW5hZ2VkUG9saWN5LmZyb21Bd3NNYW5hZ2VkUG9saWN5TmFtZSgnU3VwZXJEZXZlbG9wZXInKSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpSb2xlJywge1xuICAgIE1hbmFnZWRQb2xpY3lBcm5zOiBbXG4gICAgICB7XG4gICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LFxuICAgICAgICAgICAgJzppYW06OmF3czpwb2xpY3kvU3VwZXJEZXZlbG9wZXInLFxuICAgICAgICAgIF0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIF0sXG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdyb2xlIHdpdGggdG9vIGxhcmdlIGlubGluZSBwb2xpY3knLCAoKSA9PiB7XG4gIGNvbnN0IE4gPSAxMDA7XG5cbiAgbGV0IGFwcDogQXBwO1xuICBsZXQgc3RhY2s6IFN0YWNrO1xuICBsZXQgcm9sZTogUm9sZTtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgYXBwID0gbmV3IEFwcCgpO1xuICAgIHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ215LXN0YWNrJyk7XG4gICAgcm9sZSA9IG5ldyBSb2xlKHN0YWNrLCAnTXlSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgnc2VydmljZS5hbWF6b25hd3MuY29tJyksXG4gICAgfSk7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IE47IGkrKykge1xuICAgICAgcm9sZS5hZGRUb1ByaW5jaXBhbFBvbGljeShuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgYWN0aW9uczogWydhd3M6RG9BVGhpbmcnXSxcbiAgICAgICAgcmVzb3VyY2VzOiBbYGFybjphd3M6c2VydmljZTp1cy1lYXN0LTE6MTExMTIyMjIzMzMzOnNvbWVSZXNvdXJjZS9Tb21lU3BlY2lmaWNSZXNvdXJjZSR7aX1gXSxcbiAgICAgIH0pKTtcbiAgICB9XG4gIH0pO1xuXG4gIHRlc3QoJ2V4Y2VzcyBnZXRzIHNwbGl0IG9mZiBpbnRvIE1hbmFnZWRQb2xpY2llcycsICgpID0+IHtcbiAgICAvLyBUSEVOXG4gICAgY29uc3QgdGVtcGxhdGUgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICAgIHRlbXBsYXRlLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06Ok1hbmFnZWRQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IE1hdGNoLmFycmF5V2l0aChbXG4gICAgICAgICAgTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgICBSZXNvdXJjZTogYGFybjphd3M6c2VydmljZTp1cy1lYXN0LTE6MTExMTIyMjIzMzMzOnNvbWVSZXNvdXJjZS9Tb21lU3BlY2lmaWNSZXNvdXJjZSR7TiAtIDF9YCxcbiAgICAgICAgICB9KSxcbiAgICAgICAgXSksXG4gICAgICB9LFxuICAgICAgUm9sZXM6IFt7IFJlZjogJ015Um9sZUY0OEZGRTA0JyB9XSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnRGVwZW5kYWJsZXMgdHJhY2sgdGhlIGZpbmFsIGRlY2xhcmluZyBjb25zdHJ1Y3QnLCAoKSA9PiB7XG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHJlc3VsdCA9IHJvbGUuYWRkVG9QcmluY2lwYWxQb2xpY3kobmV3IFBvbGljeVN0YXRlbWVudCh7XG4gICAgICBhY3Rpb25zOiBbJ2F3czpEb0FUaGluZyddLFxuICAgICAgcmVzb3VyY2VzOiBbYGFybjphd3M6c2VydmljZTp1cy1lYXN0LTE6MTExMTIyMjIzMzMzOnNvbWVSZXNvdXJjZS9Tb21lU3BlY2lmaWNSZXNvdXJjZSR7Tn1gXSxcbiAgICB9KSk7XG5cbiAgICBjb25zdCByZXMgPSBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdEZXBlbmRlcicsIHtcbiAgICAgIHR5cGU6ICdBV1M6OlNvbWU6OlJlc291cmNlJyxcbiAgICB9KTtcblxuICAgIGV4cGVjdChyZXN1bHQucG9saWN5RGVwZW5kYWJsZSkudG9CZVRydXRoeSgpO1xuICAgIHJlcy5ub2RlLmFkZERlcGVuZGVuY3kocmVzdWx0LnBvbGljeURlcGVuZGFibGUhKTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCB0ZW1wbGF0ZSA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG4gICAgdGVtcGxhdGUuaGFzUmVzb3VyY2UoJ0FXUzo6U29tZTo6UmVzb3VyY2UnLCB7XG4gICAgICBEZXBlbmRzT246IFtcbiAgICAgICAgJ015Um9sZU92ZXJmbG93UG9saWN5MTNFRjU1OTZBJyxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbnRlc3QoJ21hbnkgY29waWVzIG9mIHRoZSBzYW1lIHN0YXRlbWVudCBkbyBub3QgcmVzdWx0IGluIG92ZXJmbG93IHBvbGljaWVzJywgKCkgPT4ge1xuICBjb25zdCBOID0gMTAwO1xuXG4gIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnbXktc3RhY2snKTtcbiAgY29uc3Qgcm9sZSA9IG5ldyBSb2xlKHN0YWNrLCAnTXlSb2xlJywge1xuICAgIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ3NlcnZpY2UuYW1hem9uYXdzLmNvbScpLFxuICB9KTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IE47IGkrKykge1xuICAgIHJvbGUuYWRkVG9QcmluY2lwYWxQb2xpY3kobmV3IFBvbGljeVN0YXRlbWVudCh7XG4gICAgICBhY3Rpb25zOiBbJ2F3czpEb0FUaGluZyddLFxuICAgICAgcmVzb3VyY2VzOiBbJ2Fybjphd3M6c2VydmljZTp1cy1lYXN0LTE6MTExMTIyMjIzMzMzOnNvbWVSZXNvdXJjZS9Tb21lU3BlY2lmaWNSZXNvdXJjZSddLFxuICAgIH0pKTtcbiAgfVxuXG4gIC8vIFRIRU5cbiAgY29uc3QgdGVtcGxhdGUgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICB0ZW1wbGF0ZS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6SUFNOjpNYW5hZ2VkUG9saWN5JywgMCk7XG59KTtcblxudGVzdCgnY3Jvc3MtZW52IHJvbGUgQVJOcyBpbmNsdWRlIHBhdGgnLCAoKSA9PiB7XG4gIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgY29uc3Qgcm9sZVN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ3JvbGUtc3RhY2snLCB7IGVudjogeyBhY2NvdW50OiAnMTIzNDU2Nzg5MDEyJywgcmVnaW9uOiAndXMtZWFzdC0xJyB9IH0pO1xuICBjb25zdCByZWZlcmVuY2VyU3RhY2sgPSBuZXcgU3RhY2soYXBwLCAncmVmZXJlbmNlci1zdGFjaycsIHsgZW52OiB7IHJlZ2lvbjogJ3VzLWVhc3QtMicgfSB9KTtcbiAgY29uc3Qgcm9sZSA9IG5ldyBSb2xlKHJvbGVTdGFjaywgJ1JvbGUnLCB7XG4gICAgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgnc25zLmFtYXpvbmF3cy5jb20nKSxcbiAgICBwYXRoOiAnL3NhbXBsZS9wYXRoLycsXG4gICAgcm9sZU5hbWU6ICdzYW1wbGUtbmFtZScsXG4gIH0pO1xuICBuZXcgQ2ZuUmVzb3VyY2UocmVmZXJlbmNlclN0YWNrLCAnUmVmZXJlbmNlcicsIHtcbiAgICB0eXBlOiAnQ3VzdG9tOjpSb2xlUmVmZXJlbmNlcicsXG4gICAgcHJvcGVydGllczogeyBSb2xlQXJuOiByb2xlLnJvbGVBcm4gfSxcbiAgfSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHJlZmVyZW5jZXJTdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdDdXN0b206OlJvbGVSZWZlcmVuY2VyJywge1xuICAgIFJvbGVBcm46IHtcbiAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgJycsXG4gICAgICAgIFtcbiAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJzppYW06OjEyMzQ1Njc4OTAxMjpyb2xlL3NhbXBsZS9wYXRoL3NhbXBsZS1uYW1lJyxcbiAgICAgICAgXSxcbiAgICAgIF0sXG4gICAgfSxcbiAgfSk7XG59KTtcbiJdfQ==