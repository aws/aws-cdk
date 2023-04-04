"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codecommit = require("aws-cdk-lib/aws-codecommit");
const codepipeline = require("aws-cdk-lib/aws-codepipeline");
const cdk = require("aws-cdk-lib");
const cpactions = require("aws-cdk-lib/aws-codepipeline-actions");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-cloudformation');
/// !show
// Source stage: read from repository
const repo = new codecommit.Repository(stack, 'TemplateRepo', {
    repositoryName: 'template-repo',
});
const sourceOutput = new codepipeline.Artifact('SourceArtifact');
const source = new cpactions.CodeCommitSourceAction({
    actionName: 'Source',
    repository: repo,
    output: sourceOutput,
    trigger: cpactions.CodeCommitTrigger.POLL,
});
const sourceStage = {
    stageName: 'Source',
    actions: [source],
};
// Deployment stage: create and deploy changeset with manual approval
const stackName = 'OurStack';
const changeSetName = 'StagedChangeSet';
const prodStage = {
    stageName: 'Deploy',
    actions: [
        new cpactions.CloudFormationCreateReplaceChangeSetAction({
            actionName: 'PrepareChanges',
            stackName,
            changeSetName,
            adminPermissions: true,
            templatePath: sourceOutput.atPath('template.yaml'),
            runOrder: 1,
        }),
        new cpactions.ManualApprovalAction({
            actionName: 'ApproveChanges',
            runOrder: 2,
        }),
        new cpactions.CloudFormationExecuteChangeSetAction({
            actionName: 'ExecuteChanges',
            stackName,
            changeSetName,
            runOrder: 3,
        }),
    ],
};
new codepipeline.Pipeline(stack, 'Pipeline', {
    stages: [
        sourceStage,
        prodStage,
    ],
});
/// !hide
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY2ZuLXRlbXBsYXRlLWZyb20tcmVwby5saXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5jZm4tdGVtcGxhdGUtZnJvbS1yZXBvLmxpdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlEQUF5RDtBQUN6RCw2REFBNkQ7QUFDN0QsbUNBQW1DO0FBQ25DLGtFQUFrRTtBQUVsRSxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLHFDQUFxQyxDQUFDLENBQUM7QUFFeEUsU0FBUztBQUNULHFDQUFxQztBQUNyQyxNQUFNLElBQUksR0FBRyxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLGNBQWMsRUFBRTtJQUM1RCxjQUFjLEVBQUUsZUFBZTtDQUNoQyxDQUFDLENBQUM7QUFDSCxNQUFNLFlBQVksR0FBRyxJQUFJLFlBQVksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUNqRSxNQUFNLE1BQU0sR0FBRyxJQUFJLFNBQVMsQ0FBQyxzQkFBc0IsQ0FBQztJQUNsRCxVQUFVLEVBQUUsUUFBUTtJQUNwQixVQUFVLEVBQUUsSUFBSTtJQUNoQixNQUFNLEVBQUUsWUFBWTtJQUNwQixPQUFPLEVBQUUsU0FBUyxDQUFDLGlCQUFpQixDQUFDLElBQUk7Q0FDMUMsQ0FBQyxDQUFDO0FBQ0gsTUFBTSxXQUFXLEdBQUc7SUFDbEIsU0FBUyxFQUFFLFFBQVE7SUFDbkIsT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFDO0NBQ2xCLENBQUM7QUFFRixxRUFBcUU7QUFDckUsTUFBTSxTQUFTLEdBQUcsVUFBVSxDQUFDO0FBQzdCLE1BQU0sYUFBYSxHQUFHLGlCQUFpQixDQUFDO0FBRXhDLE1BQU0sU0FBUyxHQUFHO0lBQ2hCLFNBQVMsRUFBRSxRQUFRO0lBQ25CLE9BQU8sRUFBRTtRQUNQLElBQUksU0FBUyxDQUFDLDBDQUEwQyxDQUFDO1lBQ3ZELFVBQVUsRUFBRSxnQkFBZ0I7WUFDNUIsU0FBUztZQUNULGFBQWE7WUFDYixnQkFBZ0IsRUFBRSxJQUFJO1lBQ3RCLFlBQVksRUFBRSxZQUFZLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQztZQUNsRCxRQUFRLEVBQUUsQ0FBQztTQUNaLENBQUM7UUFDRixJQUFJLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQztZQUNqQyxVQUFVLEVBQUUsZ0JBQWdCO1lBQzVCLFFBQVEsRUFBRSxDQUFDO1NBQ1osQ0FBQztRQUNGLElBQUksU0FBUyxDQUFDLG9DQUFvQyxDQUFDO1lBQ2pELFVBQVUsRUFBRSxnQkFBZ0I7WUFDNUIsU0FBUztZQUNULGFBQWE7WUFDYixRQUFRLEVBQUUsQ0FBQztTQUNaLENBQUM7S0FDSDtDQUNGLENBQUM7QUFFRixJQUFJLFlBQVksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRTtJQUMzQyxNQUFNLEVBQUU7UUFDTixXQUFXO1FBQ1gsU0FBUztLQUNWO0NBQ0YsQ0FBQyxDQUFDO0FBQ0gsU0FBUztBQUVULEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNvZGVjb21taXQgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNvZGVjb21taXQnO1xuaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lIGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2RlcGlwZWxpbmUnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGNwYWN0aW9ucyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZXBpcGVsaW5lLWFjdGlvbnMnO1xuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ2F3cy1jZGstY29kZXBpcGVsaW5lLWNsb3VkZm9ybWF0aW9uJyk7XG5cbi8vLyAhc2hvd1xuLy8gU291cmNlIHN0YWdlOiByZWFkIGZyb20gcmVwb3NpdG9yeVxuY29uc3QgcmVwbyA9IG5ldyBjb2RlY29tbWl0LlJlcG9zaXRvcnkoc3RhY2ssICdUZW1wbGF0ZVJlcG8nLCB7XG4gIHJlcG9zaXRvcnlOYW1lOiAndGVtcGxhdGUtcmVwbycsXG59KTtcbmNvbnN0IHNvdXJjZU91dHB1dCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoJ1NvdXJjZUFydGlmYWN0Jyk7XG5jb25zdCBzb3VyY2UgPSBuZXcgY3BhY3Rpb25zLkNvZGVDb21taXRTb3VyY2VBY3Rpb24oe1xuICBhY3Rpb25OYW1lOiAnU291cmNlJyxcbiAgcmVwb3NpdG9yeTogcmVwbyxcbiAgb3V0cHV0OiBzb3VyY2VPdXRwdXQsXG4gIHRyaWdnZXI6IGNwYWN0aW9ucy5Db2RlQ29tbWl0VHJpZ2dlci5QT0xMLFxufSk7XG5jb25zdCBzb3VyY2VTdGFnZSA9IHtcbiAgc3RhZ2VOYW1lOiAnU291cmNlJyxcbiAgYWN0aW9uczogW3NvdXJjZV0sXG59O1xuXG4vLyBEZXBsb3ltZW50IHN0YWdlOiBjcmVhdGUgYW5kIGRlcGxveSBjaGFuZ2VzZXQgd2l0aCBtYW51YWwgYXBwcm92YWxcbmNvbnN0IHN0YWNrTmFtZSA9ICdPdXJTdGFjayc7XG5jb25zdCBjaGFuZ2VTZXROYW1lID0gJ1N0YWdlZENoYW5nZVNldCc7XG5cbmNvbnN0IHByb2RTdGFnZSA9IHtcbiAgc3RhZ2VOYW1lOiAnRGVwbG95JyxcbiAgYWN0aW9uczogW1xuICAgIG5ldyBjcGFjdGlvbnMuQ2xvdWRGb3JtYXRpb25DcmVhdGVSZXBsYWNlQ2hhbmdlU2V0QWN0aW9uKHtcbiAgICAgIGFjdGlvbk5hbWU6ICdQcmVwYXJlQ2hhbmdlcycsXG4gICAgICBzdGFja05hbWUsXG4gICAgICBjaGFuZ2VTZXROYW1lLFxuICAgICAgYWRtaW5QZXJtaXNzaW9uczogdHJ1ZSxcbiAgICAgIHRlbXBsYXRlUGF0aDogc291cmNlT3V0cHV0LmF0UGF0aCgndGVtcGxhdGUueWFtbCcpLFxuICAgICAgcnVuT3JkZXI6IDEsXG4gICAgfSksXG4gICAgbmV3IGNwYWN0aW9ucy5NYW51YWxBcHByb3ZhbEFjdGlvbih7XG4gICAgICBhY3Rpb25OYW1lOiAnQXBwcm92ZUNoYW5nZXMnLFxuICAgICAgcnVuT3JkZXI6IDIsXG4gICAgfSksXG4gICAgbmV3IGNwYWN0aW9ucy5DbG91ZEZvcm1hdGlvbkV4ZWN1dGVDaGFuZ2VTZXRBY3Rpb24oe1xuICAgICAgYWN0aW9uTmFtZTogJ0V4ZWN1dGVDaGFuZ2VzJyxcbiAgICAgIHN0YWNrTmFtZSxcbiAgICAgIGNoYW5nZVNldE5hbWUsXG4gICAgICBydW5PcmRlcjogMyxcbiAgICB9KSxcbiAgXSxcbn07XG5cbm5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUoc3RhY2ssICdQaXBlbGluZScsIHtcbiAgc3RhZ2VzOiBbXG4gICAgc291cmNlU3RhZ2UsXG4gICAgcHJvZFN0YWdlLFxuICBdLFxufSk7XG4vLy8gIWhpZGVcblxuYXBwLnN5bnRoKCk7XG4iXX0=