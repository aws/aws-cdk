import { Construct } from 'constructs';
import { CfnHealthCheck } from './route53.generated';
import { Duration, IResource, Resource } from '../../core';

/**
 * Imported or created health check
 */
export interface IHealthCheck extends IResource {
  /**
   * The ID of the health check.
   *
   * @attribute
   */
  readonly healthCheckId: string;
}

/**
 * The type of health check to be associated with the record.
 */
export enum HealthCheckType {
  /**
   * HTTP health check
   *
   * Route 53 tries to establish a TCP connection. If successful, Route 53 submits an HTTP request and waits for an HTTP status code of 200 or greater and less than 400.
   */
  HTTP = 'HTTP',

  /**
   * HTTPS health check
   *
   * Route 53 tries to establish a TCP connection. If successful, Route 53 submits an HTTPS request and waits for an HTTP status code of 200 or greater and less than 400.
   */
  HTTPS = 'HTTPS',

  /**
   * HTTP health check with string matching
   *
   * Route 53 tries to establish a TCP connection. If successful, Route 53 submits an HTTP request and searches the first 5,120 bytes of the response body for the string that you specify in SearchString.
   */
  HTTP_STR_MATCH = 'HTTP_STR_MATCH',

  /**
   * HTTPS health check with string matching
   *
   * Route 53 tries to establish a TCP connection. If successful, Route 53 submits an HTTPS request and searches the first 5,120 bytes of the response body for the string that you specify in SearchString.
   */
  HTTPS_STR_MATCH = 'HTTPS_STR_MATCH',

  /**
   * TCP health check
   *
   * Route 53 tries to establish a TCP connection.
   */
  TCP = 'TCP',

  /**
   * CloudWatch metric health check
   *
   * The health check is associated with a CloudWatch alarm. If the state of the alarm is OK, the health check is considered healthy. If the state is ALARM, the health check is considered unhealthy. If CloudWatch doesn't have sufficient data to determine whether the state is OK or ALARM, the health check status depends on the setting for InsufficientDataHealthStatus: Healthy, Unhealthy, or LastKnownStatus.
   */
  CLOUDWATCH_METRIC = 'CLOUDWATCH_METRIC',

  /**
   * Calculated health check
   *
   * For health checks that monitor the status of other health checks, Route 53 adds up the number of health checks that Route 53 health checkers consider to be healthy and compares that number with the value of HealthThreshold.
   */
  CALCULATED = 'CALCULATED',

  /**
   * Recovery control health check
   *
   * The health check is assocated with a Route53 Application Recovery Controller routing control. If the routing control state is ON, the health check is considered healthy. If the state is OFF, the health check is considered unhealthy.
   */
  RECOVERY_CONTROL = 'RECOVERY_CONTROL',
}

/**
 * Properties for a new health check.
 */
export interface HealthCheckProps {
  /**
   * The type of health check to be associated with the record.
   */
  readonly type: HealthCheckType;

  /**
   * CloudWatch alarm that you want Amazon Route 53 health checkers to use to determine whether the specified health check is healthy.
   *
   * @default - if the type is CLOUDWATCH_METRIC, this property is required. Otherwise, it is not configured.
   */
  readonly alarmIdentifier?: AlarmIdentifier;

  /**
   * A list of health checks to monitor for this 'CALCULATED' health check.
   *
   * @default - if the type is CALCULATED, this property is required. Otherwise, it is not configured.
   */
  readonly childHealthChecks?: IHealthCheck[];

  /**
   * Specify whether you want Amazon Route 53 to send the value of FullyQualifiedDomainName to the endpoint in the client_hello message during TLS negotiation. This allows the endpoint to respond to HTTPS health check requests with the applicable SSL/TLS certificate.
   *
   * @default - if the type is HTTPS or HTTPS_STR_MATCH, this property default value is true. Otherwise, it is not configured.
   */
  readonly enableSNI?: boolean;

