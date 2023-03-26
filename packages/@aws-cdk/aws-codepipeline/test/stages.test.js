"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const cdk = require("@aws-cdk/core");
const codepipeline = require("../lib");
const stage_1 = require("../lib/private/stage");
const fake_build_action_1 = require("./fake-build-action");
const fake_source_action_1 = require("./fake-source-action");
/* eslint-disable quote-props */
describe('stages', () => {
    describe('Pipeline Stages', () => {
        test('can be inserted before another Stage', () => {
            const stack = new cdk.Stack();
            const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');
            const secondStage = pipeline.addStage({ stageName: 'SecondStage' });
            const firstStage = pipeline.addStage({
                stageName: 'FirstStage',
                placement: {
                    rightBefore: secondStage,
                },
            });
            // -- dummy actions here are needed to satisfy validation rules
            const sourceArtifact = new codepipeline.Artifact();
            firstStage.addAction(new fake_source_action_1.FakeSourceAction({
                actionName: 'dummyAction',
                output: sourceArtifact,
            }));
            secondStage.addAction(new fake_build_action_1.FakeBuildAction({
                actionName: 'dummyAction',
                input: sourceArtifact,
            }));
            // --
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
                'Stages': [
                    { 'Name': 'FirstStage' },
                    { 'Name': 'SecondStage' },
                ],
            });
        });
        test('can be inserted after another Stage', () => {
            const stack = new cdk.Stack();
            const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');
            const firstStage = pipeline.addStage({ stageName: 'FirstStage' });
            const thirdStage = pipeline.addStage({ stageName: 'ThirdStage' });
            const secondStage = pipeline.addStage({
                stageName: 'SecondStage',
                placement: {
                    justAfter: firstStage,
                },
            });
            // -- dummy actions here are needed to satisfy validation rules
            const sourceArtifact = new codepipeline.Artifact();
            firstStage.addAction(new fake_source_action_1.FakeSourceAction({
                actionName: 'dummyAction',
                output: sourceArtifact,
            }));
            secondStage.addAction(new fake_build_action_1.FakeBuildAction({
                actionName: 'dummyAction',
                input: sourceArtifact,
            }));
            thirdStage.addAction(new fake_build_action_1.FakeBuildAction({
                actionName: 'dummyAction',
                input: sourceArtifact,
            }));
            // --
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
                'Stages': [
                    { 'Name': 'FirstStage' },
                    { 'Name': 'SecondStage' },
                    { 'Name': 'ThirdStage' },
                ],
            });
        });
        test("attempting to insert a Stage before a Stage that doesn't exist results in an error", () => {
            const stack = new cdk.Stack();
            const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');
            const stage = pipeline.addStage({ stageName: 'Stage' });
            const anotherPipeline = new codepipeline.Pipeline(stack, 'AnotherPipeline');
            expect(() => {
                anotherPipeline.addStage({
                    stageName: 'AnotherStage',
                    placement: {
                        rightBefore: stage,
                    },
                });
            }).toThrow(/before/i);
        });
        test("attempting to insert a Stage after a Stage that doesn't exist results in an error", () => {
            const stack = new cdk.Stack();
            const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');
            const stage = pipeline.addStage({ stageName: 'Stage' });
            const anotherPipeline = new codepipeline.Pipeline(stack, 'AnotherPipeline');
            expect(() => {
                anotherPipeline.addStage({
                    stageName: 'AnotherStage',
                    placement: {
                        justAfter: stage,
                    },
                });
            }).toThrow(/after/i);
        });
        test('providing more than one placement value results in an error', () => {
            const stack = new cdk.Stack();
            const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');
            const stage = pipeline.addStage({ stageName: 'Stage' });
            expect(() => {
                pipeline.addStage({
                    stageName: 'SecondStage',
                    placement: {
                        rightBefore: stage,
                        justAfter: stage,
                    },
                });
                // incredibly, an arrow function below causes nodeunit to crap out with:
                // "TypeError: Function has non-object prototype 'undefined' in instanceof check"
            }).toThrow(/(rightBefore.*justAfter)|(justAfter.*rightBefore)/);
        });
        test('can be retrieved from a pipeline after it has been created', () => {
            const stack = new cdk.Stack();
            const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
                stages: [
                    {
                        stageName: 'FirstStage',
                    },
                ],
            });
            pipeline.addStage({ stageName: 'SecondStage' });
            expect(pipeline.stages.length).toEqual(2);
            expect(pipeline.stages[0].stageName).toEqual('FirstStage');
            expect(pipeline.stages[1].stageName).toEqual('SecondStage');
            // adding stages to the returned array should have no effect
            pipeline.stages.push(new stage_1.Stage({
                stageName: 'ThirdStage',
            }, pipeline));
            expect(pipeline.stageCount).toEqual(2);
        });
        test('can disable transitions to a stage', () => {
            const stack = new cdk.Stack();
            const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');
            const firstStage = pipeline.addStage({ stageName: 'FirstStage' });
            const secondStage = pipeline.addStage({ stageName: 'SecondStage', transitionToEnabled: false });
            // -- dummy actions here are needed to satisfy validation rules
            const sourceArtifact = new codepipeline.Artifact();
            firstStage.addAction(new fake_source_action_1.FakeSourceAction({
                actionName: 'dummyAction',
                output: sourceArtifact,
            }));
            secondStage.addAction(new fake_build_action_1.FakeBuildAction({
                actionName: 'dummyAction',
                input: sourceArtifact,
            }));
            // --
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
                Stages: [
                    { Name: 'FirstStage' },
                    { Name: 'SecondStage' },
                ],
                DisableInboundStageTransitions: [
                    {
                        Reason: 'Transition disabled',
                        StageName: 'SecondStage',
                    },
                ],
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhZ2VzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdGFnZXMudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyxxQ0FBcUM7QUFDckMsdUNBQXVDO0FBQ3ZDLGdEQUE2QztBQUM3QywyREFBc0Q7QUFDdEQsNkRBQXdEO0FBRXhELGdDQUFnQztBQUVoQyxRQUFRLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtJQUN0QixRQUFRLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFO1FBQy9CLElBQUksQ0FBQyxzQ0FBc0MsRUFBRSxHQUFHLEVBQUU7WUFDaEQsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDOUIsTUFBTSxRQUFRLEdBQUcsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztZQUU5RCxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUUsU0FBUyxFQUFFLGFBQWEsRUFBRSxDQUFDLENBQUM7WUFDcEUsTUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQztnQkFDbkMsU0FBUyxFQUFFLFlBQVk7Z0JBQ3ZCLFNBQVMsRUFBRTtvQkFDVCxXQUFXLEVBQUUsV0FBVztpQkFDekI7YUFDRixDQUFDLENBQUM7WUFFSCwrREFBK0Q7WUFDL0QsTUFBTSxjQUFjLEdBQUcsSUFBSSxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDbkQsVUFBVSxDQUFDLFNBQVMsQ0FBQyxJQUFJLHFDQUFnQixDQUFDO2dCQUN4QyxVQUFVLEVBQUUsYUFBYTtnQkFDekIsTUFBTSxFQUFFLGNBQWM7YUFDdkIsQ0FBQyxDQUFDLENBQUM7WUFDSixXQUFXLENBQUMsU0FBUyxDQUFDLElBQUksbUNBQWUsQ0FBQztnQkFDeEMsVUFBVSxFQUFFLGFBQWE7Z0JBQ3pCLEtBQUssRUFBRSxjQUFjO2FBQ3RCLENBQUMsQ0FB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O1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lIGZyb20gJy4uL2xpYic7XG5pbXBvcnQgeyBTdGFnZSB9IGZyb20gJy4uL2xpYi9wcml2YXRlL3N0YWdlJztcbmltcG9ydCB7IEZha2VCdWlsZEFjdGlvbiB9IGZyb20gJy4vZmFrZS1idWlsZC1hY3Rpb24nO1xuaW1wb3J0IHsgRmFrZVNvdXJjZUFjdGlvbiB9IGZyb20gJy4vZmFrZS1zb3VyY2UtYWN0aW9uJztcblxuLyogZXNsaW50LWRpc2FibGUgcXVvdGUtcHJvcHMgKi9cblxuZGVzY3JpYmUoJ3N0YWdlcycsICgpID0+IHtcbiAgZGVzY3JpYmUoJ1BpcGVsaW5lIFN0YWdlcycsICgpID0+IHtcbiAgICB0ZXN0KCdjYW4gYmUgaW5zZXJ0ZWQgYmVmb3JlIGFub3RoZXIgU3RhZ2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHBpcGVsaW5lID0gbmV3IGNvZGVwaXBlbGluZS5QaXBlbGluZShzdGFjaywgJ1BpcGVsaW5lJyk7XG5cbiAgICAgIGNvbnN0IHNlY29uZFN0YWdlID0gcGlwZWxpbmUuYWRkU3RhZ2UoeyBzdGFnZU5hbWU6ICdTZWNvbmRTdGFnZScgfSk7XG4gICAgICBjb25zdCBmaXJzdFN0YWdlID0gcGlwZWxpbmUuYWRkU3RhZ2Uoe1xuICAgICAgICBzdGFnZU5hbWU6ICdGaXJzdFN0YWdlJyxcbiAgICAgICAgcGxhY2VtZW50OiB7XG4gICAgICAgICAgcmlnaHRCZWZvcmU6IHNlY29uZFN0YWdlLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIC0tIGR1bW15IGFjdGlvbnMgaGVyZSBhcmUgbmVlZGVkIHRvIHNhdGlzZnkgdmFsaWRhdGlvbiBydWxlc1xuICAgICAgY29uc3Qgc291cmNlQXJ0aWZhY3QgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCk7XG4gICAgICBmaXJzdFN0YWdlLmFkZEFjdGlvbihuZXcgRmFrZVNvdXJjZUFjdGlvbih7XG4gICAgICAgIGFjdGlvbk5hbWU6ICdkdW1teUFjdGlvbicsXG4gICAgICAgIG91dHB1dDogc291cmNlQXJ0aWZhY3QsXG4gICAgICB9KSk7XG4gICAgICBzZWNvbmRTdGFnZS5hZGRBY3Rpb24obmV3IEZha2VCdWlsZEFjdGlvbih7XG4gICAgICAgIGFjdGlvbk5hbWU6ICdkdW1teUFjdGlvbicsXG4gICAgICAgIGlucHV0OiBzb3VyY2VBcnRpZmFjdCxcbiAgICAgIH0pKTtcbiAgICAgIC8vIC0tXG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVQaXBlbGluZTo6UGlwZWxpbmUnLCB7XG4gICAgICAgICdTdGFnZXMnOiBbXG4gICAgICAgICAgeyAnTmFtZSc6ICdGaXJzdFN0YWdlJyB9LFxuICAgICAgICAgIHsgJ05hbWUnOiAnU2Vjb25kU3RhZ2UnIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2NhbiBiZSBpbnNlcnRlZCBhZnRlciBhbm90aGVyIFN0YWdlJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBwaXBlbGluZSA9IG5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUoc3RhY2ssICdQaXBlbGluZScpO1xuXG4gICAgICBjb25zdCBmaXJzdFN0YWdlID0gcGlwZWxpbmUuYWRkU3RhZ2UoeyBzdGFnZU5hbWU6ICdGaXJzdFN0YWdlJyB9KTtcbiAgICAgIGNvbnN0IHRoaXJkU3RhZ2UgPSBwaXBlbGluZS5hZGRTdGFnZSh7IHN0YWdlTmFtZTogJ1RoaXJkU3RhZ2UnIH0pO1xuICAgICAgY29uc3Qgc2Vjb25kU3RhZ2UgPSBwaXBlbGluZS5hZGRTdGFnZSh7XG4gICAgICAgIHN0YWdlTmFtZTogJ1NlY29uZFN0YWdlJyxcbiAgICAgICAgcGxhY2VtZW50OiB7XG4gICAgICAgICAganVzdEFmdGVyOiBmaXJzdFN0YWdlLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIC0tIGR1bW15IGFjdGlvbnMgaGVyZSBhcmUgbmVlZGVkIHRvIHNhdGlzZnkgdmFsaWRhdGlvbiBydWxlc1xuICAgICAgY29uc3Qgc291cmNlQXJ0aWZhY3QgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCk7XG4gICAgICBmaXJzdFN0YWdlLmFkZEFjdGlvbihuZXcgRmFrZVNvdXJjZUFjdGlvbih7XG4gICAgICAgIGFjdGlvbk5hbWU6ICdkdW1teUFjdGlvbicsXG4gICAgICAgIG91dHB1dDogc291cmNlQXJ0aWZhY3QsXG4gICAgICB9KSk7XG4gICAgICBzZWNvbmRTdGFnZS5hZGRBY3Rpb24obmV3IEZha2VCdWlsZEFjdGlvbih7XG4gICAgICAgIGFjdGlvbk5hbWU6ICdkdW1teUFjdGlvbicsXG4gICAgICAgIGlucHV0OiBzb3VyY2VBcnRpZmFjdCxcbiAgICAgIH0pKTtcbiAgICAgIHRoaXJkU3RhZ2UuYWRkQWN0aW9uKG5ldyBGYWtlQnVpbGRBY3Rpb24oe1xuICAgICAgICBhY3Rpb25OYW1lOiAnZHVtbXlBY3Rpb24nLFxuICAgICAgICBpbnB1dDogc291cmNlQXJ0aWZhY3QsXG4gICAgICB9KSk7XG4gICAgICAvLyAtLVxuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlUGlwZWxpbmU6OlBpcGVsaW5lJywge1xuICAgICAgICAnU3RhZ2VzJzogW1xuICAgICAgICAgIHsgJ05hbWUnOiAnRmlyc3RTdGFnZScgfSxcbiAgICAgICAgICB7ICdOYW1lJzogJ1NlY29uZFN0YWdlJyB9LFxuICAgICAgICAgIHsgJ05hbWUnOiAnVGhpcmRTdGFnZScgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdChcImF0dGVtcHRpbmcgdG8gaW5zZXJ0IGEgU3RhZ2UgYmVmb3JlIGEgU3RhZ2UgdGhhdCBkb2Vzbid0IGV4aXN0IHJlc3VsdHMgaW4gYW4gZXJyb3JcIiwgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCBwaXBlbGluZSA9IG5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUoc3RhY2ssICdQaXBlbGluZScpO1xuICAgICAgY29uc3Qgc3RhZ2UgPSBwaXBlbGluZS5hZGRTdGFnZSh7IHN0YWdlTmFtZTogJ1N0YWdlJyB9KTtcblxuICAgICAgY29uc3QgYW5vdGhlclBpcGVsaW5lID0gbmV3IGNvZGVwaXBlbGluZS5QaXBlbGluZShzdGFjaywgJ0Fub3RoZXJQaXBlbGluZScpO1xuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgYW5vdGhlclBpcGVsaW5lLmFkZFN0YWdlKHtcbiAgICAgICAgICBzdGFnZU5hbWU6ICdBbm90aGVyU3RhZ2UnLFxuICAgICAgICAgIHBsYWNlbWVudDoge1xuICAgICAgICAgICAgcmlnaHRCZWZvcmU6IHN0YWdlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfSkudG9UaHJvdygvYmVmb3JlL2kpO1xuICAgIH0pO1xuXG4gICAgdGVzdChcImF0dGVtcHRpbmcgdG8gaW5zZXJ0IGEgU3RhZ2UgYWZ0ZXIgYSBTdGFnZSB0aGF0IGRvZXNuJ3QgZXhpc3QgcmVzdWx0cyBpbiBhbiBlcnJvclwiLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHBpcGVsaW5lID0gbmV3IGNvZGVwaXBlbGluZS5QaXBlbGluZShzdGFjaywgJ1BpcGVsaW5lJyk7XG4gICAgICBjb25zdCBzdGFnZSA9IHBpcGVsaW5lLmFkZFN0YWdlKHsgc3RhZ2VOYW1lOiAnU3RhZ2UnIH0pO1xuXG4gICAgICBjb25zdCBhbm90aGVyUGlwZWxpbmUgPSBuZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHN0YWNrLCAnQW5vdGhlclBpcGVsaW5lJyk7XG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBhbm90aGVyUGlwZWxpbmUuYWRkU3RhZ2Uoe1xuICAgICAgICAgIHN0YWdlTmFtZTogJ0Fub3RoZXJTdGFnZScsXG4gICAgICAgICAgcGxhY2VtZW50OiB7XG4gICAgICAgICAgICBqdXN0QWZ0ZXI6IHN0YWdlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfSkudG9UaHJvdygvYWZ0ZXIvaSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdwcm92aWRpbmcgbW9yZSB0aGFuIG9uZSBwbGFjZW1lbnQgdmFsdWUgcmVzdWx0cyBpbiBhbiBlcnJvcicsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgcGlwZWxpbmUgPSBuZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHN0YWNrLCAnUGlwZWxpbmUnKTtcbiAgICAgIGNvbnN0IHN0YWdlID0gcGlwZWxpbmUuYWRkU3RhZ2UoeyBzdGFnZU5hbWU6ICdTdGFnZScgfSk7XG5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIHBpcGVsaW5lLmFkZFN0YWdlKHtcbiAgICAgICAgICBzdGFnZU5hbWU6ICdTZWNvbmRTdGFnZScsXG4gICAgICAgICAgcGxhY2VtZW50OiB7XG4gICAgICAgICAgICByaWdodEJlZm9yZTogc3RhZ2UsXG4gICAgICAgICAgICBqdXN0QWZ0ZXI6IHN0YWdlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgLy8gaW5jcmVkaWJseSwgYW4gYXJyb3cgZnVuY3Rpb24gYmVsb3cgY2F1c2VzIG5vZGV1bml0IHRvIGNyYXAgb3V0IHdpdGg6XG4gICAgICAvLyBcIlR5cGVFcnJvcjogRnVuY3Rpb24gaGFzIG5vbi1vYmplY3QgcHJvdG90eXBlICd1bmRlZmluZWQnIGluIGluc3RhbmNlb2YgY2hlY2tcIlxuICAgICAgfSkudG9UaHJvdygvKHJpZ2h0QmVmb3JlLipqdXN0QWZ0ZXIpfChqdXN0QWZ0ZXIuKnJpZ2h0QmVmb3JlKS8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY2FuIGJlIHJldHJpZXZlZCBmcm9tIGEgcGlwZWxpbmUgYWZ0ZXIgaXQgaGFzIGJlZW4gY3JlYXRlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgcGlwZWxpbmUgPSBuZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHN0YWNrLCAnUGlwZWxpbmUnLCB7XG4gICAgICAgIHN0YWdlczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN0YWdlTmFtZTogJ0ZpcnN0U3RhZ2UnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgcGlwZWxpbmUuYWRkU3RhZ2UoeyBzdGFnZU5hbWU6ICdTZWNvbmRTdGFnZScgfSk7XG5cbiAgICAgIGV4cGVjdChwaXBlbGluZS5zdGFnZXMubGVuZ3RoKS50b0VxdWFsKDIpO1xuICAgICAgZXhwZWN0KHBpcGVsaW5lLnN0YWdlc1swXS5zdGFnZU5hbWUpLnRvRXF1YWwoJ0ZpcnN0U3RhZ2UnKTtcbiAgICAgIGV4cGVjdChwaXBlbGluZS5zdGFnZXNbMV0uc3RhZ2VOYW1lKS50b0VxdWFsKCdTZWNvbmRTdGFnZScpO1xuXG4gICAgICAvLyBhZGRpbmcgc3RhZ2VzIHRvIHRoZSByZXR1cm5lZCBhcnJheSBzaG91bGQgaGF2ZSBubyBlZmZlY3RcbiAgICAgIHBpcGVsaW5lLnN0YWdlcy5wdXNoKG5ldyBTdGFnZSh7XG4gICAgICAgIHN0YWdlTmFtZTogJ1RoaXJkU3RhZ2UnLFxuICAgICAgfSwgcGlwZWxpbmUpKTtcbiAgICAgIGV4cGVjdChwaXBlbGluZS5zdGFnZUNvdW50KS50b0VxdWFsKDIpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY2FuIGRpc2FibGUgdHJhbnNpdGlvbnMgdG8gYSBzdGFnZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgcGlwZWxpbmUgPSBuZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHN0YWNrLCAnUGlwZWxpbmUnKTtcblxuICAgICAgY29uc3QgZmlyc3RTdGFnZSA9IHBpcGVsaW5lLmFkZFN0YWdlKHsgc3RhZ2VOYW1lOiAnRmlyc3RTdGFnZScgfSk7XG4gICAgICBjb25zdCBzZWNvbmRTdGFnZSA9IHBpcGVsaW5lLmFkZFN0YWdlKHsgc3RhZ2VOYW1lOiAnU2Vjb25kU3RhZ2UnLCB0cmFuc2l0aW9uVG9FbmFibGVkOiBmYWxzZSB9KTtcblxuICAgICAgLy8gLS0gZHVtbXkgYWN0aW9ucyBoZXJlIGFyZSBuZWVkZWQgdG8gc2F0aXNmeSB2YWxpZGF0aW9uIHJ1bGVzXG4gICAgICBjb25zdCBzb3VyY2VBcnRpZmFjdCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoKTtcbiAgICAgIGZpcnN0U3RhZ2UuYWRkQWN0aW9uKG5ldyBGYWtlU291cmNlQWN0aW9uKHtcbiAgICAgICAgYWN0aW9uTmFtZTogJ2R1bW15QWN0aW9uJyxcbiAgICAgICAgb3V0cHV0OiBzb3VyY2VBcnRpZmFjdCxcbiAgICAgIH0pKTtcbiAgICAgIHNlY29uZFN0YWdlLmFkZEFjdGlvbihuZXcgRmFrZUJ1aWxkQWN0aW9uKHtcbiAgICAgICAgYWN0aW9uTmFtZTogJ2R1bW15QWN0aW9uJyxcbiAgICAgICAgaW5wdXQ6IHNvdXJjZUFydGlmYWN0LFxuICAgICAgfSkpO1xuICAgICAgLy8gLS1cblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZVBpcGVsaW5lOjpQaXBlbGluZScsIHtcbiAgICAgICAgU3RhZ2VzOiBbXG4gICAgICAgICAgeyBOYW1lOiAnRmlyc3RTdGFnZScgfSxcbiAgICAgICAgICB7IE5hbWU6ICdTZWNvbmRTdGFnZScgfSxcbiAgICAgICAgXSxcbiAgICAgICAgRGlzYWJsZUluYm91bmRTdGFnZVRyYW5zaXRpb25zOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVhc29uOiAnVHJhbnNpdGlvbiBkaXNhYmxlZCcsXG4gICAgICAgICAgICBTdGFnZU5hbWU6ICdTZWNvbmRTdGFnZScsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19