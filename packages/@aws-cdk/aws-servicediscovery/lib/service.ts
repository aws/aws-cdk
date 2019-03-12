import route53 = require('@aws-cdk/aws-route53');
import cdk = require('@aws-cdk/cdk');
import { AliasTargetInstance } from './alias-target-instance';
import { CnameInstance, CnameInstanceBaseProps  } from './cname-instance';
import { IInstance } from './instance';
import { IpInstance, IpInstanceBaseProps } from './ip-instance';
import { INamespace, NamespaceType } from './namespace';
import { NonIpInstance, NonIpInstanceBaseProps } from './non-ip-instance';
import { CfnService } from './servicediscovery.generated';

export interface IService extends cdk.IConstruct {
  /**
   * A name for the Cloudmap Service.
   */
  readonly serviceName: string;

  /**
   *  The namespace for the Cloudmap Service.
   */
  readonly namespace: INamespace;

  /**
   * The ID of the namespace that you want to use for DNS configuration.
   */
  readonly serviceId: string;

  /**
   * The Arn of the namespace that you want to use for DNS configuration.
   */
  readonly serviceArn: string;

  /**
   * The DnsRecordType used by the service
   */
  readonly dnsRecordType: DnsRecordType;

  /**
   * The Routing Policy used by the service
   */
  readonly routingPolicy: RoutingPolicy;
}

/**
 * Basic props needed to create a service in a given namespace. Used by HttpNamespace.createService
 */
export interface BaseServiceProps {
  /**
   * A name for the Service.
   *
   * @default CloudFormation-generated name
   */
  name?: string;

  /**
   * A description of the service.
   *
   * @default none
   */
  description?: string;

  /**
   * Structure containing failure threshold for a custom health checker.
   * Only one of healthCheckConfig or healthCheckCustomConfig can be specified.
   * See: https://docs.aws.amazon.com/cloud-map/latest/api/API_HealthCheckCustomConfig.html
   *
   * @default none
   */
  customHealthCheck?: HealthCheckCustomConfig;
}

/**
 * Service props needed to create a service in a given namespace. Used by createService() for PrivateDnsNamespace and
 * PublicDnsNamespace
 */
export interface DnsServiceProps extends BaseServiceProps {
  /**
   * The DNS type of the record that you want AWS Cloud Map to create. Supported record types
   * include A, AAAA, A and AAAA (A_AAAA), CNAME, and SRV.
   *
   * @default A
   */
  dnsRecordType?: DnsRecordType;

  /**
   * The amount of time, in seconds, that you want DNS resolvers to cache the settings for this
   * record.
   *
   * @default 60
   */
  dnsTtlSec?: number;

  /**
   * Settings for an optional health check.  If you specify health check settings, AWS Cloud Map associates the
   * health check with the records that you specify in DnsConfig. Public DNS namespaces only. Only one of
   * healthCheckConfig or healthCheckCustomConfig can be specified.
   *
   * @default none
   */
  healthCheck?: HealthCheckConfig;

  /**
   * The routing policy that you want to apply to all DNS records that AWS Cloud Map creates when you
   * register an instance and specify this service.
   *
   * @default WEIGHTED for CNAME records, MULTIVALUE otherwise
   */
  routingPolicy?: RoutingPolicy;

  /**
   * Whether or not this service will have an Elastic LoadBalancer registered to it as an AliasTargetInstance
   *
   * @default false
   */
  loadBalancer?: boolean;
}

export interface ServiceProps extends DnsServiceProps {
  /**
   * The ID of the namespace that you want to use for DNS configuration.
   */
  namespace: INamespace;
}

/**
 * Define a CloudMap Service
 */
export class Service extends cdk.Construct implements IService {
  /**
   * A name for the Cloudmap Service.
   */
  public readonly serviceName: string;

  /**
   *  The namespace for the Cloudmap Service.
   */
  public readonly namespace: INamespace;

  /**
   * The ID of the namespace that you want to use for DNS configuration.
   */
  public readonly serviceId: string;

  /**
   * The Arn of the namespace that you want to use for DNS configuration.
   */
  public readonly serviceArn: string;

  /**
   * The DnsRecordType used by the service
   */
  public readonly dnsRecordType: DnsRecordType;

  /**
   * The Routing Policy used by the service
   */
  public readonly routingPolicy: RoutingPolicy;

