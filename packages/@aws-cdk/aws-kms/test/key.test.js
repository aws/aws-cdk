"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const iam = require("@aws-cdk/aws-iam");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const cdk = require("@aws-cdk/core");
const kms = require("../lib");
const ADMIN_ACTIONS = [
    'kms:Create*',
    'kms:Describe*',
    'kms:Enable*',
    'kms:List*',
    'kms:Put*',
    'kms:Update*',
    'kms:Revoke*',
    'kms:Disable*',
    'kms:Get*',
    'kms:Delete*',
    'kms:TagResource',
    'kms:UntagResource',
    'kms:ScheduleKeyDeletion',
    'kms:CancelKeyDeletion',
];
test('default key', () => {
    const stack = new cdk.Stack();
    new kms.Key(stack, 'MyKey');
    assertions_1.Template.fromStack(stack).hasResource('AWS::KMS::Key', {
        Properties: {
            KeyPolicy: {
                Statement: [
                    {
                        Action: 'kms:*',
                        Effect: 'Allow',
                        Principal: {
                            AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, ':root']] },
                        },
                        Resource: '*',
                    },
                ],
                Version: '2012-10-17',
            },
        },
        DeletionPolicy: 'Retain',
        UpdateReplacePolicy: 'Retain',
    });
});
test('default with no retention', () => {
    const stack = new cdk.Stack();
    new kms.Key(stack, 'MyKey', { removalPolicy: cdk.RemovalPolicy.DESTROY });
    assertions_1.Template.fromStack(stack).hasResource('AWS::KMS::Key', { DeletionPolicy: 'Delete', UpdateReplacePolicy: 'Delete' });
});
describe('key policies', () => {
    test('can specify a default key policy', () => {
        const stack = new cdk.Stack();
        const policy = new iam.PolicyDocument();
        const statement = new iam.PolicyStatement({ resources: ['*'], actions: ['kms:Put*'] });
        statement.addArnPrincipal('arn:aws:iam::111122223333:root');
        policy.addStatements(statement);
        new kms.Key(stack, 'MyKey', { policy });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
            KeyPolicy: {
                Statement: [
                    {
                        Action: 'kms:Put*',
                        Effect: 'Allow',
                        Principal: {
                            AWS: 'arn:aws:iam::111122223333:root',
                        },
                        Resource: '*',
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
    test('can append to the default key policy', () => {
        const stack = new cdk.Stack();
        const statement = new iam.PolicyStatement({ resources: ['*'], actions: ['kms:Put*'] });
        statement.addArnPrincipal('arn:aws:iam::111122223333:root');
        const key = new kms.Key(stack, 'MyKey');
        key.addToResourcePolicy(statement);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
            KeyPolicy: {
                Statement: [
                    {
                        Action: 'kms:*',
                        Effect: 'Allow',
                        Principal: {
                            AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, ':root']] },
                        },
                        Resource: '*',
                    },
                    {
                        Action: 'kms:Put*',
                        Effect: 'Allow',
                        Principal: {
                            AWS: 'arn:aws:iam::111122223333:root',
                        },
                        Resource: '*',
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
    test('decrypt', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const key = new kms.Key(stack, 'Key');
        const user = new iam.User(stack, 'User');
        // WHEN
        key.grantDecrypt(user);
        // THEN
        // Key policy should be unmodified by the grant.
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
            KeyPolicy: {
                Statement: [
                    {
                        Action: 'kms:*',
                        Effect: 'Allow',
                        Principal: { AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, ':root']] } },
                        Resource: '*',
                    },
                ],
                Version: '2012-10-17',
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: 'kms:Decrypt',
                        Effect: 'Allow',
                        Resource: { 'Fn::GetAtt': ['Key961B73FD', 'Arn'] },
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
    test('encrypt', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const key = new kms.Key(stack, 'Key');
        const user = new iam.User(stack, 'User');
        // WHEN
        key.grantEncrypt(user);
        // THEN
        // Key policy should be unmodified by the grant.
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
            KeyPolicy: {
                Statement: [
                    {
                        Action: 'kms:*',
                        Effect: 'Allow',
                        Principal: { AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, ':root']] } },
                        Resource: '*',
                    },
                ],
                Version: '2012-10-17',
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: ['kms:Encrypt', 'kms:ReEncrypt*', 'kms:GenerateDataKey*'],
                        Effect: 'Allow',
                        Resource: { 'Fn::GetAtt': ['Key961B73FD', 'Arn'] },
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
    test('grant for a principal in a dependent stack works correctly', () => {
        const app = new cdk.App();
        const principalStack = new cdk.Stack(app, 'PrincipalStack');
        const principal = new iam.Role(principalStack, 'Role', {
            assumedBy: new iam.AnyPrincipal(),
        });
        const keyStack = new cdk.Stack(app, 'KeyStack');
        const key = new kms.Key(keyStack, 'Key');
        principalStack.addDependency(keyStack);
        key.grantEncrypt(principal);
        assertions_1.Template.fromStack(principalStack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: [
                            'kms:Encrypt',
                            'kms:ReEncrypt*',
                            'kms:GenerateDataKey*',
                        ],
                        Effect: 'Allow',
                        Resource: {
                            'Fn::ImportValue': 'KeyStack:ExportsOutputFnGetAttKey961B73FDArn5A860C43',
                        },
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
    test('grant for a principal in a different region', () => {
        const app = new cdk.App();
        const principalStack = new cdk.Stack(app, 'PrincipalStack', { env: { region: 'testregion1' } });
        const principal = new iam.Role(principalStack, 'Role', {
            assumedBy: new iam.AnyPrincipal(),
            roleName: 'MyRolePhysicalName',
        });
        const keyStack = new cdk.Stack(app, 'KeyStack', { env: { region: 'testregion2' } });
        const key = new kms.Key(keyStack, 'Key');
        key.grantEncrypt(principal);
        assertions_1.Template.fromStack(keyStack).hasResourceProperties('AWS::KMS::Key', {
            KeyPolicy: {
                Statement: assertions_1.Match.arrayWith([
                    {
                        Action: [
                            'kms:Encrypt',
                            'kms:ReEncrypt*',
                            'kms:GenerateDataKey*',
                        ],
                        Effect: 'Allow',
                        Principal: { AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, ':role/MyRolePhysicalName']] } },
                        Resource: '*',
                    },
                ]),
                Version: '2012-10-17',
            },
        });
        assertions_1.Template.fromStack(principalStack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: [
                            'kms:Encrypt',
                            'kms:ReEncrypt*',
                            'kms:GenerateDataKey*',
                        ],
                        Effect: 'Allow',
                        Resource: '*',
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
    test('grant for a principal in a different account', () => {
        const app = new cdk.App();
        const principalStack = new cdk.Stack(app, 'PrincipalStack', { env: { account: '0123456789012' } });
        const principal = new iam.Role(principalStack, 'Role', {
            assumedBy: new iam.AnyPrincipal(),
            roleName: 'MyRolePhysicalName',
        });
        const keyStack = new cdk.Stack(app, 'KeyStack', { env: { account: '111111111111' } });
        const key = new kms.Key(keyStack, 'Key');
        key.grantEncrypt(principal);
        assertions_1.Template.fromStack(keyStack).hasResourceProperties('AWS::KMS::Key', {
            KeyPolicy: {
                Statement: assertions_1.Match.arrayWith([{
                        Action: [
                            'kms:Encrypt',
                            'kms:ReEncrypt*',
                            'kms:GenerateDataKey*',
                        ],
                        Effect: 'Allow',
                        Principal: { AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::0123456789012:role/MyRolePhysicalName']] } },
                        Resource: '*',
                    }]),
                Version: '2012-10-17',
            },
        });
        assertions_1.Template.fromStack(principalStack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: [
                            'kms:Encrypt',
                            'kms:ReEncrypt*',
                            'kms:GenerateDataKey*',
                        ],
                        Effect: 'Allow',
                        Resource: '*',
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
    test('grant for an immutable role', () => {
        const app = new cdk.App();
        const principalStack = new cdk.Stack(app, 'PrincipalStack', { env: { account: '0123456789012' } });
        const principal = new iam.Role(principalStack, 'Role', {
            assumedBy: new iam.AnyPrincipal(),
            roleName: 'MyRolePhysicalName',
        });
        const keyStack = new cdk.Stack(app, 'KeyStack', { env: { account: '111111111111' } });
        const key = new kms.Key(keyStack, 'Key');
        principalStack.addDependency(keyStack);
        key.grantEncrypt(principal.withoutPolicyUpdates());
        assertions_1.Template.fromStack(keyStack).hasResourceProperties('AWS::KMS::Key', {
            KeyPolicy: {
                Statement: assertions_1.Match.arrayWith([{
                        Action: 'kms:*',
                        Effect: 'Allow',
                        Principal: { AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::111111111111:root']] } },
                        Resource: '*',
                    },
                    {
                        Action: [
                            'kms:Encrypt',
                            'kms:ReEncrypt*',
                            'kms:GenerateDataKey*',
                        ],
                        Effect: 'Allow',
                        Principal: { AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::0123456789012:root']] } },
                        Resource: '*',
                    }]),
                Version: '2012-10-17',
            },
        });
    });
    test('additional key admins can be specified (with imported/immutable principal)', () => {
        const stack = new cdk.Stack();
        const adminRole = iam.Role.fromRoleArn(stack, 'Admin', 'arn:aws:iam::123456789012:role/TrustedAdmin');
        new kms.Key(stack, 'MyKey', { admins: [adminRole] });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
            KeyPolicy: {
                Statement: [
                    {
                        Action: 'kms:*',
                        Effect: 'Allow',
                        Principal: {
                            AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, ':root']] },
                        },
                        Resource: '*',
                    },
                    {
                        Action: ADMIN_ACTIONS,
                        Effect: 'Allow',
                        Principal: {
                            AWS: 'arn:aws:iam::123456789012:role/TrustedAdmin',
                        },
                        Resource: '*',
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
    test('additional key admins can be specified (with owned/mutable principal)', () => {
        const stack = new cdk.Stack();
        const adminRole = new iam.Role(stack, 'AdminRole', {
            assumedBy: new iam.AccountRootPrincipal(),
        });
        new kms.Key(stack, 'MyKey', { admins: [adminRole] });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
            KeyPolicy: {
                // Unmodified - default key policy
                Statement: [
                    {
                        Action: 'kms:*',
                        Effect: 'Allow',
                        Principal: {
                            AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, ':root']] },
                        },
                        Resource: '*',
                    },
                ],
                Version: '2012-10-17',
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: ADMIN_ACTIONS,
                        Effect: 'Allow',
                        Resource: { 'Fn::GetAtt': ['MyKey6AB29FA6', 'Arn'] },
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
});
test('key with some options', () => {
    const stack = new cdk.Stack();
    const key = new kms.Key(stack, 'MyKey', {
        enableKeyRotation: true,
        enabled: false,
        pendingWindow: cdk.Duration.days(7),
    });
    cdk.Tags.of(key).add('tag1', 'value1');
    cdk.Tags.of(key).add('tag2', 'value2');
    cdk.Tags.of(key).add('tag3', '');
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
        Enabled: false,
        EnableKeyRotation: true,
        PendingWindowInDays: 7,
        Tags: [
            {
                Key: 'tag1',
                Value: 'value1',
            },
            {
                Key: 'tag2',
                Value: 'value2',
            },
            {
                Key: 'tag3',
                Value: '',
            },
        ],
    });
});
test('setting pendingWindow value to not in allowed range will throw', () => {
    const stack = new cdk.Stack();
    expect(() => new kms.Key(stack, 'MyKey', { enableKeyRotation: true, pendingWindow: cdk.Duration.days(6) }))
        .toThrow('\'pendingWindow\' value must between 7 and 30 days. Received: 6');
});
cdk_build_tools_1.describeDeprecated('trustAccountIdentities is deprecated', () => {
    test('setting trustAccountIdentities to false will throw (when the defaultKeyPolicies feature flag is enabled)', () => {
        const stack = new cdk.Stack();
        expect(() => new kms.Key(stack, 'MyKey', { trustAccountIdentities: false }))
            .toThrow('`trustAccountIdentities` cannot be false if the @aws-cdk/aws-kms:defaultKeyPolicies feature flag is set');
    });
});
test('addAlias creates an alias', () => {
    const stack = new cdk.Stack();
    const key = new kms.Key(stack, 'MyKey', {
        enableKeyRotation: true,
        enabled: false,
    });
    const alias = key.addAlias('alias/xoo');
    expect(alias.aliasName).toBeDefined();
    assertions_1.Template.fromStack(stack).resourceCountIs('AWS::KMS::Alias', 1);
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Alias', {
        AliasName: 'alias/xoo',
        TargetKeyId: {
            'Fn::GetAtt': [
                'MyKey6AB29FA6',
                'Arn',
            ],
        },
    });
});
test('can run multiple addAlias', () => {
    const stack = new cdk.Stack();
    const key = new kms.Key(stack, 'MyKey', {
        enableKeyRotation: true,
        enabled: false,
    });
    const alias1 = key.addAlias('alias/alias1');
    const alias2 = key.addAlias('alias/alias2');
    expect(alias1.aliasName).toBeDefined();
    expect(alias2.aliasName).toBeDefined();
    assertions_1.Template.fromStack(stack).resourceCountIs('AWS::KMS::Alias', 2);
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Alias', {
        AliasName: 'alias/alias1',
        TargetKeyId: {
            'Fn::GetAtt': [
                'MyKey6AB29FA6',
                'Arn',
            ],
        },
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Alias', {
        AliasName: 'alias/alias2',
        TargetKeyId: {
            'Fn::GetAtt': [
                'MyKey6AB29FA6',
                'Arn',
            ],
        },
    });
});
test('keyId resolves to a Ref', () => {
    const stack = new cdk.Stack();
    const key = new kms.Key(stack, 'MyKey');
    new cdk.CfnOutput(stack, 'Out', {
        value: key.keyId,
    });
    assertions_1.Template.fromStack(stack).hasOutput('Out', {
        Value: { Ref: 'MyKey6AB29FA6' },
    });
});
test('fails if key policy has no actions', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app);
    const key = new kms.Key(stack, 'MyKey');
    key.addToResourcePolicy(new iam.PolicyStatement({
        resources: ['*'],
        principals: [new iam.ArnPrincipal('arn')],
    }));
    expect(() => app.synth()).toThrow(/A PolicyStatement must specify at least one \'action\' or \'notAction\'/);
});
test('fails if key policy has no IAM principals', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app);
    const key = new kms.Key(stack, 'MyKey');
    key.addToResourcePolicy(new iam.PolicyStatement({
        resources: ['*'],
        actions: ['kms:*'],
    }));
    expect(() => app.synth()).toThrow(/A PolicyStatement used in a resource-based policy must specify at least one IAM principal/);
});
describe('imported keys', () => {
    test('throw an error when providing something that is not a valid key ARN', () => {
        const stack = new cdk.Stack();
        expect(() => {
            kms.Key.fromKeyArn(stack, 'Imported', 'arn:aws:kms:us-east-1:123456789012:key');
        }).toThrow(/KMS key ARN must be in the format 'arn:aws:kms:<region>:<account>:key\/<keyId>', got: 'arn:aws:kms:us-east-1:123456789012:key'/);
    });
    test('can have aliases added to them', () => {
        const app = new cdk.App();
        const stack2 = new cdk.Stack(app, 'Stack2');
        const myKeyImported = kms.Key.fromKeyArn(stack2, 'MyKeyImported', 'arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012');
        // addAlias can be called on imported keys.
        myKeyImported.addAlias('alias/hello');
        expect(myKeyImported.keyId).toEqual('12345678-1234-1234-1234-123456789012');
        assertions_1.Template.fromStack(stack2).templateMatches({
            Resources: {
                MyKeyImportedAliasB1C5269F: {
                    Type: 'AWS::KMS::Alias',
                    Properties: {
                        AliasName: 'alias/hello',
                        TargetKeyId: 'arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012',
                    },
                },
            },
        });
    });
});
describe('fromCfnKey()', () => {
    let stack;
    let cfnKey;
    let key;
    beforeEach(() => {
        stack = new cdk.Stack();
        cfnKey = new kms.CfnKey(stack, 'CfnKey', {
            keyPolicy: {
                Statement: [
                    {
                        Action: 'kms:*',
                        Effect: 'Allow',
                        Principal: {
                            AWS: cdk.Fn.join('', [
                                'arn:',
                                cdk.Aws.PARTITION,
                                ':iam::',
                                cdk.Aws.ACCOUNT_ID,
                                ':root',
                            ]),
                        },
                        Resource: '*',
                    },
                ],
                Version: '2012-10-17',
            },
        });
        key = kms.Key.fromCfnKey(cfnKey);
    });
    test("correctly resolves the 'keyId' property", () => {
        expect(stack.resolve(key.keyId)).toStrictEqual({
            Ref: 'CfnKey',
        });
    });
    test("correctly resolves the 'keyArn' property", () => {
        expect(stack.resolve(key.keyArn)).toStrictEqual({
            'Fn::GetAtt': ['CfnKey', 'Arn'],
        });
    });
    test('preserves the KMS Key resource', () => {
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
            KeyPolicy: {
                Statement: [
                    {
                        Action: 'kms:*',
                        Effect: 'Allow',
                        Principal: {
                            AWS: {
                                'Fn::Join': ['', [
                                        'arn:',
                                        { Ref: 'AWS::Partition' },
                                        ':iam::',
                                        { Ref: 'AWS::AccountId' },
                                        ':root',
                                    ]],
                            },
                        },
                        Resource: '*',
                    },
                ],
                Version: '2012-10-17',
            },
        });
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::KMS::Key', 1);
    });
    describe("calling 'addToResourcePolicy()' on the returned Key", () => {
        let addToResourcePolicyResult;
        beforeEach(() => {
            addToResourcePolicyResult = key.addToResourcePolicy(new iam.PolicyStatement({
                actions: ['kms:action'],
                resources: ['*'],
                principals: [new iam.AnyPrincipal()],
            }));
        });
        test("the AddToResourcePolicyResult returned has 'statementAdded' set to 'true'", () => {
            expect(addToResourcePolicyResult.statementAdded).toBeTruthy();
        });
        test('preserves the mutating call in the resulting template', () => {
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
                KeyPolicy: {
                    Statement: [
                        {
                            Action: 'kms:*',
                            Effect: 'Allow',
                            Principal: {
                                AWS: {
                                    'Fn::Join': ['', [
                                            'arn:',
                                            { Ref: 'AWS::Partition' },
                                            ':iam::',
                                            { Ref: 'AWS::AccountId' },
                                            ':root',
                                        ]],
                                },
                            },
                            Resource: '*',
                        },
                        {
                            Action: 'kms:action',
                            Effect: 'Allow',
                            Principal: { AWS: '*' },
                            Resource: '*',
                        },
                    ],
                    Version: '2012-10-17',
                },
            });
        });
    });
    describe('calling fromCfnKey() again', () => {
        beforeEach(() => {
            key = kms.Key.fromCfnKey(cfnKey);
        });
        describe('and using it for grantDecrypt() on a Role', function () {
            beforeEach(() => {
                const role = new iam.Role(stack, 'Role', {
                    assumedBy: new iam.AnyPrincipal(),
                });
                key.grantDecrypt(role);
            });
            test('creates the correct IAM Policy', () => {
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                    PolicyDocument: {
                        Statement: [
                            {
                                Action: 'kms:Decrypt',
                                Effect: 'Allow',
                                Resource: {
                                    'Fn::GetAtt': ['CfnKey', 'Arn'],
                                },
                            },
                        ],
                    },
                });
            });
            test('correctly mutates the Policy of the underlying CfnKey', () => {
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
                    KeyPolicy: {
                        Statement: [
                            {
                                Action: 'kms:*',
                                Effect: 'Allow',
                                Principal: {
                                    AWS: {
                                        'Fn::Join': ['', [
                                                'arn:',
                                                { Ref: 'AWS::Partition' },
                                                ':iam::',
                                                { Ref: 'AWS::AccountId' },
                                                ':root',
                                            ]],
                                    },
                                },
                                Resource: '*',
                            },
                            {
                                Action: 'kms:Decrypt',
                                Effect: 'Allow',
                                Principal: {
                                    AWS: {
                                        'Fn::GetAtt': ['Role1ABCC5F0', 'Arn'],
                                    },
                                },
                                Resource: '*',
                            },
                        ],
                        Version: '2012-10-17',
                    },
                });
            });
        });
    });
    describe("called with a CfnKey that has an 'Fn::If' passed as the KeyPolicy", () => {
        beforeEach(() => {
            cfnKey = new kms.CfnKey(stack, 'CfnKey2', {
                keyPolicy: cdk.Fn.conditionIf('AlwaysTrue', {
                    Statement: [
                        {
                            Action: 'kms:action1',
                            Effect: 'Allow',
                            Principal: '*',
                            Resource: '*',
                        },
                    ],
                    Version: '2012-10-17',
                }, {
                    Statement: [
                        {
                            Action: 'kms:action2',
                            Effect: 'Allow',
                            Principal: '*',
                            Resource: '*',
                        },
                    ],
                    Version: '2012-10-17',
                }),
            });
        });
        test('throws a descriptive exception', () => {
            expect(() => {
                kms.Key.fromCfnKey(cfnKey);
            }).toThrow(/Could not parse the PolicyDocument of the passed AWS::KMS::Key/);
        });
    });
    describe("called with a CfnKey that has an 'Fn::If' passed as the Statement of a KeyPolicy", () => {
        beforeEach(() => {
            cfnKey = new kms.CfnKey(stack, 'CfnKey2', {
                keyPolicy: {
                    Statement: cdk.Fn.conditionIf('AlwaysTrue', [
                        {
                            Action: 'kms:action1',
                            Effect: 'Allow',
                            Principal: '*',
                            Resource: '*',
                        },
                    ], [
                        {
                            Action: 'kms:action2',
                            Effect: 'Allow',
                            Principal: '*',
                            Resource: '*',
                        },
                    ]),
                    Version: '2012-10-17',
                },
            });
        });
        test('throws a descriptive exception', () => {
            expect(() => {
                kms.Key.fromCfnKey(cfnKey);
            }).toThrow(/Could not parse the PolicyDocument of the passed AWS::KMS::Key/);
        });
    });
    describe("called with a CfnKey that has an 'Fn::If' passed as one of the statements of a KeyPolicy", () => {
        beforeEach(() => {
            cfnKey = new kms.CfnKey(stack, 'CfnKey2', {
                keyPolicy: {
                    Statement: [
                        cdk.Fn.conditionIf('AlwaysTrue', {
                            Action: 'kms:action1',
                            Effect: 'Allow',
                            Principal: '*',
                            Resource: '*',
                        }, {
                            Action: 'kms:action2',
                            Effect: 'Allow',
                            Principal: '*',
                            Resource: '*',
                        }),
                    ],
                    Version: '2012-10-17',
                },
            });
        });
        test('throws a descriptive exception', () => {
            expect(() => {
                kms.Key.fromCfnKey(cfnKey);
            }).toThrow(/Could not parse the PolicyDocument of the passed AWS::KMS::Key/);
        });
    });
    describe("called with a CfnKey that has an 'Fn::If' passed for the Action in one of the statements of a KeyPolicy", () => {
        beforeEach(() => {
            cfnKey = new kms.CfnKey(stack, 'CfnKey2', {
                keyPolicy: {
                    Statement: [
                        {
                            Action: cdk.Fn.conditionIf('AlwaysTrue', 'kms:action1', 'kms:action2'),
                            Effect: 'Allow',
                            Principal: '*',
                            Resource: '*',
                        },
                    ],
                    Version: '2012-10-17',
                },
            });
        });
        test('throws a descriptive exception', () => {
            expect(() => {
                key = kms.Key.fromCfnKey(cfnKey);
            }).toThrow(/Could not parse the PolicyDocument of the passed AWS::KMS::Key/);
        });
    });
});
describe('addToResourcePolicy allowNoOp and there is no policy', () => {
    // eslint-disable-next-line jest/expect-expect
    test('succeed if set to true (default)', () => {
        const stack = new cdk.Stack();
        const key = kms.Key.fromKeyArn(stack, 'Imported', 'arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012');
        key.addToResourcePolicy(new iam.PolicyStatement({ resources: ['*'], actions: ['*'] }));
    });
    test('fails if set to false', () => {
        const stack = new cdk.Stack();
        const key = kms.Key.fromKeyArn(stack, 'Imported', 'arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012');
        expect(() => {
            key.addToResourcePolicy(new iam.PolicyStatement({ resources: ['*'], actions: ['*'] }), /* allowNoOp */ false);
        }).toThrow('Unable to add statement to IAM resource policy for KMS key: "arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012"');
    });
});
describe('key specs and key usages', () => {
    test('both usage and spec are specified', () => {
        const stack = new cdk.Stack();
        new kms.Key(stack, 'Key', { keySpec: kms.KeySpec.ECC_SECG_P256K1, keyUsage: kms.KeyUsage.SIGN_VERIFY });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
            KeySpec: 'ECC_SECG_P256K1',
            KeyUsage: 'SIGN_VERIFY',
        });
    });
    test('only key usage is specified', () => {
        const stack = new cdk.Stack();
        new kms.Key(stack, 'Key', { keyUsage: kms.KeyUsage.ENCRYPT_DECRYPT });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
            KeyUsage: 'ENCRYPT_DECRYPT',
        });
    });
    test('only key spec is specified', () => {
        const stack = new cdk.Stack();
        new kms.Key(stack, 'Key', { keySpec: kms.KeySpec.RSA_4096 });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
            KeySpec: 'RSA_4096',
        });
    });
    test('invalid combinations of key specs and key usages', () => {
        const stack = new cdk.Stack();
        expect(() => new kms.Key(stack, 'Key1', { keySpec: kms.KeySpec.ECC_NIST_P256 }))
            .toThrow('key spec \'ECC_NIST_P256\' is not valid with usage \'ENCRYPT_DECRYPT\'');
        expect(() => new kms.Key(stack, 'Key2', { keySpec: kms.KeySpec.ECC_SECG_P256K1, keyUsage: kms.KeyUsage.ENCRYPT_DECRYPT }))
            .toThrow('key spec \'ECC_SECG_P256K1\' is not valid with usage \'ENCRYPT_DECRYPT\'');
        expect(() => new kms.Key(stack, 'Key3', { keySpec: kms.KeySpec.SYMMETRIC_DEFAULT, keyUsage: kms.KeyUsage.SIGN_VERIFY }))
            .toThrow('key spec \'SYMMETRIC_DEFAULT\' is not valid with usage \'SIGN_VERIFY\'');
        expect(() => new kms.Key(stack, 'Key4', { keyUsage: kms.KeyUsage.SIGN_VERIFY }))
            .toThrow('key spec \'SYMMETRIC_DEFAULT\' is not valid with usage \'SIGN_VERIFY\'');
    });
    test('fails if key rotation enabled on asymmetric key', () => {
        const stack = new cdk.Stack();
        expect(() => new kms.Key(stack, 'Key', { enableKeyRotation: true, keySpec: kms.KeySpec.RSA_3072 }))
            .toThrow('key rotation cannot be enabled on asymmetric keys');
    });
});
describe('Key.fromKeyArn()', () => {
    let stack;
    beforeEach(() => {
        const app = new cdk.App();
        stack = new cdk.Stack(app, 'Base', {
            env: { account: '111111111111', region: 'stack-region' },
        });
    });
    describe('for a key in a different account and region', () => {
        let key;
        beforeEach(() => {
            key = kms.Key.fromKeyArn(stack, 'iKey', 'arn:aws:kms:key-region:222222222222:key:key-name');
        });
        test("the key's region is taken from the ARN", () => {
            expect(key.env.region).toBe('key-region');
        });
        test("the key's account is taken from the ARN", () => {
            expect(key.env.account).toBe('222222222222');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJrZXkudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUFzRDtBQUN0RCx3Q0FBd0M7QUFDeEMsOERBQThEO0FBQzlELHFDQUFxQztBQUNyQyw4QkFBOEI7QUFFOUIsTUFBTSxhQUFhLEdBQWE7SUFDOUIsYUFBYTtJQUNiLGVBQWU7SUFDZixhQUFhO0lBQ2IsV0FBVztJQUNYLFVBQVU7SUFDVixhQUFhO0lBQ2IsYUFBYTtJQUNiLGNBQWM7SUFDZCxVQUFVO0lBQ1YsYUFBYTtJQUNiLGlCQUFpQjtJQUNqQixtQkFBbUI7SUFDbkIseUJBQXlCO0lBQ3pCLHVCQUF1QjtDQUN4QixDQUFDO0FBRUYsSUFBSSxDQUFDLGFBQWEsRUFBRSxHQUFHLEVBQUU7SUFDdkIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDOUIsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztJQUU1QixxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLENBQUMsZUFBZSxFQUFFO1FBQ3JELFVBQVUsRUFBRTtZQUNWLFNBQVMsRUFBRTtnQkFDVCxTQUFTLEVBQUU7b0JBQ1Q7d0JBQ0UsTUFBTSxFQUFFLE9BQU87d0JBQ2YsTUFBTSxFQUFFLE9BQU87d0JBQ2YsU0FBUyxFQUFFOzRCQUNULEdBQUcsRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFLEdBQUcsRUFBRSxnQkFBZ0IsRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFLEdBQUcsRUFBRSxnQkFBZ0IsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDLEVBQUU7eUJBQzdHO3dCQUNELFFBQVEsRUFBRSxHQUFHO3FCQUNkO2lCQUNGO2dCQUNELE9BQU8sRUFBRSxZQUFZO2FBQ3RCO1NBQ0Y7UUFDRCxjQUFj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QUM7UUFFSCxJQUFJLENBQUMseUNBQXlDLEVBQUUsR0FBRyxFQUFFO1lBQ25ELE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUMvQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNYXRjaCwgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCB7IGRlc2NyaWJlRGVwcmVjYXRlZCB9IGZyb20gJ0Bhd3MtY2RrL2Nkay1idWlsZC10b29scyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBrbXMgZnJvbSAnLi4vbGliJztcblxuY29uc3QgQURNSU5fQUNUSU9OUzogc3RyaW5nW10gPSBbXG4gICdrbXM6Q3JlYXRlKicsXG4gICdrbXM6RGVzY3JpYmUqJyxcbiAgJ2ttczpFbmFibGUqJyxcbiAgJ2ttczpMaXN0KicsXG4gICdrbXM6UHV0KicsXG4gICdrbXM6VXBkYXRlKicsXG4gICdrbXM6UmV2b2tlKicsXG4gICdrbXM6RGlzYWJsZSonLFxuICAna21zOkdldConLFxuICAna21zOkRlbGV0ZSonLFxuICAna21zOlRhZ1Jlc291cmNlJyxcbiAgJ2ttczpVbnRhZ1Jlc291cmNlJyxcbiAgJ2ttczpTY2hlZHVsZUtleURlbGV0aW9uJyxcbiAgJ2ttczpDYW5jZWxLZXlEZWxldGlvbicsXG5dO1xuXG50ZXN0KCdkZWZhdWx0IGtleScsICgpID0+IHtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gIG5ldyBrbXMuS2V5KHN0YWNrLCAnTXlLZXknKTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OktNUzo6S2V5Jywge1xuICAgIFByb3BlcnRpZXM6IHtcbiAgICAgIEtleVBvbGljeToge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdrbXM6KicsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICAgICAgQVdTOiB7ICdGbjo6Sm9pbic6IFsnJywgWydhcm46JywgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSwgJzppYW06OicsIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sICc6cm9vdCddXSB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICB9LFxuICAgIERlbGV0aW9uUG9saWN5OiAnUmV0YWluJyxcbiAgICBVcGRhdGVSZXBsYWNlUG9saWN5OiAnUmV0YWluJyxcbiAgfSk7XG59KTtcblxudGVzdCgnZGVmYXVsdCB3aXRoIG5vIHJldGVudGlvbicsICgpID0+IHtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gIG5ldyBrbXMuS2V5KHN0YWNrLCAnTXlLZXknLCB7IHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1kgfSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQVdTOjpLTVM6OktleScsIHsgRGVsZXRpb25Qb2xpY3k6ICdEZWxldGUnLCBVcGRhdGVSZXBsYWNlUG9saWN5OiAnRGVsZXRlJyB9KTtcbn0pO1xuXG5kZXNjcmliZSgna2V5IHBvbGljaWVzJywgKCkgPT4ge1xuICB0ZXN0KCdjYW4gc3BlY2lmeSBhIGRlZmF1bHQga2V5IHBvbGljeScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBwb2xpY3kgPSBuZXcgaWFtLlBvbGljeURvY3VtZW50KCk7XG4gICAgY29uc3Qgc3RhdGVtZW50ID0gbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoeyByZXNvdXJjZXM6IFsnKiddLCBhY3Rpb25zOiBbJ2ttczpQdXQqJ10gfSk7XG4gICAgc3RhdGVtZW50LmFkZEFyblByaW5jaXBhbCgnYXJuOmF3czppYW06OjExMTEyMjIyMzMzMzpyb290Jyk7XG4gICAgcG9saWN5LmFkZFN0YXRlbWVudHMoc3RhdGVtZW50KTtcblxuICAgIG5ldyBrbXMuS2V5KHN0YWNrLCAnTXlLZXknLCB7IHBvbGljeSB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OktNUzo6S2V5Jywge1xuICAgICAgS2V5UG9saWN5OiB7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogJ2ttczpQdXQqJyxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICAgICAgICBBV1M6ICdhcm46YXdzOmlhbTo6MTExMTIyMjIzMzMzOnJvb3QnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGFwcGVuZCB0byB0aGUgZGVmYXVsdCBrZXkgcG9saWN5JywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHN0YXRlbWVudCA9IG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHsgcmVzb3VyY2VzOiBbJyonXSwgYWN0aW9uczogWydrbXM6UHV0KiddIH0pO1xuICAgIHN0YXRlbWVudC5hZGRBcm5QcmluY2lwYWwoJ2Fybjphd3M6aWFtOjoxMTExMjIyMjMzMzM6cm9vdCcpO1xuXG4gICAgY29uc3Qga2V5ID0gbmV3IGttcy5LZXkoc3RhY2ssICdNeUtleScpO1xuICAgIGtleS5hZGRUb1Jlc291cmNlUG9saWN5KHN0YXRlbWVudCk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpLTVM6OktleScsIHtcbiAgICAgIEtleVBvbGljeToge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdrbXM6KicsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICAgICAgQVdTOiB7ICdGbjo6Sm9pbic6IFsnJywgWydhcm46JywgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSwgJzppYW06OicsIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sICc6cm9vdCddXSB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdrbXM6UHV0KicsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICAgICAgQVdTOiAnYXJuOmF3czppYW06OjExMTEyMjIyMzMzMzpyb290JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2RlY3J5cHQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBrZXkgPSBuZXcga21zLktleShzdGFjaywgJ0tleScpO1xuICAgIGNvbnN0IHVzZXIgPSBuZXcgaWFtLlVzZXIoc3RhY2ssICdVc2VyJyk7XG5cbiAgICAvLyBXSEVOXG4gICAga2V5LmdyYW50RGVjcnlwdCh1c2VyKTtcblxuICAgIC8vIFRIRU5cbiAgICAvLyBLZXkgcG9saWN5IHNob3VsZCBiZSB1bm1vZGlmaWVkIGJ5IHRoZSBncmFudC5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpLTVM6OktleScsIHtcbiAgICAgIEtleVBvbGljeToge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdrbXM6KicsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBQcmluY2lwYWw6IHsgQVdTOiB7ICdGbjo6Sm9pbic6IFsnJywgWydhcm46JywgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSwgJzppYW06OicsIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sICc6cm9vdCddXSB9IH0sXG4gICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogJ2ttczpEZWNyeXB0JyxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFJlc291cmNlOiB7ICdGbjo6R2V0QXR0JzogWydLZXk5NjFCNzNGRCcsICdBcm4nXSB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2VuY3J5cHQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBrZXkgPSBuZXcga21zLktleShzdGFjaywgJ0tleScpO1xuICAgIGNvbnN0IHVzZXIgPSBuZXcgaWFtLlVzZXIoc3RhY2ssICdVc2VyJyk7XG5cbiAgICAvLyBXSEVOXG4gICAga2V5LmdyYW50RW5jcnlwdCh1c2VyKTtcblxuICAgIC8vIFRIRU5cbiAgICAvLyBLZXkgcG9saWN5IHNob3VsZCBiZSB1bm1vZGlmaWVkIGJ5IHRoZSBncmFudC5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpLTVM6OktleScsIHtcbiAgICAgIEtleVBvbGljeToge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdrbXM6KicsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBQcmluY2lwYWw6IHsgQVdTOiB7ICdGbjo6Sm9pbic6IFsnJywgWydhcm46JywgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSwgJzppYW06OicsIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sICc6cm9vdCddXSB9IH0sXG4gICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogWydrbXM6RW5jcnlwdCcsICdrbXM6UmVFbmNyeXB0KicsICdrbXM6R2VuZXJhdGVEYXRhS2V5KiddLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUmVzb3VyY2U6IHsgJ0ZuOjpHZXRBdHQnOiBbJ0tleTk2MUI3M0ZEJywgJ0FybiddIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZ3JhbnQgZm9yIGEgcHJpbmNpcGFsIGluIGEgZGVwZW5kZW50IHN0YWNrIHdvcmtzIGNvcnJlY3RseScsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHByaW5jaXBhbFN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdQcmluY2lwYWxTdGFjaycpO1xuICAgIGNvbnN0IHByaW5jaXBhbCA9IG5ldyBpYW0uUm9sZShwcmluY2lwYWxTdGFjaywgJ1JvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uQW55UHJpbmNpcGFsKCksXG4gICAgfSk7XG5cbiAgICBjb25zdCBrZXlTdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnS2V5U3RhY2snKTtcbiAgICBjb25zdCBrZXkgPSBuZXcga21zLktleShrZXlTdGFjaywgJ0tleScpO1xuXG4gICAgcHJpbmNpcGFsU3RhY2suYWRkRGVwZW5kZW5jeShrZXlTdGFjayk7XG5cbiAgICBrZXkuZ3JhbnRFbmNyeXB0KHByaW5jaXBhbCk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2socHJpbmNpcGFsU3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAna21zOkVuY3J5cHQnLFxuICAgICAgICAgICAgICAna21zOlJlRW5jcnlwdConLFxuICAgICAgICAgICAgICAna21zOkdlbmVyYXRlRGF0YUtleSonLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICdGbjo6SW1wb3J0VmFsdWUnOiAnS2V5U3RhY2s6RXhwb3J0c091dHB1dEZuR2V0QXR0S2V5OTYxQjczRkRBcm41QTg2MEM0MycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2dyYW50IGZvciBhIHByaW5jaXBhbCBpbiBhIGRpZmZlcmVudCByZWdpb24nLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBwcmluY2lwYWxTdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnUHJpbmNpcGFsU3RhY2snLCB7IGVudjogeyByZWdpb246ICd0ZXN0cmVnaW9uMScgfSB9KTtcbiAgICBjb25zdCBwcmluY2lwYWwgPSBuZXcgaWFtLlJvbGUocHJpbmNpcGFsU3RhY2ssICdSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLkFueVByaW5jaXBhbCgpLFxuICAgICAgcm9sZU5hbWU6ICdNeVJvbGVQaHlzaWNhbE5hbWUnLFxuICAgIH0pO1xuXG4gICAgY29uc3Qga2V5U3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ0tleVN0YWNrJywgeyBlbnY6IHsgcmVnaW9uOiAndGVzdHJlZ2lvbjInIH0gfSk7XG4gICAgY29uc3Qga2V5ID0gbmV3IGttcy5LZXkoa2V5U3RhY2ssICdLZXknKTtcblxuICAgIGtleS5ncmFudEVuY3J5cHQocHJpbmNpcGFsKTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhrZXlTdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OktNUzo6S2V5Jywge1xuICAgICAgS2V5UG9saWN5OiB7XG4gICAgICAgIFN0YXRlbWVudDogTWF0Y2guYXJyYXlXaXRoKFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICAgJ2ttczpFbmNyeXB0JyxcbiAgICAgICAgICAgICAgJ2ttczpSZUVuY3J5cHQqJyxcbiAgICAgICAgICAgICAgJ2ttczpHZW5lcmF0ZURhdGFLZXkqJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBQcmluY2lwYWw6IHsgQVdTOiB7ICdGbjo6Sm9pbic6IFsnJywgWydhcm46JywgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSwgJzppYW06OicsIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sICc6cm9sZS9NeVJvbGVQaHlzaWNhbE5hbWUnXV0gfSB9LFxuICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdKSxcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2socHJpbmNpcGFsU3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAna21zOkVuY3J5cHQnLFxuICAgICAgICAgICAgICAna21zOlJlRW5jcnlwdConLFxuICAgICAgICAgICAgICAna21zOkdlbmVyYXRlRGF0YUtleSonLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZ3JhbnQgZm9yIGEgcHJpbmNpcGFsIGluIGEgZGlmZmVyZW50IGFjY291bnQnLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBwcmluY2lwYWxTdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnUHJpbmNpcGFsU3RhY2snLCB7IGVudjogeyBhY2NvdW50OiAnMDEyMzQ1Njc4OTAxMicgfSB9KTtcbiAgICBjb25zdCBwcmluY2lwYWwgPSBuZXcgaWFtLlJvbGUocHJpbmNpcGFsU3RhY2ssICdSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLkFueVByaW5jaXBhbCgpLFxuICAgICAgcm9sZU5hbWU6ICdNeVJvbGVQaHlzaWNhbE5hbWUnLFxuICAgIH0pO1xuXG4gICAgY29uc3Qga2V5U3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ0tleVN0YWNrJywgeyBlbnY6IHsgYWNjb3VudDogJzExMTExMTExMTExMScgfSB9KTtcbiAgICBjb25zdCBrZXkgPSBuZXcga21zLktleShrZXlTdGFjaywgJ0tleScpO1xuXG4gICAga2V5LmdyYW50RW5jcnlwdChwcmluY2lwYWwpO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKGtleVN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6S01TOjpLZXknLCB7XG4gICAgICBLZXlQb2xpY3k6IHtcbiAgICAgICAgU3RhdGVtZW50OiBNYXRjaC5hcnJheVdpdGgoW3tcbiAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICdrbXM6RW5jcnlwdCcsXG4gICAgICAgICAgICAna21zOlJlRW5jcnlwdConLFxuICAgICAgICAgICAgJ2ttczpHZW5lcmF0ZURhdGFLZXkqJyxcbiAgICAgICAgICBdLFxuICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICBQcmluY2lwYWw6IHsgQVdTOiB7ICdGbjo6Sm9pbic6IFsnJywgWydhcm46JywgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSwgJzppYW06OjAxMjM0NTY3ODkwMTI6cm9sZS9NeVJvbGVQaHlzaWNhbE5hbWUnXV0gfSB9LFxuICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgIH1dKSxcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2socHJpbmNpcGFsU3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAna21zOkVuY3J5cHQnLFxuICAgICAgICAgICAgICAna21zOlJlRW5jcnlwdConLFxuICAgICAgICAgICAgICAna21zOkdlbmVyYXRlRGF0YUtleSonLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZ3JhbnQgZm9yIGFuIGltbXV0YWJsZSByb2xlJywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgY29uc3QgcHJpbmNpcGFsU3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1ByaW5jaXBhbFN0YWNrJywgeyBlbnY6IHsgYWNjb3VudDogJzAxMjM0NTY3ODkwMTInIH0gfSk7XG4gICAgY29uc3QgcHJpbmNpcGFsID0gbmV3IGlhbS5Sb2xlKHByaW5jaXBhbFN0YWNrLCAnUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5BbnlQcmluY2lwYWwoKSxcbiAgICAgIHJvbGVOYW1lOiAnTXlSb2xlUGh5c2ljYWxOYW1lJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGtleVN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdLZXlTdGFjaycsIHsgZW52OiB7IGFjY291bnQ6ICcxMTExMTExMTExMTEnIH0gfSk7XG4gICAgY29uc3Qga2V5ID0gbmV3IGttcy5LZXkoa2V5U3RhY2ssICdLZXknKTtcbiAgICBwcmluY2lwYWxTdGFjay5hZGREZXBlbmRlbmN5KGtleVN0YWNrKTtcbiAgICBrZXkuZ3JhbnRFbmNyeXB0KHByaW5jaXBhbC53aXRob3V0UG9saWN5VXBkYXRlcygpKTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhrZXlTdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OktNUzo6S2V5Jywge1xuICAgICAgS2V5UG9saWN5OiB7XG4gICAgICAgIFN0YXRlbWVudDogTWF0Y2guYXJyYXlXaXRoKFt7XG4gICAgICAgICAgQWN0aW9uOiAna21zOionLFxuICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICBQcmluY2lwYWw6IHsgQVdTOiB7ICdGbjo6Sm9pbic6IFsnJywgWydhcm46JywgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSwgJzppYW06OjExMTExMTExMTExMTpyb290J11dIH0gfSxcbiAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgICAna21zOkVuY3J5cHQnLFxuICAgICAgICAgICAgJ2ttczpSZUVuY3J5cHQqJyxcbiAgICAgICAgICAgICdrbXM6R2VuZXJhdGVEYXRhS2V5KicsXG4gICAgICAgICAgXSxcbiAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgUHJpbmNpcGFsOiB7IEFXUzogeyAnRm46OkpvaW4nOiBbJycsIFsnYXJuOicsIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sICc6aWFtOjowMTIzNDU2Nzg5MDEyOnJvb3QnXV0gfSB9LFxuICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgIH1dKSxcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYWRkaXRpb25hbCBrZXkgYWRtaW5zIGNhbiBiZSBzcGVjaWZpZWQgKHdpdGggaW1wb3J0ZWQvaW1tdXRhYmxlIHByaW5jaXBhbCknLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYWRtaW5Sb2xlID0gaWFtLlJvbGUuZnJvbVJvbGVBcm4oc3RhY2ssICdBZG1pbicsICdhcm46YXdzOmlhbTo6MTIzNDU2Nzg5MDEyOnJvbGUvVHJ1c3RlZEFkbWluJyk7XG4gICAgbmV3IGttcy5LZXkoc3RhY2ssICdNeUtleScsIHsgYWRtaW5zOiBbYWRtaW5Sb2xlXSB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OktNUzo6S2V5Jywge1xuICAgICAgS2V5UG9saWN5OiB7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogJ2ttczoqJyxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICAgICAgICBBV1M6IHsgJ0ZuOjpKb2luJzogWycnLCBbJ2FybjonLCB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LCAnOmlhbTo6JywgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSwgJzpyb290J11dIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogQURNSU5fQUNUSU9OUyxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICAgICAgICBBV1M6ICdhcm46YXdzOmlhbTo6MTIzNDU2Nzg5MDEyOnJvbGUvVHJ1c3RlZEFkbWluJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZGl0aW9uYWwga2V5IGFkbWlucyBjYW4gYmUgc3BlY2lmaWVkICh3aXRoIG93bmVkL211dGFibGUgcHJpbmNpcGFsKScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBhZG1pblJvbGUgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICdBZG1pblJvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uQWNjb3VudFJvb3RQcmluY2lwYWwoKSxcbiAgICB9KTtcbiAgICBuZXcga21zLktleShzdGFjaywgJ015S2V5JywgeyBhZG1pbnM6IFthZG1pblJvbGVdIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6S01TOjpLZXknLCB7XG4gICAgICBLZXlQb2xpY3k6IHtcbiAgICAgICAgLy8gVW5tb2RpZmllZCAtIGRlZmF1bHQga2V5IHBvbGljeVxuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdrbXM6KicsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICAgICAgQVdTOiB7ICdGbjo6Sm9pbic6IFsnJywgWydhcm46JywgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSwgJzppYW06OicsIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sICc6cm9vdCddXSB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogQURNSU5fQUNUSU9OUyxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFJlc291cmNlOiB7ICdGbjo6R2V0QXR0JzogWydNeUtleTZBQjI5RkE2JywgJ0FybiddIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG59KTtcblxudGVzdCgna2V5IHdpdGggc29tZSBvcHRpb25zJywgKCkgPT4ge1xuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgY29uc3Qga2V5ID0gbmV3IGttcy5LZXkoc3RhY2ssICdNeUtleScsIHtcbiAgICBlbmFibGVLZXlSb3RhdGlvbjogdHJ1ZSxcbiAgICBlbmFibGVkOiBmYWxzZSxcbiAgICBwZW5kaW5nV2luZG93OiBjZGsuRHVyYXRpb24uZGF5cyg3KSxcbiAgfSk7XG5cbiAgY2RrLlRhZ3Mub2Yoa2V5KS5hZGQoJ3RhZzEnLCAndmFsdWUxJyk7XG4gIGNkay5UYWdzLm9mKGtleSkuYWRkKCd0YWcyJywgJ3ZhbHVlMicpO1xuICBjZGsuVGFncy5vZihrZXkpLmFkZCgndGFnMycsICcnKTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpLTVM6OktleScsIHtcbiAgICBFbmFibGVkOiBmYWxzZSxcbiAgICBFbmFibGVLZXlSb3RhdGlvbjogdHJ1ZSxcbiAgICBQZW5kaW5nV2luZG93SW5EYXlzOiA3LFxuICAgIFRhZ3M6IFtcbiAgICAgIHtcbiAgICAgICAgS2V5OiAndGFnMScsXG4gICAgICAgIFZhbHVlOiAndmFsdWUxJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIEtleTogJ3RhZzInLFxuICAgICAgICBWYWx1ZTogJ3ZhbHVlMicsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBLZXk6ICd0YWczJyxcbiAgICAgICAgVmFsdWU6ICcnLFxuICAgICAgfSxcbiAgICBdLFxuICB9KTtcbn0pO1xuXG50ZXN0KCdzZXR0aW5nIHBlbmRpbmdXaW5kb3cgdmFsdWUgdG8gbm90IGluIGFsbG93ZWQgcmFuZ2Ugd2lsbCB0aHJvdycsICgpID0+IHtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gIGV4cGVjdCgoKSA9PiBuZXcga21zLktleShzdGFjaywgJ015S2V5JywgeyBlbmFibGVLZXlSb3RhdGlvbjogdHJ1ZSwgcGVuZGluZ1dpbmRvdzogY2RrLkR1cmF0aW9uLmRheXMoNikgfSkpXG4gICAgLnRvVGhyb3coJ1xcJ3BlbmRpbmdXaW5kb3dcXCcgdmFsdWUgbXVzdCBiZXR3ZWVuIDcgYW5kIDMwIGRheXMuIFJlY2VpdmVkOiA2Jyk7XG59KTtcblxuZGVzY3JpYmVEZXByZWNhdGVkKCd0cnVzdEFjY291bnRJZGVudGl0aWVzIGlzIGRlcHJlY2F0ZWQnLCAoKSA9PiB7XG4gIHRlc3QoJ3NldHRpbmcgdHJ1c3RBY2NvdW50SWRlbnRpdGllcyB0byBmYWxzZSB3aWxsIHRocm93ICh3aGVuIHRoZSBkZWZhdWx0S2V5UG9saWNpZXMgZmVhdHVyZSBmbGFnIGlzIGVuYWJsZWQpJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGV4cGVjdCgoKSA9PiBuZXcga21zLktleShzdGFjaywgJ015S2V5JywgeyB0cnVzdEFjY291bnRJZGVudGl0aWVzOiBmYWxzZSB9KSlcbiAgICAgIC50b1Rocm93KCdgdHJ1c3RBY2NvdW50SWRlbnRpdGllc2AgY2Fubm90IGJlIGZhbHNlIGlmIHRoZSBAYXdzLWNkay9hd3Mta21zOmRlZmF1bHRLZXlQb2xpY2llcyBmZWF0dXJlIGZsYWcgaXMgc2V0Jyk7XG4gIH0pO1xufSk7XG5cbnRlc3QoJ2FkZEFsaWFzIGNyZWF0ZXMgYW4gYWxpYXMnLCAoKSA9PiB7XG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICBjb25zdCBrZXkgPSBuZXcga21zLktleShzdGFjaywgJ015S2V5Jywge1xuICAgIGVuYWJsZUtleVJvdGF0aW9uOiB0cnVlLFxuICAgIGVuYWJsZWQ6IGZhbHNlLFxuICB9KTtcblxuICBjb25zdCBhbGlhcyA9IGtleS5hZGRBbGlhcygnYWxpYXMveG9vJyk7XG4gIGV4cGVjdChhbGlhcy5hbGlhc05hbWUpLnRvQmVEZWZpbmVkKCk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6S01TOjpBbGlhcycsIDEpO1xuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpLTVM6OkFsaWFzJywge1xuICAgIEFsaWFzTmFtZTogJ2FsaWFzL3hvbycsXG4gICAgVGFyZ2V0S2V5SWQ6IHtcbiAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAnTXlLZXk2QUIyOUZBNicsXG4gICAgICAgICdBcm4nLFxuICAgICAgXSxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdjYW4gcnVuIG11bHRpcGxlIGFkZEFsaWFzJywgKCkgPT4ge1xuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgY29uc3Qga2V5ID0gbmV3IGttcy5LZXkoc3RhY2ssICdNeUtleScsIHtcbiAgICBlbmFibGVLZXlSb3RhdGlvbjogdHJ1ZSxcbiAgICBlbmFibGVkOiBmYWxzZSxcbiAgfSk7XG5cbiAgY29uc3QgYWxpYXMxID0ga2V5LmFkZEFsaWFzKCdhbGlhcy9hbGlhczEnKTtcbiAgY29uc3QgYWxpYXMyID0ga2V5LmFkZEFsaWFzKCdhbGlhcy9hbGlhczInKTtcbiAgZXhwZWN0KGFsaWFzMS5hbGlhc05hbWUpLnRvQmVEZWZpbmVkKCk7XG4gIGV4cGVjdChhbGlhczIuYWxpYXNOYW1lKS50b0JlRGVmaW5lZCgpO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OktNUzo6QWxpYXMnLCAyKTtcbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6S01TOjpBbGlhcycsIHtcbiAgICBBbGlhc05hbWU6ICdhbGlhcy9hbGlhczEnLFxuICAgIFRhcmdldEtleUlkOiB7XG4gICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgJ015S2V5NkFCMjlGQTYnLFxuICAgICAgICAnQXJuJyxcbiAgICAgIF0sXG4gICAgfSxcbiAgfSk7XG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OktNUzo6QWxpYXMnLCB7XG4gICAgQWxpYXNOYW1lOiAnYWxpYXMvYWxpYXMyJyxcbiAgICBUYXJnZXRLZXlJZDoge1xuICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICdNeUtleTZBQjI5RkE2JyxcbiAgICAgICAgJ0FybicsXG4gICAgICBdLFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2tleUlkIHJlc29sdmVzIHRvIGEgUmVmJywgKCkgPT4ge1xuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgY29uc3Qga2V5ID0gbmV3IGttcy5LZXkoc3RhY2ssICdNeUtleScpO1xuXG4gIG5ldyBjZGsuQ2ZuT3V0cHV0KHN0YWNrLCAnT3V0Jywge1xuICAgIHZhbHVlOiBrZXkua2V5SWQsXG4gIH0pO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzT3V0cHV0KCdPdXQnLCB7XG4gICAgVmFsdWU6IHsgUmVmOiAnTXlLZXk2QUIyOUZBNicgfSxcbiAgfSk7XG59KTtcblxudGVzdCgnZmFpbHMgaWYga2V5IHBvbGljeSBoYXMgbm8gYWN0aW9ucycsICgpID0+IHtcbiAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCk7XG4gIGNvbnN0IGtleSA9IG5ldyBrbXMuS2V5KHN0YWNrLCAnTXlLZXknKTtcblxuICBrZXkuYWRkVG9SZXNvdXJjZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICBwcmluY2lwYWxzOiBbbmV3IGlhbS5Bcm5QcmluY2lwYWwoJ2FybicpXSxcbiAgfSkpO1xuXG4gIGV4cGVjdCgoKSA9PiBhcHAuc3ludGgoKSkudG9UaHJvdygvQSBQb2xpY3lTdGF0ZW1lbnQgbXVzdCBzcGVjaWZ5IGF0IGxlYXN0IG9uZSBcXCdhY3Rpb25cXCcgb3IgXFwnbm90QWN0aW9uXFwnLyk7XG59KTtcblxudGVzdCgnZmFpbHMgaWYga2V5IHBvbGljeSBoYXMgbm8gSUFNIHByaW5jaXBhbHMnLCAoKSA9PiB7XG4gIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHApO1xuICBjb25zdCBrZXkgPSBuZXcga21zLktleShzdGFjaywgJ015S2V5Jyk7XG5cbiAga2V5LmFkZFRvUmVzb3VyY2VQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgIHJlc291cmNlczogWycqJ10sXG4gICAgYWN0aW9uczogWydrbXM6KiddLFxuICB9KSk7XG5cbiAgZXhwZWN0KCgpID0+IGFwcC5zeW50aCgpKS50b1Rocm93KC9BIFBvbGljeVN0YXRlbWVudCB1c2VkIGluIGEgcmVzb3VyY2UtYmFzZWQgcG9saWN5IG11c3Qgc3BlY2lmeSBhdCBsZWFzdCBvbmUgSUFNIHByaW5jaXBhbC8pO1xufSk7XG5cbmRlc2NyaWJlKCdpbXBvcnRlZCBrZXlzJywgKCkgPT4ge1xuICB0ZXN0KCd0aHJvdyBhbiBlcnJvciB3aGVuIHByb3ZpZGluZyBzb21ldGhpbmcgdGhhdCBpcyBub3QgYSB2YWxpZCBrZXkgQVJOJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBrbXMuS2V5LmZyb21LZXlBcm4oc3RhY2ssICdJbXBvcnRlZCcsICdhcm46YXdzOmttczp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmtleScpO1xuICAgIH0pLnRvVGhyb3coL0tNUyBrZXkgQVJOIG11c3QgYmUgaW4gdGhlIGZvcm1hdCAnYXJuOmF3czprbXM6PHJlZ2lvbj46PGFjY291bnQ+OmtleVxcLzxrZXlJZD4nLCBnb3Q6ICdhcm46YXdzOmttczp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmtleScvKTtcblxuICB9KTtcblxuICB0ZXN0KCdjYW4gaGF2ZSBhbGlhc2VzIGFkZGVkIHRvIHRoZW0nLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjazIgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1N0YWNrMicpO1xuICAgIGNvbnN0IG15S2V5SW1wb3J0ZWQgPSBrbXMuS2V5LmZyb21LZXlBcm4oc3RhY2syLCAnTXlLZXlJbXBvcnRlZCcsXG4gICAgICAnYXJuOmF3czprbXM6dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjprZXkvMTIzNDU2NzgtMTIzNC0xMjM0LTEyMzQtMTIzNDU2Nzg5MDEyJyk7XG5cbiAgICAvLyBhZGRBbGlhcyBjYW4gYmUgY2FsbGVkIG9uIGltcG9ydGVkIGtleXMuXG4gICAgbXlLZXlJbXBvcnRlZC5hZGRBbGlhcygnYWxpYXMvaGVsbG8nKTtcblxuICAgIGV4cGVjdChteUtleUltcG9ydGVkLmtleUlkKS50b0VxdWFsKCcxMjM0NTY3OC0xMjM0LTEyMzQtMTIzNC0xMjM0NTY3ODkwMTInKTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjazIpLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgTXlLZXlJbXBvcnRlZEFsaWFzQjFDNTI2OUY6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpLTVM6OkFsaWFzJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBBbGlhc05hbWU6ICdhbGlhcy9oZWxsbycsXG4gICAgICAgICAgICBUYXJnZXRLZXlJZDogJ2Fybjphd3M6a21zOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6a2V5LzEyMzQ1Njc4LTEyMzQtMTIzNC0xMjM0LTEyMzQ1Njc4OTAxMicsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdmcm9tQ2ZuS2V5KCknLCAoKSA9PiB7XG4gIGxldCBzdGFjazogY2RrLlN0YWNrO1xuICBsZXQgY2ZuS2V5OiBrbXMuQ2ZuS2V5O1xuICBsZXQga2V5OiBrbXMuSUtleTtcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjZm5LZXkgPSBuZXcga21zLkNmbktleShzdGFjaywgJ0NmbktleScsIHtcbiAgICAgIGtleVBvbGljeToge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdrbXM6KicsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICAgICAgQVdTOiBjZGsuRm4uam9pbignJywgW1xuICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICBjZGsuQXdzLlBBUlRJVElPTixcbiAgICAgICAgICAgICAgICAnOmlhbTo6JyxcbiAgICAgICAgICAgICAgICBjZGsuQXdzLkFDQ09VTlRfSUQsXG4gICAgICAgICAgICAgICAgJzpyb290JyxcbiAgICAgICAgICAgICAgXSksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGtleSA9IGttcy5LZXkuZnJvbUNmbktleShjZm5LZXkpO1xuICB9KTtcblxuICB0ZXN0KFwiY29ycmVjdGx5IHJlc29sdmVzIHRoZSAna2V5SWQnIHByb3BlcnR5XCIsICgpID0+IHtcbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShrZXkua2V5SWQpKS50b1N0cmljdEVxdWFsKHtcbiAgICAgIFJlZjogJ0NmbktleScsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoXCJjb3JyZWN0bHkgcmVzb2x2ZXMgdGhlICdrZXlBcm4nIHByb3BlcnR5XCIsICgpID0+IHtcbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShrZXkua2V5QXJuKSkudG9TdHJpY3RFcXVhbCh7XG4gICAgICAnRm46OkdldEF0dCc6IFsnQ2ZuS2V5JywgJ0FybiddLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdwcmVzZXJ2ZXMgdGhlIEtNUyBLZXkgcmVzb3VyY2UnLCAoKSA9PiB7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6S01TOjpLZXknLCB7XG4gICAgICBLZXlQb2xpY3k6IHtcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiAna21zOionLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUHJpbmNpcGFsOiB7XG4gICAgICAgICAgICAgIEFXUzoge1xuICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFsnJywgW1xuICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgICAgICAgICAgICc6aWFtOjonLFxuICAgICAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSxcbiAgICAgICAgICAgICAgICAgICc6cm9vdCcsXG4gICAgICAgICAgICAgICAgXV0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OktNUzo6S2V5JywgMSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKFwiY2FsbGluZyAnYWRkVG9SZXNvdXJjZVBvbGljeSgpJyBvbiB0aGUgcmV0dXJuZWQgS2V5XCIsICgpID0+IHtcbiAgICBsZXQgYWRkVG9SZXNvdXJjZVBvbGljeVJlc3VsdDogaWFtLkFkZFRvUmVzb3VyY2VQb2xpY3lSZXN1bHQ7XG5cbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIGFkZFRvUmVzb3VyY2VQb2xpY3lSZXN1bHQgPSBrZXkuYWRkVG9SZXNvdXJjZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgIGFjdGlvbnM6IFsna21zOmFjdGlvbiddLFxuICAgICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgICAgICBwcmluY2lwYWxzOiBbbmV3IGlhbS5BbnlQcmluY2lwYWwoKV0sXG4gICAgICB9KSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KFwidGhlIEFkZFRvUmVzb3VyY2VQb2xpY3lSZXN1bHQgcmV0dXJuZWQgaGFzICdzdGF0ZW1lbnRBZGRlZCcgc2V0IHRvICd0cnVlJ1wiLCAoKSA9PiB7XG4gICAgICBleHBlY3QoYWRkVG9SZXNvdXJjZVBvbGljeVJlc3VsdC5zdGF0ZW1lbnRBZGRlZCkudG9CZVRydXRoeSgpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgncHJlc2VydmVzIHRoZSBtdXRhdGluZyBjYWxsIGluIHRoZSByZXN1bHRpbmcgdGVtcGxhdGUnLCAoKSA9PiB7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpLTVM6OktleScsIHtcbiAgICAgICAgS2V5UG9saWN5OiB7XG4gICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogJ2ttczoqJyxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICAgICAgICBBV1M6IHtcbiAgICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFsnJywgW1xuICAgICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICAgICAgICAgICAgICc6aWFtOjonLFxuICAgICAgICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6QWNjb3VudElkJyB9LFxuICAgICAgICAgICAgICAgICAgICAnOnJvb3QnLFxuICAgICAgICAgICAgICAgICAgXV0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogJ2ttczphY3Rpb24nLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFByaW5jaXBhbDogeyBBV1M6ICcqJyB9LFxuICAgICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnY2FsbGluZyBmcm9tQ2ZuS2V5KCkgYWdhaW4nLCAoKSA9PiB7XG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBrZXkgPSBrbXMuS2V5LmZyb21DZm5LZXkoY2ZuS2V5KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdhbmQgdXNpbmcgaXQgZm9yIGdyYW50RGVjcnlwdCgpIG9uIGEgUm9sZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICBjb25zdCByb2xlID0gbmV3IGlhbS5Sb2xlKHN0YWNrLCAnUm9sZScsIHtcbiAgICAgICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uQW55UHJpbmNpcGFsKCksXG4gICAgICAgIH0pO1xuICAgICAgICBrZXkuZ3JhbnREZWNyeXB0KHJvbGUpO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ2NyZWF0ZXMgdGhlIGNvcnJlY3QgSUFNIFBvbGljeScsICgpID0+IHtcbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgQWN0aW9uOiAna21zOkRlY3J5cHQnLFxuICAgICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ0NmbktleScsICdBcm4nXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KCdjb3JyZWN0bHkgbXV0YXRlcyB0aGUgUG9saWN5IG9mIHRoZSB1bmRlcmx5aW5nIENmbktleScsICgpID0+IHtcbiAgICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6S01TOjpLZXknLCB7XG4gICAgICAgICAgS2V5UG9saWN5OiB7XG4gICAgICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIEFjdGlvbjogJ2ttczoqJyxcbiAgICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgICAgUHJpbmNpcGFsOiB7XG4gICAgICAgICAgICAgICAgICBBV1M6IHtcbiAgICAgICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogWycnLCBbXG4gICAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICAgICAgICAgICAgICAgJzppYW06OicsXG4gICAgICAgICAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OkFjY291bnRJZCcgfSxcbiAgICAgICAgICAgICAgICAgICAgICAnOnJvb3QnLFxuICAgICAgICAgICAgICAgICAgICBdXSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgQWN0aW9uOiAna21zOkRlY3J5cHQnLFxuICAgICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICAgICAgICAgIEFXUzoge1xuICAgICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFsnUm9sZTFBQkNDNUYwJywgJ0FybiddLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKFwiY2FsbGVkIHdpdGggYSBDZm5LZXkgdGhhdCBoYXMgYW4gJ0ZuOjpJZicgcGFzc2VkIGFzIHRoZSBLZXlQb2xpY3lcIiwgKCkgPT4ge1xuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgY2ZuS2V5ID0gbmV3IGttcy5DZm5LZXkoc3RhY2ssICdDZm5LZXkyJywge1xuICAgICAgICBrZXlQb2xpY3k6IGNkay5Gbi5jb25kaXRpb25JZihcbiAgICAgICAgICAnQWx3YXlzVHJ1ZScsXG4gICAgICAgICAge1xuICAgICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBBY3Rpb246ICdrbXM6YWN0aW9uMScsXG4gICAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgIFByaW5jaXBhbDogJyonLFxuICAgICAgICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBBY3Rpb246ICdrbXM6YWN0aW9uMicsXG4gICAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgIFByaW5jaXBhbDogJyonLFxuICAgICAgICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICAgIH0sXG4gICAgICAgICksXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3Rocm93cyBhIGRlc2NyaXB0aXZlIGV4Y2VwdGlvbicsICgpID0+IHtcbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIGttcy5LZXkuZnJvbUNmbktleShjZm5LZXkpO1xuICAgICAgfSkudG9UaHJvdygvQ291bGQgbm90IHBhcnNlIHRoZSBQb2xpY3lEb2N1bWVudCBvZiB0aGUgcGFzc2VkIEFXUzo6S01TOjpLZXkvKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoXCJjYWxsZWQgd2l0aCBhIENmbktleSB0aGF0IGhhcyBhbiAnRm46OklmJyBwYXNzZWQgYXMgdGhlIFN0YXRlbWVudCBvZiBhIEtleVBvbGljeVwiLCAoKSA9PiB7XG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBjZm5LZXkgPSBuZXcga21zLkNmbktleShzdGFjaywgJ0NmbktleTInLCB7XG4gICAgICAgIGtleVBvbGljeToge1xuICAgICAgICAgIFN0YXRlbWVudDogY2RrLkZuLmNvbmRpdGlvbklmKFxuICAgICAgICAgICAgJ0Fsd2F5c1RydWUnLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgQWN0aW9uOiAna21zOmFjdGlvbjEnLFxuICAgICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgICBQcmluY2lwYWw6ICcqJyxcbiAgICAgICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIEFjdGlvbjogJ2ttczphY3Rpb24yJyxcbiAgICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgICAgUHJpbmNpcGFsOiAnKicsXG4gICAgICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgKSxcbiAgICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3Rocm93cyBhIGRlc2NyaXB0aXZlIGV4Y2VwdGlvbicsICgpID0+IHtcbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIGttcy5LZXkuZnJvbUNmbktleShjZm5LZXkpO1xuICAgICAgfSkudG9UaHJvdygvQ291bGQgbm90IHBhcnNlIHRoZSBQb2xpY3lEb2N1bWVudCBvZiB0aGUgcGFzc2VkIEFXUzo6S01TOjpLZXkvKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoXCJjYWxsZWQgd2l0aCBhIENmbktleSB0aGF0IGhhcyBhbiAnRm46OklmJyBwYXNzZWQgYXMgb25lIG9mIHRoZSBzdGF0ZW1lbnRzIG9mIGEgS2V5UG9saWN5XCIsICgpID0+IHtcbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIGNmbktleSA9IG5ldyBrbXMuQ2ZuS2V5KHN0YWNrLCAnQ2ZuS2V5MicsIHtcbiAgICAgICAga2V5UG9saWN5OiB7XG4gICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICBjZGsuRm4uY29uZGl0aW9uSWYoXG4gICAgICAgICAgICAgICdBbHdheXNUcnVlJyxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIEFjdGlvbjogJ2ttczphY3Rpb24xJyxcbiAgICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgICAgUHJpbmNpcGFsOiAnKicsXG4gICAgICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIEFjdGlvbjogJ2ttczphY3Rpb24yJyxcbiAgICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgICAgUHJpbmNpcGFsOiAnKicsXG4gICAgICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICksXG4gICAgICAgICAgXSxcbiAgICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3Rocm93cyBhIGRlc2NyaXB0aXZlIGV4Y2VwdGlvbicsICgpID0+IHtcbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIGttcy5LZXkuZnJvbUNmbktleShjZm5LZXkpO1xuICAgICAgfSkudG9UaHJvdygvQ291bGQgbm90IHBhcnNlIHRoZSBQb2xpY3lEb2N1bWVudCBvZiB0aGUgcGFzc2VkIEFXUzo6S01TOjpLZXkvKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoXCJjYWxsZWQgd2l0aCBhIENmbktleSB0aGF0IGhhcyBhbiAnRm46OklmJyBwYXNzZWQgZm9yIHRoZSBBY3Rpb24gaW4gb25lIG9mIHRoZSBzdGF0ZW1lbnRzIG9mIGEgS2V5UG9saWN5XCIsICgpID0+IHtcbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIGNmbktleSA9IG5ldyBrbXMuQ2ZuS2V5KHN0YWNrLCAnQ2ZuS2V5MicsIHtcbiAgICAgICAga2V5UG9saWN5OiB7XG4gICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogY2RrLkZuLmNvbmRpdGlvbklmKCdBbHdheXNUcnVlJywgJ2ttczphY3Rpb24xJywgJ2ttczphY3Rpb24yJyksXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUHJpbmNpcGFsOiAnKicsXG4gICAgICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd0aHJvd3MgYSBkZXNjcmlwdGl2ZSBleGNlcHRpb24nLCAoKSA9PiB7XG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBrZXkgPSBrbXMuS2V5LmZyb21DZm5LZXkoY2ZuS2V5KTtcbiAgICAgIH0pLnRvVGhyb3coL0NvdWxkIG5vdCBwYXJzZSB0aGUgUG9saWN5RG9jdW1lbnQgb2YgdGhlIHBhc3NlZCBBV1M6OktNUzo6S2V5Lyk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdhZGRUb1Jlc291cmNlUG9saWN5IGFsbG93Tm9PcCBhbmQgdGhlcmUgaXMgbm8gcG9saWN5JywgKCkgPT4ge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgamVzdC9leHBlY3QtZXhwZWN0XG4gIHRlc3QoJ3N1Y2NlZWQgaWYgc2V0IHRvIHRydWUgKGRlZmF1bHQpJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGtleSA9IGttcy5LZXkuZnJvbUtleUFybihzdGFjaywgJ0ltcG9ydGVkJyxcbiAgICAgICdhcm46YXdzOmttczp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmtleS8xMjM0NTY3OC0xMjM0LTEyMzQtMTIzNC0xMjM0NTY3ODkwMTInKTtcblxuICAgIGtleS5hZGRUb1Jlc291cmNlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHsgcmVzb3VyY2VzOiBbJyonXSwgYWN0aW9uczogWycqJ10gfSkpO1xuXG4gIH0pO1xuXG4gIHRlc3QoJ2ZhaWxzIGlmIHNldCB0byBmYWxzZScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBrZXkgPSBrbXMuS2V5LmZyb21LZXlBcm4oc3RhY2ssICdJbXBvcnRlZCcsXG4gICAgICAnYXJuOmF3czprbXM6dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjprZXkvMTIzNDU2NzgtMTIzNC0xMjM0LTEyMzQtMTIzNDU2Nzg5MDEyJyk7XG5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAga2V5LmFkZFRvUmVzb3VyY2VQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoeyByZXNvdXJjZXM6IFsnKiddLCBhY3Rpb25zOiBbJyonXSB9KSwgLyogYWxsb3dOb09wICovIGZhbHNlKTtcbiAgICB9KS50b1Rocm93KCdVbmFibGUgdG8gYWRkIHN0YXRlbWVudCB0byBJQU0gcmVzb3VyY2UgcG9saWN5IGZvciBLTVMga2V5OiBcImFybjphd3M6a21zOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6a2V5LzEyMzQ1Njc4LTEyMzQtMTIzNC0xMjM0LTEyMzQ1Njc4OTAxMlwiJyk7XG5cbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ2tleSBzcGVjcyBhbmQga2V5IHVzYWdlcycsICgpID0+IHtcbiAgdGVzdCgnYm90aCB1c2FnZSBhbmQgc3BlYyBhcmUgc3BlY2lmaWVkJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIG5ldyBrbXMuS2V5KHN0YWNrLCAnS2V5JywgeyBrZXlTcGVjOiBrbXMuS2V5U3BlYy5FQ0NfU0VDR19QMjU2SzEsIGtleVVzYWdlOiBrbXMuS2V5VXNhZ2UuU0lHTl9WRVJJRlkgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpLTVM6OktleScsIHtcbiAgICAgIEtleVNwZWM6ICdFQ0NfU0VDR19QMjU2SzEnLFxuICAgICAgS2V5VXNhZ2U6ICdTSUdOX1ZFUklGWScsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ29ubHkga2V5IHVzYWdlIGlzIHNwZWNpZmllZCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBuZXcga21zLktleShzdGFjaywgJ0tleScsIHsga2V5VXNhZ2U6IGttcy5LZXlVc2FnZS5FTkNSWVBUX0RFQ1JZUFQgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpLTVM6OktleScsIHtcbiAgICAgIEtleVVzYWdlOiAnRU5DUllQVF9ERUNSWVBUJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnb25seSBrZXkgc3BlYyBpcyBzcGVjaWZpZWQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgbmV3IGttcy5LZXkoc3RhY2ssICdLZXknLCB7IGtleVNwZWM6IGttcy5LZXlTcGVjLlJTQV80MDk2IH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6S01TOjpLZXknLCB7XG4gICAgICBLZXlTcGVjOiAnUlNBXzQwOTYnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdpbnZhbGlkIGNvbWJpbmF0aW9ucyBvZiBrZXkgc3BlY3MgYW5kIGtleSB1c2FnZXMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBleHBlY3QoKCkgPT4gbmV3IGttcy5LZXkoc3RhY2ssICdLZXkxJywgeyBrZXlTcGVjOiBrbXMuS2V5U3BlYy5FQ0NfTklTVF9QMjU2IH0pKVxuICAgICAgLnRvVGhyb3coJ2tleSBzcGVjIFxcJ0VDQ19OSVNUX1AyNTZcXCcgaXMgbm90IHZhbGlkIHdpdGggdXNhZ2UgXFwnRU5DUllQVF9ERUNSWVBUXFwnJyk7XG4gICAgZXhwZWN0KCgpID0+IG5ldyBrbXMuS2V5KHN0YWNrLCAnS2V5MicsIHsga2V5U3BlYzoga21zLktleVNwZWMuRUNDX1NFQ0dfUDI1NksxLCBrZXlVc2FnZToga21zLktleVVzYWdlLkVOQ1JZUFRfREVDUllQVCB9KSlcbiAgICAgIC50b1Rocm93KCdrZXkgc3BlYyBcXCdFQ0NfU0VDR19QMjU2SzFcXCcgaXMgbm90IHZhbGlkIHdpdGggdXNhZ2UgXFwnRU5DUllQVF9ERUNSWVBUXFwnJyk7XG4gICAgZXhwZWN0KCgpID0+IG5ldyBrbXMuS2V5KHN0YWNrLCAnS2V5MycsIHsga2V5U3BlYzoga21zLktleVNwZWMuU1lNTUVUUklDX0RFRkFVTFQsIGtleVVzYWdlOiBrbXMuS2V5VXNhZ2UuU0lHTl9WRVJJRlkgfSkpXG4gICAgICAudG9UaHJvdygna2V5IHNwZWMgXFwnU1lNTUVUUklDX0RFRkFVTFRcXCcgaXMgbm90IHZhbGlkIHdpdGggdXNhZ2UgXFwnU0lHTl9WRVJJRllcXCcnKTtcbiAgICBleHBlY3QoKCkgPT4gbmV3IGttcy5LZXkoc3RhY2ssICdLZXk0JywgeyBrZXlVc2FnZToga21zLktleVVzYWdlLlNJR05fVkVSSUZZIH0pKVxuICAgICAgLnRvVGhyb3coJ2tleSBzcGVjIFxcJ1NZTU1FVFJJQ19ERUZBVUxUXFwnIGlzIG5vdCB2YWxpZCB3aXRoIHVzYWdlIFxcJ1NJR05fVkVSSUZZXFwnJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ZhaWxzIGlmIGtleSByb3RhdGlvbiBlbmFibGVkIG9uIGFzeW1tZXRyaWMga2V5JywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgZXhwZWN0KCgpID0+IG5ldyBrbXMuS2V5KHN0YWNrLCAnS2V5JywgeyBlbmFibGVLZXlSb3RhdGlvbjogdHJ1ZSwga2V5U3BlYzoga21zLktleVNwZWMuUlNBXzMwNzIgfSkpXG4gICAgICAudG9UaHJvdygna2V5IHJvdGF0aW9uIGNhbm5vdCBiZSBlbmFibGVkIG9uIGFzeW1tZXRyaWMga2V5cycpO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnS2V5LmZyb21LZXlBcm4oKScsICgpID0+IHtcbiAgbGV0IHN0YWNrOiBjZGsuU3RhY2s7XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnQmFzZScsIHtcbiAgICAgIGVudjogeyBhY2NvdW50OiAnMTExMTExMTExMTExJywgcmVnaW9uOiAnc3RhY2stcmVnaW9uJyB9LFxuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnZm9yIGEga2V5IGluIGEgZGlmZmVyZW50IGFjY291bnQgYW5kIHJlZ2lvbicsICgpID0+IHtcbiAgICBsZXQga2V5OiBrbXMuSUtleTtcblxuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAga2V5ID0ga21zLktleS5mcm9tS2V5QXJuKFxuICAgICAgICBzdGFjayxcbiAgICAgICAgJ2lLZXknLFxuICAgICAgICAnYXJuOmF3czprbXM6a2V5LXJlZ2lvbjoyMjIyMjIyMjIyMjI6a2V5OmtleS1uYW1lJyxcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KFwidGhlIGtleSdzIHJlZ2lvbiBpcyB0YWtlbiBmcm9tIHRoZSBBUk5cIiwgKCkgPT4ge1xuICAgICAgZXhwZWN0KGtleS5lbnYucmVnaW9uKS50b0JlKCdrZXktcmVnaW9uJyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KFwidGhlIGtleSdzIGFjY291bnQgaXMgdGFrZW4gZnJvbSB0aGUgQVJOXCIsICgpID0+IHtcbiAgICAgIGV4cGVjdChrZXkuZW52LmFjY291bnQpLnRvQmUoJzIyMjIyMjIyMjIyMicpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19