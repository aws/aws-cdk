import cdk = require('@aws-cdk/cdk');
import { BaseInstanceProps, InstanceBase } from './instance';
import { NamespaceType } from './namespace';
import { DnsRecordType, IService } from './service';
import { CfnInstance } from './servicediscovery.generated';

/*
 * Properties for a CnameInstance used for service#registerCnameInstance
 */
export interface CnameInstanceBaseProps extends BaseInstanceProps {
  /**
   * If the service configuration includes a CNAME record, the domain name that you want Route 53 to
   * return in response to DNS queries, for example, example.com. This value is required if the
   * service specified by ServiceId includes settings for an CNAME record.
   */
  instanceCname: string;
}

/*
 * Properties for a CnameInstance
 */
export interface CnameInstanceProps extends CnameInstanceBaseProps {
  /**
   * The Cloudmap service this resource is registered to.
   */
  service: IService;
}

/*
 * Instance that is accessible using a domain name (CNAME).
 */
export class CnameInstance extends InstanceBase {
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
  public readonly instanceCname: string;

  constructor(scope: cdk.Construct, id: string, props: CnameInstanceProps) {
    super(scope, id);

    if (props.service.namespace.type === NamespaceType.Http) {
      throw new Error('Namespace associated with Service must be a DNS Namespace.');
    }

    if (props.service.dnsRecordType === DnsRecordType.Cname) {
      if (!props.instanceCname) {
        throw new Error('A `instanceCname` must be specified for a service using a `CNAME` record.');
      }
    }

    const resource = new CfnInstance(this, 'Resource', {
      instanceId: props.instanceId,
      serviceId: props.service.serviceId,
      instanceAttributes: {
        AWS_INSTANCE_CNAME: props.instanceCname,
        ...props.customAttributes
      }
    });

    this.service = props.service;
    this.instanceId = resource.instanceId;
    this.instanceCname = props.instanceCname;
  }
}
