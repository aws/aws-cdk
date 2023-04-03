"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const codebuild = require("@aws-cdk/aws-codebuild");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const ec2 = require("@aws-cdk/aws-ec2");
const ecr = require("@aws-cdk/aws-ecr");
const ecs = require("@aws-cdk/aws-ecs");
const s3 = require("@aws-cdk/aws-s3");
const cdk = require("@aws-cdk/core");
const cpactions = require("../lib");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucGlwZWxpbmUtZWNzLWRlcGxveS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLnBpcGVsaW5lLWVjcy1kZXBsb3kudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBb0Q7QUFDcEQsMERBQTBEO0FBQzFELHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFDeEMsd0NBQXdDO0FBQ3hDLHNDQUFzQztBQUN0QyxxQ0FBcUM7QUFDckMsb0NBQW9DO0FBRXBDLGdDQUFnQztBQUVoQyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLGlDQUFpQyxDQUFDLENBQUM7QUFFcEUsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7SUFDcEMsTUFBTSxFQUFFLENBQUM7Q0FDVixDQUFDLENBQUM7QUFDSCxNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtJQUNuRCxHQUFHO0NBQ0osQ0FBQyxDQUFDO0FBQ0gsTUFBTSxVQUFVLEdBQUcsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztBQUN4RCxNQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDdkUsTUFBTSxhQUFhLEdBQUcsV0FBVyxDQUFDO0FBQ2xDLGNBQWMsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFO0lBQ3pDLEtBQUssRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQywwQkFBMEIsQ0FBQztDQUNuRSxDQUFDLENBQUM7QUFDSCxNQUFNLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLGdCQUFnQixFQUFFO0lBQzlELE9BQU87SUFDUCxjQUFjO0NBQ2YsQ0FBQyxDQUFDO0FBRUgsTUFBTSxNQUFNLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7SUFDOUMsU0FBUyxFQUFFLElBQUk7SUFDZixhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPO0NBQ3pDLENBQUMsQ0FBQztBQUNILE1BQU0sWUFBWSxHQUFHLElBQUksWUFBWSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ2pFLE1BQU0sWUFBWSxHQUFHLElBQUksU0FBUyxDQUFDLGNBQWMsQ0FBQztJQUNoRCxVQUFVLEVBQUUsUUFBUTtJQUNwQixNQUFNLEVBQUUsWUFBWTtJQUNwQixNQUFNO0lBQ04sU0FBUyxFQUFFLG9CQUFvQjtDQUNoQyxDQUFDLENBQUM7QUFFSCxNQUFNLE9BQU8sR0FBRyxJQUFJLFNBQVMsQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRTtJQUNqRSxXQUFXLEVBQUU7UUFDWCxVQUFVLEVBQUUsU0FBUyxDQUFDLGVBQWUsQ0FBQywyQkFBMkI7UUFDakUsVUFBVSxFQUFFLElBQUk7S0FDakI7SUFDRCxTQUFTLEVBQUUsU0FBUyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7UUFDeEMsT0FBTyxFQUFFLEtBQUs7UUFDZCxNQUFNLEVBQUU7WUFDTixTQUFTLEVBQUU7Z0JBQ1QsUUFBUSxFQUFFLHNFQUFzRTthQUNqRjtZQUNELEtBQUssRUFBRTtnQkFDTCxRQUFRLEVBQUUsMENBQTBDO2FBQ3JEO1lBQ0QsVUFBVSxFQUFFO2dCQUNWLFFBQVEsRUFBRTtvQkFDUixvQ0FBb0M7b0JBQ3BDLHVCQUF1QixhQUFhLHdFQUF3RTtpQkFDN0c7YUFDRjtTQUNGO1FBQ0QsU0FBUyxFQUFFO1lBQ1QsS0FBSyxFQUFFLHVCQUF1QjtTQUMvQjtLQUNGLENBQUM7SUFDRixvQkFBb0IsRUFBRTtRQUNwQixnQkFBZ0IsRUFBRTtZQUNoQixLQUFLLEVBQUUsVUFBVSxDQUFDLGFBQWE7U0FDaEM7S0FDRjtJQUNELDJCQUEyQixFQUFFLEtBQUs7Q0FDbkMsQ0FBQyxDQUFDO0FBQ0gsMkJBQTJCO0FBQzNCLFVBQVUsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDbEMsTUFBTSxXQUFXLEdBQUcsSUFBSSxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDaEQsTUFBTSxXQUFXLEdBQUcsSUFBSSxTQUFTLENBQUMsZUFBZSxDQUFDO0lBQ2hELFVBQVUsRUFBRSxXQUFXO0lBQ3ZCLE9BQU87SUFDUCxLQUFLLEVBQUUsWUFBWTtJQUNuQixPQUFPLEVBQUUsQ0FBQyxXQUFXLENBQUM7Q0FDdkIsQ0FBQyxDQUFDO0FBRUgsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUU7SUFDN0MsY0FBYyxFQUFFLE1BQU07SUFDdEIsTUFBTSxFQUFFO1FBQ047WUFDRSxTQUFTLEVBQUUsUUFBUTtZQUNuQixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7U0FDeEI7UUFDRDtZQUNFLFNBQVMsRUFBRSxPQUFPO1lBQ2xCLE9BQU8sRUFBRSxDQUFDLFdBQVcsQ0FBQztTQUN2QjtRQUNEO1lBQ0UsU0FBUyxFQUFFLFFBQVE7WUFDbkIsT0FBTyxFQUFFO2dCQUNQLElBQUksU0FBUyxDQUFDLGVBQWUsQ0FBQztvQkFDNUIsVUFBVSxFQUFFLGNBQWM7b0JBQzFCLEtBQUssRUFBRSxXQUFXO29CQUNsQixPQUFPO29CQUNQLGlCQUFpQixFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztpQkFDNUMsQ0FBQzthQUNIO1NBQ0Y7S0FDRjtDQUNGLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNvZGVidWlsZCBmcm9tICdAYXdzLWNkay9hd3MtY29kZWJ1aWxkJztcbmltcG9ydCAqIGFzIGNvZGVwaXBlbGluZSBmcm9tICdAYXdzLWNkay9hd3MtY29kZXBpcGVsaW5lJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGVjciBmcm9tICdAYXdzLWNkay9hd3MtZWNyJztcbmltcG9ydCAqIGFzIGVjcyBmcm9tICdAYXdzLWNkay9hd3MtZWNzJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ0Bhd3MtY2RrL2F3cy1zMyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjcGFjdGlvbnMgZnJvbSAnLi4vbGliJztcblxuLyogZXNsaW50LWRpc2FibGUgcXVvdGUtcHJvcHMgKi9cblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxuY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ2F3cy1jZGstY29kZXBpcGVsaW5lLWVjcy1kZXBsb3knKTtcblxuY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnLCB7XG4gIG1heEF6czogMSxcbn0pO1xuY29uc3QgY2x1c3RlciA9IG5ldyBlY3MuQ2x1c3RlcihzdGFjaywgJ0Vjc0NsdXN0ZXInLCB7XG4gIHZwYyxcbn0pO1xuY29uc3QgcmVwb3NpdG9yeSA9IG5ldyBlY3IuUmVwb3NpdG9yeShzdGFjaywgJ0VjclJlcG8nKTtcbmNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5GYXJnYXRlVGFza0RlZmluaXRpb24oc3RhY2ssICdUYXNrRGVmJyk7XG5jb25zdCBjb250YWluZXJOYW1lID0gJ0NvbnRhaW5lcic7XG50YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoY29udGFpbmVyTmFtZSwge1xuICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG59KTtcbmNvbnN0IHNlcnZpY2UgPSBuZXcgZWNzLkZhcmdhdGVTZXJ2aWNlKHN0YWNrLCAnRmFyZ2F0ZVNlcnZpY2UnLCB7XG4gIGNsdXN0ZXIsXG4gIHRhc2tEZWZpbml0aW9uLFxufSk7XG5cbmNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcsIHtcbiAgdmVyc2lvbmVkOiB0cnVlLFxuICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxufSk7XG5jb25zdCBzb3VyY2VPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCdTb3VyY2VBcnRpZmFjdCcpO1xuY29uc3Qgc291cmNlQWN0aW9uID0gbmV3IGNwYWN0aW9ucy5TM1NvdXJjZUFjdGlvbih7XG4gIGFjdGlvbk5hbWU6ICdTb3VyY2UnLFxuICBvdXRwdXQ6IHNvdXJjZU91dHB1dCxcbiAgYnVja2V0LFxuICBidWNrZXRLZXk6ICdwYXRoL3RvL0RvY2tlcmZpbGUnLFxufSk7XG5cbmNvbnN0IHByb2plY3QgPSBuZXcgY29kZWJ1aWxkLlBpcGVsaW5lUHJvamVjdChzdGFjaywgJ0Vjc1Byb2plY3QnLCB7XG4gIGVudmlyb25tZW50OiB7XG4gICAgYnVpbGRJbWFnZTogY29kZWJ1aWxkLkxpbnV4QnVpbGRJbWFnZS5VQlVOVFVfMTRfMDRfRE9DS0VSXzE3XzA5XzAsXG4gICAgcHJpdmlsZWdlZDogdHJ1ZSxcbiAgfSxcbiAgYnVpbGRTcGVjOiBjb2RlYnVpbGQuQnVpbGRTcGVjLmZyb21PYmplY3Qoe1xuICAgIHZlcnNpb246ICcwLjInLFxuICAgIHBoYXNlczoge1xuICAgICAgcHJlX2J1aWxkOiB7XG4gICAgICAgIGNvbW1hbmRzOiAnJChhd3MgZWNyIGdldC1sb2dpbiAtLXJlZ2lvbiAkQVdTX0RFRkFVTFRfUkVHSU9OIC0tbm8taW5jbHVkZS1lbWFpbCknLFxuICAgICAgfSxcbiAgICAgIGJ1aWxkOiB7XG4gICAgICAgIGNvbW1hbmRzOiAnZG9ja2VyIGJ1aWxkIC10ICRSRVBPU0lUT1JZX1VSSTpsYXRlc3QgLicsXG4gICAgICB9LFxuICAgICAgcG9zdF9idWlsZDoge1xuICAgICAgICBjb21tYW5kczogW1xuICAgICAgICAgICdkb2NrZXIgcHVzaCAkUkVQT1NJVE9SWV9VUkk6bGF0ZXN0JyxcbiAgICAgICAgICBgcHJpbnRmICdbeyBcIm5hbWVcIjogXCIke2NvbnRhaW5lck5hbWV9XCIsIFwiaW1hZ2VVcmlcIjogXCIlc1wiIH1dJyAkUkVQT1NJVE9SWV9VUkk6bGF0ZXN0ID4gaW1hZ2VkZWZpbml0aW9ucy5qc29uYCxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBhcnRpZmFjdHM6IHtcbiAgICAgIGZpbGVzOiAnaW1hZ2VkZWZpbml0aW9ucy5qc29uJyxcbiAgICB9LFxuICB9KSxcbiAgZW52aXJvbm1lbnRWYXJpYWJsZXM6IHtcbiAgICAnUkVQT1NJVE9SWV9VUkknOiB7XG4gICAgICB2YWx1ZTogcmVwb3NpdG9yeS5yZXBvc2l0b3J5VXJpLFxuICAgIH0sXG4gIH0sXG4gIGdyYW50UmVwb3J0R3JvdXBQZXJtaXNzaW9uczogZmFsc2UsXG59KTtcbi8vIG5lZWRlZCBmb3IgYGRvY2tlciBwdXNoYFxucmVwb3NpdG9yeS5ncmFudFB1bGxQdXNoKHByb2plY3QpO1xuY29uc3QgYnVpbGRPdXRwdXQgPSBuZXcgY29kZXBpcGVsaW5lLkFydGlmYWN0KCk7XG5jb25zdCBidWlsZEFjdGlvbiA9IG5ldyBjcGFjdGlvbnMuQ29kZUJ1aWxkQWN0aW9uKHtcbiAgYWN0aW9uTmFtZTogJ0NvZGVCdWlsZCcsXG4gIHByb2plY3QsXG4gIGlucHV0OiBzb3VyY2VPdXRwdXQsXG4gIG91dHB1dHM6IFtidWlsZE91dHB1dF0sXG59KTtcblxubmV3IGNvZGVwaXBlbGluZS5QaXBlbGluZShzdGFjaywgJ015UGlwZWxpbmUnLCB7XG4gIGFydGlmYWN0QnVja2V0OiBidWNrZXQsXG4gIHN0YWdlczogW1xuICAgIHtcbiAgICAgIHN0YWdlTmFtZTogJ1NvdXJjZScsXG4gICAgICBhY3Rpb25zOiBbc291cmNlQWN0aW9uXSxcbiAgICB9LFxuICAgIHtcbiAgICAgIHN0YWdlTmFtZTogJ0J1aWxkJyxcbiAgICAgIGFjdGlvbnM6IFtidWlsZEFjdGlvbl0sXG4gICAgfSxcbiAgICB7XG4gICAgICBzdGFnZU5hbWU6ICdEZXBsb3knLFxuICAgICAgYWN0aW9uczogW1xuICAgICAgICBuZXcgY3BhY3Rpb25zLkVjc0RlcGxveUFjdGlvbih7XG4gICAgICAgICAgYWN0aW9uTmFtZTogJ0RlcGxveUFjdGlvbicsXG4gICAgICAgICAgaW5wdXQ6IGJ1aWxkT3V0cHV0LFxuICAgICAgICAgIHNlcnZpY2UsXG4gICAgICAgICAgZGVwbG95bWVudFRpbWVvdXQ6IGNkay5EdXJhdGlvbi5taW51dGVzKDYwKSxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0sXG4gIF0sXG59KTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=