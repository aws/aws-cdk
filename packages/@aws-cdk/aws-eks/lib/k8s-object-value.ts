import { CustomResource, Token, Duration } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { ICluster } from './cluster';
import { KubectlProvider } from './kubectl-provider';

/**
 * Properties for KubernetesObjectValue.
 */
export interface KubernetesObjectValueProps {
  /**
   * The EKS cluster to fetch attributes from.
   *
   * [disable-awslint:ref-via-interface]
   */
  readonly cluster: ICluster;

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
   * @default - Exactly one of `jsonPath` or `goTemplate` must be specified.
   *
   * @see https://kubernetes.io/docs/reference/kubectl/jsonpath/
   */
  readonly jsonPath?: string;

  /**
   * Go template to the specific value.
   *
   * @default - Exactly one of `jsonPath` or `goTemplate` must be specified.
   *
   * @see https://pkg.go.dev/text/template#pkg-overview
   */
  readonly goTemplate?: string;

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

    if ((props.jsonPath === undefined) === (props.goTemplate === undefined)) {
      throw new Error('Exactly one of \'jsonPath\' or \'goTemplate\' must be specified.');
    }

    const provider = KubectlProvider.getOrCreate(this, props.cluster);

    this._resource = new CustomResource(this, 'Resource', {
      resourceType: KubernetesObjectValue.RESOURCE_TYPE,
      serviceToken: provider.serviceToken,
      properties: {
        ClusterName: props.cluster.clusterName,
        RoleArn: provider.roleArn,
        ObjectType: props.objectType,
        ObjectName: props.objectName,
        ObjectNamespace: props.objectNamespace ?? 'default',
        JsonPath: props.jsonPath,
        GoTemplate: props.goTemplate,
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
