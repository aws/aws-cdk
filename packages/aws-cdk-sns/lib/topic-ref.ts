import { Arn, Construct, Output, PolicyStatement, ServicePrincipal } from 'aws-cdk';
import { EventRuleTarget, IEventRuleTarget } from 'aws-cdk-events';
import { LambdaRef } from 'aws-cdk-lambda';
import { QueueRef } from 'aws-cdk-sqs';
import { IIdentityResource } from '../../aws-cdk-iam/lib/policy';
import { TopicPolicy } from './policy';
import { Subscription, SubscriptionProtocol } from './subscription';

/**
 * ARN of a Topic
 */
export class TopicArn extends Arn { }

/**
 * Either a new or imported Topic
 */
export abstract class TopicRef extends Construct implements IEventRuleTarget {
    /**
     * Import a Topic defined elsewhere
     */
    public static import(parent: Construct, name: string, props: TopicRefProps): TopicRef {
        return new ImportedTopic(parent, name, props);
    }

    public abstract readonly topicArn: TopicArn;

    /**
     * Controls automatic creation of policy objects.
     *
     * Set by subclasses.
     */
    protected abstract readonly autoCreatePolicy: boolean;

    private policy?: TopicPolicy;

    /**
     * Indicates if the resource policy that allows CloudWatch events to publish
     * notifications to this topic have been added.
     */
    private eventRuleTargetPolicyAdded = false;

    /**
     * Export this Topic
     */
    public export(): TopicRefProps {
        return {
            topicArn: new Output(this, 'TopicArn', { value: this.topicArn }).makeImportValue(),
        };
    }

    /**
     * Subscribe some endpoint to this topic
     */
    public subscribe(name: string, endpoint: string, protocol: SubscriptionProtocol) {
        new Subscription(this, name, {
            topic: this,
            endpoint,
            protocol
        });
    }

    /**
     * Defines a subscription from this SNS topic to an SQS queue.
     *
     * The queue resource policy will be updated to allow this SNS topic to send
     * messages to the queue.
     *
     * TODO: change to QueueRef.
     *
     * @param name The subscription name
     * @param queue The target queue
     */
    public subscribeQueue(queue: QueueRef) {
        const subscriptionName = queue.name + 'Subscription';
        if (this.tryFindChild(subscriptionName)) {
            throw new Error(`A subscription between the topic ${this.name} and the queue ${queue.name} already exists`);
        }

        // we use the queue name as the subscription's. there's no meaning to subscribing
        // the same queue twice on the same topic.
        const sub = new Subscription(this, subscriptionName, {
            topic: this,
            endpoint: queue.queueArn,
            protocol: SubscriptionProtocol.Sqs
        });

        // add a statement to the queue resource policy which allows this topic
        // to send messages to the queue.
        queue.addToResourcePolicy(new PolicyStatement()
            .addResource(queue.queueArn)
            .addAction('sqs:SendMessage')
            .addServicePrincipal('sns.amazonaws.com')
            .setCondition('ArnEquals', { 'aws:SourceArn': this.topicArn }));

        return sub;
    }

    /**
     * Defines a subscription from this SNS Topic to a Lambda function.
     *
     * The Lambda's resource policy will be updated to allow this topic to
     * invoke the function.
     *
     * @param name A name for the subscription
     * @param lambdaFunction The Lambda function to invoke
     */
    public subscribeLambda(lambdaFunction: LambdaRef) {
        const subscriptionName = lambdaFunction.name + 'Subscription';

        if (this.tryFindChild(subscriptionName)) {
            throw new Error(`A subscription between the topic ${this.name} and the lambda ${lambdaFunction.name} already exists`);
        }

        const sub = new Subscription(this, subscriptionName, {
            topic: this,
            endpoint: lambdaFunction.functionArn,
            protocol: SubscriptionProtocol.Lambda
        });

        lambdaFunction.addPermission(this.name, {
            sourceArn: this.topicArn,
            principal: new ServicePrincipal('sns.amazonaws.com'),
        });

        return sub;
    }

    /**
     * Defines a subscription from this SNS topic to an email address.
     *
     * @param name A name for the subscription
     * @param emailAddress The email address to use.
     * @param jsonFormat True if the email content should be in JSON format (default is false).
     */
    public subscribeEmail(name: string, emailAddress: string, options?: EmailSubscriptionOptions) {
        const protocol = (options && options.json ? SubscriptionProtocol.EmailJson : SubscriptionProtocol.Email);

        return new Subscription(this, name, {
            topic: this,
            endpoint: emailAddress,
            protocol
        });
    }

    /**
     * Defines a subscription from this SNS topic to an http:// or https:// URL.
     *
     * @param name A name for the subscription
     * @param url The URL to invoke
     */
    public subscribeUrl(name: string, url: string) {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            throw new Error('URL must start with either http:// or https://');
        }

        const protocol = url.startsWith('https:') ? SubscriptionProtocol.Https : SubscriptionProtocol.Http;

        return new Subscription(this, name, {
            topic: this,
            endpoint: url,
            protocol
        });
    }

    /**
     * Adds a statement to the IAM resource policy associated with this topic.
     *
     * If this topic was created in this stack (`new Topic`), a topic policy
     * will be automatically created upon the first call to `addToPolicy`. If
     * the topic is improted (`Topic.import`), then this is a no-op.
     */
    public addToResourcePolicy(statement: PolicyStatement) {
        if (!this.policy && this.autoCreatePolicy) {
            this.policy = new TopicPolicy(this, 'Policy', { topics: [ this ] });
        }

        if (this.policy) {
            this.policy.document.addStatement(statement);
        }
    }

    /**
     * Grant topic publishing permissions to the given identity
     */
    public grantPublish(identity?: IIdentityResource) {
        if (!identity) {
            return;
        }

        identity.addToPolicy(new PolicyStatement()
            .addResource(this.topicArn)
            .addActions('sns:Publish'));

        this.addToResourcePolicy(new PolicyStatement()
            .addResource('*')
            .addPrincipal(identity.principal)
            .addActions('sns:Publish'));
    }

    /**
     * Returns a RuleTarget that can be used to trigger this SNS topic as a
     * result from a CloudWatch event.
     */
    public get eventRuleTarget(): EventRuleTarget {
        if (!this.eventRuleTargetPolicyAdded) {
            this.addToResourcePolicy(new PolicyStatement()
                .addAction('sns:Publish')
                .addPrincipal(new ServicePrincipal('events.amazonaws.com'))
                .addResource(this.topicArn));

            this.eventRuleTargetPolicyAdded = true;
        }

        return {
            id: this.name,
            arn: this.topicArn,
        };
    }
}

/**
 * An imported topic
 */
class ImportedTopic extends TopicRef {
    public readonly topicArn: TopicArn;

    protected autoCreatePolicy: boolean = false;

    constructor(parent: Construct, name: string, props: TopicRefProps) {
        super(parent, name);
        this.topicArn = props.topicArn;
    }
}

/**
 * Reference to an external topic.
 */
export interface TopicRefProps {
    topicArn: TopicArn;
}

/**
 * Options for email subscriptions.
 */
export interface EmailSubscriptionOptions {
    /**
     * Indicates if the full notification JSON should be sent to the email
     * address or just the message text.
     *
     * @default Message text (false)
     */
    json?: boolean
}