import actions = require('@aws-cdk/aws-codepipeline-api');
import cdk = require('@aws-cdk/cdk');

/**
 * Construction properties of the {@link PipelineDeployAction CodeDeploy deploy CodePipeline Action}.
 */
export interface PipelineDeployActionProps extends actions.CommonActionProps {
  /**
   * The name of the CodeDeploy application to deploy to.
   *
   * @note this will most likely be changed to a proper CodeDeploy AWS Construct reference
   *   once that functionality has been implemented for CodeDeploy
   */
  applicationName: string;

  /**
   * The name of the CodeDeploy deployment group to deploy to.
   *
   * @note this will most likely be changed to a proper CodeDeploy AWS Construct reference
   *   once that functionality has been implemented for CodeDeploy
   */
  deploymentGroupName: string;

  /**
   * The source to use as input for deployment.
   */
  inputArtifact: actions.Artifact;
}

export class PipelineDeployAction extends actions.DeployAction {
  constructor(parent: cdk.Construct, id: string, props: PipelineDeployActionProps) {
    super(parent, id, {
      stage: props.stage,
      artifactBounds: { minInputs: 1, maxInputs: 1, minOutputs: 0, maxOutputs: 0 },
      provider: 'CodeDeploy',
      inputArtifact: props.inputArtifact,
      configuration: {
        ApplicationName: props.applicationName,
        DeploymentGroupName: props.deploymentGroupName,
      },
    });

    // permissions, based on:
    // https://docs.aws.amazon.com/codedeploy/latest/userguide/auth-and-access-control-permissions-reference.html

    const applicationArn = cdk.ArnUtils.fromComponents({
      service: 'codedeploy',
      resource: 'application',
      resourceName: props.applicationName,
      sep: ':',
    });
    props.stage.pipelineRole.addToPolicy(new cdk.PolicyStatement()
      .addResource(applicationArn)
      .addActions(
        'codedeploy:GetApplicationRevision',
        'codedeploy:RegisterApplicationRevision',
      ));

    const deploymentGroupArn = cdk.ArnUtils.fromComponents({
      service: 'codedeploy',
      resource: 'deploymentgroup',
      resourceName: `${props.applicationName}/${props.deploymentGroupName}`,
      sep: ':',
    });
    props.stage.pipelineRole.addToPolicy(new cdk.PolicyStatement()
      .addResource(deploymentGroupArn)
      .addActions(
        'codedeploy:CreateDeployment',
        'codedeploy:GetDeployment',
      ));

    const deployConfigArn = cdk.ArnUtils.fromComponents({
      service: 'codedeploy',
      resource: 'deploymentconfig',
      resourceName: '*',
      sep: ':',
    });
    props.stage.pipelineRole.addToPolicy(new cdk.PolicyStatement()
      .addResource(deployConfigArn)
      .addActions(
        'codedeploy:GetDeploymentConfig',
      ));
  }
}
