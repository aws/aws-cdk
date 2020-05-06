import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecr from '@aws-cdk/aws-ecr';
import * as ecs from '@aws-cdk/aws-ecs';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as cpactions from '../lib';

// tslint:disable:object-literal-key-quotes

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
        }),
      ],
    },
  ],
});

app.synth();
