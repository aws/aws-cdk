import * as iam from '@aws-cdk/aws-iam';
import { IResource, Resource } from '@aws-cdk/core';
import { TopicPolicy } from './policy';
import { ITopicSubscription } from './subscriber';
import { Subscription } from './subscription';

export interface ITopic extends IResource {
  /**
   * @attribute
   */
  readonly topicArn: string;

  /**
   * @attribute
   */
  readonly topicName: string;

  /**
   * Subscribe some endpoint to this topic
   */
  addSubscription(subscription: ITopicSubscription): void;

  /**
   * Adds a statement to the IAM resource policy associated with this topic.
   *
   * If this topic was created in this stack (`new Topic`), a topic policy
   * will be automatically created upon the first call to `addToPolicy`. If
   * the topic is improted (`Topic.import`), then this is a no-op.
   */
  addToResourcePolicy(statement: iam.PolicyStatement): void;

  /**
   * Grant topic publishing permissions to the given identity
   */
  grantPublish(identity: iam.IGrantable): iam.Grant;
}

/**
 * Either a new or imported Topic
 */
export abstract class TopicBase extends Resource implements ITopic {
  public abstract readonly topicArn: string;

  public abstract readonly topicName: string;

  /**
   * Controls automatic creation of policy objects.
   *
   * Set by subclasses.
   */
  protected abstract readonly autoCreatePolicy: boolean;

  private policy?: TopicPolicy;

  /**
   * Subscribe some endpoint to this topic
   */
  public addSubscription(subscription: ITopicSubscription) {
    const subscriptionConfig = subscription.bind(this);

    const scope = subscriptionConfig.subscriberScope || this;
    const id = subscriptionConfig.subscriberId;

    // We use the subscriber's id as the construct id. There's no meaning
    // to subscribing the same subscriber twice on the same topic.
    if (scope.node.tryFindChild(id)) {
      throw new Error(`A subscription with id "${id}" already exists under the scope ${scope.node.path}`);
    }

    new Subscription(scope, id, {
      topic: this,
      ...subscriptionConfig,
    });
  }

  /**
   * Adds a statement to the IAM resource policy associated with this topic.
   *
   * If this topic was created in this stack (`new Topic`), a topic policy
   * will be automatically created upon the first call to `addToPolicy`. If
   * the topic is improted (`Topic.import`), then this is a no-op.
   */
  public addToResourcePolicy(statement: iam.PolicyStatement) {
    if (!this.policy && this.autoCreatePolicy) {
      this.policy = new TopicPolicy(this, 'Policy', { topics: [ this ] });
    }

    if (this.policy) {
      this.policy.document.addStatements(statement);
    }
  }

  /**
   * Grant topic publishing permissions to the given identity
   */
  public grantPublish(grantee: iam.IGrantable) {
    return iam.Grant.addToPrincipalOrResource({
      grantee,
      actions: ['sns:Publish'],
      resourceArns: [this.topicArn],
      resource: this,
    });
  }

}