  constructor(scope: cdk.Construct, id: string, props: ServiceProps) {
    super(scope, id);

    const namespaceType = props.namespace.type;

    // Validations
    if (namespaceType === NamespaceType.Http && (props.routingPolicy || props.dnsRecordType)) {
      throw new Error('Cannot specify `routingPolicy` or `dnsRecord` when using an HTTP namespace.');
    }

    if (props.healthCheck && props.customHealthCheck) {
      throw new Error('Cannot specify both `healthCheckConfig` and `healthCheckCustomConfig`.');
    }

    if (namespaceType !== NamespaceType.DnsPublic && props.healthCheck) {
      throw new Error('Can only use `healthCheckConfig` for a Public DNS namespace.');
    }

    if (props.routingPolicy === RoutingPolicy.Multivalue
        && props.dnsRecordType === DnsRecordType.CNAME) {
      throw new Error('Cannot use `CNAME` record when routing policy is `Multivalue`.');
    }

    if (props.routingPolicy === RoutingPolicy.Multivalue
        && props.loadBalancer) {
      throw new Error('Cannot register loadbalancers when routing policy is `Multivalue`.');
    }

    if (props.healthCheck
        && props.healthCheck.type === HealthCheckType.Tcp
        && props.healthCheck.resourcePath) {
          throw new Error('Cannot specify `resourcePath` when using a `TCP` health check.');
    }

    // Set defaults where necessary
    const routingPolicy = (props.dnsRecordType === DnsRecordType.CNAME) || props.loadBalancer
      ? RoutingPolicy.Weighted
      : RoutingPolicy.Multivalue;

    const dnsRecordType = props.dnsRecordType || DnsRecordType.A;

    if (props.loadBalancer
      && (!(dnsRecordType === DnsRecordType.A
        || dnsRecordType === DnsRecordType.AAAA
        || dnsRecordType === DnsRecordType.A_AAAA))) {
      throw new Error('Must support `A` or `AAAA` records to register loadbalancers.');
    }

    const dnsConfig = props.namespace.type === NamespaceType.Http
      ? undefined
      : {
          dnsRecords: renderDnsRecords(dnsRecordType, props.dnsTtlSec),
          namespaceId: props.namespace.namespaceId,
          routingPolicy,
        };

    const healthCheckConfigDefaults = {
      type: HealthCheckType.Http,
      failureThreshold: 1,
      resourcePath: props.healthCheck && props.healthCheck.type !== HealthCheckType.Tcp
        ? '/'
        : undefined
    };

    const healthCheckConfig = props.healthCheck && { ...healthCheckConfigDefaults, ...props.healthCheck };
    const healthCheckCustomConfig = props.customHealthCheck;

    // Create service
    const service = new CfnService(this, 'Resource', {
      name: props.name,
      description: props.description,
      dnsConfig,
      healthCheckConfig,
      healthCheckCustomConfig,
      namespaceId: props.namespace.namespaceId
    });

    this.serviceName = service.serviceName;
    this.serviceArn = service.serviceArn;
    this.serviceId = service.serviceId;
    this.namespace = props.namespace;
    this.dnsRecordType = dnsRecordType;
    this.routingPolicy = routingPolicy;
  }

  /**
   * Registers an ELB as a new instance with unique name instanceId in this service.
   */
  public registerLoadBalancer(loadBalancer: route53.IAliasRecordTarget, customAttributes?: {[key: string]: string}): IInstance {
    return new AliasTargetInstance(this, "Loadbalancer", {
      service: this,
      dnsName: loadBalancer.asAliasRecordTarget().dnsName,
      customAttributes
    });
  }

  /**
   * Registers a resource that is accessible using values other than an IP address or a domain name (CNAME).
   */
  public registerNonIpInstance(props: NonIpInstanceBaseProps): IInstance {
    return new NonIpInstance(this, "NonIpInstance", {
      service: this,
      instanceId: props.instanceId,
      customAttributes: props.customAttributes
    });
  }

  /**
   * Registers a resource that is accessible using an IP address.
   */
  public registerIpInstance(props: IpInstanceBaseProps): IInstance {
    return new IpInstance(this, "IpInstance", {
      service: this,
      instanceId: props.instanceId,
      ipv4: props.ipv4,
      ipv6: props.ipv6,
      port: props.port,
      customAttributes: props.customAttributes
    });
  }

