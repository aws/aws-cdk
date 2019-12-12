import cfn = require('@aws-cdk/aws-cloudformation');
import { Construct, Stack } from '@aws-cdk/core';
import { Cluster } from './cluster';

/**
 * Helm Release Properties.
 */
export interface HelmReleaseProps {
  /**
   * The EKS cluster to apply this configuration to.
   *
   * [disable-awslint:ref-via-interface]
   */
  readonly cluster: Cluster;

  /**
   * The name of the release.
   */
  readonly name: string;

  /**
   * The name of the chart.
   */
  readonly chart: string;

  /**
   * The repository.
   * 
   * @default No repository will be used, which means that the chart needs to be an absolute URL.
   */
  readonly repository?: string;

  /**
   * The Kubernetes namespace scope of the requests.
   * @default default
   */
  readonly namespace?: string;

  /**
   * The values.
   * @default No values are provided to the chart.
   */
  readonly values?: {[key: string]: any};
}

/**
 * Represents a helm chart within the Kubernetes system.
 *
 * Applies/deletes the resources using `kubectl` in sync with the resource.
 */
export class HelmRelease extends Construct {
  /**
   * The CloudFormation reosurce type.
   */
  public static readonly RESOURCE_TYPE = 'Custom::AWSCDK-EKS-HelmRelease';

  constructor(scope: Construct, id: string, props: HelmReleaseProps) {
    super(scope, id);

    const stack = Stack.of(this);

    // we maintain a single manifest custom resource handler for each cluster
    const handler = props.cluster._helmReleaseHandler;
    if (!handler) {
      throw new Error(`Cannot define a Helm release on a cluster with kubectl disabled`);
    }

    new cfn.CustomResource(this, 'Resource', {
      provider: cfn.CustomResourceProvider.lambda(handler),
      resourceType: HelmRelease.RESOURCE_TYPE,
      properties: {
        Name: props.name,
        Chart: props.chart,
        Values: (props.values ? stack.toJsonString(props.values) : undefined),
        Namespace: props.namespace,
        Repository: props.repository
      }
    });
  }
}
