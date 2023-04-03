import * as notifications from '@aws-cdk/aws-codestarnotifications';
import * as iam from '@aws-cdk/aws-iam';
import { IResource, Resource, ResourceProps } from '@aws-cdk/core';
import * as constructs from 'constructs';
import { Construct } from 'constructs';
import { ITopicSubscription } from './subscriber';
import { Subscription } from './subscription';
/**
 * Represents an SNS topic
 */
export interface ITopic extends IResource, notifications.INotificationRuleTarget {
    /**
     * The ARN of the topic
     *
     * @attribute
     */
    readonly topicArn: string;
    /**
     * The name of the topic
     *
     * @attribute
     */
    readonly topicName: string;
    /**
     * Whether this topic is an Amazon SNS FIFO queue. If false, this is a standard topic.
     *
     * @attribute
     */
    readonly fifo: boolean;
    /**
     * Subscribe some endpoint to this topic
     */
    addSubscription(subscription: ITopicSubscription): Subscription;
    /**
     * Adds a statement to the IAM resource policy associated with this topic.
     *
     * If this topic was created in this stack (`new Topic`), a topic policy
     * will be automatically created upon the first call to `addToPolicy`. If
     * the topic is imported (`Topic.import`), then this is a no-op.
     */
    addToResourcePolicy(statement: iam.PolicyStatement): iam.AddToResourcePolicyResult;
    /**
     * Grant topic publishing permissions to the given identity
     */
    grantPublish(identity: iam.IGrantable): iam.Grant;
}
/**
 * Either a new or imported Topic
 */
export declare abstract class TopicBase extends Resource implements ITopic {
    abstract readonly topicArn: string;
    abstract readonly topicName: string;
    abstract readonly fifo: boolean;
    /**
     * Controls automatic creation of policy objects.
     *
     * Set by subclasses.
     */
    protected abstract readonly autoCreatePolicy: boolean;
    private policy?;
    constructor(scope: Construct, id: string, props?: ResourceProps);
    /**
     * Subscribe some endpoint to this topic
     */
    addSubscription(topicSubscription: ITopicSubscription): Subscription;
    /**
     * Adds a statement to the IAM resource policy associated with this topic.
     *
     * If this topic was created in this stack (`new Topic`), a topic policy
     * will be automatically created upon the first call to `addToPolicy`. If
     * the topic is imported (`Topic.import`), then this is a no-op.
     */
    addToResourcePolicy(statement: iam.PolicyStatement): iam.AddToResourcePolicyResult;
    /**
     * Grant topic publishing permissions to the given identity
     */
    grantPublish(grantee: iam.IGrantable): iam.Grant;
    /**
     * Represents a notification target
     * That allows SNS topic to associate with this rule target.
     */
    bindAsNotificationRuleTarget(_scope: constructs.Construct): notifications.NotificationRuleTargetConfig;
    private nextTokenId;
}
