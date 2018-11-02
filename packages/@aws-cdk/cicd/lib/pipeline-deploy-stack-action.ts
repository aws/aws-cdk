
import cfn = require('@aws-cdk/aws-cloudformation');
import codepipeline = require('@aws-cdk/aws-codepipeline-api');
import cdk = require('@aws-cdk/cdk');
import cxapi = require('@aws-cdk/cx-api');

export interface PipelineDeployStackActionProps {
  /**
   * The CDK stack to be deployed.
   */
  stack: cdk.Stack;

  /**
   * The CodePipeline stage in which to perform the deployment.
   */
  stage: codepipeline.IStage;

  /**
   * The CodePipeline artifact that holds the synthesized app, which is the
   * contents of the ``<directory>`` when running ``cdk synth -o <directory>``.
   */
  inputArtifact: codepipeline.Artifact;

  /**
   * The name to use when creating a ChangeSet for the stack.
   *
   * @default CDK-CodePipeline-ChangeSet
   */
  changeSetName?: string;

  /**
   * The runOrder for the CodePipeline action creating the ChangeSet.
   *
   * @default 1
   */
  createChangeSetRunOrder?: number;

  /**
   * The runOrder for the CodePipeline action executing the ChangeSet.
   *
   * @default ``createChangeSetRunOrder + 1``
   */
  executeChangeSetRunOrder?: number;
}

/**
 * A CodePipeline action to deploy a stack that is part of a CDK App. This
 * action takes care of preparing and executing a CloudFormation ChangeSet.
 *
 * It currently does *not* support stacks that make use of ``Asset``s, and
 * requires the deployed stack is in the same account and region where the
 * CodePipeline is hosted.
 */
export class PipelineDeployStackAction extends cdk.Construct {
  private readonly stack: cdk.Stack;

  constructor(parent: cdk.Construct, id: string, props: PipelineDeployStackActionProps) {
    super(parent, id);

    if (!cdk.environmentEquals(props.stack.env, cdk.Stack.find(this).env)) {
      // FIXME: Add the necessary to extend to stacks in a different account
      throw new Error(`Cross-environment deployment is not supported`);
    }

    const createChangeSetRunOrder = props.createChangeSetRunOrder || 1;
    const executeChangeSetRunOrder = props.executeChangeSetRunOrder || (createChangeSetRunOrder + 1);

    if (createChangeSetRunOrder >= executeChangeSetRunOrder) {
      throw new Error(`createChangeSetRunOrder (${createChangeSetRunOrder}) must be < executeChangeSetRunOrder (${executeChangeSetRunOrder})`);
    }

    this.stack = props.stack;
    const changeSetName = props.changeSetName || 'CDK-CodePipeline-ChangeSet';

    new cfn.PipelineCreateReplaceChangeSetAction(this, 'ChangeSet', {
      changeSetName,
      runOrder: createChangeSetRunOrder,
      stackName: props.stack.name,
      stage: props.stage,
      templatePath: props.inputArtifact.atPath(`${props.stack.name}.template.yaml`),
    });

    new cfn.PipelineExecuteChangeSetAction(this, 'Execute', {
      changeSetName,
      runOrder: executeChangeSetRunOrder,
      stackName: props.stack.name,
      stage: props.stage,
    });
  }

  public validate(): string[] {
    const result = super.validate();
    const assets = this.stack.metadata.filter(md => md.type === cxapi.ASSET_METADATA);
    if (assets.length > 0) {
      // FIXME: Implement the necessary actions to publish assets
      result.push(`Cannot deploy the stack ${this.stack.name} because it references ${assets.length} asset(s)`);
    }
    return result;
  }
}
