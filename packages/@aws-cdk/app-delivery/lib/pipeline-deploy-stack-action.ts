import * as cfn from '@aws-cdk/aws-cloudformation';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as cpactions from '@aws-cdk/aws-codepipeline-actions';
import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';

export interface PipelineDeployStackActionProps {
  /**
   * The CDK stack to be deployed.
   */
  readonly stack: cdk.Stack;

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
   * @default [AnonymousIAM, AutoExpand], unless `adminPermissions` is true
   */
  readonly capabilities?: cfn.CloudFormationCapabilities[];

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

  // tslint:disable:max-line-length Because of long URLs in documentation
  /**
   * Input artifact to use for template parameters values and stack policy.
   *
   * The template configuration file should contain a JSON object that should look like this:
   * `{ "Parameters": {...}, "Tags": {...}, "StackPolicy": {... }}`. For more information,
   * see [AWS CloudFormation Artifacts](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/continuous-delivery-codepipeline-cfn-artifacts.html).
   *
   * Note that if you include sensitive information, such as passwords, restrict access to this
   * file.
   *
   * @default No template configuration based on input artifacts
   */
  readonly templateConfiguration?: codepipeline.ArtifactPath;

  /**
   * Additional template parameters.
   *
   * Template parameters specified here take precedence over template parameters
   * found in the artifact specified by the `templateConfiguration` property.
   *
   * We recommend that you use the template configuration file to specify
   * most of your parameter values. Use parameter overrides to specify only
   * dynamic parameter values (values that are unknown until you run the
   * pipeline).
   *
   * All parameter names must be present in the stack template.
   *
   * Note: the entire object cannot be more than 1kB.
   *
   * @default No overrides
   */
  readonly parameterOverrides?: { [name: string]: any };

  /**
   * The list of additional input Artifacts for this Action.
   * This is especially useful when used in conjunction with the `parameterOverrides` property.
   * For example, if you have:
   *
   *   parameterOverrides: {
   *     'Param1': action1.outputArtifact.bucketName,
   *     'Param2': action2.outputArtifact.objectKey,
   *   }
   *
   * , if the output Artifacts of `action1` and `action2` were not used to
   * set either the `templateConfiguration` or the `templatePath` properties,
   * you need to make sure to include them in the `extraInputs` -
   * otherwise, you'll get an "unrecognized Artifact" error during your Pipeline's execution.
   */
  readonly extraInputs?: codepipeline.Artifact[];
}

/**
 * A class to deploy a stack that is part of a CDK App, using CodePipeline.
 * This composite Action takes care of preparing and executing a CloudFormation ChangeSet.
 *
 * It currently does *not* support stacks that make use of ``Asset``s, and
 * requires the deployed stack is in the same account and region where the
 * CodePipeline is hosted.
 */
export class PipelineDeployStackAction implements codepipeline.IAction {
  /**
   * The role used by CloudFormation for the deploy action
   */
  private _deploymentRole?: iam.IRole;

  private readonly stack: cdk.Stack;
  private readonly prepareChangeSetAction: cpactions.CloudFormationCreateReplaceChangeSetAction;
  private readonly executeChangeSetAction: cpactions.CloudFormationExecuteChangeSetAction;

  constructor(props: PipelineDeployStackActionProps) {
    this.stack = props.stack;
    const assets = this.stack.node.metadata.filter(md => md.type === cxapi.ASSET_METADATA);
    if (assets.length > 0) {
      // FIXME: Implement the necessary actions to publish assets
      throw new Error(`Cannot deploy the stack ${this.stack.stackName} because it references ${assets.length} asset(s)`);
    }

    const createChangeSetRunOrder = props.createChangeSetRunOrder || 1;
    const executeChangeSetRunOrder = props.executeChangeSetRunOrder || (createChangeSetRunOrder + 1);
    if (createChangeSetRunOrder >= executeChangeSetRunOrder) {
      throw new Error(`createChangeSetRunOrder (${createChangeSetRunOrder}) must be < executeChangeSetRunOrder (${executeChangeSetRunOrder})`);
    }

    const changeSetName = props.changeSetName || 'CDK-CodePipeline-ChangeSet';
    const capabilities = cfnCapabilities(props.adminPermissions, props.capabilities);
    this.prepareChangeSetAction = new cpactions.CloudFormationCreateReplaceChangeSetAction({
      actionName: 'ChangeSet',
      changeSetName,
      runOrder: createChangeSetRunOrder,
      stackName: props.stack.stackName,
      templatePath: props.input.atPath(props.stack.templateFile),
      adminPermissions: props.adminPermissions,
      deploymentRole: props.role,
      capabilities,
      templateConfiguration: props.templateConfiguration,
      parameterOverrides: props.parameterOverrides,
      extraInputs: props.extraInputs,
    });
    this.executeChangeSetAction = new cpactions.CloudFormationExecuteChangeSetAction({
      actionName: 'Execute',
      changeSetName,
      runOrder: executeChangeSetRunOrder,
      stackName: this.stack.stackName,
    });
  }

  public bind(scope: cdk.Construct, stage: codepipeline.IStage, options: codepipeline.ActionBindOptions):
      codepipeline.ActionConfig {
    if (this.stack.environment !== cdk.Stack.of(scope).environment) {
      // FIXME: Add the necessary to extend to stacks in a different account
      throw new Error(`Cross-environment deployment is not supported`);
    }

    stage.addAction(this.prepareChangeSetAction);
    this._deploymentRole = this.prepareChangeSetAction.deploymentRole;

    return this.executeChangeSetAction.bind(scope, stage, options);
  }

  public get deploymentRole(): iam.IRole {
    if (!this._deploymentRole) {
      throw new Error(`Use this action in a pipeline first before accessing 'deploymentRole'`);
    }

    return this._deploymentRole;
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

  public onStateChange(name: string, target?: events.IRuleTarget, options?: events.RuleProps): events.Rule {
    return this.executeChangeSetAction.onStateChange(name, target, options);
  }

  public get actionProperties(): codepipeline.ActionProperties {
    return this.executeChangeSetAction.actionProperties;
  }
}

function cfnCapabilities(adminPermissions: boolean, capabilities?: cfn.CloudFormationCapabilities[]): cfn.CloudFormationCapabilities[] {
  if (adminPermissions && capabilities === undefined) {
    // admin true default capability to NamedIAM and AutoExpand
    return [cfn.CloudFormationCapabilities.NAMED_IAM, cfn.CloudFormationCapabilities.AUTO_EXPAND];
  } else if (capabilities === undefined) {
    // else capabilities are undefined set AnonymousIAM and AutoExpand
    return [cfn.CloudFormationCapabilities.ANONYMOUS_IAM, cfn.CloudFormationCapabilities.AUTO_EXPAND];
  } else {
    // else capabilities are defined use them
    return capabilities;
  }
}
