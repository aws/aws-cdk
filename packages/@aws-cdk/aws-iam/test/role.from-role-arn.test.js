"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const core_1 = require("@aws-cdk/core");
const cx_api_1 = require("@aws-cdk/cx-api");
const lib_1 = require("../lib");
/* eslint-disable quote-props */
const roleAccount = '123456789012';
const notRoleAccount = '012345678901';
describe('IAM Role.fromRoleArn', () => {
    let app;
    beforeEach(() => {
        app = new core_1.App();
    });
    let roleStack;
    let importedRole;
    describe('imported with a static ARN', () => {
        const roleName = 'MyRole';
        describe('into an env-agnostic stack', () => {
            beforeEach(() => {
                roleStack = new core_1.Stack(app, 'RoleStack');
                importedRole = lib_1.Role.fromRoleArn(roleStack, 'ImportedRole', `arn:aws:iam::${roleAccount}:role/${roleName}`);
            });
            test('correctly parses the imported role ARN', () => {
                expect(importedRole.roleArn).toBe(`arn:aws:iam::${roleAccount}:role/${roleName}`);
            });
            test('correctly parses the imported role name', () => {
                expect(importedRole.roleName).toBe(roleName);
            });
            describe('then adding a PolicyStatement to it', () => {
                let addToPolicyResult;
                beforeEach(() => {
                    addToPolicyResult = importedRole.addToPolicy(somePolicyStatement());
                });
                test('returns true', () => {
                    expect(addToPolicyResult).toBe(true);
                });
                test("generates a default Policy resource pointing at the imported role's physical name", () => {
                    assertRoleHasDefaultPolicy(roleStack, roleName);
                });
            });
            describe('future flag: @aws-cdk/aws-iam:importedRoleStackSafeDefaultPolicyName', () => {
                test('the same role imported in different stacks has different default policy names', () => {
                    const appWithFeatureFlag = new core_1.App({ context: { [cx_api_1.IAM_IMPORTED_ROLE_STACK_SAFE_DEFAULT_POLICY_NAME]: true } });
                    const roleStack1 = new core_1.Stack(appWithFeatureFlag, 'RoleStack1');
                    const importedRoleInStack1 = lib_1.Role.fromRoleArn(roleStack1, 'ImportedRole', `arn:aws:iam::${roleAccount}:role/${roleName}`);
                    importedRoleInStack1.addToPrincipalPolicy(somePolicyStatement());
                    const roleStack2 = new core_1.Stack(appWithFeatureFlag, 'RoleStack2');
                    const importedRoleInStack2 = lib_1.Role.fromRoleArn(roleStack2, 'ImportedRole', `arn:aws:iam::${roleAccount}:role/${roleName}`);
                    importedRoleInStack2.addToPrincipalPolicy(somePolicyStatement());
                    const stack1PolicyNameCapture = new assertions_1.Capture();
                    assertions_1.Template.fromStack(roleStack1).hasResourceProperties('AWS::IAM::Policy', { PolicyName: stack1PolicyNameCapture });
                    const stack2PolicyNameCapture = new assertions_1.Capture();
                    assertions_1.Template.fromStack(roleStack2).hasResourceProperties('AWS::IAM::Policy', { PolicyName: stack2PolicyNameCapture });
                    expect(stack1PolicyNameCapture.asString()).not.toBe(stack2PolicyNameCapture.asString());
                    expect(stack1PolicyNameCapture.asString()).toMatch(/PolicyRoleStack1ImportedRole.*/);
                    expect(stack2PolicyNameCapture.asString()).toMatch(/PolicyRoleStack2ImportedRole.*/);
                });
                test('the same role imported in different stacks has the same default policy name without flag', () => {
                    const appWithoutFeatureFlag = new core_1.App({ context: { [cx_api_1.IAM_IMPORTED_ROLE_STACK_SAFE_DEFAULT_POLICY_NAME]: false } });
                    const roleStack1 = new core_1.Stack(appWithoutFeatureFlag, 'RoleStack1');
                    const importedRoleInStack1 = lib_1.Role.fromRoleArn(roleStack1, 'ImportedRole', `arn:aws:iam::${roleAccount}:role/${roleName}`);
                    importedRoleInStack1.addToPrincipalPolicy(somePolicyStatement());
                    const roleStack2 = new core_1.Stack(appWithoutFeatureFlag, 'RoleStack2');
                    const importedRoleInStack2 = lib_1.Role.fromRoleArn(roleStack2, 'ImportedRole', `arn:aws:iam::${roleAccount}:role/${roleName}`);
                    importedRoleInStack2.addToPrincipalPolicy(somePolicyStatement());
                    const stack1PolicyNameCapture = new assertions_1.Capture();
                    assertions_1.Template.fromStack(roleStack1).hasResourceProperties('AWS::IAM::Policy', { PolicyName: stack1PolicyNameCapture });
                    const stack2PolicyNameCapture = new assertions_1.Capture();
                    assertions_1.Template.fromStack(roleStack2).hasResourceProperties('AWS::IAM::Policy', { PolicyName: stack2PolicyNameCapture });
                    expect(stack1PolicyNameCapture.asString()).toBe(stack2PolicyNameCapture.asString());
                    expect(stack1PolicyNameCapture.asString()).toMatch(/ImportedRolePolicy.{8}/);
                });
            });
            describe('then attaching a Policy to it', () => {
                let policyStack;
                describe('that belongs to the same stack as the imported role', () => {
                    beforeEach(() => {
                        importedRole.attachInlinePolicy(somePolicy(roleStack, 'MyPolicy'));
                    });
                    test('correctly attaches the Policy to the imported role', () => {
                        assertRoleHasAttachedPolicy(roleStack, roleName, 'MyPolicy');
                    });
                });
                describe('that belongs to a different env-agnostic stack', () => {
                    beforeEach(() => {
                        policyStack = new core_1.Stack(app, 'PolicyStack');
                        importedRole.attachInlinePolicy(somePolicy(policyStack, 'MyPolicy'));
                    });
                    test('correctly attaches the Policy to the imported role', () => {
                        assertRoleHasAttachedPolicy(policyStack, roleName, 'MyPolicy');
                    });
                });
                describe('that belongs to a targeted stack, with account set to', () => {
                    describe('the same account as in the ARN of the imported role', () => {
                        beforeEach(() => {
                            policyStack = new core_1.Stack(app, 'PolicyStack', { env: { account: roleAccount } });
                            importedRole.attachInlinePolicy(somePolicy(policyStack, 'MyPolicy'));
                        });
                        test('correctly attaches the Policy to the imported role', () => {
                            assertRoleHasAttachedPolicy(policyStack, roleName, 'MyPolicy');
                        });
                    });
                    describe('a different account than in the ARN of the imported role', () => {
                        beforeEach(() => {
                            policyStack = new core_1.Stack(app, 'PolicyStack', { env: { account: notRoleAccount } });
                            importedRole.attachInlinePolicy(somePolicy(policyStack, 'MyPolicy'));
                        });
                        test('does NOT attach the Policy to the imported role', () => {
                            assertPolicyDidNotAttachToRole(policyStack, 'MyPolicy');
                        });
                    });
                });
            });
        });
        describe('into a targeted stack with account set to', () => {
            describe('the same account as in the ARN the role was imported with', () => {
                beforeEach(() => {
                    roleStack = new core_1.Stack(app, 'RoleStack', { env: { account: roleAccount } });
                    importedRole = lib_1.Role.fromRoleArn(roleStack, 'ImportedRole', `arn:aws:iam::${roleAccount}:role/${roleName}`);
                });
                describe('then adding a PolicyStatement to it', () => {
                    let addToPolicyResult;
                    beforeEach(() => {
                        addToPolicyResult = importedRole.addToPolicy(somePolicyStatement());
                    });
                    test('returns true', () => {
                        expect(addToPolicyResult).toBe(true);
                    });
                    test("generates a default Policy resource pointing at the imported role's physical name", () => {
                        assertRoleHasDefaultPolicy(roleStack, roleName);
                    });
                });
                describe('then attaching a Policy to it', () => {
                    describe('that belongs to the same stack as the imported role', () => {
                        beforeEach(() => {
                            importedRole.attachInlinePolicy(somePolicy(roleStack, 'MyPolicy'));
                        });
                        test('correctly attaches the Policy to the imported role', () => {
                            assertRoleHasAttachedPolicy(roleStack, roleName, 'MyPolicy');
                        });
                    });
                    describe('that belongs to an env-agnostic stack', () => {
                        let policyStack;
                        beforeEach(() => {
                            policyStack = new core_1.Stack(app, 'PolicyStack');
                            importedRole.attachInlinePolicy(somePolicy(policyStack, 'MyPolicy'));
                        });
                        test('correctly attaches the Policy to the imported role', () => {
                            assertRoleHasAttachedPolicy(policyStack, roleName, 'MyPolicy');
                        });
                    });
                    describe('that belongs to a targeted stack, with account set to', () => {
                        let policyStack;
                        describe('the same account as in the imported role ARN and in the stack the imported role belongs to', () => {
                            beforeEach(() => {
                                policyStack = new core_1.Stack(app, 'PolicyStack', { env: { account: roleAccount } });
                                importedRole.attachInlinePolicy(somePolicy(policyStack, 'MyPolicy'));
                            });
                            test('correctly attaches the Policy to the imported role', () => {
                                assertRoleHasAttachedPolicy(policyStack, roleName, 'MyPolicy');
                            });
                        });
                        describe('a different account than in the imported role ARN and in the stack the imported role belongs to', () => {
                            beforeEach(() => {
                                policyStack = new core_1.Stack(app, 'PolicyStack', { env: { account: notRoleAccount } });
                                importedRole.attachInlinePolicy(somePolicy(policyStack, 'MyPolicy'));
                            });
                            test('does NOT attach the Policy to the imported role', () => {
                                assertPolicyDidNotAttachToRole(policyStack, 'MyPolicy');
                            });
                        });
                    });
                });
            });
            describe('a different account than in the ARN the role was imported with', () => {
                beforeEach(() => {
                    roleStack = new core_1.Stack(app, 'RoleStack', { env: { account: notRoleAccount } });
                    importedRole = lib_1.Role.fromRoleArn(roleStack, 'ImportedRole', `arn:aws:iam::${roleAccount}:role/${roleName}`);
                });
                describe('then adding a PolicyStatement to it', () => {
                    let addToPolicyResult;
                    beforeEach(() => {
                        addToPolicyResult = importedRole.addToPolicy(somePolicyStatement());
                    });
                    test('pretends to succeed', () => {
                        expect(addToPolicyResult).toBe(true);
                    });
                    test("does NOT generate a default Policy resource pointing at the imported role's physical name", () => {
                        assertions_1.Template.fromStack(roleStack).resourceCountIs('AWS::IAM::Policy', 0);
                    });
                });
                describe('then attaching a Policy to it', () => {
                    describe('that belongs to the same stack as the imported role', () => {
                        beforeEach(() => {
                            importedRole.attachInlinePolicy(somePolicy(roleStack, 'MyPolicy'));
                        });
                        test('does NOT attach the Policy to the imported role', () => {
                            assertPolicyDidNotAttachToRole(roleStack, 'MyPolicy');
                        });
                    });
                    describe('that belongs to an env-agnostic stack', () => {
                        let policyStack;
                        beforeEach(() => {
                            policyStack = new core_1.Stack(app, 'PolicyStack');
                            importedRole.attachInlinePolicy(somePolicy(policyStack, 'MyPolicy'));
                        });
                        test('does NOT attach the Policy to the imported role', () => {
                            assertPolicyDidNotAttachToRole(policyStack, 'MyPolicy');
                        });
                    });
                    describe('that belongs to a different targeted stack, with account set to', () => {
                        let policyStack;
                        describe('the same account as in the ARN of the imported role', () => {
                            beforeEach(() => {
                                policyStack = new core_1.Stack(app, 'PolicyStack', { env: { account: roleAccount } });
                                importedRole.attachInlinePolicy(somePolicy(policyStack, 'MyPolicy'));
                            });
                            test('does NOT attach the Policy to the imported role', () => {
                                assertPolicyDidNotAttachToRole(policyStack, 'MyPolicy');
                            });
                        });
                        describe('the same account as in the stack the imported role belongs to', () => {
                            beforeEach(() => {
                                policyStack = new core_1.Stack(app, 'PolicyStack', { env: { account: notRoleAccount } });
                                importedRole.attachInlinePolicy(somePolicy(policyStack, 'MyPolicy'));
                            });
                            test('does NOT attach the Policy to the imported role', () => {
                                assertPolicyDidNotAttachToRole(policyStack, 'MyPolicy');
                            });
                        });
                        describe('a third account, different from both the role and scope stack accounts', () => {
                            beforeEach(() => {
                                policyStack = new core_1.Stack(app, 'PolicyStack', { env: { account: 'some-random-account' } });
                                importedRole.attachInlinePolicy(somePolicy(policyStack, 'MyPolicy'));
                            });
                            test('does NOT attach the Policy to the imported role', () => {
                                assertPolicyDidNotAttachToRole(policyStack, 'MyPolicy');
                            });
                        });
                    });
                });
            });
        });
        describe('and with mutable=false', () => {
            beforeEach(() => {
                roleStack = new core_1.Stack(app, 'RoleStack');
                importedRole = lib_1.Role.fromRoleArn(roleStack, 'ImportedRole', `arn:aws:iam::${roleAccount}:role/${roleName}`, { mutable: false });
            });
            describe('then adding a PolicyStatement to it', () => {
                let addToPolicyResult;
                beforeEach(() => {
                    addToPolicyResult = importedRole.addToPolicy(somePolicyStatement());
                });
                test('pretends to succeed', () => {
                    expect(addToPolicyResult).toBe(true);
                });
                test("does NOT generate a default Policy resource pointing at the imported role's physical name", () => {
                    assertions_1.Template.fromStack(roleStack).resourceCountIs('AWS::IAM::Policy', 0);
                });
            });
            describe('then attaching a Policy to it', () => {
                let policyStack;
                describe('that belongs to a stack with account equal to the account in the imported role ARN', () => {
                    beforeEach(() => {
                        policyStack = new core_1.Stack(app, 'PolicyStack', { env: { account: roleAccount } });
                        importedRole.attachInlinePolicy(somePolicy(policyStack, 'MyPolicy'));
                    });
                    test('does NOT attach the Policy to the imported role', () => {
                        assertPolicyDidNotAttachToRole(policyStack, 'MyPolicy');
                    });
                });
            });
        });
        describe('and with mutable=false and addGrantsToResources=true', () => {
            beforeEach(() => {
                roleStack = new core_1.Stack(app, 'RoleStack');
                importedRole = lib_1.Role.fromRoleArn(roleStack, 'ImportedRole', `arn:aws:iam::${roleAccount}:role/${roleName}`, { mutable: false, addGrantsToResources: true });
            });
            describe('then adding a PolicyStatement to it', () => {
                let addToPolicyResult;
                beforeEach(() => {
                    addToPolicyResult = importedRole.addToPolicy(somePolicyStatement());
                });
                test('pretends to fail', () => {
                    expect(addToPolicyResult).toBe(false);
                });
                test("does NOT generate a default Policy resource pointing at the imported role's physical name", () => {
                    assertions_1.Template.fromStack(roleStack).resourceCountIs('AWS::IAM::Policy', 0);
                });
            });
        });
        describe('imported with a user specified default policy name', () => {
            test('user specified default policy is used when fromRoleArn() creates a default policy', () => {
                roleStack = new core_1.Stack(app, 'RoleStack');
                new core_1.CfnResource(roleStack, 'SomeResource', {
                    type: 'CDK::Test::SomeResource',
                });
                importedRole = lib_1.Role.fromRoleArn(roleStack, 'ImportedRole', `arn:aws:iam::${roleAccount}:role/${roleName}`, { defaultPolicyName: 'UserSpecifiedDefaultPolicy' });
                lib_1.Grant.addToPrincipal({
                    actions: ['service:DoAThing'],
                    grantee: importedRole,
                    resourceArns: ['*'],
                });
                assertions_1.Template.fromStack(roleStack).templateMatches({
                    Resources: {
                        ImportedRoleUserSpecifiedDefaultPolicy7CBF6E85: {
                            Type: 'AWS::IAM::Policy',
                            Properties: {
                                PolicyName: 'ImportedRoleUserSpecifiedDefaultPolicy7CBF6E85',
                            },
                        },
                    },
                });
            });
        });
        test('`fromRoleName()` with options matches behavior of `fromRoleArn()`', () => {
            roleStack = new core_1.Stack(app, 'RoleStack');
            new core_1.CfnResource(roleStack, 'SomeResource', {
                type: 'CDK::Test::SomeResource',
            });
            importedRole = lib_1.Role.fromRoleName(roleStack, 'ImportedRole', `${roleName}`, { defaultPolicyName: 'UserSpecifiedDefaultPolicy' });
            lib_1.Grant.addToPrincipal({
                actions: ['service:DoAThing'],
                grantee: importedRole,
                resourceArns: ['*'],
            });
            assertions_1.Template.fromStack(roleStack).templateMatches({
                Resources: {
                    ImportedRoleUserSpecifiedDefaultPolicy7CBF6E85: {
                        Type: 'AWS::IAM::Policy',
                        Properties: {
                            PolicyName: 'ImportedRoleUserSpecifiedDefaultPolicy7CBF6E85',
                        },
                    },
                },
            });
        });
    });
    describe('imported with a dynamic ARN', () => {
        const dynamicValue = core_1.Lazy.string({ produce: () => 'role-arn' });
        const roleName = {
            'Fn::Select': [1,
                {
                    'Fn::Split': ['/',
                        {
                            'Fn::Select': [5,
                                { 'Fn::Split': [':', 'role-arn'] }],
                        }],
                }],
        };
        describe('into an env-agnostic stack', () => {
            beforeEach(() => {
                roleStack = new core_1.Stack(app, 'RoleStack');
                importedRole = lib_1.Role.fromRoleArn(roleStack, 'ImportedRole', dynamicValue);
            });
            test('correctly parses the imported role ARN', () => {
                expect(importedRole.roleArn).toBe(dynamicValue);
            });
            test('correctly parses the imported role name', () => {
                new lib_1.Role(roleStack, 'AnyRole', {
                    roleName: 'AnyRole',
                    assumedBy: new lib_1.ArnPrincipal(importedRole.roleName),
                });
                assertions_1.Template.fromStack(roleStack).hasResourceProperties('AWS::IAM::Role', {
                    'AssumeRolePolicyDocument': {
                        'Statement': [
                            {
                                'Action': 'sts:AssumeRole',
                                'Effect': 'Allow',
                                'Principal': {
                                    'AWS': roleName,
                                },
                            },
                        ],
                    },
                });
            });
            describe('then adding a PolicyStatement to it', () => {
                let addToPolicyResult;
                beforeEach(() => {
                    addToPolicyResult = importedRole.addToPolicy(somePolicyStatement());
                });
                test('returns true', () => {
                    expect(addToPolicyResult).toBe(true);
                });
                test("generates a default Policy resource pointing at the imported role's physical name", () => {
                    assertRoleHasDefaultPolicy(roleStack, roleName);
                });
            });
            describe('then attaching a Policy to it', () => {
                let policyStack;
                describe('that belongs to the same stack as the imported role', () => {
                    beforeEach(() => {
                        importedRole.attachInlinePolicy(somePolicy(roleStack, 'MyPolicy'));
                    });
                    test('correctly attaches the Policy to the imported role', () => {
                        assertRoleHasAttachedPolicy(roleStack, roleName, 'MyPolicy');
                    });
                });
                describe('that belongs to a different env-agnostic stack', () => {
                    beforeEach(() => {
                        policyStack = new core_1.Stack(app, 'PolicyStack');
                        importedRole.attachInlinePolicy(somePolicy(policyStack, 'MyPolicy'));
                    });
                    test('correctly attaches the Policy to the imported role', () => {
                        assertRoleHasAttachedPolicy(policyStack, roleName, 'MyPolicy');
                    });
                });
                describe('that belongs to a targeted stack', () => {
                    beforeEach(() => {
                        policyStack = new core_1.Stack(app, 'PolicyStack', { env: { account: roleAccount } });
                        importedRole.attachInlinePolicy(somePolicy(policyStack, 'MyPolicy'));
                    });
                    test('correctly attaches the Policy to the imported role', () => {
                        assertRoleHasAttachedPolicy(policyStack, roleName, 'MyPolicy');
                    });
                });
            });
        });
        describe('into a targeted stack with account set', () => {
            beforeEach(() => {
                roleStack = new core_1.Stack(app, 'RoleStack', { env: { account: roleAccount } });
                importedRole = lib_1.Role.fromRoleArn(roleStack, 'ImportedRole', dynamicValue);
            });
            describe('then adding a PolicyStatement to it', () => {
                let addToPolicyResult;
                beforeEach(() => {
                    addToPolicyResult = importedRole.addToPolicy(somePolicyStatement());
                });
                test('returns true', () => {
                    expect(addToPolicyResult).toBe(true);
                });
                test("generates a default Policy resource pointing at the imported role's physical name", () => {
                    assertRoleHasDefaultPolicy(roleStack, roleName);
                });
            });
            describe('then attaching a Policy to it', () => {
                let policyStack;
                describe('that belongs to the same stack as the imported role', () => {
                    beforeEach(() => {
                        importedRole.attachInlinePolicy(somePolicy(roleStack, 'MyPolicy'));
                    });
                    test('correctly attaches the Policy to the imported role', () => {
                        assertRoleHasAttachedPolicy(roleStack, roleName, 'MyPolicy');
                    });
                });
                describe('that belongs to an env-agnostic stack', () => {
                    beforeEach(() => {
                        policyStack = new core_1.Stack(app, 'PolicyStack');
                        importedRole.attachInlinePolicy(somePolicy(policyStack, 'MyPolicy'));
                    });
                    test('correctly attaches the Policy to the imported role', () => {
                        assertRoleHasAttachedPolicy(policyStack, roleName, 'MyPolicy');
                    });
                });
                describe('that belongs to a different targeted stack, with account set to', () => {
                    describe('the same account as the stack the role was imported into', () => {
                        beforeEach(() => {
                            policyStack = new core_1.Stack(app, 'PolicyStack', { env: { account: roleAccount } });
                            importedRole.attachInlinePolicy(somePolicy(policyStack, 'MyPolicy'));
                        });
                        test('correctly attaches the Policy to the imported role', () => {
                            assertRoleHasAttachedPolicy(policyStack, roleName, 'MyPolicy');
                        });
                    });
                    describe('a different account than the stack the role was imported into', () => {
                        beforeEach(() => {
                            policyStack = new core_1.Stack(app, 'PolicyStack', { env: { account: notRoleAccount } });
                            importedRole.attachInlinePolicy(somePolicy(policyStack, 'MyPolicy'));
                        });
                        test('correctly attaches the Policy to the imported role', () => {
                            assertRoleHasAttachedPolicy(policyStack, roleName, 'MyPolicy');
                        });
                    });
                });
            });
        });
    });
    describe('imported with the ARN of a service role', () => {
        beforeEach(() => {
            roleStack = new core_1.Stack();
        });
        describe('without a service principal in the role name', () => {
            beforeEach(() => {
                importedRole = lib_1.Role.fromRoleArn(roleStack, 'Role', `arn:aws:iam::${roleAccount}:role/service-role/codebuild-role`);
            });
            it("correctly strips the 'service-role' prefix from the role name", () => {
                new lib_1.Policy(roleStack, 'Policy', {
                    statements: [somePolicyStatement()],
                    roles: [importedRole],
                });
                assertions_1.Template.fromStack(roleStack).hasResourceProperties('AWS::IAM::Policy', {
                    'Roles': [
                        'codebuild-role',
                    ],
                });
            });
        });
        describe('with a service principal in the role name', () => {
            beforeEach(() => {
                importedRole = lib_1.Role.fromRoleArn(roleStack, 'Role', `arn:aws:iam::${roleAccount}:role/aws-service-role/anyservice.amazonaws.com/codebuild-role`);
            });
            it("correctly strips both the 'aws-service-role' prefix and the service principal from the role name", () => {
                new lib_1.Policy(roleStack, 'Policy', {
                    statements: [somePolicyStatement()],
                    roles: [importedRole],
                });
                assertions_1.Template.fromStack(roleStack).hasResourceProperties('AWS::IAM::Policy', {
                    'Roles': [
                        'codebuild-role',
                    ],
                });
            });
        });
    });
    describe('for an incorrect ARN', () => {
        beforeEach(() => {
            roleStack = new core_1.Stack(app, 'RoleStack');
        });
        describe("that accidentally skipped the 'region' fragment of the ARN", () => {
            test('throws an exception, indicating that error', () => {
                expect(() => {
                    lib_1.Role.fromRoleArn(roleStack, 'Role', `arn:${core_1.Aws.PARTITION}:iam:${core_1.Aws.ACCOUNT_ID}:role/AwsCicd-${core_1.Aws.REGION}-CodeBuildRole`);
                }).toThrow(/The `resource` component \(6th component\) of an ARN is required:/);
            });
        });
    });
});
test('Role.fromRoleName with no options ', () => {
    const app = new core_1.App();
    const stack = new core_1.Stack(app, 'Stack', { env: { region: 'asdf', account: '1234' } });
    const role = lib_1.Role.fromRoleName(stack, 'MyRole', 'MyRole');
    expect(stack.resolve(role.roleArn)).toEqual({ 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::1234:role/MyRole']] });
});
function somePolicyStatement() {
    return new lib_1.PolicyStatement({
        actions: ['s3:*'],
        resources: ['xyz'],
    });
}
function somePolicy(policyStack, policyName) {
    const someRole = new lib_1.Role(policyStack, 'SomeExampleRole', {
        assumedBy: new lib_1.AnyPrincipal(),
    });
    const roleResource = someRole.node.defaultChild;
    roleResource.overrideLogicalId('SomeRole'); // force a particular logical ID in the Ref expression
    return new lib_1.Policy(policyStack, 'MyPolicy', {
        policyName,
        statements: [somePolicyStatement()],
        // need at least one of user/group/role, otherwise validation fails
        roles: [someRole],
    });
}
function assertRoleHasDefaultPolicy(stack, roleName) {
    _assertStackContainsPolicyResource(stack, [roleName], undefined);
}
function assertRoleHasAttachedPolicy(stack, roleName, attachedPolicyName) {
    _assertStackContainsPolicyResource(stack, [{ Ref: 'SomeRole' }, roleName], attachedPolicyName);
}
function assertPolicyDidNotAttachToRole(stack, policyName) {
    _assertStackContainsPolicyResource(stack, [{ Ref: 'SomeRole' }], policyName);
}
function _assertStackContainsPolicyResource(stack, roleNames, nameOfPolicy) {
    const expected = {
        PolicyDocument: {
            Statement: [
                {
                    Action: 's3:*',
                    Effect: 'Allow',
                    Resource: 'xyz',
                },
            ],
        },
        Roles: roleNames,
    };
    if (nameOfPolicy) {
        expected.PolicyName = nameOfPolicy;
    }
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', expected);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9sZS5mcm9tLXJvbGUtYXJuLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyb2xlLmZyb20tcm9sZS1hcm4udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUF3RDtBQUN4RCx3Q0FBK0U7QUFDL0UsNENBRXlCO0FBQ3pCLGdDQUFpRztBQUVqRyxnQ0FBZ0M7QUFFaEMsTUFBTSxXQUFXLEdBQUcsY0FBYyxDQUFDO0FBQ25DLE1BQU0sY0FBYyxHQUFHLGNBQWMsQ0FBQztBQUV0QyxRQUFRLENBQUMsc0JBQXNCLEVBQUUsR0FBRyxFQUFFO0lBQ3BDLElBQUksR0FBUSxDQUFDO0lBRWIsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLEdBQUcsR0FBRyxJQUFJLFVBQUcsRUFBRSxDQUFDO0lBQ2xCLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxTQUFnQixDQUFDO0lBQ3JCLElBQUksWUFBbUIsQ0FBQztJQUV4QixRQUFRLENBQUMsNEJBQTRCLEVBQUUsR0FBRyxFQUFFO1FBQzFDLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUUxQixRQUFRLENBQUMsNEJBQTRCLEVBQUUsR0FBRyxFQUFFO1lBQzFDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2QsU0FBUyxHQUFHLElBQUksWUFBSyxDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUMsQ0FBQztnQkFDeEMsWUFBWSxHQUFHLFVBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLGNBQWMsRUFDdkQsZ0JBQWdCLFdBQVcsU0FBUyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBQ3BELENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxDQUFDLHdDQUF3QyxFQUFFLEdBQUcsRUFBRTtnQkFDbEQsTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLFdBQVcsU0FBUyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBQ3BGLENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFB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RSxVQUFVLEVBQUUsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQy9FLENBQUM7QUFFRCxTQUFTLGtDQUFrQyxDQUFDLEtBQVksRUFBRSxTQUFnQixFQUFFLFlBQWdDO0lBQzFHLE1BQU0sUUFBUSxHQUFRO1FBQ3BCLGNBQWMsRUFBRTtZQUNkLFNBQVMsRUFBRTtnQkFDVDtvQkFDRSxNQUFNLEVBQUUsTUFBTTtvQkFDZCxNQUFNLEVBQUUsT0FBTztvQkFDZixRQUFRLEVBQUUsS0FBSztpQkFDaEI7YUFDRjtTQUNGO1FBQ0QsS0FBSyxFQUFFLFNBQVM7S0FDakIsQ0FBQztJQUNGLElBQUksWUFBWSxFQUFFO1FBQ2hCLFFBQVEsQ0FBQyxVQUFVLEdBQUcsWUFBWSxDQUFDO0tBQ3BDO0lBRUQscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsa0JBQWtCLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDaEYsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENhcHR1cmUsIFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgeyBBcHAsIEF3cywgQ2ZuRWxlbWVudCwgQ2ZuUmVzb3VyY2UsIExhenksIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQge1xuICBJQU1fSU1QT1JURURfUk9MRV9TVEFDS19TQUZFX0RFRkFVTFRfUE9MSUNZX05BTUUsXG59IGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgeyBBbnlQcmluY2lwYWwsIEFyblByaW5jaXBhbCwgR3JhbnQsIElSb2xlLCBQb2xpY3ksIFBvbGljeVN0YXRlbWVudCwgUm9sZSB9IGZyb20gJy4uL2xpYic7XG5cbi8qIGVzbGludC1kaXNhYmxlIHF1b3RlLXByb3BzICovXG5cbmNvbnN0IHJvbGVBY2NvdW50ID0gJzEyMzQ1Njc4OTAxMic7XG5jb25zdCBub3RSb2xlQWNjb3VudCA9ICcwMTIzNDU2Nzg5MDEnO1xuXG5kZXNjcmliZSgnSUFNIFJvbGUuZnJvbVJvbGVBcm4nLCAoKSA9PiB7XG4gIGxldCBhcHA6IEFwcDtcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBhcHAgPSBuZXcgQXBwKCk7XG4gIH0pO1xuXG4gIGxldCByb2xlU3RhY2s6IFN0YWNrO1xuICBsZXQgaW1wb3J0ZWRSb2xlOiBJUm9sZTtcblxuICBkZXNjcmliZSgnaW1wb3J0ZWQgd2l0aCBhIHN0YXRpYyBBUk4nLCAoKSA9PiB7XG4gICAgY29uc3Qgcm9sZU5hbWUgPSAnTXlSb2xlJztcblxuICAgIGRlc2NyaWJlKCdpbnRvIGFuIGVudi1hZ25vc3RpYyBzdGFjaycsICgpID0+IHtcbiAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICByb2xlU3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnUm9sZVN0YWNrJyk7XG4gICAgICAgIGltcG9ydGVkUm9sZSA9IFJvbGUuZnJvbVJvbGVBcm4ocm9sZVN0YWNrLCAnSW1wb3J0ZWRSb2xlJyxcbiAgICAgICAgICBgYXJuOmF3czppYW06OiR7cm9sZUFjY291bnR9OnJvbGUvJHtyb2xlTmFtZX1gKTtcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KCdjb3JyZWN0bHkgcGFyc2VzIHRoZSBpbXBvcnRlZCByb2xlIEFSTicsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KGltcG9ydGVkUm9sZS5yb2xlQXJuKS50b0JlKGBhcm46YXdzOmlhbTo6JHtyb2xlQWNjb3VudH06cm9sZS8ke3JvbGVOYW1lfWApO1xuICAgICAgfSk7XG5cbiAgICAgIHRlc3QoJ2NvcnJlY3RseSBwYXJzZXMgdGhlIGltcG9ydGVkIHJvbGUgbmFtZScsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KGltcG9ydGVkUm9sZS5yb2xlTmFtZSkudG9CZShyb2xlTmFtZSk7XG4gICAgICB9KTtcblxuICAgICAgZGVzY3JpYmUoJ3RoZW4gYWRkaW5nIGEgUG9saWN5U3RhdGVtZW50IHRvIGl0JywgKCkgPT4ge1xuICAgICAgICBsZXQgYWRkVG9Qb2xpY3lSZXN1bHQ6IGJvb2xlYW47XG5cbiAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgICAgYWRkVG9Qb2xpY3lSZXN1bHQgPSBpbXBvcnRlZFJvbGUuYWRkVG9Qb2xpY3koc29tZVBvbGljeVN0YXRlbWVudCgpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGVzdCgncmV0dXJucyB0cnVlJywgKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChhZGRUb1BvbGljeVJlc3VsdCkudG9CZSh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGVzdChcImdlbmVyYXRlcyBhIGRlZmF1bHQgUG9saWN5IHJlc291cmNlIHBvaW50aW5nIGF0IHRoZSBpbXBvcnRlZCByb2xlJ3MgcGh5c2ljYWwgbmFtZVwiLCAoKSA9PiB7XG4gICAgICAgICAgYXNzZXJ0Um9sZUhhc0RlZmF1bHRQb2xpY3kocm9sZVN0YWNrLCByb2xlTmFtZSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIGRlc2NyaWJlKCdmdXR1cmUgZmxhZzogQGF3cy1jZGsvYXdzLWlhbTppbXBvcnRlZFJvbGVTdGFja1NhZmVEZWZhdWx0UG9saWN5TmFtZScsICgpID0+IHtcbiAgICAgICAgdGVzdCgndGhlIHNhbWUgcm9sZSBpbXBvcnRlZCBpbiBkaWZmZXJlbnQgc3RhY2tzIGhhcyBkaWZmZXJlbnQgZGVmYXVsdCBwb2xpY3kgbmFtZXMnLCAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgYXBwV2l0aEZlYXR1cmVGbGFnID0gbmV3IEFwcCh7IGNvbnRleHQ6IHsgW0lBTV9JTVBPUlRFRF9ST0xFX1NUQUNLX1NBRkVfREVGQVVMVF9QT0xJQ1lfTkFNRV06IHRydWUgfSB9KTtcbiAgICAgICAgICBjb25zdCByb2xlU3RhY2sxID0gbmV3IFN0YWNrKGFwcFdpdGhGZWF0dXJlRmxhZywgJ1JvbGVTdGFjazEnKTtcbiAgICAgICAgICBjb25zdCBpbXBvcnRlZFJvbGVJblN0YWNrMSA9IFJvbGUuZnJvbVJvbGVBcm4ocm9sZVN0YWNrMSwgJ0ltcG9ydGVkUm9sZScsXG4gICAgICAgICAgICBgYXJuOmF3czppYW06OiR7cm9sZUFjY291bnR9OnJvbGUvJHtyb2xlTmFtZX1gKTtcbiAgICAgICAgICBpbXBvcnRlZFJvbGVJblN0YWNrMS5hZGRUb1ByaW5jaXBhbFBvbGljeShzb21lUG9saWN5U3RhdGVtZW50KCkpO1xuXG4gICAgICAgICAgY29uc3Qgcm9sZVN0YWNrMiA9IG5ldyBTdGFjayhhcHBXaXRoRmVhdHVyZUZsYWcsICdSb2xlU3RhY2syJyk7XG4gICAgICAgICAgY29uc3QgaW1wb3J0ZWRSb2xlSW5TdGFjazIgPSBSb2xlLmZyb21Sb2xlQXJuKHJvbGVTdGFjazIsICdJbXBvcnRlZFJvbGUnLFxuICAgICAgICAgICAgYGFybjphd3M6aWFtOjoke3JvbGVBY2NvdW50fTpyb2xlLyR7cm9sZU5hbWV9YCk7XG4gICAgICAgICAgaW1wb3J0ZWRSb2xlSW5TdGFjazIuYWRkVG9QcmluY2lwYWxQb2xpY3koc29tZVBvbGljeVN0YXRlbWVudCgpKTtcblxuICAgICAgICAgIGNvbnN0IHN0YWNrMVBvbGljeU5hbWVDYXB0dXJlID0gbmV3IENhcHR1cmUoKTtcbiAgICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2socm9sZVN0YWNrMSkuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5JywgeyBQb2xpY3lOYW1lOiBzdGFjazFQb2xpY3lOYW1lQ2FwdHVyZSB9KTtcblxuICAgICAgICAgIGNvbnN0IHN0YWNrMlBvbGljeU5hbWVDYXB0dXJlID0gbmV3IENhcHR1cmUoKTtcbiAgICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2socm9sZVN0YWNrMikuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5JywgeyBQb2xpY3lOYW1lOiBzdGFjazJQb2xpY3lOYW1lQ2FwdHVyZSB9KTtcblxuICAgICAgICAgIGV4cGVjdChzdGFjazFQb2xpY3lOYW1lQ2FwdHVyZS5hc1N0cmluZygpKS5ub3QudG9CZShzdGFjazJQb2xpY3lOYW1lQ2FwdHVyZS5hc1N0cmluZygpKTtcbiAgICAgICAgICBleHBlY3Qoc3RhY2sxUG9saWN5TmFtZUNhcHR1cmUuYXNTdHJpbmcoKSkudG9NYXRjaCgvUG9saWN5Um9sZVN0YWNrMUltcG9ydGVkUm9sZS4qLyk7XG4gICAgICAgICAgZXhwZWN0KHN0YWNrMlBvbGljeU5hbWVDYXB0dXJlLmFzU3RyaW5nKCkpLnRvTWF0Y2goL1BvbGljeVJvbGVTdGFjazJJbXBvcnRlZFJvbGUuKi8pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0ZXN0KCd0aGUgc2FtZSByb2xlIGltcG9ydGVkIGluIGRpZmZlcmVudCBzdGFja3MgaGFzIHRoZSBzYW1lIGRlZmF1bHQgcG9saWN5IG5hbWUgd2l0aG91dCBmbGFnJywgKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGFwcFdpdGhvdXRGZWF0dXJlRmxhZyA9IG5ldyBBcHAoeyBjb250ZXh0OiB7IFtJQU1fSU1QT1JURURfUk9MRV9TVEFDS19TQUZFX0RFRkFVTFRfUE9MSUNZX05BTUVdOiBmYWxzZSB9IH0pO1xuICAgICAgICAgIGNvbnN0IHJvbGVTdGFjazEgPSBuZXcgU3RhY2soYXBwV2l0aG91dEZlYXR1cmVGbGFnLCAnUm9sZVN0YWNrMScpO1xuICAgICAgICAgIGNvbnN0IGltcG9ydGVkUm9sZUluU3RhY2sxID0gUm9sZS5mcm9tUm9sZUFybihyb2xlU3RhY2sxLCAnSW1wb3J0ZWRSb2xlJyxcbiAgICAgICAgICAgIGBhcm46YXdzOmlhbTo6JHtyb2xlQWNjb3VudH06cm9sZS8ke3JvbGVOYW1lfWApO1xuICAgICAgICAgIGltcG9ydGVkUm9sZUluU3RhY2sxLmFkZFRvUHJpbmNpcGFsUG9saWN5KHNvbWVQb2xpY3lTdGF0ZW1lbnQoKSk7XG5cbiAgICAgICAgICBjb25zdCByb2xlU3RhY2syID0gbmV3IFN0YWNrKGFwcFdpdGhvdXRGZWF0dXJlRmxhZywgJ1JvbGVTdGFjazInKTtcbiAgICAgICAgICBjb25zdCBpbXBvcnRlZFJvbGVJblN0YWNrMiA9IFJvbGUuZnJvbVJvbGVBcm4ocm9sZVN0YWNrMiwgJ0ltcG9ydGVkUm9sZScsXG4gICAgICAgICAgICBgYXJuOmF3czppYW06OiR7cm9sZUFjY291bnR9OnJvbGUvJHtyb2xlTmFtZX1gKTtcbiAgICAgICAgICBpbXBvcnRlZFJvbGVJblN0YWNrMi5hZGRUb1ByaW5jaXBhbFBvbGljeShzb21lUG9saWN5U3RhdGVtZW50KCkpO1xuXG4gICAgICAgICAgY29uc3Qgc3RhY2sxUG9saWN5TmFtZUNhcHR1cmUgPSBuZXcgQ2FwdHVyZSgpO1xuICAgICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhyb2xlU3RhY2sxKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7IFBvbGljeU5hbWU6IHN0YWNrMVBvbGljeU5hbWVDYXB0dXJlIH0pO1xuXG4gICAgICAgICAgY29uc3Qgc3RhY2syUG9saWN5TmFtZUNhcHR1cmUgPSBuZXcgQ2FwdHVyZSgpO1xuICAgICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhyb2xlU3RhY2syKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7IFBvbGljeU5hbWU6IHN0YWNrMlBvbGljeU5hbWVDYXB0dXJlIH0pO1xuXG4gICAgICAgICAgZXhwZWN0KHN0YWNrMVBvbGljeU5hbWVDYXB0dXJlLmFzU3RyaW5nKCkpLnRvQmUoc3RhY2syUG9saWN5TmFtZUNhcHR1cmUuYXNTdHJpbmcoKSk7XG4gICAgICAgICAgZXhwZWN0KHN0YWNrMVBvbGljeU5hbWVDYXB0dXJlLmFzU3RyaW5nKCkpLnRvTWF0Y2goL0ltcG9ydGVkUm9sZVBvbGljeS57OH0vKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgZGVzY3JpYmUoJ3RoZW4gYXR0YWNoaW5nIGEgUG9saWN5IHRvIGl0JywgKCkgPT4ge1xuICAgICAgICBsZXQgcG9saWN5U3RhY2s6IFN0YWNrO1xuXG4gICAgICAgIGRlc2NyaWJlKCd0aGF0IGJlbG9uZ3MgdG8gdGhlIHNhbWUgc3RhY2sgYXMgdGhlIGltcG9ydGVkIHJvbGUnLCAoKSA9PiB7XG4gICAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgICAgICBpbXBvcnRlZFJvbGUuYXR0YWNoSW5saW5lUG9saWN5KHNvbWVQb2xpY3kocm9sZVN0YWNrLCAnTXlQb2xpY3knKSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB0ZXN0KCdjb3JyZWN0bHkgYXR0YWNoZXMgdGhlIFBvbGljeSB0byB0aGUgaW1wb3J0ZWQgcm9sZScsICgpID0+IHtcbiAgICAgICAgICAgIGFzc2VydFJvbGVIYXNBdHRhY2hlZFBvbGljeShyb2xlU3RhY2ssIHJvbGVOYW1lLCAnTXlQb2xpY3knKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZGVzY3JpYmUoJ3RoYXQgYmVsb25ncyB0byBhIGRpZmZlcmVudCBlbnYtYWdub3N0aWMgc3RhY2snLCAoKSA9PiB7XG4gICAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgICAgICBwb2xpY3lTdGFjayA9IG5ldyBTdGFjayhhcHAsICdQb2xpY3lTdGFjaycpO1xuICAgICAgICAgICAgaW1wb3J0ZWRSb2xlLmF0dGFjaElubGluZVBvbGljeShzb21lUG9saWN5KHBvbGljeVN0YWNrLCAnTXlQb2xpY3knKSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB0ZXN0KCdjb3JyZWN0bHkgYXR0YWNoZXMgdGhlIFBvbGljeSB0byB0aGUgaW1wb3J0ZWQgcm9sZScsICgpID0+IHtcbiAgICAgICAgICAgIGFzc2VydFJvbGVIYXNBdHRhY2hlZFBvbGljeShwb2xpY3lTdGFjaywgcm9sZU5hbWUsICdNeVBvbGljeScpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBkZXNjcmliZSgndGhhdCBiZWxvbmdzIHRvIGEgdGFyZ2V0ZWQgc3RhY2ssIHdpdGggYWNjb3VudCBzZXQgdG8nLCAoKSA9PiB7XG4gICAgICAgICAgZGVzY3JpYmUoJ3RoZSBzYW1lIGFjY291bnQgYXMgaW4gdGhlIEFSTiBvZiB0aGUgaW1wb3J0ZWQgcm9sZScsICgpID0+IHtcbiAgICAgICAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICAgICAgICBwb2xpY3lTdGFjayA9IG5ldyBTdGFjayhhcHAsICdQb2xpY3lTdGFjaycsIHsgZW52OiB7IGFjY291bnQ6IHJvbGVBY2NvdW50IH0gfSk7XG4gICAgICAgICAgICAgIGltcG9ydGVkUm9sZS5hdHRhY2hJbmxpbmVQb2xpY3koc29tZVBvbGljeShwb2xpY3lTdGFjaywgJ015UG9saWN5JykpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRlc3QoJ2NvcnJlY3RseSBhdHRhY2hlcyB0aGUgUG9saWN5IHRvIHRoZSBpbXBvcnRlZCByb2xlJywgKCkgPT4ge1xuICAgICAgICAgICAgICBhc3NlcnRSb2xlSGFzQXR0YWNoZWRQb2xpY3kocG9saWN5U3RhY2ssIHJvbGVOYW1lLCAnTXlQb2xpY3knKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgZGVzY3JpYmUoJ2EgZGlmZmVyZW50IGFjY291bnQgdGhhbiBpbiB0aGUgQVJOIG9mIHRoZSBpbXBvcnRlZCByb2xlJywgKCkgPT4ge1xuICAgICAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgICAgICAgIHBvbGljeVN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1BvbGljeVN0YWNrJywgeyBlbnY6IHsgYWNjb3VudDogbm90Um9sZUFjY291bnQgfSB9KTtcbiAgICAgICAgICAgICAgaW1wb3J0ZWRSb2xlLmF0dGFjaElubGluZVBvbGljeShzb21lUG9saWN5KHBvbGljeVN0YWNrLCAnTXlQb2xpY3knKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGVzdCgnZG9lcyBOT1QgYXR0YWNoIHRoZSBQb2xpY3kgdG8gdGhlIGltcG9ydGVkIHJvbGUnLCAoKSA9PiB7XG4gICAgICAgICAgICAgIGFzc2VydFBvbGljeURpZE5vdEF0dGFjaFRvUm9sZShwb2xpY3lTdGFjaywgJ015UG9saWN5Jyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdpbnRvIGEgdGFyZ2V0ZWQgc3RhY2sgd2l0aCBhY2NvdW50IHNldCB0bycsICgpID0+IHtcbiAgICAgIGRlc2NyaWJlKCd0aGUgc2FtZSBhY2NvdW50IGFzIGluIHRoZSBBUk4gdGhlIHJvbGUgd2FzIGltcG9ydGVkIHdpdGgnLCAoKSA9PiB7XG4gICAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICAgIHJvbGVTdGFjayA9IG5ldyBTdGFjayhhcHAsICdSb2xlU3RhY2snLCB7IGVudjogeyBhY2NvdW50OiByb2xlQWNjb3VudCB9IH0pO1xuICAgICAgICAgIGltcG9ydGVkUm9sZSA9IFJvbGUuZnJvbVJvbGVBcm4ocm9sZVN0YWNrLCAnSW1wb3J0ZWRSb2xlJyxcbiAgICAgICAgICAgIGBhcm46YXdzOmlhbTo6JHtyb2xlQWNjb3VudH06cm9sZS8ke3JvbGVOYW1lfWApO1xuICAgICAgICB9KTtcblxuICAgICAgICBkZXNjcmliZSgndGhlbiBhZGRpbmcgYSBQb2xpY3lTdGF0ZW1lbnQgdG8gaXQnLCAoKSA9PiB7XG4gICAgICAgICAgbGV0IGFkZFRvUG9saWN5UmVzdWx0OiBib29sZWFuO1xuXG4gICAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgICAgICBhZGRUb1BvbGljeVJlc3VsdCA9IGltcG9ydGVkUm9sZS5hZGRUb1BvbGljeShzb21lUG9saWN5U3RhdGVtZW50KCkpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgdGVzdCgncmV0dXJucyB0cnVlJywgKCkgPT4ge1xuICAgICAgICAgICAgZXhwZWN0KGFkZFRvUG9saWN5UmVzdWx0KS50b0JlKHRydWUpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgdGVzdChcImdlbmVyYXRlcyBhIGRlZmF1bHQgUG9saWN5IHJlc291cmNlIHBvaW50aW5nIGF0IHRoZSBpbXBvcnRlZCByb2xlJ3MgcGh5c2ljYWwgbmFtZVwiLCAoKSA9PiB7XG4gICAgICAgICAgICBhc3NlcnRSb2xlSGFzRGVmYXVsdFBvbGljeShyb2xlU3RhY2ssIHJvbGVOYW1lKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZGVzY3JpYmUoJ3RoZW4gYXR0YWNoaW5nIGEgUG9saWN5IHRvIGl0JywgKCkgPT4ge1xuICAgICAgICAgIGRlc2NyaWJlKCd0aGF0IGJlbG9uZ3MgdG8gdGhlIHNhbWUgc3RhY2sgYXMgdGhlIGltcG9ydGVkIHJvbGUnLCAoKSA9PiB7XG4gICAgICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgICAgICAgaW1wb3J0ZWRSb2xlLmF0dGFjaElubGluZVBvbGljeShzb21lUG9saWN5KHJvbGVTdGFjaywgJ015UG9saWN5JykpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRlc3QoJ2NvcnJlY3RseSBhdHRhY2hlcyB0aGUgUG9saWN5IHRvIHRoZSBpbXBvcnRlZCByb2xlJywgKCkgPT4ge1xuICAgICAgICAgICAgICBhc3NlcnRSb2xlSGFzQXR0YWNoZWRQb2xpY3kocm9sZVN0YWNrLCByb2xlTmFtZSwgJ015UG9saWN5Jyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGRlc2NyaWJlKCd0aGF0IGJlbG9uZ3MgdG8gYW4gZW52LWFnbm9zdGljIHN0YWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHBvbGljeVN0YWNrOiBTdGFjaztcblxuICAgICAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgICAgICAgIHBvbGljeVN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1BvbGljeVN0YWNrJyk7XG4gICAgICAgICAgICAgIGltcG9ydGVkUm9sZS5hdHRhY2hJbmxpbmVQb2xpY3koc29tZVBvbGljeShwb2xpY3lTdGFjaywgJ015UG9saWN5JykpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRlc3QoJ2NvcnJlY3RseSBhdHRhY2hlcyB0aGUgUG9saWN5IHRvIHRoZSBpbXBvcnRlZCByb2xlJywgKCkgPT4ge1xuICAgICAgICAgICAgICBhc3NlcnRSb2xlSGFzQXR0YWNoZWRQb2xpY3kocG9saWN5U3RhY2ssIHJvbGVOYW1lLCAnTXlQb2xpY3knKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgZGVzY3JpYmUoJ3RoYXQgYmVsb25ncyB0byBhIHRhcmdldGVkIHN0YWNrLCB3aXRoIGFjY291bnQgc2V0IHRvJywgKCkgPT4ge1xuICAgICAgICAgICAgbGV0IHBvbGljeVN0YWNrOiBTdGFjaztcblxuICAgICAgICAgICAgZGVzY3JpYmUoJ3RoZSBzYW1lIGFjY291bnQgYXMgaW4gdGhlIGltcG9ydGVkIHJvbGUgQVJOIGFuZCBpbiB0aGUgc3RhY2sgdGhlIGltcG9ydGVkIHJvbGUgYmVsb25ncyB0bycsICgpID0+IHtcbiAgICAgICAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgcG9saWN5U3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnUG9saWN5U3RhY2snLCB7IGVudjogeyBhY2NvdW50OiByb2xlQWNjb3VudCB9IH0pO1xuICAgICAgICAgICAgICAgIGltcG9ydGVkUm9sZS5hdHRhY2hJbmxpbmVQb2xpY3koc29tZVBvbGljeShwb2xpY3lTdGFjaywgJ015UG9saWN5JykpO1xuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICB0ZXN0KCdjb3JyZWN0bHkgYXR0YWNoZXMgdGhlIFBvbGljeSB0byB0aGUgaW1wb3J0ZWQgcm9sZScsICgpID0+IHtcbiAgICAgICAgICAgICAgICBhc3NlcnRSb2xlSGFzQXR0YWNoZWRQb2xpY3kocG9saWN5U3RhY2ssIHJvbGVOYW1lLCAnTXlQb2xpY3knKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZGVzY3JpYmUoJ2EgZGlmZmVyZW50IGFjY291bnQgdGhhbiBpbiB0aGUgaW1wb3J0ZWQgcm9sZSBBUk4gYW5kIGluIHRoZSBzdGFjayB0aGUgaW1wb3J0ZWQgcm9sZSBiZWxvbmdzIHRvJywgKCkgPT4ge1xuICAgICAgICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICBwb2xpY3lTdGFjayA9IG5ldyBTdGFjayhhcHAsICdQb2xpY3lTdGFjaycsIHsgZW52OiB7IGFjY291bnQ6IG5vdFJvbGVBY2NvdW50IH0gfSk7XG4gICAgICAgICAgICAgICAgaW1wb3J0ZWRSb2xlLmF0dGFjaElubGluZVBvbGljeShzb21lUG9saWN5KHBvbGljeVN0YWNrLCAnTXlQb2xpY3knKSk7XG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgIHRlc3QoJ2RvZXMgTk9UIGF0dGFjaCB0aGUgUG9saWN5IHRvIHRoZSBpbXBvcnRlZCByb2xlJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGFzc2VydFBvbGljeURpZE5vdEF0dGFjaFRvUm9sZShwb2xpY3lTdGFjaywgJ015UG9saWN5Jyk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIGRlc2NyaWJlKCdhIGRpZmZlcmVudCBhY2NvdW50IHRoYW4gaW4gdGhlIEFSTiB0aGUgcm9sZSB3YXMgaW1wb3J0ZWQgd2l0aCcsICgpID0+IHtcbiAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgICAgcm9sZVN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1JvbGVTdGFjaycsIHsgZW52OiB7IGFjY291bnQ6IG5vdFJvbGVBY2NvdW50IH0gfSk7XG4gICAgICAgICAgaW1wb3J0ZWRSb2xlID0gUm9sZS5mcm9tUm9sZUFybihyb2xlU3RhY2ssICdJbXBvcnRlZFJvbGUnLFxuICAgICAgICAgICAgYGFybjphd3M6aWFtOjoke3JvbGVBY2NvdW50fTpyb2xlLyR7cm9sZU5hbWV9YCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRlc2NyaWJlKCd0aGVuIGFkZGluZyBhIFBvbGljeVN0YXRlbWVudCB0byBpdCcsICgpID0+IHtcbiAgICAgICAgICBsZXQgYWRkVG9Qb2xpY3lSZXN1bHQ6IGJvb2xlYW47XG5cbiAgICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgICAgIGFkZFRvUG9saWN5UmVzdWx0ID0gaW1wb3J0ZWRSb2xlLmFkZFRvUG9saWN5KHNvbWVQb2xpY3lTdGF0ZW1lbnQoKSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB0ZXN0KCdwcmV0ZW5kcyB0byBzdWNjZWVkJywgKCkgPT4ge1xuICAgICAgICAgICAgZXhwZWN0KGFkZFRvUG9saWN5UmVzdWx0KS50b0JlKHRydWUpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgdGVzdChcImRvZXMgTk9UIGdlbmVyYXRlIGEgZGVmYXVsdCBQb2xpY3kgcmVzb3VyY2UgcG9pbnRpbmcgYXQgdGhlIGltcG9ydGVkIHJvbGUncyBwaHlzaWNhbCBuYW1lXCIsICgpID0+IHtcbiAgICAgICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhyb2xlU3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpJQU06OlBvbGljeScsIDApO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBkZXNjcmliZSgndGhlbiBhdHRhY2hpbmcgYSBQb2xpY3kgdG8gaXQnLCAoKSA9PiB7XG4gICAgICAgICAgZGVzY3JpYmUoJ3RoYXQgYmVsb25ncyB0byB0aGUgc2FtZSBzdGFjayBhcyB0aGUgaW1wb3J0ZWQgcm9sZScsICgpID0+IHtcbiAgICAgICAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICAgICAgICBpbXBvcnRlZFJvbGUuYXR0YWNoSW5saW5lUG9saWN5KHNvbWVQb2xpY3kocm9sZVN0YWNrLCAnTXlQb2xpY3knKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGVzdCgnZG9lcyBOT1QgYXR0YWNoIHRoZSBQb2xpY3kgdG8gdGhlIGltcG9ydGVkIHJvbGUnLCAoKSA9PiB7XG4gICAgICAgICAgICAgIGFzc2VydFBvbGljeURpZE5vdEF0dGFjaFRvUm9sZShyb2xlU3RhY2ssICdNeVBvbGljeScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBkZXNjcmliZSgndGhhdCBiZWxvbmdzIHRvIGFuIGVudi1hZ25vc3RpYyBzdGFjaycsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBwb2xpY3lTdGFjazogU3RhY2s7XG5cbiAgICAgICAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICAgICAgICBwb2xpY3lTdGFjayA9IG5ldyBTdGFjayhhcHAsICdQb2xpY3lTdGFjaycpO1xuICAgICAgICAgICAgICBpbXBvcnRlZFJvbGUuYXR0YWNoSW5saW5lUG9saWN5KHNvbWVQb2xpY3kocG9saWN5U3RhY2ssICdNeVBvbGljeScpKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0ZXN0KCdkb2VzIE5PVCBhdHRhY2ggdGhlIFBvbGljeSB0byB0aGUgaW1wb3J0ZWQgcm9sZScsICgpID0+IHtcbiAgICAgICAgICAgICAgYXNzZXJ0UG9saWN5RGlkTm90QXR0YWNoVG9Sb2xlKHBvbGljeVN0YWNrLCAnTXlQb2xpY3knKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgZGVzY3JpYmUoJ3RoYXQgYmVsb25ncyB0byBhIGRpZmZlcmVudCB0YXJnZXRlZCBzdGFjaywgd2l0aCBhY2NvdW50IHNldCB0bycsICgpID0+IHtcbiAgICAgICAgICAgIGxldCBwb2xpY3lTdGFjazogU3RhY2s7XG5cbiAgICAgICAgICAgIGRlc2NyaWJlKCd0aGUgc2FtZSBhY2NvdW50IGFzIGluIHRoZSBBUk4gb2YgdGhlIGltcG9ydGVkIHJvbGUnLCAoKSA9PiB7XG4gICAgICAgICAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICAgICAgICAgIHBvbGljeVN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1BvbGljeVN0YWNrJywgeyBlbnY6IHsgYWNjb3VudDogcm9sZUFjY291bnQgfSB9KTtcbiAgICAgICAgICAgICAgICBpbXBvcnRlZFJvbGUuYXR0YWNoSW5saW5lUG9saWN5KHNvbWVQb2xpY3kocG9saWN5U3RhY2ssICdNeVBvbGljeScpKTtcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgdGVzdCgnZG9lcyBOT1QgYXR0YWNoIHRoZSBQb2xpY3kgdG8gdGhlIGltcG9ydGVkIHJvbGUnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgYXNzZXJ0UG9saWN5RGlkTm90QXR0YWNoVG9Sb2xlKHBvbGljeVN0YWNrLCAnTXlQb2xpY3knKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZGVzY3JpYmUoJ3RoZSBzYW1lIGFjY291bnQgYXMgaW4gdGhlIHN0YWNrIHRoZSBpbXBvcnRlZCByb2xlIGJlbG9uZ3MgdG8nLCAoKSA9PiB7XG4gICAgICAgICAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICAgICAgICAgIHBvbGljeVN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1BvbGljeVN0YWNrJywgeyBlbnY6IHsgYWNjb3VudDogbm90Um9sZUFjY291bnQgfSB9KTtcbiAgICAgICAgICAgICAgICBpbXBvcnRlZFJvbGUuYXR0YWNoSW5saW5lUG9saWN5KHNvbWVQb2xpY3kocG9saWN5U3RhY2ssICdNeVBvbGljeScpKTtcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgdGVzdCgnZG9lcyBOT1QgYXR0YWNoIHRoZSBQb2xpY3kgdG8gdGhlIGltcG9ydGVkIHJvbGUnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgYXNzZXJ0UG9saWN5RGlkTm90QXR0YWNoVG9Sb2xlKHBvbGljeVN0YWNrLCAnTXlQb2xpY3knKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZGVzY3JpYmUoJ2EgdGhpcmQgYWNjb3VudCwgZGlmZmVyZW50IGZyb20gYm90aCB0aGUgcm9sZSBhbmQgc2NvcGUgc3RhY2sgYWNjb3VudHMnLCAoKSA9PiB7XG4gICAgICAgICAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICAgICAgICAgIHBvbGljeVN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1BvbGljeVN0YWNrJywgeyBlbnY6IHsgYWNjb3VudDogJ3NvbWUtcmFuZG9tLWFjY291bnQnIH0gfSk7XG4gICAgICAgICAgICAgICAgaW1wb3J0ZWRSb2xlLmF0dGFjaElubGluZVBvbGljeShzb21lUG9saWN5KHBvbGljeVN0YWNrLCAnTXlQb2xpY3knKSk7XG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgIHRlc3QoJ2RvZXMgTk9UIGF0dGFjaCB0aGUgUG9saWN5IHRvIHRoZSBpbXBvcnRlZCByb2xlJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGFzc2VydFBvbGljeURpZE5vdEF0dGFjaFRvUm9sZShwb2xpY3lTdGFjaywgJ015UG9saWN5Jyk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnYW5kIHdpdGggbXV0YWJsZT1mYWxzZScsICgpID0+IHtcbiAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICByb2xlU3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnUm9sZVN0YWNrJyk7XG4gICAgICAgIGltcG9ydGVkUm9sZSA9IFJvbGUuZnJvbVJvbGVBcm4ocm9sZVN0YWNrLCAnSW1wb3J0ZWRSb2xlJyxcbiAgICAgICAgICBgYXJuOmF3czppYW06OiR7cm9sZUFjY291bnR9OnJvbGUvJHtyb2xlTmFtZX1gLCB7IG11dGFibGU6IGZhbHNlIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIGRlc2NyaWJlKCd0aGVuIGFkZGluZyBhIFBvbGljeVN0YXRlbWVudCB0byBpdCcsICgpID0+IHtcbiAgICAgICAgbGV0IGFkZFRvUG9saWN5UmVzdWx0OiBib29sZWFuO1xuXG4gICAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICAgIGFkZFRvUG9saWN5UmVzdWx0ID0gaW1wb3J0ZWRSb2xlLmFkZFRvUG9saWN5KHNvbWVQb2xpY3lTdGF0ZW1lbnQoKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRlc3QoJ3ByZXRlbmRzIHRvIHN1Y2NlZWQnLCAoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KGFkZFRvUG9saWN5UmVzdWx0KS50b0JlKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0ZXN0KFwiZG9lcyBOT1QgZ2VuZXJhdGUgYSBkZWZhdWx0IFBvbGljeSByZXNvdXJjZSBwb2ludGluZyBhdCB0aGUgaW1wb3J0ZWQgcm9sZSdzIHBoeXNpY2FsIG5hbWVcIiwgKCkgPT4ge1xuICAgICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhyb2xlU3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpJQU06OlBvbGljeScsIDApO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBkZXNjcmliZSgndGhlbiBhdHRhY2hpbmcgYSBQb2xpY3kgdG8gaXQnLCAoKSA9PiB7XG4gICAgICAgIGxldCBwb2xpY3lTdGFjazogU3RhY2s7XG5cbiAgICAgICAgZGVzY3JpYmUoJ3RoYXQgYmVsb25ncyB0byBhIHN0YWNrIHdpdGggYWNjb3VudCBlcXVhbCB0byB0aGUgYWNjb3VudCBpbiB0aGUgaW1wb3J0ZWQgcm9sZSBBUk4nLCAoKSA9PiB7XG4gICAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgICAgICBwb2xpY3lTdGFjayA9IG5ldyBTdGFjayhhcHAsICdQb2xpY3lTdGFjaycsIHsgZW52OiB7IGFjY291bnQ6IHJvbGVBY2NvdW50IH0gfSk7XG4gICAgICAgICAgICBpbXBvcnRlZFJvbGUuYXR0YWNoSW5saW5lUG9saWN5KHNvbWVQb2xpY3kocG9saWN5U3RhY2ssICdNeVBvbGljeScpKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHRlc3QoJ2RvZXMgTk9UIGF0dGFjaCB0aGUgUG9saWN5IHRvIHRoZSBpbXBvcnRlZCByb2xlJywgKCkgPT4ge1xuICAgICAgICAgICAgYXNzZXJ0UG9saWN5RGlkTm90QXR0YWNoVG9Sb2xlKHBvbGljeVN0YWNrLCAnTXlQb2xpY3knKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdhbmQgd2l0aCBtdXRhYmxlPWZhbHNlIGFuZCBhZGRHcmFudHNUb1Jlc291cmNlcz10cnVlJywgKCkgPT4ge1xuICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgIHJvbGVTdGFjayA9IG5ldyBTdGFjayhhcHAsICdSb2xlU3RhY2snKTtcbiAgICAgICAgaW1wb3J0ZWRSb2xlID0gUm9sZS5mcm9tUm9sZUFybihyb2xlU3RhY2ssICdJbXBvcnRlZFJvbGUnLFxuICAgICAgICAgIGBhcm46YXdzOmlhbTo6JHtyb2xlQWNjb3VudH06cm9sZS8ke3JvbGVOYW1lfWAsIHsgbXV0YWJsZTogZmFsc2UsIGFkZEdyYW50c1RvUmVzb3VyY2VzOiB0cnVlIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIGRlc2NyaWJlKCd0aGVuIGFkZGluZyBhIFBvbGljeVN0YXRlbWVudCB0byBpdCcsICgpID0+IHtcbiAgICAgICAgbGV0IGFkZFRvUG9saWN5UmVzdWx0OiBib29sZWFuO1xuXG4gICAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICAgIGFkZFRvUG9saWN5UmVzdWx0ID0gaW1wb3J0ZWRSb2xlLmFkZFRvUG9saWN5KHNvbWVQb2xpY3lTdGF0ZW1lbnQoKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRlc3QoJ3ByZXRlbmRzIHRvIGZhaWwnLCAoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KGFkZFRvUG9saWN5UmVzdWx0KS50b0JlKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGVzdChcImRvZXMgTk9UIGdlbmVyYXRlIGEgZGVmYXVsdCBQb2xpY3kgcmVzb3VyY2UgcG9pbnRpbmcgYXQgdGhlIGltcG9ydGVkIHJvbGUncyBwaHlzaWNhbCBuYW1lXCIsICgpID0+IHtcbiAgICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2socm9sZVN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6SUFNOjpQb2xpY3knLCAwKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdpbXBvcnRlZCB3aXRoIGEgdXNlciBzcGVjaWZpZWQgZGVmYXVsdCBwb2xpY3kgbmFtZScsICgpID0+IHtcbiAgICAgIHRlc3QoJ3VzZXIgc3BlY2lmaWVkIGRlZmF1bHQgcG9saWN5IGlzIHVzZWQgd2hlbiBmcm9tUm9sZUFybigpIGNyZWF0ZXMgYSBkZWZhdWx0IHBvbGljeScsICgpID0+IHtcbiAgICAgICAgcm9sZVN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1JvbGVTdGFjaycpO1xuICAgICAgICBuZXcgQ2ZuUmVzb3VyY2Uocm9sZVN0YWNrLCAnU29tZVJlc291cmNlJywge1xuICAgICAgICAgIHR5cGU6ICdDREs6OlRlc3Q6OlNvbWVSZXNvdXJjZScsXG4gICAgICAgIH0pO1xuICAgICAgICBpbXBvcnRlZFJvbGUgPSBSb2xlLmZyb21Sb2xlQXJuKHJvbGVTdGFjaywgJ0ltcG9ydGVkUm9sZScsXG4gICAgICAgICAgYGFybjphd3M6aWFtOjoke3JvbGVBY2NvdW50fTpyb2xlLyR7cm9sZU5hbWV9YCwgeyBkZWZhdWx0UG9saWN5TmFtZTogJ1VzZXJTcGVjaWZpZWREZWZhdWx0UG9saWN5JyB9KTtcblxuICAgICAgICBHcmFudC5hZGRUb1ByaW5jaXBhbCh7XG4gICAgICAgICAgYWN0aW9uczogWydzZXJ2aWNlOkRvQVRoaW5nJ10sXG4gICAgICAgICAgZ3JhbnRlZTogaW1wb3J0ZWRSb2xlLFxuICAgICAgICAgIHJlc291cmNlQXJuczogWycqJ10sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhyb2xlU3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgICAgICBJbXBvcnRlZFJvbGVVc2VyU3BlY2lmaWVkRGVmYXVsdFBvbGljeTdDQkY2RTg1OiB7XG4gICAgICAgICAgICAgIFR5cGU6ICdBV1M6OklBTTo6UG9saWN5JyxcbiAgICAgICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgICAgIFBvbGljeU5hbWU6ICdJbXBvcnRlZFJvbGVVc2VyU3BlY2lmaWVkRGVmYXVsdFBvbGljeTdDQkY2RTg1JyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2Bmcm9tUm9sZU5hbWUoKWAgd2l0aCBvcHRpb25zIG1hdGNoZXMgYmVoYXZpb3Igb2YgYGZyb21Sb2xlQXJuKClgJywgKCkgPT4ge1xuICAgICAgcm9sZVN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1JvbGVTdGFjaycpO1xuICAgICAgbmV3IENmblJlc291cmNlKHJvbGVTdGFjaywgJ1NvbWVSZXNvdXJjZScsIHtcbiAgICAgICAgdHlwZTogJ0NESzo6VGVzdDo6U29tZVJlc291cmNlJyxcbiAgICAgIH0pO1xuICAgICAgaW1wb3J0ZWRSb2xlID0gUm9sZS5mcm9tUm9sZU5hbWUocm9sZVN0YWNrLCAnSW1wb3J0ZWRSb2xlJyxcbiAgICAgICAgYCR7cm9sZU5hbWV9YCwgeyBkZWZhdWx0UG9saWN5TmFtZTogJ1VzZXJTcGVjaWZpZWREZWZhdWx0UG9saWN5JyB9KTtcblxuICAgICAgR3JhbnQuYWRkVG9QcmluY2lwYWwoe1xuICAgICAgICBhY3Rpb25zOiBbJ3NlcnZpY2U6RG9BVGhpbmcnXSxcbiAgICAgICAgZ3JhbnRlZTogaW1wb3J0ZWRSb2xlLFxuICAgICAgICByZXNvdXJjZUFybnM6IFsnKiddLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhyb2xlU3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICAgIFJlc291cmNlczoge1xuICAgICAgICAgIEltcG9ydGVkUm9sZVVzZXJTcGVjaWZpZWREZWZhdWx0UG9saWN5N0NCRjZFODU6IHtcbiAgICAgICAgICAgIFR5cGU6ICdBV1M6OklBTTo6UG9saWN5JyxcbiAgICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgICAgUG9saWN5TmFtZTogJ0ltcG9ydGVkUm9sZVVzZXJTcGVjaWZpZWREZWZhdWx0UG9saWN5N0NCRjZFODUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdpbXBvcnRlZCB3aXRoIGEgZHluYW1pYyBBUk4nLCAoKSA9PiB7XG4gICAgY29uc3QgZHluYW1pY1ZhbHVlID0gTGF6eS5zdHJpbmcoeyBwcm9kdWNlOiAoKSA9PiAncm9sZS1hcm4nIH0pO1xuICAgIGNvbnN0IHJvbGVOYW1lOiBhbnkgPSB7XG4gICAgICAnRm46OlNlbGVjdCc6IFsxLFxuICAgICAgICB7XG4gICAgICAgICAgJ0ZuOjpTcGxpdCc6IFsnLycsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6U2VsZWN0JzogWzUsXG4gICAgICAgICAgICAgICAgeyAnRm46OlNwbGl0JzogWyc6JywgJ3JvbGUtYXJuJ10gfV0sXG4gICAgICAgICAgICB9XSxcbiAgICAgICAgfV0sXG4gICAgfTtcblxuICAgIGRlc2NyaWJlKCdpbnRvIGFuIGVudi1hZ25vc3RpYyBzdGFjaycsICgpID0+IHtcbiAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICByb2xlU3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnUm9sZVN0YWNrJyk7XG4gICAgICAgIGltcG9ydGVkUm9sZSA9IFJvbGUuZnJvbVJvbGVBcm4ocm9sZVN0YWNrLCAnSW1wb3J0ZWRSb2xlJywgZHluYW1pY1ZhbHVlKTtcbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KCdjb3JyZWN0bHkgcGFyc2VzIHRoZSBpbXBvcnRlZCByb2xlIEFSTicsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KGltcG9ydGVkUm9sZS5yb2xlQXJuKS50b0JlKGR5bmFtaWNWYWx1ZSk7XG4gICAgICB9KTtcblxuICAgICAgdGVzdCgnY29ycmVjdGx5IHBhcnNlcyB0aGUgaW1wb3J0ZWQgcm9sZSBuYW1lJywgKCkgPT4ge1xuICAgICAgICBuZXcgUm9sZShyb2xlU3RhY2ssICdBbnlSb2xlJywge1xuICAgICAgICAgIHJvbGVOYW1lOiAnQW55Um9sZScsXG4gICAgICAgICAgYXNzdW1lZEJ5OiBuZXcgQXJuUHJpbmNpcGFsKGltcG9ydGVkUm9sZS5yb2xlTmFtZSksXG4gICAgICAgIH0pO1xuXG4gICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhyb2xlU3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlJvbGUnLCB7XG4gICAgICAgICAgJ0Fzc3VtZVJvbGVQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgICAgICdTdGF0ZW1lbnQnOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnQWN0aW9uJzogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICAgICAnUHJpbmNpcGFsJzoge1xuICAgICAgICAgICAgICAgICAgJ0FXUyc6IHJvbGVOYW1lLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIGRlc2NyaWJlKCd0aGVuIGFkZGluZyBhIFBvbGljeVN0YXRlbWVudCB0byBpdCcsICgpID0+IHtcbiAgICAgICAgbGV0IGFkZFRvUG9saWN5UmVzdWx0OiBib29sZWFuO1xuXG4gICAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICAgIGFkZFRvUG9saWN5UmVzdWx0ID0gaW1wb3J0ZWRSb2xlLmFkZFRvUG9saWN5KHNvbWVQb2xpY3lTdGF0ZW1lbnQoKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRlc3QoJ3JldHVybnMgdHJ1ZScsICgpID0+IHtcbiAgICAgICAgICBleHBlY3QoYWRkVG9Qb2xpY3lSZXN1bHQpLnRvQmUodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRlc3QoXCJnZW5lcmF0ZXMgYSBkZWZhdWx0IFBvbGljeSByZXNvdXJjZSBwb2ludGluZyBhdCB0aGUgaW1wb3J0ZWQgcm9sZSdzIHBoeXNpY2FsIG5hbWVcIiwgKCkgPT4ge1xuICAgICAgICAgIGFzc2VydFJvbGVIYXNEZWZhdWx0UG9saWN5KHJvbGVTdGFjaywgcm9sZU5hbWUpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBkZXNjcmliZSgndGhlbiBhdHRhY2hpbmcgYSBQb2xpY3kgdG8gaXQnLCAoKSA9PiB7XG4gICAgICAgIGxldCBwb2xpY3lTdGFjazogU3RhY2s7XG5cbiAgICAgICAgZGVzY3JpYmUoJ3RoYXQgYmVsb25ncyB0byB0aGUgc2FtZSBzdGFjayBhcyB0aGUgaW1wb3J0ZWQgcm9sZScsICgpID0+IHtcbiAgICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgICAgIGltcG9ydGVkUm9sZS5hdHRhY2hJbmxpbmVQb2xpY3koc29tZVBvbGljeShyb2xlU3RhY2ssICdNeVBvbGljeScpKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHRlc3QoJ2NvcnJlY3RseSBhdHRhY2hlcyB0aGUgUG9saWN5IHRvIHRoZSBpbXBvcnRlZCByb2xlJywgKCkgPT4ge1xuICAgICAgICAgICAgYXNzZXJ0Um9sZUhhc0F0dGFjaGVkUG9saWN5KHJvbGVTdGFjaywgcm9sZU5hbWUsICdNeVBvbGljeScpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBkZXNjcmliZSgndGhhdCBiZWxvbmdzIHRvIGEgZGlmZmVyZW50IGVudi1hZ25vc3RpYyBzdGFjaycsICgpID0+IHtcbiAgICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgICAgIHBvbGljeVN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1BvbGljeVN0YWNrJyk7XG4gICAgICAgICAgICBpbXBvcnRlZFJvbGUuYXR0YWNoSW5saW5lUG9saWN5KHNvbWVQb2xpY3kocG9saWN5U3RhY2ssICdNeVBvbGljeScpKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHRlc3QoJ2NvcnJlY3RseSBhdHRhY2hlcyB0aGUgUG9saWN5IHRvIHRoZSBpbXBvcnRlZCByb2xlJywgKCkgPT4ge1xuICAgICAgICAgICAgYXNzZXJ0Um9sZUhhc0F0dGFjaGVkUG9saWN5KHBvbGljeVN0YWNrLCByb2xlTmFtZSwgJ015UG9saWN5Jyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRlc2NyaWJlKCd0aGF0IGJlbG9uZ3MgdG8gYSB0YXJnZXRlZCBzdGFjaycsICgpID0+IHtcbiAgICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgICAgIHBvbGljeVN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1BvbGljeVN0YWNrJywgeyBlbnY6IHsgYWNjb3VudDogcm9sZUFjY291bnQgfSB9KTtcbiAgICAgICAgICAgIGltcG9ydGVkUm9sZS5hdHRhY2hJbmxpbmVQb2xpY3koc29tZVBvbGljeShwb2xpY3lTdGFjaywgJ015UG9saWN5JykpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgdGVzdCgnY29ycmVjdGx5IGF0dGFjaGVzIHRoZSBQb2xpY3kgdG8gdGhlIGltcG9ydGVkIHJvbGUnLCAoKSA9PiB7XG4gICAgICAgICAgICBhc3NlcnRSb2xlSGFzQXR0YWNoZWRQb2xpY3kocG9saWN5U3RhY2ssIHJvbGVOYW1lLCAnTXlQb2xpY3knKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKCdpbnRvIGEgdGFyZ2V0ZWQgc3RhY2sgd2l0aCBhY2NvdW50IHNldCcsICgpID0+IHtcbiAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICByb2xlU3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnUm9sZVN0YWNrJywgeyBlbnY6IHsgYWNjb3VudDogcm9sZUFjY291bnQgfSB9KTtcbiAgICAgICAgaW1wb3J0ZWRSb2xlID0gUm9sZS5mcm9tUm9sZUFybihyb2xlU3RhY2ssICdJbXBvcnRlZFJvbGUnLCBkeW5hbWljVmFsdWUpO1xuICAgICAgfSk7XG5cbiAgICAgIGRlc2NyaWJlKCd0aGVuIGFkZGluZyBhIFBvbGljeVN0YXRlbWVudCB0byBpdCcsICgpID0+IHtcbiAgICAgICAgbGV0IGFkZFRvUG9saWN5UmVzdWx0OiBib29sZWFuO1xuXG4gICAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICAgIGFkZFRvUG9saWN5UmVzdWx0ID0gaW1wb3J0ZWRSb2xlLmFkZFRvUG9saWN5KHNvbWVQb2xpY3lTdGF0ZW1lbnQoKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRlc3QoJ3JldHVybnMgdHJ1ZScsICgpID0+IHtcbiAgICAgICAgICBleHBlY3QoYWRkVG9Qb2xpY3lSZXN1bHQpLnRvQmUodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRlc3QoXCJnZW5lcmF0ZXMgYSBkZWZhdWx0IFBvbGljeSByZXNvdXJjZSBwb2ludGluZyBhdCB0aGUgaW1wb3J0ZWQgcm9sZSdzIHBoeXNpY2FsIG5hbWVcIiwgKCkgPT4ge1xuICAgICAgICAgIGFzc2VydFJvbGVIYXNEZWZhdWx0UG9saWN5KHJvbGVTdGFjaywgcm9sZU5hbWUpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuXG4gICAgICBkZXNjcmliZSgndGhlbiBhdHRhY2hpbmcgYSBQb2xpY3kgdG8gaXQnLCAoKSA9PiB7XG4gICAgICAgIGxldCBwb2xpY3lTdGFjazogU3RhY2s7XG5cbiAgICAgICAgZGVzY3JpYmUoJ3RoYXQgYmVsb25ncyB0byB0aGUgc2FtZSBzdGFjayBhcyB0aGUgaW1wb3J0ZWQgcm9sZScsICgpID0+IHtcbiAgICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgICAgIGltcG9ydGVkUm9sZS5hdHRhY2hJbmxpbmVQb2xpY3koc29tZVBvbGljeShyb2xlU3RhY2ssICdNeVBvbGljeScpKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHRlc3QoJ2NvcnJlY3RseSBhdHRhY2hlcyB0aGUgUG9saWN5IHRvIHRoZSBpbXBvcnRlZCByb2xlJywgKCkgPT4ge1xuICAgICAgICAgICAgYXNzZXJ0Um9sZUhhc0F0dGFjaGVkUG9saWN5KHJvbGVTdGFjaywgcm9sZU5hbWUsICdNeVBvbGljeScpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBkZXNjcmliZSgndGhhdCBiZWxvbmdzIHRvIGFuIGVudi1hZ25vc3RpYyBzdGFjaycsICgpID0+IHtcbiAgICAgICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgICAgIHBvbGljeVN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1BvbGljeVN0YWNrJyk7XG4gICAgICAgICAgICBpbXBvcnRlZFJvbGUuYXR0YWNoSW5saW5lUG9saWN5KHNvbWVQb2xpY3kocG9saWN5U3RhY2ssICdNeVBvbGljeScpKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHRlc3QoJ2NvcnJlY3RseSBhdHRhY2hlcyB0aGUgUG9saWN5IHRvIHRoZSBpbXBvcnRlZCByb2xlJywgKCkgPT4ge1xuICAgICAgICAgICAgYXNzZXJ0Um9sZUhhc0F0dGFjaGVkUG9saWN5KHBvbGljeVN0YWNrLCByb2xlTmFtZSwgJ015UG9saWN5Jyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRlc2NyaWJlKCd0aGF0IGJlbG9uZ3MgdG8gYSBkaWZmZXJlbnQgdGFyZ2V0ZWQgc3RhY2ssIHdpdGggYWNjb3VudCBzZXQgdG8nLCAoKSA9PiB7XG4gICAgICAgICAgZGVzY3JpYmUoJ3RoZSBzYW1lIGFjY291bnQgYXMgdGhlIHN0YWNrIHRoZSByb2xlIHdhcyBpbXBvcnRlZCBpbnRvJywgKCkgPT4ge1xuICAgICAgICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgICAgICAgIHBvbGljeVN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1BvbGljeVN0YWNrJywgeyBlbnY6IHsgYWNjb3VudDogcm9sZUFjY291bnQgfSB9KTtcbiAgICAgICAgICAgICAgaW1wb3J0ZWRSb2xlLmF0dGFjaElubGluZVBvbGljeShzb21lUG9saWN5KHBvbGljeVN0YWNrLCAnTXlQb2xpY3knKSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGVzdCgnY29ycmVjdGx5IGF0dGFjaGVzIHRoZSBQb2xpY3kgdG8gdGhlIGltcG9ydGVkIHJvbGUnLCAoKSA9PiB7XG4gICAgICAgICAgICAgIGFzc2VydFJvbGVIYXNBdHRhY2hlZFBvbGljeShwb2xpY3lTdGFjaywgcm9sZU5hbWUsICdNeVBvbGljeScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBkZXNjcmliZSgnYSBkaWZmZXJlbnQgYWNjb3VudCB0aGFuIHRoZSBzdGFjayB0aGUgcm9sZSB3YXMgaW1wb3J0ZWQgaW50bycsICgpID0+IHtcbiAgICAgICAgICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgICAgICAgICBwb2xpY3lTdGFjayA9IG5ldyBTdGFjayhhcHAsICdQb2xpY3lTdGFjaycsIHsgZW52OiB7IGFjY291bnQ6IG5vdFJvbGVBY2NvdW50IH0gfSk7XG4gICAgICAgICAgICAgIGltcG9ydGVkUm9sZS5hdHRhY2hJbmxpbmVQb2xpY3koc29tZVBvbGljeShwb2xpY3lTdGFjaywgJ015UG9saWN5JykpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRlc3QoJ2NvcnJlY3RseSBhdHRhY2hlcyB0aGUgUG9saWN5IHRvIHRoZSBpbXBvcnRlZCByb2xlJywgKCkgPT4ge1xuICAgICAgICAgICAgICBhc3NlcnRSb2xlSGFzQXR0YWNoZWRQb2xpY3kocG9saWN5U3RhY2ssIHJvbGVOYW1lLCAnTXlQb2xpY3knKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnaW1wb3J0ZWQgd2l0aCB0aGUgQVJOIG9mIGEgc2VydmljZSByb2xlJywgKCkgPT4ge1xuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgcm9sZVN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnd2l0aG91dCBhIHNlcnZpY2UgcHJpbmNpcGFsIGluIHRoZSByb2xlIG5hbWUnLCAoKSA9PiB7XG4gICAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgICAgaW1wb3J0ZWRSb2xlID0gUm9sZS5mcm9tUm9sZUFybihyb2xlU3RhY2ssICdSb2xlJyxcbiAgICAgICAgICBgYXJuOmF3czppYW06OiR7cm9sZUFjY291bnR9OnJvbGUvc2VydmljZS1yb2xlL2NvZGVidWlsZC1yb2xlYCk7XG4gICAgICB9KTtcblxuICAgICAgaXQoXCJjb3JyZWN0bHkgc3RyaXBzIHRoZSAnc2VydmljZS1yb2xlJyBwcmVmaXggZnJvbSB0aGUgcm9sZSBuYW1lXCIsICgpID0+IHtcbiAgICAgICAgbmV3IFBvbGljeShyb2xlU3RhY2ssICdQb2xpY3knLCB7XG4gICAgICAgICAgc3RhdGVtZW50czogW3NvbWVQb2xpY3lTdGF0ZW1lbnQoKV0sXG4gICAgICAgICAgcm9sZXM6IFtpbXBvcnRlZFJvbGVdLFxuICAgICAgICB9KTtcblxuICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2socm9sZVN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICAgICAgJ1JvbGVzJzogW1xuICAgICAgICAgICAgJ2NvZGVidWlsZC1yb2xlJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoJ3dpdGggYSBzZXJ2aWNlIHByaW5jaXBhbCBpbiB0aGUgcm9sZSBuYW1lJywgKCkgPT4ge1xuICAgICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICAgIGltcG9ydGVkUm9sZSA9IFJvbGUuZnJvbVJvbGVBcm4ocm9sZVN0YWNrLCAnUm9sZScsXG4gICAgICAgICAgYGFybjphd3M6aWFtOjoke3JvbGVBY2NvdW50fTpyb2xlL2F3cy1zZXJ2aWNlLXJvbGUvYW55c2VydmljZS5hbWF6b25hd3MuY29tL2NvZGVidWlsZC1yb2xlYCk7XG4gICAgICB9KTtcblxuICAgICAgaXQoXCJjb3JyZWN0bHkgc3RyaXBzIGJvdGggdGhlICdhd3Mtc2VydmljZS1yb2xlJyBwcmVmaXggYW5kIHRoZSBzZXJ2aWNlIHByaW5jaXBhbCBmcm9tIHRoZSByb2xlIG5hbWVcIiwgKCkgPT4ge1xuICAgICAgICBuZXcgUG9saWN5KHJvbGVTdGFjaywgJ1BvbGljeScsIHtcbiAgICAgICAgICBzdGF0ZW1lbnRzOiBbc29tZVBvbGljeVN0YXRlbWVudCgpXSxcbiAgICAgICAgICByb2xlczogW2ltcG9ydGVkUm9sZV0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhyb2xlU3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgICAgICAnUm9sZXMnOiBbXG4gICAgICAgICAgICAnY29kZWJ1aWxkLXJvbGUnLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdmb3IgYW4gaW5jb3JyZWN0IEFSTicsICgpID0+IHtcbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIHJvbGVTdGFjayA9IG5ldyBTdGFjayhhcHAsICdSb2xlU3RhY2snKTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwidGhhdCBhY2NpZGVudGFsbHkgc2tpcHBlZCB0aGUgJ3JlZ2lvbicgZnJhZ21lbnQgb2YgdGhlIEFSTlwiLCAoKSA9PiB7XG4gICAgICB0ZXN0KCd0aHJvd3MgYW4gZXhjZXB0aW9uLCBpbmRpY2F0aW5nIHRoYXQgZXJyb3InLCAoKSA9PiB7XG4gICAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgICAgUm9sZS5mcm9tUm9sZUFybihyb2xlU3RhY2ssICdSb2xlJyxcbiAgICAgICAgICAgIGBhcm46JHtBd3MuUEFSVElUSU9OfTppYW06JHtBd3MuQUNDT1VOVF9JRH06cm9sZS9Bd3NDaWNkLSR7QXdzLlJFR0lPTn0tQ29kZUJ1aWxkUm9sZWApO1xuICAgICAgICB9KS50b1Rocm93KC9UaGUgYHJlc291cmNlYCBjb21wb25lbnQgXFwoNnRoIGNvbXBvbmVudFxcKSBvZiBhbiBBUk4gaXMgcmVxdWlyZWQ6Lyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcblxudGVzdCgnUm9sZS5mcm9tUm9sZU5hbWUgd2l0aCBubyBvcHRpb25zICcsICgpID0+IHtcbiAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdTdGFjaycsIHsgZW52OiB7IHJlZ2lvbjogJ2FzZGYnLCBhY2NvdW50OiAnMTIzNCcgfSB9KTtcbiAgY29uc3Qgcm9sZSA9IFJvbGUuZnJvbVJvbGVOYW1lKHN0YWNrLCAnTXlSb2xlJywgJ015Um9sZScpO1xuXG4gIGV4cGVjdChzdGFjay5yZXNvbHZlKHJvbGUucm9sZUFybikpLnRvRXF1YWwoeyAnRm46OkpvaW4nOiBbJycsIFsnYXJuOicsIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sICc6aWFtOjoxMjM0OnJvbGUvTXlSb2xlJ11dIH0pO1xufSk7XG5cbmZ1bmN0aW9uIHNvbWVQb2xpY3lTdGF0ZW1lbnQoKSB7XG4gIHJldHVybiBuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICBhY3Rpb25zOiBbJ3MzOionXSxcbiAgICByZXNvdXJjZXM6IFsneHl6J10sXG4gIH0pO1xufVxuXG5mdW5jdGlvbiBzb21lUG9saWN5KHBvbGljeVN0YWNrOiBTdGFjaywgcG9saWN5TmFtZTogc3RyaW5nKSB7XG4gIGNvbnN0IHNvbWVSb2xlID0gbmV3IFJvbGUocG9saWN5U3RhY2ssICdTb21lRXhhbXBsZVJvbGUnLCB7XG4gICAgYXNzdW1lZEJ5OiBuZXcgQW55UHJpbmNpcGFsKCksXG4gIH0pO1xuICBjb25zdCByb2xlUmVzb3VyY2UgPSBzb21lUm9sZS5ub2RlLmRlZmF1bHRDaGlsZCBhcyBDZm5FbGVtZW50O1xuICByb2xlUmVzb3VyY2Uub3ZlcnJpZGVMb2dpY2FsSWQoJ1NvbWVSb2xlJyk7IC8vIGZvcmNlIGEgcGFydGljdWxhciBsb2dpY2FsIElEIGluIHRoZSBSZWYgZXhwcmVzc2lvblxuXG4gIHJldHVybiBuZXcgUG9saWN5KHBvbGljeVN0YWNrLCAnTXlQb2xpY3knLCB7XG4gICAgcG9saWN5TmFtZSxcbiAgICBzdGF0ZW1lbnRzOiBbc29tZVBvbGljeVN0YXRlbWVudCgpXSxcbiAgICAvLyBuZWVkIGF0IGxlYXN0IG9uZSBvZiB1c2VyL2dyb3VwL3JvbGUsIG90aGVyd2lzZSB2YWxpZGF0aW9uIGZhaWxzXG4gICAgcm9sZXM6IFtzb21lUm9sZV0sXG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhc3NlcnRSb2xlSGFzRGVmYXVsdFBvbGljeShzdGFjazogU3RhY2ssIHJvbGVOYW1lOiBzdHJpbmcpIHtcbiAgX2Fzc2VydFN0YWNrQ29udGFpbnNQb2xpY3lSZXNvdXJjZShzdGFjaywgW3JvbGVOYW1lXSwgdW5kZWZpbmVkKTtcbn1cblxuZnVuY3Rpb24gYXNzZXJ0Um9sZUhhc0F0dGFjaGVkUG9saWN5KHN0YWNrOiBTdGFjaywgcm9sZU5hbWU6IHN0cmluZywgYXR0YWNoZWRQb2xpY3lOYW1lOiBzdHJpbmcpIHtcbiAgX2Fzc2VydFN0YWNrQ29udGFpbnNQb2xpY3lSZXNvdXJjZShzdGFjaywgW3sgUmVmOiAnU29tZVJvbGUnIH0sIHJvbGVOYW1lXSwgYXR0YWNoZWRQb2xpY3lOYW1lKTtcbn1cblxuZnVuY3Rpb24gYXNzZXJ0UG9saWN5RGlkTm90QXR0YWNoVG9Sb2xlKHN0YWNrOiBTdGFjaywgcG9saWN5TmFtZTogc3RyaW5nKSB7XG4gIF9hc3NlcnRTdGFja0NvbnRhaW5zUG9saWN5UmVzb3VyY2Uoc3RhY2ssIFt7IFJlZjogJ1NvbWVSb2xlJyB9XSwgcG9saWN5TmFtZSk7XG59XG5cbmZ1bmN0aW9uIF9hc3NlcnRTdGFja0NvbnRhaW5zUG9saWN5UmVzb3VyY2Uoc3RhY2s6IFN0YWNrLCByb2xlTmFtZXM6IGFueVtdLCBuYW1lT2ZQb2xpY3k6IHN0cmluZyB8IHVuZGVmaW5lZCkge1xuICBjb25zdCBleHBlY3RlZDogYW55ID0ge1xuICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAge1xuICAgICAgICAgIEFjdGlvbjogJ3MzOionLFxuICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICBSZXNvdXJjZTogJ3h5eicsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gICAgUm9sZXM6IHJvbGVOYW1lcyxcbiAgfTtcbiAgaWYgKG5hbWVPZlBvbGljeSkge1xuICAgIGV4cGVjdGVkLlBvbGljeU5hbWUgPSBuYW1lT2ZQb2xpY3k7XG4gIH1cblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIGV4cGVjdGVkKTtcbn1cbiJdfQ==