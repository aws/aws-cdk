import * as ecs from '@aws-cdk/aws-ecs';
import { Service } from '../service';
import { ServiceExtension } from './extension-interfaces';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

/**
 * Setting for the main application container of a service
 */
export interface ContainerExtensionProps {
  /**
   * How much CPU the container requires
   */
  readonly cpu: number,

  /**
   * How much memory in megabytes the container requires
   */
  readonly memoryMiB: number,

  /**
   * The image to run
   */
  readonly image: ecs.ContainerImage,

  /**
   * What port the image listen for traffic on
   */
  readonly trafficPort: number,

  /**
   * Environment variables to pass into the container
   * @default - No environment variables
   */
  readonly environment?: {
    [key: string]: string,
  }
}

/**
 * The main container of a service. This is generally the container
 * which runs your application business logic. Other extensions will attach
 * sidecars alongside this main container.
 */
export class Container extends ServiceExtension {
  /**
   * The port on which the container expects to receive network traffic
   */
  public readonly trafficPort: number;

  /**
   * The settings for the container
   */
  private props: ContainerExtensionProps;

  constructor(props: ContainerExtensionProps) {
    super('service-container');
    this.props = props;
    this.trafficPort = props.trafficPort;
  }

  // @ts-ignore - Ignore unused params that are required for abstract class extend
  public prehook(service: Service, scope: Construct) {
    this.parentService = service;
  }

  // This hook sets the overall task resource requirements to the
  // resource requirements of the application itself.
  public modifyTaskDefinitionProps(props: ecs.TaskDefinitionProps): ecs.TaskDefinitionProps {
    return {
      ...props,
      cpu: this.props.cpu.toString(),
      memoryMiB: this.props.memoryMiB.toString(),
    } as ecs.TaskDefinitionProps;
  }

  // This hook adds the application container to the task definition.
  public useTaskDefinition(taskDefinition: ecs.TaskDefinition) {
    let containerProps = {
      image: this.props.image,
      cpu: Number(this.props.cpu),
      memoryLimitMiB: Number(this.props.memoryMiB),
      environment: this.props.environment,
    } as ecs.ContainerDefinitionOptions;

    // Let other extensions mutate the container definition. This is
    // used by extensions which want to add environment variables, modify
    // logging parameters, etc.
    this.containerMutatingHooks.forEach((hookProvider) => {
      containerProps = hookProvider.mutateContainerDefinition(containerProps);
    });

    this.container = taskDefinition.addContainer('app', containerProps);

    // Create a port mapping for the container
    this.container.addPortMappings({
      containerPort: this.trafficPort,
    });

    // Raise the ulimits for this main application container
    // so that it can handle more concurrent requests
    this.container.addUlimits({
      softLimit: 1024000,
      hardLimit: 1024000,
      name: ecs.UlimitName.NOFILE,
    });
  }

  public resolveContainerDependencies() {
    if (!this.container) {
      throw new Error('The container dependency hook was called before the container was created');
    }

    const firelens = this.parentService.serviceDescription.get('firelens');
    if (firelens && firelens.container) {
      this.container.addContainerDependencies({
        container: firelens.container,
        condition: ecs.ContainerDependencyCondition.START,
      });
    }

    const appmeshextension = this.parentService.serviceDescription.get('appmesh');
    if (appmeshextension && appmeshextension.container) {
      this.container.addContainerDependencies({
        container: appmeshextension.container,
        condition: ecs.ContainerDependencyCondition.HEALTHY,
      });
    }

    const cloudwatchextension = this.parentService.serviceDescription.get('cloudwatchAgent');
    if (cloudwatchextension && cloudwatchextension.container) {
      this.container.addContainerDependencies({
        container: cloudwatchextension.container,
        condition: ecs.ContainerDependencyCondition.START,
      });
    }

    const xrayextension = this.parentService.serviceDescription.get('xray');
    if (xrayextension && xrayextension.container) {
      this.container.addContainerDependencies({
        container: xrayextension.container,
        condition: ecs.ContainerDependencyCondition.HEALTHY,
      });
    }
  }
}
