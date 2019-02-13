import codepipeline  = require('@aws-cdk/aws-codepipeline-api');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');

/**
 * Properties common to all CloudFormation actions
 */
export interface PipelineCloudFormationActionProps extends codepipeline.CommonActionProps {
  /**
   * The name of the stack to apply this action to
   */
  stackName: string;

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
  outputFileName?: string;

  /**
   * The name of the output artifact to generate
   *
   * Only applied if `outputFileName` is set as well.
   *
   * @default Automatically generated artifact name.
   */
  outputArtifactName?: string;

  /**
   * The AWS region the given Action resides in.
   * Note that a cross-region Pipeline requires replication buckets to function correctly.
   * You can provide their names with the {@link PipelineProps#crossRegionReplicationBuckets} property.
   * If you don't, the CodePipeline Construct will create new Stacks in your CDK app containing those buckets,
   * that you will need to `cdk deploy` before deploying the main, Pipeline-containing Stack.
   *
   * @default the Action resides in the same region as the Pipeline
   */
  region?: string;

  /**
   * The service role that is assumed during execution of action.
   * This role is not mandatory, however more advanced configuration
   * may require specifying it.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codepipeline-pipeline-stages-actions.html
   */
  role?: iam.IRole;
}

/**
 * Base class for Actions that execute CloudFormation
 */
export abstract class PipelineCloudFormationAction extends codepipeline.Action {
  /**
   * Output artifact containing the CloudFormation call response
   *
   * Only present if configured by passing `outputFileName`.
   */
  public outputArtifact?: codepipeline.Artifact;

  constructor(props: PipelineCloudFormationActionProps, configuration?: any) {
    super({
      ...props,
      region: props.region,
      artifactBounds: {
        minInputs: 0,
        maxInputs: 10,
        minOutputs: 0,
        maxOutputs: 1,
      },
      provider: 'CloudFormation',
      category: codepipeline.ActionCategory.Deploy,
      configuration: {
        StackName: props.stackName,
        OutputFileName: props.outputFileName,
        ...configuration,
      }
    });

    if (props.outputFileName) {
      this.outputArtifact = this.addOutputArtifact(props.outputArtifactName ||
        (`${props.actionName}_${props.stackName}_Artifact`));
    }
  }
}

/**
 * Properties for the PipelineExecuteChangeSetAction.
 */
export interface PipelineExecuteChangeSetActionProps extends PipelineCloudFormationActionProps {
  /**
   * Name of the change set to execute.
   */
  changeSetName: string;
}

/**
 * CodePipeline action to execute a prepared change set.
 */
export class PipelineExecuteChangeSetAction extends PipelineCloudFormationAction {
  private readonly props: PipelineExecuteChangeSetActionProps;

  constructor(props: PipelineExecuteChangeSetActionProps) {
    super(props, {
      ActionMode: 'CHANGE_SET_EXECUTE',
      ChangeSetName: props.changeSetName,
    });

    this.props = props;
  }

  protected bind(stage: codepipeline.IStage, _scope: cdk.Construct): void {
    SingletonPolicy.forRole(stage.pipeline.role)
      .grantExecuteChangeSet(this.props);
  }
}

// tslint:disable:max-line-length Because of long URLs in documentation
/**
 * Properties common to CloudFormation actions that stage deployments
 */
export interface PipelineCloudFormationDeployActionProps extends PipelineCloudFormationActionProps {
  /**
   * IAM role to assume when deploying changes.
   *
   * If not specified, a fresh role is created. The role is created with zero
   * permissions unless `adminPermissions` is true, in which case the role will have
   * full permissions.
   *
   * @default A fresh role with full or no permissions (depending on the value of `adminPermissions`).
   */
  deploymentRole?: iam.IRole;

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
  capabilities?: CloudFormationCapabilities;

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
  adminPermissions: boolean;

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
  templateConfiguration?: codepipeline.ArtifactPath;

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
  parameterOverrides?: { [name: string]: any };
}
// tslint:enable:max-line-length

/**
 * Base class for all CloudFormation actions that execute or stage deployments.
 */
export abstract class PipelineCloudFormationDeployAction extends PipelineCloudFormationAction {
  private _deploymentRole?: iam.IRole;
  private readonly props: PipelineCloudFormationDeployActionProps;

