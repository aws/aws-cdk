import * as ecs from '@aws-cdk/aws-ecs';
import { Service } from '../service';
import { Container } from './container';
import { ContainerMutatingHook, ServiceExtension } from './extension-interfaces';
import { Construct } from '@aws-cdk/core';

// The version of the Datadog Agent to add to the task
export enum DatadogAgentVersion {
  DATADOG_AGENT_7_JMX = 'public.ecr.aws/datadog/agent:7-jmx',
  DATADOG_AGENT_7 = 'public.ecr.aws/datadog/agent:7',
  DATADOG_AGENT_LATEST = 'public.ecr.aws/datadog/agent:latest',
  DATADOG_AGENT_LATEST_JMX = 'public.ecr.aws/datadog/agent:latest-jmx',
}

/**
 * Settings for the client SDK inside the primary container of the service
 */
export interface DatadogClientProps {
  /**
   * Whether or not to enable trace analytics
   */
  readonly traceAnalyticsEnabled: boolean;


  /**
   * Service name, for traces
   */
  readonly serviceName: string;
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
      environment.DD_SERVICE = this.props.serviceName;
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

  /**
   * Whether or not to capture the application logs
   */
  readonly logCaptureEnabled?: boolean

  /**
   * The version of the Datadog agent to use
   * @default - DatadogAgentVersion.DATADOG_AGENT_7
   */
  readonly agentVersion?: DatadogAgentVersion
}

/**
 * This extension adds a Datadog agent to the task definition and
 * configures the primary container to be able to connect to it
 */
export class DatadogAgent extends ServiceExtension {
  private apmEnabled: boolean;
  private traceAnalyticsEnabled: boolean;
  private datadogApiKey: ecs.Secret;
  private agentVersion: DatadogAgentVersion;

  constructor(props: DatadogExtensionProps) {
    super('datadogAgent');

    this.apmEnabled = props.apmEnabled === undefined ? false : props.apmEnabled;
    this.traceAnalyticsEnabled = props.traceAnalyticsEnabled === undefined ? false : props.traceAnalyticsEnabled;
    this.agentVersion = props.agentVersion === undefined ? DatadogAgentVersion.DATADOG_AGENT_7 : props.agentVersion;
    this.datadogApiKey = props.datadogApiKey;
  }

  public prehook(service: Service, scope: Construct) {
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

    container.addContainerMutatingHook(new DatadogAgentMutatingHook({
      traceAnalyticsEnabled: this.traceAnalyticsEnabled,
      serviceName: this.parentService.id,
    }));
  }

  // This hook adds and configures the Datadog agent in the task.
  public useTaskDefinition(taskDefinition: ecs.TaskDefinition) {
    let envVariables: any = {
      // Tag any data captured by with the name of the environment
      DD_ENV: this.parentService.environment.id,

      // This is running in an ECS/Fargate env
      ECS_FARGATE: 'true',
    };

    if (this.apmEnabled) {
      envVariables.DD_APM_ENABLED = 'true';
      envVariables.DD_APM_NON_LOCAL_TRAFFIC = 'true';
    }

    envVariables.DD_ECS_COLLECT_RESOURCE_TAGS_EC2 = 'true';

    // Add the Datadog Agent to this task
    this.container = taskDefinition.addContainer('datadog-agent', {
      image: ecs.ContainerImage.fromRegistry(this.agentVersion),
      environment: envVariables,
      logging: new ecs.AwsLogDriver({ streamPrefix: 'datadog-agent' }),
      user: '0:1338', // Ensure that agent outbound traffic doesn't go through proxy
      memoryReservationMiB: 50,
      secrets: {
        DD_API_KEY: this.datadogApiKey,
      },
    });

    this.container.addPortMappings({
      protocol: ecs.Protocol.TCP,
      containerPort: 8126,
    });
  }

  public resolveContainerDependencies() {
    if (!this.container) {
      throw new Error('The container dependency hook was called before the container was created');
    }

    const appMeshExtension = this.parentService.serviceDescription.get('appmesh');
    if (appMeshExtension && appMeshExtension.container) {
      this.container.addContainerDependencies({
        container: appMeshExtension.container,
        condition: ecs.ContainerDependencyCondition.HEALTHY,
      });
    }
  }
}