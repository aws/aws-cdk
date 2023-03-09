import * as ecs from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
import { Construct } from 'constructs';
import { JobDefinitionContainer } from './job-definition';

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
 * those of an `ecs.ContainerDefinition`. This class is a wrapper on that structure.
 */
class TaskDefinition {
  /**
   * The IAM role used during execution of the task definition. This IAM role should
   * contain the relevant access required to interact with resources your application needs to perform.
   */
  public readonly executionRole: iam.IRole;

  constructor(props: TaskDefinitionProps) {
    this.executionRole = props.executionRole;
  }

  /**
   * Internal function to allow the Batch Job task definition
   * to match the CDK requirements of an EC2 task definition.
   *
   * @internal
   */
  public _linkContainer() {}

  /**
   * Retrieves the execution role for this task definition
   */
  public obtainExecutionRole(): iam.IRole {
    return this.executionRole;
  }
}

/**
 * The configuration for creating a batch container image.
 */
export class JobDefinitionImageConfig {
  /**
   * Specifies the name of the container image
   */
  public readonly imageName: string;

  constructor(scope: Construct, container: JobDefinitionContainer) {
    const config = this.bindImageConfig(scope, container);

    this.imageName = config.imageName;
  }

  private bindImageConfig(scope: Construct, container: JobDefinitionContainer): ecs.ContainerImageConfig {
    return container.image.bind(scope, new ecs.ContainerDefinition(scope, 'Resource-Batch-Job-Container-Definition', {
      command: container.command,
      cpu: container.vcpus,
      image: container.image,
      environment: container.environment,
      linuxParameters: container.linuxParams,
      memoryLimitMiB: container.memoryLimitMiB,
      privileged: container.privileged,
      readonlyRootFilesystem: container.readOnly,
      gpuCount: container.gpuCount,
      user: container.user,
      taskDefinition: new TaskDefinition({
        executionRole: container.jobRole || new iam.LazyRole(scope, 'Resource-Batch-Task-Definition-Role', {
          assumedBy: new iam.ServicePrincipal('batch.amazonaws.com'),
        }),
      }) as unknown as ecs.TaskDefinition,
    }));
  }
}
