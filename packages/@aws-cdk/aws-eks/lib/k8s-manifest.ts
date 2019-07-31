import cfn = require('@aws-cdk/aws-cloudformation');
import { Construct, Stack } from '@aws-cdk/core';
import { Cluster } from './cluster';

export interface KubernetesManifestProps {
  /**
   * The EKS cluster to apply this configuration to.
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
 * Applies/deletes the manifest.
 */
export class KubernetesManifest extends Construct {
  /**
   * The CloudFormation reosurce type that represents this manifest.
   */
  public static RESORUCE_TYPE = 'Custom::KubernetesResource';

  constructor(scope: Construct, id: string, props: KubernetesManifestProps) {
    super(scope, id);

    const stack = Stack.of(this);
    const kubectl = props.cluster.kubectl;
    if (!kubectl) {
      throw new Error(`"kubectrl" is disabled for this cluster`);
    }

    new cfn.CustomResource(this, 'Resource', {
      provider: cfn.CustomResourceProvider.lambda(kubectl.function),
      resourceType: KubernetesManifest.RESORUCE_TYPE,
      properties: {
        Manifest: stack.toJsonString(props.resources),
      }
    });
  }
}
