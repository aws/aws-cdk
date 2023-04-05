"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// !cdk-integ PipelineStack
const codebuild = require("aws-cdk-lib/aws-codebuild");
const codecommit = require("aws-cdk-lib/aws-codecommit");
const codepipeline = require("aws-cdk-lib/aws-codepipeline");
const lambda = require("aws-cdk-lib/aws-lambda");
const cdk = require("aws-cdk-lib");
const codepipeline_actions = require("aws-cdk-lib/aws-codepipeline-actions");
const app = new cdk.App();
/// !show
const lambdaStack = new cdk.Stack(app, 'LambdaStack');
const lambdaCode = lambda.Code.fromCfnParameters();
new lambda.Function(lambdaStack, 'Lambda', {
    code: lambdaCode,
    handler: 'index.handler',
    runtime: lambda.Runtime.NODEJS_14_X,
});
// other resources that your Lambda needs, added to the lambdaStack...
const pipelineStack = new cdk.Stack(app, 'PipelineStack');
const pipeline = new codepipeline.Pipeline(pipelineStack, 'Pipeline');
// add the source code repository containing this code to your Pipeline,
// and the source code of the Lambda Function, if they're separate
const cdkSourceOutput = new codepipeline.Artifact();
const cdkSourceAction = new codepipeline_actions.CodeCommitSourceAction({
    repository: new codecommit.Repository(pipelineStack, 'CdkCodeRepo', {
        repositoryName: 'CdkCodeRepo',
    }),
    actionName: 'CdkCode_Source',
    output: cdkSourceOutput,
});
const lambdaSourceOutput = new codepipeline.Artifact();
const lambdaSourceAction = new codepipeline_actions.CodeCommitSourceAction({
    repository: new codecommit.Repository(pipelineStack, 'LambdaCodeRepo', {
        repositoryName: 'LambdaCodeRepo',
    }),
    actionName: 'LambdaCode_Source',
    output: lambdaSourceOutput,
});
pipeline.addStage({
    stageName: 'Source',
    actions: [cdkSourceAction, lambdaSourceAction],
});
// synthesize the Lambda CDK template, using CodeBuild
// the below values are just examples, assuming your CDK code is in TypeScript/JavaScript -
// adjust the build environment and/or commands accordingly
const cdkBuildProject = new codebuild.Project(pipelineStack, 'CdkBuildProject', {
    environment: {
        buildImage: codebuild.LinuxBuildImage.UBUNTU_14_04_NODEJS_10_1_0,
    },
    buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
            install: {
                commands: 'npm install',
            },
            build: {
                commands: [
                    'npm run build',
                    'npm run cdk synth LambdaStack -- -o .',
                ],
            },
        },
        artifacts: {
            files: 'LambdaStack.template.yaml',
        },
    }),
});
const cdkBuildOutput = new codepipeline.Artifact();
const cdkBuildAction = new codepipeline_actions.CodeBuildAction({
    actionName: 'CDK_Build',
    project: cdkBuildProject,
    input: cdkSourceOutput,
    outputs: [cdkBuildOutput],
});
// build your Lambda code, using CodeBuild
// again, this example assumes your Lambda is written in TypeScript/JavaScript -
// make sure to adjust the build environment and/or commands if they don't match your specific situation
const lambdaBuildProject = new codebuild.Project(pipelineStack, 'LambdaBuildProject', {
    environment: {
        buildImage: codebuild.LinuxBuildImage.UBUNTU_14_04_NODEJS_10_1_0,
    },
    buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
            install: {
                commands: 'npm install',
            },
            build: {
                commands: 'npm run build',
            },
        },
        artifacts: {
            files: [
                'index.js',
                'node_modules/**/*',
            ],
        },
    }),
});
const lambdaBuildOutput = new codepipeline.Artifact();
const lambdaBuildAction = new codepipeline_actions.CodeBuildAction({
    actionName: 'Lambda_Build',
    project: lambdaBuildProject,
    input: lambdaSourceOutput,
    outputs: [lambdaBuildOutput],
});
pipeline.addStage({
    stageName: 'Build',
    actions: [cdkBuildAction, lambdaBuildAction],
});
// finally, deploy your Lambda Stack
pipeline.addStage({
    stageName: 'Deploy',
    actions: [
        new codepipeline_actions.CloudFormationCreateUpdateStackAction({
            actionName: 'Lambda_CFN_Deploy',
            templatePath: cdkBuildOutput.atPath('LambdaStack.template.yaml'),
            stackName: 'LambdaStackDeployedName',
            adminPermissions: true,
            parameterOverrides: lambdaCode.assign(lambdaBuildOutput.s3Location),
            extraInputs: [
                lambdaBuildOutput,
            ],
        }),
    ],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubGFtYmRhLWRlcGxveWVkLXRocm91Z2gtY29kZXBpcGVsaW5lLmxpdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmxhbWJkYS1kZXBsb3llZC10aHJvdWdoLWNvZGVwaXBlbGluZS5saXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0QkFBNEI7QUFDNUIsdURBQXVEO0FBQ3ZELHlEQUF5RDtBQUN6RCw2REFBNkQ7QUFDN0QsaURBQWlEO0FBQ2pELG1DQUFtQztBQUNuQyw2RUFBNkU7QUFFN0UsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsU0FBUztBQUNULE1BQU0sV0FBVyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFDdEQsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0FBQ25ELElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFO0lBQ3pDLElBQUksRUFBRSxVQUFVO0lBQ2hCLE9BQU8sRUFBRSxlQUFlO0lBQ3hCLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7Q0FDcEMsQ0FBQyxDQUFDO0FBQ0gsc0VBQXNFO0FBRXRFLE1BQU0sYUFBYSxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsZUFBZSxDQUFDLENBQUM7QUFDMUQsTUFBTSxRQUFRLEdBQUcsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUV0RSx3RUFBd0U7QUFDeEUsa0VBQWtFO0FBQ2xFLE1BQU0sZUFBZSxHQUFHLElBQUksWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ3BELE1BQU0sZUFBZSxHQUFHLElBQUksb0JBQW9CLENBQUMsc0JBQXNCLENBQUM7SUFDdEUsVUFBVSxF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RUgsUUFBUSxDQUFDLFFBQVEsQ0FBQztJQUNoQixTQUFTLEVBQUUsT0FBTztJQUNsQixPQUFPLEVBQUUsQ0FBQyxjQUFjLEVBQUUsaUJBQWlCLENBQUM7Q0FDN0MsQ0FBQyxDQUFDO0FBRUgsb0NBQW9DO0FBQ3BDLFFBQVEsQ0FBQyxRQUFRLENBQUM7SUFDaEIsU0FBUyxFQUFFLFFBQVE7SUFDbkIsT0FBTyxFQUFFO1FBQ1AsSUFBSSxvQkFBb0IsQ0FBQyxxQ0FBcUMsQ0FBQztZQUM3RCxVQUFVLEVBQUUsbUJBQW1CO1lBQy9CLFlBQVksRUFBRSxjQUFjLENBQUMsTUFBTSxDQUFDLDJCQUEyQixDQUFDO1lBQ2hFLFNBQVMsRUFBRSx5QkFBeUI7WUFDcEMsZ0JBQWdCLEVBQUUsSUFBSTtZQUN0QixrQkFBa0IsRUFBRSxVQUFVLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQztZQUNuRSxXQUFXLEVBQUU7Z0JBQ1gsaUJBQWlCO2FBQ2xCO1NBQ0YsQ0FBQztLQUNIO0NBQ0YsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8vICFjZGstaW50ZWcgUGlwZWxpbmVTdGFja1xuaW1wb3J0ICogYXMgY29kZWJ1aWxkIGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2RlYnVpbGQnO1xuaW1wb3J0ICogYXMgY29kZWNvbW1pdCBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZWNvbW1pdCc7XG5pbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmUgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNvZGVwaXBlbGluZSc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lX2FjdGlvbnMgZnJvbSAnYXdzLWNkay1saWIvYXdzLWNvZGVwaXBlbGluZS1hY3Rpb25zJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxuLy8vICFzaG93XG5jb25zdCBsYW1iZGFTdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnTGFtYmRhU3RhY2snKTtcbmNvbnN0IGxhbWJkYUNvZGUgPSBsYW1iZGEuQ29kZS5mcm9tQ2ZuUGFyYW1ldGVycygpO1xubmV3IGxhbWJkYS5GdW5jdGlvbihsYW1iZGFTdGFjaywgJ0xhbWJkYScsIHtcbiAgY29kZTogbGFtYmRhQ29kZSxcbiAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbn0pO1xuLy8gb3RoZXIgcmVzb3VyY2VzIHRoYXQgeW91ciBMYW1iZGEgbmVlZHMsIGFkZGVkIHRvIHRoZSBsYW1iZGFTdGFjay4uLlxuXG5jb25zdCBwaXBlbGluZVN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdQaXBlbGluZVN0YWNrJyk7XG5jb25zdCBwaXBlbGluZSA9IG5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUocGlwZWxpbmVTdGFjaywgJ1BpcGVsaW5lJyk7XG5cbi8vIGFkZCB0aGUgc291cmNlIGNvZGUgcmVwb3NpdG9yeSBjb250YWluaW5nIHRoaXMgY29kZSB0byB5b3VyIFBpcGVsaW5lLFxuLy8gYW5kIHRoZSBzb3VyY2UgY29kZSBvZiB0aGUgTGFtYmRhIEZ1bmN0aW9uLCBpZiB0aGV5J3JlIHNlcGFyYXRlXG5jb25zdCBjZGtTb3VyY2VPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCk7XG5jb25zdCBjZGtTb3VyY2VBY3Rpb24gPSBuZXcgY29kZXBpcGVsaW5lX2FjdGlvbnMuQ29kZUNvbW1pdFNvdXJjZUFjdGlvbih7XG4gIHJlcG9zaXRvcnk6IG5ldyBjb2RlY29tbWl0LlJlcG9zaXRvcnkocGlwZWxpbmVTdGFjaywgJ0Nka0NvZGVSZXBvJywge1xuICAgIHJlcG9zaXRvcnlOYW1lOiAnQ2RrQ29kZVJlcG8nLFxuICB9KSxcbiAgYWN0aW9uTmFtZTogJ0Nka0NvZGVfU291cmNlJyxcbiAgb3V0cHV0OiBjZGtTb3VyY2VPdXRwdXQsXG59KTtcbmNvbnN0IGxhbWJkYVNvdXJjZU91dHB1dCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoKTtcbmNvbnN0IGxhbWJkYVNvdXJjZUFjdGlvbiA9IG5ldyBjb2RlcGlwZWxpbmVfYWN0aW9ucy5Db2RlQ29tbWl0U291cmNlQWN0aW9uKHtcbiAgcmVwb3NpdG9yeTogbmV3IGNvZGVjb21taXQuUmVwb3NpdG9yeShwaXBlbGluZVN0YWNrLCAnTGFtYmRhQ29kZVJlcG8nLCB7XG4gICAgcmVwb3NpdG9yeU5hbWU6ICdMYW1iZGFDb2RlUmVwbycsXG4gIH0pLFxuICBhY3Rpb25OYW1lOiAnTGFtYmRhQ29kZV9Tb3VyY2UnLFxuICBvdXRwdXQ6IGxhbWJkYVNvdXJjZU91dHB1dCxcbn0pO1xucGlwZWxpbmUuYWRkU3RhZ2Uoe1xuICBzdGFnZU5hbWU6ICdTb3VyY2UnLFxuICBhY3Rpb25zOiBbY2RrU291cmNlQWN0aW9uLCBsYW1iZGFTb3VyY2VBY3Rpb25dLFxufSk7XG5cbi8vIHN5bnRoZXNpemUgdGhlIExhbWJkYSBDREsgdGVtcGxhdGUsIHVzaW5nIENvZGVCdWlsZFxuLy8gdGhlIGJlbG93IHZhbHVlcyBhcmUganVzdCBleGFtcGxlcywgYXNzdW1pbmcgeW91ciBDREsgY29kZSBpcyBpbiBUeXBlU2NyaXB0L0phdmFTY3JpcHQgLVxuLy8gYWRqdXN0IHRoZSBidWlsZCBlbnZpcm9ubWVudCBhbmQvb3IgY29tbWFuZHMgYWNjb3JkaW5nbHlcbmNvbnN0IGNka0J1aWxkUHJvamVjdCA9IG5ldyBjb2RlYnVpbGQuUHJvamVjdChwaXBlbGluZVN0YWNrLCAnQ2RrQnVpbGRQcm9qZWN0Jywge1xuICBlbnZpcm9ubWVudDoge1xuICAgIGJ1aWxkSW1hZ2U6IGNvZGVidWlsZC5MaW51eEJ1aWxkSW1hZ2UuVUJVTlRVXzE0XzA0X05PREVKU18xMF8xXzAsXG4gIH0sXG4gIGJ1aWxkU3BlYzogY29kZWJ1aWxkLkJ1aWxkU3BlYy5mcm9tT2JqZWN0KHtcbiAgICB2ZXJzaW9uOiAnMC4yJyxcbiAgICBwaGFzZXM6IHtcbiAgICAgIGluc3RhbGw6IHtcbiAgICAgICAgY29tbWFuZHM6ICducG0gaW5zdGFsbCcsXG4gICAgICB9LFxuICAgICAgYnVpbGQ6IHtcbiAgICAgICAgY29tbWFuZHM6IFtcbiAgICAgICAgICAnbnBtIHJ1biBidWlsZCcsXG4gICAgICAgICAgJ25wbSBydW4gY2RrIHN5bnRoIExhbWJkYVN0YWNrIC0tIC1vIC4nLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9LFxuICAgIGFydGlmYWN0czoge1xuICAgICAgZmlsZXM6ICdMYW1iZGFTdGFjay50ZW1wbGF0ZS55YW1sJyxcbiAgICB9LFxuICB9KSxcbn0pO1xuY29uc3QgY2RrQnVpbGRPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCk7XG5jb25zdCBjZGtCdWlsZEFjdGlvbiA9IG5ldyBjb2RlcGlwZWxpbmVfYWN0aW9ucy5Db2RlQnVpbGRBY3Rpb24oe1xuICBhY3Rpb25OYW1lOiAnQ0RLX0J1aWxkJyxcbiAgcHJvamVjdDogY2RrQnVpbGRQcm9qZWN0LFxuICBpbnB1dDogY2RrU291cmNlT3V0cHV0LFxuICBvdXRwdXRzOiBbY2RrQnVpbGRPdXRwdXRdLFxufSk7XG5cbi8vIGJ1aWxkIHlvdXIgTGFtYmRhIGNvZGUsIHVzaW5nIENvZGVCdWlsZFxuLy8gYWdhaW4sIHRoaXMgZXhhbXBsZSBhc3N1bWVzIHlvdXIgTGFtYmRhIGlzIHdyaXR0ZW4gaW4gVHlwZVNjcmlwdC9KYXZhU2NyaXB0IC1cbi8vIG1ha2Ugc3VyZSB0byBhZGp1c3QgdGhlIGJ1aWxkIGVudmlyb25tZW50IGFuZC9vciBjb21tYW5kcyBpZiB0aGV5IGRvbid0IG1hdGNoIHlvdXIgc3BlY2lmaWMgc2l0dWF0aW9uXG5jb25zdCBsYW1iZGFCdWlsZFByb2plY3QgPSBuZXcgY29kZWJ1aWxkLlByb2plY3QocGlwZWxpbmVTdGFjaywgJ0xhbWJkYUJ1aWxkUHJvamVjdCcsIHtcbiAgZW52aXJvbm1lbnQ6IHtcbiAgICBidWlsZEltYWdlOiBjb2RlYnVpbGQuTGludXhCdWlsZEltYWdlLlVCVU5UVV8xNF8wNF9OT0RFSlNfMTBfMV8wLFxuICB9LFxuICBidWlsZFNwZWM6IGNvZGVidWlsZC5CdWlsZFNwZWMuZnJvbU9iamVjdCh7XG4gICAgdmVyc2lvbjogJzAuMicsXG4gICAgcGhhc2VzOiB7XG4gICAgICBpbnN0YWxsOiB7XG4gICAgICAgIGNvbW1hbmRzOiAnbnBtIGluc3RhbGwnLFxuICAgICAgfSxcbiAgICAgIGJ1aWxkOiB7XG4gICAgICAgIGNvbW1hbmRzOiAnbnBtIHJ1biBidWlsZCcsXG4gICAgICB9LFxuICAgIH0sXG4gICAgYXJ0aWZhY3RzOiB7XG4gICAgICBmaWxlczogW1xuICAgICAgICAnaW5kZXguanMnLFxuICAgICAgICAnbm9kZV9tb2R1bGVzLyoqLyonLFxuICAgICAgXSxcbiAgICB9LFxuICB9KSxcbn0pO1xuY29uc3QgbGFtYmRhQnVpbGRPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCk7XG5jb25zdCBsYW1iZGFCdWlsZEFjdGlvbiA9IG5ldyBjb2RlcGlwZWxpbmVfYWN0aW9ucy5Db2RlQnVpbGRBY3Rpb24oe1xuICBhY3Rpb25OYW1lOiAnTGFtYmRhX0J1aWxkJyxcbiAgcHJvamVjdDogbGFtYmRhQnVpbGRQcm9qZWN0LFxuICBpbnB1dDogbGFtYmRhU291cmNlT3V0cHV0LFxuICBvdXRwdXRzOiBbbGFtYmRhQnVpbGRPdXRwdXRdLFxufSk7XG5cbnBpcGVsaW5lLmFkZFN0YWdlKHtcbiAgc3RhZ2VOYW1lOiAnQnVpbGQnLFxuICBhY3Rpb25zOiBbY2RrQnVpbGRBY3Rpb24sIGxhbWJkYUJ1aWxkQWN0aW9uXSxcbn0pO1xuXG4vLyBmaW5hbGx5LCBkZXBsb3kgeW91ciBMYW1iZGEgU3RhY2tcbnBpcGVsaW5lLmFkZFN0YWdlKHtcbiAgc3RhZ2VOYW1lOiAnRGVwbG95JyxcbiAgYWN0aW9uczogW1xuICAgIG5ldyBjb2RlcGlwZWxpbmVfYWN0aW9ucy5DbG91ZEZvcm1hdGlvbkNyZWF0ZVVwZGF0ZVN0YWNrQWN0aW9uKHtcbiAgICAgIGFjdGlvbk5hbWU6ICdMYW1iZGFfQ0ZOX0RlcGxveScsXG4gICAgICB0ZW1wbGF0ZVBhdGg6IGNka0J1aWxkT3V0cHV0LmF0UGF0aCgnTGFtYmRhU3RhY2sudGVtcGxhdGUueWFtbCcpLFxuICAgICAgc3RhY2tOYW1lOiAnTGFtYmRhU3RhY2tEZXBsb3llZE5hbWUnLFxuICAgICAgYWRtaW5QZXJtaXNzaW9uczogdHJ1ZSxcbiAgICAgIHBhcmFtZXRlck92ZXJyaWRlczogbGFtYmRhQ29kZS5hc3NpZ24obGFtYmRhQnVpbGRPdXRwdXQuczNMb2NhdGlvbiksXG4gICAgICBleHRyYUlucHV0czogW1xuICAgICAgICBsYW1iZGFCdWlsZE91dHB1dCxcbiAgICAgIF0sXG4gICAgfSksXG4gIF0sXG59KTtcbiJdfQ==