  /**
   * The number of consecutive health checks that an endpoint must pass or fail for Amazon Route 53 to change the current status of the endpoint from unhealthy to healthy or vice versa.
   *
   * @default - if the type is CALCULATED it's not configured
   * - if the type is CLOUDWATCH_METRIC it's not configured
   * - otherwise, the default value is 3.
   */
  readonly failureThreshold?: number;

  /**
   * Fully qualified domain name of the endpoint to be checked.
   *
   * Amazon Route 53 behavior depends on whether you specify a value for IPAddress.
   *
   * If you specify a value for IPAddress:
   *
   * Amazon Route 53 sends health check requests to the specified IPv4 or IPv6 address and passes the value of FullyQualifiedDomainName in the Host header for all health checks except TCP health checks. This is typically the fully qualified DNS name of the endpoint on which you want Route 53 to perform health checks.
   * Note: If you specify a value for Port property other than 80 or 443, Route 53 will constract the value for Host header as FullyQualifiedDomainName:Port.
   *
   * If you don't specify a value for IPAddress:
   *
   * Route 53 sends a DNS request to the domain that you specify for FullyQualifiedDomainName at the interval that you specify for RequestInterval. Using an IPv4 address that DNS returns, Route 53 then checks the health of the endpoint.
   *
   * Additionally, if the type of the health check is HTTP, HTTPS, HTTP_STR_MATCH, or HTTPS_STR_MATCH, Route 53 passes the value of FullyQualifiedDomainName in the Host header, as it does when you specify value for IPAddress. If the type is TCP, Route 53 doesn't pass a Host header.
   *
   * @default - not configured
   */
  readonly fqdn?: string;

  /**
   * The number of child health checks that are associated with a CALCULATED health that Amazon Route 53 must consider healthy for the CALCULATED health check to be considered healthy.
   *
   * @default - if the type is CALCULATED, the default value is number of child health checks. Otherwise, it is not configured.
   */
  readonly healthThreshold?: number;

  /**
   * The status of the health check when CloudWatch has insufficient data about the state of associated alarm.
   *
   * @default - if the type is CLOUDWATCH_METRIC, the default value is InsufficientDataHealthStatus.LAST_KNOWN_STATUS. Otherwise, it is not configured.
   */
  readonly insufficientDataHealthStatus?: InsufficientDataHealthStatusEnum;

  /**
   * Specify whether you want Amazon Route 53 to invert the status of a health check, so a health check that would normally be considered unhealthy is considered healthy, and vice versa.
   *
   * @default false
   */
  readonly inverted?: boolean;

  /**
   * The IPv4 or IPv6 IP address for the endpoint that you want Amazon Route 53 to perform health checks on. If you don't specify a value for IPAddress, Route 53 sends a DNS request to resolve the domain name that you specify in FullyQualifiedDomainName at the interval that you specify in RequestInterval. Using an IPv4 address that DNS returns, Route 53 then checks the health of the endpoint.
   *
   * @default - not configured
   */
  readonly ipAddress?: string;

  /**
   * Specify whether you want Amazon Route 53 to measure the latency between health checkers in multiple AWS regions and your endpoint, and to display CloudWatch latency graphs on the Health Checks page in the Route 53 console.
   *
   * @default - if the type is CALCULATED it's not configured
   * - if the type is CLOUDWATCH_METRIC it's not configured
   * - otherwise, the default value is false.
   */
  readonly measureLatency?: boolean;

  /**
   * The port on the endpoint that you want Amazon Route 53 to perform health checks on.
   *
   * @default - if the type is HTTP or HTTP_STR_MATCH, the default value is 80.
   * - if the type is HTTPS or HTTPS_STR_MATCH, the default value is 443.
   * - otherwise, it is not configured.
   */
  readonly port?: number;

  /**
   * An array of region identifiers that you want Amazon Route 53 health checkers to check the health of the endpoint from.
   *
   * Please refer to the CloudFormation documentation for the most up-to-date list of regions. @see https://docs.aws.amazon.com/Route53/latest/APIReference/API_HealthCheckConfig.html
   *
   * @default - if the type is CALCULATED, CLOUDWATCH_METRIC, or RECOVERY_CONTROL, this property is not configured.
   * - otherwise, the default value will be set by CloudFormation itself and will include all valid regions. Please refer to the CloudFormation documentation for the most up-to-date list of regions.
   */
  readonly regions?: string[];

