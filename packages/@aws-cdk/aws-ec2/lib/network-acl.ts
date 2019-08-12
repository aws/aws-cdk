import {  Construct, IResource,  Resource } from '@aws-cdk/core';
import { CfnNetworkAcl  } from './ec2.generated';
import { IVpc } from './vpc';



export interface INetworkACL extends IResource {
  /**
   * ID for the current Network ACL
   * @attribute
   */
  readonly NetworkAclId : string;
}


/**
 * A NetworkACLBase that is not created in this template
 */
abstract class NetworkACLBase extends Resource implements INetworkACL {
 
  public abstract readonly NetworkAclId: string;
  
  constructor(scope: Construct, id: string, props?: ResourceProps) {
    super(scope, id, props);

  }

  public get uniqueId() {
    return this.node.uniqueId;
  }
}

export interface NetworkACLProps {
  /**
   * The VPC in which to create the security group.
   */
  readonly vpc: IVpc;
}

export class NetworkACL extends NetworkACLBase {

  /**
   * The ID of the security group
   *
   * @attribute
   */
  public readonly NetworkAclId: string;

  /**
   * The VPC ID this NetworkACL.
   *
   * @attribute
   */
  public readonly NetworkAclVpcId: string;

  private readonly networkACL: CfnNetworkAcl;


  constructor(scope: Construct, id: string, props: NetworkACLProps) {
    super(scope, id, {
      physicalName: cdk.PhysicalName.GENERATE_IF_NEEDED
    });
   
    this.networkACL = new CfnNetworkAcl(this, 'Resource', {
      vpcId: props.vpc.vpcId,
    });

    this.NetworkAclId = this.networkACL.attrNetworkAclId;
    this.NetworkAclVpcId = this.networkACL.attrVpcId;
  }
}


