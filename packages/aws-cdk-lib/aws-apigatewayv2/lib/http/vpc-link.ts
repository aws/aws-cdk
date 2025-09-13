import { Construct } from 'constructs';
import { CfnVpcLink } from '.././index';
import * as ec2 from '../../../aws-ec2';
import { IResource, Lazy, Names, Resource } from '../../../core';
import { addConstructMetadata, MethodMetadata } from '../../../core/lib/metadata-resource';
import { propertyInjectable } from '../../../core/lib/prop-injectable';

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
  readonly securityGroups?: ec2.ISecurityGroupRef[];
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
@propertyInjectable
export class VpcLink extends Resource implements IVpcLink {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-apigatewayv2.VpcLink';

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

  private readonly subnets = new Array<ec2.ISubnetRef>();
  private readonly securityGroups = new Array<ec2.ISecurityGroupRef>();

  constructor(scope: Construct, id: string, props: VpcLinkProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);
    this.vpc = props.vpc;

    const cfnResource = new CfnVpcLink(this, 'Resource', {
      name: props.vpcLinkName || Lazy.string({ produce: () => Names.uniqueId(this) }),
      subnetIds: Lazy.list({ produce: () => this.renderSubnets() }),
      securityGroupIds: Lazy.list({ produce: () => this.renderSecurityGroups() }),
    });

    this.vpcLinkId = cfnResource.ref;

    const { subnets } = props.vpc.selectSubnets(props.subnets ?? { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS });
    this.addSubnets(...subnets);

    if (props.securityGroups) {
      this.addSecurityGroups(...props.securityGroups);
    }
  }

  /**
   * Adds the provided subnets to the vpc link
   */
  @MethodMetadata()
  public addSubnets(...subnets: ec2.ISubnetRef[]) {
    this.subnets.push(...subnets);
  }

  /**
   * Adds the provided security groups to the vpc link
   */
  @MethodMetadata()
  public addSecurityGroups(...groups: ec2.ISecurityGroupRef[]) {
    this.securityGroups.push(...groups);
  }

  private renderSubnets() {
    return this.subnets.map(subnet => subnet.subnetRef.subnetId);
  }

  private renderSecurityGroups() {
    return this.securityGroups.map(sg => sg.securityGroupRef.securityGroupId);
  }
}
