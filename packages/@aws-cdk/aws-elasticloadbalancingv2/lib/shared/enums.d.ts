/**
 * What kind of addresses to allocate to the load balancer
 */
export declare enum IpAddressType {
    /**
     * Allocate IPv4 addresses
     */
    IPV4 = "ipv4",
    /**
     * Allocate both IPv4 and IPv6 addresses
     */
    DUAL_STACK = "dualstack"
}
/**
 * Backend protocol for network load balancers and health checks
 */
export declare enum Protocol {
    /**
     * HTTP (ALB health checks and NLB health checks)
     */
    HTTP = "HTTP",
    /**
     * HTTPS (ALB health checks and NLB health checks)
     */
    HTTPS = "HTTPS",
    /**
     * TCP (NLB, NLB health checks)
     */
    TCP = "TCP",
    /**
     * TLS (NLB)
     */
    TLS = "TLS",
    /**
     * UDP (NLB)
     */
    UDP = "UDP",
    /**
     * Listen to both TCP and UDP on the same port (NLB)
     */
    TCP_UDP = "TCP_UDP"
}
/**
 * Load balancing protocol for application load balancers
 */
export declare enum ApplicationProtocol {
    /**
     * HTTP
     */
    HTTP = "HTTP",
    /**
     * HTTPS
     */
    HTTPS = "HTTPS"
}
/**
 * Load balancing protocol version for application load balancers
 */
export declare enum ApplicationProtocolVersion {
    /**
     * GRPC
     */
    GRPC = "GRPC",
    /**
     * HTTP1
     */
    HTTP1 = "HTTP1",
    /**
     * HTTP2
     */
    HTTP2 = "HTTP2"
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
export declare enum SslPolicy {
    /**
     * The recommended security policy for TLS listeners.
     * This is the default policy for listeners created using the AWS Management Console
     */
    RECOMMENDED_TLS = "ELBSecurityPolicy-TLS13-1-2-2021-06",
    /**
     * The recommended policy for http listeners.
     * This is the default security policy for listeners created using the AWS CLI
     */
    RECOMMENDED = "ELBSecurityPolicy-2016-08",
    /**
     * TLS1.2 and 1.3
     */
    TLS13_RES = "ELBSecurityPolicy-TLS13-1-2-Res-2021-06",
    /**
     * TLS1.2 and 1.3 and no SHA ciphers
     */
    TLS13_EXT1 = "ELBSecurityPolicy-TLS13-1-2-Ext1-2021-06",
    /**
     * TLS1.2 and 1.3 with all ciphers
     */
    TLS13_EXT2 = "ELBSecurityPolicy-TLS13-1-2-Ext2-2021-06",
    /**
     * TLS1.0 through 1.3 with all ciphers
     */
    TLS13_10 = "ELBSecurityPolicy-TLS13-1-0-2021-06",
    /**
     * TLS1.1 through 1.3 with all ciphers
     */
    TLS13_11 = "ELBSecurityPolicy-TLS13-1-1-2021-06",
    /**
     * TLS1.3 only
     */
    TLS13_13 = "ELBSecurityPolicy-TLS13-1-3-2021-06",
    /**
     * Strong foward secrecy ciphers and TLV1.2 only (2020 edition).
     * Same as FORWARD_SECRECY_TLS12_RES, but only supports GCM versions of the TLS ciphers
     */
    FORWARD_SECRECY_TLS12_RES_GCM = "ELBSecurityPolicy-FS-1-2-Res-2020-10",
    /**
     * Strong forward secrecy ciphers and TLS1.2 only
     */
    FORWARD_SECRECY_TLS12_RES = "ELBSecurityPolicy-FS-1-2-Res-2019-08",
    /**
     * Forward secrecy ciphers and TLS1.2 only
     */
    FORWARD_SECRECY_TLS12 = "ELBSecurityPolicy-FS-1-2-2019-08",
    /**
     * Forward secrecy ciphers only with TLS1.1 and 1.2
     */
    FORWARD_SECRECY_TLS11 = "ELBSecurityPolicy-FS-1-1-2019-08",
    /**
     * Forward secrecy ciphers only
     */
    FORWARD_SECRECY = "ELBSecurityPolicy-FS-2018-06",
    /**
     * TLS1.2 only and no SHA ciphers
     */
    TLS12 = "ELBSecurityPolicy-TLS-1-2-2017-01",
    /**
     * TLS1.2 only with all ciphers
     */
    TLS12_EXT = "ELBSecurityPolicy-TLS-1-2-Ext-2018-06",
    /**
     * TLS1.1 and 1.2 with all ciphers
     */
    TLS11 = "ELBSecurityPolicy-TLS-1-1-2017-01",
    /**
     * Support for DES-CBC3-SHA
     *
     * Do not use this security policy unless you must support a legacy client
     * that requires the DES-CBC3-SHA cipher, which is a weak cipher.
     */
    LEGACY = "ELBSecurityPolicy-TLS-1-0-2015-04"
}
/**
 * How to interpret the load balancing target identifiers
 */
export declare enum TargetType {
    /**
     * Targets identified by instance ID
     */
    INSTANCE = "instance",
    /**
     * Targets identified by IP address
     */
    IP = "ip",
    /**
     * Target is a single Lambda Function
     */
    LAMBDA = "lambda",
    /**
     * Target is a single Application Load Balancer
     */
    ALB = "alb"
}
/**
 * Application-Layer Protocol Negotiation Policies for network load balancers.
 * Which protocols should be used over a secure connection.
 */
export declare enum AlpnPolicy {
    /**
     * Negotiate only HTTP/1.*. The ALPN preference list is http/1.1, http/1.0
     */
    HTTP1_ONLY = "HTTP1Only",
    /**
     * Negotiate only HTTP/2. The ALPN preference list is h2
     */
    HTTP2_ONLY = "HTTP2Only",
    /**
     * Prefer HTTP/1.* over HTTP/2 (which can be useful for HTTP/2 testing). The ALPN preference list is http/1.1, http/1.0, h2
     */
    HTTP2_OPTIONAL = "HTTP2Optional",
    /**
     * Prefer HTTP/2 over HTTP/1.*. The ALPN preference list is h2, http/1.1, http/1.0
     */
    HTTP2_PREFERRED = "HTTP2Preferred",
    /**
     * Do not negotiate ALPN
     */
    NONE = "None"
}
/**
 * Load balancing algorithmm type for target groups
 */
export declare enum TargetGroupLoadBalancingAlgorithmType {
    /**
     * round_robin
     */
    ROUND_ROBIN = "round_robin",
    /**
     * least_outstanding_requests
     */
    LEAST_OUTSTANDING_REQUESTS = "least_outstanding_requests"
}
/**
 * How the load balancer handles requests that might pose a security risk to your application
 *
 * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/application-load-balancers.html#desync-mitigation-mode
 */
export declare enum DesyncMitigationMode {
    /**
     * Allows all traffic
     */
    MONITOR = "monitor",
    /**
     * Provides durable mitigation against HTTP desync while maintaining the availability of your application
     */
    DEFENSIVE = "defensive",
    /**
     * Receives only requests that comply with RFC 7230
     */
    STRICTEST = "strictest"
}
