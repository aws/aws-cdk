"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codepipeline = require("aws-cdk-lib/aws-codepipeline");
const s3 = require("aws-cdk-lib/aws-s3");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const cpactions = require("aws-cdk-lib/aws-codepipeline-actions");
const app = new aws_cdk_lib_1.App();
const stack = new aws_cdk_lib_1.Stack(app, 'aws-cdk-codepipeline-alexa-deploy');
const bucket = new s3.Bucket(stack, 'PipelineBucket', {
    versioned: true,
    removalPolicy: aws_cdk_lib_1.RemovalPolicy.DESTROY,
});
const sourceOutput = new codepipeline.Artifact('SourceArtifact');
const sourceAction = new cpactions.S3SourceAction({
    actionName: 'Source',
    output: sourceOutput,
    bucket,
    bucketKey: 'key',
});
const sourceStage = {
    stageName: 'Source',
    actions: [sourceAction],
};
const deployStage = {
    stageName: 'Deploy',
    actions: [
        new cpactions.AlexaSkillDeployAction({
            actionName: 'DeploySkill',
            runOrder: 1,
            input: sourceOutput,
            clientId: 'clientId',
            clientSecret: aws_cdk_lib_1.SecretValue.unsafePlainText('clientSecret'),
            refreshToken: aws_cdk_lib_1.SecretValue.unsafePlainText('refreshToken'),
            skillId: 'amzn1.ask.skill.12345678-1234-1234-1234-123456789012',
        }),
    ],
};
new codepipeline.Pipeline(stack, 'Pipeline', {
    stages: [
        sourceStage,
        deployStage,
    ],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucGlwZWxpbmUtYWxleGEtZGVwbG95LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcucGlwZWxpbmUtYWxleGEtZGVwbG95LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkRBQTZEO0FBQzdELHlDQUF5QztBQUN6Qyw2Q0FBcUU7QUFDckUsa0VBQWtFO0FBRWxFLE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQUcsRUFBRSxDQUFDO0FBRXRCLE1BQU0sS0FBSyxHQUFHLElBQUksbUJBQUssQ0FBQyxHQUFHLEVBQUUsbUNBQW1DLENBQUMsQ0FBQztBQUVsRSxNQUFNLE1BQU0sR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLGdCQUFnQixFQUFFO0lBQ3BELFNBQVMsRUFBRSxJQUFJO0lBQ2YsYUFBYSxFQUFFLDJCQUFhLENBQUMsT0FBTztDQUNyQyxDQUFDLENBQUM7QUFDSCxNQUFNLFlBQVksR0FBRyxJQUFJLFlBQVksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUNqRSxNQUFNLFlBQVksR0FBRyxJQUFJLFNBQVMsQ0FBQyxjQUFjLENBQUM7SUFDaEQsVUFBVSxFQUFFLFFBQVE7SUFDcEIsTUFBTSxFQUFFLFlBQVk7SUFDcEIsTUFBTTtJQUNOLFNBQVMsRUFBRSxLQUFLO0NBQ2pCLENBQUMsQ0FBQztBQUNILE1BQU0sV0FBVyxHQUFHO0lBQ2xCLFNBQVMsRUFBRSxRQUFRO0lBQ25CLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztDQUN4QixDQUFDO0FBRUYsTUFBTSxXQUFXLEdBQUc7SUFDbEIsU0FBUyxFQUFFLFFBQVE7SUFDbkIsT0FBTyxFQUFFO1FBQ1AsSUFBSSxTQUFTLENBQUMsc0JBQXNCLENBQUM7WUFDbkMsVUFBVSxFQUFFLGFBQWE7WUFDekIsUUFBUSxFQUFFLENBQUM7WUFDWCxLQUFLLEVBQUUsWUFBWTtZQUNuQixRQUFRLEVBQUUsVUFBVTtZQUNwQixZQUFZLEVBQUUseUJBQVcsQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDO1lBQ3pELFlBQVksRUFBRSx5QkFBVyxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUM7WUFDekQsT0FBTyxFQUFFLHNEQUFzRDtTQUNoRSxDQUFDO0tBQ0g7Q0FDRixDQUFDO0FBRUYsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7SUFDM0MsTUFBTSxFQUFFO1FBQ04sV0FBVztRQUNYLFdBQVc7S0FDWjtDQUNGLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNvZGVwaXBlbGluZSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZXBpcGVsaW5lJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XG5pbXBvcnQgeyBBcHAsIFJlbW92YWxQb2xpY3ksIFNlY3JldFZhbHVlLCBTdGFjayB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGNwYWN0aW9ucyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZXBpcGVsaW5lLWFjdGlvbnMnO1xuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5cbmNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ2F3cy1jZGstY29kZXBpcGVsaW5lLWFsZXhhLWRlcGxveScpO1xuXG5jb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnUGlwZWxpbmVCdWNrZXQnLCB7XG4gIHZlcnNpb25lZDogdHJ1ZSxcbiAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxufSk7XG5jb25zdCBzb3VyY2VPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCdTb3VyY2VBcnRpZmFjdCcpO1xuY29uc3Qgc291cmNlQWN0aW9uID0gbmV3IGNwYWN0aW9ucy5TM1NvdXJjZUFjdGlvbih7XG4gIGFjdGlvbk5hbWU6ICdTb3VyY2UnLFxuICBvdXRwdXQ6IHNvdXJjZU91dHB1dCxcbiAgYnVja2V0LFxuICBidWNrZXRLZXk6ICdrZXknLFxufSk7XG5jb25zdCBzb3VyY2VTdGFnZSA9IHtcbiAgc3RhZ2VOYW1lOiAnU291cmNlJyxcbiAgYWN0aW9uczogW3NvdXJjZUFjdGlvbl0sXG59O1xuXG5jb25zdCBkZXBsb3lTdGFnZSA9IHtcbiAgc3RhZ2VOYW1lOiAnRGVwbG95JyxcbiAgYWN0aW9uczogW1xuICAgIG5ldyBjcGFjdGlvbnMuQWxleGFTa2lsbERlcGxveUFjdGlvbih7XG4gICAgICBhY3Rpb25OYW1lOiAnRGVwbG95U2tpbGwnLFxuICAgICAgcnVuT3JkZXI6IDEsXG4gICAgICBpbnB1dDogc291cmNlT3V0cHV0LFxuICAgICAgY2xpZW50SWQ6ICdjbGllbnRJZCcsXG4gICAgICBjbGllbnRTZWNyZXQ6IFNlY3JldFZhbHVlLnVuc2FmZVBsYWluVGV4dCgnY2xpZW50U2VjcmV0JyksXG4gICAgICByZWZyZXNoVG9rZW46IFNlY3JldFZhbHVlLnVuc2FmZVBsYWluVGV4dCgncmVmcmVzaFRva2VuJyksXG4gICAgICBza2lsbElkOiAnYW16bjEuYXNrLnNraWxsLjEyMzQ1Njc4LTEyMzQtMTIzNC0xMjM0LTEyMzQ1Njc4OTAxMicsXG4gICAgfSksXG4gIF0sXG59O1xuXG5uZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHN0YWNrLCAnUGlwZWxpbmUnLCB7XG4gIHN0YWdlczogW1xuICAgIHNvdXJjZVN0YWdlLFxuICAgIGRlcGxveVN0YWdlLFxuICBdLFxufSk7XG5cbmFwcC5zeW50aCgpO1xuIl19