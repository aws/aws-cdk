import * as ec2 from '@aws-cdk/aws-ec2';
import * as core from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnFirewall, CfnFirewallProps } from './networkfirewall.generated';
import { IFirewallPolicy } from './policy';

/**
 * Defines a Network Firewall in the stack
 */
export interface IFirewall extends core.IResource{
  /**
   * The Arn of the Firewall.
   *
   * @attribute
   */
  readonly firewallArn: string;


  /**
   * The physical name of the Firewall.
   *
   * @attribute
   */
  readonly firewallId: string;


  /**
   * The unique IDs of the firewall endpoints for all of the subnets that you attached to the firewall.
   * The subnets are not listed in any particular order.
   *
   * @attribute
   */
  //readonly endpointIds: string[];
}

/**
 * Defines a Network Firewall
 */
abstract class FirewallBase extends core.Resource implements IFirewall {

  public abstract readonly firewallArn: string;
  public abstract readonly firewallId: string;
  //public abstract readonly endpointIds: string[];

  //public abstract readonly policy: FirewallPolicy;
}

/**
 * The Properties for defining a Firewall Resource
 */
export interface FirewallProps {
  /**
   * The descriptive name of the firewall.
   * You can't change the name of a firewall after you create it.
   *
   * @default - CloudFormation-generated name
   */
  readonly firewallName?: string;

  /**
   * The unique identifier of the VPC where the firewall is in use. You can't change the VPC of a firewall after you create the firewall.
   *
   */
  readonly vpc: ec2.IVpc;

  /**
   * The public subnets that Network Firewall is using for the firewall. Each subnet must belong to a different Availability Zone.
   *
   * @default - All public subnets of the VPC
   */
  readonly subnetMappings?: ec2.SubnetSelection;

  /**
   * Each firewall requires one firewall policy association, and you can use the same firewall policy for multiple firewalls.
   *
   */
  readonly policy: IFirewallPolicy;

  /**
   * The descriptiong of the Firewall
   *
   * @default - undefined
   */
  readonly description?: string;
}

/**
 * Defines a Network Firewall in tehe Stack
 * @resource AWS::NetworkFirewall::Firewall
 */
export class Firewall extends FirewallBase {

  /**
   * Reference an existing Network Firewall,
   * defined outside of the CDK code, by name.
   */
  public static fromFirewallName(scope: Construct, id: string, firewallName: string): IFirewall {
    class Import extends FirewallBase {
      public readonly firewallId = firewallName;
      // Since we have the name, we can generate the ARN,
      public readonly firewallArn = core.Stack.of(scope)
        .formatArn({
          service: 'network-firewall',
          resource: 'firewall',
          resourceName: firewallName,
        });
    }
    return new Import(scope, id);
  }

  /**
   * The Arn of the Firewall.
   *
   * @attribute
   */
  public readonly firewallArn: string;

  /**
   * The physical name of the Firewall.
   *
   * @attribute
   */
  public readonly firewallId: string;

  /**
   * The unique IDs of the firewall endpoints for all of the subnets that you attached to the firewall.
   * The subnets are not listed in any particular order.
   *
   * @attribute
   */
  public readonly endpointIds: string[];

  /**
   * The associated firewall Policy
   * @attribute
   */
  public readonly policy: IFirewallPolicy;

  constructor(scope:Construct, id: string, props: FirewallProps) {
    super(scope, id, {
      physicalName: props.firewallName,
    });

    // Adding Validations

    /*
     * Validate firewallName
     */
    if (props.firewallName !== undefined &&
				!/^[_a-zA-Z]+$/.test(props.firewallName)) {
      throw new Error('firewallName must be non-empty and contain only letters and underscores, ' +
				`got: '${props.firewallName}'`);
    }

    // TODO: Auto define Policy?
    //const firewallPolicy:IfirewallPolicy = props.policy ||
    //		new policy(scope, id, {
    //				statelessDefaultActions: [StatelessStandardAction.FORWARD]
    //				statelessFragementDefaultActions: [StatelessStandardAction.FORWARD]
    //			}
    //		);

    // Auto pick subnetMappings from VPC if not provieded
    let subnets:CfnFirewall.SubnetMappingProperty[]=[];
    if (props.subnetMappings !== undefined) {
      subnets = this.castSubnetMapping(props.subnetMappings);
    } else {
      let subnetMapping:ec2.SubnetSelection = props.vpc.selectSubnets({
        subnetType: ec2.SubnetType.PUBLIC,
      });
      subnets = this.castSubnetMapping(subnetMapping);
    }

    const resourceProps:CfnFirewallProps = {
      firewallName: props.firewallName||id,
      firewallPolicyArn: props.policy.firewallPolicyArn,
      subnetMappings: subnets,
      vpcId: props.vpc.vpcId,
      description: props.description,
      //TODO: tags
    };

    const resource:CfnFirewall = new CfnFirewall(this, id, resourceProps);

    this.firewallId = this.getResourceNameAttribute(resource.ref);
    this.firewallArn = this.getResourceArnAttribute(resource.attrFirewallArn, {
      service: 'NetworkFirewall',
      resource: 'Firewall',
      resourceName: this.firewallId,
    });

    this.endpointIds = resource.attrEndpointIds;
    this.policy = props.policy;
  }

  /**
   * Cast SubnetSelection to a list ofsubnetMappingProperty
   */
  private castSubnetMapping(subnetSelection:ec2.SubnetSelection|undefined):CfnFirewall.SubnetMappingProperty[] {
    let subnets:CfnFirewall.SubnetMappingProperty[]=[];
    let subnet:ec2.ISubnet;
    if (subnetSelection !== undefined && subnetSelection.subnets !== undefined) {
      for (subnet of subnetSelection.subnets) {
        subnets.push({
          subnetId: subnet.subnetId,
        });
      }
    }
    return subnets;
  }
}
