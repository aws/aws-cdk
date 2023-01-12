import * as codedeploy from '@aws-cdk/aws-codedeploy';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as iam from '@aws-cdk/aws-iam';
import { Construct } from 'constructs';
import { Action } from '../action';
import { deployArtifactBounds } from '../common';

/**
 * Construction properties of the `CodeDeployServerDeployAction CodeDeploy server deploy CodePipeline Action`.
 */
export interface CodeDeployServerDeployActionProps extends codepipeline.CommonAwsActionProps {
  /**
   * The source to use as input for deployment.
   */
  readonly input: codepipeline.Artifact;

  /**
   * The CodeDeploy server Deployment Group to deploy to.
   */
  readonly deploymentGroup: codedeploy.IServerDeploymentGroup;
}

export class CodeDeployServerDeployAction extends Action {
  private readonly deploymentGroup: codedeploy.IServerDeploymentGroup;

  constructor(props: CodeDeployServerDeployActionProps) {
    super({
      ...props,
      resource: props.deploymentGroup,
      category: codepipeline.ActionCategory.DEPLOY,
      provider: 'CodeDeploy',
      artifactBounds: deployArtifactBounds(),
      inputs: [props.input],
    });

    this.deploymentGroup = props.deploymentGroup;
  }

  protected bound(_scope: Construct, _stage: codepipeline.IStage, options: codepipeline.ActionBindOptions):
  codepipeline.ActionConfig {
    // permissions, based on:
    // https://docs.aws.amazon.com/codedeploy/latest/userguide/auth-and-access-control-permissions-reference.html

    options.role.addToPolicy(new iam.PolicyStatement({
      resources: [this.deploymentGroup.application.applicationArn],
      actions: ['codedeploy:GetApplicationRevision', 'codedeploy:RegisterApplicationRevision'],
    }));

    options.role.addToPolicy(new iam.PolicyStatement({
      resources: [this.deploymentGroup.deploymentGroupArn],
      actions: ['codedeploy:CreateDeployment', 'codedeploy:GetDeployment'],
    }));

    options.role.addToPolicy(new iam.PolicyStatement({
      resources: [this.deploymentGroup.deploymentConfig.deploymentConfigArn],
      actions: ['codedeploy:GetDeploymentConfig'],
    }));

    // grant the ASG Role permissions to read from the Pipeline Bucket
    for (const asg of this.deploymentGroup.autoScalingGroups || []) {
      options.bucket.grantRead(asg);
    }

    // the Action's Role needs to read from the Bucket to get artifacts
    options.bucket.grantRead(options.role);

    return {
      configuration: {
        ApplicationName: this.deploymentGroup.application.applicationName,
        DeploymentGroupName: this.deploymentGroup.deploymentGroupName,
      },
    };
  }
}
