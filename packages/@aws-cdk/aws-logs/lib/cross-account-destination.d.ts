import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { ILogGroup } from './log-group';
import { ILogSubscriptionDestination, LogSubscriptionDestinationConfig } from './subscription-filter';
/**
 * Properties for a CrossAccountDestination
 */
export interface CrossAccountDestinationProps {
    /**
     * The name of the log destination.
     *
     * @default Automatically generated
     */
    readonly destinationName?: string;
    /**
     * The role to assume that grants permissions to write to 'target'.
     *
     * The role must be assumable by 'logs.{REGION}.amazonaws.com'.
     */
    readonly role: iam.IRole;
    /**
     * The log destination target's ARN
     */
    readonly targetArn: string;
}
/**
 * A new CloudWatch Logs Destination for use in cross-account scenarios
 *
 * CrossAccountDestinations are used to subscribe a Kinesis stream in a
 * different account to a CloudWatch Subscription.
 *
 * Consumers will hardly ever need to use this class. Instead, directly
 * subscribe a Kinesis stream using the integration class in the
 * `@aws-cdk/aws-logs-destinations` package; if necessary, a
 * `CrossAccountDestination` will be created automatically.
 *
 * @resource AWS::Logs::Destination
 */
export declare class CrossAccountDestination extends cdk.Resource implements ILogSubscriptionDestination {
    /**
     * Policy object of this CrossAccountDestination object
     */
    readonly policyDocument: iam.PolicyDocument;
    /**
     * The name of this CrossAccountDestination object
     * @attribute
     */
    readonly destinationName: string;
    /**
     * The ARN of this CrossAccountDestination object
     * @attribute
     */
    readonly destinationArn: string;
    /**
     * The inner resource
     */
    private readonly resource;
    constructor(scope: Construct, id: string, props: CrossAccountDestinationProps);
    addToPolicy(statement: iam.PolicyStatement): void;
    bind(_scope: Construct, _sourceLogGroup: ILogGroup): LogSubscriptionDestinationConfig;
    /**
     * Generate a unique Destination name in case the user didn't supply one
     */
    private generateUniqueName;
    /**
     * Return a stringified JSON version of the PolicyDocument
     */
    private lazyStringifiedPolicyDocument;
}
