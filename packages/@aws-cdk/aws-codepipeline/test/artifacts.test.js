"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const cdk = require("@aws-cdk/core");
const codepipeline = require("../lib");
const fake_build_action_1 = require("./fake-build-action");
const fake_source_action_1 = require("./fake-source-action");
/* eslint-disable quote-props */
describe('artifacts', () => {
    describe('Artifacts in CodePipeline', () => {
        test('cannot be created with an empty name', () => {
            expect(() => new codepipeline.Artifact('')).toThrow(/Artifact name must match regular expression/);
        });
        test('without a name, when used as an input without being used as an output first - should fail validation', () => {
            const stack = new cdk.Stack();
            const sourceOutput = new codepipeline.Artifact();
            new codepipeline.Pipeline(stack, 'Pipeline', {
                stages: [
                    {
                        stageName: 'Source',
                        actions: [
                            new fake_source_action_1.FakeSourceAction({
                                actionName: 'Source',
                                output: sourceOutput,
                            }),
                        ],
                    },
                    {
                        stageName: 'Build',
                        actions: [
                            new fake_build_action_1.FakeBuildAction({
                                actionName: 'Build',
                                input: new codepipeline.Artifact(),
                            }),
                        ],
                    },
                ],
            });
            const errors = validate(stack);
            expect(errors.length).toEqual(1);
            const error = errors[0];
            expect(error).toMatch(/Action 'Build' is using an unnamed input Artifact, which is not being produced in this pipeline/);
        });
        test('with a name, when used as an input without being used as an output first - should fail validation', () => {
            const stack = new cdk.Stack();
            const sourceOutput = new codepipeline.Artifact();
            new codepipeline.Pipeline(stack, 'Pipeline', {
                stages: [
                    {
                        stageName: 'Source',
                        actions: [
                            new fake_source_action_1.FakeSourceAction({
                                actionName: 'Source',
                                output: sourceOutput,
                            }),
                        ],
                    },
                    {
                        stageName: 'Build',
                        actions: [
                            new fake_build_action_1.FakeBuildAction({
                                actionName: 'Build',
                                input: new codepipeline.Artifact('named'),
                            }),
                        ],
                    },
                ],
            });
            const errors = validate(stack);
            expect(errors.length).toEqual(1);
            const error = errors[0];
            expect(error).toMatch(/Action 'Build' is using input Artifact 'named', which is not being produced in this pipeline/);
        });
        test('without a name, when used as an output multiple times - should fail validation', () => {
            const stack = new cdk.Stack();
            const sourceOutput = new codepipeline.Artifact();
            new codepipeline.Pipeline(stack, 'Pipeline', {
                stages: [
                    {
                        stageName: 'Source',
                        actions: [
                            new fake_source_action_1.FakeSourceAction({
                                actionName: 'Source',
                                output: sourceOutput,
                            }),
                        ],
                    },
                    {
                        stageName: 'Build',
                        actions: [
                            new fake_build_action_1.FakeBuildAction({
                                actionName: 'Build',
                                input: sourceOutput,
                                output: sourceOutput,
                            }),
                        ],
                    },
                ],
            });
            const errors = validate(stack);
            expect(errors.length).toEqual(1);
            const error = errors[0];
            expect(error).toMatch(/Both Actions 'Source' and 'Build' are producting Artifact 'Artifact_Source_Source'. Every artifact can only be produced once./);
        });
        test("an Action's output can be used as input for an Action in the same Stage with a higher runOrder", () => {
            const stack = new cdk.Stack();
            const sourceOutput1 = new codepipeline.Artifact('sourceOutput1');
            const buildOutput1 = new codepipeline.Artifact('buildOutput1');
            const sourceOutput2 = new codepipeline.Artifact('sourceOutput2');
            new codepipeline.Pipeline(stack, 'Pipeline', {
                stages: [
                    {
                        stageName: 'Source',
                        actions: [
                            new fake_source_action_1.FakeSourceAction({
                                actionName: 'source1',
                                output: sourceOutput1,
                            }),
                            new fake_source_action_1.FakeSourceAction({
                                actionName: 'source2',
                                output: sourceOutput2,
                            }),
                        ],
                    },
                    {
                        stageName: 'Build',
                        actions: [
                            new fake_build_action_1.FakeBuildAction({
                                actionName: 'build1',
                                input: sourceOutput1,
                                output: buildOutput1,
                            }),
                            new fake_build_action_1.FakeBuildAction({
                                actionName: 'build2',
                                input: sourceOutput2,
                                extraInputs: [buildOutput1],
                                output: new codepipeline.Artifact('buildOutput2'),
                                runOrder: 2,
                            }),
                        ],
                    },
                ],
            });
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::CodePipeline::Pipeline', 1);
        });
        test('violation of runOrder constraints is detected and reported', () => {
            const stack = new cdk.Stack();
            const sourceOutput1 = new codepipeline.Artifact('sourceOutput1');
            const buildOutput1 = new codepipeline.Artifact('buildOutput1');
            const sourceOutput2 = new codepipeline.Artifact('sourceOutput2');
            new codepipeline.Pipeline(stack, 'Pipeline', {
                stages: [
                    {
                        stageName: 'Source',
                        actions: [
                            new fake_source_action_1.FakeSourceAction({
                                actionName: 'source1',
                                output: sourceOutput1,
                            }),
                            new fake_source_action_1.FakeSourceAction({
                                actionName: 'source2',
                                output: sourceOutput2,
                            }),
                        ],
                    },
                    {
                        stageName: 'Build',
                        actions: [
                            new fake_build_action_1.FakeBuildAction({
                                actionName: 'build1',
                                input: sourceOutput1,
                                output: buildOutput1,
                                runOrder: 3,
                            }),
                            new fake_build_action_1.FakeBuildAction({
                                actionName: 'build2',
                                input: sourceOutput2,
                                extraInputs: [buildOutput1],
                                output: new codepipeline.Artifact('buildOutput2'),
                                runOrder: 2,
                            }),
                        ],
                    },
                ],
            });
            const errors = validate(stack);
            expect(errors.length).toEqual(1);
            const error = errors[0];
            expect(error).toMatch(/Stage 2 Action 2 \('Build'\/'build2'\) is consuming input Artifact 'buildOutput1' before it is being produced at Stage 2 Action 3 \('Build'\/'build1'\)/);
        });
        test('without a name, sanitize the auto stage-action derived name', () => {
            const stack = new cdk.Stack();
            const sourceOutput = new codepipeline.Artifact();
            new codepipeline.Pipeline(stack, 'Pipeline', {
                stages: [
                    {
                        stageName: 'Source.@',
                        actions: [
                            new fake_source_action_1.FakeSourceAction({
                                actionName: 'source1',
                                output: sourceOutput,
                            }),
                        ],
                    },
                    {
                        stageName: 'Build',
                        actions: [
                            new fake_build_action_1.FakeBuildAction({
                                actionName: 'build1',
                                input: sourceOutput,
                            }),
                        ],
                    },
                ],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
                'Stages': [
                    {
                        'Name': 'Source.@',
                        'Actions': [
                            {
                                'Name': 'source1',
                                'OutputArtifacts': [
                                    { 'Name': 'Artifact_Source_source1' },
                                ],
                            },
                        ],
                    },
                    {
                        'Name': 'Build',
                        'Actions': [
                            {
                                'Name': 'build1',
                                'InputArtifacts': [
                                    { 'Name': 'Artifact_Source_source1' },
                                ],
                            },
                        ],
                    },
                ],
            });
        });
    });
});
/* eslint-disable @aws-cdk/no-core-construct */
function validate(construct) {
    try {
        construct.node.root.synth();
        return [];
    }
    catch (e) {
        const err = e; // coerce unknown to any
        if (!('message' in err) || !err.message.startsWith('Validation failed')) {
            throw e;
        }
        return err.message.split('\n').slice(1);
    }
}
/* eslint-enable @aws-cdk/no-core-construct */
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJ0aWZhY3RzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcnRpZmFjdHMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyxxQ0FBcUM7QUFFckMsdUNBQXVDO0FBQ3ZDLDJEQUFzRDtBQUN0RCw2REFBd0Q7QUFFeEQsZ0NBQWdDO0FBRWhDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFO0lBQ3pCLFFBQVEsQ0FBQywyQkFBMkIsRUFBRSxHQUFHLEVBQUU7UUFDekMsSUFBSSxDQUFDLHNDQUFzQyxFQUFFLEdBQUcsRUFBRTtZQUNoRCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLDZDQUE2QyxDQUFDLENBQUM7UUFDckcsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsc0dBQXNHLEVBQUUsR0FBRyxFQUFFO1lBQ2hILE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQzlCLE1BQU0sWUFBWSxHQUFHLElBQUksWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2pELElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFO2dCQUMzQyxNQUFNLEVBQUU7b0JBQ047d0JBQ0UsU0FBUyxFQUFFLFFBQVE7d0JBQ25CLE9BQU8sRUFBRTs0QkFDUCxJQUFJLHFDQUFnQixDQUFDO2dDQUNuQixVQUFVLEVBQUUsUUFBUTtnQ0FDcEIsTUFBTSxFQUFFLFlBQVk7NkJBQ3JCLENBQUM7eUJBQ0g7cUJBQ0Y7b0JBQ0Q7d0JBQ0UsU0FBUyxFQUFFLE9BQU87d0JBQ2xCLE9BQU8sRUFBRTs0QkFDUCxJQUFJLG1DQUFlLENBQUM7Z0NBQ2xCLFVBQVUsRUFBRSxPQUFPO2dDQUNuQixLQUFLLEVBQUUsSUFBSSxZQUFZLENBQUMsUUFBUSxFQUFFOzZC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bSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBJQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmUgZnJvbSAnLi4vbGliJztcbmltcG9ydCB7IEZha2VCdWlsZEFjdGlvbiB9IGZyb20gJy4vZmFrZS1idWlsZC1hY3Rpb24nO1xuaW1wb3J0IHsgRmFrZVNvdXJjZUFjdGlvbiB9IGZyb20gJy4vZmFrZS1zb3VyY2UtYWN0aW9uJztcblxuLyogZXNsaW50LWRpc2FibGUgcXVvdGUtcHJvcHMgKi9cblxuZGVzY3JpYmUoJ2FydGlmYWN0cycsICgpID0+IHtcbiAgZGVzY3JpYmUoJ0FydGlmYWN0cyBpbiBDb2RlUGlwZWxpbmUnLCAoKSA9PiB7XG4gICAgdGVzdCgnY2Fubm90IGJlIGNyZWF0ZWQgd2l0aCBhbiBlbXB0eSBuYW1lJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KCgpID0+IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoJycpKS50b1Rocm93KC9BcnRpZmFjdCBuYW1lIG11c3QgbWF0Y2ggcmVndWxhciBleHByZXNzaW9uLyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd3aXRob3V0IGEgbmFtZSwgd2hlbiB1c2VkIGFzIGFuIGlucHV0IHdpdGhvdXQgYmVpbmcgdXNlZCBhcyBhbiBvdXRwdXQgZmlyc3QgLSBzaG91bGQgZmFpbCB2YWxpZGF0aW9uJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBzb3VyY2VPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCk7XG4gICAgICBuZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHN0YWNrLCAnUGlwZWxpbmUnLCB7XG4gICAgICAgIHN0YWdlczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN0YWdlTmFtZTogJ1NvdXJjZScsXG4gICAgICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgICAgIG5ldyBGYWtlU291cmNlQWN0aW9uKHtcbiAgICAgICAgICAgICAgICBhY3Rpb25OYW1lOiAnU291cmNlJyxcbiAgICAgICAgICAgICAgICBvdXRwdXQ6IHNvdXJjZU91dHB1dCxcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3RhZ2VOYW1lOiAnQnVpbGQnLFxuICAgICAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgICAgICBuZXcgRmFrZUJ1aWxkQWN0aW9uKHtcbiAgICAgICAgICAgICAgICBhY3Rpb25OYW1lOiAnQnVpbGQnLFxuICAgICAgICAgICAgICAgIGlucHV0OiBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCksXG4gICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGVycm9ycyA9IHZhbGlkYXRlKHN0YWNrKTtcblxuICAgICAgZXhwZWN0KGVycm9ycy5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgICBjb25zdCBlcnJvciA9IGVycm9yc1swXTtcbiAgICAgIGV4cGVjdChlcnJvcikudG9NYXRjaCgvQWN0aW9uICdCdWlsZCcgaXMgdXNpbmcgYW4gdW5uYW1lZCBpbnB1dCBBcnRpZmFjdCwgd2hpY2ggaXMgbm90IGJlaW5nIHByb2R1Y2VkIGluIHRoaXMgcGlwZWxpbmUvKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3dpdGggYSBuYW1lLCB3aGVuIHVzZWQgYXMgYW4gaW5wdXQgd2l0aG91dCBiZWluZyB1c2VkIGFzIGFuIG91dHB1dCBmaXJzdCAtIHNob3VsZCBmYWlsIHZhbGlkYXRpb24nLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHNvdXJjZU91dHB1dCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoKTtcbiAgICAgIG5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUoc3RhY2ssICdQaXBlbGluZScsIHtcbiAgICAgICAgc3RhZ2VzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3RhZ2VOYW1lOiAnU291cmNlJyxcbiAgICAgICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAgICAgbmV3IEZha2VTb3VyY2VBY3Rpb24oe1xuICAgICAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdTb3VyY2UnLFxuICAgICAgICAgICAgICAgIG91dHB1dDogc291cmNlT3V0cHV0LFxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdGFnZU5hbWU6ICdCdWlsZCcsXG4gICAgICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgICAgIG5ldyBGYWtlQnVpbGRBY3Rpb24oe1xuICAgICAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdCdWlsZCcsXG4gICAgICAgICAgICAgICAgaW5wdXQ6IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoJ25hbWVkJyksXG4gICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGVycm9ycyA9IHZhbGlkYXRlKHN0YWNrKTtcblxuICAgICAgZXhwZWN0KGVycm9ycy5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgICBjb25zdCBlcnJvciA9IGVycm9yc1swXTtcbiAgICAgIGV4cGVjdChlcnJvcikudG9NYXRjaCgvQWN0aW9uICdCdWlsZCcgaXMgdXNpbmcgaW5wdXQgQXJ0aWZhY3QgJ25hbWVkJywgd2hpY2ggaXMgbm90IGJlaW5nIHByb2R1Y2VkIGluIHRoaXMgcGlwZWxpbmUvKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3dpdGhvdXQgYSBuYW1lLCB3aGVuIHVzZWQgYXMgYW4gb3V0cHV0IG11bHRpcGxlIHRpbWVzIC0gc2hvdWxkIGZhaWwgdmFsaWRhdGlvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3Qgc291cmNlT3V0cHV0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpO1xuICAgICAgbmV3IGNvZGVwaXBlbGluZS5QaXBlbGluZShzdGFjaywgJ1BpcGVsaW5lJywge1xuICAgICAgICBzdGFnZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdGFnZU5hbWU6ICdTb3VyY2UnLFxuICAgICAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgICAgICBuZXcgRmFrZVNvdXJjZUFjdGlvbih7XG4gICAgICAgICAgICAgICAgYWN0aW9uTmFtZTogJ1NvdXJjZScsXG4gICAgICAgICAgICAgICAgb3V0cHV0OiBzb3VyY2VPdXRwdXQsXG4gICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN0YWdlTmFtZTogJ0J1aWxkJyxcbiAgICAgICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAgICAgbmV3IEZha2VCdWlsZEFjdGlvbih7XG4gICAgICAgICAgICAgICAgYWN0aW9uTmFtZTogJ0J1aWxkJyxcbiAgICAgICAgICAgICAgICBpbnB1dDogc291cmNlT3V0cHV0LFxuICAgICAgICAgICAgICAgIG91dHB1dDogc291cmNlT3V0cHV0LFxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBlcnJvcnMgPSB2YWxpZGF0ZShzdGFjayk7XG4gICAgICBleHBlY3QoZXJyb3JzLmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICAgIGNvbnN0IGVycm9yID0gZXJyb3JzWzBdO1xuICAgICAgZXhwZWN0KGVycm9yKS50b01hdGNoKC9Cb3RoIEFjdGlvbnMgJ1NvdXJjZScgYW5kICdCdWlsZCcgYXJlIHByb2R1Y3RpbmcgQXJ0aWZhY3QgJ0FydGlmYWN0X1NvdXJjZV9Tb3VyY2UnLiBFdmVyeSBhcnRpZmFjdCBjYW4gb25seSBiZSBwcm9kdWNlZCBvbmNlLi8pO1xuICAgIH0pO1xuXG4gICAgdGVzdChcImFuIEFjdGlvbidzIG91dHB1dCBjYW4gYmUgdXNlZCBhcyBpbnB1dCBmb3IgYW4gQWN0aW9uIGluIHRoZSBzYW1lIFN0YWdlIHdpdGggYSBoaWdoZXIgcnVuT3JkZXJcIiwgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAgIGNvbnN0IHNvdXJjZU91dHB1dDEgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCdzb3VyY2VPdXRwdXQxJyk7XG4gICAgICBjb25zdCBidWlsZE91dHB1dDEgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCdidWlsZE91dHB1dDEnKTtcbiAgICAgIGNvbnN0IHNvdXJjZU91dHB1dDIgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCdzb3VyY2VPdXRwdXQyJyk7XG5cbiAgICAgIG5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUoc3RhY2ssICdQaXBlbGluZScsIHtcbiAgICAgICAgc3RhZ2VzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3RhZ2VOYW1lOiAnU291cmNlJyxcbiAgICAgICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAgICAgbmV3IEZha2VTb3VyY2VBY3Rpb24oe1xuICAgICAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdzb3VyY2UxJyxcbiAgICAgICAgICAgICAgICBvdXRwdXQ6IHNvdXJjZU91dHB1dDEsXG4gICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICBuZXcgRmFrZVNvdXJjZUFjdGlvbih7XG4gICAgICAgICAgICAgICAgYWN0aW9uTmFtZTogJ3NvdXJjZTInLFxuICAgICAgICAgICAgICAgIG91dHB1dDogc291cmNlT3V0cHV0MixcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3RhZ2VOYW1lOiAnQnVpbGQnLFxuICAgICAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgICAgICBuZXcgRmFrZUJ1aWxkQWN0aW9uKHtcbiAgICAgICAgICAgICAgICBhY3Rpb25OYW1lOiAnYnVpbGQxJyxcbiAgICAgICAgICAgICAgICBpbnB1dDogc291cmNlT3V0cHV0MSxcbiAgICAgICAgICAgICAgICBvdXRwdXQ6IGJ1aWxkT3V0cHV0MSxcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgIG5ldyBGYWtlQnVpbGRBY3Rpb24oe1xuICAgICAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdidWlsZDInLFxuICAgICAgICAgICAgICAgIGlucHV0OiBzb3VyY2VPdXRwdXQyLFxuICAgICAgICAgICAgICAgIGV4dHJhSW5wdXRzOiBbYnVpbGRPdXRwdXQxXSxcbiAgICAgICAgICAgICAgICBvdXRwdXQ6IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoJ2J1aWxkT3V0cHV0MicpLFxuICAgICAgICAgICAgICAgIHJ1bk9yZGVyOiAyLFxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpDb2RlUGlwZWxpbmU6OlBpcGVsaW5lJywgMSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd2aW9sYXRpb24gb2YgcnVuT3JkZXIgY29uc3RyYWludHMgaXMgZGV0ZWN0ZWQgYW5kIHJlcG9ydGVkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAgIGNvbnN0IHNvdXJjZU91dHB1dDEgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCdzb3VyY2VPdXRwdXQxJyk7XG4gICAgICBjb25zdCBidWlsZE91dHB1dDEgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCdidWlsZE91dHB1dDEnKTtcbiAgICAgIGNvbnN0IHNvdXJjZU91dHB1dDIgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCdzb3VyY2VPdXRwdXQyJyk7XG5cbiAgICAgIG5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUoc3RhY2ssICdQaXBlbGluZScsIHtcbiAgICAgICAgc3RhZ2VzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3RhZ2VOYW1lOiAnU291cmNlJyxcbiAgICAgICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAgICAgbmV3IEZha2VTb3VyY2VBY3Rpb24oe1xuICAgICAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdzb3VyY2UxJyxcbiAgICAgICAgICAgICAgICBvdXRwdXQ6IHNvdXJjZU91dHB1dDEsXG4gICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICBuZXcgRmFrZVNvdXJjZUFjdGlvbih7XG4gICAgICAgICAgICAgICAgYWN0aW9uTmFtZTogJ3NvdXJjZTInLFxuICAgICAgICAgICAgICAgIG91dHB1dDogc291cmNlT3V0cHV0MixcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3RhZ2VOYW1lOiAnQnVpbGQnLFxuICAgICAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgICAgICBuZXcgRmFrZUJ1aWxkQWN0aW9uKHtcbiAgICAgICAgICAgICAgICBhY3Rpb25OYW1lOiAnYnVpbGQxJyxcbiAgICAgICAgICAgICAgICBpbnB1dDogc291cmNlT3V0cHV0MSxcbiAgICAgICAgICAgICAgICBvdXRwdXQ6IGJ1aWxkT3V0cHV0MSxcbiAgICAgICAgICAgICAgICBydW5PcmRlcjogMyxcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgIG5ldyBGYWtlQnVpbGRBY3Rpb24oe1xuICAgICAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdidWlsZDInLFxuICAgICAgICAgICAgICAgIGlucHV0OiBzb3VyY2VPdXRwdXQyLFxuICAgICAgICAgICAgICAgIGV4dHJhSW5wdXRzOiBbYnVpbGRPdXRwdXQxXSxcbiAgICAgICAgICAgICAgICBvdXRwdXQ6IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoJ2J1aWxkT3V0cHV0MicpLFxuICAgICAgICAgICAgICAgIHJ1bk9yZGVyOiAyLFxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBlcnJvcnMgPSB2YWxpZGF0ZShzdGFjayk7XG5cbiAgICAgIGV4cGVjdChlcnJvcnMubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgICAgY29uc3QgZXJyb3IgPSBlcnJvcnNbMF07XG4gICAgICBleHBlY3QoZXJyb3IpLnRvTWF0Y2goL1N0YWdlIDIgQWN0aW9uIDIgXFwoJ0J1aWxkJ1xcLydidWlsZDInXFwpIGlzIGNvbnN1bWluZyBpbnB1dCBBcnRpZmFjdCAnYnVpbGRPdXRwdXQxJyBiZWZvcmUgaXQgaXMgYmVpbmcgcHJvZHVjZWQgYXQgU3RhZ2UgMiBBY3Rpb24gMyBcXCgnQnVpbGQnXFwvJ2J1aWxkMSdcXCkvKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3dpdGhvdXQgYSBuYW1lLCBzYW5pdGl6ZSB0aGUgYXV0byBzdGFnZS1hY3Rpb24gZGVyaXZlZCBuYW1lJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAgIGNvbnN0IHNvdXJjZU91dHB1dCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoKTtcbiAgICAgIG5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUoc3RhY2ssICdQaXBlbGluZScsIHtcbiAgICAgICAgc3RhZ2VzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3RhZ2VOYW1lOiAnU291cmNlLkAnLCAvLyBAIGFuZCAuIGFyZSBub3QgYWxsb3dlZCBpbiBBcnRpZmFjdCBuYW1lcyFcbiAgICAgICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAgICAgbmV3IEZha2VTb3VyY2VBY3Rpb24oe1xuICAgICAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdzb3VyY2UxJyxcbiAgICAgICAgICAgICAgICBvdXRwdXQ6IHNvdXJjZU91dHB1dCxcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3RhZ2VOYW1lOiAnQnVpbGQnLFxuICAgICAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgICAgICBuZXcgRmFrZUJ1aWxkQWN0aW9uKHtcbiAgICAgICAgICAgICAgICBhY3Rpb25OYW1lOiAnYnVpbGQxJyxcbiAgICAgICAgICAgICAgICBpbnB1dDogc291cmNlT3V0cHV0LFxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlUGlwZWxpbmU6OlBpcGVsaW5lJywge1xuICAgICAgICAnU3RhZ2VzJzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgICdOYW1lJzogJ1NvdXJjZS5AJyxcbiAgICAgICAgICAgICdBY3Rpb25zJzogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ05hbWUnOiAnc291cmNlMScsXG4gICAgICAgICAgICAgICAgJ091dHB1dEFydGlmYWN0cyc6IFtcbiAgICAgICAgICAgICAgICAgIHsgJ05hbWUnOiAnQXJ0aWZhY3RfU291cmNlX3NvdXJjZTEnIH0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnTmFtZSc6ICdCdWlsZCcsXG4gICAgICAgICAgICAnQWN0aW9ucyc6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdOYW1lJzogJ2J1aWxkMScsXG4gICAgICAgICAgICAgICAgJ0lucHV0QXJ0aWZhY3RzJzogW1xuICAgICAgICAgICAgICAgICAgeyAnTmFtZSc6ICdBcnRpZmFjdF9Tb3VyY2Vfc291cmNlMScgfSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbi8qIGVzbGludC1kaXNhYmxlIEBhd3MtY2RrL25vLWNvcmUtY29uc3RydWN0ICovXG5mdW5jdGlvbiB2YWxpZGF0ZShjb25zdHJ1Y3Q6IElDb25zdHJ1Y3QpOiBzdHJpbmdbXSB7XG4gIHRyeSB7XG4gICAgKGNvbnN0cnVjdC5ub2RlLnJvb3QgYXMgY2RrLkFwcCkuc3ludGgoKTtcbiAgICByZXR1cm4gW107XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zdCBlcnIgPSBlIGFzIGFueTsgLy8gY29lcmNlIHVua25vd24gdG8gYW55XG4gICAgaWYgKCEoJ21lc3NhZ2UnIGluIGVycikgfHwgIWVyci5tZXNzYWdlLnN0YXJ0c1dpdGgoJ1ZhbGlkYXRpb24gZmFpbGVkJykpIHtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuICAgIHJldHVybiBlcnIubWVzc2FnZS5zcGxpdCgnXFxuJykuc2xpY2UoMSk7XG4gIH1cbn1cbi8qIGVzbGludC1lbmFibGUgQGF3cy1jZGsvbm8tY29yZS1jb25zdHJ1Y3QgKi9cbiJdfQ==