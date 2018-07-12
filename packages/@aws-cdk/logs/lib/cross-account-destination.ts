import cdk = require('@aws-cdk/core');
import iam = require('@aws-cdk/iam');
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
    role: iam.Role;

    /**
     * The log destination target's ARN
     */
    targetArn: cdk.Arn;
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
export class CrossAccountDestination extends cdk.Construct implements ISubscriptionDestination {
    public readonly policyDocument: cdk.PolicyDocument = new cdk.PolicyDocument();
    public readonly destinationName: DestinationName;
    public readonly destinationArn: DestinationArn;

    constructor(parent: cdk.Construct, id: string, props: DestinationProps) {
        super(parent, id);

        this.policyDocument = new cdk.PolicyDocument();

        const resource = new cloudformation.DestinationResource(this, 'Resource', {
            destinationName: props.destinationName,
            destinationPolicy: new cdk.Token(() => !this.policyDocument.isEmpty ? JSON.stringify(this.policyDocument.resolve()) : ""),
            roleArn: props.role.roleArn,
            targetArn: props.targetArn
        });

        this.destinationArn = resource.destinationArn;
        this.destinationName = resource.ref;
    }

    public addToPolicy(statement: cdk.PolicyStatement) {
        this.policyDocument.addStatement(statement);
    }

    public subscriptionDestination(_sourceLogGroup: LogGroup): SubscriptionDestination {
        return { arn: this.destinationArn };
    }
}

/**
 * Name of a CloudWatch Destination
 */
export class DestinationName extends cdk.Token {
}