"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codepipeline = require("@aws-cdk/aws-codepipeline");
const aws_iam_1 = require("@aws-cdk/aws-iam");
const s3 = require("@aws-cdk/aws-s3");
const cdk = require("@aws-cdk/core");
const cpactions = require("../lib");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-cloudformation');
const pipeline = new codepipeline.Pipeline(stack, 'Pipeline');
const bucket = new s3.Bucket(stack, 'PipelineBucket', {
    versioned: true,
    removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const sourceOutput = new codepipeline.Artifact('SourceArtifact');
const additionalArtifact = new codepipeline.Artifact('AdditionalArtifact');
const source = new cpactions.S3SourceAction({
    actionName: 'Source',
    output: sourceOutput,
    bucket,
    bucketKey: 'key',
});
const sourceStage = {
    stageName: 'Source',
    actions: [
        source,
        new cpactions.S3SourceAction({
            actionName: 'AdditionalSource',
            output: additionalArtifact,
            bucket,
            bucketKey: 'additional/key',
        }),
    ],
};
const changeSetName = 'ChangeSetIntegTest';
const stackName = 'IntegTest-TestActionStack';
const role = new aws_iam_1.Role(stack, 'CfnChangeSetRole', {
    assumedBy: new aws_iam_1.ServicePrincipal('cloudformation.amazonaws.com'),
});
pipeline.addStage(sourceStage);
pipeline.addStage({
    stageName: 'CFN',
    actions: [
        new cpactions.CloudFormationCreateReplaceChangeSetAction({
            actionName: 'DeployCFN',
            changeSetName,
            stackName,
            deploymentRole: role,
            templatePath: sourceOutput.atPath('test.yaml'),
            adminPermissions: false,
            parameterOverrides: {
                BucketName: sourceOutput.bucketName,
                ObjectKey: sourceOutput.objectKey,
                Url: additionalArtifact.url,
                OtherParam: sourceOutput.getParam('params.json', 'OtherParam'),
            },
            extraInputs: [additionalArtifact],
        }),
    ],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucGlwZWxpbmUtY2ZuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcucGlwZWxpbmUtY2ZuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMERBQTBEO0FBQzFELDhDQUEwRDtBQUMxRCxzQ0FBc0M7QUFDdEMscUNBQXFDO0FBQ3JDLG9DQUFvQztBQUVwQyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLHFDQUFxQyxDQUFDLENBQUM7QUFFeEUsTUFBTSxRQUFRLEdBQUcsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztBQUU5RCxNQUFNLE1BQU0sR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLGdCQUFnQixFQUFFO0lBQ3BELFNBQVMsRUFBRSxJQUFJO0lBQ2YsYUFBYSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTztDQUN6QyxDQUFDLENBQUM7QUFFSCxNQUFNLFlBQVksR0FBRyxJQUFJLFlBQVksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUNqRSxNQUFNLGtCQUFrQixHQUFHLElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQzNFLE1BQU0sTUFBTSxHQUFHLElBQUksU0FBUyxDQUFDLGNBQWMsQ0FBQztJQUMxQyxVQUFVLEVBQUUsUUFBUTtJQUNwQixNQUFNLEVBQUUsWUFBWTtJQUNwQixNQUFNO0lBQ04sU0FBUyxFQUFFLEtBQUs7Q0FDakIsQ0FBQyxDQUFDO0FBQ0gsTUFBTSxXQUFXLEdBQUc7SUFDbEIsU0FBUyxFQUFFLFFBQVE7SUFDbkIsT0FBTyxFQUFFO1FBQ1AsTUFBTTtRQUNOLElBQUksU0FBUyxDQUFDLGNBQWMsQ0FBQztZQUMzQixVQUFVLEVBQUUsa0JBQWtCO1lBQzlCLE1BQU0sRUFBRSxrQkFBa0I7WUFDMUIsTUFBTTtZQUNOLFNBQVMsRUFBRSxnQkFBZ0I7U0FDNUIsQ0FBQztLQUNIO0NBQ0YsQ0FBQztBQUVGLE1BQU0sYUFBYSxHQUFHLG9CQUFvQixDQUFDO0FBQzNDLE1BQU0sU0FBUyxHQUFHLDJCQUEyQixDQUFDO0FBQzlDLE1BQU0sSUFBSSxHQUFHLElBQUksY0FBSSxDQUFDLEtBQUssRUFBRSxrQkFBa0IsRUFBRTtJQUMvQyxTQUFTLEVBQUUsSUFBSSwwQkFBZ0IsQ0FBQyw4QkFBOEIsQ0FBQztDQUNoRSxDQUFDLENBQUM7QUFFSCxRQUFRLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQy9CLFFBQVEsQ0FBQyxRQUFRLENBQUM7SUFDaEIsU0FBUyxFQUFFLEtBQUs7SUFDaEIsT0FBTyxFQUFFO1FBQ1AsSUFBSSxTQUFTLENBQUMsMENBQTBDLENBQUM7WUFDdkQsVUFBVSxFQUFFLFdBQVc7WUFDdkIsYUFBYTtZQUNiLFNBQVM7WUFDVCxjQUFjLEVBQUUsSUFBSTtZQUNwQixZQUFZLEVBQUUsWUFBWSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7WUFDOUMsZ0JBQWdCLEVBQUUsS0FBSztZQUN2QixrQkFBa0IsRUFBRTtnQkFDbEIsVUFBVSxFQUFFLFlBQVksQ0FBQyxVQUFVO2dCQUNuQyxTQUFTLEVBQUUsWUFBWSxDQUFDLFNBQVM7Z0JBQ2pDLEdBQUcsRUFBRSxrQkFBa0IsQ0FBQyxHQUFHO2dCQUMzQixVQUFVLEVBQUUsWUFBWSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEVBQUUsWUFBWSxDQUFDO2FBQy9EO1lBQ0QsV0FBVyxFQUFFLENBQUMsa0JBQWtCLENBQUM7U0FDbEMsQ0FBQztLQUNIO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lIGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlcGlwZWxpbmUnO1xuaW1wb3J0IHsgUm9sZSwgU2VydmljZVByaW5jaXBhbCB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnQGF3cy1jZGsvYXdzLXMzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGNwYWN0aW9ucyBmcm9tICcuLi9saWInO1xuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG5jb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnYXdzLWNkay1jb2RlcGlwZWxpbmUtY2xvdWRmb3JtYXRpb24nKTtcblxuY29uc3QgcGlwZWxpbmUgPSBuZXcgY29kZXBpcGVsaW5lLlBpcGVsaW5lKHN0YWNrLCAnUGlwZWxpbmUnKTtcblxuY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ1BpcGVsaW5lQnVja2V0Jywge1xuICB2ZXJzaW9uZWQ6IHRydWUsXG4gIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXG59KTtcblxuY29uc3Qgc291cmNlT3V0cHV0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgnU291cmNlQXJ0aWZhY3QnKTtcbmNvbnN0IGFkZGl0aW9uYWxBcnRpZmFjdCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoJ0FkZGl0aW9uYWxBcnRpZmFjdCcpO1xuY29uc3Qgc291cmNlID0gbmV3IGNwYWN0aW9ucy5TM1NvdXJjZUFjdGlvbih7XG4gIGFjdGlvbk5hbWU6ICdTb3VyY2UnLFxuICBvdXRwdXQ6IHNvdXJjZU91dHB1dCxcbiAgYnVja2V0LFxuICBidWNrZXRLZXk6ICdrZXknLFxufSk7XG5jb25zdCBzb3VyY2VTdGFnZSA9IHtcbiAgc3RhZ2VOYW1lOiAnU291cmNlJyxcbiAgYWN0aW9uczogW1xuICAgIHNvdXJjZSxcbiAgICBuZXcgY3BhY3Rpb25zLlMzU291cmNlQWN0aW9uKHtcbiAgICAgIGFjdGlvbk5hbWU6ICdBZGRpdGlvbmFsU291cmNlJyxcbiAgICAgIG91dHB1dDogYWRkaXRpb25hbEFydGlmYWN0LFxuICAgICAgYnVja2V0LFxuICAgICAgYnVja2V0S2V5OiAnYWRkaXRpb25hbC9rZXknLFxuICAgIH0pLFxuICBdLFxufTtcblxuY29uc3QgY2hhbmdlU2V0TmFtZSA9ICdDaGFuZ2VTZXRJbnRlZ1Rlc3QnO1xuY29uc3Qgc3RhY2tOYW1lID0gJ0ludGVnVGVzdC1UZXN0QWN0aW9uU3RhY2snO1xuY29uc3Qgcm9sZSA9IG5ldyBSb2xlKHN0YWNrLCAnQ2ZuQ2hhbmdlU2V0Um9sZScsIHtcbiAgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgnY2xvdWRmb3JtYXRpb24uYW1hem9uYXdzLmNvbScpLFxufSk7XG5cbnBpcGVsaW5lLmFkZFN0YWdlKHNvdXJjZVN0YWdlKTtcbnBpcGVsaW5lLmFkZFN0YWdlKHtcbiAgc3RhZ2VOYW1lOiAnQ0ZOJyxcbiAgYWN0aW9uczogW1xuICAgIG5ldyBjcGFjdGlvbnMuQ2xvdWRGb3JtYXRpb25DcmVhdGVSZXBsYWNlQ2hhbmdlU2V0QWN0aW9uKHtcbiAgICAgIGFjdGlvbk5hbWU6ICdEZXBsb3lDRk4nLFxuICAgICAgY2hhbmdlU2V0TmFtZSxcbiAgICAgIHN0YWNrTmFtZSxcbiAgICAgIGRlcGxveW1lbnRSb2xlOiByb2xlLFxuICAgICAgdGVtcGxhdGVQYXRoOiBzb3VyY2VPdXRwdXQuYXRQYXRoKCd0ZXN0LnlhbWwnKSxcbiAgICAgIGFkbWluUGVybWlzc2lvbnM6IGZhbHNlLFxuICAgICAgcGFyYW1ldGVyT3ZlcnJpZGVzOiB7XG4gICAgICAgIEJ1Y2tldE5hbWU6IHNvdXJjZU91dHB1dC5idWNrZXROYW1lLFxuICAgICAgICBPYmplY3RLZXk6IHNvdXJjZU91dHB1dC5vYmplY3RLZXksXG4gICAgICAgIFVybDogYWRkaXRpb25hbEFydGlmYWN0LnVybCxcbiAgICAgICAgT3RoZXJQYXJhbTogc291cmNlT3V0cHV0LmdldFBhcmFtKCdwYXJhbXMuanNvbicsICdPdGhlclBhcmFtJyksXG4gICAgICB9LFxuICAgICAgZXh0cmFJbnB1dHM6IFthZGRpdGlvbmFsQXJ0aWZhY3RdLFxuICAgIH0pLFxuICBdLFxufSk7XG5cbmFwcC5zeW50aCgpO1xuIl19