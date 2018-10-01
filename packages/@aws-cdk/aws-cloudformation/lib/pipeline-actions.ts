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
}

/**
 * Base class for Actions that execute CloudFormation
 */
export abstract class PipelineCloudFormationAction extends codepipeline.DeployAction {
  /**
   * Output artifact containing the CloudFormation call response
   *
   * Only present if configured by passing `outputFileName`.
   */
  public artifact?: codepipeline.Artifact;

  constructor(parent: cdk.Construct, id: string, props: PipelineCloudFormationActionProps, configuration?: any) {
    super(parent, id, {
      stage: props.stage,
      artifactBounds: {
        minInputs: 0,
        maxInputs: 10,
        minOutputs: 0,
        maxOutputs: 1,
      },
      provider: 'CloudFormation',
      configuration: {
        StackName: props.stackName,
        OutputFileName: props.outputFileName,
        ...configuration,
      }
    });

    if (props.outputFileName) {
      this.artifact = this.addOutputArtifact(props.outputArtifactName ||
        (props.stage.name + this.id + 'Artifact'));
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
  constructor(parent: cdk.Construct, id: string, props: PipelineExecuteChangeSetActionProps) {
    super(parent, id, props, {
      ActionMode: 'CHANGE_SET_EXECUTE',
      ChangeSetName: props.changeSetName,
    });
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
   * permissions unless `trustTemplate` is true, in which case the role will have
   * full permissions.
   *
   * @default A fresh role with full or no permissions (depending on the value of `trustTemplate`).
   */
  role?: iam.Role;

  /**
   * Acknowledge certain changes made as part of deployment
   *
   * For stacks that contain certain resources, explicit acknowledgement that AWS CloudFormation
   * might create or update those resources. For example, you must specify CAPABILITY_IAM if your
   * stack template contains AWS Identity and Access Management (IAM) resources. For more
   * information, see [Acknowledging IAM Resources in AWS CloudFormation Templates](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-iam-template.html#using-iam-capabilities).
   *
   * @default No capabitilities passed, unless `trustTemplate` is true
   */
  capabilities?: CloudFormationCapabilities[];

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
   *
   * @default false
   */
  fullPermissions?: boolean;

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
  public readonly role: iam.Role;

  constructor(parent: cdk.Construct, id: string, props: PipelineCloudFormationDeployActionProps, configuration: any) {
    const capabilities = props.fullPermissions && props.capabilities === undefined ? [CloudFormationCapabilities.NamedIAM] : props.capabilities;

    super(parent, id, props, {
      ...configuration,
      // This must be a string, so flatten the list to a comma-separated string.
      Capabilities: (capabilities && capabilities.join(',')) || undefined,
      RoleArn: new cdk.Token(() => this.role.roleArn),
      ParameterOverrides: cdk.CloudFormationJSON.stringify(props.parameterOverrides),
      TemplateConfiguration: props.templateConfiguration ? props.templateConfiguration.location : undefined,
      StackName: props.stackName,
    });

    if (props.role) {
      this.role = props.role;
    } else {
      this.role = new iam.Role(this, 'Role', {
        assumedBy: new cdk.ServicePrincipal('cloudformation.amazonaws.com')
      });

      if (props.fullPermissions) {
        this.role.addToPolicy(new cdk.PolicyStatement().addAction('*').addAllResources());
      }
    }
  }

  /**
   * Add statement to the service role assumed by CloudFormation while executing this action.
   */
  public addToRolePolicy(statement: cdk.PolicyStatement) {
    return this.role.addToPolicy(statement);
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
  constructor(parent: cdk.Construct, id: string, props: PipelineCreateReplaceChangeSetActionProps) {
    super(parent, id, props, {
      ActionMode: 'CHANGE_SET_REPLACE',
      ChangeSetName: props.changeSetName,
      TemplatePath: props.templatePath.location,
    });

    this.addInputArtifact(props.templatePath.artifact);
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
  constructor(parent: cdk.Construct, id: string, props: PipelineCreateUpdateStackActionProps) {
    super(parent, id, props, {
      ActionMode: props.replaceOnFailure ? 'REPLACE_ON_FAILURE' : 'CREATE_UPDATE',
      TemplatePath: props.templatePath.location
    });
    this.addInputArtifact(props.templatePath.artifact);
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
  constructor(parent: cdk.Construct, id: string, props: PipelineDeleteStackActionProps) {
    super(parent, id, props, {
      ActionMode: 'DELETE_ONLY',
    });
  }
}

/**
 * Capabilities that affect whether CloudFormation is allowed to change IAM resources
 */
export enum CloudFormationCapabilities {
  /**
   * Capability to create anonymous IAM resources
   *
   * Pass this capability if you're only creating anonymous resources.
   */
  IAM = 'CAPABILITY_IAM',

  /**
   * Capability to create named IAM resources.
   *
   * Pass this capability if you're creating IAM resources that have physical
   * names.
   *
   * `CloudFormationCapabilities.NamedIAM` implies `CloudFormationCapabilities.IAM`; you don't have to pass both.
   */
  NamedIAM = 'CAPABILITY_NAMED_IAM'
}
