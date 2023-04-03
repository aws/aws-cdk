"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DesyncMitigationMode = exports.TargetGroupLoadBalancingAlgorithmType = exports.AlpnPolicy = exports.TargetType = exports.SslPolicy = exports.ApplicationProtocolVersion = exports.ApplicationProtocol = exports.Protocol = exports.IpAddressType = void 0;
/**
 * What kind of addresses to allocate to the load balancer
 */
var IpAddressType;
(function (IpAddressType) {
    /**
     * Allocate IPv4 addresses
     */
    IpAddressType["IPV4"] = "ipv4";
    /**
     * Allocate both IPv4 and IPv6 addresses
     */
    IpAddressType["DUAL_STACK"] = "dualstack";
})(IpAddressType = exports.IpAddressType || (exports.IpAddressType = {}));
/**
 * Backend protocol for network load balancers and health checks
 */
var Protocol;
(function (Protocol) {
    /**
     * HTTP (ALB health checks and NLB health checks)
     */
    Protocol["HTTP"] = "HTTP";
    /**
     * HTTPS (ALB health checks and NLB health checks)
     */
    Protocol["HTTPS"] = "HTTPS";
    /**
     * TCP (NLB, NLB health checks)
     */
    Protocol["TCP"] = "TCP";
    /**
     * TLS (NLB)
     */
    Protocol["TLS"] = "TLS";
    /**
     * UDP (NLB)
     */
    Protocol["UDP"] = "UDP";
    /**
     * Listen to both TCP and UDP on the same port (NLB)
     */
    Protocol["TCP_UDP"] = "TCP_UDP";
})(Protocol = exports.Protocol || (exports.Protocol = {}));
/**
 * Load balancing protocol for application load balancers
 */
var ApplicationProtocol;
(function (ApplicationProtocol) {
    /**
     * HTTP
     */
    ApplicationProtocol["HTTP"] = "HTTP";
    /**
     * HTTPS
     */
    ApplicationProtocol["HTTPS"] = "HTTPS";
})(ApplicationProtocol = exports.ApplicationProtocol || (exports.ApplicationProtocol = {}));
/**
 * Load balancing protocol version for application load balancers
 */
var ApplicationProtocolVersion;
(function (ApplicationProtocolVersion) {
    /**
     * GRPC
     */
    ApplicationProtocolVersion["GRPC"] = "GRPC";
    /**
     * HTTP1
     */
    ApplicationProtocolVersion["HTTP1"] = "HTTP1";
    /**
     * HTTP2
     */
    ApplicationProtocolVersion["HTTP2"] = "HTTP2";
})(ApplicationProtocolVersion = exports.ApplicationProtocolVersion || (exports.ApplicationProtocolVersion = {}));
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
var SslPolicy;
(function (SslPolicy) {
    /**
     * The recommended security policy for TLS listeners.
     * This is the default policy for listeners created using the AWS Management Console
     */
    SslPolicy["RECOMMENDED_TLS"] = "ELBSecurityPolicy-TLS13-1-2-2021-06";
    /**
     * The recommended policy for http listeners.
     * This is the default security policy for listeners created using the AWS CLI
     */
    SslPolicy["RECOMMENDED"] = "ELBSecurityPolicy-2016-08";
    /**
     * TLS1.2 and 1.3
     */
    SslPolicy["TLS13_RES"] = "ELBSecurityPolicy-TLS13-1-2-Res-2021-06";
    /**
     * TLS1.2 and 1.3 and no SHA ciphers
     */
    SslPolicy["TLS13_EXT1"] = "ELBSecurityPolicy-TLS13-1-2-Ext1-2021-06";
    /**
     * TLS1.2 and 1.3 with all ciphers
     */
    SslPolicy["TLS13_EXT2"] = "ELBSecurityPolicy-TLS13-1-2-Ext2-2021-06";
    /**
     * TLS1.0 through 1.3 with all ciphers
     */
    SslPolicy["TLS13_10"] = "ELBSecurityPolicy-TLS13-1-0-2021-06";
    /**
     * TLS1.1 through 1.3 with all ciphers
     */
    SslPolicy["TLS13_11"] = "ELBSecurityPolicy-TLS13-1-1-2021-06";
    /**
     * TLS1.3 only
     */
    SslPolicy["TLS13_13"] = "ELBSecurityPolicy-TLS13-1-3-2021-06";
    /**
     * Strong foward secrecy ciphers and TLV1.2 only (2020 edition).
     * Same as FORWARD_SECRECY_TLS12_RES, but only supports GCM versions of the TLS ciphers
     */
    SslPolicy["FORWARD_SECRECY_TLS12_RES_GCM"] = "ELBSecurityPolicy-FS-1-2-Res-2020-10";
    /**
     * Strong forward secrecy ciphers and TLS1.2 only
     */
    SslPolicy["FORWARD_SECRECY_TLS12_RES"] = "ELBSecurityPolicy-FS-1-2-Res-2019-08";
    /**
     * Forward secrecy ciphers and TLS1.2 only
     */
    SslPolicy["FORWARD_SECRECY_TLS12"] = "ELBSecurityPolicy-FS-1-2-2019-08";
    /**
     * Forward secrecy ciphers only with TLS1.1 and 1.2
     */
    SslPolicy["FORWARD_SECRECY_TLS11"] = "ELBSecurityPolicy-FS-1-1-2019-08";
    /**
     * Forward secrecy ciphers only
     */
    SslPolicy["FORWARD_SECRECY"] = "ELBSecurityPolicy-FS-2018-06";
    /**
     * TLS1.2 only and no SHA ciphers
     */
    SslPolicy["TLS12"] = "ELBSecurityPolicy-TLS-1-2-2017-01";
    /**
     * TLS1.2 only with all ciphers
     */
    SslPolicy["TLS12_EXT"] = "ELBSecurityPolicy-TLS-1-2-Ext-2018-06";
    /**
     * TLS1.1 and 1.2 with all ciphers
     */
    SslPolicy["TLS11"] = "ELBSecurityPolicy-TLS-1-1-2017-01";
    /**
     * Support for DES-CBC3-SHA
     *
     * Do not use this security policy unless you must support a legacy client
     * that requires the DES-CBC3-SHA cipher, which is a weak cipher.
     */
    SslPolicy["LEGACY"] = "ELBSecurityPolicy-TLS-1-0-2015-04";
})(SslPolicy = exports.SslPolicy || (exports.SslPolicy = {}));
/**
 * How to interpret the load balancing target identifiers
 */
