import * as core from 'aws-cdk-lib';

import {
  aws_vpclattice,
  aws_ec2 as ec2,
  aws_lambda as aws_lambda,
  aws_elasticloadbalancingv2 as elbv2,
}
  from 'aws-cdk-lib';

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
  targetGroupId: string
  /**
   * The Arn of the target group
   */
  targetGroupArn: string;

}
/**
 * Properties for a Target Group, Only supply one of instancetargets, lambdaTargets, albTargets, ipTargets
 */
export interface TargetGroupProps {
  /**
   * The name of the target group
   */
  name: string,
  /**
   * A list of ec2 instance targets.
   */
  instancetargets?: ec2.Instance[],
  /**
   * A list of ip targets
   */
  ipTargets?: string[],
  /**
   * A list of lambda targets
   */
  lambdaTargets?: aws_lambda.Function[],
  /**
   * A list of alb targets
   */
  albTargets?: elbv2.ApplicationListener[]
  /**
   * The Target Group configuration. Must be provided for alb, instance and Ip targets, but
   * must not be provided for lambda targets
   */
  config?: vpclattice.TargetGroupConfig | undefined,
}

/**
 * Create a vpc lattice TargetGroup
 *
 * @example
 * ```javascript
 * const targetGroup = new vpclattice.TargetGroup(this, 'TargetGroup', {
 *   name: 'TargetGroup',
 *   instancetargets: [
 *     ec2Instance1,
 *     ec2Instance2,
 *   ],
 *   config: {
 *     port: 80,
 *     protocol: vpclattice.Protocol.TCP,
 *   },
 * }
 */
export class TargetGroup extends core.Resource implements ITargetGroup {

  /*
  * the Id of the targetGroup
  **/
  targetGroupId: string
  /**
   * The Arn of the targetGroup
   */
  targetGroupArn: string


  constructor(scope: constructs.Construct, id: string, props: TargetGroupProps) {
    super(scope, id);

    let targetType: vpclattice.TargetType;
    let targets: aws_vpclattice.CfnTargetGroup.TargetProperty[] = [];

    // Lambda Targets
    if (props.lambdaTargets && props.lambdaTargets.length > 0
      && props.instancetargets === undefined
      && props.albTargets === undefined
      && props.ipTargets === undefined ) {
      targetType = vpclattice.TargetType.LAMBDA;
      props.lambdaTargets.forEach((target) => {
        targets.push(
          { id: target.functionArn },
        );
      });
    // EC2 Instance Targets
    } else if (props.instancetargets && props.instancetargets.length > 0
      && props.lambdaTargets === undefined
      && props.albTargets === undefined
      && props.ipTargets === undefined ) {
      targetType = vpclattice.TargetType.INSTANCE;
      props.instancetargets.forEach((target) => {
        targets.push(
          { id: target.instanceId },
        );
      });
    // ALB Targets
    } else if (props.albTargets && props.albTargets.length > 0
      && props.instancetargets === undefined
      && props.lambdaTargets === undefined
      && props.ipTargets === undefined ) {
      targetType = vpclattice.TargetType.INSTANCE;
      props.albTargets.forEach((target) => {
        targets.push(
          { id: target.listenerArn },
        );
      });
    // IP Targets
    } else if (props.ipTargets && props.ipTargets.length > 0
      && props.instancetargets === undefined
      && props.lambdaTargets === undefined
      && props.albTargets === undefined ) {
      targetType = vpclattice.TargetType.IP;
      props.ipTargets.forEach((target) => {
        targets.push(
          { id: target },
        );
      });
    } else {
      throw new Error('Only one kind of target can be specifed, and at least one target must be provided');
    };

    // check that there is a config if the target type is lambda
    if ( props.lambdaTargets && props.config ) {
      throw new Error('No configuration should be supplied for a target group of lambdas');
    }

    const targetGroup = new aws_vpclattice.CfnTargetGroup(this, 'Resource', {
      type: targetType,
      name: props.name,
      config: props.config?.targetGroupConfig,
      targets: targets,
    });

    this.targetGroupId = targetGroup.attrId;
    this.targetGroupArn = targetGroup.attrArn;
  }
}