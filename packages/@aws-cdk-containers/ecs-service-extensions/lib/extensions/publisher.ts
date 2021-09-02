import * as ecs from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
import * as sns from '@aws-cdk/aws-sns';
import { Service } from '../service';
import { Container } from './container';
import { ContainerMutatingHook, ServiceExtension } from './extension-interfaces';

// Keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

/**
 * An interface that will be implemented by all the resources that can be published events to.
 */
export interface IPublisher {
  publish(taskDefinition: ecs.TaskDefinition): void;

  envVarKey(): string;

  envVarValue(): string;
}

/**
 * The settings for the `PublisherTopic` class.
 */
export interface PublisherTopicProps {
  /**
   * The SNS Topic to publish events to.
   */
  readonly topic: sns.ITopic;

  /**
   * The accounts allowed to subscribe to the given `topic`.
   *
   * @default none
   */
  readonly allowedAccounts?: string[];
}

/**
 * The `PublisherTopic` class represents SNS Topic resource that can be published to by the parent service.
 */

export class PublisherTopic implements IPublisher {
  public readonly topic: sns.ITopic;

  constructor(props: PublisherTopicProps) {
    this.topic = props.topic;

    if (props.allowedAccounts) {
      const principals = [];
      for (const account of props.allowedAccounts) {
        principals.push(new iam.AccountPrincipal(account));
      }

      this.topic.addToResourcePolicy(new iam.PolicyStatement({
        actions: ['sns:Subscribe'],
        resources: [this.topic.topicArn],
        principals,
      }));
    }
  }

  public publish(taskDefinition: ecs.TaskDefinition) {
    this.topic.grantPublish(taskDefinition.taskRole);
  }

  public envVarKey(): string {
    return this.topic.node.id;
  }

  public envVarValue(): string {
    return this.topic.topicArn;
  }
}

/**
 * The settings for the Publisher extension.
 */
export interface PublisherExtensionProps {
  /**
   * The list of publishable resources for this service.
   */
  readonly publishers: IPublisher[];
}

/**
 * Settings for the hook which mutates the application container
 * to add the publisher resource ARNs to its environment.
 */
interface ContainerMutatingProps {
  /**
   * The resource name and ARN to be added to the container environment.
   */
  readonly environment: { [key: string]: string };
}

/**
 * This hook modifies the application container's environment to
 * add the publisher resource ARNs.
 */
class PublisherExtensionMutatingHook extends ContainerMutatingHook {
  private environment: { [key: string]: string };

  constructor(props: ContainerMutatingProps) {
    super();
    this.environment = props.environment;
  }

  public mutateContainerDefinition(props: ecs.ContainerDefinitionOptions): ecs.ContainerDefinitionOptions {
    return {
      ...props,

      environment: { ...(props.environment || {}), ...this.environment },
    } as ecs.ContainerDefinitionOptions;
  }
}

/**
 * This extension accepts a list of `IPublisher` resources that the parent service can publish events to. It sets up
 * the corresponding publish permissions for the task role of the parent service.
 */
export class PublisherExtension extends ServiceExtension {
  private props: PublisherExtensionProps;

  private environment: { [key: string]: string } = {};

  constructor(props: PublisherExtensionProps) {
    super('publisher');

    this.props = props;
  }

  // @ts-ignore - Ignore unused params that are required for abstract class extend
  public prehook(service: Service, scope: Construct) {
    this.parentService = service;

    for (const resource of this.props.publishers) {
      this.environment[`${service.id.toUpperCase()}_${resource.envVarKey().toUpperCase()}_TOPIC_ARN`] = resource.envVarValue();
    }
  }

  /**
   * Add hooks to the main application extension so that it is modified to
   * add the publisher resource ARNs to the container environment.
   */
  public addHooks() {
    const container = this.parentService.serviceDescription.get('service-container') as Container;

    if (!container) {
      throw new Error('Publisher Extension requires an application extension');
    }

    container.addContainerMutatingHook(new PublisherExtensionMutatingHook({
      environment: this.environment,
    }));
  }

  /**
   * After the task definition has been created, this hook grants SNS publish permissions to the task role.
   *
   * @param taskDefinition The created task definition
   */
  public useTaskDefinition(taskDefinition: ecs.TaskDefinition) {
    for (const resource of this.props.publishers) {
      resource.publish(taskDefinition);
    }
  }
}