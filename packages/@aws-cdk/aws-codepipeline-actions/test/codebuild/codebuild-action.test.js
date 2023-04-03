"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const codebuild = require("@aws-cdk/aws-codebuild");
const codecommit = require("@aws-cdk/aws-codecommit");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const s3 = require("@aws-cdk/aws-s3");
const sns = require("@aws-cdk/aws-sns");
const core_1 = require("@aws-cdk/core");
const cpactions = require("../../lib");
/* eslint-disable quote-props */
describe('CodeBuild Action', () => {
    describe('CodeBuild action', () => {
        describe('that is cross-account and has outputs', () => {
            test('causes an error', () => {
                const app = new core_1.App();
                const projectStack = new core_1.Stack(app, 'ProjectStack', {
                    env: {
                        region: 'us-west-2',
                        account: '012345678912',
                    },
                });
                const project = new codebuild.PipelineProject(projectStack, 'Project');
                const pipelineStack = new core_1.Stack(app, 'PipelineStack', {
                    env: {
                        region: 'us-west-2',
                        account: '012345678913',
                    },
                });
                const sourceOutput = new codepipeline.Artifact();
                const pipeline = new codepipeline.Pipeline(pipelineStack, 'Pipeline', {
                    stages: [
                        {
                            stageName: 'Source',
                            actions: [new cpactions.CodeCommitSourceAction({
                                    actionName: 'CodeCommit',
                                    repository: codecommit.Repository.fromRepositoryName(pipelineStack, 'Repo', 'repo-name'),
                                    output: sourceOutput,
                                })],
                        },
                    ],
                });
                const buildStage = pipeline.addStage({
                    stageName: 'Build',
                });
                // this works fine - no outputs!
                buildStage.addAction(new cpactions.CodeBuildAction({
                    actionName: 'Build1',
                    input: sourceOutput,
                    project,
                }));
                const buildAction2 = new cpactions.CodeBuildAction({
                    actionName: 'Build2',
                    input: sourceOutput,
                    project,
                    outputs: [new codepipeline.Artifact()],
                });
                expect(() => {
                    buildStage.addAction(buildAction2);
                }).toThrow(/https:\/\/github\.com\/aws\/aws-cdk\/issues\/4169/);
            });
        });
        test('can be backed by an imported project', () => {
            const stack = new core_1.Stack();
            const codeBuildProject = codebuild.PipelineProject.fromProjectName(stack, 'CodeBuild', 'codeBuildProjectNameInAnotherAccount');
            const sourceOutput = new codepipeline.Artifact();
            new codepipeline.Pipeline(stack, 'Pipeline', {
                stages: [
                    {
                        stageName: 'Source',
                        actions: [
                            new cpactions.S3SourceAction({
                                actionName: 'S3_Source',
                                bucket: new s3.Bucket(stack, 'Bucket'),
                                bucketKey: 'key',
                                output: sourceOutput,
                            }),
                        ],
                    },
                    {
                        stageName: 'Build',
                        actions: [
                            new cpactions.CodeBuildAction({
                                actionName: 'CodeBuild',
                                input: sourceOutput,
                                project: codeBuildProject,
                            }),
                        ],
                    },
                ],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
                'Stages': [
                    {
                        'Name': 'Source',
                    },
                    {
                        'Name': 'Build',
                        'Actions': [
                            {
                                'Name': 'CodeBuild',
                                'Configuration': {
                                    'ProjectName': 'codeBuildProjectNameInAnotherAccount',
                                },
                            },
                        ],
                    },
                ],
            });
        });
        test('exposes variables for other actions to consume', () => {
            const stack = new core_1.Stack();
            const sourceOutput = new codepipeline.Artifact();
            const codeBuildAction = new cpactions.CodeBuildAction({
                actionName: 'CodeBuild',
                input: sourceOutput,
                project: new codebuild.PipelineProject(stack, 'CodeBuild', {
                    buildSpec: codebuild.BuildSpec.fromObject({
                        version: '0.2',
                        env: {
                            'exported-variables': [
                                'SomeVar',
                            ],
                        },
                        phases: {
                            build: {
                                commands: [
                                    'export SomeVar="Some Value"',
                                ],
                            },
                        },
                    }),
                }),
            });
            new codepipeline.Pipeline(stack, 'Pipeline', {
                stages: [
                    {
                        stageName: 'Source',
                        actions: [
                            new cpactions.S3SourceAction({
                                actionName: 'S3_Source',
                                bucket: s3.Bucket.fromBucketName(stack, 'Bucket', 'bucket'),
                                bucketKey: 'key',
                                output: sourceOutput,
                            }),
                        ],
                    },
                    {
                        stageName: 'Build',
                        actions: [
                            codeBuildAction,
                            new cpactions.ManualApprovalAction({
                                actionName: 'Approve',
                                additionalInformation: codeBuildAction.variable('SomeVar'),
                                notificationTopic: sns.Topic.fromTopicArn(stack, 'Topic', 'arn:aws:sns:us-east-1:123456789012:mytopic'),
                                runOrder: 2,
                            }),
                        ],
                    },
                ],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
                'Stages': [
                    {
                        'Name': 'Source',
                    },
                    {
                        'Name': 'Build',
                        'Actions': [
                            {
                                'Name': 'CodeBuild',
                                'Namespace': 'Build_CodeBuild_NS',
                            },
                            {
                                'Name': 'Approve',
                                'Configuration': {
                                    'CustomData': '#{Build_CodeBuild_NS.SomeVar}',
                                },
                            },
                        ],
                    },
                ],
            });
        });
        test('sets the BatchEnabled configuration', () => {
            const stack = new core_1.Stack();
            const codeBuildProject = new codebuild.PipelineProject(stack, 'CodeBuild');
            const sourceOutput = new codepipeline.Artifact();
            new codepipeline.Pipeline(stack, 'Pipeline', {
                stages: [
                    {
                        stageName: 'Source',
                        actions: [
                            new cpactions.S3SourceAction({
                                actionName: 'S3_Source',
                                bucket: new s3.Bucket(stack, 'Bucket'),
                                bucketKey: 'key',
                                output: sourceOutput,
                            }),
                        ],
                    },
                    {
                        stageName: 'Build',
                        actions: [
                            new cpactions.CodeBuildAction({
                                actionName: 'CodeBuild',
                                input: sourceOutput,
                                project: codeBuildProject,
                                executeBatchBuild: true,
                            }),
                        ],
                    },
                ],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
                'Stages': [
                    {
                        'Name': 'Source',
                    },
                    {
                        'Name': 'Build',
                        'Actions': [
                            {
                                'Name': 'CodeBuild',
                                'Configuration': {
                                    'BatchEnabled': 'true',
                                },
                            },
                        ],
                    },
                ],
            });
        });
        test('sets the CombineArtifacts configuration', () => {
            const stack = new core_1.Stack();
            const codeBuildProject = new codebuild.PipelineProject(stack, 'CodeBuild');
            const sourceOutput = new codepipeline.Artifact();
            new codepipeline.Pipeline(stack, 'Pipeline', {
                stages: [
                    {
                        stageName: 'Source',
                        actions: [
                            new cpactions.S3SourceAction({
                                actionName: 'S3_Source',
                                bucket: new s3.Bucket(stack, 'Bucket'),
                                bucketKey: 'key',
                                output: sourceOutput,
                            }),
                        ],
                    },
                    {
                        stageName: 'Build',
                        actions: [
                            new cpactions.CodeBuildAction({
                                actionName: 'CodeBuild',
                                input: sourceOutput,
                                project: codeBuildProject,
                                executeBatchBuild: true,
                                combineBatchBuildArtifacts: true,
                            }),
                        ],
                    },
                ],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
                'Stages': [
                    {
                        'Name': 'Source',
                    },
                    {
                        'Name': 'Build',
                        'Actions': [
                            {
                                'Name': 'CodeBuild',
                                'Configuration': {
                                    'BatchEnabled': 'true',
                                    'CombineArtifacts': 'true',
                                },
                            },
                        ],
                    },
                ],
            });
        });
        describe('environment variables', () => {
            test('should fail by default when added to a Pipeline while using a secret value in a plaintext variable', () => {
                const stack = new core_1.Stack();
                const sourceOutput = new codepipeline.Artifact();
                const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
                    stages: [
                        {
                            stageName: 'Source',
                            actions: [new cpactions.CodeCommitSourceAction({
                                    actionName: 'source',
                                    repository: new codecommit.Repository(stack, 'CodeCommitRepo', {
                                        repositoryName: 'my-repo',
                                    }),
                                    output: sourceOutput,
                                })],
                        },
                    ],
                });
                const buildStage = pipeline.addStage({
                    stageName: 'Build',
                });
                const codeBuildProject = new codebuild.PipelineProject(stack, 'CodeBuild');
                const buildAction = new cpactions.CodeBuildAction({
                    actionName: 'Build',
                    project: codeBuildProject,
                    input: sourceOutput,
                    environmentVariables: {
                        'X': {
                            value: core_1.SecretValue.secretsManager('my-secret'),
                        },
                    },
                });
                expect(() => {
                    buildStage.addAction(buildAction);
                }).toThrow(/Plaintext environment variable 'X' contains a secret value!/);
            });
            test("should allow opting out of the 'secret value in a plaintext variable' validation", () => {
                const stack = new core_1.Stack();
                const sourceOutput = new codepipeline.Artifact();
                new codepipeline.Pipeline(stack, 'Pipeline', {
                    stages: [
                        {
                            stageName: 'Source',
                            actions: [new cpactions.CodeCommitSourceAction({
                                    actionName: 'source',
                                    repository: new codecommit.Repository(stack, 'CodeCommitRepo', {
                                        repositoryName: 'my-repo',
                                    }),
                                    output: sourceOutput,
                                })],
                        },
                        {
                            stageName: 'Build',
                            actions: [new cpactions.CodeBuildAction({
                                    actionName: 'build',
                                    project: new codebuild.PipelineProject(stack, 'CodeBuild'),
                                    input: sourceOutput,
                                    environmentVariables: {
                                        'X': {
                                            value: core_1.SecretValue.secretsManager('my-secret'),
                                        },
                                    },
                                    checkSecretsInPlainTextEnvVariables: false,
                                })],
                        },
                    ],
                });
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZWJ1aWxkLWFjdGlvbi50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29kZWJ1aWxkLWFjdGlvbi50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQStDO0FBQy9DLG9EQUFvRDtBQUNwRCxzREFBc0Q7QUFDdEQsMERBQTBEO0FBQzFELHNDQUFzQztBQUN0Qyx3Q0FBd0M7QUFDeEMsd0NBQXdEO0FBQ3hELHVDQUF1QztBQUV2QyxnQ0FBZ0M7QUFFaEMsUUFBUSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsRUFBRTtJQUNoQyxRQUFRLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxFQUFFO1FBQ2hDLFFBQVEsQ0FBQyx1Q0FBdUMsRUFBRSxHQUFHLEVBQUU7WUFDckQsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsRUFBRTtnQkFDM0IsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFHLEVBQUUsQ0FBQztnQkFFdEIsTUFBTSxZQUFZLEdBQUcsSUFBSSxZQUFLLENBQUMsR0FBRyxFQUFFLGNBQWMsRUFBRTtvQkFDbEQsR0FBRyxFQUFFO3dCQUNILE1BQU0sRUFBRSxXQUFXO3dCQUNuQixPQUFPLEVBQUUsY0FBYztxQkFDeEI7aUJBQ0YsQ0FBQyxDQUFDO2dCQUNILE1BQU0sT0FBTyxHQUFHLElBQUksU0FBUyxDQUFDLGVBQWUsQ0FBQyxZQUFZLEVBQUUsU0FBUyxDQUFDLENBQUM7Z0JBRXZFLE1BQU0sYUFBYSxHQUFHLElBQUksWUFBSyxDQUFDLEdBQUcsRUFBRSxlQUFlLEVBQUU7b0JBQ3BELEdBQUcsRUFBRTt3QkFDSCxNQUFNLEVBQUUsV0FBVzt3QkFDbkIsT0FBTyxFQUFFLGNBQWM7cUJBQ3hCO2lCQUNGLENBQUMsQ0FBQztnQkFDSCxNQUFNLFlBQVksR0FBRyxJQUFJLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDakQsTUFBTSxRQUFRLEdBQUcsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxVQUFV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QUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGNvZGVidWlsZCBmcm9tICdAYXdzLWNkay9hd3MtY29kZWJ1aWxkJztcbmltcG9ydCAqIGFzIGNvZGVjb21taXQgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVjb21taXQnO1xuaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lIGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlcGlwZWxpbmUnO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnQGF3cy1jZGsvYXdzLXMzJztcbmltcG9ydCAqIGFzIHNucyBmcm9tICdAYXdzLWNkay9hd3Mtc25zJztcbmltcG9ydCB7IEFwcCwgU2VjcmV0VmFsdWUsIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjcGFjdGlvbnMgZnJvbSAnLi4vLi4vbGliJztcblxuLyogZXNsaW50LWRpc2FibGUgcXVvdGUtcHJvcHMgKi9cblxuZGVzY3JpYmUoJ0NvZGVCdWlsZCBBY3Rpb24nLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdDb2RlQnVpbGQgYWN0aW9uJywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCd0aGF0IGlzIGNyb3NzLWFjY291bnQgYW5kIGhhcyBvdXRwdXRzJywgKCkgPT4ge1xuICAgICAgdGVzdCgnY2F1c2VzIGFuIGVycm9yJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5cbiAgICAgICAgY29uc3QgcHJvamVjdFN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1Byb2plY3RTdGFjaycsIHtcbiAgICAgICAgICBlbnY6IHtcbiAgICAgICAgICAgIHJlZ2lvbjogJ3VzLXdlc3QtMicsXG4gICAgICAgICAgICBhY2NvdW50OiAnMDEyMzQ1Njc4OTEyJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgcHJvamVjdCA9IG5ldyBjb2RlYnVpbGQuUGlwZWxpbmVQcm9qZWN0KHByb2plY3RTdGFjaywgJ1Byb2plY3QnKTtcblxuICAgICAgICBjb25zdCBwaXBlbGluZVN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1BpcGVsaW5lU3RhY2snLCB7XG4gICAgICAgICAgZW52OiB7XG4gICAgICAgICAgICByZWdpb246ICd1cy13ZXN0LTInLFxuICAgICAgICAgICAgYWNjb3VudDogJzAxMjM0NTY3ODkxMycsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IHNvdXJjZU91dHB1dCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoKTtcbiAgICAgICAgY29uc3QgcGlwZWxpbmUgPSBuZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHBpcGVsaW5lU3RhY2ssICdQaXBlbGluZScsIHtcbiAgICAgICAgICBzdGFnZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgc3RhZ2VOYW1lOiAnU291cmNlJyxcbiAgICAgICAgICAgICAgYWN0aW9uczogW25ldyBjcGFjdGlvbnMuQ29kZUNvbW1pdFNvdXJjZUFjdGlvbih7XG4gICAgICAgICAgICAgICAgYWN0aW9uTmFtZTogJ0NvZGVDb21taXQnLFxuICAgICAgICAgICAgICAgIHJlcG9zaXRvcnk6IGNvZGVjb21taXQuUmVwb3NpdG9yeS5mcm9tUmVwb3NpdG9yeU5hbWUocGlwZWxpbmVTdGFjaywgJ1JlcG8nLCAncmVwby1uYW1lJyksXG4gICAgICAgICAgICAgICAgb3V0cHV0OiBzb3VyY2VPdXRwdXQsXG4gICAgICAgICAgICAgIH0pXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGJ1aWxkU3RhZ2UgPSBwaXBlbGluZS5hZGRTdGFnZSh7XG4gICAgICAgICAgc3RhZ2VOYW1lOiAnQnVpbGQnLFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyB0aGlzIHdvcmtzIGZpbmUgLSBubyBvdXRwdXRzIVxuICAgICAgICBidWlsZFN0YWdlLmFkZEFjdGlvbihuZXcgY3BhY3Rpb25zLkNvZGVCdWlsZEFjdGlvbih7XG4gICAgICAgICAgYWN0aW9uTmFtZTogJ0J1aWxkMScsXG4gICAgICAgICAgaW5wdXQ6IHNvdXJjZU91dHB1dCxcbiAgICAgICAgICBwcm9qZWN0LFxuICAgICAgICB9KSk7XG5cbiAgICAgICAgY29uc3QgYnVpbGRBY3Rpb24yID0gbmV3IGNwYWN0aW9ucy5Db2RlQnVpbGRBY3Rpb24oe1xuICAgICAgICAgIGFjdGlvbk5hbWU6ICdCdWlsZDInLFxuICAgICAgICAgIGlucHV0OiBzb3VyY2VPdXRwdXQsXG4gICAgICAgICAgcHJvamVjdCxcbiAgICAgICAgICBvdXRwdXRzOiBbbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpXSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgICBidWlsZFN0YWdlLmFkZEFjdGlvbihidWlsZEFjdGlvbjIpO1xuICAgICAgICB9KS50b1Rocm93KC9odHRwczpcXC9cXC9naXRodWJcXC5jb21cXC9hd3NcXC9hd3MtY2RrXFwvaXNzdWVzXFwvNDE2OS8pO1xuXG5cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY2FuIGJlIGJhY2tlZCBieSBhbiBpbXBvcnRlZCBwcm9qZWN0JywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgICAgY29uc3QgY29kZUJ1aWxkUHJvamVjdCA9IGNvZGVidWlsZC5QaXBlbGluZVByb2plY3QuZnJvbVByb2plY3ROYW1lKHN0YWNrLCAnQ29kZUJ1aWxkJyxcbiAgICAgICAgJ2NvZGVCdWlsZFByb2plY3ROYW1lSW5Bbm90aGVyQWNjb3VudCcpO1xuXG4gICAgICBjb25zdCBzb3VyY2VPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCk7XG4gICAgICBuZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHN0YWNrLCAnUGlwZWxpbmUnLCB7XG4gICAgICAgIHN0YWdlczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN0YWdlTmFtZTogJ1NvdXJjZScsXG4gICAgICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgICAgIG5ldyBjcGFjdGlvbnMuUzNTb3VyY2VBY3Rpb24oe1xuICAgICAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdTM19Tb3VyY2UnLFxuICAgICAgICAgICAgICAgIGJ1Y2tldDogbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0J1Y2tldCcpLFxuICAgICAgICAgICAgICAgIGJ1Y2tldEtleTogJ2tleScsXG4gICAgICAgICAgICAgICAgb3V0cHV0OiBzb3VyY2VPdXRwdXQsXG4gICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN0YWdlTmFtZTogJ0J1aWxkJyxcbiAgICAgICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAgICAgbmV3IGNwYWN0aW9ucy5Db2RlQnVpbGRBY3Rpb24oe1xuICAgICAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdDb2RlQnVpbGQnLFxuICAgICAgICAgICAgICAgIGlucHV0OiBzb3VyY2VPdXRwdXQsXG4gICAgICAgICAgICAgICAgcHJvamVjdDogY29kZUJ1aWxkUHJvamVjdCxcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZVBpcGVsaW5lOjpQaXBlbGluZScsIHtcbiAgICAgICAgJ1N0YWdlcyc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnTmFtZSc6ICdTb3VyY2UnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ05hbWUnOiAnQnVpbGQnLFxuICAgICAgICAgICAgJ0FjdGlvbnMnOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnTmFtZSc6ICdDb2RlQnVpbGQnLFxuICAgICAgICAgICAgICAgICdDb25maWd1cmF0aW9uJzoge1xuICAgICAgICAgICAgICAgICAgJ1Byb2plY3ROYW1lJzogJ2NvZGVCdWlsZFByb2plY3ROYW1lSW5Bbm90aGVyQWNjb3VudCcsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ2V4cG9zZXMgdmFyaWFibGVzIGZvciBvdGhlciBhY3Rpb25zIHRvIGNvbnN1bWUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgICBjb25zdCBzb3VyY2VPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCk7XG4gICAgICBjb25zdCBjb2RlQnVpbGRBY3Rpb24gPSBuZXcgY3BhY3Rpb25zLkNvZGVCdWlsZEFjdGlvbih7XG4gICAgICAgIGFjdGlvbk5hbWU6ICdDb2RlQnVpbGQnLFxuICAgICAgICBpbnB1dDogc291cmNlT3V0cHV0LFxuICAgICAgICBwcm9qZWN0OiBuZXcgY29kZWJ1aWxkLlBpcGVsaW5lUHJvamVjdChzdGFjaywgJ0NvZGVCdWlsZCcsIHtcbiAgICAgICAgICBidWlsZFNwZWM6IGNvZGVidWlsZC5CdWlsZFNwZWMuZnJvbU9iamVjdCh7XG4gICAgICAgICAgICB2ZXJzaW9uOiAnMC4yJyxcbiAgICAgICAgICAgIGVudjoge1xuICAgICAgICAgICAgICAnZXhwb3J0ZWQtdmFyaWFibGVzJzogW1xuICAgICAgICAgICAgICAgICdTb21lVmFyJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwaGFzZXM6IHtcbiAgICAgICAgICAgICAgYnVpbGQ6IHtcbiAgICAgICAgICAgICAgICBjb21tYW5kczogW1xuICAgICAgICAgICAgICAgICAgJ2V4cG9ydCBTb21lVmFyPVwiU29tZSBWYWx1ZVwiJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgfSksXG4gICAgICB9KTtcbiAgICAgIG5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUoc3RhY2ssICdQaXBlbGluZScsIHtcbiAgICAgICAgc3RhZ2VzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3RhZ2VOYW1lOiAnU291cmNlJyxcbiAgICAgICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAgICAgbmV3IGNwYWN0aW9ucy5TM1NvdXJjZUFjdGlvbih7XG4gICAgICAgICAgICAgICAgYWN0aW9uTmFtZTogJ1MzX1NvdXJjZScsXG4gICAgICAgICAgICAgICAgYnVja2V0OiBzMy5CdWNrZXQuZnJvbUJ1Y2tldE5hbWUoc3RhY2ssICdCdWNrZXQnLCAnYnVja2V0JyksXG4gICAgICAgICAgICAgICAgYnVja2V0S2V5OiAna2V5JyxcbiAgICAgICAgICAgICAgICBvdXRwdXQ6IHNvdXJjZU91dHB1dCxcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3RhZ2VOYW1lOiAnQnVpbGQnLFxuICAgICAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgICAgICBjb2RlQnVpbGRBY3Rpb24sXG4gICAgICAgICAgICAgIG5ldyBjcGFjdGlvbnMuTWFudWFsQXBwcm92YWxBY3Rpb24oe1xuICAgICAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdBcHByb3ZlJyxcbiAgICAgICAgICAgICAgICBhZGRpdGlvbmFsSW5mb3JtYXRpb246IGNvZGVCdWlsZEFjdGlvbi52YXJpYWJsZSgnU29tZVZhcicpLFxuICAgICAgICAgICAgICAgIG5vdGlmaWNhdGlvblRvcGljOiBzbnMuVG9waWMuZnJvbVRvcGljQXJuKHN0YWNrLCAnVG9waWMnLCAnYXJuOmF3czpzbnM6dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjpteXRvcGljJyksXG4gICAgICAgICAgICAgICAgcnVuT3JkZXI6IDIsXG4gICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVQaXBlbGluZTo6UGlwZWxpbmUnLCB7XG4gICAgICAgICdTdGFnZXMnOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ05hbWUnOiAnU291cmNlJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgICdOYW1lJzogJ0J1aWxkJyxcbiAgICAgICAgICAgICdBY3Rpb25zJzogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ05hbWUnOiAnQ29kZUJ1aWxkJyxcbiAgICAgICAgICAgICAgICAnTmFtZXNwYWNlJzogJ0J1aWxkX0NvZGVCdWlsZF9OUycsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnTmFtZSc6ICdBcHByb3ZlJyxcbiAgICAgICAgICAgICAgICAnQ29uZmlndXJhdGlvbic6IHtcbiAgICAgICAgICAgICAgICAgICdDdXN0b21EYXRhJzogJyN7QnVpbGRfQ29kZUJ1aWxkX05TLlNvbWVWYXJ9JyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnc2V0cyB0aGUgQmF0Y2hFbmFibGVkIGNvbmZpZ3VyYXRpb24nLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgICBjb25zdCBjb2RlQnVpbGRQcm9qZWN0ID0gbmV3IGNvZGVidWlsZC5QaXBlbGluZVByb2plY3Qoc3RhY2ssICdDb2RlQnVpbGQnKTtcblxuICAgICAgY29uc3Qgc291cmNlT3V0cHV0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpO1xuICAgICAgbmV3IGNvZGVwaXBlbGluZS5QaXBlbGluZShzdGFjaywgJ1BpcGVsaW5lJywge1xuICAgICAgICBzdGFnZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdGFnZU5hbWU6ICdTb3VyY2UnLFxuICAgICAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgICAgICBuZXcgY3BhY3Rpb25zLlMzU291cmNlQWN0aW9uKHtcbiAgICAgICAgICAgICAgICBhY3Rpb25OYW1lOiAnUzNfU291cmNlJyxcbiAgICAgICAgICAgICAgICBidWNrZXQ6IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdCdWNrZXQnKSxcbiAgICAgICAgICAgICAgICBidWNrZXRLZXk6ICdrZXknLFxuICAgICAgICAgICAgICAgIG91dHB1dDogc291cmNlT3V0cHV0LFxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdGFnZU5hbWU6ICdCdWlsZCcsXG4gICAgICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgICAgIG5ldyBjcGFjdGlvbnMuQ29kZUJ1aWxkQWN0aW9uKHtcbiAgICAgICAgICAgICAgICBhY3Rpb25OYW1lOiAnQ29kZUJ1aWxkJyxcbiAgICAgICAgICAgICAgICBpbnB1dDogc291cmNlT3V0cHV0LFxuICAgICAgICAgICAgICAgIHByb2plY3Q6IGNvZGVCdWlsZFByb2plY3QsXG4gICAgICAgICAgICAgICAgZXhlY3V0ZUJhdGNoQnVpbGQ6IHRydWUsXG4gICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVQaXBlbGluZTo6UGlwZWxpbmUnLCB7XG4gICAgICAgICdTdGFnZXMnOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ05hbWUnOiAnU291cmNlJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgICdOYW1lJzogJ0J1aWxkJyxcbiAgICAgICAgICAgICdBY3Rpb25zJzogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ05hbWUnOiAnQ29kZUJ1aWxkJyxcbiAgICAgICAgICAgICAgICAnQ29uZmlndXJhdGlvbic6IHtcbiAgICAgICAgICAgICAgICAgICdCYXRjaEVuYWJsZWQnOiAndHJ1ZScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ3NldHMgdGhlIENvbWJpbmVBcnRpZmFjdHMgY29uZmlndXJhdGlvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAgIGNvbnN0IGNvZGVCdWlsZFByb2plY3QgPSBuZXcgY29kZWJ1aWxkLlBpcGVsaW5lUHJvamVjdChzdGFjaywgJ0NvZGVCdWlsZCcpO1xuXG4gICAgICBjb25zdCBzb3VyY2VPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCk7XG4gICAgICBuZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHN0YWNrLCAnUGlwZWxpbmUnLCB7XG4gICAgICAgIHN0YWdlczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN0YWdlTmFtZTogJ1NvdXJjZScsXG4gICAgICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgICAgIG5ldyBjcGFjdGlvbnMuUzNTb3VyY2VBY3Rpb24oe1xuICAgICAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdTM19Tb3VyY2UnLFxuICAgICAgICAgICAgICAgIGJ1Y2tldDogbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0J1Y2tldCcpLFxuICAgICAgICAgICAgICAgIGJ1Y2tldEtleTogJ2tleScsXG4gICAgICAgICAgICAgICAgb3V0cHV0OiBzb3VyY2VPdXRwdXQsXG4gICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN0YWdlTmFtZTogJ0J1aWxkJyxcbiAgICAgICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAgICAgbmV3IGNwYWN0aW9ucy5Db2RlQnVpbGRBY3Rpb24oe1xuICAgICAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdDb2RlQnVpbGQnLFxuICAgICAgICAgICAgICAgIGlucHV0OiBzb3VyY2VPdXRwdXQsXG4gICAgICAgICAgICAgICAgcHJvamVjdDogY29kZUJ1aWxkUHJvamVjdCxcbiAgICAgICAgICAgICAgICBleGVjdXRlQmF0Y2hCdWlsZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBjb21iaW5lQmF0Y2hCdWlsZEFydGlmYWN0czogdHJ1ZSxcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZVBpcGVsaW5lOjpQaXBlbGluZScsIHtcbiAgICAgICAgJ1N0YWdlcyc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnTmFtZSc6ICdTb3VyY2UnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ05hbWUnOiAnQnVpbGQnLFxuICAgICAgICAgICAgJ0FjdGlvbnMnOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnTmFtZSc6ICdDb2RlQnVpbGQnLFxuICAgICAgICAgICAgICAgICdDb25maWd1cmF0aW9uJzoge1xuICAgICAgICAgICAgICAgICAgJ0JhdGNoRW5hYmxlZCc6ICd0cnVlJyxcbiAgICAgICAgICAgICAgICAgICdDb21iaW5lQXJ0aWZhY3RzJzogJ3RydWUnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuXG4gICAgfSk7XG5cbiAgICBkZXNjcmliZSgnZW52aXJvbm1lbnQgdmFyaWFibGVzJywgKCkgPT4ge1xuICAgICAgdGVzdCgnc2hvdWxkIGZhaWwgYnkgZGVmYXVsdCB3aGVuIGFkZGVkIHRvIGEgUGlwZWxpbmUgd2hpbGUgdXNpbmcgYSBzZWNyZXQgdmFsdWUgaW4gYSBwbGFpbnRleHQgdmFyaWFibGUnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAgICAgY29uc3Qgc291cmNlT3V0cHV0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpO1xuICAgICAgICBjb25zdCBwaXBlbGluZSA9IG5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUoc3RhY2ssICdQaXBlbGluZScsIHtcbiAgICAgICAgICBzdGFnZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgc3RhZ2VOYW1lOiAnU291cmNlJyxcbiAgICAgICAgICAgICAgYWN0aW9uczogW25ldyBjcGFjdGlvbnMuQ29kZUNvbW1pdFNvdXJjZUFjdGlvbih7XG4gICAgICAgICAgICAgICAgYWN0aW9uTmFtZTogJ3NvdXJjZScsXG4gICAgICAgICAgICAgICAgcmVwb3NpdG9yeTogbmV3IGNvZGVjb21taXQuUmVwb3NpdG9yeShzdGFjaywgJ0NvZGVDb21taXRSZXBvJywge1xuICAgICAgICAgICAgICAgICAgcmVwb3NpdG9yeU5hbWU6ICdteS1yZXBvJyxcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBvdXRwdXQ6IHNvdXJjZU91dHB1dCxcbiAgICAgICAgICAgICAgfSldLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBidWlsZFN0YWdlID0gcGlwZWxpbmUuYWRkU3RhZ2Uoe1xuICAgICAgICAgIHN0YWdlTmFtZTogJ0J1aWxkJyxcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IGNvZGVCdWlsZFByb2plY3QgPSBuZXcgY29kZWJ1aWxkLlBpcGVsaW5lUHJvamVjdChzdGFjaywgJ0NvZGVCdWlsZCcpO1xuICAgICAgICBjb25zdCBidWlsZEFjdGlvbiA9IG5ldyBjcGFjdGlvbnMuQ29kZUJ1aWxkQWN0aW9uKHtcbiAgICAgICAgICBhY3Rpb25OYW1lOiAnQnVpbGQnLFxuICAgICAgICAgIHByb2plY3Q6IGNvZGVCdWlsZFByb2plY3QsXG4gICAgICAgICAgaW5wdXQ6IHNvdXJjZU91dHB1dCxcbiAgICAgICAgICBlbnZpcm9ubWVudFZhcmlhYmxlczoge1xuICAgICAgICAgICAgJ1gnOiB7XG4gICAgICAgICAgICAgIHZhbHVlOiBTZWNyZXRWYWx1ZS5zZWNyZXRzTWFuYWdlcignbXktc2VjcmV0JyksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgICAgYnVpbGRTdGFnZS5hZGRBY3Rpb24oYnVpbGRBY3Rpb24pO1xuICAgICAgICB9KS50b1Rocm93KC9QbGFpbnRleHQgZW52aXJvbm1lbnQgdmFyaWFibGUgJ1gnIGNvbnRhaW5zIGEgc2VjcmV0IHZhbHVlIS8pO1xuXG5cbiAgICAgIH0pO1xuXG4gICAgICB0ZXN0KFwic2hvdWxkIGFsbG93IG9wdGluZyBvdXQgb2YgdGhlICdzZWNyZXQgdmFsdWUgaW4gYSBwbGFpbnRleHQgdmFyaWFibGUnIHZhbGlkYXRpb25cIiwgKCkgPT4ge1xuICAgICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgICAgIGNvbnN0IHNvdXJjZU91dHB1dCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoKTtcbiAgICAgICAgbmV3IGNvZGVwaXBlbGluZS5QaXBlbGluZShzdGFjaywgJ1BpcGVsaW5lJywge1xuICAgICAgICAgIHN0YWdlczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBzdGFnZU5hbWU6ICdTb3VyY2UnLFxuICAgICAgICAgICAgICBhY3Rpb25zOiBbbmV3IGNwYWN0aW9ucy5Db2RlQ29tbWl0U291cmNlQWN0aW9uKHtcbiAgICAgICAgICAgICAgICBhY3Rpb25OYW1lOiAnc291cmNlJyxcbiAgICAgICAgICAgICAgICByZXBvc2l0b3J5OiBuZXcgY29kZWNvbW1pdC5SZXBvc2l0b3J5KHN0YWNrLCAnQ29kZUNvbW1pdFJlcG8nLCB7XG4gICAgICAgICAgICAgICAgICByZXBvc2l0b3J5TmFtZTogJ215LXJlcG8nLFxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIG91dHB1dDogc291cmNlT3V0cHV0LFxuICAgICAgICAgICAgICB9KV0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBzdGFnZU5hbWU6ICdCdWlsZCcsXG4gICAgICAgICAgICAgIGFjdGlvbnM6IFtuZXcgY3BhY3Rpb25zLkNvZGVCdWlsZEFjdGlvbih7XG4gICAgICAgICAgICAgICAgYWN0aW9uTmFtZTogJ2J1aWxkJyxcbiAgICAgICAgICAgICAgICBwcm9qZWN0OiBuZXcgY29kZWJ1aWxkLlBpcGVsaW5lUHJvamVjdChzdGFjaywgJ0NvZGVCdWlsZCcpLFxuICAgICAgICAgICAgICAgIGlucHV0OiBzb3VyY2VPdXRwdXQsXG4gICAgICAgICAgICAgICAgZW52aXJvbm1lbnRWYXJpYWJsZXM6IHtcbiAgICAgICAgICAgICAgICAgICdYJzoge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogU2VjcmV0VmFsdWUuc2VjcmV0c01hbmFnZXIoJ215LXNlY3JldCcpLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGNoZWNrU2VjcmV0c0luUGxhaW5UZXh0RW52VmFyaWFibGVzOiBmYWxzZSxcbiAgICAgICAgICAgICAgfSldLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9KTtcblxuXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==