var TargetType;
(function (TargetType) {
    /**
     * Targets identified by instance ID
     */
    TargetType["INSTANCE"] = "instance";
    /**
     * Targets identified by IP address
     */
    TargetType["IP"] = "ip";
    /**
     * Target is a single Lambda Function
     */
    TargetType["LAMBDA"] = "lambda";
    /**
     * Target is a single Application Load Balancer
     */
    TargetType["ALB"] = "alb";
})(TargetType = exports.TargetType || (exports.TargetType = {}));
/**
 * Application-Layer Protocol Negotiation Policies for network load balancers.
 * Which protocols should be used over a secure connection.
 */
var AlpnPolicy;
(function (AlpnPolicy) {
    /**
     * Negotiate only HTTP/1.*. The ALPN preference list is http/1.1, http/1.0
     */
    AlpnPolicy["HTTP1_ONLY"] = "HTTP1Only";
    /**
     * Negotiate only HTTP/2. The ALPN preference list is h2
     */
    AlpnPolicy["HTTP2_ONLY"] = "HTTP2Only";
    /**
     * Prefer HTTP/1.* over HTTP/2 (which can be useful for HTTP/2 testing). The ALPN preference list is http/1.1, http/1.0, h2
     */
    AlpnPolicy["HTTP2_OPTIONAL"] = "HTTP2Optional";
    /**
     * Prefer HTTP/2 over HTTP/1.*. The ALPN preference list is h2, http/1.1, http/1.0
     */
    AlpnPolicy["HTTP2_PREFERRED"] = "HTTP2Preferred";
    /**
     * Do not negotiate ALPN
     */
    AlpnPolicy["NONE"] = "None";
})(AlpnPolicy = exports.AlpnPolicy || (exports.AlpnPolicy = {}));
/**
 * Load balancing algorithmm type for target groups
 */
var TargetGroupLoadBalancingAlgorithmType;
(function (TargetGroupLoadBalancingAlgorithmType) {
    /**
     * round_robin
     */
    TargetGroupLoadBalancingAlgorithmType["ROUND_ROBIN"] = "round_robin";
    /**
     * least_outstanding_requests
     */
    TargetGroupLoadBalancingAlgorithmType["LEAST_OUTSTANDING_REQUESTS"] = "least_outstanding_requests";
})(TargetGroupLoadBalancingAlgorithmType = exports.TargetGroupLoadBalancingAlgorithmType || (exports.TargetGroupLoadBalancingAlgorithmType = {}));
/**
 * How the load balancer handles requests that might pose a security risk to your application
 *
 * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/application-load-balancers.html#desync-mitigation-mode
 */
