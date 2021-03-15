import * as ecs from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
import { Construct } from 'constructs';
import { JobDefinitionContainer } from './job-definition';
import { ContainerDefinition } from './container-definition';
import { TaskDefinition } from './task-definition';

// v2 - keep this import as a separate section to reduce merge conflict when forward merging with the v2 branch.
// eslint-disable-next-line
import { Construct as CoreConstruct } from '@aws-cdk/core';

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
    return container.image.bind(scope as CoreConstruct, new ContainerDefinition(scope, 'Resource-Batch-Job-Container-Definition', {
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
    }));
  }
}
