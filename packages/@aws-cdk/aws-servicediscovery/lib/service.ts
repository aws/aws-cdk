import cdk = require('@aws-cdk/cdk');
import { BaseInstanceProps, Instance } from './instance';
import { INamespace } from './namespace';
import { CfnService } from './servicediscovery.generated';

export enum RecordType {
  /**
   * An A record.
   */
  A = 'A',

  /**
   * An AAAA record.
   */
  AAAA = 'AAAA',

  /**
   * Both A and AAAA records.
   */
  A_AAAA = 'A,AAAA',

  /**
   * A SRV record.
   */
  SRV = 'SRV',

  /**
   * A CNAME record.
   */
  CNAME = 'CNAME',
}
export interface DnsRecord {
  /**
   * The record type.
   */
  type: RecordType;

  /**
   * The time to live for the record.
   *
   * @default 60
   */
  ttl?: string;
}

export enum RoutingPolicy {
  /**
   * Route 53 returns the applicable value from one randomly selected instance.
   */
  Weighted = 'WEIGHTED',

  /**
   * Route 53 returns the applicable value for up to eight instances.
   */
  Multivalue = 'MULTIVALUE',
}

export enum HealthCheckType {
  /**
   * Route 53 tries to establish a TCP connection.
   * If successful, Route 53 submits an HTTP request and waits
   * for an HTTP status code of 200 or greater and less than 400.
   */
  HTTP = 'HTTP',

  /**
   * Route 53 tries to establish a TCP connection.
   * If successful, Route 53 submits an HTTPS request and waits
   * for an HTTP status code of 200 or greater and less than 400.
   */
  HTTPS = 'HTTPS',

  /**
   * Route 53 tries to establish a TCP connection.
   */
  TCP = 'TCP',
}

export interface HealthCheckCustomConfig {
  /**
   * The number of consecutive health checks that an endpoint must pass or fail
   * for Route 53 to change the current status of the endpoint from unhealthy
   * to healthy or vice versa.
   *
   * @default 1
   */
  failureThreshold?: number;
}

export interface HealthCheckConfig extends HealthCheckCustomConfig {
  /**
   * The type of health check
   *
   * @default HTTP
   */
  type?: HealthCheckType;

  /**
   * The path that you want Route 53 to request when performing health checks.
   * Cannot be specfied when type is TCP.
   *
   * @default The path '/'
   */
  resourcePath?: string;
}
export interface BaseServiceProps {
  /**
   * The name of the service.
   *
   * @default A CloudFormation generated name
   */
  name?: string;

  /**
   * The description of the service.
   *
   * @default No description
   */
  description?: string;

  /**
   * The routing policy to apply to all DNS records created when an instance
   * is registered.
   *
   * @default Weighted for CNAME, Multivalue otherwise
   */
  routingPolicy?: RoutingPolicy;

  /**
   * The DNS records to create when an instance is registered. Possible
   * values for type are: A, A and AAAA (A_AAAA), SRV or CNAME.
   *
   * @default one A record with TTL of 60
   */
  dnsRecord?: DnsRecord;

  /**
   * The health check configuration for the service (only for a HTTP only namespace).
   * Either healthCheckConfig or healthCheckCustomConfig can be specified.
   *
   * @default no health check
   */
  healthCheckConfig?: HealthCheckConfig;

  /**
   * The custom health check configuration for the service. Either
   * healthCheckConfig or healthCheckCustomConfig can be specified.
   *
   * @default no custom health check
   */
  healthCheckCustomConfig?: HealthCheckConfig;
}

export interface ServiceProps extends BaseServiceProps {
  /**
   * The namespace where the service is created.
   */
  namespace: INamespace
}

export class Service extends cdk.Construct {
  /**
   * The id of the service resource.
   */
  public readonly serviceId: string;

  /**
   * The ARN of the service resource.
   */
  public readonly serviceArn: string;

  /**
   * The name of the service resource.
   */
  public readonly serviceName?: string;

  /**
   * The type of DNS records uses for the service.
   */
  public readonly dnsRecordType?: RecordType;

  /**
   * The namespace to which the service belongs.
   */
  public readonly namespace: INamespace;

  /**
   * The DNS name of the service
   */
  public readonly serviceDnsName?: string;

  constructor(scope: cdk.Construct, id: string, props: ServiceProps) {
    super(scope, id);

    if (props.namespace.httpOnly && (props.routingPolicy || props.dnsRecord)) {
      throw new Error('Cannot specify `routingPolicy` or `dnsRecord` for an HTTP only namespace.');
    }

    if (props.healthCheckConfig && props.healthCheckCustomConfig) {
      throw new Error('Cannot specify both `healthCheckConfig` and `healthCheckCustomConfig`.');
    }

    if (props.healthCheckConfig && !props.namespace.httpOnly) {
      throw new Error('Cannot specify `healthCheckConfig` for a DNS namespace.');
    }

    if (props.routingPolicy === RoutingPolicy.Multivalue
        && props.dnsRecord
        && props.dnsRecord.type === RecordType.CNAME) {
      throw new Error('Cannot use `CNAME` record when routing policy is `Multivalue`.');
    }

    if (props.healthCheckConfig
        && props.healthCheckConfig.type === HealthCheckType.TCP
        && props.healthCheckConfig.resourcePath) {
          throw new Error('Cannot specify `resourcePath` when using a `TCP` health check.');
    }

    const defaultRoutingPolicy = props.dnsRecord && props.dnsRecord.type === RecordType.CNAME
      ? RoutingPolicy.Weighted
      : RoutingPolicy.Multivalue;

    const defaultFailureThreshold = 1;

    const defaultHealthCheckCustomConfig = {
      failureThreshold: defaultFailureThreshold
    };

    const defaultHealthCheckConfig = {
      type: HealthCheckType.HTTP,
      failureThreshold: defaultFailureThreshold,
      resourcePath: props.healthCheckConfig && props.healthCheckConfig.type !== HealthCheckType.TCP
        ? '/'
        : undefined
    };

    const resource = new CfnService(this, 'Resource', {
      name: props.name,
      description: props.description,
      dnsConfig: props.namespace.httpOnly
        ? undefined
        : {
            dnsRecords: props.dnsRecord === undefined
              ? [{ type: RecordType.A, ttl: '60' }]
              : _getDnsRecords(props.dnsRecord),
            namespaceId: props.namespace.namespaceId,
            routingPolicy: props.routingPolicy || defaultRoutingPolicy
          },
      healthCheckConfig: props.healthCheckConfig
        ? { ...defaultHealthCheckConfig, ...props.healthCheckConfig }
        : undefined,
      healthCheckCustomConfig: props.healthCheckCustomConfig
        ? { ...defaultHealthCheckCustomConfig, ...props.healthCheckCustomConfig }
        : undefined,
      namespaceId: props.namespace.namespaceId
    });

    this.serviceId = resource.serviceId;
    this.serviceArn = resource.serviceArn;
    this.serviceName = resource.serviceName;
    this.dnsRecordType = props.dnsRecord && props.dnsRecord.type;
    this.namespace = props.namespace;
    this.serviceDnsName = !props.namespace.httpOnly && props.namespace.namespaceName
      ? `${this.serviceName}.${props.namespace.namespaceName}`
      : undefined;
  }

  /**
   * Registers a new instance in this service.
   */
  public registerInstance(id: string, props: BaseInstanceProps): Instance {
    return new Instance(this, id, {
      service: this,
      ...props
    });
  }
}

function _getDnsRecords(dnsRecord: DnsRecord) {
  return dnsRecord.type.split(',').map(type => ({ type, ttl: dnsRecord.ttl || '60' }));
}
