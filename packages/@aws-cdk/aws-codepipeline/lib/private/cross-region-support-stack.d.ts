import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
/**
 * Props for the support stack
 */
export interface CrossRegionSupportConstructProps {
    /**
     * Whether to create the KMS CMK
     *
     * (Required for cross-account deployments)
     *
     * @default true
     */
    readonly createKmsKey?: boolean;
    /**
     * Enables KMS key rotation for cross-account keys.
     *
     * @default - false (key rotation is disabled)
     */
    readonly enableKeyRotation?: boolean;
}
export declare class CrossRegionSupportConstruct extends Construct {
    readonly replicationBucket: s3.IBucket;
    constructor(scope: Construct, id: string, props?: CrossRegionSupportConstructProps);
}
/**
 * Construction properties for `CrossRegionSupportStack`.
 * This interface is private to the aws-codepipeline package.
 */
export interface CrossRegionSupportStackProps {
    /**
     * The name of the Stack the Pipeline itself belongs to.
     * Used to generate a more friendly name for the support Stack.
     */
    readonly pipelineStackName: string;
    /**
     * The AWS region this Stack resides in.
     */
    readonly region: string;
    /**
     * The AWS account ID this Stack belongs to.
     *
     * @example '012345678901'
     */
    readonly account: string;
    readonly synthesizer: cdk.IStackSynthesizer | undefined;
    /**
     * Whether or not to create a KMS key in the support stack
     *
     * (Required for cross-account deployments)
     *
     * @default true
     */
    readonly createKmsKey?: boolean;
    /**
     * Enables KMS key rotation for cross-account keys.
     *
     * @default - false (key rotation is disabled)
     */
    readonly enableKeyRotation?: boolean;
}
/**
 * A Stack containing resources required for the cross-region CodePipeline functionality to work.
 * This class is private to the aws-codepipeline package.
 */
export declare class CrossRegionSupportStack extends cdk.Stack {
    /**
     * The name of the S3 Bucket used for replicating the Pipeline's artifacts into the region.
     */
    readonly replicationBucket: s3.IBucket;
    constructor(scope: Construct, id: string, props: CrossRegionSupportStackProps);
}
