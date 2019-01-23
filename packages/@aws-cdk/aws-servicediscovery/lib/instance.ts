import cdk = require('@aws-cdk/cdk');
import { NamespaceType } from './namespace';
import { DnsRecordType, Service } from './service';
import { CfnInstance } from './servicediscovery.generated';

/**
 * Properties to define ServiceDiscovery Instance
 */
export interface InstanceProps {
  /**
   * The instance attributes.
   * FIXME: add defaults/validations
   */
  instanceAttributes: InstanceAttributes

  /**
   * The id of the instance resource
   */
  instanceId: string;

  /**
   * The Cloudmap service this resource is registered to.
   */
  service: Service;
}

/**
 * Define a Service Discovery Instance
 */
export class Instance extends cdk.Construct {
  /**
   * The Id of the instance
   */
  public readonly instanceId: string;
  /**
   * The Cloudmap service to which the instance is registered.
   */
  public readonly service: Service;

  constructor(scope: cdk.Construct, id: string, props: InstanceProps) {
    super(scope, id);

    const customAttributes = props.instanceAttributes.customAttributes || {};

    const resource = new CfnInstance(this, 'Resource', {
      instanceAttributes: { ...customAttributes, ...getInstanceAttributes(props) },
      instanceId: props.instanceId,
      serviceId: props.service.serviceId
    });

    this.service = props.service;
    this.instanceId = resource.instanceId;
  }
}

// NOTE: These are the 5 that seem to be supported in cloudformation, but the API docs indicate that you can also
// specify custom attributes. Not sure if CFN would support these? In the generated L1s instance attributes appears to
// just be an object.
export interface InstanceAttributes {
  /**
   * If you want AWS Cloud Map to create an Amazon Route 53 alias record that routes traffic to an Elastic Load
   * Balancing load balancer, specify the DNS name that is associated with the load balancer.
   */
  aliasDnsName?: string,

  /**
   * If the service configuration includes a CNAME record, the domain name that you want Route 53 to return in
   * response to DNS queries, for example, example.com. This value is required if the service specified by ServiceId
   * includes settings for an CNAME record.
   */
  instanceCname?: string,

  /** The port on the endpoint that you want AWS Cloud Map to perform health checks on. This value is also used for
   * the port value in an SRV record if the service that you specify includes an SRV record. You can also specify a
   * default port that is applied to all instances in the Service configuration.
   */
  port?: string,
  /**
   *  If the service that you specify contains a template for an A record, the IPv4 address that you want AWS Cloud
   *  Map to use for the value of the A record.
   */
  ipv4?: string,
  /**
   *  If the service that you specify contains a template for an AAAA record, the IPv6 address that you want AWS Cloud
   *  Map to use for the value of the AAAA record.
   */
  ipv6?: string,

  /**
   * Custom attributes of the instance.
   */
  customAttributes?: object;
}

/**
 * Validates instance attributes and returns standard attributes based on the namespace/service type.
 *
 * @param props instance props
 * @throws if the instance attributes are invalid
 */
function getInstanceAttributes(props: InstanceProps): object {
  if (props.instanceAttributes.aliasDnsName && props.instanceAttributes.instanceCname) {
    throw new Error('Cannot specify both `aliasDnsName` and `instanceCname`.');
  }

  if (props.service.namespace.type === NamespaceType.Http) {
    if (props.instanceAttributes.aliasDnsName  || props.instanceAttributes.instanceCname) {
      throw new Error('Cannot specify `aliasDnsName` or `instanceCname` for an HTTP namespace.');
    }

    return {
      AWS_INSTANCE_IPV4: props.instanceAttributes.ipv4,
      AWS_INSTANCE_IPV6: props.instanceAttributes.ipv6,
      AWS_INSTANCE_PORT: props.instanceAttributes.port
    };
  }

  if (props.service.dnsRecordType === DnsRecordType.Cname) {
    if (!props.instanceAttributes.instanceCname) {
      throw new Error('A `instanceCname` must be specified for a service using a `CNAME` record.');
    }

    return {
      AWS_INSTANCE_CNAME: props.instanceAttributes.instanceCname
    };
  }

  if (props.service.dnsRecordType === DnsRecordType.Srv) {
    if (!props.instanceAttributes.port) {
      throw new Error('A `port` must be specified for a service using a `SRV` record.');
    }

    if (!props.instanceAttributes.ipv4 && !props.instanceAttributes.ipv6) {
      throw new Error('At least `ipv4` or `ipv6` must be specified for a service using a `SRV` record.');
    }

    return {
      AWS_INSTANCE_IPV4: props.instanceAttributes.ipv4,
      AWS_INSTANCE_IPV6: props.instanceAttributes.ipv6,
      AWS_INSTANCE_PORT: props.instanceAttributes.port
    };
  }

  if (props.instanceAttributes.aliasDnsName) {
    if (props.instanceAttributes.ipv4 || props.instanceAttributes.ipv6 || props.instanceAttributes.port) {
      throw new Error('Cannot specify `ipv4`, `ipv6` or `port` when specifying `aliasDnsName`.');
    }

    return {
      AWS_ALIAS_DNS_NAME: props.instanceAttributes.aliasDnsName
    };
  }

  if (!props.instanceAttributes.ipv4 && (props.service.dnsRecordType === DnsRecordType.A || props.service.dnsRecordType === DnsRecordType.A_AAAA)) {
    throw new Error('An `ipv4` must be specified for a service using a `A` record.');
  }

  if (!props.instanceAttributes.ipv6 &&
    (props.service.dnsRecordType === DnsRecordType.AAAA || props.service.dnsRecordType === DnsRecordType.A_AAAA)) {
    throw new Error('An `ipv6` must be specified for a service using a `AAAA` record.');
  }

  return {
    AWS_INSTANCE_IPV4: props.instanceAttributes.ipv4,
    AWS_INSTANCE_IPV6: props.instanceAttributes.ipv6,
    AWS_INSTANCE_PORT: props.instanceAttributes.port
  };
}
