import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as ecs from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
import { Duration } from '@aws-cdk/core';
import { Action } from '../action';
import { deployArtifactBounds } from '../common';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

/**
 * ECS Service Attributes to describle the CodePipeline Actions.
 */
export interface EcsServiceAttribute {
  /**
   * The ECS serviceName to deploy to.
   */
  readonly serviceName: string;
  /**
   * The ECS clusterName to deploy to.
   */
  readonly clusterName: string;
}

/**
 * Construction properties of {@link EcsDeployAction}.
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
   * @default - one of this property, or `serviceAttributes`, is required
   */
  readonly service?: ecs.IBaseService;

  /**
   * The ECS Service Attributes to deploy, must be specificed with `region` and `role`.
   * Ensure if the role being specified is not in the same account has ECS deployment permissions.
   * @default - one of this property, or `service`, is required
   * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/how-to-custom-role.html#how-to-update-role-new-services
   */
  readonly serviceAttributes?: EcsServiceAttribute;

  /**
   * The region the ECS Service is deployed in, must be specificed when using `serviceAttributes`.
   * @default - will be defined by `service`.
   */
  readonly region?: string;
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

    if (props.service && props.serviceAttributes) {
      throw new Error("Exactly one of 'service' or 'serviceAttributes' can be provided in the ECS deploy Action");
    }
    if (!props.service && !props.serviceAttributes) {
      throw new Error("Specifying one of 'service' or 'serviceAttributes' is required for the ECS deploy Action");
    }
    if (props.serviceAttributes) {
      if (!props.region && !props.role) {
        throw new Error("Specifying 'region' and 'role' is required when specifying 'serviceAttributes'");
      }
      if (!props.region) {
        throw new Error("Specifying 'region' is required when specifying 'serviceAttributes'");
      }
      if (!props.role) {
        throw new Error("Specifying 'role' is required when specifying 'serviceAttributes'");
      }
    }
    if (props.service && props.region) {
      throw new Error("Must not specify 'region' when specifying 'service'");
    }

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
    // If this role is not in the same account, this policy will not be applied.
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
        ClusterName: this.props.serviceAttributes ? this.props.serviceAttributes!.clusterName : this.props.service!.cluster.clusterName,
        ServiceName: this.props.serviceAttributes ? this.props.serviceAttributes!.serviceName: this.props.service!.serviceName,
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
