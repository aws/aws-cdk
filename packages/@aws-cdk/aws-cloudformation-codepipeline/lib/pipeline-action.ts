import { ArtifactPath, DeployAction, Stage, } from '@aws-cdk/aws-codepipeline';
import { RoleArn } from '@aws-cdk/aws-iam';

export enum CloudFormationCapabilities {
    IAM = 'CAPABILITY_IAM',
    NamedIAM = 'CAPABILITY_NAMED_IAM'
}

export interface CloudFormationCommonOptions {
    /**
     * For stacks that contain certain resources, explicit acknowledgement that AWS CloudFormation
     * might create or update those resources. For example, you must specify CAPABILITY_IAM if your
     * stack template contains AWS Identity and Access Management (IAM) resources. For more
     * information, see Acknowledging IAM Resources in AWS CloudFormation Templates.
     */
    capabilities?: CloudFormationCapabilities[];

    /**
     * A name for the output file, such as CreateStackOutput.json. AWS CodePipeline adds the file to
     * the output artifact after performing the specified action.
     */
    outputFileName?: string;

    /**
     * A JSON object that specifies values for template parameters. If you specify parameters that
     * are also specified in the template configuration file, these values override them. All
     * parameter names must be present in the stack template.
     *
     * Note: There is a maximum size limit of 1 kilobyte for the JSON object that can be stored in
     * the ParameterOverrides property.
     *
     * We recommend that you use the template configuration file to specify most of your parameter
     * values. Use parameter overrides to specify only dynamic parameter values (values that are
     * unknown until you run the pipeline).
     */
    parameterOverrides?: { [name: string]: any };

    /**
     * The template configuration file can contain template parameter values and a stack policy.
     * Note that if you include sensitive information, such as passwords, restrict access to this
     * file. For more information, see AWS CloudFormation Artifacts.
     */
    templateConfiguration?: ArtifactPath;
}

export abstract class CloudFormationAction extends DeployAction {
    constructor(parent: Stage, name: string, configuration?: any) {
        super(parent, name, 'CloudFormation',  { minInputs: 0, maxInputs: 10, minOutputs: 0, maxOutputs: 1 }, configuration);
    }
}

export interface ExecuteChangeSetOptions extends CloudFormationCommonOptions {

    /**
     * The stack name to execute a change set against.
     */
    stackName: string;

    /**
     * The name of an existing change set or a new change set that you want to create for the
     * specified stack.
     */
    changeSetName: string;
}

/**
 * Executes a change set.
 */
export class ExecuteChangeSet extends CloudFormationAction {
    constructor(parent: Stage, name: string, options: ExecuteChangeSetOptions) {
        super(parent, name, {
            ActionMode: 'CHANGE_SET_EXECUTE',
            Capabilities: options.capabilities,
            ChangeSetName: options.changeSetName,
            OutputFileName: options.outputFileName,
        });
    }
}

export interface CreateReplaceChangeSetOptions extends CloudFormationCommonOptions {

    /**
     * The stack name to create/replace a change set for.
     */
    stackName: string;

    /**
     * The name of an existing change set or a new change set that you want to create for the
     * specified stack.
     */
    changeSetName: string;

    /**
     * The arn of the IAM service role that AWS CloudFormation assumes
     * when it operates on resources in the specified stack.
     */
    roleArn: RoleArn;

    /**
     * The path to the template to pass to CloudFormation during the change set operation.
     */
    templatePath: ArtifactPath;
}

/**
 * Creates the change set if it doesn't exist based on the stack name and template that you submit.
 * If the change set exists, AWS CloudFormation deletes it, and then creates a new one.
 */
