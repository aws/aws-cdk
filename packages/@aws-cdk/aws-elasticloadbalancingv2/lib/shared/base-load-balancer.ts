import ec2 = require('@aws-cdk/aws-ec2');
import { Construct, IResource, Lazy, Resource } from '@aws-cdk/core';
import { CfnLoadBalancer } from '../elasticloadbalancingv2.generated';
import { Attributes, ifUndefined, renderAttributes } from './util';

/**
 * Shared properties of both Application and Network Load Balancers
 */
export interface BaseLoadBalancerProps {
  /**
   * Name of the load balancer
   *
   * @default - Automatically generated name.
   */
  readonly loadBalancerName?: string;

  /**
   * The VPC network to place the load balancer in
   */
  readonly vpc: ec2.IVpc;

  /**
   * Whether the load balancer has an internet-routable address
   *
   * @default false
   */
  readonly internetFacing?: boolean;

  /**
   * Where in the VPC to place the load balancer
   *
   * @default - Public subnets if internetFacing, otherwise private subnets.
   */
  readonly vpcSubnets?: ec2.SubnetSelection;

  /**
   * Indicates whether deletion protection is enabled.
   *
   * @default false
   */
  readonly deletionProtection?: boolean;
}

export interface ILoadBalancerV2 extends IResource {
  /**
   * The canonical hosted zone ID of this load balancer
   *
   * @attribute
   * @example Z2P70J7EXAMPLE
   */
  readonly loadBalancerCanonicalHostedZoneId: string;

  /**
   * The DNS name of this load balancer
   *
   * @attribute
   * @example my-load-balancer-424835706.us-west-2.elb.amazonaws.com
   */
  readonly loadBalancerDnsName: string;
}

/**
 * Base class for both Application and Network Load Balancers
 */
export abstract class BaseLoadBalancer extends Resource {
  /**
   * The canonical hosted zone ID of this load balancer
   *
   * @attribute
   * @example Z2P70J7EXAMPLE
   */
  public readonly loadBalancerCanonicalHostedZoneId: string;

  /**
   * The DNS name of this load balancer
   *
   * @attribute
   * @example my-load-balancer-424835706.us-west-2.elb.amazonaws.com
   */
  public readonly loadBalancerDnsName: string;

  /**
   * The full name of this load balancer
   *
   * @attribute
   * @example app/my-load-balancer/50dc6c495c0c9188
   */
  public readonly loadBalancerFullName: string;

  /**
   * The name of this load balancer
   *
   * @attribute
   * @example my-load-balancer
   */
  public readonly loadBalancerName: string;

  /**
   * The ARN of this load balancer
   *
   * @attribute
   * @example arn:aws:elasticloadbalancing:us-west-2:123456789012:loadbalancer/app/my-internal-load-balancer/50dc6c495c0c9188
   */
  public readonly loadBalancerArn: string;

  /**
   * @attribute
   */
  public readonly loadBalancerSecurityGroups: string[];

  /**
   * The VPC this load balancer has been created in, if available
   *
   * If the Load Balancer was imported, the VPC is not available.
   */
  public readonly vpc?: ec2.IVpc;

  /**
   * Attributes set on this load balancer
   */
  private readonly attributes: Attributes = {};

  constructor(scope: Construct, id: string, baseProps: BaseLoadBalancerProps, additionalProps: any) {
    super(scope, id, {
      physicalName: baseProps.loadBalancerName,
    });

    const internetFacing = ifUndefined(baseProps.internetFacing, false);

    const vpcSubnets = ifUndefined(baseProps.vpcSubnets,
      { subnetType: internetFacing ? ec2.SubnetType.PUBLIC : ec2.SubnetType.PRIVATE });

    const { subnetIds, internetConnectivityEstablished } = baseProps.vpc.selectSubnets(vpcSubnets);

    this.vpc = baseProps.vpc;

    const resource = new CfnLoadBalancer(this, 'Resource', {
      name: this.physicalName,
      subnets: subnetIds,
      scheme: internetFacing ? 'internet-facing' : 'internal',
      loadBalancerAttributes: Lazy.anyValue({ produce: () => renderAttributes(this.attributes) }, {omitEmptyArray: true} ),
      ...additionalProps
    });
    if (internetFacing) {
      resource.node.addDependency(internetConnectivityEstablished);
    }

    if (baseProps.deletionProtection) { this.setAttribute('deletion_protection.enabled', 'true'); }

    this.loadBalancerCanonicalHostedZoneId = resource.attrCanonicalHostedZoneId;
    this.loadBalancerDnsName = resource.attrDnsName;
    this.loadBalancerFullName = resource.attrLoadBalancerFullName;
    this.loadBalancerName = resource.attrLoadBalancerName;
    this.loadBalancerArn = resource.ref;
    this.loadBalancerSecurityGroups = resource.attrSecurityGroups;
  }

  /**
   * Set a non-standard attribute on the load balancer
   *
   * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/application-load-balancers.html#load-balancer-attributes
   */
  public setAttribute(key: string, value: string | undefined) {
    this.attributes[key] = value;
  }

  /**
   * Remove an attribute from the load balancer
   */
  public removeAttribute(key: string) {
    this.setAttribute(key, undefined);
  }
}
