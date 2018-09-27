/**
 * What kind of addresses to allocate to the load balancer
 */
export enum IpAddressType {
  /**
   * Allocate IPv4 addresses
   */
  Ipv4 = 'ipv4',

  /**
   * Allocate both IPv4 and IPv6 addresses
   */
  DualStack = 'dualstack',
}

/**
 * Backend protocol for health checks
 */
export enum Protocol {
  /**
   * HTTP
   */
  Http = 'HTTP',

  /**
   * HTTPS
   */
  Https = 'HTTPS',

  /**
   * TCP
   */
  Tcp = 'TCP'
}

/**
 * Load balancing protocol for application load balancers
 */
export enum ApplicationProtocol {
  /**
   * HTTP
   */
  Http = 'HTTP',

  /**
   * HTTPS
   */
  Https = 'HTTPS'
}

/**
 * Elastic Load Balancing provides the following security policies for Application Load Balancers
 *
 * We recommend the Recommended policy for general use. You can
 * use the ForwardSecrecy policy if you require Forward Secrecy
 * (FS).
 *
 * You can use one of the TLS policies to meet compliance and security
 * standards that require disabling certain TLS protocol versions, or to
 * support legacy clients that require deprecated ciphers.
 *
 * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html
 */
export enum SslPolicy {
  /**
   * The recommended security policy
   */
  Recommended = 'ELBSecurityPolicy-2016-08',

  /**
   * Forward secrecy ciphers only
   */
  ForwardSecrecy = 'ELBSecurityPolicy-FS-2018-06',

  /**
   * TLS1.2 only and no SHA ciphers
   */
  TLS12 = 'ELBSecurityPolicy-TLS-1-2-2017-01',

  /**
   * TLS1.2 only with all ciphers
   */
  TLS12Ext = 'ELBSecurityPolicy-TLS-1-2-Ext-2018-06',

  /**
   * TLS1.1 and higher with all ciphers
   */
  TLS11 = 'ELBSecurityPolicy-TLS-1-1-2017-01',

  /**
   * Support for DES-CBC3-SHA
   *
   * Do not use this security policy unless you must support a legacy client
   * that requires the DES-CBC3-SHA cipher, which is a weak cipher.
   */
  Legacy = 'ELBSecurityPolicy-TLS-1-0-2015-04',
}

/**
 * How to interpret the load balancing target identifiers
 */
export enum TargetType {
  /**
   * Targets identified by instance ID
   */
  Instance = 'instance',

  /**
   * Targets identified by IP address
   */
  Ip = 'ip',

  /**
   * A target that will register itself with the target group
   */
  SelfRegistering = 'self-registering',
}
