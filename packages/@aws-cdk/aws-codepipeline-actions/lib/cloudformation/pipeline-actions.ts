import * as cloudformation from '@aws-cdk/aws-cloudformation';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { parseCapabilities, SingletonPolicy } from './private/singleton-policy';
import { Action } from '../action';

/**
 * Properties common to all CloudFormation actions
 */
interface CloudFormationActionProps extends codepipeline.CommonAwsActionProps {
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
   * You can provide their names with the `PipelineProps#crossRegionReplicationBuckets` property.
   * If you don't, the CodePipeline Construct will create new Stacks in your CDK app containing those buckets,
   * that you will need to `cdk deploy` before deploying the main, Pipeline-containing Stack.
   *
   * @default the Action resides in the same region as the Pipeline
   */
  readonly region?: string;

  /**
   * The AWS account this Action is supposed to operate in.
   * **Note**: if you specify the `role` property,
   * this is ignored - the action will operate in the same region the passed role does.
   *
   * @default - action resides in the same account as the pipeline
   */
  readonly account?: string;
}

/**
 * Base class for Actions that execute CloudFormation
 */
abstract class CloudFormationAction extends Action {
  private readonly props: CloudFormationActionProps;

  constructor(props: CloudFormationActionProps, inputs: codepipeline.Artifact[] | undefined) {
    super({
      ...props,
      provider: 'CloudFormation',
      category: codepipeline.ActionCategory.DEPLOY,
      artifactBounds: {
        minInputs: 0,
        maxInputs: 10,
        minOutputs: 0,
        maxOutputs: 1,
      },
      inputs,
      outputs: props.outputFileName
        ? [props.output || new codepipeline.Artifact(`${props.actionName}_${props.stackName}_Artifact`)]
        : undefined,
    });

    this.props = props;
  }

  protected bound(_scope: Construct, _stage: codepipeline.IStage, options: codepipeline.ActionBindOptions):
  codepipeline.ActionConfig {
    const singletonPolicy = SingletonPolicy.forRole(options.role);

    if ((this.actionProperties.outputs || []).length > 0) {
      options.bucket.grantReadWrite(singletonPolicy);
    } else if ((this.actionProperties.inputs || []).length > 0) {
      options.bucket.grantRead(singletonPolicy);
    }

    return {
      configuration: {
        StackName: this.props.stackName,
        OutputFileName: this.props.outputFileName,
      },
    };
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
  private readonly props2: CloudFormationExecuteChangeSetActionProps;

  constructor(props: CloudFormationExecuteChangeSetActionProps) {
    super(props, undefined);

    this.props2 = props;
  }

  protected bound(scope: Construct, stage: codepipeline.IStage, options: codepipeline.ActionBindOptions):
  codepipeline.ActionConfig {
    SingletonPolicy.forRole(options.role).grantExecuteChangeSet(this.props2);

    const actionConfig = super.bound(scope, stage, options);
    return {
      ...actionConfig,
      configuration: {
        ...actionConfig.configuration,
        ActionMode: 'CHANGE_SET_EXECUTE',
        ChangeSetName: this.props2.changeSetName,
      },
    };
  }
}

/**
 * Properties common to CloudFormation actions that stage deployments
 */
interface CloudFormationDeployActionProps extends CloudFormationActionProps {
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
   * @deprecated use `cfnCapabilities` instead
   */
  readonly capabilities?: cloudformation.CloudFormationCapabilities[];

  /**
   * Acknowledge certain changes made as part of deployment.
   *
   * For stacks that contain certain resources,
   * explicit acknowledgement is required that AWS CloudFormation might create or update those resources.
   * For example, you must specify `ANONYMOUS_IAM` or `NAMED_IAM` if your stack template contains AWS
   * Identity and Access Management (IAM) resources.
   * For more information, see the link below.
   *
   * @default None, unless `adminPermissions` is true
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-iam-template.html#using-iam-capabilities
   */
  readonly cfnCapabilities?: cdk.CfnCapabilities[];

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

/**
 * Base class for all CloudFormation actions that execute or stage deployments.
 */
abstract class CloudFormationDeployAction extends CloudFormationAction {
  private _deploymentRole?: iam.IRole;
  private readonly props2: CloudFormationDeployActionProps;

