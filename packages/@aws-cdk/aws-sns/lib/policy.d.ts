import { PolicyDocument } from '@aws-cdk/aws-iam';
import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { ITopic } from './topic-base';
/**
 * Properties to associate SNS topics with a policy
 */
export interface TopicPolicyProps {
    /**
     * The set of topics this policy applies to.
     */
    readonly topics: ITopic[];
    /**
     * IAM policy document to apply to topic(s).
     * @default empty policy document
     */
    readonly policyDocument?: PolicyDocument;
}
/**
 * The policy for an SNS Topic
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
export declare class TopicPolicy extends Resource {
    /**
     * The IAM policy document for this policy.
     */
    readonly document: PolicyDocument;
    constructor(scope: Construct, id: string, props: TopicPolicyProps);
}
