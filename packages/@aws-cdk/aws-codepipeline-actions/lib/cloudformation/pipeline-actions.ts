import cloudformation = require('@aws-cdk/aws-cloudformation');
import { CloudFormationCapabilities } from '@aws-cdk/aws-cloudformation';
import codepipeline = require('@aws-cdk/aws-codepipeline');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { Stack } from '@aws-cdk/cdk';

/**
 * Properties common to all CloudFormation actions
 */
export interface CloudFormationActionProps extends codepipeline.CommonActionProps {
  /**
   * The name of the stack to apply this action to
   */
  readonly stackName: string;

  /**
   * A name for the filename in the output artifact to store the AWS CloudFormation call's result.
   *
   * The file will contain the result of the call to AWS CloudFormation (for example
   * the call to UpdateStack or CreateChangeSet).
   *
   * AWS CodePipeline adds the file to the output artifact after performing
   * the specified action.
   *
   * @default No output artifact generated
   */
  readonly outputFileName?: string;

  /**
   * The name of the output artifact to generate
   *
   * Only applied if `outputFileName` is set as well.
   *
   * @default Automatically generated artifact name.
   */
  readonly output?: codepipeline.Artifact;

  /**
   * The AWS region the given Action resides in.
   * Note that a cross-region Pipeline requires replication buckets to function correctly.
   * You can provide their names with the {@link PipelineProps#crossRegionReplicationBuckets} property.
   * If you don't, the CodePipeline Construct will create new Stacks in your CDK app containing those buckets,
   * that you will need to `cdk deploy` before deploying the main, Pipeline-containing Stack.
   *
   * @default the Action resides in the same region as the Pipeline
   */
  readonly region?: string;

  /**
   * The service role that is assumed during execution of action.
   * This role is not mandatory, however more advanced configuration
   * may require specifying it.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions.html
   */
  readonly role?: iam.IRole;
}

/**
 * Base class for Actions that execute CloudFormation
 */
export abstract class CloudFormationAction extends codepipeline.Action {
  constructor(props: CloudFormationActionProps, configuration?: any) {
    super({
      ...props,
      region: props.region,
      artifactBounds: {
        minInputs: 0,
        maxInputs: 10,
        minOutputs: 0,
        maxOutputs: 1,
      },
      outputs: props.outputFileName
        ? [props.output || new codepipeline.Artifact(`${props.actionName}_${props.stackName}_Artifact`)]
        : undefined,
      provider: 'CloudFormation',
      category: codepipeline.ActionCategory.Deploy,
      configuration: {
        StackName: props.stackName,
        OutputFileName: props.outputFileName,
        ...configuration,
      }
    });
  }
}

/**
 * Properties for the CloudFormationExecuteChangeSetAction.
 */
export interface CloudFormationExecuteChangeSetActionProps extends CloudFormationActionProps {
  /**
   * Name of the change set to execute.
   */
  readonly changeSetName: string;
}

/**
 * CodePipeline action to execute a prepared change set.
 */
export class CloudFormationExecuteChangeSetAction extends CloudFormationAction {
  private readonly props: CloudFormationExecuteChangeSetActionProps;

  constructor(props: CloudFormationExecuteChangeSetActionProps) {
    super(props, {
      ActionMode: 'CHANGE_SET_EXECUTE',
      ChangeSetName: props.changeSetName,
    });

    this.props = props;
  }

  protected bind(info: codepipeline.ActionBind): void {
    SingletonPolicy.forRole(info.role).grantExecuteChangeSet(this.props);
  }
}

// tslint:disable:max-line-length Because of long URLs in documentation
/**
 * Properties common to CloudFormation actions that stage deployments
 */
export interface CloudFormationDeployActionProps extends CloudFormationActionProps {
  /**
   * IAM role to assume when deploying changes.
   *
   * If not specified, a fresh role is created. The role is created with zero
   * permissions unless `adminPermissions` is true, in which case the role will have
   * full permissions.
   *
   * @default A fresh role with full or no permissions (depending on the value of `adminPermissions`).
   */
  readonly deploymentRole?: iam.IRole;

