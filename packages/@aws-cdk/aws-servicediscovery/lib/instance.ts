import route53 = require('@aws-cdk/aws-route53');
import cdk = require('@aws-cdk/cdk');
import { INamespace } from './namespace';
import { RecordType, Service } from './service';
import { CfnInstance } from './servicediscovery.generated';

export interface InstanceAttributes {
  /**
   * The load balancer for which a Route 53 alias record must be created.
   */
  loadBalancer?: route53.IAliasRecordTarget;

  /**
   * The domain name for which a Route 53 CNAME record must be created.
   */
  domainName?: string;

  /**
   * The IPv4 address of the instance.
   */
  ipv4?: string;

  /**
   * The IPv6 address of the instance.
   */
  ipv6?: string;

  /**
   * The port of the instance.
   */
  port?: string;

  /**
   * Custom attributes of the instance.
   */
  customAttributes?: object;
}

export interface BaseInstanceProps {
  /**
   * The instance id.
   */
  instanceId: string;

  /**
   * The instance attributes.
   */
  instanceAttributes: InstanceAttributes
}

export interface InstanceProps extends BaseInstanceProps {
  /**
   * The service in which the instance is registered.
   */
  service: Service;
}

export class Instance extends cdk.Construct {
  /**
   * The id of the instance resource.
   */
  public readonly instanceId: string;

  /**
   * The service to which the instance is registered.
   */
  public readonly service: Service;

  /**
   * The namespace to which the instance service belongs.
   */
  public readonly namespace: INamespace;

  constructor(scope: cdk.Construct, id: string, props: InstanceProps) {
    super(scope, id);

    const customAttributes = props.instanceAttributes.customAttributes || {};

    const resource = new CfnInstance(this, 'Resource', {
      instanceAttributes: { ...customAttributes, ..._getStandardAttributes(props) },
      instanceId: props.instanceId,
      serviceId: props.service.serviceId,
    });

    this.instanceId = resource.ref;
    this.service = props.service;
    this.namespace = props.service.namespace;
  }
}

/**
 * Validates instance attributes and returns standard attributes based on the namespace/service type.
 *
 * @param props instance props
 * @throws if the instance attributes are invalid
 */
function _getStandardAttributes(props: InstanceProps): object {
  if (props.instanceAttributes.loadBalancer && props.instanceAttributes.domainName) {
    throw new Error('Cannot specify both `loadBalancer` and `domainName`.');
  }

  if (props.service.namespace.httpOnly) {
    if (props.instanceAttributes.loadBalancer || props.instanceAttributes.domainName) {
      throw new Error('Cannot specify `loadBalancer` or `domainName` for an HTTP only namespace.');
    }

    return {
      AWS_INSTANCE_IPV4: props.instanceAttributes.ipv4,
      AWS_INSTANCE_IPV6: props.instanceAttributes.ipv6,
      AWS_INSTANCE_PORT: props.instanceAttributes.port
    };
  }

  if (props.service.dnsRecordType === RecordType.CNAME) {
    if (!props.instanceAttributes.domainName) {
      throw new Error('A `domainName` must be specified for a service using a `CNAME` record.');
    }

    return {
      AWS_INSTANCE_CNAME: props.instanceAttributes.domainName
    };
  }

  if (props.service.dnsRecordType === RecordType.SRV) {
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

  if (props.instanceAttributes.loadBalancer) {
    if (props.instanceAttributes.ipv4 || props.instanceAttributes.ipv6 || props.instanceAttributes.port) {
      throw new Error('Cannot specify `ipv4`, `ipv6` or `port` when specifying `loadBalancer`.');
    }

    return {
      AWS_ALIAS_DNS_NAME: props.instanceAttributes.loadBalancer.asAliasRecordTarget().dnsName
    };
  }

  if (!props.instanceAttributes.ipv4 && (props.service.dnsRecordType === RecordType.A || props.service.dnsRecordType === RecordType.A_AAAA)) {
    throw new Error('An `ipv4` must be specified for a service using a `A` record.');
  }

  if (!props.instanceAttributes.ipv6 && (props.service.dnsRecordType === RecordType.AAAA || props.service.dnsRecordType === RecordType.A_AAAA)) {
    throw new Error('An `ipv6` must be specified for a service using a `AAAA` record.');
  }

  return {
    AWS_INSTANCE_IPV4: props.instanceAttributes.ipv4,
    AWS_INSTANCE_IPV6: props.instanceAttributes.ipv6,
    AWS_INSTANCE_PORT: props.instanceAttributes.port
  };
}
