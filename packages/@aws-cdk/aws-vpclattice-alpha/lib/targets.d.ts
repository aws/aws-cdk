import * as core from 'aws-cdk-lib';
import { aws_vpclattice, aws_ec2 as ec2 } from 'aws-cdk-lib';
import * as constructs from 'constructs';
import * as vpclattice from './index';
import { Construct } from 'constructs';
/**
 * A weighted target group adds a weighting to a target group.
 * when more than one WeightedTargetGroup is provided as the action
 * for a listener, the weights are used to determine the relative proportion
 * of traffic that is sent to the target
 */
export interface WeightedTargetGroup {
    /**
     * A target Group
     */
    readonly targetGroup: vpclattice.TargetGroup;
    /**
    * A weight for the target group.
    * @default 100
    */
    readonly weight?: number | undefined;
}
/**
 * A Configuration of the TargetGroup Health Check.
 */
export interface TargetGroupHealthCheck {
    /**
     * Enable this Health Check
     * @default true
     */
    readonly enabled?: boolean | undefined;
    /**
     * Health Check Interval
     * @default 30 seconds
     */
    readonly healthCheckInterval?: core.Duration | undefined;
    /**
     * TimeOut Period
     * @default 5 seconds
     */
    readonly healthCheckTimeout?: core.Duration | undefined;
    /**
     * Number of Healthy Responses before Target is considered healthy
     * @default 2
     */
    readonly healthyThresholdCount?: number | undefined;
    /**
     * Check based on Response from target
     * @default 200 OK
     */
    readonly matcher?: vpclattice.FixedResponse | undefined;
    /**
     * Path to use for Health Check
     * @default '/'
     */
    readonly path?: string | undefined;
    /**
     * Port to use for Health Check
     * @default 443
     */
    readonly port?: number | undefined;
    /**
     * Protocol to use for Health Check
     * @default HTTPS
     */
    readonly protocol?: vpclattice.Protocol | undefined;
    /**
     * Protocol to use for Health Check
     * @default HTTP2
     */
    readonly protocolVersion?: vpclattice.ProtocolVersion | undefined;
    /**
     * Number of unhealty events before Target is considered unhealthy
     * @default 1
     */
    readonly unhealthyThresholdCount?: number | undefined;
}
/**
 * Target Group Configuration Properties
 */
export interface TargetGroupConfigProps {
    /**
     * The port to listen on
     */
    readonly port: number;
    /**
     * The protocol to listen on
     */
    readonly protocol: vpclattice.Protocol;
    /**
     * The VPC to use
     */
    readonly vpc: ec2.Vpc;
    /**
     * The IP Address Type
     * @default ipv4
     */
    readonly ipAddressType?: vpclattice.IpAddressType | undefined;
    /**
     * The Protocol Versions
     * @default HTTP2
     */
    readonly protocolVersion?: vpclattice.ProtocolVersion | undefined;
    /**
     * The Health Check to use
     * @default none
     */
    readonly healthCheck?: TargetGroupHealthCheck | undefined;
}
/**
 * A TargetGroup Configuration
 */
export declare class TargetGroupConfig extends Construct {
    /**
     * The configuration
     */
    targetGroupCfg: aws_vpclattice.CfnTargetGroup.TargetGroupConfigProperty;
    constructor(scope: constructs.Construct, id: string, props: TargetGroupConfigProps);
}
