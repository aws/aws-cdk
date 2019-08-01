import cfn = require('@aws-cdk/aws-cloudformation');
import { Construct, Stack } from '@aws-cdk/core';
import { Cluster } from './cluster';

export interface KubernetesManifestProps {
  /**
   * The EKS cluster to apply this configuration to.
   *
   * [disable-awslint:ref-via-interface]
   */
  readonly cluster: Cluster;

  /**
   * The resources in this manifest.
   */
  readonly resources: any[];
}

/**
 * Represents a set of Kuberenetes resources in this cluster.
 *
 * Alternatively, you can use `cluster.addManifest(resource[, resource, ...])`
 * to define resources on this cluster.
 *
 * Applies/deletes the resources using `kubectl` in sync with the resource.
 */
export class KubernetesManifest extends Construct {
  /**
   * The CloudFormation reosurce type.
   */
  public static readonly RESORUCE_TYPE = 'Custom::AWSCDK-EKS-KubernetesManifest';

  constructor(scope: Construct, id: string, props: KubernetesManifestProps) {
    super(scope, id);

    const stack = Stack.of(this);

    // we maintain a single manifest custom resource handler for each cluster
    const handler = props.cluster._manifestHandler;
    if (!handler) {
      throw new Error(`Cannot define a KubernetesManifest resource on a cluster with kubectl disabled`);
    }

    new cfn.CustomResource(this, 'Resource', {
      provider: cfn.CustomResourceProvider.lambda(handler),
      resourceType: KubernetesManifest.RESORUCE_TYPE,
      properties: {
        Manifest: stack.toJsonString(props.resources),
      }
    });
  }
}
