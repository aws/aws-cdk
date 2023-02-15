import * as codedeploy from '@aws-cdk/aws-codedeploy';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as iam from '@aws-cdk/aws-iam';
import { Lazy } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Action } from '../action';
import { forceSupportStackDependency } from '../private/stack-dependency';

/**
 * Configuration for replacing a placeholder string in the ECS task
 * definition template file with an image URI.
 */
export interface CodeDeployEcsContainerImageInput {
  /**
   * The artifact that contains an `imageDetails.json` file with the image URI.
   *
   * The artifact's `imageDetails.json` file must be a JSON file containing an
   * `ImageURI` property.  For example:
   * `{ "ImageURI": "ACCOUNTID.dkr.ecr.us-west-2.amazonaws.com/dk-image-repo@sha256:example3" }`
   */
  readonly input: codepipeline.Artifact;

  /**
   * The placeholder string in the ECS task definition template file that will
   * be replaced with the image URI.
   *
   * The placeholder string must be surrounded by angle brackets in the template file.
   * For example, if the task definition template file contains a placeholder like
   * `"image": "<PLACEHOLDER>"`, then the `taskDefinitionPlaceholder` value should
   * be `PLACEHOLDER`.
   *
   * @default IMAGE
   */
  readonly taskDefinitionPlaceholder?: string;
}

/**
 * Construction properties of the `CodeDeployEcsDeployAction CodeDeploy ECS deploy CodePipeline Action`.
 */
export interface CodeDeployEcsDeployActionProps extends codepipeline.CommonAwsActionProps {
  /**
   * The CodeDeploy ECS Deployment Group to deploy to.
   */
  readonly deploymentGroup: codedeploy.IEcsDeploymentGroup;

  /**
   * The artifact containing the ECS task definition template file.
   * During deployment, the task definition template file contents
   * will be registered with ECS.
   *
   * If you use this property, it's assumed the file is called 'taskdef.json'.
   * If your task definition template uses a different filename, leave this property empty,
   * and use the `taskDefinitionTemplateFile` property instead.
   *
   * @default - one of this property, or `taskDefinitionTemplateFile`, is required
   */
  readonly taskDefinitionTemplateInput?: codepipeline.Artifact;

  /**
   * The name of the ECS task definition template file.
   * During deployment, the task definition template file contents
   * will be registered with ECS.
   *
   * Use this property if you want to use a different name for this file than the default 'taskdef.json'.
   * If you use this property, you don't need to specify the `taskDefinitionTemplateInput` property.
   *
   * @default - one of this property, or `taskDefinitionTemplateInput`, is required
   */
  readonly taskDefinitionTemplateFile?: codepipeline.ArtifactPath;

  /**
   * The artifact containing the CodeDeploy AppSpec file.
   * During deployment, a new task definition will be registered
   * with ECS, and the new task definition ID will be inserted into
   * the CodeDeploy AppSpec file.  The AppSpec file contents will be
   * provided to CodeDeploy for the deployment.
   *
   * If you use this property, it's assumed the file is called 'appspec.yaml'.
   * If your AppSpec file uses a different filename, leave this property empty,
   * and use the `appSpecTemplateFile` property instead.
   *
   * @default - one of this property, or `appSpecTemplateFile`, is required
   */
  readonly appSpecTemplateInput?: codepipeline.Artifact;

  /**
   * The name of the CodeDeploy AppSpec file.
   * During deployment, a new task definition will be registered
   * with ECS, and the new task definition ID will be inserted into
   * the CodeDeploy AppSpec file.  The AppSpec file contents will be
   * provided to CodeDeploy for the deployment.
   *
   * Use this property if you want to use a different name for this file than the default 'appspec.yaml'.
   * If you use this property, you don't need to specify the `appSpecTemplateInput` property.
   *
   * @default - one of this property, or `appSpecTemplateInput`, is required
   */
  readonly appSpecTemplateFile?: codepipeline.ArtifactPath;

  /**
   * Configuration for dynamically updated images in the task definition.
   *
   * Provide pairs of an image details input artifact and a placeholder string
   * that will be used to dynamically update the ECS task definition template
   * file prior to deployment. A maximum of 4 images can be given.
   */
  readonly containerImageInputs?: CodeDeployEcsContainerImageInput[];
}

export class CodeDeployEcsDeployAction extends Action {
  private readonly actionProps: CodeDeployEcsDeployActionProps;

  constructor(props: CodeDeployEcsDeployActionProps) {
    const inputs: codepipeline.Artifact[] = [];
    inputs.push(determineTaskDefinitionArtifact(props));
    inputs.push(determineAppSpecArtifact(props));

    if (props.containerImageInputs) {
      if (props.containerImageInputs.length > 4) {
        throw new Error(`Action cannot have more than 4 container image inputs, got: ${props.containerImageInputs.length}`);
      }

      for (const imageInput of props.containerImageInputs) {
        inputs.push(imageInput.input);
      }
    }

    super({
      ...props,
      resource: props.deploymentGroup,
      category: codepipeline.ActionCategory.DEPLOY,
      provider: 'CodeDeployToECS',
      artifactBounds: { minInputs: 1, maxInputs: 5, minOutputs: 0, maxOutputs: 0 },
      inputs,
    });

    this.actionProps = props;
  }

