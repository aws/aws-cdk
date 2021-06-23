import * as ec2 from '@aws-cdk/aws-ec2';
import { IResource, Lazy, Names, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnVpcLink } from '../apigatewayv2.generated';

/**
 * Represents an API Gateway VpcLink
 */
export interface IVpcLink extends IResource {
  /**
   * Physical ID of the VpcLink resource
   * @attribute
   */
  readonly vpcLinkId: string;

  /**
   * The VPC to which this VPC Link is associated with.
   */
  readonly vpc: ec2.IVpc;
}

/**
 * Properties for a VpcLink
 */
export interface VpcLinkProps {
  /**
   * The VPC in which the private resources reside.
   */
  readonly vpc: ec2.IVpc;

  /**
   * The name used to label and identify the VPC link.
   * @default - automatically generated name
   */
  readonly vpcLinkName?: string;

  /**
   * A list of subnets for the VPC link.
   *
   * @default - private subnets of the provided VPC. Use `addSubnets` to add more subnets
   */
  readonly subnets?: ec2.SubnetSelection;

  /**
   * A list of security groups for the VPC link.
   *
   * @default - no security groups. Use `addSecurityGroups` to add security groups
   */
  readonly securityGroups?: ec2.ISecurityGroup[];
}

/**
 * Attributes when importing a new VpcLink
 */
export interface VpcLinkAttributes {
  /**
   * The VPC Link id
   */
  readonly vpcLinkId: string;
  /**
   * The VPC to which this VPC link is associated with.
   */
  readonly vpc: ec2.IVpc;
}


/**
 * Define a new VPC Link
 * Specifies an API Gateway VPC link for a HTTP API to access resources in an Amazon Virtual Private Cloud (VPC).
 */
export class VpcLink extends Resource implements IVpcLink {
  /**
   * Import a VPC Link by specifying its attributes.
   */
  public static fromVpcLinkAttributes(scope: Construct, id: string, attrs: VpcLinkAttributes): IVpcLink {
    class Import extends Resource implements IVpcLink {
      public vpcLinkId = attrs.vpcLinkId;
      public vpc = attrs.vpc;
    }

    return new Import(scope, id);
  }

  public readonly vpcLinkId: string;
  public readonly vpc: ec2.IVpc;

  private readonly subnets = new Array<ec2.ISubnet>();
  private readonly securityGroups = new Array<ec2.ISecurityGroup>();

  constructor(scope: Construct, id: string, props: VpcLinkProps) {
    super(scope, id);
    this.vpc = props.vpc;

    const cfnResource = new CfnVpcLink(this, 'Resource', {
      name: props.vpcLinkName || Lazy.string({ produce: () => Names.uniqueId(this) }),
      subnetIds: Lazy.list({ produce: () => this.renderSubnets() }),
      securityGroupIds: Lazy.list({ produce: () => this.renderSecurityGroups() }),
    });

    this.vpcLinkId = cfnResource.ref;

    const { subnets } = props.vpc.selectSubnets(props.subnets ?? { subnetType: ec2.SubnetType.PRIVATE });
    this.addSubnets(...subnets);

    if (props.securityGroups) {
      this.addSecurityGroups(...props.securityGroups);
    }
  }

  /**
   * Adds the provided subnets to the vpc link
   *
   * @param subnets
   */
  public addSubnets(...subnets: ec2.ISubnet[]) {
    this.subnets.push(...subnets);
  }

  /**
   * Adds the provided security groups to the vpc link
   *
   * @param groups
   */
  public addSecurityGroups(...groups: ec2.ISecurityGroup[]) {
    this.securityGroups.push(...groups);
  }

  private renderSubnets() {
    return this.subnets.map(subnet => subnet.subnetId);
  }

  private renderSecurityGroups() {
    return this.securityGroups.map(sg => sg.securityGroupId);
  }
}
