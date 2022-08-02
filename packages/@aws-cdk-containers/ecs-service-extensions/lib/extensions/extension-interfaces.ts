import * as ecs from '@aws-cdk/aws-ecs';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Service, ConnectToProps } from '../service';

/**
 * The types of capacity that are supported. These capacity types may change the
 * behavior of an extension.
 */
export enum EnvironmentCapacityType {
  /**
   * Specify that the environment should use AWS Fargate for
   * hosting containers.
   */
  FARGATE = 'fargate',

  /**
   * Specify that the environment should launch containers onto
   * EC2 instances.
   */
  EC2 = 'ec2'
}

/**
 * A set of mutable service props in the process of being assembled using a
 * builder pattern. They will eventually to be translated into an
 * ecs.Ec2ServiceProps or ecs.FargateServiceProps interface, depending on the
 * environment's capacity type.
 */
export interface ServiceBuild {
  /**
   * The cluster in which to launch the service.
   */
  readonly cluster: ecs.ICluster,

  /**
   * The task definition registered to this service.
   */
  readonly taskDefinition: ecs.TaskDefinition,

  /**
   * Specifies whether the task's elastic network interface receives a public IP
   * address.
   *
   * If true, each task will receive a public IP address.
   *
   * @default - false
   */
  readonly assignPublicIp?: boolean;

  /**
   * Configuration for how to register the service in service discovery.
   *
   * @default - No Cloud Map configured
   */
  readonly cloudMapOptions?: ecs.CloudMapOptions

  /**
   * How long the healthcheck can fail during initial task startup before
   * the task is considered unhealthy. This is used to give the task more
   * time to start passing healthchecks.
   *
   * @default - No grace period
   */
  readonly healthCheckGracePeriod?: cdk.Duration,

  /**
   * How many tasks to run.
   *
   * @default - 1
   */
  readonly desiredCount?: number;

  /**
   * Minimum healthy task percentage.
   *
   * @default - 100
   */
  readonly minHealthyPercent?: number;

  /**
   * Maximum percentage of tasks that can be launched.
   *
   * @default - 200
   */
  readonly maxHealthyPercent?: number;
}

/**
 * The shape of a service extension. This abstract class is implemented
 * by other extensions that extend the hooks to implement any custom
 * logic that they want to run during each step of preparing the service.
 */
export abstract class ServiceExtension {
  /**
   * The name of the extension.
   */
  public name: string;

  /**
   * The container for this extension. Most extensions have a container, but not
   * every extension is required to have a container. Some extensions may just
   * modify the properties of the service, or create external resources
   * connected to the service.
   */
  public container?: ecs.ContainerDefinition;

  /**
   * The service which this extension is being added to.
   * Initially, extensions are collected into a ServiceDescription, but no service
   * exists yet. Later, when the ServiceDescription is used to create a service,
   * the extension is told what Service it is now working on.
   */
  protected parentService!: Service;
  protected scope!: Construct;

  // A list of other extensions which want to mutate the
  // container definition for this extension.
  protected containerMutatingHooks: ContainerMutatingHook[] = [];

  constructor(name: string) {
    this.name = name;
  }

  /**
   * A hook that allows the extension to add hooks to other
   * extensions that are registered.
   */
  public addHooks() { } // tslint:disable-line

  /**
   * This hook allows another service extension to register a mutating hook for
   * changing the primary container of this extension. This is primarily used
   * for the application extension. For example, the Firelens extension wants to
   * be able to modify the settings of the application container to
   * route logs through Firelens.
   *
   * @param hook
   */
  public addContainerMutatingHook(hook: ContainerMutatingHook) {
    this.containerMutatingHooks.push(hook);
  }

  /**
   * This is a hook which allows extensions to modify the settings of the
   * task definition prior to it being created. For example, the App Mesh
   * extension needs to configure an Envoy proxy in the task definition,
   * or the Application extension wants to set the overall resource for
   * the task.
   *
   * @param props - Properties of the task definition to be created
   */
  public modifyTaskDefinitionProps(props: ecs.TaskDefinitionProps): ecs.TaskDefinitionProps {
    return {
      ...props,
    } as ecs.TaskDefinitionProps;
  }

  /**
   * A hook that is called for each extension ahead of time to
   * allow for any initial setup, such as creating resources in
   * advance.
   *
   * @param parent - The parent service which this extension has been added to
   * @param scope - The scope that this extension should create resources in
   */
  public prehook(parent: Service, scope: Construct) {
    this.parentService = parent;
    this.scope = scope;
  }

  /**
   * Once the task definition is created, this hook is called for each
   * extension to give it a chance to add containers to the task definition,
   * change the task definition's role to add permissions, etc.
   *
   * @param taskDefinition - The created task definition to add containers to
   */
  public useTaskDefinition(taskDefinition: ecs.TaskDefinition) {
    taskDefinition = taskDefinition;
  }

  /**
   * Once all containers are added to the task definition, this hook is
   * called for each extension to give it a chance to resolve its dependency
   * graph so that its container starts in the right order based on the
   * other extensions that were enabled.
   */
  public resolveContainerDependencies() {
    return;
  }

  /**
   * Prior to launching the task definition as a service, this hook
   * is called on each extension to give it a chance to mutate the properties
   * of the service to be created.
   *
   * @param props - The service properties to mutate.
   */
  public modifyServiceProps(props: ServiceBuild): ServiceBuild {
    return {
      ...props,
    } as ServiceBuild;
  }

  /**
   * When this hook is implemented by extension, it allows the extension
   * to use the service which has been created. It is generally used to
   * create any final resources which might depend on the service itself.
   *
   * @param service - The generated service.
   */
  public useService(service: ecs.Ec2Service | ecs.FargateService) {
    service = service;
  }

  /**
   * This hook allows the extension to establish a connection to
   * extensions from another service. Usually used for things like
   * allowing one service to talk to the load balancer or service mesh
   * proxy for another service.
   *
   * @param service - The other service to connect to.
   */
  public connectToService(service: Service, connectToProps: ConnectToProps) {
    service = service;
    connectToProps = connectToProps;
  }
}

/**
 * This is an abstract class wrapper for a mutating hook. It is
 * extended by any extension which wants to mutate other extension's containers.
 */
export abstract class ContainerMutatingHook {
  /**
   * This is a hook for modifying the container definition of any upstream
   * containers. This is primarily used for the main application container.
   * For example, the Firelens extension wants to be able to modify the logging
   * settings of the application container.
   *
   * @param props - The container definition to mutate.
   */
  public mutateContainerDefinition(props: ecs.ContainerDefinitionOptions): ecs.ContainerDefinitionOptions {
    return {
      ...props,
    } as ecs.ContainerDefinitionOptions;
  }
}
