import { Arn, Construct, PolicyDocument, PolicyStatement, Token } from '@aws-cdk/core';
import { Role } from '@aws-cdk/iam';
import { cloudformation, DestinationArn } from './logs.generated';
import { ISubscriptionDestination, SubscriptionDestinationProps } from './subscriptionfilter';

/**
 * Interface for classes that can be the target of a Log Destination
 */
export interface ILogDestinationTarget {
    /**
     * Return the ARN of the log destination target
     */
    readonly destinationTargetArn: Arn;
}

export interface DestinationProps {
    /**
     * The name of the log destination.
     */
    destinationName: string;

    /**
     * The role to assume that grants permissions to write to 'target'.
     *
     * The role must be assumable by 'logs.{REGION}.amazonaws.com'.
     */
    role: Role;

    /**
     * The log destination target
     */
    target: ILogDestinationTarget;
}

/**
 * Create a new CloudWatch Logs Destination.
 *
 * Log destinations can be used to subscribe a Kinesis stream
 * in a different account to a CloudWatch Subscription.
 *
 * A Kinesis stream in the same account can be subscribed directly.
 */
export class Destination extends Construct implements ISubscriptionDestination {
    public readonly policyDocument: PolicyDocument = new PolicyDocument();
    public readonly destinationName: DestinationName;
    public readonly destinationArn: DestinationArn;

    constructor(parent: Construct, name: string, props: DestinationProps) {
        super(parent, name);

        this.policyDocument = new PolicyDocument();

        const resource = new cloudformation.DestinationResource(this, 'Resource', {
            destinationName: props.destinationName,
            destinationPolicy: new Token(() => !this.policyDocument.isEmpty ? JSON.stringify(this.policyDocument.resolve()) : ""),
            roleArn: props.role.roleArn,
            targetArn: props.target.destinationTargetArn
        });

        this.destinationArn = resource.destinationArn;
        this.destinationName = resource.ref;
    }

    public addToPolicy(statement: PolicyStatement) {
        this.policyDocument.addStatement(statement);
    }

    public get subscriptionDestinationProps(): SubscriptionDestinationProps {
        return new SubscriptionDestinationProps(this.destinationArn);
    }
}

/**
 * Name of a CloudWatch Destination
 */
export class DestinationName extends Token {
}