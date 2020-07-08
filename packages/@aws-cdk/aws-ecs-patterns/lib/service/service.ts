import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as cdk from '@aws-cdk/core';
import { ServiceAddon } from './addons/addon-interfaces';

type AddFunc = (addon: ServiceAddon) => Service;

interface ServiceInterface {
  add: AddFunc;
}

export interface ServiceProps {
  readonly vpc: ec2.Vpc,
  readonly cluster: ecs.Cluster
}

export class Service extends cdk.Construct implements ServiceInterface {
  public service!: ecs.Ec2Service;
  public prepared: boolean;
  public readonly scope: cdk.Stack;
  public readonly id: string;
  public readonly vpc: ec2.Vpc;
  public readonly cluster: ecs.Cluster;
  protected taskDefinition!: ecs.Ec2TaskDefinition;

  private addons: Record<string, ServiceAddon>;

  // A list of downstream services, allows addons to
  // establish connections to other services
  private downstreamServices: Service[];

  constructor(scope: cdk.Stack, id: string, props: ServiceProps) {
    super(scope, id);

    this.scope = scope;
    this.id = id;
    this.vpc = props.vpc;
    this.cluster = props.cluster;
    this.addons = {};
    this.downstreamServices = [];
    this.prepared = false;
  }

  // Add an addon to the service
  public add(addon: ServiceAddon) {
    if (this.addons[addon.name]) {
      throw new Error(`The addon ${addon.name} has already been added`);
    }

    this.addons[addon.name] = addon;

    if (addon.prehook) {
      addon.prehook(this, this.scope);
    }

    return this;
  }

  // Tell addons from one service to connect to addons from
  // another sevice if they have implemented a hook for that.
  public connectTo(service: Service) {
    this.downstreamServices.push(service);
  }

  // Get the addon of a specific key if it exists
  public getAddon(type: string) {
    const addon = this.addons[type];

    if (!addon) {
      throw new Error(`The addon ${type} does not exist on service ${this.id}`);
    }

    return addon;
  }

  // Run all the addon hooks to prepare the final service
  public prepare() {
    if (this.prepared) {
      return; // Already prepared
    }

    let taskDefProps = {};

    // At the point of preparation all addons have been defined on the service
    // so give each addon a chance to now add hooks to other addons if
    // needed
    for (const addon in this.addons) {
      if (this.addons[addon]) {
        this.addons[addon].addHooks();
      }
    }

    // Give each addon a chance to mutate the task def creation properties
    for (const addon in this.addons) {
      if (this.addons[addon]) {
        taskDefProps = this.addons[addon].mutateTaskDefinitionProps(taskDefProps);
      }
    }

    // Now that the task definition properties are assembled, create it
    this.taskDefinition = new ecs.Ec2TaskDefinition(this.scope, `${this.id}-task-definition`, taskDefProps);

    // Now give each addon a chance to use the task definition
    for (const addon in this.addons) {
      if (this.addons[addon]) {
        this.addons[addon].useTaskDefinition(this.taskDefinition);
      }
    }

    // Now that all containers are created, give each addon a chance
    // to bake its dependency graph
    for (const addon in this.addons) {
      if (this.addons[addon]) {
        this.addons[addon].bakeContainerDependencies();
      }
    }

    let serviceProps = {
      cluster: this.cluster,
      taskDefinition: this.taskDefinition,
    };

    // Give each addon a chance to mutate the service props before
    // service creation
    for (const addon in this.addons) {
      if (this.addons[addon]) {
        serviceProps = this.addons[addon].mutateServiceProps(serviceProps);
      }
    }

    // Now that the service props are determined we can create
    // the service
    this.service = new ecs.Ec2Service(this.scope, `${this.id}-service`, serviceProps);

    // Now give all addons a chance to use the service
    for (const addon in this.addons) {
      if (this.addons[addon]) {
        this.addons[addon].useService(this.service);
      }
    }

    this.prepared = true;

    // Last but not least give each addon a chance to
    // establish a connection to each downstream service.
    this.downstreamServices.forEach((service) => {
      for (const addon in this.addons) {
        if (this.addons[addon]) {
          this.addons[addon].connectToService(service);
        }
      }
    });
  }
}