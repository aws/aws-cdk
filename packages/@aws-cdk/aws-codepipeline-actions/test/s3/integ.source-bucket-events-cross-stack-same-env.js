"use strict";
/// !cdk-integ PipelineStack
Object.defineProperty(exports, "__esModule", { value: true });
const codebuild = require("@aws-cdk/aws-codebuild");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const s3 = require("@aws-cdk/aws-s3");
const core_1 = require("@aws-cdk/core");
const integ = require("@aws-cdk/integ-tests");
const cpactions = require("../../lib");
const app = new core_1.App();
const bucketStack = new core_1.Stack(app, 'BucketStack');
const bucket = new s3.Bucket(bucketStack, 'Bucket', {
    removalPolicy: core_1.RemovalPolicy.DESTROY,
});
const pipelineStack = new core_1.Stack(app, 'PipelineStack');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuc291cmNlLWJ1Y2tldC1ldmVudHMtY3Jvc3Mtc3RhY2stc2FtZS1lbnYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5zb3VyY2UtYnVja2V0LWV2ZW50cy1jcm9zcy1zdGFjay1zYW1lLWVudi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsNEJBQTRCOztBQUU1QixvREFBb0Q7QUFDcEQsMERBQTBEO0FBQzFELHNDQUFzQztBQUN0Qyx3Q0FBMEQ7QUFDMUQsOENBQThDO0FBQzlDLHVDQUF1QztBQUV2QyxNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQUcsRUFBRSxDQUFDO0FBQ3RCLE1BQU0sV0FBVyxHQUFHLElBQUksWUFBSyxDQUFDLEdBQUcsRUFBRSxhQUFhLENBQUMsQ0FBQztBQUNsRCxNQUFNLE1BQU0sR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRTtJQUNsRCxhQUFhLEVBQUUsb0JBQWEsQ0FBQyxPQUFPO0NBQ3JDLENBQUMsQ0FBQztBQUVILE1BQU0sYUFBYSxHQUFHLElBQUksWUFBSyxDQUFDLEdBQUcsRUFBRSxlQUFlLENBQUMsQ0FBQztBQUN0RCxNQUFNLFlBQVksR0FBRyxJQUFJLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUNqRCxJQUFJLFlBQVksQ0FBQyxRQUFRLENBQUMsYUFBYSxFQUFFLFVBQVUsRUFBRTtJQUNuRCxNQUFNLEVBQUU7UUFDTjtZQUNFLFNBQVMsRUFBRSxRQUFRO1lBQ25CLE9BQU8sRUFBRTtnQkFDUCxJQUFJLFNBQVMsQ0FBQyxjQUFjLENBQUM7b0JBQzNCLFVBQVUsRUFBRSxRQUFRO29CQUNwQixNQUFNO29CQUNOLE9BQU8sRUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU07b0JBQ25DLFNBQVMsRUFBRSxVQUFVO29CQUNyQixNQUFNLEVBQUUsWUFBWTtpQkFDckIsQ0FBQzthQUNIO1NBQ0Y7UUFDRDtZQUNFLFNBQVMsRUFBRSxPQUFPO1lBQ2xCLE9BQU8sRUFBRTtnQkFDUCxJQUFJLFNBQVMsQ0FBQyxlQUFlLENBQUM7b0JBQzVCLFVBQVUsRUFBRSxPQUFPO29CQUNuQixPQUFPLEVBQUUsSUFBSSxTQUFTLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxTQUFTLENBQUM7b0JBQ2hFLEtBQUssRUFBRSxZQUFZO2lCQUNwQixDQUFDO2FBQ0g7U0FDRjtLQUNGO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSwwQkFBMEIsRUFBRTtJQUNuRCxTQUFTLEVBQUUsQ0FBQyxhQUFhLENBQUM7Q0FDM0IsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8vICFjZGstaW50ZWcgUGlwZWxpbmVTdGFja1xuXG5pbXBvcnQgKiBhcyBjb2RlYnVpbGQgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVidWlsZCc7XG5pbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmUgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVwaXBlbGluZSc7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICdAYXdzLWNkay9hd3MtczMnO1xuaW1wb3J0IHsgQXBwLCBSZW1vdmFsUG9saWN5LCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgaW50ZWcgZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMnO1xuaW1wb3J0ICogYXMgY3BhY3Rpb25zIGZyb20gJy4uLy4uL2xpYic7XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbmNvbnN0IGJ1Y2tldFN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ0J1Y2tldFN0YWNrJyk7XG5jb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KGJ1Y2tldFN0YWNrLCAnQnVja2V0Jywge1xuICByZW1vdmFsUG9saWN5OiBSZW1vdmFsUG9saWN5LkRFU1RST1ksXG59KTtcblxuY29uc3QgcGlwZWxpbmVTdGFjayA9IG5ldyBTdGFjayhhcHAsICdQaXBlbGluZVN0YWNrJyk7XG5jb25zdCBzb3VyY2VPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCk7XG5uZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHBpcGVsaW5lU3RhY2ssICdQaXBlbGluZScsIHtcbiAgc3RhZ2VzOiBbXG4gICAge1xuICAgICAgc3RhZ2VOYW1lOiAnU291cmNlJyxcbiAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgbmV3IGNwYWN0aW9ucy5TM1NvdXJjZUFjdGlvbih7XG4gICAgICAgICAgYWN0aW9uTmFtZTogJ1NvdXJjZScsXG4gICAgICAgICAgYnVja2V0LFxuICAgICAgICAgIHRyaWdnZXI6IGNwYWN0aW9ucy5TM1RyaWdnZXIuRVZFTlRTLFxuICAgICAgICAgIGJ1Y2tldEtleTogJ2ZpbGUuemlwJyxcbiAgICAgICAgICBvdXRwdXQ6IHNvdXJjZU91dHB1dCxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgc3RhZ2VOYW1lOiAnQnVpbGQnLFxuICAgICAgYWN0aW9uczogW1xuICAgICAgICBuZXcgY3BhY3Rpb25zLkNvZGVCdWlsZEFjdGlvbih7XG4gICAgICAgICAgYWN0aW9uTmFtZTogJ0J1aWxkJyxcbiAgICAgICAgICBwcm9qZWN0OiBuZXcgY29kZWJ1aWxkLlBpcGVsaW5lUHJvamVjdChwaXBlbGluZVN0YWNrLCAnUHJvamVjdCcpLFxuICAgICAgICAgIGlucHV0OiBzb3VyY2VPdXRwdXQsXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICB9LFxuICBdLFxufSk7XG5cbm5ldyBpbnRlZy5JbnRlZ1Rlc3QoYXBwLCAnQ29kZVBpcGVsaW5lUzNTb3VyY2VUZXN0Jywge1xuICB0ZXN0Q2FzZXM6IFtwaXBlbGluZVN0YWNrXSxcbn0pO1xuIl19