import type { IDependable } from 'constructs';
import type { IConnectable } from './connections';
import type { IClientVpnEndpointRef } from './ec2.generated';
import type { IResource } from '../../core';

/**
 * A client VPN endpoint
 */
export interface IClientVpnEndpoint extends IResource, IConnectable, IClientVpnEndpointRef {
  /**
   * The endpoint ID
   */
  readonly endpointId: string;

  /**
   * Dependable that can be depended upon to force target networks associations
   */
  readonly targetNetworksAssociated: IDependable;
}

/**
 * A connection handler for client VPN endpoints
 */
export interface IClientVpnConnectionHandler {
  /**
   * The name of the function
   */
  readonly functionName: string;

  /**
   * The ARN of the function.
   */
  readonly functionArn: string;
}

/**
 * Transport protocol for client VPN
 */
export enum TransportProtocol {
  /** Transmission Control Protocol (TCP) */
  TCP = 'tcp',
  /** User Datagram Protocol (UDP) */
  UDP = 'udp',
}

/**
 * Port for client VPN
 */
export enum VpnPort {
  /** HTTPS */
  HTTPS = 443,
  /** OpenVPN */
  OPENVPN = 1194,
}

/**
 * The IP address type for a Client VPN endpoint or its traffic.
 *
 */
export enum ClientVpnEndpointIpAddressType {
  /** IPv4 addressing only */
  IPV4 = 'ipv4',
  /** IPv6 addressing only */
  IPV6 = 'ipv6',
  /** Both IPv4 and IPv6 addressing */
  DUAL_STACK = 'dual-stack',
}
