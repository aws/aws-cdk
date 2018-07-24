// import { iam } from '@aws-cdk/resources';
// import { ArtifactPath } from '.';
// import { DeployAction } from './actions';
// import { Stage } from './pipeline';

// // TODO: rework these according to new model

// export enum CloudFormationCapabilities {
//     IAM = 'CAPABILITY_IAM',
//     NamedIAM = 'CAPABILITY_NAMED_IAM'
// }

// export class CloudFormationCommonOptions {
//     /**
//      * For stacks that contain certain resources, explicit acknowledgement that AWS CloudFormation
//      * might create or update those resources. For example, you must specify CAPABILITY_IAM if your
//      * stack template contains AWS Identity and Access Management (IAM) resources. For more
//      * information, see Acknowledging IAM Resources in AWS CloudFormation Templates.
//      */
//     public capabilities?: CloudFormationCapabilities[];

//     /**
//      * A name for the output file, such as CreateStackOutput.json. AWS CodePipeline adds the file to
//      * the output artifact after performing the specified action.
//      */
//     public outputFileName?: string;

//     /**
//      * A JSON object that specifies values for template parameters. If you specify parameters that
//      * are also specified in the template configuration file, these values override them. All
//      * parameter names must be present in the stack template.
//      *
//      * Note: There is a maximum size limit of 1 kilobyte for the JSON object that can be stored in
//      * the ParameterOverrides property.
//      *
//      * We recommend that you use the template configuration file to specify most of your parameter
//      * values. Use parameter overrides to specify only dynamic parameter values (values that are
//      * unknown until you run the pipeline).
//      */
//     public parameterOverrides?: { [name: string]: any };

//     /**
//      * The template configuration file can contain template parameter values and a stack policy.
//      * Note that if you include sensitive information, such as passwords, restrict access to this
//      * file. For more information, see AWS CloudFormation Artifacts.
//      */
//     public templateConfiguration?: ArtifactPath;
// }

// export class CloudFormationAction extends DeployAction {
//     constructor(parent: Stage, name: string, configuration?: any) {
//         super(parent, name, 'CloudFormation',  { minInputs: 0, maxInputs: 10, minOutputs: 0, maxOutputs: 1 }, configuration);
//     }
// }

// export class ExecuteChangeSetOptions extends CloudFormationCommonOptions {
//     public stackName: string;

//     /**
//      * The name of an existing change set or a new change set that you want to create for the
//      * specified stack.
//      */
//     public changeSetName: string;
// }

// /**
//  * Executes a change set.
//  */
// export class ExecuteChangeSet extends CloudFormationAction {
//     constructor(parent: Stage, name: string, options: ExecuteChangeSetOptions) {
//         super(parent, name, {
//             ActionMode: 'CHANGE_SET_EXECUTE',
//             Capabilities: options.capabilities,
//             ChangeSetName: options.changeSetName,
//             OutputFileName: options.outputFileName,
//         });
//     }
// }

// export class ChangeSetReplaceOptions extends CloudFormationCommonOptions {
//     public stackName: string;

//     /**
//      * The name of an existing change set or a new change set that you want to create for the
//      * specified stack.
//      */
//     public changeSetName: string;
//     public roleArn: iam.RoleArnAttribute;
//     public templatePath: ArtifactPath;
// }

// /**
//  * Creates the change set if it doesn't exist based on the stack name and template that you submit.
//  * If the change set exists, AWS CloudFormation deletes it, and then creates a new one.
//  */
// export class ChangeSetReplace extends CloudFormationAction {
//     constructor(parent: Stage, name: string, options: ChangeSetReplaceOptions) {
//         super(parent, name, {
//             ActionMode: 'CHANGE_SET_REPLACE',
//             Capabilities: options.capabilities,
//             ChangeSetName: options.changeSetName,
//             OutputFileName: options.outputFileName,
//             ParameterOverrides: options.parameterOverrides,
//             RoleArn: options.roleArn,
//             StackName: options.stackName,
//             TemplateConfiguration: options.templateConfiguration,
//             TemplatePath: options.templatePath,
//         });
//     }
// }

// export class CreateUpdateOptions extends CloudFormationCommonOptions {
//     public roleArn: iam.RoleArnAttribute;
//     public stackName: string;
//     public templatePath: ArtifactPath;
// }

// /**
//  * Creates the stack if the specified stack doesn't exist. If the stack exists, AWS CloudFormation
//  * updates the stack. Use this action to update existing stacks. AWS CodePipeline won't replace the
//  * stack.
//  */
// export class CreateUpdate extends CloudFormationAction {
//     constructor(parent: Stage, name: string, options: CreateUpdateOptions) {
//         super(parent, name, {
//             ActionMode: 'CREATE_UPDATE',
//             Capabilities: options.capabilities,
//             OutputFileName: options.outputFileName,
//             ParameterOverrides: options.parameterOverrides,
//             RoleArn: options.roleArn,
//             StackName: options.stackName,
//             TemplateConfiguration: options.templateConfiguration,
//             TemplatePath: options.templatePath
//         });
//     }
// }

// export class DeleteOnlyOptions extends CloudFormationCommonOptions {
//     public roleArn: iam.RoleArnAttribute;
//     public stackName: string;
// }

// /**
//  * Deletes a stack. If you specify a stack that doesn't exist, the action completes successfully
//  * without deleting a stack.
//  */
// export class DeleteOnly extends CloudFormationAction {
//     constructor(parent: Stage, name: string, options: DeleteOnlyOptions) {
//         super(parent, name, {
//             ActionMode: 'DELETE_ONLY',
//             Capabilities: options.capabilities,
//             OutputFileName: options.outputFileName,
//             RoleArn: options.roleArn,
//             StackName: options.stackName,
//         });
//     }
// }

// export class ReplaceOnFailureOptions extends CloudFormationCommonOptions {
//     public roleArn: iam.RoleArnAttribute;
//     public stackName: string;
//     public templatePath: ArtifactPath;
// }

// /**
//  * Creates a stack if the specified stack doesn't exist. If the stack exists and is in a failed
//  * state (reported as ROLLBACK_COMPLETE, ROLLBACK_FAILED, CREATE_FAILED, DELETE_FAILED, or
//  * UPDATE_ROLLBACK_FAILED), AWS CloudFormation deletes the stack and then creates a new stack. If
//  * the stack isn't in a failed state, AWS CloudFormation updates it. Use this action to
//  * automatically replace failed stacks without recovering or troubleshooting them. You would
//  * typically choose this mode for testing.
//  */
// export class ReplaceOnFailure extends CloudFormationAction {
//     constructor(parent: Stage, name: string, options: ReplaceOnFailureOptions) {
//         super(parent, name, {
//             ActionMode: 'REPLACE_ON_FAILURE',
//             Capabilities: options.capabilities,
//             OutputFileName: options.outputFileName,
//             ParameterOverrides: options.parameterOverrides,
//             RoleArn: options.roleArn,
//             StackName: options.stackName,
//             TemplateConfiguration: options.templateConfiguration,
//             TemplatePath: options.templatePath,
//         });
//     }
// }
