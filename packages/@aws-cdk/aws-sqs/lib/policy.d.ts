import { PolicyDocument } from '@aws-cdk/aws-iam';
import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IQueue } from './queue-base';
/**
 * Properties to associate SQS queues with a policy
 */
export interface QueuePolicyProps {
    /**
     * The set of queues this policy applies to.
     */
    readonly queues: IQueue[];
}
/**
 * The policy for an SQS Queue
 *
 * Policies define the operations that are allowed on this resource.
 *
 * You almost never need to define this construct directly.
 *
 * All AWS resources that support resource policies have a method called
 * `addToResourcePolicy()`, which will automatically create a new resource
 * policy if one doesn't exist yet, otherwise it will add to the existing
 * policy.
 *
 * Prefer to use `addToResourcePolicy()` instead.
 */
export declare class QueuePolicy extends Resource {
    /**
     * The IAM policy document for this policy.
     */
    readonly document: PolicyDocument;
    constructor(scope: Construct, id: string, props: QueuePolicyProps);
    /**
     * Not currently supported by AWS CloudFormation.
     *
     * This attribute temporarily existed in CloudFormation, and then was removed again.
     *
     * @attribute
     */
    get queuePolicyId(): string;
}
