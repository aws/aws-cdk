import cfn = require('@aws-cdk/aws-cloudformation');
import { Construct, Stack } from '@aws-cdk/core';
import { Cluster } from './cluster';

// const REPOSITORY_STABLE = "https://kubernetes-charts.storage.googleapis.com";
// const REPOSITORY_INCUBATOR = "https://kubernetes-charts-incubator.storage.googleapis.com";

export interface HelmReleaseProps {
  /**
   * The EKS cluster to apply this configuration to.
   *
   * [disable-awslint:ref-via-interface]
   */
  readonly cluster: Cluster;

  /**
   * The name of the release.
   * @attribute
   */
  readonly name: string;

  /**
   * The chart name.
   * @attribute
   */
  readonly chart?: string;

  /**
   * The repository.
   * @attribute
   */
  readonly repository?: string;

  /**
   * The namespace.
   * @attribute
   */
  readonly namespace?: string;

  /**
   * The values.
   * @attribute
   */
  readonly values?: any;
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
