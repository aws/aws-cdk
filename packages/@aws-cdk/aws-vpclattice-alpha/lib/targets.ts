// import * as core from 'aws-cdk-lib';

import {
  aws_vpclattice,
  aws_ec2 as ec2,
  aws_lambda,
  aws_elasticloadbalancingv2 as elbv2,
}
  from 'aws-cdk-lib';

//import * as constructs from 'constructs';
import * as vpclattice from './index';
//import { Construct } from 'constructs';

/**
 * Types of Targets that are usable with vpclattice
 */
export enum TargetType {
  /**
   * Lambda Target
   */
  LAMBDA = 'LAMBDA',
  /**
   * IP Address Target
   */
  IP = 'IP',
  /**
   * EC2 Instance Targets
   */
  INSTANCE = 'INSTANCE',
  /**
   * Application Load Balancer Target
   */
  ALB = 'ALB'
}

/**
 * Targets for target Groups
 */
export abstract class Target {

  /**
   * Lambda Target
   * @param lambda
   */
  public static lambda(lambda: aws_lambda.Function[]): Target {

    let targets: aws_vpclattice.CfnTargetGroup.TargetProperty[] = [];
    lambda.forEach((target) => {
      targets.push({ id: target.functionArn });
    });

    return {
      type: TargetType.LAMBDA,
      targets: targets,
    };
  };

  /**
   * IpAddress as Targets
   * @param ipAddress
   * @param config
   */
  public static ipAddress(ipAddress: string[], config: aws_vpclattice.CfnTargetGroup.TargetGroupConfigProperty ): Target {

    let targets: aws_vpclattice.CfnTargetGroup.TargetProperty[] = [];

    ipAddress.forEach((target) => {
      targets.push({ id: target });
    });

    return {
      type: TargetType.IP,
      targets: targets,
      config: config,
    };

  };

  /**
   * EC2 Instances as Targets
   * @param ec2instance
   * @param config
   */
  public static ec2instance(ec2instance: ec2.Instance[], config: aws_vpclattice.CfnTargetGroup.TargetGroupConfigProperty): Target {

    let targets: aws_vpclattice.CfnTargetGroup.TargetProperty[] = [];

    ec2instance.forEach((target) => {
      targets.push({ id: target.instanceId });
    });

    return {
      type: TargetType.INSTANCE,
      targets: targets,
      config: config,
    };

  };

  /**
   * Application Load Balancer as Targets
   * @param alb
   * @param config
   */
  public static applicationLoadBalancer(
    alb: elbv2.ApplicationLoadBalancer[],
    config: aws_vpclattice.CfnTargetGroup.TargetGroupConfigProperty,
  ) : Target {

    let targets: aws_vpclattice.CfnTargetGroup.TargetProperty[] = [];

    alb.forEach((target) => {
      targets.push({ id: target.loadBalancerArn });
    });

    return {
      type: TargetType.ALB,
      targets: targets,
      config: config,
    };

  }
  /**
   * The type of target
   */
  public abstract readonly type: TargetType;
  /**
   * References to the targets, ids or Arns
   */
  public abstract readonly targets: aws_vpclattice.CfnTargetGroup.TargetProperty[];
  /**
   * Configuration for the TargetGroup, if it is not a lambda
   */
  public abstract readonly config?: aws_vpclattice.CfnTargetGroup.TargetGroupConfigProperty | undefined;

  constructor() {};

}
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
  readonly targetGroup: vpclattice.TargetGroup,
  /**
  * A weight for the target group.
  * @default 100
  */
  readonly weight?: number | undefined
}
/**
 * A Configuration of the TargetGroup Health Check.
 */
// export interface TargetGroupHealthCheck {
//   /**
//    * Enable this Health Check
//    * @default true
//    */
//   readonly enabled?: boolean | undefined,
//   /**
//    * Health Check Interval
//    * @default 30 seconds
//    */
//   readonly healthCheckInterval?: core.Duration | undefined
//   /**
//    * TimeOut Period
//    * @default 5 seconds
//    */
//   readonly healthCheckTimeout?: core.Duration | undefined
//   /**
//    * Number of Healthy Responses before Target is considered healthy
//    * @default 2
//    */
//   readonly healthyThresholdCount?: number | undefined
//   /**
//    * Check based on Response from target
//    * @default 200 OK
//    */
//   readonly matcher?: vpclattice.FixedResponse | undefined
//   /**
//    * Path to use for Health Check
//    * @default '/'
//    */
//   readonly path?: string | undefined
//   /**
//    * Port to use for Health Check
//    * @default 443
//    */
//   readonly port?: number | undefined
//   /**
//    * Protocol to use for Health Check
//    * @default HTTPS
//    */
//   readonly protocol?: vpclattice.Protocol | undefined
//   /**
//    * Protocol to use for Health Check
//    * @default HTTP2
//    */
//   readonly protocolVersion?: vpclattice.ProtocolVersion | undefined
//   /**
//    * Number of unhealty events before Target is considered unhealthy
//    * @default 1
//    */
//   readonly unhealthyThresholdCount?: number | undefined
// }
// /**
//  * Target Group Configuration Properties
//  */
// export interface TargetGroupConfigProps {
//   /**
//    * The port to listen on
//    */
//   readonly port: number;
//   /**
//    * The protocol to listen on
//    */
//   readonly protocol: vpclattice.Protocol;
//   /**
//    * The VPC to use
//    */
//   readonly vpc: ec2.Vpc;
//   /**
//    * The IP Address Type
//    * @default ipv4
//    */
//   readonly ipAddressType?: vpclattice.IpAddressType | undefined;
//   /**
//    * The Protocol Versions
//    * @default HTTP2
//    */
//   readonly protocolVersion?: vpclattice.ProtocolVersion | undefined;
//   /**
//    * The Health Check to use
//    * @default none
//    */
//   readonly healthCheck?: TargetGroupHealthCheck | undefined;
// }
/**
 * A TargetGroup Configuration
 */
