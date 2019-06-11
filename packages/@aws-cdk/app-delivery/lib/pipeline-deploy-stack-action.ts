import cfn = require('@aws-cdk/aws-cloudformation');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import cpactions = require('@aws-cdk/aws-codepipeline-actions');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import cxapi = require('@aws-cdk/cx-api');

export interface PipelineDeployStackActionProps {
  /**
   * The CDK stack to be deployed.
   */
  readonly stack: cdk.Stack;

  /**
   * The CodePipeline stage in which to perform the deployment.
   */
  readonly stage: codepipeline.IStage;

  /**
   * The CodePipeline artifact that holds the synthesized app, which is the
   * contents of the ``<directory>`` when running ``cdk synth -o <directory>``.
   */
  readonly input: codepipeline.Artifact;

  /**
   * The name to use when creating a ChangeSet for the stack.
   *
   * @default CDK-CodePipeline-ChangeSet
   */
  readonly changeSetName?: string;

  /**
   * The runOrder for the CodePipeline action creating the ChangeSet.
   *
   * @default 1
   */
  readonly createChangeSetRunOrder?: number;

  /**
   * The runOrder for the CodePipeline action executing the ChangeSet.
   *
   * @default ``createChangeSetRunOrder + 1``
   */
  readonly executeChangeSetRunOrder?: number;

  /**
   * IAM role to assume when deploying changes.
   *
   * If not specified, a fresh role is created. The role is created with zero
   * permissions unless `adminPermissions` is true, in which case the role will have
   * admin permissions.
   *
   * @default A fresh role with admin or no permissions (depending on the value of `adminPermissions`).
   */
  readonly role?: iam.IRole;

  /**
   * Acknowledge certain changes made as part of deployment
   *
   * For stacks that contain certain resources, explicit acknowledgement that AWS CloudFormation
   * might create or update those resources. For example, you must specify AnonymousIAM if your
   * stack template contains AWS Identity and Access Management (IAM) resources. For more
   * information
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-iam-template.html#using-iam-capabilities
   * @default AnonymousIAM, unless `adminPermissions` is true
   */
  readonly capabilities?: cfn.CloudFormationCapabilities;

  /**
   * Whether to grant admin permissions to CloudFormation while deploying this template.
   *
   * Setting this to `true` affects the defaults for `role` and `capabilities`, if you
   * don't specify any alternatives.
   *
   * The default role that will be created for you will have admin (i.e., `*`)
   * permissions on all resources, and the deployment will have named IAM
   * capabilities (i.e., able to create all IAM resources).
   *
   * This is a shorthand that you can use if you fully trust the templates that
   * are deployed in this pipeline. If you want more fine-grained permissions,
   * use `addToRolePolicy` and `capabilities` to control what the CloudFormation
   * deployment is allowed to do.
   */
  readonly adminPermissions: boolean;
}

/**
 * A Construct to deploy a stack that is part of a CDK App, using CodePipeline.
 * This composite Action takes care of preparing and executing a CloudFormation ChangeSet.
 *
 * It currently does *not* support stacks that make use of ``Asset``s, and
 * requires the deployed stack is in the same account and region where the
 * CodePipeline is hosted.
 */
export class PipelineDeployStackAction extends cdk.Construct {

  /**
   * The role used by CloudFormation for the deploy action
   */
  public readonly deploymentRole: iam.IRole;

  private readonly stack: cdk.Stack;

  constructor(scope: cdk.Construct, id: string, props: PipelineDeployStackActionProps) {
    super(scope, id);

    if (props.stack.environment !== cdk.Stack.of(this).environment) {
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

    const capabilities = cfnCapabilities(props.adminPermissions, props.capabilities);
    const changeSetAction = new cpactions.CloudFormationCreateReplaceChangeSetAction({
      actionName: 'ChangeSet',
      changeSetName,
      runOrder: createChangeSetRunOrder,
      stackName: props.stack.stackName,
      templatePath: props.input.atPath(`${props.stack.stackName}.template.yaml`),
      adminPermissions: props.adminPermissions,
      deploymentRole: props.role,
      capabilities,
    });
    props.stage.addAction(changeSetAction);
    props.stage.addAction(new cpactions.CloudFormationExecuteChangeSetAction({
      actionName: 'Execute',
      changeSetName,
      runOrder: executeChangeSetRunOrder,
      stackName: props.stack.stackName,
    }));

    this.deploymentRole = changeSetAction.deploymentRole;
  }

  /**
   * Add policy statements to the role deploying the stack.
   *
   * This role is passed to CloudFormation and must have the IAM permissions
   * necessary to deploy the stack or you can grant this role `adminPermissions`
   * by using that option during creation. If you do not grant
   * `adminPermissions` you need to identify the proper statements to add to
   * this role based on the CloudFormation Resources in your stack.
   */
  public addToDeploymentRolePolicy(statement: iam.PolicyStatement) {
    this.deploymentRole.addToPolicy(statement);
  }

  protected validate(): string[] {
    const result = super.validate();
    const assets = this.stack.node.metadata.filter(md => md.type === cxapi.ASSET_METADATA);
    if (assets.length > 0) {
      // FIXME: Implement the necessary actions to publish assets
      result.push(`Cannot deploy the stack ${this.stack.stackName} because it references ${assets.length} asset(s)`);
    }
    return result;
  }
}

function cfnCapabilities(adminPermissions: boolean, capabilities?: cfn.CloudFormationCapabilities): cfn.CloudFormationCapabilities {
  if (adminPermissions && capabilities === undefined) {
    // admin true default capability to NamedIAM
    return cfn.CloudFormationCapabilities.NamedIAM;
  } else if (capabilities === undefined) {
    // else capabilities are undefined set AnonymousIAM
    return cfn.CloudFormationCapabilities.AnonymousIAM;
  } else {
    // else capabilities are defined use them
    return capabilities;
  }
}
