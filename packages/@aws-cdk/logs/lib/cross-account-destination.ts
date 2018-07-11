import { Arn, Construct, PolicyDocument, PolicyStatement, Token } from '@aws-cdk/core';
import { Role } from '@aws-cdk/iam';
import { LogGroup } from './log-group';
import { cloudformation, DestinationArn } from './logs.generated';
import { ISubscriptionDestination, SubscriptionDestination } from './subscription-filter';

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
     * The log destination target's ARN
     */
    targetArn: Arn;
}

/**
 * Create a new CloudWatch Logs Destination.
 *
 * Log destinations can be used to subscribe a Kinesis stream in a different
 * account to a CloudWatch Subscription. A Kinesis stream in the same account
 * can be subscribed directly.
 *
 * The @aws-cdk/kinesis library takes care of this automatically; you shouldn't
 * need to bother with this class.
 */
export class CrossAccountDestination extends Construct implements ISubscriptionDestination {
    public readonly policyDocument: PolicyDocument = new PolicyDocument();
    public readonly destinationName: DestinationName;
    public readonly destinationArn: DestinationArn;

    constructor(parent: Construct, id: string, props: DestinationProps) {
        super(parent, id);

        this.policyDocument = new PolicyDocument();

        const resource = new cloudformation.DestinationResource(this, 'Resource', {
            destinationName: props.destinationName,
            destinationPolicy: new Token(() => !this.policyDocument.isEmpty ? JSON.stringify(this.policyDocument.resolve()) : ""),
            roleArn: props.role.roleArn,
            targetArn: props.targetArn
        });

        this.destinationArn = resource.destinationArn;
        this.destinationName = resource.ref;
    }

    public addToPolicy(statement: PolicyStatement) {
        this.policyDocument.addStatement(statement);
    }

    public subscriptionDestination(_sourceLogGroup: LogGroup): SubscriptionDestination {
        return { arn: this.destinationArn };
    }
}

/**
 * Name of a CloudWatch Destination
 */
export class DestinationName extends Token {
}