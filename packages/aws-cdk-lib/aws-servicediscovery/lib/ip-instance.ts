import { Construct } from 'constructs';
import { BaseInstanceProps, InstanceBase } from './instance';
import { DnsRecordType, IService } from './service';
import { CfnInstance } from './servicediscovery.generated';

/*
 * Properties for a IpInstance used for service#registerIpInstance
 */
export interface IpInstanceBaseProps extends BaseInstanceProps {
  /**
   * The port on the endpoint that you want AWS Cloud Map to perform health checks on. This value is also used for
   * the port value in an SRV record if the service that you specify includes an SRV record. You can also specify a
   * default port that is applied to all instances in the Service configuration.
   *
   * @default 80
   */
  readonly port?: number;

  /**
   *  If the service that you specify contains a template for an A record, the IPv4 address that you want AWS Cloud
   *  Map to use for the value of the A record.
   *
   * @default none
   */
  readonly ipv4?: string;

  /**
   *  If the service that you specify contains a template for an AAAA record, the IPv6 address that you want AWS Cloud
   *  Map to use for the value of the AAAA record.
   *
   * @default none
   */
  readonly ipv6?: string;
}

/*
 * Properties for an IpInstance
 */
export interface IpInstanceProps extends IpInstanceBaseProps {
  /**
   * The Cloudmap service this resource is registered to.
   */
  readonly service: IService;
}

/**
 * Instance that is accessible using an IP address.
 *
 * @resource AWS::ServiceDiscovery::Instance
 */
export class IpInstance extends InstanceBase {
  /**
   * The Id of the instance
   */
  public readonly instanceId: string;

  /**
   * The Cloudmap service to which the instance is registered.
   */
  public readonly service: IService;

  /**
   * The Ipv4 address of the instance, or blank string if none available
   */
  public readonly ipv4: string;

  /**
   * The Ipv6 address of the instance, or blank string if none available
   */
  public readonly ipv6: string;

  /**
   * The exposed port of the instance
   */
  public readonly port: number;

  constructor(scope: Construct, id: string, props: IpInstanceProps) {
    super(scope, id);
    const dnsRecordType = props.service.dnsRecordType;

    if (dnsRecordType === DnsRecordType.CNAME) {
      throw new Error('Service must support `A`, `AAAA` or `SRV` records to register this instance type.');
    }
    if (dnsRecordType === DnsRecordType.SRV) {
      if (!props.port) {
        throw new Error('A `port` must be specified for a service using a `SRV` record.');
      }

      if (!props.ipv4 && !props.ipv6) {
        throw new Error('At least `ipv4` or `ipv6` must be specified for a service using a `SRV` record.');
      }
    }

    if (!props.ipv4 && (dnsRecordType === DnsRecordType.A || dnsRecordType === DnsRecordType.A_AAAA)) {
      throw new Error('An `ipv4` must be specified for a service using a `A` record.');
    }

    if (!props.ipv6 &&
      (dnsRecordType === DnsRecordType.AAAA || dnsRecordType === DnsRecordType.A_AAAA)) {
      throw new Error('An `ipv6` must be specified for a service using a `AAAA` record.');
    }

    const port = props.port || 80;

    const resource = new CfnInstance(this, 'Resource', {
      instanceAttributes: {
        AWS_INSTANCE_IPV4: props.ipv4,
        AWS_INSTANCE_IPV6: props.ipv6,
        AWS_INSTANCE_PORT: port.toString(),
        ...props.customAttributes,
      },
      instanceId: props.instanceId || this.uniqueInstanceId(),
      serviceId: props.service.serviceId,
    });

    this.service = props.service;
    this.instanceId = resource.ref;
    this.ipv4 = props.ipv4 || '';
    this.ipv6 = props.ipv6 || '';
    this.port = port;
  }
}
