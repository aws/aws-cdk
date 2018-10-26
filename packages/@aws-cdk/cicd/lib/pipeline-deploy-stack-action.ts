
import cfn = require('@aws-cdk/aws-cloudformation');
import api = require('@aws-cdk/aws-codepipeline-api');
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
  stage: api.IStage;
  /**
   * The name to use when creating a ChangeSet for the stack.
   */
  changeSetName: string;
  /**
   * The CodePipeline artifact that holds the synthesized app.
   */
  inputArtifact: api.Artifact;

  /**
   * The runOrder for the CodePipeline action creating the ChangeSet.
   * @default 1
   */
  createChangeSetRunOrder?: number;
  /**
   * The runOrder for the CodePipeline action executing the ChangeSet.
   * @default ``createChangeSetRunOrder + 1``
   */
  executeChangeSetRunOrder?: number;
}

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
      throw new Error(`createChangeSetRunOrder must be < executeChangeSetRunOrder`);
    }

    this.stack = props.stack;

    new cfn.PipelineCreateReplaceChangeSetAction(this, 'ChangeSet', {
      changeSetName: props.changeSetName,
      runOrder: createChangeSetRunOrder,
      stackName: props.stack.name,
      stage: props.stage,
      templatePath: props.inputArtifact.atPath(`${props.stack.name}.template.yaml`),
    });

    new cfn.PipelineExecuteChangeSetAction(this, 'Execute', {
      changeSetName: props.changeSetName,
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
