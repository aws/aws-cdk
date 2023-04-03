import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { RetentionDays } from './log-group';
/**
 * Construction properties for a LogRetention.
 */
export interface LogRetentionProps {
    /**
     * The log group name.
     */
    readonly logGroupName: string;
    /**
     * The region where the log group should be created
     * @default - same region as the stack
     */
    readonly logGroupRegion?: string;
    /**
     * The number of days log events are kept in CloudWatch Logs.
     */
    readonly retention: RetentionDays;
    /**
     * The IAM role for the Lambda function associated with the custom resource.
     *
     * @default - A new role is created
     */
    readonly role?: iam.IRole;
    /**
     * Retry options for all AWS API calls.
     *
     * @default - AWS SDK default retry options
     */
    readonly logRetentionRetryOptions?: LogRetentionRetryOptions;
    /**
     * The removalPolicy for the log group when the stack is deleted
     * @default RemovalPolicy.RETAIN
     */
    readonly removalPolicy?: cdk.RemovalPolicy;
}
/**
 * Retry options for all AWS API calls.
 */
export interface LogRetentionRetryOptions {
    /**
     * The maximum amount of retries.
     *
     * @default 3 (AWS SDK default)
     */
    readonly maxRetries?: number;
    /**
     * The base duration to use in the exponential backoff for operation retries.
     *
     * @default Duration.millis(100) (AWS SDK default)
     */
    readonly base?: cdk.Duration;
}
/**
 * Creates a custom resource to control the retention policy of a CloudWatch Logs
 * log group. The log group is created if it doesn't already exist. The policy
 * is removed when `retentionDays` is `undefined` or equal to `Infinity`.
 * Log group can be created in the region that is different from stack region by
 * specifying `logGroupRegion`
 */
export declare class LogRetention extends Construct {
    /**
     * The ARN of the LogGroup.
     */
    readonly logGroupArn: string;
    constructor(scope: Construct, id: string, props: LogRetentionProps);
    /**
     * Helper method to ensure that only one instance of LogRetentionFunction resources are in the stack mimicking the
     * behaviour of @aws-cdk/aws-lambda's SingletonFunction to prevent circular dependencies
     */
    private ensureSingletonLogRetentionFunction;
}
