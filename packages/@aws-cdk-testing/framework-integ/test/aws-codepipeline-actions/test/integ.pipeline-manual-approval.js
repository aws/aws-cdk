"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codepipeline = require("aws-cdk-lib/aws-codepipeline");
const s3 = require("aws-cdk-lib/aws-s3");
const cdk = require("aws-cdk-lib");
const cpactions = require("aws-cdk-lib/aws-codepipeline-actions");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-manual-approval');
const bucket = new s3.Bucket(stack, 'Bucket');
new codepipeline.Pipeline(stack, 'Pipeline', {
    artifactBucket: bucket,
    stages: [
        {
            stageName: 'Source',
            actions: [
                new cpactions.S3SourceAction({
                    actionName: 'S3',
                    bucket,
                    bucketKey: 'file.zip',
                    output: new codepipeline.Artifact(),
                }),
            ],
        },
        {
            stageName: 'Approve',
            actions: [
                new cpactions.ManualApprovalAction({
                    actionName: 'ManualApproval',
                    notifyEmails: ['adamruka85@gmail.com'],
                }),
            ],
        },
    ],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucGlwZWxpbmUtbWFudWFsLWFwcHJvdmFsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcucGlwZWxpbmUtbWFudWFsLWFwcHJvdmFsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkRBQTZEO0FBQzdELHlDQUF5QztBQUN6QyxtQ0FBbUM7QUFDbkMsa0VBQWtFO0FBRWxFLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRTFCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsc0NBQXNDLENBQUMsQ0FBQztBQUV6RSxNQUFNLE1BQU0sR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBRTlDLElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFO0lBQzNDLGNBQWMsRUFBRSxNQUFNO0lBQ3RCLE1BQU0sRUFBRTtRQUNOO1lBQ0UsU0FBUyxFQUFFLFFBQVE7WUFDbkIsT0FBTyxFQUFFO2dCQUNQLElBQUksU0FBUyxDQUFDLGNBQWMsQ0FBQztvQkFDM0IsVUFBVSxFQUFFLElBQUk7b0JBQ2hCLE1BQU07b0JBQ04sU0FBUyxFQUFFLFVBQVU7b0JBQ3JCLE1BQU0sRUFBRSxJQUFJLFlBQVksQ0FBQyxRQUFRLEVBQUU7aUJBQ3BDLENBQUM7YUFDSDtTQUNGO1FBQ0Q7WUFDRSxTQUFTLEVBQUUsU0FBUztZQUNwQixPQUFPLEVBQUU7Z0JBQ1AsSUFBSSxTQUFTLENBQUMsb0JBQW9CLENBQUM7b0JBQ2pDLFVBQVUsRUFBRSxnQkFBZ0I7b0JBQzVCLFlBQVksRUFBRSxDQUFDLHNCQUFzQixDQUFDO2lCQUN2QyxDQUFDO2FBQ0g7U0FDRjtLQUNGO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lIGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2RlcGlwZWxpbmUnO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBjcGFjdGlvbnMgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNvZGVwaXBlbGluZS1hY3Rpb25zJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxuY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ2F3cy1jZGstY29kZXBpcGVsaW5lLW1hbnVhbC1hcHByb3ZhbCcpO1xuXG5jb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnQnVja2V0Jyk7XG5cbm5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUoc3RhY2ssICdQaXBlbGluZScsIHtcbiAgYXJ0aWZhY3RCdWNrZXQ6IGJ1Y2tldCxcbiAgc3RhZ2VzOiBbXG4gICAge1xuICAgICAgc3RhZ2VOYW1lOiAnU291cmNlJyxcbiAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgbmV3IGNwYWN0aW9ucy5TM1NvdXJjZUFjdGlvbih7XG4gICAgICAgICAgYWN0aW9uTmFtZTogJ1MzJyxcbiAgICAgICAgICBidWNrZXQsXG4gICAgICAgICAgYnVja2V0S2V5OiAnZmlsZS56aXAnLFxuICAgICAgICAgIG91dHB1dDogbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpLFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICB7XG4gICAgICBzdGFnZU5hbWU6ICdBcHByb3ZlJyxcbiAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgbmV3IGNwYWN0aW9ucy5NYW51YWxBcHByb3ZhbEFjdGlvbih7XG4gICAgICAgICAgYWN0aW9uTmFtZTogJ01hbnVhbEFwcHJvdmFsJyxcbiAgICAgICAgICBub3RpZnlFbWFpbHM6IFsnYWRhbXJ1a2E4NUBnbWFpbC5jb20nXSxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0sXG4gIF0sXG59KTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=