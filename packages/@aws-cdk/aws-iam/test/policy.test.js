"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
/* eslint-disable quote-props */
describe('IAM policy', () => {
    let app;
    let stack;
    beforeEach(() => {
        app = new core_1.App();
        stack = new core_1.Stack(app, 'MyStack');
    });
    test('fails when "forced" policy is empty', () => {
        new lib_1.Policy(stack, 'MyPolicy', { force: true });
        expect(() => app.synth()).toThrow(/is empty/);
    });
    test('policy with statements', () => {
        const policy = new lib_1.Policy(stack, 'MyPolicy', { policyName: 'MyPolicyName' });
        policy.addStatements(new lib_1.PolicyStatement({ resources: ['*'], actions: ['sqs:SendMessage'] }));
        policy.addStatements(new lib_1.PolicyStatement({ resources: ['arn'], actions: ['sns:Subscribe'] }));
        const group = new lib_1.Group(stack, 'MyGroup');
        group.attachInlinePolicy(policy);
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                MyPolicy39D66CF6: {
                    Type: 'AWS::IAM::Policy',
                    Properties: {
                        Groups: [{ Ref: 'MyGroupCBA54B1B' }],
                        PolicyDocument: {
                            Statement: [{ Action: 'sqs:SendMessage', Effect: 'Allow', Resource: '*' },
                                { Action: 'sns:Subscribe', Effect: 'Allow', Resource: 'arn' }],
                            Version: '2012-10-17',
                        },
                        PolicyName: 'MyPolicyName',
                    },
                },
                MyGroupCBA54B1B: { Type: 'AWS::IAM::Group' },
            },
        });
    });
    test('policy from policy document alone', () => {
        const policy = new lib_1.Policy(stack, 'MyPolicy', {
            policyName: 'MyPolicyName',
            document: lib_1.PolicyDocument.fromJson({
                Statement: [
                    {
                        Action: 'sqs:SendMessage',
                        Effect: 'Allow',
                        Resource: '*',
                    },
                ],
            }),
        });
        const group = new lib_1.Group(stack, 'MyGroup');
        group.attachInlinePolicy(policy);
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                MyPolicy39D66CF6: {
                    Type: 'AWS::IAM::Policy',
                    Properties: {
                        PolicyName: 'MyPolicyName',
                        Groups: [{ Ref: 'MyGroupCBA54B1B' }],
                        PolicyDocument: {
                            Statement: [
                                { Action: 'sqs:SendMessage', Effect: 'Allow', Resource: '*' },
                            ],
                            Version: '2012-10-17',
                        },
                    },
                },
                MyGroupCBA54B1B: { Type: 'AWS::IAM::Group' },
            },
        });
    });
    test('policy name can be omitted, in which case the logical id will be used', () => {
        const policy = new lib_1.Policy(stack, 'MyPolicy');
        policy.addStatements(new lib_1.PolicyStatement({ resources: ['*'], actions: ['sqs:SendMessage'] }));
        policy.addStatements(new lib_1.PolicyStatement({ resources: ['arn'], actions: ['sns:Subscribe'] }));
        const user = new lib_1.User(stack, 'MyUser');
        user.attachInlinePolicy(policy);
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                MyPolicy39D66CF6: {
                    Type: 'AWS::IAM::Policy',
                    Properties: {
                        PolicyDocument: {
                            Statement: [{ Action: 'sqs:SendMessage', Effect: 'Allow', Resource: '*' },
                                { Action: 'sns:Subscribe', Effect: 'Allow', Resource: 'arn' }],
                            Version: '2012-10-17',
                        },
                        PolicyName: 'MyPolicy39D66CF6',
                        Users: [{ Ref: 'MyUserDC45028B' }],
                    },
                },
                MyUserDC45028B: { Type: 'AWS::IAM::User' },
            },
        });
    });
    test('policy can be attached users, groups and roles and added permissions via props', () => {
        const user1 = new lib_1.User(stack, 'User1');
        const group1 = new lib_1.Group(stack, 'Group1');
        const role1 = new lib_1.Role(stack, 'Role1', {
            assumedBy: new lib_1.ServicePrincipal('test.service'),
        });
        new lib_1.Policy(stack, 'MyTestPolicy', {
            policyName: 'Foo',
            users: [user1],
            groups: [group1],
            roles: [role1],
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
                MyTestPolicy316BDB50: {
                    Type: 'AWS::IAM::Policy',
                    Properties: {
                        Groups: [{ Ref: 'Group1BEBD4686' }],
                        PolicyDocument: {
                            Statement: [{ Action: 'dynamodb:PutItem', Effect: 'Allow', Resource: '*' }],
                            Version: '2012-10-17',
                        },
                        PolicyName: 'Foo',
                        Roles: [{ Ref: 'Role13A5C70C1' }],
                        Users: [{ Ref: 'User1E278A736' }],
                    },
                },
            },
        });
    });
    test('idempotent if a principal (user/group/role) is attached twice', () => {
        const p = new lib_1.Policy(stack, 'MyPolicy');
        p.addStatements(new lib_1.PolicyStatement({ actions: ['*'], resources: ['*'] }));
        const user = new lib_1.User(stack, 'MyUser');
        p.attachToUser(user);
        p.attachToUser(user);
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                MyPolicy39D66CF6: {
                    Type: 'AWS::IAM::Policy',
                    Properties: {
                        PolicyDocument: {
                            Statement: [{ Action: '*', Effect: 'Allow', Resource: '*' }],
                            Version: '2012-10-17',
                        },
                        PolicyName: 'MyPolicy39D66CF6',
                        Users: [{ Ref: 'MyUserDC45028B' }],
                    },
                },
                MyUserDC45028B: { Type: 'AWS::IAM::User' },
            },
        });
    });
    test('users, groups, roles and permissions can be added using methods', () => {
        const p = new lib_1.Policy(stack, 'MyTestPolicy', {
            policyName: 'Foo',
        });
        p.attachToUser(new lib_1.User(stack, 'User1'));
        p.attachToUser(new lib_1.User(stack, 'User2'));
        p.attachToGroup(new lib_1.Group(stack, 'Group1'));
        p.attachToRole(new lib_1.Role(stack, 'Role1', { assumedBy: new lib_1.ServicePrincipal('test.service') }));
        p.addStatements(new lib_1.PolicyStatement({ resources: ['*'], actions: ['dynamodb:GetItem'] }));
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                MyTestPolicy316BDB50: {
                    Type: 'AWS::IAM::Policy',
                    Properties: {
                        Groups: [{ Ref: 'Group1BEBD4686' }],
                        PolicyDocument: {
                            Statement: [{ Action: 'dynamodb:GetItem', Effect: 'Allow', Resource: '*' }],
                            Version: '2012-10-17',
                        },
                        PolicyName: 'Foo',
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
        const policy = new lib_1.Policy(stack, 'MyPolicy');
        const user = new lib_1.User(stack, 'MyUser');
        const group = new lib_1.Group(stack, 'MyGroup');
        const role = new lib_1.Role(stack, 'MyRole', { assumedBy: new lib_1.ServicePrincipal('test.service') });
        user.attachInlinePolicy(policy);
        group.attachInlinePolicy(policy);
        role.attachInlinePolicy(policy);
        policy.addStatements(new lib_1.PolicyStatement({ resources: ['*'], actions: ['*'] }));
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                MyPolicy39D66CF6: {
                    Type: 'AWS::IAM::Policy',
                    Properties: {
                        Groups: [{ Ref: 'MyGroupCBA54B1B' }],
                        PolicyDocument: {
                            Statement: [{ Action: '*', Effect: 'Allow', Resource: '*' }],
                            Version: '2012-10-17',
                        },
                        PolicyName: 'MyPolicy39D66CF6',
                        Roles: [{ Ref: 'MyRoleF48FFE04' }],
                        Users: [{ Ref: 'MyUserDC45028B' }],
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
    test('fails if policy name is not unique within a user/group/role', () => {
        // create two policies named Foo and attach them both to the same user/group/role
        const p1 = new lib_1.Policy(stack, 'P1', { policyName: 'Foo' });
        const p2 = new lib_1.Policy(stack, 'P2', { policyName: 'Foo' });
        const p3 = new lib_1.Policy(stack, 'P3'); // uses logicalID as name
        const user = new lib_1.User(stack, 'MyUser');
        const group = new lib_1.Group(stack, 'MyGroup');
        const role = new lib_1.Role(stack, 'MyRole', { assumedBy: new lib_1.ServicePrincipal('sns.amazonaws.com') });
        p1.attachToUser(user);
        p1.attachToGroup(group);
        p1.attachToRole(role);
        // try to attach p2 to all of these and expect to fail
        expect(() => p2.attachToUser(user)).toThrow(/A policy named "Foo" is already attached/);
        expect(() => p2.attachToGroup(group)).toThrow(/A policy named "Foo" is already attached/);
        expect(() => p2.attachToRole(role)).toThrow(/A policy named "Foo" is already attached/);
        p3.attachToUser(user);
        p3.attachToGroup(group);
        p3.attachToRole(role);
    });
    test('fails if "forced" policy is not attached to a principal', () => {
        new lib_1.Policy(stack, 'MyPolicy', { force: true });
        expect(() => app.synth()).toThrow(/attached to at least one principal: user, group or role/);
    });
    test("generated policy name is the same as the logical id if it's shorter than 128 characters", () => {
        createPolicyWithLogicalId(stack, 'Foo');
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            'PolicyName': 'Foo',
        });
    });
    test('generated policy name only uses the last 128 characters of the logical id', () => {
        const logicalId128 = 'a' + dup(128 - 2) + 'a';
        const logicalIdOver128 = 'PREFIX' + logicalId128;
        createPolicyWithLogicalId(stack, logicalIdOver128);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            'PolicyName': logicalId128,
        });
        function dup(count) {
            let r = '';
            for (let i = 0; i < count; ++i) {
                r += 'x';
            }
            return r;
        }
    });
    test('force=false, dependency on empty Policy never materializes', () => {
        // GIVEN
        const pol = new lib_1.Policy(stack, 'Pol', { force: false });
        const res = new core_1.CfnResource(stack, 'Resource', {
            type: 'Some::Resource',
        });
        // WHEN
        res.node.addDependency(pol);
        // THEN
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                Resource: {
                    Type: 'Some::Resource',
                },
            },
        });
    });
    test('force=false, dependency on attached and non-empty Policy can be taken', () => {
        // GIVEN
        const pol = new lib_1.Policy(stack, 'Pol', { force: false });
        pol.addStatements(new lib_1.PolicyStatement({
            actions: ['s3:*'],
            resources: ['*'],
        }));
        pol.attachToUser(new lib_1.User(stack, 'User'));
        const res = new core_1.CfnResource(stack, 'Resource', {
            type: 'Some::Resource',
        });
        // WHEN
        res.node.addDependency(pol);
        // THEN
        assertions_1.Template.fromStack(stack).hasResource('Some::Resource', {
            Type: 'Some::Resource',
            DependsOn: ['Pol0FE9AD5D'],
        });
    });
    test('empty policy is OK if force=false', () => {
        new lib_1.Policy(stack, 'Pol', { force: false });
        app.synth();
        // If we got here, all OK
    });
    test('reading policyName forces a Policy to materialize', () => {
        const pol = new lib_1.Policy(stack, 'Pol', { force: false });
        Array.isArray(pol.policyName);
        expect(() => app.synth()).toThrow(/must contain at least one statement/);
    });
    test('fails if policy document is invalid', () => {
        new lib_1.Policy(stack, 'MyRole', {
            statements: [new lib_1.PolicyStatement({
                    actions: ['*'],
                    principals: [new lib_1.ServicePrincipal('test.service')],
                })],
        });
        expect(() => app.synth()).toThrow(/A PolicyStatement used in an identity-based policy cannot specify any IAM principals/);
    });
    test('Policies can be granted principal permissions', () => {
        const pol = new lib_1.Policy(stack, 'Policy', {
            policyName: 'MyPolicyName',
        });
        lib_1.Grant.addToPrincipal({ actions: ['dummy:Action'], grantee: pol, resourceArns: ['*'] });
        pol.attachToUser(new lib_1.User(stack, 'User'));
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyName: 'MyPolicyName',
            PolicyDocument: {
                Statement: [
                    { Action: 'dummy:Action', Effect: 'Allow', Resource: '*' },
                ],
                Version: '2012-10-17',
            },
        });
    });
    test('addPrincipalOrResource() correctly grants Policies permissions', () => {
        const pol = new lib_1.Policy(stack, 'Policy', {
            policyName: 'MyPolicyName',
        });
        pol.attachToUser(new lib_1.User(stack, 'User'));
        class DummyResource extends core_1.Resource {
            addToResourcePolicy(_statement) {
                throw new Error('should not be called.');
            }
        }
        ;
        const resource = new DummyResource(stack, 'Dummy');
        lib_1.Grant.addToPrincipalOrResource({ actions: ['dummy:Action'], grantee: pol, resource, resourceArns: ['*'] });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyName: 'MyPolicyName',
            PolicyDocument: {
                Statement: [
                    { Action: 'dummy:Action', Effect: 'Allow', Resource: '*' },
                ],
                Version: '2012-10-17',
            },
        });
    });
    test('Policies cannot be granted principal permissions across accounts', () => {
        const pol = new lib_1.Policy(stack, 'Policy', {
            policyName: 'MyPolicyName',
        });
        class DummyResource extends core_1.Resource {
            addToResourcePolicy(_statement) {
                throw new Error('should not be called.');
            }
        }
        ;
        const resource = new DummyResource(stack, 'Dummy', { account: '5678' });
        expect(() => {
            lib_1.Grant.addToPrincipalOrResource({ actions: ['dummy:Action'], grantee: pol, resourceArns: ['*'], resource });
        }).toThrow(/Cannot use a Policy 'MyStack\/Policy'/);
    });
    test('Policies cannot be granted resource permissions', () => {
        const pol = new lib_1.Policy(stack, 'Policy', {
            policyName: 'MyPolicyName',
        });
        class DummyResource extends core_1.Resource {
            addToResourcePolicy(_statement) {
                throw new Error('should not be called.');
            }
        }
        ;
        const resource = new DummyResource(stack, 'Dummy');
        expect(() => {
            lib_1.Grant.addToPrincipalAndResource({ actions: ['dummy:Action'], grantee: pol, resourceArns: ['*'], resource });
        }).toThrow(/Cannot use a Policy 'MyStack\/Policy'/);
    });
});
function createPolicyWithLogicalId(stack, logicalId) {
    const policy = new lib_1.Policy(stack, logicalId);
    const cfnPolicy = policy.node.defaultChild;
    cfnPolicy.overrideLogicalId(logicalId); // force a particular logical ID
    // add statements & principal to satisfy validation
    policy.addStatements(new lib_1.PolicyStatement({
        actions: ['*'],
        resources: ['*'],
    }));
    policy.attachToRole(new lib_1.Role(stack, 'Role', { assumedBy: new lib_1.AnyPrincipal() }));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9saWN5LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwb2xpY3kudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyx3Q0FBa0U7QUFDbEUsZ0NBQXVMO0FBRXZMLGdDQUFnQztBQUVoQyxRQUFRLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRTtJQUMxQixJQUFJLEdBQVEsQ0FBQztJQUNiLElBQUksS0FBWSxDQUFDO0lBRWpCLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZCxHQUFHLEdBQUcsSUFBSSxVQUFHLEVBQUUsQ0FBQztRQUNoQixLQUFLLEdBQUcsSUFBSSxZQUFLLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3BDLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHFDQUFxQyxFQUFFLEdBQUcsRUFBRTtRQUMvQyxJQUFJLFlBQU0sQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFFL0MsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNoRCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx3QkFBd0IsRUFBRSxHQUFHLEVBQUU7UUFDbEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxZQUFNLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxFQUFFLFVBQVUsRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFDO1FBQzdFLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxxQkFBZSxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsaUJBQWlCLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM5RixNQUFNLENBQUMsYUFBYSxDQUFDLElBQUkscUJBQWUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRTlGLE1BQU0sS0FBSyxHQUFHLElBQUksV0FBSyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztRQUMxQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFakMscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsZUFBZSxDQUFDO1lBQ3hDLFNBQVMsRUFDVDtnQkFDRSxnQkFBZ0IsRUFDZjtvQkFDRSxJQUFJLEVBQUUsa0JBQWtCO29CQUN4QixVQUFVLEVBQ1g7d0JBQ0UsTUFBTSxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQzt3QkFDcEMsY0FBYyxFQUNmOzRCQUNFLFNBQVMsRUFDVixDQUFDLEVBQUUsTUFBTSxFQUFFLGlCQUFpQixFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRTtnQ0FDNUQsRUFBRSxNQUFNLEVBQUUsZUFBZSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxDQUFDOzRCQUMvRCxPQUFPLEVBQUUsWUFBWTt5QkFDdEI7d0JBQ0EsVUFBVSxFQUFFLGNBQWM7cUJBQzNCO2lCQUNEO2dCQUNGLGVBQWUsRUFBRSxFQUFFLElBQUksRUFBRSxpQkFBaUIsRUFBRTthQUM3QztTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLG1DQUFtQyxFQUFFLEdBQUcsRUFBRTtRQUM3QyxNQUFNLE1BQU0sR0FBRyxJQUFJLFlBQU0sQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFO1lBQzNDLFVBQVUsRUFBRSxjQUFjO1lBQzFCLFFBQVEsRUFBRSxvQkFBYyxDQUFDLFFBQVEsQ0FBQztnQkFDaEMsU0FBUyxFQUFFO29CQUNUO3dCQUNFLE1BQU0sRUFBRSxpQkFBaUI7d0JBQ3pCLE1BQU0sRUFBRSxPQUFPO3dCQUNmLFFBQVEsRUFBRSxHQUFHO3FCQUNkO2lCQUNGO2FBQ0YsQ0FBQztTQUNILENBQUMsQ0FBQztRQUVILE1BQU0sS0FBSyxHQUFHLElBQUksV0FBSyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztRQUMxQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFakMscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsZUFBZSxDQUFDO1lBQ3hDLFNBQVMsRUFBRTtnQkFDVCxnQkFBZ0IsRUFBRTtvQkFDaEIsSUFBSSxFQUFFLGtCQUFrQjtvQkFDeEIsVUFBVSxFQUFFO3dCQUNWLFVBQVUsRUFBRSxjQUFjO3dCQUMxQixNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxpQkFBaUIsRUFBRSxDQUFDO3dCQUNwQyxjQUFjLEVBQUU7NEJBQ2QsU0FBUyxFQUFFO2dDQUNULEVBQUUsTUFBTSxFQUFFLGlCQUFpQixFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRTs2QkFDOUQ7NEJBQ0QsT0FBTyxFQUFFLFlBQVk7eUJBQ3RCO3FCQUNGO2lCQUNGO2dCQUNELGVBQWUsRUFBRSxFQUFFLElBQUksRUFBRSxpQkFBaUIsRUFBRTthQUM3QztTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0gsSUFBSSxDQUFDLHVFQUF1RSxFQUFFLEdBQUcsRUFBRTtRQUNqRixNQUFNLE1BQU0sR0FBRyxJQUFJLFlBQU0sQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDN0MsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLHFCQUFlLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzlGLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxxQkFBZSxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFOUYsTUFBTSxJQUFJLEdBQUcsSUFBSSxVQUFJLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUVoQyxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxlQUFlLENBQUM7WUFDeEMsU0FBUyxFQUNUO2dCQUNFLGdCQUFnQixFQUNmO29CQUNFLElBQUksRUFBRSxrQkFBa0I7b0JBQ3hCLFVBQVUsRUFDWDt3QkFDRSxjQUFjLEVBQ2Y7NEJBQ0UsU0FBUyxFQUNWLENBQUMsRUFBRSxNQUFNLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFO2dDQUM1RCxFQUFFLE1BQU0sRUFBRSxlQUFlLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUM7NEJBQy9ELE9BQU8sRUFBRSxZQUFZO3lCQUN0Qjt3QkFDQSxVQUFVLEVBQUUsa0JBQWtCO3dCQUM5QixLQUFLLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxnQkFBZ0IsRUFBRSxDQUFDO3FCQUNuQztpQkFDRDtnQkFDRixjQUFjLEVBQUUsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7YUFDM0M7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxnRkFBZ0YsRUFBRSxHQUFHLEVBQUU7UUFDMUYsTUFBTSxLQUFLLEdBQUcsSUFBSSxVQUFJLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZDLE1BQU0sTUFBTSxHQUFHLElBQUksV0FBSyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztRQUMxQyxNQUFNLEtBQUssR0FBRyxJQUFJLFVBQUksQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO1lBQ3JDLFNBQVMsRUFBRSxJQUFJLHNCQUFnQixDQUFDLGNBQWMsQ0FBQztTQUNoRCxDQUFDLENBQUM7UUFFSCxJQUFJLFlBQU0sQ0FBQyxLQUFLLEVBQUUsY0FBYyxFQUFFO1lBQ2hDLFVBQVUsRUFBRSxLQUFLO1lBQ2pCLEtBQUssRUFBRSxDQUFDLEtBQUssQ0FBQztZQUNkLE1BQU0sRUFBRSxDQUFDLE1BQU0sQ0FBQztZQUNoQixLQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUM7WUFDZCxVQUFVLEVBQUUsQ0FBQyxJQUFJLHFCQUFlLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztTQUN2RixDQUFDLENBQUM7UUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxlQUFlLENBQUM7WUFDeEMsU0FBUyxFQUNUO2dCQUNFLGFBQWEsRUFBRSxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtnQkFDekMsY0FBYyxFQUFFLEVBQUUsSUFBSSxFQUFFLGlCQUFpQixFQUFFO2dCQUMzQyxhQUFhLEVBQ1o7b0JBQ0UsSUFBSSxFQUFFLGdCQUFnQjtvQkFDdEIsVUFBVSxFQUNYO3dCQUNFLHdCQUF3QixFQUN6Qjs0QkFDRSxTQUFTLEVBQ1YsQ0FBQztvQ0FDQyxNQUFNLEVBQUUsZ0JBQWdCO29DQUN4QixNQUFNLEVBQUUsT0FBTztvQ0FDZixTQUFTLEVBQUUsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFO2lDQUN2QyxDQUFDOzRCQUNELE9BQU8sRUFBRSxZQUFZO3lCQUN0QjtxQkFDRDtpQkFDRDtnQkFDRixvQkFBb0IsRUFDbkI7b0JBQ0UsSUFBSSxFQUFFLGtCQUFrQjtvQkFDeEIsVUFBVSxFQUNYO3dCQUNFLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLGdCQUFnQixFQUFFLENBQUM7d0JBQ25DLGNBQWMsRUFDZjs0QkFDRSxTQUFTLEVBQ1YsQ0FBQyxFQUFFLE1BQU0sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQzs0QkFDL0QsT0FBTyxFQUFFLFlBQVk7eUJBQ3RCO3dCQUNBLFVBQVUsRUFBRSxLQUFLO3dCQUNqQixLQUFLLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxlQUFlLEVBQUUsQ0FBQzt3QkFDakMsS0FBSyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsZUFBZSxFQUFFLENBQUM7cUJBQ2xDO2lCQUNEO2FBQ0g7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQywrREFBK0QsRUFBRSxHQUFHLEVBQUU7UUFDekUsTUFBTSxDQUFDLEdBQUcsSUFBSSxZQUFNLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3hDLENBQUMsQ0FBQyxhQUFhLENBQUMsSUFBSSxxQkFBZSxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFM0UsTUFBTSxJQUFJLEdBQUcsSUFBSSxVQUFJLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckIsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVyQixxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxlQUFlLENBQUM7WUFDeEMsU0FBUyxFQUNUO2dCQUNFLGdCQUFnQixFQUNmO29CQUNFLElBQUksRUFBRSxrQkFBa0I7b0JBQ3hCLFVBQVUsRUFDWDt3QkFDRSxjQUFjLEVBQ2Y7NEJBQ0UsU0FBUyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDOzRCQUM1RCxPQUFPLEVBQUUsWUFBWTt5QkFDdEI7d0JBQ0EsVUFBVSxFQUFFLGtCQUFrQjt3QkFDOUIsS0FBSyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQztxQkFDbkM7aUJBQ0Q7Z0JBQ0YsY0FBYyxFQUFFLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFO2FBQzNDO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsaUVBQWlFLEVBQUUsR0FBRyxFQUFFO1FBQzNFLE1BQU0sQ0FBQyxHQUFHLElBQUksWUFBTSxDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUU7WUFDMUMsVUFBVSxFQUFFLEtBQUs7U0FDbEIsQ0FBQyxDQUFDO1FBRUgsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLFVBQUksQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUN6QyxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksVUFBSSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ3pDLENBQUMsQ0FBQyxhQUFhLENBQUMsSUFBSSxXQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDNUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxJQUFJLFVBQUksQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksc0JBQWdCLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDOUYsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxJQUFJLHFCQUFlLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRTFGLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLGVBQWUsQ0FBQztZQUN4QyxTQUFTLEVBQ1Q7Z0JBQ0Usb0JBQW9CLEVBQ25CO29CQUNFLElBQUksRUFBRSxrQkFBa0I7b0JBQ3hCLFVBQVUsRUFDWDt3QkFDRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxnQkFBZ0IsRUFBRSxDQUFDO3dCQUNuQyxjQUFjLEVBQ2Y7NEJBQ0UsU0FBUyxFQUNWLENBQUMsRUFBRSxNQUFNLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsR0FBRyxFQUFFLENBQUM7NEJBQy9ELE9BQU8sRUFBRSxZQUFZO3lCQUN0Qjt3QkFDQSxVQUFVLEVBQUUsS0FBSzt3QkFDakIsS0FBSyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsZUFBZSxFQUFFLENBQUM7d0JBQ2pDLEtBQUssRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLGVBQWUsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLGVBQWUsRUFBRSxDQUFDO3FCQUM1RDtpQkFDRDtnQkFDRixhQUFhLEVBQUUsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUU7Z0JBQ3pDLGFBQWEsRUFBRSxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRTtnQkFDekMsY0FBYyxFQUFFLEVBQUUsSUFBSSxFQUFFLGlCQUFpQixFQUFFO2dCQUMzQyxhQUFhLEVBQ1o7b0JBQ0UsSUFBSSxFQUFFLGdCQUFnQjtvQkFDdEIsVUFBVSxFQUNYO3dCQUNFLHdCQUF3QixFQUN6Qjs0QkFDRSxTQUFTLEVBQ1YsQ0FBQztvQ0FDQyxNQUFNLEVBQUUsZ0JBQWdCO29DQUN4QixNQUFNLEVBQUUsT0FBTztvQ0FDZixTQUFTLEVBQUUsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFO2lDQUN2QyxDQUFDOzRCQUNELE9BQU8sRUFBRSxZQUFZO3lCQUN0QjtxQkFDRDtpQkFDRDthQUNIO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsOEVBQThFLEVBQUUsR0FBRyxFQUFFO1FBQ3hGLE1BQU0sTUFBTSxHQUFHLElBQUksWUFBTSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztRQUM3QyxNQUFNLElBQUksR0FBRyxJQUFJLFVBQUksQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDdkMsTUFBTSxLQUFLLEdBQUcsSUFBSSxXQUFLLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzFDLE1BQU0sSUFBSSxHQUFHLElBQUksVUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsRUFBRSxTQUFTLEVBQUUsSUFBSSxzQkFBZ0IsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUM7UUFFNUYsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2hDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNqQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFaEMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLHFCQUFlLENBQUMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUVoRixxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxlQUFlLENBQUM7WUFDeEMsU0FBUyxFQUNUO2dCQUNFLGdCQUFnQixFQUNmO29CQUNFLElBQUksRUFBRSxrQkFBa0I7b0JBQ3hCLFVBQVUsRUFDWDt3QkFDRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxpQkFBaUIsRUFBRSxDQUFDO3dCQUNwQyxjQUFjLEVBQ2Y7NEJBQ0UsU0FBUyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDOzRCQUM1RCxPQUFPLEVBQUUsWUFBWTt5QkFDdEI7d0JBQ0EsVUFBVSxFQUFFLGtCQUFrQjt3QkFDOUIsS0FBSyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQzt3QkFDbEMsS0FBSyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQztxQkFDbkM7aUJBQ0Q7Z0JBQ0YsY0FBYyxFQUFFLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFO2dCQUMxQyxlQUFlLEVBQUUsRUFBRSxJQUFJLEVBQUUsaUJBQWlCLEVBQUU7Z0JBQzVDLGNBQWMsRUFDYjtvQkFDRSxJQUFJLEVBQUUsZ0JBQWdCO29CQUN0QixVQUFVLEVBQ1g7d0JBQ0Usd0JBQXdCLEVBQ3pCOzRCQUNFLFNBQVMsRUFDVixDQUFDO29DQUNDLE1BQU0sRUFBRSxnQkFBZ0I7b0NBQ3hCLE1BQU0sRUFBRSxPQUFPO29DQUNmLFNBQVMsRUFBRSxFQUFFLE9BQU8sRUFBRSxjQUFjLEVBQUU7aUNBQ3ZDLENBQUM7NEJBQ0QsT0FBTyxFQUFFLFlBQVk7eUJBQ3RCO3FCQUNEO2lCQUNEO2FBQ0g7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyw2REFBNkQsRUFBRSxHQUFHLEVBQUU7UUFDdkUsaUZBQWlGO1FBQ2pGLE1BQU0sRUFBRSxHQUFHLElBQUksWUFBTSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUMxRCxNQUFNLEVBQUUsR0FBRyxJQUFJLFlBQU0sQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDMUQsTUFBTSxFQUFFLEdBQUcsSUFBSSxZQUFNLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMseUJBQXlCO1FBRTdELE1BQU0sSUFBSSxHQUFHLElBQUksVUFBSSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN2QyxNQUFNLEtBQUssR0FBRyxJQUFJLFdBQUssQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDMUMsTUFBTSxJQUFJLEdBQUcsSUFBSSxVQUFJLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLHNCQUFnQixDQUFDLG1CQUFtQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRWpHLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEIsRUFBRSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4QixFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXRCLHNEQUFzRDtRQUN0RCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQywwQ0FBMEMsQ0FBQyxDQUFDO1FBQ3hGLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLDBDQUEwQyxDQUFDLENBQUM7UUFDMUYsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsMENBQTBDLENBQUMsQ0FBQztRQUV4RixFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3RCLEVBQUUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEIsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN4QixDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx5REFBeUQsRUFBRSxHQUFHLEVBQUU7UUFDbkUsSUFBSSxZQUFNLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQy9DLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMseURBQXlELENBQUMsQ0FBQztJQUMvRixDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx5RkFBeUYsRUFBRSxHQUFHLEVBQUU7UUFDbkcseUJBQXlCLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhDLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGtCQUFrQixFQUFFO1lBQ2xFLFlBQVksRUFBRSxLQUFLO1NBQ3BCLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDJFQUEyRSxFQUFFLEdBQUcsRUFBRTtRQUNyRixNQUFNLFlBQVksR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDOUMsTUFBTSxnQkFBZ0IsR0FBRyxRQUFRLEdBQUcsWUFBWSxDQUFDO1FBRWpELHlCQUF5QixDQUFDLEtBQUssRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBRW5ELHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGtCQUFrQixFQUFFO1lBQ2xFLFlBQVksRUFBRSxZQUFZO1NBQzNCLENBQUMsQ0FBQztRQUVILFNBQVMsR0FBRyxDQUFDLEtBQWE7WUFDeEIsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ1gsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssRUFBRSxFQUFFLENBQUMsRUFBRTtnQkFDOUIsQ0FBQyxJQUFJLEdBQUcsQ0FBQzthQUNWO1lBQ0QsT0FBTyxDQUFDLENBQUM7UUFDWCxDQUFDO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsNERBQTRELEVBQUUsR0FBRyxFQUFFO1FBQ3RFLFFBQVE7UUFDUixNQUFNLEdBQUcsR0FBRyxJQUFJLFlBQU0sQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFFdkQsTUFBTSxHQUFHLEdBQUcsSUFBSSxrQkFBVyxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7WUFDN0MsSUFBSSxFQUFFLGdCQUFnQjtTQUN2QixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFNUIsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLGVBQWUsQ0FBQztZQUN4QyxTQUFTLEVBQUU7Z0JBQ1QsUUFBUSxFQUFFO29CQUNSLElBQUksRUFBRSxnQkFBZ0I7aUJBQ3ZCO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx1RUFBdUUsRUFBRSxHQUFHLEVBQUU7UUFDakYsUUFBUTtRQUNSLE1BQU0sR0FBRyxHQUFHLElBQUksWUFBTSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUN2RCxHQUFHLENBQUMsYUFBYSxDQUFDLElBQUkscUJBQWUsQ0FBQztZQUNwQyxPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUM7WUFDakIsU0FBUyxFQUFFLENBQUMsR0FBRyxDQUFDO1NBQ2pCLENBQUMsQ0FBQyxDQUFDO1FBQ0osR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLFVBQUksQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUUxQyxNQUFNLEdBQUcsR0FBRyxJQUFJLGtCQUFXLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRTtZQUM3QyxJQUFJLEVBQUUsZ0JBQWdCO1NBQ3ZCLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUU1QixPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxDQUFDLGdCQUFnQixFQUFFO1lBQ3RELElBQUksRUFBRSxnQkFBZ0I7WUFDdEIsU0FBUyxFQUFFLENBQUMsYUFBYSxDQUFDO1NBQzNCLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLG1DQUFtQyxFQUFFLEdBQUcsRUFBRTtRQUM3QyxJQUFJLFlBQU0sQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFFM0MsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ1oseUJBQXlCO0lBQzNCLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLG1EQUFtRCxFQUFFLEdBQUcsRUFBRTtRQUM3RCxNQUFNLEdBQUcsR0FBRyxJQUFJLFlBQU0sQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDdkQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFOUIsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO0lBQzNFLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHFDQUFxQyxFQUFFLEdBQUcsRUFBRTtRQUMvQyxJQUFJLFlBQU0sQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFO1lBQzFCLFVBQVUsRUFBRSxDQUFDLElBQUkscUJBQWUsQ0FBQztvQkFDL0IsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDO29CQUNkLFVBQVUsRUFBRSxDQUFDLElBQUksc0JBQWdCLENBQUMsY0FBYyxDQUFDLENBQUM7aUJBQ25ELENBQUMsQ0FBQztTQUNKLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsc0ZBQXNGLENBQUMsQ0FBQztJQUM1SCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQywrQ0FBK0MsRUFBRSxHQUFHLEVBQUU7UUFDekQsTUFBTSxHQUFHLEdBQUcsSUFBSSxZQUFNLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRTtZQUN0QyxVQUFVLEVBQUUsY0FBYztTQUMzQixDQUFDLENBQUM7UUFDSCxXQUFLLENBQUMsY0FBYyxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsY0FBYyxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdkYsR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLFVBQUksQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUUxQyxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxrQkFBa0IsRUFBRTtZQUNsRSxVQUFVLEVBQUUsY0FBYztZQUMxQixjQUFjLEVBQUU7Z0JBQ2QsU0FBUyxFQUFFO29CQUNULEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUU7aUJBQzNEO2dCQUNELE9BQU8sRUFBRSxZQUFZO2FBQ3RCO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsZ0VBQWdFLEVBQUUsR0FBRyxFQUFFO1FBQzFFLE1BQU0sR0FBRyxHQUFHLElBQUksWUFBTSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7WUFDdEMsVUFBVSxFQUFFLGNBQWM7U0FDM0IsQ0FBQyxDQUFDO1FBQ0gsR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLFVBQUksQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUUxQyxNQUFNLGFBQWMsU0FBUSxlQUFRO1lBQ2xDLG1CQUFtQixDQUFDLFVBQTJCO2dCQUM3QyxNQUFNLElBQUksS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7YUFDMUM7U0FDRjtRQUFBLENBQUM7UUFDRixNQUFNLFFBQVEsR0FBRyxJQUFJLGFBQWEsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDbkQsV0FBSyxDQUFDLHdCQUF3QixDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsY0FBYyxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRTNHLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGtCQUFrQixFQUFFO1lBQ2xFLFVBQVUsRUFBRSxjQUFjO1lBQzFCLGNBQWMsRUFBRTtnQkFDZCxTQUFTLEVBQUU7b0JBQ1QsRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLEdBQUcsRUFBRTtpQkFDM0Q7Z0JBQ0QsT0FBTyxFQUFFLFlBQVk7YUFDdEI7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxrRUFBa0UsRUFBRSxHQUFHLEVBQUU7UUFDNUUsTUFBTSxHQUFHLEdBQUcsSUFBSSxZQUFNLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRTtZQUN0QyxVQUFVLEVBQUUsY0FBYztTQUMzQixDQUFDLENBQUM7UUFFSCxNQUFNLGFBQWMsU0FBUSxlQUFRO1lBQ2xDLG1CQUFtQixDQUFDLFVBQTJCO2dCQUM3QyxNQUFNLElBQUksS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7YUFDMUM7U0FDRjtRQUFBLENBQUM7UUFDRixNQUFNLFFBQVEsR0FBRyxJQUFJLGFBQWEsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFFeEUsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNWLFdBQUssQ0FBQyx3QkFBd0IsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLGNBQWMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUM3RyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsdUNBQXVDLENBQUMsQ0FBQztJQUN0RCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxpREFBaUQsRUFBRSxHQUFHLEVBQUU7UUFDM0QsTUFBTSxHQUFHLEdBQUcsSUFBSSxZQUFNLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRTtZQUN0QyxVQUFVLEVBQUUsY0FBYztTQUMzQixDQUFDLENBQUM7UUFFSCxNQUFNLGFBQWMsU0FBUSxlQUFRO1lBQ2xDLG1CQUFtQixDQUFDLFVBQTJCO2dCQUM3QyxNQUFNLElBQUksS0FBSyxDQUFDLHVCQUF1QixDQUFDLENBQUM7YUFDMUM7U0FDRjtRQUFBLENBQUM7UUFDRixNQUFNLFFBQVEsR0FBRyxJQUFJLGFBQWEsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFbkQsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNWLFdBQUssQ0FBQyx5QkFBeUIsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLGNBQWMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUM5RyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsdUNBQXVDLENBQUMsQ0FBQztJQUN0RCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsU0FBUyx5QkFBeUIsQ0FBQyxLQUFZLEVBQUUsU0FBaUI7SUFDaEUsTUFBTSxNQUFNLEdBQUcsSUFBSSxZQUFNLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzVDLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBeUIsQ0FBQztJQUN4RCxTQUFTLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxnQ0FBZ0M7SUFFeEUsbURBQW1EO0lBQ25ELE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxxQkFBZSxDQUFDO1FBQ3ZDLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQztRQUNkLFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQztLQUNqQixDQUFDLENBQUMsQ0FBQztJQUNKLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxVQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxFQUFFLFNBQVMsRUFBRSxJQUFJLGtCQUFZLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNsRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCB7IEFwcCwgQ2ZuUmVzb3VyY2UsIFJlc291cmNlLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQWRkVG9QcmluY2lwYWxQb2xpY3lSZXN1bHQsIEFueVByaW5jaXBhbCwgQ2ZuUG9saWN5LCBHcmFudCwgR3JvdXAsIElSZXNvdXJjZVdpdGhQb2xpY3ksIFBvbGljeSwgUG9saWN5RG9jdW1lbnQsIFBvbGljeVN0YXRlbWVudCwgUm9sZSwgU2VydmljZVByaW5jaXBhbCwgVXNlciB9IGZyb20gJy4uL2xpYic7XG5cbi8qIGVzbGludC1kaXNhYmxlIHF1b3RlLXByb3BzICovXG5cbmRlc2NyaWJlKCdJQU0gcG9saWN5JywgKCkgPT4ge1xuICBsZXQgYXBwOiBBcHA7XG4gIGxldCBzdGFjazogU3RhY2s7XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgYXBwID0gbmV3IEFwcCgpO1xuICAgIHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ015U3RhY2snKTtcbiAgfSk7XG5cbiAgdGVzdCgnZmFpbHMgd2hlbiBcImZvcmNlZFwiIHBvbGljeSBpcyBlbXB0eScsICgpID0+IHtcbiAgICBuZXcgUG9saWN5KHN0YWNrLCAnTXlQb2xpY3knLCB7IGZvcmNlOiB0cnVlIH0pO1xuXG4gICAgZXhwZWN0KCgpID0+IGFwcC5zeW50aCgpKS50b1Rocm93KC9pcyBlbXB0eS8pO1xuICB9KTtcblxuICB0ZXN0KCdwb2xpY3kgd2l0aCBzdGF0ZW1lbnRzJywgKCkgPT4ge1xuICAgIGNvbnN0IHBvbGljeSA9IG5ldyBQb2xpY3koc3RhY2ssICdNeVBvbGljeScsIHsgcG9saWN5TmFtZTogJ015UG9saWN5TmFtZScgfSk7XG4gICAgcG9saWN5LmFkZFN0YXRlbWVudHMobmV3IFBvbGljeVN0YXRlbWVudCh7IHJlc291cmNlczogWycqJ10sIGFjdGlvbnM6IFsnc3FzOlNlbmRNZXNzYWdlJ10gfSkpO1xuICAgIHBvbGljeS5hZGRTdGF0ZW1lbnRzKG5ldyBQb2xpY3lTdGF0ZW1lbnQoeyByZXNvdXJjZXM6IFsnYXJuJ10sIGFjdGlvbnM6IFsnc25zOlN1YnNjcmliZSddIH0pKTtcblxuICAgIGNvbnN0IGdyb3VwID0gbmV3IEdyb3VwKHN0YWNrLCAnTXlHcm91cCcpO1xuICAgIGdyb3VwLmF0dGFjaElubGluZVBvbGljeShwb2xpY3kpO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUmVzb3VyY2VzOlxuICAgICAge1xuICAgICAgICBNeVBvbGljeTM5RDY2Q0Y2OlxuICAgICAgICAge1xuICAgICAgICAgICBUeXBlOiAnQVdTOjpJQU06OlBvbGljeScsXG4gICAgICAgICAgIFByb3BlcnRpZXM6XG4gICAgICAgICAge1xuICAgICAgICAgICAgR3JvdXBzOiBbeyBSZWY6ICdNeUdyb3VwQ0JBNTRCMUInIH1dLFxuICAgICAgICAgICAgUG9saWN5RG9jdW1lbnQ6XG4gICAgICAgICAgIHtcbiAgICAgICAgICAgICBTdGF0ZW1lbnQ6XG4gICAgICAgICAgICBbeyBBY3Rpb246ICdzcXM6U2VuZE1lc3NhZ2UnLCBFZmZlY3Q6ICdBbGxvdycsIFJlc291cmNlOiAnKicgfSxcbiAgICAgICAgICAgICAgeyBBY3Rpb246ICdzbnM6U3Vic2NyaWJlJywgRWZmZWN0OiAnQWxsb3cnLCBSZXNvdXJjZTogJ2FybicgfV0sXG4gICAgICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICAgICB9LFxuICAgICAgICAgICAgUG9saWN5TmFtZTogJ015UG9saWN5TmFtZScsXG4gICAgICAgICAgfSxcbiAgICAgICAgIH0sXG4gICAgICAgIE15R3JvdXBDQkE1NEIxQjogeyBUeXBlOiAnQVdTOjpJQU06Okdyb3VwJyB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgncG9saWN5IGZyb20gcG9saWN5IGRvY3VtZW50IGFsb25lJywgKCkgPT4ge1xuICAgIGNvbnN0IHBvbGljeSA9IG5ldyBQb2xpY3koc3RhY2ssICdNeVBvbGljeScsIHtcbiAgICAgIHBvbGljeU5hbWU6ICdNeVBvbGljeU5hbWUnLFxuICAgICAgZG9jdW1lbnQ6IFBvbGljeURvY3VtZW50LmZyb21Kc29uKHtcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiAnc3FzOlNlbmRNZXNzYWdlJyxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgY29uc3QgZ3JvdXAgPSBuZXcgR3JvdXAoc3RhY2ssICdNeUdyb3VwJyk7XG4gICAgZ3JvdXAuYXR0YWNoSW5saW5lUG9saWN5KHBvbGljeSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgTXlQb2xpY3kzOUQ2NkNGNjoge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OklBTTo6UG9saWN5JyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBQb2xpY3lOYW1lOiAnTXlQb2xpY3lOYW1lJyxcbiAgICAgICAgICAgIEdyb3VwczogW3sgUmVmOiAnTXlHcm91cENCQTU0QjFCJyB9XSxcbiAgICAgICAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgICAgICAgIHsgQWN0aW9uOiAnc3FzOlNlbmRNZXNzYWdlJywgRWZmZWN0OiAnQWxsb3cnLCBSZXNvdXJjZTogJyonIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgTXlHcm91cENCQTU0QjFCOiB7IFR5cGU6ICdBV1M6OklBTTo6R3JvdXAnIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcbiAgdGVzdCgncG9saWN5IG5hbWUgY2FuIGJlIG9taXR0ZWQsIGluIHdoaWNoIGNhc2UgdGhlIGxvZ2ljYWwgaWQgd2lsbCBiZSB1c2VkJywgKCkgPT4ge1xuICAgIGNvbnN0IHBvbGljeSA9IG5ldyBQb2xpY3koc3RhY2ssICdNeVBvbGljeScpO1xuICAgIHBvbGljeS5hZGRTdGF0ZW1lbnRzKG5ldyBQb2xpY3lTdGF0ZW1lbnQoeyByZXNvdXJjZXM6IFsnKiddLCBhY3Rpb25zOiBbJ3NxczpTZW5kTWVzc2FnZSddIH0pKTtcbiAgICBwb2xpY3kuYWRkU3RhdGVtZW50cyhuZXcgUG9saWN5U3RhdGVtZW50KHsgcmVzb3VyY2VzOiBbJ2FybiddLCBhY3Rpb25zOiBbJ3NuczpTdWJzY3JpYmUnXSB9KSk7XG5cbiAgICBjb25zdCB1c2VyID0gbmV3IFVzZXIoc3RhY2ssICdNeVVzZXInKTtcbiAgICB1c2VyLmF0dGFjaElubGluZVBvbGljeShwb2xpY3kpO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUmVzb3VyY2VzOlxuICAgICAge1xuICAgICAgICBNeVBvbGljeTM5RDY2Q0Y2OlxuICAgICAgICAge1xuICAgICAgICAgICBUeXBlOiAnQVdTOjpJQU06OlBvbGljeScsXG4gICAgICAgICAgIFByb3BlcnRpZXM6XG4gICAgICAgICAge1xuICAgICAgICAgICAgUG9saWN5RG9jdW1lbnQ6XG4gICAgICAgICAgIHtcbiAgICAgICAgICAgICBTdGF0ZW1lbnQ6XG4gICAgICAgICAgICBbeyBBY3Rpb246ICdzcXM6U2VuZE1lc3NhZ2UnLCBFZmZlY3Q6ICdBbGxvdycsIFJlc291cmNlOiAnKicgfSxcbiAgICAgICAgICAgICAgeyBBY3Rpb246ICdzbnM6U3Vic2NyaWJlJywgRWZmZWN0OiAnQWxsb3cnLCBSZXNvdXJjZTogJ2FybicgfV0sXG4gICAgICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICAgICB9LFxuICAgICAgICAgICAgUG9saWN5TmFtZTogJ015UG9saWN5MzlENjZDRjYnLFxuICAgICAgICAgICAgVXNlcnM6IFt7IFJlZjogJ015VXNlckRDNDUwMjhCJyB9XSxcbiAgICAgICAgICB9LFxuICAgICAgICAgfSxcbiAgICAgICAgTXlVc2VyREM0NTAyOEI6IHsgVHlwZTogJ0FXUzo6SUFNOjpVc2VyJyB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgncG9saWN5IGNhbiBiZSBhdHRhY2hlZCB1c2VycywgZ3JvdXBzIGFuZCByb2xlcyBhbmQgYWRkZWQgcGVybWlzc2lvbnMgdmlhIHByb3BzJywgKCkgPT4ge1xuICAgIGNvbnN0IHVzZXIxID0gbmV3IFVzZXIoc3RhY2ssICdVc2VyMScpO1xuICAgIGNvbnN0IGdyb3VwMSA9IG5ldyBHcm91cChzdGFjaywgJ0dyb3VwMScpO1xuICAgIGNvbnN0IHJvbGUxID0gbmV3IFJvbGUoc3RhY2ssICdSb2xlMScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ3Rlc3Quc2VydmljZScpLFxuICAgIH0pO1xuXG4gICAgbmV3IFBvbGljeShzdGFjaywgJ015VGVzdFBvbGljeScsIHtcbiAgICAgIHBvbGljeU5hbWU6ICdGb28nLFxuICAgICAgdXNlcnM6IFt1c2VyMV0sXG4gICAgICBncm91cHM6IFtncm91cDFdLFxuICAgICAgcm9sZXM6IFtyb2xlMV0sXG4gICAgICBzdGF0ZW1lbnRzOiBbbmV3IFBvbGljeVN0YXRlbWVudCh7IHJlc291cmNlczogWycqJ10sIGFjdGlvbnM6IFsnZHluYW1vZGI6UHV0SXRlbSddIH0pXSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgIFJlc291cmNlczpcbiAgICAgIHtcbiAgICAgICAgVXNlcjFFMjc4QTczNjogeyBUeXBlOiAnQVdTOjpJQU06OlVzZXInIH0sXG4gICAgICAgIEdyb3VwMUJFQkQ0Njg2OiB7IFR5cGU6ICdBV1M6OklBTTo6R3JvdXAnIH0sXG4gICAgICAgIFJvbGUxM0E1QzcwQzE6XG4gICAgICAgICB7XG4gICAgICAgICAgIFR5cGU6ICdBV1M6OklBTTo6Um9sZScsXG4gICAgICAgICAgIFByb3BlcnRpZXM6XG4gICAgICAgICAge1xuICAgICAgICAgICAgQXNzdW1lUm9sZVBvbGljeURvY3VtZW50OlxuICAgICAgICAgICB7XG4gICAgICAgICAgICAgU3RhdGVtZW50OlxuICAgICAgICAgICAgW3tcbiAgICAgICAgICAgICAgQWN0aW9uOiAnc3RzOkFzc3VtZVJvbGUnLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFByaW5jaXBhbDogeyBTZXJ2aWNlOiAndGVzdC5zZXJ2aWNlJyB9LFxuICAgICAgICAgICAgfV0sXG4gICAgICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICB9LFxuICAgICAgICBNeVRlc3RQb2xpY3kzMTZCREI1MDpcbiAgICAgICAgIHtcbiAgICAgICAgICAgVHlwZTogJ0FXUzo6SUFNOjpQb2xpY3knLFxuICAgICAgICAgICBQcm9wZXJ0aWVzOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIEdyb3VwczogW3sgUmVmOiAnR3JvdXAxQkVCRDQ2ODYnIH1dLFxuICAgICAgICAgICAgUG9saWN5RG9jdW1lbnQ6XG4gICAgICAgICAgIHtcbiAgICAgICAgICAgICBTdGF0ZW1lbnQ6XG4gICAgICAgICAgICBbeyBBY3Rpb246ICdkeW5hbW9kYjpQdXRJdGVtJywgRWZmZWN0OiAnQWxsb3cnLCBSZXNvdXJjZTogJyonIH1dLFxuICAgICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFBvbGljeU5hbWU6ICdGb28nLFxuICAgICAgICAgICAgUm9sZXM6IFt7IFJlZjogJ1JvbGUxM0E1QzcwQzEnIH1dLFxuICAgICAgICAgICAgVXNlcnM6IFt7IFJlZjogJ1VzZXIxRTI3OEE3MzYnIH1dLFxuICAgICAgICAgIH0sXG4gICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnaWRlbXBvdGVudCBpZiBhIHByaW5jaXBhbCAodXNlci9ncm91cC9yb2xlKSBpcyBhdHRhY2hlZCB0d2ljZScsICgpID0+IHtcbiAgICBjb25zdCBwID0gbmV3IFBvbGljeShzdGFjaywgJ015UG9saWN5Jyk7XG4gICAgcC5hZGRTdGF0ZW1lbnRzKG5ldyBQb2xpY3lTdGF0ZW1lbnQoeyBhY3Rpb25zOiBbJyonXSwgcmVzb3VyY2VzOiBbJyonXSB9KSk7XG5cbiAgICBjb25zdCB1c2VyID0gbmV3IFVzZXIoc3RhY2ssICdNeVVzZXInKTtcbiAgICBwLmF0dGFjaFRvVXNlcih1c2VyKTtcbiAgICBwLmF0dGFjaFRvVXNlcih1c2VyKTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgIFJlc291cmNlczpcbiAgICAgIHtcbiAgICAgICAgTXlQb2xpY3kzOUQ2NkNGNjpcbiAgICAgICAgIHtcbiAgICAgICAgICAgVHlwZTogJ0FXUzo6SUFNOjpQb2xpY3knLFxuICAgICAgICAgICBQcm9wZXJ0aWVzOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFBvbGljeURvY3VtZW50OlxuICAgICAgICAgICB7XG4gICAgICAgICAgICAgU3RhdGVtZW50OiBbeyBBY3Rpb246ICcqJywgRWZmZWN0OiAnQWxsb3cnLCBSZXNvdXJjZTogJyonIH1dLFxuICAgICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFBvbGljeU5hbWU6ICdNeVBvbGljeTM5RDY2Q0Y2JyxcbiAgICAgICAgICAgIFVzZXJzOiBbeyBSZWY6ICdNeVVzZXJEQzQ1MDI4QicgfV0sXG4gICAgICAgICAgfSxcbiAgICAgICAgIH0sXG4gICAgICAgIE15VXNlckRDNDUwMjhCOiB7IFR5cGU6ICdBV1M6OklBTTo6VXNlcicgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3VzZXJzLCBncm91cHMsIHJvbGVzIGFuZCBwZXJtaXNzaW9ucyBjYW4gYmUgYWRkZWQgdXNpbmcgbWV0aG9kcycsICgpID0+IHtcbiAgICBjb25zdCBwID0gbmV3IFBvbGljeShzdGFjaywgJ015VGVzdFBvbGljeScsIHtcbiAgICAgIHBvbGljeU5hbWU6ICdGb28nLFxuICAgIH0pO1xuXG4gICAgcC5hdHRhY2hUb1VzZXIobmV3IFVzZXIoc3RhY2ssICdVc2VyMScpKTtcbiAgICBwLmF0dGFjaFRvVXNlcihuZXcgVXNlcihzdGFjaywgJ1VzZXIyJykpO1xuICAgIHAuYXR0YWNoVG9Hcm91cChuZXcgR3JvdXAoc3RhY2ssICdHcm91cDEnKSk7XG4gICAgcC5hdHRhY2hUb1JvbGUobmV3IFJvbGUoc3RhY2ssICdSb2xlMScsIHsgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgndGVzdC5zZXJ2aWNlJykgfSkpO1xuICAgIHAuYWRkU3RhdGVtZW50cyhuZXcgUG9saWN5U3RhdGVtZW50KHsgcmVzb3VyY2VzOiBbJyonXSwgYWN0aW9uczogWydkeW5hbW9kYjpHZXRJdGVtJ10gfSkpO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUmVzb3VyY2VzOlxuICAgICAge1xuICAgICAgICBNeVRlc3RQb2xpY3kzMTZCREI1MDpcbiAgICAgICAgIHtcbiAgICAgICAgICAgVHlwZTogJ0FXUzo6SUFNOjpQb2xpY3knLFxuICAgICAgICAgICBQcm9wZXJ0aWVzOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIEdyb3VwczogW3sgUmVmOiAnR3JvdXAxQkVCRDQ2ODYnIH1dLFxuICAgICAgICAgICAgUG9saWN5RG9jdW1lbnQ6XG4gICAgICAgICAgIHtcbiAgICAgICAgICAgICBTdGF0ZW1lbnQ6XG4gICAgICAgICAgICBbeyBBY3Rpb246ICdkeW5hbW9kYjpHZXRJdGVtJywgRWZmZWN0OiAnQWxsb3cnLCBSZXNvdXJjZTogJyonIH1dLFxuICAgICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFBvbGljeU5hbWU6ICdGb28nLFxuICAgICAgICAgICAgUm9sZXM6IFt7IFJlZjogJ1JvbGUxM0E1QzcwQzEnIH1dLFxuICAgICAgICAgICAgVXNlcnM6IFt7IFJlZjogJ1VzZXIxRTI3OEE3MzYnIH0sIHsgUmVmOiAnVXNlcjIxRjE0ODZEMScgfV0sXG4gICAgICAgICAgfSxcbiAgICAgICAgIH0sXG4gICAgICAgIFVzZXIxRTI3OEE3MzY6IHsgVHlwZTogJ0FXUzo6SUFNOjpVc2VyJyB9LFxuICAgICAgICBVc2VyMjFGMTQ4NkQxOiB7IFR5cGU6ICdBV1M6OklBTTo6VXNlcicgfSxcbiAgICAgICAgR3JvdXAxQkVCRDQ2ODY6IHsgVHlwZTogJ0FXUzo6SUFNOjpHcm91cCcgfSxcbiAgICAgICAgUm9sZTEzQTVDNzBDMTpcbiAgICAgICAgIHtcbiAgICAgICAgICAgVHlwZTogJ0FXUzo6SUFNOjpSb2xlJyxcbiAgICAgICAgICAgUHJvcGVydGllczpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQ6XG4gICAgICAgICAgIHtcbiAgICAgICAgICAgICBTdGF0ZW1lbnQ6XG4gICAgICAgICAgICBbe1xuICAgICAgICAgICAgICBBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgUHJpbmNpcGFsOiB7IFNlcnZpY2U6ICd0ZXN0LnNlcnZpY2UnIH0sXG4gICAgICAgICAgICB9XSxcbiAgICAgICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdwb2xpY3kgY2FuIGJlIGF0dGFjaGVkIHRvIHVzZXJzLCBncm91cHMgb3Igcm9sZSB2aWEgbWV0aG9kcyBvbiB0aGUgcHJpbmNpcGFsJywgKCkgPT4ge1xuICAgIGNvbnN0IHBvbGljeSA9IG5ldyBQb2xpY3koc3RhY2ssICdNeVBvbGljeScpO1xuICAgIGNvbnN0IHVzZXIgPSBuZXcgVXNlcihzdGFjaywgJ015VXNlcicpO1xuICAgIGNvbnN0IGdyb3VwID0gbmV3IEdyb3VwKHN0YWNrLCAnTXlHcm91cCcpO1xuICAgIGNvbnN0IHJvbGUgPSBuZXcgUm9sZShzdGFjaywgJ015Um9sZScsIHsgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgndGVzdC5zZXJ2aWNlJykgfSk7XG5cbiAgICB1c2VyLmF0dGFjaElubGluZVBvbGljeShwb2xpY3kpO1xuICAgIGdyb3VwLmF0dGFjaElubGluZVBvbGljeShwb2xpY3kpO1xuICAgIHJvbGUuYXR0YWNoSW5saW5lUG9saWN5KHBvbGljeSk7XG5cbiAgICBwb2xpY3kuYWRkU3RhdGVtZW50cyhuZXcgUG9saWN5U3RhdGVtZW50KHsgcmVzb3VyY2VzOiBbJyonXSwgYWN0aW9uczogWycqJ10gfSkpO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUmVzb3VyY2VzOlxuICAgICAge1xuICAgICAgICBNeVBvbGljeTM5RDY2Q0Y2OlxuICAgICAgICAge1xuICAgICAgICAgICBUeXBlOiAnQVdTOjpJQU06OlBvbGljeScsXG4gICAgICAgICAgIFByb3BlcnRpZXM6XG4gICAgICAgICAge1xuICAgICAgICAgICAgR3JvdXBzOiBbeyBSZWY6ICdNeUdyb3VwQ0JBNTRCMUInIH1dLFxuICAgICAgICAgICAgUG9saWN5RG9jdW1lbnQ6XG4gICAgICAgICAgIHtcbiAgICAgICAgICAgICBTdGF0ZW1lbnQ6IFt7IEFjdGlvbjogJyonLCBFZmZlY3Q6ICdBbGxvdycsIFJlc291cmNlOiAnKicgfV0sXG4gICAgICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICAgICB9LFxuICAgICAgICAgICAgUG9saWN5TmFtZTogJ015UG9saWN5MzlENjZDRjYnLFxuICAgICAgICAgICAgUm9sZXM6IFt7IFJlZjogJ015Um9sZUY0OEZGRTA0JyB9XSxcbiAgICAgICAgICAgIFVzZXJzOiBbeyBSZWY6ICdNeVVzZXJEQzQ1MDI4QicgfV0sXG4gICAgICAgICAgfSxcbiAgICAgICAgIH0sXG4gICAgICAgIE15VXNlckRDNDUwMjhCOiB7IFR5cGU6ICdBV1M6OklBTTo6VXNlcicgfSxcbiAgICAgICAgTXlHcm91cENCQTU0QjFCOiB7IFR5cGU6ICdBV1M6OklBTTo6R3JvdXAnIH0sXG4gICAgICAgIE15Um9sZUY0OEZGRTA0OlxuICAgICAgICAge1xuICAgICAgICAgICBUeXBlOiAnQVdTOjpJQU06OlJvbGUnLFxuICAgICAgICAgICBQcm9wZXJ0aWVzOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFzc3VtZVJvbGVQb2xpY3lEb2N1bWVudDpcbiAgICAgICAgICAge1xuICAgICAgICAgICAgIFN0YXRlbWVudDpcbiAgICAgICAgICAgIFt7XG4gICAgICAgICAgICAgIEFjdGlvbjogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBQcmluY2lwYWw6IHsgU2VydmljZTogJ3Rlc3Quc2VydmljZScgfSxcbiAgICAgICAgICAgIH1dLFxuICAgICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ZhaWxzIGlmIHBvbGljeSBuYW1lIGlzIG5vdCB1bmlxdWUgd2l0aGluIGEgdXNlci9ncm91cC9yb2xlJywgKCkgPT4ge1xuICAgIC8vIGNyZWF0ZSB0d28gcG9saWNpZXMgbmFtZWQgRm9vIGFuZCBhdHRhY2ggdGhlbSBib3RoIHRvIHRoZSBzYW1lIHVzZXIvZ3JvdXAvcm9sZVxuICAgIGNvbnN0IHAxID0gbmV3IFBvbGljeShzdGFjaywgJ1AxJywgeyBwb2xpY3lOYW1lOiAnRm9vJyB9KTtcbiAgICBjb25zdCBwMiA9IG5ldyBQb2xpY3koc3RhY2ssICdQMicsIHsgcG9saWN5TmFtZTogJ0ZvbycgfSk7XG4gICAgY29uc3QgcDMgPSBuZXcgUG9saWN5KHN0YWNrLCAnUDMnKTsgLy8gdXNlcyBsb2dpY2FsSUQgYXMgbmFtZVxuXG4gICAgY29uc3QgdXNlciA9IG5ldyBVc2VyKHN0YWNrLCAnTXlVc2VyJyk7XG4gICAgY29uc3QgZ3JvdXAgPSBuZXcgR3JvdXAoc3RhY2ssICdNeUdyb3VwJyk7XG4gICAgY29uc3Qgcm9sZSA9IG5ldyBSb2xlKHN0YWNrLCAnTXlSb2xlJywgeyBhc3N1bWVkQnk6IG5ldyBTZXJ2aWNlUHJpbmNpcGFsKCdzbnMuYW1hem9uYXdzLmNvbScpIH0pO1xuXG4gICAgcDEuYXR0YWNoVG9Vc2VyKHVzZXIpO1xuICAgIHAxLmF0dGFjaFRvR3JvdXAoZ3JvdXApO1xuICAgIHAxLmF0dGFjaFRvUm9sZShyb2xlKTtcblxuICAgIC8vIHRyeSB0byBhdHRhY2ggcDIgdG8gYWxsIG9mIHRoZXNlIGFuZCBleHBlY3QgdG8gZmFpbFxuICAgIGV4cGVjdCgoKSA9PiBwMi5hdHRhY2hUb1VzZXIodXNlcikpLnRvVGhyb3coL0EgcG9saWN5IG5hbWVkIFwiRm9vXCIgaXMgYWxyZWFkeSBhdHRhY2hlZC8pO1xuICAgIGV4cGVjdCgoKSA9PiBwMi5hdHRhY2hUb0dyb3VwKGdyb3VwKSkudG9UaHJvdygvQSBwb2xpY3kgbmFtZWQgXCJGb29cIiBpcyBhbHJlYWR5IGF0dGFjaGVkLyk7XG4gICAgZXhwZWN0KCgpID0+IHAyLmF0dGFjaFRvUm9sZShyb2xlKSkudG9UaHJvdygvQSBwb2xpY3kgbmFtZWQgXCJGb29cIiBpcyBhbHJlYWR5IGF0dGFjaGVkLyk7XG5cbiAgICBwMy5hdHRhY2hUb1VzZXIodXNlcik7XG4gICAgcDMuYXR0YWNoVG9Hcm91cChncm91cCk7XG4gICAgcDMuYXR0YWNoVG9Sb2xlKHJvbGUpO1xuICB9KTtcblxuICB0ZXN0KCdmYWlscyBpZiBcImZvcmNlZFwiIHBvbGljeSBpcyBub3QgYXR0YWNoZWQgdG8gYSBwcmluY2lwYWwnLCAoKSA9PiB7XG4gICAgbmV3IFBvbGljeShzdGFjaywgJ015UG9saWN5JywgeyBmb3JjZTogdHJ1ZSB9KTtcbiAgICBleHBlY3QoKCkgPT4gYXBwLnN5bnRoKCkpLnRvVGhyb3coL2F0dGFjaGVkIHRvIGF0IGxlYXN0IG9uZSBwcmluY2lwYWw6IHVzZXIsIGdyb3VwIG9yIHJvbGUvKTtcbiAgfSk7XG5cbiAgdGVzdChcImdlbmVyYXRlZCBwb2xpY3kgbmFtZSBpcyB0aGUgc2FtZSBhcyB0aGUgbG9naWNhbCBpZCBpZiBpdCdzIHNob3J0ZXIgdGhhbiAxMjggY2hhcmFjdGVyc1wiLCAoKSA9PiB7XG4gICAgY3JlYXRlUG9saWN5V2l0aExvZ2ljYWxJZChzdGFjaywgJ0ZvbycpO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICAnUG9saWN5TmFtZSc6ICdGb28nLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdnZW5lcmF0ZWQgcG9saWN5IG5hbWUgb25seSB1c2VzIHRoZSBsYXN0IDEyOCBjaGFyYWN0ZXJzIG9mIHRoZSBsb2dpY2FsIGlkJywgKCkgPT4ge1xuICAgIGNvbnN0IGxvZ2ljYWxJZDEyOCA9ICdhJyArIGR1cCgxMjggLSAyKSArICdhJztcbiAgICBjb25zdCBsb2dpY2FsSWRPdmVyMTI4ID0gJ1BSRUZJWCcgKyBsb2dpY2FsSWQxMjg7XG5cbiAgICBjcmVhdGVQb2xpY3lXaXRoTG9naWNhbElkKHN0YWNrLCBsb2dpY2FsSWRPdmVyMTI4KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgJ1BvbGljeU5hbWUnOiBsb2dpY2FsSWQxMjgsXG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBkdXAoY291bnQ6IG51bWJlcikge1xuICAgICAgbGV0IHIgPSAnJztcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7ICsraSkge1xuICAgICAgICByICs9ICd4JztcbiAgICAgIH1cbiAgICAgIHJldHVybiByO1xuICAgIH1cbiAgfSk7XG5cbiAgdGVzdCgnZm9yY2U9ZmFsc2UsIGRlcGVuZGVuY3kgb24gZW1wdHkgUG9saWN5IG5ldmVyIG1hdGVyaWFsaXplcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHBvbCA9IG5ldyBQb2xpY3koc3RhY2ssICdQb2wnLCB7IGZvcmNlOiBmYWxzZSB9KTtcblxuICAgIGNvbnN0IHJlcyA9IG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ1Jlc291cmNlJywge1xuICAgICAgdHlwZTogJ1NvbWU6OlJlc291cmNlJyxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICByZXMubm9kZS5hZGREZXBlbmRlbmN5KHBvbCk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgVHlwZTogJ1NvbWU6OlJlc291cmNlJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ZvcmNlPWZhbHNlLCBkZXBlbmRlbmN5IG9uIGF0dGFjaGVkIGFuZCBub24tZW1wdHkgUG9saWN5IGNhbiBiZSB0YWtlbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHBvbCA9IG5ldyBQb2xpY3koc3RhY2ssICdQb2wnLCB7IGZvcmNlOiBmYWxzZSB9KTtcbiAgICBwb2wuYWRkU3RhdGVtZW50cyhuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGFjdGlvbnM6IFsnczM6KiddLFxuICAgICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICB9KSk7XG4gICAgcG9sLmF0dGFjaFRvVXNlcihuZXcgVXNlcihzdGFjaywgJ1VzZXInKSk7XG5cbiAgICBjb25zdCByZXMgPSBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdSZXNvdXJjZScsIHtcbiAgICAgIHR5cGU6ICdTb21lOjpSZXNvdXJjZScsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgcmVzLm5vZGUuYWRkRGVwZW5kZW5jeShwb2wpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ1NvbWU6OlJlc291cmNlJywge1xuICAgICAgVHlwZTogJ1NvbWU6OlJlc291cmNlJyxcbiAgICAgIERlcGVuZHNPbjogWydQb2wwRkU5QUQ1RCddLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdlbXB0eSBwb2xpY3kgaXMgT0sgaWYgZm9yY2U9ZmFsc2UnLCAoKSA9PiB7XG4gICAgbmV3IFBvbGljeShzdGFjaywgJ1BvbCcsIHsgZm9yY2U6IGZhbHNlIH0pO1xuXG4gICAgYXBwLnN5bnRoKCk7XG4gICAgLy8gSWYgd2UgZ290IGhlcmUsIGFsbCBPS1xuICB9KTtcblxuICB0ZXN0KCdyZWFkaW5nIHBvbGljeU5hbWUgZm9yY2VzIGEgUG9saWN5IHRvIG1hdGVyaWFsaXplJywgKCkgPT4ge1xuICAgIGNvbnN0IHBvbCA9IG5ldyBQb2xpY3koc3RhY2ssICdQb2wnLCB7IGZvcmNlOiBmYWxzZSB9KTtcbiAgICBBcnJheS5pc0FycmF5KHBvbC5wb2xpY3lOYW1lKTtcblxuICAgIGV4cGVjdCgoKSA9PiBhcHAuc3ludGgoKSkudG9UaHJvdygvbXVzdCBjb250YWluIGF0IGxlYXN0IG9uZSBzdGF0ZW1lbnQvKTtcbiAgfSk7XG5cbiAgdGVzdCgnZmFpbHMgaWYgcG9saWN5IGRvY3VtZW50IGlzIGludmFsaWQnLCAoKSA9PiB7XG4gICAgbmV3IFBvbGljeShzdGFjaywgJ015Um9sZScsIHtcbiAgICAgIHN0YXRlbWVudHM6IFtuZXcgUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgYWN0aW9uczogWycqJ10sXG4gICAgICAgIHByaW5jaXBhbHM6IFtuZXcgU2VydmljZVByaW5jaXBhbCgndGVzdC5zZXJ2aWNlJyldLFxuICAgICAgfSldLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KCgpID0+IGFwcC5zeW50aCgpKS50b1Rocm93KC9BIFBvbGljeVN0YXRlbWVudCB1c2VkIGluIGFuIGlkZW50aXR5LWJhc2VkIHBvbGljeSBjYW5ub3Qgc3BlY2lmeSBhbnkgSUFNIHByaW5jaXBhbHMvKTtcbiAgfSk7XG5cbiAgdGVzdCgnUG9saWNpZXMgY2FuIGJlIGdyYW50ZWQgcHJpbmNpcGFsIHBlcm1pc3Npb25zJywgKCkgPT4ge1xuICAgIGNvbnN0IHBvbCA9IG5ldyBQb2xpY3koc3RhY2ssICdQb2xpY3knLCB7XG4gICAgICBwb2xpY3lOYW1lOiAnTXlQb2xpY3lOYW1lJyxcbiAgICB9KTtcbiAgICBHcmFudC5hZGRUb1ByaW5jaXBhbCh7IGFjdGlvbnM6IFsnZHVtbXk6QWN0aW9uJ10sIGdyYW50ZWU6IHBvbCwgcmVzb3VyY2VBcm5zOiBbJyonXSB9KTtcbiAgICBwb2wuYXR0YWNoVG9Vc2VyKG5ldyBVc2VyKHN0YWNrLCAnVXNlcicpKTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgUG9saWN5TmFtZTogJ015UG9saWN5TmFtZScsXG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7IEFjdGlvbjogJ2R1bW15OkFjdGlvbicsIEVmZmVjdDogJ0FsbG93JywgUmVzb3VyY2U6ICcqJyB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdhZGRQcmluY2lwYWxPclJlc291cmNlKCkgY29ycmVjdGx5IGdyYW50cyBQb2xpY2llcyBwZXJtaXNzaW9ucycsICgpID0+IHtcbiAgICBjb25zdCBwb2wgPSBuZXcgUG9saWN5KHN0YWNrLCAnUG9saWN5Jywge1xuICAgICAgcG9saWN5TmFtZTogJ015UG9saWN5TmFtZScsXG4gICAgfSk7XG4gICAgcG9sLmF0dGFjaFRvVXNlcihuZXcgVXNlcihzdGFjaywgJ1VzZXInKSk7XG5cbiAgICBjbGFzcyBEdW1teVJlc291cmNlIGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJUmVzb3VyY2VXaXRoUG9saWN5IHtcbiAgICAgIGFkZFRvUmVzb3VyY2VQb2xpY3koX3N0YXRlbWVudDogUG9saWN5U3RhdGVtZW50KTogQWRkVG9QcmluY2lwYWxQb2xpY3lSZXN1bHQge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3Nob3VsZCBub3QgYmUgY2FsbGVkLicpO1xuICAgICAgfVxuICAgIH07XG4gICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgRHVtbXlSZXNvdXJjZShzdGFjaywgJ0R1bW15Jyk7XG4gICAgR3JhbnQuYWRkVG9QcmluY2lwYWxPclJlc291cmNlKHsgYWN0aW9uczogWydkdW1teTpBY3Rpb24nXSwgZ3JhbnRlZTogcG9sLCByZXNvdXJjZSwgcmVzb3VyY2VBcm5zOiBbJyonXSB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgUG9saWN5TmFtZTogJ015UG9saWN5TmFtZScsXG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7IEFjdGlvbjogJ2R1bW15OkFjdGlvbicsIEVmZmVjdDogJ0FsbG93JywgUmVzb3VyY2U6ICcqJyB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdQb2xpY2llcyBjYW5ub3QgYmUgZ3JhbnRlZCBwcmluY2lwYWwgcGVybWlzc2lvbnMgYWNyb3NzIGFjY291bnRzJywgKCkgPT4ge1xuICAgIGNvbnN0IHBvbCA9IG5ldyBQb2xpY3koc3RhY2ssICdQb2xpY3knLCB7XG4gICAgICBwb2xpY3lOYW1lOiAnTXlQb2xpY3lOYW1lJyxcbiAgICB9KTtcblxuICAgIGNsYXNzIER1bW15UmVzb3VyY2UgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElSZXNvdXJjZVdpdGhQb2xpY3kge1xuICAgICAgYWRkVG9SZXNvdXJjZVBvbGljeShfc3RhdGVtZW50OiBQb2xpY3lTdGF0ZW1lbnQpOiBBZGRUb1ByaW5jaXBhbFBvbGljeVJlc3VsdCB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignc2hvdWxkIG5vdCBiZSBjYWxsZWQuJyk7XG4gICAgICB9XG4gICAgfTtcbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBEdW1teVJlc291cmNlKHN0YWNrLCAnRHVtbXknLCB7IGFjY291bnQ6ICc1Njc4JyB9KTtcblxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBHcmFudC5hZGRUb1ByaW5jaXBhbE9yUmVzb3VyY2UoeyBhY3Rpb25zOiBbJ2R1bW15OkFjdGlvbiddLCBncmFudGVlOiBwb2wsIHJlc291cmNlQXJuczogWycqJ10sIHJlc291cmNlIH0pO1xuICAgIH0pLnRvVGhyb3coL0Nhbm5vdCB1c2UgYSBQb2xpY3kgJ015U3RhY2tcXC9Qb2xpY3knLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ1BvbGljaWVzIGNhbm5vdCBiZSBncmFudGVkIHJlc291cmNlIHBlcm1pc3Npb25zJywgKCkgPT4ge1xuICAgIGNvbnN0IHBvbCA9IG5ldyBQb2xpY3koc3RhY2ssICdQb2xpY3knLCB7XG4gICAgICBwb2xpY3lOYW1lOiAnTXlQb2xpY3lOYW1lJyxcbiAgICB9KTtcblxuICAgIGNsYXNzIER1bW15UmVzb3VyY2UgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElSZXNvdXJjZVdpdGhQb2xpY3kge1xuICAgICAgYWRkVG9SZXNvdXJjZVBvbGljeShfc3RhdGVtZW50OiBQb2xpY3lTdGF0ZW1lbnQpOiBBZGRUb1ByaW5jaXBhbFBvbGljeVJlc3VsdCB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignc2hvdWxkIG5vdCBiZSBjYWxsZWQuJyk7XG4gICAgICB9XG4gICAgfTtcbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBEdW1teVJlc291cmNlKHN0YWNrLCAnRHVtbXknKTtcblxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBHcmFudC5hZGRUb1ByaW5jaXBhbEFuZFJlc291cmNlKHsgYWN0aW9uczogWydkdW1teTpBY3Rpb24nXSwgZ3JhbnRlZTogcG9sLCByZXNvdXJjZUFybnM6IFsnKiddLCByZXNvdXJjZSB9KTtcbiAgICB9KS50b1Rocm93KC9DYW5ub3QgdXNlIGEgUG9saWN5ICdNeVN0YWNrXFwvUG9saWN5Jy8pO1xuICB9KTtcbn0pO1xuXG5mdW5jdGlvbiBjcmVhdGVQb2xpY3lXaXRoTG9naWNhbElkKHN0YWNrOiBTdGFjaywgbG9naWNhbElkOiBzdHJpbmcpOiB2b2lkIHtcbiAgY29uc3QgcG9saWN5ID0gbmV3IFBvbGljeShzdGFjaywgbG9naWNhbElkKTtcbiAgY29uc3QgY2ZuUG9saWN5ID0gcG9saWN5Lm5vZGUuZGVmYXVsdENoaWxkIGFzIENmblBvbGljeTtcbiAgY2ZuUG9saWN5Lm92ZXJyaWRlTG9naWNhbElkKGxvZ2ljYWxJZCk7IC8vIGZvcmNlIGEgcGFydGljdWxhciBsb2dpY2FsIElEXG5cbiAgLy8gYWRkIHN0YXRlbWVudHMgJiBwcmluY2lwYWwgdG8gc2F0aXNmeSB2YWxpZGF0aW9uXG4gIHBvbGljeS5hZGRTdGF0ZW1lbnRzKG5ldyBQb2xpY3lTdGF0ZW1lbnQoe1xuICAgIGFjdGlvbnM6IFsnKiddLFxuICAgIHJlc291cmNlczogWycqJ10sXG4gIH0pKTtcbiAgcG9saWN5LmF0dGFjaFRvUm9sZShuZXcgUm9sZShzdGFjaywgJ1JvbGUnLCB7IGFzc3VtZWRCeTogbmV3IEFueVByaW5jaXBhbCgpIH0pKTtcbn1cbiJdfQ==