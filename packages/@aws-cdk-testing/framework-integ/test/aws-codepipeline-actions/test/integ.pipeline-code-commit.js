"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codecommit = require("aws-cdk-lib/aws-codecommit");
const codepipeline = require("aws-cdk-lib/aws-codepipeline");
const cdk = require("aws-cdk-lib");
const cpactions = require("aws-cdk-lib/aws-codepipeline-actions");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucGlwZWxpbmUtY29kZS1jb21taXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5waXBlbGluZS1jb2RlLWNvbW1pdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlEQUF5RDtBQUN6RCw2REFBNkQ7QUFDN0QsbUNBQW1DO0FBQ25DLGtFQUFrRTtBQUVsRSxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLGlDQUFpQyxDQUFDLENBQUM7QUFFcEUsTUFBTSxJQUFJLEdBQUcsSUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7SUFDdEQsY0FBYyxFQUFFLFNBQVM7Q0FDMUIsQ0FBQyxDQUFDO0FBRUgsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7SUFDM0MsTUFBTSxFQUFFO1FBQ047WUFDRSxTQUFTLEVBQUUsUUFBUTtZQUNuQixPQUFPLEVBQUU7Z0JBQ1AsSUFBSSxTQUFTLENBQUMsc0JBQXNCLENBQUM7b0JBQ25DLFVBQVUsRUFBRSxRQUFRO29CQUNwQixVQUFVLEVBQUUsSUFBSTtvQkFDaEIsTUFBTSxFQUFFLElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQztpQkFDcEQsQ0FBQzthQUNIO1NBQ0Y7UUFDRDtZQUNFLFNBQVMsRUFBRSxPQUFPO1lBQ2xCLE9BQU8sRUFBRTtnQkFDUCxJQUFJLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsQ0FBQzthQUM3RDtTQUNGO0tBQ0Y7Q0FDRixDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjb2RlY29tbWl0IGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2RlY29tbWl0JztcbmltcG9ydCAqIGFzIGNvZGVwaXBlbGluZSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZXBpcGVsaW5lJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBjcGFjdGlvbnMgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNvZGVwaXBlbGluZS1hY3Rpb25zJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxuY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ2F3cy1jZGstY29kZXBpcGVsaW5lLWNvZGVjb21taXQnKTtcblxuY29uc3QgcmVwbyA9IG5ldyBjb2RlY29tbWl0LlJlcG9zaXRvcnkoc3RhY2ssICdNeVJlcG8nLCB7XG4gIHJlcG9zaXRvcnlOYW1lOiAnbXktcmVwbycsXG59KTtcblxubmV3IGNvZGVwaXBlbGluZS5QaXBlbGluZShzdGFjaywgJ1BpcGVsaW5lJywge1xuICBzdGFnZXM6IFtcbiAgICB7XG4gICAgICBzdGFnZU5hbWU6ICdzb3VyY2UnLFxuICAgICAgYWN0aW9uczogW1xuICAgICAgICBuZXcgY3BhY3Rpb25zLkNvZGVDb21taXRTb3VyY2VBY3Rpb24oe1xuICAgICAgICAgIGFjdGlvbk5hbWU6ICdzb3VyY2UnLFxuICAgICAgICAgIHJlcG9zaXRvcnk6IHJlcG8sXG4gICAgICAgICAgb3V0cHV0OiBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCdTb3VyY2VBcnRpZmFjdCcpLFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICB7XG4gICAgICBzdGFnZU5hbWU6ICdidWlsZCcsXG4gICAgICBhY3Rpb25zOiBbXG4gICAgICAgIG5ldyBjcGFjdGlvbnMuTWFudWFsQXBwcm92YWxBY3Rpb24oeyBhY3Rpb25OYW1lOiAnbWFudWFsJyB9KSxcbiAgICAgIF0sXG4gICAgfSxcbiAgXSxcbn0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==