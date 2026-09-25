import type { INamespace } from '../namespace';
import { NamespaceType } from '../namespace';
import { DiscoveryType, DnsRecordType } from '../service';

export function defaultDiscoveryType(namespace : INamespace): DiscoveryType {
  return namespace.type == NamespaceType.HTTP ? DiscoveryType.API: DiscoveryType.DNS_AND_API;
}

/**
 * The individual record types a `DnsRecordType` stands for, in declaration order.
 *
 * Members covering more than one record type spell out their constituent types in the
 * enum value, separated by `', '` (for example `A_AAAA = 'A, AAAA'`).
 */
export function splitDnsRecordType(dnsRecordType: DnsRecordType): string[] {
  return dnsRecordType.split(', ');
}

/**
 * Whether every record type a `DnsRecordType` stands for is an address record.
 *
 * Alias records are only ever created for `A` and `AAAA`, so a service that also
 * creates an `SRV` or `CNAME` record cannot take an alias target.
 */
export function isAddressOnlyRecordType(dnsRecordType: DnsRecordType): boolean {
  return splitDnsRecordType(dnsRecordType)
    .every(type => type === DnsRecordType.A || type === DnsRecordType.AAAA);
}
