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
        cdk_build_tools_1.testDeprecated('regional service principals resolve appropriately (with user-set region)', () => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9saWN5LWRvY3VtZW50LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwb2xpY3ktZG9jdW1lbnQudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyw4REFBMEQ7QUFDMUQsd0NBQW1EO0FBQ25ELGdDQUdnQjtBQUVoQixRQUFRLENBQUMscUJBQXFCLEVBQUUsR0FBRyxFQUFFO0lBQ25DLElBQUksQ0FBQyxxREFBcUQsRUFBRSxHQUFHLEVBQUU7UUFDL0QsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUUxQixNQUFNLENBQUMsR0FBRyxJQUFJLHFCQUFlLEVBQUUsQ0FBQztRQUNoQyxDQUFDLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDaEMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxzQkFBc0IsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO1FBQzdELENBQUMsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDMUIsQ0FBQyxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUU1QixDQUFDLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDcEIsQ0FBQyxDQUFDLHNCQUFzQixDQUFDLEtBQUssWUFBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM1RSxDQUFDLENBQUMsbUJBQW1CLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFckMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDakQsTUFBTSxFQUNOLENBQUMsaUJBQWlCO2dCQUNoQixzQkFBc0I7Z0JBQ3RCLHNCQUFzQixDQUFDO1lBQ3pCLFFBQVEsRUFBRSxDQUFDLFNBQVMsRUFBRSxXQUFXLEVBQUUsR0FBRyxDQUFDO1lBQ3ZDLE1BQU0sRUFBRSxPQUFP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QUFFLENBQUM7UUFDaEcsbUdBQW1HO1FBQ25HLE1BQU0sQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLDBFQUEwRSxDQUFDLENBQUMsQ0FBQztJQUNsSSxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyw0RkFBNEYsRUFBRSxHQUFHLEVBQUU7UUFDdEcsTUFBTSxlQUFlLEdBQUcsSUFBSSxxQkFBZSxDQUFDO1lBQzFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQztTQUNmLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxNQUFNLGdCQUFnQixHQUFhLGVBQWUsQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO1FBQy9FLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLDRGQUE0RixDQUFDLENBQUMsQ0FBQztJQUNuSSxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCB7IHRlc3REZXByZWNhdGVkIH0gZnJvbSAnQGF3cy1jZGsvY2RrLWJ1aWxkLXRvb2xzJztcbmltcG9ydCB7IExhenksIFN0YWNrLCBUb2tlbiB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHtcbiAgQWNjb3VudFByaW5jaXBhbCwgQW55b25lLCBBbnlQcmluY2lwYWwsIEFyblByaW5jaXBhbCwgQ2Fub25pY2FsVXNlclByaW5jaXBhbCwgQ29tcG9zaXRlUHJpbmNpcGFsLFxuICBFZmZlY3QsIEZlZGVyYXRlZFByaW5jaXBhbCwgSVByaW5jaXBhbCwgUG9saWN5RG9jdW1lbnQsIFBvbGljeVN0YXRlbWVudCwgUHJpbmNpcGFsUG9saWN5RnJhZ21lbnQsIFNlcnZpY2VQcmluY2lwYWwsIFJvbGUsXG59IGZyb20gJy4uL2xpYic7XG5cbmRlc2NyaWJlKCdJQU0gcG9saWN5IGRvY3VtZW50JywgKCkgPT4ge1xuICB0ZXN0KCd0aGUgUGVybWlzc2lvbiBjbGFzcyBpcyBhIHByb2dyYW1taW5nIG1vZGVsIGZvciBpYW0nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGNvbnN0IHAgPSBuZXcgUG9saWN5U3RhdGVtZW50KCk7XG4gICAgcC5hZGRBY3Rpb25zKCdzcXM6U2VuZE1lc3NhZ2UnKTtcbiAgICBwLmFkZEFjdGlvbnMoJ2R5bmFtb2RiOkNyZWF0ZVRhYmxlJywgJ2R5bmFtb2RiOkRlbGV0ZVRhYmxlJyk7XG4gICAgcC5hZGRSZXNvdXJjZXMoJ215UXVldWUnKTtcbiAgICBwLmFkZFJlc291cmNlcygneW91clF1ZXVlJyk7XG5cbiAgICBwLmFkZEFsbFJlc291cmNlcygpO1xuICAgIHAuYWRkQXdzQWNjb3VudFByaW5jaXBhbChgbXkke1Rva2VuLmFzU3RyaW5nKHsgYWNjb3VudDogJ2FjY291bnQnIH0pfW5hbWVgKTtcbiAgICBwLmFkZEFjY291bnRDb25kaXRpb24oJzEyMjIxMTIxMjIxJyk7XG5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwLnRvU3RhdGVtZW50SnNvbigpKSkudG9FcXVhbCh7XG4gICAgICBBY3Rpb246XG4gICAgICBbJ3NxczpTZW5kTWVzc2FnZScsXG4gICAgICAgICdkeW5hbW9kYjpDcmVhdGVUYWJsZScsXG4gICAgICAgICdkeW5hbW9kYjpEZWxldGVUYWJsZSddLFxuICAgICAgUmVzb3VyY2U6IFsnbXlRdWV1ZScsICd5b3VyUXVldWUnLCAnKiddLFxuICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgUHJpbmNpcGFsOlxuICAgICAge1xuICAgICAgICBBV1M6XG4gICAgICAgICB7XG4gICAgICAgICAgICdGbjo6Sm9pbic6XG4gICAgICAgICAgWycnLFxuICAgICAgICAgICAgWydhcm46JyxcbiAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgICAgICAgJzppYW06Om15JyxcbiAgICAgICAgICAgICAgeyBhY2NvdW50OiAnYWNjb3VudCcgfSxcbiAgICAgICAgICAgICAgJ25hbWU6cm9vdCddXSxcbiAgICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgQ29uZGl0aW9uOiB7IFN0cmluZ0VxdWFsczogeyAnc3RzOkV4dGVybmFsSWQnOiAnMTIyMjExMjEyMjEnIH0gfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgndGhlIFBvbGljeURvY3VtZW50IGNsYXNzIGlzIGEgZG9tIGZvciBpYW0gcG9saWN5IGRvY3VtZW50cycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGRvYyA9IG5ldyBQb2xpY3lEb2N1bWVudCgpO1xuICAgIGNvbnN0IHAxID0gbmV3IFBvbGljeVN0YXRlbWVudCgpO1xuICAgIHAxLmFkZEFjdGlvbnMoJ3NxczpTZW5kTWVzc2FnZScpO1xuICAgIHAxLmFkZE5vdFJlc291cmNlcygnYXJuOmF3czpzcXM6dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjpmb3JiaWRkZW5fcXVldWUnKTtcblxuICAgIGNvbnN0IHAyID0gbmV3IFBvbGljeVN0YXRlbWVudCgpO1xuICAgIHAyLmVmZmVjdCA9IEVmZmVjdC5ERU5ZO1xuICAgIHAyLmFkZEFjdGlvbnMoJ2Nsb3VkZm9ybWF0aW9uOkNyZWF0ZVN0YWNrJyk7XG5cbiAgICBjb25zdCBwMyA9IG5ldyBQb2xpY3lTdGF0ZW1lbnQoKTtcbiAgICBwMy5lZmZlY3QgPSBFZmZlY3QuQUxMT1c7XG4gICAgcDMuYWRkTm90QWN0aW9ucygnY2xvdWRmb3JtYXRpb246VXBkYXRlVGVybWluYXRpb25Qcm90ZWN0aW9uJyk7XG5cbiAgICBjb25zdCBwNCA9IG5ldyBQb2xpY3lTdGF0ZW1lbnQoKTtcbiAgICBwNC5lZmZlY3QgPSBFZmZlY3QuREVOWTtcbiAgICBwNC5hZGROb3RQcmluY2lwYWxzKG5ldyBDYW5vbmljYWxVc2VyUHJpbmNpcGFsKCdPbmx5QXV0aG9yaXplZFVzZXInKSk7XG5cbiAgICBkb2MuYWRkU3RhdGVtZW50cyhwMSk7XG4gICAgZG9jLmFkZFN0YXRlbWVudHMocDIpO1xuICAgIGRvYy5hZGRTdGF0ZW1lbnRzKHAzKTtcbiAgICBkb2MuYWRkU3RhdGVtZW50cyhwNCk7XG5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShkb2MpKS50b0VxdWFsKHtcbiAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIFN0YXRlbWVudDpcbiAgICAgICAgW3sgRWZmZWN0OiAnQWxsb3cnLCBBY3Rpb246ICdzcXM6U2VuZE1lc3NhZ2UnLCBOb3RSZXNvdXJjZTogJ2Fybjphd3M6c3FzOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6Zm9yYmlkZGVuX3F1ZXVlJyB9LFxuICAgICAgICAgIHsgRWZmZWN0OiAnRGVueScsIEFjdGlvbjogJ2Nsb3VkZm9ybWF0aW9uOkNyZWF0ZVN0YWNrJyB9LFxuICAgICAgICAgIHsgRWZmZWN0OiAnQWxsb3cnLCBOb3RBY3Rpb246ICdjbG91ZGZvcm1hdGlvbjpVcGRhdGVUZXJtaW5hdGlvblByb3RlY3Rpb24nIH0sXG4gICAgICAgICAgeyBFZmZlY3Q6ICdEZW55JywgTm90UHJpbmNpcGFsOiB7IENhbm9uaWNhbFVzZXI6ICdPbmx5QXV0aG9yaXplZFVzZXInIH0gfV0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0Nhbm5vdCBjb21iaW5lIEFjdGlvbnMgYW5kIE5vdEFjdGlvbnMnLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBQb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICBhY3Rpb25zOiBbJ2FiYzpkZWYnXSxcbiAgICAgICAgbm90QWN0aW9uczogWydhYmM6ZGVmJ10sXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KC9DYW5ub3QgYWRkICdOb3RBY3Rpb25zJyB0byBwb2xpY3kgc3RhdGVtZW50IGlmICdBY3Rpb25zJyBoYXZlIGJlZW4gYWRkZWQvKTtcbiAgfSk7XG5cbiAgdGVzdCgnVGhyb3dzIHdpdGggaW52YWxpZCBhY3Rpb25zJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgYWN0aW9uczogWydzZXJ2aWNlOmFjdGlvbicsICcqJywgJ3NlcnZpY2U6YWN0aSonLCAnaW46dmFsOmlkJ10sXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KC9BY3Rpb24gJ2luOnZhbDppZCcgaXMgaW52YWxpZC8pO1xuICB9KTtcblxuICB0ZXN0KCdUaHJvd3Mgd2l0aCBpbnZhbGlkIG5vdCBhY3Rpb25zJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgbm90QWN0aW9uczogWydzZXJ2aWNlOmFjdGlvbicsICcqJywgJ3NlcnZpY2U6YWN0aSonLCAnaW46dmFsOmlkJ10sXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KC9BY3Rpb24gJ2luOnZhbDppZCcgaXMgaW52YWxpZC8pO1xuICB9KTtcblxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vYXdzL2F3cy1jZGsvaXNzdWVzLzEzNDc5XG4gIHRlc3QoJ0RvZXMgbm90IHZhbGlkYXRlIHVucmVzb2x2ZWQgdG9rZW5zJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgcGVybSA9IG5ldyBQb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgYWN0aW9uczogW2Ake0xhenkuc3RyaW5nKHsgcHJvZHVjZTogKCkgPT4gJ3NxczpzZW5kTWVzc2FnZScgfSl9YF0sXG4gICAgfSk7XG5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwZXJtLnRvU3RhdGVtZW50SnNvbigpKSkudG9FcXVhbCh7XG4gICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICBBY3Rpb246ICdzcXM6c2VuZE1lc3NhZ2UnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdDYW5ub3QgY29tYmluZSBSZXNvdXJjZXMgYW5kIE5vdFJlc291cmNlcycsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IFBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgIHJlc291cmNlczogWydhYmMnXSxcbiAgICAgICAgbm90UmVzb3VyY2VzOiBbJ2RlZiddLFxuICAgICAgfSk7XG4gICAgfSkudG9UaHJvdygvQ2Fubm90IGFkZCAnTm90UmVzb3VyY2VzJyB0byBwb2xpY3kgc3RhdGVtZW50IGlmICdSZXNvdXJjZXMnIGhhdmUgYmVlbiBhZGRlZC8pO1xuICB9KTtcblxuICB0ZXN0KCdDYW5ub3QgYWRkIE5vdFByaW5jaXBhbHMgd2hlbiBQcmluY2lwYWxzIGV4aXN0JywgKCkgPT4ge1xuICAgIGNvbnN0IHN0bXQgPSBuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIHByaW5jaXBhbHM6IFtuZXcgQ2Fub25pY2FsVXNlclByaW5jaXBhbCgnYWJjJyldLFxuICAgIH0pO1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBzdG10LmFkZE5vdFByaW5jaXBhbHMobmV3IENhbm9uaWNhbFVzZXJQcmluY2lwYWwoJ2RlZicpKTtcbiAgICB9KS50b1Rocm93KC9DYW5ub3QgYWRkICdOb3RQcmluY2lwYWxzJyB0byBwb2xpY3kgc3RhdGVtZW50IGlmICdQcmluY2lwYWxzJyBoYXZlIGJlZW4gYWRkZWQvKTtcbiAgfSk7XG5cbiAgdGVzdCgnQ2Fubm90IGFkZCBQcmluY2lwYWxzIHdoZW4gTm90UHJpbmNpcGFscyBleGlzdCcsICgpID0+IHtcbiAgICBjb25zdCBzdG10ID0gbmV3IFBvbGljeVN0YXRlbWVudCh7XG4gICAgICBub3RQcmluY2lwYWxzOiBbbmV3IENhbm9uaWNhbFVzZXJQcmluY2lwYWwoJ2FiYycpXSxcbiAgICB9KTtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgc3RtdC5hZGRQcmluY2lwYWxzKG5ldyBDYW5vbmljYWxVc2VyUHJpbmNpcGFsKCdkZWYnKSk7XG4gICAgfSkudG9UaHJvdygvQ2Fubm90IGFkZCAnUHJpbmNpcGFscycgdG8gcG9saWN5IHN0YXRlbWVudCBpZiAnTm90UHJpbmNpcGFscycgaGF2ZSBiZWVuIGFkZGVkLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ1Blcm1pc3Npb24gYWxsb3dzIHNwZWNpZnlpbmcgbXVsdGlwbGUgYWN0aW9ucyB1cG9uIGNvbnN0cnVjdGlvbicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHBlcm0gPSBuZXcgUG9saWN5U3RhdGVtZW50KCk7XG4gICAgcGVybS5hZGRSZXNvdXJjZXMoJ015UmVzb3VyY2UnKTtcbiAgICBwZXJtLmFkZEFjdGlvbnMoJ3NlcnZpY2U6QWN0aW9uMScsICdzZXJ2aWNlOkFjdGlvbjInLCAnc2VydmljZTpBY3Rpb24zJyk7XG5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwZXJtLnRvU3RhdGVtZW50SnNvbigpKSkudG9FcXVhbCh7XG4gICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICBBY3Rpb246IFsnc2VydmljZTpBY3Rpb24xJywgJ3NlcnZpY2U6QWN0aW9uMicsICdzZXJ2aWNlOkFjdGlvbjMnXSxcbiAgICAgIFJlc291cmNlOiAnTXlSZXNvdXJjZScsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ1BvbGljeURvYyByZXNvbHZlcyB0byB1bmRlZmluZWQgaWYgdGhlcmUgYXJlIG5vIHBlcm1pc3Npb25zJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgcCA9IG5ldyBQb2xpY3lEb2N1bWVudCgpO1xuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHApKS50b0JlVW5kZWZpbmVkKCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2Nhbm9uaWNhbFVzZXJQcmluY2lwYWwgYWRkcyBhIHByaW5jaXBhbCB0byBhIHBvbGljeSB3aXRoIHRoZSBwYXNzZWQgY2Fub25pY2FsIHVzZXIgaWQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBwID0gbmV3IFBvbGljeVN0YXRlbWVudCgpO1xuICAgIGNvbnN0IGNhbm9uY2lhbFVzZXIgPSAnYXZlcnlzdXBlcmR1cGVybG9uZ3N0cmluZ2Zvcic7XG4gICAgcC5hZGRQcmluY2lwYWxzKG5ldyBDYW5vbmljYWxVc2VyUHJpbmNpcGFsKGNhbm9uY2lhbFVzZXIpKTtcbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwLnRvU3RhdGVtZW50SnNvbigpKSkudG9FcXVhbCh7XG4gICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgQ2Fub25pY2FsVXNlcjogY2Fub25jaWFsVXNlcixcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZEFjY291bnRSb290UHJpbmNpcGFsIGFkZHMgYSBwcmluY2lwYWwgd2l0aCB0aGUgY3VycmVudCBhY2NvdW50IHJvb3QnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGNvbnN0IHAgPSBuZXcgUG9saWN5U3RhdGVtZW50KCk7XG4gICAgcC5hZGRBY2NvdW50Um9vdFByaW5jaXBhbCgpO1xuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHAudG9TdGF0ZW1lbnRKc29uKCkpKS50b0VxdWFsKHtcbiAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICBBV1M6IHtcbiAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAnJyxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LFxuICAgICAgICAgICAgICAnOmlhbTo6JyxcbiAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSxcbiAgICAgICAgICAgICAgJzpyb290JyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZEZlZGVyYXRlZFByaW5jaXBhbCBhZGRzIGEgRmVkZXJhdGVkIHByaW5jaXBhbCB3aXRoIHRoZSBwYXNzZWQgdmFsdWUnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBwID0gbmV3IFBvbGljeVN0YXRlbWVudCgpO1xuICAgIHAuYWRkRmVkZXJhdGVkUHJpbmNpcGFsKCdjb20uYW1hem9uLmNvZ25pdG8nLCB7IFN0cmluZ0VxdWFsczogeyBrZXk6ICd2YWx1ZScgfSB9KTtcbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwLnRvU3RhdGVtZW50SnNvbigpKSkudG9FcXVhbCh7XG4gICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgRmVkZXJhdGVkOiAnY29tLmFtYXpvbi5jb2duaXRvJyxcbiAgICAgIH0sXG4gICAgICBDb25kaXRpb246IHtcbiAgICAgICAgU3RyaW5nRXF1YWxzOiB7IGtleTogJ3ZhbHVlJyB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkQXdzQWNjb3VudFByaW5jaXBhbCBjYW4gYmUgdXNlZCBtdWx0aXBsZSB0aW1lcycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3QgcCA9IG5ldyBQb2xpY3lTdGF0ZW1lbnQoKTtcbiAgICBwLmFkZEF3c0FjY291bnRQcmluY2lwYWwoJzEyMzQnKTtcbiAgICBwLmFkZEF3c0FjY291bnRQcmluY2lwYWwoJzU2NzgnKTtcbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwLnRvU3RhdGVtZW50SnNvbigpKSkudG9FcXVhbCh7XG4gICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgQVdTOiBbXG4gICAgICAgICAgeyAnRm46OkpvaW4nOiBbJycsIFsnYXJuOicsIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sICc6aWFtOjoxMjM0OnJvb3QnXV0gfSxcbiAgICAgICAgICB7ICdGbjo6Sm9pbic6IFsnJywgWydhcm46JywgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSwgJzppYW06OjU2Nzg6cm9vdCddXSB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2hhc1Jlc291cmNlJywgKCkgPT4ge1xuICAgIHRlc3QoJ2ZhbHNlIGlmIHRoZXJlIGFyZSBubyByZXNvdXJjZXMnLCAoKSA9PiB7XG4gICAgICBleHBlY3QobmV3IFBvbGljeVN0YXRlbWVudCgpLmhhc1Jlc291cmNlKS50b0VxdWFsKGZhbHNlKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3RydWUgaWYgdGhlcmUgaXMgb25lIHJlc291cmNlJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KG5ldyBQb2xpY3lTdGF0ZW1lbnQoeyByZXNvdXJjZXM6IFsnb25lLXJlc291cmNlJ10gfSkuaGFzUmVzb3VyY2UpLnRvRXF1YWwodHJ1ZSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd0cnVlIGZvciBtdWx0aXBsZSByZXNvdXJjZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwID0gbmV3IFBvbGljeVN0YXRlbWVudCgpO1xuICAgICAgcC5hZGRSZXNvdXJjZXMoJ3IxJyk7XG4gICAgICBwLmFkZFJlc291cmNlcygncjInKTtcbiAgICAgIGV4cGVjdChwLmhhc1Jlc291cmNlKS50b0VxdWFsKHRydWUpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnaGFzUHJpbmNpcGFsJywgKCkgPT4ge1xuICAgIHRlc3QoJ2ZhbHNlIGlmIHRoZXJlIGlzIG5vIHByaW5jaXBhbCcsICgpID0+IHtcbiAgICAgIGV4cGVjdChuZXcgUG9saWN5U3RhdGVtZW50KCkuaGFzUHJpbmNpcGFsKS50b0VxdWFsKGZhbHNlKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3RydWUgaWYgdGhlcmUgaXMgYSBwcmluY2lwYWwnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwID0gbmV3IFBvbGljeVN0YXRlbWVudCgpO1xuICAgICAgcC5hZGRBcm5QcmluY2lwYWwoJ2JsYScpO1xuICAgICAgZXhwZWN0KHAuaGFzUHJpbmNpcGFsKS50b0VxdWFsKHRydWUpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgndHJ1ZSBpZiB0aGVyZSBpcyBhIG5vdFByaW5jaXBhbCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHAgPSBuZXcgUG9saWN5U3RhdGVtZW50KCk7XG4gICAgICBwLmFkZE5vdFByaW5jaXBhbHMobmV3IENhbm9uaWNhbFVzZXJQcmluY2lwYWwoJ3Rlc3QnKSk7XG4gICAgICBleHBlY3QocC5oYXNQcmluY2lwYWwpLnRvRXF1YWwodHJ1ZSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3N0YXRlbWVudENvdW50IHJldHVybnMgdGhlIG51bWJlciBvZiBzdGF0ZW1lbnQgaW4gdGhlIHBvbGljeSBkb2N1bWVudCcsICgpID0+IHtcbiAgICBjb25zdCBwID0gbmV3IFBvbGljeURvY3VtZW50KCk7XG4gICAgZXhwZWN0KHAuc3RhdGVtZW50Q291bnQpLnRvRXF1YWwoMCk7XG4gICAgcC5hZGRTdGF0ZW1lbnRzKG5ldyBQb2xpY3lTdGF0ZW1lbnQoeyBhY3Rpb25zOiBbJ3NlcnZpY2U6YWN0aW9uMSddIH0pKTtcbiAgICBleHBlY3QocC5zdGF0ZW1lbnRDb3VudCkudG9FcXVhbCgxKTtcbiAgICBwLmFkZFN0YXRlbWVudHMobmV3IFBvbGljeVN0YXRlbWVudCh7IGFjdGlvbnM6IFsnc2VydmljZTphY3Rpb24yJ10gfSkpO1xuICAgIGV4cGVjdChwLnN0YXRlbWVudENvdW50KS50b0VxdWFsKDIpO1xuICB9KTtcblxuICBkZXNjcmliZSgneyBBV1M6IFwiKlwiIH0gcHJpbmNpcGFsJywgKCkgPT4ge1xuICAgIHRlc3QoJ2lzIHJlcHJlc2VudGVkIGFzIGBBbnlvbmVgJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHAgPSBuZXcgUG9saWN5RG9jdW1lbnQoKTtcblxuICAgICAgcC5hZGRTdGF0ZW1lbnRzKG5ldyBQb2xpY3lTdGF0ZW1lbnQoeyBwcmluY2lwYWxzOiBbbmV3IEFueW9uZSgpXSB9KSk7XG5cbiAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHApKS50b0VxdWFsKHtcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgeyBFZmZlY3Q6ICdBbGxvdycsIFByaW5jaXBhbDogeyBBV1M6ICcqJyB9IH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnaXMgcmVwcmVzZW50ZWQgYXMgYEFueVByaW5jaXBhbGAnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgcCA9IG5ldyBQb2xpY3lEb2N1bWVudCgpO1xuXG4gICAgICBwLmFkZFN0YXRlbWVudHMobmV3IFBvbGljeVN0YXRlbWVudCh7IHByaW5jaXBhbHM6IFtuZXcgQW55UHJpbmNpcGFsKCldIH0pKTtcblxuICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUocCkpLnRvRXF1YWwoe1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7IEVmZmVjdDogJ0FsbG93JywgUHJpbmNpcGFsOiB7IEFXUzogJyonIH0gfSxcbiAgICAgICAgXSxcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdpcyByZXByZXNlbnRlZCBhcyBgYWRkQW55UHJpbmNpcGFsYCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCBwID0gbmV3IFBvbGljeURvY3VtZW50KCk7XG5cbiAgICAgIGNvbnN0IHMgPSBuZXcgUG9saWN5U3RhdGVtZW50KCk7XG4gICAgICBzLmFkZEFueVByaW5jaXBhbCgpO1xuICAgICAgcC5hZGRTdGF0ZW1lbnRzKHMpO1xuXG4gICAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwKSkudG9FcXVhbCh7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHsgRWZmZWN0OiAnQWxsb3cnLCBQcmluY2lwYWw6IHsgQVdTOiAnKicgfSB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkUmVzb3VyY2VzKCkgd2lsbCBub3QgYnJlYWsgYSBsaXN0LWVuY29kZWQgVG9rZW4nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGNvbnN0IHN0YXRlbWVudCA9IG5ldyBQb2xpY3lTdGF0ZW1lbnQoKTtcbiAgICBzdGF0ZW1lbnQuYWRkQWN0aW9ucyguLi5MYXp5Lmxpc3QoeyBwcm9kdWNlOiAoKSA9PiBbJ3NlcnZpY2U6YScsICdzZXJ2aWNlOmInLCAnc2VydmljZTpjJ10gfSkpO1xuICAgIHN0YXRlbWVudC5hZGRSZXNvdXJjZXMoLi4uTGF6eS5saXN0KHsgcHJvZHVjZTogKCkgPT4gWyd4JywgJ3knLCAneiddIH0pKTtcblxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHN0YXRlbWVudC50b1N0YXRlbWVudEpzb24oKSkpLnRvRXF1YWwoe1xuICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgQWN0aW9uOiBbJ3NlcnZpY2U6YScsICdzZXJ2aWNlOmInLCAnc2VydmljZTpjJ10sXG4gICAgICBSZXNvdXJjZTogWyd4JywgJ3knLCAneiddLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdhZGRSZXNvdXJjZXMoKS9hZGRBY3Rpb25zKCkgd2lsbCBub3QgYWRkIGR1cGxpY2F0ZXMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGNvbnN0IHN0YXRlbWVudCA9IG5ldyBQb2xpY3lTdGF0ZW1lbnQoKTtcbiAgICBzdGF0ZW1lbnQuYWRkQWN0aW9ucygnc2VydmljZTphJyk7XG4gICAgc3RhdGVtZW50LmFkZEFjdGlvbnMoJ3NlcnZpY2U6YScpO1xuXG4gICAgc3RhdGVtZW50LmFkZFJlc291cmNlcygneCcpO1xuICAgIHN0YXRlbWVudC5hZGRSZXNvdXJjZXMoJ3gnKTtcblxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHN0YXRlbWVudC50b1N0YXRlbWVudEpzb24oKSkpLnRvRXF1YWwoe1xuICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgQWN0aW9uOiAnc2VydmljZTphJyxcbiAgICAgIFJlc291cmNlOiAneCcsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZE5vdFJlc291cmNlcygpL2FkZE5vdEFjdGlvbnMoKSB3aWxsIG5vdCBhZGQgZHVwbGljYXRlcycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3Qgc3RhdGVtZW50ID0gbmV3IFBvbGljeVN0YXRlbWVudCgpO1xuICAgIHN0YXRlbWVudC5hZGROb3RBY3Rpb25zKCdzZXJ2aWNlOmEnKTtcbiAgICBzdGF0ZW1lbnQuYWRkTm90QWN0aW9ucygnc2VydmljZTphJyk7XG5cbiAgICBzdGF0ZW1lbnQuYWRkTm90UmVzb3VyY2VzKCd4Jyk7XG4gICAgc3RhdGVtZW50LmFkZE5vdFJlc291cmNlcygneCcpO1xuXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoc3RhdGVtZW50LnRvU3RhdGVtZW50SnNvbigpKSkudG9FcXVhbCh7XG4gICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICBOb3RBY3Rpb246ICdzZXJ2aWNlOmEnLFxuICAgICAgTm90UmVzb3VyY2U6ICd4JyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkQ2Fub25pY2FsVXNlclByaW5jaXBhbCBjYW4gYmUgdXNlZCB0byBhZGQgY2Fubm9uaWNhbCB1c2VyIHByaW5jaXBhbHMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBwID0gbmV3IFBvbGljeURvY3VtZW50KCk7XG5cbiAgICBjb25zdCBzMSA9IG5ldyBQb2xpY3lTdGF0ZW1lbnQoKTtcbiAgICBzMS5hZGRDYW5vbmljYWxVc2VyUHJpbmNpcGFsKCdjYW5ub25pY2FsLXVzZXItMScpO1xuXG4gICAgY29uc3QgczIgPSBuZXcgUG9saWN5U3RhdGVtZW50KCk7XG4gICAgczIuYWRkUHJpbmNpcGFscyhuZXcgQ2Fub25pY2FsVXNlclByaW5jaXBhbCgnY2Fubm9uaWNhbC11c2VyLTInKSk7XG5cbiAgICBwLmFkZFN0YXRlbWVudHMoczEpO1xuICAgIHAuYWRkU3RhdGVtZW50cyhzMik7XG5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwKSkudG9FcXVhbCh7XG4gICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgeyBFZmZlY3Q6ICdBbGxvdycsIFByaW5jaXBhbDogeyBDYW5vbmljYWxVc2VyOiAnY2Fubm9uaWNhbC11c2VyLTEnIH0gfSxcbiAgICAgICAgeyBFZmZlY3Q6ICdBbGxvdycsIFByaW5jaXBhbDogeyBDYW5vbmljYWxVc2VyOiAnY2Fubm9uaWNhbC11c2VyLTInIH0gfSxcbiAgICAgIF0sXG4gICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZFByaW5jaXBhbCBjb3JyZWN0bHkgbWVyZ2VzIGFycmF5IGluJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgYXJyYXlQcmluY2lwYWw6IElQcmluY2lwYWwgPSB7XG4gICAgICBnZXQgZ3JhbnRQcmluY2lwYWwoKSB7IHJldHVybiB0aGlzOyB9LFxuICAgICAgYXNzdW1lUm9sZUFjdGlvbjogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgIHBvbGljeUZyYWdtZW50OiBuZXcgUHJpbmNpcGFsUG9saWN5RnJhZ21lbnQoeyBBV1M6IFsnZm9vJywgJ2JhciddIH0pLFxuICAgICAgYWRkVG9Qb2xpY3koKSB7IHJldHVybiBmYWxzZTsgfSxcbiAgICAgIGFkZFRvUHJpbmNpcGFsUG9saWN5KCkgeyByZXR1cm4geyBzdGF0ZW1lbnRBZGRlZDogZmFsc2UgfTsgfSxcbiAgICB9O1xuICAgIGNvbnN0IHMgPSBuZXcgUG9saWN5U3RhdGVtZW50KCk7XG4gICAgcy5hZGRBY2NvdW50Um9vdFByaW5jaXBhbCgpO1xuICAgIHMuYWRkUHJpbmNpcGFscyhhcnJheVByaW5jaXBhbCk7XG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUocy50b1N0YXRlbWVudEpzb24oKSkpLnRvRXF1YWwoe1xuICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgUHJpbmNpcGFsOiB7XG4gICAgICAgIEFXUzogW1xuICAgICAgICAgIHsgJ0ZuOjpKb2luJzogWycnLCBbJ2FybjonLCB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LCAnOmlhbTo6JywgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSwgJzpyb290J11dIH0sXG4gICAgICAgICAgJ2ZvbycsICdiYXInLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2F3cy9hd3MtY2RrL2lzc3Vlcy8xMjAxXG4gIHRlc3QoJ3BvbGljeSBzdGF0ZW1lbnRzIHdpdGggbXVsdGlwbGUgcHJpbmNpcGFsIHR5cGVzIGNhbiBiZSBjcmVhdGVkIHVzaW5nIG11bHRpcGxlIGFkZFByaW5jaXBhbCBjYWxscycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHMgPSBuZXcgUG9saWN5U3RhdGVtZW50KCk7XG4gICAgcy5hZGRBcm5QcmluY2lwYWwoJzM0OTQ5NDk0OTQ5NCcpO1xuICAgIHMuYWRkU2VydmljZVByaW5jaXBhbCgndGVzdC5zZXJ2aWNlJyk7XG4gICAgcy5hZGRSZXNvdXJjZXMoJ3Jlc291cmNlJyk7XG4gICAgcy5hZGRBY3Rpb25zKCdzZXJ2aWNlOmFjdGlvbicpO1xuXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUocy50b1N0YXRlbWVudEpzb24oKSkpLnRvRXF1YWwoe1xuICAgICAgQWN0aW9uOiAnc2VydmljZTphY3Rpb24nLFxuICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgUHJpbmNpcGFsOiB7IEFXUzogJzM0OTQ5NDk0OTQ5NCcsIFNlcnZpY2U6ICd0ZXN0LnNlcnZpY2UnIH0sXG4gICAgICBSZXNvdXJjZTogJ3Jlc291cmNlJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ1NlcnZpY2UgcHJpbmNpcGFscycsICgpID0+IHtcbiAgICB0ZXN0KCdyZWdpb25hbCBzZXJ2aWNlIHByaW5jaXBhbHMgcmVzb2x2ZSBhcHByb3ByaWF0ZWx5JywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2sodW5kZWZpbmVkLCB1bmRlZmluZWQsIHsgZW52OiB7IHJlZ2lvbjogJ2NuLW5vcnRoLTEnIH0gfSk7XG4gICAgICBjb25zdCBzID0gbmV3IFBvbGljeVN0YXRlbWVudCgpO1xuICAgICAgcy5hZGRBY3Rpb25zKCd0ZXN0OkFjdGlvbicpO1xuICAgICAgcy5hZGRTZXJ2aWNlUHJpbmNpcGFsKCdjb2RlZGVwbG95LmFtYXpvbmF3cy5jb20nKTtcblxuICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUocy50b1N0YXRlbWVudEpzb24oKSkpLnRvRXF1YWwoe1xuICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgIEFjdGlvbjogJ3Rlc3Q6QWN0aW9uJyxcbiAgICAgICAgUHJpbmNpcGFsOiB7IFNlcnZpY2U6ICdjb2RlZGVwbG95LmNuLW5vcnRoLTEuYW1hem9uYXdzLmNvbS5jbicgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gRGVwcmVjYXRlZDogJ3JlZ2lvbicgcGFyYW1ldGVyIHRvIFNlcnZpY2VQcmluY2lwYWwgc2hvdWxkbid0IGJlIHVzZWQuXG4gICAgdGVzdERlcHJlY2F0ZWQoJ3JlZ2lvbmFsIHNlcnZpY2UgcHJpbmNpcGFscyByZXNvbHZlIGFwcHJvcHJpYXRlbHkgKHdpdGggdXNlci1zZXQgcmVnaW9uKScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB7IGVudjogeyByZWdpb246ICdjbi1ub3J0aGVhc3QtMScgfSB9KTtcbiAgICAgIGNvbnN0IHMgPSBuZXcgUG9saWN5U3RhdGVtZW50KCk7XG4gICAgICBzLmFkZEFjdGlvbnMoJ3Rlc3Q6QWN0aW9uJyk7XG4gICAgICBzLmFkZFNlcnZpY2VQcmluY2lwYWwoJ2NvZGVkZXBsb3kuYW1hem9uYXdzLmNvbScsIHsgcmVnaW9uOiAnY24tbm9ydGgtMScgfSk7XG5cbiAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHMudG9TdGF0ZW1lbnRKc29uKCkpKS50b0VxdWFsKHtcbiAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICBBY3Rpb246ICd0ZXN0OkFjdGlvbicsXG4gICAgICAgIFByaW5jaXBhbDogeyBTZXJ2aWNlOiAnY29kZWRlcGxveS5jbi1ub3J0aC0xLmFtYXpvbmF3cy5jb20uY24nIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ29ic2N1cmUgc2VydmljZSBwcmluY2lwYWxzIHJlc29sdmUgdG8gdGhlIHVzZXItcHJvdmlkZWQgdmFsdWUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayh1bmRlZmluZWQsIHVuZGVmaW5lZCwgeyBlbnY6IHsgcmVnaW9uOiAnY24tbm9ydGgtMScgfSB9KTtcbiAgICAgIGNvbnN0IHMgPSBuZXcgUG9saWN5U3RhdGVtZW50KCk7XG4gICAgICBzLmFkZEFjdGlvbnMoJ3Rlc3Q6QWN0aW9uJyk7XG4gICAgICBzLmFkZFNlcnZpY2VQcmluY2lwYWwoJ3Rlc3Quc2VydmljZS1wcmluY2lwYWwuZGV2Jyk7XG5cbiAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHMudG9TdGF0ZW1lbnRKc29uKCkpKS50b0VxdWFsKHtcbiAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICBBY3Rpb246ICd0ZXN0OkFjdGlvbicsXG4gICAgICAgIFByaW5jaXBhbDogeyBTZXJ2aWNlOiAndGVzdC5zZXJ2aWNlLXByaW5jaXBhbC5kZXYnIH0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ0NvbXBvc2l0ZVByaW5jaXBhbCBjYW4gYmUgdXNlZCB0byByZXByZXNlbnQgYSBwcmluY2lwYWwgdGhhdCBoYXMgbXVsdGlwbGUgdHlwZXMnLCAoKSA9PiB7XG5cbiAgICB0ZXN0KCd3aXRoIGEgc2luZ2xlIHByaW5jaXBhbCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCBwID0gbmV3IENvbXBvc2l0ZVByaW5jaXBhbChuZXcgQXJuUHJpbmNpcGFsKCdpOmFtOmFuOmFybicpKTtcbiAgICAgIGNvbnN0IHN0YXRlbWVudCA9IG5ldyBQb2xpY3lTdGF0ZW1lbnQoKTtcbiAgICAgIHN0YXRlbWVudC5hZGRQcmluY2lwYWxzKHApO1xuICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoc3RhdGVtZW50LnRvU3RhdGVtZW50SnNvbigpKSkudG9FcXVhbCh7IEVmZmVjdDogJ0FsbG93JywgUHJpbmNpcGFsOiB7IEFXUzogJ2k6YW06YW46YXJuJyB9IH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY29uZGl0aW9ucyBhcmUgYWxsb3dlZCBpbiBhbiBhc3N1bWVyb2xlcG9saWN5ZG9jdW1lbnQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgbmV3IFJvbGUoc3RhY2ssICdSb2xlJywge1xuICAgICAgICBhc3N1bWVkQnk6IG5ldyBDb21wb3NpdGVQcmluY2lwYWwoXG4gICAgICAgICAgbmV3IEFyblByaW5jaXBhbCgnaTphbScpLFxuICAgICAgICAgIG5ldyBGZWRlcmF0ZWRQcmluY2lwYWwoJ2ZlZGVyYXRlZCcsIHsgU3RyaW5nRXF1YWxzOiB7ICdhd3M6c29tZS1rZXknOiAnc29tZS12YWx1ZScgfSB9KSxcbiAgICAgICAgKSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlJvbGUnLCB7XG4gICAgICAgIEFzc3VtZVJvbGVQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUHJpbmNpcGFsOiB7IEFXUzogJ2k6YW0nIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgICAgIENvbmRpdGlvbjoge1xuICAgICAgICAgICAgICAgIFN0cmluZ0VxdWFsczogeyAnYXdzOnNvbWUta2V5JzogJ3NvbWUtdmFsdWUnIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUHJpbmNpcGFsOiB7IEZlZGVyYXRlZDogJ2ZlZGVyYXRlZCcgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY29uZGl0aW9ucyBhcmUgbm90IGFsbG93ZWQgd2hlbiB1c2VkIGluIGEgc2luZ2xlIHN0YXRlbWVudCcsICgpID0+IHtcblxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgbmV3IFBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgICAgYWN0aW9uczogWydzMzp0ZXN0J10sXG4gICAgICAgICAgcHJpbmNpcGFsczogW25ldyBDb21wb3NpdGVQcmluY2lwYWwoXG4gICAgICAgICAgICBuZXcgQXJuUHJpbmNpcGFsKCdpOmFtJyksXG4gICAgICAgICAgICBuZXcgRmVkZXJhdGVkUHJpbmNpcGFsKCdmZWRlcmF0ZWQnLCB7IFN0cmluZ0VxdWFsczogeyAnYXdzOnNvbWUta2V5JzogJ3NvbWUtdmFsdWUnIH0gfSkpXSxcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KC9Db21wb25lbnRzIG9mIGEgQ29tcG9zaXRlUHJpbmNpcGFsIG11c3Qgbm90IGhhdmUgY29uZGl0aW9ucy8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgncHJpbmNpcGFscyBhbmQgY29uZGl0aW9ucyBhcmUgYSBiaWcgbmljZSBtZXJnZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICAvLyBhZGQgdmlhIGN0b3JcbiAgICAgIGNvbnN0IHAgPSBuZXcgQ29tcG9zaXRlUHJpbmNpcGFsKFxuICAgICAgICBuZXcgQXJuUHJpbmNpcGFsKCdpOmFtOmFuOmFybicpLFxuICAgICAgICBuZXcgU2VydmljZVByaW5jaXBhbCgnYW1hem9uLmNvbScpKTtcblxuICAgICAgLy8gYWRkIHZpYSBgYWRkUHJpbmNpcGFsc2AgKHdpdGggY29uZGl0aW9uKVxuICAgICAgcC5hZGRQcmluY2lwYWxzKFxuICAgICAgICBuZXcgQW55b25lKCksXG4gICAgICAgIG5ldyBTZXJ2aWNlUHJpbmNpcGFsKCdhbm90aGVyLnNlcnZpY2UnKSxcbiAgICAgICk7XG5cbiAgICAgIGNvbnN0IHN0YXRlbWVudCA9IG5ldyBQb2xpY3lTdGF0ZW1lbnQoKTtcbiAgICAgIHN0YXRlbWVudC5hZGRQcmluY2lwYWxzKHApO1xuXG4gICAgICAvLyBhZGQgdmlhIHBvbGljeSBzdGF0ZW1lbnRcbiAgICAgIHN0YXRlbWVudC5hZGRBcm5QcmluY2lwYWwoJ2F3cy1wcmluY2lwYWwtMycpO1xuICAgICAgc3RhdGVtZW50LmFkZENvbmRpdGlvbignY29uZDInLCB7IGJvb206ICcxMjMnIH0pO1xuXG4gICAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShzdGF0ZW1lbnQudG9TdGF0ZW1lbnRKc29uKCkpKS50b0VxdWFsKHtcbiAgICAgICAgQ29uZGl0aW9uOiB7XG4gICAgICAgICAgY29uZDI6IHsgYm9vbTogJzEyMycgfSxcbiAgICAgICAgfSxcbiAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICBBV1M6IFsnaTphbTphbjphcm4nLCAnKicsICdhd3MtcHJpbmNpcGFsLTMnXSxcbiAgICAgICAgICBTZXJ2aWNlOiBbJ2FtYXpvbi5jb20nLCAnYW5vdGhlci5zZXJ2aWNlJ10sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2NhbiBtaXggdHlwZXMgb2YgYXNzdW1lUm9sZUFjdGlvbiBpbiBhIHNpbmdsZSBjb21wb3NpdGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgUm9sZShzdGFjaywgJ1JvbGUnLCB7XG4gICAgICAgIGFzc3VtZWRCeTogbmV3IENvbXBvc2l0ZVByaW5jaXBhbChcbiAgICAgICAgICBuZXcgQXJuUHJpbmNpcGFsKCdhcm4nKSxcbiAgICAgICAgICBuZXcgRmVkZXJhdGVkUHJpbmNpcGFsKCdmZWQnLCB7fSwgJ3N0czpCb29tJykpLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6Um9sZScsIHtcbiAgICAgICAgQXNzdW1lUm9sZVBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBQcmluY2lwYWw6IHsgQVdTOiAnYXJuJyB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQWN0aW9uOiAnc3RzOkJvb20nLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFByaW5jaXBhbDogeyBGZWRlcmF0ZWQ6ICdmZWQnIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ1ByaW5jaXBhbFdpdGhDb25kaXRpb25zIGNhbiBiZSB1c2VkIHRvIGFkZCBhIHByaW5jaXBhbCB3aXRoIGNvbmRpdGlvbnMnLCAoKSA9PiB7XG4gICAgdGVzdCgnaW5jbHVkZXMgY29uZGl0aW9ucyBmcm9tIGJvdGggdGhlIHdyYXBwZWQgcHJpbmNpcGFsIGFuZCB0aGUgd3JhcHBlcicsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCBwcmluY2lwYWxPcHRzID0ge1xuICAgICAgICBjb25kaXRpb25zOiB7XG4gICAgICAgICAgQmluYXJ5RXF1YWxzOiB7XG4gICAgICAgICAgICAncHJpbmNpcGFsLWtleSc6ICdTR1Y1TENCbWNtbGxibVFoJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfTtcbiAgICAgIGNvbnN0IHAgPSBuZXcgU2VydmljZVByaW5jaXBhbCgnczMuYW1hem9uYXdzLmNvbScsIHByaW5jaXBhbE9wdHMpXG4gICAgICAgIC53aXRoQ29uZGl0aW9ucyh7IFN0cmluZ0VxdWFsczogeyAnd3JhcHBlci1rZXknOiBbJ3ZhbC0xJywgJ3ZhbC0yJ10gfSB9KTtcbiAgICAgIGNvbnN0IHN0YXRlbWVudCA9IG5ldyBQb2xpY3lTdGF0ZW1lbnQoKTtcbiAgICAgIHN0YXRlbWVudC5hZGRQcmluY2lwYWxzKHApO1xuICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoc3RhdGVtZW50LnRvU3RhdGVtZW50SnNvbigpKSkudG9FcXVhbCh7XG4gICAgICAgIENvbmRpdGlvbjoge1xuICAgICAgICAgIEJpbmFyeUVxdWFsczogeyAncHJpbmNpcGFsLWtleSc6ICdTR1Y1TENCbWNtbGxibVFoJyB9LFxuICAgICAgICAgIFN0cmluZ0VxdWFsczogeyAnd3JhcHBlci1rZXknOiBbJ3ZhbC0xJywgJ3ZhbC0yJ10gfSxcbiAgICAgICAgfSxcbiAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICBTZXJ2aWNlOiAnczMuYW1hem9uYXdzLmNvbScsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2NvbmRpdGlvbnMgZnJvbSBhZGRDb25kaXRpb24gYXJlIG1lcmdlZCB3aXRoIHRob3NlIGZyb20gdGhlIHByaW5jaXBhbCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCBwID0gbmV3IEFjY291bnRQcmluY2lwYWwoJzAxMjM0NTY3ODkwMCcpLndpdGhDb25kaXRpb25zKHsgU3RyaW5nRXF1YWxzOiB7IGtleTogJ3ZhbCcgfSB9KTtcbiAgICAgIGNvbnN0IHN0YXRlbWVudCA9IG5ldyBQb2xpY3lTdGF0ZW1lbnQoKTtcbiAgICAgIHN0YXRlbWVudC5hZGRQcmluY2lwYWxzKHApO1xuICAgICAgc3RhdGVtZW50LmFkZENvbmRpdGlvbignTnVsbCcsIHsgJ2Jhbm5lZC1rZXknOiAndHJ1ZScgfSk7XG4gICAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShzdGF0ZW1lbnQudG9TdGF0ZW1lbnRKc29uKCkpKS50b0VxdWFsKHtcbiAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICBQcmluY2lwYWw6IHsgQVdTOiB7ICdGbjo6Sm9pbic6IFsnJywgWydhcm46JywgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSwgJzppYW06OjAxMjM0NTY3ODkwMDpyb290J11dIH0gfSxcbiAgICAgICAgQ29uZGl0aW9uOiB7IFN0cmluZ0VxdWFsczogeyBrZXk6ICd2YWwnIH0sIE51bGw6IHsgJ2Jhbm5lZC1rZXknOiAndHJ1ZScgfSB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhZGRpbmcgY29uZGl0aW9ucyB2aWEgYHdpdGhDb25kaXRpb25zYCBkb2VzIG5vdCBhZmZlY3QgdGhlIG9yaWdpbmFsIHByaW5jaXBhbCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG9yaWdpbmFsUHJpbmNpcGFsID0gbmV3IEFyblByaW5jaXBhbCgnaWFtOmFuOmFybicpO1xuICAgICAgY29uc3QgcHJpbmNpcGFsV2l0aENvbmRpdGlvbnMgPSBvcmlnaW5hbFByaW5jaXBhbC53aXRoQ29uZGl0aW9ucyh7IFN0cmluZ0VxdWFsczogeyBrZXk6ICd2YWwnIH0gfSk7XG4gICAgICBleHBlY3Qob3JpZ2luYWxQcmluY2lwYWwucG9saWN5RnJhZ21lbnQuY29uZGl0aW9ucykudG9FcXVhbCh7fSk7XG4gICAgICBleHBlY3QocHJpbmNpcGFsV2l0aENvbmRpdGlvbnMucG9saWN5RnJhZ21lbnQuY29uZGl0aW9ucykudG9FcXVhbCh7IFN0cmluZ0VxdWFsczogeyBrZXk6ICd2YWwnIH0gfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjb25kaXRpb25zIGFyZSBtZXJnZWQgd2hlbiBvcGVyYXRvcnMgY29uZmxpY3QnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwID0gbmV3IEZlZGVyYXRlZFByaW5jaXBhbCgnZmVkJywge1xuICAgICAgICBPcGVyYXRvck9uZTogeyAnZmVkLWtleSc6ICdmZWQtdmFsJyB9LFxuICAgICAgICBPcGVyYXRvclR3bzogeyAnZmVkLWtleSc6ICdmZWQtdmFsJyB9LFxuICAgICAgICBPcGVyYXRvclRocmVlOiB7ICdmZWQta2V5JzogJ2ZlZC12YWwnIH0sXG4gICAgICB9KS53aXRoQ29uZGl0aW9ucyh7XG4gICAgICAgIE9wZXJhdG9yVHdvOiB7ICd3aXRoLWtleSc6ICd3aXRoLXZhbCcgfSxcbiAgICAgICAgT3BlcmF0b3JUaHJlZTogeyAnd2l0aC1rZXknOiAnd2l0aC12YWwnIH0sXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHN0YXRlbWVudCA9IG5ldyBQb2xpY3lTdGF0ZW1lbnQoKTtcbiAgICAgIHN0YXRlbWVudC5hZGRDb25kaXRpb24oJ09wZXJhdG9yVGhyZWUnLCB7ICdhZGQta2V5JzogJ2FkZC12YWwnIH0pO1xuICAgICAgc3RhdGVtZW50LmFkZFByaW5jaXBhbHMocCk7XG4gICAgICBleHBlY3Qoc3RhdGVtZW50LnRvU3RhdGVtZW50SnNvbigpKS50b0VxdWFsKHtcbiAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICBQcmluY2lwYWw6IHsgRmVkZXJhdGVkOiAnZmVkJyB9LFxuICAgICAgICBDb25kaXRpb246IHtcbiAgICAgICAgICBPcGVyYXRvck9uZTogeyAnZmVkLWtleSc6ICdmZWQtdmFsJyB9LFxuICAgICAgICAgIE9wZXJhdG9yVHdvOiB7ICdmZWQta2V5JzogJ2ZlZC12YWwnLCAnd2l0aC1rZXknOiAnd2l0aC12YWwnIH0sXG4gICAgICAgICAgT3BlcmF0b3JUaHJlZTogeyAnZmVkLWtleSc6ICdmZWQtdmFsJywgJ3dpdGgta2V5JzogJ3dpdGgtdmFsJywgJ2FkZC1rZXknOiAnYWRkLXZhbCcgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgndG9rZW5zIGNhbiBiZSB1c2VkIGluIGNvbmRpdGlvbnMnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHN0YXRlbWVudCA9IG5ldyBQb2xpY3lTdGF0ZW1lbnQoKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3QgcCA9IG5ldyBBcm5QcmluY2lwYWwoJ2FybjpvZjpwcmluY2lwYWwnKS53aXRoQ29uZGl0aW9ucyh7XG4gICAgICAgIFN0cmluZ0VxdWFsczogTGF6eS5hbnkoeyBwcm9kdWNlOiAoKSA9PiAoeyBnb286ICd6YXInIH0pIH0pLFxuICAgICAgfSk7XG5cbiAgICAgIHN0YXRlbWVudC5hZGRQcmluY2lwYWxzKHApO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBjb25zdCByZXNvbHZlZCA9IHN0YWNrLnJlc29sdmUoc3RhdGVtZW50LnRvU3RhdGVtZW50SnNvbigpKTtcbiAgICAgIGV4cGVjdChyZXNvbHZlZCkudG9FcXVhbCh7XG4gICAgICAgIENvbmRpdGlvbjoge1xuICAgICAgICAgIFN0cmluZ0VxdWFsczoge1xuICAgICAgICAgICAgZ29vOiAnemFyJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICAgIEFXUzogJ2FybjpvZjpwcmluY2lwYWwnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjb25kaXRpb25zIGNhbm5vdCBiZSBtZXJnZWQgaWYgdGhleSBpbmNsdWRlIHRva2VucycsICgpID0+IHtcbiAgICAgIGNvbnN0IHAgPSBuZXcgRmVkZXJhdGVkUHJpbmNpcGFsKCdmZWQnLCB7XG4gICAgICAgIFN0cmluZ0VxdWFsczogeyBmb286ICdiYXInIH0sXG4gICAgICB9KS53aXRoQ29uZGl0aW9ucyh7XG4gICAgICAgIFN0cmluZ0VxdWFsczogTGF6eS5hbnkoeyBwcm9kdWNlOiAoKSA9PiAoeyBnb286ICd6YXInIH0pIH0pLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHN0YXRlbWVudCA9IG5ldyBQb2xpY3lTdGF0ZW1lbnQoKTtcblxuICAgICAgZXhwZWN0KCgpID0+IHN0YXRlbWVudC5hZGRQcmluY2lwYWxzKHApKS50b1Rocm93KC9tdWx0aXBsZSBcIlN0cmluZ0VxdWFsc1wiIGNvbmRpdGlvbnMgY2Fubm90IGJlIG1lcmdlZCBpZiBvbmUgb2YgdGhlbSBjb250YWlucyBhbiB1bnJlc29sdmVkIHRva2VuLyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd2YWx1ZXMgcGFzc2VkIHRvIGB3aXRoQ29uZGl0aW9uc2Agb3ZlcndyaXRlIHZhbHVlcyBmcm9tIHRoZSB3cmFwcGVkIHByaW5jaXBhbCAnICtcbiAgICAgICd3aGVuIGtleXMgY29uZmxpY3Qgd2l0aGluIGFuIG9wZXJhdG9yJywgKCkgPT4ge1xuICAgICAgY29uc3QgcCA9IG5ldyBGZWRlcmF0ZWRQcmluY2lwYWwoJ2ZlZCcsIHtcbiAgICAgICAgT3BlcmF0b3I6IHsga2V5OiAncC12YWwnIH0sXG4gICAgICB9KS53aXRoQ29uZGl0aW9ucyh7XG4gICAgICAgIE9wZXJhdG9yOiB7IGtleTogJ3dpdGgtdmFsJyB9LFxuICAgICAgfSk7XG4gICAgICBjb25zdCBzdGF0ZW1lbnQgPSBuZXcgUG9saWN5U3RhdGVtZW50KCk7XG4gICAgICBzdGF0ZW1lbnQuYWRkUHJpbmNpcGFscyhwKTtcbiAgICAgIGV4cGVjdChzdGF0ZW1lbnQudG9TdGF0ZW1lbnRKc29uKCkpLnRvRXF1YWwoe1xuICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgIFByaW5jaXBhbDogeyBGZWRlcmF0ZWQ6ICdmZWQnIH0sXG4gICAgICAgIENvbmRpdGlvbjoge1xuICAgICAgICAgIE9wZXJhdG9yOiB7IGtleTogJ3dpdGgtdmFsJyB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdkdXBsaWNhdGUgc3RhdGVtZW50cycsICgpID0+IHtcblxuICAgIHRlc3QoJ3dpdGhvdXQgdG9rZW5zJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBjb25zdCBwID0gbmV3IFBvbGljeURvY3VtZW50KCk7XG5cbiAgICAgIGNvbnN0IHN0YXRlbWVudCA9IG5ldyBQb2xpY3lTdGF0ZW1lbnQoKTtcbiAgICAgIHN0YXRlbWVudC5hZGRSZXNvdXJjZXMoJ3Jlc291cmNlMScsICdyZXNvdXJjZTInKTtcbiAgICAgIHN0YXRlbWVudC5hZGRBY3Rpb25zKCdzZXJ2aWNlOmFjdGlvbjEnLCAnc2VydmljZTphY3Rpb24yJyk7XG4gICAgICBzdGF0ZW1lbnQuYWRkU2VydmljZVByaW5jaXBhbCgnc2VydmljZScpO1xuICAgICAgc3RhdGVtZW50LmFkZENvbmRpdGlvbnMoe1xuICAgICAgICBhOiB7XG4gICAgICAgICAgYjogJ2MnLFxuICAgICAgICB9LFxuICAgICAgICBkOiB7XG4gICAgICAgICAgZTogJ2YnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIHAuYWRkU3RhdGVtZW50cyhzdGF0ZW1lbnQpO1xuICAgICAgcC5hZGRTdGF0ZW1lbnRzKHN0YXRlbWVudCk7XG4gICAgICBwLmFkZFN0YXRlbWVudHMoc3RhdGVtZW50KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUocCkuU3RhdGVtZW50KS50b0hhdmVMZW5ndGgoMSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd3aXRoIHRva2VucycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgY29uc3QgcCA9IG5ldyBQb2xpY3lEb2N1bWVudCgpO1xuXG4gICAgICBjb25zdCBzdGF0ZW1lbnQxID0gbmV3IFBvbGljeVN0YXRlbWVudCgpO1xuICAgICAgc3RhdGVtZW50MS5hZGRSZXNvdXJjZXMoTGF6eS5zdHJpbmcoeyBwcm9kdWNlOiAoKSA9PiAncmVzb3VyY2UnIH0pKTtcbiAgICAgIHN0YXRlbWVudDEuYWRkQWN0aW9ucyhMYXp5LnN0cmluZyh7IHByb2R1Y2U6ICgpID0+ICdzZXJ2aWNlOmFjdGlvbicgfSkpO1xuXG4gICAgICBjb25zdCBzdGF0ZW1lbnQyID0gbmV3IFBvbGljeVN0YXRlbWVudCgpO1xuICAgICAgc3RhdGVtZW50Mi5hZGRSZXNvdXJjZXMoTGF6eS5zdHJpbmcoeyBwcm9kdWNlOiAoKSA9PiAncmVzb3VyY2UnIH0pKTtcbiAgICAgIHN0YXRlbWVudDIuYWRkQWN0aW9ucyhMYXp5LnN0cmluZyh7IHByb2R1Y2U6ICgpID0+ICdzZXJ2aWNlOmFjdGlvbicgfSkpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBwLmFkZFN0YXRlbWVudHMoc3RhdGVtZW50MSk7XG4gICAgICBwLmFkZFN0YXRlbWVudHMoc3RhdGVtZW50Mik7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKHApLlN0YXRlbWVudCkudG9IYXZlTGVuZ3RoKDEpO1xuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdhdXRvQXNzaWduU2lkcyBlbmFibGVzIGF1dG8tYXNzaWdubWVudCBvZiBhIHVuaXF1ZSBTSUQgZm9yIGVhY2ggc3RhdGVtZW50JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgZG9jID0gbmV3IFBvbGljeURvY3VtZW50KHtcbiAgICAgIGFzc2lnblNpZHM6IHRydWUsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgZG9jLmFkZFN0YXRlbWVudHMobmV3IFBvbGljeVN0YXRlbWVudCh7IGFjdGlvbnM6IFsnc2VydmljZTphY3Rpb24xJ10sIHJlc291cmNlczogWydyZXNvdXJjZTEnXSB9KSk7XG4gICAgZG9jLmFkZFN0YXRlbWVudHMobmV3IFBvbGljeVN0YXRlbWVudCh7IGFjdGlvbnM6IFsnc2VydmljZTphY3Rpb24xJ10sIHJlc291cmNlczogWydyZXNvdXJjZTEnXSB9KSk7XG4gICAgZG9jLmFkZFN0YXRlbWVudHMobmV3IFBvbGljeVN0YXRlbWVudCh7IGFjdGlvbnM6IFsnc2VydmljZTphY3Rpb24xJ10sIHJlc291cmNlczogWydyZXNvdXJjZTEnXSB9KSk7XG4gICAgZG9jLmFkZFN0YXRlbWVudHMobmV3IFBvbGljeVN0YXRlbWVudCh7IGFjdGlvbnM6IFsnc2VydmljZTphY3Rpb24xJ10sIHJlc291cmNlczogWydyZXNvdXJjZTEnXSB9KSk7XG4gICAgZG9jLmFkZFN0YXRlbWVudHMobmV3IFBvbGljeVN0YXRlbWVudCh7IGFjdGlvbnM6IFsnc2VydmljZTphY3Rpb24yJ10sIHJlc291cmNlczogWydyZXNvdXJjZTInXSB9KSk7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShkb2MpKS50b0VxdWFsKHtcbiAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICB7IEFjdGlvbjogJ3NlcnZpY2U6YWN0aW9uMScsIEVmZmVjdDogJ0FsbG93JywgUmVzb3VyY2U6ICdyZXNvdXJjZTEnLCBTaWQ6ICcwJyB9LFxuICAgICAgICB7IEFjdGlvbjogJ3NlcnZpY2U6YWN0aW9uMicsIEVmZmVjdDogJ0FsbG93JywgUmVzb3VyY2U6ICdyZXNvdXJjZTInLCBTaWQ6ICcxJyB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY29uc3RydWN0b3IgYXJncyBhcmUgZXF1aXZhbGVudCB0byBtdXRhdGluZyBpbi1wbGFjZScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY29uc3QgcyA9IG5ldyBQb2xpY3lTdGF0ZW1lbnQoKTtcbiAgICBzLmFkZEFjdGlvbnMoJ3NlcnZpY2U6YWN0aW9uMScsICdzZXJ2aWNlOmFjdGlvbjInKTtcbiAgICBzLmFkZEFsbFJlc291cmNlcygpO1xuICAgIHMuYWRkQXJuUHJpbmNpcGFsKCdhcm4nKTtcbiAgICBzLmFkZENvbmRpdGlvbigna2V5JywgeyBlcXVhbHM6ICd2YWx1ZScgfSk7XG5cbiAgICBjb25zdCBkb2MxID0gbmV3IFBvbGljeURvY3VtZW50KCk7XG4gICAgZG9jMS5hZGRTdGF0ZW1lbnRzKHMpO1xuXG4gICAgY29uc3QgZG9jMiA9IG5ldyBQb2xpY3lEb2N1bWVudCgpO1xuICAgIGRvYzIuYWRkU3RhdGVtZW50cyhuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGFjdGlvbnM6IFsnc2VydmljZTphY3Rpb24xJywgJ3NlcnZpY2U6YWN0aW9uMiddLFxuICAgICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICAgIHByaW5jaXBhbHM6IFtuZXcgQXJuUHJpbmNpcGFsKCdhcm4nKV0sXG4gICAgICBjb25kaXRpb25zOiB7XG4gICAgICAgIGtleTogeyBlcXVhbHM6ICd2YWx1ZScgfSxcbiAgICAgIH0sXG4gICAgfSkpO1xuXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoZG9jMSkpLnRvRXF1YWwoc3RhY2sucmVzb2x2ZShkb2MyKSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdmcm9tSnNvbicsICgpID0+IHtcbiAgICB0ZXN0KFwidGhyb3dzIGVycm9yIHdoZW4gU3RhdGVtZW50IGlzbid0IGFuIGFycmF5XCIsICgpID0+IHtcbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIFBvbGljeURvY3VtZW50LmZyb21Kc29uKHtcbiAgICAgICAgICBTdGF0ZW1lbnQ6ICdhc2RmJyxcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KC9TdGF0ZW1lbnQgbXVzdCBiZSBhbiBhcnJheS8pO1xuICAgIH0pO1xuXG4gIH0pO1xuXG4gIHRlc3QoJ2FkZGluZyBhbm90aGVyIGNvbmRpdGlvbiB3aXRoIHRoZSBzYW1lIG9wZXJhdG9yIGRvZXMgbm90IGRlbGV0ZSB0aGUgb3JpZ2luYWwnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGNvbnN0IHAgPSBuZXcgUG9saWN5U3RhdGVtZW50KCk7XG5cbiAgICBwLmFkZENvbmRpdGlvbignU3RyaW5nRXF1YWxzJywgeyAna21zOlZpYVNlcnZpY2UnOiAnc2VydmljZScgfSk7XG5cbiAgICBwLmFkZEFjY291bnRDb25kaXRpb24oJzEyMjIxMTIxMjIxJyk7XG5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwLnRvU3RhdGVtZW50SnNvbigpKSkudG9FcXVhbCh7XG4gICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICBDb25kaXRpb246IHsgU3RyaW5nRXF1YWxzOiB7ICdrbXM6VmlhU2VydmljZSc6ICdzZXJ2aWNlJywgJ3N0czpFeHRlcm5hbElkJzogJzEyMjIxMTIxMjIxJyB9IH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3ZhbGlkYXRpb24gZXJyb3IgaWYgcG9saWN5IHN0YXRlbWVudCBoYXMgbm8gYWN0aW9ucycsICgpID0+IHtcbiAgICBjb25zdCBwb2xpY3lTdGF0ZW1lbnQgPSBuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIHByaW5jaXBhbHM6IFtuZXcgQW55UHJpbmNpcGFsKCldLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGNvbnN0IHZhbGlkYXRpb25FcnJvcnNGb3JSZXNvdXJjZVBvbGljeTogc3RyaW5nW10gPSBwb2xpY3lTdGF0ZW1lbnQudmFsaWRhdGVGb3JSZXNvdXJjZVBvbGljeSgpO1xuICAgIC8vIGNvbnN0IHZhbGlkYXRpb25FcnJvcnNGb3JJZGVudGl0eVBvbGljeTogc3RyaW5nW10gPSBwb2xpY3lTdGF0ZW1lbnQudmFsaWRhdGVGb3JJZGVudGl0eVBvbGljeSgpO1xuICAgIGV4cGVjdCh2YWxpZGF0aW9uRXJyb3JzRm9yUmVzb3VyY2VQb2xpY3kpLnRvRXF1YWwoWydBIFBvbGljeVN0YXRlbWVudCBtdXN0IHNwZWNpZnkgYXQgbGVhc3Qgb25lIFxcJ2FjdGlvblxcJyBvciBcXCdub3RBY3Rpb25cXCcuJ10pO1xuICB9KTtcblxuICB0ZXN0KCd2YWxpZGF0aW9uIGVycm9yIGlmIHBvbGljeSBzdGF0ZW1lbnQgZm9yIHJlc291cmNlLWJhc2VkIHBvbGljeSBoYXMgbm8gcHJpbmNpcGFscyBzcGVjaWZpZWQnLCAoKSA9PiB7XG4gICAgY29uc3QgcG9saWN5U3RhdGVtZW50ID0gbmV3IFBvbGljeVN0YXRlbWVudCh7XG4gICAgICBhY3Rpb25zOiBbJyonXSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCB2YWxpZGF0aW9uRXJyb3JzOiBzdHJpbmdbXSA9IHBvbGljeVN0YXRlbWVudC52YWxpZGF0ZUZvclJlc291cmNlUG9saWN5KCk7XG4gICAgZXhwZWN0KHZhbGlkYXRpb25FcnJvcnMpLnRvRXF1YWwoWydBIFBvbGljeVN0YXRlbWVudCB1c2VkIGluIGEgcmVzb3VyY2UtYmFzZWQgcG9saWN5IG11c3Qgc3BlY2lmeSBhdCBsZWFzdCBvbmUgSUFNIHByaW5jaXBhbC4nXSk7XG4gIH0pO1xufSk7XG4iXX0=