import { Construct } from 'constructs';
import { ISecurityGroup, SubnetSelection } from '../../../aws-ec2';
import { FargateService, FargateTaskDefinition, HealthCheck } from '../../../aws-ecs';
import { FeatureFlags, Token } from '../../../core';
import * as cxapi from '../../../cx-api';
import { ApplicationLoadBalancedServiceBase, ApplicationLoadBalancedServiceBaseProps } from '../base/application-load-balanced-service-base';
import { FargateServiceBaseProps } from '../base/fargate-service-base';
/**
 * The properties for the ApplicationLoadBalancedFargateService service.
 */
export interface ApplicationLoadBalancedFargateServiceProps extends ApplicationLoadBalancedServiceBaseProps, FargateServiceBaseProps {
  /**
   * Determines whether the service will be assigned a public IP address.
   *
   * @default false
   */
  readonly assignPublicIp?: boolean;

  /**
   * The subnets to associate with the service.
   *
   * @default - Public subnets if `assignPublicIp` is set, otherwise the first available one of Private, Isolated, Public, in that order.
   */
  readonly taskSubnets?: SubnetSelection;

  /**
   * The security groups to associate with the service. If you do not specify a security group, a new security group is created.
   *
   * @default - A new security group is created.
   */
  readonly securityGroups?: ISecurityGroup[];

  /**
   * The health check command and associated configuration parameters for the container.
   *
   * @default - Health check configuration from container.
   */
  readonly healthCheck?: HealthCheck;

  /**
   * The minimum number of CPU units to reserve for the container.
   *
   * @default - No minimum CPU units reserved.
   */
  readonly containerCpu?: number;

  /**
   * The amount (in MiB) of memory to present to the container.
   *
   * If your container attempts to exceed the allocated memory, the container
   * is terminated.
   *
   * @default - No memory limit.
   */
  readonly containerMemoryLimitMiB?: number;
}

/**
 * A Fargate service running on an ECS cluster fronted by an application load balancer.
 */
export class ApplicationLoadBalancedFargateService extends ApplicationLoadBalancedServiceBase {

  /**
   * Determines whether the service will be assigned a public IP address.
   */
  public readonly assignPublicIp: boolean;

  /**
   * The Fargate service in this construct.
   */
  public readonly service: FargateService;
  /**
   * The Fargate task definition in this construct.
   */
  public readonly taskDefinition: FargateTaskDefinition;

  /**
   * Constructs a new instance of the ApplicationLoadBalancedFargateService class.
   */
  constructor(scope: Construct, id: string, props: ApplicationLoadBalancedFargateServiceProps = {}) {
    super(scope, id, props);

    this.assignPublicIp = props.assignPublicIp ?? false;

    if (props.taskDefinition && props.taskImageOptions) {
      throw new Error('You must specify either a taskDefinition or an image, not both.');
    } else if (props.taskDefinition) {
      this.taskDefinition = props.taskDefinition;
    } else if (props.taskImageOptions) {
      this.validateHealthyPercentage('containerCpu', props.containerCpu);
      this.validateHealthyPercentage('containerMemoryLimitMiB', props.containerMemoryLimitMiB);

      this.validateNotExceeding('containerCpu', props.cpu ?? 256, props.containerCpu);
      this.validateNotExceeding('containerMemoryLimitMiB', props.memoryLimitMiB ?? 512, props.containerMemoryLimitMiB);

      const taskImageOptions = props.taskImageOptions;
      this.taskDefinition = new FargateTaskDefinition(this, 'TaskDef', {
        memoryLimitMiB: props.memoryLimitMiB,
        cpu: props.cpu,
        ephemeralStorageGiB: props.ephemeralStorageGiB,
        executionRole: taskImageOptions.executionRole,
        taskRole: taskImageOptions.taskRole,
        family: taskImageOptions.family,
        runtimePlatform: props.runtimePlatform,
      });

      // Create log driver if logging is enabled
      const enableLogging = taskImageOptions.enableLogging ?? true;
      const logDriver = taskImageOptions.logDriver !== undefined
        ? taskImageOptions.logDriver : enableLogging
          ? this.createAWSLogDriver(this.node.id) : undefined;

      const containerName = taskImageOptions.containerName ?? 'web';
      const container = this.taskDefinition.addContainer(containerName, {
        image: taskImageOptions.image,
        healthCheck: props.healthCheck,
        logging: logDriver,
        environment: taskImageOptions.environment,
        secrets: taskImageOptions.secrets,
        dockerLabels: taskImageOptions.dockerLabels,
        command: taskImageOptions.command,
        entryPoint: taskImageOptions.entryPoint,
        cpu: props.containerCpu,
        memoryLimitMiB: props.containerMemoryLimitMiB,
      });
      container.addPortMappings({
        containerPort: taskImageOptions.containerPort || 80,
      });
    } else {
      throw new Error('You must specify one of: taskDefinition or image');
    }

    this.validateHealthyPercentage('minHealthyPercent', props.minHealthyPercent);
    this.validateHealthyPercentage('maxHealthyPercent', props.maxHealthyPercent);

    if (
      props.minHealthyPercent &&
      !Token.isUnresolved(props.minHealthyPercent) &&
      props.maxHealthyPercent &&
      !Token.isUnresolved(props.maxHealthyPercent) &&
      props.minHealthyPercent >= props.maxHealthyPercent
    ) {
      throw new Error('Minimum healthy percent must be less than maximum healthy percent.');
    }

    const desiredCount = FeatureFlags.of(this).isEnabled(cxapi.ECS_REMOVE_DEFAULT_DESIRED_COUNT) ? this.internalDesiredCount : this.desiredCount;

    this.service = new FargateService(this, 'Service', {
      cluster: this.cluster,
      desiredCount: desiredCount,
      taskDefinition: this.taskDefinition,
      assignPublicIp: this.assignPublicIp,
      serviceName: props.serviceName,
      healthCheckGracePeriod: props.healthCheckGracePeriod,
      minHealthyPercent: props.minHealthyPercent,
      maxHealthyPercent: props.maxHealthyPercent,
      propagateTags: props.propagateTags,
      enableECSManagedTags: props.enableECSManagedTags,
      cloudMapOptions: props.cloudMapOptions,
      platformVersion: props.platformVersion,
      deploymentController: props.deploymentController,
      circuitBreaker: props.circuitBreaker,
      securityGroups: props.securityGroups,
      vpcSubnets: props.taskSubnets,
      enableExecuteCommand: props.enableExecuteCommand,
      capacityProviderStrategies: props.capacityProviderStrategies,
    });
    this.addServiceAsTarget(this.service);
  }

  /**
   * Throws an error if the specified percent is not an integer or negative.
   */
  private validateHealthyPercentage(name: string, value?: number) {
    if (value === undefined || Token.isUnresolved(value)) { return; }
    if (!Number.isInteger(value) || value < 0) {
      throw new Error(`${name}: Must be a non-negative integer; received ${value}`);
    }
  }

  /**
   * Throws an error if the specified value is greater than the limit.
   */
  private validateNotExceeding(name: string, limit: number, value?: number) {
    if (value === undefined || Token.isUnresolved(value)) { return; }
    if (value > limit) {
      throw new Error(`${name}: Must be less than or equal to ${limit}; received ${value}`);
    }
  }
}
