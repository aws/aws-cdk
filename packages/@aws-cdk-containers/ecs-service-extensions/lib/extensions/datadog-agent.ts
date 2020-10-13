import * as ecs from '@aws-cdk/aws-ecs';
import * as secretsManager from '@aws-cdk/aws-secretsmanager';
import * as cdk from '@aws-cdk/core';
import { Service } from '../service';
import { Container } from './container';
import { ContainerMutatingHook, ServiceExtension } from './extension-interfaces';

const DATADOG_AGENT_IMAGE = 'datadog/agent:latest';

/**
 * Settings for the client SDK inside the primary container of the service
 */
export interface DatadogClientProps {
  /**
   * Whether or not to enable trace analytics
   */
  readonly traceAnalyticsEnabled: boolean;
}

/**
 * This hook modifies the application container's settings for the
 * Datadog client SDK
 */
export class DatadogAgentMutatingHook extends ContainerMutatingHook {
  private props: DatadogClientProps;

  constructor(props: DatadogClientProps) {
    super();
    this.props = props;
  }

  // Modify the environment variables for the primary container
  // so that the Datadog client SDK inside the primary container
  // has the right settings.
  public mutateContainerDefinition(props: ecs.ContainerDefinitionOptions) {
    let environment = props.environment || {};

    if (this.props.traceAnalyticsEnabled) {
      environment.DD_TRACE_ANALYTICS_ENABLED = 'true';
    }

    return {
      ...props,
      environment,
    } as ecs.ContainerDefinitionOptions;
  }
}

/**
 * Settings for the Datadog agent
 **/
export interface DatadogExtensionProps {
  /**
   * Whether or not to enable APM tracing
   * @default false
   */
  readonly apmEnabled?: boolean,

  /**
   * Whether or not to enable trace analytics
   * @default false
   */
  readonly traceAnalyticsEnabled?: boolean

  /**
   * An ecs.Secret that is storing the Datadog API key.
   */
  readonly datadogApiKey: ecs.Secret
}

/**
 * This extension adds a Datadog agent to the task definition and
 * configures the primary container to be able to connect to it
 */
export class DatadogAgentExtension extends ServiceExtension {
  private apmEnabled: boolean;
  private traceAnalyticsEnabled: boolean;
  private datadogApiKey: ecs.Secret;

  constructor(props: DatadogExtensionProps) {
    super('datadogAgent');

    if (props.apmEnabled === undefined) {
      this.apmEnabled = false;
    } else {
      this.apmEnabled = props.apmEnabled;
    }

    if (props.traceAnalyticsEnabled === undefined) {
      this.traceAnalyticsEnabled = false;
    } else {
      this.traceAnalyticsEnabled = props.traceAnalyticsEnabled;
    }

    this.datadogApiKey = props.datadogApiKey;
  }

  public prehook(service: Service, scope: cdk.Construct) {
    this.parentService = service;
    this.scope = scope;
  }

  // If some of the Datadog settings require setting env variables on the
  // Datadog client side SDK, then attach a mutating hook to the primary
  // container to do that.
  public addHooks() {
    if (!this.traceAnalyticsEnabled) {
      return;
    }

    const container = this.parentService.serviceDescription.get('service-container') as Container;

    if (!container) {
      throw new Error('Firelens extension requires an application extension');
    }

    container.addContainerMutatingHook(new DatadogAgentMutatingHook({
      traceAnalyticsEnabled: this.traceAnalyticsEnabled,
    }));
  }

  // This hook adds and configures the Datadog agent in the task.
  public useTaskDefinition(taskDefinition: ecs.TaskDefinition) {
    let envVariables: any = {};

    if (this.apmEnabled) {
      envVariables.DD_APM_ENABLED = 'true';
    }

    // Add the Datadog Agent to this task
    this.container = taskDefinition.addContainer('datadog-agent', {
      image: ecs.ContainerImage.fromRegistry(DATADOG_AGENT_IMAGE),
      environment: envVariables,
      logging: new ecs.AwsLogDriver({ streamPrefix: 'datadog-agent' }),
      user: '0:1338', // Ensure that agent outbound traffic doesn't go through proxy
      memoryReservationMiB: 50,
      secrets: {
        DD_API_KEY: this.datadogApiKey,
      },
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