import { Construct, CustomResource, Token, Duration } from '@aws-cdk/core';
import { Cluster } from './cluster';

/**
 * Properties for KubernetesGet.
 */
export interface KubernetesGetProps {
  /**
   * The EKS cluster to fetch attributes from.
   *
   * [disable-awslint:ref-via-interface]
   */
  readonly cluster: Cluster;

  /**
   * The resource type to query. (e.g 'service', 'pod'...)
   */
  readonly resourceType: string;

  /**
   * The name of the resource to query.
   */
  readonly resourceName: string;

  /**
   * JSONPath to use in the query.
   *
   * @see https://kubernetes.io/docs/reference/kubectl/jsonpath/
   */
  readonly jsonPath: string;

  /**
   * Timeout for waiting on a value.
   */
  readonly timeout: Duration;

}

/**
 * Represents an attribute of a resource deployed in the cluster.
 * Use this to fetch runtime information about resources.
 */
export class KubernetesGet extends Construct {
  /**
   * The CloudFormation reosurce type.
   */
  public static readonly RESOURCE_TYPE = 'Custom::AWSCDK-EKS-KubernetesGet';

  private _resource: CustomResource;

  constructor(scope: Construct, id: string, props: KubernetesGetProps) {
    super(scope, id);

    const provider = props.cluster._attachKubectlResourceScope(this);

    this._resource = new CustomResource(this, 'Resource', {
      resourceType: KubernetesGet.RESOURCE_TYPE,
      serviceToken: provider.serviceToken,
      properties: {
        ClusterName: props.cluster.clusterName,
        RoleArn: props.cluster._kubectlCreationRole.roleArn,
        ResourceType: props.resourceType,
        ResourceName: props.resourceName,
        JsonPath: props.jsonPath,
        TimeoutSeconds: props.timeout.toSeconds(),
      },
    });

  }

  /**
   * The value as a string token.
   */
  public get value(): string {
    return Token.asString(this._resource.getAtt('Value'));
  }
}
