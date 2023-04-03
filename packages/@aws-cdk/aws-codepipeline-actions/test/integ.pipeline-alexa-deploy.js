"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codepipeline = require("@aws-cdk/aws-codepipeline");
const s3 = require("@aws-cdk/aws-s3");
const core_1 = require("@aws-cdk/core");
const cpactions = require("../lib");
const app = new core_1.App();
const stack = new core_1.Stack(app, 'aws-cdk-codepipeline-alexa-deploy');
const bucket = new s3.Bucket(stack, 'PipelineBucket', {
    versioned: true,
    removalPolicy: core_1.RemovalPolicy.DESTROY,
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
            clientSecret: core_1.SecretValue.unsafePlainText('clientSecret'),
            refreshToken: core_1.SecretValue.unsafePlainText('refreshToken'),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucGlwZWxpbmUtYWxleGEtZGVwbG95LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcucGlwZWxpbmUtYWxleGEtZGVwbG95LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMERBQTBEO0FBQzFELHNDQUFzQztBQUN0Qyx3Q0FBdUU7QUFDdkUsb0NBQW9DO0FBRXBDLE1BQU0sR0FBRyxHQUFHLElBQUksVUFBRyxFQUFFLENBQUM7QUFFdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLENBQUMsR0FBRyxFQUFFLG1DQUFtQyxDQUFDLENBQUM7QUFFbEUsTUFBTSxNQUFNLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsRUFBRTtJQUNwRCxTQUFTLEVBQUUsSUFBSTtJQUNmLGFBQWEsRUFBRSxvQkFBYSxDQUFDLE9BQU87Q0FDckMsQ0FBQyxDQUFDO0FBQ0gsTUFBTSxZQUFZLEdBQUcsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDakUsTUFBTSxZQUFZLEdBQUcsSUFBSSxTQUFTLENBQUMsY0FBYyxDQUFDO0lBQ2hELFVBQVUsRUFBRSxRQUFRO0lBQ3BCLE1BQU0sRUFBRSxZQUFZO0lBQ3BCLE1BQU07SUFDTixTQUFTLEVBQUUsS0FBSztDQUNqQixDQUFDLENBQUM7QUFDSCxNQUFNLFdBQVcsR0FBRztJQUNsQixTQUFTLEVBQUUsUUFBUTtJQUNuQixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7Q0FDeEIsQ0FBQztBQUVGLE1BQU0sV0FBVyxHQUFHO0lBQ2xCLFNBQVMsRUFBRSxRQUFRO0lBQ25CLE9BQU8sRUFBRTtRQUNQLElBQUksU0FBUyxDQUFDLHNCQUFzQixDQUFDO1lBQ25DLFVBQVUsRUFBRSxhQUFhO1lBQ3pCLFFBQVEsRUFBRSxDQUFDO1lBQ1gsS0FBSyxFQUFFLFlBQVk7WUFDbkIsUUFBUSxFQUFFLFVBQVU7WUFDcEIsWUFBWSxFQUFFLGtCQUFXLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQztZQUN6RCxZQUFZLEVBQUUsa0JBQVcsQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDO1lBQ3pELE9BQU8sRUFBRSxzREFBc0Q7U0FDaEUsQ0FBQztLQUNIO0NBQ0YsQ0FBQztBQUVGLElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFO0lBQzNDLE1BQU0sRUFBRTtRQUNOLFdBQVc7UUFDWCxXQUFXO0tBQ1o7Q0FDRixDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmUgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVwaXBlbGluZSc7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICdAYXdzLWNkay9hd3MtczMnO1xuaW1wb3J0IHsgQXBwLCBSZW1vdmFsUG9saWN5LCBTZWNyZXRWYWx1ZSwgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGNwYWN0aW9ucyBmcm9tICcuLi9saWInO1xuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5cbmNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ2F3cy1jZGstY29kZXBpcGVsaW5lLWFsZXhhLWRlcGxveScpO1xuXG5jb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnUGlwZWxpbmVCdWNrZXQnLCB7XG4gIHZlcnNpb25lZDogdHJ1ZSxcbiAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxufSk7XG5jb25zdCBzb3VyY2VPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCdTb3VyY2VBcnRpZmFjdCcpO1xuY29uc3Qgc291cmNlQWN0aW9uID0gbmV3IGNwYWN0aW9ucy5TM1NvdXJjZUFjdGlvbih7XG4gIGFjdGlvbk5hbWU6ICdTb3VyY2UnLFxuICBvdXRwdXQ6IHNvdXJjZU91dHB1dCxcbiAgYnVja2V0LFxuICBidWNrZXRLZXk6ICdrZXknLFxufSk7XG5jb25zdCBzb3VyY2VTdGFnZSA9IHtcbiAgc3RhZ2VOYW1lOiAnU291cmNlJyxcbiAgYWN0aW9uczogW3NvdXJjZUFjdGlvbl0sXG59O1xuXG5jb25zdCBkZXBsb3lTdGFnZSA9IHtcbiAgc3RhZ2VOYW1lOiAnRGVwbG95JyxcbiAgYWN0aW9uczogW1xuICAgIG5ldyBjcGFjdGlvbnMuQWxleGFTa2lsbERlcGxveUFjdGlvbih7XG4gICAgICBhY3Rpb25OYW1lOiAnRGVwbG95U2tpbGwnLFxuICAgICAgcnVuT3JkZXI6IDEsXG4gICAgICBpbnB1dDogc291cmNlT3V0cHV0LFxuICAgICAgY2xpZW50SWQ6ICdjbGllbnRJZCcsXG4gICAgICBjbGllbnRTZWNyZXQ6IFNlY3JldFZhbHVlLnVuc2FmZVBsYWluVGV4dCgnY2xpZW50U2VjcmV0JyksXG4gICAgICByZWZyZXNoVG9rZW46IFNlY3JldFZhbHVlLnVuc2FmZVBsYWluVGV4dCgncmVmcmVzaFRva2VuJyksXG4gICAgICBza2lsbElkOiAnYW16bjEuYXNrLnNraWxsLjEyMzQ1Njc4LTEyMzQtMTIzNC0xMjM0LTEyMzQ1Njc4OTAxMicsXG4gICAgfSksXG4gIF0sXG59O1xuXG5uZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHN0YWNrLCAnUGlwZWxpbmUnLCB7XG4gIHN0YWdlczogW1xuICAgIHNvdXJjZVN0YWdlLFxuICAgIGRlcGxveVN0YWdlLFxuICBdLFxufSk7XG5cbmFwcC5zeW50aCgpO1xuIl19