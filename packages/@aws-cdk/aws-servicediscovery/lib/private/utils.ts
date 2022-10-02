import { INamespace, NamespaceType } from '../namespace';
import { DiscoveryType } from '../service';

export function defaultDiscoveryType(namespace : INamespace): DiscoveryType {
  return namespace.type == NamespaceType.HTTP ? DiscoveryType.API: DiscoveryType.DNS_AND_API;
}
