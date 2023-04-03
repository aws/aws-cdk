"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codepipeline = require("@aws-cdk/aws-codepipeline");
const s3 = require("@aws-cdk/aws-s3");
const cdk = require("@aws-cdk/core");
const cpactions = require("../lib");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-jenkins');
const bucket = new s3.Bucket(stack, 'MyBucket', {
    versioned: true,
});
const pipeline = new codepipeline.Pipeline(stack, 'Pipeline', {
    artifactBucket: bucket,
});
const sourceOutput = new codepipeline.Artifact();
const sourceAction = new cpactions.S3SourceAction({
    actionName: 'S3',
    bucketKey: 'some/path',
    bucket,
    output: sourceOutput,
});
pipeline.addStage({
    stageName: 'Source',
    actions: [sourceAction],
});
const jenkinsProvider = new cpactions.JenkinsProvider(stack, 'JenkinsProvider', {
    providerName: 'JenkinsProvider',
    serverUrl: 'http://myjenkins.com:8080',
    version: '2',
});
pipeline.addStage({
    stageName: 'Build',
    actions: [
        new cpactions.JenkinsAction({
            actionName: 'JenkinsBuild',
            jenkinsProvider,
            type: cpactions.JenkinsActionType.BUILD,
            projectName: 'JenkinsProject1',
            inputs: [sourceOutput],
            outputs: [new codepipeline.Artifact()],
        }),
        new cpactions.JenkinsAction({
            actionName: 'JenkinsTest',
            jenkinsProvider,
            type: cpactions.JenkinsActionType.TEST,
            projectName: 'JenkinsProject2',
            inputs: [sourceOutput],
        }),
        new cpactions.JenkinsAction({
            actionName: 'JenkinsTest2',
            jenkinsProvider,
            type: cpactions.JenkinsActionType.TEST,
            projectName: 'JenkinsProject3',
            inputs: [sourceOutput],
        }),
    ],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucGlwZWxpbmUtamVua2lucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLnBpcGVsaW5lLWplbmtpbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwwREFBMEQ7QUFDMUQsc0NBQXNDO0FBQ3RDLHFDQUFxQztBQUNyQyxvQ0FBb0M7QUFFcEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSw4QkFBOEIsQ0FBQyxDQUFDO0FBRWpFLE1BQU0sTUFBTSxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFO0lBQzlDLFNBQVMsRUFBRSxJQUFJO0NBQ2hCLENBQUMsQ0FBQztBQUVILE1BQU0sUUFBUSxHQUFHLElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFO0lBQzVELGNBQWMsRUFBRSxNQUFNO0NBQ3ZCLENBQUMsQ0FBQztBQUVILE1BQU0sWUFBWSxHQUFHLElBQUksWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ2pELE1BQU0sWUFBWSxHQUFHLElBQUksU0FBUyxDQUFDLGNBQWMsQ0FBQztJQUNoRCxVQUFVLEVBQUUsSUFBSTtJQUNoQixTQUFTLEVBQUUsV0FBVztJQUN0QixNQUFNO0lBQ04sTUFBTSxFQUFFLFlBQVk7Q0FDckIsQ0FBQyxDQUFDO0FBQ0gsUUFBUSxDQUFDLFFBQVEsQ0FBQztJQUNoQixTQUFTLEVBQUUsUUFBUTtJQUNuQixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7Q0FDeEIsQ0FBQyxDQUFDO0FBRUgsTUFBTSxlQUFlLEdBQUcsSUFBSSxTQUFTLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxpQkFBaUIsRUFBRTtJQUM5RSxZQUFZLEVBQUUsaUJBQWlCO0lBQy9CLFNBQVMsRUFBRSwyQkFBMkI7SUFDdEMsT0FBTyxFQUFFLEdBQUc7Q0FDYixDQUFDLENBQUM7QUFFSCxRQUFRLENBQUMsUUFBUSxDQUFDO0lBQ2hCLFNBQVMsRUFBRSxPQUFPO0lBQ2xCLE9BQU8sRUFBRTtRQUNQLElBQUksU0FBUyxDQUFDLGFBQWEsQ0FBQztZQUMxQixVQUFVLEVBQUUsY0FBYztZQUMxQixlQUFlO1lBQ2YsSUFBSSxFQUFFLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLO1lBQ3ZDLFdBQVcsRUFBRSxpQkFBaUI7WUFDOUIsTUFBTSxFQUFFLENBQUMsWUFBWSxDQUFDO1lBQ3RCLE9BQU8sRUFBRSxDQUFDLElBQUksWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ3ZDLENBQUM7UUFDRixJQUFJLFNBQVMsQ0FBQyxhQUFhLENBQUM7WUFDMUIsVUFBVSxFQUFFLGFBQWE7WUFDekIsZUFBZTtZQUNmLElBQUksRUFBRSxTQUFTLENBQUMsaUJBQWlCLENBQUMsSUFBSTtZQUN0QyxXQUFXLEVBQUUsaUJBQWlCO1lBQzlCLE1BQU0sRUFBRSxDQUFDLFlBQVksQ0FBQztTQUN2QixDQUFDO1FBQ0YsSUFBSSxTQUFTLENBQUMsYUFBYSxDQUFDO1lBQzFCLFVBQVUsRUFBRSxjQUFjO1lBQzFCLGVBQWU7WUFDZixJQUFJLEVBQUUsU0FBUyxDQUFDLGlCQUFpQixDQUFDLElBQUk7WUFDdEMsV0FBVyxFQUFFLGlCQUFpQjtZQUM5QixNQUFNLEVBQUUsQ0FBQyxZQUFZLENBQUM7U0FDdkIsQ0FBQztLQUNIO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lIGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlcGlwZWxpbmUnO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnQGF3cy1jZGsvYXdzLXMzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGNwYWN0aW9ucyBmcm9tICcuLi9saWInO1xuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG5jb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnYXdzLWNkay1jb2RlcGlwZWxpbmUtamVua2lucycpO1xuXG5jb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnLCB7XG4gIHZlcnNpb25lZDogdHJ1ZSxcbn0pO1xuXG5jb25zdCBwaXBlbGluZSA9IG5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUoc3RhY2ssICdQaXBlbGluZScsIHtcbiAgYXJ0aWZhY3RCdWNrZXQ6IGJ1Y2tldCxcbn0pO1xuXG5jb25zdCBzb3VyY2VPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCk7XG5jb25zdCBzb3VyY2VBY3Rpb24gPSBuZXcgY3BhY3Rpb25zLlMzU291cmNlQWN0aW9uKHtcbiAgYWN0aW9uTmFtZTogJ1MzJyxcbiAgYnVja2V0S2V5OiAnc29tZS9wYXRoJyxcbiAgYnVja2V0LFxuICBvdXRwdXQ6IHNvdXJjZU91dHB1dCxcbn0pO1xucGlwZWxpbmUuYWRkU3RhZ2Uoe1xuICBzdGFnZU5hbWU6ICdTb3VyY2UnLFxuICBhY3Rpb25zOiBbc291cmNlQWN0aW9uXSxcbn0pO1xuXG5jb25zdCBqZW5raW5zUHJvdmlkZXIgPSBuZXcgY3BhY3Rpb25zLkplbmtpbnNQcm92aWRlcihzdGFjaywgJ0plbmtpbnNQcm92aWRlcicsIHtcbiAgcHJvdmlkZXJOYW1lOiAnSmVua2luc1Byb3ZpZGVyJyxcbiAgc2VydmVyVXJsOiAnaHR0cDovL215amVua2lucy5jb206ODA4MCcsXG4gIHZlcnNpb246ICcyJyxcbn0pO1xuXG5waXBlbGluZS5hZGRTdGFnZSh7XG4gIHN0YWdlTmFtZTogJ0J1aWxkJyxcbiAgYWN0aW9uczogW1xuICAgIG5ldyBjcGFjdGlvbnMuSmVua2luc0FjdGlvbih7XG4gICAgICBhY3Rpb25OYW1lOiAnSmVua2luc0J1aWxkJyxcbiAgICAgIGplbmtpbnNQcm92aWRlcixcbiAgICAgIHR5cGU6IGNwYWN0aW9ucy5KZW5raW5zQWN0aW9uVHlwZS5CVUlMRCxcbiAgICAgIHByb2plY3ROYW1lOiAnSmVua2luc1Byb2plY3QxJyxcbiAgICAgIGlucHV0czogW3NvdXJjZU91dHB1dF0sXG4gICAgICBvdXRwdXRzOiBbbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpXSxcbiAgICB9KSxcbiAgICBuZXcgY3BhY3Rpb25zLkplbmtpbnNBY3Rpb24oe1xuICAgICAgYWN0aW9uTmFtZTogJ0plbmtpbnNUZXN0JyxcbiAgICAgIGplbmtpbnNQcm92aWRlcixcbiAgICAgIHR5cGU6IGNwYWN0aW9ucy5KZW5raW5zQWN0aW9uVHlwZS5URVNULFxuICAgICAgcHJvamVjdE5hbWU6ICdKZW5raW5zUHJvamVjdDInLFxuICAgICAgaW5wdXRzOiBbc291cmNlT3V0cHV0XSxcbiAgICB9KSxcbiAgICBuZXcgY3BhY3Rpb25zLkplbmtpbnNBY3Rpb24oe1xuICAgICAgYWN0aW9uTmFtZTogJ0plbmtpbnNUZXN0MicsXG4gICAgICBqZW5raW5zUHJvdmlkZXIsXG4gICAgICB0eXBlOiBjcGFjdGlvbnMuSmVua2luc0FjdGlvblR5cGUuVEVTVCxcbiAgICAgIHByb2plY3ROYW1lOiAnSmVua2luc1Byb2plY3QzJyxcbiAgICAgIGlucHV0czogW3NvdXJjZU91dHB1dF0sXG4gICAgfSksXG4gIF0sXG59KTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=