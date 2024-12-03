import { CfnVPC, CfnVPCCidrBlock, CfnTransitGateway, DefaultInstanceTenancy, ISubnet, SubnetType } from 'aws-cdk-lib/aws-ec2';
import { Arn, CfnResource, Lazy, Names, Resource, Tag } from 'aws-cdk-lib/core';
import { Construct, DependencyGroup, IDependable } from 'constructs';

export enum TransitGatewayFeatureStatus {
    ENABLE = 'enable',
    DISABLE = 'disable',
  }

export interface ITransitGateway {
    readonly transitGatewayId: string;
    readonly transitGatewayArn: string;
} 

abstract class TransitGatewayBase extends Resource implements ITransitGateway {
  public abstract readonly transitGatewayId: string;

  public abstract readonly transitGatewayArn: string;

//   addRouteTable(id: string, tags: Tag[]): TransitGatewayRouteTable {
//     return new TransitGatewayRouteTable(this, id, props);
//   }

//   attachVpc(id: string, vpc: IVpc, subnets: ISubnet[]): TransitGatewayAttachment {
//     return new TransitGatewayAttachment(this, id, props);
//   }
}

export interface TransitGatewayProps {
    readonly amazonSideAsn?: number;
    readonly autoAcceptSharedAttachments?: string;

    // TODO: check if any other values will be supported besides ENABLED/DISABLED
    readonly defaultRouteTableAssociation?: boolean;
    readonly defaultRouteTablePropagation?: boolean;
    readonly description?: string;
    readonly dnsSupport?: boolean;
    readonly multicastSupport?: boolean;
    readonly vpnEcmpSupport?: boolean;
    readonly tags?: Tag[];
}

export class TransitGateway extends TransitGatewayBase {
    public readonly transitGatewayId: string;
    public readonly transitGatewayArn: string;
    
    constructor(scope: Construct, id: string, props: TransitGatewayProps) {
        super(scope, id);

      const resource = new CfnTransitGateway(this, id, {
        amazonSideAsn: props.amazonSideAsn,
        autoAcceptSharedAttachments: props.autoAcceptSharedAttachments,
        defaultRouteTableAssociation: props.defaultRouteTableAssociation ? TransitGatewayFeatureStatus.ENABLE : TransitGatewayFeatureStatus.DISABLE,
        defaultRouteTablePropagation: props.defaultRouteTablePropagation ? TransitGatewayFeatureStatus.ENABLE : TransitGatewayFeatureStatus.DISABLE,
        description: props.description,
        dnsSupport: props.dnsSupport ? TransitGatewayFeatureStatus.ENABLE : TransitGatewayFeatureStatus.DISABLE,
        multicastSupport: props.multicastSupport ? TransitGatewayFeatureStatus.ENABLE : TransitGatewayFeatureStatus.DISABLE,
        vpnEcmpSupport: props.vpnEcmpSupport ? TransitGatewayFeatureStatus.ENABLE : TransitGatewayFeatureStatus.DISABLE,
        tags: props.tags,
      });

      this.transitGatewayId = resource.ref;
      this.transitGatewayArn = this.getResourceArnAttribute(resource.ref, {
        service: 'ec2',
        resource: 'transit-gateway',
        resourceName: this.physicalName,
      });
    }
}
