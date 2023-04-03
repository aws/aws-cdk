import { ICertificate } from './certificate';
import { DnsValidatedCertificate } from './dns-validated-certificate';
/**
 * Returns the apex domain (domain.com) from a subdomain (www.sub.domain.com)
 */
export declare function apexDomain(domainName: string): string;
export declare function isDnsValidatedCertificate(cert: ICertificate): cert is DnsValidatedCertificate;
export declare function getCertificateRegion(cert: ICertificate): string | undefined;
