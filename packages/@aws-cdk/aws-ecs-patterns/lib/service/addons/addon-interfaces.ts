import cdk = require('@aws-cdk/core');
import ecs = require('@aws-cdk/aws-ecs');
import { Service } from '../service';
import { Ec2Service } from '@aws-cdk/aws-ecs';

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
  readonly cloudMapOptions?: {
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
  readonly cpu: number;
  readonly memoryLimitMiB: number;
  readonly image: ecs.ContainerImage;
  readonly logging?: ecs.LogDriver;
  readonly environment: {
    [key: string]: string
  } | undefined
}

export interface MutateContainerDefinition {
  (props: ContainerDefinitionBuild): ContainerDefinitionBuild;
}

/**
 * The shape of a service addon. All hooks are optional
 */
export abstract class ServiceAddon {
  // The name of the addon
  public name: string;
  protected parentService!: Service;
  protected scope!: cdk.Stack;

  constructor(name: string) {
    this.name = name;
  }

  // Most addons have a container, but not every addon is required to
  // have a container, some addons may just modify the properties of
  // the service, or create external resources connected to the service
  container?: ecs.ContainerDefinition;

  // A hook that allows the addon to add hooks to other
  // addons that are registered
  addHooks() {

  };

  // A list of hooks from other addons which want to mutate the
  // container definition for this addon. This is primarily used by
  // the application addon, which must let other addons mutate the settings
  // of the application container.
  mutateContainerProps?: MutateContainerDefinition[];

  // Called for each addon ahead of time to let them
  // do any initial setup, right at the time of the .add() call
  prehook(parent: Service, scope: cdk.Stack) {
    this.parentService = parent;
    this.scope = scope;
  }

  // Called for each addon to let them mutate the task
  // definition properties first before the task def is created
  mutateTaskDefinitionProps(props: TaskDefinitionBuild) {
    return {
      ...props
    };
  }

  // Once the task definition is created, each addon is given a
  // chance to add containers to the task definition, change the
  // task definition's role to add permissions, etc
  useTaskDefinition(taskDefinition: ecs.Ec2TaskDefinition) {
  }

  // Once all containers are added to the task definition each
  // addon is given a chance to bake its dependency graph so that
  // its container starts in the right order based on the other
  // addons that were enabled
  bakeContainerDependencies() {

  }

  // Prior to launching the task definition as a service each addon
  // is given a chance to mutate the service properties
  mutateServiceProps(props: ServiceBuild) {
    return {
      ...props
    }
  };

  // Once the service is created each addon is given another chance
  // create a final resources that might be needed after the fact
  // which dependend on the service
  useService(service: Ec2Service) {

  };

  // This hook allows the addon to establish a connection to
  // addons from another service. Most likely used for things like
  // allowing one service to talk to the load balancer or service mesh
  // proxy for another service.
  connectToService(service: Service) {

  }
}