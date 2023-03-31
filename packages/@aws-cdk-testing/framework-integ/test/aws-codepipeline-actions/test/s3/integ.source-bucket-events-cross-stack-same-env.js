"use strict";
/// !cdk-integ PipelineStack
Object.defineProperty(exports, "__esModule", { value: true });
const codebuild = require("aws-cdk-lib/aws-codebuild");
const codepipeline = require("aws-cdk-lib/aws-codepipeline");
const s3 = require("aws-cdk-lib/aws-s3");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ = require("@aws-cdk/integ-tests-alpha");
const cpactions = require("aws-cdk-lib/aws-codepipeline-actions");
const app = new aws_cdk_lib_1.App();
const bucketStack = new aws_cdk_lib_1.Stack(app, 'BucketStack');
const bucket = new s3.Bucket(bucketStack, 'Bucket', {
    removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
});
const pipelineStack = new aws_cdk_lib_1.Stack(app, 'PipelineStack');
const sourceOutput = new codepipeline.Artifact();
new codepipeline.Pipeline(pipelineStack, 'Pipeline', {
    stages: [
        {
            stageName: 'Source',
            actions: [
                new cpactions.S3SourceAction({
                    actionName: 'Source',
                    bucket,
                    trigger: cpactions.S3Trigger.EVENTS,
                    bucketKey: 'file.zip',
                    output: sourceOutput,
                }),
            ],
        },
        {
            stageName: 'Build',
            actions: [
                new cpactions.CodeBuildAction({
                    actionName: 'Build',
                    project: new codebuild.PipelineProject(pipelineStack, 'Project'),
                    input: sourceOutput,
                }),
            ],
        },
    ],
});
new integ.IntegTest(app, 'CodePipelineS3SourceTest', {
    testCases: [pipelineStack],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuc291cmNlLWJ1Y2tldC1ldmVudHMtY3Jvc3Mtc3RhY2stc2FtZS1lbnYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5zb3VyY2UtYnVja2V0LWV2ZW50cy1jcm9zcy1zdGFjay1zYW1lLWVudi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsNEJBQTRCOztBQUU1Qix1REFBdUQ7QUFDdkQsNkRBQTZEO0FBQzdELHlDQUF5QztBQUN6Qyw2Q0FBd0Q7QUFDeEQsb0RBQW9EO0FBQ3BELGtFQUFrRTtBQUVsRSxNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFHLEVBQUUsQ0FBQztBQUN0QixNQUFNLFdBQVcsR0FBRyxJQUFJLG1CQUFLLENBQUMsR0FBRyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0FBQ2xELE1BQU0sTUFBTSxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFO0lBQ2xELGFBQWEsRUFBRSwyQkFBYSxDQUFDLE9BQU87Q0FDckMsQ0FBQyxDQUFDO0FBRUgsTUFBTSxhQUFhLEdBQUcsSUFBSSxtQkFBSyxDQUFDLEdBQUcsRUFBRSxlQUFlLENBQUMsQ0FBQztBQUN0RCxNQUFNLFlBQVksR0FBRyxJQUFJLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUNqRCxJQUFJLFlBQVksQ0FBQyxRQUFRLENBQUMsYUFBYSxFQUFFLFVBQVUsRUFBRTtJQUNuRCxNQUFNLEVBQUU7UUFDTjtZQUNFLFNBQVMsRUFBRSxRQUFRO1lBQ25CLE9BQU8sRUFBRTtnQkFDUCxJQUFJLFNBQVMsQ0FBQyxjQUFjLENBQUM7b0JBQzNCLFVBQVUsRUFBRSxRQUFRO29CQUNwQixNQUFNO29CQUNOLE9BQU8sRUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU07b0JBQ25DLFNBQVMsRUFBRSxVQUFVO29CQUNyQixNQUFNLEVBQUUsWUFBWTtpQkFDckIsQ0FBQzthQUNIO1NBQ0Y7UUFDRDtZQUNFLFNBQVMsRUFBRSxPQUFPO1lBQ2xCLE9BQU8sRUFBRTtnQkFDUCxJQUFJLFNBQVMsQ0FBQyxlQUFlLENBQUM7b0JBQzVCLFVBQVUsRUFBRSxPQUFPO29CQUNuQixPQUFPLEVBQUUsSUFBSSxTQUFTLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxTQUFTLENBQUM7b0JBQ2hFLEtBQUssRUFBRSxZQUFZO2lCQUNwQixDQUFDO2FBQ0g7U0FDRjtLQUNGO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSwwQkFBMEIsRUFBRTtJQUNuRCxTQUFTLEVBQUUsQ0FBQyxhQUFhLENBQUM7Q0FDM0IsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8vICFjZGstaW50ZWcgUGlwZWxpbmVTdGFja1xuXG5pbXBvcnQgKiBhcyBjb2RlYnVpbGQgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNvZGVidWlsZCc7XG5pbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmUgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNvZGVwaXBlbGluZSc7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMnO1xuaW1wb3J0IHsgQXBwLCBSZW1vdmFsUG9saWN5LCBTdGFjayB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGludGVnIGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzLWFscGhhJztcbmltcG9ydCAqIGFzIGNwYWN0aW9ucyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZXBpcGVsaW5lLWFjdGlvbnMnO1xuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5jb25zdCBidWNrZXRTdGFjayA9IG5ldyBTdGFjayhhcHAsICdCdWNrZXRTdGFjaycpO1xuY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChidWNrZXRTdGFjaywgJ0J1Y2tldCcsIHtcbiAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxufSk7XG5cbmNvbnN0IHBpcGVsaW5lU3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnUGlwZWxpbmVTdGFjaycpO1xuY29uc3Qgc291cmNlT3V0cHV0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpO1xubmV3IGNvZGVwaXBlbGluZS5QaXBlbGluZShwaXBlbGluZVN0YWNrLCAnUGlwZWxpbmUnLCB7XG4gIHN0YWdlczogW1xuICAgIHtcbiAgICAgIHN0YWdlTmFtZTogJ1NvdXJjZScsXG4gICAgICBhY3Rpb25zOiBbXG4gICAgICAgIG5ldyBjcGFjdGlvbnMuUzNTb3VyY2VBY3Rpb24oe1xuICAgICAgICAgIGFjdGlvbk5hbWU6ICdTb3VyY2UnLFxuICAgICAgICAgIGJ1Y2tldCxcbiAgICAgICAgICB0cmlnZ2VyOiBjcGFjdGlvbnMuUzNUcmlnZ2VyLkVWRU5UUyxcbiAgICAgICAgICBidWNrZXRLZXk6ICdmaWxlLnppcCcsXG4gICAgICAgICAgb3V0cHV0OiBzb3VyY2VPdXRwdXQsXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHN0YWdlTmFtZTogJ0J1aWxkJyxcbiAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgbmV3IGNwYWN0aW9ucy5Db2RlQnVpbGRBY3Rpb24oe1xuICAgICAgICAgIGFjdGlvbk5hbWU6ICdCdWlsZCcsXG4gICAgICAgICAgcHJvamVjdDogbmV3IGNvZGVidWlsZC5QaXBlbGluZVByb2plY3QocGlwZWxpbmVTdGFjaywgJ1Byb2plY3QnKSxcbiAgICAgICAgICBpbnB1dDogc291cmNlT3V0cHV0LFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgfSxcbiAgXSxcbn0pO1xuXG5uZXcgaW50ZWcuSW50ZWdUZXN0KGFwcCwgJ0NvZGVQaXBlbGluZVMzU291cmNlVGVzdCcsIHtcbiAgdGVzdENhc2VzOiBbcGlwZWxpbmVTdGFja10sXG59KTtcbiJdfQ==