"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codepipeline = require("aws-cdk-lib/aws-codepipeline");
const s3 = require("aws-cdk-lib/aws-s3");
const cdk = require("aws-cdk-lib");
const cpactions = require("aws-cdk-lib/aws-codepipeline-actions");
const app = new cdk.App();
const region = 'us-west-2'; // hardcode the region
const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-cloudformation-cross-region', {
    env: {
        region,
    },
});
const bucket = new s3.Bucket(stack, 'MyBucket', {
    versioned: true,
    removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const sourceOutput = new codepipeline.Artifact();
const sourceAction = new cpactions.S3SourceAction({
    actionName: 'S3',
    bucketKey: 'some/path',
    bucket,
    output: sourceOutput,
});
new codepipeline.Pipeline(stack, 'MyPipeline', {
    artifactBucket: bucket,
    stages: [
        {
            stageName: 'Source',
            actions: [sourceAction],
        },
        {
            stageName: 'CFN',
            actions: [
                new cpactions.CloudFormationCreateUpdateStackAction({
                    actionName: 'CFN_Deploy',
                    stackName: 'aws-cdk-codepipeline-cross-region-deploy-stack',
                    templatePath: sourceOutput.atPath('template.yml'),
                    adminPermissions: false,
                    region,
                }),
            ],
        },
    ],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucGlwZWxpbmUtY2ZuLWNyb3NzLXJlZ2lvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLnBpcGVsaW5lLWNmbi1jcm9zcy1yZWdpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2REFBNkQ7QUFDN0QseUNBQXlDO0FBQ3pDLG1DQUFtQztBQUNuQyxrRUFBa0U7QUFFbEUsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsTUFBTSxNQUFNLEdBQUcsV0FBVyxDQUFDLENBQUMsc0JBQXNCO0FBQ2xELE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsa0RBQWtELEVBQUU7SUFDbkYsR0FBRyxFQUFFO1FBQ0gsTUFBTTtLQUNQO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsTUFBTSxNQUFNLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7SUFDOUMsU0FBUyxFQUFFLElBQUk7SUFDZixhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPO0NBQ3pDLENBQUMsQ0FBQztBQUVILE1BQU0sWUFBWSxHQUFHLElBQUksWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ2pELE1BQU0sWUFBWSxHQUFHLElBQUksU0FBUyxDQUFDLGNBQWMsQ0FBQztJQUNoRCxVQUFVLEVBQUUsSUFBSTtJQUNoQixTQUFTLEVBQUUsV0FBVztJQUN0QixNQUFNO0lBQ04sTUFBTSxFQUFFLFlBQVk7Q0FDckIsQ0FBQyxDQUFDO0FBRUgsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUU7SUFDN0MsY0FBYyxFQUFFLE1BQU07SUFDdEIsTUFBTSxFQUFFO1FBQ047WUFDRSxTQUFTLEVBQUUsUUFBUTtZQUNuQixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7U0FDeEI7UUFDRDtZQUNFLFNBQVMsRUFBRSxLQUFLO1lBQ2hCLE9BQU8sRUFBRTtnQkFDUCxJQUFJLFNBQVMsQ0FBQyxxQ0FBcUMsQ0FBQztvQkFDbEQsVUFBVSxFQUFFLFlBQVk7b0JBQ3hCLFNBQVMsRUFBRSxnREFBZ0Q7b0JBQzNELFlBQVksRUFBRSxZQUFZLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQztvQkFDakQsZ0JBQWdCLEVBQUUsS0FBSztvQkFDdkIsTUFBTTtpQkFDUCxDQUFDO2FBQ0g7U0FDRjtLQUNGO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lIGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2RlcGlwZWxpbmUnO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBjcGFjdGlvbnMgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNvZGVwaXBlbGluZS1hY3Rpb25zJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxuY29uc3QgcmVnaW9uID0gJ3VzLXdlc3QtMic7IC8vIGhhcmRjb2RlIHRoZSByZWdpb25cbmNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdhd3MtY2RrLWNvZGVwaXBlbGluZS1jbG91ZGZvcm1hdGlvbi1jcm9zcy1yZWdpb24nLCB7XG4gIGVudjoge1xuICAgIHJlZ2lvbixcbiAgfSxcbn0pO1xuXG5jb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnLCB7XG4gIHZlcnNpb25lZDogdHJ1ZSxcbiAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcbn0pO1xuXG5jb25zdCBzb3VyY2VPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCk7XG5jb25zdCBzb3VyY2VBY3Rpb24gPSBuZXcgY3BhY3Rpb25zLlMzU291cmNlQWN0aW9uKHtcbiAgYWN0aW9uTmFtZTogJ1MzJyxcbiAgYnVja2V0S2V5OiAnc29tZS9wYXRoJyxcbiAgYnVja2V0LFxuICBvdXRwdXQ6IHNvdXJjZU91dHB1dCxcbn0pO1xuXG5uZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHN0YWNrLCAnTXlQaXBlbGluZScsIHtcbiAgYXJ0aWZhY3RCdWNrZXQ6IGJ1Y2tldCxcbiAgc3RhZ2VzOiBbXG4gICAge1xuICAgICAgc3RhZ2VOYW1lOiAnU291cmNlJyxcbiAgICAgIGFjdGlvbnM6IFtzb3VyY2VBY3Rpb25dLFxuICAgIH0sXG4gICAge1xuICAgICAgc3RhZ2VOYW1lOiAnQ0ZOJyxcbiAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgbmV3IGNwYWN0aW9ucy5DbG91ZEZvcm1hdGlvbkNyZWF0ZVVwZGF0ZVN0YWNrQWN0aW9uKHtcbiAgICAgICAgICBhY3Rpb25OYW1lOiAnQ0ZOX0RlcGxveScsXG4gICAgICAgICAgc3RhY2tOYW1lOiAnYXdzLWNkay1jb2RlcGlwZWxpbmUtY3Jvc3MtcmVnaW9uLWRlcGxveS1zdGFjaycsXG4gICAgICAgICAgdGVtcGxhdGVQYXRoOiBzb3VyY2VPdXRwdXQuYXRQYXRoKCd0ZW1wbGF0ZS55bWwnKSxcbiAgICAgICAgICBhZG1pblBlcm1pc3Npb25zOiBmYWxzZSxcbiAgICAgICAgICByZWdpb24sXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICB9LFxuICBdLFxufSk7XG5cbmFwcC5zeW50aCgpO1xuIl19