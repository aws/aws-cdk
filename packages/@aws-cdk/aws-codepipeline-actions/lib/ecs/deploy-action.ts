import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as ecs from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
import { Duration } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Action } from '../action';
import { deployArtifactBounds } from '../common';

/**
 * Construction properties of `EcsDeployAction`.
 */
export interface EcsDeployActionProps extends codepipeline.CommonAwsActionProps {
  /**
   * The input artifact that contains the JSON image definitions file to use for deployments.
   * The JSON file is a list of objects,
   * each with 2 keys: `name` is the name of the container in the Task Definition,
   * and `imageUri` is the Docker image URI you want to update your service with.
   * If you use this property, it's assumed the file is called 'imagedefinitions.json'.
   * If your build uses a different file, leave this property empty,
   * and use the `imageFile` property instead.
   *
   * @default - one of this property, or `imageFile`, is required
   * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/pipelines-create.html#pipelines-create-image-definitions
   */
  readonly input?: codepipeline.Artifact;

  /**
   * The name of the JSON image definitions file to use for deployments.
   * The JSON file is a list of objects,
   * each with 2 keys: `name` is the name of the container in the Task Definition,
   * and `imageUri` is the Docker image URI you want to update your service with.
   * Use this property if you want to use a different name for this file than the default 'imagedefinitions.json'.
   * If you use this property, you don't need to specify the `input` property.
   *
   * @default - one of this property, or `input`, is required
   * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/pipelines-create.html#pipelines-create-image-definitions
   */
  readonly imageFile?: codepipeline.ArtifactPath;

  /**
   * The ECS Service to deploy.
   */
  readonly service: ecs.IBaseService;

  /**
   * Timeout for the ECS deployment in minutes. Value must be between 1-60.
   *
   * @default - 60 minutes
   * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/action-reference-ECS.html
   */
  readonly deploymentTimeout?: Duration;
}

/**
 * CodePipeline Action to deploy an ECS Service.
 */
export class EcsDeployAction extends Action {
  private readonly props: EcsDeployActionProps;
  private readonly deploymentTimeout?: number

  constructor(props: EcsDeployActionProps) {
    super({
      ...props,
      category: codepipeline.ActionCategory.DEPLOY,
      provider: 'ECS',
      artifactBounds: deployArtifactBounds(),
      inputs: [determineInputArtifact(props)],
      resource: props.service,
    });

    const deploymentTimeout = props.deploymentTimeout?.toMinutes({ integral: true });
    if (deploymentTimeout !== undefined && (deploymentTimeout < 1 || deploymentTimeout > 60)) {
      throw new Error(`Deployment timeout must be between 1 and 60 minutes, got: ${deploymentTimeout}`);
    }

    this.props = props;
    this.deploymentTimeout = deploymentTimeout;
  }

  protected bound(_scope: Construct, _stage: codepipeline.IStage, options: codepipeline.ActionBindOptions):
  codepipeline.ActionConfig {
    // permissions based on CodePipeline documentation:
    // https://docs.aws.amazon.com/codepipeline/latest/userguide/how-to-custom-role.html#how-to-update-role-new-services
    options.role.addToPolicy(new iam.PolicyStatement({
      actions: [
        'ecs:DescribeServices',
        'ecs:DescribeTaskDefinition',
        'ecs:DescribeTasks',
        'ecs:ListTasks',
        'ecs:RegisterTaskDefinition',
        'ecs:UpdateService',
      ],
      resources: ['*'],
    }));

    options.role.addToPolicy(new iam.PolicyStatement({
      actions: ['iam:PassRole'],
      resources: ['*'],
      conditions: {
        StringEqualsIfExists: {
          'iam:PassedToService': [
            'ec2.amazonaws.com',
            'ecs-tasks.amazonaws.com',
          ],
        },
      },
    }));

    options.bucket.grantRead(options.role);

    return {
      configuration: {
        ClusterName: this.props.service.cluster.clusterName,
        ServiceName: this.props.service.serviceName,
        FileName: this.props.imageFile?.fileName,
        DeploymentTimeout: this.deploymentTimeout,
      },
    };
  }
}

function determineInputArtifact(props: EcsDeployActionProps): codepipeline.Artifact {
  if (props.imageFile && props.input) {
    throw new Error("Exactly one of 'input' or 'imageFile' can be provided in the ECS deploy Action");
  }
  if (props.imageFile) {
    return props.imageFile.artifact;
  }
  if (props.input) {
    return props.input;
  }
  throw new Error("Specifying one of 'input' or 'imageFile' is required for the ECS deploy Action");
}
