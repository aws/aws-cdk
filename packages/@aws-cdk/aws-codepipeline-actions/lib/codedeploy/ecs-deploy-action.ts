import codedeploy = require('@aws-cdk/aws-codedeploy');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import iam = require('@aws-cdk/aws-iam');
import { Construct } from '@aws-cdk/core';
import { Action } from '../action';

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
 * Construction properties of the {@link CodeDeployEcsDeployAction CodeDeploy ECS deploy CodePipeline Action}.
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
   */
  readonly taskDefinitionTemplateInput: codepipeline.Artifact;

  /**
   * The path and filename of the ECS task definition template file in the
   * `taskDefinitionTemplateInput` artifact.
   *
   * @default taskdef.json
   */
  readonly taskDefinitionTemplatePath?: string;

  /**
   * The artifact containing the CodeDeploy AppSpec file.
   * During deployment, a new task definition will be registered
   * with ECS, and the new task definition ID will be inserted into
   * the CodeDeploy AppSpec file.  The AppSpec file contents will be
   * provided to CodeDeploy for the deployment.
   */
  readonly appSpecTemplateInput: codepipeline.Artifact;

  /**
   * The path and filename of the CodeDeploy AppSpec file in the
   * `appSpecTemplateInput` artifact.
   *
   * @default appspec.yaml
   */
  readonly appSpecTemplatePath?: string;

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
  private readonly deploymentGroup: codedeploy.IEcsDeploymentGroup;
  private readonly taskDefinitionTemplateInput: codepipeline.Artifact;
  private readonly taskDefinitionTemplatePath: string;
  private readonly appSpecTemplateInput: codepipeline.Artifact;
  private readonly appSpecTemplatePath: string;
  private readonly containerImageInputs: CodeDeployEcsContainerImageInput[];

  constructor(props: CodeDeployEcsDeployActionProps) {
    const inputs: codepipeline.Artifact[] = [];
    inputs.push(props.taskDefinitionTemplateInput);
    inputs.push(props.appSpecTemplateInput);

    if (props.containerImageInputs) {
      if (props.containerImageInputs.length > 4) {
        throw new Error('Action cannot have more than 4 container image inputs');
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

    this.deploymentGroup = props.deploymentGroup;
    this.taskDefinitionTemplateInput = props.taskDefinitionTemplateInput;
    this.taskDefinitionTemplatePath = props.taskDefinitionTemplatePath ? props.taskDefinitionTemplatePath : 'taskdef.json';
    this.appSpecTemplateInput = props.appSpecTemplateInput;
    this.appSpecTemplatePath = props.appSpecTemplatePath ? props.appSpecTemplatePath : 'appspec.yaml';
    this.containerImageInputs = props.containerImageInputs ? props.containerImageInputs : [];
  }

  protected bound(_scope: Construct, _stage: codepipeline.IStage, options: codepipeline.ActionBindOptions):
      codepipeline.ActionConfig {
    // permissions, based on:
    // https://docs.aws.amazon.com/codedeploy/latest/userguide/auth-and-access-control-permissions-reference.html

    options.role.addToPolicy(new iam.PolicyStatement({
      resources: [this.deploymentGroup.application.applicationArn],
      actions: ['codedeploy:GetApplication', 'codedeploy:GetApplicationRevision', 'codedeploy:RegisterApplicationRevision']
    }));

    options.role.addToPolicy(new iam.PolicyStatement({
      resources: [this.deploymentGroup.deploymentGroupArn],
      actions: ['codedeploy:CreateDeployment', 'codedeploy:GetDeployment'],
    }));

    options.role.addToPolicy(new iam.PolicyStatement({
      resources: [this.deploymentGroup.deploymentConfig.deploymentConfigArn],
      actions: ['codedeploy:GetDeploymentConfig']
    }));

    // Allow action to register the task definition template file with ECS
    options.role.addToPolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions: ['ecs:RegisterTaskDefinition']
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
        }
      }
    }));

    // the Action's Role needs to read from the Bucket to get artifacts
    options.bucket.grantRead(options.role);

    const actionConfig: codepipeline.ActionConfig = {
      configuration: {
        ApplicationName: this.deploymentGroup.application.applicationName,
        DeploymentGroupName: this.deploymentGroup.deploymentGroupName,
        TaskDefinitionTemplateArtifact: this.taskDefinitionTemplateInput.artifactName,
        TaskDefinitionTemplatePath: this.taskDefinitionTemplatePath,
        AppSpecTemplateArtifact: this.appSpecTemplateInput.artifactName,
        AppSpecTemplatePath: this.appSpecTemplatePath,
      },
    };

    let i = 1;
    for (const imageInput of this.containerImageInputs) {
      actionConfig.configuration[`Image${i}ArtifactName`] = imageInput.input.artifactName;
      actionConfig.configuration[`Image${i}ContainerName`] = imageInput.taskDefinitionPlaceholder ?
       imageInput.taskDefinitionPlaceholder : 'IMAGE';
      i++;
    }

    return actionConfig;
  }
}
