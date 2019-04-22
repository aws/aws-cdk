import codepipeline = require('@aws-cdk/aws-codepipeline');
import ecs = require('@aws-cdk/aws-ecs');
import iam = require('@aws-cdk/aws-iam');
import { deployArtifactBounds } from '../common';

/**
 * Construction properties of {@link EcsDeployAction}.
 */
export interface EcsDeployActionProps extends codepipeline.CommonActionProps {
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
  readonly service: ecs.BaseService;
}

/**
 * CodePipeline Action to deploy an ECS Service.
 */
export class EcsDeployAction extends codepipeline.Action {
  constructor(props: EcsDeployActionProps) {
    super({
      ...props,
      category: codepipeline.ActionCategory.Deploy,
      provider: 'ECS',
      artifactBounds: deployArtifactBounds(),
      inputs: [determineInputArtifact(props)],
      configuration: {
        ClusterName: props.service.clusterName,
        ServiceName: props.service.serviceName,
        FileName: props.imageFile && props.imageFile.fileName,
      },
    });
  }

  protected bind(info: codepipeline.ActionBind): void {
    // permissions based on CodePipeline documentation:
    // https://docs.aws.amazon.com/codepipeline/latest/userguide/how-to-custom-role.html#how-to-update-role-new-services
    info.role.addToPolicy(new iam.PolicyStatement()
      .addActions(
        'ecs:DescribeServices',
        'ecs:DescribeTaskDefinition',
        'ecs:DescribeTasks',
        'ecs:ListTasks',
        'ecs:RegisterTaskDefinition',
        'ecs:UpdateService',
      )
      .addAllResources());

    info.role.addToPolicy(new iam.PolicyStatement()
      .addActions(
        'iam:PassRole',
      )
      .addAllResources()
      .addCondition('StringEqualsIfExists', {
        'iam:PassedToService': [
          'ec2.amazonaws.com',
          'ecs-tasks.amazonaws.com',
        ],
      }));
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
