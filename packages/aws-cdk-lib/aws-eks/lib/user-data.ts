import type { BootstrapOptions, ICluster } from './cluster';
import type * as autoscaling from '../../aws-autoscaling';
import { Stack, ValidationError } from '../../core';
import { lit } from '../../core/lib/private/literal-string';

// eslint-disable-next-line max-len
export function renderAmazonLinuxUserData(cluster: ICluster, autoScalingGroup: autoscaling.AutoScalingGroup, options: BootstrapOptions = {}): string[] {
  const stack = Stack.of(autoScalingGroup);

  // determine logical id of ASG so we can signal cloudformation
  const cfn = autoScalingGroup.node.defaultChild as autoscaling.CfnAutoScalingGroup;
  const asgLogicalId = cfn.logicalId;

  const extraArgs = new Array<string>();

  try {
    const clusterEndpoint = cluster.clusterEndpoint;
    const clusterCertificateAuthorityData =
      cluster.clusterCertificateAuthorityData;
    extraArgs.push(`--apiserver-endpoint '${clusterEndpoint}'`);
    extraArgs.push(`--b64-cluster-ca '${clusterCertificateAuthorityData}'`);
  } catch (e) {
    /**
     * Errors are ignored here.
     * apiserver-endpoint and b64-cluster-ca arguments are added in #12659 to make nodes join the cluster faster.
     * As these are not necessary arguments, we don't need to pass these arguments when they don't exist.
     *
     * @see https://github.com/aws/aws-cdk/pull/12659
     */
  }

  extraArgs.push(`--use-max-pods ${options.useMaxPods ?? true}`);

  if (options.awsApiRetryAttempts) {
    extraArgs.push(`--aws-api-retry-attempts ${options.awsApiRetryAttempts}`);
  }

  if (options.enableDockerBridge) {
    extraArgs.push('--enable-docker-bridge true');
  }

  if (options.dockerConfigJson) {
    extraArgs.push(`--docker-config-json '${options.dockerConfigJson}'`);
  }

  if (options.dnsClusterIp) {
    extraArgs.push(`--dns-cluster-ip ${options.dnsClusterIp}`);
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
    `/etc/eks/bootstrap.sh ${cluster.clusterName} --kubelet-extra-args "${kubeletExtraArgs}" ${commandLineSuffix}`.trim(),
    `/opt/aws/bin/cfn-signal --exit-code $? --stack ${stack.stackName} --resource ${asgLogicalId} --region ${stack.region}`,
  ];
}

/**
 * Render the nodeadm `NodeConfig` for an Amazon Linux 2023 node.
 *
 * nodeadm requires the cluster name, API server endpoint, certificate authority and service CIDR.
 * The node lifecycle label and spot taint match the Amazon Linux 2 bootstrap.
 *
 * @see https://awslabs.github.io/amazon-eks-ami/nodeadm/doc/api/
 */
// eslint-disable-next-line max-len
export function renderAmazonLinux2023UserData(cluster: ICluster, autoScalingGroup: autoscaling.AutoScalingGroup, serviceCidr: string, options: BootstrapOptions = {}): string {
  const unsupported = new Array<string>();
  if (options.useMaxPods === false) { unsupported.push('useMaxPods'); }
  if (options.enableDockerBridge !== undefined) { unsupported.push('enableDockerBridge'); }
  if (options.awsApiRetryAttempts !== undefined) { unsupported.push('awsApiRetryAttempts'); }
  if (options.dockerConfigJson !== undefined) { unsupported.push('dockerConfigJson'); }
  if (options.additionalArgs !== undefined) { unsupported.push('additionalArgs'); }
  if (unsupported.length > 0) {
    throw new ValidationError(lit`UnsupportedAl2023BootstrapOptions`,
      `bootstrapOptions ${unsupported.join(', ')} are not supported for Amazon Linux 2023 nodes (nodeadm). ` +
      'Use kubeletExtraArgs, dnsClusterIp or serviceCidr instead.', autoScalingGroup);
  }

  let apiServerEndpoint: string;
  let certificateAuthority: string;
  try {
    apiServerEndpoint = cluster.clusterEndpoint;
    certificateAuthority = cluster.clusterCertificateAuthorityData;
  } catch (e) {
    throw new ValidationError(lit`Al2023RequiresEndpointAndCa`,
      'Amazon Linux 2023 nodes need the cluster endpoint and certificate authority data. ' +
      'When importing the cluster, set clusterEndpoint and clusterCertificateAuthorityData.', autoScalingGroup);
  }

  const lifecycleLabel = autoScalingGroup.spotPrice ? LifecycleLabel.SPOT : LifecycleLabel.ON_DEMAND;
  const flags = [`--node-labels=lifecycle=${lifecycleLabel}`];
  if (autoScalingGroup.spotPrice) {
    flags.push('--register-with-taints=spotInstance=true:PreferNoSchedule');
  }
  if (options.kubeletExtraArgs) {
    flags.push(...options.kubeletExtraArgs.trim().split(/\s+/));
  }

  const lines = [
    '---',
    'apiVersion: node.eks.aws/v1alpha1',
    'kind: NodeConfig',
    'spec:',
    '  cluster:',
    `    name: ${cluster.clusterName}`,
    `    apiServerEndpoint: ${apiServerEndpoint}`,
    `    certificateAuthority: ${certificateAuthority}`,
    `    cidr: ${serviceCidr}`,
    '  kubelet:',
  ];
  if (options.dnsClusterIp) {
    lines.push('    config:', '      clusterDNS:', `      - ${options.dnsClusterIp}`);
  }
  lines.push('    flags:', ...flags.map(flag => `    - ${JSON.stringify(flag)}`));
  return lines.join('\n') + '\n';
}

export function renderBottlerocketUserData(cluster: ICluster): string[] {
  return [
    '[settings.kubernetes]',
    `api-server="${cluster.clusterEndpoint}"`,
    `cluster-certificate="${cluster.clusterCertificateAuthorityData}"`,
    `cluster-name="${cluster.clusterName}"`,
  ];
}

/**
 * The lifecycle label for node selector
 */
export enum LifecycleLabel {
  /**
   * on-demand instances
   */
  ON_DEMAND = 'OnDemand',
  /**
   * spot instances
   */
  SPOT = 'Ec2Spot',
}
