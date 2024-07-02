/**
 * AuthTypes
 */
export enum AuthType {
  /**
   * No Authorization
   */
  NONE = 'NONE',
  /**
   * Use IAM Policy as
   */
  AWS_IAM = 'AWS_IAM'
}

/**
 * HTTP/HTTPS methods
 */
export enum Protocol {
  /**
   * HTTP Protocol
   */
  HTTP = 'HTTP',
  /**
   * HTTPS Protocol
   */
  HTTPS = 'HTTPS',
}

/**
 * Fixed response codes
 */
export enum FixedResponse {
  /**
   * Not Found 404
   */
  NOT_FOUND = 404,
  /**
   * OK 200
   */
  OK = 200
}

/**
 * HTTP Methods
 */
export enum HTTPMethods {
  /**
   * GET Method
   */
  GET = 'GET',
  /**
   * POST Method
   */
  POST = 'POST',
  /**
   * PUT Method
   */
  PUT = 'PUT',
  /**
   * Delete Method
   */
  DELETE = 'DELETE',
}

/**
 * Operators for Matches
 */
export enum MatchOperator {
  /**
   * Contains Match
   */
  CONTAINS = 'CONTAINS',
  /**
   * Exact Match
   */
  EXACT = 'EXACT',
  /**
   * Prefix Match
   */
  PREFIX = 'PREFIX'
}

/**
 * Operators for Path Matches
 */
export enum PathMatchType {
  /**
   * Exact Match
   */
  EXACT = 'EXACT',
  /**
   * Prefix Match
   */
  PREFIX = 'PREFIX'
}
/**
 * Ip Address Types
 */
// export enum IpAddressType {
//   /**
//    * IPv4
//    */
//   IPV4 = 'ipv4',
//   /**
//    * Ipv6
//    */
//   IPV6 = 'ipv6'
// }

/**
 * Protococol Versions
 */
// export enum ProtocolVersion {
//   /**
//    * HTTP1
//    */
//   HTTP1 = 'HTTP1',
//   /**
//    * HTTP2
//    */
//   HTTP2 = 'HTTP2',
//   /**
//    * GRPC
//    */
//   GRPC = 'GRPC'
// }
/**
 * Allows Actions
 */