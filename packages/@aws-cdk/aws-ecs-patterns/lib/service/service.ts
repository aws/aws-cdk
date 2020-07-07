import cdk = require('@aws-cdk/core');
import { ServiceAddon } from './addons/addon-interfaces';
import ecs = require('@aws-cdk/aws-ecs');
import ec2 = require('@aws-cdk/aws-ec2');

interface AddFunc {
  (addon: ServiceAddon): Service
}

interface ServiceInterface {
  add: AddFunc;
}

export interface ServiceProps {
  vpc: ec2.Vpc,
  cluster: ecs.Cluster
}

export class Service extends cdk.Construct implements ServiceInterface {
  public addons: Map<string, ServiceAddon>;
  protected taskDefinition!: ecs.Ec2TaskDefinition;
  public service!: ecs.Ec2Service;
  readonly scope: cdk.Stack;
  readonly id: string;
  readonly vpc: ec2.Vpc;
  readonly cluster: ecs.Cluster;
  public prepared: boolean;

  // A list of downstream services, allows addons to
  // establish connections to other services
  private downstreamServices: Service[];

  constructor(scope: cdk.Stack, id: string, props: ServiceProps) {
    super(scope, id);

    this.scope = scope;
    this.id = id;
    this.vpc = props.vpc;
    this.cluster = props.cluster;
    this.addons = new Map();
    this.downstreamServices = [];
    this.prepared = false;
  }

  // Add an addon to the service
  add(addon: ServiceAddon) {
    if (this.addons.get(addon.name)) {
      throw new Error(`The addon ${addon.name} has already been added`);
    }

    this.addons.set(addon.name, addon);

    if (addon.prehook) {
      addon.prehook(this, this.scope);
    }

    return this;
  }

  // Tell addons from one service to connect to addons from
  // another sevice if they have implemented a hook for that.
  connectTo(service: Service) {
    this.downstreamServices.push(service);
  }

  // Get the addon of a specific key if it exists
  getAddon(type: string) {
    const addon = this.addons.get(type);

    if (!addon) {
      throw new Error(`The addon ${type} does not exist on service ${this.id}`);
    }

    return addon;
  }

  // Run all the addon hooks to prepare the final service
  prepare() {
    if (this.prepared) {
      return; // Already prepared
    }

    var taskDefProps = {};

    // At the point of preparation all addons have been defined on the service
    // so give each addon a chance to now add hooks to other addons if
    // needed
    this.addons.forEach((addon) => {
      if (addon.addHooks) {
        addon.addHooks();
      }
    });

    // Give each addon a chance to mutate the task def creation properties
    this.addons.forEach((addon) => {
      if (addon.mutateTaskDefinitionProps) {
        taskDefProps = addon.mutateTaskDefinitionProps(taskDefProps);
      }
    });

    // Now that the task definition properties are assembled, create it
    this.taskDefinition = new ecs.Ec2TaskDefinition(this.scope, `${this.id}-task-definition`, taskDefProps);

    // Now give each addon a chance to use the task definition
    this.addons.forEach((addon) => {
      if (addon.useTaskDefinition) {
        addon.useTaskDefinition(this.taskDefinition);
      }
    });

    // Now that all containers are created, give each addon a chance
    // to bake its dependency graph
    this.addons.forEach((addon) => {
      if (addon.bakeContainerDependencies) {
        addon.bakeContainerDependencies();
      }
    });

    let serviceProps = {
      cluster: this.cluster,
      taskDefinition: this.taskDefinition,
    };

    // Give each addon a chance to mutate the service props before
    // service creation
    this.addons.forEach((addon) => {
      if (addon.mutateServiceProps) {
        serviceProps = addon.mutateServiceProps(serviceProps);
      }
    });

    // Now that the service props are determined we can create
    // the service
    this.service = new ecs.Ec2Service(this.scope, `${this.id}-service`, serviceProps);

    // Now give all addons a chance to use the service
    this.addons.forEach((addon) => {
      if (addon.useService) {
        addon.useService(this.service);
      }
    });

    this.prepared = true;

    // Last but not least give each addon a chance to
    // establish a connection to each downstream service.
    this.downstreamServices.forEach((service) => {
      this.addons.forEach((addon) => {
        if (addon.connectToService) {
          addon.connectToService(service);
        }
      });
    });
  }
}