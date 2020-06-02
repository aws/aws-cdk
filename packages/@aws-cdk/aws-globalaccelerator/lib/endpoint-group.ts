import * as cdk from '@aws-cdk/core';
import * as ga from './globalaccelerator.generated';
import { IListener } from './listener';

/**
 * The interface of the EndpointGroup
 */
export interface IEndpointGroup {
  /**
   * EndpointGroup ARN
   * @attribute
   */
  readonly EndpointGroupArn: string;
}

/**
 * Opitons to add Endpoint
 */
export interface EndpointConfigurationOptions {
  /**
   * Indicates whether client IP address preservation is enabled for an Application Load Balancer endpoint
   *
   * @default true
   */
  readonly clientIpReservation?: boolean;

  /**
   * An ID for the endpoint. If the endpoint is a Network Load Balancer or Application Load Balancer,
   * this is the Amazon Resource Name (ARN) of the resource. If the endpoint is an Elastic IP address,
   * this is the Elastic IP address allocation ID. For EC2 instances, this is the EC2 instance ID.
   */
  readonly endpointId: string;

  /**
   * The weight associated with the endpoint. When you add weights to endpoints, you configure AWS Global Accelerator
   * to route traffic based on proportions that you specify. For example, you might specify endpoint weights of 4, 5,
   * 5, and 6 (sum=20). The result is that 4/20 of your traffic, on average, is routed to the first endpoint, 5/20 is
   * routed both to the second and third endpoints, and 6/20 is routed to the last endpoint.
   * @see https://docs.aws.amazon.com/global-accelerator/latest/dg/about-endpoints-endpoint-weights.html
   * @default - not specified
   */
  readonly weight?: number;
}

/**
 * LoadBalancer Interface
 */
export interface LoadBalancer {
  /**
   * The ARN of this load balancer
   */
  readonly loadBalancerArn: string;
}

/**
 * Options for addLoadBalancer()
 */
export interface LoadBalancerOptions {
  /**
   * whether client IP address preservation is enabled
   */
  readonly clientIpReservation?: boolean;
  /**
   * The weight associated with the endpoint
   */
  readonly weight?: number;
}

/**
 * Property of the EndpointGroup
 */
export interface EndpointGroupProps {
  /**
   * The Amazon Resource Name (ARN) of the listener.
   */
  readonly listener: IListener;
  /**
   * The AWS Region where the endpoint group is located.
   *
   * @default - the region of the current stack
   */
  readonly region?: string;
}

export class EndpointConfiguration extends cdk.Construct {
  public readonly props: EndpointConfigurationOptions;
  constructor(scope: cdk.Construct, id: string, props: EndpointConfigurationOptions) {
    super(scope, id);
    this.props = props;
  }

  public renderEndpointConfiguration(): ga.CfnEndpointGroup.EndpointConfigurationProperty {
    return {
      clientIpPreservationEnabled: this.props.clientIpReservation,
      endpointId: this.props.endpointId,
      weight:  this.props.weight,
    };
  }
}

export class EndpointGroup extends cdk.Resource implements IEndpointGroup {

  public readonly EndpointGroupArn: string;
  protected readonly endpoints = new Array<EndpointConfiguration>();

  constructor(scope: cdk.Construct, id: string, props: EndpointGroupProps) {
    super(scope, id);

    const resource = new ga.CfnEndpointGroup(this, 'Resource', {
      listenerArn: props.listener.ListenerArn,
      endpointGroupRegion: props.region ?? cdk.Stack.of(this).region,
      endpointConfigurations: cdk.Lazy.anyValue({ produce: () => this.renderEndpoints() }, { omitEmptyArray: true }),
    });

    this.EndpointGroupArn = resource.attrEndpointGroupArn;
  }

  public addEndpoint(id: string, endpoint: EndpointConfigurationOptions) {
    return new EndpointConfiguration(this, id, endpoint);
  }

  public addLoadBalancer(id: string, lb: LoadBalancer, ops: LoadBalancerOptions = {}) {
    return new EndpointConfiguration(this, id, {
      endpointId: lb.loadBalancerArn,
      clientIpReservation: ops.clientIpReservation,
      weight: ops.weight,
    });
  }

  private renderEndpoints() {
    return this.endpoints.map(e => e.renderEndpointConfiguration());
  }
}