// export class TargetGroupConfig extends Construct {

//   /**
//    * The configuration
//    */
//   targetGroupCfg: aws_vpclattice.CfnTargetGroup.TargetGroupConfigProperty;

//   constructor(scope: constructs.Construct, id: string, props: TargetGroupConfigProps) {
//     super(scope, id);

//     // validate the ranges for the health check
//     if (props.healthCheck?.healthCheckInterval) {
//       if (props.healthCheck?.healthCheckInterval.toSeconds() < 5 || props.healthCheck?.healthCheckInterval.toSeconds() > 300) {
//         throw new Error('HealthCheckInterval must be between 5 and 300 seconds');
//       }
//     };

//     if (props.healthCheck?.healthCheckTimeout) {
//       if (props.healthCheck?.healthCheckTimeout.toSeconds() < 1 || props.healthCheck?.healthCheckTimeout.toSeconds() > 120) {
//         throw new Error('HealthCheckTimeout must be between 1 and 120seconds');
//       }
//     };

//     if (props.healthCheck?.healthyThresholdCount) {
//       if (props.healthCheck?.healthyThresholdCount < 1 || props.healthCheck?.healthyThresholdCount > 10) {
//         throw new Error('HealthyThresholdCount must be between 1 and 10');
//       }
//     };
//     // the enum returns a number, but we need a string, so convert
//     let matcher: aws_vpclattice.CfnTargetGroup.MatcherProperty | undefined = undefined;
//     if (props.healthCheck?.matcher) {
//       const codeAsString = props.healthCheck.matcher.toString();
//       matcher = { httpCode: codeAsString };
//     };

//     // default for https is 443, otherwise 80
//     var port: number = 80;
//     if (!(props.healthCheck?.port) && props.healthCheck?.protocol) {
//       if (props.healthCheck?.protocol === vpclattice.Protocol.HTTPS) {
//         port = 443;
//       }
//     };

//     if (props.protocolVersion) {
//       if (props.protocolVersion === vpclattice.ProtocolVersion.GRPC) {
//         throw new Error('GRPC is not supported');
//       }
//     };

//     if (props.healthCheck?.unhealthyThresholdCount) {
//       if (props.healthCheck?.unhealthyThresholdCount < 2 || props.healthCheck?.unhealthyThresholdCount > 10) {
//         throw new Error('UnhealthyThresholdCount must be between 2 and 10');
//       }
//     }

//     let targetHealthCheck: aws_vpclattice.CfnTargetGroup.HealthCheckConfigProperty = {
//       enabled: props.healthCheck?.enabled ?? true,
//       healthCheckIntervalSeconds: props.healthCheck?.healthCheckInterval?.toSeconds() ?? 30,
//       healthCheckTimeoutSeconds: props.healthCheck?.healthCheckTimeout?.toSeconds() ?? 5,
//       matcher: matcher,
//       path: props.healthCheck?.path ?? '/',
//       port: props.port ?? port,
//       protocol: props.healthCheck?.protocol ?? 'HTTP',
//       protocolVersion: props.healthCheck?.protocolVersion ?? 'HTTP1',
//       unhealthyThresholdCount: props.healthCheck?.unhealthyThresholdCount ?? 2,
//     };

//     this.targetGroupCfg = {
//       port: props.port,
//       protocol: props.protocol,
//       vpcIdentifier: props.vpc.vpcId,
//       ipAddressType: props.ipAddressType ?? vpclattice.IpAddressType.IPV4,
//       protocolVersion: props.protocolVersion ?? vpclattice.ProtocolVersion.HTTP1,
//       healthCheck: targetHealthCheck,
//     };
//   }
// }