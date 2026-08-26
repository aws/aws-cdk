import type { INamespace } from '../namespace';
import { NamespaceType } from '../namespace';
import { DiscoveryType } from '../service';
import type { DnsRecordType } from '../service';

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
