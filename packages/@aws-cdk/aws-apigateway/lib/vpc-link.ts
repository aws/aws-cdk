import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import { Construct, Lazy, Resource } from '@aws-cdk/core';
import { CfnVpcLink } from './apigateway.generated';

/**
 * Properties for a VpcLink
 */
export interface VpcLinkProps {
  /**
   * The name used to label and identify the VPC link.
   * @default - automatically generated name
   */
  readonly vpcLinkName?: string;

  /**
   * The description of the VPC link.
   * @default no description
   */
  readonly description?: string;

  /**
   * The network load balancers of the VPC targeted by the VPC link.
   * The network load balancers must be owned by the same AWS account of the API owner.
   *
   * @default - no targets. Use `addTargets` to add targets
   */
  readonly targets?: elbv2.INetworkLoadBalancer[];
}

/**
 * Define a new VPC Link
 * Specifies an API Gateway VPC link for a RestApi to access resources in an Amazon Virtual Private Cloud (VPC).
 */
export class VpcLink extends Resource {
  /**
   * Physical ID of the VpcLink resource
   * @attribute
   */
  public readonly vpcLinkId: string;

  private readonly targets = new Array<elbv2.INetworkLoadBalancer>();

  constructor(scope: Construct, id: string, props: VpcLinkProps = {}) {
    super(scope, id, {
      physicalName: props.vpcLinkName ||
        Lazy.stringValue({ produce: () => this.node.uniqueId }),
    });

    const cfnResource = new CfnVpcLink(this, 'Resource', {
      name: this.physicalName,
      description: props.description,
      targetArns: Lazy.listValue({ produce: () => this.renderTargets() })
    });

    this.vpcLinkId = cfnResource.ref;

    if (props.targets) {
      this.addTargets(...props.targets);
    }
  }

  public addTargets(...targets: elbv2.INetworkLoadBalancer[]) {
    this.targets.push(...targets);
  }

  protected validate(): string[] {
    if (this.targets.length === 0) {
      return [ `No targets added to vpc link` ];
    }
    return [];
  }

  private renderTargets() {
    return this.targets.map(nlb => nlb.loadBalancerArn);
  }
}
