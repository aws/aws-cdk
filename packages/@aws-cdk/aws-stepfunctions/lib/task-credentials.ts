import * as iam from '@aws-cdk/aws-iam';
import { JsonPath } from './fields';

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
export abstract class TaskRole {
  /**
   * Construct a task role retrieved from task inputs using a json expression
   *
   * @param expression json expression to roleArn
   *
   * @example
   *
   * TaskRole.fromRoleArnJsonPath('$.RoleArn');
   */
  public static fromRoleArnJsonPath(expression: string): TaskRole {
    return new JsonExpressionTaskRole(expression);
  }

  /**
   * Construct a task role based on the provided IAM Role
   *
   * @param role IAM Role
   */
  public static fromRole(role: iam.IRole): TaskRole {
    return new IamRoleTaskRole(role);
  }

  /**
   * Retrieves the roleArn for this TaskRole
   */
  public abstract readonly roleArn: string;

  /**
   * Retrieves the resource for use in IAM Policies for this TaskRole
   */
  public abstract readonly resource: string;
}

class JsonExpressionTaskRole extends TaskRole {
  public readonly resource: string;
  public readonly roleArn: string;

  constructor(expression: string) {
    super();
    this.roleArn = JsonPath.stringAt(expression);
    this.resource = '*';
  }
}

class IamRoleTaskRole extends TaskRole {
  public readonly resource: string;
  public readonly roleArn: string;

  constructor(role: iam.IRole) {
    super();
    this.roleArn = role.roleArn;
    this.resource = role.roleArn;
  }
}