  /**
   * Acknowledge certain changes made as part of deployment
   *
   * For stacks that contain certain resources, explicit acknowledgement that AWS CloudFormation
   * might create or update those resources. For example, you must specify `AnonymousIAM` or `NamedIAM`
   * if your stack template contains AWS Identity and Access Management (IAM) resources. For more
   * information see the link below.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-iam-template.html#using-iam-capabilities
   * @default None, unless `adminPermissions` is true
   */
  readonly capabilities?: cloudformation.CloudFormationCapabilities[];

  /**
   * Whether to grant full permissions to CloudFormation while deploying this template.
   *
   * Setting this to `true` affects the defaults for `role` and `capabilities`, if you
   * don't specify any alternatives.
   *
   * The default role that will be created for you will have full (i.e., `*`)
   * permissions on all resources, and the deployment will have named IAM
   * capabilities (i.e., able to create all IAM resources).
   *
   * This is a shorthand that you can use if you fully trust the templates that
   * are deployed in this pipeline. If you want more fine-grained permissions,
   * use `addToRolePolicy` and `capabilities` to control what the CloudFormation
   * deployment is allowed to do.
   */
  readonly adminPermissions: boolean;

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
// tslint:enable:max-line-length

/**
 * Base class for all CloudFormation actions that execute or stage deployments.
 */
export abstract class CloudFormationDeployAction extends CloudFormationAction {
  private _deploymentRole?: iam.IRole;
  private readonly props: CloudFormationDeployActionProps;

  constructor(props: CloudFormationDeployActionProps, configuration: any) {
    const capabilities = props.adminPermissions && props.capabilities === undefined
      ? [cloudformation.CloudFormationCapabilities.NamedIAM]
      : props.capabilities;
    super(props, {
      ...configuration,
      // None evaluates to empty string which is falsey and results in undefined
      Capabilities: parseCapabilities(capabilities),
      RoleArn: cdk.Lazy.stringValue({ produce: () => this.deploymentRole.roleArn }),
      ParameterOverrides: cdk.Lazy.stringValue({ produce: () => Stack.of(this.scope).toJsonString(props.parameterOverrides) }),
      TemplateConfiguration: props.templateConfiguration ? props.templateConfiguration.location : undefined,
      StackName: props.stackName,
    });

    this.props = props;

    for (const inputArtifact of props.extraInputs || []) {
      this.addInputArtifact(inputArtifact);
    }
  }

  /**
   * Add statement to the service role assumed by CloudFormation while executing this action.
   */
  public addToDeploymentRolePolicy(statement: iam.PolicyStatement) {
    return this.getDeploymentRole('method addToRolePolicy()').addToPolicy(statement);
  }

  public get deploymentRole(): iam.IRole {
    return this.getDeploymentRole('property role()');
  }

  protected bind(info: codepipeline.ActionBind): void {
    if (this.props.deploymentRole) {
      this._deploymentRole = this.props.deploymentRole;
    } else {
      this._deploymentRole = new iam.Role(info.scope, 'Role', {
        assumedBy: new iam.ServicePrincipal('cloudformation.amazonaws.com')
      });

      if (this.props.adminPermissions) {
        this._deploymentRole.addToPolicy(new iam.PolicyStatement().addAction('*').addAllResources());
      }
    }

    SingletonPolicy.forRole(info.role).grantPassRole(this._deploymentRole);
  }

  private getDeploymentRole(member: string): iam.IRole {
    if (this._deploymentRole) {
      return this._deploymentRole;
    } else {
      throw new Error(`Cannot use the ${member} before the Action has been added to a Pipeline`);
    }
  }
}

/**
 * Properties for the CloudFormationCreateReplaceChangeSetAction.
 */
export interface CloudFormationCreateReplaceChangeSetActionProps extends CloudFormationDeployActionProps {
  /**
   * Name of the change set to create or update.
   */
  readonly changeSetName: string;

  /**
   * Input artifact with the ChangeSet's CloudFormation template
   */
  readonly templatePath: codepipeline.ArtifactPath;
}

/**
 * CodePipeline action to prepare a change set.
 *
 * Creates the change set if it doesn't exist based on the stack name and template that you submit.
 * If the change set exists, AWS CloudFormation deletes it, and then creates a new one.
 */
export class CloudFormationCreateReplaceChangeSetAction extends CloudFormationDeployAction {
  private readonly props2: CloudFormationCreateReplaceChangeSetActionProps;

