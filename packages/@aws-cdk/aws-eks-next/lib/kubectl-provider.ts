import * as path from 'path';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { Construct, Duration, Stack, NestedStack } from '@aws-cdk/core';
import * as cr from '@aws-cdk/custom-resources';
import { ICluster, Cluster } from './cluster';
import { KubectlLayer, KubectlLayerProps } from './kubectl-layer';

export interface KubectlProviderProps {
  /**
   * The cluster to control.
   */
  readonly cluster: ICluster;
}

export class KubectlProvider extends NestedStack {

  public static getOrCreate(scope: Construct, cluster: ICluster) {
    // if this is an "owned" cluster, it has a provider associated with it
    if (cluster instanceof Cluster) {
      return cluster._attachKubectlResourceScope(scope);
    }

    // if this is an imported cluster, we need to provision a custom resource provider in this stack
    // we will define one per stack for each cluster based on the cluster uniqueid
    const uid = `${cluster.node.uniqueId}-KubectlProvider`;
    const stack = Stack.of(scope);
    let provider = stack.node.tryFindChild(uid) as KubectlProvider;
    if (!provider) {
      provider = new KubectlProvider(stack, uid, { cluster });
    }

    return provider;
  }

  /**
   * The custom resource provider's service token.
   */
  public readonly serviceToken: string;

  /**
   * The IAM role to assume in order to perform kubectl operations against this cluster.
   */
  public readonly roleArn: string;

  /**
   * The IAM execution role of the handler.
   */
  public readonly handlerRole: iam.IRole;

  public constructor(scope: Construct, id: string, props: KubectlProviderProps) {
    super(scope, id);

    const cluster = props.cluster;

    if (!cluster.kubectlRole) {
      throw new Error('"kubectlRole" is not defined, cannot issue kubectl commands against this cluster');
    }

    if (cluster.kubectlPrivateSubnets && !cluster.kubectlSecurityGroup) {
      throw new Error('"kubectlSecurityGroup" is required if "kubectlSubnets" is specified');
    }

    const layer = cluster.kubectlLayer ?? getOrCreateKubectlLayer(this);

    const handler = new lambda.Function(this, 'Handler', {
      code: lambda.Code.fromAsset(path.join(__dirname, 'kubectl-handler')),
      runtime: lambda.Runtime.PYTHON_3_7,
      handler: 'index.handler',
      timeout: Duration.minutes(15),
      description: 'onEvent handler for EKS kubectl resource provider',
      layers: [layer],
      memorySize: 256,
      environment: cluster.kubectlEnvironment,

      // defined only when using private access
      vpc: cluster.kubectlPrivateSubnets ? cluster.vpc : undefined,
      securityGroups: cluster.kubectlSecurityGroup ? [cluster.kubectlSecurityGroup] : undefined,
      vpcSubnets: cluster.kubectlPrivateSubnets ? { subnets: cluster.kubectlPrivateSubnets } : undefined,
    });

    this.handlerRole = handler.role!;

    this.handlerRole.addToPolicy(new iam.PolicyStatement({
      actions: ['eks:DescribeCluster'],
      resources: [cluster.clusterArn],
    }));

    // allow this handler to assume the kubectl role
    cluster.kubectlRole.grant(this.handlerRole, 'sts:AssumeRole');

    const provider = new cr.Provider(this, 'Provider', {
      onEventHandler: handler,
    });

    this.serviceToken = provider.serviceToken;
    this.roleArn = cluster.kubectlRole.roleArn;
  }

}

/**
 * Gets or create a singleton instance of KubectlLayer.
 *
 * (exported for unit tests).
 */
export function getOrCreateKubectlLayer(scope: Construct, props: KubectlLayerProps = {}): KubectlLayer {
  const stack = Stack.of(scope);
  const id = 'kubectl-layer-' + (props.version ? props.version : '8C2542BC-BF2B-4DFE-B765-E181FD30A9A0');
  const exists = stack.node.tryFindChild(id) as KubectlLayer;
  if (exists) {
    return exists;
  }

  return new KubectlLayer(stack, id, props);
}
