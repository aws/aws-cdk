import codepipeline = require('@aws-cdk/aws-codepipeline-api');
import iam = require('@aws-cdk/aws-iam');
import { IServerDeploymentGroup } from './server';

/**
 * Common properties for creating a {@link PipelineDeployAction},
 * either directly, through its constructor,
 * or through {@link IServerDeploymentGroup#toCodePipelineDeployAction}.
 */
export interface CommonPipelineDeployActionProps extends codepipeline.CommonActionProps {
  /**
   * The source to use as input for deployment.
   */
  readonly inputArtifact: codepipeline.Artifact;
}

/**
 * Construction properties of the {@link PipelineDeployAction CodeDeploy deploy CodePipeline Action}.
 */
export interface PipelineDeployActionProps extends CommonPipelineDeployActionProps {
  /**
   * The CodeDeploy Deployment Group to deploy to.
   */
  readonly deploymentGroup: IServerDeploymentGroup;
}

export class PipelineDeployAction extends codepipeline.DeployAction {
  private readonly deploymentGroup: IServerDeploymentGroup;

  constructor(props: PipelineDeployActionProps) {
    super({
      ...props,
      artifactBounds: { minInputs: 1, maxInputs: 1, minOutputs: 0, maxOutputs: 0 },
      provider: 'CodeDeploy',
      inputArtifact: props.inputArtifact,
      configuration: {
        ApplicationName: props.deploymentGroup.application.applicationName,
        DeploymentGroupName: props.deploymentGroup.deploymentGroupName,
      },
    });

    this.deploymentGroup = props.deploymentGroup;
  }

  protected bind(info: codepipeline.ActionBind): void {
    // permissions, based on:
    // https://docs.aws.amazon.com/codedeploy/latest/userguide/auth-and-access-control-permissions-reference.html

    info.role.addToPolicy(new iam.PolicyStatement()
      .addResource(this.deploymentGroup.application.applicationArn)
      .addActions(
        'codedeploy:GetApplicationRevision',
        'codedeploy:RegisterApplicationRevision',
      ));

    info.role.addToPolicy(new iam.PolicyStatement()
      .addResource(this.deploymentGroup.deploymentGroupArn)
      .addActions(
        'codedeploy:CreateDeployment',
        'codedeploy:GetDeployment',
      ));

    info.role.addToPolicy(new iam.PolicyStatement()
      .addResource(this.deploymentGroup.deploymentConfig.deploymentConfigArn(info.scope))
      .addActions(
        'codedeploy:GetDeploymentConfig',
      ));

    // grant the ASG Role permissions to read from the Pipeline Bucket
    for (const asg of this.deploymentGroup.autoScalingGroups || []) {
      info.pipeline.grantBucketRead(asg.role);
    }
  }
}