  constructor(props: CloudFormationCreateReplaceChangeSetActionProps) {
    super(props, {
      ActionMode: 'CHANGE_SET_REPLACE',
      ChangeSetName: props.changeSetName,
      TemplatePath: props.templatePath.location,
    });

    this.addInputArtifact(props.templatePath.artifact);
    if (props.templateConfiguration) {
      this.addInputArtifact(props.templateConfiguration.artifact);
    }

    this.props2 = props;
  }

  protected bind(info: codepipeline.ActionBind): void {
    super.bind(info);

    SingletonPolicy.forRole(info.role).grantCreateReplaceChangeSet(this.props2);
  }
}

/**
 * Properties for the CloudFormationCreateUpdateStackAction.
 */
export interface CloudFormationCreateUpdateStackActionProps extends CloudFormationDeployActionProps {
  /**
   * Input artifact with the CloudFormation template to deploy
   */
  readonly templatePath: codepipeline.ArtifactPath;

  /**
   * Replace the stack if it's in a failed state.
   *
   * If this is set to true and the stack is in a failed state (one of
   * ROLLBACK_COMPLETE, ROLLBACK_FAILED, CREATE_FAILED, DELETE_FAILED, or
   * UPDATE_ROLLBACK_FAILED), AWS CloudFormation deletes the stack and then
   * creates a new stack.
   *
   * If this is not set to true and the stack is in a failed state,
   * the deployment fails.
   *
   * @default false
   */
  readonly replaceOnFailure?: boolean;
}

/**
 * CodePipeline action to deploy a stack.
 *
 * Creates the stack if the specified stack doesn't exist. If the stack exists,
 * AWS CloudFormation updates the stack. Use this action to update existing
 * stacks.
 *
 * AWS CodePipeline won't replace the stack, and will fail deployment if the
 * stack is in a failed state. Use `ReplaceOnFailure` for an action that
 * will delete and recreate the stack to try and recover from failed states.
 *
 * Use this action to automatically replace failed stacks without recovering or
 * troubleshooting them. You would typically choose this mode for testing.
 */
export class CloudFormationCreateUpdateStackAction extends CloudFormationDeployAction {
  private readonly props2: CloudFormationCreateUpdateStackActionProps;

  constructor(props: CloudFormationCreateUpdateStackActionProps) {
    super(props, {
      ActionMode: props.replaceOnFailure ? 'REPLACE_ON_FAILURE' : 'CREATE_UPDATE',
      TemplatePath: props.templatePath.location
    });

    this.addInputArtifact(props.templatePath.artifact);
    if (props.templateConfiguration) {
      this.addInputArtifact(props.templateConfiguration.artifact);
    }

    this.props2 = props;
  }

  protected bind(info: codepipeline.ActionBind): void {
    super.bind(info);

    SingletonPolicy.forRole(info.role).grantCreateUpdateStack(this.props2);
  }
}

/**
 * Properties for the CloudFormationDeleteStackAction.
 */
// tslint:disable-next-line:no-empty-interface
export interface CloudFormationDeleteStackActionProps extends CloudFormationDeployActionProps {
}

/**
 * CodePipeline action to delete a stack.
 *
 * Deletes a stack. If you specify a stack that doesn't exist, the action completes successfully
 * without deleting a stack.
 */
export class CloudFormationDeleteStackAction extends CloudFormationDeployAction {
  private readonly props2: CloudFormationDeleteStackActionProps;

  constructor(props: CloudFormationDeleteStackActionProps) {
    super(props, {
      ActionMode: 'DELETE_ONLY',
    });

    this.props2 = props;
  }

  protected bind(info: codepipeline.ActionBind): void {
    super.bind(info);

    SingletonPolicy.forRole(info.role).grantDeleteStack(this.props2);
  }
}

/**
 * Manages a bunch of singleton-y statements on the policy of an IAM Role.
 * Dedicated methods can be used to add specific permissions to the role policy
 * using as few statements as possible (adding resources to existing compatible
 * statements instead of adding new statements whenever possible).
 *
 * Statements created outside of this class are not considered when adding new
 * permissions.
 */
class SingletonPolicy extends cdk.Construct {
  /**
   * Obtain a SingletonPolicy for a given role.
   * @param role the Role this policy is bound to.
   * @returns the SingletonPolicy for this role.
   */
  public static forRole(role: iam.IRole): SingletonPolicy {
    const found = role.node.tryFindChild(SingletonPolicy.UUID);
    return (found as SingletonPolicy) || new SingletonPolicy(role);
  }

