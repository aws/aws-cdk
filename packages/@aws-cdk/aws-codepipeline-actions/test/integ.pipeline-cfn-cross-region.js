"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codepipeline = require("@aws-cdk/aws-codepipeline");
const s3 = require("@aws-cdk/aws-s3");
const cdk = require("@aws-cdk/core");
const cpactions = require("../lib");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucGlwZWxpbmUtY2ZuLWNyb3NzLXJlZ2lvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLnBpcGVsaW5lLWNmbi1jcm9zcy1yZWdpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwwREFBMEQ7QUFDMUQsc0NBQXNDO0FBQ3RDLHFDQUFxQztBQUNyQyxvQ0FBb0M7QUFFcEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsTUFBTSxNQUFNLEdBQUcsV0FBVyxDQUFDLENBQUMsc0JBQXNCO0FBQ2xELE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsa0RBQWtELEVBQUU7SUFDbkYsR0FBRyxFQUFFO1FBQ0gsTUFBTTtLQUNQO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsTUFBTSxNQUFNLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7SUFDOUMsU0FBUyxFQUFFLElBQUk7SUFDZixhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPO0NBQ3pDLENBQUMsQ0FBQztBQUVILE1BQU0sWUFBWSxHQUFHLElBQUksWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ2pELE1BQU0sWUFBWSxHQUFHLElBQUksU0FBUyxDQUFDLGNBQWMsQ0FBQztJQUNoRCxVQUFVLEVBQUUsSUFBSTtJQUNoQixTQUFTLEVBQUUsV0FBVztJQUN0QixNQUFNO0lBQ04sTUFBTSxFQUFFLFlBQVk7Q0FDckIsQ0FBQyxDQUFDO0FBRUgsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUU7SUFDN0MsY0FBYyxFQUFFLE1BQU07SUFDdEIsTUFBTSxFQUFFO1FBQ047WUFDRSxTQUFTLEVBQUUsUUFBUTtZQUNuQixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7U0FDeEI7UUFDRDtZQUNFLFNBQVMsRUFBRSxLQUFLO1lBQ2hCLE9BQU8sRUFBRTtnQkFDUCxJQUFJLFNBQVMsQ0FBQyxxQ0FBcUMsQ0FBQztvQkFDbEQsVUFBVSxFQUFFLFlBQVk7b0JBQ3hCLFNBQVMsRUFBRSxnREFBZ0Q7b0JBQzNELFlBQVksRUFBRSxZQUFZLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQztvQkFDakQsZ0JBQWdCLEVBQUUsS0FBSztvQkFDdkIsTUFBTTtpQkFDUCxDQUFDO2FBQ0g7U0FDRjtLQUNGO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lIGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlcGlwZWxpbmUnO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnQGF3cy1jZGsvYXdzLXMzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGNwYWN0aW9ucyBmcm9tICcuLi9saWInO1xuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG5jb25zdCByZWdpb24gPSAndXMtd2VzdC0yJzsgLy8gaGFyZGNvZGUgdGhlIHJlZ2lvblxuY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ2F3cy1jZGstY29kZXBpcGVsaW5lLWNsb3VkZm9ybWF0aW9uLWNyb3NzLXJlZ2lvbicsIHtcbiAgZW52OiB7XG4gICAgcmVnaW9uLFxuICB9LFxufSk7XG5cbmNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcsIHtcbiAgdmVyc2lvbmVkOiB0cnVlLFxuICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxufSk7XG5cbmNvbnN0IHNvdXJjZU91dHB1dCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoKTtcbmNvbnN0IHNvdXJjZUFjdGlvbiA9IG5ldyBjcGFjdGlvbnMuUzNTb3VyY2VBY3Rpb24oe1xuICBhY3Rpb25OYW1lOiAnUzMnLFxuICBidWNrZXRLZXk6ICdzb21lL3BhdGgnLFxuICBidWNrZXQsXG4gIG91dHB1dDogc291cmNlT3V0cHV0LFxufSk7XG5cbm5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUoc3RhY2ssICdNeVBpcGVsaW5lJywge1xuICBhcnRpZmFjdEJ1Y2tldDogYnVja2V0LFxuICBzdGFnZXM6IFtcbiAgICB7XG4gICAgICBzdGFnZU5hbWU6ICdTb3VyY2UnLFxuICAgICAgYWN0aW9uczogW3NvdXJjZUFjdGlvbl0sXG4gICAgfSxcbiAgICB7XG4gICAgICBzdGFnZU5hbWU6ICdDRk4nLFxuICAgICAgYWN0aW9uczogW1xuICAgICAgICBuZXcgY3BhY3Rpb25zLkNsb3VkRm9ybWF0aW9uQ3JlYXRlVXBkYXRlU3RhY2tBY3Rpb24oe1xuICAgICAgICAgIGFjdGlvbk5hbWU6ICdDRk5fRGVwbG95JyxcbiAgICAgICAgICBzdGFja05hbWU6ICdhd3MtY2RrLWNvZGVwaXBlbGluZS1jcm9zcy1yZWdpb24tZGVwbG95LXN0YWNrJyxcbiAgICAgICAgICB0ZW1wbGF0ZVBhdGg6IHNvdXJjZU91dHB1dC5hdFBhdGgoJ3RlbXBsYXRlLnltbCcpLFxuICAgICAgICAgIGFkbWluUGVybWlzc2lvbnM6IGZhbHNlLFxuICAgICAgICAgIHJlZ2lvbixcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0sXG4gIF0sXG59KTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=