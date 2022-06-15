/**
 * Enum of supported IP preferences.
 * Used to dictate the IP version for mesh wide and virtual node service discovery.
 * Also used to specify the IP version that a sidecar Envoy uses when sending traffic to a local application.
 */

export enum IpPreference {
  /**
   * Use IPv4 when sending traffic to a local application.
   * Only use IPv4 for service discovery.
   */
  IPV4_ONLY = 'IPv4_ONLY',
  /**
   * Use IPv4 when sending traffic to a local application.
   * First attempt to use IPv4 and fall back to IPv6 for service discovery.
   */
  IPV4_PREFERRED = 'IPv4_PREFERRED',
  /**
   * Use IPv6 when sending traffic to a local application.
   * Only use IPv6 for service discovery.
   */
  IPV6_ONLY = 'IPv6_ONLY',
  /**
   * Use IPv6 when sending traffic to a local application.
   * First attempt to use IPv6 and fall back to IPv4 for service discovery.
   */
  IPV6_PREFERRED = 'IPv6_PREFERRED'
}