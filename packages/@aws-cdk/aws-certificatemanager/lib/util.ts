import { Arn, Stack, Token } from '@aws-cdk/core';
import { ICertificate } from './certificate';
import { DnsValidatedCertificate } from './dns-validated-certificate';
import { publicSuffixes } from './public-suffixes';

/**
 * Returns the apex domain (domain.com) from a subdomain (www.sub.domain.com)
 */
export function apexDomain(domainName: string): string {
  const parts = domainName.split('.').reverse();

  let curr: any = publicSuffixes;

  const accumulated: string[] = [];
  for (const part of parts) {
    accumulated.push(part);
    if (!(part in curr)) { break; }
    curr = curr[part];
  }
  return accumulated.reverse().join('.');
}

export function isDnsValidatedCertificate(cert: ICertificate): cert is DnsValidatedCertificate {
  return cert.hasOwnProperty('domainName');
}

export function getCertificateRegion(cert: ICertificate): string | undefined {
  const { certificateArn, stack } = cert;

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
    const { region } = Arn.parse(certificateArn);

    if (region && !Token.isUnresolved(region)) {
      return region;
    }
  }

  return Stack.of(stack).region;
}
