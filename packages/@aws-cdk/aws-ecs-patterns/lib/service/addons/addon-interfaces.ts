import * as ecs from '@aws-cdk/aws-ecs';
import { Stack } from '@aws-cdk/core';
import { Service } from '../service';

/**
 * A task definition that is in the process of being built
 * by a series of hooks. Eventually it will be assigned to
 * an ecs.TaskDefinitionProps
 */
export interface TaskDefinitionBuild {
  /**
   * How much CPU the task needs to run
   */
  readonly cpu?: string;

  /**
   * How much memeory the task needs to run
   */
  readonly memoryMiB?: string;

  /**
   * The proxy configuration, used for routing task network
   * traffic through a sidecar container that asks as a proxy
   */
  readonly proxyConfiguration?: ecs.ProxyConfiguration;

  /**
   * The network mode used for the task
   */
  readonly networkMode?: ecs.NetworkMode;
}

/**
 * A service props that is in the process of being assembled
 * Eventually to be assigned to a ecs.ServiceProps
 */
export interface ServiceBuild {
  /**
   * The cluster in which to add the service
   */
  readonly cluster: ecs.Cluster,

  /**
   * The task definition registered to this service
   */
  readonly taskDefinition: ecs.Ec2TaskDefinition,

  /**
   * Configuration for how to register the service in service discovery
   */
  readonly cloudMapOptions?: ecs.CloudMapOptions
}

// The shape of a service addon. Implemented addons extend this abstract
// class to implement their own logic in each hook.
export abstract class ServiceAddon {
  /**
   * The name of the addon
   */
  public name: string;

  /**
   * The container of this addon. Most addons have a container, but not
   * every addon is required to have a container, some addons may just
   * modify the properties of the service, or create external resources
   * connected to the service
   */
  public container?: ecs.ContainerDefinition;

  protected parentService!: Service;
  protected scope!: Stack;

  // A list of other addons which want to mutate the
  // container definition for this addon.
  protected containerMutatingHooks: ContainerMutatingHook[] = [];

  constructor(name: string) {
    this.name = name;
  }

  /**
   * A hook that allows the addon to add hooks to other
   * addons that are registered
   */
  public addHooks() { } // tslint:disable-line

  /**
   * This hook allows another service addon to register a mutating hook for
   * changing the primary container of this addon. This is primarily used
   * for the application addon. For example the Firelens addon wants to
   * be able to modify the settings of the application container to
   * route logs through Firelens.
   * @param hook
   */
  public addContainerMutatingHook(hook: ContainerMutatingHook) {
    this.containerMutatingHooks.push(hook);
  }

  /**
   * This is a hook which allows addons to modify the settings of the
   * task definition prior to it being created. For example App Mesh
   * addon needs to configure an Envoy proxy in the task definition,
   * or the application addon wants to set the overall resource for
   * the task.
   * @param props - Properties of the task definition to be created
   */
  public mutateTaskDefinitionProps(props: TaskDefinitionBuild) {
    return {
      ...props,
    } as TaskDefinitionBuild;
  }

  /**
   * A hook that is called for each addon adhead of time to
   * let it do any initial setup, such as creating resources in
   * advance.
   * @param parent - The parent service which this addon has been added to
   * @param scope - The scope that this addon should create resources in
   */
  public prehook(parent: Service, scope: Stack) {
    this.parentService = parent;
    this.scope = scope;
  }

  /**
   * Once the task definition is created, this hook is called for each
   * addon to give it a chance to add containers to the task definition,
   * change the task definition's role to add permissions, etc
   * @param taskDefinition - The created task definition to add containers to
   */
  // @ts-ignore - Ignore the empty block, reimplemented by classes that extend
  public useTaskDefinition(taskDefinition: ecs.Ec2TaskDefinition) { } // tslint:disable-line

  /**
   * Once all containers are added to the task definition this hook is
   * called for each addon to give it a chance to bake its dependency
   * graph so that its container starts in the right order based on the
   * other addons that were enabled
   */
  // @ts-ignore - Ignore the empty block, reimplemented by classes that extend
  public bakeContainerDependencies() { } // tslint:disable-line

  /**
   * Prior to launching the task definition as a service this hook
   * is called on each addon to give it a chance to mutate the properties
   * of the service to be created
   * @param props - The service properties to mutate
   */
  public mutateServiceProps(props: ServiceBuild) {
    return {
      ...props,
    } as ServiceBuild;
  }

  /**
   * When this hook is implemented by addon it allows the addon
   * to use the service which has been created. It is generally used to
   * create any final resources which might depend on the service itself
   * @param service - The generated service
   */
  // @ts-ignore - Ignore the empty block, reimplemented by classes that extend
  public useService(service: ecs.Ec2Service) { } // tslint:disable-line

  /**
   * This hook allows the addon to establish a connection to
   * addons from another service. Usually used for things like
   * allowing one service to talk to the load balancer or service mesh
   * proxy for another service.
   * @param service - The other service to connect to
   */
  // @ts-ignore - Ignore the empty block, reimplemented by classes that extend
  public connectToService(service: Service) { } // tslint:disable-line
}

export class ContainerMutatingHook {
  /**
   * This is a hook for modifying the container definition of any upstream
   * containers. This is primarily used for the application addon.
   * For example the Firelens addon wants to be able to modify the logging
   * settings of the application container.
   * @param props - The container definition to mutate
   */
  public mutateContainerDefinition(props: ecs.ContainerDefinitionOptions) {
    return {
      ...props,
    } as ecs.ContainerDefinitionOptions;
  }
}