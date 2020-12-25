import { IDependable, IResource } from '@aws-cdk/core';
import { IConnectable } from './connections';

/**
 * A client VPN endpoint
 */
export interface IClientVpnEndpoint extends IResource, IConnectable {
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
 * A Lambda function
 */
export interface IFunction {
  /**
   * The ARN of the function.
   */
  readonly functionArn: string;
}

/**
 * A certificate
 */
export interface ICertificate {
  /**
   * The ARN of the certificate
   */
  readonly certificateArn: string;
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