  private static readonly UUID = '8389e75f-0810-4838-bf64-d6f85a95cf83';

  private statements: { [key: string]: iam.PolicyStatement } = {};

  private constructor(private readonly role: iam.IRole) {
    super(role as unknown as cdk.Construct, SingletonPolicy.UUID);
  }

  public grantExecuteChangeSet(props: { stackName: string, changeSetName: string, region?: string }): void {
    this.statementFor({
      actions: ['cloudformation:ExecuteChangeSet'],
      conditions: { StringEquals: { 'cloudformation:ChangeSetName': props.changeSetName } },
    }).addResource(this.stackArnFromProps(props));
  }

  public grantCreateReplaceChangeSet(props: { stackName: string, changeSetName: string, region?: string }): void {
    this.statementFor({
      actions: [
        'cloudformation:CreateChangeSet',
        'cloudformation:DeleteChangeSet',
        'cloudformation:DescribeChangeSet',
        'cloudformation:DescribeStacks',
      ],
      conditions: { StringEqualsIfExists: { 'cloudformation:ChangeSetName': props.changeSetName } },
    }).addResource(this.stackArnFromProps(props));
  }

  public grantCreateUpdateStack(props: { stackName: string, replaceOnFailure?: boolean, region?: string }): void {
    const actions = [
      'cloudformation:DescribeStack*',
      'cloudformation:CreateStack',
      'cloudformation:UpdateStack',
      'cloudformation:GetTemplate*',
      'cloudformation:ValidateTemplate',
      'cloudformation:GetStackPolicy',
      'cloudformation:SetStackPolicy',
    ];
    if (props.replaceOnFailure) {
      actions.push('cloudformation:DeleteStack');
    }
    this.statementFor({ actions }).addResource(this.stackArnFromProps(props));
  }

  public grantDeleteStack(props: { stackName: string, region?: string }): void {
    this.statementFor({
      actions: [
        'cloudformation:DescribeStack*',
        'cloudformation:DeleteStack',
      ]
    }).addResource(this.stackArnFromProps(props));
  }

  public grantPassRole(role: iam.IRole): void {
    this.statementFor({ actions: ['iam:PassRole'] }).addResource(role.roleArn);
  }

  private statementFor(template: StatementTemplate): iam.PolicyStatement {
    const key = keyFor(template);
    if (!(key in this.statements)) {
      this.statements[key] = new iam.PolicyStatement().addActions(...template.actions);
      if (template.conditions) {
        this.statements[key].addConditions(template.conditions);
      }
      this.role.addToPolicy(this.statements[key]);
    }
    return this.statements[key];

    function keyFor(props: StatementTemplate): string {
      const actions = `${props.actions.sort().join('\x1F')}`;
      const conditions = formatConditions(props.conditions);
      return `${actions}\x1D${conditions}`;

      function formatConditions(cond?: StatementCondition): string {
        if (cond == null) { return ''; }
        let result = '';
        for (const op of Object.keys(cond).sort()) {
          result += `${op}\x1E`;
          const condition = cond[op];
          for (const attribute of Object.keys(condition).sort()) {
            const value = condition[attribute];
            result += `${value}\x1F`;
          }
        }
        return result;
      }
    }
  }

  private stackArnFromProps(props: { stackName: string, region?: string }): string {
    return Stack.of(this).formatArn({
      region: props.region,
      service: 'cloudformation',
      resource: 'stack',
      resourceName: `${props.stackName}/*`
    });
  }
}

interface StatementTemplate {
  actions: string[];
  conditions?: StatementCondition;
}

type StatementCondition = { [op: string]: { [attribute: string]: string } };

function parseCapabilities(capabilities: CloudFormationCapabilities[] | undefined): string | undefined {
  if (capabilities === undefined) {
    return undefined;
  } else if (capabilities.length === 1) {
    const capability = capabilities.toString();
    return (capability === '') ? undefined : capability;
  } else if (capabilities.length > 1) {
    return capabilities.join(',');
  }

  return undefined;
}