/**
 * HTTP/HTTPS methods
 */
export enum Protocol {
  HTTP = 'HTTP',
  HTTPS = 'HTTPS',
}

/**
 * Supported Endpoints for targets
 */
export enum TargetType {
  LAMBDA = 'LAMBDA',
  IP = 'IP',
  INSTANCE = 'INSTANCE',
  ALB = 'ALB'
}

/**
 * Fixed reponse codes
 */
export enum FixedResponse {
  NOT_FOUND = 404,
  OK = 200
}

/**
 * HTTP Methods
 */
export enum HTTPMethods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

/**
 * Operators for Matches
 */
export enum MatchOperator {
  CONTAINS = 'CONTAINS',
  EXACT = 'EXACT',
  PREFIX = 'PREFIX'
}

/**
 * Operators for Path Matches
 */
export enum PathMatchType {
  EXACT = 'EXACT',
  PREFIX = 'PREFIX'
}
/**
 * Ip Address Types
 */
export enum IpAddressType {
  IPV4 = 'ipv4',
  IPV6 = 'ipv6'
}

/**
 * Protococol Versions
 */
export enum ProtocolVersion {
  HTTP1 = 'HTTP1',
  HTTP2 = 'HTTP2',
  GRPC = 'GRPC'
}
/**
 * Allows Actions
 */
export enum Effect {
  ALLOW = 'Allow',
  DENY = 'Deny'
}