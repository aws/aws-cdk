import * as ecs from '@aws-cdk/aws-ecs';
import * as awslogs from '@aws-cdk/aws-logs';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Service } from '../service';
import { Container } from './container';
import { ContainerMutatingHook, ServiceExtension } from './extension-interfaces';

/**
 * Settings for the hook which mutates the application container
 * to route logs through FireLens
 */
export interface FirelensProps {
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
export class FirelensMutatingHook extends ContainerMutatingHook {
  private parentService: Service;
  private logGroup: awslogs.LogGroup;

  constructor(props: FirelensProps) {
    super();
    this.parentService = props.parentService;
    this.logGroup = props.logGroup;
  }

  public mutateContainerDefinition(props: ecs.ContainerDefinitionOptions): ecs.ContainerDefinitionOptions {
    return {
      ...props,

      logging: ecs.LogDrivers.firelens({
        options: {
          Name: 'cloudwatch',
          region: cdk.Stack.of(this.parentService).region,
          log_group_name: this.logGroup.logGroupName,
          log_stream_prefix: `${this.parentService.id}/`,
        },
      }),
    } as ecs.ContainerDefinitionOptions;
  }
}

/**
 * This extension adds a FluentBit log router to the task definition
 * and does all the configuration necessarily to enable log routing
 * for the task using FireLens
 */
export class FireLensExtension extends ServiceExtension {
  private logGroup!: awslogs.LogGroup;

  constructor() {
    super('firelens');
  }

  public prehook(service: Service, scope: Construct) {
    this.parentService = service;

    // Create a log group for the service, into which FireLens
    // will route the service's logs
    this.logGroup = new awslogs.LogGroup(scope, `${service.id}-logs`, {
      logGroupName: `${service.id}-logs`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      retention: awslogs.RetentionDays.ONE_WEEK,
    });
  }

  // Add hooks to the main application extension so that it is modified to
  // have logging properties that enable sending logs via the
  // Firelens log router container
  public addHooks() {
    const container = this.parentService.serviceDescription.get('service-container') as Container;

    if (!container) {
      throw new Error('Firelens extension requires an application extension');
    }

    container.addContainerMutatingHook(new FirelensMutatingHook({
      parentService: this.parentService,
      logGroup: this.logGroup,
    }));
  }

  public useTaskDefinition(taskDefinition: ecs.TaskDefinition) {
    // Manually add a firelens log router, so that we can manually manage the dependencies
    // to ensure that the Firelens log router depends on the Envoy proxy
    this.container = taskDefinition.addFirelensLogRouter('firelens', {
      image: ecs.obtainDefaultFluentBitECRImage(taskDefinition, {
        logDriver: 'awsfirelens',
        options: {
          Name: 'cloudwatch',
        },
      }),
      firelensConfig: {
        type: ecs.FirelensLogRouterType.FLUENTBIT,
      },
      logging: new ecs.AwsLogDriver({ streamPrefix: 'firelens' }),
      memoryReservationMiB: 50,
      user: '0:1338', // Give Firelens a group ID that allows its outbound logs to bypass Envoy
    });
  }

  public resolveContainerDependencies() {
    if (!this.container) {
      throw new Error('The container dependency hook was called before the container was created');
    }

    const appmeshextension = this.parentService.serviceDescription.get('appmesh');
    if (appmeshextension && appmeshextension.container) {
      this.container.addContainerDependencies({
        container: appmeshextension.container,
        condition: ecs.ContainerDependencyCondition.HEALTHY,
      });
    }
  }
}