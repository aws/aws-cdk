import * as autoscaling from '@aws-cdk/aws-autoscaling';
import { Stack } from '@aws-cdk/core';
import { BootstrapOptions } from './cluster';
import { LifecycleLabel } from './spot-interrupt-handler';

export function renderUserData(clusterName: string, autoScalingGroup: autoscaling.AutoScalingGroup, options: BootstrapOptions = { }): string[] {
  const stack = Stack.of(autoScalingGroup);

  // determine logical id of ASG so we can signal cloudformation
  const cfn = autoScalingGroup.node.defaultChild as autoscaling.CfnAutoScalingGroup;
  const asgLogicalId = cfn.logicalId;

  const extraArgs = new Array<string>();

  extraArgs.push(`--use-max-pods ${options.useMaxPods ?? true}`);

  if (options.awsApiRetryAttempts) {
    extraArgs.push(`--aws-api-retry-attempts ${options.awsApiRetryAttempts}`);
  }

  if (options.enableDockerBridge) {
    extraArgs.push('--enable-docker-bridge');
  }

  if (options.dockerConfigJson) {
    extraArgs.push(`--docker-config-json '${options.dockerConfigJson}'`);
  }

  if (options.additionalArgs) {
    extraArgs.push(options.additionalArgs);
  }

  const commandLineSuffix = extraArgs.join(' ');
  const kubeletExtraArgsSuffix = options.kubeletExtraArgs || '';

  // determine lifecycle label based on whether the ASG has a spot price.
  const lifecycleLabel = autoScalingGroup.spotPrice ? LifecycleLabel.SPOT : LifecycleLabel.ON_DEMAND;
  const withTaints = autoScalingGroup.spotPrice ? '--register-with-taints=spotInstance=true:PreferNoSchedule' : '';
  const kubeletExtraArgs = `--node-labels lifecycle=${lifecycleLabel} ${withTaints} ${kubeletExtraArgsSuffix}`.trim();

  return [
    'set -o xtrace',
    `/etc/eks/bootstrap.sh ${clusterName} --kubelet-extra-args "${kubeletExtraArgs}" ${commandLineSuffix}`.trim(),
    `/opt/aws/bin/cfn-signal --exit-code $? --stack ${stack.stackName} --resource ${asgLogicalId} --region ${stack.region}`,
  ];
}
