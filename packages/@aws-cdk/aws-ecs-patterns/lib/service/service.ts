import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as cdk from '@aws-cdk/core';
import { ServiceAddon, ServiceBuild, TaskDefinitionBuild } from './addons/addon-interfaces';

/**
 * The settings for an ECS Service
 */
export interface ServiceProps {
  /**
   * The VPC used by the service for networking
   */
  readonly vpc: ec2.IVpc,

  /**
   * The ECS cluster which provides compute capacity to this service
   */
  readonly cluster: ecs.ICluster
}
/**
 * A service builder class. This construct support various addons
 * which can construct an ECS service progressively.
 */
export class Service extends cdk.Construct {
  /**
   * The underlying ECS service that was created
   */
  public service!: ecs.Ec2Service;

  /**
   * The name of this service
   */
  public readonly id: string;

  /**
   * The VPC into which this service should be placed
   */
  public readonly vpc: ec2.IVpc;

  /**
   * The cluster that is providing capacity for this service
   */
  public readonly cluster: ecs.ICluster;

  /**
   * The generated task definition for this service, is only
   * generated once .prepare() has been executed
   */
  protected taskDefinition!: ecs.Ec2TaskDefinition;

  /**
   * The list of addons that have been registered to run when
   * preparing this service.
   */
  private addons: Record<string, ServiceAddon>;

  // Whether or not this service has been prepared. This is used
  // for dependency resolution. Sometimes the preparation of one service
  // requires preparing other services recursively. In the case of
  // a circular dependency this flag prevents infinite recursion.
  private _prepared: boolean;

  // A list of downstream services, allows addons to
  // establish connections to other services
  private downstreamServices: Service[];

  private readonly scope: cdk.Construct;

  constructor(scope: cdk.Construct, id: string, props: ServiceProps) {
    super(scope, id);

    this.scope = scope;
    this.id = id;
    this.vpc = props.vpc;
    this.cluster = props.cluster;
    this.addons = {};
    this.downstreamServices = [];
    this._prepared = false;
  }

  /**
   * Adds a new addon to the service. The addon mutates the results service
   * to add resources or features to the service
   * @param addon - The addon that you wish to add
   */
  public add(addon: ServiceAddon) {
    if (this._prepared) {
      throw new Error('This service has already been prepared, new addons can not be added now');
    }

    if (this.addons[addon.name]) {
      throw new Error(`The addon ${addon.name} has already been added`);
    }

    this.addons[addon.name] = addon;

    if (addon.prehook) {
      addon.prehook(this, this.scope);
    }

    return this;
  }

  /**
   * Tell addons from one service to connect to addons from
   * another sevice if they have implemented a hook for that.
   * @param service
   */
  public connectTo(service: Service) {
    this.downstreamServices.push(service);
  }

  /**
   * Get the addon with a specific name. This is generally used for
   * addons to discover each other's existence.
   * @param name
   */
  public getAddon(name: string) {
    return this.addons[name];
  }

  /**
   * Build the service, running all addon hooks to generate the
   * settings and resources required for the service to operate
   */
  public prepare() {
    if (this._prepared) {
      return; // Already prepared
    }

    // Check to make sure that the user has actually added a container
    const containerAddon = this.getAddon('service-container');

    if (!containerAddon) {
      throw new Error(`Service '${this.id}' must have a Container addon`);
    }

    // At the point of preparation all addons have been defined on the service
    // so give each addon a chance to now add hooks to other addons if
    // needed
    for (const addon in this.addons) {
      if (this.addons[addon]) {
        this.addons[addon].addHooks();
      }
    }

    // Give each addon a chance to mutate the task def creation properties
    let taskDefProps = {
      cpu: '256',
      memory: '512',
    } as TaskDefinitionBuild;

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

    // Give each addon a chance to mutate the service props before
    // service creation
    let serviceProps = {
      cluster: this.cluster,
      taskDefinition: this.taskDefinition,
    } as ServiceBuild;

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

    this._prepared = true;

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

  /**
   * Getter for checking to see whether this service has already been prepared
   */
  public get prepared() {
    return this._prepared;
  }
}