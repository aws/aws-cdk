import { Construct, CustomResource, Stack } from '@aws-cdk/core';
import { Cluster } from './cluster';

/**
 * Properties for KubernetesResources
 */
export interface KubernetesResourceProps {
  /**
   * The EKS cluster to apply this configuration to.
   *
   * [disable-awslint:ref-via-interface]
   */
  readonly cluster: Cluster;

  /**
   * The resource manifest.
   *
   * Consists of any number of child resources.
   *
   * When the resource is created/updated, this manifest will be applied to the
   * cluster through `kubectl apply` and when the resource or the stack is
   * deleted, the manifest will be deleted through `kubectl delete`.
   *
   * @example
   *
   * {
   *   apiVersion: 'v1',
   *   kind: 'Pod',
   *   metadata: { name: 'mypod' },
   *   spec: {
   *     containers: [ { name: 'hello', image: 'paulbouwer/hello-kubernetes:1.5', ports: [ { containerPort: 8080 } ] } ]
   *   }
   * }
   *
   */
  readonly manifest: any[];
}

/**
 * Represents a resource within the Kubernetes system.
 *
 * Alternatively, you can use `cluster.addResource(resource[, resource, ...])`
 * to define resources on this cluster.
 *
 * Applies/deletes the resources using `kubectl` in sync with the resource.
 */
export class KubernetesResource extends Construct {
  /**
   * The CloudFormation reosurce type.
   */
  public static readonly RESOURCE_TYPE = 'Custom::AWSCDK-EKS-KubernetesResource';

  constructor(scope: Construct, id: string, props: KubernetesResourceProps) {
    super(scope, id);

    const stack = Stack.of(this);
    const provider = props.cluster._kubectlProvider;

    new CustomResource(this, 'Resource', {
      serviceToken: provider.serviceToken,
      resourceType: KubernetesResource.RESOURCE_TYPE,
      properties: {
        // `toJsonString` enables embedding CDK tokens in the manifest and will
        // render a CloudFormation-compatible JSON string (similar to
        // StepFunctions, CloudWatch Dashboards etc).
        Manifest: stack.toJsonString(props.manifest),
        ClusterName: props.cluster.clusterName,
        RoleArn: props.cluster._getKubectlCreationRoleArn(provider.role),
      },
    });
  }
}
