import * as ecs from '@aws-cdk/aws-ecs';
import { Stack } from '@aws-cdk/core';
import { Service } from '../service';

// A task definition that is in the process of being built
// by a series of hooks. Eventually it will be assigned to
// an ecs.TaskDefinitionProps
export interface TaskDefinitionBuild {
  readonly cpu?: string;
  readonly memoryMiB?: string;
  readonly proxyConfiguration?: ecs.ProxyConfiguration;
  readonly networkMode?: ecs.NetworkMode;
}

// A service props that is in the process of being assembled
// Eventually to be assigned to a ecs.ServiceProps
export interface ServiceBuild {
  readonly cluster: ecs.Cluster,
  readonly taskDefinition: ecs.Ec2TaskDefinition,
  readonly minHealthyPercent?: number,
  readonly maxHealthyPercent?: number
  readonly cloudMapOptions?: ecs.CloudMapOptions
}

// A container definition that is in the process of
// being built up by various hooks. Eventually it will be assigned
// to an ecs.ContainerDefinitionProps
export interface ContainerDefinitionBuild {
  readonly cpu: number;
  readonly memoryLimitMiB: number;
  readonly image: ecs.ContainerImage;
  readonly logging?: ecs.LogDriver;
  readonly environment: {
    [key: string]: string
  } | undefined
}

export type MutateContainerDefinition = (props: ContainerDefinitionBuild) => ContainerDefinitionBuild;

// The shape of a service addon. Implemented addons extend this abstract
// class to implement their own logic in each hook.
export abstract class ServiceAddon {
  // The name of the addon
  public name: string;

  // Most addons have a container, but not every addon is required to
  // have a container, some addons may just modify the properties of
  // the service, or create external resources connected to the service
  public container?: ecs.ContainerDefinition;

  // A list of hooks from other addons which want to mutate the
  // container definition for this addon. This is primarily used by
  // the application addon, which must let other addons mutate the settings
  // of the application container. It could be implemented by any addon
  // though
  public mutateContainerProps: MutateContainerDefinition[] = [];
  protected parentService!: Service;
  protected scope!: Stack;

  constructor(name: string) {
    this.name = name;
  }

  // A hook that allows the addon to add hooks to other
  // addons that are registered
  public addHooks() { } // tslint:disable-line

  // Called for each addon ahead of time to let them
  // do any initial setup, right at the time of the .add() call
  public prehook(parent: Service, scope: Stack) {
    this.parentService = parent;
    this.scope = scope;
  }

  // Called for each addon to let them mutate the task
  // definition properties first before the task def is created
  public mutateTaskDefinitionProps(props: TaskDefinitionBuild) {
    return {
      ...props,
    } as TaskDefinitionBuild;
  }

  // Once the task definition is created, each addon is given a
  // chance to add containers to the task definition, change the
  // task definition's role to add permissions, etc
  // @ts-ignore
  public useTaskDefinition(taskDefinition: ecs.Ec2TaskDefinition) { } // tslint:disable-line

  // Once all containers are added to the task definition each
  // addon is given a chance to bake its dependency graph so that
  // its container starts in the right order based on the other
  // addons that were enabled
  public bakeContainerDependencies() { } // tslint:disable-line

  // Prior to launching the task definition as a service each addon
  // is given a chance to mutate the service properties
  public mutateServiceProps(props: ServiceBuild) {
    return {
      ...props,
    } as ServiceBuild;
  }

  // Once the service is created each addon is given another chance
  // create a final resources that might be needed after the fact
  // which dependend on the service
  // @ts-ignore
  public useService(service: ecs.Ec2Service) { } // tslint:disable-line

  // This hook allows the addon to establish a connection to
  // addons from another service. Most likely used for things like
  // allowing one service to talk to the load balancer or service mesh
  // proxy for another service.
  // @ts-ignore
  public connectToService(service: Service) { } // tslint:disable-line
}