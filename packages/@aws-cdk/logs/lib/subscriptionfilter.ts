import { Arn, Construct } from '@aws-cdk/core';
import { Role } from '@aws-cdk/iam';
import { LogGroup } from './loggroup';
import { cloudformation } from './logs.generated';
import { ILogPattern } from './pattern';

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
     */
    readonly subscriptionDestinationProps: SubscriptionDestinationProps;
}

/**
 * Properties returned by a Subscription destination
 */
export class SubscriptionDestinationProps {
    public constructor(public readonly arn: Arn, public readonly role?: Role) {
    }
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
    logPattern: ILogPattern;
}

/**
 * A new Subscription on a CloudWatch log group.
 */
export class SubscriptionFilter extends Construct {
    constructor(parent: Construct, name: string, props: SubscriptionFilterProps) {
        super(parent, name);

        const destProps = props.destination.subscriptionDestinationProps;

        new cloudformation.SubscriptionFilterResource(this, 'Resource', {
            logGroupName: props.logGroup.logGroupName,
            destinationArn: destProps.arn,
            roleArn: destProps.role && destProps.role.roleArn,
            filterPattern: props.logPattern.logPatternString
        });
    }
}