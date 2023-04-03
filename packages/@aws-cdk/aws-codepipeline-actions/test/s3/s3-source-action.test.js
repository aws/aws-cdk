"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const codebuild = require("@aws-cdk/aws-codebuild");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const s3 = require("@aws-cdk/aws-s3");
const core_1 = require("@aws-cdk/core");
const cpactions = require("../../lib");
/* eslint-disable quote-props */
describe('S3 source Action', () => {
    describe('S3 Source Action', () => {
        test('by default polls for source changes and does not use Events', () => {
            const stack = new core_1.Stack();
            minimalPipeline(stack, undefined);
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', assertions_1.Match.objectLike({
                'Stages': [
                    {
                        'Actions': [
                            {
                                'Configuration': {},
                            },
                        ],
                    },
                    {},
                ],
            }));
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::Events::Rule', 0);
        });
        test('does not poll for source changes and uses Events for S3Trigger.EVENTS', () => {
            const stack = new core_1.Stack();
            minimalPipeline(stack, { trigger: cpactions.S3Trigger.EVENTS });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', assertions_1.Match.objectLike({
                'Stages': [
                    {
                        'Actions': assertions_1.Match.arrayWith([
                            assertions_1.Match.objectLike({
                                'Configuration': {
                                    'PollForSourceChanges': false,
                                },
                            }),
                        ]),
                    },
                    {},
                ],
            }));
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::Events::Rule', 1);
        });
        test('polls for source changes and does not use Events for S3Trigger.POLL', () => {
            const stack = new core_1.Stack();
            minimalPipeline(stack, { trigger: cpactions.S3Trigger.POLL });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', assertions_1.Match.objectLike({
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
            }));
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::Events::Rule', 0);
        });
        test('does not poll for source changes and does not use Events for S3Trigger.NONE', () => {
            const stack = new core_1.Stack();
            minimalPipeline(stack, { trigger: cpactions.S3Trigger.NONE });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', assertions_1.Match.objectLike({
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
            }));
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::Events::Rule', 0);
        });
        test('does not allow passing an empty string for the bucketKey property', () => {
            const stack = new core_1.Stack();
            expect(() => {
                new cpactions.S3SourceAction({
                    actionName: 'Source',
                    bucket: new s3.Bucket(stack, 'MyBucket'),
                    bucketKey: '',
                    output: new codepipeline.Artifact(),
                });
            }).toThrow(/Property bucketKey cannot be an empty string/);
        });
        test('allows using the same bucket with events trigger mutliple times with different bucket paths', () => {
            const stack = new core_1.Stack();
            const bucket = new s3.Bucket(stack, 'MyBucket');
            const sourceStage = minimalPipeline(stack, {
                bucket,
                bucketKey: 'my/path',
                trigger: cpactions.S3Trigger.EVENTS,
            });
            sourceStage.addAction(new cpactions.S3SourceAction({
                actionName: 'Source2',
                bucket,
                bucketKey: 'my/other/path',
                trigger: cpactions.S3Trigger.EVENTS,
                output: new codepipeline.Artifact(),
            }));
        });
        test('throws an error if the same bucket and path with trigger = Events are added to the same pipeline twice', () => {
            const stack = new core_1.Stack();
            const bucket = new s3.Bucket(stack, 'MyBucket');
            const sourceStage = minimalPipeline(stack, {
                bucket,
                bucketKey: 'my/path',
                trigger: cpactions.S3Trigger.EVENTS,
            });
            sourceStage.addAction(new cpactions.S3SourceAction({
                actionName: 'Source2',
                bucket,
                bucketKey: 'my/other/path',
                trigger: cpactions.S3Trigger.EVENTS,
                output: new codepipeline.Artifact(),
            }));
            const duplicateBucketAndPath = new cpactions.S3SourceAction({
                actionName: 'Source3',
                bucket,
                bucketKey: 'my/other/path',
                trigger: cpactions.S3Trigger.EVENTS,
                output: new codepipeline.Artifact(),
            });
            expect(() => {
                sourceStage.addAction(duplicateBucketAndPath);
            }).toThrow(/S3 source action with path 'my\/other\/path' is already present in the pipeline for this source bucket/);
        });
        test('allows using a Token bucketKey with trigger = Events, multiple times', () => {
            const stack = new core_1.Stack();
            const bucket = new s3.Bucket(stack, 'MyBucket');
            const sourceStage = minimalPipeline(stack, {
                bucket,
                bucketKey: core_1.Lazy.string({ produce: () => 'my-bucket-key1' }),
                trigger: cpactions.S3Trigger.EVENTS,
            });
            sourceStage.addAction(new cpactions.S3SourceAction({
                actionName: 'Source2',
                bucket,
                bucketKey: core_1.Lazy.string({ produce: () => 'my-bucket-key2' }),
                trigger: cpactions.S3Trigger.EVENTS,
                output: new codepipeline.Artifact(),
            }));
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', assertions_1.Match.objectLike({
                'Stages': assertions_1.Match.arrayWith([
                    assertions_1.Match.objectLike({
                        'Actions': [
                            {
                                'Configuration': {
                                    'S3ObjectKey': 'my-bucket-key1',
                                },
                            },
                            {
                                'Configuration': {
                                    'S3ObjectKey': 'my-bucket-key2',
                                },
                            },
                        ],
                    }),
                ]),
            }));
        });
        test('exposes variables for other actions to consume', () => {
            const stack = new core_1.Stack();
            const sourceOutput = new codepipeline.Artifact();
            const s3SourceAction = new cpactions.S3SourceAction({
                actionName: 'Source',
                output: sourceOutput,
                bucket: new s3.Bucket(stack, 'Bucket'),
                bucketKey: 'key.zip',
            });
            new codepipeline.Pipeline(stack, 'Pipeline', {
                stages: [
                    {
                        stageName: 'Source',
                        actions: [s3SourceAction],
                    },
                    {
                        stageName: 'Build',
                        actions: [
                            new cpactions.CodeBuildAction({
                                actionName: 'Build',
                                project: new codebuild.PipelineProject(stack, 'MyProject'),
                                input: sourceOutput,
                                environmentVariables: {
                                    VersionId: { value: s3SourceAction.variables.versionId },
                                },
                            }),
                        ],
                    },
                ],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', assertions_1.Match.objectLike({
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
                                    'EnvironmentVariables': '[{"name":"VersionId","type":"PLAINTEXT","value":"#{Source_Source_NS.VersionId}"}]',
                                },
                            },
                        ],
                    },
                ],
            }));
        });
    });
});
function minimalPipeline(stack, options = {}) {
    const sourceOutput = new codepipeline.Artifact();
    const pipeline = new codepipeline.Pipeline(stack, 'MyPipeline');
    const sourceStage = pipeline.addStage({
        stageName: 'Source',
        actions: [
            new cpactions.S3SourceAction({
                actionName: 'Source',
                bucket: options.bucket || new s3.Bucket(stack, 'MyBucket'),
                bucketKey: options.bucketKey || 'some/path/to',
                output: sourceOutput,
                trigger: options.trigger,
            }),
        ],
    });
    pipeline.addStage({
        stageName: 'Build',
        actions: [
            new cpactions.CodeBuildAction({
                actionName: 'Build',
                project: new codebuild.PipelineProject(stack, 'MyProject'),
                input: sourceOutput,
            }),
        ],
    });
    return sourceStage;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiczMtc291cmNlLWFjdGlvbi50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiczMtc291cmNlLWFjdGlvbi50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQXNEO0FBQ3RELG9EQUFvRDtBQUNwRCwwREFBMEQ7QUFDMUQsc0NBQXNDO0FBQ3RDLHdDQUE0QztBQUM1Qyx1Q0FBdUM7QUFFdkMsZ0NBQWdDO0FBRWhDLFFBQVEsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLEVBQUU7SUFDaEMsUUFBUSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsRUFBRTtRQUNoQyxJQUFJLENBQUMsNkRBQTZELEVBQUUsR0FBRyxFQUFFO1lBQ3ZFLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFFMUIsZUFBZSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztZQUVsQyxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyw2QkFBNkIsRUFBRSxrQkFBSyxDQUFDLFVBQVUsQ0FBQztnQkFDOUYsUUFBUSxFQUFFO29CQUNSO3dCQUNFLFNBQVMsRUFBRTs0QkFDVDtnQ0FDRSxlQUFlLEVBQUUsRUFDaEI7NkJBQ0Y7eUJBQ0Y7cUJBQ0Y7b0JBQ0QsRUFBRTtpQkFDSDthQUNGLENBQUMsQ0FBQyxDQUFDO1lBRUoscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsZUFBZSxDQUFDLG1CQUFtQixFQUFFLENBQUMsQ0FBQyxDQUFDO1FBR3BFLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLHVFQUF1RSxFQUFFLEdBQUcsRUFBRTtZQUNqRixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1lBRTFCLGVBQWUsQ0FBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1lBRWhFLHFCQUFRLENBQUMsU0FB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UyxDQUFDLGNBQWMsQ0FBQztnQkFDM0IsVUFBVSxFQUFFLFFBQVE7Z0JBQ3BCLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTSxJQUFJLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDO2dCQUMxRCxTQUFTLEVBQUUsT0FBTyxDQUFDLFNBQVMsSUFBSSxjQUFjO2dCQUM5QyxNQUFNLEVBQUUsWUFBWTtnQkFDcEIsT0FBTyxFQUFFLE9BQU8sQ0FBQyxPQUFPO2FBQ3pCLENBQUM7U0FDSDtLQUNGLENBQUMsQ0FBQztJQUNILFFBQVEsQ0FBQyxRQUFRLENBQUM7UUFDaEIsU0FBUyxFQUFFLE9BQU87UUFDbEIsT0FBTyxFQUFFO1lBQ1AsSUFBSSxTQUFTLENBQUMsZUFBZSxDQUFDO2dCQUM1QixVQUFVLEVBQUUsT0FBTztnQkFDbkIsT0FBTyxFQUFFLElBQUksU0FBUyxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDO2dCQUMxRCxLQUFLLEVBQUUsWUFBWTthQUNwQixDQUFDO1NBQ0g7S0FDRixDQUFDLENBQUM7SUFDSCxPQUFPLFdBQVcsQ0FBQztBQUNyQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUsIE1hdGNoIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBjb2RlYnVpbGQgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVidWlsZCc7XG5pbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmUgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVwaXBlbGluZSc7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICdAYXdzLWNkay9hd3MtczMnO1xuaW1wb3J0IHsgTGF6eSwgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGNwYWN0aW9ucyBmcm9tICcuLi8uLi9saWInO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBxdW90ZS1wcm9wcyAqL1xuXG5kZXNjcmliZSgnUzMgc291cmNlIEFjdGlvbicsICgpID0+IHtcbiAgZGVzY3JpYmUoJ1MzIFNvdXJjZSBBY3Rpb24nLCAoKSA9PiB7XG4gICAgdGVzdCgnYnkgZGVmYXVsdCBwb2xscyBmb3Igc291cmNlIGNoYW5nZXMgYW5kIGRvZXMgbm90IHVzZSBFdmVudHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgICBtaW5pbWFsUGlwZWxpbmUoc3RhY2ssIHVuZGVmaW5lZCk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVQaXBlbGluZTo6UGlwZWxpbmUnLCBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgJ1N0YWdlcyc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnQWN0aW9ucyc6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdDb25maWd1cmF0aW9uJzoge1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge30sXG4gICAgICAgIF0sXG4gICAgICB9KSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkV2ZW50czo6UnVsZScsIDApO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ2RvZXMgbm90IHBvbGwgZm9yIHNvdXJjZSBjaGFuZ2VzIGFuZCB1c2VzIEV2ZW50cyBmb3IgUzNUcmlnZ2VyLkVWRU5UUycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAgIG1pbmltYWxQaXBlbGluZShzdGFjaywgeyB0cmlnZ2VyOiBjcGFjdGlvbnMuUzNUcmlnZ2VyLkVWRU5UUyB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZVBpcGVsaW5lOjpQaXBlbGluZScsIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAnU3RhZ2VzJzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgICdBY3Rpb25zJzogTWF0Y2guYXJyYXlXaXRoKFtcbiAgICAgICAgICAgICAgTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgICAgICAgJ0NvbmZpZ3VyYXRpb24nOiB7XG4gICAgICAgICAgICAgICAgICAnUG9sbEZvclNvdXJjZUNoYW5nZXMnOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIF0pLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge30sXG4gICAgICAgIF0sXG4gICAgICB9KSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkV2ZW50czo6UnVsZScsIDEpO1xuXG5cbiAgICB9KTtcblxuICAgIHRlc3QoJ3BvbGxzIGZvciBzb3VyY2UgY2hhbmdlcyBhbmQgZG9lcyBub3QgdXNlIEV2ZW50cyBmb3IgUzNUcmlnZ2VyLlBPTEwnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgICBtaW5pbWFsUGlwZWxpbmUoc3RhY2ssIHsgdHJpZ2dlcjogY3BhY3Rpb25zLlMzVHJpZ2dlci5QT0xMIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlUGlwZWxpbmU6OlBpcGVsaW5lJywgTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICdTdGFnZXMnOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ0FjdGlvbnMnOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnQ29uZmlndXJhdGlvbic6IHtcbiAgICAgICAgICAgICAgICAgICdQb2xsRm9yU291cmNlQ2hhbmdlcyc6IHRydWUsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7fSxcbiAgICAgICAgXSxcbiAgICAgIH0pKTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RXZlbnRzOjpSdWxlJywgMCk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnZG9lcyBub3QgcG9sbCBmb3Igc291cmNlIGNoYW5nZXMgYW5kIGRvZXMgbm90IHVzZSBFdmVudHMgZm9yIFMzVHJpZ2dlci5OT05FJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgICAgbWluaW1hbFBpcGVsaW5lKHN0YWNrLCB7IHRyaWdnZXI6IGNwYWN0aW9ucy5TM1RyaWdnZXIuTk9ORSB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZVBpcGVsaW5lOjpQaXBlbGluZScsIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAnU3RhZ2VzJzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgICdBY3Rpb25zJzogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ0NvbmZpZ3VyYXRpb24nOiB7XG4gICAgICAgICAgICAgICAgICAnUG9sbEZvclNvdXJjZUNoYW5nZXMnOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHt9LFxuICAgICAgICBdLFxuICAgICAgfSkpO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFdmVudHM6OlJ1bGUnLCAwKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2RvZXMgbm90IGFsbG93IHBhc3NpbmcgYW4gZW1wdHkgc3RyaW5nIGZvciB0aGUgYnVja2V0S2V5IHByb3BlcnR5JywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgbmV3IGNwYWN0aW9ucy5TM1NvdXJjZUFjdGlvbih7XG4gICAgICAgICAgYWN0aW9uTmFtZTogJ1NvdXJjZScsXG4gICAgICAgICAgYnVja2V0OiBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnKSxcbiAgICAgICAgICBidWNrZXRLZXk6ICcnLFxuICAgICAgICAgIG91dHB1dDogbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpLFxuICAgICAgICB9KTtcbiAgICAgIH0pLnRvVGhyb3coL1Byb3BlcnR5IGJ1Y2tldEtleSBjYW5ub3QgYmUgYW4gZW1wdHkgc3RyaW5nLyk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgnYWxsb3dzIHVzaW5nIHRoZSBzYW1lIGJ1Y2tldCB3aXRoIGV2ZW50cyB0cmlnZ2VyIG11dGxpcGxlIHRpbWVzIHdpdGggZGlmZmVyZW50IGJ1Y2tldCBwYXRocycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcpO1xuICAgICAgY29uc3Qgc291cmNlU3RhZ2UgPSBtaW5pbWFsUGlwZWxpbmUoc3RhY2ssIHtcbiAgICAgICAgYnVja2V0LFxuICAgICAgICBidWNrZXRLZXk6ICdteS9wYXRoJyxcbiAgICAgICAgdHJpZ2dlcjogY3BhY3Rpb25zLlMzVHJpZ2dlci5FVkVOVFMsXG4gICAgICB9KTtcbiAgICAgIHNvdXJjZVN0YWdlLmFkZEFjdGlvbihuZXcgY3BhY3Rpb25zLlMzU291cmNlQWN0aW9uKHtcbiAgICAgICAgYWN0aW9uTmFtZTogJ1NvdXJjZTInLFxuICAgICAgICBidWNrZXQsXG4gICAgICAgIGJ1Y2tldEtleTogJ215L290aGVyL3BhdGgnLFxuICAgICAgICB0cmlnZ2VyOiBjcGFjdGlvbnMuUzNUcmlnZ2VyLkVWRU5UUyxcbiAgICAgICAgb3V0cHV0OiBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCksXG4gICAgICB9KSk7XG5cblxuICAgIH0pO1xuXG4gICAgdGVzdCgndGhyb3dzIGFuIGVycm9yIGlmIHRoZSBzYW1lIGJ1Y2tldCBhbmQgcGF0aCB3aXRoIHRyaWdnZXIgPSBFdmVudHMgYXJlIGFkZGVkIHRvIHRoZSBzYW1lIHBpcGVsaW5lIHR3aWNlJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgICAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0Jyk7XG4gICAgICBjb25zdCBzb3VyY2VTdGFnZSA9IG1pbmltYWxQaXBlbGluZShzdGFjaywge1xuICAgICAgICBidWNrZXQsXG4gICAgICAgIGJ1Y2tldEtleTogJ215L3BhdGgnLFxuICAgICAgICB0cmlnZ2VyOiBjcGFjdGlvbnMuUzNUcmlnZ2VyLkVWRU5UUyxcbiAgICAgIH0pO1xuICAgICAgc291cmNlU3RhZ2UuYWRkQWN0aW9uKG5ldyBjcGFjdGlvbnMuUzNTb3VyY2VBY3Rpb24oe1xuICAgICAgICBhY3Rpb25OYW1lOiAnU291cmNlMicsXG4gICAgICAgIGJ1Y2tldCxcbiAgICAgICAgYnVja2V0S2V5OiAnbXkvb3RoZXIvcGF0aCcsXG4gICAgICAgIHRyaWdnZXI6IGNwYWN0aW9ucy5TM1RyaWdnZXIuRVZFTlRTLFxuICAgICAgICBvdXRwdXQ6IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoKSxcbiAgICAgIH0pKTtcblxuICAgICAgY29uc3QgZHVwbGljYXRlQnVja2V0QW5kUGF0aCA9IG5ldyBjcGFjdGlvbnMuUzNTb3VyY2VBY3Rpb24oe1xuICAgICAgICBhY3Rpb25OYW1lOiAnU291cmNlMycsXG4gICAgICAgIGJ1Y2tldCxcbiAgICAgICAgYnVja2V0S2V5OiAnbXkvb3RoZXIvcGF0aCcsXG4gICAgICAgIHRyaWdnZXI6IGNwYWN0aW9ucy5TM1RyaWdnZXIuRVZFTlRTLFxuICAgICAgICBvdXRwdXQ6IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoKSxcbiAgICAgIH0pO1xuXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBzb3VyY2VTdGFnZS5hZGRBY3Rpb24oZHVwbGljYXRlQnVja2V0QW5kUGF0aCk7XG4gICAgICB9KS50b1Rocm93KC9TMyBzb3VyY2UgYWN0aW9uIHdpdGggcGF0aCAnbXlcXC9vdGhlclxcL3BhdGgnIGlzIGFscmVhZHkgcHJlc2VudCBpbiB0aGUgcGlwZWxpbmUgZm9yIHRoaXMgc291cmNlIGJ1Y2tldC8pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYWxsb3dzIHVzaW5nIGEgVG9rZW4gYnVja2V0S2V5IHdpdGggdHJpZ2dlciA9IEV2ZW50cywgbXVsdGlwbGUgdGltZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnKTtcbiAgICAgIGNvbnN0IHNvdXJjZVN0YWdlID0gbWluaW1hbFBpcGVsaW5lKHN0YWNrLCB7XG4gICAgICAgIGJ1Y2tldCxcbiAgICAgICAgYnVja2V0S2V5OiBMYXp5LnN0cmluZyh7IHByb2R1Y2U6ICgpID0+ICdteS1idWNrZXQta2V5MScgfSksXG4gICAgICAgIHRyaWdnZXI6IGNwYWN0aW9ucy5TM1RyaWdnZXIuRVZFTlRTLFxuICAgICAgfSk7XG4gICAgICBzb3VyY2VTdGFnZS5hZGRBY3Rpb24obmV3IGNwYWN0aW9ucy5TM1NvdXJjZUFjdGlvbih7XG4gICAgICAgIGFjdGlvbk5hbWU6ICdTb3VyY2UyJyxcbiAgICAgICAgYnVja2V0LFxuICAgICAgICBidWNrZXRLZXk6IExhenkuc3RyaW5nKHsgcHJvZHVjZTogKCkgPT4gJ215LWJ1Y2tldC1rZXkyJyB9KSxcbiAgICAgICAgdHJpZ2dlcjogY3BhY3Rpb25zLlMzVHJpZ2dlci5FVkVOVFMsXG4gICAgICAgIG91dHB1dDogbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpLFxuICAgICAgfSkpO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlUGlwZWxpbmU6OlBpcGVsaW5lJywgTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICdTdGFnZXMnOiBNYXRjaC5hcnJheVdpdGgoW1xuICAgICAgICAgIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgICAgJ0FjdGlvbnMnOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnQ29uZmlndXJhdGlvbic6IHtcbiAgICAgICAgICAgICAgICAgICdTM09iamVjdEtleSc6ICdteS1idWNrZXQta2V5MScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdDb25maWd1cmF0aW9uJzoge1xuICAgICAgICAgICAgICAgICAgJ1MzT2JqZWN0S2V5JzogJ215LWJ1Y2tldC1rZXkyJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgXSksXG4gICAgICB9KSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdleHBvc2VzIHZhcmlhYmxlcyBmb3Igb3RoZXIgYWN0aW9ucyB0byBjb25zdW1lJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgICAgY29uc3Qgc291cmNlT3V0cHV0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpO1xuICAgICAgY29uc3QgczNTb3VyY2VBY3Rpb24gPSBuZXcgY3BhY3Rpb25zLlMzU291cmNlQWN0aW9uKHtcbiAgICAgICAgYWN0aW9uTmFtZTogJ1NvdXJjZScsXG4gICAgICAgIG91dHB1dDogc291cmNlT3V0cHV0LFxuICAgICAgICBidWNrZXQ6IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdCdWNrZXQnKSxcbiAgICAgICAgYnVja2V0S2V5OiAna2V5LnppcCcsXG4gICAgICB9KTtcbiAgICAgIG5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUoc3RhY2ssICdQaXBlbGluZScsIHtcbiAgICAgICAgc3RhZ2VzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3RhZ2VOYW1lOiAnU291cmNlJyxcbiAgICAgICAgICAgIGFjdGlvbnM6IFtzM1NvdXJjZUFjdGlvbl0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdGFnZU5hbWU6ICdCdWlsZCcsXG4gICAgICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgICAgIG5ldyBjcGFjdGlvbnMuQ29kZUJ1aWxkQWN0aW9uKHtcbiAgICAgICAgICAgICAgICBhY3Rpb25OYW1lOiAnQnVpbGQnLFxuICAgICAgICAgICAgICAgIHByb2plY3Q6IG5ldyBjb2RlYnVpbGQuUGlwZWxpbmVQcm9qZWN0KHN0YWNrLCAnTXlQcm9qZWN0JyksXG4gICAgICAgICAgICAgICAgaW5wdXQ6IHNvdXJjZU91dHB1dCxcbiAgICAgICAgICAgICAgICBlbnZpcm9ubWVudFZhcmlhYmxlczoge1xuICAgICAgICAgICAgICAgICAgVmVyc2lvbklkOiB7IHZhbHVlOiBzM1NvdXJjZUFjdGlvbi52YXJpYWJsZXMudmVyc2lvbklkIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZVBpcGVsaW5lOjpQaXBlbGluZScsIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAnU3RhZ2VzJzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgICdOYW1lJzogJ1NvdXJjZScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnTmFtZSc6ICdCdWlsZCcsXG4gICAgICAgICAgICAnQWN0aW9ucyc6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdOYW1lJzogJ0J1aWxkJyxcbiAgICAgICAgICAgICAgICAnQ29uZmlndXJhdGlvbic6IHtcbiAgICAgICAgICAgICAgICAgICdFbnZpcm9ubWVudFZhcmlhYmxlcyc6ICdbe1wibmFtZVwiOlwiVmVyc2lvbklkXCIsXCJ0eXBlXCI6XCJQTEFJTlRFWFRcIixcInZhbHVlXCI6XCIje1NvdXJjZV9Tb3VyY2VfTlMuVmVyc2lvbklkfVwifV0nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9KSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbmludGVyZmFjZSBNaW5pbWFsUGlwZWxpbmVPcHRpb25zIHtcbiAgcmVhZG9ubHkgdHJpZ2dlcj86IGNwYWN0aW9ucy5TM1RyaWdnZXI7XG5cbiAgcmVhZG9ubHkgYnVja2V0PzogczMuSUJ1Y2tldDtcblxuICByZWFkb25seSBidWNrZXRLZXk/OiBzdHJpbmc7XG59XG5cbmZ1bmN0aW9uIG1pbmltYWxQaXBlbGluZShzdGFjazogU3RhY2ssIG9wdGlvbnM6IE1pbmltYWxQaXBlbGluZU9wdGlvbnMgPSB7fSk6IGNvZGVwaXBlbGluZS5JU3RhZ2Uge1xuICBjb25zdCBzb3VyY2VPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCk7XG4gIGNvbnN0IHBpcGVsaW5lID0gbmV3IGNvZGVwaXBlbGluZS5QaXBlbGluZShzdGFjaywgJ015UGlwZWxpbmUnKTtcbiAgY29uc3Qgc291cmNlU3RhZ2UgPSBwaXBlbGluZS5hZGRTdGFnZSh7XG4gICAgc3RhZ2VOYW1lOiAnU291cmNlJyxcbiAgICBhY3Rpb25zOiBbXG4gICAgICBuZXcgY3BhY3Rpb25zLlMzU291cmNlQWN0aW9uKHtcbiAgICAgICAgYWN0aW9uTmFtZTogJ1NvdXJjZScsXG4gICAgICAgIGJ1Y2tldDogb3B0aW9ucy5idWNrZXQgfHwgbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0JyksXG4gICAgICAgIGJ1Y2tldEtleTogb3B0aW9ucy5idWNrZXRLZXkgfHwgJ3NvbWUvcGF0aC90bycsXG4gICAgICAgIG91dHB1dDogc291cmNlT3V0cHV0LFxuICAgICAgICB0cmlnZ2VyOiBvcHRpb25zLnRyaWdnZXIsXG4gICAgICB9KSxcbiAgICBdLFxuICB9KTtcbiAgcGlwZWxpbmUuYWRkU3RhZ2Uoe1xuICAgIHN0YWdlTmFtZTogJ0J1aWxkJyxcbiAgICBhY3Rpb25zOiBbXG4gICAgICBuZXcgY3BhY3Rpb25zLkNvZGVCdWlsZEFjdGlvbih7XG4gICAgICAgIGFjdGlvbk5hbWU6ICdCdWlsZCcsXG4gICAgICAgIHByb2plY3Q6IG5ldyBjb2RlYnVpbGQuUGlwZWxpbmVQcm9qZWN0KHN0YWNrLCAnTXlQcm9qZWN0JyksXG4gICAgICAgIGlucHV0OiBzb3VyY2VPdXRwdXQsXG4gICAgICB9KSxcbiAgICBdLFxuICB9KTtcbiAgcmV0dXJuIHNvdXJjZVN0YWdlO1xufVxuIl19