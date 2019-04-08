import ec2 = require('@aws-cdk/aws-ec2');
import route53 = require('@aws-cdk/aws-route53');
import cdk = require('@aws-cdk/cdk');
import { CfnLoadBalancer } from '../elasticloadbalancingv2.generated';
import { Attributes, ifUndefined, renderAttributes } from './util';

/**
 * Shared properties of both Application and Network Load Balancers
 */
export interface BaseLoadBalancerProps {
  /**
   * Name of the load balancer
   *
   * @default Automatically generated name
   */
  readonly loadBalancerName?: string;

  /**
   * The VPC network to place the load balancer in
   */
  readonly vpc: ec2.IVpcNetwork;

  /**
   * Whether the load balancer has an internet-routable address
   *
   * @default false
   */
  readonly internetFacing?: boolean;

  /**
   * Where in the VPC to place the load balancer
   *
   * @default Public subnets if internetFacing, otherwise private subnets
   */
  readonly vpcSubnets?: ec2.SubnetSelection;

  /**
   * Indicates whether deletion protection is enabled.
   *
   * @default false
   */
  readonly deletionProtection?: boolean;
}

/**
 * Base class for both Application and Network Load Balancers
 */
export abstract class BaseLoadBalancer extends cdk.Construct implements route53.IAliasRecordTarget {
  /**
   * The canonical hosted zone ID of this load balancer
   *
   * @example  Z2P70J7EXAMPLE
   */
  public readonly canonicalHostedZoneId: string;

  /**
   * The DNS name of this load balancer
   *
   * @example my-load-balancer-424835706.us-west-2.elb.amazonaws.com
   */
  public readonly dnsName: string;

  /**
   * The full name of this load balancer
   *
   * @example app/my-load-balancer/50dc6c495c0c9188
   */
  public readonly fullName: string;

  /**
   * The name of this load balancer
   *
   * @example my-load-balancer
   */
  public readonly loadBalancerName: string;

  /**
   * The ARN of this load balancer
   *
   * @example arn:aws:elasticloadbalancing:us-west-2:123456789012:loadbalancer/app/my-internal-load-balancer/50dc6c495c0c9188
   */
  public readonly loadBalancerArn: string;

  /**
   * The VPC this load balancer has been created in, if available
   *
   * If the Load Balancer was imported, the VPC is not available.
   */
  public readonly vpc?: ec2.IVpcNetwork;

  /**
   * Attributes set on this load balancer
   */
  private readonly attributes: Attributes = {};

  constructor(scope: cdk.Construct, id: string, baseProps: BaseLoadBalancerProps, additionalProps: any) {
    super(scope, id);

    const internetFacing = ifUndefined(baseProps.internetFacing, false);

    const vpcSubnets = ifUndefined(baseProps.vpcSubnets,
      { subnetType: internetFacing ? ec2.SubnetType.Public : ec2.SubnetType.Private });

    const subnets = baseProps.vpc.selectSubnetIds(vpcSubnets);

    this.vpc = baseProps.vpc;

    const resource = new CfnLoadBalancer(this, 'Resource', {
      name: baseProps.loadBalancerName,
      subnets,
      scheme: internetFacing ? 'internet-facing' : 'internal',
      loadBalancerAttributes: new cdk.Token(() => renderAttributes(this.attributes)),
      ...additionalProps
    });
    if (internetFacing) {
      resource.node.addDependency(baseProps.vpc.selectSubnets(vpcSubnets).internetConnectedDependency);
    }

    if (baseProps.deletionProtection) { this.setAttribute('deletion_protection.enabled', 'true'); }

    this.canonicalHostedZoneId = resource.loadBalancerCanonicalHostedZoneId;
    this.dnsName = resource.loadBalancerDnsName;
    this.fullName = resource.loadBalancerFullName;
    this.loadBalancerName = resource.loadBalancerName;
    this.loadBalancerArn = resource.ref;
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

  public asAliasRecordTarget(): route53.AliasRecordTargetProps {
    return {
      hostedZoneId: this.canonicalHostedZoneId,
      dnsName: this.dnsName
    };
  }
}
