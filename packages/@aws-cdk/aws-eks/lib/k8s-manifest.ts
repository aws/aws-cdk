import { CustomResource, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { ICluster } from './cluster';
import { KubectlProvider } from './kubectl-provider';

// v2 - keep this import as a separate section to reduce merge conflict when forward merging with the v2 branch.
// eslint-disable-next-line
import { Construct as CoreConstruct } from '@aws-cdk/core';

/**
 * Properties for KubernetesManifest
 */
export interface KubernetesManifestProps {
  /**
   * The EKS cluster to apply this manifest to.
   *
   * [disable-awslint:ref-via-interface]
   */
  readonly cluster: ICluster;

  /**
   * The manifest to apply.
   *
   * Consists of any number of child resources.
   *
   * When the resources are created/updated, this manifest will be applied to the
   * cluster through `kubectl apply` and when the resources or the stack is
   * deleted, the resources in the manifest will be deleted through `kubectl delete`.
   *
   * @example
   *
   * [{
   *   apiVersion: 'v1',
   *   kind: 'Pod',
   *   metadata: { name: 'mypod' },
   *   spec: {
   *     containers: [ { name: 'hello', image: 'paulbouwer/hello-kubernetes:1.5', ports: [ { containerPort: 8080 } ] } ]
   *   }
   * }]
   *
   */
  readonly manifest: any[];
}

/**
 * Represents a manifest within the Kubernetes system.
 *
 * Alternatively, you can use `cluster.addManifest(resource[, resource, ...])`
 * to define resources on this cluster.
 *
 * Applies/deletes the manifest using `kubectl`.
 */
export class KubernetesManifest extends CoreConstruct {
  /**
   * The CloudFormation reosurce type.
   */
  public static readonly RESOURCE_TYPE = 'Custom::AWSCDK-EKS-KubernetesResource';

  constructor(scope: Construct, id: string, props: KubernetesManifestProps) {
    super(scope, id);

    const stack = Stack.of(this);
    const provider = KubectlProvider.getOrCreate(this, props.cluster);

    new CustomResource(this, 'Resource', {
      serviceToken: provider.serviceToken,
      resourceType: KubernetesManifest.RESOURCE_TYPE,
      properties: {
        // `toJsonString` enables embedding CDK tokens in the manifest and will
        // render a CloudFormation-compatible JSON string (similar to
        // StepFunctions, CloudWatch Dashboards etc).
        Manifest: stack.toJsonString(props.manifest),
        ClusterName: props.cluster.clusterName,
        RoleArn: provider.roleArn, // TODO: bake into provider's environment
      },
    });
  }
}
