"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const codebuild = require("@aws-cdk/aws-codebuild");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const ecr = require("@aws-cdk/aws-ecr");
const core_1 = require("@aws-cdk/core");
const cpactions = require("../../lib");
/* eslint-disable quote-props */
describe('ecr source action', () => {
    describe('ECR source Action', () => {
        test('exposes variables for other actions to consume', () => {
            const stack = new core_1.Stack();
            const sourceOutput = new codepipeline.Artifact();
            const ecrSourceAction = new cpactions.EcrSourceAction({
                actionName: 'Source',
                output: sourceOutput,
                repository: ecr.Repository.fromRepositoryName(stack, 'Repo', 'repo'),
            });
            new codepipeline.Pipeline(stack, 'Pipeline', {
                stages: [
                    {
                        stageName: 'Source',
                        actions: [ecrSourceAction],
                    },
                    {
                        stageName: 'Build',
                        actions: [
                            new cpactions.CodeBuildAction({
                                actionName: 'Build',
                                project: new codebuild.PipelineProject(stack, 'MyProject'),
                                input: sourceOutput,
                                environmentVariables: {
                                    ImageDigest: { value: ecrSourceAction.variables.imageDigest },
                                },
                            }),
                        ],
                    },
                ],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
                'Stages': assertions_1.Match.arrayWith([
                    assertions_1.Match.objectLike({
                        'Name': 'Source',
                    }),
                    assertions_1.Match.objectLike({
                        'Name': 'Build',
                        'Actions': assertions_1.Match.arrayWith([
                            assertions_1.Match.objectLike({
                                'Name': 'Build',
                                'Configuration': {
                                    'EnvironmentVariables': '[{"name":"ImageDigest","type":"PLAINTEXT","value":"#{Source_Source_NS.ImageDigest}"}]',
                                },
                            }),
                        ]),
                    }),
                ]),
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
                'EventPattern': {
                    'detail': {
                        'result': ['SUCCESS'],
                        'repository-name': ['repo'],
                        'image-tag': ['latest'],
                        'action-type': ['PUSH'],
                    },
                },
            });
        });
        test('watches all tags when imageTag provided as empty string', () => {
            const stack = new core_1.Stack();
            const sourceOutput = new codepipeline.Artifact();
            const ecrSourceAction = new cpactions.EcrSourceAction({
                actionName: 'Source',
                output: sourceOutput,
                repository: ecr.Repository.fromRepositoryName(stack, 'Repo', 'repo'),
                imageTag: '',
            });
            new codepipeline.Pipeline(stack, 'Pipeline', {
                stages: [
                    {
                        stageName: 'Source',
                        actions: [ecrSourceAction],
                    },
                    {
                        stageName: 'Build',
                        actions: [
                            new cpactions.CodeBuildAction({
                                actionName: 'Build',
                                project: new codebuild.PipelineProject(stack, 'MyProject'),
                                input: sourceOutput,
                                environmentVariables: {
                                    ImageDigest: { value: ecrSourceAction.variables.imageDigest },
                                },
                            }),
                        ],
                    },
                ],
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
                'EventPattern': {
                    'source': [
                        'aws.ecr',
                    ],
                    'detail': {
                        'result': ['SUCCESS'],
                        'repository-name': ['repo'],
                        'image-tag': [],
                        'action-type': ['PUSH'],
                    },
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
                'Stages': assertions_1.Match.arrayWith([
                    assertions_1.Match.objectLike({
                        'Name': 'Source',
                        'Actions': assertions_1.Match.arrayWith([
                            assertions_1.Match.objectLike({
                                'Name': 'Source',
                                'Configuration': {
                                    'ImageTag': assertions_1.Match.absent(),
                                },
                            }),
                        ]),
                    }),
                ]),
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNyLXNvdXJjZS1hY3Rpb24udGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVjci1zb3VyY2UtYWN0aW9uLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBc0Q7QUFDdEQsb0RBQW9EO0FBQ3BELDBEQUEwRDtBQUMxRCx3Q0FBd0M7QUFDeEMsd0NBQXNDO0FBQ3RDLHVDQUF1QztBQUV2QyxnQ0FBZ0M7QUFFaEMsUUFBUSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsRUFBRTtJQUNqQyxRQUFRLENBQUMsbUJBQW1CLEVBQUUsR0FBRyxFQUFFO1FBQ2pDLElBQUksQ0FBQyxnREFBZ0QsRUFBRSxHQUFHLEVBQUU7WUFDMUQsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUUxQixNQUFNLFlBQVksR0FBRyxJQUFJLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNqRCxNQUFNLGVBQWUsR0FBRyxJQUFJLFNBQVMsQ0FBQyxlQUFlLENBQUM7Z0JBQ3BELFVBQVUsRUFBRSxRQUFRO2dCQUNwQixNQUFNLEVBQUUsWUFBWTtnQkFDcEIsVUFBVSxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUM7YUFDckUsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7Z0JBQzNDLE1BQU0sRUFBRTtvQkFDTjt3QkFDRSxTQUFTLEVBQUUsUUFBUTt3QkFDbkIsT0FBTyxFQUFFLENBQUMsZUFBZSxDQUFDO3FCQUMzQjtvQkFDRDt3QkFDRSxTQUFTLEVBQUUsT0FBTzt3QkFDbEIsT0FBTyxFQUFFOzRCQUNQLElBQUksU0FBUyxDQUFDLGVBQWUsQ0FBQztnQ0FDNUIsVUFBVSxFQUFFLE9BQU87Z0NBQ25CLE9BQU8sRUFBRSxJQUFJLFNBQVMsQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FB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QUMsTUFBTSxDQUFDO3dCQUMzQixXQUFXLEVBQUUsRUFBRTt3QkFDZixhQUFhLEVBQUUsQ0FBQyxNQUFNLENBQUM7cUJBQ3hCO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1lBRUgscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsNkJBQTZCLEVBQUU7Z0JBQzdFLFFBQVEsRUFBRSxrQkFBSyxDQUFDLFNBQVMsQ0FBQztvQkFDeEIsa0JBQUssQ0FBQyxVQUFVLENBQUM7d0JBQ2YsTUFBTSxFQUFFLFFBQVE7d0JBQ2hCLFNBQVMsRUFBRSxrQkFBSyxDQUFDLFNBQVMsQ0FBQzs0QkFDekIsa0JBQUssQ0FBQyxVQUFVLENBQUM7Z0NBQ2YsTUFBTSxFQUFFLFFBQVE7Z0NBQ2hCLGVBQWUsRUFBRTtvQ0FDZixVQUFVLEVBQUUsa0JBQUssQ0FBQyxNQUFNLEVBQUU7aUNBQzNCOzZCQUNGLENBQUM7eUJBQ0gsQ0FBQztxQkFDSCxDQUFDO2lCQUNILENBQUM7YUFDSCxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSwgTWF0Y2ggfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGNvZGVidWlsZCBmcm9tICdAYXdzLWNkay9hd3MtY29kZWJ1aWxkJztcbmltcG9ydCAqIGFzIGNvZGVwaXBlbGluZSBmcm9tICdAYXdzLWNkay9hd3MtY29kZXBpcGVsaW5lJztcbmltcG9ydCAqIGFzIGVjciBmcm9tICdAYXdzLWNkay9hd3MtZWNyJztcbmltcG9ydCB7IFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjcGFjdGlvbnMgZnJvbSAnLi4vLi4vbGliJztcblxuLyogZXNsaW50LWRpc2FibGUgcXVvdGUtcHJvcHMgKi9cblxuZGVzY3JpYmUoJ2VjciBzb3VyY2UgYWN0aW9uJywgKCkgPT4ge1xuICBkZXNjcmliZSgnRUNSIHNvdXJjZSBBY3Rpb24nLCAoKSA9PiB7XG4gICAgdGVzdCgnZXhwb3NlcyB2YXJpYWJsZXMgZm9yIG90aGVyIGFjdGlvbnMgdG8gY29uc3VtZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAgIGNvbnN0IHNvdXJjZU91dHB1dCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoKTtcbiAgICAgIGNvbnN0IGVjclNvdXJjZUFjdGlvbiA9IG5ldyBjcGFjdGlvbnMuRWNyU291cmNlQWN0aW9uKHtcbiAgICAgICAgYWN0aW9uTmFtZTogJ1NvdXJjZScsXG4gICAgICAgIG91dHB1dDogc291cmNlT3V0cHV0LFxuICAgICAgICByZXBvc2l0b3J5OiBlY3IuUmVwb3NpdG9yeS5mcm9tUmVwb3NpdG9yeU5hbWUoc3RhY2ssICdSZXBvJywgJ3JlcG8nKSxcbiAgICAgIH0pO1xuICAgICAgbmV3IGNvZGVwaXBlbGluZS5QaXBlbGluZShzdGFjaywgJ1BpcGVsaW5lJywge1xuICAgICAgICBzdGFnZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdGFnZU5hbWU6ICdTb3VyY2UnLFxuICAgICAgICAgICAgYWN0aW9uczogW2VjclNvdXJjZUFjdGlvbl0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdGFnZU5hbWU6ICdCdWlsZCcsXG4gICAgICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgICAgIG5ldyBjcGFjdGlvbnMuQ29kZUJ1aWxkQWN0aW9uKHtcbiAgICAgICAgICAgICAgICBhY3Rpb25OYW1lOiAnQnVpbGQnLFxuICAgICAgICAgICAgICAgIHByb2plY3Q6IG5ldyBjb2RlYnVpbGQuUGlwZWxpbmVQcm9qZWN0KHN0YWNrLCAnTXlQcm9qZWN0JyksXG4gICAgICAgICAgICAgICAgaW5wdXQ6IHNvdXJjZU91dHB1dCxcbiAgICAgICAgICAgICAgICBlbnZpcm9ubWVudFZhcmlhYmxlczoge1xuICAgICAgICAgICAgICAgICAgSW1hZ2VEaWdlc3Q6IHsgdmFsdWU6IGVjclNvdXJjZUFjdGlvbi52YXJpYWJsZXMuaW1hZ2VEaWdlc3QgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlUGlwZWxpbmU6OlBpcGVsaW5lJywge1xuICAgICAgICAnU3RhZ2VzJzogTWF0Y2guYXJyYXlXaXRoKFtcbiAgICAgICAgICBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICAgICdOYW1lJzogJ1NvdXJjZScsXG4gICAgICAgICAgfSksXG4gICAgICAgICAgTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgICAnTmFtZSc6ICdCdWlsZCcsXG4gICAgICAgICAgICAnQWN0aW9ucyc6IE1hdGNoLmFycmF5V2l0aChbXG4gICAgICAgICAgICAgIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgICAgICAgICdOYW1lJzogJ0J1aWxkJyxcbiAgICAgICAgICAgICAgICAnQ29uZmlndXJhdGlvbic6IHtcbiAgICAgICAgICAgICAgICAgICdFbnZpcm9ubWVudFZhcmlhYmxlcyc6ICdbe1wibmFtZVwiOlwiSW1hZ2VEaWdlc3RcIixcInR5cGVcIjpcIlBMQUlOVEVYVFwiLFwidmFsdWVcIjpcIiN7U291cmNlX1NvdXJjZV9OUy5JbWFnZURpZ2VzdH1cIn1dJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIF0pLFxuICAgICAgICAgIH0pLFxuICAgICAgICBdKSxcbiAgICAgIH0pO1xuXG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6UnVsZScsIHtcbiAgICAgICAgJ0V2ZW50UGF0dGVybic6IHtcbiAgICAgICAgICAnZGV0YWlsJzoge1xuICAgICAgICAgICAgJ3Jlc3VsdCc6IFsnU1VDQ0VTUyddLFxuICAgICAgICAgICAgJ3JlcG9zaXRvcnktbmFtZSc6IFsncmVwbyddLFxuICAgICAgICAgICAgJ2ltYWdlLXRhZyc6IFsnbGF0ZXN0J10sXG4gICAgICAgICAgICAnYWN0aW9uLXR5cGUnOiBbJ1BVU0gnXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd3YXRjaGVzIGFsbCB0YWdzIHdoZW4gaW1hZ2VUYWcgcHJvdmlkZWQgYXMgZW1wdHkgc3RyaW5nJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgICAgY29uc3Qgc291cmNlT3V0cHV0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpO1xuICAgICAgY29uc3QgZWNyU291cmNlQWN0aW9uID0gbmV3IGNwYWN0aW9ucy5FY3JTb3VyY2VBY3Rpb24oe1xuICAgICAgICBhY3Rpb25OYW1lOiAnU291cmNlJyxcbiAgICAgICAgb3V0cHV0OiBzb3VyY2VPdXRwdXQsXG4gICAgICAgIHJlcG9zaXRvcnk6IGVjci5SZXBvc2l0b3J5LmZyb21SZXBvc2l0b3J5TmFtZShzdGFjaywgJ1JlcG8nLCAncmVwbycpLFxuICAgICAgICBpbWFnZVRhZzogJycsXG4gICAgICB9KTtcblxuICAgICAgbmV3IGNvZGVwaXBlbGluZS5QaXBlbGluZShzdGFjaywgJ1BpcGVsaW5lJywge1xuICAgICAgICBzdGFnZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdGFnZU5hbWU6ICdTb3VyY2UnLFxuICAgICAgICAgICAgYWN0aW9uczogW2VjclNvdXJjZUFjdGlvbl0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzdGFnZU5hbWU6ICdCdWlsZCcsXG4gICAgICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgICAgIG5ldyBjcGFjdGlvbnMuQ29kZUJ1aWxkQWN0aW9uKHtcbiAgICAgICAgICAgICAgICBhY3Rpb25OYW1lOiAnQnVpbGQnLFxuICAgICAgICAgICAgICAgIHByb2plY3Q6IG5ldyBjb2RlYnVpbGQuUGlwZWxpbmVQcm9qZWN0KHN0YWNrLCAnTXlQcm9qZWN0JyksXG4gICAgICAgICAgICAgICAgaW5wdXQ6IHNvdXJjZU91dHB1dCxcbiAgICAgICAgICAgICAgICBlbnZpcm9ubWVudFZhcmlhYmxlczoge1xuICAgICAgICAgICAgICAgICAgSW1hZ2VEaWdlc3Q6IHsgdmFsdWU6IGVjclNvdXJjZUFjdGlvbi52YXJpYWJsZXMuaW1hZ2VEaWdlc3QgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OlJ1bGUnLCB7XG4gICAgICAgICdFdmVudFBhdHRlcm4nOiB7XG4gICAgICAgICAgJ3NvdXJjZSc6IFtcbiAgICAgICAgICAgICdhd3MuZWNyJyxcbiAgICAgICAgICBdLFxuICAgICAgICAgICdkZXRhaWwnOiB7XG4gICAgICAgICAgICAncmVzdWx0JzogWydTVUNDRVNTJ10sXG4gICAgICAgICAgICAncmVwb3NpdG9yeS1uYW1lJzogWydyZXBvJ10sXG4gICAgICAgICAgICAnaW1hZ2UtdGFnJzogW10sXG4gICAgICAgICAgICAnYWN0aW9uLXR5cGUnOiBbJ1BVU0gnXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVQaXBlbGluZTo6UGlwZWxpbmUnLCB7XG4gICAgICAgICdTdGFnZXMnOiBNYXRjaC5hcnJheVdpdGgoW1xuICAgICAgICAgIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgICAgJ05hbWUnOiAnU291cmNlJyxcbiAgICAgICAgICAgICdBY3Rpb25zJzogTWF0Y2guYXJyYXlXaXRoKFtcbiAgICAgICAgICAgICAgTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgICAgICAgJ05hbWUnOiAnU291cmNlJyxcbiAgICAgICAgICAgICAgICAnQ29uZmlndXJhdGlvbic6IHtcbiAgICAgICAgICAgICAgICAgICdJbWFnZVRhZyc6IE1hdGNoLmFic2VudCgpLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgXSksXG4gICAgICAgICAgfSksXG4gICAgICAgIF0pLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=