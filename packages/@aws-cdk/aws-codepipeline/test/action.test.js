"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const iam = require("@aws-cdk/aws-iam");
const cdk = require("@aws-cdk/core");
const codepipeline = require("../lib");
const validations = require("../lib/private/validation");
const fake_build_action_1 = require("./fake-build-action");
const fake_source_action_1 = require("./fake-source-action");
/* eslint-disable quote-props */
describe('action', () => {
    describe('artifact bounds validation', () => {
        test('artifacts count exceed maximum', () => {
            const result = boundsValidationResult(1, 0, 0);
            expect(result.length).toEqual(1);
            expect(result[0]).toMatch(/cannot have more than 0/);
        });
        test('artifacts count below minimum', () => {
            const result = boundsValidationResult(1, 2, 2);
            expect(result.length).toEqual(1);
            expect(result[0]).toMatch(/must have at least 2/);
        });
        test('artifacts count within bounds', () => {
            const result = boundsValidationResult(1, 0, 2);
            expect(result.length).toEqual(0);
        });
    });
    describe('action type validation', () => {
        test('must be source and is source', () => {
            const result = validations.validateSourceAction(true, codepipeline.ActionCategory.SOURCE, 'test action', 'test stage');
            expect(result.length).toEqual(0);
        });
        test('must be source and is not source', () => {
            const result = validations.validateSourceAction(true, codepipeline.ActionCategory.DEPLOY, 'test action', 'test stage');
            expect(result.length).toEqual(1);
            expect(result[0]).toMatch(/may only contain Source actions/);
        });
        test('cannot be source and is source', () => {
            const result = validations.validateSourceAction(false, codepipeline.ActionCategory.SOURCE, 'test action', 'test stage');
            expect(result.length).toEqual(1);
            expect(result[0]).toMatch(/may only occur in first stage/);
        });
        test('cannot be source and is not source', () => {
            const result = validations.validateSourceAction(false, codepipeline.ActionCategory.DEPLOY, 'test action', 'test stage');
            expect(result.length).toEqual(0);
        });
    });
    describe('action name validation', () => {
        test('throws an exception when adding an Action with an empty name to the Pipeline', () => {
            const stack = new cdk.Stack();
            const action = new fake_source_action_1.FakeSourceAction({
                actionName: '',
                output: new codepipeline.Artifact(),
            });
            const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');
            const stage = pipeline.addStage({ stageName: 'Source' });
            expect(() => {
                stage.addAction(action);
            }).toThrow(/Action name must match regular expression:/);
        });
    });
    describe('action Artifacts validation', () => {
        test('validates that input Artifacts are within bounds', () => {
            const stack = new cdk.Stack();
            const sourceOutput = new codepipeline.Artifact();
            const extraOutput1 = new codepipeline.Artifact('A1');
            const extraOutput2 = new codepipeline.Artifact('A2');
            const extraOutput3 = new codepipeline.Artifact('A3');
            new codepipeline.Pipeline(stack, 'Pipeline', {
                stages: [
                    {
                        stageName: 'Source',
                        actions: [
                            new fake_source_action_1.FakeSourceAction({
                                actionName: 'Source',
                                output: sourceOutput,
                                extraOutputs: [
                                    extraOutput1,
                                    extraOutput2,
                                    extraOutput3,
                                ],
                            }),
                        ],
                    },
                    {
                        stageName: 'Build',
                        actions: [
                            new fake_build_action_1.FakeBuildAction({
                                actionName: 'Build',
                                input: sourceOutput,
                                extraInputs: [
                                    extraOutput1,
                                    extraOutput2,
                                    extraOutput3,
                                ],
                            }),
                        ],
                    },
                ],
            });
            expect(() => {
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {});
            }).toThrow(/Build\/Fake cannot have more than 3 input artifacts/);
        });
        test('validates that output Artifacts are within bounds', () => {
            const stack = new cdk.Stack();
            const sourceOutput = new codepipeline.Artifact();
            const extraOutput1 = new codepipeline.Artifact('A1');
            const extraOutput2 = new codepipeline.Artifact('A2');
            const extraOutput3 = new codepipeline.Artifact('A3');
            const extraOutput4 = new codepipeline.Artifact('A4');
            new codepipeline.Pipeline(stack, 'Pipeline', {
                stages: [
                    {
                        stageName: 'Source',
                        actions: [
                            new fake_source_action_1.FakeSourceAction({
                                actionName: 'Source',
                                output: sourceOutput,
                                extraOutputs: [
                                    extraOutput1,
                                    extraOutput2,
                                    extraOutput3,
                                    extraOutput4,
                                ],
                            }),
                        ],
                    },
                    {
                        stageName: 'Build',
                        actions: [
                            new fake_build_action_1.FakeBuildAction({
                                actionName: 'Build',
                                input: sourceOutput,
                            }),
                        ],
                    },
                ],
            });
            expect(() => {
                assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {});
            }).toThrow(/Source\/Fake cannot have more than 4 output artifacts/);
        });
    });
    test('automatically assigns artifact names to the Actions', () => {
        const stack = new cdk.Stack();
        const pipeline = new codepipeline.Pipeline(stack, 'pipeline');
        const sourceOutput = new codepipeline.Artifact();
        const sourceAction = new fake_source_action_1.FakeSourceAction({
            actionName: 'CodeCommit',
            output: sourceOutput,
        });
        pipeline.addStage({
            stageName: 'Source',
            actions: [sourceAction],
        });
        pipeline.addStage({
            stageName: 'Build',
            actions: [
                new fake_build_action_1.FakeBuildAction({
                    actionName: 'CodeBuild',
                    input: sourceOutput,
                    output: new codepipeline.Artifact(),
                }),
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
            'Stages': [
                {
                    'Name': 'Source',
                    'Actions': [
                        {
                            'Name': 'CodeCommit',
                            'OutputArtifacts': [
                                {
                                    'Name': 'Artifact_Source_CodeCommit',
                                },
                            ],
                        },
                    ],
                },
                {
                    'Name': 'Build',
                    'Actions': [
                        {
                            'Name': 'CodeBuild',
                            'InputArtifacts': [
                                {
                                    'Name': 'Artifact_Source_CodeCommit',
                                },
                            ],
                            'OutputArtifacts': [
                                {
                                    'Name': 'Artifact_Build_CodeBuild',
                                },
                            ],
                        },
                    ],
                },
            ],
        });
    });
    test('the same Action can be safely added to 2 different Stages', () => {
        const stack = new cdk.Stack();
        const sourceOutput = new codepipeline.Artifact();
        const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
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
            ],
        });
        const action = new fake_build_action_1.FakeBuildAction({ actionName: 'FakeAction', input: sourceOutput });
        const stage2 = {
            stageName: 'Stage2',
            actions: [action],
        };
        const stage3 = {
            stageName: 'Stage3',
            actions: [action],
        };
        pipeline.addStage(stage2);
        expect(() => {
            pipeline.addStage(stage3);
        }).not.toThrow(/FakeAction/);
    });
    describe('input Artifacts', () => {
        test('can be added multiple times to an Action safely', () => {
            const artifact = new codepipeline.Artifact('SomeArtifact');
            expect(() => {
                new fake_build_action_1.FakeBuildAction({
                    actionName: 'CodeBuild',
                    input: artifact,
                    extraInputs: [artifact],
                });
            }).not.toThrow();
        });
        test('can have duplicate names', () => {
            const artifact1 = new codepipeline.Artifact('SomeArtifact');
            const artifact2 = new codepipeline.Artifact('SomeArtifact');
            expect(() => {
                new fake_build_action_1.FakeBuildAction({
                    actionName: 'CodeBuild',
                    input: artifact1,
                    extraInputs: [artifact2],
                });
            }).not.toThrow();
        });
    });
    describe('output Artifacts', () => {
        test('accept multiple Artifacts with the same name safely', () => {
            expect(() => {
                new fake_source_action_1.FakeSourceAction({
                    actionName: 'CodeBuild',
                    output: new codepipeline.Artifact('Artifact1'),
                    extraOutputs: [
                        new codepipeline.Artifact('Artifact1'),
                        new codepipeline.Artifact('Artifact1'),
                    ],
                });
            }).not.toThrow();
        });
    });
    test('an Action with a non-AWS owner cannot have a Role passed for it', () => {
        const stack = new cdk.Stack();
        const sourceOutput = new codepipeline.Artifact();
        const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
            stages: [
                {
                    stageName: 'Source',
                    actions: [
                        new fake_source_action_1.FakeSourceAction({
                            actionName: 'source',
                            output: sourceOutput,
                        }),
                    ],
                },
            ],
        });
        const buildStage = pipeline.addStage({ stageName: 'Build' });
        // constructing it is fine
        const buildAction = new fake_build_action_1.FakeBuildAction({
            actionName: 'build',
            input: sourceOutput,
            owner: 'ThirdParty',
            role: new iam.Role(stack, 'Role', {
                assumedBy: new iam.AnyPrincipal(),
            }),
        });
        // an attempt to add it to the Pipeline is where things blow up
        expect(() => {
            buildStage.addAction(buildAction);
        }).toThrow(/Role is not supported for actions with an owner different than 'AWS' - got 'ThirdParty' \(Action: 'build' in Stage: 'Build'\)/);
    });
    test('actions can be retrieved from stages they have been added to', () => {
        const stack = new cdk.Stack();
        const sourceOutput = new codepipeline.Artifact();
        const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
            stages: [
                {
                    stageName: 'Source',
                    actions: [
                        new fake_source_action_1.FakeSourceAction({
                            actionName: 'source',
                            output: sourceOutput,
                        }),
                    ],
                },
            ],
        });
        const sourceStage = pipeline.stages[0];
        const buildStage = pipeline.addStage({
            stageName: 'Build',
            actions: [
                new fake_build_action_1.FakeBuildAction({
                    actionName: 'build1',
                    input: sourceOutput,
                    runOrder: 11,
                }),
                new fake_build_action_1.FakeBuildAction({
                    actionName: 'build2',
                    input: sourceOutput,
                    runOrder: 2,
                }),
            ],
        });
        expect(sourceStage.actions.length).toEqual(1);
        expect(sourceStage.actions[0].actionProperties.actionName).toEqual('source');
        expect(buildStage.actions.length).toEqual(2);
        expect(buildStage.actions[0].actionProperties.actionName).toEqual('build1');
        expect(buildStage.actions[1].actionProperties.actionName).toEqual('build2');
    });
});
function boundsValidationResult(numberOfArtifacts, min, max) {
    const artifacts = [];
    for (let i = 0; i < numberOfArtifacts; i++) {
        artifacts.push(new codepipeline.Artifact(`TestArtifact${i}`));
    }
    return validations.validateArtifactBounds('output', artifacts, min, max, 'testCategory', 'testProvider');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9uLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhY3Rpb24udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyx3Q0FBd0M7QUFDeEMscUNBQXFDO0FBQ3JDLHVDQUF1QztBQUN2Qyx5REFBeUQ7QUFDekQsMkRBQXNEO0FBQ3RELDZEQUF3RDtBQUV4RCxnQ0FBZ0M7QUFFaEMsUUFBUSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7SUFDdEIsUUFBUSxDQUFDLDRCQUE0QixFQUFFLEdBQUcsRUFBRTtRQUMxQyxJQUFJLENBQUMsZ0NBQWdDLEVBQUUsR0FBRyxFQUFFO1lBQzFDLE1BQU0sTUFBTSxHQUFHLHNCQUFzQixDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDL0MsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1FBQ3ZELENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLCtCQUErQixFQUFFLEdBQUcsRUFBRTtZQUN6QyxNQUFNLE1BQU0sR0FBRyxzQkFBc0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQy9DLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUNwRCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQywrQkFBK0IsRUFBRSxHQUFHLEVBQUU7WUFDekMsTUFBTSxNQUFNLEdBQUcsc0JBQXNCLENBQUMsQ0FBQyxFQUFFLENBQUMs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QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsaUJBQWlCLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDMUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLFlBQVksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDL0Q7SUFDRCxPQUFPLFdBQVcsQ0FBQyxzQkFBc0IsQ0FBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsY0FBYyxFQUFFLGNBQWMsQ0FBQyxDQUFDO0FBQzNHLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lIGZyb20gJy4uL2xpYic7XG5pbXBvcnQgKiBhcyB2YWxpZGF0aW9ucyBmcm9tICcuLi9saWIvcHJpdmF0ZS92YWxpZGF0aW9uJztcbmltcG9ydCB7IEZha2VCdWlsZEFjdGlvbiB9IGZyb20gJy4vZmFrZS1idWlsZC1hY3Rpb24nO1xuaW1wb3J0IHsgRmFrZVNvdXJjZUFjdGlvbiB9IGZyb20gJy4vZmFrZS1zb3VyY2UtYWN0aW9uJztcblxuLyogZXNsaW50LWRpc2FibGUgcXVvdGUtcHJvcHMgKi9cblxuZGVzY3JpYmUoJ2FjdGlvbicsICgpID0+IHtcbiAgZGVzY3JpYmUoJ2FydGlmYWN0IGJvdW5kcyB2YWxpZGF0aW9uJywgKCkgPT4ge1xuICAgIHRlc3QoJ2FydGlmYWN0cyBjb3VudCBleGNlZWQgbWF4aW11bScsICgpID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGJvdW5kc1ZhbGlkYXRpb25SZXN1bHQoMSwgMCwgMCk7XG4gICAgICBleHBlY3QocmVzdWx0Lmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICAgIGV4cGVjdChyZXN1bHRbMF0pLnRvTWF0Y2goL2Nhbm5vdCBoYXZlIG1vcmUgdGhhbiAwLyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhcnRpZmFjdHMgY291bnQgYmVsb3cgbWluaW11bScsICgpID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGJvdW5kc1ZhbGlkYXRpb25SZXN1bHQoMSwgMiwgMik7XG4gICAgICBleHBlY3QocmVzdWx0Lmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICAgIGV4cGVjdChyZXN1bHRbMF0pLnRvTWF0Y2goL211c3QgaGF2ZSBhdCBsZWFzdCAyLyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhcnRpZmFjdHMgY291bnQgd2l0aGluIGJvdW5kcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGJvdW5kc1ZhbGlkYXRpb25SZXN1bHQoMSwgMCwgMik7XG4gICAgICBleHBlY3QocmVzdWx0Lmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2FjdGlvbiB0eXBlIHZhbGlkYXRpb24nLCAoKSA9PiB7XG4gICAgdGVzdCgnbXVzdCBiZSBzb3VyY2UgYW5kIGlzIHNvdXJjZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHZhbGlkYXRpb25zLnZhbGlkYXRlU291cmNlQWN0aW9uKHRydWUsIGNvZGVwaXBlbGluZS5BY3Rpb25DYXRlZ29yeS5TT1VSQ0UsICd0ZXN0IGFjdGlvbicsICd0ZXN0IHN0YWdlJyk7XG4gICAgICBleHBlY3QocmVzdWx0Lmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ211c3QgYmUgc291cmNlIGFuZCBpcyBub3Qgc291cmNlJywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gdmFsaWRhdGlvbnMudmFsaWRhdGVTb3VyY2VBY3Rpb24odHJ1ZSwgY29kZXBpcGVsaW5lLkFjdGlvbkNhdGVnb3J5LkRFUExPWSwgJ3Rlc3QgYWN0aW9uJywgJ3Rlc3Qgc3RhZ2UnKTtcbiAgICAgIGV4cGVjdChyZXN1bHQubGVuZ3RoKS50b0VxdWFsKDEpO1xuICAgICAgZXhwZWN0KHJlc3VsdFswXSkudG9NYXRjaCgvbWF5IG9ubHkgY29udGFpbiBTb3VyY2UgYWN0aW9ucy8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY2Fubm90IGJlIHNvdXJjZSBhbmQgaXMgc291cmNlJywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gdmFsaWRhdGlvbnMudmFsaWRhdGVTb3VyY2VBY3Rpb24oZmFsc2UsIGNvZGVwaXBlbGluZS5BY3Rpb25DYXRlZ29yeS5TT1VSQ0UsICd0ZXN0IGFjdGlvbicsICd0ZXN0IHN0YWdlJyk7XG4gICAgICBleHBlY3QocmVzdWx0Lmxlbmd0aCkudG9FcXVhbCgxKTtcbiAgICAgIGV4cGVjdChyZXN1bHRbMF0pLnRvTWF0Y2goL21heSBvbmx5IG9jY3VyIGluIGZpcnN0IHN0YWdlLyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjYW5ub3QgYmUgc291cmNlIGFuZCBpcyBub3Qgc291cmNlJywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gdmFsaWRhdGlvbnMudmFsaWRhdGVTb3VyY2VBY3Rpb24oZmFsc2UsIGNvZGVwaXBlbGluZS5BY3Rpb25DYXRlZ29yeS5ERVBMT1ksICd0ZXN0IGFjdGlvbicsICd0ZXN0IHN0YWdlJyk7XG4gICAgICBleHBlY3QocmVzdWx0Lmxlbmd0aCkudG9FcXVhbCgwKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2FjdGlvbiBuYW1lIHZhbGlkYXRpb24nLCAoKSA9PiB7XG4gICAgdGVzdCgndGhyb3dzIGFuIGV4Y2VwdGlvbiB3aGVuIGFkZGluZyBhbiBBY3Rpb24gd2l0aCBhbiBlbXB0eSBuYW1lIHRvIHRoZSBQaXBlbGluZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgYWN0aW9uID0gbmV3IEZha2VTb3VyY2VBY3Rpb24oe1xuICAgICAgICBhY3Rpb25OYW1lOiAnJyxcbiAgICAgICAgb3V0cHV0OiBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCksXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgcGlwZWxpbmUgPSBuZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHN0YWNrLCAnUGlwZWxpbmUnKTtcbiAgICAgIGNvbnN0IHN0YWdlID0gcGlwZWxpbmUuYWRkU3RhZ2UoeyBzdGFnZU5hbWU6ICdTb3VyY2UnIH0pO1xuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgc3RhZ2UuYWRkQWN0aW9uKGFjdGlvbik7XG4gICAgICB9KS50b1Rocm93KC9BY3Rpb24gbmFtZSBtdXN0IG1hdGNoIHJlZ3VsYXIgZXhwcmVzc2lvbjovKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2FjdGlvbiBBcnRpZmFjdHMgdmFsaWRhdGlvbicsICgpID0+IHtcbiAgICB0ZXN0KCd2YWxpZGF0ZXMgdGhhdCBpbnB1dCBBcnRpZmFjdHMgYXJlIHdpdGhpbiBib3VuZHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHNvdXJjZU91dHB1dCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoKTtcbiAgICAgIGNvbnN0IGV4dHJhT3V0cHV0MSA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoJ0ExJyk7XG4gICAgICBjb25zdCBleHRyYU91dHB1dDIgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCdBMicpO1xuICAgICAgY29uc3QgZXh0cmFPdXRwdXQzID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgnQTMnKTtcblxuICAgICAgbmV3IGNvZGVwaXBlbGluZS5QaXBlbGluZShzdGFjaywgJ1BpcGVsaW5lJywge1xuICAgICAgICBzdGFnZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdGFnZU5hbWU6ICdTb3VyY2UnLFxuICAgICAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgICAgICBuZXcgRmFrZVNvdXJjZUFjdGlvbih7XG4gICAgICAgICAgICAgICAgYWN0aW9uTmFtZTogJ1NvdXJjZScsXG4gICAgICAgICAgICAgICAgb3V0cHV0OiBzb3VyY2VPdXRwdXQsXG4gICAgICAgICAgICAgICAgZXh0cmFPdXRwdXRzOiBbXG4gICAgICAgICAgICAgICAgICBleHRyYU91dHB1dDEsXG4gICAgICAgICAgICAgICAgICBleHRyYU91dHB1dDIsXG4gICAgICAgICAgICAgICAgICBleHRyYU91dHB1dDMsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3RhZ2VOYW1lOiAnQnVpbGQnLFxuICAgICAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgICAgICBuZXcgRmFrZUJ1aWxkQWN0aW9uKHtcbiAgICAgICAgICAgICAgICBhY3Rpb25OYW1lOiAnQnVpbGQnLFxuICAgICAgICAgICAgICAgIGlucHV0OiBzb3VyY2VPdXRwdXQsXG4gICAgICAgICAgICAgICAgZXh0cmFJbnB1dHM6IFtcbiAgICAgICAgICAgICAgICAgIGV4dHJhT3V0cHV0MSxcbiAgICAgICAgICAgICAgICAgIGV4dHJhT3V0cHV0MixcbiAgICAgICAgICAgICAgICAgIGV4dHJhT3V0cHV0MyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlUGlwZWxpbmU6OlBpcGVsaW5lJywge1xuICAgICAgICB9KTtcbiAgICAgIH0pLnRvVGhyb3coL0J1aWxkXFwvRmFrZSBjYW5ub3QgaGF2ZSBtb3JlIHRoYW4gMyBpbnB1dCBhcnRpZmFjdHMvKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3ZhbGlkYXRlcyB0aGF0IG91dHB1dCBBcnRpZmFjdHMgYXJlIHdpdGhpbiBib3VuZHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHNvdXJjZU91dHB1dCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoKTtcbiAgICAgIGNvbnN0IGV4dHJhT3V0cHV0MSA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoJ0ExJyk7XG4gICAgICBjb25zdCBleHRyYU91dHB1dDIgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCdBMicpO1xuICAgICAgY29uc3QgZXh0cmFPdXRwdXQzID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgnQTMnKTtcbiAgICAgIGNvbnN0IGV4dHJhT3V0cHV0NCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoJ0E0Jyk7XG5cbiAgICAgIG5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUoc3RhY2ssICdQaXBlbGluZScsIHtcbiAgICAgICAgc3RhZ2VzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3RhZ2VOYW1lOiAnU291cmNlJyxcbiAgICAgICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAgICAgbmV3IEZha2VTb3VyY2VBY3Rpb24oe1xuICAgICAgICAgICAgICAgIGFjdGlvbk5hbWU6ICdTb3VyY2UnLFxuICAgICAgICAgICAgICAgIG91dHB1dDogc291cmNlT3V0cHV0LFxuICAgICAgICAgICAgICAgIGV4dHJhT3V0cHV0czogW1xuICAgICAgICAgICAgICAgICAgZXh0cmFPdXRwdXQxLFxuICAgICAgICAgICAgICAgICAgZXh0cmFPdXRwdXQyLFxuICAgICAgICAgICAgICAgICAgZXh0cmFPdXRwdXQzLFxuICAgICAgICAgICAgICAgICAgZXh0cmFPdXRwdXQ0LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHN0YWdlTmFtZTogJ0J1aWxkJyxcbiAgICAgICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAgICAgbmV3IEZha2VCdWlsZEFjdGlvbih7XG4gICAgICAgICAgICAgICAgYWN0aW9uTmFtZTogJ0J1aWxkJyxcbiAgICAgICAgICAgICAgICBpbnB1dDogc291cmNlT3V0cHV0LFxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlUGlwZWxpbmU6OlBpcGVsaW5lJywge1xuICAgICAgICB9KTtcbiAgICAgIH0pLnRvVGhyb3coL1NvdXJjZVxcL0Zha2UgY2Fubm90IGhhdmUgbW9yZSB0aGFuIDQgb3V0cHV0IGFydGlmYWN0cy8pO1xuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdhdXRvbWF0aWNhbGx5IGFzc2lnbnMgYXJ0aWZhY3QgbmFtZXMgdG8gdGhlIEFjdGlvbnMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgcGlwZWxpbmUgPSBuZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHN0YWNrLCAncGlwZWxpbmUnKTtcblxuICAgIGNvbnN0IHNvdXJjZU91dHB1dCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoKTtcbiAgICBjb25zdCBzb3VyY2VBY3Rpb24gPSBuZXcgRmFrZVNvdXJjZUFjdGlvbih7XG4gICAgICBhY3Rpb25OYW1lOiAnQ29kZUNvbW1pdCcsXG4gICAgICBvdXRwdXQ6IHNvdXJjZU91dHB1dCxcbiAgICB9KTtcbiAgICBwaXBlbGluZS5hZGRTdGFnZSh7XG4gICAgICBzdGFnZU5hbWU6ICdTb3VyY2UnLFxuICAgICAgYWN0aW9uczogW3NvdXJjZUFjdGlvbl0sXG4gICAgfSk7XG5cbiAgICBwaXBlbGluZS5hZGRTdGFnZSh7XG4gICAgICBzdGFnZU5hbWU6ICdCdWlsZCcsXG4gICAgICBhY3Rpb25zOiBbXG4gICAgICAgIG5ldyBGYWtlQnVpbGRBY3Rpb24oe1xuICAgICAgICAgIGFjdGlvbk5hbWU6ICdDb2RlQnVpbGQnLFxuICAgICAgICAgIGlucHV0OiBzb3VyY2VPdXRwdXQsXG4gICAgICAgICAgb3V0cHV0OiBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCksXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVQaXBlbGluZTo6UGlwZWxpbmUnLCB7XG4gICAgICAnU3RhZ2VzJzogW1xuICAgICAgICB7XG4gICAgICAgICAgJ05hbWUnOiAnU291cmNlJyxcbiAgICAgICAgICAnQWN0aW9ucyc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ05hbWUnOiAnQ29kZUNvbW1pdCcsXG4gICAgICAgICAgICAgICdPdXRwdXRBcnRpZmFjdHMnOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ05hbWUnOiAnQXJ0aWZhY3RfU291cmNlX0NvZGVDb21taXQnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAnTmFtZSc6ICdCdWlsZCcsXG4gICAgICAgICAgJ0FjdGlvbnMnOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdOYW1lJzogJ0NvZGVCdWlsZCcsXG4gICAgICAgICAgICAgICdJbnB1dEFydGlmYWN0cyc6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnTmFtZSc6ICdBcnRpZmFjdF9Tb3VyY2VfQ29kZUNvbW1pdCcsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgJ091dHB1dEFydGlmYWN0cyc6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnTmFtZSc6ICdBcnRpZmFjdF9CdWlsZF9Db2RlQnVpbGQnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd0aGUgc2FtZSBBY3Rpb24gY2FuIGJlIHNhZmVseSBhZGRlZCB0byAyIGRpZmZlcmVudCBTdGFnZXMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBjb25zdCBzb3VyY2VPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCk7XG4gICAgY29uc3QgcGlwZWxpbmUgPSBuZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHN0YWNrLCAnUGlwZWxpbmUnLCB7XG4gICAgICBzdGFnZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHN0YWdlTmFtZTogJ1NvdXJjZScsXG4gICAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgICAgbmV3IEZha2VTb3VyY2VBY3Rpb24oe1xuICAgICAgICAgICAgICBhY3Rpb25OYW1lOiAnU291cmNlJyxcbiAgICAgICAgICAgICAgb3V0cHV0OiBzb3VyY2VPdXRwdXQsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGFjdGlvbiA9IG5ldyBGYWtlQnVpbGRBY3Rpb24oeyBhY3Rpb25OYW1lOiAnRmFrZUFjdGlvbicsIGlucHV0OiBzb3VyY2VPdXRwdXQgfSk7XG4gICAgY29uc3Qgc3RhZ2UyOiBjb2RlcGlwZWxpbmUuU3RhZ2VQcm9wcyA9IHtcbiAgICAgIHN0YWdlTmFtZTogJ1N0YWdlMicsXG4gICAgICBhY3Rpb25zOiBbYWN0aW9uXSxcbiAgICB9O1xuICAgIGNvbnN0IHN0YWdlMzogY29kZXBpcGVsaW5lLlN0YWdlUHJvcHMgPSB7XG4gICAgICBzdGFnZU5hbWU6ICdTdGFnZTMnLFxuICAgICAgYWN0aW9uczogW2FjdGlvbl0sXG4gICAgfTtcblxuICAgIHBpcGVsaW5lLmFkZFN0YWdlKHN0YWdlMik7XG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIHBpcGVsaW5lLmFkZFN0YWdlKHN0YWdlMyk7XG4gICAgfSkubm90LnRvVGhyb3coL0Zha2VBY3Rpb24vKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2lucHV0IEFydGlmYWN0cycsICgpID0+IHtcbiAgICB0ZXN0KCdjYW4gYmUgYWRkZWQgbXVsdGlwbGUgdGltZXMgdG8gYW4gQWN0aW9uIHNhZmVseScsICgpID0+IHtcbiAgICAgIGNvbnN0IGFydGlmYWN0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgnU29tZUFydGlmYWN0Jyk7XG5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIG5ldyBGYWtlQnVpbGRBY3Rpb24oe1xuICAgICAgICAgIGFjdGlvbk5hbWU6ICdDb2RlQnVpbGQnLFxuICAgICAgICAgIGlucHV0OiBhcnRpZmFjdCxcbiAgICAgICAgICBleHRyYUlucHV0czogW2FydGlmYWN0XSxcbiAgICAgICAgfSk7XG4gICAgICB9KS5ub3QudG9UaHJvdygpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY2FuIGhhdmUgZHVwbGljYXRlIG5hbWVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgYXJ0aWZhY3QxID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgnU29tZUFydGlmYWN0Jyk7XG4gICAgICBjb25zdCBhcnRpZmFjdDIgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCdTb21lQXJ0aWZhY3QnKTtcblxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgbmV3IEZha2VCdWlsZEFjdGlvbih7XG4gICAgICAgICAgYWN0aW9uTmFtZTogJ0NvZGVCdWlsZCcsXG4gICAgICAgICAgaW5wdXQ6IGFydGlmYWN0MSxcbiAgICAgICAgICBleHRyYUlucHV0czogW2FydGlmYWN0Ml0sXG4gICAgICAgIH0pO1xuICAgICAgfSkubm90LnRvVGhyb3coKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ291dHB1dCBBcnRpZmFjdHMnLCAoKSA9PiB7XG4gICAgdGVzdCgnYWNjZXB0IG11bHRpcGxlIEFydGlmYWN0cyB3aXRoIHRoZSBzYW1lIG5hbWUgc2FmZWx5JywgKCkgPT4ge1xuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgbmV3IEZha2VTb3VyY2VBY3Rpb24oe1xuICAgICAgICAgIGFjdGlvbk5hbWU6ICdDb2RlQnVpbGQnLFxuICAgICAgICAgIG91dHB1dDogbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgnQXJ0aWZhY3QxJyksXG4gICAgICAgICAgZXh0cmFPdXRwdXRzOiBbXG4gICAgICAgICAgICBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCdBcnRpZmFjdDEnKSxcbiAgICAgICAgICAgIG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoJ0FydGlmYWN0MScpLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0pO1xuICAgICAgfSkubm90LnRvVGhyb3coKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYW4gQWN0aW9uIHdpdGggYSBub24tQVdTIG93bmVyIGNhbm5vdCBoYXZlIGEgUm9sZSBwYXNzZWQgZm9yIGl0JywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgY29uc3Qgc291cmNlT3V0cHV0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpO1xuICAgIGNvbnN0IHBpcGVsaW5lID0gbmV3IGNvZGVwaXBlbGluZS5QaXBlbGluZShzdGFjaywgJ1BpcGVsaW5lJywge1xuICAgICAgc3RhZ2VzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzdGFnZU5hbWU6ICdTb3VyY2UnLFxuICAgICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAgIG5ldyBGYWtlU291cmNlQWN0aW9uKHtcbiAgICAgICAgICAgICAgYWN0aW9uTmFtZTogJ3NvdXJjZScsXG4gICAgICAgICAgICAgIG91dHB1dDogc291cmNlT3V0cHV0LFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gICAgY29uc3QgYnVpbGRTdGFnZSA9IHBpcGVsaW5lLmFkZFN0YWdlKHsgc3RhZ2VOYW1lOiAnQnVpbGQnIH0pO1xuXG4gICAgLy8gY29uc3RydWN0aW5nIGl0IGlzIGZpbmVcbiAgICBjb25zdCBidWlsZEFjdGlvbiA9IG5ldyBGYWtlQnVpbGRBY3Rpb24oe1xuICAgICAgYWN0aW9uTmFtZTogJ2J1aWxkJyxcbiAgICAgIGlucHV0OiBzb3VyY2VPdXRwdXQsXG4gICAgICBvd25lcjogJ1RoaXJkUGFydHknLFxuICAgICAgcm9sZTogbmV3IGlhbS5Sb2xlKHN0YWNrLCAnUm9sZScsIHtcbiAgICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLkFueVByaW5jaXBhbCgpLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBhbiBhdHRlbXB0IHRvIGFkZCBpdCB0byB0aGUgUGlwZWxpbmUgaXMgd2hlcmUgdGhpbmdzIGJsb3cgdXBcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgYnVpbGRTdGFnZS5hZGRBY3Rpb24oYnVpbGRBY3Rpb24pO1xuICAgIH0pLnRvVGhyb3coL1JvbGUgaXMgbm90IHN1cHBvcnRlZCBmb3IgYWN0aW9ucyB3aXRoIGFuIG93bmVyIGRpZmZlcmVudCB0aGFuICdBV1MnIC0gZ290ICdUaGlyZFBhcnR5JyBcXChBY3Rpb246ICdidWlsZCcgaW4gU3RhZ2U6ICdCdWlsZCdcXCkvKTtcbiAgfSk7XG5cbiAgdGVzdCgnYWN0aW9ucyBjYW4gYmUgcmV0cmlldmVkIGZyb20gc3RhZ2VzIHRoZXkgaGF2ZSBiZWVuIGFkZGVkIHRvJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgY29uc3Qgc291cmNlT3V0cHV0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpO1xuICAgIGNvbnN0IHBpcGVsaW5lID0gbmV3IGNvZGVwaXBlbGluZS5QaXBlbGluZShzdGFjaywgJ1BpcGVsaW5lJywge1xuICAgICAgc3RhZ2VzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzdGFnZU5hbWU6ICdTb3VyY2UnLFxuICAgICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAgIG5ldyBGYWtlU291cmNlQWN0aW9uKHtcbiAgICAgICAgICAgICAgYWN0aW9uTmFtZTogJ3NvdXJjZScsXG4gICAgICAgICAgICAgIG91dHB1dDogc291cmNlT3V0cHV0LFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gICAgY29uc3Qgc291cmNlU3RhZ2UgPSBwaXBlbGluZS5zdGFnZXNbMF07XG4gICAgY29uc3QgYnVpbGRTdGFnZSA9IHBpcGVsaW5lLmFkZFN0YWdlKHtcbiAgICAgIHN0YWdlTmFtZTogJ0J1aWxkJyxcbiAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgbmV3IEZha2VCdWlsZEFjdGlvbih7XG4gICAgICAgICAgYWN0aW9uTmFtZTogJ2J1aWxkMScsXG4gICAgICAgICAgaW5wdXQ6IHNvdXJjZU91dHB1dCxcbiAgICAgICAgICBydW5PcmRlcjogMTEsXG4gICAgICAgIH0pLFxuICAgICAgICBuZXcgRmFrZUJ1aWxkQWN0aW9uKHtcbiAgICAgICAgICBhY3Rpb25OYW1lOiAnYnVpbGQyJyxcbiAgICAgICAgICBpbnB1dDogc291cmNlT3V0cHV0LFxuICAgICAgICAgIHJ1bk9yZGVyOiAyLFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICBleHBlY3Qoc291cmNlU3RhZ2UuYWN0aW9ucy5sZW5ndGgpLnRvRXF1YWwoMSk7XG4gICAgZXhwZWN0KHNvdXJjZVN0YWdlLmFjdGlvbnNbMF0uYWN0aW9uUHJvcGVydGllcy5hY3Rpb25OYW1lKS50b0VxdWFsKCdzb3VyY2UnKTtcblxuICAgIGV4cGVjdChidWlsZFN0YWdlLmFjdGlvbnMubGVuZ3RoKS50b0VxdWFsKDIpO1xuICAgIGV4cGVjdChidWlsZFN0YWdlLmFjdGlvbnNbMF0uYWN0aW9uUHJvcGVydGllcy5hY3Rpb25OYW1lKS50b0VxdWFsKCdidWlsZDEnKTtcbiAgICBleHBlY3QoYnVpbGRTdGFnZS5hY3Rpb25zWzFdLmFjdGlvblByb3BlcnRpZXMuYWN0aW9uTmFtZSkudG9FcXVhbCgnYnVpbGQyJyk7XG4gIH0pO1xufSk7XG5cbmZ1bmN0aW9uIGJvdW5kc1ZhbGlkYXRpb25SZXN1bHQobnVtYmVyT2ZBcnRpZmFjdHM6IG51bWJlciwgbWluOiBudW1iZXIsIG1heDogbnVtYmVyKTogc3RyaW5nW10ge1xuICBjb25zdCBhcnRpZmFjdHM6IGNvZGVwaXBlbGluZS5BcnRpZmFjdFtdID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtYmVyT2ZBcnRpZmFjdHM7IGkrKykge1xuICAgIGFydGlmYWN0cy5wdXNoKG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoYFRlc3RBcnRpZmFjdCR7aX1gKSk7XG4gIH1cbiAgcmV0dXJuIHZhbGlkYXRpb25zLnZhbGlkYXRlQXJ0aWZhY3RCb3VuZHMoJ291dHB1dCcsIGFydGlmYWN0cywgbWluLCBtYXgsICd0ZXN0Q2F0ZWdvcnknLCAndGVzdFByb3ZpZGVyJyk7XG59XG4iXX0=