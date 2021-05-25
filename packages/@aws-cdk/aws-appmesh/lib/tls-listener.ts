/**
 * Enum of supported TLS modes
 */
import { TlsCertificate } from './tls-certificate';

/**
 * Enum of supported TLS modes
 */
export enum TlsMode {
  /**
   * Only accept encrypted traffic
   */
  STRICT = 'STRICT',

  /**
   * Accept encrypted and plaintext traffic.
   */
  PERMISSIVE = 'PERMISSIVE',

  /**
   * TLS is disabled, only accept plaintext traffic.
   */
  DISABLED = 'DISABLED',
}

/**
 * Represents TLS properties for listener
 */
export interface TlsListener {
  /**
   * Represents TLS certificate
   */
  readonly certificate: TlsCertificate;

  /**
   * The TLS mode.
   */
  readonly mode: TlsMode;
}
