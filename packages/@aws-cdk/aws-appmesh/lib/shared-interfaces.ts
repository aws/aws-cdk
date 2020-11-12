import * as cdk from '@aws-cdk/core';
import { CfnVirtualGateway, CfnVirtualNode } from './appmesh.generated';

/**
 * Enum of supported AppMesh protocols
 */
export enum Protocol {
  HTTP = 'http',
  TCP = 'tcp',
  HTTP2 = 'http2',
  GRPC = 'grpc',
}

/**
 * Properties used to define healthchecks when creating virtual nodes.
 * All values have a default if only specified as {} when creating.
 * If property not set, then no healthchecks will be defined.
 */
export interface HealthCheck {
  /**
   * Number of successful attempts before considering the node UP
   *
   * @default 2
   */
  readonly healthyThreshold?: number;

  /**
   * Interval in milliseconds to re-check
   *
   * @default 5 seconds
   */
  readonly interval?: cdk.Duration;

  /**
   * The path where the application expects any health-checks, this can also be the application path.
   *
   * @default /
   */
  readonly path?: string;

  /**
   * The TCP port number for the healthcheck
   *
   * @default - same as corresponding port mapping
   */
  readonly port?: number;

  /**
   * The protocol to use for the healthcheck, for convinience a const enum has been defined.
   * Protocol.HTTP or Protocol.TCP
   *
   * @default - same as corresponding port mapping
   */
  readonly protocol?: Protocol;

  /**
   * Timeout in milli-seconds for the healthcheck to be considered a fail.
   *
   * @default 2 seconds
   */
  readonly timeout?: cdk.Duration;

  /**
   * Number of failed attempts before considering the node DOWN.
   *
   * @default 2
   */
  readonly unhealthyThreshold?: number;
}

/**
 * All Properties for Envoy Access logs for mesh endpoints
 */
export interface AccessLogConfig {

  /**
   * VirtualNode CFN configuration for Access Logging
   *
   * @default - no access logging
   */
  readonly virtualNodeAccessLog?: CfnVirtualNode.AccessLogProperty;

  /**
   * VirtualGateway CFN configuration for Access Logging
   *
   * @default - no access logging
   */
  readonly virtualGatewayAccessLog?: CfnVirtualGateway.VirtualGatewayAccessLogProperty;
}

/**
 * Configuration for Envoy Access logs for mesh endpoints
 */
export abstract class AccessLog {
  /**
   * Path to a file to write access logs to
   *
   * @default - no file based access logging
   */
  public static fromFilePath(filePath: string): AccessLog {
    return new FileAccessLog(filePath);
  }

  /**
   * Called when the AccessLog type is initialized. Can be used to enforce
   * mutual exclusivity with future properties
   */
  public abstract bind(scope: cdk.Construct): AccessLogConfig;
}

/**
 * Configuration for Envoy Access logs for mesh endpoints
 */
class FileAccessLog extends AccessLog {
  /**
   * Path to a file to write access logs to
   *
   * @default - no file based access logging
   */
  public readonly filePath: string;

  constructor(filePath: string) {
    super();
    this.filePath = filePath;
  }

  public bind(_scope: cdk.Construct): AccessLogConfig {
    return {
      virtualNodeAccessLog: {
        file: {
          path: this.filePath,
        },
      },
      virtualGatewayAccessLog: {
        file: {
          path: this.filePath,
        },
      },
    };
  }
}

/**
 * Properties of TLS validation context
 */
export interface TLSValidationConfig {
  /**
   * Represents single validation context property
   */
  readonly tlsValidation: CfnVirtualNode.TlsValidationContextProperty;
}

/**
 * Default configuration that is applied to all backends for the virtual node.
 * Any configuration defined will be overwritten by configurations specified for a particular backend.
 */
export interface ClientPolicy {
  /**
   * Client policy for TLS
   */
  readonly tlsClientPolicy: TLSClientPolicyOptions;
}

/**
 * TLS Connections with downstream server will always be enforced if True
 */
export interface TLSClientPolicyOptions {
  /**
   * TLS enforced if True.
   *
   * @default - True
   */
  readonly enforce?: boolean;

  /**
   * TLS enforced on these ports. If not specified it is enforced on all ports.
   *
   * @default - none
   */
  readonly ports?: number[];

  /**
   * Policy used to determine if the TLS certificate the server presents is accepted
   *
   * @default - none
   */
  readonly validation: TLSClientValidation;
}

/**
 * Defines the TLS validation context trust.
 */
export abstract class TLSClientValidation {
  /**
   * TLS validation context trust for a local file
   */
  public static fileTrust(props: FileTrustOptions): TLSClientValidation {
    return new FileTrust(props);
  }

  /**
   * TLS validation context trust for AWS Certicate Manager (ACM) certificate.
   */
  public static acmTrust(props: ACMTrustOptions): TLSClientValidation {
    return new ACMTrust(props);
  }

  /**
   * Returns Trust context based on trust type.
   */
  public abstract bind(scope: cdk.Construct): TLSValidationConfig;
}

/**
 * ACM Trust Properties
 */
export interface ACMTrustOptions {
  /**
   * Amazon Resource Names (ARN) of trusted ACM Private Certificate Authorities
   */
  readonly certificateAuthorityArns: string[];
}

/**
 * File Trust Properties
 */
export interface FileTrustOptions {
  /**
   * Path to the Certificate Chain file on the file system where the Envoy is deployed.
   */
  readonly certificateChain: string;
}

/**
 * Represents a Transport Layer Security (TLS) validation context trust for a local file
 */
export class FileTrust extends TLSClientValidation {
  /**
   * Path to the Certificate Chain file on the file system where the Envoy is deployed.
   */
  readonly certificateChain: string;

  constructor(props: FileTrustOptions) {
    super();
    this.certificateChain = props.certificateChain;
  }

  public bind(_scope: cdk.Construct): TLSValidationConfig {
    return {
      tlsValidation: {
        trust: {
          file: {
            certificateChain: this.certificateChain,
          },
        },
      },
    };
  }
}

/**
 * Represents a TLS validation context trust for an AWS Certicate Manager (ACM) certificate.
 */
export class ACMTrust extends TLSClientValidation {
  /**
   * Amazon Resource Name of the Certificates
   */
  readonly certificateAuthorityArns: string[];

  constructor(props: ACMTrustOptions) {
    super();
    this.certificateAuthorityArns = props.certificateAuthorityArns;
  }

  public bind(_scope: cdk.Construct): TLSValidationConfig {
    return {
      tlsValidation: {
        trust: {
          acm: {
            certificateAuthorityArns: this.certificateAuthorityArns,
          },
        },
      },
    };
  }
}