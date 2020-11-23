import * as ecs from '@aws-cdk/aws-ecs';
import * as cdk from '@aws-cdk/core';
import { Service } from '../service';
import { Container } from './container';
import { ContainerMutatingHook, ServiceExtension } from './extension-interfaces';

const NEWRELIC_AGENT_IMAGE = 'newrelic/infrastructure-bundle:1.5.0';

/**
 * Settings for the APM agent running in the service container
 */
export interface NewRelicAgentProps {
  /**
   * The license key for New Relic
   */
  readonly newRelicLicenseKey: ecs.Secret

  /**
   * Whether or not to enable distributed tracing
   */
  readonly distributedTracingEnabled: boolean;


  /**
   * Service name, for traces
   */
  readonly serviceName: string;
}

/**
 * This hook modifies the application container's settings for the
 * New Relic agent according to the docs here:
 * https://docs.newrelic.com/docs/agents/nodejs-agent/installation-configuration/install-new-relic-nodejs-agent-docker
 */
export class NewRelicAgentMutatingHook extends ContainerMutatingHook {
  private props: NewRelicAgentProps;

  constructor(props: NewRelicAgentProps) {
    super();
    this.props = props;
  }

  // Modify the environment variables for the primary container
  // so that the Datadog client SDK inside the primary container
  // has the right settings.
  public mutateContainerDefinition(props: ecs.ContainerDefinitionOptions) {
    let environment = props.environment || {};

    // Stop the agent from looking for a config file inside the container
    // instead use the environment variables we are passing.
    environment.NEW_RELIC_NO_CONFIG_FILE = 'true';

    // Set the service name
    environment.NEW_RELIC_APP_NAME = this.props.serviceName;

    // Configure new relic logging to stdout
    environment.NEW_RELIC_LOG = 'stdout';

    // The agent running in the container needs a license key too.
    let secrets = props.secrets || {};

    secrets.NEW_RELIC_LICENSE_KEY = this.props.newRelicLicenseKey;

    if (this.props.distributedTracingEnabled) {
      environment.NEW_RELIC_DISTRIBUTED_TRACING_ENABLED = 'true';
    }

    return {
      ...props,
      environment,
      secrets,
    } as ecs.ContainerDefinitionOptions;
  }
}

/**
 * Settings for the New Relic agent
 **/
export interface NewRelicExtensionProps {
  /**
   * Whether or not to enable the APM agent
   */
  readonly apmEnabled?: boolean

  /**
   * Whether or not to enable distributed tracing
   */
  readonly distributedTracingEnabled?: boolean

  /**
   * An ecs.Secret that is storing the New Relic license key
   **/
  readonly newRelicLicenseKey: ecs.Secret
}

/**
 * This extension adds a New Relic agent to the task definition
 */
export class NewRelicInfrastructureAgent extends ServiceExtension {
  private newRelicLicenseKey: ecs.Secret;
  private apmEnabled: boolean;
  private distributedTracingEnabled: boolean;

  constructor(props: NewRelicExtensionProps) {
    super('newrelicAgent');

    this.newRelicLicenseKey = props.newRelicLicenseKey;
    this.apmEnabled = props.apmEnabled ? props.apmEnabled : false;
    this.distributedTracingEnabled = props.distributedTracingEnabled ? props.distributedTracingEnabled: false;
  }

  public prehook(service: Service, scope: cdk.Construct) {
    this.parentService = service;
    this.scope = scope;
  }

  // If the user wants to enable APM tracing then add the container mutating hook
  // that will give their service container the New Relic license key
  public addHooks() {
    if (!this.apmEnabled) {
      return;
    }

    const container = this.parentService.serviceDescription.get('service-container') as Container;

    if (!container) {
      throw new Error('Firelens extension requires an application extension');
    }

    container.addContainerMutatingHook(new NewRelicAgentMutatingHook({
      newRelicLicenseKey: this.newRelicLicenseKey,
      distributedTracingEnabled: this.distributedTracingEnabled,
      serviceName: this.parentService.id,
    }));
  }

  // This hook adds and configures the Datadog agent in the task.
  public useTaskDefinition(taskDefinition: ecs.TaskDefinition) {
    // Add the Datadog Agent to this task
    this.container = taskDefinition.addContainer('newrelic-infrastructure-agent', {
      image: ecs.ContainerImage.fromRegistry(NEWRELIC_AGENT_IMAGE),
      logging: new ecs.AwsLogDriver({ streamPrefix: 'newrelic-agent' }),
      user: '0:1338', // Ensure that agent outbound traffic doesn't go through proxy
      memoryReservationMiB: 50,
      environment: {
        NRIA_OVERRIDE_HOST_ROOT: '',
        NRIA_IS_SECURE_FORWARD_ONLY: 'true',
        FARGATE: 'true',
        ENABLE_NRI_ECS: 'true',
        NRIA_PASSTHROUGH_ENVIRONMENT: 'ECS_CONTAINER_METADATA_URI,ENABLE_NRI_ECS,FARGATE',
        NRIA_CUSTOM_ATTRIBUTES: '{\"nrDeployMethod\":\"ecs-service-extensions\"}',
      },
      secrets: {
        NRIA_LICENSE_KEY: this.newRelicLicenseKey,
      },
    });
  }

  public resolveContainerDependencies() {
    if (!this.container) {
      throw new Error('The container dependency hook was called before the container was created');
    }

    const serviceContainer = this.parentService.serviceDescription.get('service-container');

    if (!serviceContainer.container) {
      throw new Error('Could not find a service container');
    }

    serviceContainer.container.addContainerDependencies({
      container: this.container,
      condition: ecs.ContainerDependencyCondition.START,
    });

    const appmeshextension = this.parentService.serviceDescription.get('appmesh');
    if (appmeshextension && appmeshextension.container) {
      this.container.addContainerDependencies({
        container: appmeshextension.container,
        condition: ecs.ContainerDependencyCondition.HEALTHY,
      });
    }
  }
}