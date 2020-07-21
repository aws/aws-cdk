import * as ecs from '@aws-cdk/aws-ecs';
import * as cdk from '@aws-cdk/core';
import { Service } from '../service';
import { ServiceAddon, TaskDefinitionBuild } from './addon-interfaces';

/**
 * Setting for the main application container of a service
 */
export interface ContainerAddonProps {
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
 * which runs your application business logic. Other addons will attach
 * sidecars alongside this main container.
 */
export class Container extends ServiceAddon {
  /**
   * The port on which the container expects to receive network traffic
   */
  public readonly trafficPort: number;

  /**
   * The settings for the container
   */
  private props: ContainerAddonProps;

  constructor(props: ContainerAddonProps) {
    super('service-container');
    this.props = props;
    this.trafficPort = props.trafficPort;
  }

  // @ts-ignore - Ignore unused params that are required for abstract class extend
  public prehook(service: Service, scope: cdk.Construct) {
    this.parentService = service;
  }

  // This hook sets the overall task resource requirements to the
  // resource requirements of the application itself.
  public mutateTaskDefinitionProps(props: TaskDefinitionBuild) {
    return {
      ...props,
      cpu: this.props.cpu.toString(),
      memoryMiB: this.props.memoryMiB.toString(),
    } as TaskDefinitionBuild;
  }

  // This hook adds the application container to the task definition.
  public useTaskDefinition(taskDefinition: ecs.TaskDefinition) {
    let containerProps = {
      image: this.props.image,
      cpu: Number(this.props.cpu),
      memoryLimitMiB: Number(this.props.memoryMiB),
      environment: this.props.environment,
    } as ecs.ContainerDefinitionOptions;

    // Let other addons mutate the container definition. This is
    // used by addons which want to add environment variables, modify
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

  public bakeContainerDependencies() {
    if (!this.container) {
      throw new Error('The container dependency hook was called before the container was created');
    }

    const firelens = this.parentService.getAddon('firelens');
    if (firelens && firelens.container) {
      this.container.addContainerDependencies({
        container: firelens.container,
        condition: ecs.ContainerDependencyCondition.START,
      });
    }

    const appmeshAddon = this.parentService.getAddon('appmesh');
    if (appmeshAddon && appmeshAddon.container) {
      this.container.addContainerDependencies({
        container: appmeshAddon.container,
        condition: ecs.ContainerDependencyCondition.HEALTHY,
      });
    }

    const cloudwatchAddon = this.parentService.getAddon('cloudwatchAgent');
    if (cloudwatchAddon && cloudwatchAddon.container) {
      this.container.addContainerDependencies({
        container: cloudwatchAddon.container,
        condition: ecs.ContainerDependencyCondition.START,
      });
    }

    const xrayAddon = this.parentService.getAddon('xray');
    if (xrayAddon && xrayAddon.container) {
      this.container.addContainerDependencies({
        container: xrayAddon.container,
        condition: ecs.ContainerDependencyCondition.HEALTHY,
      });
    }
  }
}