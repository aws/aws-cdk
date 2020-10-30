import * as ec2 from '@aws-cdk/aws-ec2';
import { IResource, Lazy, Resource } from '@aws-cdk/core';
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
  readonly subnets?: ec2.ISubnet[];

  /**
   * A list of security groups for the VPC link.
   *
   * @default - no security groups. Use `addSecurityGroups` to add security groups
   */
  readonly securityGroups?: ec2.ISecurityGroup[];
}


/**
 * Define a new VPC Link
 * Specifies an API Gateway VPC link for a HTTP API to access resources in an Amazon Virtual Private Cloud (VPC).
 */
export class VpcLink extends Resource implements IVpcLink {
  /**
   * Import a VPC Link by its Id
   */
  public static fromVpcLinkId(scope: Construct, id: string, vpcLinkId: string): IVpcLink {
    class Import extends Resource implements IVpcLink {
      public vpcLinkId = vpcLinkId;
    }

    return new Import(scope, id);
  }

  /**
   * Physical ID of the VpcLink resource
   * @attribute
   */
  public readonly vpcLinkId: string;

  private readonly subnets = new Array<ec2.ISubnet>();
  private readonly securityGroups = new Array<ec2.ISecurityGroup>();

  constructor(scope: Construct, id: string, props: VpcLinkProps) {
    super(scope, id);

    const cfnResource = new CfnVpcLink(this, 'Resource', {
      name: props.vpcLinkName || Lazy.stringValue({ produce: () => this.node.uniqueId }),
      subnetIds: Lazy.listValue({ produce: () => this.renderSubnets() }),
      securityGroupIds: Lazy.listValue({ produce: () => this.renderSecurityGroups() }),
    });

    this.vpcLinkId = cfnResource.ref;

    this.addSubnets(...props.vpc.privateSubnets);

    if (props.subnets) {
      this.addSubnets(...props.subnets);
    }

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