var DesyncMitigationMode;
(function (DesyncMitigationMode) {
    /**
     * Allows all traffic
     */
    DesyncMitigationMode["MONITOR"] = "monitor";
    /**
     * Provides durable mitigation against HTTP desync while maintaining the availability of your application
     */
    DesyncMitigationMode["DEFENSIVE"] = "defensive";
    /**
     * Receives only requests that comply with RFC 7230
     */
    DesyncMitigationMode["STRICTEST"] = "strictest";
})(DesyncMitigationMode = exports.DesyncMitigationMode || (exports.DesyncMitigationMode = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW51bXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlbnVtcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQTs7R0FFRztBQUNILElBQVksYUFVWDtBQVZELFdBQVksYUFBYTtJQUN2Qjs7T0FFRztJQUNILDhCQUFhLENBQUE7SUFFYjs7T0FFRztJQUNILHlDQUF3QixDQUFBO0FBQzFCLENBQUMsRUFWVyxhQUFhLEdBQWIscUJBQWEsS0FBYixxQkFBYSxRQVV4QjtBQUVEOztHQUVHO0FBQ0gsSUFBWSxRQThCWDtBQTlCRCxXQUFZLFFBQVE7SUFDbEI7O09BRUc7SUFDSCx5QkFBYSxDQUFBO0lBRWI7O09BRUc7SUFDSCwyQkFBZSxDQUFBO0lBRWY7O09BRUc7SUFDSCx1QkFBVyxDQUFBO0lBRVg7O09BRUc7SUFDSCx1QkFBVyxDQUFBO0lBRVg7O09BRUc7SUFDSCx1QkFBVyxDQUFBO0lBRVg7O09BRUc7SUFDSCwrQkFBbUIsQ0FBQTtBQUNyQixDQUFDLEVBOUJXLFFBQVEsR0FBUixnQkFBUSxLQUFSLGdCQUFRLFFBOEJuQjtBQUVEOztHQUVHO0FBQ0gsSUFBWSxtQkFVWDtBQVZELFdBQVksbUJBQW1CO0lBQzdCOztPQUVHO0lBQ0gsb0NBQWEsQ0FBQTtJQUViOztPQUVHO0lBQ0gsc0NBQWUsQ0FBQTtBQUNqQixDQUFDLEVBVlcsbUJBQW1CLEdBQW5CLDJCQUFtQixLQUFuQiwyQkFBbUIsUUFVOUI7QUFFRDs7R0FFRztBQUNILElBQVksMEJBZVg7QUFmRCxXQUFZLDBCQUEwQjtJQUNwQzs7T0FFRztJQUNILDJDQUFhLENBQUE7SUFFYjs7T0FFRztJQUNILDZDQUFlLENBQUE7SUFFZjs7T0FFRztJQUNILDZDQUFlLENBQUE7QUFDakIsQ0FBQyxFQWZXLDBCQUEwQixHQUExQixrQ0FBMEIsS0FBMUIsa0NBQTBCLFFBZXJDO0FBRUQ7Ozs7Ozs7Ozs7OztHQVlHO0FBQ0gsSUFBWSxTQTJGWDtBQTNGRCxXQUFZLFNBQVM7SUFDbkI7OztPQUdHO0lBQ0gsb0VBQXVELENBQUE7SUFFdkQ7OztPQUdHO0lBQ0gsc0RBQXlDLENBQUE7SUFFekM7O09BRUc7SUFDSCxrRUFBcUQsQ0FBQTtJQUVyRDs7T0FFRztJQUNILG9FQUF1RCxDQUFBO0lBRXZEOztPQUVHO0lBQ0gsb0VBQXVELENBQUE7SUFFdkQ7O09BRUc7SUFDSCw2REFBZ0QsQ0FBQTtJQUVoRDs7T0FFRztJQUNILDZEQUFnRCxDQUFBO0lBRWhEOztPQUVHO0lBQ0gsNkRBQWdELENBQUE7SUFFaEQ7OztPQUdHO0lBQ0gsbUZBQXNFLENBQUE7SUFFdEU7O09BRUc7SUFDSCwrRUFBa0UsQ0FBQTtJQUVsRTs7T0FFRztJQUNILHVFQUEwRCxDQUFBO0lBRTFEOztPQUVHO0lBQ0gsdUVBQTBELENBQUE7SUFFMUQ7O09BRUc7SUFDSCw2REFBZ0QsQ0FBQTtJQUVoRDs7T0FFRztJQUNILHdEQUEyQyxDQUFBO0lBRTNDOztPQUVHO0lBQ0gsZ0VBQW1ELENBQUE7SUFFbkQ7O09BRUc7SUFDSCx3REFBMkMsQ0FBQTtJQUUzQzs7Ozs7T0FLRztJQUNILHlEQUE0QyxDQUFBO0FBQzlDLENBQUMsRUEzRlcsU0FBUyxHQUFULGlCQUFTLEtBQVQsaUJBQVMsUUEyRnBCO0FBRUQ7O0dBRUc7QUFDSCxJQUFZLFVBb0JYO0FBcEJELFdBQVksVUFBVTtJQUNwQjs7T0FFRztJQUNILG1DQUFxQixDQUFBO0lBRXJCOztPQUVHO0lBQ0gsdUJBQVMsQ0FBQTtJQUVUOztPQUVHO0lBQ0gsK0JBQWlCLENBQUE7SUFFakI7O09BRUc7SUFDSCx5QkFBVyxDQUFBO0FBQ2IsQ0FBQyxFQXBCVyxVQUFVLEdBQVYsa0JBQVUsS0FBVixrQkFBVSxRQW9CckI7QUFFRDs7O0dBR0c7QUFDSCxJQUFZLFVBeUJYO0FBekJELFdBQVksVUFBVTtJQUNwQjs7T0FFRztJQUNILHNDQUF3QixDQUFBO0lBRXhCOztPQUVHO0lBQ0gsc0NBQXdCLENBQUE7SUFFeEI7O09BRUc7SUFDSCw4Q0FBZ0MsQ0FBQTtJQUVoQzs7T0FFRztJQUNILGdEQUFrQyxDQUFBO0lBRWxDOztPQUVHO0lBQ0gsMkJBQWEsQ0FBQTtBQUNmLENBQUMsRUF6QlcsVUFBVSxHQUFWLGtCQUFVLEtBQVYsa0JBQVUsUUF5QnJCO0FBRUQ7O0dBRUc7QUFDSCxJQUFZLHFDQVVYO0FBVkQsV0FBWSxxQ0FBcUM7SUFDL0M7O09BRUc7SUFDSCxvRUFBMkIsQ0FBQTtJQUUzQjs7T0FFRztJQUNILGtHQUF5RCxDQUFBO0FBQzNELENBQUMsRUFWVyxxQ0FBcUMsR0FBckMsNkNBQXFDLEtBQXJDLDZDQUFxQyxRQVVoRDtBQUVEOzs7O0dBSUc7QUFDSCxJQUFZLG9CQWVYO0FBZkQsV0FBWSxvQkFBb0I7SUFDOUI7O09BRUc7SUFDSCwyQ0FBbUIsQ0FBQTtJQUVuQjs7T0FFRztJQUNILCtDQUF1QixDQUFBO0lBRXZCOztPQUVHO0lBQ0gsK0NBQXVCLENBQUE7QUFDekIsQ0FBQyxFQWZXLG9CQUFvQixHQUFwQiw0QkFBb0IsS0FBcEIsNEJBQW9CLFFBZS9CIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBXaGF0IGtpbmQgb2YgYWRkcmVzc2VzIHRvIGFsbG9jYXRlIHRvIHRoZSBsb2FkIGJhbGFuY2VyXG4gKi9cbmV4cG9ydCBlbnVtIElwQWRkcmVzc1R5cGUge1xuICAvKipcbiAgICogQWxsb2NhdGUgSVB2NCBhZGRyZXNzZXNcbiAgICovXG4gIElQVjQgPSAnaXB2NCcsXG5cbiAgLyoqXG4gICAqIEFsbG9jYXRlIGJvdGggSVB2NCBhbmQgSVB2NiBhZGRyZXNzZXNcbiAgICovXG4gIERVQUxfU1RBQ0sgPSAnZHVhbHN0YWNrJyxcbn1cblxuLyoqXG4gKiBCYWNrZW5kIHByb3RvY29sIGZvciBuZXR3b3JrIGxvYWQgYmFsYW5jZXJzIGFuZCBoZWFsdGggY2hlY2tzXG4gKi9cbmV4cG9ydCBlbnVtIFByb3RvY29sIHtcbiAgLyoqXG4gICAqIEhUVFAgKEFMQiBoZWFsdGggY2hlY2tzIGFuZCBOTEIgaGVhbHRoIGNoZWNrcylcbiAgICovXG4gIEhUVFAgPSAnSFRUUCcsXG5cbiAgLyoqXG4gICAqIEhUVFBTIChBTEIgaGVhbHRoIGNoZWNrcyBhbmQgTkxCIGhlYWx0aCBjaGVja3MpXG4gICAqL1xuICBIVFRQUyA9ICdIVFRQUycsXG5cbiAgLyoqXG4gICAqIFRDUCAoTkxCLCBOTEIgaGVhbHRoIGNoZWNrcylcbiAgICovXG4gIFRDUCA9ICdUQ1AnLFxuXG4gIC8qKlxuICAgKiBUTFMgKE5MQilcbiAgICovXG4gIFRMUyA9ICdUTFMnLFxuXG4gIC8qKlxuICAgKiBVRFAgKE5MQilcbiAgICovXG4gIFVEUCA9ICdVRFAnLFxuXG4gIC8qKlxuICAgKiBMaXN0ZW4gdG8gYm90aCBUQ1AgYW5kIFVEUCBvbiB0aGUgc2FtZSBwb3J0IChOTEIpXG4gICAqL1xuICBUQ1BfVURQID0gJ1RDUF9VRFAnLFxufVxuXG4vKipcbiAqIExvYWQgYmFsYW5jaW5nIHByb3RvY29sIGZvciBhcHBsaWNhdGlvbiBsb2FkIGJhbGFuY2Vyc1xuICovXG5leHBvcnQgZW51bSBBcHBsaWNhdGlvblByb3RvY29sIHtcbiAgLyoqXG4gICAqIEhUVFBcbiAgICovXG4gIEhUVFAgPSAnSFRUUCcsXG5cbiAgLyoqXG4gICAqIEhUVFBTXG4gICAqL1xuICBIVFRQUyA9ICdIVFRQUycsXG59XG5cbi8qKlxuICogTG9hZCBiYWxhbmNpbmcgcHJvdG9jb2wgdmVyc2lvbiBmb3IgYXBwbGljYXRpb24gbG9hZCBiYWxhbmNlcnNcbiAqL1xuZXhwb3J0IGVudW0gQXBwbGljYXRpb25Qcm90b2NvbFZlcnNpb24ge1xuICAvKipcbiAgICogR1JQQ1xuICAgKi9cbiAgR1JQQyA9ICdHUlBDJyxcblxuICAvKipcbiAgICogSFRUUDFcbiAgICovXG4gIEhUVFAxID0gJ0hUVFAxJyxcblxuICAvKipcbiAgICogSFRUUDJcbiAgICovXG4gIEhUVFAyID0gJ0hUVFAyJyxcbn1cblxuLyoqXG4gKiBFbGFzdGljIExvYWQgQmFsYW5jaW5nIHByb3ZpZGVzIHRoZSBmb2xsb3dpbmcgc2VjdXJpdHkgcG9saWNpZXMgZm9yIEFwcGxpY2F0aW9uIExvYWQgQmFsYW5jZXJzXG4gKlxuICogV2UgcmVjb21tZW5kIHRoZSBSZWNvbW1lbmRlZCBwb2xpY3kgZm9yIGdlbmVyYWwgdXNlLiBZb3UgY2FuXG4gKiB1c2UgdGhlIEZvcndhcmRTZWNyZWN5IHBvbGljeSBpZiB5b3UgcmVxdWlyZSBGb3J3YXJkIFNlY3JlY3lcbiAqIChGUykuXG4gKlxuICogWW91IGNhbiB1c2Ugb25lIG9mIHRoZSBUTFMgcG9saWNpZXMgdG8gbWVldCBjb21wbGlhbmNlIGFuZCBzZWN1cml0eVxuICogc3RhbmRhcmRzIHRoYXQgcmVxdWlyZSBkaXNhYmxpbmcgY2VydGFpbiBUTFMgcHJvdG9jb2wgdmVyc2lvbnMsIG9yIHRvXG4gKiBzdXBwb3J0IGxlZ2FjeSBjbGllbnRzIHRoYXQgcmVxdWlyZSBkZXByZWNhdGVkIGNpcGhlcnMuXG4gKlxuICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vZWxhc3RpY2xvYWRiYWxhbmNpbmcvbGF0ZXN0L2FwcGxpY2F0aW9uL2NyZWF0ZS1odHRwcy1saXN0ZW5lci5odG1sXG4gKi9cbmV4cG9ydCBlbnVtIFNzbFBvbGljeSB7XG4gIC8qKlxuICAgKiBUaGUgcmVjb21tZW5kZWQgc2VjdXJpdHkgcG9saWN5IGZvciBUTFMgbGlzdGVuZXJzLlxuICAgKiBUaGlzIGlzIHRoZSBkZWZhdWx0IHBvbGljeSBmb3IgbGlzdGVuZXJzIGNyZWF0ZWQgdXNpbmcgdGhlIEFXUyBNYW5hZ2VtZW50IENvbnNvbGVcbiAgICovXG4gIFJFQ09NTUVOREVEX1RMUyA9ICdFTEJTZWN1cml0eVBvbGljeS1UTFMxMy0xLTItMjAyMS0wNicsXG5cbiAgLyoqXG4gICAqIFRoZSByZWNvbW1lbmRlZCBwb2xpY3kgZm9yIGh0dHAgbGlzdGVuZXJzLlxuICAgKiBUaGlzIGlzIHRoZSBkZWZhdWx0IHNlY3VyaXR5IHBvbGljeSBmb3IgbGlzdGVuZXJzIGNyZWF0ZWQgdXNpbmcgdGhlIEFXUyBDTElcbiAgICovXG4gIFJFQ09NTUVOREVEID0gJ0VMQlNlY3VyaXR5UG9saWN5LTIwMTYtMDgnLFxuXG4gIC8qKlxuICAgKiBUTFMxLjIgYW5kIDEuM1xuICAgKi9cbiAgVExTMTNfUkVTID0gJ0VMQlNlY3VyaXR5UG9saWN5LVRMUzEzLTEtMi1SZXMtMjAyMS0wNicsXG5cbiAgLyoqXG4gICAqIFRMUzEuMiBhbmQgMS4zIGFuZCBubyBTSEEgY2lwaGVyc1xuICAgKi9cbiAgVExTMTNfRVhUMSA9ICdFTEJTZWN1cml0eVBvbGljeS1UTFMxMy0xLTItRXh0MS0yMDIxLTA2JyxcblxuICAvKipcbiAgICogVExTMS4yIGFuZCAxLjMgd2l0aCBhbGwgY2lwaGVyc1xuICAgKi9cbiAgVExTMTNfRVhUMiA9ICdFTEJTZWN1cml0eVBvbGljeS1UTFMxMy0xLTItRXh0Mi0yMDIxLTA2JyxcblxuICAvKipcbiAgICogVExTMS4wIHRocm91Z2ggMS4zIHdpdGggYWxsIGNpcGhlcnNcbiAgICovXG4gIFRMUzEzXzEwID0gJ0VMQlNlY3VyaXR5UG9saWN5LVRMUzEzLTEtMC0yMDIxLTA2JyxcblxuICAvKipcbiAgICogVExTMS4xIHRocm91Z2ggMS4zIHdpdGggYWxsIGNpcGhlcnNcbiAgICovXG4gIFRMUzEzXzExID0gJ0VMQlNlY3VyaXR5UG9saWN5LVRMUzEzLTEtMS0yMDIxLTA2JyxcblxuICAvKipcbiAgICogVExTMS4zIG9ubHlcbiAgICovXG4gIFRMUzEzXzEzID0gJ0VMQlNlY3VyaXR5UG9saWN5LVRMUzEzLTEtMy0yMDIxLTA2JyxcblxuICAvKipcbiAgICogU3Ryb25nIGZvd2FyZCBzZWNyZWN5IGNpcGhlcnMgYW5kIFRMVjEuMiBvbmx5ICgyMDIwIGVkaXRpb24pLlxuICAgKiBTYW1lIGFzIEZPUldBUkRfU0VDUkVDWV9UTFMxMl9SRVMsIGJ1dCBvbmx5IHN1cHBvcnRzIEdDTSB2ZXJzaW9ucyBvZiB0aGUgVExTIGNpcGhlcnNcbiAgICovXG4gIEZPUldBUkRfU0VDUkVDWV9UTFMxMl9SRVNfR0NNID0gJ0VMQlNlY3VyaXR5UG9saWN5LUZTLTEtMi1SZXMtMjAyMC0xMCcsXG5cbiAgLyoqXG4gICAqIFN0cm9uZyBmb3J3YXJkIHNlY3JlY3kgY2lwaGVycyBhbmQgVExTMS4yIG9ubHlcbiAgICovXG4gIEZPUldBUkRfU0VDUkVDWV9UTFMxMl9SRVMgPSAnRUxCU2VjdXJpdHlQb2xpY3ktRlMtMS0yLVJlcy0yMDE5LTA4JyxcblxuICAvKipcbiAgICogRm9yd2FyZCBzZWNyZWN5IGNpcGhlcnMgYW5kIFRMUzEuMiBvbmx5XG4gICAqL1xuICBGT1JXQVJEX1NFQ1JFQ1lfVExTMTIgPSAnRUxCU2VjdXJpdHlQb2xpY3ktRlMtMS0yLTIwMTktMDgnLFxuXG4gIC8qKlxuICAgKiBGb3J3YXJkIHNlY3JlY3kgY2lwaGVycyBvbmx5IHdpdGggVExTMS4xIGFuZCAxLjJcbiAgICovXG4gIEZPUldBUkRfU0VDUkVDWV9UTFMxMSA9ICdFTEJTZWN1cml0eVBvbGljeS1GUy0xLTEtMjAxOS0wOCcsXG5cbiAgLyoqXG4gICAqIEZvcndhcmQgc2VjcmVjeSBjaXBoZXJzIG9ubHlcbiAgICovXG4gIEZPUldBUkRfU0VDUkVDWSA9ICdFTEJTZWN1cml0eVBvbGljeS1GUy0yMDE4LTA2JyxcblxuICAvKipcbiAgICogVExTMS4yIG9ubHkgYW5kIG5vIFNIQSBjaXBoZXJzXG4gICAqL1xuICBUTFMxMiA9ICdFTEJTZWN1cml0eVBvbGljeS1UTFMtMS0yLTIwMTctMDEnLFxuXG4gIC8qKlxuICAgKiBUTFMxLjIgb25seSB3aXRoIGFsbCBjaXBoZXJzXG4gICAqL1xuICBUTFMxMl9FWFQgPSAnRUxCU2VjdXJpdHlQb2xpY3ktVExTLTEtMi1FeHQtMjAxOC0wNicsXG5cbiAgLyoqXG4gICAqIFRMUzEuMSBhbmQgMS4yIHdpdGggYWxsIGNpcGhlcnNcbiAgICovXG4gIFRMUzExID0gJ0VMQlNlY3VyaXR5UG9saWN5LVRMUy0xLTEtMjAxNy0wMScsXG5cbiAgLyoqXG4gICAqIFN1cHBvcnQgZm9yIERFUy1DQkMzLVNIQVxuICAgKlxuICAgKiBEbyBub3QgdXNlIHRoaXMgc2VjdXJpdHkgcG9saWN5IHVubGVzcyB5b3UgbXVzdCBzdXBwb3J0IGEgbGVnYWN5IGNsaWVudFxuICAgKiB0aGF0IHJlcXVpcmVzIHRoZSBERVMtQ0JDMy1TSEEgY2lwaGVyLCB3aGljaCBpcyBhIHdlYWsgY2lwaGVyLlxuICAgKi9cbiAgTEVHQUNZID0gJ0VMQlNlY3VyaXR5UG9saWN5LVRMUy0xLTAtMjAxNS0wNCcsXG59XG5cbi8qKlxuICogSG93IHRvIGludGVycHJldCB0aGUgbG9hZCBiYWxhbmNpbmcgdGFyZ2V0IGlkZW50aWZpZXJzXG4gKi9cbmV4cG9ydCBlbnVtIFRhcmdldFR5cGUge1xuICAvKipcbiAgICogVGFyZ2V0cyBpZGVudGlmaWVkIGJ5IGluc3RhbmNlIElEXG4gICAqL1xuICBJTlNUQU5DRSA9ICdpbnN0YW5jZScsXG5cbiAgLyoqXG4gICAqIFRhcmdldHMgaWRlbnRpZmllZCBieSBJUCBhZGRyZXNzXG4gICAqL1xuICBJUCA9ICdpcCcsXG5cbiAgLyoqXG4gICAqIFRhcmdldCBpcyBhIHNpbmdsZSBMYW1iZGEgRnVuY3Rpb25cbiAgICovXG4gIExBTUJEQSA9ICdsYW1iZGEnLFxuXG4gIC8qKlxuICAgKiBUYXJnZXQgaXMgYSBzaW5nbGUgQXBwbGljYXRpb24gTG9hZCBCYWxhbmNlclxuICAgKi9cbiAgQUxCID0gJ2FsYicsXG59XG5cbi8qKlxuICogQXBwbGljYXRpb24tTGF5ZXIgUHJvdG9jb2wgTmVnb3RpYXRpb24gUG9saWNpZXMgZm9yIG5ldHdvcmsgbG9hZCBiYWxhbmNlcnMuXG4gKiBXaGljaCBwcm90b2NvbHMgc2hvdWxkIGJlIHVzZWQgb3ZlciBhIHNlY3VyZSBjb25uZWN0aW9uLlxuICovXG5leHBvcnQgZW51bSBBbHBuUG9saWN5IHtcbiAgLyoqXG4gICAqIE5lZ290aWF0ZSBvbmx5IEhUVFAvMS4qLiBUaGUgQUxQTiBwcmVmZXJlbmNlIGxpc3QgaXMgaHR0cC8xLjEsIGh0dHAvMS4wXG4gICAqL1xuICBIVFRQMV9PTkxZID0gJ0hUVFAxT25seScsXG5cbiAgLyoqXG4gICAqIE5lZ290aWF0ZSBvbmx5IEhUVFAvMi4gVGhlIEFMUE4gcHJlZmVyZW5jZSBsaXN0IGlzIGgyXG4gICAqL1xuICBIVFRQMl9PTkxZID0gJ0hUVFAyT25seScsXG5cbiAgLyoqXG4gICAqIFByZWZlciBIVFRQLzEuKiBvdmVyIEhUVFAvMiAod2hpY2ggY2FuIGJlIHVzZWZ1bCBmb3IgSFRUUC8yIHRlc3RpbmcpLiBUaGUgQUxQTiBwcmVmZXJlbmNlIGxpc3QgaXMgaHR0cC8xLjEsIGh0dHAvMS4wLCBoMlxuICAgKi9cbiAgSFRUUDJfT1BUSU9OQUwgPSAnSFRUUDJPcHRpb25hbCcsXG5cbiAgLyoqXG4gICAqIFByZWZlciBIVFRQLzIgb3ZlciBIVFRQLzEuKi4gVGhlIEFMUE4gcHJlZmVyZW5jZSBsaXN0IGlzIGgyLCBodHRwLzEuMSwgaHR0cC8xLjBcbiAgICovXG4gIEhUVFAyX1BSRUZFUlJFRCA9ICdIVFRQMlByZWZlcnJlZCcsXG5cbiAgLyoqXG4gICAqIERvIG5vdCBuZWdvdGlhdGUgQUxQTlxuICAgKi9cbiAgTk9ORSA9ICdOb25lJyxcbn1cblxuLyoqXG4gKiBMb2FkIGJhbGFuY2luZyBhbGdvcml0aG1tIHR5cGUgZm9yIHRhcmdldCBncm91cHNcbiAqL1xuZXhwb3J0IGVudW0gVGFyZ2V0R3JvdXBMb2FkQmFsYW5jaW5nQWxnb3JpdGhtVHlwZSB7XG4gIC8qKlxuICAgKiByb3VuZF9yb2JpblxuICAgKi9cbiAgUk9VTkRfUk9CSU4gPSAncm91bmRfcm9iaW4nLFxuXG4gIC8qKlxuICAgKiBsZWFzdF9vdXRzdGFuZGluZ19yZXF1ZXN0c1xuICAgKi9cbiAgTEVBU1RfT1VUU1RBTkRJTkdfUkVRVUVTVFMgPSAnbGVhc3Rfb3V0c3RhbmRpbmdfcmVxdWVzdHMnLFxufVxuXG4vKipcbiAqIEhvdyB0aGUgbG9hZCBiYWxhbmNlciBoYW5kbGVzIHJlcXVlc3RzIHRoYXQgbWlnaHQgcG9zZSBhIHNlY3VyaXR5IHJpc2sgdG8geW91ciBhcHBsaWNhdGlvblxuICpcbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2VsYXN0aWNsb2FkYmFsYW5jaW5nL2xhdGVzdC9hcHBsaWNhdGlvbi9hcHBsaWNhdGlvbi1sb2FkLWJhbGFuY2Vycy5odG1sI2Rlc3luYy1taXRpZ2F0aW9uLW1vZGVcbiAqL1xuZXhwb3J0IGVudW0gRGVzeW5jTWl0aWdhdGlvbk1vZGUge1xuICAvKipcbiAgICogQWxsb3dzIGFsbCB0cmFmZmljXG4gICAqL1xuICBNT05JVE9SID0gJ21vbml0b3InLFxuXG4gIC8qKlxuICAgKiBQcm92aWRlcyBkdXJhYmxlIG1pdGlnYXRpb24gYWdhaW5zdCBIVFRQIGRlc3luYyB3aGlsZSBtYWludGFpbmluZyB0aGUgYXZhaWxhYmlsaXR5IG9mIHlvdXIgYXBwbGljYXRpb25cbiAgICovXG4gIERFRkVOU0lWRSA9ICdkZWZlbnNpdmUnLFxuXG4gIC8qKlxuICAgKiBSZWNlaXZlcyBvbmx5IHJlcXVlc3RzIHRoYXQgY29tcGx5IHdpdGggUkZDIDcyMzBcbiAgICovXG4gIFNUUklDVEVTVCA9ICdzdHJpY3Rlc3QnLFxufVxuIl19