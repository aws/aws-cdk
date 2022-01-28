import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
import { IEnvironment } from './environment';
import { EnvironmentCapacityType, ServiceBuild } from './extensions/extension-interfaces';
import { ServiceDescription } from './service-description';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from 'constructs';

/**
 * connectToProps will have all the extra parameters which are required for connecting services.
 */
export interface ConnectToProps {
  /**
   * local_bind_port is the local port that this application should
   * use when calling the upstream service in ECS Consul Mesh Extension
   * Currently, this parameter will only be used in the ECSConsulMeshExtension
   * https://github.com/aws-ia/ecs-consul-mesh-extension
   */
  readonly local_bind_port?: number;
}

/**
 * The settings for an ECS Service.
 */
export interface ServiceProps {
  /**
   * The ServiceDescription used to build the service.
   */
  readonly serviceDescription: ServiceDescription;

  /**
   * The environment to launch the service in.
   */
  readonly environment: IEnvironment

  /**
   * The name of the IAM role that grants containers in the task permission to call AWS APIs on your behalf.
   *
   * @default - A task role is automatically created for you.
   */
  readonly taskRole?: iam.IRole;

  /**
   * The desired number of instantiations of the task definition to keep running on the service.
   *
   * @default - When creating the service, default is 1; when updating the service, default uses
   * the current task number.
   */
  readonly desiredCount?: number;

  /**
   * The options for configuring the auto scaling target.
   *
   * @default none
   */
  readonly autoScaleTaskCount?: AutoScalingOptions;
}

export interface AutoScalingOptions {
  /**
   * The minimum number of tasks when scaling in.
   *
   * @default - 1
   */
  readonly minTaskCount?: number;

  /**
    * The maximum number of tasks when scaling out.
    */
  readonly maxTaskCount: number;

  /**
   * The target value for CPU utilization across all tasks in the service.
   */
  readonly targetCpuUtilization?: number;

  /**
   * The target value for memory utilization across all tasks in the service.
   */
  readonly targetMemoryUtilization?: number;
}

/**
 * This Service construct serves as a Builder class for an ECS service. It
 * supports various extensions and keeps track of any mutating state, allowing
 * it to build up an ECS service progressively.
 */
export class Service extends Construct {
  /**
   * The underlying ECS service that was created.
   */
  public ecsService!: ecs.Ec2Service | ecs.FargateService;

  /**
   * The name of the service.
   */
  public readonly id: string;

  /**
   * The VPC where this service should be placed.
   */
  public readonly vpc: ec2.IVpc;

  /**
   * The cluster that is providing capacity for this service.
   * [disable-awslint:ref-via-interface]
   */
  public readonly cluster: ecs.ICluster;

  /**
   * The capacity type that this service will use.
   * Valid values are EC2 or FARGATE.
   */
  public readonly capacityType: EnvironmentCapacityType;

  /**
   * The ServiceDescription used to build this service.
   */
  public readonly serviceDescription: ServiceDescription;

  /**
   * The environment where this service was launched.
   */
  public readonly environment: IEnvironment;

  /**
   * The scalable attribute representing task count.
   */
  public readonly scalableTaskCount?: ecs.ScalableTaskCount;

  /**
   * The flag to track if auto scaling policies have been configured
   * for the service.
   */
  private autoScalingPoliciesEnabled: boolean = false;

  /**
   * The generated task definition for this service. It is only
   * generated after .prepare() has been executed.
   */
  protected taskDefinition!: ecs.TaskDefinition;

  /**
   * The list of URLs associated with this service.
   */
  private urls: Record<string, string> = {};

  private readonly scope: Construct;

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

      // Allow user to pre-define the taskRole so that it can be used in resource policies that may
      // be defined before the ECS service exists in a CDK application
      taskRole: props.taskRole,

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
      desiredCount: props.desiredCount ?? 1,
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

    // Set desiredCount to `undefined` if auto scaling is configured for the service
    if (props.autoScaleTaskCount || this.autoScalingPoliciesEnabled) {
      serviceProps = {
        ...serviceProps,
        desiredCount: undefined,
      };
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

    // Create the auto scaling target and configure target tracking policies after the service is created
    if (props.autoScaleTaskCount) {
      this.scalableTaskCount = this.ecsService.autoScaleTaskCount({
        maxCapacity: props.autoScaleTaskCount.maxTaskCount,
        minCapacity: props.autoScaleTaskCount.minTaskCount,
      });

      if (props.autoScaleTaskCount.targetCpuUtilization) {
        const targetCpuUtilizationPercent = props.autoScaleTaskCount.targetCpuUtilization;
        this.scalableTaskCount.scaleOnCpuUtilization(`${this.id}-target-cpu-utilization-${targetCpuUtilizationPercent}`, {
          targetUtilizationPercent: targetCpuUtilizationPercent,
        });
        this.enableAutoScalingPolicy();
      }

      if (props.autoScaleTaskCount.targetMemoryUtilization) {
        const targetMemoryUtilizationPercent = props.autoScaleTaskCount.targetMemoryUtilization;
        this.scalableTaskCount.scaleOnMemoryUtilization(`${this.id}-target-memory-utilization-${targetMemoryUtilizationPercent}`, {
          targetUtilizationPercent: targetMemoryUtilizationPercent,
        });
        this.enableAutoScalingPolicy();
      }
    }

    // Now give all extensions a chance to use the service
    for (const extensions in this.serviceDescription.extensions) {
      if (this.serviceDescription.extensions[extensions]) {
        this.serviceDescription.extensions[extensions].useService(this.ecsService);
      }
    }

    // Error out if the auto scaling target is created but no scaling policies have been configured
    if (this.scalableTaskCount && !this.autoScalingPoliciesEnabled) {
      throw Error(`The auto scaling target for the service '${this.id}' has been created but no auto scaling policies have been configured.`);
    }
  }

  /**
   * Tell extensions from one service to connect to extensions from
   * another sevice if they have implemented a hook for it.
   *
   * @param service
   */
  public connectTo(service: Service, connectToProps: ConnectToProps = {}) {
    for (const extensions in this.serviceDescription.extensions) {
      if (this.serviceDescription.extensions[extensions]) {
        this.serviceDescription.extensions[extensions].connectToService(service, connectToProps);
      }
    }
  }

  /**
   * This method adds a new URL for the service. This allows extensions to
   * submit a URL for the service. For example, a load balancer might add its
   * URL, or App Mesh can add its DNS name for the service.
   *
   * @param urlName - The identifier name for this URL
   * @param url - The URL itself.
   */
  public addURL(urlName: string, url: string) {
    this.urls[urlName] = url;
  }

  /**
   * Retrieve a URL for the service. The URL must have previously been
   * stored by one of the URL providing extensions.
   *
   * @param urlName - The URL to look up.
   */
  public getURL(urlName: string) {
    if (!this.urls[urlName]) {
      throw new Error(`Unable to find a URL with name '${urlName}'`);
    }

    return this.urls[urlName];
  }

  /**
   * This helper method is used to set the `autoScalingPoliciesEnabled` attribute
   * whenever an auto scaling policy is configured for the service.
   */
  public enableAutoScalingPolicy() {
    this.autoScalingPoliciesEnabled = true;
  }
}
