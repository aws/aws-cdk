import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import { Construct, IResource, Lazy, Resource, Stack, Token } from '@aws-cdk/core';
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
   * @default - Public subnets if internetFacing, Private subnets if internal and
   * there are Private subnets, Isolated subnets if internal and there are no
   * Private subnets.
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
   * The VPC this load balancer has been created in.
   */
  public readonly vpc: ec2.IVpc;
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
      (internetFacing ? {subnetType: ec2.SubnetType.PUBLIC} : {}) );
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
   * Enable access logging for this load balancer.
   *
   * A region must be specified on the stack containing the load balancer; you cannot enable logging on
   * environment-agnostic stacks. See https://docs.aws.amazon.com/cdk/latest/guide/environments.html
   */
  public logAccessLogs(bucket: s3.IBucket, prefix?: string) {
    this.setAttribute('access_logs.s3.enabled', 'true');
    this.setAttribute('access_logs.s3.bucket', bucket.bucketName.toString());
    this.setAttribute('access_logs.s3.prefix', prefix);

    const region = Stack.of(this).region;
    if (Token.isUnresolved(region)) {
      throw new Error(`Region is required to enable ELBv2 access logging`);
    }

    const account = ELBV2_ACCOUNTS[region];
    if (!account) {
      throw new Error(`Cannot enable access logging; don't know ELBv2 account for region ${region}`);
    }

    prefix = prefix || '';
    bucket.grantPut(new iam.AccountPrincipal(account), `${(prefix ? prefix + "/" : "")}AWSLogs/${Stack.of(this).account}/*`);

    // make sure the bucket's policy is created before the ALB (see https://github.com/aws/aws-cdk/issues/1633)
    this.node.addDependency(bucket);
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

// https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-access-logs.html#access-logging-bucket-permissions
const ELBV2_ACCOUNTS: { [region: string]: string } = {
  'us-east-1': '127311923021',
  'us-east-2': '033677994240',
  'us-west-1': '027434742980',
  'us-west-2': '797873946194',
  'ca-central-1': '985666609251',
  'eu-central-1': '054676820928',
  'eu-west-1': '156460612806',
  'eu-west-2': '652711504416',
  'eu-west-3': '009996457667',
  'eu-north-1': '897822967062',
  'ap-east-1': '754344448648',
  'ap-northeast-1': '582318560864',
  'ap-northeast-2': '600734575887',
  'ap-northeast-3': '383597477331',
  'ap-southeast-1': '114774131450',
  'ap-southeast-2': '783225319266',
  'ap-south-1': '718504428378',
  'me-south-1': '076674570225',
  'sa-east-1': '507241528517',
  'us-gov-west-1': '048591011584',
  'us-gov-east-1': '190560391635',
  'cn-north-1': '638102146993',
  'cn-northwest-1': '037604701340',
};
