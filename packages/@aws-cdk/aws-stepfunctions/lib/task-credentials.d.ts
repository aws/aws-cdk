import * as iam from '@aws-cdk/aws-iam';
/**
 * Specifies a target role assumed by the State Machine's execution role for invoking the task's resource.
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/concepts-access-cross-acct-resources.html
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-task-state.html#task-state-fields
 */
export interface Credentials {
    /**
     * The role to be assumed for executing the Task.
     */
    readonly role: TaskRole;
}
/**
 * Role to be assumed by the State Machine's execution role for invoking a task's resource.
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/concepts-access-cross-acct-resources.html
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-task-state.html#task-state-fields
 */
export declare abstract class TaskRole {
    /**
     * Construct a task role retrieved from task inputs using a json expression
     *
     * @param expression json expression to roleArn
     *
     * @example
     *
     * TaskRole.fromRoleArnJsonPath('$.RoleArn');
     */
    static fromRoleArnJsonPath(expression: string): TaskRole;
    /**
     * Construct a task role based on the provided IAM Role
     *
     * @param role IAM Role
     */
    static fromRole(role: iam.IRole): TaskRole;
    /**
     * Retrieves the roleArn for this TaskRole
     */
    abstract readonly roleArn: string;
    /**
     * Retrieves the resource for use in IAM Policies for this TaskRole
     */
    abstract readonly resource: string;
}
