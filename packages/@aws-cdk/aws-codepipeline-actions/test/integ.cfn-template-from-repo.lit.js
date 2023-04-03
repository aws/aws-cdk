"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codecommit = require("@aws-cdk/aws-codecommit");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const cdk = require("@aws-cdk/core");
const cpactions = require("../lib");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY2ZuLXRlbXBsYXRlLWZyb20tcmVwby5saXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5jZm4tdGVtcGxhdGUtZnJvbS1yZXBvLmxpdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNEQUFzRDtBQUN0RCwwREFBMEQ7QUFDMUQscUNBQXFDO0FBQ3JDLG9DQUFvQztBQUVwQyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLHFDQUFxQyxDQUFDLENBQUM7QUFFeEUsU0FBUztBQUNULHFDQUFxQztBQUNyQyxNQUFNLElBQUksR0FBRyxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLGNBQWMsRUFBRTtJQUM1RCxjQUFjLEVBQUUsZUFBZTtDQUNoQyxDQUFDLENBQUM7QUFDSCxNQUFNLFlBQVksR0FBRyxJQUFJLFlBQVksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUNqRSxNQUFNLE1BQU0sR0FBRyxJQUFJLFNBQVMsQ0FBQyxzQkFBc0IsQ0FBQztJQUNsRCxVQUFVLEVBQUUsUUFBUTtJQUNwQixVQUFVLEVBQUUsSUFBSTtJQUNoQixNQUFNLEVBQUUsWUFBWTtJQUNwQixPQUFPLEVBQUUsU0FBUyxDQUFDLGlCQUFpQixDQUFDLElBQUk7Q0FDMUMsQ0FBQyxDQUFDO0FBQ0gsTUFBTSxXQUFXLEdBQUc7SUFDbEIsU0FBUyxFQUFFLFFBQVE7SUFDbkIsT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFDO0NBQ2xCLENBQUM7QUFFRixxRUFBcUU7QUFDckUsTUFBTSxTQUFTLEdBQUcsVUFBVSxDQUFDO0FBQzdCLE1BQU0sYUFBYSxHQUFHLGlCQUFpQixDQUFDO0FBRXhDLE1BQU0sU0FBUyxHQUFHO0lBQ2hCLFNBQVMsRUFBRSxRQUFRO0lBQ25CLE9BQU8sRUFBRTtRQUNQLElBQUksU0FBUyxDQUFDLDBDQUEwQyxDQUFDO1lBQ3ZELFVBQVUsRUFBRSxnQkFBZ0I7WUFDNUIsU0FBUztZQUNULGFBQWE7WUFDYixnQkFBZ0IsRUFBRSxJQUFJO1lBQ3RCLFlBQVksRUFBRSxZQUFZLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQztZQUNsRCxRQUFRLEVBQUUsQ0FBQztTQUNaLENBQUM7UUFDRixJQUFJLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQztZQUNqQyxVQUFVLEVBQUUsZ0JBQWdCO1lBQzVCLFFBQVEsRUFBRSxDQUFDO1NBQ1osQ0FBQztRQUNGLElBQUksU0FBUyxDQUFDLG9DQUFvQyxDQUFDO1lBQ2pELFVBQVUsRUFBRSxnQkFBZ0I7WUFDNUIsU0FBUztZQUNULGFBQWE7WUFDYixRQUFRLEVBQUUsQ0FBQztTQUNaLENBQUM7S0FDSDtDQUNGLENBQUM7QUFFRixJQUFJLFlBQVksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRTtJQUMzQyxNQUFNLEVBQUU7UUFDTixXQUFXO1FBQ1gsU0FBUztLQUNWO0NBQ0YsQ0FBQyxDQUFDO0FBQ0gsU0FBUztBQUVULEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNvZGVjb21taXQgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVjb21taXQnO1xuaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lIGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlcGlwZWxpbmUnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY3BhY3Rpb25zIGZyb20gJy4uL2xpYic7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5jb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnYXdzLWNkay1jb2RlcGlwZWxpbmUtY2xvdWRmb3JtYXRpb24nKTtcblxuLy8vICFzaG93XG4vLyBTb3VyY2Ugc3RhZ2U6IHJlYWQgZnJvbSByZXBvc2l0b3J5XG5jb25zdCByZXBvID0gbmV3IGNvZGVjb21taXQuUmVwb3NpdG9yeShzdGFjaywgJ1RlbXBsYXRlUmVwbycsIHtcbiAgcmVwb3NpdG9yeU5hbWU6ICd0ZW1wbGF0ZS1yZXBvJyxcbn0pO1xuY29uc3Qgc291cmNlT3V0cHV0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgnU291cmNlQXJ0aWZhY3QnKTtcbmNvbnN0IHNvdXJjZSA9IG5ldyBjcGFjdGlvbnMuQ29kZUNvbW1pdFNvdXJjZUFjdGlvbih7XG4gIGFjdGlvbk5hbWU6ICdTb3VyY2UnLFxuICByZXBvc2l0b3J5OiByZXBvLFxuICBvdXRwdXQ6IHNvdXJjZU91dHB1dCxcbiAgdHJpZ2dlcjogY3BhY3Rpb25zLkNvZGVDb21taXRUcmlnZ2VyLlBPTEwsXG59KTtcbmNvbnN0IHNvdXJjZVN0YWdlID0ge1xuICBzdGFnZU5hbWU6ICdTb3VyY2UnLFxuICBhY3Rpb25zOiBbc291cmNlXSxcbn07XG5cbi8vIERlcGxveW1lbnQgc3RhZ2U6IGNyZWF0ZSBhbmQgZGVwbG95IGNoYW5nZXNldCB3aXRoIG1hbnVhbCBhcHByb3ZhbFxuY29uc3Qgc3RhY2tOYW1lID0gJ091clN0YWNrJztcbmNvbnN0IGNoYW5nZVNldE5hbWUgPSAnU3RhZ2VkQ2hhbmdlU2V0JztcblxuY29uc3QgcHJvZFN0YWdlID0ge1xuICBzdGFnZU5hbWU6ICdEZXBsb3knLFxuICBhY3Rpb25zOiBbXG4gICAgbmV3IGNwYWN0aW9ucy5DbG91ZEZvcm1hdGlvbkNyZWF0ZVJlcGxhY2VDaGFuZ2VTZXRBY3Rpb24oe1xuICAgICAgYWN0aW9uTmFtZTogJ1ByZXBhcmVDaGFuZ2VzJyxcbiAgICAgIHN0YWNrTmFtZSxcbiAgICAgIGNoYW5nZVNldE5hbWUsXG4gICAgICBhZG1pblBlcm1pc3Npb25zOiB0cnVlLFxuICAgICAgdGVtcGxhdGVQYXRoOiBzb3VyY2VPdXRwdXQuYXRQYXRoKCd0ZW1wbGF0ZS55YW1sJyksXG4gICAgICBydW5PcmRlcjogMSxcbiAgICB9KSxcbiAgICBuZXcgY3BhY3Rpb25zLk1hbnVhbEFwcHJvdmFsQWN0aW9uKHtcbiAgICAgIGFjdGlvbk5hbWU6ICdBcHByb3ZlQ2hhbmdlcycsXG4gICAgICBydW5PcmRlcjogMixcbiAgICB9KSxcbiAgICBuZXcgY3BhY3Rpb25zLkNsb3VkRm9ybWF0aW9uRXhlY3V0ZUNoYW5nZVNldEFjdGlvbih7XG4gICAgICBhY3Rpb25OYW1lOiAnRXhlY3V0ZUNoYW5nZXMnLFxuICAgICAgc3RhY2tOYW1lLFxuICAgICAgY2hhbmdlU2V0TmFtZSxcbiAgICAgIHJ1bk9yZGVyOiAzLFxuICAgIH0pLFxuICBdLFxufTtcblxubmV3IGNvZGVwaXBlbGluZS5QaXBlbGluZShzdGFjaywgJ1BpcGVsaW5lJywge1xuICBzdGFnZXM6IFtcbiAgICBzb3VyY2VTdGFnZSxcbiAgICBwcm9kU3RhZ2UsXG4gIF0sXG59KTtcbi8vLyAhaGlkZVxuXG5hcHAuc3ludGgoKTtcbiJdfQ==