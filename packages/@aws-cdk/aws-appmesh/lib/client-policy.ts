import { TlsValidation } from './tls-validation';

/**
 * Represents the properties needed to define client policy
 */
export interface TlsClientPolicy {
  /**
   * Whether the policy is enforced.
   *
   * @default true
   */
  readonly enforce?: boolean;

  /**
   * TLS is enforced on the ports specified here.
   * If no ports are specified, TLS will be enforced on all the ports.
   *
   * @default - all ports
   */
  readonly ports?: number[];

  /**
   * Represents the object for TLS validation context
   */
  readonly validation: TlsValidation;
}
