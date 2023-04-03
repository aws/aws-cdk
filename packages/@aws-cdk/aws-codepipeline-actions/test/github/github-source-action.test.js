"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const codebuild = require("@aws-cdk/aws-codebuild");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const core_1 = require("@aws-cdk/core");
const cpactions = require("../../lib");
/* eslint-disable quote-props */
describe('Github source action', () => {
    describe('GitHub source Action', () => {
        test('exposes variables for other actions to consume', () => {
            const stack = new core_1.Stack();
            const sourceOutput = new codepipeline.Artifact();
            const gitHubSourceAction = new cpactions.GitHubSourceAction({
                actionName: 'Source',
                owner: 'aws',
                repo: 'aws-cdk',
                output: sourceOutput,
                oauthToken: core_1.SecretValue.unsafePlainText('secret'),
            });
            new codepipeline.Pipeline(stack, 'Pipeline', {
                stages: [
                    {
                        stageName: 'Source',
                        actions: [gitHubSourceAction],
                    },
                    {
                        stageName: 'Build',
                        actions: [
                            new cpactions.CodeBuildAction({
                                actionName: 'Build',
                                project: new codebuild.PipelineProject(stack, 'MyProject'),
                                input: sourceOutput,
                                environmentVariables: {
                                    CommitUrl: { value: gitHubSourceAction.variables.commitUrl },
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
                                    'EnvironmentVariables': '[{"name":"CommitUrl","type":"PLAINTEXT","value":"#{Source_Source_NS.CommitUrl}"}]',
                                },
                            },
                        ],
                    },
                ],
            });
        });
        test('always renders the customer-supplied namespace, even if none of the variables are used', () => {
            const stack = new core_1.Stack();
            const sourceOutput = new codepipeline.Artifact();
            new codepipeline.Pipeline(stack, 'Pipeline', {
                stages: [
                    {
                        stageName: 'Source',
                        actions: [
                            new cpactions.GitHubSourceAction({
                                actionName: 'Source',
                                owner: 'aws',
                                repo: 'aws-cdk',
                                output: sourceOutput,
                                oauthToken: core_1.SecretValue.unsafePlainText('secret'),
                                variablesNamespace: 'MyNamespace',
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
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
                'Stages': [
                    {
                        'Name': 'Source',
                        'Actions': [
                            {
                                'Name': 'Source',
                                'Namespace': 'MyNamespace',
                            },
                        ],
                    },
                    {},
                ],
            });
        });
        test('fails if a variable from an action without a namespace set that is not part of a pipeline is referenced', () => {
            const app = new core_1.App();
            const stack = new core_1.Stack(app);
            const unusedSourceAction = new cpactions.GitHubSourceAction({
                actionName: 'Source2',
                owner: 'aws',
                repo: 'aws-cdk',
                output: new codepipeline.Artifact(),
                oauthToken: core_1.SecretValue.unsafePlainText('secret'),
            });
            const sourceOutput = new codepipeline.Artifact();
            new codepipeline.Pipeline(stack, 'Pipeline', {
                stages: [
                    {
                        stageName: 'Source',
                        actions: [new cpactions.GitHubSourceAction({
                                actionName: 'Source1',
                                owner: 'aws',
                                repo: 'aws-cdk',
                                output: sourceOutput,
                                oauthToken: core_1.SecretValue.unsafePlainText('secret'),
                            })],
                    },
                    {
                        stageName: 'Build',
                        actions: [
                            new cpactions.CodeBuildAction({
                                actionName: 'Build',
                                project: new codebuild.PipelineProject(stack, 'MyProject'),
                                input: sourceOutput,
                                environmentVariables: {
                                    'VAR1': { value: unusedSourceAction.variables.authorDate },
                                },
                            }),
                        ],
                    },
                ],
            });
            expect(() => {
                core_1.App.of(stack).synth();
            }).toThrow(/Cannot reference variables of action 'Source2', as that action was never added to a pipeline/);
        });
        test('fails if a variable from an action with a namespace set that is not part of a pipeline is referenced', () => {
            const app = new core_1.App();
            const stack = new core_1.Stack(app);
            const unusedSourceAction = new cpactions.GitHubSourceAction({
                actionName: 'Source2',
                owner: 'aws',
                repo: 'aws-cdk',
                output: new codepipeline.Artifact(),
                oauthToken: core_1.SecretValue.unsafePlainText('secret'),
                variablesNamespace: 'MyNamespace',
            });
            const sourceOutput = new codepipeline.Artifact();
            new codepipeline.Pipeline(stack, 'Pipeline', {
                stages: [
                    {
                        stageName: 'Source',
                        actions: [new cpactions.GitHubSourceAction({
                                actionName: 'Source1',
                                owner: 'aws',
                                repo: 'aws-cdk',
                                output: sourceOutput,
                                oauthToken: core_1.SecretValue.unsafePlainText('secret'),
                            })],
                    },
                    {
                        stageName: 'Build',
                        actions: [
                            new cpactions.CodeBuildAction({
                                actionName: 'Build',
                                project: new codebuild.PipelineProject(stack, 'MyProject'),
                                input: sourceOutput,
                                environmentVariables: {
                                    'VAR1': { value: unusedSourceAction.variables.authorDate },
                                },
                            }),
                        ],
                    },
                ],
            });
            expect(() => {
                core_1.App.of(stack).synth();
            }).toThrow(/Cannot reference variables of action 'Source2', as that action was never added to a pipeline/);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0aHViLXNvdXJjZS1hY3Rpb24udGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdpdGh1Yi1zb3VyY2UtYWN0aW9uLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBK0M7QUFDL0Msb0RBQW9EO0FBQ3BELDBEQUEwRDtBQUMxRCx3Q0FBd0Q7QUFDeEQsdUNBQXVDO0FBRXZDLGdDQUFnQztBQUVoQyxRQUFRLENBQUMsc0JBQXNCLEVBQUUsR0FBRyxFQUFFO0lBQ3BDLFFBQVEsQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLEVBQUU7UUFDcEMsSUFBSSxDQUFDLGdEQUFnRCxFQUFFLEdBQUcsRUFBRTtZQUMxRCxNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1lBRTFCLE1BQU0sWUFBWSxHQUFHLElBQUksWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2pELE1BQU0sa0JBQWtCLEdBQUcsSUFBSSxTQUFTLENBQUMsa0JBQWtCLENBQUM7Z0JBQzFELFVBQVUsRUFBRSxRQUFRO2dCQUNwQixLQUFLLEVBQUUsS0FBSztnQkFDWixJQUFJLEVBQUUsU0FBUztnQkFDZixNQUFNLEVBQUUsWUFBWTtnQkFDcEIsVUFBVSxFQUFFLGtCQUFXLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQzthQUNsRCxDQUFDLENBQUM7WUFDSCxJQUFJLFlBQVksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRTtnQkFDM0MsTUFBTSxFQUFFO29CQUNOO3dCQUNFLFNBQVMsRUFBRSxRQUFRO3dCQUNuQixPQUFPLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQztxQkFDOUI7b0JBQ0Q7d0JBQ0UsU0FBUyxFQUFFLE9BQU87d0JBQ2xCLE9BQU8sRUFBRTs0QkFDUCxJQUFJLFNBQVMsQ0FBQyxlQUFlLENBQUM7Z0NBQzVCLFVBQVUsRUFBRSxPQUFPO2dDQUNuQixPQUFPLEVBQUUsSUFBSSxTQUFTLENBQUMsZUFBZSxDQUFDLEtBQUssRUFB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QU0sQ0FBQyxHQUFHLEVBQUU7Z0JBQ1YsVUFBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUN6QixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsOEZBQThGLENBQUMsQ0FBQztRQUc3RyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgY29kZWJ1aWxkIGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlYnVpbGQnO1xuaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lIGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlcGlwZWxpbmUnO1xuaW1wb3J0IHsgQXBwLCBTZWNyZXRWYWx1ZSwgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGNwYWN0aW9ucyBmcm9tICcuLi8uLi9saWInO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBxdW90ZS1wcm9wcyAqL1xuXG5kZXNjcmliZSgnR2l0aHViIHNvdXJjZSBhY3Rpb24nLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdHaXRIdWIgc291cmNlIEFjdGlvbicsICgpID0+IHtcbiAgICB0ZXN0KCdleHBvc2VzIHZhcmlhYmxlcyBmb3Igb3RoZXIgYWN0aW9ucyB0byBjb25zdW1lJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgICAgY29uc3Qgc291cmNlT3V0cHV0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpO1xuICAgICAgY29uc3QgZ2l0SHViU291cmNlQWN0aW9uID0gbmV3IGNwYWN0aW9ucy5HaXRIdWJTb3VyY2VBY3Rpb24oe1xuICAgICAgICBhY3Rpb25OYW1lOiAnU291cmNlJyxcbiAgICAgICAgb3duZXI6ICdhd3MnLFxuICAgICAgICByZXBvOiAnYXdzLWNkaycsXG4gICAgICAgIG91dHB1dDogc291cmNlT3V0cHV0LFxuICAgICAgICBvYXV0aFRva2VuOiBTZWNyZXRWYWx1ZS51bnNhZmVQbGFpblRleHQoJ3NlY3JldCcpLFxuICAgICAgfSk7XG4gICAgICBuZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHN0YWNrLCAnUGlwZWxpbmUnLCB7XG4gICAgICAgIHN0YWdlczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN0YWdlTmFtZTogJ1NvdXJjZScsXG4gICAgICAgICAgICBhY3Rpb25zOiBbZ2l0SHViU291cmNlQWN0aW9uXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN0YWdlTmFtZTogJ0J1aWxkJyxcbiAgICAgICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAgICAgbmV3IGNwYWN0aW9ucy5Db2RlQnVpbGRBY3Rpb24oe1xuICAgICAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdCdWlsZCcsXG4gICAgICAgICAgICAgICAgcHJvamVjdDogbmV3IGNvZGVidWlsZC5QaXBlbGluZVByb2plY3Qoc3RhY2ssICdNeVByb2plY3QnKSxcbiAgICAgICAgICAgICAgICBpbnB1dDogc291cmNlT3V0cHV0LFxuICAgICAgICAgICAgICAgIGVudmlyb25tZW50VmFyaWFibGVzOiB7XG4gICAgICAgICAgICAgICAgICBDb21taXRVcmw6IHsgdmFsdWU6IGdpdEh1YlNvdXJjZUFjdGlvbi52YXJpYWJsZXMuY29tbWl0VXJsIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZVBpcGVsaW5lOjpQaXBlbGluZScsIHtcbiAgICAgICAgJ1N0YWdlcyc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnTmFtZSc6ICdTb3VyY2UnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ05hbWUnOiAnQnVpbGQnLFxuICAgICAgICAgICAgJ0FjdGlvbnMnOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnTmFtZSc6ICdCdWlsZCcsXG4gICAgICAgICAgICAgICAgJ0NvbmZpZ3VyYXRpb24nOiB7XG4gICAgICAgICAgICAgICAgICAnRW52aXJvbm1lbnRWYXJpYWJsZXMnOiAnW3tcIm5hbWVcIjpcIkNvbW1pdFVybFwiLFwidHlwZVwiOlwiUExBSU5URVhUXCIsXCJ2YWx1ZVwiOlwiI3tTb3VyY2VfU291cmNlX05TLkNvbW1pdFVybH1cIn1dJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnYWx3YXlzIHJlbmRlcnMgdGhlIGN1c3RvbWVyLXN1cHBsaWVkIG5hbWVzcGFjZSwgZXZlbiBpZiBub25lIG9mIHRoZSB2YXJpYWJsZXMgYXJlIHVzZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgICBjb25zdCBzb3VyY2VPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCk7XG4gICAgICBuZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHN0YWNrLCAnUGlwZWxpbmUnLCB7XG4gICAgICAgIHN0YWdlczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN0YWdlTmFtZTogJ1NvdXJjZScsXG4gICAgICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgICAgIG5ldyBjcGFjdGlvbnMuR2l0SHViU291cmNlQWN0aW9uKHtcbiAgICAgICAgICAgICAgICBhY3Rpb25OYW1lOiAnU291cmNlJyxcbiAgICAgICAgICAgICAgICBvd25lcjogJ2F3cycsXG4gICAgICAgICAgICAgICAgcmVwbzogJ2F3cy1jZGsnLFxuICAgICAgICAgICAgICAgIG91dHB1dDogc291cmNlT3V0cHV0LFxuICAgICAgICAgICAgICAgIG9hdXRoVG9rZW46IFNlY3JldFZhbHVlLnVuc2FmZVBsYWluVGV4dCgnc2VjcmV0JyksXG4gICAgICAgICAgICAgICAgdmFyaWFibGVzTmFtZXNwYWNlOiAnTXlOYW1lc3BhY2UnLFxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdGFnZU5hbWU6ICdCdWlsZCcsXG4gICAgICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgICAgIG5ldyBjcGFjdGlvbnMuQ29kZUJ1aWxkQWN0aW9uKHtcbiAgICAgICAgICAgICAgICBhY3Rpb25OYW1lOiAnQnVpbGQnLFxuICAgICAgICAgICAgICAgIHByb2plY3Q6IG5ldyBjb2RlYnVpbGQuUGlwZWxpbmVQcm9qZWN0KHN0YWNrLCAnTXlQcm9qZWN0JyksXG4gICAgICAgICAgICAgICAgaW5wdXQ6IHNvdXJjZU91dHB1dCxcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZVBpcGVsaW5lOjpQaXBlbGluZScsIHtcbiAgICAgICAgJ1N0YWdlcyc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnTmFtZSc6ICdTb3VyY2UnLFxuICAgICAgICAgICAgJ0FjdGlvbnMnOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnTmFtZSc6ICdTb3VyY2UnLFxuICAgICAgICAgICAgICAgICdOYW1lc3BhY2UnOiAnTXlOYW1lc3BhY2UnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnZmFpbHMgaWYgYSB2YXJpYWJsZSBmcm9tIGFuIGFjdGlvbiB3aXRob3V0IGEgbmFtZXNwYWNlIHNldCB0aGF0IGlzIG5vdCBwYXJ0IG9mIGEgcGlwZWxpbmUgaXMgcmVmZXJlbmNlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCk7XG5cbiAgICAgIGNvbnN0IHVudXNlZFNvdXJjZUFjdGlvbiA9IG5ldyBjcGFjdGlvbnMuR2l0SHViU291cmNlQWN0aW9uKHtcbiAgICAgICAgYWN0aW9uTmFtZTogJ1NvdXJjZTInLFxuICAgICAgICBvd25lcjogJ2F3cycsXG4gICAgICAgIHJlcG86ICdhd3MtY2RrJyxcbiAgICAgICAgb3V0cHV0OiBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCksXG4gICAgICAgIG9hdXRoVG9rZW46IFNlY3JldFZhbHVlLnVuc2FmZVBsYWluVGV4dCgnc2VjcmV0JyksXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHNvdXJjZU91dHB1dCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoKTtcbiAgICAgIG5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUoc3RhY2ssICdQaXBlbGluZScsIHtcbiAgICAgICAgc3RhZ2VzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3RhZ2VOYW1lOiAnU291cmNlJyxcbiAgICAgICAgICAgIGFjdGlvbnM6IFtuZXcgY3BhY3Rpb25zLkdpdEh1YlNvdXJjZUFjdGlvbih7XG4gICAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdTb3VyY2UxJyxcbiAgICAgICAgICAgICAgb3duZXI6ICdhd3MnLFxuICAgICAgICAgICAgICByZXBvOiAnYXdzLWNkaycsXG4gICAgICAgICAgICAgIG91dHB1dDogc291cmNlT3V0cHV0LFxuICAgICAgICAgICAgICBvYXV0aFRva2VuOiBTZWNyZXRWYWx1ZS51bnNhZmVQbGFpblRleHQoJ3NlY3JldCcpLFxuICAgICAgICAgICAgfSldLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3RhZ2VOYW1lOiAnQnVpbGQnLFxuICAgICAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgICAgICBuZXcgY3BhY3Rpb25zLkNvZGVCdWlsZEFjdGlvbih7XG4gICAgICAgICAgICAgICAgYWN0aW9uTmFtZTogJ0J1aWxkJyxcbiAgICAgICAgICAgICAgICBwcm9qZWN0OiBuZXcgY29kZWJ1aWxkLlBpcGVsaW5lUHJvamVjdChzdGFjaywgJ015UHJvamVjdCcpLFxuICAgICAgICAgICAgICAgIGlucHV0OiBzb3VyY2VPdXRwdXQsXG4gICAgICAgICAgICAgICAgZW52aXJvbm1lbnRWYXJpYWJsZXM6IHtcbiAgICAgICAgICAgICAgICAgICdWQVIxJzogeyB2YWx1ZTogdW51c2VkU291cmNlQWN0aW9uLnZhcmlhYmxlcy5hdXRob3JEYXRlIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgQXBwLm9mKHN0YWNrKSEuc3ludGgoKTtcbiAgICAgIH0pLnRvVGhyb3coL0Nhbm5vdCByZWZlcmVuY2UgdmFyaWFibGVzIG9mIGFjdGlvbiAnU291cmNlMicsIGFzIHRoYXQgYWN0aW9uIHdhcyBuZXZlciBhZGRlZCB0byBhIHBpcGVsaW5lLyk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnZmFpbHMgaWYgYSB2YXJpYWJsZSBmcm9tIGFuIGFjdGlvbiB3aXRoIGEgbmFtZXNwYWNlIHNldCB0aGF0IGlzIG5vdCBwYXJ0IG9mIGEgcGlwZWxpbmUgaXMgcmVmZXJlbmNlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCk7XG5cbiAgICAgIGNvbnN0IHVudXNlZFNvdXJjZUFjdGlvbiA9IG5ldyBjcGFjdGlvbnMuR2l0SHViU291cmNlQWN0aW9uKHtcbiAgICAgICAgYWN0aW9uTmFtZTogJ1NvdXJjZTInLFxuICAgICAgICBvd25lcjogJ2F3cycsXG4gICAgICAgIHJlcG86ICdhd3MtY2RrJyxcbiAgICAgICAgb3V0cHV0OiBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCksXG4gICAgICAgIG9hdXRoVG9rZW46IFNlY3JldFZhbHVlLnVuc2FmZVBsYWluVGV4dCgnc2VjcmV0JyksXG4gICAgICAgIHZhcmlhYmxlc05hbWVzcGFjZTogJ015TmFtZXNwYWNlJyxcbiAgICAgIH0pO1xuICAgICAgY29uc3Qgc291cmNlT3V0cHV0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpO1xuICAgICAgbmV3IGNvZGVwaXBlbGluZS5QaXBlbGluZShzdGFjaywgJ1BpcGVsaW5lJywge1xuICAgICAgICBzdGFnZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdGFnZU5hbWU6ICdTb3VyY2UnLFxuICAgICAgICAgICAgYWN0aW9uczogW25ldyBjcGFjdGlvbnMuR2l0SHViU291cmNlQWN0aW9uKHtcbiAgICAgICAgICAgICAgYWN0aW9uTmFtZTogJ1NvdXJjZTEnLFxuICAgICAgICAgICAgICBvd25lcjogJ2F3cycsXG4gICAgICAgICAgICAgIHJlcG86ICdhd3MtY2RrJyxcbiAgICAgICAgICAgICAgb3V0cHV0OiBzb3VyY2VPdXRwdXQsXG4gICAgICAgICAgICAgIG9hdXRoVG9rZW46IFNlY3JldFZhbHVlLnVuc2FmZVBsYWluVGV4dCgnc2VjcmV0JyksXG4gICAgICAgICAgICB9KV0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdGFnZU5hbWU6ICdCdWlsZCcsXG4gICAgICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgICAgIG5ldyBjcGFjdGlvbnMuQ29kZUJ1aWxkQWN0aW9uKHtcbiAgICAgICAgICAgICAgICBhY3Rpb25OYW1lOiAnQnVpbGQnLFxuICAgICAgICAgICAgICAgIHByb2plY3Q6IG5ldyBjb2RlYnVpbGQuUGlwZWxpbmVQcm9qZWN0KHN0YWNrLCAnTXlQcm9qZWN0JyksXG4gICAgICAgICAgICAgICAgaW5wdXQ6IHNvdXJjZU91dHB1dCxcbiAgICAgICAgICAgICAgICBlbnZpcm9ubWVudFZhcmlhYmxlczoge1xuICAgICAgICAgICAgICAgICAgJ1ZBUjEnOiB7IHZhbHVlOiB1bnVzZWRTb3VyY2VBY3Rpb24udmFyaWFibGVzLmF1dGhvckRhdGUgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBBcHAub2Yoc3RhY2spIS5zeW50aCgpO1xuICAgICAgfSkudG9UaHJvdygvQ2Fubm90IHJlZmVyZW5jZSB2YXJpYWJsZXMgb2YgYWN0aW9uICdTb3VyY2UyJywgYXMgdGhhdCBhY3Rpb24gd2FzIG5ldmVyIGFkZGVkIHRvIGEgcGlwZWxpbmUvKTtcblxuXG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=