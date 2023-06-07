import * as core from 'aws-cdk-lib';
import { aws_ec2 as ec2, aws_lambda as aws_lambda, aws_elasticloadbalancingv2 as elbv2 } from 'aws-cdk-lib';
import * as vpclattice from './index';
import * as constructs from 'constructs';
/**
 * Create a vpc lattice TargetGroup.
 * Implemented by `TargetGroup`.
 */
export interface ITargetGroup extends core.IResource {
    /**
     * The id of the target group
     */
    readonly targetGroupId: string;
    /**
     * The Arn of the target group
     */
    readonly targetGroupArn: string;
}
/**
 * Properties for a Target Group, Only supply one of instancetargets, lambdaTargets, albTargets, ipTargets
 */
export interface TargetGroupProps {
    /**
     * The name of the target group
     */
    readonly name: string;
    /**
     * A list of ec2 instance targets.
     * @default - No targets
     */
    readonly instancetargets?: ec2.Instance[];
    /**
     * A list of ip targets
     * @default - No targets
     */
    readonly ipTargets?: string[];
    /**
     * A list of lambda targets
     * @default - No targets
     */
    readonly lambdaTargets?: aws_lambda.Function[];
    /**
     * A list of alb targets
     * @default - No targets
     */
    readonly albTargets?: elbv2.ApplicationListener[];
    /**
     * The Target Group configuration. Must be provided for alb, instance and Ip targets, but
     * must not be provided for lambda targets
     * @default - No configuration
     */
    /**
     * The Target Group configuration. Must be provided for alb, instance and Ip targets, but
     * must not be provided for lambda targets
     * @default - No configuration
     */
    readonly config?: vpclattice.TargetGroupConfig | undefined;
}
/**
 * Create a vpc lattice TargetGroup
 *
 */
export declare class TargetGroup extends core.Resource implements ITargetGroup {
    readonly targetGroupId: string;
    /**
     * The Arn of the targetGroup
     */
    readonly targetGroupArn: string;
    constructor(scope: constructs.Construct, id: string, props: TargetGroupProps);
}
