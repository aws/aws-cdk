"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codepipeline = require("aws-cdk-lib/aws-codepipeline");
const s3 = require("aws-cdk-lib/aws-s3");
const cdk = require("aws-cdk-lib");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const cpactions = require("aws-cdk-lib/aws-codepipeline-actions");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-s3-deploy');
const bucket = new s3.Bucket(stack, 'PipelineBucket', {
    versioned: true,
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
});
const sourceOutput = new codepipeline.Artifact('SourceArtifact');
const sourceAction = new cpactions.S3SourceAction({
    actionName: 'Source',
    output: sourceOutput,
    bucket,
    bucketKey: 'key',
});
const deployBucket = new s3.Bucket(stack, 'DeployBucket', {
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
});
const otherDeployBucket = new s3.Bucket(stack, 'OtherDeployBucket', {
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
});
const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
    artifactBucket: bucket,
    stages: [
        {
            stageName: 'Source',
            actions: [sourceAction],
        },
        {
            stageName: 'Deploy',
            actions: [
                new cpactions.S3DeployAction({
                    actionName: 'DeployAction',
                    extract: false,
                    objectKey: 'key',
                    input: sourceOutput,
                    bucket: deployBucket,
                    accessControl: s3.BucketAccessControl.PRIVATE,
                    cacheControl: [
                        cpactions.CacheControl.setPublic(),
                        cpactions.CacheControl.maxAge(cdk.Duration.hours(12)),
                    ],
                }),
            ],
        },
        {
            stageName: 'Disabled',
            transitionToEnabled: false,
            actions: [
                new cpactions.S3DeployAction({
                    actionName: 'DisabledDeployAction',
                    input: sourceOutput,
                    bucket: otherDeployBucket,
                }),
            ],
        },
    ],
});
const integ = new integ_tests_alpha_1.IntegTest(app, 's3-deploy-test', {
    testCases: [stack],
});
integ.assertions.awsApiCall('S3', 'putObject', {
    Bucket: bucket.bucketName,
    Key: 'key',
    Body: 'HelloWorld',
}).next(integ.assertions.awsApiCall('CodePipeline', 'getPipelineState', {
    name: pipeline.pipelineName,
}).expect(integ_tests_alpha_1.ExpectedResult.objectLike({
    stageStates: integ_tests_alpha_1.Match.arrayWith([
        integ_tests_alpha_1.Match.objectLike({
            stageName: 'Deploy',
            latestExecution: integ_tests_alpha_1.Match.objectLike({
                status: 'Succeeded',
            }),
        }),
    ]),
})).waitForAssertions({
    totalTimeout: aws_cdk_lib_1.Duration.minutes(5),
}).next(integ.assertions.awsApiCall('S3', 'getObject', {
    Bucket: deployBucket.bucketName,
    Key: 'key',
})));
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucGlwZWxpbmUtczMtZGVwbG95LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcucGlwZWxpbmUtczMtZGVwbG95LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkRBQTZEO0FBQzdELHlDQUF5QztBQUN6QyxtQ0FBbUM7QUFDbkMsNkNBQXVDO0FBQ3ZDLGtFQUE4RTtBQUM5RSxrRUFBa0U7QUFFbEUsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxnQ0FBZ0MsQ0FBQyxDQUFDO0FBRW5FLE1BQU0sTUFBTSxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUU7SUFDcEQsU0FBUyxFQUFFLElBQUk7SUFDZixhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPO0lBQ3hDLGlCQUFpQixFQUFFLElBQUk7Q0FDeEIsQ0FBQyxDQUFDO0FBQ0gsTUFBTSxZQUFZLEdBQUcsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDakUsTUFBTSxZQUFZLEdBQUcsSUFBSSxTQUFTLENBQUMsY0FBYyxDQUFDO0lBQ2hELFVBQVUsRUFBRSxRQUFRO0lBQ3BCLE1BQU0sRUFBRSxZQUFZO0lBQ3BCLE1BQU07SUFDTixTQUFTLEVBQUUsS0FBSztDQUNqQixDQUFDLENBQUM7QUFFSCxNQUFNLFlBQVksR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLGNBQWMsRUFBRTtJQUN4RCxhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPO0lBQ3hDLGlCQUFpQixFQUFFLElBQUk7Q0FDeEIsQ0FBQyxDQUFDO0FBRUgsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLG1CQUFtQixFQUFFO0lBQ2xFLGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU87SUFDeEMsaUJBQWlCLEVBQUUsSUFBSTtDQUN4QixDQUFDLENBQUM7QUFFSCxNQUFNLFFBQVEsR0FBRyxJQUFJLFlBQVksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRTtJQUM1RCxjQUFjLEVBQUUsTUFBTTtJQUN0QixNQUFNLEVBQUU7UUFDTjtZQUNFLFNBQVMsRUFBRSxRQUFRO1lBQ25CLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztTQUN4QjtRQUNEO1lBQ0UsU0FBUyxFQUFFLFFBQVE7WUFDbkIsT0FBTyxFQUFFO2dCQUNQLElBQUksU0FBUyxDQUFDLGNBQWMsQ0FBQztvQkFDM0IsVUFBVSxFQUFFLGNBQWM7b0JBQzFCLE9BQU8sRUFBRSxLQUFLO29CQUNkLFNBQVMsRUFBRSxLQUFLO29CQUNoQixLQUFLLEVBQUUsWUFBWTtvQkFDbkIsTUFBTSxFQUFFLFlBQVk7b0JBQ3BCLGFBQWEsRUFBRSxFQUFFLENBQUMsbUJBQW1CLENBQUMsT0FBTztvQkFDN0MsWUFBWSxFQUFFO3dCQUNaLFNBQVMsQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFO3dCQUNsQyxTQUFTLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztxQkFDdEQ7aUJBQ0YsQ0FBQzthQUNIO1NBQ0Y7UUFDRDtZQUNFLFNBQVMsRUFBRSxVQUFVO1lBQ3JCLG1CQUFtQixFQUFFLEtBQUs7WUFDMUIsT0FBTyxFQUFFO2dCQUNQLElBQUksU0FBUyxDQUFDLGNBQWMsQ0FBQztvQkFDM0IsVUFBVSxFQUFFLHNCQUFzQjtvQkFDbEMsS0FBSyxFQUFFLFlBQVk7b0JBQ25CLE1BQU0sRUFBRSxpQkFBaUI7aUJBQzFCLENBQUM7YUFDSDtTQUNGO0tBQ0Y7Q0FDRixDQUFDLENBQUM7QUFFSCxNQUFNLEtBQUssR0FBRyxJQUFJLDZCQUFTLENBQUMsR0FBRyxFQUFFLGdCQUFnQixFQUFFO0lBQ2pELFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztDQUNuQixDQUFDLENBQUM7QUFFSCxLQUFLLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFO0lBQzdDLE1BQU0sRUFBRSxNQUFNLENBQUMsVUFBVTtJQUN6QixHQUFHLEVBQUUsS0FBSztJQUNWLElBQUksRUFBRSxZQUFZO0NBQ25CLENBQUMsQ0FBQyxJQUFJLENBQ0wsS0FBSyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsY0FBYyxFQUFFLGtCQUFrQixFQUFFO0lBQzlELElBQUksRUFBRSxRQUFRLENBQUMsWUFBWTtDQUM1QixDQUFDLENBQUMsTUFBTSxDQUFDLGtDQUFjLENBQUMsVUFBVSxDQUFDO0lBQ2xDLFdBQVcsRUFBRSx5QkFBSyxDQUFDLFNBQVMsQ0FBQztRQUMzQix5QkFBSyxDQUFDLFVBQVUsQ0FBQztZQUNmLFNBQVMsRUFBRSxRQUFRO1lBQ25CLGVBQWUsRUFBRSx5QkFBSyxDQUFDLFVBQVUsQ0FBQztnQkFDaEMsTUFBTSxFQUFFLFdBQVc7YUFDcEIsQ0FBQztTQUNILENBQUM7S0FDSCxDQUFDO0NBQ0gsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUM7SUFDcEIsWUFBWSxFQUFFLHNCQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztDQUNsQyxDQUFDLENBQUMsSUFBSSxDQUNMLEtBQUssQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUU7SUFDN0MsTUFBTSxFQUFFLFlBQVksQ0FBQyxVQUFVO0lBQy9CLEdBQUcsRUFBRSxLQUFLO0NBQ1gsQ0FBQyxDQUNILENBQ0YsQ0FBQztBQUVGLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNvZGVwaXBlbGluZSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZXBpcGVsaW5lJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgRHVyYXRpb24gfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBJbnRlZ1Rlc3QsIEV4cGVjdGVkUmVzdWx0LCBNYXRjaCB9IGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzLWFscGhhJztcbmltcG9ydCAqIGFzIGNwYWN0aW9ucyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZXBpcGVsaW5lLWFjdGlvbnMnO1xuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG5jb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnYXdzLWNkay1jb2RlcGlwZWxpbmUtczMtZGVwbG95Jyk7XG5cbmNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdQaXBlbGluZUJ1Y2tldCcsIHtcbiAgdmVyc2lvbmVkOiB0cnVlLFxuICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICBhdXRvRGVsZXRlT2JqZWN0czogdHJ1ZSxcbn0pO1xuY29uc3Qgc291cmNlT3V0cHV0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgnU291cmNlQXJ0aWZhY3QnKTtcbmNvbnN0IHNvdXJjZUFjdGlvbiA9IG5ldyBjcGFjdGlvbnMuUzNTb3VyY2VBY3Rpb24oe1xuICBhY3Rpb25OYW1lOiAnU291cmNlJyxcbiAgb3V0cHV0OiBzb3VyY2VPdXRwdXQsXG4gIGJ1Y2tldCxcbiAgYnVja2V0S2V5OiAna2V5Jyxcbn0pO1xuXG5jb25zdCBkZXBsb3lCdWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnRGVwbG95QnVja2V0Jywge1xuICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICBhdXRvRGVsZXRlT2JqZWN0czogdHJ1ZSxcbn0pO1xuXG5jb25zdCBvdGhlckRlcGxveUJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdPdGhlckRlcGxveUJ1Y2tldCcsIHtcbiAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgYXV0b0RlbGV0ZU9iamVjdHM6IHRydWUsXG59KTtcblxuY29uc3QgcGlwZWxpbmUgPSBuZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHN0YWNrLCAnUGlwZWxpbmUnLCB7XG4gIGFydGlmYWN0QnVja2V0OiBidWNrZXQsXG4gIHN0YWdlczogW1xuICAgIHtcbiAgICAgIHN0YWdlTmFtZTogJ1NvdXJjZScsXG4gICAgICBhY3Rpb25zOiBbc291cmNlQWN0aW9uXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHN0YWdlTmFtZTogJ0RlcGxveScsXG4gICAgICBhY3Rpb25zOiBbXG4gICAgICAgIG5ldyBjcGFjdGlvbnMuUzNEZXBsb3lBY3Rpb24oe1xuICAgICAgICAgIGFjdGlvbk5hbWU6ICdEZXBsb3lBY3Rpb24nLFxuICAgICAgICAgIGV4dHJhY3Q6IGZhbHNlLFxuICAgICAgICAgIG9iamVjdEtleTogJ2tleScsXG4gICAgICAgICAgaW5wdXQ6IHNvdXJjZU91dHB1dCxcbiAgICAgICAgICBidWNrZXQ6IGRlcGxveUJ1Y2tldCxcbiAgICAgICAgICBhY2Nlc3NDb250cm9sOiBzMy5CdWNrZXRBY2Nlc3NDb250cm9sLlBSSVZBVEUsXG4gICAgICAgICAgY2FjaGVDb250cm9sOiBbXG4gICAgICAgICAgICBjcGFjdGlvbnMuQ2FjaGVDb250cm9sLnNldFB1YmxpYygpLFxuICAgICAgICAgICAgY3BhY3Rpb25zLkNhY2hlQ29udHJvbC5tYXhBZ2UoY2RrLkR1cmF0aW9uLmhvdXJzKDEyKSksXG4gICAgICAgICAgXSxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgc3RhZ2VOYW1lOiAnRGlzYWJsZWQnLFxuICAgICAgdHJhbnNpdGlvblRvRW5hYmxlZDogZmFsc2UsXG4gICAgICBhY3Rpb25zOiBbXG4gICAgICAgIG5ldyBjcGFjdGlvbnMuUzNEZXBsb3lBY3Rpb24oe1xuICAgICAgICAgIGFjdGlvbk5hbWU6ICdEaXNhYmxlZERlcGxveUFjdGlvbicsXG4gICAgICAgICAgaW5wdXQ6IHNvdXJjZU91dHB1dCxcbiAgICAgICAgICBidWNrZXQ6IG90aGVyRGVwbG95QnVja2V0LFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgfSxcbiAgXSxcbn0pO1xuXG5jb25zdCBpbnRlZyA9IG5ldyBJbnRlZ1Rlc3QoYXBwLCAnczMtZGVwbG95LXRlc3QnLCB7XG4gIHRlc3RDYXNlczogW3N0YWNrXSxcbn0pO1xuXG5pbnRlZy5hc3NlcnRpb25zLmF3c0FwaUNhbGwoJ1MzJywgJ3B1dE9iamVjdCcsIHtcbiAgQnVja2V0OiBidWNrZXQuYnVja2V0TmFtZSxcbiAgS2V5OiAna2V5JyxcbiAgQm9keTogJ0hlbGxvV29ybGQnLFxufSkubmV4dChcbiAgaW50ZWcuYXNzZXJ0aW9ucy5hd3NBcGlDYWxsKCdDb2RlUGlwZWxpbmUnLCAnZ2V0UGlwZWxpbmVTdGF0ZScsIHtcbiAgICBuYW1lOiBwaXBlbGluZS5waXBlbGluZU5hbWUsXG4gIH0pLmV4cGVjdChFeHBlY3RlZFJlc3VsdC5vYmplY3RMaWtlKHtcbiAgICBzdGFnZVN0YXRlczogTWF0Y2guYXJyYXlXaXRoKFtcbiAgICAgIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICBzdGFnZU5hbWU6ICdEZXBsb3knLFxuICAgICAgICBsYXRlc3RFeGVjdXRpb246IE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgIHN0YXR1czogJ1N1Y2NlZWRlZCcsXG4gICAgICAgIH0pLFxuICAgICAgfSksXG4gICAgXSksXG4gIH0pKS53YWl0Rm9yQXNzZXJ0aW9ucyh7XG4gICAgdG90YWxUaW1lb3V0OiBEdXJhdGlvbi5taW51dGVzKDUpLFxuICB9KS5uZXh0KFxuICAgIGludGVnLmFzc2VydGlvbnMuYXdzQXBpQ2FsbCgnUzMnLCAnZ2V0T2JqZWN0Jywge1xuICAgICAgQnVja2V0OiBkZXBsb3lCdWNrZXQuYnVja2V0TmFtZSxcbiAgICAgIEtleTogJ2tleScsXG4gICAgfSksXG4gICksXG4pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==