  constructor(props: CloudFormationDeployActionProps, inputs: codepipeline.Artifact[] | undefined) {
    super(props, (props.extraInputs || []).concat(inputs || []));

    this.props2 = props;
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

  protected bound(scope: Construct, stage: codepipeline.IStage, options: codepipeline.ActionBindOptions):
  codepipeline.ActionConfig {
    if (this.props2.deploymentRole) {
      this._deploymentRole = this.props2.deploymentRole;
    } else {
      const roleStack = cdk.Stack.of(options.role);
      const pipelineStack = cdk.Stack.of(scope);
      if (roleStack.account !== pipelineStack.account) {
        // pass role is not allowed for cross-account access - so,
        // create the deployment Role in the other account!
        this._deploymentRole = new iam.Role(roleStack,
          `${cdk.Names.nodeUniqueId(stage.pipeline.node)}-${stage.stageName}-${this.actionProperties.actionName}-DeploymentRole`, {
            assumedBy: new iam.ServicePrincipal('cloudformation.amazonaws.com'),
            roleName: cdk.PhysicalName.GENERATE_IF_NEEDED,
          });
      } else {
        this._deploymentRole = new iam.Role(scope, 'Role', {
          assumedBy: new iam.ServicePrincipal('cloudformation.amazonaws.com'),
        });
      }

      // the deployment role might need read access to the pipeline's bucket
      // (for example, if it's deploying a Lambda function),
      // and even if it has admin permissions, it won't be enough,
      // as it needs to be added to the key's resource policy
      // (and the bucket's, if the access is cross-account)
      options.bucket.grantRead(this._deploymentRole);

      if (this.props2.adminPermissions) {
        this._deploymentRole.addToPolicy(new iam.PolicyStatement({
          actions: ['*'],
          resources: ['*'],
        }));
      }
    }

    SingletonPolicy.forRole(options.role).grantPassRole(this._deploymentRole);

    const providedCapabilities = this.props2.cfnCapabilities ??
      this.props2.capabilities?.map(c => {
        switch (c) {
          case cloudformation.CloudFormationCapabilities.NONE: return cdk.CfnCapabilities.NONE;
          case cloudformation.CloudFormationCapabilities.ANONYMOUS_IAM: return cdk.CfnCapabilities.ANONYMOUS_IAM;
          case cloudformation.CloudFormationCapabilities.NAMED_IAM: return cdk.CfnCapabilities.NAMED_IAM;
          case cloudformation.CloudFormationCapabilities.AUTO_EXPAND: return cdk.CfnCapabilities.AUTO_EXPAND;
        }
      });
    const capabilities = this.props2.adminPermissions && providedCapabilities === undefined
      ? [cdk.CfnCapabilities.NAMED_IAM]
      : providedCapabilities;

    const actionConfig = super.bound(scope, stage, options);
    return {
      ...actionConfig,
      configuration: {
        ...actionConfig.configuration,
        // None evaluates to empty string which is falsey and results in undefined
        Capabilities: parseCapabilities(capabilities),
        RoleArn: this.deploymentRole.roleArn,
        ParameterOverrides: cdk.Stack.of(scope).toJsonString(this.props2.parameterOverrides),
        TemplateConfiguration: this.props2.templateConfiguration
          ? this.props2.templateConfiguration.location
          : undefined,
        StackName: this.props2.stackName,
      },
    };
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
  private readonly props3: CloudFormationCreateReplaceChangeSetActionProps;

  constructor(props: CloudFormationCreateReplaceChangeSetActionProps) {
    super(props, props.templateConfiguration
      ? [props.templatePath.artifact, props.templateConfiguration.artifact]
      : [props.templatePath.artifact]);

    this.props3 = props;
  }

  protected bound(scope: Construct, stage: codepipeline.IStage, options: codepipeline.ActionBindOptions):
  codepipeline.ActionConfig {
    // the super call order is to preserve the existing order of statements in policies
    const actionConfig = super.bound(scope, stage, options);

    SingletonPolicy.forRole(options.role).grantCreateReplaceChangeSet(this.props3);

    return {
      ...actionConfig,
      configuration: {
        ...actionConfig.configuration,
        ActionMode: 'CHANGE_SET_REPLACE',
        ChangeSetName: this.props3.changeSetName,
        TemplatePath: this.props3.templatePath.location,
      },
    };
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
  private readonly props3: CloudFormationCreateUpdateStackActionProps;

  constructor(props: CloudFormationCreateUpdateStackActionProps) {
    super(props, props.templateConfiguration
      ? [props.templatePath.artifact, props.templateConfiguration.artifact]
      : [props.templatePath.artifact]);

    this.props3 = props;
  }

  protected bound(scope: Construct, stage: codepipeline.IStage, options: codepipeline.ActionBindOptions):
  codepipeline.ActionConfig {
    // the super call order is to preserve the existing order of statements in policies
    const actionConfig = super.bound(scope, stage, options);

    SingletonPolicy.forRole(options.role).grantCreateUpdateStack(this.props3);

    return {
      ...actionConfig,
      configuration: {
        ...actionConfig.configuration,
        ActionMode: this.props3.replaceOnFailure ? 'REPLACE_ON_FAILURE' : 'CREATE_UPDATE',
        TemplatePath: this.props3.templatePath.location,
      },
    };
  }
}

/**
 * Properties for the CloudFormationDeleteStackAction.
 */
export interface CloudFormationDeleteStackActionProps extends CloudFormationDeployActionProps {
}

/**
 * CodePipeline action to delete a stack.
 *
 * Deletes a stack. If you specify a stack that doesn't exist, the action completes successfully
 * without deleting a stack.
 */
export class CloudFormationDeleteStackAction extends CloudFormationDeployAction {
  private readonly props3: CloudFormationDeleteStackActionProps;

  constructor(props: CloudFormationDeleteStackActionProps) {
    super(props, undefined);

    this.props3 = props;
  }

  protected bound(scope: Construct, stage: codepipeline.IStage, options: codepipeline.ActionBindOptions):
  codepipeline.ActionConfig {
    // the super call order is to preserve the existing order of statements in policies
    const actionConfig = super.bound(scope, stage, options);

    SingletonPolicy.forRole(options.role).grantDeleteStack(this.props3);

    return {
      ...actionConfig,
      configuration: {
        ...actionConfig.configuration,
        ActionMode: 'DELETE_ONLY',
      },
    };
  }
}
