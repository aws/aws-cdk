/// !cdk-integ *

import * as codebuild from '../../aws-codebuild';
import * as codecommit from '../../aws-codecommit';
import * as codepipeline from '../../aws-codepipeline';
import * as ec2 from '../../aws-ec2';
import * as ecr from '../../aws-ecr';
import * as ecs from '../../aws-ecs';
import * as s3 from '../../aws-s3';
import * as cdk from '../../core';
import { Construct } from 'constructs';
import * as codepipeline_actions from '../lib';

/**
 * This example demonstrates how to create a CodePipeline that deploys an ECS Service
 * from a different source repository than the source repository of your CDK code.
 * If your application code and your CDK code are in the same repository,
 * use the CDK Pipelines module instead of this method.
 */

/// !show

/**
 * These are the construction properties for `EcsAppStack`.
 * They extend the standard Stack properties,
 * but also require providing the ContainerImage that the service will use.
 * That Image will be provided from the Stack containing the CodePipeline.
 */
export interface EcsAppStackProps extends cdk.StackProps {
  readonly image: ecs.ContainerImage;
}

/**
 * This is the Stack containing a simple ECS Service that uses the provided ContainerImage.
 */
export class EcsAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: EcsAppStackProps) {
    super(scope, id, props);

    const taskDefinition = new ecs.TaskDefinition(this, 'TaskDefinition', {
      compatibility: ecs.Compatibility.FARGATE,
      cpu: '1024',
      memoryMiB: '2048',
    });
    taskDefinition.addContainer('AppContainer', {
      image: props.image,
    });
    new ecs.FargateService(this, 'EcsService', {
      taskDefinition,
      cluster: new ecs.Cluster(this, 'Cluster', {
        vpc: new ec2.Vpc(this, 'Vpc', {
          maxAzs: 1,
        }),
      }),
    });
  }
}

/**
 * This is the Stack containing the CodePipeline definition that deploys an ECS Service.
 */
export class PipelineStack extends cdk.Stack {
  public readonly tagParameterContainerImage: ecs.TagParameterContainerImage;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /* ********** ECS part **************** */

    // this is the ECR repository where the built Docker image will be pushed
    const appEcrRepo = new ecr.Repository(this, 'EcsDeployRepository');
    // the build that creates the Docker image, and pushes it to the ECR repo
    const appCodeDockerBuild = new codebuild.PipelineProject(this, 'AppCodeDockerImageBuildAndPushProject', {
      environment: {
        // we need to run Docker
        privileged: true,
      },
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          build: {
            commands: [
              // login to ECR first
              '$(aws ecr get-login --region $AWS_DEFAULT_REGION --no-include-email)',
              // if your application needs any build steps, they would be invoked here

              // build the image, and tag it with the commit hash
              // (CODEBUILD_RESOLVED_SOURCE_VERSION is a special environment variable available in CodeBuild)
              'docker build -t $REPOSITORY_URI:$CODEBUILD_RESOLVED_SOURCE_VERSION .',
            ],
          },
          post_build: {
            commands: [
              // push the built image into the ECR repository
              'docker push $REPOSITORY_URI:$CODEBUILD_RESOLVED_SOURCE_VERSION',
              // save the declared tag as an environment variable,
              // that is then exported below in the 'exported-variables' section as a CodePipeline Variable
              'export imageTag=$CODEBUILD_RESOLVED_SOURCE_VERSION',
            ],
          },
        },
        env: {
          // save the imageTag environment variable as a CodePipeline Variable
          'exported-variables': [
            'imageTag',
          ],
        },
      }),
      environmentVariables: {
        REPOSITORY_URI: {
          value: appEcrRepo.repositoryUri,
        },
      },
    });
    // needed for `docker push`
    appEcrRepo.grantPullPush(appCodeDockerBuild);
    // create the ContainerImage used for the ECS application Stack
    this.tagParameterContainerImage = new ecs.TagParameterContainerImage(appEcrRepo);

    const cdkCodeBuild = new codebuild.PipelineProject(this, 'CdkCodeBuildProject', {
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            commands: [
              'npm install',
            ],
          },
          build: {
            commands: [
              // synthesize the CDK code for the ECS application Stack
              'npx cdk synth --verbose',
            ],
          },
        },
        artifacts: {
          // store the entire Cloud Assembly as the output artifact
          'base-directory': 'cdk.out',
          'files': '**/*',
        },
      }),
    });

    /* ********** Pipeline part **************** */

    const appCodeSourceOutput = new codepipeline.Artifact();
    const cdkCodeSourceOutput = new codepipeline.Artifact();
    const cdkCodeBuildOutput = new codepipeline.Artifact();
    const appCodeBuildAction = new codepipeline_actions.CodeBuildAction({
      actionName: 'AppCodeDockerImageBuildAndPush',
      project: appCodeDockerBuild,
      input: appCodeSourceOutput,
    });
    new codepipeline.Pipeline(this, 'CodePipelineDeployingEcsApplication', {
      artifactBucket: new s3.Bucket(this, 'ArtifactBucket', {
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      }),
      stages: [
        {
          stageName: 'Source',
          actions: [
            // this is the Action that takes the source of your application code
            new codepipeline_actions.CodeCommitSourceAction({
              actionName: 'AppCodeSource',
              repository: new codecommit.Repository(this, 'AppCodeSourceRepository', { repositoryName: 'AppCodeSourceRepository' }),
              output: appCodeSourceOutput,
            }),
            // this is the Action that takes the source of your CDK code
            // (which would probably include this Pipeline code as well)
            new codepipeline_actions.CodeCommitSourceAction({
              actionName: 'CdkCodeSource',
              repository: new codecommit.Repository(this, 'CdkCodeSourceRepository', { repositoryName: 'CdkCodeSourceRepository' }),
              output: cdkCodeSourceOutput,
            }),
          ],
        },
        {
          stageName: 'Build',
          actions: [
            appCodeBuildAction,
            new codepipeline_actions.CodeBuildAction({
              actionName: 'CdkCodeBuildAndSynth',
              project: cdkCodeBuild,
              input: cdkCodeSourceOutput,
              outputs: [cdkCodeBuildOutput],
            }),
          ],
        },
        {
          stageName: 'Deploy',
          actions: [
            new codepipeline_actions.CloudFormationCreateUpdateStackAction({
              actionName: 'CFN_Deploy',
              stackName: 'SampleEcsStackDeployedFromCodePipeline',
              // this name has to be the same name as used below in the CDK code for the application Stack
              templatePath: cdkCodeBuildOutput.atPath('EcsStackDeployedInPipeline.template.json'),
              adminPermissions: true,
              parameterOverrides: {
                // read the tag pushed to the ECR repository from the CodePipeline Variable saved by the application build step,
                // and pass it as the CloudFormation Parameter for the tag
                [this.tagParameterContainerImage.tagParameterName]: appCodeBuildAction.variable('imageTag'),
              },
            }),
          ],
        },
      ],
    });
  }
}

const app = new cdk.App();

// the CodePipeline Stack needs to be created first
const pipelineStack = new PipelineStack(app, 'aws-cdk-pipeline-ecs-separate-sources');
// we supply the image to the ECS application Stack from the CodePipeline Stack
new EcsAppStack(app, 'EcsStackDeployedInPipeline', {
  image: pipelineStack.tagParameterContainerImage,
});
/// !hide

app.synth();
