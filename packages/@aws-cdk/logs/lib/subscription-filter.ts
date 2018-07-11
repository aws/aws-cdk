import { Arn, Construct } from '@aws-cdk/core';
import { Role } from '@aws-cdk/iam';
import { LogGroup } from './log-group';
import { cloudformation } from './logs.generated';
import { IFilterPattern } from './pattern';

/**
 * Interface for classes that can be the destination of a log Subscription
 */
export interface ISubscriptionDestination {
    /**
     * Return the properties required to send subscription events to this destination.
     *
     * If necessary, the destination can use the properties of the SubscriptionFilter
     * object itself to configure its permissions to allow the subscription to write
     * to it.
     *
     * The destination may reconfigure its own permissions in response to this
     * function call.
     */
    subscriptionDestination(sourceLogGroup: LogGroup): SubscriptionDestination;
}

/**
 * Properties returned by a Subscription destination
 */
export interface SubscriptionDestination {
    /**
     * The ARN of the subscription's destination
     */
    readonly arn: Arn;

    /**
     * The role to assume to write log events to the destination
     *
     * @default No role assumed
     */
    readonly role?: Role;
}

/**
 * Properties for a SubscriptionFilter
 */
export interface SubscriptionFilterProps {
    /**
     * The log group to create the subscription on.
     */
    logGroup: LogGroup;

    /**
     * The destination to send the filtered events to.
     *
     * For example, a Kinesis stream or a Lambda function.
     */
    destination: ISubscriptionDestination;

    /**
     * Log events matching this pattern will be sent to the destination.
     */
    filterPattern: IFilterPattern;
}

/**
 * A new Subscription on a CloudWatch log group.
 */
export class SubscriptionFilter extends Construct {
    constructor(parent: Construct, id: string, props: SubscriptionFilterProps) {
        super(parent, id);

        const destProps = props.destination.subscriptionDestination(props.logGroup);

        new cloudformation.SubscriptionFilterResource(this, 'Resource', {
            logGroupName: props.logGroup.logGroupName,
            destinationArn: destProps.arn,
            roleArn: destProps.role && destProps.role.roleArn,
            filterPattern: props.filterPattern.logPatternString
        });
    }
}