export class CreateReplaceChangeSet extends CloudFormationAction {
    constructor(parent: Stage, name: string, options: CreateReplaceChangeSetOptions) {
        super(parent, name, {
            ActionMode: 'CHANGE_SET_REPLACE',
            Capabilities: options.capabilities,
            ChangeSetName: options.changeSetName,
            OutputFileName: options.outputFileName,
            ParameterOverrides: options.parameterOverrides,
            RoleArn: options.roleArn,
            StackName: options.stackName,
            TemplateConfiguration: options.templateConfiguration,
            TemplatePath: options.templatePath.location,
        });
    }
}

export interface CreateUpdateOptions extends CloudFormationCommonOptions {
    /**
     * The arn of the IAM service role that AWS CloudFormation assumes
     * when it operates on resources in the specified stack.
     */
    roleArn: RoleArn;

    /**
     * The CloudFormation stack name to create or update
     */
    stackName: string;

    /**
     * The path to the CloudFormation template file (relative to an input artifact)
     */
    templatePath: ArtifactPath;
}

/**
 * Creates the stack if the specified stack doesn't exist. If the stack exists, AWS CloudFormation
 * updates the stack. Use this action to update existing stacks. AWS CodePipeline won't replace the
 * stack.
 */
export class CreateUpdate extends CloudFormationAction {
    constructor(parent: Stage, name: string, options: CreateUpdateOptions) {
        super(parent, name, {
            ActionMode: 'CREATE_UPDATE',
            Capabilities: options.capabilities,
            OutputFileName: options.outputFileName,
            ParameterOverrides: options.parameterOverrides,
            RoleArn: options.roleArn,
            StackName: options.stackName,
            TemplateConfiguration: options.templateConfiguration,
            TemplatePath: options.templatePath.location
        });
    }
}

export interface DeleteOnlyOptions extends CloudFormationCommonOptions {
    /**
     * The arn of the IAM service role that AWS CloudFormation assumes
     * when it operates on resources in the specified stack.
     */
    roleArn: RoleArn;

    /**
     * The CloudFormation stack name to delete
     */
    stackName: string;
}

/**
 * Deletes a stack. If you specify a stack that doesn't exist, the action completes successfully
 * without deleting a stack.
 */
export class DeleteOnly extends CloudFormationAction {
    constructor(parent: Stage, name: string, options: DeleteOnlyOptions) {
        super(parent, name, {
            ActionMode: 'DELETE_ONLY',
            Capabilities: options.capabilities,
            OutputFileName: options.outputFileName,
            RoleArn: options.roleArn,
            StackName: options.stackName,
        });
    }
}

export interface ReplaceOnFailureOptions extends CloudFormationCommonOptions {
    /**
     * The arn of the IAM service role that AWS CloudFormation assumes
     * when it operates on resources in the specified stack.
     */
    roleArn: RoleArn;

    /**
     * The CloudFormation stack name to replace/create
     */
    stackName: string;

    /**
     * The path to the CloudFormation template file (relative to an input artifact)
     */
    templatePath: ArtifactPath;
}

/**
 * Creates a stack if the specified stack doesn't exist. If the stack exists and is in a failed
 * state (reported as ROLLBACK_COMPLETE, ROLLBACK_FAILED, CREATE_FAILED, DELETE_FAILED, or
 * UPDATE_ROLLBACK_FAILED), AWS CloudFormation deletes the stack and then creates a new stack. If
 * the stack isn't in a failed state, AWS CloudFormation updates it. Use this action to
 * automatically replace failed stacks without recovering or troubleshooting them. You would
 * typically choose this mode for testing.
 */
export class ReplaceOnFailure extends CloudFormationAction {
    constructor(parent: Stage, name: string, options: ReplaceOnFailureOptions) {
        super(parent, name, {
            ActionMode: 'REPLACE_ON_FAILURE',
            Capabilities: options.capabilities,
            OutputFileName: options.outputFileName,
            ParameterOverrides: options.parameterOverrides,
            RoleArn: options.roleArn,
            StackName: options.stackName,
            TemplateConfiguration: options.templateConfiguration,
            TemplatePath: options.templatePath.location,
        });
    }
}