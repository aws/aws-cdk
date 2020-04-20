import * as autoscaling from '@aws-cdk/aws-autoscaling';
import * as hooks from '@aws-cdk/aws-autoscaling-hooktargets';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as fs from 'fs';
import * as path from 'path';
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
   * Must be between 0 and 15 minutes.
   *
   * @default Duration.minutes(15)
   */
  drainTime?: cdk.Duration;
}

/**
 * A hook to drain instances from ECS traffic before they're terminated
 */
export class InstanceDrainHook extends cdk.Construct {

  /**
   * Constructs a new instance of the InstanceDrainHook class.
   */
  constructor(scope: cdk.Construct, id: string, props: InstanceDrainHookProps) {
    super(scope, id);

    const drainTime = props.drainTime || cdk.Duration.minutes(5);

    // Invoke Lambda via SNS Topic
    const fn = new lambda.Function(this, 'Function', {
      code: lambda.Code.fromInline(fs.readFileSync(path.join(__dirname, 'lambda-source', 'index.py'), { encoding: 'utf-8' })),
      handler: 'index.lambda_handler',
      runtime: lambda.Runtime.PYTHON_3_6,
      // Timeout: some extra margin for additional API calls made by the Lambda,
      // up to a maximum of 15 minutes.
      timeout: cdk.Duration.seconds(Math.min(drainTime.toSeconds() + 10, 900)),
      environment: {
        CLUSTER: props.cluster.clusterName,
      },
    });

    // Hook everything up: ASG -> Topic, Topic -> Lambda
    props.autoScalingGroup.addLifecycleHook('DrainHook', {
      lifecycleTransition: autoscaling.LifecycleTransition.INSTANCE_TERMINATING,
      defaultResult: autoscaling.DefaultResult.CONTINUE,
      notificationTarget: new hooks.FunctionHook(fn),
      heartbeatTimeout: drainTime,
    });

    // Describe actions cannot be restricted and restrict the CompleteLifecycleAction to the ASG arn
    // https://docs.aws.amazon.com/autoscaling/ec2/userguide/control-access-using-iam.html
    fn.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'ec2:DescribeInstances',
        'ec2:DescribeInstanceAttribute',
        'ec2:DescribeInstanceStatus',
        'ec2:DescribeHosts',
      ],
      resources: ['*'],
    }));

    // Restrict to the ASG
    fn.addToRolePolicy(new iam.PolicyStatement({
      actions: ['autoscaling:CompleteLifecycleAction'],
      resources: [props.autoScalingGroup.autoScalingGroupArn],
    }));

    fn.addToRolePolicy(new iam.PolicyStatement({
      actions: ['ecs:DescribeContainerInstances', 'ecs:DescribeTasks'],
      resources: ['*'],
    }));

    // Restrict to the ECS Cluster
    fn.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'ecs:ListContainerInstances',
        'ecs:SubmitContainerStateChange',
        'ecs:SubmitTaskStateChange',
      ],
      resources: [props.cluster.clusterArn],
    }));

    // Restrict the container-instance operations to the ECS Cluster
    fn.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'ecs:UpdateContainerInstancesState',
        'ecs:ListTasks',
      ],
      conditions: {
        ArnEquals: {'ecs:cluster': props.cluster.clusterArn},
      },
      resources: ['*'],
    }));
  }
}
