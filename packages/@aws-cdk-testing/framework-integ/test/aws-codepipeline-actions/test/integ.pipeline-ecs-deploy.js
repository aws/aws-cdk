"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codebuild = require("aws-cdk-lib/aws-codebuild");
const codepipeline = require("aws-cdk-lib/aws-codepipeline");
const ec2 = require("aws-cdk-lib/aws-ec2");
const ecr = require("aws-cdk-lib/aws-ecr");
const ecs = require("aws-cdk-lib/aws-ecs");
const s3 = require("aws-cdk-lib/aws-s3");
const cdk = require("aws-cdk-lib");
const cpactions = require("aws-cdk-lib/aws-codepipeline-actions");
/* eslint-disable quote-props */
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-ecs-deploy');
const vpc = new ec2.Vpc(stack, 'VPC', {
    maxAzs: 1,
});
const cluster = new ecs.Cluster(stack, 'EcsCluster', {
    vpc,
});
const repository = new ecr.Repository(stack, 'EcrRepo');
const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');
const containerName = 'Container';
taskDefinition.addContainer(containerName, {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
});
const service = new ecs.FargateService(stack, 'FargateService', {
    cluster,
    taskDefinition,
});
const bucket = new s3.Bucket(stack, 'MyBucket', {
    versioned: true,
    removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const sourceOutput = new codepipeline.Artifact('SourceArtifact');
const sourceAction = new cpactions.S3SourceAction({
    actionName: 'Source',
    output: sourceOutput,
    bucket,
    bucketKey: 'path/to/Dockerfile',
});
const project = new codebuild.PipelineProject(stack, 'EcsProject', {
    environment: {
        buildImage: codebuild.LinuxBuildImage.UBUNTU_14_04_DOCKER_17_09_0,
        privileged: true,
    },
    buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
            pre_build: {
                commands: '$(aws ecr get-login --region $AWS_DEFAULT_REGION --no-include-email)',
            },
            build: {
                commands: 'docker build -t $REPOSITORY_URI:latest .',
            },
            post_build: {
                commands: [
                    'docker push $REPOSITORY_URI:latest',
                    `printf '[{ "name": "${containerName}", "imageUri": "%s" }]' $REPOSITORY_URI:latest > imagedefinitions.json`,
                ],
            },
        },
        artifacts: {
            files: 'imagedefinitions.json',
        },
    }),
    environmentVariables: {
        'REPOSITORY_URI': {
            value: repository.repositoryUri,
        },
    },
    grantReportGroupPermissions: false,
});
// needed for `docker push`
repository.grantPullPush(project);
const buildOutput = new codepipeline.Artifact();
const buildAction = new cpactions.CodeBuildAction({
    actionName: 'CodeBuild',
    project,
    input: sourceOutput,
    outputs: [buildOutput],
});
new codepipeline.Pipeline(stack, 'MyPipeline', {
    artifactBucket: bucket,
    stages: [
        {
            stageName: 'Source',
            actions: [sourceAction],
        },
        {
            stageName: 'Build',
            actions: [buildAction],
        },
        {
            stageName: 'Deploy',
            actions: [
                new cpactions.EcsDeployAction({
                    actionName: 'DeployAction',
                    input: buildOutput,
                    service,
                    deploymentTimeout: cdk.Duration.minutes(60),
                }),
            ],
        },
    ],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucGlwZWxpbmUtZWNzLWRlcGxveS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLnBpcGVsaW5lLWVjcy1kZXBsb3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx1REFBdUQ7QUFDdkQsNkRBQTZEO0FBQzdELDJDQUEyQztBQUMzQywyQ0FBMkM7QUFDM0MsMkNBQTJDO0FBQzNDLHlDQUF5QztBQUN6QyxtQ0FBbUM7QUFDbkMsa0VBQWtFO0FBRWxFLGdDQUFnQztBQUVoQyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLGlDQUFpQyxDQUFDLENBQUM7QUFFcEUsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7SUFDcEMsTUFBTSxFQUFFLENBQUM7Q0FDVixDQUFDLENBQUM7QUFDSCxNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtJQUNuRCxHQUFHO0NBQ0osQ0FBQyxDQUFDO0FBQ0gsTUFBTSxVQUFVLEdBQUcsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztBQUN4RCxNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDdkUsTUFBTSxhQUFhLEdBQUcsV0FBVyxDQUFDO0FBQ2xDLGNBQWMsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFO0lBQ3pDLEtBQUssRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQywwQkFBMEIsQ0FBQztDQUNuRSxDQUFDLENBQUM7QUFDSCxNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLGdCQUFnQixFQUFFO0lBQzlELE9BQU87SUFDUCxjQUFjO0NBQ2YsQ0FBQyxDQUFDO0FBRUgsTUFBTSxNQUFNLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7SUFDOUMsU0FBUyxFQUFFLElBQUk7SUFDZixhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPO0NBQ3pDLENBQUMsQ0FBQztBQUNILE1BQU0sWUFBWSxHQUFHLElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ2pFLE1BQU0sWUFBWSxHQUFHLElBQUksU0FBUyxDQUFDLGNBQWMsQ0FBQztJQUNoRCxVQUFVLEVBQUUsUUFBUTtJQUNwQixNQUFNLEVBQUUsWUFBWTtJQUNwQixNQUFNO0lBQ04sU0FBUyxFQUFFLG9CQUFvQjtDQUNoQyxDQUFDLENBQUM7QUFFSCxNQUFNLE9BQU8sR0FBRyxJQUFJLFNBQVMsQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtJQUNqRSxXQUFXLEVBQUU7UUFDWCxVQUFVLEVBQUUsU0FBUyxDQUFDLGVBQWUsQ0FBQywyQkFBMkI7UUFDakUsVUFBVSxFQUFFLElBQUk7S0FDakI7SUFDRCxTQUFTLEVBQUUsU0FBUyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7UUFDeEMsT0FBTyxFQUFFLEtBQUs7UUFDZCxNQUFNLEVBQUU7WUFDTixTQUFTLEVBQUU7Z0JBQ1QsUUFBUSxFQUFFLHNFQUFzRTthQUNqRjtZQUNELEtBQUssRUFBRTtnQkFDTCxRQUFRLEVBQUUsMENBQTBDO2FBQ3JEO1lBQ0QsVUFBVSxFQUFFO2dCQUNWLFFBQVEsRUFBRTtvQkFDUixvQ0FBb0M7b0JBQ3BDLHVCQUF1QixhQUFhLHdFQUF3RTtpQkFDN0c7YUFDRjtTQUNGO1FBQ0QsU0FBUyxFQUFFO1lBQ1QsS0FBSyxFQUFFLHVCQUF1QjtTQUMvQjtLQUNGLENBQUM7SUFDRixvQkFBb0IsRUFBRTtRQUNwQixnQkFBZ0IsRUFBRTtZQUNoQixLQUFLLEVBQUUsVUFBVSxDQUFDLGFBQWE7U0FDaEM7S0FDRjtJQUNELDJCQUEyQixFQUFFLEtBQUs7Q0FDbkMsQ0FBQyxDQUFDO0FBQ0gsMkJBQTJCO0FBQzNCLFVBQVUsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDbEMsTUFBTSxXQUFXLEdBQUcsSUFBSSxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDaEQsTUFBTSxXQUFXLEdBQUcsSUFBSSxTQUFTLENBQUMsZUFBZSxDQUFDO0lBQ2hELFVBQVUsRUFBRSxXQUFXO0lBQ3ZCLE9BQU87SUFDUCxLQUFLLEVBQUUsWUFBWTtJQUNuQixPQUFPLEVBQUUsQ0FBQyxXQUFXLENBQUM7Q0FDdkIsQ0FBQyxDQUFDO0FBRUgsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUU7SUFDN0MsY0FBYyxFQUFFLE1BQU07SUFDdEIsTUFBTSxFQUFFO1FBQ047WUFDRSxTQUFTLEVBQUUsUUFBUTtZQUNuQixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7U0FDeEI7UUFDRDtZQUNFLFNBQVMsRUFBRSxPQUFPO1lBQ2xCLE9BQU8sRUFBRSxDQUFDLFdBQVcsQ0FBQztTQUN2QjtRQUNEO1lBQ0UsU0FBUyxFQUFFLFFBQVE7WUFDbkIsT0FBTyxFQUFFO2dCQUNQLElBQUksU0FBUyxDQUFDLGVBQWUsQ0FBQztvQkFDNUIsVUFBVSxFQUFFLGNBQWM7b0JBQzFCLEtBQUssRUFBRSxXQUFXO29CQUNsQixPQUFPO29CQUNQLGlCQUFpQixFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztpQkFDNUMsQ0FBQzthQUNIO1NBQ0Y7S0FDRjtDQUNGLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNvZGVidWlsZCBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZWJ1aWxkJztcbmltcG9ydCAqIGFzIGNvZGVwaXBlbGluZSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY29kZXBpcGVsaW5lJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGVjciBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWNyJztcbmltcG9ydCAqIGFzIGVjcyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWNzJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgY3BhY3Rpb25zIGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2RlcGlwZWxpbmUtYWN0aW9ucyc7XG5cbi8qIGVzbGludC1kaXNhYmxlIHF1b3RlLXByb3BzICovXG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbmNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdhd3MtY2RrLWNvZGVwaXBlbGluZS1lY3MtZGVwbG95Jyk7XG5cbmNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVlBDJywge1xuICBtYXhBenM6IDEsXG59KTtcbmNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywge1xuICB2cGMsXG59KTtcbmNvbnN0IHJlcG9zaXRvcnkgPSBuZXcgZWNyLlJlcG9zaXRvcnkoc3RhY2ssICdFY3JSZXBvJyk7XG5jb25zdCB0YXNrRGVmaW5pdGlvbiA9IG5ldyBlY3MuRmFyZ2F0ZVRhc2tEZWZpbml0aW9uKHN0YWNrLCAnVGFza0RlZicpO1xuY29uc3QgY29udGFpbmVyTmFtZSA9ICdDb250YWluZXInO1xudGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKGNvbnRhaW5lck5hbWUsIHtcbiAgaW1hZ2U6IGVjcy5Db250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoJ2FtYXpvbi9hbWF6b24tZWNzLXNhbXBsZScpLFxufSk7XG5jb25zdCBzZXJ2aWNlID0gbmV3IGVjcy5GYXJnYXRlU2VydmljZShzdGFjaywgJ0ZhcmdhdGVTZXJ2aWNlJywge1xuICBjbHVzdGVyLFxuICB0YXNrRGVmaW5pdGlvbixcbn0pO1xuXG5jb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnLCB7XG4gIHZlcnNpb25lZDogdHJ1ZSxcbiAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcbn0pO1xuY29uc3Qgc291cmNlT3V0cHV0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgnU291cmNlQXJ0aWZhY3QnKTtcbmNvbnN0IHNvdXJjZUFjdGlvbiA9IG5ldyBjcGFjdGlvbnMuUzNTb3VyY2VBY3Rpb24oe1xuICBhY3Rpb25OYW1lOiAnU291cmNlJyxcbiAgb3V0cHV0OiBzb3VyY2VPdXRwdXQsXG4gIGJ1Y2tldCxcbiAgYnVja2V0S2V5OiAncGF0aC90by9Eb2NrZXJmaWxlJyxcbn0pO1xuXG5jb25zdCBwcm9qZWN0ID0gbmV3IGNvZGVidWlsZC5QaXBlbGluZVByb2plY3Qoc3RhY2ssICdFY3NQcm9qZWN0Jywge1xuICBlbnZpcm9ubWVudDoge1xuICAgIGJ1aWxkSW1hZ2U6IGNvZGVidWlsZC5MaW51eEJ1aWxkSW1hZ2UuVUJVTlRVXzE0XzA0X0RPQ0tFUl8xN18wOV8wLFxuICAgIHByaXZpbGVnZWQ6IHRydWUsXG4gIH0sXG4gIGJ1aWxkU3BlYzogY29kZWJ1aWxkLkJ1aWxkU3BlYy5mcm9tT2JqZWN0KHtcbiAgICB2ZXJzaW9uOiAnMC4yJyxcbiAgICBwaGFzZXM6IHtcbiAgICAgIHByZV9idWlsZDoge1xuICAgICAgICBjb21tYW5kczogJyQoYXdzIGVjciBnZXQtbG9naW4gLS1yZWdpb24gJEFXU19ERUZBVUxUX1JFR0lPTiAtLW5vLWluY2x1ZGUtZW1haWwpJyxcbiAgICAgIH0sXG4gICAgICBidWlsZDoge1xuICAgICAgICBjb21tYW5kczogJ2RvY2tlciBidWlsZCAtdCAkUkVQT1NJVE9SWV9VUkk6bGF0ZXN0IC4nLFxuICAgICAgfSxcbiAgICAgIHBvc3RfYnVpbGQ6IHtcbiAgICAgICAgY29tbWFuZHM6IFtcbiAgICAgICAgICAnZG9ja2VyIHB1c2ggJFJFUE9TSVRPUllfVVJJOmxhdGVzdCcsXG4gICAgICAgICAgYHByaW50ZiAnW3sgXCJuYW1lXCI6IFwiJHtjb250YWluZXJOYW1lfVwiLCBcImltYWdlVXJpXCI6IFwiJXNcIiB9XScgJFJFUE9TSVRPUllfVVJJOmxhdGVzdCA+IGltYWdlZGVmaW5pdGlvbnMuanNvbmAsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgYXJ0aWZhY3RzOiB7XG4gICAgICBmaWxlczogJ2ltYWdlZGVmaW5pdGlvbnMuanNvbicsXG4gICAgfSxcbiAgfSksXG4gIGVudmlyb25tZW50VmFyaWFibGVzOiB7XG4gICAgJ1JFUE9TSVRPUllfVVJJJzoge1xuICAgICAgdmFsdWU6IHJlcG9zaXRvcnkucmVwb3NpdG9yeVVyaSxcbiAgICB9LFxuICB9LFxuICBncmFudFJlcG9ydEdyb3VwUGVybWlzc2lvbnM6IGZhbHNlLFxufSk7XG4vLyBuZWVkZWQgZm9yIGBkb2NrZXIgcHVzaGBcbnJlcG9zaXRvcnkuZ3JhbnRQdWxsUHVzaChwcm9qZWN0KTtcbmNvbnN0IGJ1aWxkT3V0cHV0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpO1xuY29uc3QgYnVpbGRBY3Rpb24gPSBuZXcgY3BhY3Rpb25zLkNvZGVCdWlsZEFjdGlvbih7XG4gIGFjdGlvbk5hbWU6ICdDb2RlQnVpbGQnLFxuICBwcm9qZWN0LFxuICBpbnB1dDogc291cmNlT3V0cHV0LFxuICBvdXRwdXRzOiBbYnVpbGRPdXRwdXRdLFxufSk7XG5cbm5ldyBjb2RlcGlwZWxpbmUuUGlwZWxpbmUoc3RhY2ssICdNeVBpcGVsaW5lJywge1xuICBhcnRpZmFjdEJ1Y2tldDogYnVja2V0LFxuICBzdGFnZXM6IFtcbiAgICB7XG4gICAgICBzdGFnZU5hbWU6ICdTb3VyY2UnLFxuICAgICAgYWN0aW9uczogW3NvdXJjZUFjdGlvbl0sXG4gICAgfSxcbiAgICB7XG4gICAgICBzdGFnZU5hbWU6ICdCdWlsZCcsXG4gICAgICBhY3Rpb25zOiBbYnVpbGRBY3Rpb25dLFxuICAgIH0sXG4gICAge1xuICAgICAgc3RhZ2VOYW1lOiAnRGVwbG95JyxcbiAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgbmV3IGNwYWN0aW9ucy5FY3NEZXBsb3lBY3Rpb24oe1xuICAgICAgICAgIGFjdGlvbk5hbWU6ICdEZXBsb3lBY3Rpb24nLFxuICAgICAgICAgIGlucHV0OiBidWlsZE91dHB1dCxcbiAgICAgICAgICBzZXJ2aWNlLFxuICAgICAgICAgIGRlcGxveW1lbnRUaW1lb3V0OiBjZGsuRHVyYXRpb24ubWludXRlcyg2MCksXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICB9LFxuICBdLFxufSk7XG5cbmFwcC5zeW50aCgpO1xuIl19