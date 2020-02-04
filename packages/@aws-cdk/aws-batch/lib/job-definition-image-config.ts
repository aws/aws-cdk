import * as ecs from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { JobDefinitionContainer } from './job-definition-container';

/**
 * An interface representing a job definition image config
 * for binding a container image to a batch job definition.
 */
export interface JobDefinitionImageName {
  /**
   * Specifies the name of the container image.
   */
  readonly imageName: string;
}

/**
 * TaskDefinitionRole
 *
 * Defines the required properties of a Batch Job Definition.
 */
export interface TaskDefinitionProps {
  readonly executionRole: iam.IRole;
}

/**
 * Batch Job Task Definition
 *
 * Defines a Batch Job Task Definition. The properties of this task definition mirrors
 * those of an {@link ecs.ContainerDefinition}. This class is a wrapper on that structure.
 */
export class TaskDefinition {
  public readonly executionRole: iam.IRole;
  constructor(props: TaskDefinitionProps) {
    this.executionRole = props.executionRole;
  }

  // tslint:disable-next-line: no-empty
  public _linkContainer(_container: ecs.ContainerDefinition) {}

  public obtainExecutionRole(): iam.IRole {
    return this.executionRole;
  }
}

/**
 * The configuration for creating a batch container image.
 */
export class JobDefinitionImageConfig implements JobDefinitionImageName {
  public readonly imageName: string;

  constructor(scope: cdk.Construct, container: JobDefinitionContainer) {
    const config = this.bindImageConfig(scope, container);

    this.imageName = config.imageName;
  }

  private bindImageConfig(scope: cdk.Construct, container: JobDefinitionContainer): ecs.ContainerImageConfig {
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
          assumedBy: new iam.ServicePrincipal('batch.amazonaws.com')
        }),
      }) as unknown as ecs.TaskDefinition,
    }));
  }
}
