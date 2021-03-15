import { Volume } from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';

/**
 * TaskDefinitionRole
 *
 * Defines the required properties of a Batch Job Definition.
 */
interface TaskDefinitionProps {
  /**
   * Defines the IAM role used when executing this task definition
   */
  readonly executionRole: iam.IRole;
}

/**
 * Batch Job Task Definition
 *
 * Defines a Batch Job Task Definition. The properties of this task definition mirrors
 * those of an {@link ecs.ContainerDefinition}. This class is a wrapper on that structure.
 */
export class TaskDefinition {
  /**
   * The IAM role used during execution of the task definition. This IAM role should
   * contain the relevant access required to interact with resources your application needs to perform.
   */
  public readonly executionRole: iam.IRole;

  /**
   * All volumes
   */
  private readonly volumes: Volume[] = [];

  constructor(props: TaskDefinitionProps) {
    this.executionRole = props.executionRole;
  }

  /**
   * Adds a volume to the task definition
   */
  public addVolume(volume: Volume) {
    this.volumes.push(volume);
  }

  /**
   * Retrieves the execution role for this task definition
   */
  public obtainExecutionRole(): iam.IRole {
    return this.executionRole;
  }

  /**
   * Adds a policy statement to the task execution IAM role.
   */
  public addToExecutionRolePolicy(statement: iam.PolicyStatement) {
    this.obtainExecutionRole().addToPolicy(statement);
  }
}
