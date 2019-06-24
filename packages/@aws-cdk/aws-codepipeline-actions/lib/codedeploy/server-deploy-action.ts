import codedeploy = require('@aws-cdk/aws-codedeploy');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import iam = require('@aws-cdk/aws-iam');
import { deployArtifactBounds } from '../common';

/**
 * Construction properties of the {@link CodeDeployServerDeployAction CodeDeploy server deploy CodePipeline Action}.
 */
export interface CodeDeployServerDeployActionProps extends codepipeline.CommonActionProps {
  /**
   * The source to use as input for deployment.
   */
  readonly input: codepipeline.Artifact;

  /**
   * The CodeDeploy server Deployment Group to deploy to.
   */
  readonly deploymentGroup: codedeploy.IServerDeploymentGroup;
}

export class CodeDeployServerDeployAction extends codepipeline.Action {
  private readonly deploymentGroup: codedeploy.IServerDeploymentGroup;

  constructor(props: CodeDeployServerDeployActionProps) {
    super({
      ...props,
      category: codepipeline.ActionCategory.DEPLOY,
      provider: 'CodeDeploy',
      artifactBounds: deployArtifactBounds(),
      inputs: [props.input],
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

    info.role.addToPolicy(new iam.PolicyStatement({
      resources: [this.deploymentGroup.application.applicationArn],
      actions: ['codedeploy:GetApplicationRevision', 'codedeploy:RegisterApplicationRevision']
    }));

    info.role.addToPolicy(new iam.PolicyStatement({
      resources: [this.deploymentGroup.deploymentGroupArn],
      actions: ['codedeploy:CreateDeployment', 'codedeploy:GetDeployment'],
    }));

    info.role.addToPolicy(new iam.PolicyStatement({
      resources: [this.deploymentGroup.deploymentConfig.deploymentConfigArn],
      actions: ['codedeploy:GetDeploymentConfig']
    }));

    // grant the ASG Role permissions to read from the Pipeline Bucket
    for (const asg of this.deploymentGroup.autoScalingGroups || []) {
      info.pipeline.grantBucketRead(asg.role);
    }
  }
}
