import * as ecs from '@aws-cdk/aws-ecs';
import * as awslogs from '@aws-cdk/aws-logs';
import { Service } from '../service';
import { Container } from './container';
import { ContainerMutatingHook, ServiceExtension } from './extension-interfaces';
import { Construct } from '@aws-cdk/core';

/**
 * Settings for the hook which mutates the application container
 * to send logs to CloudWatch Logs
 */
export interface CloudWatchLogsProps {
  /**
   * The parent service that is being mutated
   */
  readonly parentService: Service;

  /**
   * The log group into which logs should be routed
   */
  readonly logGroup: awslogs.LogGroup;
}

/**
 * This hook modifies the application container's settings so that
 * it routes logs using FireLens
 */
export class CloudWatchLogsMutatingHook extends ContainerMutatingHook {
  private parentService: Service;
  private logGroup: awslogs.LogGroup;

  constructor(props: CloudWatchLogsProps) {
    super();
    this.parentService = props.parentService;
    this.logGroup = props.logGroup;
  }

  public mutateContainerDefinition(props: ecs.ContainerDefinitionOptions) {
    return {
      ...props,
      logging: new ecs.AwsLogDriver({
        streamPrefix: this.parentService.id,
        logGroup: this.logGroup,
      }),
    } as ecs.ContainerDefinitionOptions;
  }
}

/**
 * Settings for the hook which mutates the application container
 * to send logs to CloudWatch Logs
 */
export interface CloudWatchLogsExtensionProps {
  /**
   * The log group into which logs should be routed
   */
  readonly logGroup: awslogs.LogGroup;
}

/**
 * This extension modifies a service to send its application logs to CloudWatch
 * logs
 */
export class CloudWatchLogsExtension extends ServiceExtension {
  private logGroup?: awslogs.LogGroup;

  constructor(props?: CloudWatchLogsExtensionProps) {
    super('cloudwatch-logs');

    // Create a log group for the service, into which we will
    // route the service's logs
    if (props && props.logGroup) {
      this.logGroup = props.logGroup;
    }
  }

  public prehook(service: Service, scope: Construct) {
    this.parentService = service;

    if (!this.logGroup) {
      // If the user did not manually pass a log group in then create one for them
      this.logGroup = new awslogs.LogGroup(scope, `${service.id}-logs`);
    }
  }

  // Add hooks to the main application extension so that it is modified to
  // have logging properties that enable sending logs to CloudWatch
  public addHooks() {
    const container = this.parentService.serviceDescription.get('service-container') as Container;

    if (this.logGroup) {
      container.addContainerMutatingHook(new CloudWatchLogsMutatingHook({
        parentService: this.parentService,
        logGroup: this.logGroup,
      }));
    }
  }
}
