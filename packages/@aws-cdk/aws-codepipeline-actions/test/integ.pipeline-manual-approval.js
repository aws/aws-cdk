"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codepipeline = require("@aws-cdk/aws-codepipeline");
const s3 = require("@aws-cdk/aws-s3");
const cdk = require("@aws-cdk/core");
const cpactions = require("../lib");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucGlwZWxpbmUtbWFudWFsLWFwcHJvdmFsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcucGlwZWxpbmUtbWFudWFsLWFwcHJvdmFsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMERBQTBEO0FBQzFELHNDQUFzQztBQUN0QyxxQ0FBcUM7QUFDckMsb0NBQW9DO0FBRXBDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRTFCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsc0NBQXNDLENBQUMsQ0FBQztBQUV6RSxNQUFNLE1BQU0sR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBRTlDLElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFO0lBQzNDLGNBQWMsRUFBRSxNQUFNO0lBQ3RCLE1BQU0sRUFBRTtRQUNOO1lBQ0UsU0FBUyxFQUFFLFFBQVE7WUFDbkIsT0FBTyxFQUFFO2dCQUNQLElBQUksU0FBUyxDQUFDLGNBQWMsQ0FBQztvQkFDM0IsVUFBVSxFQUFFLElBQUk7b0JBQ2hCLE1BQU07b0JBQ04sU0FBUyxFQUFFLFVBQVU7b0JBQ3JCLE1BQU0sRUFBRSxJQUFJLFlBQVksQ0FBQyxRQUFRLEVBQUU7aUJBQ3BDLENBQUM7YUFDSDtTQUNGO1FBQ0Q7WUFDRSxTQUFTLEVBQUUsU0FBUztZQUNwQixPQUFPLEVBQUU7Z0JBQ1AsSUFBSSxTQUFTLENBQUMsb0JBQW9CLENBQUM7b0JBQ2pDLFVBQVUsRUFBRSxnQkFBZ0I7b0JBQzVCLFlBQVksRUFBRSxDQUFDLHNCQUFzQixDQUFDO2lCQUN2QyxDQUFDO2FBQ0g7U0FDRjtLQUNGO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lIGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlcGlwZWxpbmUnO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnQGF3cy1jZGsvYXdzLXMzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGNwYWN0aW9ucyBmcm9tICcuLi9saWInO1xuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG5jb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnYXdzLWNkay1jb2RlcGlwZWxpbmUtbWFudWFsLWFwcHJvdmFsJyk7XG5cbmNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdCdWNrZXQnKTtcblxubmV3IGNvZGVwaXBlbGluZS5QaXBlbGluZShzdGFjaywgJ1BpcGVsaW5lJywge1xuICBhcnRpZmFjdEJ1Y2tldDogYnVja2V0LFxuICBzdGFnZXM6IFtcbiAgICB7XG4gICAgICBzdGFnZU5hbWU6ICdTb3VyY2UnLFxuICAgICAgYWN0aW9uczogW1xuICAgICAgICBuZXcgY3BhY3Rpb25zLlMzU291cmNlQWN0aW9uKHtcbiAgICAgICAgICBhY3Rpb25OYW1lOiAnUzMnLFxuICAgICAgICAgIGJ1Y2tldCxcbiAgICAgICAgICBidWNrZXRLZXk6ICdmaWxlLnppcCcsXG4gICAgICAgICAgb3V0cHV0OiBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCksXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHN0YWdlTmFtZTogJ0FwcHJvdmUnLFxuICAgICAgYWN0aW9uczogW1xuICAgICAgICBuZXcgY3BhY3Rpb25zLk1hbnVhbEFwcHJvdmFsQWN0aW9uKHtcbiAgICAgICAgICBhY3Rpb25OYW1lOiAnTWFudWFsQXBwcm92YWwnLFxuICAgICAgICAgIG5vdGlmeUVtYWlsczogWydhZGFtcnVrYTg1QGdtYWlsLmNvbSddLFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgfSxcbiAgXSxcbn0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==