import cdk = require('@aws-cdk/cdk');
import { CfnCustomerGateway, CfnVPNConnection, CfnVPNConnectionRoute } from './ec2.generated';
import { IVpcNetwork } from './vpc-ref';

export interface IVpnConnection extends cdk.IConstruct {
  /**
   * The id of the VPN connection.
   */
  readonly vpnId: string;

  /**
   * The id of the customer gateway.
   */
  readonly customerGatewayId: string;

  /**
   * The ip address of the customer gateway.
   */
  readonly customerGatewayIp: string;

  /**
   * The ASN of the customer gateway.
   */
  readonly customerGatewayAsn: number;
}

export interface VpnTunnelOption {
  /**
   * The pre-shared key (PSK) to establish initial authentication between the virtual
   * private gateway and customer gateway.
   */
  presharedKey: string;

  /**
   * The range of inside IP addresses for the tunnel. Any specified CIDR blocks must be
   * unique across all VPN connections that use the same virtual private gateway.
   */
  tunnelInsideCidr: string;
}

export interface VpnConnectionOptions {
  /**
   * The ip address of the customer gateway.
   */
  ip: string;

  /**
   * The ASN of the customer gateway.
   *
   * @default 65000
   */
  asn?: number;

  /**
   * The static routes to be routed from the VPN gateway to the customer gateway.
   *
   * @default Dynamic routing (BGP)
   */
  staticRoutes?: string[];

  /**
   * Tunnel options for the VPN connection.
   */
  vpnTunnelOptions?: VpnTunnelOption[];
}

export interface VpnConnectionProps extends VpnConnectionOptions {
  /**
   * The VPC to connect to.
   */
  vpc: IVpcNetwork;
}

/**
 * The VPN connection type.
 */
export enum VpnConnectionType {
  /**
   * The IPsec 1 VPN connection type.
   */
  IPsec1 = 'ipsec.1',

  /**
   * Dummy member
   * TODO: remove once https://github.com/awslabs/jsii/issues/231 is fixed
   */
  Dummy = 'dummy'
}

export class VpnConnection extends cdk.Construct implements IVpnConnection {
  public readonly vpnId: string;
  public readonly customerGatewayId: string;
  public readonly customerGatewayIp: string;
  public readonly customerGatewayAsn: number;

  constructor(scope: cdk.Construct, id: string, props: VpnConnectionProps) {
    super(scope, id);

    if (!props.vpc.vpnGatewayId) {
      throw new Error('Cannot create a VPN connection when VPC has no VPN gateway.');
    }

    const type = VpnConnectionType.IPsec1;
    const bgpAsn = props.asn || 65000;

    const customerGateway = new CfnCustomerGateway(this, 'CustomerGateway', {
      bgpAsn,
      ipAddress: props.ip,
      type
    });

    this.customerGatewayId = customerGateway.customerGatewayName;
    this.customerGatewayAsn = bgpAsn;
    this.customerGatewayIp = props.ip;

    const vpnConnection = new CfnVPNConnection(this, 'Resource', {
      type,
      customerGatewayId: customerGateway.customerGatewayName,
      staticRoutesOnly: props.staticRoutes ? true : false,
      vpnGatewayId: props.vpc.vpnGatewayId,
      vpnTunnelOptionsSpecifications: props.vpnTunnelOptions
    });

    this.vpnId = vpnConnection.vpnConnectionName;

    if (props.staticRoutes) {
      props.staticRoutes.forEach(route => {
        new CfnVPNConnectionRoute(this, `Route${route.replace(/[^\d]/g, '')}`, {
          destinationCidrBlock: route,
          vpnConnectionId: this.vpnId
        });
      });
    }
  }
}
