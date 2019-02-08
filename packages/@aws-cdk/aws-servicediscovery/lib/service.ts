import cdk = require('@aws-cdk/cdk');
import { BaseInstanceProps, Instance } from './instance';
import { INamespace } from './namespace';
import { CfnService } from './servicediscovery.generated';

export enum RecordType {
  A = 'A',

  AAAA = 'AAAA',

  A_AAAA = 'A,AAAA',

  SRV = 'SRV',

  CNAME = 'CNAME',
}
export interface DnsRecord {
  /**
   * The record type.
   */
  type: RecordType;

  /**
   * The time to live for the record.
   */
  ttl: string;
}

export enum RountingPolicy {
  Weighted = 'WEIGTHED',

  Multivalue = 'MULTIVALUE',
}

export enum HealthCheckType {
  HTTP = 'HTTP',

  HTTPS = 'HTTPS',

  TCP = 'TCP',
}

export interface HealthCheckConfig {
  failureThreshold?: number;
  type: HealthCheckType;
  resourcePath?: string;
}

export interface BaseServiceProps {
  /**
   * The name of the service.
   */
  name: string;

  /**
   * The description of the service.
   */
  description?: string;

  /**
   * The routing policy to apply to all DNS records created when an instance
   * is registered.
   */
  routingPolicy?: RountingPolicy;

  /**
   * The DNS records to create when an instance is registered. Possible
   * values for type are: A, A and AAAA (A_AAAA), SRV or CNAME.
   *
   * @default one A record with TTL of 300
   */
  dnsRecord?: DnsRecord;

  /**
   * The health check configuration for the service.
   *
   * @default no health check
   */
  healthCheckConfig?: HealthCheckConfig;
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
  public readonly serviceName: string;

  /**
   * The type of DNS records uses for the service.
   */
  public readonly dnsRecordType?: RecordType;

  /**
   * The namespace to which the service belongs.
   */
  public readonly namespace: INamespace;

  constructor(scope: cdk.Construct, id: string, props: ServiceProps) {
    super(scope, id);

    if (props.namespace.httpOnly && (props.routingPolicy || props.dnsRecord)) {
      throw new Error('Cannot specify `routingPolicy` or `dnsRecord` for an HTTP only namespace.');
    }

    if (!props.namespace.httpOnly
        && props.healthCheckConfig
        && (props.healthCheckConfig.type || props.healthCheckConfig.failureThreshold)) {
      throw new Error('Cannot specify health check `type` or `failureThreshold` for a DNS namespace.');
    }

    if (props.routingPolicy === RountingPolicy.Multivalue
        && props.dnsRecord
        && props.dnsRecord.type === RecordType.CNAME) {
      throw new Error('Cannot use `CNAME` record when routing policy is `Multivalue`.');
    }

    const resource = new CfnService(this, 'Resource', {
      description: props.description,
      dnsConfig: props.namespace.httpOnly
        ? undefined
        : {
            dnsRecords: props.dnsRecord === undefined ? [{ type: RecordType.A, ttl: '300' }] : _getDnsRecords(props.dnsRecord),
            namespaceId: props.namespace.namespaceId,
            routingPolicy: props.routingPolicy
          },
      healthCheckConfig: props.namespace.httpOnly
        ? props.healthCheckConfig
        : undefined,
      healthCheckCustomConfig: props.namespace.httpOnly
        ? undefined
        : props.healthCheckConfig,
      namespaceId: props.namespace.namespaceId
    });

    this.serviceId = resource.ref;
    this.serviceArn = resource.getAtt('Arn').toString();
    this.serviceName = props.name;
    this.dnsRecordType = props.dnsRecord && props.dnsRecord.type;
    this.namespace = props.namespace;
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
  return dnsRecord.type.split(',').map(type => ({ type, ttl: dnsRecord.ttl }));
}
