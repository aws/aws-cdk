import { Construct } from 'constructs';
import { BaseInstanceProps, InstanceBase } from './instance';
import { NamespaceType } from './namespace';
import { DnsRecordType, IService } from './service';
import { CfnInstance } from './servicediscovery.generated';
import { ValidationError } from '../../core';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';

/*
 * Properties for a CnameInstance used for service#registerCnameInstance
 */
export interface CnameInstanceBaseProps extends BaseInstanceProps {
  /**
   * If the service configuration includes a CNAME record, the domain name that you want Route 53 to
   * return in response to DNS queries, for example, example.com. This value is required if the
   * service specified by ServiceId includes settings for an CNAME record.
   */
  readonly instanceCname: string;
}

/*
 * Properties for a CnameInstance
 */
export interface CnameInstanceProps extends CnameInstanceBaseProps {
  /**
   * The Cloudmap service this resource is registered to.
   */
  readonly service: IService;
}

/**
 * Instance that is accessible using a domain name (CNAME).
 * @resource AWS::ServiceDiscovery::Instance
 */
@propertyInjectable
export class CnameInstance extends InstanceBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-servicediscovery.CnameInstance';
  /**
   * The Id of the instance
   */
  public readonly instanceId: string;

  /**
   * The Cloudmap service to which the instance is registered.
   */
  public readonly service: IService;

  /**
   * The domain name returned by DNS queries for the instance
   */
  public readonly cname: string;

  constructor(scope: Construct, id: string, props: CnameInstanceProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    if (props.service.namespace.type === NamespaceType.HTTP) {
      throw new ValidationError('Namespace associated with Service must be a DNS Namespace.', this);
    }

    if (props.service.dnsRecordType !== DnsRecordType.CNAME) {
      throw new ValidationError('A `CnameIntance` can only be used with a service using a `CNAME` record.', this);
    }

    const resource = new CfnInstance(this, 'Resource', {
      instanceId: props.instanceId || this.uniqueInstanceId(),
      serviceId: props.service.serviceId,
      instanceAttributes: {
        AWS_INSTANCE_CNAME: props.instanceCname,
        ...props.customAttributes,
      },
    });

    this.service = props.service;
    this.instanceId = resource.ref;
    this.cname = props.instanceCname;
  }
}