  protected bound(_scope: Construct, _stage: codepipeline.IStage, options: codepipeline.ActionBindOptions):
  codepipeline.ActionConfig {
    // permissions, based on:
    // https://docs.aws.amazon.com/codedeploy/latest/userguide/auth-and-access-control-permissions-reference.html

    options.role.addToPolicy(new iam.PolicyStatement({
      resources: [this.actionProps.deploymentGroup.application.applicationArn],
      actions: ['codedeploy:GetApplication', 'codedeploy:GetApplicationRevision', 'codedeploy:RegisterApplicationRevision'],
    }));

    options.role.addToPolicy(new iam.PolicyStatement({
      resources: [this.actionProps.deploymentGroup.deploymentGroupArn],
      actions: ['codedeploy:CreateDeployment', 'codedeploy:GetDeployment'],
    }));

    options.role.addToPolicy(new iam.PolicyStatement({
      resources: [this.actionProps.deploymentGroup.deploymentConfig.deploymentConfigArn],
      actions: ['codedeploy:GetDeploymentConfig'],
    }));

    // Allow action to register the task definition template file with ECS
    options.role.addToPolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions: ['ecs:RegisterTaskDefinition'],
    }));

    // Allow passing any roles specified in the task definition template file to ECS
    options.role.addToPolicy(new iam.PolicyStatement({
      actions: ['iam:PassRole'],
      resources: ['*'],
      conditions: {
        StringEqualsIfExists: {
          'iam:PassedToService': [
            'ecs-tasks.amazonaws.com',
          ],
        },
      },
    }));

    // the Action's Role needs to read from the Bucket to get artifacts
    options.bucket.grantRead(options.role);
    forceSupportStackDependency(options.bucket, options.role);

    const taskDefinitionTemplateArtifact = determineTaskDefinitionArtifact(this.actionProps);
    const appSpecTemplateArtifact = determineAppSpecArtifact(this.actionProps);
    const actionConfig: codepipeline.ActionConfig = {
      configuration: {
        ApplicationName: this.actionProps.deploymentGroup.application.applicationName,
        DeploymentGroupName: this.actionProps.deploymentGroup.deploymentGroupName,

        TaskDefinitionTemplateArtifact: Lazy.string({ produce: () => taskDefinitionTemplateArtifact.artifactName }),
        TaskDefinitionTemplatePath: this.actionProps.taskDefinitionTemplateFile
          ? this.actionProps.taskDefinitionTemplateFile.fileName
          : 'taskdef.json',

        AppSpecTemplateArtifact: Lazy.string({ produce: () => appSpecTemplateArtifact.artifactName }),
        AppSpecTemplatePath: this.actionProps.appSpecTemplateFile
          ? this.actionProps.appSpecTemplateFile.fileName
          : 'appspec.yaml',
      },
    };

    if (this.actionProps.containerImageInputs) {
      for (let i = 1; i <= this.actionProps.containerImageInputs.length; i++) {
        const imageInput = this.actionProps.containerImageInputs[i - 1];
        actionConfig.configuration[`Image${i}ArtifactName`] = Lazy.string({ produce: () => imageInput.input.artifactName });
        actionConfig.configuration[`Image${i}ContainerName`] = imageInput.taskDefinitionPlaceholder
          ? imageInput.taskDefinitionPlaceholder
          : 'IMAGE';
      }
    }

    return actionConfig;
  }
}

function determineTaskDefinitionArtifact(props: CodeDeployEcsDeployActionProps): codepipeline.Artifact {
  if (props.taskDefinitionTemplateFile && props.taskDefinitionTemplateInput) {
    throw new Error("Exactly one of 'taskDefinitionTemplateInput' or 'taskDefinitionTemplateFile' can be provided in the ECS CodeDeploy Action");
  }
  if (props.taskDefinitionTemplateFile) {
    return props.taskDefinitionTemplateFile.artifact;
  }
  if (props.taskDefinitionTemplateInput) {
    return props.taskDefinitionTemplateInput;
  }
  throw new Error("Specifying one of 'taskDefinitionTemplateInput' or 'taskDefinitionTemplateFile' is required for the ECS CodeDeploy Action");
}

function determineAppSpecArtifact(props: CodeDeployEcsDeployActionProps): codepipeline.Artifact {
  if (props.appSpecTemplateFile && props.appSpecTemplateInput) {
    throw new Error("Exactly one of 'appSpecTemplateInput' or 'appSpecTemplateFile' can be provided in the ECS CodeDeploy Action");
  }
  if (props.appSpecTemplateFile) {
    return props.appSpecTemplateFile.artifact;
  }
  if (props.appSpecTemplateInput) {
    return props.appSpecTemplateInput;
  }
  throw new Error("Specifying one of 'appSpecTemplateInput' or 'appSpecTemplateFile' is required for the ECS CodeDeploy Action");
}
