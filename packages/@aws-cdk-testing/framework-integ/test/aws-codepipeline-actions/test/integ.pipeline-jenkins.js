"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codepipeline = require("aws-cdk-lib/aws-codepipeline");
const s3 = require("aws-cdk-lib/aws-s3");
const cdk = require("aws-cdk-lib");
const cpactions = require("aws-cdk-lib/aws-codepipeline-actions");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucGlwZWxpbmUtamVua2lucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLnBpcGVsaW5lLWplbmtpbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2REFBNkQ7QUFDN0QseUNBQXlDO0FBQ3pDLG1DQUFtQztBQUNuQyxrRUFBa0U7QUFFbEUsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSw4QkFBOEIsQ0FBQyxDQUFDO0FBRWpFLE1BQU0sTUFBTSxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFO0lBQzlDLFNBQVMsRUFBRSxJQUFJO0NBQ2hCLENBQUMsQ0FBQztBQUVILE1BQU0sUUFBUSxHQUFHLElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFO0lBQzVELGNBQWMsRUFBRSxNQUFNO0NBQ3ZCLENBQUMsQ0FBQztBQUVILE1BQU0sWUFBWSxHQUFHLElBQUksWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ2pELE1BQU0sWUFBWSxHQUFHLElBQUksU0FBUyxDQUFDLGNBQWMsQ0FBQztJQUNoRCxVQUFVLEVBQUUsSUFBSTtJQUNoQixTQUFTLEVBQUUsV0FBVztJQUN0QixNQUFNO0lBQ04sTUFBTSxFQUFFLFlBQVk7Q0FDckIsQ0FBQyxDQUFDO0FBQ0gsUUFBUSxDQUFDLFFBQVEsQ0FBQztJQUNoQixTQUFTLEVBQUUsUUFBUTtJQUNuQixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7Q0FDeEIsQ0FBQyxDQUFDO0FBRUgsTUFBTSxlQUFlLEdBQUcsSUFBSSxTQUFTLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxpQkFBaUIsRUFBRTtJQUM5RSxZQUFZLEVBQUUsaUJBQWlCO0lBQy9CLFNBQVMsRUFBRSwyQkFBMkI7SUFDdEMsT0FBTyxFQUFFLEdBQUc7Q0FDYixDQUFDLENBQUM7QUFFSCxRQUFRLENBQUMsUUFBUSxDQUFDO0lBQ2hCLFNBQVMsRUFBRSxPQUFPO0lBQ2xCLE9BQU8sRUFBRTtRQUNQLElBQUksU0FBUyxDQUFDLGFBQWEsQ0FBQztZQUMxQixVQUFVLEVBQUUsY0FBYztZQUMxQixlQUFlO1lBQ2YsSUFBSSxFQUFFLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLO1lBQ3ZDLFdBQVcsRUFBRSxpQkFBaUI7WUFDOUIsTUFBTSxFQUFFLENBQUMsWUFBWSxDQUFDO1lBQ3RCLE9BQU8sRUFBRSxDQUFDLElBQUksWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ3ZDLENBQUM7UUFDRixJQUFJLFNBQVMsQ0FBQyxhQUFhLENBQUM7WUFDMUIsVUFBVSxFQUFFLGFBQWE7WUFDekIsZUFBZTtZQUNmLElBQUksRUFBRSxTQUFTLENBQUMsaUJBQWlCLENBQUMsSUFBSTtZQUN0QyxXQUFXLEVBQUUsaUJBQWlCO1lBQzlCLE1BQU0sRUFBRSxDQUFDLFlBQVksQ0FBQztTQUN2QixDQUFDO1FBQ0YsSUFBSSxTQUFTLENBQUMsYUFBYSxDQUFDO1lBQzFCLFVBQVUsRUFBRSxjQUFjO1lBQzFCLGVBQWU7WUFDZixJQUFJLEVBQUUsU0FBUyxDQUFDLGlCQUFpQixDQUFDLElBQUk7WUFDdEMsV0FBVyxFQUFFLGlCQUFpQjtZQUM5QixNQUFNLEVBQUUsQ0FBQyxZQUFZLENBQUM7U0FDdkIsQ0FBQztLQUNIO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lIGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2RlcGlwZWxpbmUnO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBjcGFjdGlvbnMgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNvZGVwaXBlbGluZS1hY3Rpb25zJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxuY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ2F3cy1jZGstY29kZXBpcGVsaW5lLWplbmtpbnMnKTtcblxuY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0Jywge1xuICB2ZXJzaW9uZWQ6IHRydWUsXG59KTtcblxuY29uc3QgcGlwZWxpbmUgPSBuZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHN0YWNrLCAnUGlwZWxpbmUnLCB7XG4gIGFydGlmYWN0QnVja2V0OiBidWNrZXQsXG59KTtcblxuY29uc3Qgc291cmNlT3V0cHV0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpO1xuY29uc3Qgc291cmNlQWN0aW9uID0gbmV3IGNwYWN0aW9ucy5TM1NvdXJjZUFjdGlvbih7XG4gIGFjdGlvbk5hbWU6ICdTMycsXG4gIGJ1Y2tldEtleTogJ3NvbWUvcGF0aCcsXG4gIGJ1Y2tldCxcbiAgb3V0cHV0OiBzb3VyY2VPdXRwdXQsXG59KTtcbnBpcGVsaW5lLmFkZFN0YWdlKHtcbiAgc3RhZ2VOYW1lOiAnU291cmNlJyxcbiAgYWN0aW9uczogW3NvdXJjZUFjdGlvbl0sXG59KTtcblxuY29uc3QgamVua2luc1Byb3ZpZGVyID0gbmV3IGNwYWN0aW9ucy5KZW5raW5zUHJvdmlkZXIoc3RhY2ssICdKZW5raW5zUHJvdmlkZXInLCB7XG4gIHByb3ZpZGVyTmFtZTogJ0plbmtpbnNQcm92aWRlcicsXG4gIHNlcnZlclVybDogJ2h0dHA6Ly9teWplbmtpbnMuY29tOjgwODAnLFxuICB2ZXJzaW9uOiAnMicsXG59KTtcblxucGlwZWxpbmUuYWRkU3RhZ2Uoe1xuICBzdGFnZU5hbWU6ICdCdWlsZCcsXG4gIGFjdGlvbnM6IFtcbiAgICBuZXcgY3BhY3Rpb25zLkplbmtpbnNBY3Rpb24oe1xuICAgICAgYWN0aW9uTmFtZTogJ0plbmtpbnNCdWlsZCcsXG4gICAgICBqZW5raW5zUHJvdmlkZXIsXG4gICAgICB0eXBlOiBjcGFjdGlvbnMuSmVua2luc0FjdGlvblR5cGUuQlVJTEQsXG4gICAgICBwcm9qZWN0TmFtZTogJ0plbmtpbnNQcm9qZWN0MScsXG4gICAgICBpbnB1dHM6IFtzb3VyY2VPdXRwdXRdLFxuICAgICAgb3V0cHV0czogW25ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoKV0sXG4gICAgfSksXG4gICAgbmV3IGNwYWN0aW9ucy5KZW5raW5zQWN0aW9uKHtcbiAgICAgIGFjdGlvbk5hbWU6ICdKZW5raW5zVGVzdCcsXG4gICAgICBqZW5raW5zUHJvdmlkZXIsXG4gICAgICB0eXBlOiBjcGFjdGlvbnMuSmVua2luc0FjdGlvblR5cGUuVEVTVCxcbiAgICAgIHByb2plY3ROYW1lOiAnSmVua2luc1Byb2plY3QyJyxcbiAgICAgIGlucHV0czogW3NvdXJjZU91dHB1dF0sXG4gICAgfSksXG4gICAgbmV3IGNwYWN0aW9ucy5KZW5raW5zQWN0aW9uKHtcbiAgICAgIGFjdGlvbk5hbWU6ICdKZW5raW5zVGVzdDInLFxuICAgICAgamVua2luc1Byb3ZpZGVyLFxuICAgICAgdHlwZTogY3BhY3Rpb25zLkplbmtpbnNBY3Rpb25UeXBlLlRFU1QsXG4gICAgICBwcm9qZWN0TmFtZTogJ0plbmtpbnNQcm9qZWN0MycsXG4gICAgICBpbnB1dHM6IFtzb3VyY2VPdXRwdXRdLFxuICAgIH0pLFxuICBdLFxufSk7XG5cbmFwcC5zeW50aCgpO1xuIl19