  /**
   * Registers a resource that is accessible using a CNAME.
   */
  public registerCnameInstance(props: CnameInstanceBaseProps): IInstance {
    return new CnameInstance(this, "CnameInstance", {
      service: this,
      instanceId: props.instanceId,
      instanceCname: props.instanceCname,
      customAttributes: props.customAttributes
    });
  }
}

function renderDnsRecords(dnsRecordType: DnsRecordType, dnsTtlSec?: number): DnsRecord[] {
  const ttl = dnsTtlSec !== undefined ? dnsTtlSec.toString() : '60';

  if (dnsRecordType === DnsRecordType.A_AAAA) {
    return [{
      type: DnsRecordType.A,
      ttl
    }, {
      type: DnsRecordType.AAAA,
      ttl,
    }];
  } else {
    return [{ type: dnsRecordType, ttl }];
  }
}

/**
 * An optional complex type that contains information about the DNS records that you want AWS Cloud Map to create when
 * you register an instance.
 */
export interface DnsConfig {
  /**
   * List of DNS record that you want AWS Cloud Map to create when you register an instance.
   */
  dnsRecords: DnsRecord[];

  /**
   * The ID of the namespace that you want to use for DNS configuration.
   */
  namespaceId: string;

  /**
   * The routing policy that you want to apply to all Route 53 DNS records that AWS Cloud Map creates when you
   * register an instance and specify this service.
   */
  routingPolicy?: RoutingPolicy;
}

/**
 * Settings for one DNS record that you want AWS Cloud Map to create when you register an instance.
 */
export interface DnsRecord {
  /**
   * The record type
   */
  type: DnsRecordType;

  /**
   * The time to live for the record
   */
  ttl: string;
}

/**
 * Settings for an optional Amazon Route 53 health check. If you specify settings for a health check, AWS Cloud Map
 * associates the health check with all the records that you specify in DnsConfig. Only valid with a PublicDnsNamespace.
 */
export interface HealthCheckConfig {
  /**
   * The type of health check that you want to create, which indicates how Route 53 determines whether an endpoint is
   * healthy. Cannot be modified once created. Supported values are HTTP, HTTPS, and TCP.
   *
   * @default HTTP
   */
  type?: HealthCheckType;

  /**
   * The path that you want Route 53 to request when performing health checks. Do not use when health check type is TCP.
   *
   * @default '/'
   */
  resourcePath?: string;

  /**
   * The number of consecutive health checks that an endpoint must pass or fail for Route 53 to change the current
   * status of the endpoint from unhealthy to healthy or vice versa.
   *
   * @default 1
   */
  failureThreshold?: number;
}

/**
 * Specifies information about an optional custom health check.
 */
export interface HealthCheckCustomConfig {
  /**
   * The number of 30-second intervals that you want Cloud Map to wait after receiving an
   * UpdateInstanceCustomHealthStatus request before it changes the health status of a service instance.
   *
   * @default 1
   */
  failureThreshold?: number;
}

export enum DnsRecordType {
  /**
   * An A record
   */
  A = "A",

  /**
   * An AAAA record
   */
  AAAA = "AAAA",

  /**
   * Both an A and AAAA record
   */
  A_AAAA = "A, AAAA",

  /**
   * A Srv record
   */
  SRV = "SRV",

  /**
   * A CNAME record
   */
  CNAME = "CNAME",
}

export enum RoutingPolicy {
  /**
   * Route 53 returns the applicable value from one randomly selected instance from among the instances that you
   * registered using the same service.
   */
  Weighted = "WEIGHTED",

  /**
   * If you define a health check for the service and the health check is healthy, Route 53 returns the applicable value
   * for up to eight instances.
   */
  Multivalue = "MULTIVALUE",
}

export enum HealthCheckType {
  /**
   * Route 53 tries to establish a TCP connection. If successful, Route 53 submits an HTTP request and waits for an HTTP
   * status code of 200 or greater and less than 400.
   */
  Http = "HTTP",

  /**
   * Route 53 tries to establish a TCP connection. If successful, Route 53 submits an HTTPS request and waits for an
   * HTTP status code of 200 or greater and less than 400.  If you specify HTTPS for the value of Type, the endpoint
   * must support TLS v1.0 or later.
   */
  Https = "HTTPS",

  /**
   * Route 53 tries to establish a TCP connection.
   * If you specify TCP for Type, don't specify a value for ResourcePath.
   */
  Tcp = "TCP",
}
