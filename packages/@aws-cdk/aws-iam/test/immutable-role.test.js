"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const core_1 = require("@aws-cdk/core");
const constructs_1 = require("constructs");
const iam = require("../lib");
/* eslint-disable quote-props */
describe('ImmutableRole', () => {
    let stack;
    let mutableRole;
    let immutableRole;
    beforeEach(() => {
        stack = new core_1.Stack();
        mutableRole = new iam.Role(stack, 'MutableRole', {
            assumedBy: new iam.AnyPrincipal(),
        });
        immutableRole = mutableRole.withoutPolicyUpdates();
    });
    test('ignores calls to attachInlinePolicy', () => {
        const user = new iam.User(stack, 'User');
        const policy = new iam.Policy(stack, 'Policy', {
            statements: [new iam.PolicyStatement({
                    resources: ['*'],
                    actions: ['s3:*'],
                })],
            users: [user],
        });
        immutableRole.attachInlinePolicy(policy);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            'PolicyDocument': {
                'Statement': [
                    {
                        'Action': 's3:*',
                        'Resource': '*',
                        'Effect': 'Allow',
                    },
                ],
                'Version': '2012-10-17',
            },
            'PolicyName': 'Policy23B91518',
            'Users': [
                {
                    'Ref': 'User00B015A1',
                },
            ],
        });
    });
    test('id of mutable role remains unchanged', () => {
        iam.Role.fromRoleName(stack, 'TestRole123', 'my-role');
        expect(stack.node.tryFindChild('TestRole123')).not.toBeUndefined();
        expect(stack.node.tryFindChild('MutableRoleTestRole123')).toBeUndefined();
    });
    test('remains mutable when called multiple times', () => {
        const user = new iam.User(stack, 'User');
        const policy = new iam.Policy(stack, 'Policy', {
            statements: [new iam.PolicyStatement({
                    resources: ['*'],
                    actions: ['s3:*'],
                })],
            users: [user],
        });
        function findRole() {
            const foundRole = stack.node.tryFindChild('MyRole');
            if (foundRole) {
                return foundRole;
            }
            return iam.Role.fromRoleArn(stack, 'MyRole', 'arn:aws:iam::12345:role/role-name', { mutable: false });
        }
        let foundRole = findRole();
        foundRole.attachInlinePolicy(policy);
        foundRole = findRole();
        foundRole.attachInlinePolicy(policy);
        expect(stack.node.tryFindChild('MutableRoleMyRole')).not.toBeUndefined();
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            'PolicyDocument': {
                'Statement': [
                    {
                        'Action': 's3:*',
                        'Resource': '*',
                        'Effect': 'Allow',
                    },
                ],
                'Version': '2012-10-17',
            },
            'PolicyName': 'Policy23B91518',
            'Roles': assertions_1.Match.absent(),
            'Users': [
                {
                    'Ref': 'User00B015A1',
                },
            ],
        });
    });
    test('ignores calls to addManagedPolicy', () => {
        mutableRole.addManagedPolicy({ managedPolicyArn: 'Arn1' });
        immutableRole.addManagedPolicy({ managedPolicyArn: 'Arn2' });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            'ManagedPolicyArns': [
                'Arn1',
            ],
        });
    });
    test('ignores calls to addToPolicy', () => {
        immutableRole.addToPolicy(new iam.PolicyStatement({
            resources: ['*'],
            actions: ['iam:*'],
        }));
        mutableRole.addToPolicy(new iam.PolicyStatement({
            resources: ['*'],
            actions: ['s3:*'],
        }));
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            'PolicyDocument': {
                'Version': '2012-10-17',
                'Statement': [
                    {
                        'Resource': '*',
                        'Action': 's3:*',
                        'Effect': 'Allow',
                    },
                ],
            },
        });
    });
    test('ignores grants', () => {
        iam.Grant.addToPrincipal({
            grantee: immutableRole,
            actions: ['s3:*'],
            resourceArns: ['*'],
        });
        expect(assertions_1.Template.fromStack(stack).findResources('AWS::IAM::Policy', {
            'PolicyDocument': {
                'Statement': [
                    {
                        'Resource': '*',
                        'Action': 's3:*',
                        'Effect': 'Allow',
                    },
                ],
            },
        })).toEqual({});
    });
    // this pattern is used here:
    // aws-codepipeline-actions/lib/cloudformation/pipeline-actions.ts#L517
    test('immutable role is a construct', () => {
        new constructs_1.Construct(immutableRole, 'Child');
        new constructs_1.Construct(mutableRole.withoutPolicyUpdates(), 'Child2');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1tdXRhYmxlLXJvbGUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImltbXV0YWJsZS1yb2xlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBc0Q7QUFDdEQsd0NBQXNDO0FBQ3RDLDJDQUF1QztBQUN2Qyw4QkFBOEI7QUFFOUIsZ0NBQWdDO0FBRWhDLFFBQVEsQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFO0lBQzdCLElBQUksS0FBWSxDQUFDO0lBQ2pCLElBQUksV0FBcUIsQ0FBQztJQUMxQixJQUFJLGFBQXdCLENBQUM7SUFFN0IsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBQ3BCLFdBQVcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRTtZQUMvQyxTQUFTLEVBQUUsSUFBSSxHQUFHLENBQUMsWUFBWSxFQUFFO1NBQ2xDLENBQUMsQ0FBQztRQUNILGFBQWEsR0FBRyxXQUFXLENBQUMsb0JBQW9CLEVBQUUsQ0FBQztJQUNyRCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxxQ0FBcUMsRUFBRSxHQUFHLEVBQUU7UUFDL0MsTUFBTSxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN6QyxNQUFNLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRTtZQUM3QyxVQUFVLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7b0JBQ25DLFNBQVMsRUFBRSxDQUFDLEdBQUcsQ0FBQztvQkFDaEIsT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFDO2lCQUNsQixDQUFDLENBQUM7WUFDSCxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUM7U0FDZCxDQUFDLENBQUM7UUFFSCxhQUFhLENBQUMsa0JBQWtCLENB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QUksQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLEVBQUU7UUFFMUIsR0FBRyxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUM7WUFDdkIsT0FBTyxFQUFFLGFBQWE7WUFDdEIsT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFDO1lBQ2pCLFlBQVksRUFBRSxDQUFDLEdBQUcsQ0FBQztTQUNwQixDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsYUFBYSxDQUFDLGtCQUFrQixFQUFFO1lBQ2pFLGdCQUFnQixFQUFFO2dCQUNoQixXQUFXLEVBQUU7b0JBQ1g7d0JBQ0UsVUFBVSxFQUFFLEdBQUc7d0JBQ2YsUUFBUSxFQUFFLE1BQU07d0JBQ2hCLFFBQVEsRUFBRSxPQUFPO3FCQUNsQjtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2xCLENBQUMsQ0FBQyxDQUFDO0lBRUgsNkJBQTZCO0lBQzdCLHVFQUF1RTtJQUN2RSxJQUFJLENBQUMsK0JBQStCLEVBQUUsR0FBRyxFQUFFO1FBQ3pDLElBQUksc0JBQVMsQ0FBQyxhQUFxQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzlELElBQUksc0JBQVMsQ0FBQyxXQUFXLENBQUMsb0JBQW9CLEVBQTBCLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDdEYsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlLCBNYXRjaCB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0IHsgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJy4uL2xpYic7XG5cbi8qIGVzbGludC1kaXNhYmxlIHF1b3RlLXByb3BzICovXG5cbmRlc2NyaWJlKCdJbW11dGFibGVSb2xlJywgKCkgPT4ge1xuICBsZXQgc3RhY2s6IFN0YWNrO1xuICBsZXQgbXV0YWJsZVJvbGU6IGlhbS5Sb2xlO1xuICBsZXQgaW1tdXRhYmxlUm9sZTogaWFtLklSb2xlO1xuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgbXV0YWJsZVJvbGUgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICdNdXRhYmxlUm9sZScsIHtcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5BbnlQcmluY2lwYWwoKSxcbiAgICB9KTtcbiAgICBpbW11dGFibGVSb2xlID0gbXV0YWJsZVJvbGUud2l0aG91dFBvbGljeVVwZGF0ZXMoKTtcbiAgfSk7XG5cbiAgdGVzdCgnaWdub3JlcyBjYWxscyB0byBhdHRhY2hJbmxpbmVQb2xpY3knLCAoKSA9PiB7XG4gICAgY29uc3QgdXNlciA9IG5ldyBpYW0uVXNlcihzdGFjaywgJ1VzZXInKTtcbiAgICBjb25zdCBwb2xpY3kgPSBuZXcgaWFtLlBvbGljeShzdGFjaywgJ1BvbGljeScsIHtcbiAgICAgIHN0YXRlbWVudHM6IFtuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgICAgIGFjdGlvbnM6IFsnczM6KiddLFxuICAgICAgfSldLFxuICAgICAgdXNlcnM6IFt1c2VyXSxcbiAgICB9KTtcblxuICAgIGltbXV0YWJsZVJvbGUuYXR0YWNoSW5saW5lUG9saWN5KHBvbGljeSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgICdQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnQWN0aW9uJzogJ3MzOionLFxuICAgICAgICAgICAgJ1Jlc291cmNlJzogJyonLFxuICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgJ1ZlcnNpb24nOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgICAgJ1BvbGljeU5hbWUnOiAnUG9saWN5MjNCOTE1MTgnLFxuICAgICAgJ1VzZXJzJzogW1xuICAgICAgICB7XG4gICAgICAgICAgJ1JlZic6ICdVc2VyMDBCMDE1QTEnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnaWQgb2YgbXV0YWJsZSByb2xlIHJlbWFpbnMgdW5jaGFuZ2VkJywgKCkgPT4ge1xuICAgIGlhbS5Sb2xlLmZyb21Sb2xlTmFtZShzdGFjaywgJ1Rlc3RSb2xlMTIzJywgJ215LXJvbGUnKTtcbiAgICBleHBlY3Qoc3RhY2subm9kZS50cnlGaW5kQ2hpbGQoJ1Rlc3RSb2xlMTIzJykpLm5vdC50b0JlVW5kZWZpbmVkKCk7XG4gICAgZXhwZWN0KHN0YWNrLm5vZGUudHJ5RmluZENoaWxkKCdNdXRhYmxlUm9sZVRlc3RSb2xlMTIzJykpLnRvQmVVbmRlZmluZWQoKTtcbiAgfSk7XG5cbiAgdGVzdCgncmVtYWlucyBtdXRhYmxlIHdoZW4gY2FsbGVkIG11bHRpcGxlIHRpbWVzJywgKCkgPT4ge1xuICAgIGNvbnN0IHVzZXIgPSBuZXcgaWFtLlVzZXIoc3RhY2ssICdVc2VyJyk7XG4gICAgY29uc3QgcG9saWN5ID0gbmV3IGlhbS5Qb2xpY3koc3RhY2ssICdQb2xpY3knLCB7XG4gICAgICBzdGF0ZW1lbnRzOiBbbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgICAgICBhY3Rpb25zOiBbJ3MzOionXSxcbiAgICAgIH0pXSxcbiAgICAgIHVzZXJzOiBbdXNlcl0sXG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBmaW5kUm9sZSgpOiBpYW0uSVJvbGUge1xuICAgICAgY29uc3QgZm91bmRSb2xlID0gc3RhY2subm9kZS50cnlGaW5kQ2hpbGQoJ015Um9sZScpIGFzIGlhbS5JUm9sZTtcbiAgICAgIGlmIChmb3VuZFJvbGUpIHtcbiAgICAgICAgcmV0dXJuIGZvdW5kUm9sZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpYW0uUm9sZS5mcm9tUm9sZUFybihzdGFjaywgJ015Um9sZScsICdhcm46YXdzOmlhbTo6MTIzNDU6cm9sZS9yb2xlLW5hbWUnLCB7IG11dGFibGU6IGZhbHNlIH0pO1xuICAgIH1cblxuICAgIGxldCBmb3VuZFJvbGUgPSBmaW5kUm9sZSgpO1xuICAgIGZvdW5kUm9sZS5hdHRhY2hJbmxpbmVQb2xpY3kocG9saWN5KTtcbiAgICBmb3VuZFJvbGUgPSBmaW5kUm9sZSgpO1xuICAgIGZvdW5kUm9sZS5hdHRhY2hJbmxpbmVQb2xpY3kocG9saWN5KTtcblxuICAgIGV4cGVjdChzdGFjay5ub2RlLnRyeUZpbmRDaGlsZCgnTXV0YWJsZVJvbGVNeVJvbGUnKSkubm90LnRvQmVVbmRlZmluZWQoKTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgICdQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnQWN0aW9uJzogJ3MzOionLFxuICAgICAgICAgICAgJ1Jlc291cmNlJzogJyonLFxuICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgJ1ZlcnNpb24nOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgICAgJ1BvbGljeU5hbWUnOiAnUG9saWN5MjNCOTE1MTgnLFxuICAgICAgJ1JvbGVzJzogTWF0Y2guYWJzZW50KCksXG4gICAgICAnVXNlcnMnOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAnUmVmJzogJ1VzZXIwMEIwMTVBMScsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdpZ25vcmVzIGNhbGxzIHRvIGFkZE1hbmFnZWRQb2xpY3knLCAoKSA9PiB7XG4gICAgbXV0YWJsZVJvbGUuYWRkTWFuYWdlZFBvbGljeSh7IG1hbmFnZWRQb2xpY3lBcm46ICdBcm4xJyB9KTtcblxuICAgIGltbXV0YWJsZVJvbGUuYWRkTWFuYWdlZFBvbGljeSh7IG1hbmFnZWRQb2xpY3lBcm46ICdBcm4yJyB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6Um9sZScsIHtcbiAgICAgICdNYW5hZ2VkUG9saWN5QXJucyc6IFtcbiAgICAgICAgJ0FybjEnLFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnaWdub3JlcyBjYWxscyB0byBhZGRUb1BvbGljeScsICgpID0+IHtcbiAgICBpbW11dGFibGVSb2xlLmFkZFRvUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgICBhY3Rpb25zOiBbJ2lhbToqJ10sXG4gICAgfSkpO1xuXG4gICAgbXV0YWJsZVJvbGUuYWRkVG9Qb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICAgIGFjdGlvbnM6IFsnczM6KiddLFxuICAgIH0pKTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgJ1BvbGljeURvY3VtZW50Jzoge1xuICAgICAgICAnVmVyc2lvbic6ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnUmVzb3VyY2UnOiAnKicsXG4gICAgICAgICAgICAnQWN0aW9uJzogJ3MzOionLFxuICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2lnbm9yZXMgZ3JhbnRzJywgKCkgPT4ge1xuXG4gICAgaWFtLkdyYW50LmFkZFRvUHJpbmNpcGFsKHtcbiAgICAgIGdyYW50ZWU6IGltbXV0YWJsZVJvbGUsXG4gICAgICBhY3Rpb25zOiBbJ3MzOionXSxcbiAgICAgIHJlc291cmNlQXJuczogWycqJ10sXG4gICAgfSk7XG5cbiAgICBleHBlY3QoVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5maW5kUmVzb3VyY2VzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgJ1BvbGljeURvY3VtZW50Jzoge1xuICAgICAgICAnU3RhdGVtZW50JzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgICdSZXNvdXJjZSc6ICcqJyxcbiAgICAgICAgICAgICdBY3Rpb24nOiAnczM6KicsXG4gICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KSkudG9FcXVhbCh7fSk7XG4gIH0pO1xuXG4gIC8vIHRoaXMgcGF0dGVybiBpcyB1c2VkIGhlcmU6XG4gIC8vIGF3cy1jb2RlcGlwZWxpbmUtYWN0aW9ucy9saWIvY2xvdWRmb3JtYXRpb24vcGlwZWxpbmUtYWN0aW9ucy50cyNMNTE3XG4gIHRlc3QoJ2ltbXV0YWJsZSByb2xlIGlzIGEgY29uc3RydWN0JywgKCkgPT4ge1xuICAgIG5ldyBDb25zdHJ1Y3QoaW1tdXRhYmxlUm9sZSBhcyB1bmtub3duIGFzIENvbnN0cnVjdCwgJ0NoaWxkJyk7XG4gICAgbmV3IENvbnN0cnVjdChtdXRhYmxlUm9sZS53aXRob3V0UG9saWN5VXBkYXRlcygpIGFzIHVua25vd24gYXMgQ29uc3RydWN0LCAnQ2hpbGQyJyk7XG4gIH0pO1xufSk7XG4iXX0=