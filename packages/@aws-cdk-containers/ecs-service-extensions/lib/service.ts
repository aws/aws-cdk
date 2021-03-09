import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as cdk from '@aws-cdk/core';
import { IEnvironment } from './environment';
import { EnvironmentCapacityType, ServiceBuild } from './extensions/extension-interfaces';
import { ServiceDescription } from './service-description';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

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
  readonly environment: IEnvironment
}

/**
 * A service builder class. This construct support various extensions
 * which can construct an ECS service progressively.
 */
export class Service extends Construct {
  /**
   * The underlying ECS service that was created
   */
  public ecsService!: ecs.Ec2Service | ecs.FargateService;

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
  public readonly cluster: ecs.ICluster;

  /**
   * The capacity type that this service will use
   */
  public readonly capacityType: EnvironmentCapacityType;

  /**
   * The service description used to build this service
   */
  public readonly serviceDescription: ServiceDescription;

  /**
   * The environment this service was launched in
   */
  public readonly environment: IEnvironment;

  /**
   * The generated task definition for this service, is only
   * generated once .prepare() has been executed
   */
  protected taskDefinition!: ecs.TaskDefinition;

  /**
   * The list of URL's associated with this service
   */
  private urls: Record<string, string> = {};

  private readonly scope: cdk.Construct;

  constructor(scope: Construct, id: string, props: ServiceProps) {
    super(scope, id);

    this.scope = scope;
    this.id = id;
    this.environment = props.environment;
    this.vpc = props.environment.vpc;
    this.cluster = props.environment.cluster;
    this.capacityType = props.environment.capacityType;
    this.serviceDescription = props.serviceDescription;

    // Check to make sure that the user has actually added a container
    const containerextension = this.serviceDescription.get('service-container');

    if (!containerextension) {
      throw new Error(`Service '${this.id}' must have a Container extension`);
    }

    // First set the scope for all the extensions
    for (const extensions in this.serviceDescription.extensions) {
      if (this.serviceDescription.extensions[extensions]) {
        this.serviceDescription.extensions[extensions].prehook(this, this.scope);
      }
    }

    // At the point of preparation all extensions have been defined on the service
    // so give each extension a chance to now add hooks to other extensions if
    // needed
    for (const extensions in this.serviceDescription.extensions) {
      if (this.serviceDescription.extensions[extensions]) {
        this.serviceDescription.extensions[extensions].addHooks();
      }
    }

    // Give each extension a chance to mutate the task def creation properties
    let taskDefProps = {
      // Default CPU and memory
      cpu: '256',
      memory: '512',

      // Ensure that the task definition supports both EC2 and Fargate
      compatibility: ecs.Compatibility.EC2_AND_FARGATE,
    } as ecs.TaskDefinitionProps;

    for (const extensions in this.serviceDescription.extensions) {
      if (this.serviceDescription.extensions[extensions]) {
        taskDefProps = this.serviceDescription.extensions[extensions].modifyTaskDefinitionProps(taskDefProps);
      }
    }

    // Now that the task definition properties are assembled, create it
    this.taskDefinition = new ecs.TaskDefinition(this.scope, `${this.id}-task-definition`, taskDefProps);

    // Now give each extension a chance to use the task definition
    for (const extensions in this.serviceDescription.extensions) {
      if (this.serviceDescription.extensions[extensions]) {
        this.serviceDescription.extensions[extensions].useTaskDefinition(this.taskDefinition);
      }
    }

    // Now that all containers are created, give each extension a chance
    // to bake its dependency graph
    for (const extensions in this.serviceDescription.extensions) {
      if (this.serviceDescription.extensions[extensions]) {
        this.serviceDescription.extensions[extensions].resolveContainerDependencies();
      }
    }

    // Give each extension a chance to mutate the service props before
    // service creation
    let serviceProps = {
      cluster: this.cluster,
      taskDefinition: this.taskDefinition,
      minHealthyPercent: 100,
      maxHealthyPercent: 200,
      desiredCount: 1,
    } as ServiceBuild;

    for (const extensions in this.serviceDescription.extensions) {
      if (this.serviceDescription.extensions[extensions]) {
        serviceProps = this.serviceDescription.extensions[extensions].modifyServiceProps(serviceProps);
      }
    }

    // If a maxHealthyPercent and desired count has been set while minHealthyPercent == 100% then we
    // need to do some failsafe checking to ensure that the maxHealthyPercent
    // actually allows a rolling deploy. Otherwise it is possible to end up with
    // blocked deploys that can take no action because minHealtyhPercent == 100%
    // prevents running, healthy tasks from being stopped, but a low maxHealthyPercent
    // can also prevents new parallel tasks from being started.
    if (serviceProps.maxHealthyPercent && serviceProps.desiredCount && serviceProps.minHealthyPercent && serviceProps.minHealthyPercent == 100) {
      if (serviceProps.desiredCount == 1) {
        // If there is one task then we must allow max percentage to be at
        // least 200% for another replacement task to be added
        serviceProps = {
          ...serviceProps,
          maxHealthyPercent: Math.max(200, serviceProps.maxHealthyPercent),
        };
      } else if (serviceProps.desiredCount <= 3) {
        // If task count is 2 or 3 then max percent must be at least 150% to
        // allow one replacement task to be launched at a time.
        serviceProps = {
          ...serviceProps,
          maxHealthyPercent: Math.max(150, serviceProps.maxHealthyPercent),
        };
      } else {
        // For anything higher than 3 tasks set max percent to at least 125%
        // For 4 tasks this will allow exactly one extra replacement task
        // at a time, for any higher task count it will allow 25% of the tasks
        // to be replaced at a time.
        serviceProps = {
          ...serviceProps,
          maxHealthyPercent: Math.max(125, serviceProps.maxHealthyPercent),
        };
      }
    }

    // Now that the service props are determined we can create
    // the service
    if (this.capacityType === EnvironmentCapacityType.EC2) {
      this.ecsService = new ecs.Ec2Service(this.scope, `${this.id}-service`, serviceProps);
    } else if (this.capacityType === EnvironmentCapacityType.FARGATE) {
      this.ecsService = new ecs.FargateService(this.scope, `${this.id}-service`, serviceProps);
    } else {
      throw new Error(`Unknown capacity type for service ${this.id}`);
    }

    // Now give all extensions a chance to use the service
    for (const extensions in this.serviceDescription.extensions) {
      if (this.serviceDescription.extensions[extensions]) {
        this.serviceDescription.extensions[extensions].useService(this.ecsService);
      }
    }
  }

  /**
   * Tell extensions from one service to connect to extensions from
   * another sevice if they have implemented a hook for that.
   * @param service
   */
  public connectTo(service: Service) {
    for (const extensions in this.serviceDescription.extensions) {
      if (this.serviceDescription.extensions[extensions]) {
        this.serviceDescription.extensions[extensions].connectToService(service);
      }
    }
  }

  /**
   * This method adds a new URL for the service. This allows extensions
   * to submit a URL for the service, for example LB might add its URL
   * or App Mesh can add its DNS name for the service.
   * @param urlName - The identifier name for this URL
   * @param url - The URL itself.
   */
  public addURL(urlName: string, url: string) {
    this.urls[urlName] = url;
  }

  /**
   * Retrieve a URL for the service. The URL must have previously been
   * stored by one of the URL providing extensions.
   * @param urlName - The URL to look up.
   */
  public getURL(urlName: string) {
    if (!this.urls[urlName]) {
      throw new Error(`Unable to find a URL with name '${urlName}'`);
    }

    return this.urls[urlName];
  }
}