import autoscaling = require('@aws-cdk/aws-autoscaling');
import hooks = require('@aws-cdk/aws-autoscaling-hooktargets');
import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/cdk');
import fs = require('fs');
import path = require('path');
import { ICluster } from '../cluster';

// Reference for the source in this package:
//
// https://github.com/aws-samples/ecs-refarch-cloudformation/blob/master/infrastructure/lifecyclehook.yaml

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
   * Must be between 0 and 900.
   *
   * @default 900
   */
  drainTimeSec?: number;
}

/**
 * A hook to drain instances from ECS traffic before they're terminated
 */
export class InstanceDrainHook extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: InstanceDrainHookProps) {
    super(scope, id);

    const drainTimeSeconds = props.drainTimeSec !== undefined ? props.drainTimeSec : 300;

    if (drainTimeSeconds < 0 || drainTimeSeconds > 900) {
      throw new Error(`Drain time must be between 0 and 900 seconds, got: ${drainTimeSeconds}`);
    }

    // Invoke Lambda via SNS Topic
    const fn = new lambda.Function(this, 'Function', {
      code: lambda.Code.inline(fs.readFileSync(path.join(__dirname, 'lambda-source', 'index.py'), { encoding: 'utf-8' })),
      handler: 'index.lambda_handler',
      runtime: lambda.Runtime.Python36,
      // Timeout: some extra margin for additional API calls made by the Lambda,
      // up to a maximum of 15 minutes.
      timeout: Math.min(drainTimeSeconds + 10, 900),
      environment: {
        CLUSTER: props.cluster.clusterName
      }
    });

    // Hook everything up: ASG -> Topic, Topic -> Lambda
    props.autoScalingGroup.addLifecycleHook('DrainHook', {
      lifecycleTransition: autoscaling.LifecycleTransition.InstanceTerminating,
      defaultResult: autoscaling.DefaultResult.Continue,
      notificationTarget: new hooks.FunctionHook(fn),
      heartbeatTimeoutSec: drainTimeSeconds,
    });

    // FIXME: These should probably be restricted usefully in some way, but I don't exactly
    // know how.
    fn.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'autoscaling:CompleteLifecycleAction',
        'ec2:DescribeInstances',
        'ec2:DescribeInstanceAttribute',
        'ec2:DescribeInstanceStatus',
        'ec2:DescribeHosts',
      ],
      resources: ['*']
    }));

    // FIXME: These should be restricted to the ECS cluster probably, but I don't exactly
    // know how.
    fn.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'ecs:ListContainerInstances',
        'ecs:SubmitContainerStateChange',
        'ecs:SubmitTaskStateChange',
        'ecs:DescribeContainerInstances',
        'ecs:UpdateContainerInstancesState',
        'ecs:ListTasks',
        'ecs:DescribeTasks'
      ],
      resources: ['*']
    }));
  }
}
