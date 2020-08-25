import { Construct, CustomResource, Token, Duration } from '@aws-cdk/core';
import { Cluster } from './cluster';

/**
 * Properties for KubernetesObjectValue.
 */
export interface KubernetesObjectValueProps {
  /**
   * The EKS cluster to fetch attributes from.
   *
   * [disable-awslint:ref-via-interface]
   */
  readonly cluster: Cluster;

  /**
   * The object type to query. (e.g 'service', 'pod'...)
   */
  readonly objectType: string;

  /**
   * The name of the object to query.
   */
  readonly objectName: string;

  /**
   * The namespace the object belongs to.
   *
   * @default 'default'
   */
  readonly objectNamespace?: string;

  /**
   * JSONPath to the specific value.
   *
   * @see https://kubernetes.io/docs/reference/kubectl/jsonpath/
   */
  readonly jsonPath: string;

  /**
   * Timeout for waiting on a value.
   *
   * @default Duration.minutes(5)
   */
  readonly timeout?: Duration;

}

/**
 * Represents a value of a specific object deployed in the cluster.
 * Use this to fetch any information available by the `kubectl get` command.
 */
export class KubernetesObjectValue extends Construct {
  /**
   * The CloudFormation reosurce type.
   */
  public static readonly RESOURCE_TYPE = 'Custom::AWSCDK-EKS-KubernetesObjectValue';

  private _resource: CustomResource;

  constructor(scope: Construct, id: string, props: KubernetesObjectValueProps) {
    super(scope, id);

    const provider = props.cluster._attachKubectlResourceScope(this);

    this._resource = new CustomResource(this, 'Resource', {
      resourceType: KubernetesObjectValue.RESOURCE_TYPE,
      serviceToken: provider.serviceToken,
      properties: {
        ClusterName: props.cluster.clusterName,
        RoleArn: props.cluster._kubectlCreationRole.roleArn,
        ObjectType: props.objectType,
        ObjectName: props.objectName,
        ObjectNamespace: props.objectNamespace ?? 'default',
        JsonPath: props.jsonPath,
        TimeoutSeconds: (props?.timeout ?? Duration.minutes(5)).toSeconds(),
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
