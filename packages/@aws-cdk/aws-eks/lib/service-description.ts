import { Construct, Duration } from '@aws-cdk/core';
import { Cluster } from './cluster';
import { KubernetesResourceAttribute } from './k8s-attribute';

/**
 * Properties for ServiceDescription.
 */
export interface ServiceDescriptionProps {

  /**
   * The Cluster that the service is deployed in.
   *
   * [disable-awslint:ref-via-interface]
   */
  readonly cluster: Cluster;

  /**
   * The service name.
   */
  readonly serviceName: string;
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

    const loadBalancerAddress = new KubernetesResourceAttribute(this, 'LoadBalancerAttribute', {
      cluster: props.cluster,
      resourceType: 'service',
      resourceName: props.serviceName,
      jsonPath: '.status.loadBalancer.ingress[0].hostname',
      timeout: Duration.minutes(5),
    });

    this.loadBalancerAddress = loadBalancerAddress.value;
  }
}