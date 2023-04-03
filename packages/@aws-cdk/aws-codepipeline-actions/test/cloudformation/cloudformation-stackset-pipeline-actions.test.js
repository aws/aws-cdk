"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const iam = require("@aws-cdk/aws-iam");
const cdk = require("@aws-cdk/core");
const test_fixture_1 = require("./test-fixture");
const cpactions = require("../../lib");
/* eslint-disable quote-props */
let stack;
let importedAdminRole;
beforeEach(() => {
    stack = new test_fixture_1.TestFixture({
        env: {
            account: '111111111111',
            region: 'us-east-1',
        },
    });
    importedAdminRole = iam.Role.fromRoleArn(stack, 'ChangeSetRole', 'arn:aws:iam::1234:role/ImportedAdminRole');
});
describe('StackSetAction', () => {
    function defaultOpts() {
        return {
            actionName: 'StackSetUpdate',
            description: 'desc',
            stackSetName: 'MyStack',
            cfnCapabilities: [cdk.CfnCapabilities.NAMED_IAM],
            failureTolerancePercentage: 50,
            maxAccountConcurrencyPercentage: 25,
            template: cpactions.StackSetTemplate.fromArtifactPath(stack.sourceOutput.atPath('template.yaml')),
            parameters: cpactions.StackSetParameters.fromArtifactPath(stack.sourceOutput.atPath('parameters.json')),
        };
    }
    ;
    describe('self-managed mode', () => {
        test('creates admin role if not specified', () => {
            stack.deployStage.addAction(new cpactions.CloudFormationDeployStackSetAction({
                ...defaultOpts(),
                stackInstances: cpactions.StackInstances.fromArtifactPath(stack.sourceOutput.atPath('accounts.json'), ['us-east-1', 'us-west-1', 'ca-central-1']),
                deploymentModel: cpactions.StackSetDeploymentModel.selfManaged({
                    executionRoleName: 'Exec',
                }),
            }));
            const template = assertions_1.Template.fromStack(stack);
            template.hasResourceProperties('AWS::IAM::Policy', {
                'PolicyDocument': {
                    'Statement': assertions_1.Match.arrayWith([
                        {
                            'Action': [
                                'cloudformation:CreateStackInstances',
                                'cloudformation:CreateStackSet',
                                'cloudformation:DescribeStackSet',
                                'cloudformation:DescribeStackSetOperation',
                                'cloudformation:ListStackInstances',
                                'cloudformation:UpdateStackSet',
                            ],
                            'Effect': 'Allow',
                            'Resource': {
                                'Fn::Join': ['', [
                                        'arn:',
                                        { 'Ref': 'AWS::Partition' },
                                        ':cloudformation:us-east-1:111111111111:stackset/MyStack:*',
                                    ]],
                            },
                        },
                        {
                            'Action': 'iam:PassRole',
                            'Effect': 'Allow',
                            'Resource': { 'Fn::GetAtt': ['PipelineDeployStackSetUpdateStackSetAdministrationRole183434B0', 'Arn'] },
                        },
                    ]),
                },
                'Roles': [
                    { 'Ref': 'PipelineDeployStackSetUpdateCodePipelineActionRole3EDBB32C' },
                ],
            });
            template.hasResourceProperties('AWS::CodePipeline::Pipeline', {
                'Stages': [
                    { 'Name': 'Source' /* don't care about the rest */ },
                    {
                        'Name': 'Deploy',
                        'Actions': [
                            {
                                'Configuration': {
                                    'StackSetName': 'MyStack',
                                    'Description': 'desc',
                                    'TemplatePath': 'SourceArtifact::template.yaml',
                                    'Parameters': 'SourceArtifact::parameters.json',
                                    'PermissionModel': 'SELF_MANAGED',
                                    'AdministrationRoleArn': { 'Fn::GetAtt': ['PipelineDeployStackSetUpdateStackSetAdministrationRole183434B0', 'Arn'] },
                                    'ExecutionRoleName': 'Exec',
                                    'Capabilities': 'CAPABILITY_NAMED_IAM',
                                    'DeploymentTargets': 'SourceArtifact::accounts.json',
                                    'FailureTolerancePercentage': 50,
                                    'MaxConcurrentPercentage': 25,
                                    'Regions': 'us-east-1,us-west-1,ca-central-1',
                                },
                                'Name': 'StackSetUpdate',
                            },
                        ],
                    },
                ],
            });
            template.hasResourceProperties('AWS::IAM::Policy', {
                'PolicyDocument': {
                    'Statement': [
                        {
                            'Effect': 'Allow',
                            'Action': 'sts:AssumeRole',
                            'Resource': { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::*:role/Exec']] },
                        },
                    ],
                },
            });
        });
        test('passes admin role if specified', () => {
            stack.deployStage.addAction(new cpactions.CloudFormationDeployStackSetAction({
                ...defaultOpts(),
                stackInstances: cpactions.StackInstances.fromArtifactPath(stack.sourceOutput.atPath('accounts.json'), ['us-east-1', 'us-west-1', 'ca-central-1']),
                deploymentModel: cpactions.StackSetDeploymentModel.selfManaged({
                    executionRoleName: 'Exec',
                    administrationRole: importedAdminRole,
                }),
            }));
            const template = assertions_1.Template.fromStack(stack);
            template.hasResourceProperties('AWS::IAM::Policy', {
                'PolicyDocument': {
                    'Statement': [
                        {
                            'Action': [
                                'cloudformation:CreateStackInstances',
                                'cloudformation:CreateStackSet',
                                'cloudformation:DescribeStackSet',
                                'cloudformation:DescribeStackSetOperation',
                                'cloudformation:ListStackInstances',
                                'cloudformation:UpdateStackSet',
                            ],
                            'Effect': 'Allow',
                            'Resource': {
                                'Fn::Join': [
                                    '',
                                    [
                                        'arn:',
                                        { 'Ref': 'AWS::Partition' },
                                        ':cloudformation:us-east-1:111111111111:stackset/MyStack:*',
                                    ],
                                ],
                            },
                        },
                        {
                            'Action': 'iam:PassRole',
                            'Effect': 'Allow',
                            'Resource': 'arn:aws:iam::1234:role/ImportedAdminRole',
                        },
                        {
                            'Action': [
                                's3:GetObject*',
                                's3:GetBucket*',
                                's3:List*',
                            ],
                            'Effect': 'Allow',
                            'Resource': [
                                { 'Fn::GetAtt': ['PipelineArtifactsBucket22248F97', 'Arn'] },
                                {
                                    'Fn::Join': ['', [
                                            { 'Fn::GetAtt': ['PipelineArtifactsBucket22248F97', 'Arn'] },
                                            '/*',
                                        ]],
                                },
                            ],
                        },
                        {
                            'Action': [
                                'kms:Decrypt',
                                'kms:DescribeKey',
                            ],
                            'Effect': 'Allow',
                            'Resource': { 'Fn::GetAtt': ['PipelineArtifactsBucketEncryptionKey01D58D69', 'Arn'] },
                        },
                    ],
                },
                'Roles': [{ 'Ref': 'PipelineDeployStackSetUpdateCodePipelineActionRole3EDBB32C' }],
            });
        });
    });
    test('creates correct resources in organizations mode', () => {
        stack.deployStage.addAction(new cpactions.CloudFormationDeployStackSetAction({
            ...defaultOpts(),
            deploymentModel: cpactions.StackSetDeploymentModel.organizations(),
            stackInstances: cpactions.StackInstances.fromArtifactPath(stack.sourceOutput.atPath('accounts.json'), ['us-east-1', 'us-west-1', 'ca-central-1']),
        }));
        const template = assertions_1.Template.fromStack(stack);
        template.hasResourceProperties('AWS::IAM::Policy', {
            'PolicyDocument': {
                'Statement': assertions_1.Match.arrayWith([
                    {
                        'Action': [
                            'cloudformation:CreateStackInstances',
                            'cloudformation:CreateStackSet',
                            'cloudformation:DescribeStackSet',
                            'cloudformation:DescribeStackSetOperation',
                            'cloudformation:ListStackInstances',
                            'cloudformation:UpdateStackSet',
                        ],
                        'Effect': 'Allow',
                        'Resource': {
                            'Fn::Join': [
                                '',
                                [
                                    'arn:',
                                    { 'Ref': 'AWS::Partition' },
                                    ':cloudformation:us-east-1:111111111111:stackset/MyStack:*',
                                ],
                            ],
                        },
                    },
                ]),
            },
            'Roles': [
                { 'Ref': 'PipelineDeployStackSetUpdateCodePipelineActionRole3EDBB32C' },
            ],
        });
    });
    test('creates correct pipeline resource with target list', () => {
        stack.deployStage.addAction(new cpactions.CloudFormationDeployStackSetAction({
            ...defaultOpts(),
            stackInstances: cpactions.StackInstances.inAccounts(['11111111111', '22222222222'], ['us-east-1', 'us-west-1', 'ca-central-1']),
            deploymentModel: cpactions.StackSetDeploymentModel.selfManaged({
                administrationRole: importedAdminRole,
                executionRoleName: 'Exec',
            }),
        }));
        const template = assertions_1.Template.fromStack(stack);
        template.hasResourceProperties('AWS::CodePipeline::Pipeline', {
            'Stages': [
                { 'Name': 'Source' /* don't care about the rest */ },
                {
                    'Name': 'Deploy',
                    'Actions': [
                        {
                            'Configuration': {
                                'StackSetName': 'MyStack',
                                'Description': 'desc',
                                'TemplatePath': 'SourceArtifact::template.yaml',
                                'Parameters': 'SourceArtifact::parameters.json',
                                'Capabilities': 'CAPABILITY_NAMED_IAM',
                                'DeploymentTargets': '11111111111,22222222222',
                                'FailureTolerancePercentage': 50,
                                'MaxConcurrentPercentage': 25,
                                'Regions': 'us-east-1,us-west-1,ca-central-1',
                            },
                            'InputArtifacts': [{ 'Name': 'SourceArtifact' }],
                            'Name': 'StackSetUpdate',
                        },
                    ],
                },
            ],
        });
    });
    test('creates correct pipeline resource with parameter list', () => {
        stack.deployStage.addAction(new cpactions.CloudFormationDeployStackSetAction({
            ...defaultOpts(),
            parameters: cpactions.StackSetParameters.fromLiteral({
                key0: 'val0',
                key1: 'val1',
            }, ['key2', 'key3']),
            stackInstances: cpactions.StackInstances.fromArtifactPath(stack.sourceOutput.atPath('accounts.json'), ['us-east-1', 'us-west-1', 'ca-central-1']),
            deploymentModel: cpactions.StackSetDeploymentModel.selfManaged({
                administrationRole: importedAdminRole,
                executionRoleName: 'Exec',
            }),
        }));
        const template = assertions_1.Template.fromStack(stack);
        template.hasResourceProperties('AWS::CodePipeline::Pipeline', {
            'Stages': [
                { 'Name': 'Source' /* don't care about the rest */ },
                {
                    'Name': 'Deploy',
                    'Actions': [
                        {
                            'Configuration': {
                                'StackSetName': 'MyStack',
                                'Description': 'desc',
                                'TemplatePath': 'SourceArtifact::template.yaml',
                                'Parameters': 'ParameterKey=key0,ParameterValue=val0 ParameterKey=key1,ParameterValue=val1 ParameterKey=key2,UsePreviousValue=true ParameterKey=key3,UsePreviousValue=true',
                                'Capabilities': 'CAPABILITY_NAMED_IAM',
                                'DeploymentTargets': 'SourceArtifact::accounts.json',
                                'FailureTolerancePercentage': 50,
                                'MaxConcurrentPercentage': 25,
                                'Regions': 'us-east-1,us-west-1,ca-central-1',
                            },
                            'InputArtifacts': [{ 'Name': 'SourceArtifact' }],
                            'Name': 'StackSetUpdate',
                        },
                    ],
                },
            ],
        });
    });
    test('correctly passes region', () => {
        stack.deployStage.addAction(new cpactions.CloudFormationDeployStackSetAction({
            ...defaultOpts(),
            stackSetRegion: 'us-banana-2',
        }));
        const template = assertions_1.Template.fromStack(stack);
        template.hasResourceProperties('AWS::CodePipeline::Pipeline', {
            'Stages': [
                { 'Name': 'Source' /* don't care about the rest */ },
                {
                    'Name': 'Deploy',
                    'Actions': [
                        {
                            'Region': 'us-banana-2',
                        },
                    ],
                },
            ],
        });
    });
});
describe('StackInstancesAction', () => {
    function defaultOpts() {
        return {
            actionName: 'StackInstances',
            stackSetName: 'MyStack',
            failureTolerancePercentage: 50,
            maxAccountConcurrencyPercentage: 25,
        };
    }
    ;
    test('simple', () => {
        stack.deployStage.addAction(new cpactions.CloudFormationDeployStackInstancesAction({
            ...defaultOpts(),
            stackInstances: cpactions.StackInstances.inAccounts(['1234', '5678'], ['us-east-1', 'us-west-1']),
        }));
        const template = assertions_1.Template.fromStack(stack);
        template.hasResourceProperties('AWS::CodePipeline::Pipeline', {
            'Stages': [
                { 'Name': 'Source' /* don't care about the rest */ },
                {
                    'Name': 'Deploy',
                    'Actions': [
                        {
                            'ActionTypeId': {
                                'Category': 'Deploy',
                                'Owner': 'AWS',
                                'Provider': 'CloudFormationStackInstances',
                                'Version': '1',
                            },
                            'Configuration': {
                                'StackSetName': 'MyStack',
                                'FailureTolerancePercentage': 50,
                                'MaxConcurrentPercentage': 25,
                                'DeploymentTargets': '1234,5678',
                                'Regions': 'us-east-1,us-west-1',
                            },
                            'Name': 'StackInstances',
                        },
                    ],
                },
            ],
        });
    });
    test('correctly passes region', () => {
        stack.deployStage.addAction(new cpactions.CloudFormationDeployStackInstancesAction({
            ...defaultOpts(),
            stackSetRegion: 'us-banana-2',
            stackInstances: cpactions.StackInstances.inAccounts(['1'], ['us-east-1']),
        }));
        const template = assertions_1.Template.fromStack(stack);
        template.hasResourceProperties('AWS::CodePipeline::Pipeline', {
            'Stages': [
                { 'Name': 'Source' /* don't care about the rest */ },
                {
                    'Name': 'Deploy',
                    'Actions': [
                        {
                            'Region': 'us-banana-2',
                        },
                    ],
                },
            ],
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xvdWRmb3JtYXRpb24tc3RhY2tzZXQtcGlwZWxpbmUtYWN0aW9ucy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2xvdWRmb3JtYXRpb24tc3RhY2tzZXQtcGlwZWxpbmUtYWN0aW9ucy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQXNEO0FBQ3RELHdDQUF3QztBQUN4QyxxQ0FBcUM7QUFDckMsaURBQTZDO0FBQzdDLHVDQUF1QztBQUN2QyxnQ0FBZ0M7QUFFaEMsSUFBSSxLQUFrQixDQUFDO0FBQ3ZCLElBQUksaUJBQTRCLENBQUM7QUFDakMsVUFBVSxDQUFDLEdBQUcsRUFBRTtJQUNkLEtBQUssR0FBRyxJQUFJLDBCQUFXLENBQUM7UUFDdEIsR0FBRyxFQUFFO1lBQ0gsT0FBTyxFQUFFLGNBQWM7WUFDdkIsTUFBTSxFQUFFLFdBQVc7U0FDcEI7S0FDRixDQUFDLENBQUM7SUFDSCxpQkFBaUIsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsZUFBZSxFQUFFLDBDQUEwQyxDQUFDLENBQUM7QUFDL0csQ0FBQyxDQUFDLENBQUM7QUFFSCxRQUFRLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFO0lBQzlCLFNBQVMsV0FBVztRQUNsQixPQUFPO1lBQ0wsVUFBVSxFQUFFLGdCQUFnQjtZQUM1QixXQUFXLEVBQUUsTUFBTTtZQUNuQixZQUFZLEVBQUUsU0FBUztZQUN2QixlQUFlLEVBQUUsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQztZQUNoRCwwQkFBMEIsRUFBRSxFQUFFO1lBQzlCLCtCQUErQixFQUFFLEVBQUU7WUFDbkMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUNqRyxVQUFVLEVBQUUsU0FBUyxDQUFDLGtCQUFrQixDQUFDLGdCQUFn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LFFBQVEsQ0FBQywrQkFBK0IsRUFBRTtnQkFDcEQ7b0JBQ0UsTUFBTSxFQUFFLFFBQVE7b0JBQ2hCLFNBQVMsRUFBRTt3QkFDVDs0QkFDRSxRQUFRLEVBQUUsYUFBYTt5QkFDeEI7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNYXRjaCwgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IFRlc3RGaXh0dXJlIH0gZnJvbSAnLi90ZXN0LWZpeHR1cmUnO1xuaW1wb3J0ICogYXMgY3BhY3Rpb25zIGZyb20gJy4uLy4uL2xpYic7XG4vKiBlc2xpbnQtZGlzYWJsZSBxdW90ZS1wcm9wcyAqL1xuXG5sZXQgc3RhY2s6IFRlc3RGaXh0dXJlO1xubGV0IGltcG9ydGVkQWRtaW5Sb2xlOiBpYW0uSVJvbGU7XG5iZWZvcmVFYWNoKCgpID0+IHtcbiAgc3RhY2sgPSBuZXcgVGVzdEZpeHR1cmUoe1xuICAgIGVudjoge1xuICAgICAgYWNjb3VudDogJzExMTExMTExMTExMScsXG4gICAgICByZWdpb246ICd1cy1lYXN0LTEnLFxuICAgIH0sXG4gIH0pO1xuICBpbXBvcnRlZEFkbWluUm9sZSA9IGlhbS5Sb2xlLmZyb21Sb2xlQXJuKHN0YWNrLCAnQ2hhbmdlU2V0Um9sZScsICdhcm46YXdzOmlhbTo6MTIzNDpyb2xlL0ltcG9ydGVkQWRtaW5Sb2xlJyk7XG59KTtcblxuZGVzY3JpYmUoJ1N0YWNrU2V0QWN0aW9uJywgKCkgPT4ge1xuICBmdW5jdGlvbiBkZWZhdWx0T3B0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYWN0aW9uTmFtZTogJ1N0YWNrU2V0VXBkYXRlJyxcbiAgICAgIGRlc2NyaXB0aW9uOiAnZGVzYycsXG4gICAgICBzdGFja1NldE5hbWU6ICdNeVN0YWNrJyxcbiAgICAgIGNmbkNhcGFiaWxpdGllczogW2Nkay5DZm5DYXBhYmlsaXRpZXMuTkFNRURfSUFNXSxcbiAgICAgIGZhaWx1cmVUb2xlcmFuY2VQZXJjZW50YWdlOiA1MCxcbiAgICAgIG1heEFjY291bnRDb25jdXJyZW5jeVBlcmNlbnRhZ2U6IDI1LFxuICAgICAgdGVtcGxhdGU6IGNwYWN0aW9ucy5TdGFja1NldFRlbXBsYXRlLmZyb21BcnRpZmFjdFBhdGgoc3RhY2suc291cmNlT3V0cHV0LmF0UGF0aCgndGVtcGxhdGUueWFtbCcpKSxcbiAgICAgIHBhcmFtZXRlcnM6IGNwYWN0aW9ucy5TdGFja1NldFBhcmFtZXRlcnMuZnJvbUFydGlmYWN0UGF0aChzdGFjay5zb3VyY2VPdXRwdXQuYXRQYXRoKCdwYXJhbWV0ZXJzLmpzb24nKSksXG4gICAgfTtcbiAgfTtcblxuICBkZXNjcmliZSgnc2VsZi1tYW5hZ2VkIG1vZGUnLCAoKSA9PiB7XG4gICAgdGVzdCgnY3JlYXRlcyBhZG1pbiByb2xlIGlmIG5vdCBzcGVjaWZpZWQnLCAoKSA9PiB7XG4gICAgICBzdGFjay5kZXBsb3lTdGFnZS5hZGRBY3Rpb24obmV3IGNwYWN0aW9ucy5DbG91ZEZvcm1hdGlvbkRlcGxveVN0YWNrU2V0QWN0aW9uKHtcbiAgICAgICAgLi4uZGVmYXVsdE9wdHMoKSxcbiAgICAgICAgc3RhY2tJbnN0YW5jZXM6IGNwYWN0aW9ucy5TdGFja0luc3RhbmNlcy5mcm9tQXJ0aWZhY3RQYXRoKFxuICAgICAgICAgIHN0YWNrLnNvdXJjZU91dHB1dC5hdFBhdGgoJ2FjY291bnRzLmpzb24nKSxcbiAgICAgICAgICBbJ3VzLWVhc3QtMScsICd1cy13ZXN0LTEnLCAnY2EtY2VudHJhbC0xJ10sXG4gICAgICAgICksXG4gICAgICAgIGRlcGxveW1lbnRNb2RlbDogY3BhY3Rpb25zLlN0YWNrU2V0RGVwbG95bWVudE1vZGVsLnNlbGZNYW5hZ2VkKHtcbiAgICAgICAgICBleGVjdXRpb25Sb2xlTmFtZTogJ0V4ZWMnLFxuICAgICAgICB9KSxcbiAgICAgIH0pKTtcblxuICAgICAgY29uc3QgdGVtcGxhdGUgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICAgICAgdGVtcGxhdGUuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgICAnUG9saWN5RG9jdW1lbnQnOiB7XG4gICAgICAgICAgJ1N0YXRlbWVudCc6IE1hdGNoLmFycmF5V2l0aChbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdBY3Rpb24nOiBbXG4gICAgICAgICAgICAgICAgJ2Nsb3VkZm9ybWF0aW9uOkNyZWF0ZVN0YWNrSW5zdGFuY2VzJyxcbiAgICAgICAgICAgICAgICAnY2xvdWRmb3JtYXRpb246Q3JlYXRlU3RhY2tTZXQnLFxuICAgICAgICAgICAgICAgICdjbG91ZGZvcm1hdGlvbjpEZXNjcmliZVN0YWNrU2V0JyxcbiAgICAgICAgICAgICAgICAnY2xvdWRmb3JtYXRpb246RGVzY3JpYmVTdGFja1NldE9wZXJhdGlvbicsXG4gICAgICAgICAgICAgICAgJ2Nsb3VkZm9ybWF0aW9uOkxpc3RTdGFja0luc3RhbmNlcycsXG4gICAgICAgICAgICAgICAgJ2Nsb3VkZm9ybWF0aW9uOlVwZGF0ZVN0YWNrU2V0JyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAgICdSZXNvdXJjZSc6IHtcbiAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgIHsgJ1JlZic6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgICAgICAgICAgICc6Y2xvdWRmb3JtYXRpb246dXMtZWFzdC0xOjExMTExMTExMTExMTpzdGFja3NldC9NeVN0YWNrOionLFxuICAgICAgICAgICAgICAgIF1dLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0FjdGlvbic6ICdpYW06UGFzc1JvbGUnLFxuICAgICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICAgJ1Jlc291cmNlJzogeyAnRm46OkdldEF0dCc6IFsnUGlwZWxpbmVEZXBsb3lTdGFja1NldFVwZGF0ZVN0YWNrU2V0QWRtaW5pc3RyYXRpb25Sb2xlMTgzNDM0QjAnLCAnQXJuJ10gfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSksXG4gICAgICAgIH0sXG4gICAgICAgICdSb2xlcyc6IFtcbiAgICAgICAgICB7ICdSZWYnOiAnUGlwZWxpbmVEZXBsb3lTdGFja1NldFVwZGF0ZUNvZGVQaXBlbGluZUFjdGlvblJvbGUzRURCQjMyQycgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICB0ZW1wbGF0ZS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZVBpcGVsaW5lOjpQaXBlbGluZScsIHtcbiAgICAgICAgJ1N0YWdlcyc6IFtcbiAgICAgICAgICB7ICdOYW1lJzogJ1NvdXJjZScgLyogZG9uJ3QgY2FyZSBhYm91dCB0aGUgcmVzdCAqLyB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgICdOYW1lJzogJ0RlcGxveScsXG4gICAgICAgICAgICAnQWN0aW9ucyc6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdDb25maWd1cmF0aW9uJzoge1xuICAgICAgICAgICAgICAgICAgJ1N0YWNrU2V0TmFtZSc6ICdNeVN0YWNrJyxcbiAgICAgICAgICAgICAgICAgICdEZXNjcmlwdGlvbic6ICdkZXNjJyxcbiAgICAgICAgICAgICAgICAgICdUZW1wbGF0ZVBhdGgnOiAnU291cmNlQXJ0aWZhY3Q6OnRlbXBsYXRlLnlhbWwnLFxuICAgICAgICAgICAgICAgICAgJ1BhcmFtZXRlcnMnOiAnU291cmNlQXJ0aWZhY3Q6OnBhcmFtZXRlcnMuanNvbicsXG4gICAgICAgICAgICAgICAgICAnUGVybWlzc2lvbk1vZGVsJzogJ1NFTEZfTUFOQUdFRCcsXG4gICAgICAgICAgICAgICAgICAnQWRtaW5pc3RyYXRpb25Sb2xlQXJuJzogeyAnRm46OkdldEF0dCc6IFsnUGlwZWxpbmVEZXBsb3lTdGFja1NldFVwZGF0ZVN0YWNrU2V0QWRtaW5pc3RyYXRpb25Sb2xlMTgzNDM0QjAnLCAnQXJuJ10gfSxcbiAgICAgICAgICAgICAgICAgICdFeGVjdXRpb25Sb2xlTmFtZSc6ICdFeGVjJyxcbiAgICAgICAgICAgICAgICAgICdDYXBhYmlsaXRpZXMnOiAnQ0FQQUJJTElUWV9OQU1FRF9JQU0nLFxuICAgICAgICAgICAgICAgICAgJ0RlcGxveW1lbnRUYXJnZXRzJzogJ1NvdXJjZUFydGlmYWN0OjphY2NvdW50cy5qc29uJyxcbiAgICAgICAgICAgICAgICAgICdGYWlsdXJlVG9sZXJhbmNlUGVyY2VudGFnZSc6IDUwLFxuICAgICAgICAgICAgICAgICAgJ01heENvbmN1cnJlbnRQZXJjZW50YWdlJzogMjUsXG4gICAgICAgICAgICAgICAgICAnUmVnaW9ucyc6ICd1cy1lYXN0LTEsdXMtd2VzdC0xLGNhLWNlbnRyYWwtMScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnTmFtZSc6ICdTdGFja1NldFVwZGF0ZScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgdGVtcGxhdGUuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgICAnUG9saWN5RG9jdW1lbnQnOiB7XG4gICAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAgICdBY3Rpb24nOiAnc3RzOkFzc3VtZVJvbGUnLFxuICAgICAgICAgICAgICAnUmVzb3VyY2UnOiB7ICdGbjo6Sm9pbic6IFsnJywgWydhcm46JywgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSwgJzppYW06Oio6cm9sZS9FeGVjJ11dIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3Bhc3NlcyBhZG1pbiByb2xlIGlmIHNwZWNpZmllZCcsICgpID0+IHtcbiAgICAgIHN0YWNrLmRlcGxveVN0YWdlLmFkZEFjdGlvbihuZXcgY3BhY3Rpb25zLkNsb3VkRm9ybWF0aW9uRGVwbG95U3RhY2tTZXRBY3Rpb24oe1xuICAgICAgICAuLi5kZWZhdWx0T3B0cygpLFxuICAgICAgICBzdGFja0luc3RhbmNlczogY3BhY3Rpb25zLlN0YWNrSW5zdGFuY2VzLmZyb21BcnRpZmFjdFBhdGgoXG4gICAgICAgICAgc3RhY2suc291cmNlT3V0cHV0LmF0UGF0aCgnYWNjb3VudHMuanNvbicpLFxuICAgICAgICAgIFsndXMtZWFzdC0xJywgJ3VzLXdlc3QtMScsICdjYS1jZW50cmFsLTEnXSxcbiAgICAgICAgKSxcbiAgICAgICAgZGVwbG95bWVudE1vZGVsOiBjcGFjdGlvbnMuU3RhY2tTZXREZXBsb3ltZW50TW9kZWwuc2VsZk1hbmFnZWQoe1xuICAgICAgICAgIGV4ZWN1dGlvblJvbGVOYW1lOiAnRXhlYycsXG4gICAgICAgICAgYWRtaW5pc3RyYXRpb25Sb2xlOiBpbXBvcnRlZEFkbWluUm9sZSxcbiAgICAgICAgfSksXG4gICAgICB9KSk7XG5cbiAgICAgIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbiAgICAgIHRlbXBsYXRlLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgICAgJ1BvbGljeURvY3VtZW50Jzoge1xuICAgICAgICAgICdTdGF0ZW1lbnQnOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdBY3Rpb24nOiBbXG4gICAgICAgICAgICAgICAgJ2Nsb3VkZm9ybWF0aW9uOkNyZWF0ZVN0YWNrSW5zdGFuY2VzJyxcbiAgICAgICAgICAgICAgICAnY2xvdWRmb3JtYXRpb246Q3JlYXRlU3RhY2tTZXQnLFxuICAgICAgICAgICAgICAgICdjbG91ZGZvcm1hdGlvbjpEZXNjcmliZVN0YWNrU2V0JyxcbiAgICAgICAgICAgICAgICAnY2xvdWRmb3JtYXRpb246RGVzY3JpYmVTdGFja1NldE9wZXJhdGlvbicsXG4gICAgICAgICAgICAgICAgJ2Nsb3VkZm9ybWF0aW9uOkxpc3RTdGFja0luc3RhbmNlcycsXG4gICAgICAgICAgICAgICAgJ2Nsb3VkZm9ybWF0aW9uOlVwZGF0ZVN0YWNrU2V0JyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAgICdSZXNvdXJjZSc6IHtcbiAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICB7ICdSZWYnOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICAgICAgICAgICAgICc6Y2xvdWRmb3JtYXRpb246dXMtZWFzdC0xOjExMTExMTExMTExMTpzdGFja3NldC9NeVN0YWNrOionLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0FjdGlvbic6ICdpYW06UGFzc1JvbGUnLFxuICAgICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICAgJ1Jlc291cmNlJzogJ2Fybjphd3M6aWFtOjoxMjM0OnJvbGUvSW1wb3J0ZWRBZG1pblJvbGUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0FjdGlvbic6IFtcbiAgICAgICAgICAgICAgICAnczM6R2V0T2JqZWN0KicsXG4gICAgICAgICAgICAgICAgJ3MzOkdldEJ1Y2tldConLFxuICAgICAgICAgICAgICAgICdzMzpMaXN0KicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgICAnUmVzb3VyY2UnOiBbXG4gICAgICAgICAgICAgICAgeyAnRm46OkdldEF0dCc6IFsnUGlwZWxpbmVBcnRpZmFjdHNCdWNrZXQyMjI0OEY5NycsICdBcm4nXSB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFsnJywgW1xuICAgICAgICAgICAgICAgICAgICB7ICdGbjo6R2V0QXR0JzogWydQaXBlbGluZUFydGlmYWN0c0J1Y2tldDIyMjQ4Rjk3JywgJ0FybiddIH0sXG4gICAgICAgICAgICAgICAgICAgICcvKicsXG4gICAgICAgICAgICAgICAgICBdXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0FjdGlvbic6IFtcbiAgICAgICAgICAgICAgICAna21zOkRlY3J5cHQnLFxuICAgICAgICAgICAgICAgICdrbXM6RGVzY3JpYmVLZXknLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICAgJ1Jlc291cmNlJzogeyAnRm46OkdldEF0dCc6IFsnUGlwZWxpbmVBcnRpZmFjdHNCdWNrZXRFbmNyeXB0aW9uS2V5MDFENThENjknLCAnQXJuJ10gfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgJ1JvbGVzJzogW3sgJ1JlZic6ICdQaXBlbGluZURlcGxveVN0YWNrU2V0VXBkYXRlQ29kZVBpcGVsaW5lQWN0aW9uUm9sZTNFREJCMzJDJyB9XSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjcmVhdGVzIGNvcnJlY3QgcmVzb3VyY2VzIGluIG9yZ2FuaXphdGlvbnMgbW9kZScsICgpID0+IHtcbiAgICBzdGFjay5kZXBsb3lTdGFnZS5hZGRBY3Rpb24obmV3IGNwYWN0aW9ucy5DbG91ZEZvcm1hdGlvbkRlcGxveVN0YWNrU2V0QWN0aW9uKHtcbiAgICAgIC4uLmRlZmF1bHRPcHRzKCksXG4gICAgICBkZXBsb3ltZW50TW9kZWw6IGNwYWN0aW9ucy5TdGFja1NldERlcGxveW1lbnRNb2RlbC5vcmdhbml6YXRpb25zKCksXG4gICAgICBzdGFja0luc3RhbmNlczogY3BhY3Rpb25zLlN0YWNrSW5zdGFuY2VzLmZyb21BcnRpZmFjdFBhdGgoXG4gICAgICAgIHN0YWNrLnNvdXJjZU91dHB1dC5hdFBhdGgoJ2FjY291bnRzLmpzb24nKSxcbiAgICAgICAgWyd1cy1lYXN0LTEnLCAndXMtd2VzdC0xJywgJ2NhLWNlbnRyYWwtMSddLFxuICAgICAgKSxcbiAgICB9KSk7XG5cbiAgICBjb25zdCB0ZW1wbGF0ZSA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG4gICAgdGVtcGxhdGUuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgJ1BvbGljeURvY3VtZW50Jzoge1xuICAgICAgICAnU3RhdGVtZW50JzogTWF0Y2guYXJyYXlXaXRoKFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnQWN0aW9uJzogW1xuICAgICAgICAgICAgICAnY2xvdWRmb3JtYXRpb246Q3JlYXRlU3RhY2tJbnN0YW5jZXMnLFxuICAgICAgICAgICAgICAnY2xvdWRmb3JtYXRpb246Q3JlYXRlU3RhY2tTZXQnLFxuICAgICAgICAgICAgICAnY2xvdWRmb3JtYXRpb246RGVzY3JpYmVTdGFja1NldCcsXG4gICAgICAgICAgICAgICdjbG91ZGZvcm1hdGlvbjpEZXNjcmliZVN0YWNrU2V0T3BlcmF0aW9uJyxcbiAgICAgICAgICAgICAgJ2Nsb3VkZm9ybWF0aW9uOkxpc3RTdGFja0luc3RhbmNlcycsXG4gICAgICAgICAgICAgICdjbG91ZGZvcm1hdGlvbjpVcGRhdGVTdGFja1NldCcsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAnUmVzb3VyY2UnOiB7XG4gICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICB7ICdSZWYnOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICAgICAgICAgICAnOmNsb3VkZm9ybWF0aW9uOnVzLWVhc3QtMToxMTExMTExMTExMTE6c3RhY2tzZXQvTXlTdGFjazoqJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdKSxcbiAgICAgIH0sXG4gICAgICAnUm9sZXMnOiBbXG4gICAgICAgIHsgJ1JlZic6ICdQaXBlbGluZURlcGxveVN0YWNrU2V0VXBkYXRlQ29kZVBpcGVsaW5lQWN0aW9uUm9sZTNFREJCMzJDJyB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY3JlYXRlcyBjb3JyZWN0IHBpcGVsaW5lIHJlc291cmNlIHdpdGggdGFyZ2V0IGxpc3QnLCAoKSA9PiB7XG4gICAgc3RhY2suZGVwbG95U3RhZ2UuYWRkQWN0aW9uKG5ldyBjcGFjdGlvbnMuQ2xvdWRGb3JtYXRpb25EZXBsb3lTdGFja1NldEFjdGlvbih7XG4gICAgICAuLi5kZWZhdWx0T3B0cygpLFxuICAgICAgc3RhY2tJbnN0YW5jZXM6IGNwYWN0aW9ucy5TdGFja0luc3RhbmNlcy5pbkFjY291bnRzKFxuICAgICAgICBbJzExMTExMTExMTExJywgJzIyMjIyMjIyMjIyJ10sXG4gICAgICAgIFsndXMtZWFzdC0xJywgJ3VzLXdlc3QtMScsICdjYS1jZW50cmFsLTEnXSxcbiAgICAgICksXG4gICAgICBkZXBsb3ltZW50TW9kZWw6IGNwYWN0aW9ucy5TdGFja1NldERlcGxveW1lbnRNb2RlbC5zZWxmTWFuYWdlZCh7XG4gICAgICAgIGFkbWluaXN0cmF0aW9uUm9sZTogaW1wb3J0ZWRBZG1pblJvbGUsXG4gICAgICAgIGV4ZWN1dGlvblJvbGVOYW1lOiAnRXhlYycsXG4gICAgICB9KSxcbiAgICB9KSk7XG5cbiAgICBjb25zdCB0ZW1wbGF0ZSA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG4gICAgdGVtcGxhdGUuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVQaXBlbGluZTo6UGlwZWxpbmUnLCB7XG4gICAgICAnU3RhZ2VzJzogW1xuICAgICAgICB7ICdOYW1lJzogJ1NvdXJjZScgLyogZG9uJ3QgY2FyZSBhYm91dCB0aGUgcmVzdCAqLyB9LFxuICAgICAgICB7XG4gICAgICAgICAgJ05hbWUnOiAnRGVwbG95JyxcbiAgICAgICAgICAnQWN0aW9ucyc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0NvbmZpZ3VyYXRpb24nOiB7XG4gICAgICAgICAgICAgICAgJ1N0YWNrU2V0TmFtZSc6ICdNeVN0YWNrJyxcbiAgICAgICAgICAgICAgICAnRGVzY3JpcHRpb24nOiAnZGVzYycsXG4gICAgICAgICAgICAgICAgJ1RlbXBsYXRlUGF0aCc6ICdTb3VyY2VBcnRpZmFjdDo6dGVtcGxhdGUueWFtbCcsXG4gICAgICAgICAgICAgICAgJ1BhcmFtZXRlcnMnOiAnU291cmNlQXJ0aWZhY3Q6OnBhcmFtZXRlcnMuanNvbicsXG4gICAgICAgICAgICAgICAgJ0NhcGFiaWxpdGllcyc6ICdDQVBBQklMSVRZX05BTUVEX0lBTScsXG4gICAgICAgICAgICAgICAgJ0RlcGxveW1lbnRUYXJnZXRzJzogJzExMTExMTExMTExLDIyMjIyMjIyMjIyJyxcbiAgICAgICAgICAgICAgICAnRmFpbHVyZVRvbGVyYW5jZVBlcmNlbnRhZ2UnOiA1MCxcbiAgICAgICAgICAgICAgICAnTWF4Q29uY3VycmVudFBlcmNlbnRhZ2UnOiAyNSxcbiAgICAgICAgICAgICAgICAnUmVnaW9ucyc6ICd1cy1lYXN0LTEsdXMtd2VzdC0xLGNhLWNlbnRyYWwtMScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICdJbnB1dEFydGlmYWN0cyc6IFt7ICdOYW1lJzogJ1NvdXJjZUFydGlmYWN0JyB9XSxcbiAgICAgICAgICAgICAgJ05hbWUnOiAnU3RhY2tTZXRVcGRhdGUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY3JlYXRlcyBjb3JyZWN0IHBpcGVsaW5lIHJlc291cmNlIHdpdGggcGFyYW1ldGVyIGxpc3QnLCAoKSA9PiB7XG4gICAgc3RhY2suZGVwbG95U3RhZ2UuYWRkQWN0aW9uKG5ldyBjcGFjdGlvbnMuQ2xvdWRGb3JtYXRpb25EZXBsb3lTdGFja1NldEFjdGlvbih7XG4gICAgICAuLi5kZWZhdWx0T3B0cygpLFxuICAgICAgcGFyYW1ldGVyczogY3BhY3Rpb25zLlN0YWNrU2V0UGFyYW1ldGVycy5mcm9tTGl0ZXJhbCh7XG4gICAgICAgIGtleTA6ICd2YWwwJyxcbiAgICAgICAga2V5MTogJ3ZhbDEnLFxuICAgICAgfSwgWydrZXkyJywgJ2tleTMnXSksXG4gICAgICBzdGFja0luc3RhbmNlczogY3BhY3Rpb25zLlN0YWNrSW5zdGFuY2VzLmZyb21BcnRpZmFjdFBhdGgoXG4gICAgICAgIHN0YWNrLnNvdXJjZU91dHB1dC5hdFBhdGgoJ2FjY291bnRzLmpzb24nKSxcbiAgICAgICAgWyd1cy1lYXN0LTEnLCAndXMtd2VzdC0xJywgJ2NhLWNlbnRyYWwtMSddLFxuICAgICAgKSxcbiAgICAgIGRlcGxveW1lbnRNb2RlbDogY3BhY3Rpb25zLlN0YWNrU2V0RGVwbG95bWVudE1vZGVsLnNlbGZNYW5hZ2VkKHtcbiAgICAgICAgYWRtaW5pc3RyYXRpb25Sb2xlOiBpbXBvcnRlZEFkbWluUm9sZSxcbiAgICAgICAgZXhlY3V0aW9uUm9sZU5hbWU6ICdFeGVjJyxcbiAgICAgIH0pLFxuICAgIH0pKTtcblxuICAgIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbiAgICB0ZW1wbGF0ZS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZVBpcGVsaW5lOjpQaXBlbGluZScsIHtcbiAgICAgICdTdGFnZXMnOiBbXG4gICAgICAgIHsgJ05hbWUnOiAnU291cmNlJyAvKiBkb24ndCBjYXJlIGFib3V0IHRoZSByZXN0ICovIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAnTmFtZSc6ICdEZXBsb3knLFxuICAgICAgICAgICdBY3Rpb25zJzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnQ29uZmlndXJhdGlvbic6IHtcbiAgICAgICAgICAgICAgICAnU3RhY2tTZXROYW1lJzogJ015U3RhY2snLFxuICAgICAgICAgICAgICAgICdEZXNjcmlwdGlvbic6ICdkZXNjJyxcbiAgICAgICAgICAgICAgICAnVGVtcGxhdGVQYXRoJzogJ1NvdXJjZUFydGlmYWN0Ojp0ZW1wbGF0ZS55YW1sJyxcbiAgICAgICAgICAgICAgICAnUGFyYW1ldGVycyc6ICdQYXJhbWV0ZXJLZXk9a2V5MCxQYXJhbWV0ZXJWYWx1ZT12YWwwIFBhcmFtZXRlcktleT1rZXkxLFBhcmFtZXRlclZhbHVlPXZhbDEgUGFyYW1ldGVyS2V5PWtleTIsVXNlUHJldmlvdXNWYWx1ZT10cnVlIFBhcmFtZXRlcktleT1rZXkzLFVzZVByZXZpb3VzVmFsdWU9dHJ1ZScsXG4gICAgICAgICAgICAgICAgJ0NhcGFiaWxpdGllcyc6ICdDQVBBQklMSVRZX05BTUVEX0lBTScsXG4gICAgICAgICAgICAgICAgJ0RlcGxveW1lbnRUYXJnZXRzJzogJ1NvdXJjZUFydGlmYWN0OjphY2NvdW50cy5qc29uJyxcbiAgICAgICAgICAgICAgICAnRmFpbHVyZVRvbGVyYW5jZVBlcmNlbnRhZ2UnOiA1MCxcbiAgICAgICAgICAgICAgICAnTWF4Q29uY3VycmVudFBlcmNlbnRhZ2UnOiAyNSxcbiAgICAgICAgICAgICAgICAnUmVnaW9ucyc6ICd1cy1lYXN0LTEsdXMtd2VzdC0xLGNhLWNlbnRyYWwtMScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICdJbnB1dEFydGlmYWN0cyc6IFt7ICdOYW1lJzogJ1NvdXJjZUFydGlmYWN0JyB9XSxcbiAgICAgICAgICAgICAgJ05hbWUnOiAnU3RhY2tTZXRVcGRhdGUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY29ycmVjdGx5IHBhc3NlcyByZWdpb24nLCAoKSA9PiB7XG4gICAgc3RhY2suZGVwbG95U3RhZ2UuYWRkQWN0aW9uKG5ldyBjcGFjdGlvbnMuQ2xvdWRGb3JtYXRpb25EZXBsb3lTdGFja1NldEFjdGlvbih7XG4gICAgICAuLi5kZWZhdWx0T3B0cygpLFxuICAgICAgc3RhY2tTZXRSZWdpb246ICd1cy1iYW5hbmEtMicsXG4gICAgfSkpO1xuXG4gICAgY29uc3QgdGVtcGxhdGUgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICAgIHRlbXBsYXRlLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlUGlwZWxpbmU6OlBpcGVsaW5lJywge1xuICAgICAgJ1N0YWdlcyc6IFtcbiAgICAgICAgeyAnTmFtZSc6ICdTb3VyY2UnIC8qIGRvbid0IGNhcmUgYWJvdXQgdGhlIHJlc3QgKi8gfSxcbiAgICAgICAge1xuICAgICAgICAgICdOYW1lJzogJ0RlcGxveScsXG4gICAgICAgICAgJ0FjdGlvbnMnOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdSZWdpb24nOiAndXMtYmFuYW5hLTInLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ1N0YWNrSW5zdGFuY2VzQWN0aW9uJywgKCkgPT4ge1xuICBmdW5jdGlvbiBkZWZhdWx0T3B0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYWN0aW9uTmFtZTogJ1N0YWNrSW5zdGFuY2VzJyxcbiAgICAgIHN0YWNrU2V0TmFtZTogJ015U3RhY2snLFxuICAgICAgZmFpbHVyZVRvbGVyYW5jZVBlcmNlbnRhZ2U6IDUwLFxuICAgICAgbWF4QWNjb3VudENvbmN1cnJlbmN5UGVyY2VudGFnZTogMjUsXG4gICAgfTtcbiAgfTtcblxuICB0ZXN0KCdzaW1wbGUnLCAoKSA9PiB7XG4gICAgc3RhY2suZGVwbG95U3RhZ2UuYWRkQWN0aW9uKG5ldyBjcGFjdGlvbnMuQ2xvdWRGb3JtYXRpb25EZXBsb3lTdGFja0luc3RhbmNlc0FjdGlvbih7XG4gICAgICAuLi5kZWZhdWx0T3B0cygpLFxuICAgICAgc3RhY2tJbnN0YW5jZXM6IGNwYWN0aW9ucy5TdGFja0luc3RhbmNlcy5pbkFjY291bnRzKFxuICAgICAgICBbJzEyMzQnLCAnNTY3OCddLFxuICAgICAgICBbJ3VzLWVhc3QtMScsICd1cy13ZXN0LTEnXSxcbiAgICAgICksXG4gICAgfSkpO1xuXG4gICAgY29uc3QgdGVtcGxhdGUgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICAgIHRlbXBsYXRlLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlUGlwZWxpbmU6OlBpcGVsaW5lJywge1xuICAgICAgJ1N0YWdlcyc6IFtcbiAgICAgICAgeyAnTmFtZSc6ICdTb3VyY2UnIC8qIGRvbid0IGNhcmUgYWJvdXQgdGhlIHJlc3QgKi8gfSxcbiAgICAgICAge1xuICAgICAgICAgICdOYW1lJzogJ0RlcGxveScsXG4gICAgICAgICAgJ0FjdGlvbnMnOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdBY3Rpb25UeXBlSWQnOiB7XG4gICAgICAgICAgICAgICAgJ0NhdGVnb3J5JzogJ0RlcGxveScsXG4gICAgICAgICAgICAgICAgJ093bmVyJzogJ0FXUycsXG4gICAgICAgICAgICAgICAgJ1Byb3ZpZGVyJzogJ0Nsb3VkRm9ybWF0aW9uU3RhY2tJbnN0YW5jZXMnLFxuICAgICAgICAgICAgICAgICdWZXJzaW9uJzogJzEnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnQ29uZmlndXJhdGlvbic6IHtcbiAgICAgICAgICAgICAgICAnU3RhY2tTZXROYW1lJzogJ015U3RhY2snLFxuICAgICAgICAgICAgICAgICdGYWlsdXJlVG9sZXJhbmNlUGVyY2VudGFnZSc6IDUwLFxuICAgICAgICAgICAgICAgICdNYXhDb25jdXJyZW50UGVyY2VudGFnZSc6IDI1LFxuICAgICAgICAgICAgICAgICdEZXBsb3ltZW50VGFyZ2V0cyc6ICcxMjM0LDU2NzgnLFxuICAgICAgICAgICAgICAgICdSZWdpb25zJzogJ3VzLWVhc3QtMSx1cy13ZXN0LTEnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnTmFtZSc6ICdTdGFja0luc3RhbmNlcycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjb3JyZWN0bHkgcGFzc2VzIHJlZ2lvbicsICgpID0+IHtcbiAgICBzdGFjay5kZXBsb3lTdGFnZS5hZGRBY3Rpb24obmV3IGNwYWN0aW9ucy5DbG91ZEZvcm1hdGlvbkRlcGxveVN0YWNrSW5zdGFuY2VzQWN0aW9uKHtcbiAgICAgIC4uLmRlZmF1bHRPcHRzKCksXG4gICAgICBzdGFja1NldFJlZ2lvbjogJ3VzLWJhbmFuYS0yJyxcbiAgICAgIHN0YWNrSW5zdGFuY2VzOiBjcGFjdGlvbnMuU3RhY2tJbnN0YW5jZXMuaW5BY2NvdW50cyhbJzEnXSwgWyd1cy1lYXN0LTEnXSksXG4gICAgfSkpO1xuXG4gICAgY29uc3QgdGVtcGxhdGUgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICAgIHRlbXBsYXRlLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlUGlwZWxpbmU6OlBpcGVsaW5lJywge1xuICAgICAgJ1N0YWdlcyc6IFtcbiAgICAgICAgeyAnTmFtZSc6ICdTb3VyY2UnIC8qIGRvbid0IGNhcmUgYWJvdXQgdGhlIHJlc3QgKi8gfSxcbiAgICAgICAge1xuICAgICAgICAgICdOYW1lJzogJ0RlcGxveScsXG4gICAgICAgICAgJ0FjdGlvbnMnOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdSZWdpb24nOiAndXMtYmFuYW5hLTInLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==