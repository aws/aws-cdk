import { ICertificate } from '../../aws-certificatemanager';

/**
 * Domain name configuration for AppSync
 */
export interface DomainOptions {
  /**
   * The certificate to use with the domain name.
   */
  readonly certificate: ICertificate;

  /**
   * The actual domain name. For example, `api.example.com`.
   */
  readonly domainName: string;
}
