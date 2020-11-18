import { TLSValidationContext } from './validation-context';

/**
 * Default configuration that is applied to all backends.
 * Any configuration defined will be overwritten by configurations specified for a particular backend.
 */
export interface ClientPolicy {
  /**
   * Client policy for TLS
   */
  readonly tlsClientPolicy: TLSClientPolicyOptions;
}

/**
 * TLS Connections with downstream server will always be enforced if True
 */
export interface TLSClientPolicyOptions {
  /**
   * TLS enforced if True.
   *
   * @default - True
   */
  readonly enforce?: boolean;

  /**
   * TLS enforced on these ports. If not specified it is enforced on all ports.
   *
   * @default - none
   */
  readonly ports?: number[];

  /**
   * Policy used to determine if the TLS certificate the server presents is accepted
   *
   * @default - none
   */
  readonly validation: TLSValidationContext;
}

/**
 * ACM Trust Properties
 */
export interface ACMTrustOptions {
  /**
   * Amazon Resource Names (ARN) of trusted ACM Private Certificate Authorities
   */
  readonly certificateAuthorityArns: string[];
}

/**
 * File Trust Properties
 */
export interface FileTrustOptions {
  /**
   * Path to the Certificate Chain file on the file system where the Envoy is deployed.
   */
  readonly certificateChain: string;
}