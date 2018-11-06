import codepipeline = require('@aws-cdk/aws-codepipeline-api');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { ServerDeploymentGroupRef } from './deployment-group';

/**
 * Construction properties of the {@link PipelineDeployAction CodeDeploy deploy CodePipeline Action}.
 */
export interface PipelineDeployActionProps extends codepipeline.CommonActionProps,
    codepipeline.CommonActionConstructProps {
  /**
   * The CodeDeploy Deployment Group to deploy to.
   */
  deploymentGroup: ServerDeploymentGroupRef;

  /**
   * The source to use as input for deployment.
   *
   * @default CodePipeline will use the output of the last Action from a previous Stage as input
   */
  inputArtifact?: codepipeline.Artifact;
}

export class PipelineDeployAction extends codepipeline.DeployAction {
  constructor(parent: cdk.Construct, id: string, props: PipelineDeployActionProps) {
    super(parent, id, {
      stage: props.stage,
      runOrder: props.runOrder,
      artifactBounds: { minInputs: 1, maxInputs: 1, minOutputs: 0, maxOutputs: 0 },
      provider: 'CodeDeploy',
      inputArtifact: props.inputArtifact,
      configuration: {
        ApplicationName: props.deploymentGroup.application.applicationName,
        DeploymentGroupName: props.deploymentGroup.deploymentGroupName,
      },
    });

    // permissions, based on:
    // https://docs.aws.amazon.com/codedeploy/latest/userguide/auth-and-access-control-permissions-reference.html

    props.stage.pipeline.role.addToPolicy(new iam.PolicyStatement()
      .addResource(props.deploymentGroup.application.applicationArn)
      .addActions(
        'codedeploy:GetApplicationRevision',
        'codedeploy:RegisterApplicationRevision',
      ));

    props.stage.pipeline.role.addToPolicy(new iam.PolicyStatement()
      .addResource(props.deploymentGroup.deploymentGroupArn)
      .addActions(
        'codedeploy:CreateDeployment',
        'codedeploy:GetDeployment',
      ));

    props.stage.pipeline.role.addToPolicy(new iam.PolicyStatement()
      .addResource(props.deploymentGroup.deploymentConfig.deploymentConfigArn)
      .addActions(
        'codedeploy:GetDeploymentConfig',
      ));

    // grant the ASG Role permissions to read from the Pipeline Bucket
    for (const asg of props.deploymentGroup.autoScalingGroups || []) {
      props.stage.pipeline.grantBucketRead(asg.role);
    }
  }
}
