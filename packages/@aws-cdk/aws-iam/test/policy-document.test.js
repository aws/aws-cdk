"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
describe('IAM policy document', () => {
    test('the Permission class is a programming model for iam', () => {
        const stack = new core_1.Stack();
        const p = new lib_1.PolicyStatement();
        p.addActions('sqs:SendMessage');
        p.addActions('dynamodb:CreateTable', 'dynamodb:DeleteTable');
        p.addResources('myQueue');
        p.addResources('yourQueue');
        p.addAllResources();
        p.addAwsAccountPrincipal(`my${core_1.Token.asString({ account: 'account' })}name`);
        p.addAccountCondition('12221121221');
        expect(stack.resolve(p.toStatementJson())).toEqual({
            Action: ['sqs:SendMessage',
                'dynamodb:CreateTable',
                'dynamodb:DeleteTable'],
            Resource: ['myQueue', 'yourQueue', '*'],
            Effect: 'Allow',
            Principal: {
                AWS: {
                    'Fn::Join': ['',
                        ['arn:',
                            { Ref: 'AWS::Partition' },
                            ':iam::my',
                            { account: 'account' },
                            'name:root']],
                },
            },
            Condition: { StringEquals: { 'sts:ExternalId': '12221121221' } },
        });
    });
    test('the PolicyDocument class is a dom for iam policy documents', () => {
        const stack = new core_1.Stack();
        const doc = new lib_1.PolicyDocument();
        const p1 = new lib_1.PolicyStatement();
        p1.addActions('sqs:SendMessage');
        p1.addNotResources('arn:aws:sqs:us-east-1:123456789012:forbidden_queue');
        const p2 = new lib_1.PolicyStatement();
        p2.effect = lib_1.Effect.DENY;
        p2.addActions('cloudformation:CreateStack');
        const p3 = new lib_1.PolicyStatement();
        p3.effect = lib_1.Effect.ALLOW;
        p3.addNotActions('cloudformation:UpdateTerminationProtection');
        const p4 = new lib_1.PolicyStatement();
        p4.effect = lib_1.Effect.DENY;
        p4.addNotPrincipals(new lib_1.CanonicalUserPrincipal('OnlyAuthorizedUser'));
        doc.addStatements(p1);
        doc.addStatements(p2);
        doc.addStatements(p3);
        doc.addStatements(p4);
        expect(stack.resolve(doc)).toEqual({
            Version: '2012-10-17',
            Statement: [{ Effect: 'Allow', Action: 'sqs:SendMessage', NotResource: 'arn:aws:sqs:us-east-1:123456789012:forbidden_queue' },
                { Effect: 'Deny', Action: 'cloudformation:CreateStack' },
                { Effect: 'Allow', NotAction: 'cloudformation:UpdateTerminationProtection' },
                { Effect: 'Deny', NotPrincipal: { CanonicalUser: 'OnlyAuthorizedUser' } }],
        });
    });
    test('Cannot combine Actions and NotActions', () => {
        expect(() => {
            new lib_1.PolicyStatement({
                actions: ['abc:def'],
                notActions: ['abc:def'],
            });
        }).toThrow(/Cannot add 'NotActions' to policy statement if 'Actions' have been added/);
    });
    test('Throws with invalid actions', () => {
        expect(() => {
            new lib_1.PolicyStatement({
                actions: ['service:action', '*', 'service:acti*', 'in:val:id'],
            });
        }).toThrow(/Action 'in:val:id' is invalid/);
    });
    test('Throws with invalid not actions', () => {
        expect(() => {
            new lib_1.PolicyStatement({
                notActions: ['service:action', '*', 'service:acti*', 'in:val:id'],
            });
        }).toThrow(/Action 'in:val:id' is invalid/);
    });
    // https://github.com/aws/aws-cdk/issues/13479
    test('Does not validate unresolved tokens', () => {
        const stack = new core_1.Stack();
        const perm = new lib_1.PolicyStatement({
            actions: [`${core_1.Lazy.string({ produce: () => 'sqs:sendMessage' })}`],
        });
        expect(stack.resolve(perm.toStatementJson())).toEqual({
            Effect: 'Allow',
            Action: 'sqs:sendMessage',
        });
    });
    test('Cannot combine Resources and NotResources', () => {
        expect(() => {
            new lib_1.PolicyStatement({
                resources: ['abc'],
                notResources: ['def'],
            });
        }).toThrow(/Cannot add 'NotResources' to policy statement if 'Resources' have been added/);
    });
    test('Cannot add NotPrincipals when Principals exist', () => {
        const stmt = new lib_1.PolicyStatement({
            principals: [new lib_1.CanonicalUserPrincipal('abc')],
        });
        expect(() => {
            stmt.addNotPrincipals(new lib_1.CanonicalUserPrincipal('def'));
        }).toThrow(/Cannot add 'NotPrincipals' to policy statement if 'Principals' have been added/);
    });
    test('Cannot add Principals when NotPrincipals exist', () => {
        const stmt = new lib_1.PolicyStatement({
            notPrincipals: [new lib_1.CanonicalUserPrincipal('abc')],
        });
        expect(() => {
            stmt.addPrincipals(new lib_1.CanonicalUserPrincipal('def'));
        }).toThrow(/Cannot add 'Principals' to policy statement if 'NotPrincipals' have been added/);
    });
    test('Permission allows specifying multiple actions upon construction', () => {
        const stack = new core_1.Stack();
        const perm = new lib_1.PolicyStatement();
        perm.addResources('MyResource');
        perm.addActions('service:Action1', 'service:Action2', 'service:Action3');
        expect(stack.resolve(perm.toStatementJson())).toEqual({
            Effect: 'Allow',
            Action: ['service:Action1', 'service:Action2', 'service:Action3'],
            Resource: 'MyResource',
        });
    });
    test('PolicyDoc resolves to undefined if there are no permissions', () => {
        const stack = new core_1.Stack();
        const p = new lib_1.PolicyDocument();
        expect(stack.resolve(p)).toBeUndefined();
    });
    test('canonicalUserPrincipal adds a principal to a policy with the passed canonical user id', () => {
        const stack = new core_1.Stack();
        const p = new lib_1.PolicyStatement();
        const canoncialUser = 'averysuperduperlongstringfor';
        p.addPrincipals(new lib_1.CanonicalUserPrincipal(canoncialUser));
        expect(stack.resolve(p.toStatementJson())).toEqual({
            Effect: 'Allow',
            Principal: {
                CanonicalUser: canoncialUser,
            },
        });
    });
    test('addAccountRootPrincipal adds a principal with the current account root', () => {
        const stack = new core_1.Stack();
        const p = new lib_1.PolicyStatement();
        p.addAccountRootPrincipal();
        expect(stack.resolve(p.toStatementJson())).toEqual({
            Effect: 'Allow',
            Principal: {
                AWS: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            { Ref: 'AWS::Partition' },
                            ':iam::',
                            { Ref: 'AWS::AccountId' },
                            ':root',
                        ],
                    ],
                },
            },
        });
    });
    test('addFederatedPrincipal adds a Federated principal with the passed value', () => {
        const stack = new core_1.Stack();
        const p = new lib_1.PolicyStatement();
        p.addFederatedPrincipal('com.amazon.cognito', { StringEquals: { key: 'value' } });
        expect(stack.resolve(p.toStatementJson())).toEqual({
            Effect: 'Allow',
            Principal: {
                Federated: 'com.amazon.cognito',
            },
            Condition: {
                StringEquals: { key: 'value' },
            },
        });
    });
    test('addAwsAccountPrincipal can be used multiple times', () => {
        const stack = new core_1.Stack();
        const p = new lib_1.PolicyStatement();
        p.addAwsAccountPrincipal('1234');
        p.addAwsAccountPrincipal('5678');
        expect(stack.resolve(p.toStatementJson())).toEqual({
            Effect: 'Allow',
            Principal: {
                AWS: [
                    { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::1234:root']] },
                    { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::5678:root']] },
                ],
            },
        });
    });
    describe('hasResource', () => {
        test('false if there are no resources', () => {
            expect(new lib_1.PolicyStatement().hasResource).toEqual(false);
        });
        test('true if there is one resource', () => {
            expect(new lib_1.PolicyStatement({ resources: ['one-resource'] }).hasResource).toEqual(true);
        });
        test('true for multiple resources', () => {
            const p = new lib_1.PolicyStatement();
            p.addResources('r1');
            p.addResources('r2');
            expect(p.hasResource).toEqual(true);
        });
    });
    describe('hasPrincipal', () => {
        test('false if there is no principal', () => {
            expect(new lib_1.PolicyStatement().hasPrincipal).toEqual(false);
        });
        test('true if there is a principal', () => {
            const p = new lib_1.PolicyStatement();
            p.addArnPrincipal('bla');
            expect(p.hasPrincipal).toEqual(true);
        });
        test('true if there is a notPrincipal', () => {
            const p = new lib_1.PolicyStatement();
            p.addNotPrincipals(new lib_1.CanonicalUserPrincipal('test'));
            expect(p.hasPrincipal).toEqual(true);
        });
    });
    test('statementCount returns the number of statement in the policy document', () => {
        const p = new lib_1.PolicyDocument();
        expect(p.statementCount).toEqual(0);
        p.addStatements(new lib_1.PolicyStatement({ actions: ['service:action1'] }));
        expect(p.statementCount).toEqual(1);
        p.addStatements(new lib_1.PolicyStatement({ actions: ['service:action2'] }));
        expect(p.statementCount).toEqual(2);
    });
    describe('{ AWS: "*" } principal', () => {
        test('is represented as `Anyone`', () => {
            const stack = new core_1.Stack();
            const p = new lib_1.PolicyDocument();
            p.addStatements(new lib_1.PolicyStatement({ principals: [new lib_1.Anyone()] }));
            expect(stack.resolve(p)).toEqual({
                Statement: [
                    { Effect: 'Allow', Principal: { AWS: '*' } },
                ],
                Version: '2012-10-17',
            });
        });
        test('is represented as `AnyPrincipal`', () => {
            const stack = new core_1.Stack();
            const p = new lib_1.PolicyDocument();
            p.addStatements(new lib_1.PolicyStatement({ principals: [new lib_1.AnyPrincipal()] }));
            expect(stack.resolve(p)).toEqual({
                Statement: [
                    { Effect: 'Allow', Principal: { AWS: '*' } },
                ],
                Version: '2012-10-17',
            });
        });
        test('is represented as `addAnyPrincipal`', () => {
            const stack = new core_1.Stack();
            const p = new lib_1.PolicyDocument();
            const s = new lib_1.PolicyStatement();
            s.addAnyPrincipal();
            p.addStatements(s);
            expect(stack.resolve(p)).toEqual({
                Statement: [
                    { Effect: 'Allow', Principal: { AWS: '*' } },
                ],
                Version: '2012-10-17',
            });
        });
    });
    test('addResources() will not break a list-encoded Token', () => {
        const stack = new core_1.Stack();
        const statement = new lib_1.PolicyStatement();
        statement.addActions(...core_1.Lazy.list({ produce: () => ['service:a', 'service:b', 'service:c'] }));
        statement.addResources(...core_1.Lazy.list({ produce: () => ['x', 'y', 'z'] }));
        expect(stack.resolve(statement.toStatementJson())).toEqual({
            Effect: 'Allow',
            Action: ['service:a', 'service:b', 'service:c'],
            Resource: ['x', 'y', 'z'],
        });
    });
    test('addResources()/addActions() will not add duplicates', () => {
        const stack = new core_1.Stack();
        const statement = new lib_1.PolicyStatement();
        statement.addActions('service:a');
        statement.addActions('service:a');
        statement.addResources('x');
        statement.addResources('x');
        expect(stack.resolve(statement.toStatementJson())).toEqual({
            Effect: 'Allow',
            Action: 'service:a',
            Resource: 'x',
        });
    });
    test('addNotResources()/addNotActions() will not add duplicates', () => {
        const stack = new core_1.Stack();
        const statement = new lib_1.PolicyStatement();
        statement.addNotActions('service:a');
        statement.addNotActions('service:a');
        statement.addNotResources('x');
        statement.addNotResources('x');
        expect(stack.resolve(statement.toStatementJson())).toEqual({
            Effect: 'Allow',
            NotAction: 'service:a',
            NotResource: 'x',
        });
    });
    test('addCanonicalUserPrincipal can be used to add cannonical user principals', () => {
        const stack = new core_1.Stack();
        const p = new lib_1.PolicyDocument();
        const s1 = new lib_1.PolicyStatement();
        s1.addCanonicalUserPrincipal('cannonical-user-1');
        const s2 = new lib_1.PolicyStatement();
        s2.addPrincipals(new lib_1.CanonicalUserPrincipal('cannonical-user-2'));
        p.addStatements(s1);
        p.addStatements(s2);
        expect(stack.resolve(p)).toEqual({
            Statement: [
                { Effect: 'Allow', Principal: { CanonicalUser: 'cannonical-user-1' } },
                { Effect: 'Allow', Principal: { CanonicalUser: 'cannonical-user-2' } },
            ],
            Version: '2012-10-17',
        });
    });
    test('addPrincipal correctly merges array in', () => {
        const stack = new core_1.Stack();
        const arrayPrincipal = {
            get grantPrincipal() { return this; },
            assumeRoleAction: 'sts:AssumeRole',
            policyFragment: new lib_1.PrincipalPolicyFragment({ AWS: ['foo', 'bar'] }),
            addToPolicy() { return false; },
            addToPrincipalPolicy() { return { statementAdded: false }; },
        };
        const s = new lib_1.PolicyStatement();
        s.addAccountRootPrincipal();
        s.addPrincipals(arrayPrincipal);
        expect(stack.resolve(s.toStatementJson())).toEqual({
            Effect: 'Allow',
            Principal: {
                AWS: [
                    { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, ':root']] },
                    'foo', 'bar',
                ],
            },
        });
    });
    // https://github.com/aws/aws-cdk/issues/1201
    test('policy statements with multiple principal types can be created using multiple addPrincipal calls', () => {
        const stack = new core_1.Stack();
        const s = new lib_1.PolicyStatement();
        s.addArnPrincipal('349494949494');
        s.addServicePrincipal('test.service');
        s.addResources('resource');
        s.addActions('service:action');
        expect(stack.resolve(s.toStatementJson())).toEqual({
            Action: 'service:action',
            Effect: 'Allow',
            Principal: { AWS: '349494949494', Service: 'test.service' },
            Resource: 'resource',
        });
    });
    describe('Service principals', () => {
        test('regional service principals resolve appropriately', () => {
            const stack = new core_1.Stack(undefined, undefined, { env: { region: 'cn-north-1' } });
            const s = new lib_1.PolicyStatement();
            s.addActions('test:Action');
            s.addServicePrincipal('codedeploy.amazonaws.com');
            expect(stack.resolve(s.toStatementJson())).toEqual({
                Effect: 'Allow',
                Action: 'test:Action',
                Principal: { Service: 'codedeploy.cn-north-1.amazonaws.com.cn' },
            });
        });
        // Deprecated: 'region' parameter to ServicePrincipal shouldn't be used.
        (0, cdk_build_tools_1.testDeprecated)('regional service principals resolve appropriately (with user-set region)', () => {
            const stack = new core_1.Stack(undefined, undefined, { env: { region: 'cn-northeast-1' } });
            const s = new lib_1.PolicyStatement();
            s.addActions('test:Action');
            s.addServicePrincipal('codedeploy.amazonaws.com', { region: 'cn-north-1' });
            expect(stack.resolve(s.toStatementJson())).toEqual({
                Effect: 'Allow',
                Action: 'test:Action',
                Principal: { Service: 'codedeploy.cn-north-1.amazonaws.com.cn' },
            });
        });
        test('obscure service principals resolve to the user-provided value', () => {
            const stack = new core_1.Stack(undefined, undefined, { env: { region: 'cn-north-1' } });
            const s = new lib_1.PolicyStatement();
            s.addActions('test:Action');
            s.addServicePrincipal('test.service-principal.dev');
            expect(stack.resolve(s.toStatementJson())).toEqual({
                Effect: 'Allow',
                Action: 'test:Action',
                Principal: { Service: 'test.service-principal.dev' },
            });
        });
    });
    describe('CompositePrincipal can be used to represent a principal that has multiple types', () => {
        test('with a single principal', () => {
            const stack = new core_1.Stack();
            const p = new lib_1.CompositePrincipal(new lib_1.ArnPrincipal('i:am:an:arn'));
            const statement = new lib_1.PolicyStatement();
            statement.addPrincipals(p);
            expect(stack.resolve(statement.toStatementJson())).toEqual({ Effect: 'Allow', Principal: { AWS: 'i:am:an:arn' } });
        });
        test('conditions are allowed in an assumerolepolicydocument', () => {
            const stack = new core_1.Stack();
            new lib_1.Role(stack, 'Role', {
                assumedBy: new lib_1.CompositePrincipal(new lib_1.ArnPrincipal('i:am'), new lib_1.FederatedPrincipal('federated', { StringEquals: { 'aws:some-key': 'some-value' } })),
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: { AWS: 'i:am' },
                        },
                        {
                            Action: 'sts:AssumeRole',
                            Condition: {
                                StringEquals: { 'aws:some-key': 'some-value' },
                            },
                            Effect: 'Allow',
                            Principal: { Federated: 'federated' },
                        },
                    ],
                },
            });
        });
        test('conditions are not allowed when used in a single statement', () => {
            expect(() => {
                new lib_1.PolicyStatement({
                    actions: ['s3:test'],
                    principals: [new lib_1.CompositePrincipal(new lib_1.ArnPrincipal('i:am'), new lib_1.FederatedPrincipal('federated', { StringEquals: { 'aws:some-key': 'some-value' } }))],
                });
            }).toThrow(/Components of a CompositePrincipal must not have conditions/);
        });
        test('principals and conditions are a big nice merge', () => {
            const stack = new core_1.Stack();
            // add via ctor
            const p = new lib_1.CompositePrincipal(new lib_1.ArnPrincipal('i:am:an:arn'), new lib_1.ServicePrincipal('amazon.com'));
            // add via `addPrincipals` (with condition)
            p.addPrincipals(new lib_1.Anyone(), new lib_1.ServicePrincipal('another.service'));
            const statement = new lib_1.PolicyStatement();
            statement.addPrincipals(p);
            // add via policy statement
            statement.addArnPrincipal('aws-principal-3');
            statement.addCondition('cond2', { boom: '123' });
            expect(stack.resolve(statement.toStatementJson())).toEqual({
                Condition: {
                    cond2: { boom: '123' },
                },
                Effect: 'Allow',
                Principal: {
                    AWS: ['i:am:an:arn', '*', 'aws-principal-3'],
                    Service: ['amazon.com', 'another.service'],
                },
            });
        });
        test('can mix types of assumeRoleAction in a single composite', () => {
            const stack = new core_1.Stack();
            // WHEN
            new lib_1.Role(stack, 'Role', {
                assumedBy: new lib_1.CompositePrincipal(new lib_1.ArnPrincipal('arn'), new lib_1.FederatedPrincipal('fed', {}, 'sts:Boom')),
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: { AWS: 'arn' },
                        },
                        {
                            Action: 'sts:Boom',
                            Effect: 'Allow',
                            Principal: { Federated: 'fed' },
                        },
                    ],
                },
            });
        });
    });
    describe('PrincipalWithConditions can be used to add a principal with conditions', () => {
        test('includes conditions from both the wrapped principal and the wrapper', () => {
            const stack = new core_1.Stack();
            const principalOpts = {
                conditions: {
                    BinaryEquals: {
                        'principal-key': 'SGV5LCBmcmllbmQh',
                    },
                },
            };
            const p = new lib_1.ServicePrincipal('s3.amazonaws.com', principalOpts)
                .withConditions({ StringEquals: { 'wrapper-key': ['val-1', 'val-2'] } });
            const statement = new lib_1.PolicyStatement();
            statement.addPrincipals(p);
            expect(stack.resolve(statement.toStatementJson())).toEqual({
                Condition: {
                    BinaryEquals: { 'principal-key': 'SGV5LCBmcmllbmQh' },
                    StringEquals: { 'wrapper-key': ['val-1', 'val-2'] },
                },
                Effect: 'Allow',
                Principal: {
                    Service: 's3.amazonaws.com',
                },
            });
        });
        test('conditions from addCondition are merged with those from the principal', () => {
            const stack = new core_1.Stack();
            const p = new lib_1.AccountPrincipal('012345678900').withConditions({ StringEquals: { key: 'val' } });
            const statement = new lib_1.PolicyStatement();
            statement.addPrincipals(p);
            statement.addCondition('Null', { 'banned-key': 'true' });
            expect(stack.resolve(statement.toStatementJson())).toEqual({
                Effect: 'Allow',
                Principal: { AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::012345678900:root']] } },
                Condition: { StringEquals: { key: 'val' }, Null: { 'banned-key': 'true' } },
            });
        });
        test('adding conditions via `withConditions` does not affect the original principal', () => {
            const originalPrincipal = new lib_1.ArnPrincipal('iam:an:arn');
            const principalWithConditions = originalPrincipal.withConditions({ StringEquals: { key: 'val' } });
            expect(originalPrincipal.policyFragment.conditions).toEqual({});
            expect(principalWithConditions.policyFragment.conditions).toEqual({ StringEquals: { key: 'val' } });
        });
        test('conditions are merged when operators conflict', () => {
            const p = new lib_1.FederatedPrincipal('fed', {
                OperatorOne: { 'fed-key': 'fed-val' },
                OperatorTwo: { 'fed-key': 'fed-val' },
                OperatorThree: { 'fed-key': 'fed-val' },
            }).withConditions({
                OperatorTwo: { 'with-key': 'with-val' },
                OperatorThree: { 'with-key': 'with-val' },
            });
            const statement = new lib_1.PolicyStatement();
            statement.addCondition('OperatorThree', { 'add-key': 'add-val' });
            statement.addPrincipals(p);
            expect(statement.toStatementJson()).toEqual({
                Effect: 'Allow',
                Principal: { Federated: 'fed' },
                Condition: {
                    OperatorOne: { 'fed-key': 'fed-val' },
                    OperatorTwo: { 'fed-key': 'fed-val', 'with-key': 'with-val' },
                    OperatorThree: { 'fed-key': 'fed-val', 'with-key': 'with-val', 'add-key': 'add-val' },
                },
            });
        });
        test('tokens can be used in conditions', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const statement = new lib_1.PolicyStatement();
            // WHEN
            const p = new lib_1.ArnPrincipal('arn:of:principal').withConditions({
                StringEquals: core_1.Lazy.any({ produce: () => ({ goo: 'zar' }) }),
            });
            statement.addPrincipals(p);
            // THEN
            const resolved = stack.resolve(statement.toStatementJson());
            expect(resolved).toEqual({
                Condition: {
                    StringEquals: {
                        goo: 'zar',
                    },
                },
                Effect: 'Allow',
                Principal: {
                    AWS: 'arn:of:principal',
                },
            });
        });
        test('conditions cannot be merged if they include tokens', () => {
            const p = new lib_1.FederatedPrincipal('fed', {
                StringEquals: { foo: 'bar' },
            }).withConditions({
                StringEquals: core_1.Lazy.any({ produce: () => ({ goo: 'zar' }) }),
            });
            const statement = new lib_1.PolicyStatement();
            expect(() => statement.addPrincipals(p)).toThrow(/multiple "StringEquals" conditions cannot be merged if one of them contains an unresolved token/);
        });
        test('values passed to `withConditions` overwrite values from the wrapped principal ' +
            'when keys conflict within an operator', () => {
            const p = new lib_1.FederatedPrincipal('fed', {
                Operator: { key: 'p-val' },
            }).withConditions({
                Operator: { key: 'with-val' },
            });
            const statement = new lib_1.PolicyStatement();
            statement.addPrincipals(p);
            expect(statement.toStatementJson()).toEqual({
                Effect: 'Allow',
                Principal: { Federated: 'fed' },
                Condition: {
                    Operator: { key: 'with-val' },
                },
            });
        });
    });
    describe('duplicate statements', () => {
        test('without tokens', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const p = new lib_1.PolicyDocument();
            const statement = new lib_1.PolicyStatement();
            statement.addResources('resource1', 'resource2');
            statement.addActions('service:action1', 'service:action2');
            statement.addServicePrincipal('service');
            statement.addConditions({
                a: {
                    b: 'c',
                },
                d: {
                    e: 'f',
                },
            });
            // WHEN
            p.addStatements(statement);
            p.addStatements(statement);
            p.addStatements(statement);
            // THEN
            expect(stack.resolve(p).Statement).toHaveLength(1);
        });
        test('with tokens', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const p = new lib_1.PolicyDocument();
            const statement1 = new lib_1.PolicyStatement();
            statement1.addResources(core_1.Lazy.string({ produce: () => 'resource' }));
            statement1.addActions(core_1.Lazy.string({ produce: () => 'service:action' }));
            const statement2 = new lib_1.PolicyStatement();
            statement2.addResources(core_1.Lazy.string({ produce: () => 'resource' }));
            statement2.addActions(core_1.Lazy.string({ produce: () => 'service:action' }));
            // WHEN
            p.addStatements(statement1);
            p.addStatements(statement2);
            // THEN
            expect(stack.resolve(p).Statement).toHaveLength(1);
        });
    });
    test('autoAssignSids enables auto-assignment of a unique SID for each statement', () => {
        // GIVEN
        const doc = new lib_1.PolicyDocument({
            assignSids: true,
        });
        // WHEN
        doc.addStatements(new lib_1.PolicyStatement({ actions: ['service:action1'], resources: ['resource1'] }));
        doc.addStatements(new lib_1.PolicyStatement({ actions: ['service:action1'], resources: ['resource1'] }));
        doc.addStatements(new lib_1.PolicyStatement({ actions: ['service:action1'], resources: ['resource1'] }));
        doc.addStatements(new lib_1.PolicyStatement({ actions: ['service:action1'], resources: ['resource1'] }));
        doc.addStatements(new lib_1.PolicyStatement({ actions: ['service:action2'], resources: ['resource2'] }));
        // THEN
        const stack = new core_1.Stack();
        expect(stack.resolve(doc)).toEqual({
            Version: '2012-10-17',
            Statement: [
                { Action: 'service:action1', Effect: 'Allow', Resource: 'resource1', Sid: '0' },
                { Action: 'service:action2', Effect: 'Allow', Resource: 'resource2', Sid: '1' },
            ],
        });
    });
    test('constructor args are equivalent to mutating in-place', () => {
        const stack = new core_1.Stack();
        const s = new lib_1.PolicyStatement();
        s.addActions('service:action1', 'service:action2');
        s.addAllResources();
        s.addArnPrincipal('arn');
        s.addCondition('key', { equals: 'value' });
        const doc1 = new lib_1.PolicyDocument();
        doc1.addStatements(s);
        const doc2 = new lib_1.PolicyDocument();
        doc2.addStatements(new lib_1.PolicyStatement({
            actions: ['service:action1', 'service:action2'],
            resources: ['*'],
            principals: [new lib_1.ArnPrincipal('arn')],
            conditions: {
                key: { equals: 'value' },
            },
        }));
        expect(stack.resolve(doc1)).toEqual(stack.resolve(doc2));
    });
    describe('fromJson', () => {
        test("throws error when Statement isn't an array", () => {
            expect(() => {
                lib_1.PolicyDocument.fromJson({
                    Statement: 'asdf',
                });
            }).toThrow(/Statement must be an array/);
        });
    });
    test('adding another condition with the same operator does not delete the original', () => {
        const stack = new core_1.Stack();
        const p = new lib_1.PolicyStatement();
        p.addCondition('StringEquals', { 'kms:ViaService': 'service' });
        p.addAccountCondition('12221121221');
        expect(stack.resolve(p.toStatementJson())).toEqual({
            Effect: 'Allow',
            Condition: { StringEquals: { 'kms:ViaService': 'service', 'sts:ExternalId': '12221121221' } },
        });
    });
    test('validation error if policy statement has no actions', () => {
        const policyStatement = new lib_1.PolicyStatement({
            principals: [new lib_1.AnyPrincipal()],
        });
        // THEN
        const validationErrorsForResourcePolicy = policyStatement.validateForResourcePolicy();
        // const validationErrorsForIdentityPolicy: string[] = policyStatement.validateForIdentityPolicy();
        expect(validationErrorsForResourcePolicy).toEqual(['A PolicyStatement must specify at least one \'action\' or \'notAction\'.']);
    });
    test('validation error if policy statement for resource-based policy has no principals specified', () => {
        const policyStatement = new lib_1.PolicyStatement({
            actions: ['*'],
        });
        // THEN
        const validationErrors = policyStatement.validateForResourcePolicy();
        expect(validationErrors).toEqual(['A PolicyStatement used in a resource-based policy must specify at least one IAM principal.']);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9saWN5LWRvY3VtZW50LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwb2xpY3ktZG9jdW1lbnQudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyw4REFBMEQ7QUFDMUQsd0NBQW1EO0FBQ25ELGdDQUdnQjtBQUVoQixRQUFRLENBQUMscUJBQXFCLEVBQUUsR0FBRyxFQUFFO0lBQ25DLElBQUksQ0FBQyxxREFBcUQsRUFBRSxHQUFHLEVBQUU7UUFDL0QsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUUxQixNQUFNLENBQUMsR0FBRyxJQUFJLHFCQUFlLEVBQUUsQ0FBQztRQUNoQyxDQUFDLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDaEMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxzQkFBc0IsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO1FBQzdELENBQUMsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDMUIsQ0FBQyxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUU1QixDQUFDLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDcEIsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLEtBQUssWUFBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM1RSxDQUFDLENBQUMsbUJBQW1CLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFckMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDakQsTUFBTSxFQUNOLENBQUMsaUJBQWlCO2dCQUNoQixzQkFBc0I7Z0JBQ3RCLHNCQUFzQixDQUFDO1lBQ3pCLFFBQVEsRUFBRSxDQUFDLFNBQVMsRUFBRSxXQUFXLEVBQUUsR0FBRyxDQUFDO1lBQ3ZDLE1BQU0sRUFBRSxPQUFP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QXlCLEVBQUUsQ0FBQztRQUNoRyxtR0FBbUc7UUFDbkcsTUFBTSxDQUFDLGlDQUFpQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsMEVBQTBFLENBQUMsQ0FBQyxDQUFDO0lBQ2xJLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDRGQUE0RixFQUFFLEdBQUcsRUFBRTtRQUN0RyxNQUFNLGVBQWUsR0FBRyxJQUFJLHFCQUFlLENBQUM7WUFDMUMsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDO1NBQ2YsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLE1BQU0sZ0JBQWdCLEdBQWEsZUFBZSxDQUFDLHlCQUF5QixFQUFFLENBQUM7UUFDL0UsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsNEZBQTRGLENBQUMsQ0FBQyxDQUFDO0lBQ25JLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0IHsgdGVzdERlcHJlY2F0ZWQgfSBmcm9tICdAYXdzLWNkay9jZGstYnVpbGQtdG9vbHMnO1xuaW1wb3J0IHsgTGF6eSwgU3RhY2ssIFRva2VuIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQge1xuICBBY2NvdW50UHJpbmNpcGFsLCBBbnlvbmUsIEFueVByaW5jaXBhbCwgQXJuUHJpbmNpcGFsLCBDYW5vbmljYWxVc2VyUHJpbmNpcGFsLCBDb21wb3NpdGVQcmluY2lwYWwsXG4gIEVmZmVjdCwgRmVkZXJhdGVkUHJpbmNpcGFsLCBJUHJpbmNpcGFsLCBQb2xpY3lEb2N1bWVudCwgUG9saWN5U3RhdGVtZW50LCBQcmluY2lwYWxQb2xpY3lGcmFnbWVudCwgU2VydmljZVByaW5jaXBhbCwgUm9sZSxcbn0gZnJvbSAnLi4vbGliJztcblxuZGVzY3JpYmUoJ0lBTSBwb2xpY3kgZG9jdW1lbnQnLCAoKSA9PiB7XG4gIHRlc3QoJ3RoZSBQZXJtaXNzaW9uIGNsYXNzIGlzIGEgcHJvZ3JhbW1pbmcgbW9kZWwgZm9yIGlhbScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3QgcCA9IG5ldyBQb2xpY3lTdGF0ZW1lbnQoKTtcbiAgICBwLmFkZEFjdGlvbnMoJ3NxczpTZW5kTWVzc2FnZScpO1xuICAgIHAuYWRkQWN0aW9ucygnZHluYW1vZGI6Q3JlYXRlVGFibGUnLCAnZHluYW1vZGI6RGVsZXRlVGFibGUnKTtcbiAgICBwLmFkZFJlc291cmNlcygnbXlRdWV1ZScpO1xuICAgIHAuYWRkUmVzb3VyY2VzKCd5b3VyUXVldWUnKTtcblxuICAgIHAuYWRkQWxsUmVzb3VyY2VzKCk7XG4gICAgcC5hZGRBd3NBY2NvdW50UHJpbmNpcGFsKGBteSR7VG9rZW4uYXNTdHJpbmcoeyBhY2NvdW50OiAnYWNjb3VudCcgfSl9bmFtZWApO1xuICAgIHAuYWRkQWNjb3VudENvbmRpdGlvbignMTIyMjExMjEyMjEnKTtcblxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHAudG9TdGF0ZW1lbnRKc29uKCkpKS50b0VxdWFsKHtcbiAgICAgIEFjdGlvbjpcbiAgICAgIFsnc3FzOlNlbmRNZXNzYWdlJyxcbiAgICAgICAgJ2R5bmFtb2RiOkNyZWF0ZVRhYmxlJyxcbiAgICAgICAgJ2R5bmFtb2RiOkRlbGV0ZVRhYmxlJ10sXG4gICAgICBSZXNvdXJjZTogWydteVF1ZXVlJywgJ3lvdXJRdWV1ZScsICcqJ10sXG4gICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICBQcmluY2lwYWw6XG4gICAgICB7XG4gICAgICAgIEFXUzpcbiAgICAgICAgIHtcbiAgICAgICAgICAgJ0ZuOjpKb2luJzpcbiAgICAgICAgICBbJycsXG4gICAgICAgICAgICBbJ2FybjonLFxuICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LFxuICAgICAgICAgICAgICAnOmlhbTo6bXknLFxuICAgICAgICAgICAgICB7IGFjY291bnQ6ICdhY2NvdW50JyB9LFxuICAgICAgICAgICAgICAnbmFtZTpyb290J11dLFxuICAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBDb25kaXRpb246IHsgU3RyaW5nRXF1YWxzOiB7ICdzdHM6RXh0ZXJuYWxJZCc6ICcxMjIyMTEyMTIyMScgfSB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd0aGUgUG9saWN5RG9jdW1lbnQgY2xhc3MgaXMgYSBkb20gZm9yIGlhbSBwb2xpY3kgZG9jdW1lbnRzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgZG9jID0gbmV3IFBvbGljeURvY3VtZW50KCk7XG4gICAgY29uc3QgcDEgPSBuZXcgUG9saWN5U3RhdGVtZW50KCk7XG4gICAgcDEuYWRkQWN0aW9ucygnc3FzOlNlbmRNZXNzYWdlJyk7XG4gICAgcDEuYWRkTm90UmVzb3VyY2VzKCdhcm46YXdzOnNxczp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmZvcmJpZGRlbl9xdWV1ZScpO1xuXG4gICAgY29uc3QgcDIgPSBuZXcgUG9saWN5U3RhdGVtZW50KCk7XG4gICAgcDIuZWZmZWN0ID0gRWZmZWN0LkRFTlk7XG4gICAgcDIuYWRkQWN0aW9ucygnY2xvdWRmb3JtYXRpb246Q3JlYXRlU3RhY2snKTtcblxuICAgIGNvbnN0IHAzID0gbmV3IFBvbGljeVN0YXRlbWVudCgpO1xuICAgIHAzLmVmZmVjdCA9IEVmZmVjdC5BTExPVztcbiAgICBwMy5hZGROb3RBY3Rpb25zKCdjbG91ZGZvcm1hdGlvbjpVcGRhdGVUZXJtaW5hdGlvblByb3RlY3Rpb24nKTtcblxuICAgIGNvbnN0IHA0ID0gbmV3IFBvbGljeVN0YXRlbWVudCgpO1xuICAgIHA0LmVmZmVjdCA9IEVmZmVjdC5ERU5ZO1xuICAgIHA0LmFkZE5vdFByaW5jaXBhbHMobmV3IENhbm9uaWNhbFVzZXJQcmluY2lwYWwoJ09ubHlBdXRob3JpemVkVXNlcicpKTtcblxuICAgIGRvYy5hZGRTdGF0ZW1lbnRzKHAxKTtcbiAgICBkb2MuYWRkU3RhdGVtZW50cyhwMik7XG4gICAgZG9jLmFkZFN0YXRlbWVudHMocDMpO1xuICAgIGRvYy5hZGRTdGF0ZW1lbnRzKHA0KTtcblxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKGRvYykpLnRvRXF1YWwoe1xuICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgU3RhdGVtZW50OlxuICAgICAgICBbeyBFZmZlY3Q6ICdBbGxvdycsIEFjdGlvbjogJ3NxczpTZW5kTWVzc2FnZScsIE5vdFJlc291cmNlOiAnYXJuOmF3czpzcXM6dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjpmb3JiaWRkZW5fcXVldWUnIH0sXG4gICAgICAgICAgeyBFZmZlY3Q6ICdEZW55JywgQWN0aW9uOiAnY2xvdWRmb3JtYXRpb246Q3JlYXRlU3RhY2snIH0sXG4gICAgICAgICAgeyBFZmZlY3Q6ICdBbGxvdycsIE5vdEFjdGlvbjogJ2Nsb3VkZm9ybWF0aW9uOlVwZGF0ZVRlcm1pbmF0aW9uUHJvdGVjdGlvbicgfSxcbiAgICAgICAgICB7IEVmZmVjdDogJ0RlbnknLCBOb3RQcmluY2lwYWw6IHsgQ2Fub25pY2FsVXNlcjogJ09ubHlBdXRob3JpemVkVXNlcicgfSB9XSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnQ2Fubm90IGNvbWJpbmUgQWN0aW9ucyBhbmQgTm90QWN0aW9ucycsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IFBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgIGFjdGlvbnM6IFsnYWJjOmRlZiddLFxuICAgICAgICBub3RBY3Rpb25zOiBbJ2FiYzpkZWYnXSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coL0Nhbm5vdCBhZGQgJ05vdEFjdGlvbnMnIHRvIHBvbGljeSBzdGF0ZW1lbnQgaWYgJ0FjdGlvbnMnIGhhdmUgYmVlbiBhZGRlZC8pO1xuICB9KTtcblxuICB0ZXN0KCdUaHJvd3Mgd2l0aCBpbnZhbGlkIGFjdGlvbnMnLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBQb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICBhY3Rpb25zOiBbJ3NlcnZpY2U6YWN0aW9uJywgJyonLCAnc2VydmljZTphY3RpKicsICdpbjp2YWw6aWQnXSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coL0FjdGlvbiAnaW46dmFsOmlkJyBpcyBpbnZhbGlkLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ1Rocm93cyB3aXRoIGludmFsaWQgbm90IGFjdGlvbnMnLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBQb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICBub3RBY3Rpb25zOiBbJ3NlcnZpY2U6YWN0aW9uJywgJyonLCAnc2VydmljZTphY3RpKicsICdpbjp2YWw6aWQnXSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coL0FjdGlvbiAnaW46dmFsOmlkJyBpcyBpbnZhbGlkLyk7XG4gIH0pO1xuXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3MvYXdzLWNkay9pc3N1ZXMvMTM0NzlcbiAgdGVzdCgnRG9lcyBub3QgdmFsaWRhdGUgdW5yZXNvbHZlZCB0b2tlbnMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBwZXJtID0gbmV3IFBvbGljeVN0YXRlbWVudCh7XG4gICAgICBhY3Rpb25zOiBbYCR7TGF6eS5zdHJpbmcoeyBwcm9kdWNlOiAoKSA9PiAnc3FzOnNlbmRNZXNzYWdlJyB9KX1gXSxcbiAgICB9KTtcblxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHBlcm0udG9TdGF0ZW1lbnRKc29uKCkpKS50b0VxdWFsKHtcbiAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgIEFjdGlvbjogJ3NxczpzZW5kTWVzc2FnZScsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0Nhbm5vdCBjb21iaW5lIFJlc291cmNlcyBhbmQgTm90UmVzb3VyY2VzJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgcmVzb3VyY2VzOiBbJ2FiYyddLFxuICAgICAgICBub3RSZXNvdXJjZXM6IFsnZGVmJ10sXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KC9DYW5ub3QgYWRkICdOb3RSZXNvdXJjZXMnIHRvIHBvbGljeSBzdGF0ZW1lbnQgaWYgJ1Jlc291cmNlcycgaGF2ZSBiZWVuIGFkZGVkLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ0Nhbm5vdCBhZGQgTm90UHJpbmNpcGFscyB3aGVuIFByaW5jaXBhbHMgZXhpc3QnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RtdCA9IG5ldyBQb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgcHJpbmNpcGFsczogW25ldyBDYW5vbmljYWxVc2VyUHJpbmNpcGFsKCdhYmMnKV0sXG4gICAgfSk7XG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIHN0bXQuYWRkTm90UHJpbmNpcGFscyhuZXcgQ2Fub25pY2FsVXNlclByaW5jaXBhbCgnZGVmJykpO1xuICAgIH0pLnRvVGhyb3coL0Nhbm5vdCBhZGQgJ05vdFByaW5jaXBhbHMnIHRvIHBvbGljeSBzdGF0ZW1lbnQgaWYgJ1ByaW5jaXBhbHMnIGhhdmUgYmVlbiBhZGRlZC8pO1xuICB9KTtcblxuICB0ZXN0KCdDYW5ub3QgYWRkIFByaW5jaXBhbHMgd2hlbiBOb3RQcmluY2lwYWxzIGV4aXN0JywgKCkgPT4ge1xuICAgIGNvbnN0IHN0bXQgPSBuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIG5vdFByaW5jaXBhbHM6IFtuZXcgQ2Fub25pY2FsVXNlclByaW5jaXBhbCgnYWJjJyldLFxuICAgIH0pO1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBzdG10LmFkZFByaW5jaXBhbHMobmV3IENhbm9uaWNhbFVzZXJQcmluY2lwYWwoJ2RlZicpKTtcbiAgICB9KS50b1Rocm93KC9DYW5ub3QgYWRkICdQcmluY2lwYWxzJyB0byBwb2xpY3kgc3RhdGVtZW50IGlmICdOb3RQcmluY2lwYWxzJyBoYXZlIGJlZW4gYWRkZWQvKTtcbiAgfSk7XG5cbiAgdGVzdCgnUGVybWlzc2lvbiBhbGxvd3Mgc3BlY2lmeWluZyBtdWx0aXBsZSBhY3Rpb25zIHVwb24gY29uc3RydWN0aW9uJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgcGVybSA9IG5ldyBQb2xpY3lTdGF0ZW1lbnQoKTtcbiAgICBwZXJtLmFkZFJlc291cmNlcygnTXlSZXNvdXJjZScpO1xuICAgIHBlcm0uYWRkQWN0aW9ucygnc2VydmljZTpBY3Rpb24xJywgJ3NlcnZpY2U6QWN0aW9uMicsICdzZXJ2aWNlOkFjdGlvbjMnKTtcblxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHBlcm0udG9TdGF0ZW1lbnRKc29uKCkpKS50b0VxdWFsKHtcbiAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgIEFjdGlvbjogWydzZXJ2aWNlOkFjdGlvbjEnLCAnc2VydmljZTpBY3Rpb24yJywgJ3NlcnZpY2U6QWN0aW9uMyddLFxuICAgICAgUmVzb3VyY2U6ICdNeVJlc291cmNlJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnUG9saWN5RG9jIHJlc29sdmVzIHRvIHVuZGVmaW5lZCBpZiB0aGVyZSBhcmUgbm8gcGVybWlzc2lvbnMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBwID0gbmV3IFBvbGljeURvY3VtZW50KCk7XG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUocCkpLnRvQmVVbmRlZmluZWQoKTtcbiAgfSk7XG5cbiAgdGVzdCgnY2Fub25pY2FsVXNlclByaW5jaXBhbCBhZGRzIGEgcHJpbmNpcGFsIHRvIGEgcG9saWN5IHdpdGggdGhlIHBhc3NlZCBjYW5vbmljYWwgdXNlciBpZCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHAgPSBuZXcgUG9saWN5U3RhdGVtZW50KCk7XG4gICAgY29uc3QgY2Fub25jaWFsVXNlciA9ICdhdmVyeXN1cGVyZHVwZXJsb25nc3RyaW5nZm9yJztcbiAgICBwLmFkZFByaW5jaXBhbHMobmV3IENhbm9uaWNhbFVzZXJQcmluY2lwYWwoY2Fub25jaWFsVXNlcikpO1xuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHAudG9TdGF0ZW1lbnRKc29uKCkpKS50b0VxdWFsKHtcbiAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICBDYW5vbmljYWxVc2VyOiBjYW5vbmNpYWxVc2VyLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkQWNjb3VudFJvb3RQcmluY2lwYWwgYWRkcyBhIHByaW5jaXBhbCB3aXRoIHRoZSBjdXJyZW50IGFjY291bnQgcm9vdCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3QgcCA9IG5ldyBQb2xpY3lTdGF0ZW1lbnQoKTtcbiAgICBwLmFkZEFjY291bnRSb290UHJpbmNpcGFsKCk7XG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUocC50b1N0YXRlbWVudEpzb24oKSkpLnRvRXF1YWwoe1xuICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgUHJpbmNpcGFsOiB7XG4gICAgICAgIEFXUzoge1xuICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICAgICAgICc6aWFtOjonLFxuICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6QWNjb3VudElkJyB9LFxuICAgICAgICAgICAgICAnOnJvb3QnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkRmVkZXJhdGVkUHJpbmNpcGFsIGFkZHMgYSBGZWRlcmF0ZWQgcHJpbmNpcGFsIHdpdGggdGhlIHBhc3NlZCB2YWx1ZScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHAgPSBuZXcgUG9saWN5U3RhdGVtZW50KCk7XG4gICAgcC5hZGRGZWRlcmF0ZWRQcmluY2lwYWwoJ2NvbS5hbWF6b24uY29nbml0bycsIHsgU3RyaW5nRXF1YWxzOiB7IGtleTogJ3ZhbHVlJyB9IH0pO1xuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHAudG9TdGF0ZW1lbnRKc29uKCkpKS50b0VxdWFsKHtcbiAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICBGZWRlcmF0ZWQ6ICdjb20uYW1hem9uLmNvZ25pdG8nLFxuICAgICAgfSxcbiAgICAgIENvbmRpdGlvbjoge1xuICAgICAgICBTdHJpbmdFcXVhbHM6IHsga2V5OiAndmFsdWUnIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdhZGRBd3NBY2NvdW50UHJpbmNpcGFsIGNhbiBiZSB1c2VkIG11bHRpcGxlIHRpbWVzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBjb25zdCBwID0gbmV3IFBvbGljeVN0YXRlbWVudCgpO1xuICAgIHAuYWRkQXdzQWNjb3VudFByaW5jaXBhbCgnMTIzNCcpO1xuICAgIHAuYWRkQXdzQWNjb3VudFByaW5jaXBhbCgnNTY3OCcpO1xuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHAudG9TdGF0ZW1lbnRKc29uKCkpKS50b0VxdWFsKHtcbiAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICBBV1M6IFtcbiAgICAgICAgICB7ICdGbjo6Sm9pbic6IFsnJywgWydhcm46JywgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSwgJzppYW06OjEyMzQ6cm9vdCddXSB9LFxuICAgICAgICAgIHsgJ0ZuOjpKb2luJzogWycnLCBbJ2FybjonLCB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LCAnOmlhbTo6NTY3ODpyb290J11dIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnaGFzUmVzb3VyY2UnLCAoKSA9PiB7XG4gICAgdGVzdCgnZmFsc2UgaWYgdGhlcmUgYXJlIG5vIHJlc291cmNlcycsICgpID0+IHtcbiAgICAgIGV4cGVjdChuZXcgUG9saWN5U3RhdGVtZW50KCkuaGFzUmVzb3VyY2UpLnRvRXF1YWwoZmFsc2UpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgndHJ1ZSBpZiB0aGVyZSBpcyBvbmUgcmVzb3VyY2UnLCAoKSA9PiB7XG4gICAgICBleHBlY3QobmV3IFBvbGljeVN0YXRlbWVudCh7IHJlc291cmNlczogWydvbmUtcmVzb3VyY2UnXSB9KS5oYXNSZXNvdXJjZSkudG9FcXVhbCh0cnVlKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3RydWUgZm9yIG11bHRpcGxlIHJlc291cmNlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHAgPSBuZXcgUG9saWN5U3RhdGVtZW50KCk7XG4gICAgICBwLmFkZFJlc291cmNlcygncjEnKTtcbiAgICAgIHAuYWRkUmVzb3VyY2VzKCdyMicpO1xuICAgICAgZXhwZWN0KHAuaGFzUmVzb3VyY2UpLnRvRXF1YWwodHJ1ZSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdoYXNQcmluY2lwYWwnLCAoKSA9PiB7XG4gICAgdGVzdCgnZmFsc2UgaWYgdGhlcmUgaXMgbm8gcHJpbmNpcGFsJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KG5ldyBQb2xpY3lTdGF0ZW1lbnQoKS5oYXNQcmluY2lwYWwpLnRvRXF1YWwoZmFsc2UpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgndHJ1ZSBpZiB0aGVyZSBpcyBhIHByaW5jaXBhbCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHAgPSBuZXcgUG9saWN5U3RhdGVtZW50KCk7XG4gICAgICBwLmFkZEFyblByaW5jaXBhbCgnYmxhJyk7XG4gICAgICBleHBlY3QocC5oYXNQcmluY2lwYWwpLnRvRXF1YWwodHJ1ZSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd0cnVlIGlmIHRoZXJlIGlzIGEgbm90UHJpbmNpcGFsJywgKCkgPT4ge1xuICAgICAgY29uc3QgcCA9IG5ldyBQb2xpY3lTdGF0ZW1lbnQoKTtcbiAgICAgIHAuYWRkTm90UHJpbmNpcGFscyhuZXcgQ2Fub25pY2FsVXNlclByaW5jaXBhbCgndGVzdCcpKTtcbiAgICAgIGV4cGVjdChwLmhhc1ByaW5jaXBhbCkudG9FcXVhbCh0cnVlKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnc3RhdGVtZW50Q291bnQgcmV0dXJucyB0aGUgbnVtYmVyIG9mIHN0YXRlbWVudCBpbiB0aGUgcG9saWN5IGRvY3VtZW50JywgKCkgPT4ge1xuICAgIGNvbnN0IHAgPSBuZXcgUG9saWN5RG9jdW1lbnQoKTtcbiAgICBleHBlY3QocC5zdGF0ZW1lbnRDb3VudCkudG9FcXVhbCgwKTtcbiAgICBwLmFkZFN0YXRlbWVudHMobmV3IFBvbGljeVN0YXRlbWVudCh7IGFjdGlvbnM6IFsnc2VydmljZTphY3Rpb24xJ10gfSkpO1xuICAgIGV4cGVjdChwLnN0YXRlbWVudENvdW50KS50b0VxdWFsKDEpO1xuICAgIHAuYWRkU3RhdGVtZW50cyhuZXcgUG9saWN5U3RhdGVtZW50KHsgYWN0aW9uczogWydzZXJ2aWNlOmFjdGlvbjInXSB9KSk7XG4gICAgZXhwZWN0KHAuc3RhdGVtZW50Q291bnQpLnRvRXF1YWwoMik7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd7IEFXUzogXCIqXCIgfSBwcmluY2lwYWwnLCAoKSA9PiB7XG4gICAgdGVzdCgnaXMgcmVwcmVzZW50ZWQgYXMgYEFueW9uZWAnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgcCA9IG5ldyBQb2xpY3lEb2N1bWVudCgpO1xuXG4gICAgICBwLmFkZFN0YXRlbWVudHMobmV3IFBvbGljeVN0YXRlbWVudCh7IHByaW5jaXBhbHM6IFtuZXcgQW55b25lKCldIH0pKTtcblxuICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUocCkpLnRvRXF1YWwoe1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7IEVmZmVjdDogJ0FsbG93JywgUHJpbmNpcGFsOiB7IEFXUzogJyonIH0gfSxcbiAgICAgICAgXSxcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdpcyByZXByZXNlbnRlZCBhcyBgQW55UHJpbmNpcGFsYCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCBwID0gbmV3IFBvbGljeURvY3VtZW50KCk7XG5cbiAgICAgIHAuYWRkU3RhdGVtZW50cyhuZXcgUG9saWN5U3RhdGVtZW50KHsgcHJpbmNpcGFsczogW25ldyBBbnlQcmluY2lwYWwoKV0gfSkpO1xuXG4gICAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwKSkudG9FcXVhbCh7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHsgRWZmZWN0OiAnQWxsb3cnLCBQcmluY2lwYWw6IHsgQVdTOiAnKicgfSB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2lzIHJlcHJlc2VudGVkIGFzIGBhZGRBbnlQcmluY2lwYWxgJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHAgPSBuZXcgUG9saWN5RG9jdW1lbnQoKTtcblxuICAgICAgY29uc3QgcyA9IG5ldyBQb2xpY3lTdGF0ZW1lbnQoKTtcbiAgICAgIHMuYWRkQW55UHJpbmNpcGFsKCk7XG4gICAgICBwLmFkZFN0YXRlbWVudHMocyk7XG5cbiAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHApKS50b0VxdWFsKHtcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgeyBFZmZlY3Q6ICdBbGxvdycsIFByaW5jaXBhbDogeyBBV1M6ICcqJyB9IH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdhZGRSZXNvdXJjZXMoKSB3aWxsIG5vdCBicmVhayBhIGxpc3QtZW5jb2RlZCBUb2tlbicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3Qgc3RhdGVtZW50ID0gbmV3IFBvbGljeVN0YXRlbWVudCgpO1xuICAgIHN0YXRlbWVudC5hZGRBY3Rpb25zKC4uLkxhenkubGlzdCh7IHByb2R1Y2U6ICgpID0+IFsnc2VydmljZTphJywgJ3NlcnZpY2U6YicsICdzZXJ2aWNlOmMnXSB9KSk7XG4gICAgc3RhdGVtZW50LmFkZFJlc291cmNlcyguLi5MYXp5Lmxpc3QoeyBwcm9kdWNlOiAoKSA9PiBbJ3gnLCAneScsICd6J10gfSkpO1xuXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoc3RhdGVtZW50LnRvU3RhdGVtZW50SnNvbigpKSkudG9FcXVhbCh7XG4gICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICBBY3Rpb246IFsnc2VydmljZTphJywgJ3NlcnZpY2U6YicsICdzZXJ2aWNlOmMnXSxcbiAgICAgIFJlc291cmNlOiBbJ3gnLCAneScsICd6J10sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZFJlc291cmNlcygpL2FkZEFjdGlvbnMoKSB3aWxsIG5vdCBhZGQgZHVwbGljYXRlcycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3Qgc3RhdGVtZW50ID0gbmV3IFBvbGljeVN0YXRlbWVudCgpO1xuICAgIHN0YXRlbWVudC5hZGRBY3Rpb25zKCdzZXJ2aWNlOmEnKTtcbiAgICBzdGF0ZW1lbnQuYWRkQWN0aW9ucygnc2VydmljZTphJyk7XG5cbiAgICBzdGF0ZW1lbnQuYWRkUmVzb3VyY2VzKCd4Jyk7XG4gICAgc3RhdGVtZW50LmFkZFJlc291cmNlcygneCcpO1xuXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoc3RhdGVtZW50LnRvU3RhdGVtZW50SnNvbigpKSkudG9FcXVhbCh7XG4gICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICBBY3Rpb246ICdzZXJ2aWNlOmEnLFxuICAgICAgUmVzb3VyY2U6ICd4JyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkTm90UmVzb3VyY2VzKCkvYWRkTm90QWN0aW9ucygpIHdpbGwgbm90IGFkZCBkdXBsaWNhdGVzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBjb25zdCBzdGF0ZW1lbnQgPSBuZXcgUG9saWN5U3RhdGVtZW50KCk7XG4gICAgc3RhdGVtZW50LmFkZE5vdEFjdGlvbnMoJ3NlcnZpY2U6YScpO1xuICAgIHN0YXRlbWVudC5hZGROb3RBY3Rpb25zKCdzZXJ2aWNlOmEnKTtcblxuICAgIHN0YXRlbWVudC5hZGROb3RSZXNvdXJjZXMoJ3gnKTtcbiAgICBzdGF0ZW1lbnQuYWRkTm90UmVzb3VyY2VzKCd4Jyk7XG5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShzdGF0ZW1lbnQudG9TdGF0ZW1lbnRKc29uKCkpKS50b0VxdWFsKHtcbiAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgIE5vdEFjdGlvbjogJ3NlcnZpY2U6YScsXG4gICAgICBOb3RSZXNvdXJjZTogJ3gnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdhZGRDYW5vbmljYWxVc2VyUHJpbmNpcGFsIGNhbiBiZSB1c2VkIHRvIGFkZCBjYW5ub25pY2FsIHVzZXIgcHJpbmNpcGFscycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHAgPSBuZXcgUG9saWN5RG9jdW1lbnQoKTtcblxuICAgIGNvbnN0IHMxID0gbmV3IFBvbGljeVN0YXRlbWVudCgpO1xuICAgIHMxLmFkZENhbm9uaWNhbFVzZXJQcmluY2lwYWwoJ2Nhbm5vbmljYWwtdXNlci0xJyk7XG5cbiAgICBjb25zdCBzMiA9IG5ldyBQb2xpY3lTdGF0ZW1lbnQoKTtcbiAgICBzMi5hZGRQcmluY2lwYWxzKG5ldyBDYW5vbmljYWxVc2VyUHJpbmNpcGFsKCdjYW5ub25pY2FsLXVzZXItMicpKTtcblxuICAgIHAuYWRkU3RhdGVtZW50cyhzMSk7XG4gICAgcC5hZGRTdGF0ZW1lbnRzKHMyKTtcblxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHApKS50b0VxdWFsKHtcbiAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICB7IEVmZmVjdDogJ0FsbG93JywgUHJpbmNpcGFsOiB7IENhbm9uaWNhbFVzZXI6ICdjYW5ub25pY2FsLXVzZXItMScgfSB9LFxuICAgICAgICB7IEVmZmVjdDogJ0FsbG93JywgUHJpbmNpcGFsOiB7IENhbm9uaWNhbFVzZXI6ICdjYW5ub25pY2FsLXVzZXItMicgfSB9LFxuICAgICAgXSxcbiAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkUHJpbmNpcGFsIGNvcnJlY3RseSBtZXJnZXMgYXJyYXkgaW4nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBhcnJheVByaW5jaXBhbDogSVByaW5jaXBhbCA9IHtcbiAgICAgIGdldCBncmFudFByaW5jaXBhbCgpIHsgcmV0dXJuIHRoaXM7IH0sXG4gICAgICBhc3N1bWVSb2xlQWN0aW9uOiAnc3RzOkFzc3VtZVJvbGUnLFxuICAgICAgcG9saWN5RnJhZ21lbnQ6IG5ldyBQcmluY2lwYWxQb2xpY3lGcmFnbWVudCh7IEFXUzogWydmb28nLCAnYmFyJ10gfSksXG4gICAgICBhZGRUb1BvbGljeSgpIHsgcmV0dXJuIGZhbHNlOyB9LFxuICAgICAgYWRkVG9QcmluY2lwYWxQb2xpY3koKSB7IHJldHVybiB7IHN0YXRlbWVudEFkZGVkOiBmYWxzZSB9OyB9LFxuICAgIH07XG4gICAgY29uc3QgcyA9IG5ldyBQb2xpY3lTdGF0ZW1lbnQoKTtcbiAgICBzLmFkZEFjY291bnRSb290UHJpbmNpcGFsKCk7XG4gICAgcy5hZGRQcmluY2lwYWxzKGFycmF5UHJpbmNpcGFsKTtcbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShzLnRvU3RhdGVtZW50SnNvbigpKSkudG9FcXVhbCh7XG4gICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgQVdTOiBbXG4gICAgICAgICAgeyAnRm46OkpvaW4nOiBbJycsIFsnYXJuOicsIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sICc6aWFtOjonLCB7IFJlZjogJ0FXUzo6QWNjb3VudElkJyB9LCAnOnJvb3QnXV0gfSxcbiAgICAgICAgICAnZm9vJywgJ2JhcicsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vYXdzL2F3cy1jZGsvaXNzdWVzLzEyMDFcbiAgdGVzdCgncG9saWN5IHN0YXRlbWVudHMgd2l0aCBtdWx0aXBsZSBwcmluY2lwYWwgdHlwZXMgY2FuIGJlIGNyZWF0ZWQgdXNpbmcgbXVsdGlwbGUgYWRkUHJpbmNpcGFsIGNhbGxzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgcyA9IG5ldyBQb2xpY3lTdGF0ZW1lbnQoKTtcbiAgICBzLmFkZEFyblByaW5jaXBhbCgnMzQ5NDk0OTQ5NDk0Jyk7XG4gICAgcy5hZGRTZXJ2aWNlUHJpbmNpcGFsKCd0ZXN0LnNlcnZpY2UnKTtcbiAgICBzLmFkZFJlc291cmNlcygncmVzb3VyY2UnKTtcbiAgICBzLmFkZEFjdGlvbnMoJ3NlcnZpY2U6YWN0aW9uJyk7XG5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShzLnRvU3RhdGVtZW50SnNvbigpKSkudG9FcXVhbCh7XG4gICAgICBBY3Rpb246ICdzZXJ2aWNlOmFjdGlvbicsXG4gICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICBQcmluY2lwYWw6IHsgQVdTOiAnMzQ5NDk0OTQ5NDk0JywgU2VydmljZTogJ3Rlc3Quc2VydmljZScgfSxcbiAgICAgIFJlc291cmNlOiAncmVzb3VyY2UnLFxuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnU2VydmljZSBwcmluY2lwYWxzJywgKCkgPT4ge1xuICAgIHRlc3QoJ3JlZ2lvbmFsIHNlcnZpY2UgcHJpbmNpcGFscyByZXNvbHZlIGFwcHJvcHJpYXRlbHknLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayh1bmRlZmluZWQsIHVuZGVmaW5lZCwgeyBlbnY6IHsgcmVnaW9uOiAnY24tbm9ydGgtMScgfSB9KTtcbiAgICAgIGNvbnN0IHMgPSBuZXcgUG9saWN5U3RhdGVtZW50KCk7XG4gICAgICBzLmFkZEFjdGlvbnMoJ3Rlc3Q6QWN0aW9uJyk7XG4gICAgICBzLmFkZFNlcnZpY2VQcmluY2lwYWwoJ2NvZGVkZXBsb3kuYW1hem9uYXdzLmNvbScpO1xuXG4gICAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShzLnRvU3RhdGVtZW50SnNvbigpKSkudG9FcXVhbCh7XG4gICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgQWN0aW9uOiAndGVzdDpBY3Rpb24nLFxuICAgICAgICBQcmluY2lwYWw6IHsgU2VydmljZTogJ2NvZGVkZXBsb3kuY24tbm9ydGgtMS5hbWF6b25hd3MuY29tLmNuJyB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBEZXByZWNhdGVkOiAncmVnaW9uJyBwYXJhbWV0ZXIgdG8gU2VydmljZVByaW5jaXBhbCBzaG91bGRuJ3QgYmUgdXNlZC5cbiAgICB0ZXN0RGVwcmVjYXRlZCgncmVnaW9uYWwgc2VydmljZSBwcmluY2lwYWxzIHJlc29sdmUgYXBwcm9wcmlhdGVseSAod2l0aCB1c2VyLXNldCByZWdpb24pJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2sodW5kZWZpbmVkLCB1bmRlZmluZWQsIHsgZW52OiB7IHJlZ2lvbjogJ2NuLW5vcnRoZWFzdC0xJyB9IH0pO1xuICAgICAgY29uc3QgcyA9IG5ldyBQb2xpY3lTdGF0ZW1lbnQoKTtcbiAgICAgIHMuYWRkQWN0aW9ucygndGVzdDpBY3Rpb24nKTtcbiAgICAgIHMuYWRkU2VydmljZVByaW5jaXBhbCgnY29kZWRlcGxveS5hbWF6b25hd3MuY29tJywgeyByZWdpb246ICdjbi1ub3J0aC0xJyB9KTtcblxuICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUocy50b1N0YXRlbWVudEpzb24oKSkpLnRvRXF1YWwoe1xuICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgIEFjdGlvbjogJ3Rlc3Q6QWN0aW9uJyxcbiAgICAgICAgUHJpbmNpcGFsOiB7IFNlcnZpY2U6ICdjb2RlZGVwbG95LmNuLW5vcnRoLTEuYW1hem9uYXdzLmNvbS5jbicgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnb2JzY3VyZSBzZXJ2aWNlIHByaW5jaXBhbHMgcmVzb2x2ZSB0byB0aGUgdXNlci1wcm92aWRlZCB2YWx1ZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB7IGVudjogeyByZWdpb246ICdjbi1ub3J0aC0xJyB9IH0pO1xuICAgICAgY29uc3QgcyA9IG5ldyBQb2xpY3lTdGF0ZW1lbnQoKTtcbiAgICAgIHMuYWRkQWN0aW9ucygndGVzdDpBY3Rpb24nKTtcbiAgICAgIHMuYWRkU2VydmljZVByaW5jaXBhbCgndGVzdC5zZXJ2aWNlLXByaW5jaXBhbC5kZXYnKTtcblxuICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUocy50b1N0YXRlbWVudEpzb24oKSkpLnRvRXF1YWwoe1xuICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgIEFjdGlvbjogJ3Rlc3Q6QWN0aW9uJyxcbiAgICAgICAgUHJpbmNpcGFsOiB7IFNlcnZpY2U6ICd0ZXN0LnNlcnZpY2UtcHJpbmNpcGFsLmRldicgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnQ29tcG9zaXRlUHJpbmNpcGFsIGNhbiBiZSB1c2VkIHRvIHJlcHJlc2VudCBhIHByaW5jaXBhbCB0aGF0IGhhcyBtdWx0aXBsZSB0eXBlcycsICgpID0+IHtcblxuICAgIHRlc3QoJ3dpdGggYSBzaW5nbGUgcHJpbmNpcGFsJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHAgPSBuZXcgQ29tcG9zaXRlUHJpbmNpcGFsKG5ldyBBcm5QcmluY2lwYWwoJ2k6YW06YW46YXJuJykpO1xuICAgICAgY29uc3Qgc3RhdGVtZW50ID0gbmV3IFBvbGljeVN0YXRlbWVudCgpO1xuICAgICAgc3RhdGVtZW50LmFkZFByaW5jaXBhbHMocCk7XG4gICAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShzdGF0ZW1lbnQudG9TdGF0ZW1lbnRKc29uKCkpKS50b0VxdWFsKHsgRWZmZWN0OiAnQWxsb3cnLCBQcmluY2lwYWw6IHsgQVdTOiAnaTphbTphbjphcm4nIH0gfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjb25kaXRpb25zIGFyZSBhbGxvd2VkIGluIGFuIGFzc3VtZXJvbGVwb2xpY3lkb2N1bWVudCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBuZXcgUm9sZShzdGFjaywgJ1JvbGUnLCB7XG4gICAgICAgIGFzc3VtZWRCeTogbmV3IENvbXBvc2l0ZVByaW5jaXBhbChcbiAgICAgICAgICBuZXcgQXJuUHJpbmNpcGFsKCdpOmFtJyksXG4gICAgICAgICAgbmV3IEZlZGVyYXRlZFByaW5jaXBhbCgnZmVkZXJhdGVkJywgeyBTdHJpbmdFcXVhbHM6IHsgJ2F3czpzb21lLWtleSc6ICdzb21lLXZhbHVlJyB9IH0pLFxuICAgICAgICApLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6Um9sZScsIHtcbiAgICAgICAgQXNzdW1lUm9sZVBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBQcmluY2lwYWw6IHsgQVdTOiAnaTphbScgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgICAgICAgICAgQ29uZGl0aW9uOiB7XG4gICAgICAgICAgICAgICAgU3RyaW5nRXF1YWxzOiB7ICdhd3M6c29tZS1rZXknOiAnc29tZS12YWx1ZScgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBQcmluY2lwYWw6IHsgRmVkZXJhdGVkOiAnZmVkZXJhdGVkJyB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjb25kaXRpb25zIGFyZSBub3QgYWxsb3dlZCB3aGVuIHVzZWQgaW4gYSBzaW5nbGUgc3RhdGVtZW50JywgKCkgPT4ge1xuXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgICBhY3Rpb25zOiBbJ3MzOnRlc3QnXSxcbiAgICAgICAgICBwcmluY2lwYWxzOiBbbmV3IENvbXBvc2l0ZVByaW5jaXBhbChcbiAgICAgICAgICAgIG5ldyBBcm5QcmluY2lwYWwoJ2k6YW0nKSxcbiAgICAgICAgICAgIG5ldyBGZWRlcmF0ZWRQcmluY2lwYWwoJ2ZlZGVyYXRlZCcsIHsgU3RyaW5nRXF1YWxzOiB7ICdhd3M6c29tZS1rZXknOiAnc29tZS12YWx1ZScgfSB9KSldLFxuICAgICAgICB9KTtcbiAgICAgIH0pLnRvVGhyb3coL0NvbXBvbmVudHMgb2YgYSBDb21wb3NpdGVQcmluY2lwYWwgbXVzdCBub3QgaGF2ZSBjb25kaXRpb25zLyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdwcmluY2lwYWxzIGFuZCBjb25kaXRpb25zIGFyZSBhIGJpZyBuaWNlIG1lcmdlJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIC8vIGFkZCB2aWEgY3RvclxuICAgICAgY29uc3QgcCA9IG5ldyBDb21wb3NpdGVQcmluY2lwYWwoXG4gICAgICAgIG5ldyBBcm5QcmluY2lwYWwoJ2k6YW06YW46YXJuJyksXG4gICAgICAgIG5ldyBTZXJ2aWNlUHJpbmNpcGFsKCdhbWF6b24uY29tJykpO1xuXG4gICAgICAvLyBhZGQgdmlhIGBhZGRQcmluY2lwYWxzYCAod2l0aCBjb25kaXRpb24pXG4gICAgICBwLmFkZFByaW5jaXBhbHMoXG4gICAgICAgIG5ldyBBbnlvbmUoKSxcbiAgICAgICAgbmV3IFNlcnZpY2VQcmluY2lwYWwoJ2Fub3RoZXIuc2VydmljZScpLFxuICAgICAgKTtcblxuICAgICAgY29uc3Qgc3RhdGVtZW50ID0gbmV3IFBvbGljeVN0YXRlbWVudCgpO1xuICAgICAgc3RhdGVtZW50LmFkZFByaW5jaXBhbHMocCk7XG5cbiAgICAgIC8vIGFkZCB2aWEgcG9saWN5IHN0YXRlbWVudFxuICAgICAgc3RhdGVtZW50LmFkZEFyblByaW5jaXBhbCgnYXdzLXByaW5jaXBhbC0zJyk7XG4gICAgICBzdGF0ZW1lbnQuYWRkQ29uZGl0aW9uKCdjb25kMicsIHsgYm9vbTogJzEyMycgfSk7XG5cbiAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHN0YXRlbWVudC50b1N0YXRlbWVudEpzb24oKSkpLnRvRXF1YWwoe1xuICAgICAgICBDb25kaXRpb246IHtcbiAgICAgICAgICBjb25kMjogeyBib29tOiAnMTIzJyB9LFxuICAgICAgICB9LFxuICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICAgIEFXUzogWydpOmFtOmFuOmFybicsICcqJywgJ2F3cy1wcmluY2lwYWwtMyddLFxuICAgICAgICAgIFNlcnZpY2U6IFsnYW1hem9uLmNvbScsICdhbm90aGVyLnNlcnZpY2UnXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY2FuIG1peCB0eXBlcyBvZiBhc3N1bWVSb2xlQWN0aW9uIGluIGEgc2luZ2xlIGNvbXBvc2l0ZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBSb2xlKHN0YWNrLCAnUm9sZScsIHtcbiAgICAgICAgYXNzdW1lZEJ5OiBuZXcgQ29tcG9zaXRlUHJpbmNpcGFsKFxuICAgICAgICAgIG5ldyBBcm5QcmluY2lwYWwoJ2FybicpLFxuICAgICAgICAgIG5ldyBGZWRlcmF0ZWRQcmluY2lwYWwoJ2ZlZCcsIHt9LCAnc3RzOkJvb20nKSksXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpSb2xlJywge1xuICAgICAgICBBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQWN0aW9uOiAnc3RzOkFzc3VtZVJvbGUnLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFByaW5jaXBhbDogeyBBV1M6ICdhcm4nIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246ICdzdHM6Qm9vbScsXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUHJpbmNpcGFsOiB7IEZlZGVyYXRlZDogJ2ZlZCcgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnUHJpbmNpcGFsV2l0aENvbmRpdGlvbnMgY2FuIGJlIHVzZWQgdG8gYWRkIGEgcHJpbmNpcGFsIHdpdGggY29uZGl0aW9ucycsICgpID0+IHtcbiAgICB0ZXN0KCdpbmNsdWRlcyBjb25kaXRpb25zIGZyb20gYm90aCB0aGUgd3JhcHBlZCBwcmluY2lwYWwgYW5kIHRoZSB3cmFwcGVyJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHByaW5jaXBhbE9wdHMgPSB7XG4gICAgICAgIGNvbmRpdGlvbnM6IHtcbiAgICAgICAgICBCaW5hcnlFcXVhbHM6IHtcbiAgICAgICAgICAgICdwcmluY2lwYWwta2V5JzogJ1NHVjVMQ0JtY21sbGJtUWgnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgICAgY29uc3QgcCA9IG5ldyBTZXJ2aWNlUHJpbmNpcGFsKCdzMy5hbWF6b25hd3MuY29tJywgcHJpbmNpcGFsT3B0cylcbiAgICAgICAgLndpdGhDb25kaXRpb25zKHsgU3RyaW5nRXF1YWxzOiB7ICd3cmFwcGVyLWtleSc6IFsndmFsLTEnLCAndmFsLTInXSB9IH0pO1xuICAgICAgY29uc3Qgc3RhdGVtZW50ID0gbmV3IFBvbGljeVN0YXRlbWVudCgpO1xuICAgICAgc3RhdGVtZW50LmFkZFByaW5jaXBhbHMocCk7XG4gICAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShzdGF0ZW1lbnQudG9TdGF0ZW1lbnRKc29uKCkpKS50b0VxdWFsKHtcbiAgICAgICAgQ29uZGl0aW9uOiB7XG4gICAgICAgICAgQmluYXJ5RXF1YWxzOiB7ICdwcmluY2lwYWwta2V5JzogJ1NHVjVMQ0JtY21sbGJtUWgnIH0sXG4gICAgICAgICAgU3RyaW5nRXF1YWxzOiB7ICd3cmFwcGVyLWtleSc6IFsndmFsLTEnLCAndmFsLTInXSB9LFxuICAgICAgICB9LFxuICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICAgIFNlcnZpY2U6ICdzMy5hbWF6b25hd3MuY29tJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY29uZGl0aW9ucyBmcm9tIGFkZENvbmRpdGlvbiBhcmUgbWVyZ2VkIHdpdGggdGhvc2UgZnJvbSB0aGUgcHJpbmNpcGFsJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHAgPSBuZXcgQWNjb3VudFByaW5jaXBhbCgnMDEyMzQ1Njc4OTAwJykud2l0aENvbmRpdGlvbnMoeyBTdHJpbmdFcXVhbHM6IHsga2V5OiAndmFsJyB9IH0pO1xuICAgICAgY29uc3Qgc3RhdGVtZW50ID0gbmV3IFBvbGljeVN0YXRlbWVudCgpO1xuICAgICAgc3RhdGVtZW50LmFkZFByaW5jaXBhbHMocCk7XG4gICAgICBzdGF0ZW1lbnQuYWRkQ29uZGl0aW9uKCdOdWxsJywgeyAnYmFubmVkLWtleSc6ICd0cnVlJyB9KTtcbiAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHN0YXRlbWVudC50b1N0YXRlbWVudEpzb24oKSkpLnRvRXF1YWwoe1xuICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgIFByaW5jaXBhbDogeyBBV1M6IHsgJ0ZuOjpKb2luJzogWycnLCBbJ2FybjonLCB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LCAnOmlhbTo6MDEyMzQ1Njc4OTAwOnJvb3QnXV0gfSB9LFxuICAgICAgICBDb25kaXRpb246IHsgU3RyaW5nRXF1YWxzOiB7IGtleTogJ3ZhbCcgfSwgTnVsbDogeyAnYmFubmVkLWtleSc6ICd0cnVlJyB9IH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2FkZGluZyBjb25kaXRpb25zIHZpYSBgd2l0aENvbmRpdGlvbnNgIGRvZXMgbm90IGFmZmVjdCB0aGUgb3JpZ2luYWwgcHJpbmNpcGFsJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb3JpZ2luYWxQcmluY2lwYWwgPSBuZXcgQXJuUHJpbmNpcGFsKCdpYW06YW46YXJuJyk7XG4gICAgICBjb25zdCBwcmluY2lwYWxXaXRoQ29uZGl0aW9ucyA9IG9yaWdpbmFsUHJpbmNpcGFsLndpdGhDb25kaXRpb25zKHsgU3RyaW5nRXF1YWxzOiB7IGtleTogJ3ZhbCcgfSB9KTtcbiAgICAgIGV4cGVjdChvcmlnaW5hbFByaW5jaXBhbC5wb2xpY3lGcmFnbWVudC5jb25kaXRpb25zKS50b0VxdWFsKHt9KTtcbiAgICAgIGV4cGVjdChwcmluY2lwYWxXaXRoQ29uZGl0aW9ucy5wb2xpY3lGcmFnbWVudC5jb25kaXRpb25zKS50b0VxdWFsKHsgU3RyaW5nRXF1YWxzOiB7IGtleTogJ3ZhbCcgfSB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2NvbmRpdGlvbnMgYXJlIG1lcmdlZCB3aGVuIG9wZXJhdG9ycyBjb25mbGljdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHAgPSBuZXcgRmVkZXJhdGVkUHJpbmNpcGFsKCdmZWQnLCB7XG4gICAgICAgIE9wZXJhdG9yT25lOiB7ICdmZWQta2V5JzogJ2ZlZC12YWwnIH0sXG4gICAgICAgIE9wZXJhdG9yVHdvOiB7ICdmZWQta2V5JzogJ2ZlZC12YWwnIH0sXG4gICAgICAgIE9wZXJhdG9yVGhyZWU6IHsgJ2ZlZC1rZXknOiAnZmVkLXZhbCcgfSxcbiAgICAgIH0pLndpdGhDb25kaXRpb25zKHtcbiAgICAgICAgT3BlcmF0b3JUd286IHsgJ3dpdGgta2V5JzogJ3dpdGgtdmFsJyB9LFxuICAgICAgICBPcGVyYXRvclRocmVlOiB7ICd3aXRoLWtleSc6ICd3aXRoLXZhbCcgfSxcbiAgICAgIH0pO1xuICAgICAgY29uc3Qgc3RhdGVtZW50ID0gbmV3IFBvbGljeVN0YXRlbWVudCgpO1xuICAgICAgc3RhdGVtZW50LmFkZENvbmRpdGlvbignT3BlcmF0b3JUaHJlZScsIHsgJ2FkZC1rZXknOiAnYWRkLXZhbCcgfSk7XG4gICAgICBzdGF0ZW1lbnQuYWRkUHJpbmNpcGFscyhwKTtcbiAgICAgIGV4cGVjdChzdGF0ZW1lbnQudG9TdGF0ZW1lbnRKc29uKCkpLnRvRXF1YWwoe1xuICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgIFByaW5jaXBhbDogeyBGZWRlcmF0ZWQ6ICdmZWQnIH0sXG4gICAgICAgIENvbmRpdGlvbjoge1xuICAgICAgICAgIE9wZXJhdG9yT25lOiB7ICdmZWQta2V5JzogJ2ZlZC12YWwnIH0sXG4gICAgICAgICAgT3BlcmF0b3JUd286IHsgJ2ZlZC1rZXknOiAnZmVkLXZhbCcsICd3aXRoLWtleSc6ICd3aXRoLXZhbCcgfSxcbiAgICAgICAgICBPcGVyYXRvclRocmVlOiB7ICdmZWQta2V5JzogJ2ZlZC12YWwnLCAnd2l0aC1rZXknOiAnd2l0aC12YWwnLCAnYWRkLWtleSc6ICdhZGQtdmFsJyB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd0b2tlbnMgY2FuIGJlIHVzZWQgaW4gY29uZGl0aW9ucycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3Qgc3RhdGVtZW50ID0gbmV3IFBvbGljeVN0YXRlbWVudCgpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBwID0gbmV3IEFyblByaW5jaXBhbCgnYXJuOm9mOnByaW5jaXBhbCcpLndpdGhDb25kaXRpb25zKHtcbiAgICAgICAgU3RyaW5nRXF1YWxzOiBMYXp5LmFueSh7IHByb2R1Y2U6ICgpID0+ICh7IGdvbzogJ3phcicgfSkgfSksXG4gICAgICB9KTtcblxuICAgICAgc3RhdGVtZW50LmFkZFByaW5jaXBhbHMocCk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGNvbnN0IHJlc29sdmVkID0gc3RhY2sucmVzb2x2ZShzdGF0ZW1lbnQudG9TdGF0ZW1lbnRKc29uKCkpO1xuICAgICAgZXhwZWN0KHJlc29sdmVkKS50b0VxdWFsKHtcbiAgICAgICAgQ29uZGl0aW9uOiB7XG4gICAgICAgICAgU3RyaW5nRXF1YWxzOiB7XG4gICAgICAgICAgICBnb286ICd6YXInLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgUHJpbmNpcGFsOiB7XG4gICAgICAgICAgQVdTOiAnYXJuOm9mOnByaW5jaXBhbCcsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2NvbmRpdGlvbnMgY2Fubm90IGJlIG1lcmdlZCBpZiB0aGV5IGluY2x1ZGUgdG9rZW5zJywgKCkgPT4ge1xuICAgICAgY29uc3QgcCA9IG5ldyBGZWRlcmF0ZWRQcmluY2lwYWwoJ2ZlZCcsIHtcbiAgICAgICAgU3RyaW5nRXF1YWxzOiB7IGZvbzogJ2JhcicgfSxcbiAgICAgIH0pLndpdGhDb25kaXRpb25zKHtcbiAgICAgICAgU3RyaW5nRXF1YWxzOiBMYXp5LmFueSh7IHByb2R1Y2U6ICgpID0+ICh7IGdvbzogJ3phcicgfSkgfSksXG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgc3RhdGVtZW50ID0gbmV3IFBvbGljeVN0YXRlbWVudCgpO1xuXG4gICAgICBleHBlY3QoKCkgPT4gc3RhdGVtZW50LmFkZFByaW5jaXBhbHMocCkpLnRvVGhyb3coL211bHRpcGxlIFwiU3RyaW5nRXF1YWxzXCIgY29uZGl0aW9ucyBjYW5ub3QgYmUgbWVyZ2VkIGlmIG9uZSBvZiB0aGVtIGNvbnRhaW5zIGFuIHVucmVzb2x2ZWQgdG9rZW4vKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3ZhbHVlcyBwYXNzZWQgdG8gYHdpdGhDb25kaXRpb25zYCBvdmVyd3JpdGUgdmFsdWVzIGZyb20gdGhlIHdyYXBwZWQgcHJpbmNpcGFsICcgK1xuICAgICAgJ3doZW4ga2V5cyBjb25mbGljdCB3aXRoaW4gYW4gb3BlcmF0b3InLCAoKSA9PiB7XG4gICAgICBjb25zdCBwID0gbmV3IEZlZGVyYXRlZFByaW5jaXBhbCgnZmVkJywge1xuICAgICAgICBPcGVyYXRvcjogeyBrZXk6ICdwLXZhbCcgfSxcbiAgICAgIH0pLndpdGhDb25kaXRpb25zKHtcbiAgICAgICAgT3BlcmF0b3I6IHsga2V5OiAnd2l0aC12YWwnIH0sXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHN0YXRlbWVudCA9IG5ldyBQb2xpY3lTdGF0ZW1lbnQoKTtcbiAgICAgIHN0YXRlbWVudC5hZGRQcmluY2lwYWxzKHApO1xuICAgICAgZXhwZWN0KHN0YXRlbWVudC50b1N0YXRlbWVudEpzb24oKSkudG9FcXVhbCh7XG4gICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgUHJpbmNpcGFsOiB7IEZlZGVyYXRlZDogJ2ZlZCcgfSxcbiAgICAgICAgQ29uZGl0aW9uOiB7XG4gICAgICAgICAgT3BlcmF0b3I6IHsga2V5OiAnd2l0aC12YWwnIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2R1cGxpY2F0ZSBzdGF0ZW1lbnRzJywgKCkgPT4ge1xuXG4gICAgdGVzdCgnd2l0aG91dCB0b2tlbnMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHAgPSBuZXcgUG9saWN5RG9jdW1lbnQoKTtcblxuICAgICAgY29uc3Qgc3RhdGVtZW50ID0gbmV3IFBvbGljeVN0YXRlbWVudCgpO1xuICAgICAgc3RhdGVtZW50LmFkZFJlc291cmNlcygncmVzb3VyY2UxJywgJ3Jlc291cmNlMicpO1xuICAgICAgc3RhdGVtZW50LmFkZEFjdGlvbnMoJ3NlcnZpY2U6YWN0aW9uMScsICdzZXJ2aWNlOmFjdGlvbjInKTtcbiAgICAgIHN0YXRlbWVudC5hZGRTZXJ2aWNlUHJpbmNpcGFsKCdzZXJ2aWNlJyk7XG4gICAgICBzdGF0ZW1lbnQuYWRkQ29uZGl0aW9ucyh7XG4gICAgICAgIGE6IHtcbiAgICAgICAgICBiOiAnYycsXG4gICAgICAgIH0sXG4gICAgICAgIGQ6IHtcbiAgICAgICAgICBlOiAnZicsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgcC5hZGRTdGF0ZW1lbnRzKHN0YXRlbWVudCk7XG4gICAgICBwLmFkZFN0YXRlbWVudHMoc3RhdGVtZW50KTtcbiAgICAgIHAuYWRkU3RhdGVtZW50cyhzdGF0ZW1lbnQpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwKS5TdGF0ZW1lbnQpLnRvSGF2ZUxlbmd0aCgxKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3dpdGggdG9rZW5zJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCBwID0gbmV3IFBvbGljeURvY3VtZW50KCk7XG5cbiAgICAgIGNvbnN0IHN0YXRlbWVudDEgPSBuZXcgUG9saWN5U3RhdGVtZW50KCk7XG4gICAgICBzdGF0ZW1lbnQxLmFkZFJlc291cmNlcyhMYXp5LnN0cmluZyh7IHByb2R1Y2U6ICgpID0+ICdyZXNvdXJjZScgfSkpO1xuICAgICAgc3RhdGVtZW50MS5hZGRBY3Rpb25zKExhenkuc3RyaW5nKHsgcHJvZHVjZTogKCkgPT4gJ3NlcnZpY2U6YWN0aW9uJyB9KSk7XG5cbiAgICAgIGNvbnN0IHN0YXRlbWVudDIgPSBuZXcgUG9saWN5U3RhdGVtZW50KCk7XG4gICAgICBzdGF0ZW1lbnQyLmFkZFJlc291cmNlcyhMYXp5LnN0cmluZyh7IHByb2R1Y2U6ICgpID0+ICdyZXNvdXJjZScgfSkpO1xuICAgICAgc3RhdGVtZW50Mi5hZGRBY3Rpb25zKExhenkuc3RyaW5nKHsgcHJvZHVjZTogKCkgPT4gJ3NlcnZpY2U6YWN0aW9uJyB9KSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIHAuYWRkU3RhdGVtZW50cyhzdGF0ZW1lbnQxKTtcbiAgICAgIHAuYWRkU3RhdGVtZW50cyhzdGF0ZW1lbnQyKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUocCkuU3RhdGVtZW50KS50b0hhdmVMZW5ndGgoMSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2F1dG9Bc3NpZ25TaWRzIGVuYWJsZXMgYXV0by1hc3NpZ25tZW50IG9mIGEgdW5pcXVlIFNJRCBmb3IgZWFjaCBzdGF0ZW1lbnQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBkb2MgPSBuZXcgUG9saWN5RG9jdW1lbnQoe1xuICAgICAgYXNzaWduU2lkczogdHJ1ZSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBkb2MuYWRkU3RhdGVtZW50cyhuZXcgUG9saWN5U3RhdGVtZW50KHsgYWN0aW9uczogWydzZXJ2aWNlOmFjdGlvbjEnXSwgcmVzb3VyY2VzOiBbJ3Jlc291cmNlMSddIH0pKTtcbiAgICBkb2MuYWRkU3RhdGVtZW50cyhuZXcgUG9saWN5U3RhdGVtZW50KHsgYWN0aW9uczogWydzZXJ2aWNlOmFjdGlvbjEnXSwgcmVzb3VyY2VzOiBbJ3Jlc291cmNlMSddIH0pKTtcbiAgICBkb2MuYWRkU3RhdGVtZW50cyhuZXcgUG9saWN5U3RhdGVtZW50KHsgYWN0aW9uczogWydzZXJ2aWNlOmFjdGlvbjEnXSwgcmVzb3VyY2VzOiBbJ3Jlc291cmNlMSddIH0pKTtcbiAgICBkb2MuYWRkU3RhdGVtZW50cyhuZXcgUG9saWN5U3RhdGVtZW50KHsgYWN0aW9uczogWydzZXJ2aWNlOmFjdGlvbjEnXSwgcmVzb3VyY2VzOiBbJ3Jlc291cmNlMSddIH0pKTtcbiAgICBkb2MuYWRkU3RhdGVtZW50cyhuZXcgUG9saWN5U3RhdGVtZW50KHsgYWN0aW9uczogWydzZXJ2aWNlOmFjdGlvbjInXSwgcmVzb3VyY2VzOiBbJ3Jlc291cmNlMiddIH0pKTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKGRvYykpLnRvRXF1YWwoe1xuICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgIHsgQWN0aW9uOiAnc2VydmljZTphY3Rpb24xJywgRWZmZWN0OiAnQWxsb3cnLCBSZXNvdXJjZTogJ3Jlc291cmNlMScsIFNpZDogJzAnIH0sXG4gICAgICAgIHsgQWN0aW9uOiAnc2VydmljZTphY3Rpb24yJywgRWZmZWN0OiAnQWxsb3cnLCBSZXNvdXJjZTogJ3Jlc291cmNlMicsIFNpZDogJzEnIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjb25zdHJ1Y3RvciBhcmdzIGFyZSBlcXVpdmFsZW50IHRvIG11dGF0aW5nIGluLXBsYWNlJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBjb25zdCBzID0gbmV3IFBvbGljeVN0YXRlbWVudCgpO1xuICAgIHMuYWRkQWN0aW9ucygnc2VydmljZTphY3Rpb24xJywgJ3NlcnZpY2U6YWN0aW9uMicpO1xuICAgIHMuYWRkQWxsUmVzb3VyY2VzKCk7XG4gICAgcy5hZGRBcm5QcmluY2lwYWwoJ2FybicpO1xuICAgIHMuYWRkQ29uZGl0aW9uKCdrZXknLCB7IGVxdWFsczogJ3ZhbHVlJyB9KTtcblxuICAgIGNvbnN0IGRvYzEgPSBuZXcgUG9saWN5RG9jdW1lbnQoKTtcbiAgICBkb2MxLmFkZFN0YXRlbWVudHMocyk7XG5cbiAgICBjb25zdCBkb2MyID0gbmV3IFBvbGljeURvY3VtZW50KCk7XG4gICAgZG9jMi5hZGRTdGF0ZW1lbnRzKG5ldyBQb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgYWN0aW9uczogWydzZXJ2aWNlOmFjdGlvbjEnLCAnc2VydmljZTphY3Rpb24yJ10sXG4gICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgICAgcHJpbmNpcGFsczogW25ldyBBcm5QcmluY2lwYWwoJ2FybicpXSxcbiAgICAgIGNvbmRpdGlvbnM6IHtcbiAgICAgICAga2V5OiB7IGVxdWFsczogJ3ZhbHVlJyB9LFxuICAgICAgfSxcbiAgICB9KSk7XG5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShkb2MxKSkudG9FcXVhbChzdGFjay5yZXNvbHZlKGRvYzIpKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2Zyb21Kc29uJywgKCkgPT4ge1xuICAgIHRlc3QoXCJ0aHJvd3MgZXJyb3Igd2hlbiBTdGF0ZW1lbnQgaXNuJ3QgYW4gYXJyYXlcIiwgKCkgPT4ge1xuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgUG9saWN5RG9jdW1lbnQuZnJvbUpzb24oe1xuICAgICAgICAgIFN0YXRlbWVudDogJ2FzZGYnLFxuICAgICAgICB9KTtcbiAgICAgIH0pLnRvVGhyb3coL1N0YXRlbWVudCBtdXN0IGJlIGFuIGFycmF5Lyk7XG4gICAgfSk7XG5cbiAgfSk7XG5cbiAgdGVzdCgnYWRkaW5nIGFub3RoZXIgY29uZGl0aW9uIHdpdGggdGhlIHNhbWUgb3BlcmF0b3IgZG9lcyBub3QgZGVsZXRlIHRoZSBvcmlnaW5hbCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3QgcCA9IG5ldyBQb2xpY3lTdGF0ZW1lbnQoKTtcblxuICAgIHAuYWRkQ29uZGl0aW9uKCdTdHJpbmdFcXVhbHMnLCB7ICdrbXM6VmlhU2VydmljZSc6ICdzZXJ2aWNlJyB9KTtcblxuICAgIHAuYWRkQWNjb3VudENvbmRpdGlvbignMTIyMjExMjEyMjEnKTtcblxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHAudG9TdGF0ZW1lbnRKc29uKCkpKS50b0VxdWFsKHtcbiAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgIENvbmRpdGlvbjogeyBTdHJpbmdFcXVhbHM6IHsgJ2ttczpWaWFTZXJ2aWNlJzogJ3NlcnZpY2UnLCAnc3RzOkV4dGVybmFsSWQnOiAnMTIyMjExMjEyMjEnIH0gfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgndmFsaWRhdGlvbiBlcnJvciBpZiBwb2xpY3kgc3RhdGVtZW50IGhhcyBubyBhY3Rpb25zJywgKCkgPT4ge1xuICAgIGNvbnN0IHBvbGljeVN0YXRlbWVudCA9IG5ldyBQb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgcHJpbmNpcGFsczogW25ldyBBbnlQcmluY2lwYWwoKV0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgdmFsaWRhdGlvbkVycm9yc0ZvclJlc291cmNlUG9saWN5OiBzdHJpbmdbXSA9IHBvbGljeVN0YXRlbWVudC52YWxpZGF0ZUZvclJlc291cmNlUG9saWN5KCk7XG4gICAgLy8gY29uc3QgdmFsaWRhdGlvbkVycm9yc0ZvcklkZW50aXR5UG9saWN5OiBzdHJpbmdbXSA9IHBvbGljeVN0YXRlbWVudC52YWxpZGF0ZUZvcklkZW50aXR5UG9saWN5KCk7XG4gICAgZXhwZWN0KHZhbGlkYXRpb25FcnJvcnNGb3JSZXNvdXJjZVBvbGljeSkudG9FcXVhbChbJ0EgUG9saWN5U3RhdGVtZW50IG11c3Qgc3BlY2lmeSBhdCBsZWFzdCBvbmUgXFwnYWN0aW9uXFwnIG9yIFxcJ25vdEFjdGlvblxcJy4nXSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3ZhbGlkYXRpb24gZXJyb3IgaWYgcG9saWN5IHN0YXRlbWVudCBmb3IgcmVzb3VyY2UtYmFzZWQgcG9saWN5IGhhcyBubyBwcmluY2lwYWxzIHNwZWNpZmllZCcsICgpID0+IHtcbiAgICBjb25zdCBwb2xpY3lTdGF0ZW1lbnQgPSBuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGFjdGlvbnM6IFsnKiddLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnM6IHN0cmluZ1tdID0gcG9saWN5U3RhdGVtZW50LnZhbGlkYXRlRm9yUmVzb3VyY2VQb2xpY3koKTtcbiAgICBleHBlY3QodmFsaWRhdGlvbkVycm9ycykudG9FcXVhbChbJ0EgUG9saWN5U3RhdGVtZW50IHVzZWQgaW4gYSByZXNvdXJjZS1iYXNlZCBwb2xpY3kgbXVzdCBzcGVjaWZ5IGF0IGxlYXN0IG9uZSBJQU0gcHJpbmNpcGFsLiddKTtcbiAgfSk7XG59KTtcbiJdfQ==