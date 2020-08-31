import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as cdk from '@aws-cdk/core';
import { EnvironmentCapacityType, ServiceBuild } from './addons/addon-interfaces';
import { Environment } from './environment';
import { ServiceDescription } from './service-description';

/**
 * The settings for an ECS Service
 */
export interface ServiceProps {
  /**
   * A service description to use in building out the service
   */
  readonly serviceDescription: ServiceDescription;

  /**
   * The environment to launch the service in
   */
  readonly environment: Environment
}

/**
 * A service builder class. This construct support various addons
 * which can construct an ECS service progressively.
 */
export class Service extends cdk.Construct {
  /**
   * The underlying ECS service that was created
   */
  public service!: ecs.Ec2Service | ecs.FargateService;

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
   * [disable-awslint:ref-via-interface]
   */
  public readonly cluster: ecs.Cluster;

  /**
   * The capacity type that this service will use
   */
  public readonly capacityType: EnvironmentCapacityType;

  /**
   * The service description used to build this service
   */
  public readonly serviceDescription: ServiceDescription;

  /**
   * The generated task definition for this service, is only
   * generated once .prepare() has been executed
   */
  protected taskDefinition!: ecs.TaskDefinition;

  // A list of downstream services, allows addons to
  // establish connections to other services
  private downstreamServices: Service[];

  private readonly scope: cdk.Construct;

  constructor(scope: cdk.Construct, id: string, props: ServiceProps) {
    super(scope, id);

    this.scope = scope;
    this.id = id;
    this.vpc = props.environment.vpc;
    this.cluster = props.environment.cluster;
    this.capacityType = props.environment.capacityType;
    this.serviceDescription = props.serviceDescription;
    this.downstreamServices = [];

    // Check to make sure that the user has actually added a container
    const containerAddon = this.serviceDescription.get('service-container');

    if (!containerAddon) {
      throw new Error(`Service '${this.id}' must have a Container addon`);
    }

    // First set the scope for all the extensions
    for (const extensions in this.serviceDescription.extensions) {
      if (this.serviceDescription.extensions[extensions]) {
        this.serviceDescription.extensions[extensions].prehook(this, this.scope);
      }
    }

    // At the point of preparation all addons have been defined on the service
    // so give each addon a chance to now add hooks to other addons if
    // needed
    for (const extensions in this.serviceDescription.extensions) {
      if (this.serviceDescription.extensions[extensions]) {
        this.serviceDescription.extensions[extensions].addHooks();
      }
    }

    // Give each addon a chance to mutate the task def creation properties
    let taskDefProps = {
      // Default CPU and memoryyarn clean
      cpu: '256',
      memory: '512',

      // Ensure that the task definition supports both EC2 and Fargate
      compatibility: ecs.Compatibility.EC2_AND_FARGATE,
    } as ecs.TaskDefinitionProps;

    for (const extensions in this.serviceDescription.extensions) {
      if (this.serviceDescription.extensions[extensions]) {
        taskDefProps = this.serviceDescription.extensions[extensions].mutateTaskDefinitionProps(taskDefProps);
      }
    }

    // Now that the task definition properties are assembled, create it
    this.taskDefinition = new ecs.TaskDefinition(this.scope, `${this.id}-task-definition`, taskDefProps);

    // Now give each addon a chance to use the task definition
    for (const extensions in this.serviceDescription.extensions) {
      if (this.serviceDescription.extensions[extensions]) {
        this.serviceDescription.extensions[extensions].useTaskDefinition(this.taskDefinition);
      }
    }

    // Now that all containers are created, give each addon a chance
    // to bake its dependency graph
    for (const extensions in this.serviceDescription.extensions) {
      if (this.serviceDescription.extensions[extensions]) {
        this.serviceDescription.extensions[extensions].bakeContainerDependencies();
      }
    }

    // Give each addon a chance to mutate the service props before
    // service creation
    let serviceProps = {
      cluster: this.cluster,
      taskDefinition: this.taskDefinition,
    } as ServiceBuild;

    for (const extensions in this.serviceDescription.extensions) {
      if (this.serviceDescription.extensions[extensions]) {
        serviceProps = this.serviceDescription.extensions[extensions].mutateServiceProps(serviceProps);
      }
    }

    // Now that the service props are determined we can create
    // the service
    if (this.capacityType === EnvironmentCapacityType.EC2) {
      this.service = new ecs.Ec2Service(this.scope, `${this.id}-service`, serviceProps);
    } else if (this.capacityType === EnvironmentCapacityType.FARGATE) {
      this.service = new ecs.FargateService(this.scope, `${this.id}-service`, serviceProps);
    } else {
      throw new Error(`Unknown capacity type for service ${this.id}`);
    }

    // Now give all addons a chance to use the service
    for (const extensions in this.serviceDescription.extensions) {
      if (this.serviceDescription.extensions[extensions]) {
        this.serviceDescription.extensions[extensions].useService(this.service);
      }
    }

    // Last but not least give each addon a chance to
    // establish a connection to each downstream service.
    this.downstreamServices.forEach((service) => {
      for (const extensions in this.serviceDescription.extensions) {
        if (this.serviceDescription.extensions[extensions]) {
          this.serviceDescription.extensions[extensions].connectToService(service);
        }
      }
    });
  }

  /**
   * Tell addons from one service to connect to addons from
   * another sevice if they have implemented a hook for that.
   * @param service
   */
  public connectTo(service: Service) {
    this.downstreamServices.push(service);
  }
}