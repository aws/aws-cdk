"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const codebuild = require("@aws-cdk/aws-codebuild");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const core_1 = require("@aws-cdk/core");
const cpactions = require("../../lib");
/* eslint-disable quote-props */
describe('CodeStar Connections source Action', () => {
    describe('CodeStar Connections source Action', () => {
        test('produces the correct configuration when added to a pipeline', () => {
            const stack = new core_1.Stack();
            createBitBucketAndCodeBuildPipeline(stack, {
                codeBuildCloneOutput: false,
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
                'Stages': [
                    {
                        'Name': 'Source',
                        'Actions': [
                            {
                                'Name': 'BitBucket',
                                'ActionTypeId': {
                                    'Owner': 'AWS',
                                    'Provider': 'CodeStarSourceConnection',
                                },
                                'Configuration': {
                                    'ConnectionArn': 'arn:aws:codestar-connections:us-east-1:123456789012:connection/12345678-abcd-12ab-34cdef5678gh',
                                    'FullRepositoryId': 'aws/aws-cdk',
                                    'BranchName': 'master',
                                },
                            },
                        ],
                    },
                    {
                        'Name': 'Build',
                        'Actions': [
                            {
                                'Name': 'CodeBuild',
                            },
                        ],
                    },
                ],
            });
        });
    });
    test('setting codeBuildCloneOutput=true adds permission to use the connection to the following CodeBuild Project', () => {
        const stack = new core_1.Stack();
        createBitBucketAndCodeBuildPipeline(stack, {
            codeBuildCloneOutput: true,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            'PolicyDocument': {
                'Statement': [
                    {
                        'Action': [
                            'logs:CreateLogGroup',
                            'logs:CreateLogStream',
                            'logs:PutLogEvents',
                        ],
                    },
                    {},
                    {},
                    {},
                    {},
                    {
                        'Action': 'codestar-connections:UseConnection',
                        'Effect': 'Allow',
                        'Resource': 'arn:aws:codestar-connections:us-east-1:123456789012:connection/12345678-abcd-12ab-34cdef5678gh',
                    },
                ],
            },
        });
    });
    test('grant s3 putObjectACL to the following CodeBuild Project', () => {
        const stack = new core_1.Stack();
        createBitBucketAndCodeBuildPipeline(stack, {
            codeBuildCloneOutput: true,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            'PolicyDocument': {
                'Statement': assertions_1.Match.arrayWith([
                    assertions_1.Match.objectLike({
                        'Action': [
                            's3:PutObjectAcl',
                            's3:PutObjectVersionAcl',
                        ],
                        'Effect': 'Allow',
                        'Resource': {
                            'Fn::Join': ['', [
                                    { 'Fn::GetAtt': ['PipelineArtifactsBucket22248F97', 'Arn'] },
                                    '/*',
                                ]],
                        },
                    }),
                ]),
            },
        });
    });
    test('setting triggerOnPush=false reflects in the configuration', () => {
        const stack = new core_1.Stack();
        createBitBucketAndCodeBuildPipeline(stack, {
            triggerOnPush: false,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
            'Stages': [
                {
                    'Name': 'Source',
                    'Actions': [
                        {
                            'Name': 'BitBucket',
                            'ActionTypeId': {
                                'Owner': 'AWS',
                                'Provider': 'CodeStarSourceConnection',
                            },
                            'Configuration': {
                                'ConnectionArn': 'arn:aws:codestar-connections:us-east-1:123456789012:connection/12345678-abcd-12ab-34cdef5678gh',
                                'FullRepositoryId': 'aws/aws-cdk',
                                'BranchName': 'master',
                                'DetectChanges': false,
                            },
                        },
                    ],
                },
                {
                    'Name': 'Build',
                    'Actions': [
                        {
                            'Name': 'CodeBuild',
                        },
                    ],
                },
            ],
        });
    });
    test('exposes variables', () => {
        const stack = new core_1.Stack();
        createBitBucketAndCodeBuildPipeline(stack);
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
                                'EnvironmentVariables': '[{"name":"CommitId","type":"PLAINTEXT","value":"#{Source_BitBucket_NS.CommitId}"}]',
                            },
                        },
                    ],
                },
            ],
        });
    });
    test('exposes variables with custom namespace', () => {
        const stack = new core_1.Stack();
        createBitBucketAndCodeBuildPipeline(stack, {
            variablesNamespace: 'kornicameister',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
            'Stages': [
                {
                    'Name': 'Source',
                    'Actions': [
                        {
                            'Name': 'BitBucket',
                            'Namespace': 'kornicameister',
                        },
                    ],
                },
                {
                    'Name': 'Build',
                    'Actions': [
                        {
                            'Name': 'CodeBuild',
                            'Configuration': {
                                'EnvironmentVariables': '[{"name":"CommitId","type":"PLAINTEXT","value":"#{kornicameister.CommitId}"}]',
                            },
                        },
                    ],
                },
            ],
        });
    });
    test('fail if variable from unused action is referenced', () => {
        const app = new core_1.App();
        const stack = new core_1.Stack(app);
        const pipeline = createBitBucketAndCodeBuildPipeline(stack);
        const unusedSourceOutput = new codepipeline.Artifact();
        const unusedSourceAction = new cpactions.CodeStarConnectionsSourceAction({
            actionName: 'UnusedBitBucket',
            owner: 'aws',
            repo: 'aws-cdk',
            output: unusedSourceOutput,
            connectionArn: 'arn:aws:codestar-connections:us-east-1:123456789012:connection/12345678-abcd-12ab-34cdef5678gh',
        });
        const unusedBuildAction = new cpactions.CodeBuildAction({
            actionName: 'UnusedCodeBuild',
            project: new codebuild.PipelineProject(stack, 'UnusedMyProject'),
            input: unusedSourceOutput,
            environmentVariables: {
                CommitId: { value: unusedSourceAction.variables.commitId },
            },
        });
        pipeline.stage('Build').addAction(unusedBuildAction);
        expect(() => {
            core_1.App.of(stack).synth();
        }).toThrow(/Cannot reference variables of action 'UnusedBitBucket', as that action was never added to a pipeline/);
    });
    test('fail if variable from unused action with custom namespace is referenced', () => {
        const app = new core_1.App();
        const stack = new core_1.Stack(app);
        const pipeline = createBitBucketAndCodeBuildPipeline(stack, {
            variablesNamespace: 'kornicameister',
        });
        const unusedSourceOutput = new codepipeline.Artifact();
        const unusedSourceAction = new cpactions.CodeStarConnectionsSourceAction({
            actionName: 'UnusedBitBucket',
            owner: 'aws',
            repo: 'aws-cdk',
            output: unusedSourceOutput,
            connectionArn: 'arn:aws:codestar-connections:us-east-1:123456789012:connection/12345678-abcd-12ab-34cdef5678gh',
            variablesNamespace: 'kornicameister',
        });
        const unusedBuildAction = new cpactions.CodeBuildAction({
            actionName: 'UnusedCodeBuild',
            project: new codebuild.PipelineProject(stack, 'UnusedProject'),
            input: unusedSourceOutput,
            environmentVariables: {
                CommitId: { value: unusedSourceAction.variables.commitId },
            },
        });
        pipeline.stage('Build').addAction(unusedBuildAction);
        expect(() => {
            core_1.App.of(stack).synth();
        }).toThrow(/Cannot reference variables of action 'UnusedBitBucket', as that action was never added to a pipeline/);
    });
});
function createBitBucketAndCodeBuildPipeline(stack, props = {}) {
    const sourceOutput = new codepipeline.Artifact();
    const sourceAction = new cpactions.CodeStarConnectionsSourceAction({
        actionName: 'BitBucket',
        owner: 'aws',
        repo: 'aws-cdk',
        output: sourceOutput,
        connectionArn: 'arn:aws:codestar-connections:us-east-1:123456789012:connection/12345678-abcd-12ab-34cdef5678gh',
        ...props,
    });
    return new codepipeline.Pipeline(stack, 'Pipeline', {
        stages: [
            {
                stageName: 'Source',
                actions: [sourceAction],
            },
            {
                stageName: 'Build',
                actions: [
                    new cpactions.CodeBuildAction({
                        actionName: 'CodeBuild',
                        project: new codebuild.PipelineProject(stack, 'MyProject'),
                        input: sourceOutput,
                        outputs: [new codepipeline.Artifact()],
                        environmentVariables: {
                            CommitId: { value: sourceAction.variables.commitId },
                        },
                    }),
                ],
            },
        ],
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZXN0YXItY29ubmVjdGlvbnMtc291cmNlLWFjdGlvbi50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29kZXN0YXItY29ubmVjdGlvbnMtc291cmNlLWFjdGlvbi50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQXNEO0FBQ3RELG9EQUFvRDtBQUNwRCwwREFBMEQ7QUFDMUQsd0NBQTJDO0FBQzNDLHVDQUF1QztBQUV2QyxnQ0FBZ0M7QUFFaEMsUUFBUSxDQUFDLG9DQUFvQyxFQUFFLEdBQUcsRUFBRTtJQUNsRCxRQUFRLENBQUMsb0NBQW9DLEVBQUUsR0FBRyxFQUFFO1FBQ2xELElBQUksQ0FBQyw2REFBNkQsRUFBRSxHQUFHLEVBQUU7WUFDdkUsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUUxQixtQ0FBbUMsQ0FBQyxLQUFLLEVBQUU7Z0JBQ3pDLG9CQUFvQixFQUFFLEtBQUs7YUFDNUIsQ0FBQyxDQUFDO1lBRUgscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsNkJBQTZCLEVBQUU7Z0JBQzdFLFFBQVEsRUFBRTtvQkFDUjt3QkFDRSxNQUFNLEVBQUUsUUFBUTt3QkFDaEIsU0FBUyxFQUFFOzRCQUNUO2dDQUNFLE1BQU0sRUFBRSxXQUFXO2dDQUNuQixjQUFjLEVBQUU7b0NBQ2QsT0FBTyxFQUFFLEtBQUs7b0NBQ2QsVUFBVSxFQUFFLDBCQUEwQjtpQ0FDdkM7Z0NBQ0QsZUFBZSxFQUFFO29DQUNmLGVBQWUsRUFBRSxnR0FBZ0c7b0NBQ2pILGtCQUFrQixFQUFFLGFBQWE7b0NBQ2pDLFlBQVksRUFBRSxRQUFRO2lDQUN2Qjs2QkFDRjt5QkFDRjtxQkFDRjtvQkFDRDt3QkFDRSxNQUFNLEVBQUUsT0FBTzt3QkFDZixTQUFTLEVBQUU7NEJBQ1Q7Z0NBQ0UsTUFBTSxFQUFFLFdBQVc7NkJBQ3BCO3lCQUNGO3FCQUNGO2lCQUNGO2FBQ0YsQ0FBQyxD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QzFDLEtBQVksRUFBRSxRQUFpRSxFQUFFO0lBRWpGLE1BQU0sWUFBWSxHQUFHLElBQUksWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2pELE1BQU0sWUFBWSxHQUFHLElBQUksU0FBUyxDQUFDLCtCQUErQixDQUFDO1FBQ2pFLFVBQVUsRUFBRSxXQUFXO1FBQ3ZCLEtBQUssRUFBRSxLQUFLO1FBQ1osSUFBSSxFQUFFLFNBQVM7UUFDZixNQUFNLEVBQUUsWUFBWTtRQUNwQixhQUFhLEVBQUUsZ0dBQWdHO1FBQy9HLEdBQUcsS0FBSztLQUNULENBQUMsQ0FBQztJQUVILE9BQU8sSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7UUFDbEQsTUFBTSxFQUFFO1lBQ047Z0JBQ0UsU0FBUyxFQUFFLFFBQVE7Z0JBQ25CLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQzthQUN4QjtZQUNEO2dCQUNFLFNBQVMsRUFBRSxPQUFPO2dCQUNsQixPQUFPLEVBQUU7b0JBQ1AsSUFBSSxTQUFTLENBQUMsZUFBZSxDQUFDO3dCQUM1QixVQUFVLEVBQUUsV0FBVzt3QkFDdkIsT0FBTyxFQUFFLElBQUksU0FBUyxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDO3dCQUMxRCxLQUFLLEVBQUUsWUFBWTt3QkFDbkIsT0FBTyxFQUFFLENBQUMsSUFBSSxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUM7d0JBQ3RDLG9CQUFvQixFQUFFOzRCQUNwQixRQUFRLEVBQUUsRUFBRSxLQUFLLEVBQUUsWUFBWSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUU7eUJBQ3JEO3FCQUNGLENBQUM7aUJBQ0g7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlLCBNYXRjaCB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgY29kZWJ1aWxkIGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlYnVpbGQnO1xuaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lIGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlcGlwZWxpbmUnO1xuaW1wb3J0IHsgQXBwLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY3BhY3Rpb25zIGZyb20gJy4uLy4uL2xpYic7XG5cbi8qIGVzbGludC1kaXNhYmxlIHF1b3RlLXByb3BzICovXG5cbmRlc2NyaWJlKCdDb2RlU3RhciBDb25uZWN0aW9ucyBzb3VyY2UgQWN0aW9uJywgKCkgPT4ge1xuICBkZXNjcmliZSgnQ29kZVN0YXIgQ29ubmVjdGlvbnMgc291cmNlIEFjdGlvbicsICgpID0+IHtcbiAgICB0ZXN0KCdwcm9kdWNlcyB0aGUgY29ycmVjdCBjb25maWd1cmF0aW9uIHdoZW4gYWRkZWQgdG8gYSBwaXBlbGluZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAgIGNyZWF0ZUJpdEJ1Y2tldEFuZENvZGVCdWlsZFBpcGVsaW5lKHN0YWNrLCB7XG4gICAgICAgIGNvZGVCdWlsZENsb25lT3V0cHV0OiBmYWxzZSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlUGlwZWxpbmU6OlBpcGVsaW5lJywge1xuICAgICAgICAnU3RhZ2VzJzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgICdOYW1lJzogJ1NvdXJjZScsXG4gICAgICAgICAgICAnQWN0aW9ucyc6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdOYW1lJzogJ0JpdEJ1Y2tldCcsXG4gICAgICAgICAgICAgICAgJ0FjdGlvblR5cGVJZCc6IHtcbiAgICAgICAgICAgICAgICAgICdPd25lcic6ICdBV1MnLFxuICAgICAgICAgICAgICAgICAgJ1Byb3ZpZGVyJzogJ0NvZGVTdGFyU291cmNlQ29ubmVjdGlvbicsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAnQ29uZmlndXJhdGlvbic6IHtcbiAgICAgICAgICAgICAgICAgICdDb25uZWN0aW9uQXJuJzogJ2Fybjphd3M6Y29kZXN0YXItY29ubmVjdGlvbnM6dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjpjb25uZWN0aW9uLzEyMzQ1Njc4LWFiY2QtMTJhYi0zNGNkZWY1Njc4Z2gnLFxuICAgICAgICAgICAgICAgICAgJ0Z1bGxSZXBvc2l0b3J5SWQnOiAnYXdzL2F3cy1jZGsnLFxuICAgICAgICAgICAgICAgICAgJ0JyYW5jaE5hbWUnOiAnbWFzdGVyJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgICdOYW1lJzogJ0J1aWxkJyxcbiAgICAgICAgICAgICdBY3Rpb25zJzogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ05hbWUnOiAnQ29kZUJ1aWxkJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG5cbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnc2V0dGluZyBjb2RlQnVpbGRDbG9uZU91dHB1dD10cnVlIGFkZHMgcGVybWlzc2lvbiB0byB1c2UgdGhlIGNvbm5lY3Rpb24gdG8gdGhlIGZvbGxvd2luZyBDb2RlQnVpbGQgUHJvamVjdCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgY3JlYXRlQml0QnVja2V0QW5kQ29kZUJ1aWxkUGlwZWxpbmUoc3RhY2ssIHtcbiAgICAgIGNvZGVCdWlsZENsb25lT3V0cHV0OiB0cnVlLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICAnUG9saWN5RG9jdW1lbnQnOiB7XG4gICAgICAgICdTdGF0ZW1lbnQnOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ0FjdGlvbic6IFtcbiAgICAgICAgICAgICAgJ2xvZ3M6Q3JlYXRlTG9nR3JvdXAnLFxuICAgICAgICAgICAgICAnbG9nczpDcmVhdGVMb2dTdHJlYW0nLFxuICAgICAgICAgICAgICAnbG9nczpQdXRMb2dFdmVudHMnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHt9LFxuICAgICAgICAgIHt9LFxuICAgICAgICAgIHt9LFxuICAgICAgICAgIHt9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgICdBY3Rpb24nOiAnY29kZXN0YXItY29ubmVjdGlvbnM6VXNlQ29ubmVjdGlvbicsXG4gICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICdSZXNvdXJjZSc6ICdhcm46YXdzOmNvZGVzdGFyLWNvbm5lY3Rpb25zOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6Y29ubmVjdGlvbi8xMjM0NTY3OC1hYmNkLTEyYWItMzRjZGVmNTY3OGdoJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcblxuXG4gIH0pO1xuXG4gIHRlc3QoJ2dyYW50IHMzIHB1dE9iamVjdEFDTCB0byB0aGUgZm9sbG93aW5nIENvZGVCdWlsZCBQcm9qZWN0JywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBjcmVhdGVCaXRCdWNrZXRBbmRDb2RlQnVpbGRQaXBlbGluZShzdGFjaywge1xuICAgICAgY29kZUJ1aWxkQ2xvbmVPdXRwdXQ6IHRydWUsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgICdQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgJ1N0YXRlbWVudCc6IE1hdGNoLmFycmF5V2l0aChbXG4gICAgICAgICAgTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgICAnQWN0aW9uJzogW1xuICAgICAgICAgICAgICAnczM6UHV0T2JqZWN0QWNsJyxcbiAgICAgICAgICAgICAgJ3MzOlB1dE9iamVjdFZlcnNpb25BY2wnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgJ1Jlc291cmNlJzoge1xuICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICAgICAgICAgICB7ICdGbjo6R2V0QXR0JzogWydQaXBlbGluZUFydGlmYWN0c0J1Y2tldDIyMjQ4Rjk3JywgJ0FybiddIH0sXG4gICAgICAgICAgICAgICAgJy8qJyxcbiAgICAgICAgICAgICAgXV0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pLFxuICAgICAgICBdKSxcbiAgICAgIH0sXG4gICAgfSk7XG5cblxuICB9KTtcblxuICB0ZXN0KCdzZXR0aW5nIHRyaWdnZXJPblB1c2g9ZmFsc2UgcmVmbGVjdHMgaW4gdGhlIGNvbmZpZ3VyYXRpb24nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGNyZWF0ZUJpdEJ1Y2tldEFuZENvZGVCdWlsZFBpcGVsaW5lKHN0YWNrLCB7XG4gICAgICB0cmlnZ2VyT25QdXNoOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVQaXBlbGluZTo6UGlwZWxpbmUnLCB7XG4gICAgICAnU3RhZ2VzJzogW1xuICAgICAgICB7XG4gICAgICAgICAgJ05hbWUnOiAnU291cmNlJyxcbiAgICAgICAgICAnQWN0aW9ucyc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ05hbWUnOiAnQml0QnVja2V0JyxcbiAgICAgICAgICAgICAgJ0FjdGlvblR5cGVJZCc6IHtcbiAgICAgICAgICAgICAgICAnT3duZXInOiAnQVdTJyxcbiAgICAgICAgICAgICAgICAnUHJvdmlkZXInOiAnQ29kZVN0YXJTb3VyY2VDb25uZWN0aW9uJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJ0NvbmZpZ3VyYXRpb24nOiB7XG4gICAgICAgICAgICAgICAgJ0Nvbm5lY3Rpb25Bcm4nOiAnYXJuOmF3czpjb2Rlc3Rhci1jb25uZWN0aW9uczp1cy1lYXN0LTE6MTIzNDU2Nzg5MDEyOmNvbm5lY3Rpb24vMTIzNDU2NzgtYWJjZC0xMmFiLTM0Y2RlZjU2NzhnaCcsXG4gICAgICAgICAgICAgICAgJ0Z1bGxSZXBvc2l0b3J5SWQnOiAnYXdzL2F3cy1jZGsnLFxuICAgICAgICAgICAgICAgICdCcmFuY2hOYW1lJzogJ21hc3RlcicsXG4gICAgICAgICAgICAgICAgJ0RldGVjdENoYW5nZXMnOiBmYWxzZSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICdOYW1lJzogJ0J1aWxkJyxcbiAgICAgICAgICAnQWN0aW9ucyc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ05hbWUnOiAnQ29kZUJ1aWxkJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgfSk7XG5cbiAgdGVzdCgnZXhwb3NlcyB2YXJpYWJsZXMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjcmVhdGVCaXRCdWNrZXRBbmRDb2RlQnVpbGRQaXBlbGluZShzdGFjayk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlUGlwZWxpbmU6OlBpcGVsaW5lJywge1xuICAgICAgJ1N0YWdlcyc6IFtcbiAgICAgICAge1xuICAgICAgICAgICdOYW1lJzogJ1NvdXJjZScsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAnTmFtZSc6ICdCdWlsZCcsXG4gICAgICAgICAgJ0FjdGlvbnMnOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdOYW1lJzogJ0NvZGVCdWlsZCcsXG4gICAgICAgICAgICAgICdDb25maWd1cmF0aW9uJzoge1xuICAgICAgICAgICAgICAgICdFbnZpcm9ubWVudFZhcmlhYmxlcyc6ICdbe1wibmFtZVwiOlwiQ29tbWl0SWRcIixcInR5cGVcIjpcIlBMQUlOVEVYVFwiLFwidmFsdWVcIjpcIiN7U291cmNlX0JpdEJ1Y2tldF9OUy5Db21taXRJZH1cIn1dJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2V4cG9zZXMgdmFyaWFibGVzIHdpdGggY3VzdG9tIG5hbWVzcGFjZScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNyZWF0ZUJpdEJ1Y2tldEFuZENvZGVCdWlsZFBpcGVsaW5lKHN0YWNrLCB7XG4gICAgICB2YXJpYWJsZXNOYW1lc3BhY2U6ICdrb3JuaWNhbWVpc3RlcicsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlUGlwZWxpbmU6OlBpcGVsaW5lJywge1xuICAgICAgJ1N0YWdlcyc6IFtcbiAgICAgICAge1xuICAgICAgICAgICdOYW1lJzogJ1NvdXJjZScsXG4gICAgICAgICAgJ0FjdGlvbnMnOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdOYW1lJzogJ0JpdEJ1Y2tldCcsXG4gICAgICAgICAgICAgICdOYW1lc3BhY2UnOiAna29ybmljYW1laXN0ZXInLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgJ05hbWUnOiAnQnVpbGQnLFxuICAgICAgICAgICdBY3Rpb25zJzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnTmFtZSc6ICdDb2RlQnVpbGQnLFxuICAgICAgICAgICAgICAnQ29uZmlndXJhdGlvbic6IHtcbiAgICAgICAgICAgICAgICAnRW52aXJvbm1lbnRWYXJpYWJsZXMnOiAnW3tcIm5hbWVcIjpcIkNvbW1pdElkXCIsXCJ0eXBlXCI6XCJQTEFJTlRFWFRcIixcInZhbHVlXCI6XCIje2tvcm5pY2FtZWlzdGVyLkNvbW1pdElkfVwifV0nLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZmFpbCBpZiB2YXJpYWJsZSBmcm9tIHVudXNlZCBhY3Rpb24gaXMgcmVmZXJlbmNlZCcsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwKTtcbiAgICBjb25zdCBwaXBlbGluZSA9IGNyZWF0ZUJpdEJ1Y2tldEFuZENvZGVCdWlsZFBpcGVsaW5lKHN0YWNrKTtcblxuICAgIGNvbnN0IHVudXNlZFNvdXJjZU91dHB1dCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoKTtcbiAgICBjb25zdCB1bnVzZWRTb3VyY2VBY3Rpb24gPSBuZXcgY3BhY3Rpb25zLkNvZGVTdGFyQ29ubmVjdGlvbnNTb3VyY2VBY3Rpb24oe1xuICAgICAgYWN0aW9uTmFtZTogJ1VudXNlZEJpdEJ1Y2tldCcsXG4gICAgICBvd25lcjogJ2F3cycsXG4gICAgICByZXBvOiAnYXdzLWNkaycsXG4gICAgICBvdXRwdXQ6IHVudXNlZFNvdXJjZU91dHB1dCxcbiAgICAgIGNvbm5lY3Rpb25Bcm46ICdhcm46YXdzOmNvZGVzdGFyLWNvbm5lY3Rpb25zOnVzLWVhc3QtMToxMjM0NTY3ODkwMTI6Y29ubmVjdGlvbi8xMjM0NTY3OC1hYmNkLTEyYWItMzRjZGVmNTY3OGdoJyxcbiAgICB9KTtcbiAgICBjb25zdCB1bnVzZWRCdWlsZEFjdGlvbiA9IG5ldyBjcGFjdGlvbnMuQ29kZUJ1aWxkQWN0aW9uKHtcbiAgICAgIGFjdGlvbk5hbWU6ICdVbnVzZWRDb2RlQnVpbGQnLFxuICAgICAgcHJvamVjdDogbmV3IGNvZGVidWlsZC5QaXBlbGluZVByb2plY3Qoc3RhY2ssICdVbnVzZWRNeVByb2plY3QnKSxcbiAgICAgIGlucHV0OiB1bnVzZWRTb3VyY2VPdXRwdXQsXG4gICAgICBlbnZpcm9ubWVudFZhcmlhYmxlczoge1xuICAgICAgICBDb21taXRJZDogeyB2YWx1ZTogdW51c2VkU291cmNlQWN0aW9uLnZhcmlhYmxlcy5jb21taXRJZCB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBwaXBlbGluZS5zdGFnZSgnQnVpbGQnKS5hZGRBY3Rpb24odW51c2VkQnVpbGRBY3Rpb24pO1xuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIEFwcC5vZihzdGFjaykhLnN5bnRoKCk7XG4gICAgfSkudG9UaHJvdygvQ2Fubm90IHJlZmVyZW5jZSB2YXJpYWJsZXMgb2YgYWN0aW9uICdVbnVzZWRCaXRCdWNrZXQnLCBhcyB0aGF0IGFjdGlvbiB3YXMgbmV2ZXIgYWRkZWQgdG8gYSBwaXBlbGluZS8pO1xuICB9KTtcblxuICB0ZXN0KCdmYWlsIGlmIHZhcmlhYmxlIGZyb20gdW51c2VkIGFjdGlvbiB3aXRoIGN1c3RvbSBuYW1lc3BhY2UgaXMgcmVmZXJlbmNlZCcsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwKTtcbiAgICBjb25zdCBwaXBlbGluZSA9IGNyZWF0ZUJpdEJ1Y2tldEFuZENvZGVCdWlsZFBpcGVsaW5lKHN0YWNrLCB7XG4gICAgICB2YXJpYWJsZXNOYW1lc3BhY2U6ICdrb3JuaWNhbWVpc3RlcicsXG4gICAgfSk7XG4gICAgY29uc3QgdW51c2VkU291cmNlT3V0cHV0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpO1xuICAgIGNvbnN0IHVudXNlZFNvdXJjZUFjdGlvbiA9IG5ldyBjcGFjdGlvbnMuQ29kZVN0YXJDb25uZWN0aW9uc1NvdXJjZUFjdGlvbih7XG4gICAgICBhY3Rpb25OYW1lOiAnVW51c2VkQml0QnVja2V0JyxcbiAgICAgIG93bmVyOiAnYXdzJyxcbiAgICAgIHJlcG86ICdhd3MtY2RrJyxcbiAgICAgIG91dHB1dDogdW51c2VkU291cmNlT3V0cHV0LFxuICAgICAgY29ubmVjdGlvbkFybjogJ2Fybjphd3M6Y29kZXN0YXItY29ubmVjdGlvbnM6dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjpjb25uZWN0aW9uLzEyMzQ1Njc4LWFiY2QtMTJhYi0zNGNkZWY1Njc4Z2gnLFxuICAgICAgdmFyaWFibGVzTmFtZXNwYWNlOiAna29ybmljYW1laXN0ZXInLFxuICAgIH0pO1xuICAgIGNvbnN0IHVudXNlZEJ1aWxkQWN0aW9uID0gbmV3IGNwYWN0aW9ucy5Db2RlQnVpbGRBY3Rpb24oe1xuICAgICAgYWN0aW9uTmFtZTogJ1VudXNlZENvZGVCdWlsZCcsXG4gICAgICBwcm9qZWN0OiBuZXcgY29kZWJ1aWxkLlBpcGVsaW5lUHJvamVjdChzdGFjaywgJ1VudXNlZFByb2plY3QnKSxcbiAgICAgIGlucHV0OiB1bnVzZWRTb3VyY2VPdXRwdXQsXG4gICAgICBlbnZpcm9ubWVudFZhcmlhYmxlczoge1xuICAgICAgICBDb21taXRJZDogeyB2YWx1ZTogdW51c2VkU291cmNlQWN0aW9uLnZhcmlhYmxlcy5jb21taXRJZCB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBwaXBlbGluZS5zdGFnZSgnQnVpbGQnKS5hZGRBY3Rpb24odW51c2VkQnVpbGRBY3Rpb24pO1xuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIEFwcC5vZihzdGFjaykhLnN5bnRoKCk7XG4gICAgfSkudG9UaHJvdygvQ2Fubm90IHJlZmVyZW5jZSB2YXJpYWJsZXMgb2YgYWN0aW9uICdVbnVzZWRCaXRCdWNrZXQnLCBhcyB0aGF0IGFjdGlvbiB3YXMgbmV2ZXIgYWRkZWQgdG8gYSBwaXBlbGluZS8pO1xuICB9KTtcbn0pO1xuXG5mdW5jdGlvbiBjcmVhdGVCaXRCdWNrZXRBbmRDb2RlQnVpbGRQaXBlbGluZShcbiAgc3RhY2s6IFN0YWNrLCBwcm9wczogUGFydGlhbDxjcGFjdGlvbnMuQ29kZVN0YXJDb25uZWN0aW9uc1NvdXJjZUFjdGlvblByb3BzPiA9IHt9LFxuKTogY29kZXBpcGVsaW5lLlBpcGVsaW5lIHtcbiAgY29uc3Qgc291cmNlT3V0cHV0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpO1xuICBjb25zdCBzb3VyY2VBY3Rpb24gPSBuZXcgY3BhY3Rpb25zLkNvZGVTdGFyQ29ubmVjdGlvbnNTb3VyY2VBY3Rpb24oe1xuICAgIGFjdGlvbk5hbWU6ICdCaXRCdWNrZXQnLFxuICAgIG93bmVyOiAnYXdzJyxcbiAgICByZXBvOiAnYXdzLWNkaycsXG4gICAgb3V0cHV0OiBzb3VyY2VPdXRwdXQsXG4gICAgY29ubmVjdGlvbkFybjogJ2Fybjphd3M6Y29kZXN0YXItY29ubmVjdGlvbnM6dXMtZWFzdC0xOjEyMzQ1Njc4OTAxMjpjb25uZWN0aW9uLzEyMzQ1Njc4LWFiY2QtMTJhYi0zNGNkZWY1Njc4Z2gnLFxuICAgIC4uLnByb3BzLFxuICB9KTtcblxuICByZXR1cm4gbmV3IGNvZGVwaXBlbGluZS5QaXBlbGluZShzdGFjaywgJ1BpcGVsaW5lJywge1xuICAgIHN0YWdlczogW1xuICAgICAge1xuICAgICAgICBzdGFnZU5hbWU6ICdTb3VyY2UnLFxuICAgICAgICBhY3Rpb25zOiBbc291cmNlQWN0aW9uXSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHN0YWdlTmFtZTogJ0J1aWxkJyxcbiAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgIG5ldyBjcGFjdGlvbnMuQ29kZUJ1aWxkQWN0aW9uKHtcbiAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdDb2RlQnVpbGQnLFxuICAgICAgICAgICAgcHJvamVjdDogbmV3IGNvZGVidWlsZC5QaXBlbGluZVByb2plY3Qoc3RhY2ssICdNeVByb2plY3QnKSxcbiAgICAgICAgICAgIGlucHV0OiBzb3VyY2VPdXRwdXQsXG4gICAgICAgICAgICBvdXRwdXRzOiBbbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpXSxcbiAgICAgICAgICAgIGVudmlyb25tZW50VmFyaWFibGVzOiB7XG4gICAgICAgICAgICAgIENvbW1pdElkOiB7IHZhbHVlOiBzb3VyY2VBY3Rpb24udmFyaWFibGVzLmNvbW1pdElkIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICBdLFxuICB9KTtcbn1cbiJdfQ==