  /**
   * The duration between the time that Amazon Route 53 gets a response from your endpoint and the time that it sends the next health check request. Each Route 53 health checker makes requests at this interval.
   *
   * @default - if the type is CALCULATED it's not configured
   * - if the type is CLOUDWATCH_METRIC it's not configured
   * - otherwise, the default value is 30 seconds.
   */
  readonly requestInterval?: Duration;

  /**
   * The path that you want Amazon Route 53 to request when performing health checks. The path can be any value for which your endpoint will return an HTTP status code of 2xx or 3xx when the endpoint is healthy, for example the file /docs/route53-health-check.html. Route 53 automatically adds the DNS name for the service and a leading forward slash (/) character.
   *
   * @default - if the type is HTTP, HTTPS, HTTP_STR_MATCH, or HTTPS_STR_MATCH, the default value is empty string.
   * - otherwise, it is not configured.
   */
  readonly resourcePath?: string;

  /**
   * The Amazon Resource Name (ARN) of the Route 53 Application Recovery Controller routing control that you want Amazon Route 53 health checkers to use to determine whether the specified health check is healthy.
   *
   * @default - if the type is RECOVERY_CONTROL, this property is required. Otherwise, it is not configured.
   */
  readonly routingControl?: string;

  /**
   * The string that you want Amazon Route 53 to search for in the response body from the specified resource. If the string appears in the response body, Route 53 considers the resource healthy.
   *
   * Route 53 considers case when searching for SearchString in the response body.
   *
   * @default - if the type is HTTP_STR_MATCH or HTTPS_STR_MATCH, this property is required. Otherwise, it is not configured.
   */
  readonly searchString?: string;
}

/**
 * Amazon Route 53 health checks monitor the health and performance of your web applications, web servers, and other resources. Each health check that you create can monitor one of the following:
 * - The health of a resource, such as a web server,
 * - The status of other health checks, and
 * - The CloudWatch alarm that you specify,
 * - The status of an Amazon Route 53 routing control.
 */
export class HealthCheck extends Resource implements IHealthCheck {
  /**
   * Import an existing health check into this CDK app.
   *
   * @param scope The parent creating construct (usually `this`).
   * @param id The construct's name.
   * @param healthCheckId ID of the health check.
   * @returns a reference to the existing health check.
   */
  public static fromHealthCheckId(scope: Construct, id: string, healthCheckId: string): IHealthCheck {
    class Import extends Resource implements IHealthCheck {
      public readonly healthCheckId = healthCheckId;
    }

    return new Import(scope, id);
  }

  public readonly healthCheckId: string;

  /**
   * Creates a new health check.
   *
   * @param scope The parent creating construct (usually `this`).
   * @param id The construct's name.
   * @param props the properties of the new health check.
   * @returns a reference to the newly created health check.
   */
  constructor(scope: Construct, id: string, props: HealthCheckProps) {
    super(scope, id);

    const resource = new CfnHealthCheck(this, 'Resource', {
      healthCheckConfig: {
        type: props.type,
        alarmIdentifier: props.alarmIdentifier,
        childHealthChecks: props.childHealthChecks?.map((childHealthCheck) => childHealthCheck.healthCheckId),
        enableSni: props.enableSNI ?? getDefaultEnableSNIForType(props.type),
        failureThreshold: props.failureThreshold ?? getDefaultFailureThresholdForType(props.type),
        fullyQualifiedDomainName: props.fqdn,
        healthThreshold: props.healthThreshold ?? getDefaultHealthThresholdForType(props),
        insufficientDataHealthStatus: props.insufficientDataHealthStatus ?? getDefaultInsufficientDataHealthStatusForType(props.type),
        inverted: props.inverted ?? false,
        ipAddress: props.ipAddress,
        measureLatency: props.measureLatency ?? getDefaultMeasureLatencyForType(props.type),
        port: props.port ?? getDefaultPortForType(props.type),
        regions: props.regions,
        requestInterval: props.requestInterval?.toSeconds() ?? getDefaultRequestIntervalForType(props.type)?.toSeconds(),
        resourcePath: props.resourcePath ?? getDefaultResourcePathForType(props.type),
        routingControlArn: props.routingControl,
        searchString: props.searchString,
      },
    });

    this.healthCheckId = resource.ref;
  }
}

