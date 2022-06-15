import * as ecs from '@aws-cdk/aws-ecs';
import * as awslogs from '@aws-cdk/aws-logs';
import * as cdk from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { Construct, Node } from 'constructs';
import { Service } from '../service';
import { ServiceExtension } from './extension-interfaces';

/**
 * Setting for the main application container of a service.
 */
export interface ContainerExtensionProps {
  /**
   * How much CPU the container requires.
   */
  readonly cpu: number,

  /**
   * How much memory in megabytes the container requires.
   */
  readonly memoryMiB: number,

  /**
   * The image to run.
   */
  readonly image: ecs.ContainerImage,

  /**
   * What port the image listen for traffic on.
   */
  readonly trafficPort: number,

  /**
   * Environment variables to pass into the container.
   *
   * @default - No environment variables.
   */
  readonly environment?: {
    [key: string]: string,
  }

  /**
   * The log group into which application container logs should be routed.
   *
   * @default - A log group is automatically created for you if the `ECS_SERVICE_EXTENSIONS_ENABLE_DEFAULT_LOG_DRIVER` feature flag is set.
   */
  readonly logGroup?: awslogs.ILogGroup;
}

/**
 * The main container of a service. This is generally the container
 * which runs your application business logic. Other extensions will attach
 * sidecars alongside this main container.
 */
export class Container extends ServiceExtension {
  /**
   * The port on which the container expects to receive network traffic
   */
  public readonly trafficPort: number;

  /**
   * The log group into which application container logs should be routed.
   */
  public logGroup?: awslogs.ILogGroup;

  /**
   * The settings for the container.
   */
  private props: ContainerExtensionProps;

  constructor(props: ContainerExtensionProps) {
    super('service-container');
    this.props = props;
    this.trafficPort = props.trafficPort;
    this.logGroup = props.logGroup;
  }

  public prehook(service: Service, scope: Construct) {
    this.parentService = service;
    this.scope = scope;
  }

  // This hook sets the overall task resource requirements to the
  // resource requirements of the application itself.
  public modifyTaskDefinitionProps(props: ecs.TaskDefinitionProps): ecs.TaskDefinitionProps {
    return {
      ...props,
      cpu: this.props.cpu.toString(),
      memoryMiB: this.props.memoryMiB.toString(),
    } as ecs.TaskDefinitionProps;
  }

  // This hook adds the application container to the task definition.
  public useTaskDefinition(taskDefinition: ecs.TaskDefinition) {
    let containerProps = {
      image: this.props.image,
      cpu: Number(this.props.cpu),
      memoryLimitMiB: Number(this.props.memoryMiB),
      environment: this.props.environment,
    } as ecs.ContainerDefinitionOptions;

    // Let other extensions mutate the container definition. This is
    // used by extensions which want to add environment variables, modify
    // logging parameters, etc.
    this.containerMutatingHooks.forEach((hookProvider) => {
      containerProps = hookProvider.mutateContainerDefinition(containerProps);
    });

    // If no observability extensions have been added to the service description then we can configure the `awslogs` log driver
    if (!containerProps.logging) {
      // Create a log group for the service if one is not provided by the user (only if feature flag is set)
      if (!this.logGroup && Node.of(this.parentService).tryGetContext(cxapi.ECS_SERVICE_EXTENSIONS_ENABLE_DEFAULT_LOG_DRIVER)) {
        this.logGroup = new awslogs.LogGroup(this.scope, `${this.parentService.id}-logs`, {
          logGroupName: `${this.parentService.id}-logs`,
          removalPolicy: cdk.RemovalPolicy.DESTROY,
          retention: awslogs.RetentionDays.ONE_MONTH,
        });
      }

      if (this.logGroup) {
        containerProps = {
          ...containerProps,
          logging: new ecs.AwsLogDriver({
            streamPrefix: this.parentService.id,
            logGroup: this.logGroup,
          }),
        };
      }
    } else {
      if (this.logGroup) {
        throw Error(`Log configuration already specified. You cannot provide a log group for the application container of service '${this.parentService.id}' while also adding log configuration separately using service extensions.`);
      }
    }
    this.container = taskDefinition.addContainer('app', containerProps);

    // Create a port mapping for the container
    this.container.addPortMappings({
      containerPort: this.trafficPort,
    });

    // Raise the ulimits for this main application container
    // so that it can handle more concurrent requests
    this.container.addUlimits({
      softLimit: 1024000,
      hardLimit: 1024000,
      name: ecs.UlimitName.NOFILE,
    });
  }

  public resolveContainerDependencies() {
    if (!this.container) {
      throw new Error('The container dependency hook was called before the container was created');
    }

    const firelens = this.parentService.serviceDescription.get('firelens');
    if (firelens && firelens.container) {
      this.container.addContainerDependencies({
        container: firelens.container,
        condition: ecs.ContainerDependencyCondition.START,
      });
    }

    const appmeshextension = this.parentService.serviceDescription.get('appmesh');
    if (appmeshextension && appmeshextension.container) {
      this.container.addContainerDependencies({
        container: appmeshextension.container,
        condition: ecs.ContainerDependencyCondition.HEALTHY,
      });
    }

    const cloudwatchextension = this.parentService.serviceDescription.get('cloudwatchAgent');
    if (cloudwatchextension && cloudwatchextension.container) {
      this.container.addContainerDependencies({
        container: cloudwatchextension.container,
        condition: ecs.ContainerDependencyCondition.START,
      });
    }

    const xrayextension = this.parentService.serviceDescription.get('xray');
    if (xrayextension && xrayextension.container) {
      this.container.addContainerDependencies({
        container: xrayextension.container,
        condition: ecs.ContainerDependencyCondition.HEALTHY,
      });
    }
  }
}
