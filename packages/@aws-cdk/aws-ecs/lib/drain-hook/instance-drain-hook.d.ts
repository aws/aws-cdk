import * as autoscaling from '@aws-cdk/aws-autoscaling';
import * as kms from '@aws-cdk/aws-kms';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { ICluster } from '../cluster';
/**
 * Properties for instance draining hook
 */
export interface InstanceDrainHookProps {
    /**
     * The AutoScalingGroup to install the instance draining hook for
     */
    autoScalingGroup: autoscaling.IAutoScalingGroup;
    /**
     * The cluster on which tasks have been scheduled
     */
    cluster: ICluster;
    /**
     * How many seconds to give tasks to drain before the instance is terminated anyway
     *
     * Must be between 0 and 15 minutes.
     *
     * @default Duration.minutes(15)
     */
    drainTime?: cdk.Duration;
    /**
     * The InstanceDrainHook creates an SNS topic for the lifecycle hook of the ASG. If provided, then this
     * key will be used to encrypt the contents of that SNS Topic.
     * See [SNS Data Encryption](https://docs.aws.amazon.com/sns/latest/dg/sns-data-encryption.html) for more information.
     *
     * @default The SNS Topic will not be encrypted.
     */
    topicEncryptionKey?: kms.IKey;
}
/**
 * A hook to drain instances from ECS traffic before they're terminated
 */
export declare class InstanceDrainHook extends Construct {
    /**
     * Constructs a new instance of the InstanceDrainHook class.
     */
    constructor(scope: Construct, id: string, props: InstanceDrainHookProps);
}
