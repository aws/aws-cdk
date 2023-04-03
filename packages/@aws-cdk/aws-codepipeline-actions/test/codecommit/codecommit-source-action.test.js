"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const codebuild = require("@aws-cdk/aws-codebuild");
const codecommit = require("@aws-cdk/aws-codecommit");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const iam = require("@aws-cdk/aws-iam");
const kms = require("@aws-cdk/aws-kms");
const s3 = require("@aws-cdk/aws-s3");
const core_1 = require("@aws-cdk/core");
const cpactions = require("../../lib");
/* eslint-disable quote-props */
describe('CodeCommit Source Action', () => {
    describe('CodeCommit Source Action', () => {
        test('by default does not poll for source changes and uses Events', () => {
            const stack = new core_1.Stack();
            minimalPipeline(stack, undefined);
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
                'Stages': [
                    {
                        'Actions': [
                            {
                                'Configuration': {
                                    'PollForSourceChanges': false,
                                },
                            },
                        ],
                    },
                    {},
                ],
            });
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::Events::Rule', 1);
        });
        test('cross-account CodeCommit Repository Source does not use target role in source stack', () => {
            // Test for https://github.com/aws/aws-cdk/issues/15639
            const app = new core_1.App();
            const sourceStack = new core_1.Stack(app, 'SourceStack', { env: { account: '1234', region: 'north-pole' } });
            const targetStack = new core_1.Stack(app, 'TargetStack', { env: { account: '5678', region: 'north-pole' } });
            const repo = new codecommit.Repository(sourceStack, 'MyRepo', {
                repositoryName: 'my-repo',
            });
            const sourceOutput = new codepipeline.Artifact();
            new codepipeline.Pipeline(targetStack, 'MyPipeline', {
                stages: [
                    {
                        stageName: 'Source',
                        actions: [
                            new cpactions.CodeCommitSourceAction({ actionName: 'Source', repository: repo, output: sourceOutput }),
                        ],
                    },
                    {
                        stageName: 'Build',
                        actions: [
                            new cpactions.CodeBuildAction({ actionName: 'Build', project: new codebuild.PipelineProject(targetStack, 'MyProject'), input: sourceOutput }),
                        ],
                    },
                ],
            });
            // THEN - creates a Rule in the source stack targeting the pipeline stack's event bus using a generated role
            assertions_1.Template.fromStack(sourceStack).hasResourceProperties('AWS::Events::Rule', {
                EventPattern: {
                    source: ['aws.codecommit'],
                    resources: [
                        { 'Fn::GetAtt': ['MyRepoF4F48043', 'Arn'] },
                    ],
                },
                Targets: [{
                        RoleARN: assertions_1.Match.absent(),
                        Arn: {
                            'Fn::Join': ['', [
                                    'arn:',
                                    { 'Ref': 'AWS::Partition' },
                                    ':events:north-pole:5678:event-bus/default',
                                ]],
                        },
                    }],
            });
            // THEN - creates a Rule in the pipeline stack using the role to start the pipeline
            assertions_1.Template.fromStack(targetStack).hasResourceProperties('AWS::Events::Rule', {
                'EventPattern': {
                    'source': [
                        'aws.codecommit',
                    ],
                    'resources': [
                        {
                            'Fn::Join': [
                                '',
                                [
                                    'arn:',
                                    { 'Ref': 'AWS::Partition' },
                                    ':codecommit:north-pole:1234:my-repo',
                                ],
                            ],
                        },
                    ],
                },
                'Targets': [
                    {
                        'Arn': {
                            'Fn::Join': ['', [
                                    'arn:',
                                    { 'Ref': 'AWS::Partition' },
                                    ':codepipeline:north-pole:5678:',
                                    { 'Ref': 'MyPipelineAED38ECF' },
                                ]],
                        },
                        'RoleArn': { 'Fn::GetAtt': ['MyPipelineEventsRoleFAB99F32', 'Arn'] },
                    },
                ],
            });
        });
        test('does not poll for source changes and uses Events for CodeCommitTrigger.EVENTS', () => {
            const stack = new core_1.Stack();
            minimalPipeline(stack, cpactions.CodeCommitTrigger.EVENTS);
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
                'Stages': [
                    {
                        'Actions': [
                            {
                                'Configuration': {
                                    'PollForSourceChanges': false,
                                },
                            },
                        ],
                    },
                    {},
                ],
            });
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::Events::Rule', 1);
        });
        test('polls for source changes and does not use Events for CodeCommitTrigger.POLL', () => {
            const stack = new core_1.Stack();
            minimalPipeline(stack, cpactions.CodeCommitTrigger.POLL);
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
                'Stages': [
                    {
                        'Actions': [
                            {
                                'Configuration': {
                                    'PollForSourceChanges': true,
                                },
                            },
                        ],
                    },
                    {},
                ],
            });
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::Events::Rule', 0);
        });
        test('does not poll for source changes and does not use Events for CodeCommitTrigger.NONE', () => {
            const stack = new core_1.Stack();
            minimalPipeline(stack, cpactions.CodeCommitTrigger.NONE);
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
                'Stages': [
                    {
                        'Actions': [
                            {
                                'Configuration': {
                                    'PollForSourceChanges': false,
                                },
                            },
                        ],
                    },
                    {},
                ],
            });
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::Events::Rule', 0);
        });
        test('cannot be created with an empty branch', () => {
            const stack = new core_1.Stack();
            const repo = new codecommit.Repository(stack, 'MyRepo', {
                repositoryName: 'my-repo',
            });
            expect(() => {
                new cpactions.CodeCommitSourceAction({
                    actionName: 'Source2',
                    repository: repo,
                    output: new codepipeline.Artifact(),
                    branch: '',
                });
            }).toThrow(/'branch' parameter cannot be an empty string/);
        });
        test('allows using the same repository multiple times with different branches when trigger=EVENTS', () => {
            const stack = new core_1.Stack();
            const repo = new codecommit.Repository(stack, 'MyRepo', {
                repositoryName: 'my-repo',
            });
            const sourceOutput1 = new codepipeline.Artifact();
            const sourceOutput2 = new codepipeline.Artifact();
            new codepipeline.Pipeline(stack, 'MyPipeline', {
                stages: [
                    {
                        stageName: 'Source',
                        actions: [
                            new cpactions.CodeCommitSourceAction({
                                actionName: 'Source1',
                                repository: repo,
                                output: sourceOutput1,
                            }),
                            new cpactions.CodeCommitSourceAction({
                                actionName: 'Source2',
                                repository: repo,
                                output: sourceOutput2,
                                branch: 'develop',
                            }),
                        ],
                    },
                    {
                        stageName: 'Build',
                        actions: [
                            new cpactions.CodeBuildAction({
                                actionName: 'Build',
                                project: new codebuild.PipelineProject(stack, 'MyProject'),
                                input: sourceOutput1,
                            }),
                        ],
                    },
                ],
            });
        });
        test('exposes variables for other actions to consume', () => {
            const stack = new core_1.Stack();
            const sourceOutput = new codepipeline.Artifact();
            const codeCommitSourceAction = new cpactions.CodeCommitSourceAction({
                actionName: 'Source',
                repository: new codecommit.Repository(stack, 'MyRepo', {
                    repositoryName: 'my-repo',
                }),
                output: sourceOutput,
            });
            new codepipeline.Pipeline(stack, 'Pipeline', {
                stages: [
                    {
                        stageName: 'Source',
                        actions: [codeCommitSourceAction],
                    },
                    {
                        stageName: 'Build',
                        actions: [
                            new cpactions.CodeBuildAction({
                                actionName: 'Build',
                                project: new codebuild.PipelineProject(stack, 'MyProject'),
                                input: sourceOutput,
                                environmentVariables: {
                                    AuthorDate: { value: codeCommitSourceAction.variables.authorDate },
                                },
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
                                'Name': 'Build',
                                'Configuration': {
                                    'EnvironmentVariables': '[{"name":"AuthorDate","type":"PLAINTEXT","value":"#{Source_Source_NS.AuthorDate}"}]',
                                },
                            },
                        ],
                    },
                ],
            });
        });
        test('allows using a Token for the branch name', () => {
            const stack = new core_1.Stack();
            const sourceOutput = new codepipeline.Artifact();
            new codepipeline.Pipeline(stack, 'P', {
                stages: [
                    {
                        stageName: 'Source',
                        actions: [
                            new cpactions.CodeCommitSourceAction({
                                actionName: 'CodeCommit',
                                repository: new codecommit.Repository(stack, 'R', {
                                    repositoryName: 'repository',
                                }),
                                branch: core_1.Lazy.string({ produce: () => 'my-branch' }),
                                output: sourceOutput,
                            }),
                        ],
                    },
                    {
                        stageName: 'Build',
                        actions: [
                            new cpactions.CodeBuildAction({
                                actionName: 'Build',
                                project: new codebuild.PipelineProject(stack, 'CodeBuild'),
                                input: sourceOutput,
                            }),
                        ],
                    },
                ],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
                EventPattern: {
                    detail: {
                        referenceName: ['my-branch'],
                    },
                },
            });
        });
        test('allows to enable full clone', () => {
            const stack = new core_1.Stack();
            const sourceOutput = new codepipeline.Artifact();
            new codepipeline.Pipeline(stack, 'P', {
                stages: [
                    {
                        stageName: 'Source',
                        actions: [
                            new cpactions.CodeCommitSourceAction({
                                actionName: 'CodeCommit',
                                repository: new codecommit.Repository(stack, 'R', {
                                    repositoryName: 'repository',
                                }),
                                branch: core_1.Lazy.string({ produce: () => 'my-branch' }),
                                output: sourceOutput,
                                codeBuildCloneOutput: true,
                            }),
                        ],
                    },
                    {
                        stageName: 'Build',
                        actions: [
                            new cpactions.CodeBuildAction({
                                actionName: 'Build',
                                project: new codebuild.PipelineProject(stack, 'CodeBuild'),
                                input: sourceOutput,
                            }),
                        ],
                    },
                ],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
                'Stages': [
                    {
                        'Name': 'Source',
                        'Actions': [{
                                'Configuration': {
                                    'OutputArtifactFormat': 'CODEBUILD_CLONE_REF',
                                },
                            }],
                    },
                    {
                        'Name': 'Build',
                        'Actions': [
                            {
                                'Name': 'Build',
                            },
                        ],
                    },
                ],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                'PolicyDocument': {
                    'Statement': assertions_1.Match.arrayWith([
                        assertions_1.Match.objectLike({
                            'Action': [
                                'logs:CreateLogGroup',
                                'logs:CreateLogStream',
                                'logs:PutLogEvents',
                            ],
                        }),
                        assertions_1.Match.objectLike({
                            'Action': 'codecommit:GitPull',
                            'Effect': 'Allow',
                            'Resource': {
                                'Fn::GetAtt': [
                                    'RC21A1702',
                                    'Arn',
                                ],
                            },
                        }),
                    ]),
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                'PolicyDocument': {
                    'Statement': assertions_1.Match.arrayWith([
                        assertions_1.Match.objectLike({
                            'Action': [
                                'codecommit:GetBranch',
                                'codecommit:GetCommit',
                                'codecommit:UploadArchive',
                                'codecommit:GetUploadArchiveStatus',
                                'codecommit:CancelUploadArchive',
                                'codecommit:GetRepository',
                            ],
                            'Effect': 'Allow',
                            'Resource': {
                                'Fn::GetAtt': [
                                    'RC21A1702',
                                    'Arn',
                                ],
                            },
                        }),
                    ]),
                },
            });
        });
        test('uses the role when passed', () => {
            const stack = new core_1.Stack();
            const pipeline = new codepipeline.Pipeline(stack, 'P', {
                pipelineName: 'MyPipeline',
            });
            const triggerEventTestRole = new iam.Role(stack, 'Trigger-test-role', {
                assumedBy: new iam.ServicePrincipal('events.amazonaws.com'),
            });
            triggerEventTestRole.addToPolicy(new iam.PolicyStatement({
                actions: ['codepipeline:StartPipelineExecution'],
                resources: [pipeline.pipelineArn],
            }));
            const sourceOutput = new codepipeline.Artifact();
            const sourceAction = new cpactions.CodeCommitSourceAction({
                actionName: 'CodeCommit',
                repository: new codecommit.Repository(stack, 'R', {
                    repositoryName: 'repository',
                }),
                branch: core_1.Lazy.string({ produce: () => 'my-branch' }),
                output: sourceOutput,
                eventRole: triggerEventTestRole,
            });
            pipeline.addStage({
                stageName: 'Source',
                actions: [sourceAction],
            });
            const buildAction = new cpactions.CodeBuildAction({
                actionName: 'Build',
                project: new codebuild.PipelineProject(stack, 'CodeBuild'),
                input: sourceOutput,
            });
            pipeline.addStage({
                stageName: 'build',
                actions: [buildAction],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
                Targets: [
                    {
                        Arn: stack.resolve(pipeline.pipelineArn),
                        Id: 'Target0',
                        RoleArn: stack.resolve(triggerEventTestRole.roleArn),
                    },
                ],
            });
        });
        test('grants explicit s3:PutObjectAcl permissions when the Actions is cross-account', () => {
            const app = new core_1.App();
            const repoStack = new core_1.Stack(app, 'RepoStack', {
                env: { account: '123', region: 'us-east-1' },
            });
            const repoFomAnotherAccount = codecommit.Repository.fromRepositoryName(repoStack, 'Repo', 'my-repo');
            const pipelineStack = new core_1.Stack(app, 'PipelineStack', {
                env: { account: '456', region: 'us-east-1' },
            });
            new codepipeline.Pipeline(pipelineStack, 'Pipeline', {
                artifactBucket: s3.Bucket.fromBucketAttributes(pipelineStack, 'PipelineBucket', {
                    bucketName: 'pipeline-bucket',
                    encryptionKey: kms.Key.fromKeyArn(pipelineStack, 'PipelineKey', 'arn:aws:kms:us-east-1:456:key/my-key'),
                }),
                stages: [
                    {
                        stageName: 'Source',
                        actions: [new cpactions.CodeCommitSourceAction({
                                actionName: 'Source',
                                output: new codepipeline.Artifact(),
                                repository: repoFomAnotherAccount,
                            })],
                    },
                    {
                        stageName: 'Approve',
                        actions: [new cpactions.ManualApprovalAction({
                                actionName: 'Approve',
                            })],
                    },
                ],
            });
            assertions_1.Template.fromStack(repoStack).hasResourceProperties('AWS::IAM::Policy', {
                PolicyDocument: {
                    Statement: assertions_1.Match.arrayWith([{
                            'Action': [
                                's3:PutObjectAcl',
                                's3:PutObjectVersionAcl',
                            ],
                            'Effect': 'Allow',
                            'Resource': {
                                'Fn::Join': ['', [
                                        'arn:',
                                        { 'Ref': 'AWS::Partition' },
                                        ':s3:::pipeline-bucket/*',
                                    ]],
                            },
                        }]),
                },
            });
        });
        test('allows using a new Repository from another Stack as a source of the Pipeline, with Events', () => {
            const app = new core_1.App();
            const repoStack = new core_1.Stack(app, 'RepositoryStack');
            const repo = new codecommit.Repository(repoStack, 'Repository', {
                repositoryName: 'my-repo',
            });
            const pipelineStack = new core_1.Stack(app, 'PipelineStack');
            const sourceOutput = new codepipeline.Artifact();
            new codepipeline.Pipeline(pipelineStack, 'Pipeline', {
                stages: [
                    {
                        stageName: 'Source',
                        actions: [
                            new cpactions.CodeCommitSourceAction({
                                actionName: 'Source',
                                repository: repo,
                                output: sourceOutput,
                            }),
                        ],
                    },
                    {
                        stageName: 'Build',
                        actions: [
                            new cpactions.CodeBuildAction({
                                actionName: 'Build',
                                project: codebuild.Project.fromProjectName(pipelineStack, 'Project', 'my-project'),
                                input: sourceOutput,
                            }),
                        ],
                    },
                ],
            });
            // If the Event Rule was created in the repo's Stack,
            // we would have a cycle
            // (the repo's Stack would need the name of the CodePipeline to trigger through the Rule,
            // while the pipeline's Stack would need the name of the Repository to use as a Source).
            // By moving the Rule to pipeline's Stack, we get rid of the cycle.
            assertions_1.Template.fromStack(pipelineStack).resourceCountIs('AWS::Events::Rule', 1);
        });
    });
});
function minimalPipeline(stack, trigger) {
    const sourceOutput = new codepipeline.Artifact();
    return new codepipeline.Pipeline(stack, 'MyPipeline', {
        stages: [
            {
                stageName: 'Source',
                actions: [
                    new cpactions.CodeCommitSourceAction({
                        actionName: 'Source',
                        repository: new codecommit.Repository(stack, 'MyRepo', {
                            repositoryName: 'my-repo',
                        }),
                        output: sourceOutput,
                        trigger,
                    }),
                ],
            },
            {
                stageName: 'Build',
                actions: [
                    new cpactions.CodeBuildAction({
                        actionName: 'Build',
                        project: new codebuild.PipelineProject(stack, 'MyProject'),
                        input: sourceOutput,
                    }),
                ],
            },
        ],
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZWNvbW1pdC1zb3VyY2UtYWN0aW9uLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb2RlY29tbWl0LXNvdXJjZS1hY3Rpb24udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUFzRDtBQUN0RCxvREFBb0Q7QUFDcEQsc0RBQXNEO0FBQ3RELDBEQUEwRDtBQUMxRCx3Q0FBd0M7QUFDeEMsd0NBQXdDO0FBQ3hDLHNDQUFzQztBQUN0Qyx3Q0FBaUQ7QUFDakQsdUNBQXVDO0FBRXZDLGdDQUFnQztBQUVoQyxRQUFRLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLFFBQVEsQ0FBQywwQkFBMEIsRUFBRSxHQUFHLEVBQUU7UUFDeEMsSUFBSSxDQUFDLDZEQUE2RCxFQUFFLEdBQUcsRUFBRTtZQUN2RSxNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1lBRTFCLGVBQWUsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFFbEMscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsNkJBQTZCLEVBQUU7Z0JBQzdFLFFBQVEsRUFBRTtvQkFDUjt3QkFDRSxTQUFTLEVBQUU7NEJBQ1Q7Z0NBQ0UsZUFBZSxFQUFFO29DQUNmLHNCQUFzQixFQUFFLEtBQUs7aUNBQzlCOzZCQUNGO3lCQUNGO3FCQUNGO29CQUNELEVBQUU7aUJBQ0g7YUFDRixDQUFDLENBQUM7WUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxlQUFlLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDcEUsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMscUZBQXFGLEVBQUUsR0FBRyxFQUFFO1lBQy9GLHVEQUF1RDtZQUN2RCxNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQUcsRUFBRSxDQUFDO1lBQ3RCLE1BQU0sV0FBVyxHQUFHLElBQUksWUFBSyxDQUFDLEdBQUcsRUFBRSxhQUFhLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDdEcsTUFBTSxXQUFXLEdBQUcsSUFBSSxZQUFLLENBQUMsR0FBRyxFQUFFLGFBQWEsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBRSxFQUFFLENBQUMsQ0FBQztZQUV0RyxNQUFNLElBQUksR0FBRyxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRTtnQkFDNUQsY0FBYyxFQUFFLFNBQVM7YUFDMUIsQ0FBQyxDQUFDO1lBRUgsTUFBTSxZQUFZLEdBQUcsSUFBSSxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDakQsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxZQUFZLEVBQUU7Z0JBQ25ELE1BQU0sRUFBRTtvQkFDTjt3QkFDRSxTQUFTLEVBQUUsUUFBUTt3QkFDbkIsT0FBTyxFQUFFOzRCQUNQLElBQUksU0FBUyxDQUFDLHNCQUFzQixDQUFDLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsQ0FBQzt5QkFDdkc7cUJBQ0Y7b0JBQ0Q7d0JBQ0UsU0FBUyxFQUFFLE9BQU87d0JBQ2xCLE9BQU8sRUFBRTs0QkFDUCxJQUFJLFNBQVMsQ0FBQyxlQUFlLENBQUMsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLFNBQVMsQ0FBQyxlQUFlLENBQUMsV0FBVyxFQUFFLFdBQVcsQ0FBQyxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsQ0FBQzt5QkFDOUk7cUJBQ0Y7aUJBQ0Y7YUFDRixDQUFDLENBQUM7WUFFSCw0R0FBNEc7WUFDNUcscUJBQVEsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUMscUJBQXFCLENBQUMsbUJBQW1CLEVBQUU7Z0JBQ3pFLFlBQVksRUFBRTtvQkFDWixNQUFNLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQztvQkFDMUIsU0FBUyxFQUFFO3dCQUNULEVBQUUsWUFBWSxFQUFFLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDLEVBQUU7cUJBQzVDO2lCQUNGO2dCQUNELE9BQU8sRUFBRSxDQUFDO3dCQUNSLE9BQU8sRUFBRSxrQkFBSyxDQUFDLE1BQU0sRUFBRTt3QkFDdkIsR0FBRyxFQUFFOzRCQUNILFVBQVUsRUFBRSxDQUFDLEVBQUUsRUFBRTtvQ0FDZixNQUFNO29DQUNOLEVBQUUsS0FBSyxFQUFFLGdCQUFnQixFQUFFO29DQUMzQiwyQ0FBMkM7aUNBQzVDLENBQUM7eUJBQ0g7cUJBQ0YsQ0FBQzthQUNILENBQUMsQ0FBQztZQUVILG1GQUFtRjtZQUNuRixxQkFBUSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxtQkFBbUIsRUFBRTtnQkFDekUsY0FBYyxFQUFFO29CQUNkLFFBQVEsRUFBRTt3QkFDUixnQkFBZ0I7cUJBQ2pCO29CQUNELFdBQVcsRUFBRTt3QkFDWDs0QkFDRSxVQUFVLEVBQUU7Z0NBQ1YsRUFBRTtnQ0FDRjtvQ0FDRSxNQUFNO29DQUNOLEVBQUUsS0FBSyxFQUFFLGdCQUFnQixFQUFFO29DQUMzQixxQ0FBcUM7aUNBQ3RDOzZCQUNGO3lCQUNGO3FCQUNGO2lCQUNGO2dCQUNELFNBQVMsRUFBRTtvQkFDVDt3QkFDRSxLQUFLLEVBQUU7NEJBQ0wsVUFBVSxFQUFFLENBQUMsRUFBRSxFQUFFO29DQUNmLE1BQU07b0NBQ04sRUFBRSxLQUFLLEVBQUUsZ0JBQWdCLEVBQUU7b0NBQzNCLGdDQUFnQztvQ0FDaEMsRUFBRSxLQUFLLEVBQUUsb0JBQW9CLEVBQUU7aUNBQ2hDLENBQUM7eUJBQ0g7d0JBQ0QsU0FBUyxFQUFFLEVBQUUsWUFBWSxFQUFFLENBQUMsOEJBQThCLEVBQUUsS0FBSyxDQUFDLEVBQUU7cUJBQ3JFO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsK0VBQStFLEVBQUUsR0FBRyxFQUFFO1lBQ3pGLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFFMUIsZUFBZSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUM7WUFFM0QscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsNkJBQTZCLEVBQUU7Z0JBQzdFLFFBQVEsRUFBRTtvQkFDUjt3QkFDRSxTQUFTLEVBQUU7NEJBQ1Q7Z0NBQ0UsZUFBZSxFQUFFO29DQUNmLHNCQUFzQixFQUFFLEtBQUs7aUNBQzlCOzZCQUNGO3lCQUNGO3FCQUNGO29CQUNELEVBQUU7aUJBQ0g7YUFDRixDQUFDLENBQUM7WUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxlQUFlLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDcEUsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsNkVBQTZFLEVBQUUsR0FBRyxFQUFFO1lBQ3ZGLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFFMUIsZUFBZSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFekQscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsNkJBQTZCLEVBQUU7Z0JBQzdFLFFBQVEsRUFBRTtvQkFDUjt3QkFDRSxTQUFTLEVBQUU7NEJBQ1Q7Z0NBQ0UsZUFBZSxFQUFFO29DQUNmLHNCQUFzQixFQUFFLElBQUk7aUNBQzdCOzZCQUNGO3lCQUNGO3FCQUNGO29CQUNELEVBQUU7aUJBQ0g7YUFDRixDQUFDLENBQUM7WUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxlQUFlLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDcEUsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMscUZBQXFGLEVBQUUsR0FBRyxFQUFFO1lBQy9GLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFFMUIsZUFBZSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFekQscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsNkJBQTZCLEVBQUU7Z0JBQzdFLFFBQVEsRUFBRTtvQkFDUjt3QkFDRSxTQUFTLEVBQUU7NEJBQ1Q7Z0NBQ0UsZUFBZSxFQUFFO29DQUNmLHNCQUFzQixFQUFFLEtBQUs7aUNBQzlCOzZCQUNGO3lCQUNGO3FCQUNGO29CQUNELEVBQUU7aUJBQ0g7YUFDRixDQUFDLENBQUM7WUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxlQUFlLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDcEUsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsd0NBQXdDLEVBQUUsR0FBRyxFQUFFO1lBQ2xELE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFDMUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7Z0JBQ3RELGNBQWMsRUFBRSxTQUFTO2FBQzFCLENBQUMsQ0FBQztZQUVILE1BQU0sQ0FBQyxHQUFHLEVBQUU7Z0JBQ1YsSUFBSSxTQUFTLENBQUMsc0JBQXNCLENBQUM7b0JBQ25DLFVBQVUsRUFBRSxTQUFTO29CQUNyQixVQUFVLEVBQUUsSUFBSTtvQkFDaEIsTUFBTSxFQUFFLElBQUksWUFBWSxDQUFDLFFBQVEsRUFBRTtvQkFDbkMsTUFBTSxFQUFFLEVBQUU7aUJBQ1gsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLDhDQUE4QyxDQUFDLENBQUM7UUFDN0QsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsNkZBQTZGLEVBQUUsR0FBRyxFQUFFO1lBQ3ZHLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFFMUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7Z0JBQ3RELGNBQWMsRUFBRSxTQUFTO2FBQzFCLENBQUMsQ0FBQztZQUNILE1BQU0sYUFBYSxHQUFHLElBQUksWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2xELE1BQU0sYUFBYSxHQUFHLElBQUksWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2xELElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFO2dCQUM3QyxNQUFNLEVBQUU7b0JBQ047d0JBQ0UsU0FBUyxFQUFFLFFBQVE7d0JBQ25CLE9BQU8sRUFBRTs0QkFDUCxJQUFJLFNBQVMsQ0FBQyxzQkFBc0IsQ0FBQztnQ0FDbkMsVUFBVSxFQUFFLFNBQVM7Z0NBQ3JCLFVBQVUsRUFBRSxJQUFJO2dDQUNoQixNQUFNLEVBQUUsYUFBYTs2QkFDdEIsQ0FBQzs0QkFDRixJQUFJLFNBQVMsQ0FBQyxzQkFBc0IsQ0FBQztnQ0FDbkMsVUFBVSxFQUFFLFNBQVM7Z0NBQ3JCLFVBQVUsRUFBRSxJQUFJO2dDQUNoQixNQUFNLEVBQUUsYUFBYTtnQ0FDckIsTUFBTSxFQUFFLFNBQVM7NkJBQ2xCLENBQUM7eUJBQ0g7cUJBQ0Y7b0JBQ0Q7d0JBQ0UsU0FBUyxFQUFFLE9BQU87d0JBQ2xCLE9BQU8sRUFBRTs0QkFDUCxJQUFJLFNBQVMsQ0FBQyxlQUFlLENBQUM7Z0NBQzVCLFVBQVUsRUFBRSxPQUFPO2dDQUNuQixPQUFPLEVBQUUsSUFBSSxTQUFTLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUM7Z0NBQzFELEtBQUssRUFBRSxhQUFhOzZCQUNyQixDQUFDO3lCQUNIO3FCQUNGO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsZ0RBQWdELEVBQUUsR0FBRyxFQUFFO1lBQzFELE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFFMUIsTUFBTSxZQUFZLEdBQUcsSUFBSSxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDakQsTUFBTSxzQkFBc0IsR0FBRyxJQUFJLFNBQVMsQ0FBQyxzQkFBc0IsQ0FBQztnQkFDbEUsVUFBVSxFQUFFLFFBQVE7Z0JBQ3BCLFVBQVUsRUFBRSxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRTtvQkFDckQsY0FBYyxFQUFFLFNBQVM7aUJBQzFCLENBQUM7Z0JBQ0YsTUFBTSxFQUFFLFlBQVk7YUFDckIsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7Z0JBQzNDLE1BQU0sRUFBRTtvQkFDTjt3QkFDRSxTQUFTLEVBQUUsUUFBUTt3QkFDbkIsT0FBTyxFQUFFLENBQUMsc0JBQXNCLENBQUM7cUJBQ2xDO29CQUNEO3dCQUNFLFNBQVMsRUFBRSxPQUFPO3dCQUNsQixPQUFPLEVBQUU7NEJBQ1AsSUFBSSxTQUFTLENBQUMsZUFBZSxDQUFDO2dDQUM1QixVQUFVLEVBQUUsT0FBTztnQ0FDbkIsT0FBTyxFQUFFLElBQUksU0FBUyxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDO2dDQUMxRCxLQUFLLEVBQUUsWUFBWTtnQ0FDbkIsb0JBQW9CLEVBQUU7b0NBQ3BCLFVBQVUsRUFBRSxFQUFFLEtBQUssRUFBRSxzQkFBc0IsQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFO2lDQUNuRTs2QkFDRixDQUFDO3lCQUNIO3FCQUNGO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1lBRUgscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsNkJBQTZCLEVBQUU7Z0JBQzdFLFFBQVEsRUFBRTtvQkFDUjt3QkFDRSxNQUFNLEVBQUUsUUFBUTtxQkFDakI7b0JBQ0Q7d0JBQ0UsTUFBTSxFQUFFLE9BQU87d0JBQ2YsU0FBUyxFQUFFOzRCQUNUO2dDQUNFLE1BQU0sRUFBRSxPQUFPO2dDQUNmLGVBQWUsRUFBRTtvQ0FDZixzQkFBc0IsRUFBRSxxRkFBcUY7aUNBQzlHOzZCQUNGO3lCQUNGO3FCQUNGO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsMENBQTBDLEVBQUUsR0FBRyxFQUFFO1lBQ3BELE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFFMUIsTUFBTSxZQUFZLEdBQUcsSUFBSSxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDakQsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUU7Z0JBQ3BDLE1BQU0sRUFBRTtvQkFDTjt3QkFDRSxTQUFTLEVBQUUsUUFBUTt3QkFDbkIsT0FBTyxFQUFFOzRCQUNQLElBQUksU0FBUyxDQUFDLHNCQUFzQixDQUFDO2dDQUNuQyxVQUFVLEVBQUUsWUFBWTtnQ0FDeEIsVUFBVSxFQUFFLElBQUksVUFBVSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFO29DQUNoRCxjQUFjLEVBQUUsWUFBWTtpQ0FDN0IsQ0FBQztnQ0FDRixNQUFNLEVBQUUsV0FBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztnQ0FDbkQsTUFBTSxFQUFFLFlBQVk7NkJBQ3JCLENBQUM7eUJBQ0g7cUJBQ0Y7b0JBQ0Q7d0JBQ0UsU0FBUyxFQUFFLE9BQU87d0JBQ2xCLE9BQU8sRUFBRTs0QkFDUCxJQUFJLFNBQVMsQ0FBQyxlQUFlLENBQUM7Z0NBQzVCLFVBQVUsRUFBRSxPQUFPO2dDQUNuQixPQUFPLEVBQUUsSUFBSSxTQUFTLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUM7Z0NBQzFELEtBQUssRUFBRSxZQUFZOzZCQUNwQixDQUFDO3lCQUNIO3FCQUNGO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1lBRUgscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsbUJBQW1CLEVBQUU7Z0JBQ25FLFlBQVksRUFBRTtvQkFDWixNQUFNLEVBQUU7d0JBQ04sYUFBYSxFQUFFLENBQUMsV0FBVyxDQUFDO3FCQUM3QjtpQkFDRjthQUNGLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLDZCQUE2QixFQUFFLEdBQUcsRUFBRTtZQUN2QyxNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1lBRTFCLE1BQU0sWUFBWSxHQUFHLElBQUksWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2pELElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFO2dCQUNwQyxNQUFNLEVBQUU7b0JBQ047d0JBQ0UsU0FBUyxFQUFFLFFBQVE7d0JBQ25CLE9BQU8sRUFBRTs0QkFDUCxJQUFJLFNBQVMsQ0FBQyxzQkFBc0IsQ0FBQztnQ0FDbkMsVUFBVSxFQUFFLFlBQVk7Z0NBQ3hCLFVBQVUsRUFBRSxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRTtvQ0FDaEQsY0FBYyxFQUFFLFlBQVk7aUNBQzdCLENBQUM7Z0NBQ0YsTUFBTSxFQUFFLFdBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUM7Z0NBQ25ELE1BQU0sRUFBRSxZQUFZO2dDQUNwQixvQkFBb0IsRUFBRSxJQUFJOzZCQUMzQixDQUFDO3lCQUNIO3FCQUNGO29CQUNEO3dCQUNFLFNBQVMsRUFBRSxPQUFPO3dCQUNsQixPQUFPLEVBQUU7NEJBQ1AsSUFBSSxTQUFTLENBQUMsZUFBZSxDQUFDO2dDQUM1QixVQUFVLEVBQUUsT0FBTztnQ0FDbkIsT0FBTyxFQUFFLElBQUksU0FBUyxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDO2dDQUMxRCxLQUFLLEVBQUUsWUFBWTs2QkFDcEIsQ0FBQzt5QkFDSDtxQkFDRjtpQkFDRjthQUNGLENBQUMsQ0FBQztZQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDZCQUE2QixFQUFFO2dCQUM3RSxRQUFRLEVBQUU7b0JBQ1I7d0JBQ0UsTUFBTSxFQUFFLFFBQVE7d0JBQ2hCLFNBQVMsRUFBRSxDQUFDO2dDQUNWLGVBQWUsRUFBRTtvQ0FDZixzQkFBc0IsRUFBRSxxQkFBcUI7aUNBQzlDOzZCQUNGLENBQUM7cUJBQ0g7b0JBQ0Q7d0JBQ0UsTUFBTSxFQUFFLE9BQU87d0JBQ2YsU0FBUyxFQUFFOzRCQUNUO2dDQUNFLE1BQU0sRUFBRSxPQUFPOzZCQUNoQjt5QkFDRjtxQkFDRjtpQkFDRjthQUNGLENBQUMsQ0FBQztZQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGtCQUFrQixFQUFFO2dCQUNsRSxnQkFBZ0IsRUFBRTtvQkFDaEIsV0FBVyxFQUFFLGtCQUFLLENBQUMsU0FBUyxDQUFDO3dCQUMzQixrQkFBSyxDQUFDLFVBQVUsQ0FBQzs0QkFDZixRQUFRLEVBQUU7Z0NBQ1IscUJBQXFCO2dDQUNyQixzQkFBc0I7Z0NBQ3RCLG1CQUFtQjs2QkFDcEI7eUJBQ0YsQ0FBQzt3QkFDRixrQkFBSyxDQUFDLFVBQVUsQ0FBQzs0QkFDZixRQUFRLEVBQUUsb0JBQW9COzRCQUM5QixRQUFRLEVBQUUsT0FBTzs0QkFDakIsVUFBVSxFQUFFO2dDQUNWLFlBQVksRUFBRTtvQ0FDWixXQUFXO29DQUNYLEtBQUs7aUNBQ047NkJBQ0Y7eUJBQ0YsQ0FBQztxQkFDSCxDQUFDO2lCQUNIO2FBQ0YsQ0FBQyxDQUFDO1lBRUgscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsa0JBQWtCLEVBQUU7Z0JBQ2xFLGdCQUFnQixFQUFFO29CQUNoQixXQUFXLEVBQUUsa0JBQUssQ0FBQyxTQUFTLENBQUM7d0JBQzNCLGtCQUFLLENBQUMsVUFBVSxDQUFDOzRCQUNmLFFBQVEsRUFBRTtnQ0FDUixzQkFBc0I7Z0NBQ3RCLHNCQUFzQjtnQ0FDdEIsMEJBQTBCO2dDQUMxQixtQ0FBbUM7Z0NBQ25DLGdDQUFnQztnQ0FDaEMsMEJBQTBCOzZCQUMzQjs0QkFDRCxRQUFRLEVBQUUsT0FBTzs0QkFDakIsVUFBVSxFQUFFO2dDQUNWLFlBQVksRUFBRTtvQ0FDWixXQUFXO29DQUNYLEtBQUs7aUNBQ047NkJBQ0Y7eUJBQ0YsQ0FBQztxQkFDSCxDQUFDO2lCQUNIO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsMkJBQTJCLEVBQUUsR0FBRyxFQUFFO1lBQ3JDLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFFMUIsTUFBTSxRQUFRLEdBQUcsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUU7Z0JBQ3JELFlBQVksRUFBRSxZQUFZO2FBQzNCLENBQUMsQ0FBQztZQUVILE1BQU0sb0JBQW9CLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxtQkFBbUIsRUFBRTtnQkFDcEUsU0FBUyxFQUFFLElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLHNCQUFzQixDQUFDO2FBQzVELENBQUMsQ0FBQztZQUNILG9CQUFvQixDQUFDLFdBQVcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7Z0JBQ3ZELE9BQU8sRUFBRSxDQUFDLHFDQUFxQyxDQUFDO2dCQUNoRCxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDO2FBQ2xDLENBQUMsQ0FBQyxDQUFDO1lBRUosTUFBTSxZQUFZLEdBQUcsSUFBSSxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUM7WUFFakQsTUFBTSxZQUFZLEdBQUcsSUFBSSxTQUFTLENBQUMsc0JBQXNCLENBQUM7Z0JBQ3hELFVBQVUsRUFBRSxZQUFZO2dCQUN4QixVQUFVLEVBQUUsSUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUU7b0JBQ2hELGNBQWMsRUFBRSxZQUFZO2lCQUM3QixDQUFDO2dCQUNGLE1BQU0sRUFBRSxXQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLFdBQVcsRUFBRSxDQUFDO2dCQUNuRCxNQUFNLEVBQUUsWUFBWTtnQkFDcEIsU0FBUyxFQUFFLG9CQUFvQjthQUNoQyxDQUFDLENBQUM7WUFFSCxRQUFRLENBQUMsUUFBUSxDQUFDO2dCQUNoQixTQUFTLEVBQUUsUUFBUTtnQkFDbkIsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO2FBQ3hCLENBQUMsQ0FBQztZQUVILE1BQU0sV0FBVyxHQUFHLElBQUksU0FBUyxDQUFDLGVBQWUsQ0FBQztnQkFDaEQsVUFBVSxFQUFFLE9BQU87Z0JBQ25CLE9BQU8sRUFBRSxJQUFJLFNBQVMsQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQztnQkFDMUQsS0FBSyxFQUFFLFlBQVk7YUFDcEIsQ0FBQyxDQUFDO1lBRUgsUUFBUSxDQUFDLFFBQVEsQ0FBQztnQkFDaEIsU0FBUyxFQUFFLE9BQU87Z0JBQ2xCLE9BQU8sRUFBRSxDQUFDLFdBQVcsQ0FBQzthQUN2QixDQUFDLENBQUM7WUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxtQkFBbUIsRUFBRTtnQkFDbkUsT0FBTyxFQUFFO29CQUNQO3dCQUNFLEdBQUcsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUM7d0JBQ3hDLEVBQUUsRUFBRSxTQUFTO3dCQUNiLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLE9BQU8sQ0FBQztxQkFDckQ7aUJBQ0Y7YUFDRixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQywrRUFBK0UsRUFBRSxHQUFHLEVBQUU7WUFDekYsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFHLEVBQUUsQ0FBQztZQUV0QixNQUFNLFNBQVMsR0FBRyxJQUFJLFlBQUssQ0FBQyxHQUFHLEVBQUUsV0FBVyxFQUFFO2dCQUM1QyxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUU7YUFDN0MsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxxQkFBcUIsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFFckcsTUFBTSxhQUFhLEdBQUcsSUFBSSxZQUFLLENBQUMsR0FBRyxFQUFFLGVBQWUsRUFBRTtnQkFDcEQsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFO2FBQzdDLENBQUMsQ0FBQztZQUNILElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEVBQUUsVUFBVSxFQUFFO2dCQUNuRCxjQUFjLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxhQUFhLEVBQUUsZ0JBQWdCLEVBQUU7b0JBQzlFLFVBQVUsRUFBRSxpQkFBaUI7b0JBQzdCLGFBQWEsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsYUFBYSxFQUM1RCxzQ0FBc0MsQ0FBQztpQkFDMUMsQ0FBQztnQkFDRixNQUFNLEVBQUU7b0JBQ047d0JBQ0UsU0FBUyxFQUFFLFFBQVE7d0JBQ25CLE9BQU8sRUFBRSxDQUFDLElBQUksU0FBUyxDQUFDLHNCQUFzQixDQUFDO2dDQUM3QyxVQUFVLEVBQUUsUUFBUTtnQ0FDcEIsTUFBTSxFQUFFLElBQUksWUFBWSxDQUFDLFFBQVEsRUFBRTtnQ0FDbkMsVUFBVSxFQUFFLHFCQUFxQjs2QkFDbEMsQ0FBQyxDQUFDO3FCQUNKO29CQUNEO3dCQUNFLFNBQVMsRUFBRSxTQUFTO3dCQUNwQixPQUFPLEVBQUUsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQztnQ0FDM0MsVUFBVSxFQUFFLFNBQVM7NkJBQ3RCLENBQUMsQ0FBQztxQkFDSjtpQkFDRjthQUNGLENBQUMsQ0FBQztZQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGtCQUFrQixFQUFFO2dCQUN0RSxjQUFjLEVBQUU7b0JBQ2QsU0FBUyxFQUFFLGtCQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7NEJBQzFCLFFBQVEsRUFBRTtnQ0FDUixpQkFBaUI7Z0NBQ2pCLHdCQUF3Qjs2QkFDekI7NEJBQ0QsUUFBUSxFQUFFLE9BQU87NEJBQ2pCLFVBQVUsRUFBRTtnQ0FDVixVQUFVLEVBQUUsQ0FBQyxFQUFFLEVBQUU7d0NBQ2YsTUFBTTt3Q0FDTixFQUFFLEtBQUssRUFBRSxnQkFBZ0IsRUFBRTt3Q0FDM0IseUJBQXlCO3FDQUMxQixDQUFDOzZCQUNIO3lCQUNGLENBQUMsQ0FBQztpQkFDSjthQUNGLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLDJGQUEyRixFQUFFLEdBQUcsRUFBRTtZQUNyRyxNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQUcsRUFBRSxDQUFDO1lBRXRCLE1BQU0sU0FBUyxHQUFHLElBQUksWUFBSyxDQUFDLEdBQUcsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1lBQ3BELE1BQU0sSUFBSSxHQUFHLElBQUksVUFBVSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsWUFBWSxFQUFFO2dCQUM5RCxjQUFjLEVBQUUsU0FBUzthQUMxQixDQUFDLENBQUM7WUFFSCxNQUFNLGFBQWEsR0FBRyxJQUFJLFlBQUssQ0FBQyxHQUFHLEVBQUUsZUFBZSxDQUFDLENBQUM7WUFDdEQsTUFBTSxZQUFZLEdBQUcsSUFBSSxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDakQsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxVQUFVLEVBQUU7Z0JBQ25ELE1BQU0sRUFBRTtvQkFDTjt3QkFDRSxTQUFTLEVBQUUsUUFBUTt3QkFDbkIsT0FBTyxFQUFFOzRCQUNQLElBQUksU0FBUyxDQUFDLHNCQUFzQixDQUFDO2dDQUNuQyxVQUFVLEVBQUUsUUFBUTtnQ0FDcEIsVUFBVSxFQUFFLElBQUk7Z0NBQ2hCLE1BQU0sRUFBRSxZQUFZOzZCQUNyQixDQUFDO3lCQUNIO3FCQUNGO29CQUNEO3dCQUNFLFNBQVMsRUFBRSxPQUFPO3dCQUNsQixPQUFPLEVBQUU7NEJBQ1AsSUFBSSxTQUFTLENBQUMsZUFBZSxDQUFDO2dDQUM1QixVQUFVLEVBQUUsT0FBTztnQ0FDbkIsT0FBTyxFQUFFLFNBQVMsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxTQUFTLEVBQUUsWUFBWSxDQUFDO2dDQUNsRixLQUFLLEVBQUUsWUFBWTs2QkFDcEIsQ0FBQzt5QkFDSDtxQkFDRjtpQkFDRjthQUNGLENBQUMsQ0FBQztZQUVILHFEQUFxRDtZQUNyRCx3QkFBd0I7WUFDeEIseUZBQXlGO1lBQ3pGLHdGQUF3RjtZQUN4RixtRUFBbUU7WUFDbkUscUJBQVEsQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUMsZUFBZSxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzVFLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILFNBQVMsZUFBZSxDQUFDLEtBQVksRUFBRSxPQUFnRDtJQUNyRixNQUFNLFlBQVksR0FBRyxJQUFJLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNqRCxPQUFPLElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFO1FBQ3BELE1BQU0sRUFBRTtZQUNOO2dCQUNFLFNBQVMsRUFBRSxRQUFRO2dCQUNuQixPQUFPLEVBQUU7b0JBQ1AsSUFBSSxTQUFTLENBQUMsc0JBQXNCLENBQUM7d0JBQ25DLFVBQVUsRUFBRSxRQUFRO3dCQUNwQixVQUFVLEVBQUUsSUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7NEJBQ3JELGNBQWMsRUFBRSxTQUFTO3lCQUMxQixDQUFDO3dCQUNGLE1BQU0sRUFBRSxZQUFZO3dCQUNwQixPQUFPO3FCQUNSLENBQUM7aUJBQ0g7YUFDRjtZQUNEO2dCQUNFLFNBQVMsRUFBRSxPQUFPO2dCQUNsQixPQUFPLEVBQUU7b0JBQ1AsSUFBSSxTQUFTLENBQUMsZUFBZSxDQUFDO3dCQUM1QixVQUFVLEVBQUUsT0FBTzt3QkFDbkIsT0FBTyxFQUFFLElBQUksU0FBUyxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDO3dCQUMxRCxLQUFLLEVBQUUsWUFBWTtxQkFDcEIsQ0FBQztpQkFDSDthQUNGO1NBQ0Y7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUsIE1hdGNoIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBjb2RlYnVpbGQgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVidWlsZCc7XG5pbXBvcnQgKiBhcyBjb2RlY29tbWl0IGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlY29tbWl0JztcbmltcG9ydCAqIGFzIGNvZGVwaXBlbGluZSBmcm9tICdAYXdzLWNkay9hd3MtY29kZXBpcGVsaW5lJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGttcyBmcm9tICdAYXdzLWNkay9hd3Mta21zJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ0Bhd3MtY2RrL2F3cy1zMyc7XG5pbXBvcnQgeyBTdGFjaywgTGF6eSwgQXBwIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjcGFjdGlvbnMgZnJvbSAnLi4vLi4vbGliJztcblxuLyogZXNsaW50LWRpc2FibGUgcXVvdGUtcHJvcHMgKi9cblxuZGVzY3JpYmUoJ0NvZGVDb21taXQgU291cmNlIEFjdGlvbicsICgpID0+IHtcbiAgZGVzY3JpYmUoJ0NvZGVDb21taXQgU291cmNlIEFjdGlvbicsICgpID0+IHtcbiAgICB0ZXN0KCdieSBkZWZhdWx0IGRvZXMgbm90IHBvbGwgZm9yIHNvdXJjZSBjaGFuZ2VzIGFuZCB1c2VzIEV2ZW50cycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAgIG1pbmltYWxQaXBlbGluZShzdGFjaywgdW5kZWZpbmVkKTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZVBpcGVsaW5lOjpQaXBlbGluZScsIHtcbiAgICAgICAgJ1N0YWdlcyc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnQWN0aW9ucyc6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdDb25maWd1cmF0aW9uJzoge1xuICAgICAgICAgICAgICAgICAgJ1BvbGxGb3JTb3VyY2VDaGFuZ2VzJzogZmFsc2UsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7fSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFdmVudHM6OlJ1bGUnLCAxKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2Nyb3NzLWFjY291bnQgQ29kZUNvbW1pdCBSZXBvc2l0b3J5IFNvdXJjZSBkb2VzIG5vdCB1c2UgdGFyZ2V0IHJvbGUgaW4gc291cmNlIHN0YWNrJywgKCkgPT4ge1xuICAgICAgLy8gVGVzdCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL2F3cy9hd3MtY2RrL2lzc3Vlcy8xNTYzOVxuICAgICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgICAgY29uc3Qgc291cmNlU3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnU291cmNlU3RhY2snLCB7IGVudjogeyBhY2NvdW50OiAnMTIzNCcsIHJlZ2lvbjogJ25vcnRoLXBvbGUnIH0gfSk7XG4gICAgICBjb25zdCB0YXJnZXRTdGFjayA9IG5ldyBTdGFjayhhcHAsICdUYXJnZXRTdGFjaycsIHsgZW52OiB7IGFjY291bnQ6ICc1Njc4JywgcmVnaW9uOiAnbm9ydGgtcG9sZScgfSB9KTtcblxuICAgICAgY29uc3QgcmVwbyA9IG5ldyBjb2RlY29tbWl0LlJlcG9zaXRvcnkoc291cmNlU3RhY2ssICdNeVJlcG8nLCB7XG4gICAgICAgIHJlcG9zaXRvcnlOYW1lOiAnbXktcmVwbycsXG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgc291cmNlT3V0cHV0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpO1xuICAgICAgbmV3IGNvZGVwaXBlbGluZS5QaXBlbGluZSh0YXJnZXRTdGFjaywgJ015UGlwZWxpbmUnLCB7XG4gICAgICAgIHN0YWdlczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN0YWdlTmFtZTogJ1NvdXJjZScsXG4gICAgICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgICAgIG5ldyBjcGFjdGlvbnMuQ29kZUNvbW1pdFNvdXJjZUFjdGlvbih7IGFjdGlvbk5hbWU6ICdTb3VyY2UnLCByZXBvc2l0b3J5OiByZXBvLCBvdXRwdXQ6IHNvdXJjZU91dHB1dCB9KSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdGFnZU5hbWU6ICdCdWlsZCcsXG4gICAgICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgICAgIG5ldyBjcGFjdGlvbnMuQ29kZUJ1aWxkQWN0aW9uKHsgYWN0aW9uTmFtZTogJ0J1aWxkJywgcHJvamVjdDogbmV3IGNvZGVidWlsZC5QaXBlbGluZVByb2plY3QodGFyZ2V0U3RhY2ssICdNeVByb2plY3QnKSwgaW5wdXQ6IHNvdXJjZU91dHB1dCB9KSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOIC0gY3JlYXRlcyBhIFJ1bGUgaW4gdGhlIHNvdXJjZSBzdGFjayB0YXJnZXRpbmcgdGhlIHBpcGVsaW5lIHN0YWNrJ3MgZXZlbnQgYnVzIHVzaW5nIGEgZ2VuZXJhdGVkIHJvbGVcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzb3VyY2VTdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6UnVsZScsIHtcbiAgICAgICAgRXZlbnRQYXR0ZXJuOiB7XG4gICAgICAgICAgc291cmNlOiBbJ2F3cy5jb2RlY29tbWl0J10sXG4gICAgICAgICAgcmVzb3VyY2VzOiBbXG4gICAgICAgICAgICB7ICdGbjo6R2V0QXR0JzogWydNeVJlcG9GNEY0ODA0MycsICdBcm4nXSB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIFRhcmdldHM6IFt7XG4gICAgICAgICAgUm9sZUFSTjogTWF0Y2guYWJzZW50KCksXG4gICAgICAgICAgQXJuOiB7XG4gICAgICAgICAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICB7ICdSZWYnOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICAgICAgICc6ZXZlbnRzOm5vcnRoLXBvbGU6NTY3ODpldmVudC1idXMvZGVmYXVsdCcsXG4gICAgICAgICAgICBdXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9XSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOIC0gY3JlYXRlcyBhIFJ1bGUgaW4gdGhlIHBpcGVsaW5lIHN0YWNrIHVzaW5nIHRoZSByb2xlIHRvIHN0YXJ0IHRoZSBwaXBlbGluZVxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHRhcmdldFN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RXZlbnRzOjpSdWxlJywge1xuICAgICAgICAnRXZlbnRQYXR0ZXJuJzoge1xuICAgICAgICAgICdzb3VyY2UnOiBbXG4gICAgICAgICAgICAnYXdzLmNvZGVjb21taXQnLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgJ3Jlc291cmNlcyc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgIHsgJ1JlZic6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgICAgICAgICAgICc6Y29kZWNvbW1pdDpub3J0aC1wb2xlOjEyMzQ6bXktcmVwbycsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgJ1RhcmdldHMnOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ0Fybic6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogWycnLCBbXG4gICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgIHsgJ1JlZic6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgICAgICAgICAnOmNvZGVwaXBlbGluZTpub3J0aC1wb2xlOjU2Nzg6JyxcbiAgICAgICAgICAgICAgICB7ICdSZWYnOiAnTXlQaXBlbGluZUFFRDM4RUNGJyB9LFxuICAgICAgICAgICAgICBdXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnUm9sZUFybic6IHsgJ0ZuOjpHZXRBdHQnOiBbJ015UGlwZWxpbmVFdmVudHNSb2xlRkFCOTlGMzInLCAnQXJuJ10gfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdkb2VzIG5vdCBwb2xsIGZvciBzb3VyY2UgY2hhbmdlcyBhbmQgdXNlcyBFdmVudHMgZm9yIENvZGVDb21taXRUcmlnZ2VyLkVWRU5UUycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAgIG1pbmltYWxQaXBlbGluZShzdGFjaywgY3BhY3Rpb25zLkNvZGVDb21taXRUcmlnZ2VyLkVWRU5UUyk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVQaXBlbGluZTo6UGlwZWxpbmUnLCB7XG4gICAgICAgICdTdGFnZXMnOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ0FjdGlvbnMnOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnQ29uZmlndXJhdGlvbic6IHtcbiAgICAgICAgICAgICAgICAgICdQb2xsRm9yU291cmNlQ2hhbmdlcyc6IGZhbHNlLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge30sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RXZlbnRzOjpSdWxlJywgMSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdwb2xscyBmb3Igc291cmNlIGNoYW5nZXMgYW5kIGRvZXMgbm90IHVzZSBFdmVudHMgZm9yIENvZGVDb21taXRUcmlnZ2VyLlBPTEwnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgICBtaW5pbWFsUGlwZWxpbmUoc3RhY2ssIGNwYWN0aW9ucy5Db2RlQ29tbWl0VHJpZ2dlci5QT0xMKTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZVBpcGVsaW5lOjpQaXBlbGluZScsIHtcbiAgICAgICAgJ1N0YWdlcyc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnQWN0aW9ucyc6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdDb25maWd1cmF0aW9uJzoge1xuICAgICAgICAgICAgICAgICAgJ1BvbGxGb3JTb3VyY2VDaGFuZ2VzJzogdHJ1ZSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHt9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkV2ZW50czo6UnVsZScsIDApO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnZG9lcyBub3QgcG9sbCBmb3Igc291cmNlIGNoYW5nZXMgYW5kIGRvZXMgbm90IHVzZSBFdmVudHMgZm9yIENvZGVDb21taXRUcmlnZ2VyLk5PTkUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgICBtaW5pbWFsUGlwZWxpbmUoc3RhY2ssIGNwYWN0aW9ucy5Db2RlQ29tbWl0VHJpZ2dlci5OT05FKTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZVBpcGVsaW5lOjpQaXBlbGluZScsIHtcbiAgICAgICAgJ1N0YWdlcyc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnQWN0aW9ucyc6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdDb25maWd1cmF0aW9uJzoge1xuICAgICAgICAgICAgICAgICAgJ1BvbGxGb3JTb3VyY2VDaGFuZ2VzJzogZmFsc2UsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7fSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFdmVudHM6OlJ1bGUnLCAwKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2Nhbm5vdCBiZSBjcmVhdGVkIHdpdGggYW4gZW1wdHkgYnJhbmNoJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHJlcG8gPSBuZXcgY29kZWNvbW1pdC5SZXBvc2l0b3J5KHN0YWNrLCAnTXlSZXBvJywge1xuICAgICAgICByZXBvc2l0b3J5TmFtZTogJ215LXJlcG8nLFxuICAgICAgfSk7XG5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIG5ldyBjcGFjdGlvbnMuQ29kZUNvbW1pdFNvdXJjZUFjdGlvbih7XG4gICAgICAgICAgYWN0aW9uTmFtZTogJ1NvdXJjZTInLFxuICAgICAgICAgIHJlcG9zaXRvcnk6IHJlcG8sXG4gICAgICAgICAgb3V0cHV0OiBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCksXG4gICAgICAgICAgYnJhbmNoOiAnJyxcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KC8nYnJhbmNoJyBwYXJhbWV0ZXIgY2Fubm90IGJlIGFuIGVtcHR5IHN0cmluZy8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYWxsb3dzIHVzaW5nIHRoZSBzYW1lIHJlcG9zaXRvcnkgbXVsdGlwbGUgdGltZXMgd2l0aCBkaWZmZXJlbnQgYnJhbmNoZXMgd2hlbiB0cmlnZ2VyPUVWRU5UUycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAgIGNvbnN0IHJlcG8gPSBuZXcgY29kZWNvbW1pdC5SZXBvc2l0b3J5KHN0YWNrLCAnTXlSZXBvJywge1xuICAgICAgICByZXBvc2l0b3J5TmFtZTogJ215LXJlcG8nLFxuICAgICAgfSk7XG4gICAgICBjb25zdCBzb3VyY2VPdXRwdXQxID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpO1xuICAgICAgY29uc3Qgc291cmNlT3V0cHV0MiA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoKTtcbiAgICAgIG5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUoc3RhY2ssICdNeVBpcGVsaW5lJywge1xuICAgICAgICBzdGFnZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdGFnZU5hbWU6ICdTb3VyY2UnLFxuICAgICAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgICAgICBuZXcgY3BhY3Rpb25zLkNvZGVDb21taXRTb3VyY2VBY3Rpb24oe1xuICAgICAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdTb3VyY2UxJyxcbiAgICAgICAgICAgICAgICByZXBvc2l0b3J5OiByZXBvLFxuICAgICAgICAgICAgICAgIG91dHB1dDogc291cmNlT3V0cHV0MSxcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgIG5ldyBjcGFjdGlvbnMuQ29kZUNvbW1pdFNvdXJjZUFjdGlvbih7XG4gICAgICAgICAgICAgICAgYWN0aW9uTmFtZTogJ1NvdXJjZTInLFxuICAgICAgICAgICAgICAgIHJlcG9zaXRvcnk6IHJlcG8sXG4gICAgICAgICAgICAgICAgb3V0cHV0OiBzb3VyY2VPdXRwdXQyLFxuICAgICAgICAgICAgICAgIGJyYW5jaDogJ2RldmVsb3AnLFxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdGFnZU5hbWU6ICdCdWlsZCcsXG4gICAgICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgICAgIG5ldyBjcGFjdGlvbnMuQ29kZUJ1aWxkQWN0aW9uKHtcbiAgICAgICAgICAgICAgICBhY3Rpb25OYW1lOiAnQnVpbGQnLFxuICAgICAgICAgICAgICAgIHByb2plY3Q6IG5ldyBjb2RlYnVpbGQuUGlwZWxpbmVQcm9qZWN0KHN0YWNrLCAnTXlQcm9qZWN0JyksXG4gICAgICAgICAgICAgICAgaW5wdXQ6IHNvdXJjZU91dHB1dDEsXG4gICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdleHBvc2VzIHZhcmlhYmxlcyBmb3Igb3RoZXIgYWN0aW9ucyB0byBjb25zdW1lJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgICAgY29uc3Qgc291cmNlT3V0cHV0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpO1xuICAgICAgY29uc3QgY29kZUNvbW1pdFNvdXJjZUFjdGlvbiA9IG5ldyBjcGFjdGlvbnMuQ29kZUNvbW1pdFNvdXJjZUFjdGlvbih7XG4gICAgICAgIGFjdGlvbk5hbWU6ICdTb3VyY2UnLFxuICAgICAgICByZXBvc2l0b3J5OiBuZXcgY29kZWNvbW1pdC5SZXBvc2l0b3J5KHN0YWNrLCAnTXlSZXBvJywge1xuICAgICAgICAgIHJlcG9zaXRvcnlOYW1lOiAnbXktcmVwbycsXG4gICAgICAgIH0pLFxuICAgICAgICBvdXRwdXQ6IHNvdXJjZU91dHB1dCxcbiAgICAgIH0pO1xuICAgICAgbmV3IGNvZGVwaXBlbGluZS5QaXBlbGluZShzdGFjaywgJ1BpcGVsaW5lJywge1xuICAgICAgICBzdGFnZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdGFnZU5hbWU6ICdTb3VyY2UnLFxuICAgICAgICAgICAgYWN0aW9uczogW2NvZGVDb21taXRTb3VyY2VBY3Rpb25dLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3RhZ2VOYW1lOiAnQnVpbGQnLFxuICAgICAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgICAgICBuZXcgY3BhY3Rpb25zLkNvZGVCdWlsZEFjdGlvbih7XG4gICAgICAgICAgICAgICAgYWN0aW9uTmFtZTogJ0J1aWxkJyxcbiAgICAgICAgICAgICAgICBwcm9qZWN0OiBuZXcgY29kZWJ1aWxkLlBpcGVsaW5lUHJvamVjdChzdGFjaywgJ015UHJvamVjdCcpLFxuICAgICAgICAgICAgICAgIGlucHV0OiBzb3VyY2VPdXRwdXQsXG4gICAgICAgICAgICAgICAgZW52aXJvbm1lbnRWYXJpYWJsZXM6IHtcbiAgICAgICAgICAgICAgICAgIEF1dGhvckRhdGU6IHsgdmFsdWU6IGNvZGVDb21taXRTb3VyY2VBY3Rpb24udmFyaWFibGVzLmF1dGhvckRhdGUgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlUGlwZWxpbmU6OlBpcGVsaW5lJywge1xuICAgICAgICAnU3RhZ2VzJzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgICdOYW1lJzogJ1NvdXJjZScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnTmFtZSc6ICdCdWlsZCcsXG4gICAgICAgICAgICAnQWN0aW9ucyc6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdOYW1lJzogJ0J1aWxkJyxcbiAgICAgICAgICAgICAgICAnQ29uZmlndXJhdGlvbic6IHtcbiAgICAgICAgICAgICAgICAgICdFbnZpcm9ubWVudFZhcmlhYmxlcyc6ICdbe1wibmFtZVwiOlwiQXV0aG9yRGF0ZVwiLFwidHlwZVwiOlwiUExBSU5URVhUXCIsXCJ2YWx1ZVwiOlwiI3tTb3VyY2VfU291cmNlX05TLkF1dGhvckRhdGV9XCJ9XScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYWxsb3dzIHVzaW5nIGEgVG9rZW4gZm9yIHRoZSBicmFuY2ggbmFtZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAgIGNvbnN0IHNvdXJjZU91dHB1dCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoKTtcbiAgICAgIG5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUoc3RhY2ssICdQJywge1xuICAgICAgICBzdGFnZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdGFnZU5hbWU6ICdTb3VyY2UnLFxuICAgICAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgICAgICBuZXcgY3BhY3Rpb25zLkNvZGVDb21taXRTb3VyY2VBY3Rpb24oe1xuICAgICAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdDb2RlQ29tbWl0JyxcbiAgICAgICAgICAgICAgICByZXBvc2l0b3J5OiBuZXcgY29kZWNvbW1pdC5SZXBvc2l0b3J5KHN0YWNrLCAnUicsIHtcbiAgICAgICAgICAgICAgICAgIHJlcG9zaXRvcnlOYW1lOiAncmVwb3NpdG9yeScsXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgYnJhbmNoOiBMYXp5LnN0cmluZyh7IHByb2R1Y2U6ICgpID0+ICdteS1icmFuY2gnIH0pLFxuICAgICAgICAgICAgICAgIG91dHB1dDogc291cmNlT3V0cHV0LFxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdGFnZU5hbWU6ICdCdWlsZCcsXG4gICAgICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgICAgIG5ldyBjcGFjdGlvbnMuQ29kZUJ1aWxkQWN0aW9uKHtcbiAgICAgICAgICAgICAgICBhY3Rpb25OYW1lOiAnQnVpbGQnLFxuICAgICAgICAgICAgICAgIHByb2plY3Q6IG5ldyBjb2RlYnVpbGQuUGlwZWxpbmVQcm9qZWN0KHN0YWNrLCAnQ29kZUJ1aWxkJyksXG4gICAgICAgICAgICAgICAgaW5wdXQ6IHNvdXJjZU91dHB1dCxcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RXZlbnRzOjpSdWxlJywge1xuICAgICAgICBFdmVudFBhdHRlcm46IHtcbiAgICAgICAgICBkZXRhaWw6IHtcbiAgICAgICAgICAgIHJlZmVyZW5jZU5hbWU6IFsnbXktYnJhbmNoJ10sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYWxsb3dzIHRvIGVuYWJsZSBmdWxsIGNsb25lJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgICAgY29uc3Qgc291cmNlT3V0cHV0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpO1xuICAgICAgbmV3IGNvZGVwaXBlbGluZS5QaXBlbGluZShzdGFjaywgJ1AnLCB7XG4gICAgICAgIHN0YWdlczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN0YWdlTmFtZTogJ1NvdXJjZScsXG4gICAgICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgICAgIG5ldyBjcGFjdGlvbnMuQ29kZUNvbW1pdFNvdXJjZUFjdGlvbih7XG4gICAgICAgICAgICAgICAgYWN0aW9uTmFtZTogJ0NvZGVDb21taXQnLFxuICAgICAgICAgICAgICAgIHJlcG9zaXRvcnk6IG5ldyBjb2RlY29tbWl0LlJlcG9zaXRvcnkoc3RhY2ssICdSJywge1xuICAgICAgICAgICAgICAgICAgcmVwb3NpdG9yeU5hbWU6ICdyZXBvc2l0b3J5JyxcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBicmFuY2g6IExhenkuc3RyaW5nKHsgcHJvZHVjZTogKCkgPT4gJ215LWJyYW5jaCcgfSksXG4gICAgICAgICAgICAgICAgb3V0cHV0OiBzb3VyY2VPdXRwdXQsXG4gICAgICAgICAgICAgICAgY29kZUJ1aWxkQ2xvbmVPdXRwdXQ6IHRydWUsXG4gICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN0YWdlTmFtZTogJ0J1aWxkJyxcbiAgICAgICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAgICAgbmV3IGNwYWN0aW9ucy5Db2RlQnVpbGRBY3Rpb24oe1xuICAgICAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdCdWlsZCcsXG4gICAgICAgICAgICAgICAgcHJvamVjdDogbmV3IGNvZGVidWlsZC5QaXBlbGluZVByb2plY3Qoc3RhY2ssICdDb2RlQnVpbGQnKSxcbiAgICAgICAgICAgICAgICBpbnB1dDogc291cmNlT3V0cHV0LFxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlUGlwZWxpbmU6OlBpcGVsaW5lJywge1xuICAgICAgICAnU3RhZ2VzJzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgICdOYW1lJzogJ1NvdXJjZScsXG4gICAgICAgICAgICAnQWN0aW9ucyc6IFt7XG4gICAgICAgICAgICAgICdDb25maWd1cmF0aW9uJzoge1xuICAgICAgICAgICAgICAgICdPdXRwdXRBcnRpZmFjdEZvcm1hdCc6ICdDT0RFQlVJTERfQ0xPTkVfUkVGJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH1dLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ05hbWUnOiAnQnVpbGQnLFxuICAgICAgICAgICAgJ0FjdGlvbnMnOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnTmFtZSc6ICdCdWlsZCcsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICAgICdQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgICAnU3RhdGVtZW50JzogTWF0Y2guYXJyYXlXaXRoKFtcbiAgICAgICAgICAgIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgICAgICAnQWN0aW9uJzogW1xuICAgICAgICAgICAgICAgICdsb2dzOkNyZWF0ZUxvZ0dyb3VwJyxcbiAgICAgICAgICAgICAgICAnbG9nczpDcmVhdGVMb2dTdHJlYW0nLFxuICAgICAgICAgICAgICAgICdsb2dzOlB1dExvZ0V2ZW50cycsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgICAgICAnQWN0aW9uJzogJ2NvZGVjb21taXQ6R2l0UHVsbCcsXG4gICAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgICAnUmVzb3VyY2UnOiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAnUkMyMUExNzAyJyxcbiAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICBdKSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgICAgJ1BvbGljeURvY3VtZW50Jzoge1xuICAgICAgICAgICdTdGF0ZW1lbnQnOiBNYXRjaC5hcnJheVdpdGgoW1xuICAgICAgICAgICAgTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgICAgICdBY3Rpb24nOiBbXG4gICAgICAgICAgICAgICAgJ2NvZGVjb21taXQ6R2V0QnJhbmNoJyxcbiAgICAgICAgICAgICAgICAnY29kZWNvbW1pdDpHZXRDb21taXQnLFxuICAgICAgICAgICAgICAgICdjb2RlY29tbWl0OlVwbG9hZEFyY2hpdmUnLFxuICAgICAgICAgICAgICAgICdjb2RlY29tbWl0OkdldFVwbG9hZEFyY2hpdmVTdGF0dXMnLFxuICAgICAgICAgICAgICAgICdjb2RlY29tbWl0OkNhbmNlbFVwbG9hZEFyY2hpdmUnLFxuICAgICAgICAgICAgICAgICdjb2RlY29tbWl0OkdldFJlcG9zaXRvcnknLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICAgJ1Jlc291cmNlJzoge1xuICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgJ1JDMjFBMTcwMicsXG4gICAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgXSksXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3VzZXMgdGhlIHJvbGUgd2hlbiBwYXNzZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgICBjb25zdCBwaXBlbGluZSA9IG5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUoc3RhY2ssICdQJywge1xuICAgICAgICBwaXBlbGluZU5hbWU6ICdNeVBpcGVsaW5lJyxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCB0cmlnZ2VyRXZlbnRUZXN0Um9sZSA9IG5ldyBpYW0uUm9sZShzdGFjaywgJ1RyaWdnZXItdGVzdC1yb2xlJywge1xuICAgICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnZXZlbnRzLmFtYXpvbmF3cy5jb20nKSxcbiAgICAgIH0pO1xuICAgICAgdHJpZ2dlckV2ZW50VGVzdFJvbGUuYWRkVG9Qb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICBhY3Rpb25zOiBbJ2NvZGVwaXBlbGluZTpTdGFydFBpcGVsaW5lRXhlY3V0aW9uJ10sXG4gICAgICAgIHJlc291cmNlczogW3BpcGVsaW5lLnBpcGVsaW5lQXJuXSxcbiAgICAgIH0pKTtcblxuICAgICAgY29uc3Qgc291cmNlT3V0cHV0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpO1xuXG4gICAgICBjb25zdCBzb3VyY2VBY3Rpb24gPSBuZXcgY3BhY3Rpb25zLkNvZGVDb21taXRTb3VyY2VBY3Rpb24oe1xuICAgICAgICBhY3Rpb25OYW1lOiAnQ29kZUNvbW1pdCcsXG4gICAgICAgIHJlcG9zaXRvcnk6IG5ldyBjb2RlY29tbWl0LlJlcG9zaXRvcnkoc3RhY2ssICdSJywge1xuICAgICAgICAgIHJlcG9zaXRvcnlOYW1lOiAncmVwb3NpdG9yeScsXG4gICAgICAgIH0pLFxuICAgICAgICBicmFuY2g6IExhenkuc3RyaW5nKHsgcHJvZHVjZTogKCkgPT4gJ215LWJyYW5jaCcgfSksXG4gICAgICAgIG91dHB1dDogc291cmNlT3V0cHV0LFxuICAgICAgICBldmVudFJvbGU6IHRyaWdnZXJFdmVudFRlc3RSb2xlLFxuICAgICAgfSk7XG5cbiAgICAgIHBpcGVsaW5lLmFkZFN0YWdlKHtcbiAgICAgICAgc3RhZ2VOYW1lOiAnU291cmNlJyxcbiAgICAgICAgYWN0aW9uczogW3NvdXJjZUFjdGlvbl0sXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgYnVpbGRBY3Rpb24gPSBuZXcgY3BhY3Rpb25zLkNvZGVCdWlsZEFjdGlvbih7XG4gICAgICAgIGFjdGlvbk5hbWU6ICdCdWlsZCcsXG4gICAgICAgIHByb2plY3Q6IG5ldyBjb2RlYnVpbGQuUGlwZWxpbmVQcm9qZWN0KHN0YWNrLCAnQ29kZUJ1aWxkJyksXG4gICAgICAgIGlucHV0OiBzb3VyY2VPdXRwdXQsXG4gICAgICB9KTtcblxuICAgICAgcGlwZWxpbmUuYWRkU3RhZ2Uoe1xuICAgICAgICBzdGFnZU5hbWU6ICdidWlsZCcsXG4gICAgICAgIGFjdGlvbnM6IFtidWlsZEFjdGlvbl0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RXZlbnRzOjpSdWxlJywge1xuICAgICAgICBUYXJnZXRzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQXJuOiBzdGFjay5yZXNvbHZlKHBpcGVsaW5lLnBpcGVsaW5lQXJuKSxcbiAgICAgICAgICAgIElkOiAnVGFyZ2V0MCcsXG4gICAgICAgICAgICBSb2xlQXJuOiBzdGFjay5yZXNvbHZlKHRyaWdnZXJFdmVudFRlc3RSb2xlLnJvbGVBcm4pLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2dyYW50cyBleHBsaWNpdCBzMzpQdXRPYmplY3RBY2wgcGVybWlzc2lvbnMgd2hlbiB0aGUgQWN0aW9ucyBpcyBjcm9zcy1hY2NvdW50JywgKCkgPT4ge1xuICAgICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuXG4gICAgICBjb25zdCByZXBvU3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnUmVwb1N0YWNrJywge1xuICAgICAgICBlbnY6IHsgYWNjb3VudDogJzEyMycsIHJlZ2lvbjogJ3VzLWVhc3QtMScgfSxcbiAgICAgIH0pO1xuICAgICAgY29uc3QgcmVwb0ZvbUFub3RoZXJBY2NvdW50ID0gY29kZWNvbW1pdC5SZXBvc2l0b3J5LmZyb21SZXBvc2l0b3J5TmFtZShyZXBvU3RhY2ssICdSZXBvJywgJ215LXJlcG8nKTtcblxuICAgICAgY29uc3QgcGlwZWxpbmVTdGFjayA9IG5ldyBTdGFjayhhcHAsICdQaXBlbGluZVN0YWNrJywge1xuICAgICAgICBlbnY6IHsgYWNjb3VudDogJzQ1NicsIHJlZ2lvbjogJ3VzLWVhc3QtMScgfSxcbiAgICAgIH0pO1xuICAgICAgbmV3IGNvZGVwaXBlbGluZS5QaXBlbGluZShwaXBlbGluZVN0YWNrLCAnUGlwZWxpbmUnLCB7XG4gICAgICAgIGFydGlmYWN0QnVja2V0OiBzMy5CdWNrZXQuZnJvbUJ1Y2tldEF0dHJpYnV0ZXMocGlwZWxpbmVTdGFjaywgJ1BpcGVsaW5lQnVja2V0Jywge1xuICAgICAgICAgIGJ1Y2tldE5hbWU6ICdwaXBlbGluZS1idWNrZXQnLFxuICAgICAgICAgIGVuY3J5cHRpb25LZXk6IGttcy5LZXkuZnJvbUtleUFybihwaXBlbGluZVN0YWNrLCAnUGlwZWxpbmVLZXknLFxuICAgICAgICAgICAgJ2Fybjphd3M6a21zOnVzLWVhc3QtMTo0NTY6a2V5L215LWtleScpLFxuICAgICAgICB9KSxcbiAgICAgICAgc3RhZ2VzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3RhZ2VOYW1lOiAnU291cmNlJyxcbiAgICAgICAgICAgIGFjdGlvbnM6IFtuZXcgY3BhY3Rpb25zLkNvZGVDb21taXRTb3VyY2VBY3Rpb24oe1xuICAgICAgICAgICAgICBhY3Rpb25OYW1lOiAnU291cmNlJyxcbiAgICAgICAgICAgICAgb3V0cHV0OiBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCksXG4gICAgICAgICAgICAgIHJlcG9zaXRvcnk6IHJlcG9Gb21Bbm90aGVyQWNjb3VudCxcbiAgICAgICAgICAgIH0pXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN0YWdlTmFtZTogJ0FwcHJvdmUnLFxuICAgICAgICAgICAgYWN0aW9uczogW25ldyBjcGFjdGlvbnMuTWFudWFsQXBwcm92YWxBY3Rpb24oe1xuICAgICAgICAgICAgICBhY3Rpb25OYW1lOiAnQXBwcm92ZScsXG4gICAgICAgICAgICB9KV0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2socmVwb1N0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgU3RhdGVtZW50OiBNYXRjaC5hcnJheVdpdGgoW3tcbiAgICAgICAgICAgICdBY3Rpb24nOiBbXG4gICAgICAgICAgICAgICdzMzpQdXRPYmplY3RBY2wnLFxuICAgICAgICAgICAgICAnczM6UHV0T2JqZWN0VmVyc2lvbkFjbCcsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAnUmVzb3VyY2UnOiB7XG4gICAgICAgICAgICAgICdGbjo6Sm9pbic6IFsnJywgW1xuICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICB7ICdSZWYnOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICAgICAgICAgJzpzMzo6OnBpcGVsaW5lLWJ1Y2tldC8qJyxcbiAgICAgICAgICAgICAgXV0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1dKSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYWxsb3dzIHVzaW5nIGEgbmV3IFJlcG9zaXRvcnkgZnJvbSBhbm90aGVyIFN0YWNrIGFzIGEgc291cmNlIG9mIHRoZSBQaXBlbGluZSwgd2l0aCBFdmVudHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5cbiAgICAgIGNvbnN0IHJlcG9TdGFjayA9IG5ldyBTdGFjayhhcHAsICdSZXBvc2l0b3J5U3RhY2snKTtcbiAgICAgIGNvbnN0IHJlcG8gPSBuZXcgY29kZWNvbW1pdC5SZXBvc2l0b3J5KHJlcG9TdGFjaywgJ1JlcG9zaXRvcnknLCB7XG4gICAgICAgIHJlcG9zaXRvcnlOYW1lOiAnbXktcmVwbycsXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgcGlwZWxpbmVTdGFjayA9IG5ldyBTdGFjayhhcHAsICdQaXBlbGluZVN0YWNrJyk7XG4gICAgICBjb25zdCBzb3VyY2VPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCk7XG4gICAgICBuZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHBpcGVsaW5lU3RhY2ssICdQaXBlbGluZScsIHtcbiAgICAgICAgc3RhZ2VzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3RhZ2VOYW1lOiAnU291cmNlJyxcbiAgICAgICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAgICAgbmV3IGNwYWN0aW9ucy5Db2RlQ29tbWl0U291cmNlQWN0aW9uKHtcbiAgICAgICAgICAgICAgICBhY3Rpb25OYW1lOiAnU291cmNlJyxcbiAgICAgICAgICAgICAgICByZXBvc2l0b3J5OiByZXBvLFxuICAgICAgICAgICAgICAgIG91dHB1dDogc291cmNlT3V0cHV0LFxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdGFnZU5hbWU6ICdCdWlsZCcsXG4gICAgICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgICAgIG5ldyBjcGFjdGlvbnMuQ29kZUJ1aWxkQWN0aW9uKHtcbiAgICAgICAgICAgICAgICBhY3Rpb25OYW1lOiAnQnVpbGQnLFxuICAgICAgICAgICAgICAgIHByb2plY3Q6IGNvZGVidWlsZC5Qcm9qZWN0LmZyb21Qcm9qZWN0TmFtZShwaXBlbGluZVN0YWNrLCAnUHJvamVjdCcsICdteS1wcm9qZWN0JyksXG4gICAgICAgICAgICAgICAgaW5wdXQ6IHNvdXJjZU91dHB1dCxcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgLy8gSWYgdGhlIEV2ZW50IFJ1bGUgd2FzIGNyZWF0ZWQgaW4gdGhlIHJlcG8ncyBTdGFjayxcbiAgICAgIC8vIHdlIHdvdWxkIGhhdmUgYSBjeWNsZVxuICAgICAgLy8gKHRoZSByZXBvJ3MgU3RhY2sgd291bGQgbmVlZCB0aGUgbmFtZSBvZiB0aGUgQ29kZVBpcGVsaW5lIHRvIHRyaWdnZXIgdGhyb3VnaCB0aGUgUnVsZSxcbiAgICAgIC8vIHdoaWxlIHRoZSBwaXBlbGluZSdzIFN0YWNrIHdvdWxkIG5lZWQgdGhlIG5hbWUgb2YgdGhlIFJlcG9zaXRvcnkgdG8gdXNlIGFzIGEgU291cmNlKS5cbiAgICAgIC8vIEJ5IG1vdmluZyB0aGUgUnVsZSB0byBwaXBlbGluZSdzIFN0YWNrLCB3ZSBnZXQgcmlkIG9mIHRoZSBjeWNsZS5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhwaXBlbGluZVN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RXZlbnRzOjpSdWxlJywgMSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbmZ1bmN0aW9uIG1pbmltYWxQaXBlbGluZShzdGFjazogU3RhY2ssIHRyaWdnZXI6IGNwYWN0aW9ucy5Db2RlQ29tbWl0VHJpZ2dlciB8IHVuZGVmaW5lZCk6IGNvZGVwaXBlbGluZS5QaXBlbGluZSB7XG4gIGNvbnN0IHNvdXJjZU91dHB1dCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoKTtcbiAgcmV0dXJuIG5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUoc3RhY2ssICdNeVBpcGVsaW5lJywge1xuICAgIHN0YWdlczogW1xuICAgICAge1xuICAgICAgICBzdGFnZU5hbWU6ICdTb3VyY2UnLFxuICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgbmV3IGNwYWN0aW9ucy5Db2RlQ29tbWl0U291cmNlQWN0aW9uKHtcbiAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdTb3VyY2UnLFxuICAgICAgICAgICAgcmVwb3NpdG9yeTogbmV3IGNvZGVjb21taXQuUmVwb3NpdG9yeShzdGFjaywgJ015UmVwbycsIHtcbiAgICAgICAgICAgICAgcmVwb3NpdG9yeU5hbWU6ICdteS1yZXBvJyxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgb3V0cHV0OiBzb3VyY2VPdXRwdXQsXG4gICAgICAgICAgICB0cmlnZ2VyLFxuICAgICAgICAgIH0pLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgc3RhZ2VOYW1lOiAnQnVpbGQnLFxuICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgbmV3IGNwYWN0aW9ucy5Db2RlQnVpbGRBY3Rpb24oe1xuICAgICAgICAgICAgYWN0aW9uTmFtZTogJ0J1aWxkJyxcbiAgICAgICAgICAgIHByb2plY3Q6IG5ldyBjb2RlYnVpbGQuUGlwZWxpbmVQcm9qZWN0KHN0YWNrLCAnTXlQcm9qZWN0JyksXG4gICAgICAgICAgICBpbnB1dDogc291cmNlT3V0cHV0LFxuICAgICAgICAgIH0pLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICBdLFxuICB9KTtcbn1cbiJdfQ==