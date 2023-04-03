"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const aws_s3_1 = require("@aws-cdk/aws-s3");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../../lib");
describe('elastic beanstalk deploy action tests', () => {
    test('region and account are action region and account when set', () => {
        const stack = buildPipelineStack();
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodePipeline::Pipeline', {
            Stages: [
                {
                    Actions: [
                        {
                            ActionTypeId: {
                                Category: 'Source',
                                Owner: 'AWS',
                                Provider: 'S3',
                                Version: '1',
                            },
                            Configuration: {
                                S3Bucket: {
                                    Ref: 'MyBucketF68F3FF0',
                                },
                                S3ObjectKey: 'some/path/to',
                                PollForSourceChanges: true,
                            },
                            Name: 'Source',
                            OutputArtifacts: [
                                {
                                    Name: 'Artifact_Source_Source',
                                },
                            ],
                            RoleArn: {
                                'Fn::GetAtt': [
                                    'MyPipelineSourceCodePipelineActionRoleAA05D76F',
                                    'Arn',
                                ],
                            },
                            RunOrder: 1,
                        },
                    ],
                    Name: 'Source',
                },
                {
                    Actions: [
                        {
                            ActionTypeId: {
                                Category: 'Deploy',
                                Owner: 'AWS',
                                Provider: 'ElasticBeanstalk',
                                Version: '1',
                            },
                            Configuration: {
                                ApplicationName: 'testApplication',
                                EnvironmentName: 'env-testApplication',
                            },
                            InputArtifacts: [
                                {
                                    Name: 'Artifact_Source_Source',
                                },
                            ],
                            Name: 'Deploy',
                            RoleArn: {
                                'Fn::GetAtt': [
                                    'MyPipelineDeployCodePipelineActionRole742BD48A',
                                    'Arn',
                                ],
                            },
                            RunOrder: 1,
                        },
                    ],
                    Name: 'Deploy',
                },
            ],
            ArtifactStore: {
                EncryptionKey: {
                    Id: {
                        'Fn::GetAtt': [
                            'MyPipelineArtifactsBucketEncryptionKey8BF0A7F3',
                            'Arn',
                        ],
                    },
                    Type: 'KMS',
                },
                Location: {
                    Ref: 'MyPipelineArtifactsBucket727923DD',
                },
                Type: 'S3',
            },
        });
    });
});
function buildPipelineStack() {
    const app = new core_1.App();
    const stack = new core_1.Stack(app);
    const sourceOutput = new codepipeline.Artifact();
    const pipeline = new codepipeline.Pipeline(stack, 'MyPipeline');
    pipeline.addStage({
        stageName: 'Source',
        actions: [
            new lib_1.S3SourceAction({
                actionName: 'Source',
                bucket: new aws_s3_1.Bucket(stack, 'MyBucket'),
                bucketKey: 'some/path/to',
                output: sourceOutput,
                trigger: lib_1.S3Trigger.POLL,
            }),
        ],
    });
    pipeline.addStage({
        stageName: 'Deploy',
        actions: [
            new lib_1.ElasticBeanstalkDeployAction({
                actionName: 'Deploy',
                applicationName: 'testApplication',
                environmentName: 'env-testApplication',
                input: sourceOutput,
            }),
        ],
    });
    return stack;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxhc3RpYy1iZWFuc3RhbGstZGVwbG95LWFjdGlvbi50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZWxhc3RpYy1iZWFuc3RhbGstZGVwbG95LWFjdGlvbi50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQStDO0FBQy9DLDBEQUEwRDtBQUMxRCw0Q0FBeUM7QUFDekMsd0NBQTJDO0FBQzNDLG1DQUFvRjtBQUVwRixRQUFRLENBQUMsdUNBQXVDLEVBQUUsR0FBRyxFQUFFO0lBQ3JELElBQUksQ0FBQywyREFBMkQsRUFBRSxHQUFHLEVBQUU7UUFDckUsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLEVBQUUsQ0FBQztRQUNuQyxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyw2QkFBNkIsRUFBRTtZQUM3RSxNQUFNLEVBQUU7Z0JBQ047b0JBQ0UsT0FBTyxFQUFFO3dCQUNQOzRCQUNFLFlBQVksRUFBRTtnQ0FDWixRQUFRLEVBQUUsUUFBUTtnQ0FDbEIsS0FBSyxFQUFFLEtBQUs7Z0NBQ1osUUFBUSxFQUFFLElBQUk7Z0NBQ2QsT0FBTyxFQUFFLEdBQUc7NkJBQ2I7NEJBQ0QsYUFBYSxFQUFFO2dDQUNiLFFBQVEsRUFBRTtvQ0FDUixHQUFHLEVBQUUsa0JBQWtCO2lDQUN4QjtnQ0FDRCxXQUFXLEVBQUUsY0FBYztnQ0FDM0Isb0JBQW9CLEVBQUUsSUFBSTs2QkFDM0I7NEJBQ0QsSUFBSSxFQUFFLFFBQVE7NEJBQ2QsZUFBZSxFQUFFO2dDQUNmO29DQUNFLElBQUksRUFBRSx3QkFBd0I7aUNBQy9COzZCQUNGOzRCQUNELE9BQU8sRUFBRTtnQ0FDUCxZQUFZLEVBQUU7b0NBQ1osZ0RBQWdEO29DQUNoRCxLQUFLO2lDQUNOOzZCQUNGOzRCQUNELFFBQVEsRUFBRSxDQUFDO3lCQUNaO3FCQUNGO29CQUNELElBQUksRUFBRSxRQUFRO2lCQUNmO2dCQUNEO29CQUNFLE9BQU8sRUFBRTt3QkFDUDs0QkFDRSxZQUFZLEVBQUU7Z0NBQ1osUUFBUSxFQUFFLFFBQVE7Z0NBQ2xCLEtBQUssRUFBRSxLQUFLO2dDQUNaLFFBQVEsRUFBRSxrQkFBa0I7Z0NBQzVCLE9BQU8sRUFBRSxHQUFHOzZCQUNiOzRCQUNELGFBQWEsRUFBRTtnQ0FDYixlQUFlLEVBQUUsaUJBQWlCO2dDQUNsQyxlQUFlLEVBQUUscUJBQXFCOzZCQUN2Qzs0QkFDRCxjQUFjLEVBQUU7Z0NBQ2Q7b0NBQ0UsSUFBSSxFQUFFLHdCQUF3QjtpQ0FDL0I7NkJBQ0Y7NEJBQ0QsSUFBSSxFQUFFLFFBQVE7NEJBQ2QsT0FBTyxFQUFFO2dDQUNQLFlBQVksRUFBRTtvQ0FDWixnREFBZ0Q7b0NBQ2hELEtBQUs7aUNBQ047NkJBQ0Y7NEJBQ0QsUUFBUSxFQUFFLENBQUM7eUJBQ1o7cUJBQ0Y7b0JBQ0QsSUFBSSxFQUFFLFFBQVE7aUJBQ2Y7YUFDRjtZQUNELGFBQWEsRUFBRTtnQkFDYixhQUFhLEVBQUU7b0JBQ2IsRUFBRSxFQUFFO3dCQUNGLFlBQVksRUFBRTs0QkFDWixnREFBZ0Q7NEJBQ2hELEtBQUs7eUJBQ047cUJBQ0Y7b0JBQ0QsSUFBSSxFQUFFLEtBQUs7aUJBQ1o7Z0JBQ0QsUUFBUSxFQUFFO29CQUNSLEdBQUcsRUFBRSxtQ0FBbUM7aUJBQ3pDO2dCQUNELElBQUksRUFBRSxJQUFJO2FBQ1g7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsU0FBUyxrQkFBa0I7SUFDekIsTUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFHLEVBQUUsQ0FBQztJQUN0QixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM3QixNQUFNLFlBQVksR0FBRyxJQUFJLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNqRCxNQUFNLFFBQVEsR0FBRyxJQUFJLFlBQVksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO0lBQ2hFLFFBQVEsQ0FBQyxRQUFRLENBQUM7UUFDaEIsU0FBUyxFQUFFLFFBQVE7UUFDbkIsT0FBTyxFQUFFO1lBQ1AsSUFBSSxvQkFBYyxDQUFDO2dCQUNqQixVQUFVLEVBQUUsUUFBUTtnQkFDcEIsTUFBTSxFQUFFLElBQUksZUFBTSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUM7Z0JBQ3JDLFNBQVMsRUFBRSxjQUFjO2dCQUN6QixNQUFNLEVBQUUsWUFBWTtnQkFDcEIsT0FBTyxFQUFFLGVBQVMsQ0FBQyxJQUFJO2FBQ3hCLENBQUM7U0FDSDtLQUNGLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxRQUFRLENBQUM7UUFDaEIsU0FBUyxFQUFFLFFBQVE7UUFDbkIsT0FBTyxFQUFFO1lBQ1AsSUFBSSxrQ0FBNEIsQ0FBQztnQkFDL0IsVUFBVSxFQUFFLFFBQVE7Z0JBQ3BCLGVBQWUsRUFBRSxpQkFBaUI7Z0JBQ2xDLGVBQWUsRUFBRSxxQkFBcUI7Z0JBQ3RDLEtBQUssRUFBRSxZQUFZO2FBQ3BCLENBQUM7U0FDSDtLQUNGLENBQUMsQ0FBQztJQUVILE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmUgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVwaXBlbGluZSc7XG5pbXBvcnQgeyBCdWNrZXQgfSBmcm9tICdAYXdzLWNkay9hd3MtczMnO1xuaW1wb3J0IHsgQXBwLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgRWxhc3RpY0JlYW5zdGFsa0RlcGxveUFjdGlvbiwgUzNTb3VyY2VBY3Rpb24sIFMzVHJpZ2dlciB9IGZyb20gJy4uLy4uL2xpYic7XG5cbmRlc2NyaWJlKCdlbGFzdGljIGJlYW5zdGFsayBkZXBsb3kgYWN0aW9uIHRlc3RzJywgKCkgPT4ge1xuICB0ZXN0KCdyZWdpb24gYW5kIGFjY291bnQgYXJlIGFjdGlvbiByZWdpb24gYW5kIGFjY291bnQgd2hlbiBzZXQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBidWlsZFBpcGVsaW5lU3RhY2soKTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlUGlwZWxpbmU6OlBpcGVsaW5lJywge1xuICAgICAgU3RhZ2VzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBBY3Rpb25zOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvblR5cGVJZDoge1xuICAgICAgICAgICAgICAgIENhdGVnb3J5OiAnU291cmNlJyxcbiAgICAgICAgICAgICAgICBPd25lcjogJ0FXUycsXG4gICAgICAgICAgICAgICAgUHJvdmlkZXI6ICdTMycsXG4gICAgICAgICAgICAgICAgVmVyc2lvbjogJzEnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgUzNCdWNrZXQ6IHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ015QnVja2V0RjY4RjNGRjAnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgUzNPYmplY3RLZXk6ICdzb21lL3BhdGgvdG8nLFxuICAgICAgICAgICAgICAgIFBvbGxGb3JTb3VyY2VDaGFuZ2VzOiB0cnVlLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBOYW1lOiAnU291cmNlJyxcbiAgICAgICAgICAgICAgT3V0cHV0QXJ0aWZhY3RzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgTmFtZTogJ0FydGlmYWN0X1NvdXJjZV9Tb3VyY2UnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIFJvbGVBcm46IHtcbiAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICdNeVBpcGVsaW5lU291cmNlQ29kZVBpcGVsaW5lQWN0aW9uUm9sZUFBMDVENzZGJyxcbiAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFJ1bk9yZGVyOiAxLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIE5hbWU6ICdTb3VyY2UnLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgQWN0aW9uczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb25UeXBlSWQ6IHtcbiAgICAgICAgICAgICAgICBDYXRlZ29yeTogJ0RlcGxveScsXG4gICAgICAgICAgICAgICAgT3duZXI6ICdBV1MnLFxuICAgICAgICAgICAgICAgIFByb3ZpZGVyOiAnRWxhc3RpY0JlYW5zdGFsaycsXG4gICAgICAgICAgICAgICAgVmVyc2lvbjogJzEnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBDb25maWd1cmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgQXBwbGljYXRpb25OYW1lOiAndGVzdEFwcGxpY2F0aW9uJyxcbiAgICAgICAgICAgICAgICBFbnZpcm9ubWVudE5hbWU6ICdlbnYtdGVzdEFwcGxpY2F0aW9uJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgSW5wdXRBcnRpZmFjdHM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBOYW1lOiAnQXJ0aWZhY3RfU291cmNlX1NvdXJjZScsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgTmFtZTogJ0RlcGxveScsXG4gICAgICAgICAgICAgIFJvbGVBcm46IHtcbiAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICdNeVBpcGVsaW5lRGVwbG95Q29kZVBpcGVsaW5lQWN0aW9uUm9sZTc0MkJENDhBJyxcbiAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFJ1bk9yZGVyOiAxLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIE5hbWU6ICdEZXBsb3knLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIEFydGlmYWN0U3RvcmU6IHtcbiAgICAgICAgRW5jcnlwdGlvbktleToge1xuICAgICAgICAgIElkOiB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgJ015UGlwZWxpbmVBcnRpZmFjdHNCdWNrZXRFbmNyeXB0aW9uS2V5OEJGMEE3RjMnLFxuICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBUeXBlOiAnS01TJyxcbiAgICAgICAgfSxcbiAgICAgICAgTG9jYXRpb246IHtcbiAgICAgICAgICBSZWY6ICdNeVBpcGVsaW5lQXJ0aWZhY3RzQnVja2V0NzI3OTIzREQnLFxuICAgICAgICB9LFxuICAgICAgICBUeXBlOiAnUzMnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuZnVuY3Rpb24gYnVpbGRQaXBlbGluZVN0YWNrKCk6IFN0YWNrIHtcbiAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHApO1xuICBjb25zdCBzb3VyY2VPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCk7XG4gIGNvbnN0IHBpcGVsaW5lID0gbmV3IGNvZGVwaXBlbGluZS5QaXBlbGluZShzdGFjaywgJ015UGlwZWxpbmUnKTtcbiAgcGlwZWxpbmUuYWRkU3RhZ2Uoe1xuICAgIHN0YWdlTmFtZTogJ1NvdXJjZScsXG4gICAgYWN0aW9uczogW1xuICAgICAgbmV3IFMzU291cmNlQWN0aW9uKHtcbiAgICAgICAgYWN0aW9uTmFtZTogJ1NvdXJjZScsXG4gICAgICAgIGJ1Y2tldDogbmV3IEJ1Y2tldChzdGFjaywgJ015QnVja2V0JyksXG4gICAgICAgIGJ1Y2tldEtleTogJ3NvbWUvcGF0aC90bycsXG4gICAgICAgIG91dHB1dDogc291cmNlT3V0cHV0LFxuICAgICAgICB0cmlnZ2VyOiBTM1RyaWdnZXIuUE9MTCxcbiAgICAgIH0pLFxuICAgIF0sXG4gIH0pO1xuXG4gIHBpcGVsaW5lLmFkZFN0YWdlKHtcbiAgICBzdGFnZU5hbWU6ICdEZXBsb3knLFxuICAgIGFjdGlvbnM6IFtcbiAgICAgIG5ldyBFbGFzdGljQmVhbnN0YWxrRGVwbG95QWN0aW9uKHtcbiAgICAgICAgYWN0aW9uTmFtZTogJ0RlcGxveScsXG4gICAgICAgIGFwcGxpY2F0aW9uTmFtZTogJ3Rlc3RBcHBsaWNhdGlvbicsXG4gICAgICAgIGVudmlyb25tZW50TmFtZTogJ2Vudi10ZXN0QXBwbGljYXRpb24nLFxuICAgICAgICBpbnB1dDogc291cmNlT3V0cHV0LFxuICAgICAgfSksXG4gICAgXSxcbiAgfSk7XG5cbiAgcmV0dXJuIHN0YWNrO1xufSJdfQ==