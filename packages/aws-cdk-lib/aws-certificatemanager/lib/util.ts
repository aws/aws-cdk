import type { ICertificate } from './certificate';
import type { DnsValidatedCertificate } from './dns-validated-certificate';
import { DnsValidatedCertificateV2 } from './dns-validated-certificate-v2';
import { publicSuffixes } from './public-suffixes';
import { Arn, ArnFormat, Stack, Token } from '../../core';

/**
 * Returns the apex domain (domain.com) from a subdomain (www.sub.domain.com)
 */
export function apexDomain(domainName: string): string {
  const parts = domainName.split('.').reverse();

  let curr: any = publicSuffixes;

  const accumulated: string[] = [];
  for (const part of parts) {
    accumulated.push(part);
    if (!Object.prototype.hasOwnProperty.call(curr, part)) { break; }
    curr = curr[part];
  }
  return accumulated.reverse().join('.');
}

export function isDnsValidatedCertificate(cert: ICertificate): cert is DnsValidatedCertificate {
  return cert.hasOwnProperty('domainName');
}

export function isDnsValidatedCertificateV2(cert: ICertificate): cert is DnsValidatedCertificateV2 {
  return DnsValidatedCertificateV2.isDnsValidatedCertificateV2(cert);
}

export function getCertificateRegion(cert: ICertificate): string | undefined {
  const { certificateArn, stack } = cert;

  if (isDnsValidatedCertificateV2(cert)) {
    return cert.certificateRegion;
  }

  if (isDnsValidatedCertificate(cert)) {
    const requestResource = cert.node.findChild('CertificateRequestorResource').node.defaultChild;

    // @ts-ignore
    const { _cfnProperties: properties } = requestResource;
    const { Region: region } = properties;

    if (region && !Token.isUnresolved(region)) {
      return region;
    }
  }

  {
    const { region } = Arn.split(certificateArn, ArnFormat.SLASH_RESOURCE_NAME);

    if (region && !Token.isUnresolved(region)) {
      return region;
    }
  }

  return Stack.of(stack).region;
}
