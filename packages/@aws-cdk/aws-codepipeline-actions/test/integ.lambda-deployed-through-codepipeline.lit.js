"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// !cdk-integ PipelineStack
const codebuild = require("@aws-cdk/aws-codebuild");
const codecommit = require("@aws-cdk/aws-codecommit");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const lambda = require("@aws-cdk/aws-lambda");
const cdk = require("@aws-cdk/core");
const codepipeline_actions = require("../lib");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubGFtYmRhLWRlcGxveWVkLXRocm91Z2gtY29kZXBpcGVsaW5lLmxpdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmxhbWJkYS1kZXBsb3llZC10aHJvdWdoLWNvZGVwaXBlbGluZS5saXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0QkFBNEI7QUFDNUIsb0RBQW9EO0FBQ3BELHNEQUFzRDtBQUN0RCwwREFBMEQ7QUFDMUQsOENBQThDO0FBQzlDLHFDQUFxQztBQUNyQywrQ0FBK0M7QUFFL0MsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsU0FBUztBQUNULE1BQU0sV0FBVyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFDdEQsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0FBQ25ELElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFO0lBQ3pDLElBQUksRUFBRSxVQUFVO0lBQ2hCLE9BQU8sRUFBRSxlQUFlO0lBQ3hCLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7Q0FDcEMsQ0FBQyxDQUFDO0FBQ0gsc0VBQXNFO0FBRXRFLE1BQU0sYUFBYSxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsZUFBZSxDQUFDLENBQUM7QUFDMUQsTUFBTSxRQUFRLEdBQUcsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUV0RSx3RUFBd0U7QUFDeEUsa0VBQWtFO0FBQ2xFLE1BQU0sZUFBZSxHQUFHLElBQUksWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ3BELE1BQU0sZUFBZSxHQUFHLElBQUksb0JBQW9CLENBQUMsc0JBQXNCLENBQUM7SUFDdEUsVUFBVSxF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RUgsUUFBUSxDQUFDLFFBQVEsQ0FBQztJQUNoQixTQUFTLEVBQUUsT0FBTztJQUNsQixPQUFPLEVBQUUsQ0FBQyxjQUFjLEVBQUUsaUJBQWlCLENBQUM7Q0FDN0MsQ0FBQyxDQUFDO0FBRUgsb0NBQW9DO0FBQ3BDLFFBQVEsQ0FBQyxRQUFRLENBQUM7SUFDaEIsU0FBUyxFQUFFLFFBQVE7SUFDbkIsT0FBTyxFQUFFO1FBQ1AsSUFBSSxvQkFBb0IsQ0FBQyxxQ0FBcUMsQ0FBQztZQUM3RCxVQUFVLEVBQUUsbUJBQW1CO1lBQy9CLFlBQVksRUFBRSxjQUFjLENBQUMsTUFBTSxDQUFDLDJCQUEyQixDQUFDO1lBQ2hFLFNBQVMsRUFBRSx5QkFBeUI7WUFDcEMsZ0JBQWdCLEVBQUUsSUFBSTtZQUN0QixrQkFBa0IsRUFBRSxVQUFVLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQztZQUNuRSxXQUFXLEVBQUU7Z0JBQ1gsaUJBQWlCO2FBQ2xCO1NBQ0YsQ0FBQztLQUNIO0NBQ0YsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8vICFjZGstaW50ZWcgUGlwZWxpbmVTdGFja1xuaW1wb3J0ICogYXMgY29kZWJ1aWxkIGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlYnVpbGQnO1xuaW1wb3J0ICogYXMgY29kZWNvbW1pdCBmcm9tICdAYXdzLWNkay9hd3MtY29kZWNvbW1pdCc7XG5pbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmUgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVwaXBlbGluZSc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYSc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmVfYWN0aW9ucyBmcm9tICcuLi9saWInO1xuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG4vLy8gIXNob3dcbmNvbnN0IGxhbWJkYVN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdMYW1iZGFTdGFjaycpO1xuY29uc3QgbGFtYmRhQ29kZSA9IGxhbWJkYS5Db2RlLmZyb21DZm5QYXJhbWV0ZXJzKCk7XG5uZXcgbGFtYmRhLkZ1bmN0aW9uKGxhbWJkYVN0YWNrLCAnTGFtYmRhJywge1xuICBjb2RlOiBsYW1iZGFDb2RlLFxuICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxufSk7XG4vLyBvdGhlciByZXNvdXJjZXMgdGhhdCB5b3VyIExhbWJkYSBuZWVkcywgYWRkZWQgdG8gdGhlIGxhbWJkYVN0YWNrLi4uXG5cbmNvbnN0IHBpcGVsaW5lU3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1BpcGVsaW5lU3RhY2snKTtcbmNvbnN0IHBpcGVsaW5lID0gbmV3IGNvZGVwaXBlbGluZS5QaXBlbGluZShwaXBlbGluZVN0YWNrLCAnUGlwZWxpbmUnKTtcblxuLy8gYWRkIHRoZSBzb3VyY2UgY29kZSByZXBvc2l0b3J5IGNvbnRhaW5pbmcgdGhpcyBjb2RlIHRvIHlvdXIgUGlwZWxpbmUsXG4vLyBhbmQgdGhlIHNvdXJjZSBjb2RlIG9mIHRoZSBMYW1iZGEgRnVuY3Rpb24sIGlmIHRoZXkncmUgc2VwYXJhdGVcbmNvbnN0IGNka1NvdXJjZU91dHB1dCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoKTtcbmNvbnN0IGNka1NvdXJjZUFjdGlvbiA9IG5ldyBjb2RlcGlwZWxpbmVfYWN0aW9ucy5Db2RlQ29tbWl0U291cmNlQWN0aW9uKHtcbiAgcmVwb3NpdG9yeTogbmV3IGNvZGVjb21taXQuUmVwb3NpdG9yeShwaXBlbGluZVN0YWNrLCAnQ2RrQ29kZVJlcG8nLCB7XG4gICAgcmVwb3NpdG9yeU5hbWU6ICdDZGtDb2RlUmVwbycsXG4gIH0pLFxuICBhY3Rpb25OYW1lOiAnQ2RrQ29kZV9Tb3VyY2UnLFxuICBvdXRwdXQ6IGNka1NvdXJjZU91dHB1dCxcbn0pO1xuY29uc3QgbGFtYmRhU291cmNlT3V0cHV0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpO1xuY29uc3QgbGFtYmRhU291cmNlQWN0aW9uID0gbmV3IGNvZGVwaXBlbGluZV9hY3Rpb25zLkNvZGVDb21taXRTb3VyY2VBY3Rpb24oe1xuICByZXBvc2l0b3J5OiBuZXcgY29kZWNvbW1pdC5SZXBvc2l0b3J5KHBpcGVsaW5lU3RhY2ssICdMYW1iZGFDb2RlUmVwbycsIHtcbiAgICByZXBvc2l0b3J5TmFtZTogJ0xhbWJkYUNvZGVSZXBvJyxcbiAgfSksXG4gIGFjdGlvbk5hbWU6ICdMYW1iZGFDb2RlX1NvdXJjZScsXG4gIG91dHB1dDogbGFtYmRhU291cmNlT3V0cHV0LFxufSk7XG5waXBlbGluZS5hZGRTdGFnZSh7XG4gIHN0YWdlTmFtZTogJ1NvdXJjZScsXG4gIGFjdGlvbnM6IFtjZGtTb3VyY2VBY3Rpb24sIGxhbWJkYVNvdXJjZUFjdGlvbl0sXG59KTtcblxuLy8gc3ludGhlc2l6ZSB0aGUgTGFtYmRhIENESyB0ZW1wbGF0ZSwgdXNpbmcgQ29kZUJ1aWxkXG4vLyB0aGUgYmVsb3cgdmFsdWVzIGFyZSBqdXN0IGV4YW1wbGVzLCBhc3N1bWluZyB5b3VyIENESyBjb2RlIGlzIGluIFR5cGVTY3JpcHQvSmF2YVNjcmlwdCAtXG4vLyBhZGp1c3QgdGhlIGJ1aWxkIGVudmlyb25tZW50IGFuZC9vciBjb21tYW5kcyBhY2NvcmRpbmdseVxuY29uc3QgY2RrQnVpbGRQcm9qZWN0ID0gbmV3IGNvZGVidWlsZC5Qcm9qZWN0KHBpcGVsaW5lU3RhY2ssICdDZGtCdWlsZFByb2plY3QnLCB7XG4gIGVudmlyb25tZW50OiB7XG4gICAgYnVpbGRJbWFnZTogY29kZWJ1aWxkLkxpbnV4QnVpbGRJbWFnZS5VQlVOVFVfMTRfMDRfTk9ERUpTXzEwXzFfMCxcbiAgfSxcbiAgYnVpbGRTcGVjOiBjb2RlYnVpbGQuQnVpbGRTcGVjLmZyb21PYmplY3Qoe1xuICAgIHZlcnNpb246ICcwLjInLFxuICAgIHBoYXNlczoge1xuICAgICAgaW5zdGFsbDoge1xuICAgICAgICBjb21tYW5kczogJ25wbSBpbnN0YWxsJyxcbiAgICAgIH0sXG4gICAgICBidWlsZDoge1xuICAgICAgICBjb21tYW5kczogW1xuICAgICAgICAgICducG0gcnVuIGJ1aWxkJyxcbiAgICAgICAgICAnbnBtIHJ1biBjZGsgc3ludGggTGFtYmRhU3RhY2sgLS0gLW8gLicsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgYXJ0aWZhY3RzOiB7XG4gICAgICBmaWxlczogJ0xhbWJkYVN0YWNrLnRlbXBsYXRlLnlhbWwnLFxuICAgIH0sXG4gIH0pLFxufSk7XG5jb25zdCBjZGtCdWlsZE91dHB1dCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoKTtcbmNvbnN0IGNka0J1aWxkQWN0aW9uID0gbmV3IGNvZGVwaXBlbGluZV9hY3Rpb25zLkNvZGVCdWlsZEFjdGlvbih7XG4gIGFjdGlvbk5hbWU6ICdDREtfQnVpbGQnLFxuICBwcm9qZWN0OiBjZGtCdWlsZFByb2plY3QsXG4gIGlucHV0OiBjZGtTb3VyY2VPdXRwdXQsXG4gIG91dHB1dHM6IFtjZGtCdWlsZE91dHB1dF0sXG59KTtcblxuLy8gYnVpbGQgeW91ciBMYW1iZGEgY29kZSwgdXNpbmcgQ29kZUJ1aWxkXG4vLyBhZ2FpbiwgdGhpcyBleGFtcGxlIGFzc3VtZXMgeW91ciBMYW1iZGEgaXMgd3JpdHRlbiBpbiBUeXBlU2NyaXB0L0phdmFTY3JpcHQgLVxuLy8gbWFrZSBzdXJlIHRvIGFkanVzdCB0aGUgYnVpbGQgZW52aXJvbm1lbnQgYW5kL29yIGNvbW1hbmRzIGlmIHRoZXkgZG9uJ3QgbWF0Y2ggeW91ciBzcGVjaWZpYyBzaXR1YXRpb25cbmNvbnN0IGxhbWJkYUJ1aWxkUHJvamVjdCA9IG5ldyBjb2RlYnVpbGQuUHJvamVjdChwaXBlbGluZVN0YWNrLCAnTGFtYmRhQnVpbGRQcm9qZWN0Jywge1xuICBlbnZpcm9ubWVudDoge1xuICAgIGJ1aWxkSW1hZ2U6IGNvZGVidWlsZC5MaW51eEJ1aWxkSW1hZ2UuVUJVTlRVXzE0XzA0X05PREVKU18xMF8xXzAsXG4gIH0sXG4gIGJ1aWxkU3BlYzogY29kZWJ1aWxkLkJ1aWxkU3BlYy5mcm9tT2JqZWN0KHtcbiAgICB2ZXJzaW9uOiAnMC4yJyxcbiAgICBwaGFzZXM6IHtcbiAgICAgIGluc3RhbGw6IHtcbiAgICAgICAgY29tbWFuZHM6ICducG0gaW5zdGFsbCcsXG4gICAgICB9LFxuICAgICAgYnVpbGQ6IHtcbiAgICAgICAgY29tbWFuZHM6ICducG0gcnVuIGJ1aWxkJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBhcnRpZmFjdHM6IHtcbiAgICAgIGZpbGVzOiBbXG4gICAgICAgICdpbmRleC5qcycsXG4gICAgICAgICdub2RlX21vZHVsZXMvKiovKicsXG4gICAgICBdLFxuICAgIH0sXG4gIH0pLFxufSk7XG5jb25zdCBsYW1iZGFCdWlsZE91dHB1dCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoKTtcbmNvbnN0IGxhbWJkYUJ1aWxkQWN0aW9uID0gbmV3IGNvZGVwaXBlbGluZV9hY3Rpb25zLkNvZGVCdWlsZEFjdGlvbih7XG4gIGFjdGlvbk5hbWU6ICdMYW1iZGFfQnVpbGQnLFxuICBwcm9qZWN0OiBsYW1iZGFCdWlsZFByb2plY3QsXG4gIGlucHV0OiBsYW1iZGFTb3VyY2VPdXRwdXQsXG4gIG91dHB1dHM6IFtsYW1iZGFCdWlsZE91dHB1dF0sXG59KTtcblxucGlwZWxpbmUuYWRkU3RhZ2Uoe1xuICBzdGFnZU5hbWU6ICdCdWlsZCcsXG4gIGFjdGlvbnM6IFtjZGtCdWlsZEFjdGlvbiwgbGFtYmRhQnVpbGRBY3Rpb25dLFxufSk7XG5cbi8vIGZpbmFsbHksIGRlcGxveSB5b3VyIExhbWJkYSBTdGFja1xucGlwZWxpbmUuYWRkU3RhZ2Uoe1xuICBzdGFnZU5hbWU6ICdEZXBsb3knLFxuICBhY3Rpb25zOiBbXG4gICAgbmV3IGNvZGVwaXBlbGluZV9hY3Rpb25zLkNsb3VkRm9ybWF0aW9uQ3JlYXRlVXBkYXRlU3RhY2tBY3Rpb24oe1xuICAgICAgYWN0aW9uTmFtZTogJ0xhbWJkYV9DRk5fRGVwbG95JyxcbiAgICAgIHRlbXBsYXRlUGF0aDogY2RrQnVpbGRPdXRwdXQuYXRQYXRoKCdMYW1iZGFTdGFjay50ZW1wbGF0ZS55YW1sJyksXG4gICAgICBzdGFja05hbWU6ICdMYW1iZGFTdGFja0RlcGxveWVkTmFtZScsXG4gICAgICBhZG1pblBlcm1pc3Npb25zOiB0cnVlLFxuICAgICAgcGFyYW1ldGVyT3ZlcnJpZGVzOiBsYW1iZGFDb2RlLmFzc2lnbihsYW1iZGFCdWlsZE91dHB1dC5zM0xvY2F0aW9uKSxcbiAgICAgIGV4dHJhSW5wdXRzOiBbXG4gICAgICAgIGxhbWJkYUJ1aWxkT3V0cHV0LFxuICAgICAgXSxcbiAgICB9KSxcbiAgXSxcbn0pO1xuIl19