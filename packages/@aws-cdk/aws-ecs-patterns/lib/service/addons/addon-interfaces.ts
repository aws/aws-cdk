import cdk = require('@aws-cdk/core');
import ecs = require('@aws-cdk/aws-ecs');
import { Service } from '../service';

// A task definition that is in the process of being built
// by a series of hooks. Eventually it will be assigned to
// an ecs.TaskDefinitionProps
export interface TaskDefinitionBuild {
  cpu?: string;
  memoryMiB?: string;
  proxyConfiguration?: ecs.ProxyConfiguration;
  networkMode?: ecs.NetworkMode;
}

// A service props that is in the process of being assembled
// Eventually to be assigned to a ecs.ServiceProps
export interface ServiceBuild {
  cluster: ecs.Cluster,
  taskDefinition: ecs.Ec2TaskDefinition,
  minHealthyPercent?: number,
  maxHealthyPercent?: number
  cloudMapOptions?: {
    dnsRecordType: string,
    dnsTtl: cdk.Duration,
    failureThreshold: number,
    name: string
  }
}

// A container definition that is in the process of
// being built up by various hooks. Eventually it will be assigned
// to an ecs.ContainerDefinitionProps
export interface ContainerDefinitionBuild {
  cpu?: Number;
  memoryLimitMiB?: Number;
  image: ecs.ContainerImage;
  logging?: ecs.LogDriver;
}

export interface MutateContainerDefinition {
  (props: ContainerDefinitionBuild): void;
}

interface PrehookFunc {
  (parent: Service, scope: cdk.Stack): void;
}

interface MutateTaskDefPropsFunc {
  (props: TaskDefinitionBuild): void;
}

interface UseTaskDefFunc {
  (taskDefinition: ecs.Ec2TaskDefinition): void;
}

interface MutateServicePropsFunc {
  (props: ServiceBuild): void;
}

interface UseServiceFunc {
  (taskDefinition: ecs.Ec2Service): void;
}

interface ConnectToServiceFunc {
  (service: Service): void;
}

/**
 * The shape of a service addon. All hooks are optional
 */
export interface ServiceAddon {
  // The name of the addon
  readonly name: string

  // Most addons have a container, but not every addon is required to
  // have a container, some addons may just modify the properties of
  // the service, or create external resources connected to the service
  container?: ecs.ContainerDefinition,

  // A hook that allows the addon to add hooks to other
  // addons that are registered
  addHooks?: Function,

  // A list of hooks from other addons which want to mutate the
  // container definition for this addon. This is primarily used by
  // the application addon, which must let other addons mutate the settings
  // of the application container.
  mutateContainerProps?: MutateContainerDefinition[],

  // Called for each addon ahead of time to let them
  // do any initial setup, right at the time of the .add() call
  prehook?: PrehookFunc,

  // Called for each addon to let them mutate the task
  // definition properties first before the task def is created
  mutateTaskDefinitionProps?: MutateTaskDefPropsFunc,

  // Once the task definition is created, each addon is given a
  // chance to add containers to the task definition, change the
  // task definition's role to add permissions, etc
  useTaskDefinition?: UseTaskDefFunc,

  // Once all containers are added to the task definition each
  // addon is given a chance to bake its dependency graph so that
  // its container starts in the right order based on the other
  // addons that were enabled
  bakeContainerDependencies?: Function,

  // Prior to launching the task definition as a service each addon
  // is given a chance to mutate the service properties
  mutateServiceProps?: MutateServicePropsFunc,

  // Once the service is created each addon is given another chance
  // create a final resources that might be needed after the fact
  // which dependend on the service
  useService?: UseServiceFunc

  // This hook allows the addon to establish a connection to
  // addons from another service. Most likely used for things like
  // allowing one service to talk to the load balancer or service mesh
  // proxy for another service.
  connectToService?: ConnectToServiceFunc
}