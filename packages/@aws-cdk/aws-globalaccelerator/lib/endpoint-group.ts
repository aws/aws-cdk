import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as ga from './globalaccelerator.generated';
import { IListener } from './listener';

/**
 * The interface of the EndpointGroup
 */
export interface IEndpointGroup extends cdk.IResource {
  /**
   * EndpointGroup ARN
   * @attribute
   */
  readonly endpointGroupArn: string;
}

/**
 * Options for `addLoadBalancer`, `addElasticIpAddress` and `addEc2Instance` to add endpoints into the endpoint group
 */
export interface EndpointConfigurationOptions {
  /**
   * Indicates whether client IP address preservation is enabled for an Application Load Balancer endpoint
   *
   * @default true
   */
  readonly clientIpReservation?: boolean;

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
 * Properties to create EndpointConfiguration
 *
 */
export interface EndpointConfigurationProps extends EndpointConfigurationOptions {
  /**
   * The endopoint group reesource
   *
   * [disable-awslint:ref-via-interface]
   */
  readonly endpointGroup: EndpointGroup;

  /**
   * An ID for the endpoint. If the endpoint is a Network Load Balancer or Application Load Balancer,
   * this is the Amazon Resource Name (ARN) of the resource. If the endpoint is an Elastic IP address,
   * this is the Elastic IP address allocation ID. For EC2 instances, this is the EC2 instance ID.
   */
  readonly endpointId: string;
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
 * EC2 Instance interface
 */
export interface Ec2Instance {
  /**
   * The id of the instance resource
   */
  readonly instanceId: string;
}

/**
 * EIP Interface
 */
export interface ElasticIpAddress {
  /**
   * allocation ID of the EIP resoruce
   */
  readonly attrAllocationId: string
}

/**
 * Property of the EndpointGroup
 */
export interface EndpointGroupProps {
  /**
   * Name of the endpoint group
   *
   * @default - logical ID of the resource
   */
  readonly endpointGroupName?: string;

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

/**
 * The class for endpoint configuration
 */
export class EndpointConfiguration extends Construct {
  /**
   * The property containing all the configuration to be rendered
   */
  public readonly props: EndpointConfigurationProps;
  constructor(scope: Construct, id: string, props: EndpointConfigurationProps) {
    super(scope, id);
    this.props = props;
    props.endpointGroup._linkEndpoint(this);
  }

  /**
   * render the endpoint configuration for the endpoint group
   */
  public renderEndpointConfiguration(): ga.CfnEndpointGroup.EndpointConfigurationProperty {
    return {
      clientIpPreservationEnabled: this.props.clientIpReservation,
      endpointId: this.props.endpointId,
      weight: this.props.weight,
    };
  }
}

/**
 * EndpointGroup construct
 */
export class EndpointGroup extends cdk.Resource implements IEndpointGroup {
  /**
   * import from ARN
   */
  public static fromEndpointGroupArn(scope: Construct, id: string, endpointGroupArn: string): IEndpointGroup {
    class Import extends cdk.Resource implements IEndpointGroup {
      public readonly endpointGroupArn = endpointGroupArn;
    }
    return new Import(scope, id);
  }

  public readonly endpointGroupArn: string;
  /**
   *
   * The name of the endpoint group
   *
   * @attribute
   */
  public readonly endpointGroupName: string;
  /**
   * The array of the endpoints in this endpoint group
   */
  protected readonly endpoints = new Array<EndpointConfiguration>();

  constructor(scope: Construct, id: string, props: EndpointGroupProps) {
    super(scope, id);

    const resource = new ga.CfnEndpointGroup(this, 'Resource', {
      listenerArn: props.listener.listenerArn,
      endpointGroupRegion: props.region ?? cdk.Stack.of(this).region,
      endpointConfigurations: cdk.Lazy.any({ produce: () => this.renderEndpoints() }, { omitEmptyArray: true }),
    });

    this.endpointGroupArn = resource.attrEndpointGroupArn;
    this.endpointGroupName = props.endpointGroupName ?? resource.logicalId;
  }

  /**
   * Add an endpoint
   */
  public addEndpoint(id: string, endpointId: string, props: EndpointConfigurationOptions =
  {}) {
    return new EndpointConfiguration(this, id, {
      endpointGroup: this,
      endpointId,
      ...props,
    });
  }

  /**
   * Add an Elastic Load Balancer as an endpoint in this endpoint group
   */
  public addLoadBalancer(id: string, lb: LoadBalancer, props: EndpointConfigurationOptions = {}) {
    return new EndpointConfiguration(this, id, {
      endpointId: lb.loadBalancerArn,
      endpointGroup: this,
      ...props,
    });
  }

  /**
   * Add an EIP as an endpoint in this endpoint group
   */
  public addElasticIpAddress(id: string, eip: ElasticIpAddress, props: EndpointConfigurationOptions = {}) {
    return new EndpointConfiguration(this, id, {
      endpointId: eip.attrAllocationId,
      endpointGroup: this,
      ...props,
    });
  }

  /**
   * Add an EC2 Instance as an endpoint in this endpoint group
   */
  public addEc2Instance(id: string, instance: Ec2Instance, props: EndpointConfigurationOptions = {}) {
    return new EndpointConfiguration(this, id, {
      endpointId: instance.instanceId,
      endpointGroup: this,
      ...props,
    });
  }

  /**
   * Links a endpoint to this endpoint group
   * @internal
   */
  public _linkEndpoint(endpoint: EndpointConfiguration) {
    this.endpoints.push(endpoint);
  }

  private renderEndpoints() {
    return this.endpoints.map(e => e.renderEndpointConfiguration());
  }
}
