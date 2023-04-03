"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const codebuild = require("@aws-cdk/aws-codebuild");
const codecommit = require("@aws-cdk/aws-codecommit");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const aws_iam_1 = require("@aws-cdk/aws-iam");
const cdk = require("@aws-cdk/core");
const test_fixture_1 = require("./test-fixture");
const cpactions = require("../../lib");
/* eslint-disable quote-props */
describe('CloudFormation Pipeline Actions', () => {
    test('CreateChangeSetAction can be used to make a change set from a CodePipeline', () => {
        const stack = new cdk.Stack();
        const pipeline = new codepipeline.Pipeline(stack, 'MagicPipeline');
        const changeSetExecRole = new aws_iam_1.Role(stack, 'ChangeSetRole', {
            assumedBy: new aws_iam_1.ServicePrincipal('cloudformation.amazonaws.com'),
        });
        /** Source! */
        const repo = new codecommit.Repository(stack, 'MyVeryImportantRepo', {
            repositoryName: 'my-very-important-repo',
        });
        const sourceOutput = new codepipeline.Artifact('SourceArtifact');
        const source = new cpactions.CodeCommitSourceAction({
            actionName: 'source',
            output: sourceOutput,
            repository: repo,
            trigger: cpactions.CodeCommitTrigger.POLL,
        });
        pipeline.addStage({
            stageName: 'source',
            actions: [source],
        });
        /** Build! */
        const project = new codebuild.PipelineProject(stack, 'MyBuildProject');
        const buildOutput = new codepipeline.Artifact('OutputYo');
        const buildAction = new cpactions.CodeBuildAction({
            actionName: 'build',
            project,
            input: sourceOutput,
            outputs: [buildOutput],
        });
        pipeline.addStage({
            stageName: 'build',
            actions: [buildAction],
        });
        /** Deploy! */
        // To execute a change set - yes, you probably do need *:* 🤷‍♀️
        changeSetExecRole.addToPolicy(new aws_iam_1.PolicyStatement({ resources: ['*'], actions: ['*'] }));
        const stackName = 'BrelandsStack';
        const changeSetName = 'MyMagicalChangeSet';
        pipeline.addStage({
            stageName: 'prod',
            actions: [
                new cpactions.CloudFormationCreateReplaceChangeSetAction({
                    actionName: 'BuildChangeSetProd',
                    stackName,
                    changeSetName,
                    deploymentRole: changeSetExecRole,
                    templatePath: new codepipeline.ArtifactPath(buildOutput, 'template.yaml'),
                    templateConfiguration: new codepipeline.ArtifactPath(buildOutput, 'templateConfig.json'),
                    adminPermissions: false,
                }),
                new cpactions.CloudFormationExecuteChangeSetAction({
                    actionName: 'ExecuteChangeSetProd',
                    stackName,
                    changeSetName,
                }),
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
            'ArtifactStore': {
                'Location': {
                    'Ref': 'MagicPipelineArtifactsBucket212FE7BF',
                },
                'Type': 'S3',
            },
            'RoleArn': {
                'Fn::GetAtt': ['MagicPipelineRoleFB2BD6DE',
                    'Arn'],
            },
            'Stages': [{
                    'Actions': [
                        {
                            'ActionTypeId': {
                                'Category': 'Source',
                                'Owner': 'AWS',
                                'Provider': 'CodeCommit',
                                'Version': '1',
                            },
                            'Configuration': {
                                'RepositoryName': {
                                    'Fn::GetAtt': [
                                        'MyVeryImportantRepo11BC3EBD',
                                        'Name',
                                    ],
                                },
                                'BranchName': 'master',
                                'PollForSourceChanges': true,
                            },
                            'Name': 'source',
                            'OutputArtifacts': [
                                {
                                    'Name': 'SourceArtifact',
                                },
                            ],
                            'RunOrder': 1,
                        },
                    ],
                    'Name': 'source',
                },
                {
                    'Actions': [
                        {
                            'ActionTypeId': {
                                'Category': 'Build',
                                'Owner': 'AWS',
                                'Provider': 'CodeBuild',
                                'Version': '1',
                            },
                            'Configuration': {
                                'ProjectName': {
                                    'Ref': 'MyBuildProject30DB9D6E',
                                },
                            },
                            'InputArtifacts': [
                                {
                                    'Name': 'SourceArtifact',
                                },
                            ],
                            'Name': 'build',
                            'OutputArtifacts': [
                                {
                                    'Name': 'OutputYo',
                                },
                            ],
                            'RunOrder': 1,
                        },
                    ],
                    'Name': 'build',
                },
                {
                    'Actions': [
                        {
                            'ActionTypeId': {
                                'Category': 'Deploy',
                                'Owner': 'AWS',
                                'Provider': 'CloudFormation',
                                'Version': '1',
                            },
                            'Configuration': {
                                'ActionMode': 'CHANGE_SET_REPLACE',
                                'ChangeSetName': 'MyMagicalChangeSet',
                                'RoleArn': {
                                    'Fn::GetAtt': [
                                        'ChangeSetRole0BCF99E6',
                                        'Arn',
                                    ],
                                },
                                'StackName': 'BrelandsStack',
                                'TemplatePath': 'OutputYo::template.yaml',
                                'TemplateConfiguration': 'OutputYo::templateConfig.json',
                            },
                            'InputArtifacts': [{ 'Name': 'OutputYo' }],
                            'Name': 'BuildChangeSetProd',
                            'RunOrder': 1,
                        },
                        {
                            'ActionTypeId': {
                                'Category': 'Deploy',
                                'Owner': 'AWS',
                                'Provider': 'CloudFormation',
                                'Version': '1',
                            },
                            'Configuration': {
                                'ActionMode': 'CHANGE_SET_EXECUTE',
                                'ChangeSetName': 'MyMagicalChangeSet',
                            },
                            'Name': 'ExecuteChangeSetProd',
                            'RunOrder': 1,
                        },
                    ],
                    'Name': 'prod',
                }],
        });
    });
    test('fullPermissions leads to admin role and full IAM capabilities with pipeline bucket+key read permissions', () => {
        // GIVEN
        const stack = new test_fixture_1.TestFixture();
        // WHEN
        stack.deployStage.addAction(new cpactions.CloudFormationCreateUpdateStackAction({
            actionName: 'CreateUpdate',
            stackName: 'MyStack',
            templatePath: stack.sourceOutput.atPath('template.yaml'),
            adminPermissions: true,
        }));
        const roleId = 'PipelineDeployCreateUpdateRole515CB7D4';
        // THEN: Action in Pipeline has named IAM capabilities
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
            'Stages': [
                { 'Name': 'Source' /* don't care about the rest */ },
                {
                    'Name': 'Deploy',
                    'Actions': [
                        {
                            'Configuration': {
                                'Capabilities': 'CAPABILITY_NAMED_IAM',
                                'RoleArn': { 'Fn::GetAtt': [roleId, 'Arn'] },
                                'ActionMode': 'CREATE_UPDATE',
                                'StackName': 'MyStack',
                                'TemplatePath': 'SourceArtifact::template.yaml',
                            },
                            'InputArtifacts': [{ 'Name': 'SourceArtifact' }],
                            'Name': 'CreateUpdate',
                        },
                    ],
                },
            ],
        });
        // THEN: Role is created with full permissions
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        'Action': [
                            's3:GetObject*',
                            's3:GetBucket*',
                            's3:List*',
                        ],
                        'Effect': 'Allow',
                    },
                    {
                        'Action': [
                            'kms:Decrypt',
                            'kms:DescribeKey',
                        ],
                        'Effect': 'Allow',
                    },
                    {
                        Action: '*',
                        Effect: 'Allow',
                        Resource: '*',
                    },
                ],
            },
            Roles: [{ Ref: roleId }],
        });
    });
    test('outputFileName leads to creation of output artifact', () => {
        // GIVEN
        const stack = new test_fixture_1.TestFixture();
        // WHEN
        stack.deployStage.addAction(new cpactions.CloudFormationCreateUpdateStackAction({
            actionName: 'CreateUpdate',
            stackName: 'MyStack',
            templatePath: stack.sourceOutput.atPath('template.yaml'),
            outputFileName: 'CreateResponse.json',
            adminPermissions: false,
        }));
        // THEN: Action has output artifacts
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
            'Stages': [
                { 'Name': 'Source' /* don't care about the rest */ },
                {
                    'Name': 'Deploy',
                    'Actions': [
                        {
                            'OutputArtifacts': [{ 'Name': 'CreateUpdate_MyStack_Artifact' }],
                            'Name': 'CreateUpdate',
                        },
                    ],
                },
            ],
        });
    });
    test('replaceOnFailure switches action type', () => {
        // GIVEN
        const stack = new test_fixture_1.TestFixture();
        // WHEN
        stack.deployStage.addAction(new cpactions.CloudFormationCreateUpdateStackAction({
            actionName: 'CreateUpdate',
            stackName: 'MyStack',
            templatePath: stack.sourceOutput.atPath('template.yaml'),
            replaceOnFailure: true,
            adminPermissions: false,
        }));
        // THEN: Action has output artifacts
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
            'Stages': [
                { 'Name': 'Source' /* don't care about the rest */ },
                {
                    'Name': 'Deploy',
                    'Actions': [
                        {
                            'Configuration': {
                                'ActionMode': 'REPLACE_ON_FAILURE',
                            },
                            'Name': 'CreateUpdate',
                        },
                    ],
                },
            ],
        });
    });
    test('parameterOverrides are serialized as a string', () => {
        // GIVEN
        const stack = new test_fixture_1.TestFixture();
        // WHEN
        stack.deployStage.addAction(new cpactions.CloudFormationCreateUpdateStackAction({
            actionName: 'CreateUpdate',
            stackName: 'MyStack',
            templatePath: stack.sourceOutput.atPath('template.yaml'),
            adminPermissions: false,
            parameterOverrides: {
                RepoName: stack.repo.repositoryName,
            },
        }));
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
            'Stages': [
                { 'Name': 'Source' /* don't care about the rest */ },
                {
                    'Name': 'Deploy',
                    'Actions': [
                        {
                            'Configuration': {
                                'ParameterOverrides': {
                                    'Fn::Join': ['', [
                                            '{"RepoName":"',
                                            { 'Fn::GetAtt': ['MyVeryImportantRepo11BC3EBD', 'Name'] },
                                            '"}',
                                        ]],
                                },
                            },
                            'Name': 'CreateUpdate',
                        },
                    ],
                },
            ],
        });
    });
    test('Action service role is passed to template', () => {
        const stack = new test_fixture_1.TestFixture();
        const importedRole = aws_iam_1.Role.fromRoleArn(stack, 'ImportedRole', 'arn:aws:iam::000000000000:role/action-role');
        const freshRole = new aws_iam_1.Role(stack, 'FreshRole', {
            assumedBy: new aws_iam_1.ServicePrincipal('magicservice'),
        });
        stack.deployStage.addAction(new cpactions.CloudFormationExecuteChangeSetAction({
            actionName: 'ImportedRoleAction',
            role: importedRole,
            changeSetName: 'magicSet',
            stackName: 'magicStack',
        }));
        stack.deployStage.addAction(new cpactions.CloudFormationExecuteChangeSetAction({
            actionName: 'FreshRoleAction',
            role: freshRole,
            changeSetName: 'magicSet',
            stackName: 'magicStack',
        }));
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
            'Stages': [
                {
                    'Name': 'Source',
                },
                {
                    'Name': 'Deploy',
                    'Actions': [
                        {
                            'Name': 'ImportedRoleAction',
                            'RoleArn': 'arn:aws:iam::000000000000:role/action-role',
                        },
                        {
                            'Name': 'FreshRoleAction',
                            'RoleArn': {
                                'Fn::GetAtt': [
                                    'FreshRole472F6E18',
                                    'Arn',
                                ],
                            },
                        },
                    ],
                },
            ],
        });
    });
    test('Single capability is passed to template', () => {
        // GIVEN
        const stack = new test_fixture_1.TestFixture();
        // WHEN
        stack.deployStage.addAction(new cpactions.CloudFormationCreateUpdateStackAction({
            actionName: 'CreateUpdate',
            stackName: 'MyStack',
            templatePath: stack.sourceOutput.atPath('template.yaml'),
            adminPermissions: false,
            cfnCapabilities: [
                cdk.CfnCapabilities.NAMED_IAM,
            ],
        }));
        const roleId = 'PipelineDeployCreateUpdateRole515CB7D4';
        // THEN: Action in Pipeline has named IAM capabilities
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
            'Stages': [
                { 'Name': 'Source' /* don't care about the rest */ },
                {
                    'Name': 'Deploy',
                    'Actions': [
                        {
                            'Configuration': {
                                'Capabilities': 'CAPABILITY_NAMED_IAM',
                                'RoleArn': { 'Fn::GetAtt': [roleId, 'Arn'] },
                                'ActionMode': 'CREATE_UPDATE',
                                'StackName': 'MyStack',
                                'TemplatePath': 'SourceArtifact::template.yaml',
                            },
                            'InputArtifacts': [{ 'Name': 'SourceArtifact' }],
                            'Name': 'CreateUpdate',
                        },
                    ],
                },
            ],
        });
    });
    test('Multiple capabilities are passed to template', () => {
        // GIVEN
        const stack = new test_fixture_1.TestFixture();
        // WHEN
        stack.deployStage.addAction(new cpactions.CloudFormationCreateUpdateStackAction({
            actionName: 'CreateUpdate',
            stackName: 'MyStack',
            templatePath: stack.sourceOutput.atPath('template.yaml'),
            adminPermissions: false,
            cfnCapabilities: [
                cdk.CfnCapabilities.NAMED_IAM,
                cdk.CfnCapabilities.AUTO_EXPAND,
            ],
        }));
        const roleId = 'PipelineDeployCreateUpdateRole515CB7D4';
        // THEN: Action in Pipeline has named IAM and AUTOEXPAND capabilities
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
            'Stages': [
                { 'Name': 'Source' /* don't care about the rest */ },
                {
                    'Name': 'Deploy',
                    'Actions': [
                        {
                            'Configuration': {
                                'Capabilities': 'CAPABILITY_NAMED_IAM,CAPABILITY_AUTO_EXPAND',
                                'RoleArn': { 'Fn::GetAtt': [roleId, 'Arn'] },
                                'ActionMode': 'CREATE_UPDATE',
                                'StackName': 'MyStack',
                                'TemplatePath': 'SourceArtifact::template.yaml',
                            },
                            'InputArtifacts': [{ 'Name': 'SourceArtifact' }],
                            'Name': 'CreateUpdate',
                        },
                    ],
                },
            ],
        });
    });
    test('Empty capabilities is not passed to template', () => {
        // GIVEN
        const stack = new test_fixture_1.TestFixture();
        // WHEN
        stack.deployStage.addAction(new cpactions.CloudFormationCreateUpdateStackAction({
            actionName: 'CreateUpdate',
            stackName: 'MyStack',
            templatePath: stack.sourceOutput.atPath('template.yaml'),
            adminPermissions: false,
            cfnCapabilities: [
                cdk.CfnCapabilities.NONE,
            ],
        }));
        const roleId = 'PipelineDeployCreateUpdateRole515CB7D4';
        // THEN: Action in Pipeline has no capabilities
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
            'Stages': [
                { 'Name': 'Source' /* don't care about the rest */ },
                {
                    'Name': 'Deploy',
                    'Actions': [
                        {
                            'Configuration': {
                                'RoleArn': { 'Fn::GetAtt': [roleId, 'Arn'] },
                                'ActionMode': 'CREATE_UPDATE',
                                'StackName': 'MyStack',
                                'TemplatePath': 'SourceArtifact::template.yaml',
                            },
                            'InputArtifacts': [{ 'Name': 'SourceArtifact' }],
                            'Name': 'CreateUpdate',
                        },
                    ],
                },
            ],
        });
    });
    test('can use CfnCapabilities from the core module', () => {
        // GIVEN
        const stack = new test_fixture_1.TestFixture();
        // WHEN
        stack.deployStage.addAction(new cpactions.CloudFormationCreateUpdateStackAction({
            actionName: 'CreateUpdate',
            stackName: 'MyStack',
            templatePath: stack.sourceOutput.atPath('template.yaml'),
            adminPermissions: false,
            cfnCapabilities: [
                cdk.CfnCapabilities.NAMED_IAM,
                cdk.CfnCapabilities.AUTO_EXPAND,
            ],
        }));
        // THEN: Action in Pipeline has named IAM and AUTOEXPAND capabilities
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
            'Stages': [
                { 'Name': 'Source' /* don't care about the rest */ },
                {
                    'Name': 'Deploy',
                    'Actions': [
                        {
                            'Configuration': {
                                'Capabilities': 'CAPABILITY_NAMED_IAM,CAPABILITY_AUTO_EXPAND',
                                'RoleArn': { 'Fn::GetAtt': ['PipelineDeployCreateUpdateRole515CB7D4', 'Arn'] },
                                'ActionMode': 'CREATE_UPDATE',
                                'StackName': 'MyStack',
                                'TemplatePath': 'SourceArtifact::template.yaml',
                            },
                            'InputArtifacts': [{ 'Name': 'SourceArtifact' }],
                            'Name': 'CreateUpdate',
                        },
                    ],
                },
            ],
        });
    });
    describe('cross-account CFN Pipeline', () => {
        test('correctly creates the deployment Role in the other account', () => {
            const app = new cdk.App();
            const pipelineStack = new cdk.Stack(app, 'PipelineStack', {
                env: {
                    account: '234567890123',
                    region: 'us-west-2',
                },
            });
            const sourceOutput = new codepipeline.Artifact();
            new codepipeline.Pipeline(pipelineStack, 'Pipeline', {
                stages: [
                    {
                        stageName: 'Source',
                        actions: [
                            new cpactions.CodeCommitSourceAction({
                                actionName: 'CodeCommit',
                                repository: codecommit.Repository.fromRepositoryName(pipelineStack, 'Repo', 'RepoName'),
                                output: sourceOutput,
                            }),
                        ],
                    },
                    {
                        stageName: 'Deploy',
                        actions: [
                            new cpactions.CloudFormationCreateUpdateStackAction({
                                actionName: 'CFN',
                                stackName: 'MyStack',
                                adminPermissions: true,
                                templatePath: sourceOutput.atPath('template.yaml'),
                                account: '123456789012',
                            }),
                        ],
                    },
                ],
            });
            assertions_1.Template.fromStack(pipelineStack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
                'Stages': [
                    {
                        'Name': 'Source',
                    },
                    {
                        'Name': 'Deploy',
                        'Actions': [
                            {
                                'Name': 'CFN',
                                'RoleArn': {
                                    'Fn::Join': ['', ['arn:', { 'Ref': 'AWS::Partition' },
                                            ':iam::123456789012:role/pipelinestack-support-123loycfnactionrole56af64af3590f311bc50']],
                                },
                                'Configuration': {
                                    'RoleArn': {
                                        'Fn::Join': ['', ['arn:', { 'Ref': 'AWS::Partition' },
                                                ':iam::123456789012:role/pipelinestack-support-123fndeploymentrole4668d9b5a30ce3dc4508']],
                                    },
                                },
                            },
                        ],
                    },
                ],
            });
            // the pipeline's BucketPolicy should trust both CFN roles
            assertions_1.Template.fromStack(pipelineStack).hasResourceProperties('AWS::S3::BucketPolicy', {
                'PolicyDocument': assertions_1.Match.objectLike({
                    'Statement': [
                        {
                            'Action': 's3:*',
                            'Condition': {
                                'Bool': { 'aws:SecureTransport': 'false' },
                            },
                            'Effect': 'Deny',
                            'Principal': {
                                'AWS': '*',
                            },
                            'Resource': assertions_1.Match.anyValue(),
                        },
                        {
                            'Action': [
                                's3:GetObject*',
                                's3:GetBucket*',
                                's3:List*',
                            ],
                            'Effect': 'Allow',
                            'Principal': {
                                'AWS': {
                                    'Fn::Join': ['', ['arn:', { 'Ref': 'AWS::Partition' },
                                            ':iam::123456789012:role/pipelinestack-support-123fndeploymentrole4668d9b5a30ce3dc4508']],
                                },
                            },
                            'Resource': assertions_1.Match.anyValue(),
                        },
                        {
                            'Action': [
                                's3:GetObject*',
                                's3:GetBucket*',
                                's3:List*',
                            ],
                            'Effect': 'Allow',
                            'Principal': {
                                'AWS': {
                                    'Fn::Join': ['', ['arn:', { 'Ref': 'AWS::Partition' },
                                            ':iam::123456789012:role/pipelinestack-support-123loycfnactionrole56af64af3590f311bc50']],
                                },
                            },
                            'Resource': assertions_1.Match.anyValue(),
                        },
                    ],
                }),
            });
            const otherStack = app.node.findChild('cross-account-support-stack-123456789012');
            assertions_1.Template.fromStack(otherStack).hasResourceProperties('AWS::IAM::Role', {
                'RoleName': 'pipelinestack-support-123loycfnactionrole56af64af3590f311bc50',
            });
            assertions_1.Template.fromStack(otherStack).hasResourceProperties('AWS::IAM::Role', {
                'RoleName': 'pipelinestack-support-123fndeploymentrole4668d9b5a30ce3dc4508',
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xvdWRmb3JtYXRpb24tcGlwZWxpbmUtYWN0aW9ucy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2xvdWRmb3JtYXRpb24tcGlwZWxpbmUtYWN0aW9ucy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQXNEO0FBQ3RELG9EQUFvRDtBQUNwRCxzREFBc0Q7QUFDdEQsMERBQTBEO0FBQzFELDhDQUEyRTtBQUMzRSxxQ0FBcUM7QUFDckMsaURBQTZDO0FBQzdDLHVDQUF1QztBQUV2QyxnQ0FBZ0M7QUFFaEMsUUFBUSxDQUFDLGlDQUFpQyxFQUFFLEdBQUcsRUFBRTtJQUMvQyxJQUFJLENBQUMsNEVBQTRFLEVBQUUsR0FBRyxFQUFFO1FBQ3RGLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRTlCLE1BQU0sUUFBUSxHQUFHLElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsZUFBZSxDQUFDLENBQUM7UUFFbkUsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLGNBQUksQ0FBQyxLQUFLLEVBQUUsZUFBZSxFQUFFO1lBQ3pELFNBQVMsRUFBRSxJQUFJLDBCQUFnQixDQUFDLDhCQUE4QixDQUFDO1NBQ2hFLENBQUMsQ0FBQztRQUVILGNBQWM7UUFDZCxNQUFNLElBQUksR0FBRyxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLHFCQUFxQixFQUFFO1lBQ25FLGNBQWMsRUFBRSx3QkFBd0I7U0FDekMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxZQUFZLEdBQUcsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDakUsTUFBTSxNQUFNLEdBQUcsSUFBSSxTQUFTLENBQUMsc0JBQXNCLENBQUM7WUFDbEQsVUFBVSxFQUFFLFFBQVE7WUFDcEIsTUFBTSxFQUFFLFlBQVk7WUFDcEIsVUFBVSxFQUFFLElBQUk7WUFDaEIsT0FBTyxFQUFFLFNBQVMs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LENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlLCBNYXRjaCB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgY29kZWJ1aWxkIGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlYnVpbGQnO1xuaW1wb3J0ICogYXMgY29kZWNvbW1pdCBmcm9tICdAYXdzLWNkay9hd3MtY29kZWNvbW1pdCc7XG5pbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmUgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVwaXBlbGluZSc7XG5pbXBvcnQgeyBQb2xpY3lTdGF0ZW1lbnQsIFJvbGUsIFNlcnZpY2VQcmluY2lwYWwgfSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IFRlc3RGaXh0dXJlIH0gZnJvbSAnLi90ZXN0LWZpeHR1cmUnO1xuaW1wb3J0ICogYXMgY3BhY3Rpb25zIGZyb20gJy4uLy4uL2xpYic7XG5cbi8qIGVzbGludC1kaXNhYmxlIHF1b3RlLXByb3BzICovXG5cbmRlc2NyaWJlKCdDbG91ZEZvcm1hdGlvbiBQaXBlbGluZSBBY3Rpb25zJywgKCkgPT4ge1xuICB0ZXN0KCdDcmVhdGVDaGFuZ2VTZXRBY3Rpb24gY2FuIGJlIHVzZWQgdG8gbWFrZSBhIGNoYW5nZSBzZXQgZnJvbSBhIENvZGVQaXBlbGluZScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGNvbnN0IHBpcGVsaW5lID0gbmV3IGNvZGVwaXBlbGluZS5QaXBlbGluZShzdGFjaywgJ01hZ2ljUGlwZWxpbmUnKTtcblxuICAgIGNvbnN0IGNoYW5nZVNldEV4ZWNSb2xlID0gbmV3IFJvbGUoc3RhY2ssICdDaGFuZ2VTZXRSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgnY2xvdWRmb3JtYXRpb24uYW1hem9uYXdzLmNvbScpLFxuICAgIH0pO1xuXG4gICAgLyoqIFNvdXJjZSEgKi9cbiAgICBjb25zdCByZXBvID0gbmV3IGNvZGVjb21taXQuUmVwb3NpdG9yeShzdGFjaywgJ015VmVyeUltcG9ydGFudFJlcG8nLCB7XG4gICAgICByZXBvc2l0b3J5TmFtZTogJ215LXZlcnktaW1wb3J0YW50LXJlcG8nLFxuICAgIH0pO1xuXG4gICAgY29uc3Qgc291cmNlT3V0cHV0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgnU291cmNlQXJ0aWZhY3QnKTtcbiAgICBjb25zdCBzb3VyY2UgPSBuZXcgY3BhY3Rpb25zLkNvZGVDb21taXRTb3VyY2VBY3Rpb24oe1xuICAgICAgYWN0aW9uTmFtZTogJ3NvdXJjZScsXG4gICAgICBvdXRwdXQ6IHNvdXJjZU91dHB1dCxcbiAgICAgIHJlcG9zaXRvcnk6IHJlcG8sXG4gICAgICB0cmlnZ2VyOiBjcGFjdGlvbnMuQ29kZUNvbW1pdFRyaWdnZXIuUE9MTCxcbiAgICB9KTtcbiAgICBwaXBlbGluZS5hZGRTdGFnZSh7XG4gICAgICBzdGFnZU5hbWU6ICdzb3VyY2UnLFxuICAgICAgYWN0aW9uczogW3NvdXJjZV0sXG4gICAgfSk7XG5cbiAgICAvKiogQnVpbGQhICovXG5cbiAgICBjb25zdCBwcm9qZWN0ID0gbmV3IGNvZGVidWlsZC5QaXBlbGluZVByb2plY3Qoc3RhY2ssICdNeUJ1aWxkUHJvamVjdCcpO1xuXG4gICAgY29uc3QgYnVpbGRPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCdPdXRwdXRZbycpO1xuICAgIGNvbnN0IGJ1aWxkQWN0aW9uID0gbmV3IGNwYWN0aW9ucy5Db2RlQnVpbGRBY3Rpb24oe1xuICAgICAgYWN0aW9uTmFtZTogJ2J1aWxkJyxcbiAgICAgIHByb2plY3QsXG4gICAgICBpbnB1dDogc291cmNlT3V0cHV0LFxuICAgICAgb3V0cHV0czogW2J1aWxkT3V0cHV0XSxcbiAgICB9KTtcbiAgICBwaXBlbGluZS5hZGRTdGFnZSh7XG4gICAgICBzdGFnZU5hbWU6ICdidWlsZCcsXG4gICAgICBhY3Rpb25zOiBbYnVpbGRBY3Rpb25dLFxuICAgIH0pO1xuXG4gICAgLyoqIERlcGxveSEgKi9cblxuICAgIC8vIFRvIGV4ZWN1dGUgYSBjaGFuZ2Ugc2V0IC0geWVzLCB5b3UgcHJvYmFibHkgZG8gbmVlZCAqOiog8J+kt+KAjeKZgO+4j1xuICAgIGNoYW5nZVNldEV4ZWNSb2xlLmFkZFRvUG9saWN5KG5ldyBQb2xpY3lTdGF0ZW1lbnQoeyByZXNvdXJjZXM6IFsnKiddLCBhY3Rpb25zOiBbJyonXSB9KSk7XG5cbiAgICBjb25zdCBzdGFja05hbWUgPSAnQnJlbGFuZHNTdGFjayc7XG4gICAgY29uc3QgY2hhbmdlU2V0TmFtZSA9ICdNeU1hZ2ljYWxDaGFuZ2VTZXQnO1xuICAgIHBpcGVsaW5lLmFkZFN0YWdlKHtcbiAgICAgIHN0YWdlTmFtZTogJ3Byb2QnLFxuICAgICAgYWN0aW9uczogW1xuICAgICAgICBuZXcgY3BhY3Rpb25zLkNsb3VkRm9ybWF0aW9uQ3JlYXRlUmVwbGFjZUNoYW5nZVNldEFjdGlvbih7XG4gICAgICAgICAgYWN0aW9uTmFtZTogJ0J1aWxkQ2hhbmdlU2V0UHJvZCcsXG4gICAgICAgICAgc3RhY2tOYW1lLFxuICAgICAgICAgIGNoYW5nZVNldE5hbWUsXG4gICAgICAgICAgZGVwbG95bWVudFJvbGU6IGNoYW5nZVNldEV4ZWNSb2xlLFxuICAgICAgICAgIHRlbXBsYXRlUGF0aDogbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdFBhdGgoYnVpbGRPdXRwdXQsICd0ZW1wbGF0ZS55YW1sJyksXG4gICAgICAgICAgdGVtcGxhdGVDb25maWd1cmF0aW9uOiBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0UGF0aChidWlsZE91dHB1dCwgJ3RlbXBsYXRlQ29uZmlnLmpzb24nKSxcbiAgICAgICAgICBhZG1pblBlcm1pc3Npb25zOiBmYWxzZSxcbiAgICAgICAgfSksXG4gICAgICAgIG5ldyBjcGFjdGlvbnMuQ2xvdWRGb3JtYXRpb25FeGVjdXRlQ2hhbmdlU2V0QWN0aW9uKHtcbiAgICAgICAgICBhY3Rpb25OYW1lOiAnRXhlY3V0ZUNoYW5nZVNldFByb2QnLFxuICAgICAgICAgIHN0YWNrTmFtZSxcbiAgICAgICAgICBjaGFuZ2VTZXROYW1lLFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlUGlwZWxpbmU6OlBpcGVsaW5lJywge1xuICAgICAgJ0FydGlmYWN0U3RvcmUnOiB7XG4gICAgICAgICdMb2NhdGlvbic6IHtcbiAgICAgICAgICAnUmVmJzogJ01hZ2ljUGlwZWxpbmVBcnRpZmFjdHNCdWNrZXQyMTJGRTdCRicsXG4gICAgICAgIH0sXG4gICAgICAgICdUeXBlJzogJ1MzJyxcbiAgICAgIH0sXG4gICAgICAnUm9sZUFybic6IHtcbiAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ01hZ2ljUGlwZWxpbmVSb2xlRkIyQkQ2REUnLFxuICAgICAgICAgICdBcm4nXSxcbiAgICAgIH0sXG4gICAgICAnU3RhZ2VzJzogW3tcbiAgICAgICAgJ0FjdGlvbnMnOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ0FjdGlvblR5cGVJZCc6IHtcbiAgICAgICAgICAgICAgJ0NhdGVnb3J5JzogJ1NvdXJjZScsXG4gICAgICAgICAgICAgICdPd25lcic6ICdBV1MnLFxuICAgICAgICAgICAgICAnUHJvdmlkZXInOiAnQ29kZUNvbW1pdCcsXG4gICAgICAgICAgICAgICdWZXJzaW9uJzogJzEnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdDb25maWd1cmF0aW9uJzoge1xuICAgICAgICAgICAgICAnUmVwb3NpdG9yeU5hbWUnOiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAnTXlWZXJ5SW1wb3J0YW50UmVwbzExQkMzRUJEJyxcbiAgICAgICAgICAgICAgICAgICdOYW1lJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnQnJhbmNoTmFtZSc6ICdtYXN0ZXInLFxuICAgICAgICAgICAgICAnUG9sbEZvclNvdXJjZUNoYW5nZXMnOiB0cnVlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdOYW1lJzogJ3NvdXJjZScsXG4gICAgICAgICAgICAnT3V0cHV0QXJ0aWZhY3RzJzogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ05hbWUnOiAnU291cmNlQXJ0aWZhY3QnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdSdW5PcmRlcic6IDEsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgJ05hbWUnOiAnc291cmNlJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgICdBY3Rpb25zJzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgICdBY3Rpb25UeXBlSWQnOiB7XG4gICAgICAgICAgICAgICdDYXRlZ29yeSc6ICdCdWlsZCcsXG4gICAgICAgICAgICAgICdPd25lcic6ICdBV1MnLFxuICAgICAgICAgICAgICAnUHJvdmlkZXInOiAnQ29kZUJ1aWxkJyxcbiAgICAgICAgICAgICAgJ1ZlcnNpb24nOiAnMScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ0NvbmZpZ3VyYXRpb24nOiB7XG4gICAgICAgICAgICAgICdQcm9qZWN0TmFtZSc6IHtcbiAgICAgICAgICAgICAgICAnUmVmJzogJ015QnVpbGRQcm9qZWN0MzBEQjlENkUnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdJbnB1dEFydGlmYWN0cyc6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdOYW1lJzogJ1NvdXJjZUFydGlmYWN0JyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAnTmFtZSc6ICdidWlsZCcsXG4gICAgICAgICAgICAnT3V0cHV0QXJ0aWZhY3RzJzogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ05hbWUnOiAnT3V0cHV0WW8nLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdSdW5PcmRlcic6IDEsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgJ05hbWUnOiAnYnVpbGQnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgJ0FjdGlvbnMnOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ0FjdGlvblR5cGVJZCc6IHtcbiAgICAgICAgICAgICAgJ0NhdGVnb3J5JzogJ0RlcGxveScsXG4gICAgICAgICAgICAgICdPd25lcic6ICdBV1MnLFxuICAgICAgICAgICAgICAnUHJvdmlkZXInOiAnQ2xvdWRGb3JtYXRpb24nLFxuICAgICAgICAgICAgICAnVmVyc2lvbic6ICcxJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnQ29uZmlndXJhdGlvbic6IHtcbiAgICAgICAgICAgICAgJ0FjdGlvbk1vZGUnOiAnQ0hBTkdFX1NFVF9SRVBMQUNFJyxcbiAgICAgICAgICAgICAgJ0NoYW5nZVNldE5hbWUnOiAnTXlNYWdpY2FsQ2hhbmdlU2V0JyxcbiAgICAgICAgICAgICAgJ1JvbGVBcm4nOiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAnQ2hhbmdlU2V0Um9sZTBCQ0Y5OUU2JyxcbiAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICdTdGFja05hbWUnOiAnQnJlbGFuZHNTdGFjaycsXG4gICAgICAgICAgICAgICdUZW1wbGF0ZVBhdGgnOiAnT3V0cHV0WW86OnRlbXBsYXRlLnlhbWwnLFxuICAgICAgICAgICAgICAnVGVtcGxhdGVDb25maWd1cmF0aW9uJzogJ091dHB1dFlvOjp0ZW1wbGF0ZUNvbmZpZy5qc29uJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnSW5wdXRBcnRpZmFjdHMnOiBbeyAnTmFtZSc6ICdPdXRwdXRZbycgfV0sXG4gICAgICAgICAgICAnTmFtZSc6ICdCdWlsZENoYW5nZVNldFByb2QnLFxuICAgICAgICAgICAgJ1J1bk9yZGVyJzogMSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgICdBY3Rpb25UeXBlSWQnOiB7XG4gICAgICAgICAgICAgICdDYXRlZ29yeSc6ICdEZXBsb3knLFxuICAgICAgICAgICAgICAnT3duZXInOiAnQVdTJyxcbiAgICAgICAgICAgICAgJ1Byb3ZpZGVyJzogJ0Nsb3VkRm9ybWF0aW9uJyxcbiAgICAgICAgICAgICAgJ1ZlcnNpb24nOiAnMScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ0NvbmZpZ3VyYXRpb24nOiB7XG4gICAgICAgICAgICAgICdBY3Rpb25Nb2RlJzogJ0NIQU5HRV9TRVRfRVhFQ1VURScsXG4gICAgICAgICAgICAgICdDaGFuZ2VTZXROYW1lJzogJ015TWFnaWNhbENoYW5nZVNldCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ05hbWUnOiAnRXhlY3V0ZUNoYW5nZVNldFByb2QnLFxuICAgICAgICAgICAgJ1J1bk9yZGVyJzogMSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICAnTmFtZSc6ICdwcm9kJyxcbiAgICAgIH1dLFxuICAgIH0pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnZnVsbFBlcm1pc3Npb25zIGxlYWRzIHRvIGFkbWluIHJvbGUgYW5kIGZ1bGwgSUFNIGNhcGFiaWxpdGllcyB3aXRoIHBpcGVsaW5lIGJ1Y2tldCtrZXkgcmVhZCBwZXJtaXNzaW9ucycsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBUZXN0Rml4dHVyZSgpO1xuXG4gICAgLy8gV0hFTlxuICAgIHN0YWNrLmRlcGxveVN0YWdlLmFkZEFjdGlvbihuZXcgY3BhY3Rpb25zLkNsb3VkRm9ybWF0aW9uQ3JlYXRlVXBkYXRlU3RhY2tBY3Rpb24oe1xuICAgICAgYWN0aW9uTmFtZTogJ0NyZWF0ZVVwZGF0ZScsXG4gICAgICBzdGFja05hbWU6ICdNeVN0YWNrJyxcbiAgICAgIHRlbXBsYXRlUGF0aDogc3RhY2suc291cmNlT3V0cHV0LmF0UGF0aCgndGVtcGxhdGUueWFtbCcpLFxuICAgICAgYWRtaW5QZXJtaXNzaW9uczogdHJ1ZSxcbiAgICB9KSk7XG5cbiAgICBjb25zdCByb2xlSWQgPSAnUGlwZWxpbmVEZXBsb3lDcmVhdGVVcGRhdGVSb2xlNTE1Q0I3RDQnO1xuXG4gICAgLy8gVEhFTjogQWN0aW9uIGluIFBpcGVsaW5lIGhhcyBuYW1lZCBJQU0gY2FwYWJpbGl0aWVzXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZVBpcGVsaW5lOjpQaXBlbGluZScsIHtcbiAgICAgICdTdGFnZXMnOiBbXG4gICAgICAgIHsgJ05hbWUnOiAnU291cmNlJyAvKiBkb24ndCBjYXJlIGFib3V0IHRoZSByZXN0ICovIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAnTmFtZSc6ICdEZXBsb3knLFxuICAgICAgICAgICdBY3Rpb25zJzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnQ29uZmlndXJhdGlvbic6IHtcbiAgICAgICAgICAgICAgICAnQ2FwYWJpbGl0aWVzJzogJ0NBUEFCSUxJVFlfTkFNRURfSUFNJyxcbiAgICAgICAgICAgICAgICAnUm9sZUFybic6IHsgJ0ZuOjpHZXRBdHQnOiBbcm9sZUlkLCAnQXJuJ10gfSxcbiAgICAgICAgICAgICAgICAnQWN0aW9uTW9kZSc6ICdDUkVBVEVfVVBEQVRFJyxcbiAgICAgICAgICAgICAgICAnU3RhY2tOYW1lJzogJ015U3RhY2snLFxuICAgICAgICAgICAgICAgICdUZW1wbGF0ZVBhdGgnOiAnU291cmNlQXJ0aWZhY3Q6OnRlbXBsYXRlLnlhbWwnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnSW5wdXRBcnRpZmFjdHMnOiBbeyAnTmFtZSc6ICdTb3VyY2VBcnRpZmFjdCcgfV0sXG4gICAgICAgICAgICAgICdOYW1lJzogJ0NyZWF0ZVVwZGF0ZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTjogUm9sZSBpcyBjcmVhdGVkIHdpdGggZnVsbCBwZXJtaXNzaW9uc1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnQWN0aW9uJzogW1xuICAgICAgICAgICAgICAnczM6R2V0T2JqZWN0KicsXG4gICAgICAgICAgICAgICdzMzpHZXRCdWNrZXQqJyxcbiAgICAgICAgICAgICAgJ3MzOkxpc3QqJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgICdBY3Rpb24nOiBbXG4gICAgICAgICAgICAgICdrbXM6RGVjcnlwdCcsXG4gICAgICAgICAgICAgICdrbXM6RGVzY3JpYmVLZXknLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiAnKicsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgUm9sZXM6IFt7IFJlZjogcm9sZUlkIH1dLFxuICAgIH0pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnb3V0cHV0RmlsZU5hbWUgbGVhZHMgdG8gY3JlYXRpb24gb2Ygb3V0cHV0IGFydGlmYWN0JywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFRlc3RGaXh0dXJlKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgc3RhY2suZGVwbG95U3RhZ2UuYWRkQWN0aW9uKG5ldyBjcGFjdGlvbnMuQ2xvdWRGb3JtYXRpb25DcmVhdGVVcGRhdGVTdGFja0FjdGlvbih7XG4gICAgICBhY3Rpb25OYW1lOiAnQ3JlYXRlVXBkYXRlJyxcbiAgICAgIHN0YWNrTmFtZTogJ015U3RhY2snLFxuICAgICAgdGVtcGxhdGVQYXRoOiBzdGFjay5zb3VyY2VPdXRwdXQuYXRQYXRoKCd0ZW1wbGF0ZS55YW1sJyksXG4gICAgICBvdXRwdXRGaWxlTmFtZTogJ0NyZWF0ZVJlc3BvbnNlLmpzb24nLFxuICAgICAgYWRtaW5QZXJtaXNzaW9uczogZmFsc2UsXG4gICAgfSkpO1xuXG4gICAgLy8gVEhFTjogQWN0aW9uIGhhcyBvdXRwdXQgYXJ0aWZhY3RzXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZVBpcGVsaW5lOjpQaXBlbGluZScsIHtcbiAgICAgICdTdGFnZXMnOiBbXG4gICAgICAgIHsgJ05hbWUnOiAnU291cmNlJyAvKiBkb24ndCBjYXJlIGFib3V0IHRoZSByZXN0ICovIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAnTmFtZSc6ICdEZXBsb3knLFxuICAgICAgICAgICdBY3Rpb25zJzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnT3V0cHV0QXJ0aWZhY3RzJzogW3sgJ05hbWUnOiAnQ3JlYXRlVXBkYXRlX015U3RhY2tfQXJ0aWZhY3QnIH1dLFxuICAgICAgICAgICAgICAnTmFtZSc6ICdDcmVhdGVVcGRhdGUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ3JlcGxhY2VPbkZhaWx1cmUgc3dpdGNoZXMgYWN0aW9uIHR5cGUnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgVGVzdEZpeHR1cmUoKTtcblxuICAgIC8vIFdIRU5cbiAgICBzdGFjay5kZXBsb3lTdGFnZS5hZGRBY3Rpb24obmV3IGNwYWN0aW9ucy5DbG91ZEZvcm1hdGlvbkNyZWF0ZVVwZGF0ZVN0YWNrQWN0aW9uKHtcbiAgICAgIGFjdGlvbk5hbWU6ICdDcmVhdGVVcGRhdGUnLFxuICAgICAgc3RhY2tOYW1lOiAnTXlTdGFjaycsXG4gICAgICB0ZW1wbGF0ZVBhdGg6IHN0YWNrLnNvdXJjZU91dHB1dC5hdFBhdGgoJ3RlbXBsYXRlLnlhbWwnKSxcbiAgICAgIHJlcGxhY2VPbkZhaWx1cmU6IHRydWUsXG4gICAgICBhZG1pblBlcm1pc3Npb25zOiBmYWxzZSxcbiAgICB9KSk7XG5cbiAgICAvLyBUSEVOOiBBY3Rpb24gaGFzIG91dHB1dCBhcnRpZmFjdHNcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlUGlwZWxpbmU6OlBpcGVsaW5lJywge1xuICAgICAgJ1N0YWdlcyc6IFtcbiAgICAgICAgeyAnTmFtZSc6ICdTb3VyY2UnIC8qIGRvbid0IGNhcmUgYWJvdXQgdGhlIHJlc3QgKi8gfSxcbiAgICAgICAge1xuICAgICAgICAgICdOYW1lJzogJ0RlcGxveScsXG4gICAgICAgICAgJ0FjdGlvbnMnOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdDb25maWd1cmF0aW9uJzoge1xuICAgICAgICAgICAgICAgICdBY3Rpb25Nb2RlJzogJ1JFUExBQ0VfT05fRkFJTFVSRScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICdOYW1lJzogJ0NyZWF0ZVVwZGF0ZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgncGFyYW1ldGVyT3ZlcnJpZGVzIGFyZSBzZXJpYWxpemVkIGFzIGEgc3RyaW5nJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFRlc3RGaXh0dXJlKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgc3RhY2suZGVwbG95U3RhZ2UuYWRkQWN0aW9uKG5ldyBjcGFjdGlvbnMuQ2xvdWRGb3JtYXRpb25DcmVhdGVVcGRhdGVTdGFja0FjdGlvbih7XG4gICAgICBhY3Rpb25OYW1lOiAnQ3JlYXRlVXBkYXRlJyxcbiAgICAgIHN0YWNrTmFtZTogJ015U3RhY2snLFxuICAgICAgdGVtcGxhdGVQYXRoOiBzdGFjay5zb3VyY2VPdXRwdXQuYXRQYXRoKCd0ZW1wbGF0ZS55YW1sJyksXG4gICAgICBhZG1pblBlcm1pc3Npb25zOiBmYWxzZSxcbiAgICAgIHBhcmFtZXRlck92ZXJyaWRlczoge1xuICAgICAgICBSZXBvTmFtZTogc3RhY2sucmVwby5yZXBvc2l0b3J5TmFtZSxcbiAgICAgIH0sXG4gICAgfSkpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVQaXBlbGluZTo6UGlwZWxpbmUnLCB7XG4gICAgICAnU3RhZ2VzJzogW1xuICAgICAgICB7ICdOYW1lJzogJ1NvdXJjZScgLyogZG9uJ3QgY2FyZSBhYm91dCB0aGUgcmVzdCAqLyB9LFxuICAgICAgICB7XG4gICAgICAgICAgJ05hbWUnOiAnRGVwbG95JyxcbiAgICAgICAgICAnQWN0aW9ucyc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0NvbmZpZ3VyYXRpb24nOiB7XG4gICAgICAgICAgICAgICAgJ1BhcmFtZXRlck92ZXJyaWRlcyc6IHtcbiAgICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFsnJywgW1xuICAgICAgICAgICAgICAgICAgICAne1wiUmVwb05hbWVcIjpcIicsXG4gICAgICAgICAgICAgICAgICAgIHsgJ0ZuOjpHZXRBdHQnOiBbJ015VmVyeUltcG9ydGFudFJlcG8xMUJDM0VCRCcsICdOYW1lJ10gfSxcbiAgICAgICAgICAgICAgICAgICAgJ1wifScsXG4gICAgICAgICAgICAgICAgICBdXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnTmFtZSc6ICdDcmVhdGVVcGRhdGUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ0FjdGlvbiBzZXJ2aWNlIHJvbGUgaXMgcGFzc2VkIHRvIHRlbXBsYXRlJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFRlc3RGaXh0dXJlKCk7XG5cbiAgICBjb25zdCBpbXBvcnRlZFJvbGUgPSBSb2xlLmZyb21Sb2xlQXJuKHN0YWNrLCAnSW1wb3J0ZWRSb2xlJywgJ2Fybjphd3M6aWFtOjowMDAwMDAwMDAwMDA6cm9sZS9hY3Rpb24tcm9sZScpO1xuICAgIGNvbnN0IGZyZXNoUm9sZSA9IG5ldyBSb2xlKHN0YWNrLCAnRnJlc2hSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgnbWFnaWNzZXJ2aWNlJyksXG4gICAgfSk7XG5cbiAgICBzdGFjay5kZXBsb3lTdGFnZS5hZGRBY3Rpb24obmV3IGNwYWN0aW9ucy5DbG91ZEZvcm1hdGlvbkV4ZWN1dGVDaGFuZ2VTZXRBY3Rpb24oe1xuICAgICAgYWN0aW9uTmFtZTogJ0ltcG9ydGVkUm9sZUFjdGlvbicsXG4gICAgICByb2xlOiBpbXBvcnRlZFJvbGUsXG4gICAgICBjaGFuZ2VTZXROYW1lOiAnbWFnaWNTZXQnLFxuICAgICAgc3RhY2tOYW1lOiAnbWFnaWNTdGFjaycsXG4gICAgfSkpO1xuXG4gICAgc3RhY2suZGVwbG95U3RhZ2UuYWRkQWN0aW9uKG5ldyBjcGFjdGlvbnMuQ2xvdWRGb3JtYXRpb25FeGVjdXRlQ2hhbmdlU2V0QWN0aW9uKHtcbiAgICAgIGFjdGlvbk5hbWU6ICdGcmVzaFJvbGVBY3Rpb24nLFxuICAgICAgcm9sZTogZnJlc2hSb2xlLFxuICAgICAgY2hhbmdlU2V0TmFtZTogJ21hZ2ljU2V0JyxcbiAgICAgIHN0YWNrTmFtZTogJ21hZ2ljU3RhY2snLFxuICAgIH0pKTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVQaXBlbGluZTo6UGlwZWxpbmUnLCB7XG4gICAgICAnU3RhZ2VzJzogW1xuICAgICAgICB7XG4gICAgICAgICAgJ05hbWUnOiAnU291cmNlJywgLyogZG9uJ3QgY2FyZSBhYm91dCB0aGUgcmVzdCAqL1xuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgJ05hbWUnOiAnRGVwbG95JyxcbiAgICAgICAgICAnQWN0aW9ucyc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ05hbWUnOiAnSW1wb3J0ZWRSb2xlQWN0aW9uJyxcbiAgICAgICAgICAgICAgJ1JvbGVBcm4nOiAnYXJuOmF3czppYW06OjAwMDAwMDAwMDAwMDpyb2xlL2FjdGlvbi1yb2xlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdOYW1lJzogJ0ZyZXNoUm9sZUFjdGlvbicsXG4gICAgICAgICAgICAgICdSb2xlQXJuJzoge1xuICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgJ0ZyZXNoUm9sZTQ3MkY2RTE4JyxcbiAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnU2luZ2xlIGNhcGFiaWxpdHkgaXMgcGFzc2VkIHRvIHRlbXBsYXRlJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFRlc3RGaXh0dXJlKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgc3RhY2suZGVwbG95U3RhZ2UuYWRkQWN0aW9uKG5ldyBjcGFjdGlvbnMuQ2xvdWRGb3JtYXRpb25DcmVhdGVVcGRhdGVTdGFja0FjdGlvbih7XG4gICAgICBhY3Rpb25OYW1lOiAnQ3JlYXRlVXBkYXRlJyxcbiAgICAgIHN0YWNrTmFtZTogJ015U3RhY2snLFxuICAgICAgdGVtcGxhdGVQYXRoOiBzdGFjay5zb3VyY2VPdXRwdXQuYXRQYXRoKCd0ZW1wbGF0ZS55YW1sJyksXG4gICAgICBhZG1pblBlcm1pc3Npb25zOiBmYWxzZSxcbiAgICAgIGNmbkNhcGFiaWxpdGllczogW1xuICAgICAgICBjZGsuQ2ZuQ2FwYWJpbGl0aWVzLk5BTUVEX0lBTSxcbiAgICAgIF0sXG4gICAgfSkpO1xuXG4gICAgY29uc3Qgcm9sZUlkID0gJ1BpcGVsaW5lRGVwbG95Q3JlYXRlVXBkYXRlUm9sZTUxNUNCN0Q0JztcblxuICAgIC8vIFRIRU46IEFjdGlvbiBpbiBQaXBlbGluZSBoYXMgbmFtZWQgSUFNIGNhcGFiaWxpdGllc1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVQaXBlbGluZTo6UGlwZWxpbmUnLCB7XG4gICAgICAnU3RhZ2VzJzogW1xuICAgICAgICB7ICdOYW1lJzogJ1NvdXJjZScgLyogZG9uJ3QgY2FyZSBhYm91dCB0aGUgcmVzdCAqLyB9LFxuICAgICAgICB7XG4gICAgICAgICAgJ05hbWUnOiAnRGVwbG95JyxcbiAgICAgICAgICAnQWN0aW9ucyc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0NvbmZpZ3VyYXRpb24nOiB7XG4gICAgICAgICAgICAgICAgJ0NhcGFiaWxpdGllcyc6ICdDQVBBQklMSVRZX05BTUVEX0lBTScsXG4gICAgICAgICAgICAgICAgJ1JvbGVBcm4nOiB7ICdGbjo6R2V0QXR0JzogW3JvbGVJZCwgJ0FybiddIH0sXG4gICAgICAgICAgICAgICAgJ0FjdGlvbk1vZGUnOiAnQ1JFQVRFX1VQREFURScsXG4gICAgICAgICAgICAgICAgJ1N0YWNrTmFtZSc6ICdNeVN0YWNrJyxcbiAgICAgICAgICAgICAgICAnVGVtcGxhdGVQYXRoJzogJ1NvdXJjZUFydGlmYWN0Ojp0ZW1wbGF0ZS55YW1sJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJ0lucHV0QXJ0aWZhY3RzJzogW3sgJ05hbWUnOiAnU291cmNlQXJ0aWZhY3QnIH1dLFxuICAgICAgICAgICAgICAnTmFtZSc6ICdDcmVhdGVVcGRhdGUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ011bHRpcGxlIGNhcGFiaWxpdGllcyBhcmUgcGFzc2VkIHRvIHRlbXBsYXRlJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFRlc3RGaXh0dXJlKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgc3RhY2suZGVwbG95U3RhZ2UuYWRkQWN0aW9uKG5ldyBjcGFjdGlvbnMuQ2xvdWRGb3JtYXRpb25DcmVhdGVVcGRhdGVTdGFja0FjdGlvbih7XG4gICAgICBhY3Rpb25OYW1lOiAnQ3JlYXRlVXBkYXRlJyxcbiAgICAgIHN0YWNrTmFtZTogJ015U3RhY2snLFxuICAgICAgdGVtcGxhdGVQYXRoOiBzdGFjay5zb3VyY2VPdXRwdXQuYXRQYXRoKCd0ZW1wbGF0ZS55YW1sJyksXG4gICAgICBhZG1pblBlcm1pc3Npb25zOiBmYWxzZSxcbiAgICAgIGNmbkNhcGFiaWxpdGllczogW1xuICAgICAgICBjZGsuQ2ZuQ2FwYWJpbGl0aWVzLk5BTUVEX0lBTSxcbiAgICAgICAgY2RrLkNmbkNhcGFiaWxpdGllcy5BVVRPX0VYUEFORCxcbiAgICAgIF0sXG4gICAgfSkpO1xuXG4gICAgY29uc3Qgcm9sZUlkID0gJ1BpcGVsaW5lRGVwbG95Q3JlYXRlVXBkYXRlUm9sZTUxNUNCN0Q0JztcblxuICAgIC8vIFRIRU46IEFjdGlvbiBpbiBQaXBlbGluZSBoYXMgbmFtZWQgSUFNIGFuZCBBVVRPRVhQQU5EIGNhcGFiaWxpdGllc1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVQaXBlbGluZTo6UGlwZWxpbmUnLCB7XG4gICAgICAnU3RhZ2VzJzogW1xuICAgICAgICB7ICdOYW1lJzogJ1NvdXJjZScgLyogZG9uJ3QgY2FyZSBhYm91dCB0aGUgcmVzdCAqLyB9LFxuICAgICAgICB7XG4gICAgICAgICAgJ05hbWUnOiAnRGVwbG95JyxcbiAgICAgICAgICAnQWN0aW9ucyc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0NvbmZpZ3VyYXRpb24nOiB7XG4gICAgICAgICAgICAgICAgJ0NhcGFiaWxpdGllcyc6ICdDQVBBQklMSVRZX05BTUVEX0lBTSxDQVBBQklMSVRZX0FVVE9fRVhQQU5EJyxcbiAgICAgICAgICAgICAgICAnUm9sZUFybic6IHsgJ0ZuOjpHZXRBdHQnOiBbcm9sZUlkLCAnQXJuJ10gfSxcbiAgICAgICAgICAgICAgICAnQWN0aW9uTW9kZSc6ICdDUkVBVEVfVVBEQVRFJyxcbiAgICAgICAgICAgICAgICAnU3RhY2tOYW1lJzogJ015U3RhY2snLFxuICAgICAgICAgICAgICAgICdUZW1wbGF0ZVBhdGgnOiAnU291cmNlQXJ0aWZhY3Q6OnRlbXBsYXRlLnlhbWwnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnSW5wdXRBcnRpZmFjdHMnOiBbeyAnTmFtZSc6ICdTb3VyY2VBcnRpZmFjdCcgfV0sXG4gICAgICAgICAgICAgICdOYW1lJzogJ0NyZWF0ZVVwZGF0ZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnRW1wdHkgY2FwYWJpbGl0aWVzIGlzIG5vdCBwYXNzZWQgdG8gdGVtcGxhdGUnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgVGVzdEZpeHR1cmUoKTtcblxuICAgIC8vIFdIRU5cbiAgICBzdGFjay5kZXBsb3lTdGFnZS5hZGRBY3Rpb24obmV3IGNwYWN0aW9ucy5DbG91ZEZvcm1hdGlvbkNyZWF0ZVVwZGF0ZVN0YWNrQWN0aW9uKHtcbiAgICAgIGFjdGlvbk5hbWU6ICdDcmVhdGVVcGRhdGUnLFxuICAgICAgc3RhY2tOYW1lOiAnTXlTdGFjaycsXG4gICAgICB0ZW1wbGF0ZVBhdGg6IHN0YWNrLnNvdXJjZU91dHB1dC5hdFBhdGgoJ3RlbXBsYXRlLnlhbWwnKSxcbiAgICAgIGFkbWluUGVybWlzc2lvbnM6IGZhbHNlLFxuICAgICAgY2ZuQ2FwYWJpbGl0aWVzOiBbXG4gICAgICAgIGNkay5DZm5DYXBhYmlsaXRpZXMuTk9ORSxcbiAgICAgIF0sXG4gICAgfSkpO1xuXG4gICAgY29uc3Qgcm9sZUlkID0gJ1BpcGVsaW5lRGVwbG95Q3JlYXRlVXBkYXRlUm9sZTUxNUNCN0Q0JztcblxuICAgIC8vIFRIRU46IEFjdGlvbiBpbiBQaXBlbGluZSBoYXMgbm8gY2FwYWJpbGl0aWVzXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZVBpcGVsaW5lOjpQaXBlbGluZScsIHtcbiAgICAgICdTdGFnZXMnOiBbXG4gICAgICAgIHsgJ05hbWUnOiAnU291cmNlJyAvKiBkb24ndCBjYXJlIGFib3V0IHRoZSByZXN0ICovIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAnTmFtZSc6ICdEZXBsb3knLFxuICAgICAgICAgICdBY3Rpb25zJzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnQ29uZmlndXJhdGlvbic6IHtcbiAgICAgICAgICAgICAgICAnUm9sZUFybic6IHsgJ0ZuOjpHZXRBdHQnOiBbcm9sZUlkLCAnQXJuJ10gfSxcbiAgICAgICAgICAgICAgICAnQWN0aW9uTW9kZSc6ICdDUkVBVEVfVVBEQVRFJyxcbiAgICAgICAgICAgICAgICAnU3RhY2tOYW1lJzogJ015U3RhY2snLFxuICAgICAgICAgICAgICAgICdUZW1wbGF0ZVBhdGgnOiAnU291cmNlQXJ0aWZhY3Q6OnRlbXBsYXRlLnlhbWwnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnSW5wdXRBcnRpZmFjdHMnOiBbeyAnTmFtZSc6ICdTb3VyY2VBcnRpZmFjdCcgfV0sXG4gICAgICAgICAgICAgICdOYW1lJzogJ0NyZWF0ZVVwZGF0ZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnY2FuIHVzZSBDZm5DYXBhYmlsaXRpZXMgZnJvbSB0aGUgY29yZSBtb2R1bGUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBUZXN0Rml4dHVyZSgpO1xuXG4gICAgLy8gV0hFTlxuICAgIHN0YWNrLmRlcGxveVN0YWdlLmFkZEFjdGlvbihuZXcgY3BhY3Rpb25zLkNsb3VkRm9ybWF0aW9uQ3JlYXRlVXBkYXRlU3RhY2tBY3Rpb24oe1xuICAgICAgYWN0aW9uTmFtZTogJ0NyZWF0ZVVwZGF0ZScsXG4gICAgICBzdGFja05hbWU6ICdNeVN0YWNrJyxcbiAgICAgIHRlbXBsYXRlUGF0aDogc3RhY2suc291cmNlT3V0cHV0LmF0UGF0aCgndGVtcGxhdGUueWFtbCcpLFxuICAgICAgYWRtaW5QZXJtaXNzaW9uczogZmFsc2UsXG4gICAgICBjZm5DYXBhYmlsaXRpZXM6IFtcbiAgICAgICAgY2RrLkNmbkNhcGFiaWxpdGllcy5OQU1FRF9JQU0sXG4gICAgICAgIGNkay5DZm5DYXBhYmlsaXRpZXMuQVVUT19FWFBBTkQsXG4gICAgICBdLFxuICAgIH0pKTtcblxuICAgIC8vIFRIRU46IEFjdGlvbiBpbiBQaXBlbGluZSBoYXMgbmFtZWQgSUFNIGFuZCBBVVRPRVhQQU5EIGNhcGFiaWxpdGllc1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVQaXBlbGluZTo6UGlwZWxpbmUnLCB7XG4gICAgICAnU3RhZ2VzJzogW1xuICAgICAgICB7ICdOYW1lJzogJ1NvdXJjZScgLyogZG9uJ3QgY2FyZSBhYm91dCB0aGUgcmVzdCAqLyB9LFxuICAgICAgICB7XG4gICAgICAgICAgJ05hbWUnOiAnRGVwbG95JyxcbiAgICAgICAgICAnQWN0aW9ucyc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0NvbmZpZ3VyYXRpb24nOiB7XG4gICAgICAgICAgICAgICAgJ0NhcGFiaWxpdGllcyc6ICdDQVBBQklMSVRZX05BTUVEX0lBTSxDQVBBQklMSVRZX0FVVE9fRVhQQU5EJyxcbiAgICAgICAgICAgICAgICAnUm9sZUFybic6IHsgJ0ZuOjpHZXRBdHQnOiBbJ1BpcGVsaW5lRGVwbG95Q3JlYXRlVXBkYXRlUm9sZTUxNUNCN0Q0JywgJ0FybiddIH0sXG4gICAgICAgICAgICAgICAgJ0FjdGlvbk1vZGUnOiAnQ1JFQVRFX1VQREFURScsXG4gICAgICAgICAgICAgICAgJ1N0YWNrTmFtZSc6ICdNeVN0YWNrJyxcbiAgICAgICAgICAgICAgICAnVGVtcGxhdGVQYXRoJzogJ1NvdXJjZUFydGlmYWN0Ojp0ZW1wbGF0ZS55YW1sJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJ0lucHV0QXJ0aWZhY3RzJzogW3sgJ05hbWUnOiAnU291cmNlQXJ0aWZhY3QnIH1dLFxuICAgICAgICAgICAgICAnTmFtZSc6ICdDcmVhdGVVcGRhdGUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuXG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdjcm9zcy1hY2NvdW50IENGTiBQaXBlbGluZScsICgpID0+IHtcbiAgICB0ZXN0KCdjb3JyZWN0bHkgY3JlYXRlcyB0aGUgZGVwbG95bWVudCBSb2xlIGluIHRoZSBvdGhlciBhY2NvdW50JywgKCkgPT4ge1xuICAgICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxuICAgICAgY29uc3QgcGlwZWxpbmVTdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnUGlwZWxpbmVTdGFjaycsIHtcbiAgICAgICAgZW52OiB7XG4gICAgICAgICAgYWNjb3VudDogJzIzNDU2Nzg5MDEyMycsXG4gICAgICAgICAgcmVnaW9uOiAndXMtd2VzdC0yJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBzb3VyY2VPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCk7XG4gICAgICBuZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHBpcGVsaW5lU3RhY2ssICdQaXBlbGluZScsIHtcbiAgICAgICAgc3RhZ2VzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3RhZ2VOYW1lOiAnU291cmNlJyxcbiAgICAgICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAgICAgbmV3IGNwYWN0aW9ucy5Db2RlQ29tbWl0U291cmNlQWN0aW9uKHtcbiAgICAgICAgICAgICAgICBhY3Rpb25OYW1lOiAnQ29kZUNvbW1pdCcsXG4gICAgICAgICAgICAgICAgcmVwb3NpdG9yeTogY29kZWNvbW1pdC5SZXBvc2l0b3J5LmZyb21SZXBvc2l0b3J5TmFtZShwaXBlbGluZVN0YWNrLCAnUmVwbycsICdSZXBvTmFtZScpLFxuICAgICAgICAgICAgICAgIG91dHB1dDogc291cmNlT3V0cHV0LFxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdGFnZU5hbWU6ICdEZXBsb3knLFxuICAgICAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgICAgICBuZXcgY3BhY3Rpb25zLkNsb3VkRm9ybWF0aW9uQ3JlYXRlVXBkYXRlU3RhY2tBY3Rpb24oe1xuICAgICAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdDRk4nLFxuICAgICAgICAgICAgICAgIHN0YWNrTmFtZTogJ015U3RhY2snLFxuICAgICAgICAgICAgICAgIGFkbWluUGVybWlzc2lvbnM6IHRydWUsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVQYXRoOiBzb3VyY2VPdXRwdXQuYXRQYXRoKCd0ZW1wbGF0ZS55YW1sJyksXG4gICAgICAgICAgICAgICAgYWNjb3VudDogJzEyMzQ1Njc4OTAxMicsXG4gICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhwaXBlbGluZVN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZVBpcGVsaW5lOjpQaXBlbGluZScsIHtcbiAgICAgICAgJ1N0YWdlcyc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnTmFtZSc6ICdTb3VyY2UnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ05hbWUnOiAnRGVwbG95JyxcbiAgICAgICAgICAgICdBY3Rpb25zJzogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ05hbWUnOiAnQ0ZOJyxcbiAgICAgICAgICAgICAgICAnUm9sZUFybic6IHtcbiAgICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFsnJywgWydhcm46JywgeyAnUmVmJzogJ0FXUzo6UGFydGl0aW9uJyB9LFxuICAgICAgICAgICAgICAgICAgICAnOmlhbTo6MTIzNDU2Nzg5MDEyOnJvbGUvcGlwZWxpbmVzdGFjay1zdXBwb3J0LTEyM2xveWNmbmFjdGlvbnJvbGU1NmFmNjRhZjM1OTBmMzExYmM1MCddXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdDb25maWd1cmF0aW9uJzoge1xuICAgICAgICAgICAgICAgICAgJ1JvbGVBcm4nOiB7XG4gICAgICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFsnJywgWydhcm46JywgeyAnUmVmJzogJ0FXUzo6UGFydGl0aW9uJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICc6aWFtOjoxMjM0NTY3ODkwMTI6cm9sZS9waXBlbGluZXN0YWNrLXN1cHBvcnQtMTIzZm5kZXBsb3ltZW50cm9sZTQ2NjhkOWI1YTMwY2UzZGM0NTA4J11dLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIHRoZSBwaXBlbGluZSdzIEJ1Y2tldFBvbGljeSBzaG91bGQgdHJ1c3QgYm90aCBDRk4gcm9sZXNcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhwaXBlbGluZVN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6UzM6OkJ1Y2tldFBvbGljeScsIHtcbiAgICAgICAgJ1BvbGljeURvY3VtZW50JzogTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0FjdGlvbic6ICdzMzoqJyxcbiAgICAgICAgICAgICAgJ0NvbmRpdGlvbic6IHtcbiAgICAgICAgICAgICAgICAnQm9vbCc6IHsgJ2F3czpTZWN1cmVUcmFuc3BvcnQnOiAnZmFsc2UnIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICdFZmZlY3QnOiAnRGVueScsXG4gICAgICAgICAgICAgICdQcmluY2lwYWwnOiB7XG4gICAgICAgICAgICAgICAgJ0FXUyc6ICcqJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJ1Jlc291cmNlJzogTWF0Y2guYW55VmFsdWUoKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdBY3Rpb24nOiBbXG4gICAgICAgICAgICAgICAgJ3MzOkdldE9iamVjdConLFxuICAgICAgICAgICAgICAgICdzMzpHZXRCdWNrZXQqJyxcbiAgICAgICAgICAgICAgICAnczM6TGlzdConLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICAgJ1ByaW5jaXBhbCc6IHtcbiAgICAgICAgICAgICAgICAnQVdTJzoge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogWycnLCBbJ2FybjonLCB7ICdSZWYnOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICAgICAgICAgICAgICc6aWFtOjoxMjM0NTY3ODkwMTI6cm9sZS9waXBlbGluZXN0YWNrLXN1cHBvcnQtMTIzZm5kZXBsb3ltZW50cm9sZTQ2NjhkOWI1YTMwY2UzZGM0NTA4J11dLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICdSZXNvdXJjZSc6IE1hdGNoLmFueVZhbHVlKCksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnQWN0aW9uJzogW1xuICAgICAgICAgICAgICAgICdzMzpHZXRPYmplY3QqJyxcbiAgICAgICAgICAgICAgICAnczM6R2V0QnVja2V0KicsXG4gICAgICAgICAgICAgICAgJ3MzOkxpc3QqJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAgICdQcmluY2lwYWwnOiB7XG4gICAgICAgICAgICAgICAgJ0FXUyc6IHtcbiAgICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFsnJywgWydhcm46JywgeyAnUmVmJzogJ0FXUzo6UGFydGl0aW9uJyB9LFxuICAgICAgICAgICAgICAgICAgICAnOmlhbTo6MTIzNDU2Nzg5MDEyOnJvbGUvcGlwZWxpbmVzdGFjay1zdXBwb3J0LTEyM2xveWNmbmFjdGlvbnJvbGU1NmFmNjRhZjM1OTBmMzExYmM1MCddXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnUmVzb3VyY2UnOiBNYXRjaC5hbnlWYWx1ZSgpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9KSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBvdGhlclN0YWNrID0gYXBwLm5vZGUuZmluZENoaWxkKCdjcm9zcy1hY2NvdW50LXN1cHBvcnQtc3RhY2stMTIzNDU2Nzg5MDEyJykgYXMgY2RrLlN0YWNrO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKG90aGVyU3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlJvbGUnLCB7XG4gICAgICAgICdSb2xlTmFtZSc6ICdwaXBlbGluZXN0YWNrLXN1cHBvcnQtMTIzbG95Y2ZuYWN0aW9ucm9sZTU2YWY2NGFmMzU5MGYzMTFiYzUwJyxcbiAgICAgIH0pO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKG90aGVyU3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlJvbGUnLCB7XG4gICAgICAgICdSb2xlTmFtZSc6ICdwaXBlbGluZXN0YWNrLXN1cHBvcnQtMTIzZm5kZXBsb3ltZW50cm9sZTQ2NjhkOWI1YTMwY2UzZGM0NTA4JyxcbiAgICAgIH0pO1xuXG5cbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==