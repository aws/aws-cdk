"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codepipeline = require("aws-cdk-lib/aws-codepipeline");
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const s3 = require("aws-cdk-lib/aws-s3");
const cdk = require("aws-cdk-lib");
const cpactions = require("aws-cdk-lib/aws-codepipeline-actions");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucGlwZWxpbmUtY2ZuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcucGlwZWxpbmUtY2ZuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkRBQTZEO0FBQzdELGlEQUE2RDtBQUM3RCx5Q0FBeUM7QUFDekMsbUNBQW1DO0FBQ25DLGtFQUFrRTtBQUVsRSxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLHFDQUFxQyxDQUFDLENBQUM7QUFFeEUsTUFBTSxRQUFRLEdBQUcsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztBQUU5RCxNQUFNLE1BQU0sR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLGdCQUFnQixFQUFFO0lBQ3BELFNBQVMsRUFBRSxJQUFJO0lBQ2YsYUFBYSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTztDQUN6QyxDQUFDLENBQUM7QUFFSCxNQUFNLFlBQVksR0FBRyxJQUFJLFlBQVksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUNqRSxNQUFNLGtCQUFrQixHQUFHLElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQzNFLE1BQU0sTUFBTSxHQUFHLElBQUksU0FBUyxDQUFDLGNBQWMsQ0FBQztJQUMxQyxVQUFVLEVBQUUsUUFBUTtJQUNwQixNQUFNLEVBQUUsWUFBWTtJQUNwQixNQUFNO0lBQ04sU0FBUyxFQUFFLEtBQUs7Q0FDakIsQ0FBQyxDQUFDO0FBQ0gsTUFBTSxXQUFXLEdBQUc7SUFDbEIsU0FBUyxFQUFFLFFBQVE7SUFDbkIsT0FBTyxFQUFFO1FBQ1AsTUFBTTtRQUNOLElBQUksU0FBUyxDQUFDLGNBQWMsQ0FBQztZQUMzQixVQUFVLEVBQUUsa0JBQWtCO1lBQzlCLE1BQU0sRUFBRSxrQkFBa0I7WUFDMUIsTUFBTTtZQUNOLFNBQVMsRUFBRSxnQkFBZ0I7U0FDNUIsQ0FBQztLQUNIO0NBQ0YsQ0FBQztBQUVGLE1BQU0sYUFBYSxHQUFHLG9CQUFvQixDQUFDO0FBQzNDLE1BQU0sU0FBUyxHQUFHLDJCQUEyQixDQUFDO0FBQzlDLE1BQU0sSUFBSSxHQUFHLElBQUksY0FBSSxDQUFDLEtBQUssRUFBRSxrQkFBa0IsRUFBRTtJQUMvQyxTQUFTLEVBQUUsSUFBSSwwQkFBZ0IsQ0FBQyw4QkFBOEIsQ0FBQztDQUNoRSxDQUFDLENBQUM7QUFFSCxRQUFRLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQy9CLFFBQVEsQ0FBQyxRQUFRLENBQUM7SUFDaEIsU0FBUyxFQUFFLEtBQUs7SUFDaEIsT0FBTyxFQUFFO1FBQ1AsSUFBSSxTQUFTLENBQUMsMENBQTBDLENBQUM7WUFDdkQsVUFBVSxFQUFFLFdBQVc7WUFDdkIsYUFBYTtZQUNiLFNBQVM7WUFDVCxjQUFjLEVBQUUsSUFBSTtZQUNwQixZQUFZLEVBQUUsWUFBWSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7WUFDOUMsZ0JBQWdCLEVBQUUsS0FBSztZQUN2QixrQkFBa0IsRUFBRTtnQkFDbEIsVUFBVSxFQUFFLFlBQVksQ0FBQyxVQUFVO2dCQUNuQyxTQUFTLEVBQUUsWUFBWSxDQUFDLFNBQVM7Z0JBQ2pDLEdBQUcsRUFBRSxrQkFBa0IsQ0FBQyxHQUFHO2dCQUMzQixVQUFVLEVBQUUsWUFBWSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEVBQUUsWUFBWSxDQUFDO2FBQy9EO1lBQ0QsV0FBVyxFQUFFLENBQUMsa0JBQWtCLENBQUM7U0FDbEMsQ0FBQztLQUNIO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lIGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2RlcGlwZWxpbmUnO1xuaW1wb3J0IHsgUm9sZSwgU2VydmljZVByaW5jaXBhbCB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBjcGFjdGlvbnMgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNvZGVwaXBlbGluZS1hY3Rpb25zJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxuY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ2F3cy1jZGstY29kZXBpcGVsaW5lLWNsb3VkZm9ybWF0aW9uJyk7XG5cbmNvbnN0IHBpcGVsaW5lID0gbmV3IGNvZGVwaXBlbGluZS5QaXBlbGluZShzdGFjaywgJ1BpcGVsaW5lJyk7XG5cbmNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdQaXBlbGluZUJ1Y2tldCcsIHtcbiAgdmVyc2lvbmVkOiB0cnVlLFxuICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxufSk7XG5cbmNvbnN0IHNvdXJjZU91dHB1dCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoJ1NvdXJjZUFydGlmYWN0Jyk7XG5jb25zdCBhZGRpdGlvbmFsQXJ0aWZhY3QgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCdBZGRpdGlvbmFsQXJ0aWZhY3QnKTtcbmNvbnN0IHNvdXJjZSA9IG5ldyBjcGFjdGlvbnMuUzNTb3VyY2VBY3Rpb24oe1xuICBhY3Rpb25OYW1lOiAnU291cmNlJyxcbiAgb3V0cHV0OiBzb3VyY2VPdXRwdXQsXG4gIGJ1Y2tldCxcbiAgYnVja2V0S2V5OiAna2V5Jyxcbn0pO1xuY29uc3Qgc291cmNlU3RhZ2UgPSB7XG4gIHN0YWdlTmFtZTogJ1NvdXJjZScsXG4gIGFjdGlvbnM6IFtcbiAgICBzb3VyY2UsXG4gICAgbmV3IGNwYWN0aW9ucy5TM1NvdXJjZUFjdGlvbih7XG4gICAgICBhY3Rpb25OYW1lOiAnQWRkaXRpb25hbFNvdXJjZScsXG4gICAgICBvdXRwdXQ6IGFkZGl0aW9uYWxBcnRpZmFjdCxcbiAgICAgIGJ1Y2tldCxcbiAgICAgIGJ1Y2tldEtleTogJ2FkZGl0aW9uYWwva2V5JyxcbiAgICB9KSxcbiAgXSxcbn07XG5cbmNvbnN0IGNoYW5nZVNldE5hbWUgPSAnQ2hhbmdlU2V0SW50ZWdUZXN0JztcbmNvbnN0IHN0YWNrTmFtZSA9ICdJbnRlZ1Rlc3QtVGVzdEFjdGlvblN0YWNrJztcbmNvbnN0IHJvbGUgPSBuZXcgUm9sZShzdGFjaywgJ0NmbkNoYW5nZVNldFJvbGUnLCB7XG4gIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ2Nsb3VkZm9ybWF0aW9uLmFtYXpvbmF3cy5jb20nKSxcbn0pO1xuXG5waXBlbGluZS5hZGRTdGFnZShzb3VyY2VTdGFnZSk7XG5waXBlbGluZS5hZGRTdGFnZSh7XG4gIHN0YWdlTmFtZTogJ0NGTicsXG4gIGFjdGlvbnM6IFtcbiAgICBuZXcgY3BhY3Rpb25zLkNsb3VkRm9ybWF0aW9uQ3JlYXRlUmVwbGFjZUNoYW5nZVNldEFjdGlvbih7XG4gICAgICBhY3Rpb25OYW1lOiAnRGVwbG95Q0ZOJyxcbiAgICAgIGNoYW5nZVNldE5hbWUsXG4gICAgICBzdGFja05hbWUsXG4gICAgICBkZXBsb3ltZW50Um9sZTogcm9sZSxcbiAgICAgIHRlbXBsYXRlUGF0aDogc291cmNlT3V0cHV0LmF0UGF0aCgndGVzdC55YW1sJyksXG4gICAgICBhZG1pblBlcm1pc3Npb25zOiBmYWxzZSxcbiAgICAgIHBhcmFtZXRlck92ZXJyaWRlczoge1xuICAgICAgICBCdWNrZXROYW1lOiBzb3VyY2VPdXRwdXQuYnVja2V0TmFtZSxcbiAgICAgICAgT2JqZWN0S2V5OiBzb3VyY2VPdXRwdXQub2JqZWN0S2V5LFxuICAgICAgICBVcmw6IGFkZGl0aW9uYWxBcnRpZmFjdC51cmwsXG4gICAgICAgIE90aGVyUGFyYW06IHNvdXJjZU91dHB1dC5nZXRQYXJhbSgncGFyYW1zLmpzb24nLCAnT3RoZXJQYXJhbScpLFxuICAgICAgfSxcbiAgICAgIGV4dHJhSW5wdXRzOiBbYWRkaXRpb25hbEFydGlmYWN0XSxcbiAgICB9KSxcbiAgXSxcbn0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==