function getDefaultResourcePathForType(type: HealthCheckType): string | undefined {
  switch (type) {
    case HealthCheckType.HTTP:
    case HealthCheckType.HTTP_STR_MATCH:
    case HealthCheckType.HTTPS:
    case HealthCheckType.HTTPS_STR_MATCH:
      return '';
    default:
      return undefined;
  }
}

function getDefaultInsufficientDataHealthStatusForType(type: HealthCheckType): InsufficientDataHealthStatusEnum | undefined {
  if (type === HealthCheckType.CLOUDWATCH_METRIC) {
    return InsufficientDataHealthStatusEnum.LAST_KNOWN_STATUS;
  }

  return undefined;
}

function getDefaultMeasureLatencyForType(type: HealthCheckType): boolean | undefined {
  switch (type) {
    case HealthCheckType.CALCULATED:
    case HealthCheckType.CLOUDWATCH_METRIC:
      return undefined;
    default:
      return false;
  }
}

function getDefaultHealthThresholdForType(props: HealthCheckProps): number | undefined {
  if (props.type === HealthCheckType.CALCULATED) {
    return props.childHealthChecks!.length;
  }

  return undefined;
}

function getDefaultFailureThresholdForType(type: HealthCheckType): number | undefined {
  switch (type) {
    case HealthCheckType.CALCULATED:
    case HealthCheckType.CLOUDWATCH_METRIC:
      return undefined;
    default:
      return 3;
  }
}

function getDefaultRequestIntervalForType(type: HealthCheckType): Duration | undefined {
  switch (type) {
    case HealthCheckType.CALCULATED:
    case HealthCheckType.CLOUDWATCH_METRIC:
      return undefined;
    default:
      return Duration.seconds(30);
  }
}

function getDefaultEnableSNIForType(type: HealthCheckType): boolean | undefined {
  switch (type) {
    case HealthCheckType.HTTPS:
    case HealthCheckType.HTTPS_STR_MATCH:
      return true;
    default:
      return undefined;
  }
}

function getDefaultPortForType(type: HealthCheckType): number | undefined {
  switch (type) {
    case HealthCheckType.HTTP:
    case HealthCheckType.HTTP_STR_MATCH:
      return 80;
    case HealthCheckType.HTTPS:
    case HealthCheckType.HTTPS_STR_MATCH:
      return 443;
    default:
      return undefined;
  }
}

/**
 * The status of the health check when CloudWatch has insufficient data about the state of associated alarm.
 */
export enum InsufficientDataHealthStatusEnum {
  /**
   * Route 53 health check status will be healthy.
   */
  HEALTHY = 'Healthy',

  /**
   * Route 53 health check status will be unhealthy.
   */
  UNHEALTHY = 'Unhealthy',

  /**
   * Route 53 health check status will be the status of the health check before Route 53 had insufficient data.
   */
  LAST_KNOWN_STATUS = 'LastKnownStatus',
}

/**
 * A CloudWatch alarm that you want Amazon Route 53 health checker to use to determine whether this health check is healthy.
 */
export interface AlarmIdentifier {
  /**
   * The region of the CloudWatch alarm that you want Amazon Route 53 health checkers to use to determine whether this health check is healthy.
   */
  readonly region: string;

  /**
   * The name of the CloudWatch alarm that you want Amazon Route 53 health checkers to use to determine whether this health check is healthy.
   */
  readonly name: string;
}
