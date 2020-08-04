import { Construct, Duration } from '@aws-cdk/core';
import { Cluster } from './cluster';
import { KubernetesGet as KubernetesGet } from './k8s-get';

/**
 * Options for `cluster.describeService` operation.
 */
export interface DescribeServiceOptions {
  /**
   * The service name.
   */
  readonly serviceName: string;

  /**
   * Timeout for waiting on service attribute.
   * For example, the external ip of a load balancer will not immediately available and needs to be waited for.
   *
   * @default Duration.minutes(5)
   */
  readonly timeout?: Duration;

}

/**
 * Properties for ServiceDescription.
 */
export interface ServiceDescriptionProps extends DescribeServiceOptions {

  /**
   * The Cluster that the service is deployed in.
   *
   * [disable-awslint:ref-via-interface]
   */
  readonly cluster: Cluster;

}

/**
 * Represents the description of an existing kubernetes service.
 */
export class ServiceDescription extends Construct {

  /**
   * Address of the Load Balancer created bu kubernetes in case the service
   * type is 'LoadBalancer'
   *
   * Using this with a non load balancer service will result in an error.
   * // TODO - Make this undefined in this case instead of throwing.
   */
  public readonly loadBalancerAddress: string;

  constructor(scope: Construct, id: string, props: ServiceDescriptionProps) {
    super(scope, id);

    const loadBalancerAddress = new KubernetesGet(this, 'LoadBalancerAttribute', {
      cluster: props.cluster,
      resourceType: 'service',
      resourceName: props.serviceName,
      jsonPath: '.status.loadBalancer.ingress[0].hostname',
      timeout: props.timeout ?? Duration.minutes(5),
    });

    this.loadBalancerAddress = loadBalancerAddress.value;
  }
}