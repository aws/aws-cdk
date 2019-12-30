import { CustomResource, NestedStack } from '@aws-cdk/aws-cloudformation';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { Construct, Duration, Stack } from '@aws-cdk/core';
import * as cr from '@aws-cdk/custom-resources';
import * as path from 'path';
import { Cluster } from './cluster';
import { KubectlLayer } from './kubectl-layer';

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

    if (!props.cluster._clusterResource) {
      throw new Error(`Cannot define a KubernetesManifest resource on a cluster with kubectl disabled`);
    }

    const stack = Stack.of(this);
    const provider = KubernetesResourceProvider.getOrCreate(this);

    new CustomResource(this, 'Resource', {
      provider: provider.provider,
      resourceType: KubernetesResource.RESOURCE_TYPE,
      properties: {
        // `toJsonString` enables embedding CDK tokens in the manifest and will
        // render a CloudFormation-compatible JSON string (similar to
        // StepFunctions, CloudWatch Dashboards etc).
        Manifest: stack.toJsonString(props.manifest),
        ClusterName: props.cluster.clusterName,
        RoleArn: props.cluster._clusterResource.getCreationRoleArn(provider.role)
      }
    });
  }
}

class KubernetesResourceProvider extends NestedStack {
  /**
   * Creates a stack-singleton resource provider nested stack.
   */
  public static getOrCreate(scope: Construct) {
    const stack = Stack.of(scope);
    const uid = '@aws-cdk/aws-eks.KubernetesResourceProvider';
    return stack.node.tryFindChild(uid) as KubernetesResourceProvider || new KubernetesResourceProvider(stack, uid);
  }

  /**
   * The custom resource provider.
   */
  public readonly provider: cr.Provider;

  /**
   * The IAM role used to execute this provider.
   */
  public readonly role: iam.IRole;

  private constructor(scope: Construct, id: string) {
    super(scope, id);

    const handler = new lambda.Function(this, 'Handler', {
      runtime: lambda.Runtime.PYTHON_2_7,
      handler: 'index.handler',
      timeout: Duration.minutes(15),
      layers: [ KubectlLayer.getOrCreate(this) ],
      memorySize: 256,
      code: lambda.Code.fromAsset(path.join(__dirname, 'k8s-resource-handler'))
    });

    this.provider = new cr.Provider(this, 'Provider', {
      onEventHandler: handler
    });

    this.role = handler.role!;

    this.role.addToPolicy(new iam.PolicyStatement({
      actions: [ 'eks:DescribeCluster' ],
      resources: [ '*' ]
    }));
  }
}