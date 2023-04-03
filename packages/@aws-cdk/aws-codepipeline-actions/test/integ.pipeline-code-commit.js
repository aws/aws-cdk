"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codecommit = require("@aws-cdk/aws-codecommit");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const cdk = require("@aws-cdk/core");
const cpactions = require("../lib");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-codecommit');
const repo = new codecommit.Repository(stack, 'MyRepo', {
    repositoryName: 'my-repo',
});
new codepipeline.Pipeline(stack, 'Pipeline', {
    stages: [
        {
            stageName: 'source',
            actions: [
                new cpactions.CodeCommitSourceAction({
                    actionName: 'source',
                    repository: repo,
                    output: new codepipeline.Artifact('SourceArtifact'),
                }),
            ],
        },
        {
            stageName: 'build',
            actions: [
                new cpactions.ManualApprovalAction({ actionName: 'manual' }),
            ],
        },
    ],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucGlwZWxpbmUtY29kZS1jb21taXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5waXBlbGluZS1jb2RlLWNvbW1pdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNEQUFzRDtBQUN0RCwwREFBMEQ7QUFDMUQscUNBQXFDO0FBQ3JDLG9DQUFvQztBQUVwQyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLGlDQUFpQyxDQUFDLENBQUM7QUFFcEUsTUFBTSxJQUFJLEdBQUcsSUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7SUFDdEQsY0FBYyxFQUFFLFNBQVM7Q0FDMUIsQ0FBQyxDQUFDO0FBRUgsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7SUFDM0MsTUFBTSxFQUFFO1FBQ047WUFDRSxTQUFTLEVBQUUsUUFBUTtZQUNuQixPQUFPLEVBQUU7Z0JBQ1AsSUFBSSxTQUFTLENBQUMsc0JBQXNCLENBQUM7b0JBQ25DLFVBQVUsRUFBRSxRQUFRO29CQUNwQixVQUFVLEVBQUUsSUFBSTtvQkFDaEIsTUFBTSxFQUFFLElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQztpQkFDcEQsQ0FBQzthQUNIO1NBQ0Y7UUFDRDtZQUNFLFNBQVMsRUFBRSxPQUFPO1lBQ2xCLE9BQU8sRUFBRTtnQkFDUCxJQUFJLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsQ0FBQzthQUM3RDtTQUNGO0tBQ0Y7Q0FDRixDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjb2RlY29tbWl0IGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlY29tbWl0JztcbmltcG9ydCAqIGFzIGNvZGVwaXBlbGluZSBmcm9tICdAYXdzLWNkay9hd3MtY29kZXBpcGVsaW5lJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGNwYWN0aW9ucyBmcm9tICcuLi9saWInO1xuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG5jb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnYXdzLWNkay1jb2RlcGlwZWxpbmUtY29kZWNvbW1pdCcpO1xuXG5jb25zdCByZXBvID0gbmV3IGNvZGVjb21taXQuUmVwb3NpdG9yeShzdGFjaywgJ015UmVwbycsIHtcbiAgcmVwb3NpdG9yeU5hbWU6ICdteS1yZXBvJyxcbn0pO1xuXG5uZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHN0YWNrLCAnUGlwZWxpbmUnLCB7XG4gIHN0YWdlczogW1xuICAgIHtcbiAgICAgIHN0YWdlTmFtZTogJ3NvdXJjZScsXG4gICAgICBhY3Rpb25zOiBbXG4gICAgICAgIG5ldyBjcGFjdGlvbnMuQ29kZUNvbW1pdFNvdXJjZUFjdGlvbih7XG4gICAgICAgICAgYWN0aW9uTmFtZTogJ3NvdXJjZScsXG4gICAgICAgICAgcmVwb3NpdG9yeTogcmVwbyxcbiAgICAgICAgICBvdXRwdXQ6IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoJ1NvdXJjZUFydGlmYWN0JyksXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHN0YWdlTmFtZTogJ2J1aWxkJyxcbiAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgbmV3IGNwYWN0aW9ucy5NYW51YWxBcHByb3ZhbEFjdGlvbih7IGFjdGlvbk5hbWU6ICdtYW51YWwnIH0pLFxuICAgICAgXSxcbiAgICB9LFxuICBdLFxufSk7XG5cbmFwcC5zeW50aCgpO1xuIl19