"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const cdk = require("@aws-cdk/core");
const codepipeline = require("../lib");
const fake_build_action_1 = require("./fake-build-action");
const fake_source_action_1 = require("./fake-source-action");
/* eslint-disable quote-props */
describe('variables', () => {
    describe('Pipeline Variables', () => {
        test('uses the passed namespace when its passed when constructing the Action', () => {
            const stack = new cdk.Stack();
            const sourceArtifact = new codepipeline.Artifact();
            const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
                stages: [
                    {
                        stageName: 'Source',
                        actions: [new fake_source_action_1.FakeSourceAction({
                                actionName: 'Source',
                                output: sourceArtifact,
                                variablesNamespace: 'MyNamespace',
                            })],
                    },
                ],
            });
            // -- stages and actions here are needed to satisfy validation rules
            const first = pipeline.addStage({ stageName: 'FirstStage' });
            first.addAction(new fake_build_action_1.FakeBuildAction({
                actionName: 'dummyAction',
                input: sourceArtifact,
            }));
            const second = pipeline.addStage({ stageName: 'SecondStage' });
            second.addAction(new fake_build_action_1.FakeBuildAction({
                actionName: 'dummyAction',
                input: sourceArtifact,
            }));
            // --
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
                'Stages': assertions_1.Match.arrayWith([
                    {
                        'Name': 'Source',
                        'Actions': [
                            assertions_1.Match.objectLike({
                                'Name': 'Source',
                                'Namespace': 'MyNamespace',
                            }),
                        ],
                    },
                ]),
            });
        });
        test('allows using the variable in the configuration of a different action', () => {
            const stack = new cdk.Stack();
            const sourceOutput = new codepipeline.Artifact();
            const fakeSourceAction = new fake_source_action_1.FakeSourceAction({
                actionName: 'Source',
                output: sourceOutput,
                variablesNamespace: 'SourceVariables',
            });
            new codepipeline.Pipeline(stack, 'Pipeline', {
                stages: [
                    {
                        stageName: 'Source',
                        actions: [fakeSourceAction],
                    },
                    {
                        stageName: 'Build',
                        actions: [new fake_build_action_1.FakeBuildAction({
                                actionName: 'Build',
                                input: sourceOutput,
                                customConfigKey: fakeSourceAction.variables.firstVariable,
                            })],
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
                                    'CustomConfigKey': '#{SourceVariables.FirstVariable}',
                                },
                            },
                        ],
                    },
                ],
            });
        });
        test('fails when trying add an action using variables with an empty string for the namespace to a pipeline', () => {
            const stack = new cdk.Stack();
            const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');
            const sourceStage = pipeline.addStage({ stageName: 'Source' });
            const sourceAction = new fake_source_action_1.FakeSourceAction({
                actionName: 'Source',
                output: new codepipeline.Artifact(),
                variablesNamespace: '',
            });
            expect(() => {
                sourceStage.addAction(sourceAction);
            }).toThrow(/Namespace name must match regular expression:/);
        });
        test('can use global variables', () => {
            const stack = new cdk.Stack();
            const sourceArtifact = new codepipeline.Artifact();
            new codepipeline.Pipeline(stack, 'Pipeline', {
                stages: [
                    {
                        stageName: 'Source',
                        actions: [new fake_source_action_1.FakeSourceAction({
                                actionName: 'Source',
                                output: sourceArtifact,
                            })],
                    },
                    {
                        stageName: 'Build',
                        actions: [new fake_build_action_1.FakeBuildAction({
                                actionName: 'Build',
                                input: sourceArtifact,
                                customConfigKey: codepipeline.GlobalVariables.executionId,
                            })],
                    },
                ],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
                'Stages': assertions_1.Match.arrayWith([
                    {
                        'Name': 'Build',
                        'Actions': [
                            assertions_1.Match.objectLike({
                                'Name': 'Build',
                                'Configuration': {
                                    'CustomConfigKey': '#{codepipeline.PipelineExecutionId}',
                                },
                            }),
                        ],
                    },
                ]),
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFyaWFibGVzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ2YXJpYWJsZXMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUFzRDtBQUN0RCxxQ0FBcUM7QUFDckMsdUNBQXVDO0FBQ3ZDLDJEQUFzRDtBQUN0RCw2REFBd0Q7QUFFeEQsZ0NBQWdDO0FBRWhDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFO0lBQ3pCLFFBQVEsQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLEVBQUU7UUFDbEMsSUFBSSxDQUFDLHdFQUF3RSxFQUFFLEdBQUcsRUFBRTtZQUNsRixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUM5QixNQUFNLGNBQWMsR0FBRyxJQUFJLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNuRCxNQUFNLFFBQVEsR0FBRyxJQUFJLFlBQVksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRTtnQkFDNUQsTUFBTSxFQUFFO29CQUNOO3dCQUNFLFNBQVMsRUFBRSxRQUFRO3dCQUNuQixPQUFPLEVBQUUsQ0FBQyxJQUFJLHFDQUFnQixDQUFDO2dDQUM3QixVQUFVLEVBQUUsUUFBUTtnQ0FDcEIsTUFBTSxFQUFFLGNBQWM7Z0NBQ3RCLGtCQUFrQixFQUFFLGFBQWE7NkJBQ2xDLENBQUMsQ0FBQztxQkFDSjtpQkFDRjthQUNGLENBQUMsQ0FBQztZQUVILG9FQUFvRTtZQUNwRSxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxDQUFDLENBQUM7WUFDN0QsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLG1DQUFlLENBQUM7Z0JBQ2xDLFVBQVUsRUFBRSxhQUFhO2dCQUN6QixLQUFLLEVBQUUsY0FBYzthQUN0QixDQUFDLENBQUMsQ0FBQztZQUNKLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMs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QUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1hdGNoLCBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lIGZyb20gJy4uL2xpYic7XG5pbXBvcnQgeyBGYWtlQnVpbGRBY3Rpb24gfSBmcm9tICcuL2Zha2UtYnVpbGQtYWN0aW9uJztcbmltcG9ydCB7IEZha2VTb3VyY2VBY3Rpb24gfSBmcm9tICcuL2Zha2Utc291cmNlLWFjdGlvbic7XG5cbi8qIGVzbGludC1kaXNhYmxlIHF1b3RlLXByb3BzICovXG5cbmRlc2NyaWJlKCd2YXJpYWJsZXMnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdQaXBlbGluZSBWYXJpYWJsZXMnLCAoKSA9PiB7XG4gICAgdGVzdCgndXNlcyB0aGUgcGFzc2VkIG5hbWVzcGFjZSB3aGVuIGl0cyBwYXNzZWQgd2hlbiBjb25zdHJ1Y3RpbmcgdGhlIEFjdGlvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3Qgc291cmNlQXJ0aWZhY3QgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCk7XG4gICAgICBjb25zdCBwaXBlbGluZSA9IG5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUoc3RhY2ssICdQaXBlbGluZScsIHtcbiAgICAgICAgc3RhZ2VzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3RhZ2VOYW1lOiAnU291cmNlJyxcbiAgICAgICAgICAgIGFjdGlvbnM6IFtuZXcgRmFrZVNvdXJjZUFjdGlvbih7XG4gICAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdTb3VyY2UnLFxuICAgICAgICAgICAgICBvdXRwdXQ6IHNvdXJjZUFydGlmYWN0LFxuICAgICAgICAgICAgICB2YXJpYWJsZXNOYW1lc3BhY2U6ICdNeU5hbWVzcGFjZScsXG4gICAgICAgICAgICB9KV0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyAtLSBzdGFnZXMgYW5kIGFjdGlvbnMgaGVyZSBhcmUgbmVlZGVkIHRvIHNhdGlzZnkgdmFsaWRhdGlvbiBydWxlc1xuICAgICAgY29uc3QgZmlyc3QgPSBwaXBlbGluZS5hZGRTdGFnZSh7IHN0YWdlTmFtZTogJ0ZpcnN0U3RhZ2UnIH0pO1xuICAgICAgZmlyc3QuYWRkQWN0aW9uKG5ldyBGYWtlQnVpbGRBY3Rpb24oe1xuICAgICAgICBhY3Rpb25OYW1lOiAnZHVtbXlBY3Rpb24nLFxuICAgICAgICBpbnB1dDogc291cmNlQXJ0aWZhY3QsXG4gICAgICB9KSk7XG4gICAgICBjb25zdCBzZWNvbmQgPSBwaXBlbGluZS5hZGRTdGFnZSh7IHN0YWdlTmFtZTogJ1NlY29uZFN0YWdlJyB9KTtcbiAgICAgIHNlY29uZC5hZGRBY3Rpb24obmV3IEZha2VCdWlsZEFjdGlvbih7XG4gICAgICAgIGFjdGlvbk5hbWU6ICdkdW1teUFjdGlvbicsXG4gICAgICAgIGlucHV0OiBzb3VyY2VBcnRpZmFjdCxcbiAgICAgIH0pKTtcbiAgICAgIC8vIC0tXG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVQaXBlbGluZTo6UGlwZWxpbmUnLCB7XG4gICAgICAgICdTdGFnZXMnOiBNYXRjaC5hcnJheVdpdGgoW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgICdOYW1lJzogJ1NvdXJjZScsXG4gICAgICAgICAgICAnQWN0aW9ucyc6IFtcbiAgICAgICAgICAgICAgTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgICAgICAgJ05hbWUnOiAnU291cmNlJyxcbiAgICAgICAgICAgICAgICAnTmFtZXNwYWNlJzogJ015TmFtZXNwYWNlJyxcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0pLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhbGxvd3MgdXNpbmcgdGhlIHZhcmlhYmxlIGluIHRoZSBjb25maWd1cmF0aW9uIG9mIGEgZGlmZmVyZW50IGFjdGlvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3Qgc291cmNlT3V0cHV0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpO1xuICAgICAgY29uc3QgZmFrZVNvdXJjZUFjdGlvbiA9IG5ldyBGYWtlU291cmNlQWN0aW9uKHtcbiAgICAgICAgYWN0aW9uTmFtZTogJ1NvdXJjZScsXG4gICAgICAgIG91dHB1dDogc291cmNlT3V0cHV0LFxuICAgICAgICB2YXJpYWJsZXNOYW1lc3BhY2U6ICdTb3VyY2VWYXJpYWJsZXMnLFxuICAgICAgfSk7XG4gICAgICBuZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHN0YWNrLCAnUGlwZWxpbmUnLCB7XG4gICAgICAgIHN0YWdlczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN0YWdlTmFtZTogJ1NvdXJjZScsXG4gICAgICAgICAgICBhY3Rpb25zOiBbZmFrZVNvdXJjZUFjdGlvbl0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdGFnZU5hbWU6ICdCdWlsZCcsXG4gICAgICAgICAgICBhY3Rpb25zOiBbbmV3IEZha2VCdWlsZEFjdGlvbih7XG4gICAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdCdWlsZCcsXG4gICAgICAgICAgICAgIGlucHV0OiBzb3VyY2VPdXRwdXQsXG4gICAgICAgICAgICAgIGN1c3RvbUNvbmZpZ0tleTogZmFrZVNvdXJjZUFjdGlvbi52YXJpYWJsZXMuZmlyc3RWYXJpYWJsZSxcbiAgICAgICAgICAgIH0pXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVQaXBlbGluZTo6UGlwZWxpbmUnLCB7XG4gICAgICAgICdTdGFnZXMnOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ05hbWUnOiAnU291cmNlJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgICdOYW1lJzogJ0J1aWxkJyxcbiAgICAgICAgICAgICdBY3Rpb25zJzogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ05hbWUnOiAnQnVpbGQnLFxuICAgICAgICAgICAgICAgICdDb25maWd1cmF0aW9uJzoge1xuICAgICAgICAgICAgICAgICAgJ0N1c3RvbUNvbmZpZ0tleSc6ICcje1NvdXJjZVZhcmlhYmxlcy5GaXJzdFZhcmlhYmxlfScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnZmFpbHMgd2hlbiB0cnlpbmcgYWRkIGFuIGFjdGlvbiB1c2luZyB2YXJpYWJsZXMgd2l0aCBhbiBlbXB0eSBzdHJpbmcgZm9yIHRoZSBuYW1lc3BhY2UgdG8gYSBwaXBlbGluZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgcGlwZWxpbmUgPSBuZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHN0YWNrLCAnUGlwZWxpbmUnKTtcbiAgICAgIGNvbnN0IHNvdXJjZVN0YWdlID0gcGlwZWxpbmUuYWRkU3RhZ2UoeyBzdGFnZU5hbWU6ICdTb3VyY2UnIH0pO1xuXG4gICAgICBjb25zdCBzb3VyY2VBY3Rpb24gPSBuZXcgRmFrZVNvdXJjZUFjdGlvbih7XG4gICAgICAgIGFjdGlvbk5hbWU6ICdTb3VyY2UnLFxuICAgICAgICBvdXRwdXQ6IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoKSxcbiAgICAgICAgdmFyaWFibGVzTmFtZXNwYWNlOiAnJyxcbiAgICAgIH0pO1xuXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBzb3VyY2VTdGFnZS5hZGRBY3Rpb24oc291cmNlQWN0aW9uKTtcbiAgICAgIH0pLnRvVGhyb3coL05hbWVzcGFjZSBuYW1lIG11c3QgbWF0Y2ggcmVndWxhciBleHByZXNzaW9uOi8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY2FuIHVzZSBnbG9iYWwgdmFyaWFibGVzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAgIGNvbnN0IHNvdXJjZUFydGlmYWN0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpO1xuICAgICAgbmV3IGNvZGVwaXBlbGluZS5QaXBlbGluZShzdGFjaywgJ1BpcGVsaW5lJywge1xuICAgICAgICBzdGFnZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdGFnZU5hbWU6ICdTb3VyY2UnLFxuICAgICAgICAgICAgYWN0aW9uczogW25ldyBGYWtlU291cmNlQWN0aW9uKHtcbiAgICAgICAgICAgICAgYWN0aW9uTmFtZTogJ1NvdXJjZScsXG4gICAgICAgICAgICAgIG91dHB1dDogc291cmNlQXJ0aWZhY3QsXG4gICAgICAgICAgICB9KV0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdGFnZU5hbWU6ICdCdWlsZCcsXG4gICAgICAgICAgICBhY3Rpb25zOiBbbmV3IEZha2VCdWlsZEFjdGlvbih7XG4gICAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdCdWlsZCcsXG4gICAgICAgICAgICAgIGlucHV0OiBzb3VyY2VBcnRpZmFjdCxcbiAgICAgICAgICAgICAgY3VzdG9tQ29uZmlnS2V5OiBjb2RlcGlwZWxpbmUuR2xvYmFsVmFyaWFibGVzLmV4ZWN1dGlvbklkLFxuICAgICAgICAgICAgfSldLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZVBpcGVsaW5lOjpQaXBlbGluZScsIHtcbiAgICAgICAgJ1N0YWdlcyc6IE1hdGNoLmFycmF5V2l0aChbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ05hbWUnOiAnQnVpbGQnLFxuICAgICAgICAgICAgJ0FjdGlvbnMnOiBbXG4gICAgICAgICAgICAgIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgICAgICAgICdOYW1lJzogJ0J1aWxkJyxcbiAgICAgICAgICAgICAgICAnQ29uZmlndXJhdGlvbic6IHtcbiAgICAgICAgICAgICAgICAgICdDdXN0b21Db25maWdLZXknOiAnI3tjb2RlcGlwZWxpbmUuUGlwZWxpbmVFeGVjdXRpb25JZH0nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdKSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19