import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as sqs from '@aws-cdk/aws-sqs';
import { Duration } from '@aws-cdk/core';
import { IConstruct } from 'constructs';
/**
 * The generic properties for an RuleTarget
 */
export interface TargetBaseProps {
    /**
     * The SQS queue to be used as deadLetterQueue.
     * Check out the [considerations for using a dead-letter queue](https://docs.aws.amazon.com/eventbridge/latest/userguide/rule-dlq.html#dlq-considerations).
     *
     * The events not successfully delivered are automatically retried for a specified period of time,
     * depending on the retry policy of the target.
     * If an event is not delivered before all retry attempts are exhausted, it will be sent to the dead letter queue.
     *
     * @default - no dead-letter queue
     */
    readonly deadLetterQueue?: sqs.IQueue;
    /**
     * The maximum age of a request that Lambda sends to a function for
     * processing.
     *
     * Minimum value of 60.
     * Maximum value of 86400.
     *
     * @default Duration.hours(24)
     */
    readonly maxEventAge?: Duration;
    /**
     * The maximum number of times to retry when the function returns an error.
     *
     * Minimum value of 0.
     * Maximum value of 185.
     *
     * @default 185
     */
    readonly retryAttempts?: number;
}
/**
 * Bind props to base rule target config.
 * @internal
 */
export declare function bindBaseTargetConfig(props: TargetBaseProps): {
    deadLetterConfig: {
        arn: string;
    } | undefined;
    retryPolicy: {
        maximumRetryAttempts: number | undefined;
        maximumEventAgeInSeconds: number | undefined;
    } | undefined;
};
/**
 * Obtain the Role for the EventBridge event
 *
 * If a role already exists, it will be returned. This ensures that if multiple
 * events have the same target, they will share a role.
 * @internal
 */
export declare function singletonEventRole(scope: IConstruct): iam.IRole;
/**
 * Allows a Lambda function to be called from a rule
 * @internal
 */
export declare function addLambdaPermission(rule: events.IRule, handler: lambda.IFunction): void;
/**
 * Allow a rule to send events with failed invocation to an Amazon SQS queue.
 * @internal
 */
export declare function addToDeadLetterQueueResourcePolicy(rule: events.IRule, queue: sqs.IQueue): void;
