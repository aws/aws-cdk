// /* eslint-disable @typescript-eslint/member-ordering */
// import { Stack, ResourceEnvironment, RemovalPolicy, Resource } from 'aws-cdk-lib';
// import { CfnVPCCidrBlock, INetworkAcl, IRouteTable, ISubnet } from 'aws-cdk-lib/aws-ec2';
// import { IDependable, Node } from 'constructs';
// import { IVpcV2 } from './vpc-v2';

// export interface SubnetPropsV2 {
// /**
//  * VPC Prop
//  */
//   vpc: IVpcV2;

//   /**
//    * custom CIDR range
//    * TODO: modify to Ipv4cidr class
//    */
//   cidrBlock: CfnVPCCidrBlock;

//   /**
//    * Custom AZ
//    */
//   availabilityZone: string;

//   /**
//    * Isolated subnet or not
//    * @default true
//    */
//   isIsolated?: Boolean;

// }

// export class SubnetV2 extends Resource implements ISubnet {
//   readonly availabilityZone: string;
//   readonly subnetId: string;
//   readonly internetConnectivityEstablished: IDependable;
//   readonly ipv4CidrBlock: string;
//   readonly routeTable: IRouteTable;
//   associateNetworkAcl(id: string, acl: INetworkAcl): void {
//     throw new Error('Method not implemented.');
//   }
//   readonly stack: Stack;
//   readonly env: ResourceEnvironment;
//   applyRemovalPolicy(policy: RemovalPolicy): void {
//     throw new Error('Method not implemented.');
//   }
//   readonly node: Node;

//   constructor(scope: Stack, id: string, props: any) {
//     super(scope, id);
//     this.stack = scope;
//     this.node = Node.of(this);
//     this.subnetId = id;
//     this.availabilityZone = props.availabilityZone;
//     this.ipv4CidrBlock = props.ipv4CidrBlock;
//     this.routeTable = props.routeTable;
//     this.internetConnectivityEstablished = props.internetConnectivityEstablished;
//     this.env = {
//       account: scope.account,
//       region: scope.region,
//     };
//   }

// }