  constructor(props: PipelineCloudFormationDeployActionProps, configuration: any) {
    const capabilities = props.adminPermissions && props.capabilities === undefined ? CloudFormationCapabilities.NamedIAM : props.capabilities;
    super(props, {
      ...configuration,
      // None evaluates to empty string which is falsey and results in undefined
      Capabilities: (capabilities && capabilities.toString()) || undefined,
      RoleArn: new cdk.Token(() => this.deploymentRole.roleArn),
      ParameterOverrides: new cdk.Token(() => this.scope.node.stringifyJson(props.parameterOverrides)),
      TemplateConfiguration: props.templateConfiguration ? props.templateConfiguration.location : undefined,
      StackName: props.stackName,
    });

    this.props = props;
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

  protected bind(stage: codepipeline.IStage, scope: cdk.Construct): void {
    if (this.props.deploymentRole) {
      this._deploymentRole = this.props.deploymentRole;
    } else {
      this._deploymentRole = new iam.Role(scope, 'Role', {
        assumedBy: new iam.ServicePrincipal('cloudformation.amazonaws.com')
      });

      if (this.props.adminPermissions) {
        this._deploymentRole.addToPolicy(new iam.PolicyStatement().addAction('*').addAllResources());
      }
    }

    SingletonPolicy.forRole(stage.pipeline.role).grantPassRole(this._deploymentRole);
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
 * Properties for the PipelineCreateReplaceChangeSetAction.
 */
export interface PipelineCreateReplaceChangeSetActionProps extends PipelineCloudFormationDeployActionProps {
  /**
   * Name of the change set to create or update.
   */
  changeSetName: string;

  /**
   * Input artifact with the ChangeSet's CloudFormation template
   */
  templatePath: codepipeline.ArtifactPath;
}

/**
 * CodePipeline action to prepare a change set.
 *
 * Creates the change set if it doesn't exist based on the stack name and template that you submit.
 * If the change set exists, AWS CloudFormation deletes it, and then creates a new one.
 */
export class PipelineCreateReplaceChangeSetAction extends PipelineCloudFormationDeployAction {
  private readonly props2: PipelineCreateReplaceChangeSetActionProps;

  constructor(props: PipelineCreateReplaceChangeSetActionProps) {
    super(props, {
      ActionMode: 'CHANGE_SET_REPLACE',
      ChangeSetName: props.changeSetName,
      TemplatePath: props.templatePath.location,
    });

    this.addInputArtifact(props.templatePath.artifact);
    if (props.templateConfiguration &&
        props.templateConfiguration.artifact.artifactName !== props.templatePath.artifact.artifactName) {
      this.addInputArtifact(props.templateConfiguration.artifact);
    }

    this.props2 = props;
  }

  protected bind(stage: codepipeline.IStage, scope: cdk.Construct): void {
    super.bind(stage, scope);

    SingletonPolicy.forRole(stage.pipeline.role).grantCreateReplaceChangeSet(this.props2);
  }
}

/**
 * Properties for the PipelineCreateUpdateStackAction.
 */
export interface PipelineCreateUpdateStackActionProps extends PipelineCloudFormationDeployActionProps {
  /**
   * Input artifact with the CloudFormation template to deploy
   */
  templatePath: codepipeline.ArtifactPath;

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
  replaceOnFailure?: boolean;
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
export class PipelineCreateUpdateStackAction extends PipelineCloudFormationDeployAction {
  private readonly props2: PipelineCreateUpdateStackActionProps;

  constructor(props: PipelineCreateUpdateStackActionProps) {
    super(props, {
      ActionMode: props.replaceOnFailure ? 'REPLACE_ON_FAILURE' : 'CREATE_UPDATE',
      TemplatePath: props.templatePath.location
    });

    this.addInputArtifact(props.templatePath.artifact);
    if (props.templateConfiguration &&
        props.templateConfiguration.artifact.artifactName !== props.templatePath.artifact.artifactName) {
      this.addInputArtifact(props.templateConfiguration.artifact);
    }

    this.props2 = props;
  }

  protected bind(stage: codepipeline.IStage, scope: cdk.Construct): void {
    super.bind(stage, scope);

    SingletonPolicy.forRole(stage.pipeline.role).grantCreateUpdateStack(this.props2);
  }
}

/**
 * Properties for the PipelineDeleteStackAction.
 */
// tslint:disable-next-line:no-empty-interface
export interface PipelineDeleteStackActionProps extends PipelineCloudFormationDeployActionProps {
}

/**
 * CodePipeline action to delete a stack.
 *
 * Deletes a stack. If you specify a stack that doesn't exist, the action completes successfully
 * without deleting a stack.
 */
export class PipelineDeleteStackAction extends PipelineCloudFormationDeployAction {
  private readonly props2: PipelineDeleteStackActionProps;

  constructor(props: PipelineDeleteStackActionProps) {
    super(props, {
      ActionMode: 'DELETE_ONLY',
    });

    this.props2 = props;
  }

  protected bind(stage: codepipeline.IStage, scope: cdk.Construct): void {
    super.bind(stage, scope);

    SingletonPolicy.forRole(stage.pipeline.role).grantDeleteStack(this.props2);
  }
}

/**
 * Capabilities that affect whether CloudFormation is allowed to change IAM resources
 */
export enum CloudFormationCapabilities {
  /**
   * No IAM Capabilities
   *
   * Pass this capability if you wish to block the creation IAM resources.
   * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-iam-template.html#using-iam-capabilities
   */
  None = '',

  /**
   * Capability to create anonymous IAM resources
   *
   * Pass this capability if you're only creating anonymous resources.
   * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-iam-template.html#using-iam-capabilities
   */
  AnonymousIAM = 'CAPABILITY_IAM',

  /**
   * Capability to create named IAM resources.
   *
   * Pass this capability if you're creating IAM resources that have physical
   * names.
   *
   * `CloudFormationCapabilities.NamedIAM` implies `CloudFormationCapabilities.IAM`; you don't have to pass both.
   * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-iam-template.html#using-iam-capabilities
   */
  NamedIAM = 'CAPABILITY_NAMED_IAM',
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
  public static forRole(role: iam.Role): SingletonPolicy {
    const found = role.node.tryFindChild(SingletonPolicy.UUID);
    return (found as SingletonPolicy) || new SingletonPolicy(role);
  }

  private static readonly UUID = '8389e75f-0810-4838-bf64-d6f85a95cf83';

  private statements: { [key: string]: iam.PolicyStatement } = {};

  private constructor(private readonly role: iam.Role) {
    super(role, SingletonPolicy.UUID);
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
    return this.node.stack.formatArn({
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
