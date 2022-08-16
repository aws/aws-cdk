import { Construct } from 'constructs';
import { BaseInstanceProps, InstanceBase } from './instance';
import { defaultDiscoveryType } from './private/utils';
import { IService, DiscoveryType } from './service';
import { CfnInstance } from './servicediscovery.generated';

export interface NonIpInstanceBaseProps extends BaseInstanceProps {
}

/*
 * Properties for a NonIpInstance
 */
export interface NonIpInstanceProps extends NonIpInstanceBaseProps {
  /**
   * The Cloudmap service this resource is registered to.
   */
  readonly service: IService;
}

/**
 * Instance accessible using values other than an IP address or a domain name (CNAME).
 * Specify the other values in Custom attributes.
 *
 * @resource AWS::ServiceDiscovery::Instance
 */
export class NonIpInstance extends InstanceBase {
  /**
   * The Id of the instance
   */
  public readonly instanceId: string;

  /**
   * The Cloudmap service to which the instance is registered.
   */
  public readonly service: IService;

  constructor(scope: Construct, id: string, props: NonIpInstanceProps) {
    super(scope, id);

    const discoveryType = props.service.discoveryType || defaultDiscoveryType(props.service.namespace);
    if (discoveryType !== DiscoveryType.API) {
      throw new Error('This type of instance can only be registered for HTTP namespaces.');
    }

    if (props.customAttributes === undefined || Object.keys(props.customAttributes).length === 0) {
      throw new Error('You must specify at least one custom attribute for this instance type.');
    }

    const resource = new CfnInstance(this, 'Resource', {
      instanceId: props.instanceId || this.uniqueInstanceId(),
      serviceId: props.service.serviceId,
      instanceAttributes: {
        ...props.customAttributes,
      },
    });

    this.service = props.service;
    this.instanceId = resource.ref;
  }
}
